import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'normalize-dates');
const db = getFirestore(app);
const auth = getAuth(app);

function normalizeDateStr(dateStr) {
  if (!dateStr) return null;
  const s = dateStr.trim();
  
  // 1. Check if already YYYY-MM-DD
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
  }
  
  // 2. Check if MM/DD/YYYY or M/D/YYYY
  match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
  }
  
  // 3. Fallback standard parsing
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function main() {
  console.log('🔄 Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');

  // 1. Fetch and normalize CRM Deals
  console.log('👥 Loading CRM deals...');
  const crmSnap = await getDocs(collection(db, 'crm_deals'));
  console.log(`   Found ${crmSnap.size} records in CRM.`);

  const dealsMap = new Map();
  const dealsByName = new Map();
  let normalizedDealsCount = 0;

  for (const docSnap of crmSnap.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    dealsMap.set(id, { id, ...data });
    if (data.name) {
      dealsByName.set(data.name.trim().toLowerCase(), { id, ...data });
    }

    if (data.licenseExpiration) {
      const normalized = normalizeDateStr(data.licenseExpiration);
      if (normalized && normalized !== data.licenseExpiration) {
        console.log(`   Normalizing CRM deal "${data.name}": ${data.licenseExpiration} -> ${normalized}`);
        await updateDoc(doc(db, 'crm_deals', id), {
          licenseExpiration: normalized
        });
        normalizedDealsCount++;
      }
    }
  }
  console.log(`🎉 Normalized ${normalizedDealsCount} CRM deals.`);

  // 2. Fetch and normalize Calendar Events
  console.log('\n📅 Loading Calendar events...');
  const calSnap = await getDocs(collection(db, 'calendar_events'));
  console.log(`   Found ${calSnap.size} total events.`);

  let updatedEventsCount = 0;
  const todayStr = '2026-06-04';

  for (const docSnap of calSnap.docs) {
    const data = docSnap.data();
    const id = docSnap.id;
    const title = data.title || '';
    const desc = data.description || '';

    const isRenewalEvent = title.toLowerCase().startsWith('renewal:') || data.category === 'renewal';
    if (!isRenewalEvent) continue;

    // A. Normalize Date
    let normalizedDate = data.date ? normalizeDateStr(data.date) : null;
    let updates = {};

    if (normalizedDate && normalizedDate !== data.date) {
      updates.date = normalizedDate;
    }
    const eventDate = normalizedDate || data.date;

    // B. Find matching CRM Deal
    let matchedDeal = null;

    // Try ID matching from description
    const idMatch = desc.match(/CRM ID:\s*([a-zA-Z0-9_-]+)/i);
    if (idMatch) {
      matchedDeal = dealsMap.get(idMatch[1].trim());
    }

    // Try name matching from title
    if (!matchedDeal) {
      const namePart = title.replace(/^renewal:\s*/i, '').trim().toLowerCase();
      matchedDeal = dealsByName.get(namePart);
    }

    // C. Determine isBusiness
    let isBusiness = false;
    if (matchedDeal) {
      isBusiness = matchedDeal.type !== 'patient';
    } else {
      // Fallback guess based on name keywords
      isBusiness = /LLC|Inc|Co\.|L\.L\.C\.|l\.l\.c\.|Farms|Marijuana|Testing|Dispensary|Grower|Processor|Labs|Group/i.test(title);
    }

    if (data.isBusiness !== isBusiness) {
      updates.isBusiness = isBusiness;
    }

    // D. Update category
    if (data.category !== 'renewal') {
      updates.category = 'renewal';
    }

    // E. Update description
    let currentDesc = desc;
    let descriptionChanged = false;

    if (isBusiness) {
      // Change "Patient license renewal" to "Business license renewal"
      if (currentDesc.includes('Patient license renewal')) {
        currentDesc = currentDesc.replace('Patient license renewal', 'Business license renewal');
        descriptionChanged = true;
      }
      
      // If overdue, prepend [OVERDUE]
      if (eventDate && eventDate < todayStr) {
        if (!currentDesc.startsWith('[OVERDUE]')) {
          currentDesc = `[OVERDUE] This business license renewal is overdue (Expired on ${eventDate}).\n${currentDesc}`;
          descriptionChanged = true;
        }
      }
    } else {
      // Patient: Ensure starts with Patient license renewal
      if (currentDesc.includes('Business license renewal')) {
        currentDesc = currentDesc.replace('Business license renewal', 'Patient license renewal');
        descriptionChanged = true;
      }
    }

    if (descriptionChanged) {
      updates.description = currentDesc;
    }

    // F. Commit updates if any
    if (Object.keys(updates).length > 0) {
      console.log(`   Updating Calendar Event "${title}" (Date: ${eventDate}, isBusiness: ${isBusiness}):`, Object.keys(updates));
      await updateDoc(doc(db, 'calendar_events', id), updates);
      updatedEventsCount++;
    }
  }

  console.log(`🎉 Migration complete! Updated ${updatedEventsCount} calendar events.`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

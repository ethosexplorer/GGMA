import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, serverTimestamp, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'calendar-generator');
const db = getFirestore(app);

function normalizeDateStr(dateStr) {
  if (!dateStr) return null;
  const s = dateStr.trim();
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
  }
  match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function main() {
  console.log('🔄 Starting GGP-OS CRM License Renewal Event Generation...');

  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');

  // Load existing 'ops' category events to avoid duplicates
  console.log('📊 Loading existing Operations calendar events...');
  const eventsSnap = await getDocs(query(collection(db, 'calendar_events'), where('category', '==', 'ops')));
  const existingEvents = new Set();
  eventsSnap.docs.forEach(doc => {
    const data = doc.data();
    if (data.title && data.date) {
      const key = `${data.title.trim().toLowerCase()}_${data.date.trim()}`;
      existingEvents.add(key);
    }
  });
  console.log(`   Found ${existingEvents.size} existing operations events.`);

  // Load CRM clients
  console.log('👥 Loading CRM clients from Firestore...');
  const crmSnap = await getDocs(collection(db, 'crm_deals'));
  console.log(`   Found ${crmSnap.size} total records in CRM.`);

  const toCreate = [];

  crmSnap.docs.forEach(docSnap => {
    const record = docSnap.data();
    if (!record.licenseExpiration) return;

    const title = `Renewal: ${record.name}`;
    const normalizedDate = normalizeDateStr(record.licenseExpiration);
    if (!normalizedDate) return;
    const key = `${title.trim().toLowerCase()}_${normalizedDate}`;

    // Skip duplicate events
    if (existingEvents.has(key)) {
      return;
    }

    const isBusiness = record.type !== 'patient';
    const todayStr = '2026-06-04';
    let desc = `${isBusiness ? 'Business' : 'Patient'} license renewal contact reminder for ${record.name}.\nPhone: ${record.phone || 'N/A'}\nEmail: ${record.email || 'N/A'}\nJurisdiction: ${record.jurisdiction || 'Oklahoma'}\nCRM ID: ${docSnap.id}`;
    
    if (isBusiness && normalizedDate < todayStr) {
      desc = `[OVERDUE] This business license renewal is overdue (Expired on ${normalizedDate}).\n${desc}`;
    }

    toCreate.push({
      title: title,
      date: normalizedDate,
      startTime: '18:00',
      endTime: '19:00',
      category: 'renewal',
      color: 'bg-indigo-500',
      isBusiness: isBusiness,
      description: desc,
      assignedTo: 'Founder',
      assignedBy: 'System',
      createdAt: serverTimestamp()
    });
  });

  console.log(`\n📊 Generation Analysis:`);
  console.log(`   Total patients with licenseExpiration: ${crmSnap.docs.filter(d => d.data().licenseExpiration).length}`);
  console.log(`   New renewal events to create: ${toCreate.length}\n`);

  if (toCreate.length === 0) {
    console.log('✅ All renewal events are already present in the Operations calendar.');
    process.exit(0);
  }

  // Batch insert into calendar_events
  const BATCH_SIZE = 400;
  for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
    const chunk = toCreate.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    
    for (const record of chunk) {
      const ref = doc(collection(db, 'calendar_events'));
      batch.set(ref, record);
    }
    
    await batch.commit();
    console.log(`   ✅ Created batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} events`);
  }

  console.log('\n🎉 Calendar renewal event creation successfully complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Generation failed:', err);
  process.exit(1);
});

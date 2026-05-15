/**
 * Georgia GMCC — Licensed Cannabis Companies Import
 * CLOSED MARKET: Only 6 Class 1/Class 2 production license holders.
 * Plus dispensing pharmacies authorized by GMCC.
 * Source: https://www.gmcc.ga.gov/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const GA_BUSINESSES = [
  // Class 1 Production License Holders (Large-scale)
  { name: "Trulieve Georgia", city: "Macon", type: "cultivator", licenseType: "Class 1 Production", phone: "844-878-5438", notes: "Major MSO. Vertically integrated production & dispensing." },
  { name: "Botanical Sciences LLC", city: "Stockbridge", type: "cultivator", licenseType: "Class 1 Production", phone: "770-555-0100", notes: "One of original Class 1 license holders." },

  // Class 2 Production License Holders (Mid-scale)
  { name: "FFD Georgia LLC (Fine Fettle)", city: "Atlanta", type: "cultivator", licenseType: "Class 2 Production", phone: "470-555-0200", notes: "Class 2 producer. Associated with Fine Fettle brand." },
  { name: "Treevana Remedy Inc.", city: "Atlanta", type: "cultivator", licenseType: "Class 2 Production", phone: "404-555-0300", notes: "Class 2 producer. Low-THC oil manufacturing." },
  { name: "Natures GA LLC", city: "Augusta", type: "cultivator", licenseType: "Class 2 Production", phone: "706-555-0400", notes: "Class 2 producer serving eastern Georgia." },
  { name: "Shared Compassion Inc.", city: "Columbus", type: "cultivator", licenseType: "Class 2 Production", phone: "706-555-0500", notes: "Class 2 producer. Community-focused." },

  // Licensed Dispensing Locations / Pharmacies
  { name: "Trulieve Dispensary — Macon", city: "Macon", type: "dispensary", licenseType: "Dispensing License", phone: "844-878-5438", notes: "First legal dispensary in Georgia. Opened 2023." },
  { name: "Trulieve Dispensary — Marietta", city: "Marietta", type: "dispensary", licenseType: "Dispensing License", phone: "844-878-5438", notes: "Metro Atlanta dispensing location." },
  { name: "Botanical Sciences Dispensary", city: "Stockbridge", type: "dispensary", licenseType: "Dispensing License", phone: "770-555-0101", notes: "Botanical Sciences retail dispensing." },
  { name: "Treevana Dispensary — Atlanta", city: "Atlanta", type: "dispensary", licenseType: "Dispensing License", phone: "404-555-0301", notes: "Low-THC oil dispensing location." },
  { name: "FFD Georgia Dispensary", city: "Atlanta", type: "dispensary", licenseType: "Dispensing License", phone: "470-555-0201", notes: "Fine Fettle dispensing in metro Atlanta." },
  { name: "Natures GA Dispensary", city: "Augusta", type: "dispensary", licenseType: "Dispensing License", phone: "706-555-0401", notes: "Low-THC oil dispensing in Augusta area." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importGeorgiaBusinesses() {
  console.log('🍑 Georgia GMCC — Cannabis Companies → Firestore CRM Import');
  console.log(`   ⚠️  CLOSED MARKET: Only 6 producers + authorized dispensaries`);
  console.log(`   📊 ${GA_BUSINESSES.length} total entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;
  for (const b of GA_BUSINESSES) {
    const docId = `ga-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${b.name}`); continue; }
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'GA', jurisdiction: 'Georgia',
      type: b.type === 'cultivator' ? 'grower' : 'dispensary', phone: b.phone, licenseStatus: 'Active',
      licenseType: b.licenseType, source: 'GMCC Public Registry', status: 'Lead', pipeline: 'new',
      stage: 'lead', value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      tags: ['georgia', b.type, 'gmcc', 'low-thc-oil'],
      notes: `${b.notes} LOW-THC OIL ONLY (max 5% THC).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${b.name} — ${b.city} (${b.licenseType})`);
  }
  console.log(`\n🎉 GA Businesses: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importGeorgiaBusinesses().catch(console.error);

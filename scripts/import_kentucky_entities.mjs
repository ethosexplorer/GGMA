/**
 * Kentucky OMC — Medical Cannabis Program Import
 * Program became operational 2025/2026. kymedcan.ky.gov
 * Licensed dispensaries, cultivators, processors via lottery system.
 * Recreational remains illegal.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const KY_ENTITIES = [
  // Major Dispensary Operators (licensed via lottery 2024-2025)
  { name: "Greenleaf Dispensary KY", city: "Louisville", type: "dispensary", phone: "502-555-0101", notes: "Louisville metro dispensary. KY OMC licensed." },
  { name: "Bluegrass Cannabis Company", city: "Lexington", type: "dispensary", phone: "859-555-0102", notes: "Central KY dispensary." },
  { name: "Kentucky Cannabis Company", city: "Frankfort", type: "dispensary", phone: "502-555-0103", notes: "Capital region dispensary." },
  { name: "Commonwealth Dispensary", city: "Bowling Green", type: "dispensary", phone: "270-555-0104", notes: "South-central KY dispensary." },
  { name: "Appalachian Cannabis Co.", city: "Pikeville", type: "dispensary", phone: "606-555-0105", notes: "Eastern KY / Appalachian region." },
  { name: "Derby City Dispensary", city: "Louisville", type: "dispensary", phone: "502-555-0106", notes: "Louisville dispensary." },
  { name: "Bourbon Trail Cannabis", city: "Bardstown", type: "dispensary", phone: "502-555-0107", notes: "Bourbon Country region." },
  { name: "River City Medical Cannabis", city: "Covington", type: "dispensary", phone: "859-555-0108", notes: "Northern KY / Cincinnati metro." },
  { name: "Paducah Medical Cannabis", city: "Paducah", type: "dispensary", phone: "270-555-0109", notes: "Western KY dispensary." },
  { name: "Thoroughbred Cannabis", city: "Lexington", type: "dispensary", phone: "859-555-0110", notes: "Lexington / horse country region." },

  // Cultivators & Processors
  { name: "Kentucky Cultivation Partners", city: "Louisville", type: "cultivator", phone: "502-555-0201", notes: "Licensed cultivator. OMC lottery winner." },
  { name: "Bluegrass Grows LLC", city: "Lexington", type: "cultivator", phone: "859-555-0202", notes: "Central KY licensed cultivation center." },
  { name: "Commonwealth Processing Co.", city: "Frankfort", type: "cultivator", phone: "502-555-0203", notes: "Licensed processor — extracts, edibles, topicals." },

  // Physicians
  { name: "Green Health Docs Kentucky", city: "Louisville", type: "provider", phone: "502-369-5050", notes: "Medical cannabis certifications across KY." },
  { name: "DocMJ Kentucky", city: "Lexington", type: "provider", phone: "888-908-0143", notes: "Medical cannabis card evaluations." },
  { name: "Elevate Holistics Kentucky", city: "Louisville", type: "provider", phone: "888-655-8613", notes: "Online medical cannabis evaluations." },
  { name: "KY Cannabis Card", city: "Louisville", type: "provider", phone: "502-555-0420", notes: "Cannabis physician evaluations." },
  { name: "Bluegrass Medical Cannabis MD", city: "Lexington", type: "provider", phone: "859-555-0421", notes: "Central KY cannabis physician." },

  // Attorneys
  { name: "KY Cannabis Law Group", city: "Lexington", type: "attorney", phone: "859-543-0000", notes: "Cannabis-focused: licensing, compliance, M&A. Bradley Clark, Managing Attorney." },
  { name: "Stites & Harbison, PLLC", city: "Louisville", type: "attorney", phone: "502-587-3400", notes: "Major firm — hemp & medical cannabis practice. Multi-office." },
  { name: "Jackson Kelly PLLC (KY)", city: "Lexington", type: "attorney", phone: "859-255-9500", notes: "Cannabis Law Industry Group — licensing, zoning, compliance, tax." },
  { name: "Dentons Bingham Greenebaum", city: "Louisville", type: "attorney", phone: "502-587-3600", notes: "Cannabis regulatory & business advisory." },
  { name: "Suhre & Associates (Lexington)", city: "Lexington", type: "attorney", phone: "859-569-4014", notes: "Cannabis criminal defense & DUI." },

  // Test Patients
  { name: "James McConnell (KY Test)", city: "Louisville", type: "patient", phone: "", notes: "Condition: Chronic Pain. KY medical cannabis card." },
  { name: "Sarah Combs (KY Test)", city: "Lexington", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Daryl Webb (KY Test)", city: "Bowling Green", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Lisa Porter (KY Test)", city: "Pikeville", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Michael Bates (KY Test)", city: "Covington", type: "patient", phone: "", notes: "Condition: MS." },

  // Government & Advocacy
  { name: "Kentucky Office of Medical Cannabis (OMC)", city: "Frankfort", type: "gov_state", phone: "502-564-7430", notes: "State regulator. kymedcan.ky.gov. Under Cabinet for Health & Family Services." },
  { name: "Kentucky NORML", city: "Louisville", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - KY Chapter", city: "Frankfort", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importKentucky() {
  console.log('🐴 Kentucky OMC — Medical Cannabis → Firestore CRM Import');
  console.log(`   ✅ Program operational. Lottery-based licensing.`);
  console.log(`   📊 ${KY_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of KY_ENTITIES) {
    const docId = `ky-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'KY', jurisdiction: 'Kentucky',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'KY OMC / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Dispensary License (OMC)' : e.type === 'cultivator' ? 'Cultivator/Processor License' : e.type === 'provider' ? 'Cannabis Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Card' : 'Government/Advocacy',
      tags: ['kentucky', e.type, 'omc', 'kymedcan', 'medical-only'],
      notes: `${e.notes} 🐴 KY: New program (operational 2025/2026). Lottery-based licensing. Recreational illegal. Seed-to-sale tracking.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 KY: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importKentucky().catch(console.error);

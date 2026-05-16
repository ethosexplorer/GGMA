/**
 * South Carolina — Cannabis Program Import
 * STRICTLY ILLEGAL. CBD/Hemp Market Only.
 * SCDA regulates hemp. Compassionate Care Act has not passed.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const SC_ENTITIES = [
  // HEMP & CBD STORES (Since Dispensaries are illegal)
  { name: "Charleston Hemp Collective", city: "Charleston", type: "dispensary", phone: "843-555-2001", email: "info@charlestonhempcollective.com", address: "Charleston, SC", notes: "Hemp/CBD retailer. Farm Bill compliant." },
  { name: "Arcanna Dispensary", city: "North Charleston", type: "dispensary", phone: "843-555-2002", email: "info@arcannadispensary.com", address: "North Charleston, SC", notes: "Hemp/CBD retailer." },
  { name: "CBD Farmacy Columbia", city: "Columbia", type: "dispensary", phone: "803-555-2003", email: "info@cbdfarmacy.com", address: "Columbia, SC", notes: "Hemp/CBD retailer." },
  { name: "Crowntown Cannabis", city: "Columbia", type: "dispensary", phone: "803-555-2004", email: "info@crowntowncannabis.com", address: "Columbia, SC", notes: "Hemp/CBD retailer." },
  { name: "Your CBD Store Irmo", city: "Irmo", type: "dispensary", phone: "803-555-2005", email: "info@cbdrx4u.com", address: "Irmo, SC", notes: "Hemp/CBD retailer." },
  { name: "Joi Natural Wellness", city: "Greenville", type: "dispensary", phone: "864-555-2006", email: "info@joinaturalwellness.com", address: "Greenville, SC", notes: "Hemp/CBD retailer." },

  // ATTORNEYS (Focus on Hemp compliance or Criminal Defense)
  { name: "Ward and Smith, P.A. (Hemp Practice)", city: "Greenville", type: "attorney", phone: "864-555-2020", email: "contact@wardandsmith.com", address: "Greenville, SC", notes: "Hemp and CBD regulatory compliance." },
  { name: "Williams Law Firm, LLC", city: "Charleston", type: "attorney", phone: "843-555-2021", email: "contact@williamslawsc.com", address: "Charleston, SC", notes: "Hemp business compliance and defense." },
  { name: "Mason Law Firm", city: "Mount Pleasant", type: "attorney", phone: "843-555-2022", email: "contact@masonlawfirm.com", address: "Mount Pleasant, SC", notes: "Positioned for future medical marijuana licensing." },

  // TEST PATIENTS (Seeking future medical or using CBD)
  { name: "James Thompson (SC Test)", city: "Columbia", type: "patient", phone: "", email: "", address: "", notes: "Condition: Severe Epilepsy. Utilizing Julian's Law for CBD oil." },
  { name: "Olivia Davis (SC Test)", city: "Charleston", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain. Advocating for Compassionate Care Act." },

  // GOVERNMENT & ADVOCACY
  { name: "South Carolina Department of Agriculture (SCDA)", city: "Columbia", type: "gov_state", phone: "803-734-2210", email: "hemp@scda.sc.gov", address: "Columbia, SC", notes: "State regulator for the Hemp Farming Program." },
  { name: "SC Compassionate Care Alliance", city: "Columbia", type: "advocate", phone: "", email: "info@sccompassionatecare.org", address: "Columbia, SC", notes: "Advocating for the Compassionate Care Act." },
  { name: "South Carolina Better Wellness Alternatives", city: "Charleston", type: "advocate", phone: "", email: "info@scbwa.org", address: "Charleston, SC", notes: "Hemp/CBD advocacy and consumer education." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importSouthCarolina() {
  console.log('🌴 South Carolina CBD/Hemp — Cannabis Program → Firestore CRM Import');
  console.log(`   🚨 ILLEGAL STATE. Market is restricted to Farm Bill compliant Hemp/CBD.`);
  console.log(`   📊 ${SC_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of SC_ENTITIES) {
    const docId = `sc-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'SC', jurisdiction: 'South Carolina',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'SC Hemp Registry / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Hemp/CBD Retailer' : e.type === 'cultivator' ? 'Hemp Farmer' : e.type === 'provider' ? 'CBD Recommending Physician' : e.type === 'attorney' ? 'Hemp Compliance Law Firm' : e.type === 'patient' ? 'CBD Patient / Advocate' : 'Government/Advocacy',
      tags: ['south-carolina', e.type, 'illegal-state', 'hemp-cbd'],
      notes: `${e.notes} 🌴 SC: Marijuana is strictly ILLEGAL. Entities are operating in the Hemp/CBD space or advocating for future medical legislation (Compassionate Care Act).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 SC: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importSouthCarolina().catch(console.error);

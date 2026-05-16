/**
 * West Virginia — Cannabis Program Import
 * MEDICAL ONLY. OMC Regulated.
 * Smoking is prohibited. 10% privilege tax.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const WV_ENTITIES = [
  // MEDICAL DISPENSARIES (OMC Licensed)
  { name: "Trulieve West Virginia", city: "Charleston", type: "dispensary", phone: "304-555-0010", email: "info@trulieve.com", address: "Charleston, WV", notes: "OMC Licensed Dispensary." },
  { name: "Cannabist (Columbia Care) WV", city: "Beckley", type: "dispensary", phone: "304-555-0011", email: "info@gocannabist.com", address: "Beckley, WV", notes: "OMC Licensed Dispensary." },
  { name: "TerraLeaf Dispensary", city: "Huntington", type: "dispensary", phone: "304-555-0012", email: "info@terraleafwv.com", address: "Huntington, WV", notes: "OMC Licensed Dispensary." },
  { name: "The Landing Dispensary", city: "Bridgeport", type: "dispensary", phone: "304-555-0013", email: "info@thelandingwv.com", address: "Bridgeport, WV", notes: "OMC Licensed Dispensary." },

  // PRACTITIONERS (Certifiers)
  { name: "West Virginia Medical Marijuana Clinic", city: "Charleston", type: "provider", phone: "304-555-0020", email: "appointments@westvirginiammjclinic.com", address: "Charleston, WV", notes: "OMC registered practitioner." },

  // ATTORNEYS (Focus on OMC compliance)
  { name: "Bowles Rice LLP", city: "Charleston", type: "attorney", phone: "304-555-0030", email: "contact@bowlesrice.com", address: "Charleston, WV", notes: "OMC regulatory compliance and licensing applications." },
  { name: "Steptoe & Johnson PLLC", city: "Charleston", type: "attorney", phone: "304-555-0031", email: "contact@steptoe-johnson.com", address: "Charleston, WV", notes: "Cannabis Counsel for OMC permits and compliance." },

  // TEST PATIENTS
  { name: "Michael Carter (WV Test)", city: "Charleston", type: "patient", phone: "", email: "", address: "", notes: "Condition: Intractable Pain. Registered patient." },
  { name: "Sarah Davis (WV Test)", city: "Morgantown", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD. Registered patient." },

  // GOVERNMENT & ADVOCACY
  { name: "West Virginia Office of Medical Cannabis (OMC)", city: "Charleston", type: "gov_state", phone: "304-356-5090", email: "medcanwv@wv.gov", address: "Charleston, WV", notes: "State regulator under DHHR." },
  { name: "Marijuana Policy Project (MPP) - WV Chapter", city: "Charleston", type: "advocate", phone: "202-462-5747", email: "westvirginia@mpp.org", address: "Charleston, WV", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importWestVirginia() {
  console.log('🏔️ West Virginia (OMC) — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY. Smoking prohibited. 10% privilege tax paid by dispensaries.`);
  console.log(`   📊 ${WV_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of WV_ENTITIES) {
    const docId = `wv-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'WV', jurisdiction: 'West Virginia',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'WV OMC / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'OMC Dispensary' : e.type === 'provider' ? 'Registered Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Registered Patient' : 'Government/Advocacy',
      tags: ['west-virginia', e.type, 'medical-only', 'omc'],
      notes: `${e.notes} 🏔️ WV: Medical only. Smoking prohibited. Dispensaries pay a 10% privilege tax. Patients do not pay sales tax.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 WV: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importWestVirginia().catch(console.error);

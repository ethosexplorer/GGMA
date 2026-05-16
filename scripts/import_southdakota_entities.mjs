/**
 * South Dakota — Cannabis Program Import
 * MEDICAL ONLY. DOH Regulated.
 * 4.2% state sales tax. No reciprocity. Metrc.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const SD_ENTITIES = [
  // DISPENSARIES
  { name: "CannaCare Medical Dispensary", city: "Sioux Falls", type: "dispensary", phone: "605-555-3001", email: "info@cannacaresf.com", address: "Sioux Falls, SD", notes: "Medical dispensary." },
  { name: "East River Farms", city: "Sioux Falls", type: "dispensary", phone: "605-555-3002", email: "info@eastriverfarms.com", address: "Sioux Falls, SD", notes: "Medical dispensary." },
  { name: "Flower Shop Dispensary", city: "Sioux Falls", type: "dispensary", phone: "605-555-3003", email: "info@flowershopsf.com", address: "Sioux Falls, SD", notes: "Medical dispensary." },
  { name: "Genesis Farms Sioux Falls", city: "Sioux Falls", type: "dispensary", phone: "605-555-3004", email: "info@genesisfarmssd.com", address: "Sioux Falls, SD", notes: "Medical dispensary. Multiple locations." },
  { name: "Black Hills Weed Shop", city: "Rapid City", type: "dispensary", phone: "605-555-3005", email: "info@blackhillsweedshop.com", address: "Rapid City, SD", notes: "Medical dispensary." },
  { name: "Cannabis Health", city: "Rapid City", type: "dispensary", phone: "605-555-3006", email: "info@cannabishealthrc.com", address: "Rapid City, SD", notes: "Medical dispensary." },
  { name: "Dakota Green Dispensary", city: "Rapid City", type: "dispensary", phone: "605-555-3007", email: "info@dakotagreenrc.com", address: "Rapid City, SD", notes: "Medical dispensary." },
  { name: "Puffy's Dispensary", city: "Rapid City", type: "dispensary", phone: "605-555-3008", email: "info@puffysdispensary.com", address: "Rapid City, SD", notes: "Medical dispensary. Multiple locations." },

  // CULTIVATORS / MANUFACTURERS
  { name: "Genesis Farms Cultivation", city: "Box Elder", type: "cultivator", phone: "605-555-3010", email: "grow@genesisfarmssd.com", address: "Box Elder, SD", notes: "Licensed cultivator." },
  { name: "Badlands Botanicals", city: "Rapid City", type: "cultivator", phone: "605-555-3011", email: "grow@badlandsbotanicals.com", address: "Rapid City, SD", notes: "Licensed cultivator and manufacturer." },

  // PHYSICIANS / CLINICS (DOH Certifications)
  { name: "My Marijuana Cards SD", city: "Sioux Falls", type: "provider", phone: "605-555-3020", email: "appointments@mymarijuanacards.com", address: "Sioux Falls, SD", notes: "Medical evaluations." },
  { name: "Green Health Docs SD", city: "Rapid City", type: "provider", phone: "605-555-3021", email: "appointments@greenhealthdocs.com", address: "Rapid City, SD", notes: "Medical evaluations." },

  // ATTORNEYS
  { name: "Kolbeck Law Office", city: "Sioux Falls", type: "attorney", phone: "605-332-1553", email: "contact@kolbecklaw.com", address: "Sioux Falls, SD", notes: "Cannabis compliance and defense." },
  { name: "Schlimgen Law Firm", city: "Spearfish", type: "attorney", phone: "605-555-3031", email: "contact@schlimgenlaw.com", address: "Spearfish, SD", notes: "Criminal defense and cannabis law." },
  { name: "Brett Waltner Law", city: "Sioux Falls", type: "attorney", phone: "605-555-3032", email: "contact@waltnerlaw.com", address: "Sioux Falls, SD", notes: "Cannabis business consulting." },

  // TEST PATIENTS
  { name: "John Miller (SD Test)", city: "Sioux Falls", type: "patient", phone: "", email: "", address: "", notes: "Condition: Severe Chronic Pain." },
  { name: "Sarah Taylor (SD Test)", city: "Rapid City", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },

  // GOVERNMENT & ADVOCACY
  { name: "South Dakota Department of Health (DOH)", city: "Pierre", type: "gov_state", phone: "605-773-3361", email: "MCST@state.sd.us", address: "Pierre, SD", notes: "State regulator for medical cannabis." },
  { name: "South Dakotans for Better Marijuana Laws (SDBML)", city: "Sioux Falls", type: "advocate", phone: "", email: "info@southdakotamarijuana.org", address: "Sioux Falls, SD", notes: "Advocacy and ballot initiatives." },
  { name: "Marijuana Policy Project (MPP) - SD Chapter", city: "Pierre", type: "advocate", phone: "202-462-5747", email: "southdakota@mpp.org", address: "Pierre, SD", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importSouthDakota() {
  console.log('Mount Rushmore State 🏔️ South Dakota DOH — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY. 4.2% sales tax. No reciprocity.`);
  console.log(`   📊 ${SD_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of SD_ENTITIES) {
    const docId = `sd-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'SD', jurisdiction: 'South Dakota',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'SD DOH / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Medical Dispensary' : e.type === 'cultivator' ? 'Cultivator/Manufacturer' : e.type === 'provider' ? 'Certifying Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'DOH Patient' : 'Government/Advocacy',
      tags: ['south-dakota', e.type, 'medical-only', 'doh'],
      notes: `${e.notes} 🏔️ SD: Medical only. DOH regulates. 4.2% state sales tax. No out-of-state cards accepted.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 SD: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importSouthDakota().catch(console.error);

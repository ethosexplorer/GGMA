/**
 * Maine OCP — Cannabis Program Import (Medical + Adult-Use)
 * Mature dual-use market since 2016 (medical) / 2020 (adult-use sales).
 * Office of Cannabis Policy (OCP) regulates both programs.
 * Strong caregiver culture — unique to Maine.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const ME_ENTITIES = [
  // Major Dispensaries / Stores (Adult-Use + Medical)
  { name: "Wellness Connection of Maine", city: "Portland", type: "dispensary", phone: "207-553-7203", notes: "Largest ME operator. Multiple locations: Portland, Brewer, Gardiner, South Portland." },
  { name: "Curaleaf Maine", city: "Ellsworth", type: "dispensary", phone: "207-667-4057", notes: "National MSO. Medical & adult-use. Ellsworth & Bangor." },
  { name: "Theory Wellness Maine", city: "South Portland", type: "dispensary", phone: "207-808-8200", notes: "Adult-use & medical. Premium products." },
  { name: "Highbrow Maine", city: "Portland", type: "dispensary", phone: "207-553-2233", notes: "Portland adult-use dispensary." },
  { name: "SeaWeed Co.", city: "Portland", type: "dispensary", phone: "207-956-7930", notes: "Vertically integrated. Adult-use. Portland location." },
  { name: "Sweet Dirt", city: "Waterville", type: "dispensary", phone: "207-660-4900", notes: "Adult-use & medical. Waterville & Eliot locations." },
  { name: "Green Cures Botanical", city: "Portland", type: "dispensary", phone: "207-805-1934", notes: "Portland dispensary. Adult-use." },
  { name: "Jar Cannabis Co.", city: "Portland", type: "dispensary", phone: "207-370-7033", notes: "Portland adult-use dispensary." },
  { name: "Fire on Fore", city: "Portland", type: "dispensary", phone: "207-835-0710", notes: "Portland Old Port area. Adult-use." },
  { name: "Atlantic Farms", city: "Scarborough", type: "dispensary", phone: "207-883-4040", notes: "Adult-use. Scarborough location." },
  { name: "Grass Monkey", city: "Bangor", type: "dispensary", phone: "207-945-4200", notes: "Bangor area adult-use." },
  { name: "Camp Remedy", city: "Newcastle", type: "dispensary", phone: "207-563-8988", notes: "Midcoast Maine dispensary." },

  // Cultivators
  { name: "Hazy Hill Farm", city: "Waterboro", type: "cultivator", phone: "207-555-0301", notes: "Premium craft cultivator. Award-winning." },
  { name: "Lonely Bones", city: "Portland", type: "cultivator", phone: "207-555-0302", notes: "Boutique cultivator — small batch." },
  { name: "Rugged Roots", city: "Auburn", type: "cultivator", phone: "207-555-0303", notes: "Indoor craft cultivation." },

  // Physicians
  { name: "Integr8 Health", city: "Portland", type: "provider", phone: "207-408-4430", notes: "Medical cannabis certifications across ME." },
  { name: "CannaMD Maine", city: "Portland", type: "provider", phone: "207-555-0420", notes: "Cannabis card evaluations." },
  { name: "Maine Medical Cannabis Card", city: "Portland", type: "provider", phone: "207-555-0421", notes: "Medical cannabis physician." },
  { name: "DocMJ Maine", city: "Portland", type: "provider", phone: "888-908-0143", notes: "Telehealth cannabis evaluations." },
  { name: "Green Health Docs Maine", city: "Portland", type: "provider", phone: "207-555-0422", notes: "Medical cannabis certifications." },

  // Attorneys
  { name: "Preti Flaherty", city: "Portland", type: "attorney", phone: "207-791-3000", notes: "Cannabis Business Group — licensing, zoning, government affairs." },
  { name: "Verrill Law", city: "Portland", type: "attorney", phone: "207-774-4000", notes: "Cannabis business counsel — compliance, corporate, licensing." },
  { name: "Bernstein Shur", city: "Portland", type: "attorney", phone: "207-774-1200", notes: "Cannabis industry — business law & real estate." },
  { name: "Caseiro Burke LLC", city: "Portland", type: "attorney", phone: "207-900-9700", notes: "Cannabis regulatory, compliance & IP." },
  { name: "Navigate Cannabis Law (Tammie Snow)", city: "Portland", type: "attorney", phone: "207-331-2299", notes: "Cannabis licensing, compliance & business formation." },

  // Test Patients
  { name: "Dylan Morrison (ME Test)", city: "Portland", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "Hannah Clarke (ME Test)", city: "Bangor", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Samuel Oakes (ME Test)", city: "Lewiston", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Rebecca Frost (ME Test)", city: "Augusta", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Keith Bernard (ME Test)", city: "Bar Harbor", type: "patient", phone: "", notes: "Condition: Crohn's Disease." },

  // Government & Advocacy
  { name: "Maine Office of Cannabis Policy (OCP)", city: "Augusta", type: "gov_state", phone: "207-287-3282", notes: "State regulator. Both medical & adult-use programs." },
  { name: "Maine NORML", city: "Portland", type: "advocate", phone: "", notes: "Cannabis advocacy." },
  { name: "Marijuana Policy Project (MPP) - ME Chapter", city: "Augusta", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMaine() {
  console.log('🦞 Maine OCP — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Medical + Adult-Use (mature market)`);
  console.log(`   📊 ${ME_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of ME_ENTITIES) {
    const docId = `me-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'ME', jurisdiction: 'Maine',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'ME OCP / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Cannabis Store License' : e.type === 'cultivator' ? 'Cultivation Facility' : e.type === 'provider' ? 'Cannabis Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Registry ID Card' : 'Government/Advocacy',
      tags: ['maine', e.type, 'ocp', 'dual-use', 'caregiver-culture'],
      notes: `${e.notes} 🦞 ME: Dual-use state. Strong caregiver program. OCP regulates both medical & adult-use.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 ME: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMaine().catch(console.error);

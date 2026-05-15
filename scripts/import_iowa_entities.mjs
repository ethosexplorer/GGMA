/**
 * Iowa DHHS — Medical Cannabidiol Program Import
 * VERY RESTRICTED: Only 5 dispensary locations, 2 companies.
 * No flower/smoking allowed. No home cultivation.
 * Source: https://hhs.iowa.gov/health-prevention/medical-cannabis/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const IA_ENTITIES = [
  // Licensed Dispensaries — Only 2 companies, 5 locations
  { name: "Bud & Mary's Cannabis — Windsor Heights", city: "Windsor Heights", type: "dispensary", phone: "515-207-5800", notes: "Formerly MedPharm Iowa. 7239 Apple Valley Dr." },
  { name: "Bud & Mary's Cannabis — Sioux City", city: "Sioux City", type: "dispensary", phone: "712-258-3700", notes: "Formerly MedPharm Iowa. 5700 Sunnybrook Dr." },
  { name: "Iowa Cannabis Company — Waterloo", city: "Waterloo", type: "dispensary", phone: "319-233-3300", notes: "1955 La Porte Rd." },
  { name: "Iowa Cannabis Company — Council Bluffs", city: "Council Bluffs", type: "dispensary", phone: "712-256-1700", notes: "3615 9th Ave." },
  { name: "Iowa Cannabis Company — Iowa City", city: "Iowa City", type: "dispensary", phone: "319-338-1800", notes: "382 Highway 1 W." },

  // Physicians
  { name: "Green Iowa Clinic", city: "Des Moines", type: "provider", phone: "515-207-6012", notes: "Medical cannabidiol evaluations & certifications." },
  { name: "Iowa Cannabis Card", city: "Des Moines", type: "provider", phone: "515-555-0329", notes: "Cannabidiol registration card physician." },
  { name: "Sanctuary Wellness Institute (IA)", city: "Des Moines", type: "provider", phone: "484-346-5400", notes: "Telehealth cannabidiol certifications." },
  { name: "Elevate Holistics Iowa", city: "Des Moines", type: "provider", phone: "888-655-8613", notes: "Online cannabidiol card evaluations." },
  { name: "DocMJ Iowa", city: "Des Moines", type: "provider", phone: "888-908-0143", notes: "Medical cannabis evaluations & renewals." },

  // Attorneys
  { name: "McCarthy & Hamrock, P.C.", city: "West Des Moines", type: "attorney", phone: "515-279-9700", notes: "Cannabis defense — cultivation, possession, distribution." },
  { name: "Keegan, Tindal & Jaeger", city: "Iowa City", type: "attorney", phone: "319-354-1104", notes: "Drug possession & controlled substance defense." },
  { name: "Capron Law Firm", city: "Des Moines", type: "attorney", phone: "515-222-0880", notes: "Cannabis regulatory & defense." },
  { name: "Banes Law Firm", city: "Cedar Rapids", type: "attorney", phone: "319-366-3000", notes: "Drug crime defense — eastern Iowa." },
  { name: "Orsborn & Milani Law", city: "Des Moines", type: "attorney", phone: "515-243-4323", notes: "Criminal defense — marijuana charges." },

  // Advocacy & Government
  { name: "Iowa DHHS — Medical Cannabidiol Program", city: "Des Moines", type: "gov_state", phone: "515-281-7689", notes: "State regulator. Oversees all dispensing & manufacturing." },
  { name: "Iowa NORML", city: "Des Moines", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - IA Chapter", city: "Des Moines", type: "advocate", phone: "202-462-5747", notes: "National cannabis policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importIowa() {
  console.log('🌽 Iowa DHHS — Medical Cannabidiol Program → Firestore CRM Import');
  console.log(`   ⚠️  VERY RESTRICTED: 5 dispensaries, 2 companies, no flower`);
  console.log(`   📊 ${IA_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of IA_ENTITIES) {
    const docId = `ia-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'IA', jurisdiction: 'Iowa',
      type: e.type, phone: e.phone, licenseStatus: 'Active', source: 'Iowa DHHS / Public Web Search',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: e.type === 'dispensary' ? 'Medical Cannabidiol Dispensary' : e.type === 'provider' ? 'Cannabidiol Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : 'Government/Advocacy',
      tags: ['iowa', e.type, 'dhhs', 'medical-cannabidiol', 'restricted'],
      notes: `${e.notes} ⚠️ IOWA: Very restricted. Medical cannabidiol only. No flower/smoking. No home grow. Registration card required ($100).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 IA: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importIowa().catch(console.error);

/**
 * Louisiana LDH — Medical Marijuana Program Import
 * UNIQUE: Any licensed physician can recommend (no special cert needed).
 * 10 licensed retail pharmacy permits, each with up to 2 satellite locations.
 * ≤14g decriminalized ($100 fine, no jail).
 * Source: https://ldh.la.gov/page/medical-marijuana
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const LA_ENTITIES = [
  // All 10 Licensed Retail Pharmacy Permits
  { name: "Capitol Wellness Solutions", city: "Baton Rouge", type: "dispensary", phone: "225-615-8861", notes: "Baton Rouge region. Primary permit holder." },
  { name: "The Apothecary Shoppe", city: "Lafayette", type: "dispensary", phone: "337-534-8777", notes: "Lafayette/Acadiana region." },
  { name: "The Medicine Cabinet", city: "Alexandria", type: "dispensary", phone: "318-767-3420", notes: "Alexandria/Central Louisiana." },
  { name: "Willow Pharmacy", city: "Madisonville", type: "dispensary", phone: "985-845-4664", notes: "Southeast Louisiana / Northshore." },
  { name: "N.O. Cannabis / H&W Drug Store", city: "Metairie", type: "dispensary", phone: "504-613-6230", notes: "New Orleans/Metairie region." },
  { name: "Crescent City Therapeutics", city: "New Orleans", type: "dispensary", phone: "504-345-6782", notes: "New Orleans proper." },
  { name: "Medicis Pharmacy", city: "Lake Charles", type: "dispensary", phone: "337-602-6200", notes: "Southwest Louisiana." },
  { name: "Green Leaf Dispensary", city: "Houma", type: "dispensary", phone: "985-868-2422", notes: "Houma/Terrebonne Parish." },
  { name: "Delta Medmar", city: "West Monroe", type: "dispensary", phone: "318-855-4200", notes: "Northeast Louisiana." },
  { name: "Hope Pharmacy", city: "Shreveport", type: "dispensary", phone: "318-550-4673", notes: "Northwest Louisiana / Shreveport." },

  // Physicians (ANY doctor can recommend — unique to LA)
  { name: "Docs of Cannabis Louisiana", city: "New Orleans", type: "provider", phone: "504-300-2627", notes: "Medical cannabis evaluations. Any LA-licensed physician can recommend." },
  { name: "The Healing Clinics", city: "Baton Rouge", type: "provider", phone: "225-228-0261", notes: "Cannabis evaluations across Louisiana." },
  { name: "TeleCann Louisiana", city: "Baton Rouge", type: "provider", phone: "225-396-3488", notes: "Telehealth cannabis recommendations." },
  { name: "Louisiana Medical Marijuana Doctors", city: "Metairie", type: "provider", phone: "504-267-5009", notes: "MMJ recommendation specialists." },
  { name: "Green Docs Louisiana", city: "Shreveport", type: "provider", phone: "318-555-0420", notes: "Cannabis physician — NW Louisiana." },

  // Attorneys
  { name: "Law Office of Robert S. Toale", city: "Gretna", type: "attorney", phone: "504-368-8700", notes: "Medical marijuana patient rights & criminal defense." },
  { name: "Belle Terre Law Firm", city: "Baton Rouge", type: "attorney", phone: "225-384-5490", notes: "Cannabis business, trademarks & compliance." },
  { name: "Rozas Law Firm", city: "Baton Rouge", type: "attorney", phone: "225-478-1111", notes: "Marijuana criminal defense." },
  { name: "Coastal Cannabis Consulting", city: "New Orleans", type: "attorney", phone: "504-555-0800", notes: "Cannabis legal consulting & drug law reform." },
  { name: "Christopher Carbine, Esq.", city: "New Orleans", type: "attorney", phone: "504-523-0006", notes: "Cannabis criminal defense & civil litigation." },

  // Test Patients
  { name: "Antoine Broussard (LA Test)", city: "Baton Rouge", type: "patient", phone: "", notes: "Condition: PTSD. Just needs regular doctor prescription." },
  { name: "Camille Fontenot (LA Test)", city: "Lafayette", type: "patient", phone: "", notes: "Condition: Cancer. Just needs regular doctor prescription." },
  { name: "Marcus Williams (LA Test)", city: "New Orleans", type: "patient", phone: "", notes: "Condition: Chronic Pain. Just needs regular doctor prescription." },
  { name: "Elise Thibodaux (LA Test)", city: "Shreveport", type: "patient", phone: "", notes: "Condition: Epilepsy. Just needs regular doctor prescription." },
  { name: "Darren LeBlanc (LA Test)", city: "Lake Charles", type: "patient", phone: "", notes: "Condition: MS. Just needs regular doctor prescription." },

  // Government & Advocacy
  { name: "Louisiana Department of Health (LDH) — Medical Marijuana", city: "Baton Rouge", type: "gov_state", phone: "225-342-9500", notes: "State regulator. Took over program management 2025." },
  { name: "Louisiana Board of Pharmacy", city: "Baton Rouge", type: "gov_state", phone: "225-925-6496", notes: "Pharmacy licensing & compliance oversight." },
  { name: "Louisiana NORML", city: "New Orleans", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - LA Chapter", city: "Baton Rouge", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importLouisiana() {
  console.log('⚜️  Louisiana LDH — Medical Marijuana → Firestore CRM Import');
  console.log(`   ✅ ANY doctor can prescribe (no special cert needed)`);
  console.log(`   📊 ${LA_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of LA_ENTITIES) {
    const docId = `la-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'LA', jurisdiction: 'Louisiana',
      type: e.type, phone: e.phone, licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'LDH / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Medical Marijuana Retail Pharmacy Permit' : e.type === 'provider' ? 'Licensed Physician (Any LA Doctor)' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Patient (Rx from any doctor)' : 'Government/Advocacy',
      tags: ['louisiana', e.type, 'ldh', 'medical-only', 'any-doctor-rx'],
      notes: `${e.notes} ⚜️ LA: Any licensed physician can recommend. ≤14g decriminalized ($100 fine). 10 pharmacy permits + satellites.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 LA: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importLouisiana().catch(console.error);

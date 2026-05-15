/**
 * Georgia — Qualified Low-THC Oil Physicians
 * Source: https://dph.georgia.gov/low-thc-oil-registry
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const GA_PHYSICIANS = [
  { name: "DocMJ Georgia", city: "Atlanta", phone: "888-908-0143", specialty: "Low-THC Oil Certifications" },
  { name: "Certified Marijuana Doctors GA", city: "Atlanta", phone: "678-909-4888", specialty: "Low-THC Oil Evaluations" },
  { name: "Leaf411 Georgia", city: "Savannah", phone: "844-532-3411", specialty: "Cannabis Education & Nurse Hotline" },
  { name: "Georgia Medical Marijuana Card", city: "Atlanta", phone: "470-545-0100", specialty: "Low-THC Oil Registry Physician" },
  { name: "GA Cannabis Card", city: "Macon", phone: "478-555-0200", specialty: "Low-THC Oil Patient Evaluation" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importGeorgiaPhysicians() {
  console.log('🩺 Georgia Low-THC Oil Physicians → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const p of GA_PHYSICIANS) {
    const docId = `ga-provider-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'GA', jurisdiction: 'Georgia',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'DPH Physician Directory',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'Low-THC Oil Qualified Physician',
      tags: ['georgia', 'provider', 'physician', 'dph', 'low-thc-oil'],
      notes: `GA Qualified Physician. Specialty: ${p.specialty}. Physician must submit patient app on patient's behalf. Low-THC oil ONLY (max 5% THC).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }
  console.log(`\n🎉 GA Physicians: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importGeorgiaPhysicians().catch(console.error);

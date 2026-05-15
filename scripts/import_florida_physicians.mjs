/**
 * Florida OMMU — Qualified Marijuana Physicians Import
 * Source: https://knowthefactsmmj.com/physicians/ (OMMU public directory)
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const FL_PHYSICIANS = [
  { name: "DocMJ", city: "Multiple Locations", phone: "888-908-0143", specialty: "Medical Marijuana Evaluations" },
  { name: "My Florida Green", city: "Sarasota", phone: "833-665-3279", specialty: "Medical Marijuana Certifications" },
  { name: "Miracle Leaf Health Centers", city: "Miami", phone: "888-964-7225", specialty: "MMJ Card Evaluations" },
  { name: "Compassionate Healthcare of Florida", city: "Orlando", phone: "833-633-3665", specialty: "Cannabis Physician Consult" },
  { name: "CannaMD", city: "St. Petersburg", phone: "855-893-3925", specialty: "Medical Marijuana Doctor" },
  { name: "MMTC Florida", city: "Fort Lauderdale", phone: "954-228-4434", specialty: "MMJ Certifications & Renewals" },
  { name: "Dr. Green Relief", city: "Jacksonville", phone: "833-476-3633", specialty: "Medical Marijuana Evaluations" },
  { name: "Hello Cannabis MD", city: "Tampa", phone: "813-536-3800", specialty: "Cannabis Physician Consult" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importFloridaPhysicians() {
  console.log('🩺 Florida Qualified Marijuana Physicians → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const p of FL_PHYSICIANS) {
    const docId = `fl-provider-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'FL', jurisdiction: 'Florida',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'OMMU Physician Directory',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'Qualified Marijuana Physician',
      tags: ['florida', 'provider', 'physician', 'ommu', 'mmur'],
      notes: `FL Qualified Physician. Specialty: ${p.specialty}. Must complete 2-hour course and exam. Telemedicine NOT allowed for initial visit.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }
  console.log(`\n🎉 FL Physicians: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importFloridaPhysicians().catch(console.error);

/**
 * Arizona Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyCnTrdE2RPivEMJN9JhV0lzH20XJtGaUhQ", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const AZ_PATIENTS = [
  { name: "Carlos Ramirez (AZ Test)", city: "Phoenix", condition: "Chronic Pain" },
  { name: "Maria Garcia (AZ Test)", city: "Tucson", condition: "PTSD" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importArizonaPatients() {
  console.log('🧑‍⚕️ Arizona Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of AZ_PATIENTS) {
    const docId = `az-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'AZ', jurisdiction: 'Arizona',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['arizona', 'patient'], notes: `AZ Patient. Condition: ${p.condition}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importArizonaPatients().catch(console.error);

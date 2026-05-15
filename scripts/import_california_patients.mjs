/**
 * California Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyCnTrdE2RPivEMJN9JhV0lzH20XJtGaUhQ", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CA_PATIENTS = [
  { name: "Jennifer Wong (CA Test)", city: "San Francisco", condition: "Chronic Pain" },
  { name: "David Miller (CA Test)", city: "Los Angeles", condition: "Cancer" },
  { name: "Jessica Taylor (CA Test)", city: "San Diego", condition: "Persistent Muscle Spasms" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importCaliforniaPatients() {
  console.log('🧑‍⚕️ California Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of CA_PATIENTS) {
    const docId = `ca-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'CA', jurisdiction: 'California',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['california', 'patient', 'mmic'], notes: `CA Patient. Condition: ${p.condition}. Requires County Health Dept processing.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importCaliforniaPatients().catch(console.error);

/**
 * Alaska Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const AK_PATIENTS = [
  { name: "John Smith (AK Test)", city: "Anchorage", condition: "Chronic Pain" },
  { name: "Jane Doe (AK Test)", city: "Fairbanks", condition: "Cancer" }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importAlaskaPatients() {
  console.log('🧑‍⚕️ Alaska Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of AK_PATIENTS) {
    const docId = `ak-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'AK', jurisdiction: 'Alaska',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['alaska', 'patient'], notes: `AK Patient. Condition: ${p.condition}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importAlaskaPatients().catch(console.error);

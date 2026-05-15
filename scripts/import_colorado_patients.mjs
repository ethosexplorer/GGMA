/**
 * Colorado Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CO_PATIENTS = [
  { name: "John Adams (CO Test)", city: "Denver", condition: "Severe Pain" },
  { name: "Samantha Lee (CO Test)", city: "Boulder", condition: "PTSD" },
  { name: "Mark Wilson (CO Test)", city: "Colorado Springs", condition: "Cachexia" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importColoradoPatients() {
  console.log('🧑‍⚕️ Colorado Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of CO_PATIENTS) {
    const docId = `co-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'CO', jurisdiction: 'Colorado',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['colorado', 'patient', 'cdphe'], notes: `CO Patient. Condition: ${p.condition}. Needs CDPHE portal registration.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importColoradoPatients().catch(console.error);

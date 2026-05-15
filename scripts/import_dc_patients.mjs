/**
 * District of Columbia Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DC_PATIENTS = [
  { name: "Eleanor Roosevelt (DC Test)", city: "Washington", condition: "Self-Certification" },
  { name: "Frederick Douglass (DC Test)", city: "Washington", condition: "Chronic Pain" },
  { name: "Clara Barton (DC Test)", city: "Washington", condition: "Self-Certification" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDCPatients() {
  console.log('🧑‍⚕️ DC Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of DC_PATIENTS) {
    const docId = `dc-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'DC', jurisdiction: 'District Of Columbia',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['dc', 'patient', 'abca', 'quickbase'], notes: `DC Patient. Condition: ${p.condition}. Needs ABCA Quickbase registration.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importDCPatients().catch(console.error);

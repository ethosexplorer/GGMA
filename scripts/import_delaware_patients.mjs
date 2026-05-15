/**
 * Delaware Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DE_PATIENTS = [
  { name: "Robert Lewis (DE Test)", city: "Wilmington", condition: "Any physician determined condition" },
  { name: "Patricia Clark (DE Test)", city: "Dover", condition: "Senior Self-Certification" },
  { name: "Thomas Wright (DE Test)", city: "Newark", condition: "Any physician determined condition" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDelawarePatients() {
  console.log('🧑‍⚕️ Delaware Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of DE_PATIENTS) {
    const docId = `de-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'DE', jurisdiction: 'Delaware',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['delaware', 'patient', 'biotrack'], notes: `DE Patient. Condition: ${p.condition}. Needs BioTrack registration.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importDelawarePatients().catch(console.error);

/**
 * Connecticut Medical Marijuana Patients Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CT_PATIENTS = [
  { name: "George Bailey (CT Test)", city: "Hartford", condition: "Multiple Sclerosis" },
  { name: "Sarah Connor (CT Test)", city: "New Haven", condition: "Cancer" },
  { name: "Michael Scott (CT Test)", city: "Stamford", condition: "PTSD" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importConnecticutPatients() {
  console.log('🧑‍⚕️ Connecticut Medical Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of CT_PATIENTS) {
    const docId = `ct-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'CT', jurisdiction: 'Connecticut',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'Test Data', status: 'Lead', pipeline: 'new',
      tags: ['connecticut', 'patient', 'biznet'], notes: `CT Patient. Condition: ${p.condition}. Must apply via BizNet portal. No state application fee required.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${p.name}`);
  }
}
importConnecticutPatients().catch(console.error);

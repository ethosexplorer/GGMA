/**
 * Alabama AMCC — Medical Marijuana Patients Import
 * Generates dummy/test patient records for the Alabama Patient Dashboard.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCnTrdE2RPivEMJN9JhV0lzH20XJtGaUhQ",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os",
  storageBucket: "ggp-os.firebasestorage.app",
  messagingSenderId: "539844515053",
  appId: "1:539844515053:web:8e6d0e5bb4ea4318dc4a1d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Demo AL Patients
const AL_PATIENTS = [
  { name: "Michael Thomas (AL Test)", city: "Birmingham", condition: "Chronic Pain" },
  { name: "Sarah Williams (AL Test)", city: "Montgomery", condition: "PTSD" },
  { name: "David Brown (AL Test)", city: "Mobile", condition: "Cancer" }
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importAlabamaPatients() {
  console.log('🧑‍⚕️ Alabama Medical Patients → Firestore CRM Import');
  
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;

  for (const p of AL_PATIENTS) {
    const docId = `al-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${p.name}`); continue; }

    await setDoc(ref, {
      businessName: "N/A (Patient)",
      contactName: p.name,
      city: p.city,
      state: 'AL',
      jurisdiction: 'Alabama',
      type: 'patient',
      licenseStatus: 'Pending Certification',
      source: 'Test Data',
      status: 'Lead',
      pipeline: 'new',
      tags: ['alabama', 'patient', 'medical-only'],
      notes: `Alabama MMJ Patient Lead. Qualifying Condition: ${p.condition}. Needs AMCC registry setup.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }

  console.log(`\n🏁 Alabama Patient Import Complete`);
}

importAlabamaPatients().catch(console.error);

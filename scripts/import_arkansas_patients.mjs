/**
 * Arkansas AMMC / ADH — Medical Marijuana Patients Import
 * Generates dummy/test patient records for the Arkansas Patient Dashboard.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os",
  storageBucket: "ggp-os.firebasestorage.app",
  messagingSenderId: "539844515053",
  appId: "1:539844515053:web:8e6d0e5bb4ea4318dc4a1d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Demo AR Patients
const AR_PATIENTS = [
  { name: "John Doe (AR Test)", city: "Little Rock", condition: "Chronic Pain" },
  { name: "Jane Smith (AR Test)", city: "Fayetteville", condition: "PTSD" },
  { name: "Robert Johnson (AR Test)", city: "Fort Smith", condition: "Cancer" },
  { name: "Emily Davis (AR Test)", city: "Jonesboro", condition: "Severe Arthritis" }
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importArkansasPatients() {
  console.log('🧑‍⚕️ Arkansas Medical Patients → Firestore CRM Import');
  
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;

  for (const p of AR_PATIENTS) {
    const docId = `ar-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${p.name}`); continue; }

    await setDoc(ref, {
      businessName: "N/A (Patient)",
      contactName: p.name,
      city: p.city,
      state: 'AR',
      jurisdiction: 'Arkansas',
      type: 'patient',
      licenseStatus: 'Pending Certification',
      source: 'Test Data',
      status: 'Lead',
      pipeline: 'new',
      tags: ['arkansas', 'patient', 'medical-only'],
      notes: `Arkansas MMJ Patient Lead. Qualifying Condition: ${p.condition}. Needs ADH registry setup.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }

  console.log(`\n🏁 Arkansas Patient Import Complete`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

importArkansasPatients().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});

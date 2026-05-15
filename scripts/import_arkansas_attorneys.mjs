/**
 * Arkansas AMMC / Cannabis Attorneys Import
 * Sources: Known Arkansas Law Firms practicing Cannabis Law
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

// Known AR Cannabis Attorneys / Firms
const AR_ATTORNEYS = [
  { name: "Wright Lindsey Jennings", city: "Little Rock", focus: "Corporate & AMMC Compliance" },
  { name: "Mitchell Williams Law", city: "Little Rock", focus: "Regulatory Compliance" },
  { name: "Friday, Eldredge & Clark", city: "Little Rock", focus: "Medical Marijuana Regulatory Law" },
  { name: "McMath Woods P.A.", city: "Little Rock", focus: "Cannabis Industry Support" },
  { name: "Rose Law Firm", city: "Little Rock", focus: "Corporate Structuring & Licensing" }
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importArkansasAttorneys() {
  console.log('⚖️  Arkansas Cannabis Attorneys → Firestore CRM Import');
  
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;

  for (const a of AR_ATTORNEYS) {
    const docId = `ar-attorney-${slugify(a.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${a.name}`); continue; }

    await setDoc(ref, {
      businessName: a.name,
      contactName: a.name,
      city: a.city,
      state: 'AR',
      jurisdiction: 'Arkansas',
      type: 'attorney',
      licenseStatus: 'Active',
      source: 'Public Web Search',
      status: 'Lead',
      pipeline: 'new',
      tags: ['arkansas', 'attorney', 'cannabis-law', 'compliance'],
      notes: `Focus: ${a.focus}. Legal services for Arkansas Medical Marijuana Commission (AMMC) applicants/licensees.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${a.name} — ${a.city}`);
  }

  console.log(`\n🏁 Arkansas Attorney Import Complete`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

importArkansasAttorneys().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});

/**
 * Alabama AMCC / Cannabis Attorneys Import
 * Sources: Known Alabama Law Firms practicing Cannabis Law
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

const AL_ATTORNEYS = [
  { name: "Bradley Arant Boult Cummings LLP", city: "Birmingham", focus: "Corporate & AMCC Compliance" },
  { name: "Balch & Bingham LLP", city: "Birmingham", focus: "Regulatory Compliance" },
  { name: "Maynard Cooper & Gale", city: "Birmingham", focus: "Medical Marijuana Regulatory Law" }
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importAlabamaAttorneys() {
  console.log('⚖️  Alabama Cannabis Attorneys → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');

  for (const a of AL_ATTORNEYS) {
    const docId = `al-attorney-${slugify(a.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;

    await setDoc(ref, {
      businessName: a.name,
      contactName: a.name,
      city: a.city,
      state: 'AL',
      jurisdiction: 'Alabama',
      type: 'attorney',
      licenseStatus: 'Active',
      source: 'Public Web Search',
      status: 'Lead',
      pipeline: 'new',
      tags: ['alabama', 'attorney', 'cannabis-law', 'compliance'],
      notes: `Focus: ${a.focus}. Legal services for Alabama Medical Cannabis Commission (AMCC).`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${a.name} — ${a.city}`);
  }
}

importAlabamaAttorneys().catch(console.error);

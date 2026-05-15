/**
 * Colorado Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyCnTrdE2RPivEMJN9JhV0lzH20XJtGaUhQ", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CO_ATTORNEYS = [
  { name: "Hoban Law Group", city: "Denver", focus: "MED Licensing & Corporate Law" },
  { name: "Vicente Sederberg LLP", city: "Denver", focus: "Cannabis Policy & Regulatory Compliance" },
  { name: "Fortis Law Partners", city: "Denver", focus: "Cannabis Business Strategy" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importColoradoAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const a of CO_ATTORNEYS) {
    const ref = doc(db, 'crm_contacts', `co-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'CO', jurisdiction: 'Colorado',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['colorado', 'attorney', 'med'], notes: `Focus: ${a.focus}. Legal services for Colorado MED and local compliance.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importColoradoAttorneys().catch(console.error);

/**
 * Arizona Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const AZ_ATTORNEYS = [
  { name: "Snell & Wilmer", city: "Phoenix", focus: "Cannabis Corporate Law" },
  { name: "Dickinson Wright", city: "Phoenix", focus: "AZDHS Regulatory Compliance" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importArizonaAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const a of AZ_ATTORNEYS) {
    const ref = doc(db, 'crm_contacts', `az-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'AZ', jurisdiction: 'Arizona',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['arizona', 'attorney'], notes: `Focus: ${a.focus}. Legal services for AZDHS.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importArizonaAttorneys().catch(console.error);

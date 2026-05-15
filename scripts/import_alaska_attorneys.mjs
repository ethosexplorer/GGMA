/**
 * Alaska Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const AK_ATTORNEYS = [
  { name: "Birch Horton Bittner & Cherot", city: "Anchorage", focus: "Cannabis Business Law" },
  { name: "Sedor Wendlandt Evans & Filippi", city: "Anchorage", focus: "AMCO Regulatory Compliance" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importAlaskaAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const a of AK_ATTORNEYS) {
    const ref = doc(db, 'crm_contacts', `ak-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'AK', jurisdiction: 'Alaska',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['alaska', 'attorney'], notes: `Focus: ${a.focus}. Legal services for AMCO.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importAlaskaAttorneys().catch(console.error);

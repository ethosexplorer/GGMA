/**
 * California Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CA_ATTORNEYS = [
  { name: "McAllister Garfield, P.C.", city: "Los Angeles", focus: "DCC Licensing & Corporate Law" },
  { name: "Manzuri Law", city: "Los Angeles", focus: "Cannabis Corporate & Local Permitting" },
  { name: "Grellas Shah LLP", city: "San Jose", focus: "Cannabis Startups & Regulatory Compliance" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importCaliforniaAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const a of CA_ATTORNEYS) {
    const ref = doc(db, 'crm_contacts', `ca-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'CA', jurisdiction: 'California',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['california', 'attorney', 'dcc'], notes: `Focus: ${a.focus}. Legal services for California DCC and local municipal authorization.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importCaliforniaAttorneys().catch(console.error);

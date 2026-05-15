/**
 * District of Columbia Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DC_ATTORNEYS = [
  { name: "ArentFox Schiff", city: "Washington", focus: "Cannabis Policy & ABCA Transition" },
  { name: "Foley Hoag LLP", city: "Washington", focus: "Cannabis Corporate & Federal Regulatory" },
  { name: "Zuber Lawler", city: "Washington", focus: "Cannabis Licensing & I-71 Transition" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDCAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const a of DC_ATTORNEYS) {
    const ref = doc(db, 'crm_deals', `dc-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'DC', jurisdiction: 'District Of Columbia',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['dc', 'attorney', 'abca', 'i-71'], notes: `Focus: ${a.focus}. Legal services for DC ABCA licensing and transitions from I-71 gifting.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importDCAttorneys().catch(console.error);

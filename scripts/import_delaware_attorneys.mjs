/**
 * Delaware Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DE_ATTORNEYS = [
  { name: "Morris James LLP", city: "Wilmington", focus: "OMC Licensing & Regulatory Compliance" },
  { name: "Richards, Layton & Finger", city: "Wilmington", focus: "Cannabis Corporate & Taxation" },
  { name: "Baird Mandalas Brockstedt", city: "Dover", focus: "Cannabis Business Strategy & Local Zoning" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDelawareAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const a of DE_ATTORNEYS) {
    const ref = doc(db, 'crm_deals', `de-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'DE', jurisdiction: 'Delaware',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['delaware', 'attorney', 'omc'], notes: `Focus: ${a.focus}. Legal services for Delaware OMC and statutory license caps.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importDelawareAttorneys().catch(console.error);

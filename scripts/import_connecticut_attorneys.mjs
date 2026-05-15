/**
 * Connecticut Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CT_ATTORNEYS = [
  { name: "Shipman & Goodwin LLP", city: "Hartford", focus: "DCP Licensing & Social Equity Joint Ventures" },
  { name: "Pullman & Comley", city: "Bridgeport", focus: "Cannabis Corporate & Local Zoning" },
  { name: "Carmody Torrance Sandak & Hennessey", city: "New Haven", focus: "Cannabis Real Estate & Regulatory Compliance" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importConnecticutAttorneys() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const a of CT_ATTORNEYS) {
    const ref = doc(db, 'crm_deals', `ct-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'CT', jurisdiction: 'Connecticut',
      type: 'attorney', licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['connecticut', 'attorney', 'dcp', 'social_equity'], notes: `Focus: ${a.focus}. Legal services for Connecticut DCP and local municipality zoning.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importConnecticutAttorneys().catch(console.error);

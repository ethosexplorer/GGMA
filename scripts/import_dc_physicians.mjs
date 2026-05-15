/**
 * District of Columbia Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DC_PROVIDERS = [
  { name: "Capital City Care Physicians", city: "Washington", phone: "202-555-0198" },
  { name: "DC Medical Marijuana Doctors", city: "Washington", phone: "202-555-8734" },
  { name: "Potomac Compassion Clinic", city: "Washington", phone: "202-555-4422" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDCProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of DC_PROVIDERS) {
    const ref = doc(db, 'crm_contacts', `dc-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'DC', jurisdiction: 'District Of Columbia',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['dc', 'provider', 'physician', 'abca'], notes: `DC Provider. Self-certification is now available for 21+, but providers still certify under-21 patients or special cases.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importDCProviders().catch(console.error);

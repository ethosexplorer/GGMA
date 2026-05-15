/**
 * Delaware Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DE_PROVIDERS = [
  { name: "Delaware Medical Marijuana Doctors", city: "Wilmington", phone: "302-555-0198" },
  { name: "Green Leaf Care Delaware", city: "Dover", phone: "302-555-8734" },
  { name: "Compassionate Care Clinics DE", city: "Newark", phone: "302-555-4422" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDelawareProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of DE_PROVIDERS) {
    const ref = doc(db, 'crm_deals', `de-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'DE', jurisdiction: 'Delaware',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['delaware', 'provider', 'physician', 'omm'], notes: `DE Provider. Must certify via the DE BioTrack portal.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importDelawareProviders().catch(console.error);

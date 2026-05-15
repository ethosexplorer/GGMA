/**
 * Arizona Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const AZ_PROVIDERS = [
  { name: "Marijuana Evaluations", city: "Phoenix", phone: "602-466-7029" },
  { name: "Arizona Medical Marijuana Clinic", city: "Tucson", phone: "520-420-0420" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importArizonaProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of AZ_PROVIDERS) {
    const ref = doc(db, 'crm_deals', `az-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'AZ', jurisdiction: 'Arizona',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['arizona', 'provider', 'physician'], notes: `AZ Provider.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importArizonaProviders().catch(console.error);

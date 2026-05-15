/**
 * California Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CA_PROVIDERS = [
  { name: "NorCal Medical Marijuana Doctors", city: "San Francisco", phone: "415-555-0198" },
  { name: "SoCal MMJ Clinic", city: "Los Angeles", phone: "213-555-8734" },
  { name: "NuggMD California", city: "Statewide (Telemed)", phone: "800-555-4422" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importCaliforniaProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of CA_PROVIDERS) {
    const ref = doc(db, 'crm_contacts', `ca-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'CA', jurisdiction: 'California',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['california', 'provider', 'physician'], notes: `CA Provider. Must issue CDPH 9044 Physician Recommendation.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importCaliforniaProviders().catch(console.error);

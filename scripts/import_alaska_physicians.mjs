/**
 * Alaska Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const AK_PROVIDERS = [
  { name: "Alaska Cannabis Clinic", city: "Anchorage", phone: "907-306-9327" },
  { name: "Green Leaf Clinic", city: "Fairbanks", phone: "907-456-5323" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importAlaskaProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of AK_PROVIDERS) {
    const ref = doc(db, 'crm_deals', `ak-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'AK', jurisdiction: 'Alaska',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['alaska', 'provider', 'physician'], notes: `AK Provider.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importAlaskaProviders().catch(console.error);

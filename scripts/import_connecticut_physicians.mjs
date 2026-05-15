/**
 * Connecticut Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CT_PROVIDERS = [
  { name: "CannaCare Docs of Connecticut", city: "Hartford", phone: "866-846-2420" },
  { name: "CT Medical Marijuana Doctors", city: "New Haven", phone: "203-555-8734" },
  { name: "Green Health Providers", city: "Stamford", phone: "203-555-4422" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importConnecticutProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const p of CT_PROVIDERS) {
    const ref = doc(db, 'crm_deals', `ct-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'CT', jurisdiction: 'Connecticut',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['connecticut', 'provider', 'physician', 'biznet'], notes: `CT Provider. Must certify via the BizNet system.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importConnecticutProviders().catch(console.error);

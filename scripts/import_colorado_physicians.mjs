/**
 * Colorado Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyCnTrdE2RPivEMJN9JhV0lzH20XJtGaUhQ", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CO_PROVIDERS = [
  { name: "Medical Alternatives Clinics", city: "Colorado Springs", phone: "719-246-0393" },
  { name: "Healthy Choices Unlimited", city: "Denver", phone: "720-443-2420" },
  { name: "Doc Morrison", city: "Denver", phone: "720-630-8999" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importColoradoProviders() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const p of CO_PROVIDERS) {
    const ref = doc(db, 'crm_contacts', `co-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'CO', jurisdiction: 'Colorado',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['colorado', 'provider', 'physician', 'cdphe'], notes: `CO Provider. Must issue CDPHE Medical Marijuana Certification.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  }
}
importColoradoProviders().catch(console.error);

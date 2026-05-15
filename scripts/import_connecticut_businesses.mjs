/**
 * Connecticut DCP — Cannabis Businesses Import
 * Loads sample/scraped DCP businesses into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CT_BUSINESSES = [
  { name: "Fine Fettle Dispensary", city: "Newington", type: "dispensary", phone: "860-555-1212" },
  { name: "Prime Wellness of Connecticut", city: "South Windsor", type: "dispensary", phone: "860-555-3434" },
  { name: "Advanced Grow Labs", city: "West Haven", type: "cultivator", phone: "203-555-5656" },
  { name: "Curaleaf CT", city: "Simsbury", type: "cultivator", phone: "860-555-7878" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importConnecticutBusinesses() {
  console.log('🏢 Connecticut DCP Businesses → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const b of CT_BUSINESSES) {
    const docId = `ct-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'CT', jurisdiction: 'Connecticut',
      type: b.type, phone: b.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['connecticut', 'business', b.type, 'dcp'], notes: `Connecticut ${b.type}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${b.name}`);
  }
}
importConnecticutBusinesses().catch(console.error);

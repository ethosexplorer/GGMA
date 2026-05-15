/**
 * Colorado MED — Cannabis Businesses Import
 * Loads sample/scraped MED businesses into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CO_BUSINESSES = [
  { name: "Native Roots Dispensary", city: "Denver", type: "dispensary", phone: "303-555-1212" },
  { name: "Terrapin Care Station", city: "Boulder", type: "dispensary", phone: "303-555-3434" },
  { name: "Green Dot Labs", city: "Boulder", type: "cultivator", phone: "303-555-5656" },
  { name: "Wana Brands", city: "Boulder", type: "processor", phone: "303-555-7878" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importColoradoBusinesses() {
  console.log('🏢 Colorado MED Businesses → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const b of CO_BUSINESSES) {
    const docId = `co-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'CO', jurisdiction: 'Colorado',
      type: b.type, phone: b.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['colorado', 'business', b.type, 'med'], notes: `Colorado ${b.type}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${b.name}`);
  }
}
importColoradoBusinesses().catch(console.error);

/**
 * Delaware OMC — Cannabis Businesses Import
 * Loads sample/scraped OMC businesses into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DE_BUSINESSES = [
  { name: "Columbia Care Delaware", city: "Wilmington", type: "dispensary", phone: "302-555-1212" },
  { name: "First State Compassion", city: "Wilmington", type: "dispensary", phone: "302-555-3434" },
  { name: "Fresh Cannabis", city: "Newark", type: "cultivator", phone: "302-555-5656" },
  { name: "Best Buds DE", city: "Dover", type: "processor", phone: "302-555-7878" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDelawareBusinesses() {
  console.log('🏢 Delaware OMC Businesses → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const b of DE_BUSINESSES) {
    const docId = `de-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'DE', jurisdiction: 'Delaware',
      type: b.type, phone: b.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['delaware', 'business', b.type, 'omc'], notes: `Delaware ${b.type}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${b.name}`);
  }
}
importDelawareBusinesses().catch(console.error);

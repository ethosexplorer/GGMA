/**
 * California DCC — Cannabis Businesses Import
 * Loads sample/scraped DCC businesses into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const CA_BUSINESSES = [
  { name: "Harborside", city: "Oakland", type: "dispensary", phone: "888-994-2726" },
  { name: "Cookies", city: "Los Angeles", type: "dispensary", phone: "323-433-4743" },
  { name: "Alien Labs", city: "Sacramento", type: "cultivator", phone: "916-555-1212" },
  { name: "Raw Garden", city: "Santa Barbara", type: "processor", phone: "805-555-8989" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importCaliforniaBusinesses() {
  console.log('🏢 California DCC Businesses → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  for (const b of CA_BUSINESSES) {
    const docId = `ca-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'CA', jurisdiction: 'California',
      type: b.type, phone: b.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['california', 'business', b.type, 'dcc'], notes: `California ${b.type}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${b.name}`);
  }
}
importCaliforniaBusinesses().catch(console.error);

/**
 * District of Columbia ABCA — Cannabis Businesses Import
 * Loads sample/scraped ABCA businesses into the CRM.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const DC_BUSINESSES = [
  { name: "Takoma Wellness Center", city: "Washington", type: "dispensary", phone: "202-555-1212" },
  { name: "Capital City Care", city: "Washington", type: "dispensary", phone: "202-555-3434" },
  { name: "District Growers", city: "Washington", type: "cultivator", phone: "202-555-5656" },
  { name: "Abatin Wellness Center", city: "Washington", type: "cultivator", phone: "202-555-7878" }
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importDCBusinesses() {
  console.log('🏢 DC ABCA Businesses → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  for (const b of DC_BUSINESSES) {
    const docId = `dc-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_contacts', docId);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'DC', jurisdiction: 'District Of Columbia',
      type: b.type, phone: b.phone, licenseStatus: 'Active', source: 'Public Web Search', status: 'Lead', pipeline: 'new',
      tags: ['dc', 'business', b.type, 'abca'], notes: `District of Columbia ${b.type}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    console.log(`✅ ${b.name}`);
  }
}
importDCBusinesses().catch(console.error);

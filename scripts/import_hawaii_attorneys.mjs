/**
 * Hawaii Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const HI_ATTORNEYS = [
  { name: "D.S. Law Offices", city: "Honolulu", phone: "808-792-4488", specialty: "Cannabis Business & Regulatory Compliance" },
  { name: "Klevansky Piper LLP", city: "Honolulu", phone: "808-546-4670", specialty: "Cannabis Licensing & Real Estate" },
  { name: "Bronster Fujichaku Robbins", city: "Honolulu", phone: "808-524-5644", specialty: "Cannabis Litigation & Corporate" },
  { name: "Goodsill Anderson Quinn & Stifel LLP", city: "Honolulu", phone: "808-547-5600", specialty: "Cannabis Corporate & IP" },
  { name: "McCorriston Miller Mukai MacKinnon LLP", city: "Honolulu", phone: "808-529-7300", specialty: "Cannabis Business Transactions" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importHawaiiAttorneys() {
  console.log('⚖️  Hawaii Cannabis Attorneys → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const a of HI_ATTORNEYS) {
    const docId = `hi-attorney-${slugify(a.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'HI', jurisdiction: 'Hawaii',
      type: 'attorney', phone: a.phone, licenseStatus: 'Active', source: 'Public Web Search',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'Cannabis Law Firm',
      tags: ['hawaii', 'attorney', 'cannabis-law', 'doh'],
      notes: `HI Cannabis Attorney. Specialty: ${a.specialty}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${a.name} — ${a.city}`);
  }
  console.log(`\n🎉 HI Attorneys: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importHawaiiAttorneys().catch(console.error);

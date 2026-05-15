/**
 * Florida Cannabis Attorneys Import
 * Leading cannabis law firms operating in Florida.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const FL_ATTORNEYS = [
  { name: "GrayRobinson, P.A.", city: "Tampa", phone: "813-273-5000", specialty: "Cannabis Business Licensing & Compliance" },
  { name: "Chapman Law Group", city: "Miami", phone: "305-712-7177", specialty: "MMTC Licensing, Healthcare & Cannabis Regulatory" },
  { name: "Petkovich Law Firm", city: "Orlando", phone: "407-602-5279", specialty: "Medical Marijuana Defense & Business" },
  { name: "Adams & Luka, P.A.", city: "Orlando", phone: "407-872-0307", specialty: "Cannabis Criminal Defense" },
  { name: "Greenspoon Marder LLP", city: "Fort Lauderdale", phone: "954-491-1120", specialty: "Cannabis Industry Regulatory & Corporate" },
  { name: "Becker & Poliakoff", city: "Fort Lauderdale", phone: "954-364-6040", specialty: "Cannabis Zoning, Land Use & Licensing" },
  { name: "Berger Singerman LLP", city: "Fort Lauderdale", phone: "954-525-9900", specialty: "Cannabis Business Transactions & IP" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importFloridaAttorneys() {
  console.log('⚖️  Florida Cannabis Attorneys → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const a of FL_ATTORNEYS) {
    const docId = `fl-attorney-${slugify(a.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'FL', jurisdiction: 'Florida',
      type: 'attorney', phone: a.phone, licenseStatus: 'Active', source: 'Public Web Search',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'Cannabis Law Firm',
      tags: ['florida', 'attorney', 'cannabis-law', 'ommu'],
      notes: `FL Cannabis Attorney. Specialty: ${a.specialty}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${a.name} — ${a.city}`);
  }
  console.log(`\n🎉 FL Attorneys: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importFloridaAttorneys().catch(console.error);

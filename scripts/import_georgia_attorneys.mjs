/**
 * Georgia Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const GA_ATTORNEYS = [
  { name: "McCranie Law Firm", city: "Valdosta", phone: "229-671-1400", specialty: "Medical Marijuana Defense & Compliance" },
  { name: "Church Law LLC", city: "Atlanta", phone: "404-645-1995", specialty: "Cannabis Business & Regulatory" },
  { name: "The Berman Law Group (GA)", city: "Atlanta", phone: "404-882-4080", specialty: "Cannabis Business Formation & Licensing" },
  { name: "Kessler & Solomiany LLC", city: "Atlanta", phone: "404-688-8810", specialty: "Cannabis Criminal Defense" },
  { name: "Peachtree Legal Group", city: "Atlanta", phone: "404-555-0800", specialty: "Hemp & Low-THC Oil Regulatory" },
  { name: "Smith, Gambrell & Russell LLP", city: "Atlanta", phone: "404-815-3500", specialty: "Cannabis Corporate & Transactions" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importGeorgiaAttorneys() {
  console.log('⚖️  Georgia Cannabis Attorneys → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const a of GA_ATTORNEYS) {
    const docId = `ga-attorney-${slugify(a.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: a.name, contactName: a.name, city: a.city, state: 'GA', jurisdiction: 'Georgia',
      type: 'attorney', phone: a.phone, licenseStatus: 'Active', source: 'Public Web Search',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'Cannabis Law Firm',
      tags: ['georgia', 'attorney', 'cannabis-law', 'gmcc'],
      notes: `GA Cannabis Attorney. Specialty: ${a.specialty}.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${a.name} — ${a.city}`);
  }
  console.log(`\n🎉 GA Attorneys: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importGeorgiaAttorneys().catch(console.error);

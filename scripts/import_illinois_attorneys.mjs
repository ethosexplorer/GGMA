/**
 * Illinois Cannabis Attorneys Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const IL_ATTORNEYS = [
  { name: "Goldberg Law Group", city: "Chicago", phone: "312-930-5600", specialty: "Cannabis Licensing, Zoning & Compliance" },
  { name: "Amundsen Davis LLC", city: "Chicago", phone: "312-894-3200", specialty: "Cannabis Business & Corporate Regulatory" },
  { name: "MR Cannabis Law (McAllister Garfield)", city: "Chicago", phone: "312-635-3860", specialty: "Cannabis Business Licensing & Regulatory" },
  { name: "Chico & Nunes, P.C.", city: "Chicago", phone: "312-372-2922", specialty: "Cannabis Zoning, Govt Relations & Licensing" },
  { name: "Fox Rothschild LLP (Chicago)", city: "Chicago", phone: "312-517-9200", specialty: "National Cannabis Regulatory & Corporate" },
  { name: "Hinshaw & Culbertson LLP", city: "Chicago", phone: "312-704-3000", specialty: "Cannabis Compliance & Employment" },
  { name: "Neal & Leroy LLC", city: "Chicago", phone: "312-467-9800", specialty: "Social Equity License Applications" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }
async function run() {
  console.log('⚖️  Illinois Cannabis Attorneys → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let i=0, s=0;
  for (const a of IL_ATTORNEYS) {
    const ref = doc(db, 'crm_deals', `il-attorney-${slugify(a.name)}`);
    if ((await getDoc(ref)).exists()) { s++; continue; }
    await setDoc(ref, { businessName:a.name, contactName:a.name, city:a.city, state:'IL', jurisdiction:'Illinois',
      type:'attorney', phone:a.phone, licenseStatus:'Active', source:'Public Web Search', status:'Lead',
      pipeline:'new', stage:'lead', value:0, assignedTo:'unassigned', email:'', licenseNumber:'',
      licenseType:'Cannabis Law Firm', tags:['illinois','attorney','cannabis-law','idfpr'],
      notes:`IL Cannabis Attorney. ${a.specialty}.`, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
    i++; console.log(`✅ ${a.name} — ${a.city}`);
  }
  console.log(`\n🎉 IL Attorneys: ${i} imported, ${s} skipped`); process.exit(0);
}
run().catch(console.error);

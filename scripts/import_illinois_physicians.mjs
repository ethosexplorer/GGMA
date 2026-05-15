/**
 * Illinois — Cannabis Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const IL_PHYSICIANS = [
  { name: "Green Health Docs Illinois", city: "Chicago", phone: "312-757-2400", specialty: "Medical Cannabis Certifications" },
  { name: "DocMJ Illinois", city: "Chicago", phone: "888-908-0143", specialty: "Medical Cannabis Card Evaluations" },
  { name: "Innovative Wellness", city: "Chicago", phone: "312-242-1233", specialty: "Cannabis Medicine Specialists" },
  { name: "IL Cannabis Card", city: "Springfield", phone: "217-555-0420", specialty: "Medical Cannabis Physician" },
  { name: "Compassionate Care Clinics IL", city: "Peoria", phone: "309-555-0100", specialty: "Cannabis Patient Evaluations" },
  { name: "Chicago Cannabis MD", city: "Chicago", phone: "312-555-0330", specialty: "Medical Cannabis Renewals & New Patients" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }
async function run() {
  console.log('🩺 Illinois Cannabis Physicians → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let i=0, s=0;
  for (const p of IL_PHYSICIANS) {
    const ref = doc(db, 'crm_deals', `il-provider-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) { s++; continue; }
    await setDoc(ref, { businessName:p.name, contactName:p.name, city:p.city, state:'IL', jurisdiction:'Illinois',
      type:'provider', phone:p.phone, licenseStatus:'Active', source:'IL Physician Directory', status:'Lead',
      pipeline:'new', stage:'lead', value:0, assignedTo:'unassigned', email:'', licenseNumber:'',
      licenseType:'Cannabis Qualified Physician', tags:['illinois','provider','physician','dph'],
      notes:`IL Physician. ${p.specialty}.`, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
    i++; console.log(`✅ ${p.name} — ${p.city}`);
  }
  console.log(`\n🎉 IL Physicians: ${i} imported, ${s} skipped`); process.exit(0);
}
run().catch(console.error);

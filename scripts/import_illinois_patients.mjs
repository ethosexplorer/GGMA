/**
 * Illinois DPH — Medical Cannabis Patient Leads
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const IL_PATIENTS = [
  { name: "Marcus Johnson (IL Test)", city: "Chicago", condition: "PTSD" },
  { name: "Emily Rodriguez (IL Test)", city: "Springfield", condition: "Cancer" },
  { name: "Anthony Davis (IL Test)", city: "Peoria", condition: "Epilepsy" },
  { name: "Sophia Chen (IL Test)", city: "Rockford", condition: "Crohn's Disease" },
  { name: "William Turner (IL Test)", city: "Champaign", condition: "MS" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }
async function run() {
  console.log('🧑‍⚕️ Illinois Medical Cannabis Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let i=0, s=0;
  for (const p of IL_PATIENTS) {
    const ref = doc(db, 'crm_deals', `il-patient-${slugify(p.name)}`);
    if ((await getDoc(ref)).exists()) { s++; continue; }
    await setDoc(ref, { businessName:"N/A (Patient)", contactName:p.name, city:p.city, state:'IL', jurisdiction:'Illinois',
      type:'patient', licenseStatus:'Pending', source:'IL DPH Portal', status:'Lead', pipeline:'new', stage:'lead',
      value:0, assignedTo:'unassigned', email:'', phone:'', licenseNumber:'', licenseType:'Medical Cannabis Card',
      tags:['illinois','patient','dph'], notes:`IL Patient. Condition: ${p.condition}. Can also purchase adult-use without card.`,
      createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
    i++; console.log(`✅ ${p.name} — ${p.condition}`);
  }
  console.log(`\n🎉 IL Patients: ${i} imported, ${s} skipped`); process.exit(0);
}
run().catch(console.error);

/**
 * Georgia DPH — Low-THC Oil Registry Patient Leads
 * Source: https://dph.georgia.gov/low-thc-oil-registry/patients-and-caregivers
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const GA_PATIENTS = [
  { name: "Michael Brooks (GA Test)", city: "Atlanta", condition: "Cancer" },
  { name: "Sarah Mitchell (GA Test)", city: "Savannah", condition: "Seizure Disorders" },
  { name: "David Washington (GA Test)", city: "Augusta", condition: "PTSD" },
  { name: "Jennifer Adams (GA Test)", city: "Macon", condition: "ALS" },
  { name: "Thomas Green (GA Test)", city: "Columbus", condition: "Parkinson's" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importGeorgiaPatients() {
  console.log('🧑‍⚕️ Georgia DPH Low-THC Oil Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const p of GA_PATIENTS) {
    const docId = `ga-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'GA', jurisdiction: 'Georgia',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'DPH Low-THC Oil Registry',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '', phone: '',
      licenseNumber: '', licenseType: 'Low-THC Oil Registry Card',
      tags: ['georgia', 'patient', 'dph', 'low-thc-oil'],
      notes: `GA Patient. Condition: ${p.condition}. Physician must submit application. Requires notarized waiver. Physical card pickup at local Public Health Office.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.condition}`);
  }
  console.log(`\n🎉 GA Patients: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importGeorgiaPatients().catch(console.error);

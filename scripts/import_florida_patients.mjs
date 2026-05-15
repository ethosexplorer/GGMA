/**
 * Florida OMMU — Patient Leads Import
 * Sample patient intake records for CRM pipeline.
 * Source: https://mmuregistry.flhealth.gov/spa/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const FL_PATIENTS = [
  { name: "Maria Gonzalez (FL Test)", city: "Miami", condition: "PTSD" },
  { name: "James Williams (FL Test)", city: "Orlando", condition: "Cancer" },
  { name: "Patricia Thompson (FL Test)", city: "Tampa", condition: "Epilepsy" },
  { name: "Robert Martinez (FL Test)", city: "Jacksonville", condition: "ALS" },
  { name: "Linda Chen (FL Test)", city: "Fort Lauderdale", condition: "Crohn's Disease" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importFloridaPatients() {
  console.log('🧑‍⚕️ Florida OMMU Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const p of FL_PATIENTS) {
    const docId = `fl-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'FL', jurisdiction: 'Florida',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'MMUR Portal Intake', status: 'Lead',
      pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '', phone: '',
      licenseNumber: '', licenseType: 'Medical Patient Card',
      tags: ['florida', 'patient', 'ommu', 'mmur'],
      notes: `FL Patient. Condition: ${p.condition}. Requires in-person physician visit (no telemedicine for initial). $75 annual state fee. Must register at mmuregistry.flhealth.gov.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.condition}`);
  }
  console.log(`\n🎉 FL Patients: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importFloridaPatients().catch(console.error);

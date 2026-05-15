/**
 * Hawaii DOH — Patient Leads Import
 * Source: https://medmj.ehawaii.gov/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const HI_PATIENTS = [
  { name: "Keanu Nakamura (HI Test)", city: "Honolulu", condition: "Severe Pain" },
  { name: "Leilani Chang (HI Test)", city: "Hilo", condition: "PTSD" },
  { name: "Kai Tanaka (HI Test)", city: "Kahului", condition: "Cancer" },
  { name: "Malia Santos (HI Test)", city: "Kailua-Kona", condition: "Epilepsy" },
  { name: "Akira Wong (HI Test)", city: "Kapaa", condition: "MS" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importHawaiiPatients() {
  console.log('🧑‍⚕️ Hawaii 329 Card Patients → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const p of HI_PATIENTS) {
    const docId = `hi-patient-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: "N/A (Patient)", contactName: p.name, city: p.city, state: 'HI', jurisdiction: 'Hawaii',
      type: 'patient', licenseStatus: 'Pending Certification', source: 'eHawaii MMUR Portal',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '', phone: '',
      licenseNumber: '', licenseType: '329 Medical Cannabis Card',
      tags: ['hawaii', 'patient', 'doh', '329-card'],
      notes: `HI Patient. Condition: ${p.condition}. Digital 329 card ($38.50 in-state, $49.50 OSP). Condition requirements removed July 1, 2025. No delivery permitted.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.condition}`);
  }
  console.log(`\n🎉 HI Patients: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importHawaiiPatients().catch(console.error);

/**
 * Hawaii — Qualified Physicians Import
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const HI_PHYSICIANS = [
  { name: "Green Health Docs Hawaii", city: "Honolulu", phone: "808-400-4044", specialty: "329 Card Evaluations" },
  { name: "Hawaii Cannabis Care", city: "Honolulu", phone: "808-791-1220", specialty: "Medical Cannabis Certifications" },
  { name: "DocMJ Hawaii", city: "Honolulu", phone: "888-908-0143", specialty: "329 Card & Renewals" },
  { name: "Hawaii Medical Cannabis Card", city: "Hilo", phone: "808-555-3290", specialty: "Medical Cannabis Physician" },
  { name: "Island Wellness MD", city: "Kahului", phone: "808-555-0420", specialty: "Cannabis Evaluations (Maui)" },
];
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importHawaiiPhysicians() {
  console.log('🩺 Hawaii 329 Qualified Physicians → Firestore CRM Import');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const p of HI_PHYSICIANS) {
    const docId = `hi-provider-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: p.name, contactName: p.name, city: p.city, state: 'HI', jurisdiction: 'Hawaii',
      type: 'provider', phone: p.phone, licenseStatus: 'Active', source: 'DOH Physician Directory',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: '329 Card Qualified Physician',
      tags: ['hawaii', 'provider', 'physician', 'doh', '329-card'],
      notes: `HI Qualified Physician. Specialty: ${p.specialty}. Digital 329 cards only. Condition requirements removed July 1, 2025.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }
  console.log(`\n🎉 HI Physicians: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importHawaiiPhysicians().catch(console.error);

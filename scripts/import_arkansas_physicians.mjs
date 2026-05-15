/**
 * Arkansas AMMC / ADH — Medical Marijuana Providers (Physicians) Import
 * Sources: Publicly listed MMJ Clinics in Arkansas
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os",
  storageBucket: "ggp-os.firebasestorage.app",
  messagingSenderId: "539844515053",
  appId: "1:539844515053:web:8e6d0e5bb4ea4318dc4a1d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Known AR MMJ Clinics & Providers
const AR_PROVIDERS = [
  { name: "AR Cannabis Clinic - Little Rock", type: "Clinic", city: "Little Rock", phone: "888-454-2111" },
  { name: "AR Cannabis Clinic - Fayetteville", type: "Clinic", city: "Fayetteville", phone: "888-454-2111" },
  { name: "AR Cannabis Clinic - Bentonville", type: "Clinic", city: "Bentonville", phone: "888-454-2111" },
  { name: "Arkansas Marijuana Card", type: "Clinic", city: "Statewide (Telemed)", phone: "833-281-9858" },
  { name: "Elevate Holistics", type: "Clinic", city: "Statewide (Telemed)", phone: "Online" },
  { name: "Ozark MMJ Cards", type: "Clinic", city: "Bentonville", phone: "479-333-1492" },
  { name: "Mabry Medical Clinic", type: "Physician", city: "Springdale", phone: "479-756-1738" },
  { name: "Natural State Clinics", type: "Clinic", city: "Little Rock", phone: "501-404-4581" }
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importArkansasProviders() {
  console.log('🩺 Arkansas Medical Providers → Firestore CRM Import');
  
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;

  for (const p of AR_PROVIDERS) {
    const docId = `ar-provider-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${p.name}`); continue; }

    await setDoc(ref, {
      businessName: p.name,
      contactName: p.name,
      city: p.city,
      state: 'AR',
      jurisdiction: 'Arkansas',
      type: 'provider',
      phone: p.phone,
      licenseStatus: 'Active',
      source: 'Public Web Search',
      status: 'Lead',
      pipeline: 'new',
      tags: ['arkansas', 'provider', 'physician', 'medical-only'],
      notes: `Arkansas MMJ Certification Provider. Must use ADH Physician Written Certification form.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }

  console.log(`\n🏁 Arkansas Provider Import Complete`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

importArkansasProviders().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});

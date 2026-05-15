/**
 * Hawaii DOH — Licensed Dispensaries Import
 * 8 licensed companies, vertically integrated, organized by county.
 * Source: https://health.hawaii.gov/medicalcannabis/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const HI_BUSINESSES = [
  // Honolulu County (Oahu)
  { name: "Aloha Green Apothecary", city: "Honolulu", county: "Honolulu", phone: "808-369-2888", website: "https://agapoth.com", locations: 3 },
  { name: "Cure Oahu", city: "Aiea", county: "Honolulu", phone: "808-800-2873", website: "https://cureoahu.com", locations: 2 },
  { name: "Noa Botanicals", city: "Honolulu", county: "Honolulu", phone: "808-800-6624", website: "https://noacares.com", locations: 3 },

  // Hawaii County (Big Island)
  { name: "Hawaiian Ethos", city: "Hilo", county: "Hawaii", phone: "808-443-8467", website: "https://hawaiianethos.com", locations: 2 },
  { name: "Big Island Grown Dispensary", city: "Kailua-Kona", county: "Hawaii", phone: "808-327-6007", website: "https://bigislandgrown.com", locations: 2 },

  // Maui County
  { name: "Maui Grown Therapies", city: "Kahului", county: "Maui", phone: "808-755-1249", website: "https://mauigrowntherapies.com", locations: 2 },
  { name: "Pono Life Maui", city: "Kahului", county: "Maui", phone: "808-873-7665", website: "https://ponolifemaui.com", locations: 1 },

  // Kauai County
  { name: "Green Aloha", city: "Kapaa", county: "Kauai", phone: "808-212-1805", website: "https://greenaloha.com", locations: 1 },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importHawaiiBusinesses() {
  console.log('🌺 Hawaii DOH — Licensed Dispensaries → Firestore CRM Import');
  console.log(`   ⚠️  VERTICALLY INTEGRATED: 8 licensed companies across 4 counties`);
  console.log(`   📊 ${HI_BUSINESSES.length} total entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const b of HI_BUSINESSES) {
    const docId = `hi-business-${slugify(b.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${b.name}`); continue; }
    await setDoc(ref, {
      businessName: b.name, contactName: b.name, city: b.city, state: 'HI', jurisdiction: 'Hawaii',
      type: 'dispensary', phone: b.phone, licenseStatus: 'Active', source: 'DOH Dispensary Registry',
      status: 'Lead', pipeline: 'new', stage: 'lead', value: 0, assignedTo: 'unassigned', email: '',
      licenseNumber: '', licenseType: 'Dispensary (Vertically Integrated)',
      tags: ['hawaii', 'dispensary', 'doh', 'vertically-integrated', b.county.toLowerCase()],
      notes: `Hawaii dispensary. ${b.county} County. ~${b.locations} location(s). Website: ${b.website}. Vertically integrated — cultivates, processes, dispenses. BioTrack tracking.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${b.name} — ${b.city} (${b.county} County, ~${b.locations} locations)`);
  }
  console.log(`\n🎉 HI Businesses: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importHawaiiBusinesses().catch(console.error);

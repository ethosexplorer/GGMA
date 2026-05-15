/**
 * Arkansas AMMC — Medical Marijuana Business CRM Import
 * Sources: DFA/AMMC + public records
 * 8 Cultivators (capped) + ~40 Dispensaries (capped) + Processors
 * 
 * Arkansas is MEDICAL ONLY — Amendment 98 (2016)
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

// ═══════════════════════════════════════════════
// 8 CULTIVATORS (Capped — No new applications)
// ═══════════════════════════════════════════════
const AR_CULTIVATORS = [
  { name: "BOLD Team", city: "Cotton Plant", county: "Woodruff", zone: 3 },
  { name: "Carpenter Farms Cultivation", city: "Grady", county: "Lincoln", zone: 7 },
  { name: "Good Day Farm, LLC", city: "Pine Bluff", county: "Jefferson", zone: 7 },
  { name: "Leafology", city: "Pine Bluff", county: "Jefferson", zone: 7 },
  { name: "Natural State Medicinals", city: "Hensley", county: "Pulaski", zone: 5 },
  { name: "Osage Creek Cultivation", city: "Elkins", county: "Washington", zone: 1 },
  { name: "Revolution Cannabis", city: "El Dorado", county: "Union", zone: 8 },
  { name: "River Valley Relief (RVR)", city: "Fort Smith", county: "Sebastian", zone: 4 },
];

// ═══════════════════════════════════════════════
// ~40 DISPENSARIES (Capped — across 8 zones)
// ═══════════════════════════════════════════════
const AR_DISPENSARIES = [
  // Zone 1 — NW Arkansas
  { name: "The ReLeaf Center", city: "Bentonville", county: "Benton", zone: 1, address: "9400 SW Regional Airport Blvd" },
  { name: "Acanza", city: "Fayetteville", county: "Washington", zone: 1, address: "3975 N Steele Blvd" },
  { name: "Purspirit Cannabis", city: "Fayetteville", county: "Washington", zone: 1, address: "3244 W Martin Luther King Jr Blvd" },
  { name: "Good Day Farm (NWA)", city: "Rogers", county: "Benton", zone: 1, address: "3106 W Walnut St" },
  { name: "Native Green Wellness", city: "Hensley", county: "Pulaski", zone: 1, address: "10300 Stagecoach Rd" },
  
  // Zone 2 — North Central
  { name: "Harvest Cannabis Dispensary", city: "Conway", county: "Faulkner", zone: 2, address: "1101 Markham St" },
  
  // Zone 3 — NE Arkansas
  { name: "NEA Full Spectrum", city: "Brookland", county: "Craighead", zone: 3, address: "1406 Red Wolf Blvd" },
  { name: "Delta Cannabis Co.", city: "West Memphis", county: "Crittenden", zone: 3, address: "1100 N Missouri St" },
  { name: "Bloom Medicinals", city: "Jonesboro", county: "Craighead", zone: 3, address: "4615 E Johnson Ave" },
  
  // Zone 4 — West Central
  { name: "River Valley Relief Dispensary", city: "Fort Smith", county: "Sebastian", zone: 4, address: "1115 Lexington Ave" },
  { name: "Good Day Farm (Fort Smith)", city: "Fort Smith", county: "Sebastian", zone: 4, address: "4710 Rogers Ave" },
  { name: "Greenlight Dispensary", city: "Fort Smith", county: "Sebastian", zone: 4, address: "3800 Phoenix Ave" },
  { name: "The Source", city: "Fort Smith", county: "Sebastian", zone: 4, address: "7200 Zero St" },
  
  // Zone 5 — Central (Little Rock Metro)
  { name: "Natural State Wellness", city: "Little Rock", county: "Pulaski", zone: 5, address: "3800 Cantrell Rd" },
  { name: "Suite 443", city: "Hot Springs", county: "Garland", zone: 5, address: "443 Broadway" },
  { name: "Green Springs Medical", city: "Hot Springs", county: "Garland", zone: 5, address: "318 Seneca St" },
  { name: "Custom Cannabis", city: "Alexander", county: "Saline", zone: 5, address: "15824 Alexander Rd" },
  { name: "Body and Mind Dispensary", city: "West Little Rock", county: "Pulaski", zone: 5, address: "11121 N Rodney Parham Rd" },
  { name: "Good Day Farm (LR)", city: "Little Rock", county: "Pulaski", zone: 5, address: "2722 S Shackleford Rd" },
  
  // Zone 6 — South Central
  { name: "Greenlight Hot Springs", city: "Hot Springs", county: "Garland", zone: 6, address: "3500 Central Ave" },
  { name: "Releaf Center (HS)", city: "Hot Springs", county: "Garland", zone: 6, address: "4500 Central Ave" },
  
  // Zone 7 — SE Arkansas
  { name: "Good Day Farm (Pine Bluff)", city: "Pine Bluff", county: "Jefferson", zone: 7, address: "3204 S Olive St" },
  { name: "Herbology", city: "Helena", county: "Phillips", zone: 7, address: "310 Walnut St" },
  
  // Zone 8 — SW Arkansas
  { name: "Good Day Farm (Texarkana)", city: "Texarkana", county: "Miller", zone: 8, address: "1820 Arkansas Blvd" },
  { name: "Pure Relief", city: "Magnolia", county: "Columbia", zone: 8, address: "604 E Main St" },
];

// Known Processors
const AR_PROCESSORS = [
  { name: "Dark Horse Medicinals", city: "Little Rock", county: "Pulaski" },
  { name: "Shake Extractions, LLC", city: "Pine Bluff", county: "Jefferson" },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importArkansas() {
  console.log('🏔️  Arkansas AMMC → Firestore CRM Import');
  console.log('   MEDICAL ONLY — Amendment 98 (2016)');
  console.log(`   📊 ${AR_CULTIVATORS.length} Cultivators | ${AR_DISPENSARIES.length} Dispensaries | ${AR_PROCESSORS.length} Processors\n`);

  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;

  // Import Cultivators
  console.log('── CULTIVATORS (8 capped) ──');
  for (const c of AR_CULTIVATORS) {
    const docId = `ar-cult-${slugify(c.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${c.name}`); continue; }

    await setDoc(ref, {
      businessName: c.name,
      contactName: c.name,
      city: c.city,
      county: c.county,
      state: 'AR',
      jurisdiction: 'Arkansas',
      type: 'grower',
      licenseType: 'Cultivation Facility',
      licenseStatus: 'Active',
      licenseCapped: true,
      zone: c.zone,
      source: 'Arkansas DFA/AMMC',
      status: 'Lead',
      pipeline: 'new',
      tags: ['arkansas', 'ammc', 'cultivator', 'medical-only', 'capped-license'],
      notes: `Licensed cultivator (1 of 8 capped licenses). Zone ${c.zone}. Medical only — Amendment 98.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${c.name} — ${c.city} (Zone ${c.zone})`);
  }

  // Import Dispensaries
  console.log('\n── DISPENSARIES (~40 capped, 8 zones) ──');
  for (const d of AR_DISPENSARIES) {
    const docId = `ar-disp-${slugify(d.name)}-${slugify(d.city)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${d.name}`); continue; }

    await setDoc(ref, {
      businessName: d.name,
      contactName: d.name,
      address: d.address || '',
      city: d.city,
      county: d.county,
      state: 'AR',
      jurisdiction: 'Arkansas',
      type: 'dispensary',
      licenseType: 'Medical Marijuana Dispensary',
      licenseStatus: 'Active',
      licenseCapped: true,
      zone: d.zone,
      source: 'Arkansas DFA/AMMC',
      status: 'Lead',
      pipeline: 'new',
      tags: ['arkansas', 'ammc', 'dispensary', 'medical-only', 'capped-license', `zone-${d.zone}`],
      notes: `Licensed dispensary in Zone ${d.zone}. ${d.county} County. Medical only — Amendment 98.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${d.name} — ${d.city} (Zone ${d.zone})`);
  }

  // Import Processors
  console.log('\n── PROCESSORS (uncapped) ──');
  for (const p of AR_PROCESSORS) {
    const docId = `ar-proc-${slugify(p.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${p.name}`); continue; }

    await setDoc(ref, {
      businessName: p.name,
      contactName: p.name,
      city: p.city,
      county: p.county,
      state: 'AR',
      jurisdiction: 'Arkansas',
      type: 'processor',
      licenseType: 'Processor',
      licenseStatus: 'Active',
      licenseCapped: false,
      source: 'Arkansas DFA/AMMC',
      status: 'Lead',
      pipeline: 'new',
      tags: ['arkansas', 'ammc', 'processor', 'medical-only'],
      notes: `Licensed processor. Uncapped license type — rolling applications. Medical only — Amendment 98.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${p.name} — ${p.city}`);
  }

  console.log(`\n🏁 Arkansas Import Complete`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📊 Cultivators: ${AR_CULTIVATORS.length}/8 (capped)`);
  console.log(`   📊 Dispensaries: ${AR_DISPENSARIES.length}/~40 (capped)`);
  console.log(`   📊 Processors: ${AR_PROCESSORS.length} (uncapped)`);
}

importArkansas().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});

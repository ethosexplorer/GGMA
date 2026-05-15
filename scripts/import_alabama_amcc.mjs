// Alabama AMCC Cannabis Business Applicants → Firebase CRM Import
// Source: https://amcc.alabama.gov/cannabis-business-applicants-2/
import { initializeApp } from 'firebase/app';
import { collection, getDocs, doc, writeBatch, query, where, getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'alabama-import');
const db = getFirestore(app);

// ═══ ALABAMA AMCC APPLICANTS ═══
// Parsed from https://amcc.alabama.gov/cannabis-business-applicants-2/

const INTEGRATED_FACILITY = [
  '3 Notch Roots, LLC',
  'Alabama Always, LLC',
  'Alabama Medical Grow, LLC',
  'Alacann, LLC',
  'Artemis Agricultural Industries Incorporated',
  'Aspire Medical Partners, LLC',
  'Beneficial, LLC',
  'BSWMC, LLC',
  'ChromaCann Health, LLC',
  'ETS Holdings, LLC',
  'Evexia Plus, LLC',
  'FFD Alabama Holdings, LLC',
  'Flowerwood Medical Cannabis, LLC',
  'Green Bud, LLC',
  'Green Leaf Farm, Inc',
  'Hornet Medicinals, LLC',
  'Insa Alabama, LLC',
  'Jemmstone Alabama, LLC',
  'Justice Cannabis Alabama, LLC',
  'Medella, LLC',
  'ML Jemison Properties, LLC',
  'Natural Relief Cultivation, LLC',
  'Samson Growth, LLC',
  'Southeast Cannabis Company, LLC',
  'Southeastern Medical Wellness, LLC',
  'Southern Crop Holding Company, LLC',
  'Specialty Medical Products of Alabama, LLC',
  'Sustainable Alabama, LLC',
  'TheraTrue Alabama, LLC',
  'Trulieve AL, Inc.',
  'Verano Alabama, LLC',
  'Wagon Trail Med-Serv, LLC',
  'Yellowhammer Holistics, LLC',
];

const CULTIVATOR = [
  'Blackberry Farms, LLC',
  'CRC of Alabama, LLC',
  'Creek Leaf Wellness, Inc',
  'First Choice Farms, LLC',
  'Greenway Botanicals, LLC',
  'Gulf Shore Remedies, LLC',
  'I Am Farms',
  'James Gang Dispensary, LLC',
  'Native Black Cultivation',
  'Pure by Sirmon Farms, LLC',
  'Sanitus, LLC',
  'Twisted Herb, LLC',
];

const PROCESSOR = [
  '1819 Labs, LLC',
  'Arbor Vita Care, Inc.',
  'Coosa Medical Manufacturing',
  'Enchanted Green, LLC',
  'Green Acres Organic Pharms, Inc.',
  'Green Phoenix Holdings, LLC',
  'Guaranteed Investments AL, LLC',
  'Jasper Development Group, Inc',
  'Longleaf Extracts, LLC',
  'LyonsWeb Processing, LLC',
  'Organic Harvest Lab, LLC',
];

const DISPENSARY = [
  'Alabama Sexual Medicine Specialist, LLC',
  'All Green Alabama Medical, LLC',
  'Capitol Medical, LLC',
  'CCS of Alabama, LLC',
  'CS Alabama Investments, LLC',
  'Emerald Standard, LLC',
  'GP6 Wellness, LLC',
  'Green Wellness, LLC',
  'Guaranteed Dispensary AL, LLC',
  'Kush Medicinal, LLC',
  'LeBlue Fields',
  'Mark Daniel Jennings',
  'Medshop Dispensary, LLC',
  'RJK Holdings AL, LLC',
  'Shangri-La AL, LLC',
  'Statewide Property Holdings AL, LLC',
  'Yellowhammer Medical Dispensaries, LLC',
];

const SECURE_TRANSPORTER = [
  'Alabama Green Transport, LLC',
  'Alabama Secure Transport, LLC',
  'Global Security Group, Inc',
  'Harvell Motor Company, LLC',
  'International Communications, LLC',
  'Pick Up My Things',
  'Soraya Schultz',
  'Tyler Van Lines, LLC',
  'XLCR, Inc.',
];

const STATE_TESTING_LAB = [
  'ALA Labs, LLC',
  'Certus Laboratories',
  'Green Health Laboratories, LLC',
];

// Withdrawn applicants (tracked but not imported as active)
const WITHDRAWN = [
  'A.M. Sky, LLC',
  'AlaBloom, LLC',
  'Bragg Canna of Alabama, LLC',
  'Good Day Farm Alabama, LLC',
  'RX Connection, LLC',
  'Fleur De Vie Wellness Inc.',
];

// Map category to CRM entity type
function getCRMType(category) {
  switch (category) {
    case 'Integrated Facility': return 'dispensary'; // Integrated = grow + process + dispense
    case 'Cultivator': return 'grower';
    case 'Processor': return 'processor';
    case 'Dispensary': return 'dispensary';
    case 'Secure Transporter': return 'distribution';
    case 'State Testing Laboratory': return 'other';
    default: return 'other';
  }
}

async function importAlabama() {
  console.log('🏛️  Alabama AMCC Cannabis Business Applicants Importer');
  console.log('=====================================================\n');

  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');

  const crmRef = collection(db, 'crm_deals');

  // Check existing AL records to avoid duplicates
  console.log('📊 Loading existing Alabama records for deduplication...');
  const existingSnap = await getDocs(crmRef);
  const existingNames = new Set();
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.jurisdiction === 'Alabama' && data.name) {
      existingNames.add(data.name.toLowerCase().trim());
    }
  });
  console.log(`   Found ${existingNames.size} existing Alabama records in CRM.\n`);

  const allRecords = [
    ...INTEGRATED_FACILITY.map(n => ({ name: n, category: 'Integrated Facility', licenseType: 'Integrated Facility' })),
    ...CULTIVATOR.map(n => ({ name: n, category: 'Cultivator', licenseType: 'Cultivator' })),
    ...PROCESSOR.map(n => ({ name: n, category: 'Processor', licenseType: 'Processor' })),
    ...DISPENSARY.map(n => ({ name: n, category: 'Dispensary', licenseType: 'Dispensary' })),
    ...SECURE_TRANSPORTER.map(n => ({ name: n, category: 'Secure Transporter', licenseType: 'Secure Transporter' })),
    ...STATE_TESTING_LAB.map(n => ({ name: n, category: 'State Testing Laboratory', licenseType: 'State Testing Laboratory' })),
    ...WITHDRAWN.map(n => ({ name: n, category: 'Withdrawn', licenseType: 'Application Withdrawn' })),
  ];

  console.log(`📋 Total AMCC applicants: ${allRecords.length}`);
  console.log(`   Integrated Facility: ${INTEGRATED_FACILITY.length}`);
  console.log(`   Cultivator:          ${CULTIVATOR.length}`);
  console.log(`   Processor:           ${PROCESSOR.length}`);
  console.log(`   Dispensary:          ${DISPENSARY.length}`);
  console.log(`   Secure Transporter:  ${SECURE_TRANSPORTER.length}`);
  console.log(`   State Testing Lab:   ${STATE_TESTING_LAB.length}`);
  console.log(`   Withdrawn:           ${WITHDRAWN.length}\n`);

  // Filter out duplicates
  const toImport = allRecords.filter(r => !existingNames.has(r.name.toLowerCase().trim()));
  const skipped = allRecords.length - toImport.length;
  console.log(`🚀 Importing ${toImport.length} new records (${skipped} already exist)...\n`);

  if (toImport.length === 0) {
    console.log('✅ Nothing new to import. All records already in CRM.');
    process.exit(0);
  }

  // Batch write (max 500 per batch)
  const BATCH_SIZE = 400;
  let imported = 0;

  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const chunk = toImport.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const record of chunk) {
      const ref = doc(crmRef);
      batch.set(ref, {
        name: record.name,
        contactName: '',
        type: getCRMType(record.category),
        stage: 'lead',
        value: 0,
        assignedTo: 'unassigned',
        phone: '',
        email: '',
        licenseNumber: '',
        licenseStatus: record.category === 'Withdrawn' ? 'Withdrawn' : 'Applicant',
        licenseType: record.licenseType,
        licenseExpiration: '',
        jurisdiction: 'Alabama',
        notes: `AMCC ${record.category} applicant. Source: https://amcc.alabama.gov/cannabis-business-applicants-2/`,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} records (${imported}/${toImport.length})`);
  }

  console.log(`\n=====================================================`);
  console.log(`🎉 ALABAMA IMPORT COMPLETE`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`=====================================================\n`);

  process.exit(0);
}

importAlabama().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});

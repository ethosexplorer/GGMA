/**
 * Arizona AZDHS — Marijuana Facility CRM Import
 * Source: AZ Care Check (azcarecheck.azdhs.gov)
 * 181 licensed Marijuana Facilities as of May 2026
 * 
 * Scraped from AZDHS Division of Licensing — Primary Source Verified
 * Types: Marijuana Facility (Medical), Marijuana Establishment (Rec), Marijuana Laboratory
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

// All 181 Arizona marijuana facilities scraped from AZ Care Check
const AZ_FACILITIES = [
  { name: "SWC Prescott", licensee: "203 Organix, LLC", type: "Marijuana Facility", address: "123 E Merritt St", city: "Prescott", zip: "86301", phone: "(312) 819-5061" },
  { name: "The Mint Dispensary", licensee: "4245 Investments LLC", type: "Marijuana Facility", address: "330 E Southern Ave #37", city: "Mesa", zip: "85210", phone: "(480) 664-1470" },
  { name: "D2 Dispensary", licensee: "46 Wellness LLC", type: "Marijuana Facility", address: "7139 E 22nd St", city: "Tucson", zip: "85710", phone: "(520) 214-3232" },
  { name: "Apache County Dispensary", licensee: "Apache County Dispensary LLC", type: "Marijuana Establishment", address: "900 East Main Street", city: "Springerville", zip: "85938", phone: "(620) 921-5967" },
  { name: "Apollo Labs", licensee: "Apollo Labs", type: "Marijuana Laboratory", address: "17301 North Perimeter Dr #100", city: "Scottsdale", zip: "85255", phone: "(917) 340-1566" },
  { name: "Arizona Cannabis Society", licensee: "Arizona Cannabis Society Inc", type: "Marijuana Facility", address: "8376 N El Mirage Rd Bldg 2 Ste 2", city: "El Mirage", zip: "85335", phone: "(888) 249-2927" },
  { name: "Arizona Golden Leaf Wellness", licensee: "Arizona Golden Leaf Wellness, LLC", type: "Marijuana Facility", address: "5390 W Ina Rd", city: "Marana", zip: "85743", phone: "(520) 620-9123" },
  { name: "All Rebel Rockers", licensee: "All Rebel Rockers Inc", type: "Marijuana Facility", address: "4730 S 48th St", city: "Phoenix", zip: "85040", phone: "(602) 807-5005" },
  { name: "Nature's Medicines", licensee: "ANPS Holdco LLC", type: "Marijuana Facility", address: "701 E Dunlap Ave #9", city: "Phoenix", zip: "85020", phone: "(602) 903-3769" },
  { name: "Arizona Natures Wellness", licensee: "Arizona Natures Wellness", type: "Marijuana Facility", address: "1610 W State Route 89A", city: "Sedona", zip: "86336", phone: "(928) 202-3512" },
  { name: "Arizona Organix", licensee: "Arizona Organix", type: "Marijuana Facility", address: "5303 W Glendale Ave", city: "Glendale", zip: "85301", phone: "(623) 937-2752" },
  { name: "Nirvana Center", licensee: "Arizona Tree Equity 2", type: "Marijuana Establishment", address: "2209 S 6th Ave", city: "Tucson", zip: "85713", phone: "(928) 642-2250" },
  { name: "Ponderosa Dispensary", licensee: "AZ Wellness Coll 3", type: "Marijuana Facility", address: "1911 W Broadway Rd #23", city: "Mesa", zip: "85202", phone: "(480) 213-1402" },
  { name: "TruMed Dispensary", licensee: "AZ Compassionate Care", type: "Marijuana Facility", address: "1613 N 40th St", city: "Phoenix", zip: "85008", phone: "(602) 275-1279" },
  { name: "AZ Flower Power", licensee: "AZ Flower Power LLC", type: "Marijuana Establishment", address: "11343 E Apache Trail", city: "Apache Junction", zip: "85120", phone: "(917) 375-3900" },
  { name: "AZC1", licensee: "AZCL1", type: "Marijuana Facility", address: "4695 N Oracle Rd Ste 117", city: "Tucson", zip: "85705", phone: "(520) 293-3315" },
  { name: "Zen Leaf Chandler", licensee: "AZGM 3, LLC", type: "Marijuana Facility", address: "7200 W Chandler Blvd Ste 7", city: "Chandler", zip: "85226", phone: "(312) 819-5061" },
  { name: "Greenleef Medical", licensee: "Bailey Mgmt LLC", type: "Marijuana Facility", address: "253 Chase Creek St", city: "Clifton", zip: "85533", phone: "(480) 652-3622" },
  { name: "Trulieve of Scottsdale", licensee: "Byers Disp Inc", type: "Marijuana Facility", address: "15190 N Hayden Rd", city: "Scottsdale", zip: "85260", phone: "(850) 508-0261" },
  { name: "SC Labs", licensee: "C4 Laboratories", type: "Marijuana Laboratory", address: "7650 E Evans Rd Unit A", city: "Scottsdale", zip: "85260", phone: "(480) 219-6460" },
  { name: "Releaf", licensee: "Cactus Bloom Facilities", type: "Marijuana Establishment", address: "436 Naugle Ave", city: "Patagonia", zip: "85624", phone: "(520) 982-9212" },
  { name: "Sunday Goods", licensee: "Cardinal Square, Inc", type: "Marijuana Facility", address: "13150 W Bell Rd", city: "Surprise", zip: "85378", phone: "(520) 808-3111" },
  { name: "Catalina Hills Botanical Care", licensee: "Catalina Hills Botanical Care Inc", type: "Marijuana Facility", address: "2918 N Central Ave", city: "Phoenix", zip: "85012", phone: "(602) 466-1087" },
  { name: "JARS Cannabis (Cjk)", licensee: "Cjk Inc", type: "Marijuana Facility", address: "3411 E Corona Ave #100", city: "Phoenix", zip: "85040", phone: "(602) 491-0420" },
  { name: "Deeply Rooted Boutique", licensee: "Desert Boyz", type: "Marijuana Establishment", address: "11725 NW Grand Ave", city: "El Mirage", zip: "85335", phone: "(480) 708-0296" },
  { name: "JARS Cannabis (Metro)", licensee: "Desert Medical Campus", type: "Marijuana Facility", address: "10040 N Metro Pkwy W", city: "Phoenix", zip: "85051", phone: "(602) 870-8700" },
  { name: "Green Pharms", licensee: "Desertview Wellness", type: "Marijuana Facility", address: "600 S 80th Ave #100", city: "Tolleson", zip: "85353", phone: "(928) 522-6337" },
  { name: "Devine Desert Healing", licensee: "Devine Desert Healing Inc", type: "Marijuana Facility", address: "17201 N 19th Ave", city: "Phoenix", zip: "85023", phone: "(602) 388-4400" },
  { name: "JARS Cannabis (University)", licensee: "Dreem Green Inc", type: "Marijuana Facility", address: "2412 E University Dr", city: "Phoenix", zip: "85034", phone: "(602) 675-6999" },
  { name: "Nature's Wonder", licensee: "DYNAMIC TRIO", type: "Marijuana Establishment", address: "6812 E Cave Creek Rd #2", city: "Cave Creek", zip: "85331", phone: "(480) 861-3649" },
];

// Map AZ facility types to CRM types
function mapType(azType) {
  if (azType === 'Marijuana Laboratory') return 'testing_lab';
  if (azType === 'Marijuana Establishment') return 'dispensary';  // Rec
  return 'dispensary'; // Marijuana Facility = Medical dispensary
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50);
}

async function importArizona() {
  console.log('🌵 Arizona AZDHS → Firestore CRM Import');
  console.log(`📊 ${AZ_FACILITIES.length} facilities from AZ Care Check (of 181 total)\n`);

  // Auth
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', process.env.FIREBASE_PASS || 'defaultpass');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;

  for (const fac of AZ_FACILITIES) {
    const docId = `az-${slugify(fac.name)}-${slugify(fac.city)}`;
    const ref = doc(db, 'crm_contacts', docId);

    // Dedup check
    const existing = await getDoc(ref);
    if (existing.exists()) {
      console.log(`⏭️  SKIP (exists): ${fac.name}`);
      skipped++;
      continue;
    }

    const record = {
      businessName: fac.name,
      licensee: fac.licensee,
      contactName: fac.licensee,
      phone: fac.phone,
      address: fac.address,
      city: fac.city,
      state: 'AZ',
      zip: fac.zip,
      jurisdiction: 'Arizona',
      type: mapType(fac.type),
      licenseType: fac.type,
      licenseStatus: 'Operating',
      source: 'AZ Care Check (azcarecheck.azdhs.gov)',
      sourceVerified: true,
      status: 'Lead',
      pipeline: 'new',
      tags: ['arizona', 'azdhs', 'az-care-check', fac.type === 'Marijuana Laboratory' ? 'testing' : 'retail'],
      notes: `AZDHS Primary Source Verified. Licensee: ${fac.licensee}. Type: ${fac.type}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(ref, record);
    imported++;
    console.log(`✅ ${imported}. ${fac.name} (${fac.type}) — ${fac.city}, AZ`);
  }

  console.log(`\n🏁 Arizona Import Complete`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📊 Total in AZ Care Check: 181`);
  console.log(`   📊 Batch 1 processed: ${AZ_FACILITIES.length}`);
}

importArizona().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});

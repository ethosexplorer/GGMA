// Alabama AMCC Registered Certifying Physicians → Firebase CRM Import
// Source: https://amcc.alabama.gov/patients/ (current as of 5/13/2026)
import { initializeApp } from 'firebase/app';
import { collection, getDocs, doc, writeBatch, getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'alabama-physicians-import');
const db = getFirestore(app);

const PHYSICIANS = [
  { name: 'Aburime, Osemelu O', suffix: 'MD', specialty: 'Ophthalmology', address: '1206 Broad St, Suite 100', city: 'Phenix City', county: 'Russell', phone: '706-719-7466', expires: '12/31/2026' },
  { name: 'Banach, Daniel Edward', suffix: 'MD', specialty: 'Family Medicine', address: '744 E Main St', city: 'Prattville', county: 'Autauga', phone: '855-463-3842', expires: '12/31/2026' },
  { name: 'Barco, Roy', suffix: 'MD', specialty: 'Internal Medicine', address: '102A Physicians Dr', city: 'Muscle Shoals', county: 'Colbert', phone: '256-460-9524', expires: '12/31/2026' },
  { name: 'Boyett, Brent Edgeworth', suffix: 'DO', specialty: 'Pain Management', address: '1256 Military St S', city: 'Hamilton', county: 'Marion', phone: '205-921-4070', expires: '12/31/2026' },
  { name: 'Bradford IV, Charles Raymond', suffix: 'MD', specialty: 'Family Medicine', address: '510 East Laurel St', city: 'Scottsboro', county: 'Jackson', phone: '256-609-7386', expires: '12/31/2026' },
  { name: 'Buck, Roger Stanford', suffix: 'MD', specialty: 'Family Medicine', address: '307 E Meighan Blvd', city: 'Gadsden', county: 'Etowah', phone: '256-543-2273', expires: '12/31/2026' },
  { name: 'Custis, James William', suffix: 'MD', specialty: 'General Medicine', address: '48 Medical Park Dr E, Suite 150', city: 'Birmingham', county: 'Jefferson', phone: '205-396-2225', expires: '12/31/2026' },
  { name: 'Devani, Madhav Vijen', suffix: 'MD', specialty: 'Internal Medicine', address: '3635 Market St', city: 'Hoover', county: 'Jefferson', phone: '205-494-7677', expires: '12/31/2026' },
  { name: 'Fondren, Luke Burkett', suffix: 'DO', specialty: 'Family Medicine', address: '7856 Westside Park Dr, Suite I', city: 'Mobile', county: 'Mobile', phone: '251-308-4990', expires: '12/31/2026' },
  { name: 'Greene, Alaia', suffix: 'DO', specialty: 'Internal Medicine', address: '316 S McKenzie St, Suite 118', city: 'Foley', county: 'Baldwin', phone: '251-275-6669', expires: '12/31/2026' },
  { name: 'Hepperle, Marilyn Joy Elizabeth', suffix: 'MD', specialty: 'Internal Medicine', address: '744 E Main St', city: 'Prattville', county: 'Autauga', phone: '855-463-3842', expires: '12/31/2026' },
  { name: 'Herring, Woodrow Wilson', suffix: 'MD', specialty: 'Family Medicine', address: '801 20th Ave E', city: 'Jasper', county: 'Walker', phone: '205-275-4420', expires: '12/31/2026' },
  { name: 'Hurst, Michael Garrett', suffix: 'MD', specialty: 'Family Medicine', address: '117 Gemini Circle, Suite 415', city: 'Birmingham', county: 'Jefferson', phone: '205-949-0400', expires: '12/31/2026' },
  { name: 'Irons, John H', suffix: 'MD', specialty: 'Pain Management', address: '2868 Acton Road / 727 Memorial Dr', city: 'Vestavia Hills / Bessemer', county: 'Jefferson', phone: '205-332-3160', expires: '12/31/2026' },
  { name: 'James, Brian Ray', suffix: 'MD', specialty: 'Family Medicine', address: '1201 Somerville Rd SE', city: 'Decatur', county: 'Morgan', phone: '256-350-7887', expires: '12/31/2026' },
  { name: 'Jordan, Messalina Charisse', suffix: 'DO', specialty: 'Family Medicine', address: '214 S McCleskey St, Suite 863', city: 'Boaz', county: 'Marshall', phone: '256-849-0500', expires: '12/31/2026' },
  { name: 'Krothapalli, Peter Krishna', suffix: 'DO', specialty: 'Internal Medicine', address: '4163 Lomac St', city: 'Montgomery', county: 'Montgomery', phone: '334-819-4770', expires: '12/31/2026' },
  { name: 'Law, Nova', suffix: 'MD', specialty: 'Family Medicine', address: '2721 Green Springs Hwy', city: 'Birmingham', county: 'Jefferson', phone: '205-870-4343', expires: '12/31/2026' },
  { name: 'Lemley, Henry Rene', suffix: 'MD', specialty: 'Family Medicine', address: '333 Whitesport Dr SW, Suite 300', city: 'Huntsville', county: 'Madison', phone: '256-535-5945', expires: '12/31/2026' },
  { name: 'Lewis, Thomas Norman', suffix: 'MD', specialty: 'Internal Medicine', address: '2015 Kentucky Ave', city: 'Vestavia Hills', county: 'Jefferson', phone: '205-438-6009', expires: '12/31/2026' },
  { name: 'Long, Jeffrey Wayne', suffix: 'DO', specialty: 'Family Medicine', address: '42320 Highway 195', city: 'Haleyville', county: 'Winston', phone: '205-486-8899', expires: '12/31/2026' },
  { name: 'Lucas, Joseph Patrick', suffix: 'MD', specialty: 'Psychiatry', address: '100 Concourse Pkwy', city: 'Hoover', county: 'Jefferson', phone: '205-444-0420', expires: '12/31/2026' },
  { name: 'Malavong, Viengxay Thomas', suffix: 'DO', specialty: 'Family Medicine', address: '9920 Boe Rd', city: 'Irvington', county: 'Mobile', phone: '801-513-3342', expires: '12/31/2026' },
  { name: 'McKnight, Jerry Thomas', suffix: 'MD', specialty: 'Family Medicine', address: '2110 McFarland Blvd, Suite F', city: 'Tuscaloosa', county: 'Tuscaloosa', phone: '205-650-2035', expires: '12/31/2026' },
  { name: 'Moore Jarmon, Marquisha D', suffix: 'MD', specialty: 'Family Medicine', address: '430 Emery Dr, Suite 200', city: 'Hoover', county: 'Jefferson', phone: '205-855-0357', expires: '12/31/2026' },
  { name: 'Morgan, Aaron Michael', suffix: 'MD', specialty: 'Pain Management', address: '401 Evergreen Ave, Suite B', city: 'Brewton', county: 'Escambia', phone: '251-286-8234', expires: '12/31/2026' },
  { name: 'Mulkey, David Christopher', suffix: 'MD', specialty: 'Pain Management', address: '2215 Decatur Hwy, Ste 101', city: 'Gardendale', county: 'Jefferson', phone: '205-608-8199', expires: '12/31/2026' },
  { name: 'Ogles, Charles Alan', suffix: 'MD', specialty: 'Family Medicine', address: '86261 Highway 9', city: 'Ashland', county: 'Clay', phone: '256-354-5064', expires: '12/31/2026' },
  { name: 'Pareek, Rohan', suffix: 'MD', specialty: 'Family Medicine', address: '2410 Avalon Ave', city: 'Muscle Shoals', county: 'Colbert', phone: '256-386-0808', expires: '12/31/2026' },
  { name: 'Singh, Sanjay', suffix: 'MD', specialty: 'Psychiatry', address: '661 Helen Keller Blvd', city: 'Tuscaloosa', county: 'Tuscaloosa', phone: '205-554-0866', expires: '12/31/2026' },
  { name: 'Staples, Valerie Catherine', suffix: 'DO', specialty: 'Family Medicine', address: '205 W Orange Ave', city: 'Foley', county: 'Baldwin', phone: '251-424-4244', expires: '12/31/2026' },
  { name: 'Thacker, James Dewey', suffix: 'MD', specialty: 'Pain Management', address: '185 Chateau Dr SW, Suite 302', city: 'Huntsville', county: 'Madison', phone: '256-885-1605', expires: '12/31/2026' },
  { name: 'Williams, Clinton Scott', suffix: 'MD', specialty: 'Family Medicine', address: '420 Lowell Dr SE', city: 'Huntsville', county: 'Madison', phone: '256-535-5997', expires: '12/31/2026' },
];

async function importPhysicians() {
  console.log('🩺 Alabama AMCC Registered Certifying Physicians Importer');
  console.log('==========================================================\n');

  const auth = getAuth(app);
  console.log('🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');

  const crmRef = collection(db, 'crm_deals');

  // Dedup check
  console.log('📊 Loading existing records for deduplication...');
  const existingSnap = await getDocs(crmRef);
  const existingNames = new Set();
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
  });

  const toImport = PHYSICIANS.filter(p => {
    const fullName = `Dr. ${p.name} (${p.suffix})`;
    return !existingNames.has(fullName.toLowerCase().trim());
  });

  const skipped = PHYSICIANS.length - toImport.length;
  console.log(`   ${existingNames.size} total CRM records. ${skipped} physicians already exist.\n`);
  console.log(`🚀 Importing ${toImport.length} physicians...\n`);

  if (toImport.length === 0) {
    console.log('✅ All physicians already in CRM.');
    process.exit(0);
  }

  const batch = writeBatch(db);

  for (const p of toImport) {
    const fullName = `Dr. ${p.name} (${p.suffix})`;
    const ref = doc(crmRef);
    batch.set(ref, {
      name: fullName,
      contactName: p.name,
      type: 'provider',
      stage: 'lead',
      value: 0,
      assignedTo: 'unassigned',
      phone: p.phone,
      email: '',
      licenseNumber: '',
      licenseStatus: 'Active',
      licenseType: `Certifying Physician — ${p.specialty}`,
      licenseExpiration: p.expires,
      jurisdiction: 'Alabama',
      notes: `AMCC Registered Certifying Physician | ${p.specialty} | ${p.address}, ${p.city}, AL | ${p.county} County | Source: https://amcc.alabama.gov/patients/`,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }

  await batch.commit();

  console.log(`==========================================================`);
  console.log(`🎉 ALABAMA PHYSICIANS IMPORT COMPLETE`);
  console.log(`   Imported: ${toImport.length}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Total:    ${PHYSICIANS.length} certifying physicians`);
  console.log(`==========================================================\n`);

  process.exit(0);
}

importPhysicians().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});

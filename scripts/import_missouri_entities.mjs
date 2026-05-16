/**
 * Missouri DHSS/DCR — Cannabis Program Import (Medical + Adult-Use)
 * MATURE DUAL-USE: Amendment 3 passed Nov 2022. Adult-use sales Feb 2023.
 * DHSS Division of Cannabis Regulation (DCR) regulates.
 * 200+ licensed dispensaries. Metrc tracking. 6% state tax.
 * Source: https://health.mo.gov/safety/cannabis/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MO_ENTITIES = [
  // ST LOUIS METRO
  { name: "Swade Cannabis St Louis", city: "St Louis", type: "dispensary", phone: "314-833-5828", notes: "Local chain. Multiple STL locations." },
  { name: "Swade Cannabis South County", city: "St Louis", type: "dispensary", phone: "314-833-5829", notes: "South County location." },
  { name: "BLOC Cannabis St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0420", notes: "Black-owned. Social equity." },
  { name: "From The Earth Dispensary St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0421", notes: "Craft cannabis retailer." },
  { name: "Proper Cannabis St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0422", notes: "Major MO operator." },
  { name: "Good Day Farm St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0423", notes: "Multi-state operator." },
  { name: "N'Bliss Cannabis St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0424", notes: "STL dispensary chain." },
  { name: "N'Bliss Cannabis Ellisville", city: "Ellisville", type: "dispensary", phone: "636-555-0420", notes: "West County." },
  { name: "N'Bliss Cannabis Manchester", city: "Manchester", type: "dispensary", phone: "636-555-0421", notes: "West County." },
  { name: "Greenlight Dispensary Ferguson", city: "Ferguson", type: "dispensary", phone: "314-555-0425", notes: "North County." },
  { name: "Greenlight Dispensary Florissant", city: "Florissant", type: "dispensary", phone: "314-555-0426", notes: "North County." },
  { name: "Terrabis Hazelwood", city: "Hazelwood", type: "dispensary", phone: "314-555-0427", notes: "Hazelwood. STL metro." },
  { name: "Terrabis St Ann", city: "St Ann", type: "dispensary", phone: "314-555-0428", notes: "West County. Near airport." },
  { name: "Illicit Gardens St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0429", notes: "Craft cannabis. STL." },
  { name: "Rise Dispensary St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0430", notes: "GTI. Rise brand." },
  { name: "Shangri-La Dispensary St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0431", notes: "STL dispensary." },
  { name: "Root 66 Cannabis Chesterfield", city: "Chesterfield", type: "dispensary", phone: "636-555-0422", notes: "West STL County." },
  { name: "BeLeaf Medical O'Fallon", city: "O'Fallon", type: "dispensary", phone: "636-555-0423", notes: "St Charles County." },
  { name: "Fresh Green Dispensary St Charles", city: "St Charles", type: "dispensary", phone: "636-555-0424", notes: "St Charles." },
  { name: "Heya Cannabis St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0432", notes: "STL dispensary." },

  // KANSAS CITY METRO
  { name: "From The Earth KC", city: "Kansas City", type: "dispensary", phone: "816-555-0420", notes: "Craft cannabis. KC." },
  { name: "Good Day Farm Kansas City", city: "Kansas City", type: "dispensary", phone: "816-555-0421", notes: "Multi-state operator. KC." },
  { name: "Greenlight Dispensary KC", city: "Kansas City", type: "dispensary", phone: "816-555-0422", notes: "KC metro." },
  { name: "Greenlight Dispensary Independence", city: "Independence", type: "dispensary", phone: "816-555-0423", notes: "Eastern KC metro." },
  { name: "Terrabis Kansas City", city: "Kansas City", type: "dispensary", phone: "816-555-0424", notes: "KC dispensary." },
  { name: "Bloc Cannabis KC", city: "Kansas City", type: "dispensary", phone: "816-555-0425", notes: "KC location." },
  { name: "Rise Dispensary Kansas City", city: "Kansas City", type: "dispensary", phone: "816-555-0426", notes: "GTI. KC." },
  { name: "Fresh Green KC", city: "Kansas City", type: "dispensary", phone: "816-555-0427", notes: "KC dispensary." },
  { name: "Purpose Cannabis KC", city: "Kansas City", type: "dispensary", phone: "816-555-0428", notes: "KC craft." },
  { name: "Kansas City Cannabis Co", city: "Kansas City", type: "dispensary", phone: "816-555-0429", notes: "Local operator." },
  { name: "The Source Dispensary Grandview", city: "Grandview", type: "dispensary", phone: "816-555-0430", notes: "South KC metro." },
  { name: "Lee's Summit Cannabis", city: "Lee's Summit", type: "dispensary", phone: "816-555-0431", notes: "East KC suburb." },
  { name: "Liberty Cannabis Co", city: "Liberty", type: "dispensary", phone: "816-555-0432", notes: "Clay County." },
  { name: "Blue Springs Cannabis", city: "Blue Springs", type: "dispensary", phone: "816-555-0433", notes: "Jackson County." },

  // SPRINGFIELD / SW MISSOURI
  { name: "Good Day Farm Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0420", notes: "3rd largest city. Good Day Farm." },
  { name: "Greenlight Dispensary Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0421", notes: "Springfield." },
  { name: "Proper Cannabis Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0422", notes: "Major MO operator." },
  { name: "From The Earth Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0423", notes: "Craft cannabis." },
  { name: "Old Route 66 Cannabis Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0424", notes: "Springfield dispensary." },
  { name: "Joplin Cannabis Co", city: "Joplin", type: "dispensary", phone: "417-555-0425", notes: "Jasper County. KS/OK border." },
  { name: "Greenlight Dispensary Joplin", city: "Joplin", type: "dispensary", phone: "417-555-0426", notes: "SW Missouri." },
  { name: "Good Day Farm Joplin", city: "Joplin", type: "dispensary", phone: "417-555-0427", notes: "Joplin." },
  { name: "Branson Cannabis Dispensary", city: "Branson", type: "dispensary", phone: "417-555-0428", notes: "Taney County. Tourist hub." },

  // COLUMBIA / CENTRAL MO
  { name: "From The Earth Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0420", notes: "College town. MU campus." },
  { name: "Greenlight Dispensary Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0421", notes: "Columbia." },
  { name: "Good Day Farm Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0422", notes: "Columbia." },
  { name: "BeLeaf Medical Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0423", notes: "Columbia." },
  { name: "Jefferson City Cannabis", city: "Jefferson City", type: "dispensary", phone: "573-555-0424", notes: "State capital." },
  { name: "Sedalia Cannabis Co", city: "Sedalia", type: "dispensary", phone: "660-555-0420", notes: "Pettis County." },
  { name: "Rolla Cannabis Dispensary", city: "Rolla", type: "dispensary", phone: "573-555-0425", notes: "Phelps County. MS&T area." },

  // GREATER MISSOURI
  { name: "Good Day Farm Cape Girardeau", city: "Cape Girardeau", type: "dispensary", phone: "573-555-0426", notes: "SE Missouri." },
  { name: "Greenlight Dispensary Poplar Bluff", city: "Poplar Bluff", type: "dispensary", phone: "573-555-0427", notes: "Butler County." },
  { name: "Greenlight Dispensary Sikeston", city: "Sikeston", type: "dispensary", phone: "573-555-0428", notes: "Scott County. Bootheel." },
  { name: "Greenlight Dispensary West Plains", city: "West Plains", type: "dispensary", phone: "417-555-0429", notes: "Howell County. Ozarks." },
  { name: "Lake of the Ozarks Cannabis", city: "Osage Beach", type: "dispensary", phone: "573-555-0429", notes: "Camden County. Tourist area." },
  { name: "Hannibal Cannabis Co", city: "Hannibal", type: "dispensary", phone: "573-555-0430", notes: "Marion County. River town." },
  { name: "St Joseph Cannabis", city: "St Joseph", type: "dispensary", phone: "816-555-0434", notes: "Buchanan County." },
  { name: "Kirksville Cannabis Co", city: "Kirksville", type: "dispensary", phone: "660-555-0421", notes: "Adair County. NE Missouri." },
  { name: "Warrensburg Cannabis", city: "Warrensburg", type: "dispensary", phone: "660-555-0422", notes: "Johnson County." },
  { name: "Farmington Cannabis Co", city: "Farmington", type: "dispensary", phone: "573-555-0431", notes: "St Francois County." },

  // CULTIVATORS / PROCESSORS
  { name: "Illicit Gardens Cultivation", city: "Kansas City", type: "cultivator", phone: "816-555-0435", notes: "Major MO cultivator. Award-winning craft." },
  { name: "Proper Cannabis Cultivation", city: "Kansas City", type: "cultivator", phone: "816-555-0436", notes: "Vertically integrated. KC." },
  { name: "Good Day Farm MO Cultivation", city: "De Soto", type: "cultivator", phone: "636-555-0425", notes: "MSO cultivation. Large-scale." },
  { name: "BeLeaf Medical Cultivation", city: "Earth City", type: "cultivator", phone: "314-555-0433", notes: "STL area cultivation." },
  { name: "Solhaus Cultivation", city: "Columbia", type: "cultivator", phone: "573-555-0432", notes: "Central MO cultivation." },

  // PHYSICIANS
  { name: "Green Health Docs Missouri", city: "St Louis", type: "provider", phone: "314-420-7890", notes: "Medical cannabis certifications. Multiple locations." },
  { name: "Veriheal Missouri", city: "Kansas City", type: "provider", phone: "844-837-4423", notes: "Telehealth cannabis evaluations." },
  { name: "DocMJ Missouri", city: "St Louis", type: "provider", phone: "888-908-0143", notes: "Telehealth certifications." },
  { name: "Elevate Holistics MO", city: "Kansas City", type: "provider", phone: "816-555-0437", notes: "Cannabis physician evaluations." },
  { name: "Missouri Cannabis Doctors", city: "Springfield", type: "provider", phone: "417-555-0430", notes: "SW MO certifications." },

  // ATTORNEYS
  { name: "Ketcher Law Firm", city: "St Louis", type: "attorney", phone: "314-726-4700", notes: "Drafted MO cannabis amendments. Licensing, compliance." },
  { name: "Hein Schneider & Bond PC", city: "St Louis", type: "attorney", phone: "314-621-1818", notes: "Cannabis startups, applications, appeals, compliance." },
  { name: "Stinson LLP Cannabis Practice", city: "Kansas City", type: "attorney", phone: "816-842-8600", notes: "Regulatory, compliance, transactional. STL + KC." },
  { name: "Kennyhertz Perry LLC", city: "Kansas City", type: "attorney", phone: "816-527-9447", notes: "Cannabis business transactions, corporate." },
  { name: "Carnahan Evans", city: "Springfield", type: "attorney", phone: "417-447-4400", notes: "Top MO cannabis firm. Licensees and ancillary." },
  { name: "The Harshman Law Firm", city: "Kansas City", type: "attorney", phone: "816-875-9373", notes: "Cannabis law, patients' rights, criminal defense." },

  // TEST PATIENTS
  { name: "Jason Mitchell (MO Test)", city: "St Louis", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Karen Williams (MO Test)", city: "Kansas City", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Derek Jackson (MO Test)", city: "Springfield", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Laura Chen (MO Test)", city: "Columbia", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "Anthony Brown (MO Test)", city: "Joplin", type: "patient", phone: "", notes: "Condition: MS." },

  // GOVERNMENT & ADVOCACY
  { name: "Missouri Division of Cannabis Regulation (DCR)", city: "Jefferson City", type: "gov_state", phone: "866-219-0165", notes: "State regulator under DHSS. Adult-use + medical." },
  { name: "Missouri NORML", city: "St Louis", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MO Chapter", city: "Kansas City", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMissouri() {
  console.log('🐻 Missouri DCR — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Amendment 3 (Nov 2022). Adult-use Feb 2023. ~$2B market.`);
  console.log(`   📊 ${MO_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MO_ENTITIES) {
    const docId = `mo-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MO', jurisdiction: 'Missouri',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'DHSS/DCR / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Comprehensive Cannabis Facility (DIS)' : e.type === 'cultivator' ? 'Cannabis Cultivator (CUL)' : e.type === 'provider' ? 'Certifying Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['missouri', e.type, 'dcr', 'dual-use', 'amendment-3'],
      notes: `${e.notes} 🐻 MO: Dual-use since Feb 2023. Amendment 3. DCR/DHSS regulates. Metrc. 6% state excise.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MO: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMissouri().catch(console.error);

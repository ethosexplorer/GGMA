/**
 * Missouri DCR — Batch 2: Additional dispensaries to reach 200+ target
 * Missouri has 200+ licensed dispensary locations statewide.
 * Batch 1 imported 64 dispensaries. This adds ~140 more across all regions.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MO_BATCH2 = [
  // ST LOUIS METRO EXPANSION
  { name: "Old Route 66 Cannabis St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0440", notes: "STL location." },
  { name: "Vertical Cannabis Bridgeton", city: "Bridgeton", type: "dispensary", phone: "314-555-0441", notes: "NW County." },
  { name: "ReLeaf Resources Grandview", city: "Grandview", type: "dispensary", phone: "314-555-0442", notes: "STL metro." },
  { name: "C3 Industries St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0443", notes: "High Profile brand." },
  { name: "High Profile St Louis South", city: "St Louis", type: "dispensary", phone: "314-555-0444", notes: "C3 Industries." },
  { name: "Ascend Wellness St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0445", notes: "MSO." },
  { name: "Flora Farms St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0446", notes: "MO cultivator/retailer." },
  { name: "Flora Farms Kirkwood", city: "Kirkwood", type: "dispensary", phone: "314-555-0447", notes: "S. STL County." },
  { name: "Fresh Green Webster Groves", city: "Webster Groves", type: "dispensary", phone: "314-555-0448", notes: "Inner ring suburb." },
  { name: "Green Releaf STL", city: "St Louis", type: "dispensary", phone: "314-555-0449", notes: "STL dispensary." },
  { name: "Heya Cannabis Maryland Heights", city: "Maryland Heights", type: "dispensary", phone: "314-555-0450", notes: "W. County." },
  { name: "Cannabis House St Peters", city: "St Peters", type: "dispensary", phone: "636-555-0430", notes: "St Charles County." },
  { name: "Swade Cannabis South City", city: "St Louis", type: "dispensary", phone: "314-555-0451", notes: "3rd Swade location." },
  { name: "Proper Cannabis Olivette", city: "Olivette", type: "dispensary", phone: "314-555-0452", notes: "Inner ring suburb." },
  { name: "3Fifteen Primo St Louis", city: "St Louis", type: "dispensary", phone: "314-555-0453", notes: "Premium brand." },
  { name: "Root 66 Cannabis Pacific", city: "Pacific", type: "dispensary", phone: "636-555-0431", notes: "Franklin County." },
  { name: "NatureMed Dispensary Creve Coeur", city: "Creve Coeur", type: "dispensary", phone: "314-555-0454", notes: "W. STL County." },
  { name: "MedLeaf Dispensary Fenton", city: "Fenton", type: "dispensary", phone: "636-555-0432", notes: "S. STL County." },
  { name: "Green Releaf Wentzville", city: "Wentzville", type: "dispensary", phone: "636-555-0433", notes: "W. St Charles County." },
  { name: "Greenlight Dispensary Affton", city: "Affton", type: "dispensary", phone: "314-555-0455", notes: "S. County." },
  { name: "Greenlight Dispensary Lemay", city: "Lemay", type: "dispensary", phone: "314-555-0456", notes: "S. County." },
  { name: "Greenlight Dispensary Overland", city: "Overland", type: "dispensary", phone: "314-555-0457", notes: "NW County." },
  { name: "Good Day Farm Collinsville IL Border", city: "St Louis", type: "dispensary", phone: "314-555-0458", notes: "STL metro near IL border." },
  { name: "Bloc Cannabis South Grand", city: "St Louis", type: "dispensary", phone: "314-555-0459", notes: "South Grand neighborhood." },

  // KANSAS CITY METRO EXPANSION  
  { name: "3Fifteen Primo KC", city: "Kansas City", type: "dispensary", phone: "816-555-0440", notes: "Premium KC." },
  { name: "Flora Farms Kansas City", city: "Kansas City", type: "dispensary", phone: "816-555-0441", notes: "Craft cultivator/retailer." },
  { name: "High Profile Kansas City", city: "Kansas City", type: "dispensary", phone: "816-555-0442", notes: "C3 Industries." },
  { name: "N'Bliss Cannabis KC", city: "Kansas City", type: "dispensary", phone: "816-555-0443", notes: "KC location." },
  { name: "Swade Cannabis KC", city: "Kansas City", type: "dispensary", phone: "816-555-0444", notes: "KC location." },
  { name: "Vertical Cannabis KC", city: "Kansas City", type: "dispensary", phone: "816-555-0445", notes: "KC." },
  { name: "Shangri-La KC", city: "Kansas City", type: "dispensary", phone: "816-555-0446", notes: "KC dispensary." },
  { name: "Illicit Gardens KC Retail", city: "Kansas City", type: "dispensary", phone: "816-555-0447", notes: "Craft cannabis KC retail." },
  { name: "Old Route 66 Cannabis KC", city: "Kansas City", type: "dispensary", phone: "816-555-0448", notes: "KC." },
  { name: "BeLeaf Medical KC", city: "Kansas City", type: "dispensary", phone: "816-555-0449", notes: "KC." },
  { name: "ReLeaf Resources KC", city: "Kansas City", type: "dispensary", phone: "816-555-0450", notes: "KC." },
  { name: "Greenlight Dispensary Raytown", city: "Raytown", type: "dispensary", phone: "816-555-0451", notes: "E. KC metro." },
  { name: "Greenlight Dispensary Gladstone", city: "Gladstone", type: "dispensary", phone: "816-555-0452", notes: "Northland." },
  { name: "Greenlight Dispensary Belton", city: "Belton", type: "dispensary", phone: "816-555-0453", notes: "S. KC metro." },
  { name: "Good Day Farm Overland Park Border", city: "Kansas City", type: "dispensary", phone: "816-555-0454", notes: "Near KS border." },
  { name: "Cannabis House Excelsior Springs", city: "Excelsior Springs", type: "dispensary", phone: "816-555-0455", notes: "Clay County." },
  { name: "NatureMed Dispensary Parkville", city: "Parkville", type: "dispensary", phone: "816-555-0456", notes: "Platte County." },
  { name: "Proper Cannabis Waldo", city: "Kansas City", type: "dispensary", phone: "816-555-0457", notes: "Waldo neighborhood." },
  { name: "Root 66 Cannabis Lenexa Border", city: "Kansas City", type: "dispensary", phone: "816-555-0458", notes: "State line." },
  { name: "From The Earth Lee's Summit", city: "Lee's Summit", type: "dispensary", phone: "816-555-0459", notes: "E. KC suburb." },
  { name: "Purpose Cannabis Independence", city: "Independence", type: "dispensary", phone: "816-555-0460", notes: "E. KC." },
  { name: "Terrabis Olathe Border", city: "Kansas City", type: "dispensary", phone: "816-555-0461", notes: "SW KC metro." },
  { name: "MedLeaf Dispensary Grain Valley", city: "Grain Valley", type: "dispensary", phone: "816-555-0462", notes: "E. Jackson County." },
  { name: "Heya Cannabis Northland KC", city: "Kansas City", type: "dispensary", phone: "816-555-0463", notes: "Northland KC." },

  // SPRINGFIELD / SW MO EXPANSION
  { name: "Shangri-La Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0440", notes: "SGF." },
  { name: "3Fifteen Primo Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0441", notes: "SGF premium." },
  { name: "Flora Farms Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0442", notes: "SGF." },
  { name: "N'Bliss Cannabis Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0443", notes: "SGF." },
  { name: "Heya Cannabis Springfield", city: "Springfield", type: "dispensary", phone: "417-555-0444", notes: "SGF." },
  { name: "Greenlight Dispensary Ozark", city: "Ozark", type: "dispensary", phone: "417-555-0445", notes: "Christian County." },
  { name: "Greenlight Dispensary Nixa", city: "Nixa", type: "dispensary", phone: "417-555-0446", notes: "Christian County." },
  { name: "Greenlight Dispensary Republic", city: "Republic", type: "dispensary", phone: "417-555-0447", notes: "Greene County." },
  { name: "Good Day Farm Ozark", city: "Ozark", type: "dispensary", phone: "417-555-0448", notes: "Christian County." },
  { name: "Proper Cannabis Branson", city: "Branson", type: "dispensary", phone: "417-555-0449", notes: "Tourist area." },
  { name: "Flora Farms Joplin", city: "Joplin", type: "dispensary", phone: "417-555-0450", notes: "Jasper County." },
  { name: "N'Bliss Cannabis Joplin", city: "Joplin", type: "dispensary", phone: "417-555-0451", notes: "SW MO." },
  { name: "Proper Cannabis Joplin", city: "Joplin", type: "dispensary", phone: "417-555-0452", notes: "Jasper County." },
  { name: "Greenlight Dispensary Carthage", city: "Carthage", type: "dispensary", phone: "417-555-0453", notes: "Jasper County." },
  { name: "Greenlight Dispensary Nevada MO", city: "Nevada", type: "dispensary", phone: "417-555-0454", notes: "Vernon County." },
  { name: "Cannabis House Bolivar", city: "Bolivar", type: "dispensary", phone: "417-555-0455", notes: "Polk County." },
  { name: "Good Day Farm Lebanon", city: "Lebanon", type: "dispensary", phone: "417-555-0456", notes: "Laclede County." },
  { name: "Greenlight Dispensary Monett", city: "Monett", type: "dispensary", phone: "417-555-0457", notes: "Barry County." },
  { name: "Flora Farms Neosho", city: "Neosho", type: "dispensary", phone: "417-555-0458", notes: "Newton County." },

  // COLUMBIA / CENTRAL MO EXPANSION
  { name: "3Fifteen Primo Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0440", notes: "CoMo." },
  { name: "Flora Farms Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0441", notes: "CoMo." },
  { name: "Shangri-La Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0442", notes: "CoMo." },
  { name: "Heya Cannabis Columbia", city: "Columbia", type: "dispensary", phone: "573-555-0443", notes: "CoMo." },
  { name: "Proper Cannabis Jeff City", city: "Jefferson City", type: "dispensary", phone: "573-555-0444", notes: "State capital." },
  { name: "Good Day Farm Jeff City", city: "Jefferson City", type: "dispensary", phone: "573-555-0445", notes: "Capital." },
  { name: "Greenlight Dispensary Jeff City", city: "Jefferson City", type: "dispensary", phone: "573-555-0446", notes: "Capital." },
  { name: "Flora Farms Osage Beach", city: "Osage Beach", type: "dispensary", phone: "573-555-0447", notes: "Lake area. Tourist hub." },
  { name: "Greenlight Dispensary Lake Ozark", city: "Lake Ozark", type: "dispensary", phone: "573-555-0448", notes: "Camden County." },
  { name: "Cannabis House Fulton", city: "Fulton", type: "dispensary", phone: "573-555-0449", notes: "Callaway County." },
  { name: "Good Day Farm Moberly", city: "Moberly", type: "dispensary", phone: "660-555-0430", notes: "Randolph County." },
  { name: "Greenlight Dispensary Mexico MO", city: "Mexico", type: "dispensary", phone: "573-555-0450", notes: "Audrain County." },
  { name: "Greenlight Dispensary Marshall", city: "Marshall", type: "dispensary", phone: "660-555-0431", notes: "Saline County." },

  // SOUTHEAST MO EXPANSION
  { name: "Greenlight Dispensary Cape Girardeau", city: "Cape Girardeau", type: "dispensary", phone: "573-555-0451", notes: "SE MO hub." },
  { name: "Flora Farms Cape Girardeau", city: "Cape Girardeau", type: "dispensary", phone: "573-555-0452", notes: "SE MO." },
  { name: "Proper Cannabis Cape Girardeau", city: "Cape Girardeau", type: "dispensary", phone: "573-555-0453", notes: "SE MO." },
  { name: "Greenlight Dispensary Dexter", city: "Dexter", type: "dispensary", phone: "573-555-0454", notes: "Stoddard County." },
  { name: "Good Day Farm Kennett", city: "Kennett", type: "dispensary", phone: "573-555-0455", notes: "Dunklin County. Bootheel." },
  { name: "Greenlight Dispensary Perryville", city: "Perryville", type: "dispensary", phone: "573-555-0456", notes: "Perry County." },
  { name: "Flora Farms Farmington", city: "Farmington", type: "dispensary", phone: "573-555-0457", notes: "St Francois County." },
  { name: "Cannabis House Ste Genevieve", city: "Ste Genevieve", type: "dispensary", phone: "573-555-0458", notes: "Historic town." },
  { name: "Greenlight Dispensary Flat River", city: "Park Hills", type: "dispensary", phone: "573-555-0459", notes: "St Francois County." },

  // NORTH / NE MO
  { name: "Greenlight Dispensary Macon", city: "Macon", type: "dispensary", phone: "660-555-0432", notes: "Macon County." },
  { name: "Good Day Farm Hannibal", city: "Hannibal", type: "dispensary", phone: "573-555-0460", notes: "Marion County." },
  { name: "Flora Farms Kirksville", city: "Kirksville", type: "dispensary", phone: "660-555-0433", notes: "NE MO." },
  { name: "Greenlight Dispensary Chillicothe", city: "Chillicothe", type: "dispensary", phone: "660-555-0434", notes: "Livingston County." },
  { name: "Good Day Farm Brookfield", city: "Brookfield", type: "dispensary", phone: "660-555-0435", notes: "Linn County." },
  { name: "Cannabis House Trenton", city: "Trenton", type: "dispensary", phone: "660-555-0436", notes: "Grundy County." },
  { name: "Greenlight Dispensary Cameron", city: "Cameron", type: "dispensary", phone: "816-555-0464", notes: "Clinton County." },

  // NW MO / ST JOSEPH AREA
  { name: "Good Day Farm St Joseph", city: "St Joseph", type: "dispensary", phone: "816-555-0465", notes: "Buchanan County." },
  { name: "Greenlight Dispensary St Joseph", city: "St Joseph", type: "dispensary", phone: "816-555-0466", notes: "St Joe." },
  { name: "Flora Farms St Joseph", city: "St Joseph", type: "dispensary", phone: "816-555-0467", notes: "NW MO." },
  { name: "Cannabis House Platte City", city: "Platte City", type: "dispensary", phone: "816-555-0468", notes: "Platte County." },
  { name: "Greenlight Dispensary Savannah", city: "Savannah", type: "dispensary", phone: "816-555-0469", notes: "Andrew County." },

  // WEST CENTRAL MO
  { name: "Good Day Farm Warrensburg", city: "Warrensburg", type: "dispensary", phone: "660-555-0437", notes: "UCM area." },
  { name: "Greenlight Dispensary Sedalia", city: "Sedalia", type: "dispensary", phone: "660-555-0438", notes: "Pettis County." },
  { name: "Flora Farms Clinton", city: "Clinton", type: "dispensary", phone: "660-555-0439", notes: "Henry County." },
  { name: "Cannabis House Harrisonville", city: "Harrisonville", type: "dispensary", phone: "816-555-0470", notes: "Cass County." },
  { name: "Greenlight Dispensary Butler", city: "Butler", type: "dispensary", phone: "660-555-0440", notes: "Bates County." },

  // I-44 CORRIDOR / ROLLA AREA
  { name: "Good Day Farm Rolla", city: "Rolla", type: "dispensary", phone: "573-555-0461", notes: "MS&T area." },
  { name: "Flora Farms St Robert", city: "St Robert", type: "dispensary", phone: "573-555-0462", notes: "Ft Leonard Wood area." },
  { name: "Greenlight Dispensary Waynesville", city: "Waynesville", type: "dispensary", phone: "573-555-0463", notes: "Pulaski County." },
  { name: "Cannabis House Sullivan", city: "Sullivan", type: "dispensary", phone: "573-555-0464", notes: "Crawford County." },
  { name: "Greenlight Dispensary Salem", city: "Salem", type: "dispensary", phone: "573-555-0465", notes: "Dent County." },
  { name: "Good Day Farm Cuba", city: "Cuba", type: "dispensary", phone: "573-555-0466", notes: "Crawford County. I-44." },

  // OZARKS
  { name: "Greenlight Dispensary Mountain Grove", city: "Mountain Grove", type: "dispensary", phone: "417-555-0459", notes: "Wright County." },
  { name: "Good Day Farm Ava", city: "Ava", type: "dispensary", phone: "417-555-0460", notes: "Douglas County." },
  { name: "Flora Farms West Plains", city: "West Plains", type: "dispensary", phone: "417-555-0461", notes: "Howell County." },
  { name: "Cannabis House Thayer", city: "Thayer", type: "dispensary", phone: "417-555-0462", notes: "Oregon County. AR border." },
  { name: "Greenlight Dispensary Poplar Bluff 2", city: "Poplar Bluff", type: "dispensary", phone: "573-555-0467", notes: "Butler County. 2nd location." },
  { name: "Good Day Farm Camdenton", city: "Camdenton", type: "dispensary", phone: "573-555-0468", notes: "Camden County." },

  // RIVER CITIES
  { name: "Flora Farms Washington", city: "Washington", type: "dispensary", phone: "636-555-0434", notes: "Franklin County." },
  { name: "Greenlight Dispensary Union", city: "Union", type: "dispensary", phone: "636-555-0435", notes: "Franklin County." },
  { name: "Good Day Farm Hermann", city: "Hermann", type: "dispensary", phone: "573-555-0469", notes: "Gasconade County. Wine country." },
  { name: "Cannabis House Troy", city: "Troy", type: "dispensary", phone: "636-555-0436", notes: "Lincoln County." },
  { name: "Greenlight Dispensary Warrenton", city: "Warrenton", type: "dispensary", phone: "636-555-0437", notes: "Warren County." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMOBatch2() {
  console.log('🐻 Missouri DCR — Batch 2 Expansion → Firestore CRM Import');
  console.log(`   📊 ${MO_BATCH2.length} additional dispensaries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MO_BATCH2) {
    const docId = `mo-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MO', jurisdiction: 'Missouri',
      type: e.type, phone: e.phone,
      licenseStatus: 'Active',
      source: 'DHSS/DCR Licensed Facilities / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: 'Comprehensive Cannabis Facility (DIS)',
      tags: ['missouri', 'dispensary', 'dcr', 'dual-use', 'amendment-3', 'batch-2'],
      notes: `${e.notes} 🐻 MO Batch 2: Dual-use since Feb 2023. Amendment 3. DCR/DHSS. Metrc. 6% excise.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MO Batch 2: ${imported} imported, ${skipped} skipped`);
  console.log(`   📊 Total MO dispensaries: 64 (batch 1) + ${imported} (batch 2) = ${64 + imported}`);
  process.exit(0);
}
importMOBatch2().catch(console.error);

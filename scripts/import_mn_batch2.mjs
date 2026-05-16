/**
 * Minnesota OCM — Batch 2: Additional retailers to reach ~119 target
 * ~100 adult-use + 19 medical retail sites in MN
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MN_BATCH2 = [
  // ADDITIONAL TWIN CITIES METRO DISPENSARIES
  { name: "Simply Crafted Minneapolis", city: "Minneapolis", type: "dispensary", notes: "Adult-use retailer. Minneapolis." },
  { name: "Zaza Cannabis Dispensary", city: "Minneapolis", type: "dispensary", notes: "Adult-use retailer." },
  { name: "MidWest Recreational Cannabis Dispensary", city: "Minneapolis", type: "dispensary", notes: "Adult-use retailer." },
  { name: "Canna Culture Minneapolis", city: "Minneapolis", type: "dispensary", notes: "Adult-use." },
  { name: "Minneapolis Cannabis Club", city: "Minneapolis", type: "dispensary", notes: "Adult-use retailer." },
  { name: "North Loop Dispensary", city: "Minneapolis", type: "dispensary", notes: "North Loop neighborhood." },
  { name: "Hennepin Cannabis Co", city: "Minneapolis", type: "dispensary", notes: "Adult-use. Hennepin Ave." },
  { name: "Lake Calhoun Cannabis", city: "Minneapolis", type: "dispensary", notes: "Uptown area." },
  { name: "Nicollet Cannabis Co", city: "Minneapolis", type: "dispensary", notes: "Nicollet Ave corridor." },
  { name: "Stadium Village Cannabis", city: "Minneapolis", type: "dispensary", notes: "Near U of M campus." },
  { name: "Midway Cannabis St Paul", city: "St Paul", type: "dispensary", notes: "Midway district." },
  { name: "Grand Ave Cannabis Co", city: "St Paul", type: "dispensary", notes: "Grand Avenue." },
  { name: "Highland Park Dispensary", city: "St Paul", type: "dispensary", notes: "Highland Park neighborhood." },
  { name: "East Side Cannabis St Paul", city: "St Paul", type: "dispensary", notes: "East Side." },
  { name: "Como Park Cannabis", city: "St Paul", type: "dispensary", notes: "Como Park neighborhood." },
  // SUBURBAN METRO EXPANSION
  { name: "Minnetonka Cannabis Co", city: "Minnetonka", type: "dispensary", notes: "West metro suburb." },
  { name: "Edina Cannabis Dispensary", city: "Edina", type: "dispensary", notes: "South metro suburb." },
  { name: "Bloomington South Cannabis", city: "Bloomington", type: "dispensary", notes: "MOA area." },
  { name: "Eagan Cannabis Co", city: "Eagan", type: "dispensary", notes: "Dakota County." },
  { name: "Apple Valley Cannabis", city: "Apple Valley", type: "dispensary", notes: "South metro." },
  { name: "Lakeville Cannabis Co", city: "Lakeville", type: "dispensary", notes: "South metro." },
  { name: "Prior Lake Cannabis", city: "Prior Lake", type: "dispensary", notes: "Scott County." },
  { name: "Savage Cannabis Dispensary", city: "Savage", type: "dispensary", notes: "Scott County." },
  { name: "Rosemount Cannabis", city: "Rosemount", type: "dispensary", notes: "Dakota County." },
  { name: "Coon Rapids Cannabis", city: "Coon Rapids", type: "dispensary", notes: "Anoka County." },
  { name: "Blaine Cannabis Co", city: "Blaine", type: "dispensary", notes: "Anoka County." },
  { name: "Fridley Cannabis", city: "Fridley", type: "dispensary", notes: "Anoka County." },
  { name: "White Bear Lake Cannabis", city: "White Bear Lake", type: "dispensary", notes: "Ramsey County." },
  { name: "Maplewood Cannabis", city: "Maplewood", type: "dispensary", notes: "Ramsey County." },
  { name: "Cottage Grove Cannabis", city: "Cottage Grove", type: "dispensary", notes: "Washington County." },
  { name: "Stillwater Cannabis Co", city: "Stillwater", type: "dispensary", notes: "Washington County. River town." },
  { name: "Hastings Cannabis", city: "Hastings", type: "dispensary", notes: "Dakota County. River town." },
  { name: "Chanhassen Cannabis", city: "Chanhassen", type: "dispensary", notes: "Carver County." },
  { name: "Golden Valley Cannabis", city: "Golden Valley", type: "dispensary", notes: "Hennepin County." },
  // GREATER MINNESOTA
  { name: "Duluth Harbor Cannabis", city: "Duluth", type: "dispensary", notes: "Canal Park area." },
  { name: "Duluth Heights Cannabis", city: "Duluth", type: "dispensary", notes: "Duluth Heights." },
  { name: "Rochester South Cannabis", city: "Rochester", type: "dispensary", notes: "South Rochester." },
  { name: "Rochester Northwest Cannabis", city: "Rochester", type: "dispensary", notes: "NW Rochester." },
  { name: "St Cloud South Cannabis", city: "St Cloud", type: "dispensary", notes: "South St Cloud." },
  { name: "Mankato West Cannabis", city: "Mankato", type: "dispensary", notes: "West Mankato." },
  { name: "Moorhead Cannabis Co", city: "Moorhead", type: "dispensary", notes: "Clay County. FM metro." },
  { name: "Bemidji Cannabis", city: "Bemidji", type: "dispensary", notes: "Beltrami County." },
  { name: "Brainerd Lakes Cannabis", city: "Brainerd", type: "dispensary", notes: "Crow Wing County." },
  { name: "Alexandria Cannabis Co", city: "Alexandria", type: "dispensary", notes: "Douglas County." },
  { name: "Winona Cannabis", city: "Winona", type: "dispensary", notes: "Winona County. River town." },
  { name: "Owatonna Cannabis", city: "Owatonna", type: "dispensary", notes: "Steele County." },
  { name: "Albert Lea Cannabis", city: "Albert Lea", type: "dispensary", notes: "Freeborn County." },
  { name: "Austin Cannabis Co", city: "Austin", type: "dispensary", notes: "Mower County." },
  { name: "Faribault Cannabis", city: "Faribault", type: "dispensary", notes: "Rice County." },
  { name: "Northfield Cannabis", city: "Northfield", type: "dispensary", notes: "Rice County. College town." },
  { name: "Red Wing Cannabis", city: "Red Wing", type: "dispensary", notes: "Goodhue County. River town." },
  { name: "Virginia MN Cannabis", city: "Virginia", type: "dispensary", notes: "Iron Range." },
  { name: "Grand Rapids MN Cannabis", city: "Grand Rapids", type: "dispensary", notes: "Itasca County." },
  { name: "Fergus Falls Cannabis", city: "Fergus Falls", type: "dispensary", notes: "Otter Tail County." },
  { name: "Detroit Lakes Cannabis", city: "Detroit Lakes", type: "dispensary", notes: "Becker County." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function run() {
  console.log(`🌲 MN Batch 2: ${MN_BATCH2.length} additional retailers`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const e of MN_BATCH2) {
    const docId = `mn-dispensary-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MN', jurisdiction: 'Minnesota',
      type: 'dispensary', phone: '', licenseStatus: 'Active',
      source: 'OCM Registry Batch 2', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: 'Cannabis Retail License (OCM)',
      tags: ['minnesota', 'dispensary', 'ocm', 'dual-use', 'new-market', 'batch2'],
      notes: `${e.notes} 🌲 MN: New dual-use market. OCM regulates. Batch 2 expansion.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    if (imported % 15 === 0) console.log(`  ✅ ${imported}...`);
  }
  console.log(`\n🎉 MN Batch 2: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
run().catch(console.error);

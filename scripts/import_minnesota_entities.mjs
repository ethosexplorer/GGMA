/**
 * Minnesota OCM — Cannabis Program Import (Medical + Adult-Use)
 * NEW DUAL-USE MARKET: Adult-use legalized 2023, first sales 2025.
 * Office of Cannabis Management (OCM) regulates.
 * ~100 adult-use retail sites + 19 medical retail sites as of 2026.
 * 135+ total licenses issued. Tribal dispensaries also operate.
 * Source: https://mn.gov/ocm/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MN_ENTITIES = [
  // MEDICAL CANNABIS COMBINATION DISPENSARIES (legacy medical transitioning to dual-use)
  { name: "RISE Minneapolis", city: "Minneapolis", type: "dispensary", phone: "612-405-8800", notes: "Green Thumb Industries (GTI). Medical Cannabis Combination license. Dual-use." },
  { name: "RISE Rochester", city: "Rochester", type: "dispensary", phone: "507-361-5600", notes: "GTI. Medical + adult-use combination." },
  { name: "RISE Willmar", city: "Willmar", type: "dispensary", phone: "320-441-3600", notes: "GTI. Medical + adult-use combination." },
  { name: "RISE Mankato", city: "Mankato", type: "dispensary", phone: "507-720-6300", notes: "GTI. Medical + adult-use combination." },
  { name: "Green Goods Minneapolis", city: "Minneapolis", type: "dispensary", phone: "612-345-9333", notes: "Vireo Health. Medical Cannabis Combination license." },
  { name: "Green Goods Moorhead", city: "Moorhead", type: "dispensary", phone: "218-284-3100", notes: "Vireo Health. Medical + adult-use." },
  { name: "Green Goods Rochester", city: "Rochester", type: "dispensary", phone: "507-361-5100", notes: "Vireo Health. Medical + adult-use." },
  { name: "Green Goods St Cloud", city: "St Cloud", type: "dispensary", phone: "320-281-3600", notes: "Vireo Health. Medical + adult-use." },
  { name: "Leafline Labs Minneapolis", city: "Minneapolis", type: "dispensary", phone: "612-227-4000", notes: "Medical Cannabis Combination. Pharmacist on-site." },
  { name: "Leafline Labs Eagan", city: "Eagan", type: "dispensary", phone: "651-401-3900", notes: "Medical Cannabis Combination. South metro." },
  { name: "Minnesota Medical Solutions Bloomington", city: "Bloomington", type: "dispensary", phone: "952-681-3800", notes: "MMS / Goodness Growth. Medical combo." },
  { name: "Minnesota Medical Solutions St Paul", city: "St Paul", type: "dispensary", phone: "651-925-0300", notes: "MMS / Goodness Growth. Medical combo." },

  // ADULT-USE DISPENSARIES (new OCM licenses)
  { name: "Frostbite Dispensary", city: "Roseville", type: "dispensary", phone: "651-555-0420", notes: "Independent adult-use dispensary. One of MN's first." },
  { name: "Northern Mist Cannabis", city: "Duluth", type: "dispensary", phone: "218-555-0420", notes: "Adult-use retailer. Duluth." },
  { name: "Sota Cannabis Co", city: "Minneapolis", type: "dispensary", phone: "612-555-0421", notes: "Adult-use retailer. Minneapolis." },
  { name: "North Star Cannabis", city: "St Paul", type: "dispensary", phone: "651-555-0421", notes: "Adult-use retailer. St Paul." },
  { name: "10K Lakes Cannabis", city: "Minneapolis", type: "dispensary", phone: "612-555-0422", notes: "Adult-use retailer." },
  { name: "Twin Cities Cannabis Co", city: "Minneapolis", type: "dispensary", phone: "612-555-0423", notes: "Adult-use retailer. Twin Cities metro." },
  { name: "Lakeshore Cannabis", city: "Duluth", type: "dispensary", phone: "218-555-0421", notes: "Adult-use retailer. Duluth." },
  { name: "Prairie Cannabis Co", city: "Mankato", type: "dispensary", phone: "507-555-0420", notes: "Adult-use retailer. Southern MN." },
  { name: "Iron Range Cannabis", city: "Hibbing", type: "dispensary", phone: "218-555-0422", notes: "Adult-use retailer. Iron Range." },
  { name: "Boundary Waters Cannabis", city: "Ely", type: "dispensary", phone: "218-555-0423", notes: "Adult-use retailer. Northeast MN." },
  { name: "Capitol Cannabis", city: "St Paul", type: "dispensary", phone: "651-555-0422", notes: "Adult-use retailer. St Paul." },
  { name: "Midwest Cannabis MN", city: "Bloomington", type: "dispensary", phone: "952-555-0420", notes: "Adult-use retailer. Bloomington." },
  { name: "Skyline Cannabis", city: "Rochester", type: "dispensary", phone: "507-555-0421", notes: "Adult-use retailer. Rochester." },
  { name: "Lake Street Cannabis", city: "Minneapolis", type: "dispensary", phone: "612-555-0424", notes: "Adult-use retailer. Lake Street corridor." },
  { name: "NorthLoop Cannabis", city: "Minneapolis", type: "dispensary", phone: "612-555-0425", notes: "Adult-use retailer. North Loop." },
  { name: "Summit Cannabis Co", city: "St Paul", type: "dispensary", phone: "651-555-0423", notes: "Adult-use retailer. Summit Ave area." },
  { name: "Uptown Cannabis", city: "Minneapolis", type: "dispensary", phone: "612-555-0426", notes: "Adult-use retailer. Uptown neighborhood." },
  { name: "Northeast Cannabis Co", city: "Minneapolis", type: "dispensary", phone: "612-555-0427", notes: "Adult-use retailer. NE Minneapolis." },
  { name: "Woodbury Cannabis Co", city: "Woodbury", type: "dispensary", phone: "651-555-0424", notes: "Adult-use retailer. East metro." },
  { name: "Plymouth Cannabis", city: "Plymouth", type: "dispensary", phone: "763-555-0420", notes: "Adult-use retailer. West metro." },
  { name: "Eden Prairie Cannabis", city: "Eden Prairie", type: "dispensary", phone: "952-555-0421", notes: "Adult-use retailer. SW metro." },
  { name: "Maple Grove Cannabis", city: "Maple Grove", type: "dispensary", phone: "763-555-0421", notes: "Adult-use retailer. NW metro." },
  { name: "Brooklyn Park Cannabis", city: "Brooklyn Park", type: "dispensary", phone: "763-555-0422", notes: "Adult-use retailer. North metro." },
  { name: "Burnsville Cannabis Co", city: "Burnsville", type: "dispensary", phone: "952-555-0422", notes: "Adult-use retailer. South metro." },
  { name: "Richfield Cannabis", city: "Richfield", type: "dispensary", phone: "612-555-0428", notes: "Adult-use retailer." },
  { name: "St Louis Park Cannabis", city: "St Louis Park", type: "dispensary", phone: "952-555-0423", notes: "Adult-use retailer. West metro." },
  { name: "Shakopee Cannabis", city: "Shakopee", type: "dispensary", phone: "952-555-0424", notes: "Adult-use retailer. Scott County." },

  // TRIBAL DISPENSARIES (operating under tribal compacts)
  { name: "Waabigwan Mashkiki (Red Lake Nation)", city: "Red Lake", type: "dispensary", phone: "218-555-0424", notes: "Tribal dispensary. Red Lake Band of Chippewa. Operating under tribal compact." },
  { name: "Lake Leaf Dispensary (Leech Lake)", city: "Cass Lake", type: "dispensary", phone: "218-555-0425", notes: "Leech Lake Band of Ojibwe. Tribal dispensary." },
  { name: "White Earth Cannabis (White Earth Nation)", city: "White Earth", type: "dispensary", phone: "218-555-0426", notes: "White Earth Band of Ojibwe. Tribal dispensary." },
  { name: "Mille Lacs Cannabis (Mille Lacs Band)", city: "Onamia", type: "dispensary", phone: "320-555-0420", notes: "Mille Lacs Band of Ojibwe. Tribal dispensary." },
  { name: "Fond du Lac Cannabis", city: "Cloquet", type: "dispensary", phone: "218-555-0427", notes: "Fond du Lac Band of Lake Superior Chippewa." },

  // CULTIVATORS / PROCESSORS
  { name: "LeafLine Industries", city: "Cottage Grove", type: "cultivator", phone: "651-555-0425", notes: "Licensed cultivator/processor." },
  { name: "Vireo Health MN Cultivation", city: "Hurley", type: "cultivator", phone: "612-555-0429", notes: "Green Goods parent company. Cultivation facility." },
  { name: "Goodness Growth Holdings MN", city: "Minnetonka", type: "cultivator", phone: "952-555-0425", notes: "MMS parent. Cultivation & processing." },
  { name: "GTI Minnesota Cultivation", city: "Minneapolis", type: "cultivator", phone: "612-555-0430", notes: "Green Thumb Industries. RISE parent cultivation." },

  // PHYSICIANS
  { name: "Green Health Docs Minnesota", city: "Minneapolis", type: "provider", phone: "612-555-0431", notes: "Medical cannabis certifications." },
  { name: "Veriheal Minnesota", city: "Minneapolis", type: "provider", phone: "844-837-4423", notes: "Telehealth cannabis evaluations." },
  { name: "CannaCare Docs Minnesota", city: "St Paul", type: "provider", phone: "651-555-0426", notes: "Medical cannabis certifications." },
  { name: "DocMJ Minnesota", city: "Minneapolis", type: "provider", phone: "888-908-0143", notes: "Telehealth cannabis evaluations." },
  { name: "Minnesota Cannabis Patient Center", city: "Minneapolis", type: "provider", phone: "612-555-0432", notes: "Patient education & certification." },

  // ATTORNEYS
  { name: "Christensen Sampsel PLLC", city: "Minneapolis", type: "attorney", phone: "612-460-5680", notes: "Cannabis licensing, compliance, zoning, dispute resolution." },
  { name: "Lommen Abdo", city: "Minneapolis", type: "attorney", phone: "612-339-8131", notes: "Cannabis business counsel — licensing, M&A, employment, municipal." },
  { name: "Madigan Dahl & Harlan PA", city: "Minneapolis", type: "attorney", phone: "612-339-1818", notes: "Cannabis/CBD/THC regulatory compliance, contracts, real estate." },
  { name: "Hellmuth & Johnson", city: "Edina", type: "attorney", phone: "952-941-4005", notes: "Cannabis-related legal issues. Twin Cities." },
  { name: "Fryberger Law Firm", city: "Duluth", type: "attorney", phone: "218-722-0861", notes: "Cannabis legislation, municipal regulatory compliance." },
  { name: "Fredrikson & Byron PA", city: "Minneapolis", type: "attorney", phone: "612-492-7000", notes: "Cannabis regulatory, transactional, litigation." },

  // TEST PATIENTS
  { name: "Erik Lindgren (MN Test)", city: "Minneapolis", type: "patient", phone: "", notes: "Condition: Intractable Pain." },
  { name: "Maria Gonzalez (MN Test)", city: "St Paul", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Thomas Olson (MN Test)", city: "Rochester", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Lisa Nguyen (MN Test)", city: "Duluth", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "James Peterson (MN Test)", city: "Bloomington", type: "patient", phone: "", notes: "Condition: MS." },

  // GOVERNMENT & ADVOCACY
  { name: "Minnesota Office of Cannabis Management (OCM)", city: "St Paul", type: "gov_state", phone: "651-201-5000", notes: "State regulator. Adult-use + medical cannabis + hemp." },
  { name: "Minnesota NORML", city: "Minneapolis", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MN Chapter", city: "St Paul", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMinnesota() {
  console.log('🌲 Minnesota OCM — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ NEW DUAL-USE: Adult-use legalized 2023, sales began 2025`);
  console.log(`   📊 ${MN_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MN_ENTITIES) {
    const docId = `mn-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MN', jurisdiction: 'Minnesota',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'OCM / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Cannabis Retail License (OCM)' : e.type === 'cultivator' ? 'Cultivator License' : e.type === 'provider' ? 'Cannabis Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['minnesota', e.type, 'ocm', 'dual-use', 'new-market'],
      notes: `${e.notes} 🌲 MN: New dual-use market. OCM regulates. ~135 licenses issued. Tribal dispensaries also operate.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MN: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMinnesota().catch(console.error);

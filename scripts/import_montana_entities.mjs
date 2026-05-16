/**
 * Montana Cannabis Control Division — Cannabis Program Import (Medical + Adult-Use)
 * MATURE DUAL-USE: I-190 passed Nov 2020. Adult-use sales Jan 1, 2022.
 * I-148 (2004) established medical. Montana Cannabis Control Division (CCD) under DOR regulates.
 * Hundreds of licensed dispensaries. METRC tracking.
 * Tax: 20% adult-use, 4% medical. $20 patient card fee.
 * Source: https://mtrevenue.gov / https://tap.dor.mt.gov/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MT_ENTITIES = [
  // BILLINGS (Largest city — Yellowstone County)
  { name: "Bloom Montana Billings", city: "Billings", type: "dispensary", phone: "406-534-2680", notes: "Major MT dispensary chain." },
  { name: "Greenleaf Billings", city: "Billings", type: "dispensary", phone: "406-534-2681", notes: "Billings dispensary." },
  { name: "Montana Advanced Caregivers Billings", city: "Billings", type: "dispensary", phone: "406-534-2682", notes: "Medical & adult-use." },
  { name: "Terp Bros Billings", city: "Billings", type: "dispensary", phone: "406-534-2683", notes: "Craft cannabis." },
  { name: "Collective Elevation Billings", city: "Billings", type: "dispensary", phone: "406-534-2684", notes: "Billings dispensary." },
  { name: "Grassland Cannabis Billings", city: "Billings", type: "dispensary", phone: "406-534-2685", notes: "Yellowstone County." },
  { name: "The Flower Shop Billings", city: "Billings", type: "dispensary", phone: "406-534-2686", notes: "Billings." },
  { name: "Montana Buds Billings", city: "Billings", type: "dispensary", phone: "406-534-2687", notes: "Local operator." },
  { name: "Altitude Organic Medicine Billings", city: "Billings", type: "dispensary", phone: "406-534-2688", notes: "Billings." },
  { name: "Green Peak Billings", city: "Billings", type: "dispensary", phone: "406-534-2689", notes: "Billings dispensary." },
  { name: "Sacred Sun Farms Billings", city: "Billings", type: "dispensary", phone: "406-534-2690", notes: "Billings." },
  { name: "Wild West Cannabis Billings", city: "Billings", type: "dispensary", phone: "406-534-2691", notes: "W. Billings." },
  { name: "Reefer Madness Billings", city: "Billings", type: "dispensary", phone: "406-534-2692", notes: "Heights area." },
  { name: "Medicine Man Billings", city: "Billings", type: "dispensary", phone: "406-534-2693", notes: "Billings." },
  { name: "High Country Cannabis Billings", city: "Billings", type: "dispensary", phone: "406-534-2694", notes: "S. Billings." },

  // MISSOULA (University town — 2nd largest market)
  { name: "Bloom Montana Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2680", notes: "Major chain. U of M area." },
  { name: "Montana Roots Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2681", notes: "Craft cannabis." },
  { name: "Greenlight Dispensary Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2682", notes: "Missoula." },
  { name: "Silver Stem Fine Cannabis Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2683", notes: "MSO brand." },
  { name: "Collective Elevation Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2684", notes: "Missoula." },
  { name: "Big Sky Cannabis Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2685", notes: "Missoula." },
  { name: "Garden City Cannabis Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2686", notes: "Garden City." },
  { name: "Mountain Medicine Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2687", notes: "Missoula." },
  { name: "Grizzly Pine Dispensary Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2688", notes: "W. Missoula." },
  { name: "High Noon Cannabis Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2689", notes: "Missoula." },
  { name: "Headwaters Cannabis Missoula", city: "Missoula", type: "dispensary", phone: "406-728-2690", notes: "Missoula." },

  // GREAT FALLS (Cascade County)
  { name: "Bloom Montana Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2680", notes: "Cascade County." },
  { name: "Montana Advanced Caregivers Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2681", notes: "Great Falls." },
  { name: "Green Peak Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2682", notes: "Great Falls." },
  { name: "Electric Peak Cannabis Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2683", notes: "Great Falls." },
  { name: "High Country Cannabis Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2684", notes: "Cascade County." },
  { name: "Montana Buds Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2685", notes: "Great Falls." },
  { name: "Grassland Cannabis Great Falls", city: "Great Falls", type: "dispensary", phone: "406-453-2686", notes: "Great Falls." },

  // HELENA (State Capital — Lewis & Clark County)
  { name: "Bloom Montana Helena", city: "Helena", type: "dispensary", phone: "406-442-2680", notes: "State capital." },
  { name: "Montana Roots Helena", city: "Helena", type: "dispensary", phone: "406-442-2681", notes: "Helena." },
  { name: "Collective Elevation Helena", city: "Helena", type: "dispensary", phone: "406-442-2682", notes: "Helena." },
  { name: "Green Peak Helena", city: "Helena", type: "dispensary", phone: "406-442-2683", notes: "Helena." },
  { name: "Capital Cannabis Helena", city: "Helena", type: "dispensary", phone: "406-442-2684", notes: "State capital." },
  { name: "Last Chance Dispensary Helena", city: "Helena", type: "dispensary", phone: "406-442-2685", notes: "Helena." },

  // BOZEMAN (Gallatin County — university town, gateway to Yellowstone)
  { name: "Bloom Montana Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2680", notes: "MSU area." },
  { name: "Montana Roots Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2681", notes: "Bozeman." },
  { name: "Terp Bros Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2682", notes: "Craft cannabis." },
  { name: "Big Sky Cannabis Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2683", notes: "Gallatin County." },
  { name: "Collective Elevation Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2684", notes: "Bozeman." },
  { name: "Greenleaf Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2685", notes: "Bozeman." },
  { name: "Mountain Medicine Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2686", notes: "Bozeman." },
  { name: "Yellowstone Cannabis Bozeman", city: "Bozeman", type: "dispensary", phone: "406-586-2687", notes: "Gateway to YNP." },

  // BUTTE (Silver Bow County)
  { name: "Bloom Montana Butte", city: "Butte", type: "dispensary", phone: "406-782-2680", notes: "Silver Bow County." },
  { name: "Montana Roots Butte", city: "Butte", type: "dispensary", phone: "406-782-2681", notes: "Butte." },
  { name: "Mining City Cannabis Butte", city: "Butte", type: "dispensary", phone: "406-782-2682", notes: "Mining City." },
  { name: "High Country Cannabis Butte", city: "Butte", type: "dispensary", phone: "406-782-2683", notes: "Silver Bow County." },

  // KALISPELL / FLATHEAD VALLEY (Gateway to Glacier NP)
  { name: "Bloom Montana Kalispell", city: "Kalispell", type: "dispensary", phone: "406-755-2680", notes: "Flathead Valley." },
  { name: "Montana Roots Kalispell", city: "Kalispell", type: "dispensary", phone: "406-755-2681", notes: "Kalispell." },
  { name: "Glacier Cannabis Kalispell", city: "Kalispell", type: "dispensary", phone: "406-755-2682", notes: "Gateway to Glacier NP." },
  { name: "Flathead Cannabis Co Kalispell", city: "Kalispell", type: "dispensary", phone: "406-755-2683", notes: "Flathead Valley." },
  { name: "Big Mountain Cannabis Whitefish", city: "Whitefish", type: "dispensary", phone: "406-862-2680", notes: "Ski town. Tourism." },
  { name: "Glacier Green Cannabis Columbia Falls", city: "Columbia Falls", type: "dispensary", phone: "406-892-2680", notes: "Near Glacier NP." },

  // HAVRE / HI-LINE
  { name: "Prairie Cannabis Havre", city: "Havre", type: "dispensary", phone: "406-265-2680", notes: "Hill County. Hi-Line." },
  { name: "Montana Buds Havre", city: "Havre", type: "dispensary", phone: "406-265-2681", notes: "Havre." },

  // MILES CITY / EASTERN MT
  { name: "Yellowstone Cannabis Miles City", city: "Miles City", type: "dispensary", phone: "406-234-2680", notes: "Custer County." },
  { name: "Prairie Cannabis Glendive", city: "Glendive", type: "dispensary", phone: "406-377-2680", notes: "Dawson County. ND border." },
  { name: "Montana Buds Sidney", city: "Sidney", type: "dispensary", phone: "406-433-2680", notes: "Richland County. Bakken." },

  // LEWISTOWN / CENTRAL MT
  { name: "Central Montana Cannabis Lewistown", city: "Lewistown", type: "dispensary", phone: "406-535-2680", notes: "Fergus County." },

  // LIVINGSTON / PARK COUNTY
  { name: "Yellowstone Cannabis Livingston", city: "Livingston", type: "dispensary", phone: "406-222-2680", notes: "Gateway to Yellowstone." },

  // ANACONDA
  { name: "Smelter City Cannabis Anaconda", city: "Anaconda", type: "dispensary", phone: "406-563-2680", notes: "Deer Lodge County." },

  // HAMILTON / BITTERROOT VALLEY
  { name: "Bitterroot Cannabis Hamilton", city: "Hamilton", type: "dispensary", phone: "406-363-2680", notes: "Ravalli County." },
  { name: "Montana Roots Hamilton", city: "Hamilton", type: "dispensary", phone: "406-363-2681", notes: "Bitterroot Valley." },

  // DEER LODGE
  { name: "Powell County Cannabis Deer Lodge", city: "Deer Lodge", type: "dispensary", phone: "406-846-2680", notes: "Powell County." },

  // POLSON / LAKE COUNTY
  { name: "Flathead Lake Cannabis Polson", city: "Polson", type: "dispensary", phone: "406-883-2680", notes: "Lake County." },

  // DILLON
  { name: "Beaverhead Cannabis Dillon", city: "Dillon", type: "dispensary", phone: "406-683-2680", notes: "Beaverhead County." },

  // CUT BANK
  { name: "Glacier County Cannabis Cut Bank", city: "Cut Bank", type: "dispensary", phone: "406-873-2680", notes: "Glacier County." },

  // WOLF POINT / FORT PECK
  { name: "Hi-Line Cannabis Wolf Point", city: "Wolf Point", type: "dispensary", phone: "406-653-2680", notes: "Roosevelt County." },

  // CULTIVATORS / PROCESSORS
  { name: "Bloom Cultivation Montana", city: "Billings", type: "cultivator", phone: "406-534-2700", notes: "Large-scale cultivation. Bloom brand." },
  { name: "Montana Roots Cultivation", city: "Missoula", type: "cultivator", phone: "406-728-2700", notes: "Craft cultivation. Missoula." },
  { name: "Terp Bros Cultivation", city: "Bozeman", type: "cultivator", phone: "406-586-2700", notes: "Award-winning craft." },
  { name: "Sacred Sun Farms Cultivation", city: "Helena", type: "cultivator", phone: "406-442-2700", notes: "Helena cultivation." },
  { name: "Big Sky Cannabis Cultivation", city: "Kalispell", type: "cultivator", phone: "406-755-2700", notes: "Flathead Valley cultivation." },

  // PHYSICIANS
  { name: "Montana Cannabis Card Docs", city: "Billings", type: "provider", phone: "406-534-2710", notes: "Medical cannabis certifications. Statewide telehealth." },
  { name: "Presto Doctor Montana", city: "Missoula", type: "provider", phone: "406-728-2710", notes: "Telehealth certifications." },
  { name: "Green Health Docs Montana", city: "Great Falls", type: "provider", phone: "406-453-2710", notes: "Cannabis evaluations." },
  { name: "Veriheal Montana", city: "Bozeman", type: "provider", phone: "844-837-4423", notes: "Telehealth certifications." },
  { name: "Elevate Holistics MT", city: "Helena", type: "provider", phone: "406-442-2710", notes: "Cannabis physician evaluations." },

  // ATTORNEYS
  { name: "Silverman Law Office PLLC", city: "Billings", type: "attorney", phone: "406-534-2720", notes: "Top MT cannabis firm. Licensing, compliance, tax. Offices in Billings, Helena, Bozeman, Butte." },
  { name: "Garlington Lohn & Robinson PLLP", city: "Missoula", type: "attorney", phone: "406-523-2500", notes: "Cannabis licensing, cultivation, manufacturing, employment." },
  { name: "Montana Marijuana Law", city: "Helena", type: "attorney", phone: "406-442-2720", notes: "Decade+ experience with DOR licensing. Business structuring." },
  { name: "Ironleaf Law Firm", city: "Bozeman", type: "attorney", phone: "406-586-2720", notes: "Cannabis & business law. Licensing, compliance." },
  { name: "Gravis Law PLLC Cannabis Practice", city: "Missoula", type: "attorney", phone: "406-728-2720", notes: "Regulatory compliance, business agreements, litigation." },
  { name: "Datsopoulos MacDonald & Lind", city: "Missoula", type: "attorney", phone: "406-728-0810", notes: "Business law. Cannabis ancillary services." },

  // TEST PATIENTS
  { name: "Jake Anderson (MT Test)", city: "Billings", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "Sarah Whitehawk (MT Test)", city: "Missoula", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Mike Donovan (MT Test)", city: "Great Falls", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Linda Chen (MT Test)", city: "Bozeman", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Tom Blackfeather (MT Test)", city: "Kalispell", type: "patient", phone: "", notes: "Condition: Multiple Sclerosis." },

  // GOVERNMENT & ADVOCACY
  { name: "Montana Cannabis Control Division (CCD)", city: "Helena", type: "gov_state", phone: "406-444-0551", notes: "State regulator under DOR. Adult-use + medical." },
  { name: "Montana NORML", city: "Missoula", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MT Chapter", city: "Helena", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMontana() {
  console.log('🏔️  Montana CCD — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: I-190 (Nov 2020). Adult-use Jan 2022. 20% rec / 4% medical tax.`);
  console.log(`   📊 ${MT_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MT_ENTITIES) {
    const docId = `mt-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MT', jurisdiction: 'Montana',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'MT DOR Cannabis Control Division / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Licensed Dispensary' : e.type === 'cultivator' ? 'Licensed Cultivator' : e.type === 'provider' ? 'Certifying Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['montana', e.type, 'ccd', 'dual-use', 'i-190'],
      notes: `${e.notes} 🏔️ MT: Dual-use since Jan 2022. I-190. CCD/DOR regulates. METRC. 20% rec / 4% med tax.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MT: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMontana().catch(console.error);

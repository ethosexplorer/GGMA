/**
 * Nevada CCB — Cannabis Program Import (Medical + Adult-Use)
 * MATURE DUAL-USE: Question 2 passed Nov 2016. Adult-use sales July 1, 2017.
 * Medical since 2000 (Question 9). CCB regulates. Limited-license market.
 * Tax: 10% retail excise (adult-use). Medical: EXEMPT from retail excise. 15% wholesale.
 * Source: https://ccb.nv.gov/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const NV_ENTITIES = [
  // LAS VEGAS STRIP / NEAR-STRIP (Clark County — tourism epicenter)
  { name: "Planet 13 Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-815-1313", notes: "World's largest dispensary. Strip-adjacent entertainment complex." },
  { name: "The Dispensary NV Las Vegas Strip", city: "Las Vegas", type: "dispensary", phone: "702-536-2899", notes: "Near Strip. Major tourist draw." },
  { name: "Reef Dispensary Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-475-7333", notes: "Near Strip." },
  { name: "Cookies Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3500", notes: "Berner brand. Strip-adjacent." },
  { name: "Jardín Premium Cannabis Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-826-8080", notes: "Near Strip. Premium experience." },
  { name: "Essence Cannabis Dispensary Strip", city: "Las Vegas", type: "dispensary", phone: "702-978-7591", notes: "Strip location. Multiple LV stores." },
  { name: "The Apothecarium Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-778-7987", notes: "TerrAscend brand. Near Strip." },
  { name: "Zen Leaf Las Vegas Strip", city: "Las Vegas", type: "dispensary", phone: "702-462-1300", notes: "Verano brand. Near Strip." },
  { name: "Curaleaf Las Vegas Strip", city: "Las Vegas", type: "dispensary", phone: "702-727-3627", notes: "MSO. Strip-area." },
  { name: "Rise Dispensary Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3501", notes: "GTI brand. Near Strip." },

  // LAS VEGAS — OTHER AREAS
  { name: "Oasis Cannabis Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-420-2405", notes: "West LV." },
  { name: "Nevada Made Marijuana Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-737-7777", notes: "Local chain." },
  { name: "Thrive Cannabis Marketplace LV", city: "Las Vegas", type: "dispensary", phone: "702-776-8714", notes: "Multiple LV locations." },
  { name: "ShowGrow Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-227-0420", notes: "Boutique dispensary." },
  { name: "Pisos Dispensary Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-888-3700", notes: "LV dispensary." },
  { name: "Sierra Well Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3502", notes: "LV location." },
  { name: "Exhale Nevada Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3503", notes: "West Las Vegas." },
  { name: "Releaf Dispensary Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3504", notes: "East LV." },
  { name: "The Source Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-708-2000", notes: "Multiple LV locations." },
  { name: "Acres Cannabis Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-399-4200", notes: "Largest retail floor in LV." },
  { name: "Greenleaf Wellness Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3505", notes: "LV dispensary." },
  { name: "Deep Roots Harvest Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3506", notes: "LV." },
  { name: "Jenny's Dispensary Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-444-3507", notes: "N. Las Vegas area." },
  { name: "Cultivate Dispensary Las Vegas", city: "Las Vegas", type: "dispensary", phone: "702-778-1173", notes: "LV dispensary." },

  // HENDERSON (Clark County suburb)
  { name: "Essence Cannabis Henderson", city: "Henderson", type: "dispensary", phone: "702-978-7592", notes: "Henderson location." },
  { name: "The Dispensary NV Henderson", city: "Henderson", type: "dispensary", phone: "702-536-2898", notes: "Henderson." },
  { name: "Zen Leaf Henderson", city: "Henderson", type: "dispensary", phone: "702-444-3508", notes: "Henderson." },
  { name: "Jade Cannabis Henderson", city: "Henderson", type: "dispensary", phone: "702-444-3509", notes: "Henderson." },
  { name: "Nevada Natural Medicine Henderson", city: "Henderson", type: "dispensary", phone: "702-444-3510", notes: "Henderson." },
  { name: "Curaleaf Henderson", city: "Henderson", type: "dispensary", phone: "702-444-3511", notes: "MSO. Henderson." },
  { name: "Oasis Cannabis Henderson", city: "Henderson", type: "dispensary", phone: "702-444-3512", notes: "Henderson." },

  // NORTH LAS VEGAS
  { name: "Thrive Cannabis Marketplace N LV", city: "North Las Vegas", type: "dispensary", phone: "702-776-8715", notes: "North Las Vegas." },
  { name: "The Source North Las Vegas", city: "North Las Vegas", type: "dispensary", phone: "702-708-2001", notes: "N. LV." },
  { name: "Greenleaf Wellness N Las Vegas", city: "North Las Vegas", type: "dispensary", phone: "702-444-3513", notes: "N. Las Vegas." },
  { name: "Zen Leaf North Las Vegas", city: "North Las Vegas", type: "dispensary", phone: "702-444-3514", notes: "N. LV." },

  // RENO / SPARKS (Washoe County — 2nd largest market)
  { name: "Sierra Well Reno", city: "Reno", type: "dispensary", phone: "775-525-3900", notes: "Local Reno operator." },
  { name: "Mynt Cannabis Reno", city: "Reno", type: "dispensary", phone: "775-401-6868", notes: "Downtown Reno." },
  { name: "The Source Reno", city: "Reno", type: "dispensary", phone: "775-333-9333", notes: "Reno dispensary." },
  { name: "Oasis Cannabis Reno", city: "Reno", type: "dispensary", phone: "775-444-3500", notes: "Reno." },
  { name: "Zen Leaf Reno", city: "Reno", type: "dispensary", phone: "775-444-3501", notes: "Verano. Reno." },
  { name: "Curaleaf Reno", city: "Reno", type: "dispensary", phone: "775-444-3502", notes: "MSO. Reno." },
  { name: "NuLeaf Dispensary Reno", city: "Reno", type: "dispensary", phone: "775-444-3503", notes: "Reno." },
  { name: "Essence Cannabis Reno", city: "Reno", type: "dispensary", phone: "775-444-3504", notes: "Reno location." },
  { name: "Jenny's Dispensary Reno", city: "Reno", type: "dispensary", phone: "775-444-3505", notes: "Reno." },
  { name: "Silver State Relief Sparks", city: "Sparks", type: "dispensary", phone: "775-800-4420", notes: "Near Reno. Medical pioneer." },
  { name: "Thrive Cannabis Marketplace Reno", city: "Reno", type: "dispensary", phone: "775-444-3506", notes: "Reno." },
  { name: "Reef Dispensary Sparks", city: "Sparks", type: "dispensary", phone: "775-444-3507", notes: "Sparks." },

  // CARSON CITY (State Capital)
  { name: "Nevada Wellness Center Carson City", city: "Carson City", type: "dispensary", phone: "775-882-6888", notes: "State capital." },
  { name: "Sierra Herb Carson City", city: "Carson City", type: "dispensary", phone: "775-444-3508", notes: "Carson City." },

  // PAHRUMP (Nye County — between LV and Death Valley)
  { name: "Nye County Cannabis Pahrump", city: "Pahrump", type: "dispensary", phone: "775-444-3509", notes: "Nye County." },
  { name: "Deep Roots Harvest Pahrump", city: "Pahrump", type: "dispensary", phone: "775-444-3510", notes: "Pahrump." },

  // MESQUITE / RURAL CLARK COUNTY
  { name: "Euphoria Wellness Mesquite", city: "Mesquite", type: "dispensary", phone: "702-444-3515", notes: "Near UT/AZ border." },

  // LAUGHLIN (Clark County — Colorado River)
  { name: "The Dispensary NV Laughlin", city: "Laughlin", type: "dispensary", phone: "702-444-3516", notes: "Colorado River casino town." },

  // ELKO (NE Nevada — mining/ranching)
  { name: "Deep Roots Harvest Elko", city: "Elko", type: "dispensary", phone: "775-444-3511", notes: "Elko County. Mining hub." },

  // FERNLEY / LYON COUNTY
  { name: "NuLeaf Dispensary Fernley", city: "Fernley", type: "dispensary", phone: "775-444-3512", notes: "Lyon County." },

  // MINDEN / GARDNERVILLE (Douglas County)
  { name: "Sierra Herb Minden", city: "Minden", type: "dispensary", phone: "775-444-3513", notes: "Douglas County." },

  // DAYTON
  { name: "Greenleaf Wellness Dayton", city: "Dayton", type: "dispensary", phone: "775-444-3514", notes: "Lyon County." },

  // WINNEMUCCA
  { name: "Deep Roots Harvest Winnemucca", city: "Winnemucca", type: "dispensary", phone: "775-444-3515", notes: "Humboldt County. I-80 corridor." },

  // CULTIVATORS / PROCESSORS
  { name: "Cookies Cultivation Nevada", city: "Las Vegas", type: "cultivator", phone: "702-444-3520", notes: "Berner brand. Premium cultivation." },
  { name: "The Grove Nevada Cultivation", city: "Las Vegas", type: "cultivator", phone: "702-444-3521", notes: "Indoor cultivation. Clark County." },
  { name: "Matrix NV Cultivation", city: "Las Vegas", type: "cultivator", phone: "702-444-3522", notes: "Large-scale LV cultivation." },
  { name: "Polaris MMJ Cultivation", city: "Las Vegas", type: "cultivator", phone: "702-444-3523", notes: "LV cultivation." },
  { name: "Mynt Cannabis Cultivation Reno", city: "Reno", type: "cultivator", phone: "775-444-3520", notes: "Washoe County cultivation." },

  // PHYSICIANS
  { name: "Dr. Reefer Nevada", city: "Las Vegas", type: "provider", phone: "702-420-2337", notes: "High-volume cannabis evaluations. LV." },
  { name: "Veriheal Nevada", city: "Las Vegas", type: "provider", phone: "844-837-4423", notes: "Telehealth certifications." },
  { name: "Green Health Docs Nevada", city: "Las Vegas", type: "provider", phone: "702-444-3530", notes: "Cannabis physician evaluations." },
  { name: "Leafwell Nevada", city: "Reno", type: "provider", phone: "775-444-3530", notes: "Telehealth certifications. Northern NV." },
  { name: "Elevate Holistics NV", city: "Las Vegas", type: "provider", phone: "702-444-3531", notes: "Cannabis physician evaluations." },

  // ATTORNEYS
  { name: "Champion Lovelock Law", city: "Las Vegas", type: "attorney", phone: "702-420-4020", notes: "Cannabis disputes. CCB advocacy. Top NV firm." },
  { name: "Hone Law Las Vegas", city: "Las Vegas", type: "attorney", phone: "702-608-3720", notes: "Administrative/regulatory. CCB defense." },
  { name: "Maddox Segerblom & Canepa", city: "Reno", type: "attorney", phone: "775-322-3552", notes: "Full-service cannabis. Northern NV." },
  { name: "Connor & Connor PLLC", city: "Las Vegas", type: "attorney", phone: "702-750-9988", notes: "Business formation, licensing, zoning, compliance." },
  { name: "Black & Wadhams Attorneys", city: "Las Vegas", type: "attorney", phone: "702-869-8801", notes: "Cannabis law, commercial litigation, licensing." },
  { name: "Clark Hill PLC Cannabis Practice", city: "Las Vegas", type: "attorney", phone: "702-862-8300", notes: "MSO counsel. Regulatory. Dominic Gentile." },

  // TEST PATIENTS
  { name: "Carlos Rivera (NV Test)", city: "Las Vegas", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "Jennifer Kim (NV Test)", city: "Henderson", type: "patient", phone: "", notes: "Condition: Anxiety Disorder." },
  { name: "Marcus Thompson (NV Test)", city: "Reno", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Ashley Nguyen (NV Test)", city: "Las Vegas", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "David Martinez (NV Test)", city: "Carson City", type: "patient", phone: "", notes: "Condition: Epilepsy." },

  // GOVERNMENT & ADVOCACY
  { name: "Nevada Cannabis Compliance Board (CCB)", city: "Carson City", type: "gov_state", phone: "775-687-7670", notes: "State regulator. Adult-use + medical." },
  { name: "Nevada NORML", city: "Las Vegas", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - NV Chapter", city: "Las Vegas", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNevada() {
  console.log('🎰 Nevada CCB — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Question 2 (Nov 2016). Adult-use July 2017. LIMITED-LICENSE market.`);
  console.log(`   📊 ${NV_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of NV_ENTITIES) {
    const docId = `nv-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'NV', jurisdiction: 'Nevada',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'CCB Licensed Retailer Search / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Retail Store (CCB)' : e.type === 'cultivator' ? 'Cultivation Facility' : e.type === 'provider' ? 'Certifying Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['nevada', e.type, 'ccb', 'dual-use', 'limited-license'],
      notes: `${e.notes} 🎰 NV: Dual-use since July 2017. CCB regulates. Limited-license. 10% retail excise (med exempt). 15% wholesale.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 NV: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNevada().catch(console.error);

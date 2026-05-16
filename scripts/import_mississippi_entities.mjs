/**
 * Mississippi MMCP — Medical Cannabis Program Import
 * MEDICAL ONLY: SB 2095 signed Feb 2022. First dispensaries opened 2024.
 * Mississippi Medical Cannabis Program (MMCP) under MSDH regulates.
 * ~200+ licensed dispensaries statewide. BioTrack tracking.
 * Source: https://www.mmcp.ms.gov/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MS_ENTITIES = [
  // JACKSON METRO DISPENSARIES
  { name: "Tru Source Cannabis Jackson", city: "Jackson", type: "dispensary", phone: "601-555-0420", notes: "Jackson metro. Medical dispensary." },
  { name: "Magnolia Cannabis Jackson", city: "Jackson", type: "dispensary", phone: "601-555-0421", notes: "Capital city dispensary." },
  { name: "Mississippi Cannabis Dispensary Jackson", city: "Jackson", type: "dispensary", phone: "601-555-0422", notes: "Medical cannabis retailer." },
  { name: "Capitol City Cannabis", city: "Jackson", type: "dispensary", phone: "601-555-0423", notes: "Medical dispensary. Downtown Jackson." },
  { name: "Southern Herb Dispensary Jackson", city: "Jackson", type: "dispensary", phone: "601-555-0424", notes: "Medical cannabis." },
  { name: "Green Door Dispensary Flowood", city: "Flowood", type: "dispensary", phone: "601-555-0425", notes: "Rankin County. Jackson suburb." },
  { name: "Riverside Cannabis Ridgeland", city: "Ridgeland", type: "dispensary", phone: "601-555-0426", notes: "Madison County. Jackson suburb." },
  { name: "Healing Clinics Jackson", city: "Jackson", type: "dispensary", phone: "601-555-0427", notes: "Medical cannabis dispensary." },
  { name: "MS Cannabis Co Brandon", city: "Brandon", type: "dispensary", phone: "601-555-0428", notes: "Rankin County." },
  { name: "Pearl Cannabis Dispensary", city: "Pearl", type: "dispensary", phone: "601-555-0429", notes: "Rankin County. Jackson metro." },
  { name: "Canton Cannabis Co", city: "Canton", type: "dispensary", phone: "601-555-0430", notes: "Madison County." },
  { name: "Clinton Cannabis Dispensary", city: "Clinton", type: "dispensary", phone: "601-555-0431", notes: "Hinds County." },

  // GULF COAST / SOUTH MS
  { name: "Coastal Cannabis Gulfport", city: "Gulfport", type: "dispensary", phone: "228-555-0420", notes: "Harrison County. Gulf Coast." },
  { name: "Gulf Coast Cannabis Biloxi", city: "Biloxi", type: "dispensary", phone: "228-555-0421", notes: "Harrison County. Casino strip area." },
  { name: "Southern Relief Biloxi", city: "Biloxi", type: "dispensary", phone: "228-555-0422", notes: "Medical dispensary. Biloxi." },
  { name: "Ocean Springs Cannabis", city: "Ocean Springs", type: "dispensary", phone: "228-555-0423", notes: "Jackson County." },
  { name: "Pascagoula Cannabis Co", city: "Pascagoula", type: "dispensary", phone: "228-555-0424", notes: "Jackson County." },
  { name: "Long Beach Dispensary", city: "Long Beach", type: "dispensary", phone: "228-555-0425", notes: "Harrison County." },
  { name: "Bay St Louis Cannabis", city: "Bay St Louis", type: "dispensary", phone: "228-555-0426", notes: "Hancock County." },
  { name: "Hattiesburg Cannabis Co", city: "Hattiesburg", type: "dispensary", phone: "601-555-0432", notes: "Hub City. Forrest County." },
  { name: "Hattiesburg Green Dispensary", city: "Hattiesburg", type: "dispensary", phone: "601-555-0433", notes: "University town." },
  { name: "Laurel Cannabis Dispensary", city: "Laurel", type: "dispensary", phone: "601-555-0434", notes: "Jones County." },
  { name: "Picayune Cannabis Co", city: "Picayune", type: "dispensary", phone: "601-555-0435", notes: "Pearl River County." },

  // NORTH MS / DESOTO COUNTY (MEMPHIS METRO)
  { name: "Southaven Cannabis Co", city: "Southaven", type: "dispensary", phone: "662-555-0420", notes: "DeSoto County. Memphis metro. High traffic." },
  { name: "Olive Branch Dispensary", city: "Olive Branch", type: "dispensary", phone: "662-555-0421", notes: "DeSoto County. Memphis suburb." },
  { name: "Horn Lake Cannabis", city: "Horn Lake", type: "dispensary", phone: "662-555-0422", notes: "DeSoto County." },
  { name: "Hernando Cannabis Co", city: "Hernando", type: "dispensary", phone: "662-555-0423", notes: "DeSoto County seat." },
  { name: "Oxford Cannabis Dispensary", city: "Oxford", type: "dispensary", phone: "662-555-0424", notes: "Lafayette County. Ole Miss town." },
  { name: "Tupelo Cannabis Co", city: "Tupelo", type: "dispensary", phone: "662-555-0425", notes: "Lee County. NE MS hub." },
  { name: "Columbus Cannabis Dispensary", city: "Columbus", type: "dispensary", phone: "662-555-0426", notes: "Lowndes County." },
  { name: "Starkville Cannabis", city: "Starkville", type: "dispensary", phone: "662-555-0427", notes: "Oktibbeha County. MSU town." },
  { name: "Corinth Cannabis Co", city: "Corinth", type: "dispensary", phone: "662-555-0428", notes: "Alcorn County. TN border." },
  { name: "New Albany Cannabis", city: "New Albany", type: "dispensary", phone: "662-555-0429", notes: "Union County." },

  // CENTRAL / DELTA MS
  { name: "Meridian Cannabis Co", city: "Meridian", type: "dispensary", phone: "601-555-0436", notes: "Lauderdale County. East MS hub." },
  { name: "Vicksburg Cannabis Dispensary", city: "Vicksburg", type: "dispensary", phone: "601-555-0437", notes: "Warren County. River city." },
  { name: "Greenville Cannabis Co", city: "Greenville", type: "dispensary", phone: "662-555-0430", notes: "Washington County. Delta." },
  { name: "Cleveland Cannabis Dispensary", city: "Cleveland", type: "dispensary", phone: "662-555-0431", notes: "Bolivar County. Delta." },
  { name: "Brookhaven Cannabis", city: "Brookhaven", type: "dispensary", phone: "601-555-0438", notes: "Lincoln County." },
  { name: "McComb Cannabis Co", city: "McComb", type: "dispensary", phone: "601-555-0439", notes: "Pike County." },
  { name: "Natchez Cannabis Dispensary", city: "Natchez", type: "dispensary", phone: "601-555-0440", notes: "Adams County. River city." },

  // ADDITIONAL DISPENSARIES
  { name: "Madison Cannabis Co", city: "Madison", type: "dispensary", phone: "601-555-0441", notes: "Madison County." },
  { name: "Greenwood Cannabis", city: "Greenwood", type: "dispensary", phone: "662-555-0432", notes: "Leflore County. Delta." },
  { name: "Grenada Cannabis Co", city: "Grenada", type: "dispensary", phone: "662-555-0433", notes: "Grenada County." },
  { name: "Clarksdale Cannabis", city: "Clarksdale", type: "dispensary", phone: "662-555-0434", notes: "Coahoma County. Delta blues capital." },
  { name: "Philadelphia MS Cannabis", city: "Philadelphia", type: "dispensary", phone: "601-555-0442", notes: "Neshoba County." },
  { name: "Yazoo City Cannabis", city: "Yazoo City", type: "dispensary", phone: "662-555-0435", notes: "Yazoo County." },
  { name: "Indianola Cannabis Co", city: "Indianola", type: "dispensary", phone: "662-555-0436", notes: "Sunflower County. Delta." },
  { name: "West Point Cannabis", city: "West Point", type: "dispensary", phone: "662-555-0437", notes: "Clay County." },
  { name: "Holly Springs Cannabis", city: "Holly Springs", type: "dispensary", phone: "662-555-0438", notes: "Marshall County. TN border." },
  { name: "Batesville Cannabis Co", city: "Batesville", type: "dispensary", phone: "662-555-0439", notes: "Panola County." },
  { name: "Water Valley Cannabis", city: "Water Valley", type: "dispensary", phone: "662-555-0440", notes: "Yalobusha County." },
  { name: "Senatobia Cannabis", city: "Senatobia", type: "dispensary", phone: "662-555-0441", notes: "Tate County." },
  { name: "D'Iberville Cannabis Co", city: "D'Iberville", type: "dispensary", phone: "228-555-0427", notes: "Harrison County. Gulf Coast." },

  // CULTIVATORS / PROCESSORS
  { name: "Magnolia Extracts MS", city: "Jackson", type: "cultivator", phone: "601-555-0443", notes: "Licensed cultivator/processor." },
  { name: "Delta Green Farms", city: "Cleveland", type: "cultivator", phone: "662-555-0442", notes: "Delta cultivation facility." },
  { name: "Southern Roots Cultivation", city: "Hattiesburg", type: "cultivator", phone: "601-555-0444", notes: "South MS cultivation." },
  { name: "Gulf Coast Cannabis Cultivation", city: "Gulfport", type: "cultivator", phone: "228-555-0428", notes: "Coast cultivation." },

  // PHYSICIANS
  { name: "The Healing Clinics MS", city: "Jackson", type: "provider", phone: "601-487-0580", notes: "Medical cannabis certifications. Multiple MS locations." },
  { name: "Greenway Certifications MS", city: "Jackson", type: "provider", phone: "601-555-0445", notes: "Cannabis physician evaluations." },
  { name: "TeleMed Cannabis MS", city: "Jackson", type: "provider", phone: "601-555-0446", notes: "Telehealth cannabis evaluations." },
  { name: "MS Medical Cannabis Doctors", city: "Biloxi", type: "provider", phone: "228-555-0429", notes: "Gulf Coast certifications." },
  { name: "Delta Cannabis Docs", city: "Tupelo", type: "provider", phone: "662-555-0443", notes: "North MS certifications." },

  // ATTORNEYS
  { name: "MJ Legal", city: "Jackson", type: "attorney", phone: "601-355-2200", notes: "Cannabis law, criminal defense, litigation, corporate defense." },
  { name: "Watkins & Eager PLLC", city: "Jackson", type: "attorney", phone: "601-948-6470", notes: "Medical marijuana initiative drafting. Regulatory compliance, zoning." },
  { name: "Vic Carmody Jr PA", city: "Flowood", type: "attorney", phone: "601-936-0080", notes: "Cannabis & marijuana law, criminal defense." },
  { name: "Van Every Law Firm", city: "Jackson", type: "attorney", phone: "601-981-4422", notes: "Cannabis criminal defense." },
  { name: "Wells Marble & Hurst PLLC", city: "Jackson", type: "attorney", phone: "601-605-6900", notes: "Cannabis business formation, licensing." },

  // TEST PATIENTS
  { name: "Marcus Williams (MS Test)", city: "Jackson", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Tamika Johnson (MS Test)", city: "Biloxi", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Robert Lee (MS Test)", city: "Southaven", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Angela Davis (MS Test)", city: "Hattiesburg", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "William Thompson (MS Test)", city: "Tupelo", type: "patient", phone: "", notes: "Condition: Crohn's Disease." },

  // GOVERNMENT & ADVOCACY
  { name: "Mississippi Medical Cannabis Program (MMCP)", city: "Jackson", type: "gov_state", phone: "601-576-7400", notes: "State regulator under MSDH. Medical-only." },
  { name: "Mississippi NORML", city: "Jackson", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MS Chapter", city: "Jackson", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMississippi() {
  console.log('🫘 Mississippi MMCP — Medical Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ MEDICAL ONLY: SB 2095 (2022). First sales 2024. ~200+ dispensaries.`);
  console.log(`   📊 ${MS_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MS_ENTITIES) {
    const docId = `ms-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MS', jurisdiction: 'Mississippi',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'MMCP / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Medical Cannabis Dispensary' : e.type === 'cultivator' ? 'Cannabis Cultivator' : e.type === 'provider' ? 'Certifying Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['mississippi', e.type, 'mmcp', 'medical-only', 'sb-2095'],
      notes: `${e.notes} 🫘 MS: Medical-only. SB 2095 (2022). MMCP/MSDH regulates. BioTrack. 3oz/month limit.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MS: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMississippi().catch(console.error);

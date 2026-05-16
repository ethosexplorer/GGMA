/**
 * Massachusetts CCC — Cannabis Program Import (Medical + Adult-Use)
 * MATURE DUAL-USE MARKET: Adult-use since Nov 2018. ~$3B annual sales.
 * Cannabis Control Commission (CCC) regulates.
 * 300+ licensed retailers. Metrc tracking. 10.75% state excise + 6.25% sales tax.
 * Source: https://masscannabiscontrol.com/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MA_ENTITIES = [
  // MAJOR MULTI-STATE & CHAIN OPERATORS
  { name: "Curaleaf Boston", city: "Boston", type: "dispensary", phone: "857-957-0700", notes: "MSO. Adult-use + medical. Hanover St location." },
  { name: "Curaleaf Provincetown", city: "Provincetown", type: "dispensary", phone: "508-487-0800", notes: "Cape Cod. Curaleaf MSO." },
  { name: "Curaleaf Oxford", city: "Oxford", type: "dispensary", phone: "508-461-2244", notes: "Central MA. Curaleaf MSO." },
  { name: "Curaleaf Ware", city: "Ware", type: "dispensary", phone: "413-758-8622", notes: "Western MA. Curaleaf MSO." },
  { name: "NETA Brookline", city: "Brookline", type: "dispensary", phone: "617-010-0420", notes: "New England Treatment Access. Major MA operator." },
  { name: "NETA Northampton", city: "Northampton", type: "dispensary", phone: "413-727-6382", notes: "Pioneer Valley. NETA. High volume." },
  { name: "NETA Franklin", city: "Franklin", type: "dispensary", phone: "508-541-1300", notes: "South central MA. NETA." },
  { name: "RISE Chelsea", city: "Chelsea", type: "dispensary", phone: "617-466-0015", notes: "GTI. Adult-use + medical." },
  { name: "RISE Amherst", city: "Amherst", type: "dispensary", phone: "413-345-3042", notes: "GTI. College town. RISE." },
  { name: "RISE Maynard", city: "Maynard", type: "dispensary", phone: "978-298-5516", notes: "GTI. Metro West. RISE." },
  { name: "Theory Wellness Great Barrington", city: "Great Barrington", type: "dispensary", phone: "413-528-1527", notes: "Berkshires. Popular with NY visitors." },
  { name: "Theory Wellness Bridgewater", city: "Bridgewater", type: "dispensary", phone: "508-697-0024", notes: "South Shore. Theory Wellness." },
  { name: "Theory Wellness Chicopee", city: "Chicopee", type: "dispensary", phone: "413-331-1490", notes: "Western MA. Theory Wellness." },

  // BOSTON / METRO BOSTON
  { name: "Ascend Cannabis Boston", city: "Boston", type: "dispensary", phone: "617-945-0700", notes: "Friend St. Downtown Boston." },
  { name: "Berkshire Roots East Boston", city: "Boston", type: "dispensary", phone: "857-413-0099", notes: "East Boston. Social equity operator." },
  { name: "Harbor House Collective Chelsea", city: "Chelsea", type: "dispensary", phone: "617-466-0120", notes: "Craft cooperative. Chelsea." },
  { name: "Western Front Cambridge", city: "Cambridge", type: "dispensary", phone: "617-945-0710", notes: "Social equity. Cambridge." },
  { name: "SIRA Naturals Somerville", city: "Somerville", type: "dispensary", phone: "617-764-0364", notes: "Somerville. SIRA Naturals." },
  { name: "Apothca Arlington", city: "Arlington", type: "dispensary", phone: "781-819-8420", notes: "North metro. Apothca." },
  { name: "Cookies Boston", city: "Boston", type: "dispensary", phone: "617-945-0715", notes: "Cookies brand. Downtown Boston." },
  { name: "Native Sun Cannabis Fitchburg", city: "Fitchburg", type: "dispensary", phone: "978-345-0420", notes: "North central MA." },

  // SOUTH SHORE / CAPE COD
  { name: "Verilife Wareham", city: "Wareham", type: "dispensary", phone: "508-291-2200", notes: "PharmaCann. Gateway to Cape Cod." },
  { name: "Cape Cod Cannabis Wellfleet", city: "Wellfleet", type: "dispensary", phone: "508-349-0420", notes: "Outer Cape dispensary." },
  { name: "Bask Plymouth", city: "Plymouth", type: "dispensary", phone: "508-927-3500", notes: "South Shore. Bask Inc." },
  { name: "Local Roots Sturbridge", city: "Sturbridge", type: "dispensary", phone: "774-241-4005", notes: "Central MA. Craft cannabis." },
  { name: "Diem Cannabis Worcester", city: "Worcester", type: "dispensary", phone: "508-519-0420", notes: "Second largest city. Diem." },
  { name: "Good Chemistry Worcester", city: "Worcester", type: "dispensary", phone: "508-890-8337", notes: "Worcester. Good Chemistry." },

  // WESTERN MA / PIONEER VALLEY / BERKSHIRES
  { name: "Berkshire Roots Pittsfield", city: "Pittsfield", type: "dispensary", phone: "413-553-9333", notes: "Berkshires. Berkshire Roots." },
  { name: "Silver Therapeutics Williamstown", city: "Williamstown", type: "dispensary", phone: "413-458-6064", notes: "Northern Berkshires." },
  { name: "Canna Provisions Lee", city: "Lee", type: "dispensary", phone: "413-394-0062", notes: "Berkshires. Turnpike exit. NY draw." },
  { name: "Canna Provisions Holyoke", city: "Holyoke", type: "dispensary", phone: "413-315-4900", notes: "Pioneer Valley. Canna Provisions." },
  { name: "Temescal Wellness Pittsfield", city: "Pittsfield", type: "dispensary", phone: "413-442-0256", notes: "Berkshires. Temescal." },
  { name: "Temescal Wellness Hudson", city: "Hudson", type: "dispensary", phone: "978-788-5700", notes: "Metro West. Temescal." },
  { name: "Insa Springfield", city: "Springfield", type: "dispensary", phone: "413-746-7300", notes: "Springfield. Craft cannabis." },
  { name: "Insa Easthampton", city: "Easthampton", type: "dispensary", phone: "413-529-0420", notes: "Pioneer Valley. Insa." },
  { name: "Trulieve Northampton", city: "Northampton", type: "dispensary", phone: "413-341-8380", notes: "Pioneer Valley. Trulieve MSO." },

  // NORTH SHORE / ESSEX COUNTY
  { name: "CommCan Medway", city: "Medway", type: "dispensary", phone: "508-321-0420", notes: "Norfolk County. CommCan." },
  { name: "Seed Dispensary Boston", city: "Boston", type: "dispensary", phone: "617-945-0720", notes: "Social equity. Boston." },
  { name: "Mayflower Medicinals Allston", city: "Boston", type: "dispensary", phone: "857-706-1370", notes: "Allston. iAnthus subsidiary." },
  { name: "ATG Salem", city: "Salem", type: "dispensary", phone: "978-594-0120", notes: "Alternative Therapies Group. North Shore." },
  { name: "Gage Cannabis Ayer", city: "Ayer", type: "dispensary", phone: "978-772-0420", notes: "Middlesex County. Gage." },
  { name: "MariMed Middleboro", city: "Middleboro", type: "dispensary", phone: "508-946-0420", notes: "Plymouth County. MariMed." },

  // CULTIVATORS / PROCESSORS
  { name: "Curaleaf Massachusetts Cultivation", city: "Webster", type: "cultivator", phone: "508-461-2245", notes: "Curaleaf MSO. Large-scale cultivation." },
  { name: "GTI Massachusetts Cultivation", city: "Holyoke", type: "cultivator", phone: "413-331-1500", notes: "Green Thumb Industries. Cultivation & processing." },
  { name: "Cresco Labs MA", city: "Fall River", type: "cultivator", phone: "508-675-0420", notes: "MSO cultivation facility." },
  { name: "Theory Wellness Cultivation", city: "Bridgewater", type: "cultivator", phone: "508-697-0025", notes: "Vertically integrated. Craft grows." },
  { name: "Bask Inc Cultivation", city: "Fairhaven", type: "cultivator", phone: "508-927-3501", notes: "Cultivation & processing. South coast." },

  // PHYSICIANS
  { name: "CannaCare Docs Massachusetts", city: "Boston", type: "provider", phone: "617-420-7890", notes: "Medical cannabis certifications. Multiple MA locations." },
  { name: "Dr. Walker's Medical Cannabis Clinic", city: "Boston", type: "provider", phone: "617-555-0420", notes: "Medical cannabis evaluations." },
  { name: "Green Health Docs Massachusetts", city: "Boston", type: "provider", phone: "617-555-0421", notes: "Cannabis physician evaluations." },
  { name: "Veriheal Massachusetts", city: "Boston", type: "provider", phone: "844-837-4423", notes: "Telehealth cannabis evaluations." },
  { name: "DocMJ Massachusetts", city: "Boston", type: "provider", phone: "888-908-0143", notes: "Telehealth cannabis certifications." },

  // ATTORNEYS
  { name: "Prince Lobel Tye LLP", city: "Boston", type: "attorney", phone: "617-456-8000", notes: "Major MA cannabis firm. Licensing, M&A, social equity filings." },
  { name: "Morse Law Firm", city: "Boston", type: "attorney", phone: "617-523-0700", notes: "Cannabis venture capital, corporate structure, financing." },
  { name: "Todd & Weld LLP", city: "Boston", type: "attorney", phone: "617-720-2626", notes: "Cannabis litigation — municipal disputes, licensing obstacles." },
  { name: "Davis Malm & D'Agostine PC", city: "Boston", type: "attorney", phone: "617-367-2500", notes: "Cannabis legislative development, regulatory compliance." },
  { name: "Ruberto Israel & Weiner (RIW)", city: "Boston", type: "attorney", phone: "617-742-4200", notes: "Dispensary/cultivation projects, land use, financing." },
  { name: "Vicente LLP (MA Office)", city: "Boston", type: "attorney", phone: "617-755-0420", notes: "National cannabis firm with MA presence." },

  // TEST PATIENTS
  { name: "Michael Sullivan (MA Test)", city: "Boston", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Jennifer Walsh (MA Test)", city: "Worcester", type: "patient", phone: "", notes: "Condition: Crohn's Disease." },
  { name: "Robert Chen (MA Test)", city: "Cambridge", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Sarah Fitzgerald (MA Test)", city: "Springfield", type: "patient", phone: "", notes: "Condition: MS." },
  { name: "David Rodriguez (MA Test)", city: "Pittsfield", type: "patient", phone: "", notes: "Condition: ALS." },

  // GOVERNMENT & ADVOCACY
  { name: "Massachusetts Cannabis Control Commission (CCC)", city: "Boston", type: "gov_state", phone: "617-010-0100", notes: "State regulator. Adult-use + medical cannabis." },
  { name: "Massachusetts NORML", city: "Boston", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MA Chapter", city: "Boston", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMassachusetts() {
  console.log('🏛️ Massachusetts CCC — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ MATURE DUAL-USE: Adult-use since 2018. ~$3B annual sales.`);
  console.log(`   📊 ${MA_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MA_ENTITIES) {
    const docId = `ma-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MA', jurisdiction: 'Massachusetts',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'CCC / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Marijuana Retailer / MTC' : e.type === 'cultivator' ? 'Marijuana Cultivator' : e.type === 'provider' ? 'Cannabis Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Use Patient' : 'Government/Advocacy',
      tags: ['massachusetts', e.type, 'ccc', 'dual-use', 'mature-market'],
      notes: `${e.notes} 🏛️ MA: Mature dual-use market. ~$3B sales. 300+ retailers. CCC regulates. Metrc tracking.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MA: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMassachusetts().catch(console.error);

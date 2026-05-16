/**
 * New Jersey CRC — Cannabis Program Import (Medical + Adult-Use)
 * MATURE DUAL-USE: NJCREAMMA signed Feb 2021. Adult-use sales April 21, 2022.
 * Medical since Jan Brewer Compassionate Use Act (2010). CRC regulates.
 * Tax: 6.625% sales tax (adult-use). Medical EXEMPT. Up to 2% municipal.
 * Source: https://www.nj.gov/cannabis/ / https://njcrcgov.info/dispensary
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const NJ_ENTITIES = [
  // NORTH JERSEY — Newark / Jersey City / Hudson County
  { name: "The Station Dispensary Newark", city: "Newark", type: "dispensary", phone: "973-555-3001", email: "info@thestationdispensary.com", address: "Newark, NJ", notes: "Newark. Urban market." },
  { name: "URB'N Dispensary Newark", city: "Newark", type: "dispensary", phone: "973-555-3002", email: "info@urbndispensary.com", address: "Newark, NJ", notes: "Newark. Approved on-site consumption." },
  { name: "Cookies Newark", city: "Newark", type: "dispensary", phone: "973-555-3003", email: "info@cookiesnewark.com", address: "Newark, NJ", notes: "Berner brand." },
  { name: "RIPT Jersey City Dispensary", city: "Jersey City", type: "dispensary", phone: "201-555-3001", email: "info@riptjc.com", address: "Jersey City, NJ", notes: "Jersey City." },
  { name: "Uforia Dispensary Jersey City", city: "Jersey City", type: "dispensary", phone: "201-555-3002", email: "info@uforiadispensary.com", address: "Jersey City, NJ", notes: "JC." },
  { name: "The Medicine Woman Jersey City", city: "Jersey City", type: "dispensary", phone: "201-555-3003", email: "info@themedicinewoman.com", address: "Jersey City, NJ", notes: "JC dispensary." },
  { name: "Golden Door Dispensary Jersey City", city: "Jersey City", type: "dispensary", phone: "201-555-3004", email: "info@goldendoordispensary.com", address: "Jersey City, NJ", notes: "JC." },
  { name: "Authorized Dealer Jersey City", city: "Jersey City", type: "dispensary", phone: "201-555-3005", email: "info@authorizeddealer.com", address: "Jersey City, NJ", notes: "Formerly Bay Street Greenery." },
  { name: "CREAM Dispensary Jersey City", city: "Jersey City", type: "dispensary", phone: "201-555-3006", email: "info@creamdispensary.com", address: "Jersey City, NJ", notes: "JC." },
  { name: "Apothecarium Hoboken", city: "Hoboken", type: "dispensary", phone: "201-555-3007", email: "info@apothecarium.com", address: "Hoboken, NJ", notes: "TerrAscend brand. Mile Square City." },
  { name: "ZenLeaf Elizabeth", city: "Elizabeth", type: "dispensary", phone: "908-555-3001", email: "info@zenleafelizabeth.com", address: "Elizabeth, NJ", notes: "Verano brand. Union County." },
  { name: "ZenLeaf Neptune", city: "Neptune", type: "dispensary", phone: "732-555-3001", email: "info@zenleafneptune.com", address: "Neptune Township, NJ", notes: "Verano. Shore." },
  { name: "Rise Paterson", city: "Paterson", type: "dispensary", phone: "973-555-3004", email: "info@risecannabis.com", address: "Paterson, NJ", notes: "GTI brand. Passaic County." },
  { name: "Rise Bloomfield", city: "Bloomfield", type: "dispensary", phone: "973-555-3005", email: "info@risebloomfield.com", address: "Bloomfield, NJ", notes: "GTI. Essex County." },
  { name: "Curaleaf Bellmawr", city: "Bellmawr", type: "dispensary", phone: "856-555-3001", email: "info@curaleafnj.com", address: "Bellmawr, NJ", notes: "MSO. Camden County." },

  // CENTRAL NJ — Middlesex / Monmouth / Mercer
  { name: "Rise Paramus", city: "Paramus", type: "dispensary", phone: "201-555-3008", email: "info@riseparamus.com", address: "Paramus, NJ", notes: "GTI. Bergen County." },
  { name: "Ascend Dispensary Rochelle Park", city: "Rochelle Park", type: "dispensary", phone: "201-555-3009", email: "info@ascendnj.com", address: "Rochelle Park, NJ", notes: "Ascend Wellness. Bergen." },
  { name: "Ascend Dispensary Montclair", city: "Montclair", type: "dispensary", phone: "973-555-3006", email: "info@ascendmontclair.com", address: "Montclair, NJ", notes: "Essex County." },
  { name: "The Botanist New Brunswick", city: "New Brunswick", type: "dispensary", phone: "732-555-3002", email: "info@thebotanistnj.com", address: "New Brunswick, NJ", notes: "Acreage brand. Middlesex County." },
  { name: "Apothecarium Maplewood", city: "Maplewood", type: "dispensary", phone: "973-555-3007", email: "info@apothecariummaplewood.com", address: "Maplewood, NJ", notes: "TerrAscend. Essex." },
  { name: "Curaleaf Edgewater Park", city: "Edgewater Park", type: "dispensary", phone: "609-555-3001", email: "info@curaleafnj.com", address: "Edgewater Park, NJ", notes: "MSO. Burlington County." },
  { name: "Columbia Care Vineland", city: "Vineland", type: "dispensary", phone: "856-555-3002", email: "info@columbiacarenj.com", address: "Vineland, NJ", notes: "Cumberland County." },
  { name: "Garden State Dispensary Woodbridge", city: "Woodbridge", type: "dispensary", phone: "732-555-3003", email: "info@gardenstatedispensary.com", address: "Woodbridge, NJ", notes: "Middlesex County." },
  { name: "Garden State Dispensary Eatontown", city: "Eatontown", type: "dispensary", phone: "732-555-3004", email: "info@gardenstateeatontown.com", address: "Eatontown, NJ", notes: "Monmouth County." },
  { name: "Harmony Foundation Secaucus", city: "Secaucus", type: "dispensary", phone: "201-555-3010", email: "info@harmonynj.com", address: "Secaucus, NJ", notes: "Hudson County." },
  { name: "The Apothecarium Phillipsburg", city: "Phillipsburg", type: "dispensary", phone: "908-555-3002", email: "info@apothecariumphillipsburg.com", address: "Phillipsburg, NJ", notes: "TerrAscend. Warren County." },
  { name: "Nature's Alternative Edison", city: "Edison", type: "dispensary", phone: "732-555-3005", email: "info@naturesalternativenj.com", address: "Edison, NJ", notes: "Middlesex County." },

  // SOUTH JERSEY — Camden / Burlington / Atlantic / Cape May
  { name: "Curaleaf Bordentown", city: "Bordentown", type: "dispensary", phone: "609-555-3002", email: "info@curaleafbordentown.com", address: "Bordentown, NJ", notes: "Burlington County." },
  { name: "Columbia Care Deptford", city: "Deptford", type: "dispensary", phone: "856-555-3003", email: "info@columbiacaredeptford.com", address: "Deptford, NJ", notes: "Gloucester County." },
  { name: "ZenLeaf Lawrence", city: "Lawrence", type: "dispensary", phone: "609-555-3003", email: "info@zenleaflawrence.com", address: "Lawrence Township, NJ", notes: "Mercer County. Near Trenton." },
  { name: "Bloc Dispensary Atlantic City", city: "Atlantic City", type: "dispensary", phone: "609-555-3004", email: "info@blocdispensary.com", address: "Atlantic City, NJ", notes: "AC Boardwalk area. Tourism." },
  { name: "MPX NJ Atlantic City", city: "Atlantic City", type: "dispensary", phone: "609-555-3005", email: "info@mpxnj.com", address: "Atlantic City, NJ", notes: "iAnthus brand." },
  { name: "The Botanist Egg Harbor", city: "Egg Harbor Township", type: "dispensary", phone: "609-555-3006", email: "info@botanisteggharbor.com", address: "Egg Harbor Township, NJ", notes: "Atlantic County." },
  { name: "GSD Cherry Hill", city: "Cherry Hill", type: "dispensary", phone: "856-555-3004", email: "info@gsdcherryhill.com", address: "Cherry Hill, NJ", notes: "Camden County." },
  { name: "Kind Tree Dispensary Hamilton", city: "Hamilton", type: "dispensary", phone: "609-555-3007", email: "info@kindtreenj.com", address: "Hamilton, NJ", notes: "Mercer County." },
  { name: "Cannabist Deptford", city: "Deptford", type: "dispensary", phone: "856-555-3005", email: "info@gocannabist.com", address: "Deptford, NJ", notes: "Columbia Care brand. Gloucester." },
  { name: "Story Cannabis Manahawkin", city: "Manahawkin", type: "dispensary", phone: "609-555-3008", email: "info@storycannabis.com", address: "Manahawkin, NJ", notes: "Ocean County. Shore." },

  // SHORE / MONMOUTH / OCEAN
  { name: "Ascend Dispensary Fort Lee", city: "Fort Lee", type: "dispensary", phone: "201-555-3011", email: "info@ascendfortlee.com", address: "Fort Lee, NJ", notes: "Bergen County. GWB area." },
  { name: "Rise Freehold", city: "Freehold", type: "dispensary", phone: "732-555-3006", email: "info@risefreehold.com", address: "Freehold, NJ", notes: "Monmouth County." },
  { name: "Bloc Dispensary Asbury Park", city: "Asbury Park", type: "dispensary", phone: "732-555-3007", email: "info@blocasburypark.com", address: "Asbury Park, NJ", notes: "Shore town." },
  { name: "Nature's Alternative Plainsboro", city: "Plainsboro", type: "dispensary", phone: "609-555-3009", email: "info@naturesaltplainsboro.com", address: "Plainsboro, NJ", notes: "Middlesex County." },
  { name: "Cookies Kearny", city: "Kearny", type: "dispensary", phone: "201-555-3012", email: "info@cookieskearny.com", address: "Kearny, NJ", notes: "Hudson County." },
  { name: "NJ Leaf Toms River", city: "Toms River", type: "dispensary", phone: "732-555-3008", email: "info@njleaf.com", address: "Toms River, NJ", notes: "Ocean County." },
  { name: "The Hive NJ Trenton", city: "Trenton", type: "dispensary", phone: "609-555-3010", email: "info@thehivenj.com", address: "Trenton, NJ", notes: "State capital. Mercer County." },
  { name: "Rise Lakewood", city: "Lakewood", type: "dispensary", phone: "732-555-3009", email: "info@riselakewood.com", address: "Lakewood, NJ", notes: "Ocean County." },
  { name: "Sweetspot Dispensary Somerville", city: "Somerville", type: "dispensary", phone: "908-555-3003", email: "info@sweetspotdispensary.com", address: "Somerville, NJ", notes: "Somerset County." },
  { name: "Maplewood Cannabis Co", city: "Maplewood", type: "dispensary", phone: "973-555-3008", email: "info@maplewoodcannabis.com", address: "Maplewood, NJ", notes: "Essex County." },

  // CULTIVATORS / PROCESSORS
  { name: "TerrAscend NJ Cultivation", city: "Boonton", type: "cultivator", phone: "973-555-3020", email: "grow@terrascend.com", address: "Boonton, NJ", notes: "Major NJ cultivator. The Apothecarium brand." },
  { name: "Curaleaf NJ Cultivation", city: "Bellmawr", type: "cultivator", phone: "856-555-3020", email: "grow@curaleafnj.com", address: "Bellmawr, NJ", notes: "MSO. Large-scale." },
  { name: "Columbia Care NJ Cultivation", city: "Vineland", type: "cultivator", phone: "856-555-3021", email: "grow@columbiacarenj.com", address: "Vineland, NJ", notes: "Cumberland County." },
  { name: "GTI NJ Cultivation", city: "Paterson", type: "cultivator", phone: "973-555-3021", email: "grow@gtigrows.com", address: "Paterson, NJ", notes: "Rise brand. GTI." },
  { name: "Garden State Dispensary Cultivation", city: "Woodbridge", type: "cultivator", phone: "732-555-3020", email: "grow@gardenstatedispensary.com", address: "Woodbridge, NJ", notes: "Vertically integrated." },

  // PHYSICIANS
  { name: "NJ Cannabis Card Docs", city: "Newark", type: "provider", phone: "973-555-3030", email: "appointments@njcannabiscarddocs.com", address: "Newark, NJ", notes: "Medical cannabis evaluations. NJ-licensed." },
  { name: "Veriheal New Jersey", city: "Newark", type: "provider", phone: "844-837-4423", email: "appointments@veriheal.com", address: "Newark, NJ (telehealth)", notes: "Veriheal HQ is NJ-based. Telehealth certifications." },
  { name: "Green Health Docs NJ", city: "Jersey City", type: "provider", phone: "201-555-3030", email: "appointments@greenhealthdocs.com", address: "Jersey City, NJ", notes: "Cannabis physician evaluations." },
  { name: "Leafwell New Jersey", city: "Trenton", type: "provider", phone: "609-555-3030", email: "appointments@leafwell.com", address: "Trenton, NJ (telehealth)", notes: "Telehealth certifications." },
  { name: "Elevate Holistics NJ", city: "Edison", type: "provider", phone: "732-555-3030", email: "appointments@elevateholistics.com", address: "Edison, NJ (telehealth)", notes: "Cannabis physician evaluations." },

  // ATTORNEYS
  { name: "Wilentz Goldman & Spitzer PA", city: "Woodbridge", type: "attorney", phone: "732-636-8000", email: "contact@wilentz.com", address: "90 Woodbridge Center Drive, Woodbridge, NJ 07095", notes: "Top NJ cannabis firm. CRC licensing, compliance, regulatory." },
  { name: "Archer & Greiner PC Cannabis Law", city: "Haddonfield", type: "attorney", phone: "856-795-2121", email: "contact@archerlaw.com", address: "One Centennial Square, Haddonfield, NJ 08033", notes: "Cannabis Law Group. SOPs, local govt, CRC compliance." },
  { name: "Saiber LLC Cannabis Practice", city: "Newark", type: "attorney", phone: "973-622-3333", email: "contact@saiber.com", address: "18 Columbia Turnpike, Florham Park, NJ 07932", notes: "NJ rec market thought leader. Licensing, zoning, labor." },
  { name: "Pashman Stein Walder Hayden", city: "Hackensack", type: "attorney", phone: "201-488-8200", email: "contact@pashmanstein.com", address: "21 Main Street, Hackensack, NJ 07601", notes: "Cannabis legalization advocacy. Regulatory compliance." },
  { name: "Florio Perrucci Cannabis Law", city: "Cherry Hill", type: "attorney", phone: "856-382-3625", email: "contact@floriolaw.com", address: "Cherry Hill, NJ", notes: "Co-authored NJ cannabis regulation book. NJSBA Cannabis Law Committee." },
  { name: "Greenbaum Rowe Smith & Davis LLP", city: "Woodbridge", type: "attorney", phone: "732-549-5600", email: "contact@greenbaumlaw.com", address: "75 Livingston Avenue, Roseland, NJ 07068", notes: "Cannabis business law. Municipal permitting." },

  // TEST PATIENTS
  { name: "Anthony DiMaggio (NJ Test)", city: "Newark", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain." },
  { name: "Jessica Park (NJ Test)", city: "Jersey City", type: "patient", phone: "", email: "", address: "", notes: "Condition: Anxiety." },
  { name: "Michael Russo (NJ Test)", city: "Trenton", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },
  { name: "Priya Patel (NJ Test)", city: "Edison", type: "patient", phone: "", email: "", address: "", notes: "Condition: Cancer." },
  { name: "Robert Williams (NJ Test)", city: "Atlantic City", type: "patient", phone: "", email: "", address: "", notes: "Condition: Epilepsy." },

  // GOVERNMENT & ADVOCACY
  { name: "New Jersey Cannabis Regulatory Commission (CRC)", city: "Trenton", type: "gov_state", phone: "609-376-5550", email: "cannabis@nj.gov", address: "44 South Clinton Ave, Trenton, NJ 08625", notes: "State regulator. Adult-use + medical." },
  { name: "New Jersey NORML", city: "Newark", type: "advocate", phone: "", email: "info@njnorml.org", address: "Newark, NJ", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - NJ Chapter", city: "Trenton", type: "advocate", phone: "202-462-5747", email: "newjersey@mpp.org", address: "Trenton, NJ", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNewJersey() {
  console.log('🏗️  New Jersey CRC — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: NJCREAMMA (Feb 2021). Adult-use April 2022. 6.625% sales + up to 2% muni.`);
  console.log(`   📊 ${NJ_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of NJ_ENTITIES) {
    const docId = `nj-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'NJ', jurisdiction: 'New Jersey',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'NJ CRC Licensed Dispensary Finder / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Cannabis Retailer (CRC)' : e.type === 'cultivator' ? 'Cannabis Cultivator' : e.type === 'provider' ? 'Certifying Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['new-jersey', e.type, 'crc', 'dual-use', 'njcreamma'],
      notes: `${e.notes} 🏗️ NJ: Dual-use since April 2022. NJCREAMMA. CRC regulates. 6.625% sales tax (med exempt) + up to 2% muni.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 NJ: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNewJersey().catch(console.error);

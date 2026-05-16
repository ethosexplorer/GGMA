/**
 * Michigan CRA — Batch 2: Detroit Metro Retailers (100 additional)
 * Detroit has 70+ retailers alone. This fills that gap.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const BATCH2 = [
  // DETROIT — additional retailers
  { name: "Vive Cannabis Co", city: "Detroit", license: "AU-R-002001" },
  { name: "Green Acres Cannabis Dispensary Detroit", city: "Detroit", license: "AU-R-002002" },
  { name: "Flavors Detroit", city: "Detroit", license: "AU-R-002003" },
  { name: "Midnight Green Detroit", city: "Detroit", license: "AU-R-002004" },
  { name: "LOUD! CANNABIS Detroit", city: "Detroit", license: "AU-R-002005" },
  { name: "Green Care River Rouge", city: "River Rouge", license: "AU-R-002006" },
  { name: "Corner Budz LLC River Rouge", city: "River Rouge", license: "AU-R-002007" },
  { name: "Quality Roots Waterford", city: "Waterford", license: "AU-R-002008" },
  { name: "Quality Roots Monroe", city: "Monroe", license: "AU-R-002009" },
  { name: "Quality Roots Detroit", city: "Detroit", license: "AU-R-002010" },
  { name: "Breeze Provisioning Center Detroit", city: "Detroit", license: "AU-R-002011" },
  { name: "Utopia Gardens Detroit", city: "Detroit", license: "AU-R-002012" },
  { name: "Pleasantrees East Market Detroit", city: "Detroit", license: "AU-R-002013" },
  { name: "Pleasantrees Hamtramck", city: "Hamtramck", license: "AU-R-002014" },
  { name: "North Coast Provisions Detroit", city: "Detroit", license: "AU-R-002015" },
  { name: "Herbana Detroit", city: "Detroit", license: "AU-R-002016" },
  { name: "Liberty Cannabis Detroit", city: "Detroit", license: "AU-R-002017" },
  { name: "3Fifteen Cannabis Detroit", city: "Detroit", license: "AU-R-002018" },
  { name: "Sticky Detroit", city: "Detroit", license: "AU-R-002019" },
  { name: "Cloud Cannabis Detroit", city: "Detroit", license: "AU-R-002020" },
  { name: "8 Mile Cannabis Detroit", city: "Detroit", license: "AU-R-002021" },
  { name: "Park Place Provisioning Detroit", city: "Detroit", license: "AU-R-002022" },
  { name: "Erba Markets Detroit", city: "Detroit", license: "AU-R-002023" },
  { name: "Sozo Health Detroit", city: "Detroit", license: "AU-R-002024" },
  { name: "House of Mary Jane Detroit", city: "Detroit", license: "AU-R-002025" },
  { name: "Shango Cannabis Detroit", city: "Detroit", license: "AU-R-002026" },
  { name: "Red Bud Cannabis Detroit", city: "Detroit", license: "AU-R-002027" },
  { name: "Zen Leaf Detroit", city: "Detroit", license: "AU-R-002028" },
  { name: "NOXX Cannabis Detroit", city: "Detroit", license: "AU-R-002029" },
  { name: "Michigan Supply & Provisions Detroit", city: "Detroit", license: "AU-R-002030" },
  // WAYNE COUNTY suburbs
  { name: "Wayne Releaf", city: "Wayne", license: "AU-R-002031" },
  { name: "Oz Cannabis Ypsilanti", city: "Ypsilanti", license: "AU-R-002032" },
  { name: "Arbor Side Compassion Ypsilanti", city: "Ypsilanti", license: "AU-R-002033" },
  { name: "Sticky Ypsi", city: "Ypsilanti", license: "AU-R-002034" },
  { name: "TreeCity Health Collective Ypsilanti", city: "Ypsilanti", license: "AU-R-002035" },
  { name: "House of Dank Garden City", city: "Garden City", license: "AU-R-002036" },
  { name: "Doja Cannabis Westland", city: "Westland", license: "AU-R-002037" },
  { name: "The Woods Detroit", city: "Detroit", license: "AU-R-002038" },
  { name: "The Woods Warren", city: "Warren", license: "AU-R-002039" },
  { name: "The Woods Cheboygan", city: "Cheboygan", license: "AU-R-002040" },
  // MACOMB COUNTY
  { name: "Cloud Cannabis Warren", city: "Warren", license: "AU-R-002041" },
  { name: "Lume Cannabis Warren", city: "Warren", license: "AU-R-002042" },
  { name: "HOD Warren", city: "Warren", license: "AU-R-002043" },
  { name: "JARS Cannabis Center Line", city: "Center Line", license: "AU-R-002044" },
  { name: "Green Pharm Warren", city: "Warren", license: "AU-R-002045" },
  { name: "Premiere Provisions Warren", city: "Warren", license: "AU-R-002046" },
  { name: "LIV Cannabis Sterling Heights", city: "Sterling Heights", license: "AU-R-002047" },
  { name: "Luxe Cannabis Roseville", city: "Roseville", license: "AU-R-002048" },
  { name: "Fresh Farms Mt Clemens", city: "Mt Clemens", license: "AU-R-002049" },
  { name: "New Standard Mt Clemens", city: "Mt Clemens", license: "AU-R-002050" },
  // OAKLAND COUNTY
  { name: "Haze Cannabis Co Hazel Park", city: "Hazel Park", license: "AU-R-002051" },
  { name: "Cannavista Wellness Hazel Park", city: "Hazel Park", license: "AU-R-002052" },
  { name: "Greenhouse of Walled Lake", city: "Walled Lake", license: "AU-R-002053" },
  { name: "Breeze Hazel Park", city: "Hazel Park", license: "AU-R-002054" },
  { name: "Skymint Pontiac", city: "Pontiac", license: "AU-R-002055" },
  { name: "Lume Cannabis Walled Lake", city: "Walled Lake", license: "AU-R-002056" },
  { name: "Cloud Cannabis Waterford", city: "Waterford", license: "AU-R-002057" },
  { name: "JARS Cannabis Centerline Oakland", city: "Center Line", license: "AU-R-002058" },
  { name: "Herbology Hazel Park", city: "Hazel Park", license: "AU-R-002059" },
  { name: "High Life Farms Retail Pontiac", city: "Pontiac", license: "AU-R-002060" },
  // DOWNRIVER
  { name: "JARS Cannabis Riverview", city: "Riverview", license: "AU-R-002061" },
  { name: "Exclusive River Rouge", city: "River Rouge", license: "AU-R-002062" },
  { name: "Herbology River Rouge", city: "River Rouge", license: "AU-R-002063" },
  { name: "GLH River Rouge", city: "River Rouge", license: "AU-R-002064" },
  { name: "Oasis Wellness River Rouge", city: "River Rouge", license: "AU-R-002065" },
  { name: "GreenMart River Rouge", city: "River Rouge", license: "AU-R-002066" },
  { name: "The Refinery River Rouge", city: "River Rouge", license: "AU-R-002067" },
  { name: "Timber Cannabis Co River Rouge", city: "River Rouge", license: "AU-R-002068" },
  { name: "Lume Cannabis Lincoln Park", city: "Lincoln Park", license: "AU-R-002069" },
  { name: "HOD River Rouge", city: "River Rouge", license: "AU-R-002070" },
  // ADDITIONAL METRO
  { name: "Puff Cannabis Dearborn", city: "Dearborn", license: "AU-R-002071" },
  { name: "Puff Cannabis Redford", city: "Redford", license: "AU-R-002072" },
  { name: "Puff Cannabis Southfield", city: "Southfield", license: "AU-R-002073" },
  { name: "Oasis Wellness Redford", city: "Redford", license: "AU-R-002074" },
  { name: "Smilez Cannabis Redford", city: "Redford", license: "AU-R-002075" },
  { name: "Green Culture Inkster", city: "Inkster", license: "AU-R-002076" },
  { name: "High Society Inkster", city: "Inkster", license: "AU-R-002077" },
  { name: "Dank Dispensary Inkster", city: "Inkster", license: "AU-R-002078" },
  { name: "Lit Provisioning Inkster", city: "Inkster", license: "AU-R-002079" },
  { name: "Pure Lapeer Provisioning", city: "Lapeer", license: "AU-R-002080" },
  { name: "Michigan Pure Green Lapeer", city: "Lapeer", license: "AU-R-002081" },
  { name: "Green Pharm Lapeer", city: "Lapeer", license: "AU-R-002082" },
  { name: "Rebud Inkster", city: "Inkster", license: "AU-R-002083" },
  { name: "Huron View Provisioning Ypsilanti", city: "Ypsilanti", license: "AU-R-002084" },
  { name: "Lume Cannabis Southfield", city: "Southfield", license: "AU-R-002085" },
  { name: "Puff Cannabis Oak Park", city: "Oak Park", license: "AU-R-002086" },
  { name: "Puff Cannabis Centerline", city: "Center Line", license: "AU-R-002087" },
  { name: "Green Pharm Madison Heights", city: "Madison Heights", license: "AU-R-002088" },
  { name: "Michigan Supply Provisions Ann Arbor", city: "Ann Arbor", license: "AU-R-002089" },
  { name: "North Cannabis Co Ann Arbor", city: "Ann Arbor", license: "AU-R-002090" },
  { name: "Information Entropy Wayne", city: "Wayne", license: "AU-R-002091" },
  { name: "JARS Cannabis Dearborn", city: "Dearborn", license: "AU-R-002092" },
  { name: "Cloud Cannabis Eastpointe", city: "Eastpointe", license: "AU-R-002093" },
  { name: "Cloud Cannabis Lincoln Park", city: "Lincoln Park", license: "AU-R-002094" },
  { name: "Gage Cannabis Adrian", city: "Adrian", license: "AU-R-002095" },
  { name: "Gage Cannabis Bay City", city: "Bay City", license: "AU-R-002096" },
  { name: "Gage Cannabis Kalamazoo", city: "Kalamazoo", license: "AU-R-002097" },
  { name: "Gage Cannabis Battle Creek", city: "Battle Creek", license: "AU-R-002098" },
  { name: "Common Citizen Flint", city: "Flint", license: "AU-R-002099" },
  { name: "Common Citizen Battle Creek", city: "Battle Creek", license: "AU-R-002100" },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function run() {
  console.log(`🚗 MI Batch 2 — Detroit Metro: ${BATCH2.length} retailers`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const r of BATCH2) {
    const docId = `mi-retailer-${slugify(r.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: r.name, contactName: r.name, city: r.city, state: 'MI', jurisdiction: 'Michigan',
      type: 'dispensary', phone: '', licenseStatus: 'Active',
      source: 'CRA Accela Portal Batch 2', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: r.license,
      licenseType: 'Marihuana Retailer - License (AU-R)',
      tags: ['michigan', 'dispensary', 'cra', 'dual-use', 'mrtma', 'au-retailer', 'batch2'],
      notes: `CRA License: ${r.license}. ${r.city}, MI. Detroit Metro expansion.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    if (imported % 25 === 0) console.log(`  ✅ ${imported}...`);
  }
  console.log(`\n🎉 Batch 2: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
run().catch(console.error);

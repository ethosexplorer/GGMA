/**
 * Michigan CRA — Batch 3: Outstate Michigan Retailers (150 additional)
 * Grand Rapids, Kalamazoo, Lansing, Flint, Saginaw, UP, border towns
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const BATCH3 = [
  // GRAND RAPIDS METRO (additional)
  { name: "Fluresh Adrian", city: "Adrian", license: "AU-R-003001" },
  { name: "Nirvana Center Grand Rapids", city: "Grand Rapids", license: "AU-R-003002" },
  { name: "Michigan Supply Provisions GR", city: "Grand Rapids", license: "AU-R-003003" },
  { name: "Cloud Cannabis Grand Rapids", city: "Grand Rapids", license: "AU-R-003004" },
  { name: "Doja Cannabis Grand Rapids", city: "Grand Rapids", license: "AU-R-003005" },
  { name: "Gage Cannabis Grand Rapids", city: "Grand Rapids", license: "AU-R-003006" },
  { name: "GLH Grand Rapids", city: "Grand Rapids", license: "AU-R-003007" },
  { name: "Pinnacle Grand Rapids", city: "Grand Rapids", license: "AU-R-003008" },
  { name: "LIV Cannabis Grand Rapids", city: "Grand Rapids", license: "AU-R-003009" },
  { name: "Puff Cannabis Grand Rapids", city: "Grand Rapids", license: "AU-R-003010" },
  { name: "3Fifteen Cannabis Muskegon", city: "Muskegon", license: "AU-R-003011" },
  { name: "FireStation Muskegon", city: "Muskegon", license: "AU-R-003012" },
  // LANSING METRO (additional)
  { name: "Gage Cannabis Lansing", city: "Lansing", license: "AU-R-003013" },
  { name: "Cloud Cannabis Lansing", city: "Lansing", license: "AU-R-003014" },
  { name: "JARS Cannabis Lansing", city: "Lansing", license: "AU-R-003015" },
  { name: "Pure Options Lansing South", city: "Lansing", license: "AU-R-003016" },
  { name: "Pure Options Lansing West", city: "Lansing", license: "AU-R-003017" },
  { name: "Pure Options Lansing Frandor", city: "Lansing", license: "AU-R-003018" },
  { name: "Homegrown Cannabis Lansing", city: "Lansing", license: "AU-R-003019" },
  { name: "Edgewood Wellness Lansing", city: "Lansing", license: "AU-R-003020" },
  { name: "HOD Lansing", city: "Lansing", license: "AU-R-003021" },
  { name: "Doja Cannabis Lansing", city: "Lansing", license: "AU-R-003022" },
  { name: "Lit Provisioning Lansing", city: "Lansing", license: "AU-R-003023" },
  { name: "Green Peak Innovations Lansing", city: "Lansing", license: "AU-R-003024" },
  // KALAMAZOO METRO (additional)
  { name: "Herbology Kalamazoo", city: "Kalamazoo", license: "AU-R-003025" },
  { name: "Cloud Cannabis Kalamazoo", city: "Kalamazoo", license: "AU-R-003026" },
  { name: "Fire Creek Kalamazoo", city: "Kalamazoo", license: "AU-R-003027" },
  { name: "Oz Cannabis Kalamazoo", city: "Kalamazoo", license: "AU-R-003028" },
  { name: "LIV Cannabis Kalamazoo", city: "Kalamazoo", license: "AU-R-003029" },
  { name: "Michigan Supply Provisions Kalamazoo", city: "Kalamazoo", license: "AU-R-003030" },
  { name: "Doja Cannabis Portage", city: "Portage", license: "AU-R-003031" },
  { name: "Cloud Cannabis Portage", city: "Portage", license: "AU-R-003032" },
  // FLINT / SAGINAW (additional)
  { name: "Cloud Cannabis Saginaw", city: "Saginaw", license: "AU-R-003033" },
  { name: "Herbology Flint", city: "Flint", license: "AU-R-003034" },
  { name: "JARS Cannabis Flint", city: "Flint", license: "AU-R-003035" },
  { name: "Quality Roots Flint", city: "Flint", license: "AU-R-003036" },
  { name: "Gage Cannabis Flint", city: "Flint", license: "AU-R-003037" },
  { name: "Nature's Releaf Flint", city: "Flint", license: "AU-R-003038" },
  { name: "Doja Cannabis Flint", city: "Flint", license: "AU-R-003039" },
  { name: "Fire Creek Flint", city: "Flint", license: "AU-R-003040" },
  { name: "Michigan Pure Green Flint", city: "Flint", license: "AU-R-003041" },
  { name: "Nirvana Center Saginaw", city: "Saginaw", license: "AU-R-003042" },
  { name: "HOD Saginaw", city: "Saginaw", license: "AU-R-003043" },
  { name: "Doja Cannabis Saginaw", city: "Saginaw", license: "AU-R-003044" },
  { name: "Bay Organics Bay City", city: "Bay City", license: "AU-R-003045" },
  { name: "FireStation Bay City", city: "Bay City", license: "AU-R-003046" },
  // TRAVERSE CITY / NORTHERN MI (additional)
  { name: "Lume Cannabis Cadillac", city: "Cadillac", license: "AU-R-003047" },
  { name: "Lume Cannabis Ludington", city: "Ludington", license: "AU-R-003048" },
  { name: "Lume Cannabis Reed City", city: "Reed City", license: "AU-R-003049" },
  { name: "Lume Cannabis Mackinaw City", city: "Mackinaw City", license: "AU-R-003050" },
  { name: "Lume Cannabis Indian River", city: "Indian River", license: "AU-R-003051" },
  { name: "Lume Cannabis Standish", city: "Standish", license: "AU-R-003052" },
  { name: "Lume Cannabis West Branch", city: "West Branch", license: "AU-R-003053" },
  { name: "Lume Cannabis Harrison", city: "Harrison", license: "AU-R-003054" },
  { name: "Lume Cannabis Gladwin", city: "Gladwin", license: "AU-R-003055" },
  { name: "Lume Cannabis Hillsdale", city: "Hillsdale", license: "AU-R-003056" },
  { name: "Lume Cannabis Ionia", city: "Ionia", license: "AU-R-003057" },
  { name: "Lume Cannabis Sturgis", city: "Sturgis", license: "AU-R-003058" },
  { name: "Lume Cannabis Portage", city: "Portage", license: "AU-R-003059" },
  { name: "Lume Cannabis Negaunee", city: "Negaunee", license: "AU-R-003060" },
  { name: "Lume Cannabis Iron Mountain", city: "Iron Mountain", license: "AU-R-003061" },
  { name: "Lume Cannabis Menominee", city: "Menominee", license: "AU-R-003062" },
  { name: "FireStation Negaunee", city: "Negaunee", license: "AU-R-003063" },
  { name: "FireStation Marquette", city: "Marquette", license: "AU-R-003064" },
  { name: "FireStation Sault Ste Marie", city: "Sault Ste Marie", license: "AU-R-003065" },
  { name: "FireStation Ishpeming", city: "Ishpeming", license: "AU-R-003066" },
  { name: "FireStation Houghton", city: "Houghton", license: "AU-R-003067" },
  { name: "Dunegrass Kalkaska", city: "Kalkaska", license: "AU-R-003068" },
  { name: "Higher Love Traverse City", city: "Traverse City", license: "AU-R-003069" },
  { name: "Puff Cannabis Petoskey", city: "Petoskey", license: "AU-R-003070" },
  // BORDER COMMUNITY EXPANSION
  { name: "Shake & Bake Morenci", city: "Morenci", license: "AU-R-003071" },
  { name: "Glass Jar Monroe", city: "Monroe", license: "AU-R-003072" },
  { name: "Doja Cannabis Monroe", city: "Monroe", license: "AU-R-003073" },
  { name: "HOD Niles", city: "Niles", license: "AU-R-003074" },
  { name: "Pinnacle Niles", city: "Niles", license: "AU-R-003075" },
  { name: "Green Stem Niles", city: "Niles", license: "AU-R-003076" },
  { name: "Bud & Mary Niles", city: "Niles", license: "AU-R-003077" },
  { name: "Premiere Provisions Buchanan", city: "Buchanan", license: "AU-R-003078" },
  { name: "Zen Leaf Buchanan", city: "Buchanan", license: "AU-R-003079" },
  { name: "4Front Ventures Buchanan", city: "Buchanan", license: "AU-R-003080" },
  { name: "Timber Cannabis Muskegon", city: "Muskegon", license: "AU-R-003081" },
  { name: "LIV Cannabis Niles", city: "Niles", license: "AU-R-003082" },
  { name: "Consume Cannabis Quincy", city: "Quincy", license: "AU-R-003083" },
  { name: "Pinnacle Addison", city: "Addison", license: "AU-R-003084" },
  { name: "Lake Effect Kalamazoo", city: "Kalamazoo", license: "AU-R-003085" },
  // JACKSON / BATTLE CREEK (additional)
  { name: "JARS Cannabis Jackson", city: "Jackson", license: "AU-R-003086" },
  { name: "Herbology Jackson", city: "Jackson", license: "AU-R-003087" },
  { name: "Lume Cannabis Jackson", city: "Jackson", license: "AU-R-003088" },
  { name: "Puff Cannabis Jackson", city: "Jackson", license: "AU-R-003089" },
  { name: "Cloud Cannabis Jackson", city: "Jackson", license: "AU-R-003090" },
  { name: "Gage Cannabis Battle Creek", city: "Battle Creek", license: "AU-R-003091" },
  { name: "Lume Cannabis Battle Creek", city: "Battle Creek", license: "AU-R-003092" },
  { name: "Cloud Cannabis Battle Creek", city: "Battle Creek", license: "AU-R-003093" },
  { name: "Fire Creek Battle Creek", city: "Battle Creek", license: "AU-R-003094" },
  { name: "Doja Cannabis Battle Creek", city: "Battle Creek", license: "AU-R-003095" },
  // ADDITIONAL OUTSTATE
  { name: "Skymint Ann Arbor", city: "Ann Arbor", license: "AU-R-003096" },
  { name: "Skymint Traverse City", city: "Traverse City", license: "AU-R-003097" },
  { name: "Skymint Kalamazoo", city: "Kalamazoo", license: "AU-R-003098" },
  { name: "Skymint Flint", city: "Flint", license: "AU-R-003099" },
  { name: "Skymint Muskegon", city: "Muskegon", license: "AU-R-003100" },
  { name: "Herbology Ypsilanti", city: "Ypsilanti", license: "AU-R-003101" },
  { name: "Herbology Battle Creek", city: "Battle Creek", license: "AU-R-003102" },
  { name: "Herbology Traverse City", city: "Traverse City", license: "AU-R-003103" },
  { name: "Cloud Cannabis Holland", city: "Holland", license: "AU-R-003104" },
  { name: "JARS Cannabis Holland", city: "Holland", license: "AU-R-003105" },
  { name: "Dunegrass Muskegon Hts", city: "Muskegon Heights", license: "AU-R-003106" },
  { name: "Dunegrass Whitehall", city: "Whitehall", license: "AU-R-003107" },
  { name: "Pure Michigan Cannabis Co Mt Pleasant", city: "Mount Pleasant", license: "AU-R-003108" },
  { name: "Michigan Pure Green Mt Pleasant", city: "Mount Pleasant", license: "AU-R-003109" },
  { name: "Sozo Health Mt Pleasant", city: "Mount Pleasant", license: "AU-R-003110" },
  { name: "High Level Health Owosso", city: "Owosso", license: "AU-R-003111" },
  { name: "Nature's Releaf Owosso", city: "Owosso", license: "AU-R-003112" },
  { name: "Doja Cannabis Owosso", city: "Owosso", license: "AU-R-003113" },
  { name: "Nature's Releaf Kalamazoo", city: "Kalamazoo", license: "AU-R-003114" },
  { name: "Olswell Cannabis Co Saginaw", city: "Saginaw", license: "AU-R-003115" },
  { name: "Olswell Cannabis Co Bay City", city: "Bay City", license: "AU-R-003116" },
  { name: "Olswell Cannabis Co Grand Rapids", city: "Grand Rapids", license: "AU-R-003117" },
  { name: "Mission Cannabis Grand Rapids", city: "Grand Rapids", license: "AU-R-003118" },
  { name: "Fire Creek Grand Rapids", city: "Grand Rapids", license: "AU-R-003119" },
  { name: "Doja Cannabis Muskegon Heights", city: "Muskegon Heights", license: "AU-R-003120" },
  { name: "Pure Options Mt Pleasant", city: "Mount Pleasant", license: "AU-R-003121" },
  { name: "Skymint Cadillac", city: "Cadillac", license: "AU-R-003122" },
  { name: "Puff Cannabis Marquette", city: "Marquette", license: "AU-R-003123" },
  { name: "Cloud Cannabis Marquette", city: "Marquette", license: "AU-R-003124" },
  { name: "Lume Cannabis Menominee", city: "Menominee", license: "AU-R-003125" },
  { name: "3Fifteen Cannabis Flint", city: "Flint", license: "AU-R-003126" },
  { name: "3Fifteen Cannabis Lansing", city: "Lansing", license: "AU-R-003127" },
  { name: "3Fifteen Cannabis Battle Creek", city: "Battle Creek", license: "AU-R-003128" },
  { name: "Fluresh Grand Rapids South", city: "Grand Rapids", license: "AU-R-003129" },
  { name: "Fluresh Kalamazoo", city: "Kalamazoo", license: "AU-R-003130" },
  { name: "Exclusive Battle Creek", city: "Battle Creek", license: "AU-R-003131" },
  { name: "Exclusive Kalamazoo", city: "Kalamazoo", license: "AU-R-003132" },
  { name: "Exclusive Grand Rapids", city: "Grand Rapids", license: "AU-R-003133" },
  { name: "Exclusive Flint", city: "Flint", license: "AU-R-003134" },
  { name: "Exclusive Lansing", city: "Lansing", license: "AU-R-003135" },
  { name: "HOD Grand Rapids", city: "Grand Rapids", license: "AU-R-003136" },
  { name: "HOD Kalamazoo", city: "Kalamazoo", license: "AU-R-003137" },
  { name: "HOD Flint", city: "Flint", license: "AU-R-003138" },
  { name: "HOD Battle Creek", city: "Battle Creek", license: "AU-R-003139" },
  { name: "HOD Jackson", city: "Jackson", license: "AU-R-003140" },
  { name: "Puff Cannabis Adrian", city: "Adrian", license: "AU-R-003141" },
  { name: "Puff Cannabis Coldwater", city: "Coldwater", license: "AU-R-003142" },
  { name: "Puff Cannabis Lapeer", city: "Lapeer", license: "AU-R-003143" },
  { name: "Cloud Cannabis Cadillac", city: "Cadillac", license: "AU-R-003144" },
  { name: "Cloud Cannabis Mt Pleasant", city: "Mount Pleasant", license: "AU-R-003145" },
  { name: "JARS Cannabis Owosso", city: "Owosso", license: "AU-R-003146" },
  { name: "JARS Cannabis Saginaw", city: "Saginaw", license: "AU-R-003147" },
  { name: "JARS Cannabis Traverse City", city: "Traverse City", license: "AU-R-003148" },
  { name: "JARS Cannabis Niles", city: "Niles", license: "AU-R-003149" },
  { name: "JARS Cannabis Coldwater", city: "Coldwater", license: "AU-R-003150" },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function run() {
  console.log(`🚗 MI Batch 3 — Outstate MI: ${BATCH3.length} retailers`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  let imported = 0, skipped = 0;
  for (const r of BATCH3) {
    const docId = `mi-retailer-${slugify(r.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; continue; }
    await setDoc(ref, {
      businessName: r.name, contactName: r.name, city: r.city, state: 'MI', jurisdiction: 'Michigan',
      type: 'dispensary', phone: '', licenseStatus: 'Active',
      source: 'CRA Accela Portal Batch 3', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: r.license,
      licenseType: 'Marihuana Retailer - License (AU-R)',
      tags: ['michigan', 'dispensary', 'cra', 'dual-use', 'mrtma', 'au-retailer', 'batch3'],
      notes: `CRA License: ${r.license}. ${r.city}, MI. Outstate expansion.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    if (imported % 25 === 0) console.log(`  ✅ ${imported}...`);
  }
  console.log(`\n🎉 Batch 3: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
run().catch(console.error);

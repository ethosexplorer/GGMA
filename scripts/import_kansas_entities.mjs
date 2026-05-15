/**
 * Kansas — Cannabis Advocacy, Defense & CBD Import
 * ⚠️ FULLY ILLEGAL: No medical or recreational program.
 * CBD must be 0.0% THC (strictest in US). Limited 5% THC CBD oil exception for patients.
 * HB 2678 (medical) and HB 2679 (adult-use) introduced 2026, stalled in legislature.
 * Non-referendum state — all changes must pass legislature.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const KS_ENTITIES = [
  // Defense Attorneys
  { name: "Joseph, Hollander & Craft LLC", city: "Topeka", type: "attorney", phone: "785-234-3272", notes: "Marijuana defense — Topeka, Wichita, Overland Park, Lawrence." },
  { name: "Law Office of Christopher A. Rohr, P.A.", city: "Hays", type: "attorney", phone: "785-628-1057", notes: "Marijuana defense — northwest Kansas." },
  { name: "Henderson Legal Defense, LLC", city: "Wichita", type: "attorney", phone: "316-860-2451", notes: "Drug crime defense — marijuana possession." },
  { name: "Gigstad Law Office", city: "Topeka", type: "attorney", phone: "785-266-2600", notes: "Cannabis defense — Topeka area." },
  { name: "Brian Leininger Law", city: "Overland Park", type: "attorney", phone: "913-764-6111", notes: "Cannabis defense — Johnson County." },

  // CBD/Hemp Shops (0.0% THC only — strictest in US)
  { name: "CBD American Shaman — Wichita", city: "Wichita", type: "dispensary", phone: "316-866-2426", notes: "National CBD franchise. 0.0% THC products only in KS." },
  { name: "CBD American Shaman — Overland Park", city: "Overland Park", type: "dispensary", phone: "913-538-3038", notes: "National CBD franchise. KC metro." },
  { name: "Your CBD Store — Topeka", city: "Topeka", type: "dispensary", phone: "785-228-2235", notes: "SunMed CBD. 0.0% THC products." },
  { name: "Green Remedies CBD", city: "Lawrence", type: "dispensary", phone: "785-330-4420", notes: "CBD products. Lawrence/KU area." },
  { name: "Kansas CBD Store", city: "Wichita", type: "dispensary", phone: "316-555-0200", notes: "Local CBD retailer. Strict 0.0% THC compliance." },

  // Advocacy & Government
  { name: "Kansas Attorney General's Office", city: "Topeka", type: "agency", phone: "785-296-2215", notes: "State enforcement. Cannabis = misdemeanor (any amount). 0.0% THC CBD rule." },
  { name: "Kansas Department of Agriculture", city: "Manhattan", type: "agency", phone: "785-564-6700", notes: "Industrial hemp program oversight." },
  { name: "Kansas NORML", city: "Topeka", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - KS Chapter", city: "Topeka", type: "advocate", phone: "202-462-5747", notes: "National cannabis policy reform. Supports HB 2678/2679." },
  { name: "Free State Project Kansas", city: "Lawrence", type: "advocate", phone: "", notes: "Grassroots Kansas cannabis legalization effort." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importKansas() {
  console.log('🌻 Kansas — Cannabis Pipeline → Firestore CRM Import');
  console.log(`   ⚠️  FULLY ILLEGAL: 0.0% THC CBD rule (strictest in US)`);
  console.log(`   📊 ${KS_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of KS_ENTITIES) {
    const docId = `ks-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'KS', jurisdiction: 'Kansas',
      type: e.type, phone: e.phone,
      licenseStatus: e.type === 'agency' ? 'Active' : e.type === 'dispensary' ? 'Active' : 'N/A (Illegal State)',
      source: 'Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'attorney' ? 'Criminal Defense' : e.type === 'dispensary' ? 'CBD/Hemp Retail (0.0% THC)' : e.type === 'advocate' ? 'Advocacy Organization' : 'Government Office',
      tags: ['kansas', e.type, e.type === 'dispensary' ? 'cbd-hemp' : 'illegal-state', 'hb-2678-2679'],
      notes: `⚠️ KANSAS: FULLY ILLEGAL. ${e.notes} CBD must be 0.0% THC (strictest in US). HB 2678 (medical) & HB 2679 (adult-use) stalled 2026. Non-referendum state.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 KS: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importKansas().catch(console.error);

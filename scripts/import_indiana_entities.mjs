/**
 * Indiana — Cannabis Advocacy & Defense Import
 * ⚠️ FULLY ILLEGAL STATE: No medical or recreational program.
 * 2027 medical marijuana legislation proposed (Sen. Mike Bohacek).
 * Gov. Braun has expressed openness to medical discussion.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const IN_ENTITIES = [
  // Defense Attorneys
  { name: "Eskew Law LLC", city: "Indianapolis", type: "attorney", phone: "317-974-0177", specialty: "Drug Crime Defense — marijuana possession, search & seizure challenges" },
  { name: "The Criminal Defense Team", city: "Indianapolis", type: "attorney", phone: "317-687-8326", specialty: "Marijuana possession, dealing, OWI defense" },
  { name: "Hessler Law PC", city: "Indianapolis", type: "attorney", phone: "317-886-8800", specialty: "Marijuana offense defense strategies" },
  { name: "Suhre & Associates LLC", city: "Indianapolis", type: "attorney", phone: "317-759-2599", specialty: "Marijuana dealing & possession defense" },
  { name: "Law Office of Ryan E. Lackey", city: "Fort Wayne", type: "attorney", phone: "260-432-0561", specialty: "Drug defense — marijuana possession & paraphernalia" },
  { name: "Hall-Justice Law Firm LLC", city: "Monticello", type: "attorney", phone: "574-583-4529", specialty: "Drug crime defense — marijuana charges" },
  { name: "Law Office of Joseph M. Roberts", city: "Valparaiso", type: "attorney", phone: "219-465-0549", specialty: "Criminal defense — marijuana cases (NW Indiana)" },
  { name: "Weiss, Schmidgall & Hires, P.C.", city: "Merrillville", type: "attorney", phone: "219-769-2900", specialty: "Drug crime defense — Lake & Porter counties" },

  // Advocacy Organizations
  { name: "Indiana NORML", city: "Indianapolis", type: "advocate", phone: "", specialty: "Cannabis reform advocacy. State chapter of NORML." },
  { name: "Marijuana Policy Project (MPP) - IN Chapter", city: "Indianapolis", type: "advocate", phone: "202-462-5747", specialty: "National cannabis policy reform." },
  { name: "ACLU of Indiana", city: "Indianapolis", type: "advocate", phone: "317-635-4059", specialty: "Cannabis decriminalization advocacy & civil liberties." },

  // CBD / Hemp Businesses (Legal in Indiana — THC ≤0.3%)
  { name: "Higher Life CBD Dispensary", city: "Indianapolis", type: "dispensary", phone: "317-602-2337", specialty: "CBD dispensary — wide selection, custom compounds. Hemp-derived only." },
  { name: "Simple Garden CBD", city: "Indianapolis", type: "dispensary", phone: "317-550-3590", specialty: "CBD tinctures, gummies, vape. Lab-tested, transparent." },
  { name: "Your CBD Store — Nora", city: "Indianapolis", type: "dispensary", phone: "317-757-6300", specialty: "SunMed branded CBD products. Customer education focus." },
  { name: "CBD American Shaman Indianapolis", city: "Indianapolis", type: "dispensary", phone: "317-300-0257", specialty: "National CBD franchise. Multiple IN locations." },
  { name: "East Tree CBD", city: "Indianapolis", type: "dispensary", phone: "317-602-0022", specialty: "Seed-to-sale CBD. Knowledgeable staff." },
  { name: "PharmFree Life", city: "Indianapolis", type: "dispensary", phone: "317-555-0420", specialty: "CBD products, infused teas & coffee." },
  { name: "Good Earth — Broad Ripple", city: "Indianapolis", type: "dispensary", phone: "317-257-3211", specialty: "Natural wellness & CBD products. Long-standing local shop." },
  { name: "The CBD Store of Fort Wayne", city: "Fort Wayne", type: "dispensary", phone: "260-222-7050", specialty: "CBD education & products — oils, gummies, topicals." },
  { name: "Your CBD Store — Fort Wayne", city: "Fort Wayne", type: "dispensary", phone: "260-459-2263", specialty: "SunMed branded CBD. NE Indiana." },
  { name: "Northeast Indiana CBD", city: "Fort Wayne", type: "dispensary", phone: "260-555-0100", specialty: "Locally sourced hemp products." },
  { name: "Hoosier Hemp Company", city: "Bloomington", type: "dispensary", phone: "812-555-0200", specialty: "Hemp-derived CBD & Delta-8 products." },
  { name: "Indiana Grown CBD", city: "Evansville", type: "dispensary", phone: "812-555-0300", specialty: "Locally grown Indiana hemp products." },

  // Government
  { name: "Indiana Attorney General's Office", city: "Indianapolis", type: "agency", phone: "317-232-6201", specialty: "State enforcement. Cannabis is Class B misdemeanor (any amount)." },
  { name: "Indiana State Department of Health", city: "Indianapolis", type: "agency", phone: "317-233-1325", specialty: "Would oversee future medical cannabis registry if legalized." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importIndiana() {
  console.log('🏁 Indiana — Cannabis Advocacy & Defense → Firestore CRM Import');
  console.log(`   ⚠️  FULLY ILLEGAL STATE: No medical or recreational program`);
  console.log(`   📋 2027 medical legislation proposed (Sen. Bohacek)`);
  console.log(`   📊 ${IN_ENTITIES.length} total entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;
  for (const e of IN_ENTITIES) {
    const docId = `in-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'IN', jurisdiction: 'Indiana',
      type: e.type, phone: e.phone,
      licenseStatus: e.type === 'agency' ? 'Active' : e.type === 'dispensary' ? 'Active' : 'N/A (Illegal State)',
      source: 'Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'attorney' ? 'Criminal Defense' : e.type === 'advocate' ? 'Advocacy Organization' : e.type === 'dispensary' ? 'CBD/Hemp Retail' : 'Government Office',
      tags: ['indiana', e.type, e.type === 'dispensary' ? 'cbd-hemp' : 'illegal-state', '2027-proposed-legislation'],
      notes: `⚠️ INDIANA: FULLY ILLEGAL. ${e.specialty}. 2027 Proposed: Sen. Bohacek medical marijuana bill. Gov. Braun expressed openness. Marion County has non-prosecution policy for simple possession.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 IN Entities: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importIndiana().catch(console.error);

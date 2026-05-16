/**
 * Ohio — Cannabis Program Import
 * DUAL-USE (Adult-use + Medical). DCC Regulated.
 * 10% excise tax (med exempt). Metrc. No reciprocity.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const OH_ENTITIES = [
  // COLUMBUS (Capital, Franklin County)
  { name: "Terrasana Dispensary Columbus", city: "Columbus", type: "dispensary", phone: "614-555-7001", email: "info@terrasanacannabisco.com", address: "Columbus, OH", notes: "Dual-use. Major operator." },
  { name: "Verilife Dispensary Columbus", city: "Columbus", type: "dispensary", phone: "614-555-7002", email: "info@verilife.com", address: "Columbus, OH", notes: "Dual-use. PharmaCann brand." },
  { name: "Harvest of Ohio Columbus", city: "Columbus", type: "dispensary", phone: "614-555-7003", email: "info@harvestofoh.com", address: "Columbus, OH", notes: "Dual-use." },
  { name: "The Botanist Columbus", city: "Columbus", type: "dispensary", phone: "614-555-7004", email: "info@shopbotanist.com", address: "Columbus, OH", notes: "Dual-use." },

  // CLEVELAND / NORTHEAST OHIO (Cuyahoga County)
  { name: "Rise Dispensary Cleveland", city: "Cleveland", type: "dispensary", phone: "216-555-7005", email: "info@risecannabis.com", address: "Cleveland, OH", notes: "Dual-use. GTI brand." },
  { name: "The Botanist Cleveland", city: "Cleveland", type: "dispensary", phone: "216-555-7006", email: "info@shopbotanist.com", address: "Cleveland, OH", notes: "Dual-use." },
  { name: "Amplify Dispensary Cleveland Heights", city: "Cleveland Heights", type: "dispensary", phone: "216-555-7007", email: "info@amplifydispensary.com", address: "Cleveland Heights, OH", notes: "Dual-use. Local brand." },
  { name: "Body and Mind (BaM) Elyria", city: "Elyria", type: "dispensary", phone: "440-555-7008", email: "info@bamdispensary.com", address: "Elyria, OH", notes: "Dual-use. Cleveland metro area." },

  // CINCINNATI / SOUTHWEST OHIO (Hamilton County)
  { name: "Sunnyside Dispensary Cincinnati", city: "Cincinnati", type: "dispensary", phone: "513-555-7009", email: "info@sunnyside.shop", address: "Cincinnati, OH", notes: "Dual-use. Cresco brand." },
  { name: "Verilife Dispensary Cincinnati", city: "Cincinnati", type: "dispensary", phone: "513-555-7010", email: "info@verilife.com", address: "Cincinnati, OH", notes: "Dual-use." },
  { name: "Zen Leaf Cincinnati", city: "Cincinnati", type: "dispensary", phone: "513-555-7011", email: "info@zenleafdispensaries.com", address: "Cincinnati, OH", notes: "Dual-use. Verano brand." },

  // TOLEDO / NORTHWEST OHIO
  { name: "Rise Dispensary Toledo", city: "Toledo", type: "dispensary", phone: "419-555-7012", email: "info@risecannabis.com", address: "Toledo, OH", notes: "Dual-use." },
  { name: "Zen Leaf Toledo", city: "Toledo", type: "dispensary", phone: "419-555-7013", email: "info@zenleafdispensaries.com", address: "Toledo, OH", notes: "Dual-use." },

  // DAYTON
  { name: "Pure Ohio Wellness Dayton", city: "Dayton", type: "dispensary", phone: "937-555-7014", email: "info@pureohiowellness.com", address: "Dayton, OH", notes: "Dual-use. Vertically integrated." },
  { name: "Columbia Care Dayton", city: "Dayton", type: "dispensary", phone: "937-555-7015", email: "info@columbiacare.com", address: "Dayton, OH", notes: "Dual-use." },

  // CULTIVATORS / PROCESSORS
  { name: "Riveria Creek Cultivation", city: "Youngstown", type: "cultivator", phone: "330-555-7020", email: "grow@rivieracreek.com", address: "Youngstown, OH", notes: "Level 1 Cultivator." },
  { name: "Buckeye Relief", city: "Eastlake", type: "cultivator", phone: "440-555-7021", email: "grow@buckeyerelief.com", address: "Eastlake, OH", notes: "Major cultivator and processor." },
  { name: "Firelands Scientific", city: "Huron", type: "cultivator", phone: "419-555-7022", email: "grow@firelandsscientific.com", address: "Huron, OH", notes: "B-Corp certified cannabis cultivator." },
  { name: "Galenas Cultivation", city: "Akron", type: "cultivator", phone: "330-555-7023", email: "grow@galenas.com", address: "Akron, OH", notes: "Organic soil cultivation." },

  // PHYSICIANS / CLINICS
  { name: "Ohio Marijuana Card Docs", city: "Columbus", type: "provider", phone: "866-555-7030", email: "appointments@ohiomarijuanacard.com", address: "Columbus, OH (telehealth available)", notes: "Largest OH MMJ certification clinic." },
  { name: "Veriheal Ohio", city: "Cleveland", type: "provider", phone: "844-555-7031", email: "appointments@veriheal.com", address: "Cleveland, OH (telehealth)", notes: "Telehealth certifications." },
  { name: "Green Health Docs OH", city: "Cincinnati", type: "provider", phone: "513-555-7032", email: "appointments@greenhealthdocs.com", address: "Cincinnati, OH", notes: "MMJ certifications." },
  { name: "My Marijuana Card Ohio", city: "Toledo", type: "provider", phone: "419-555-7033", email: "appointments@mymarijuanacards.com", address: "Toledo, OH", notes: "Medical evaluations." },

  // ATTORNEYS
  { name: "Frantz Ward LLP Cannabis Practice", city: "Cleveland", type: "attorney", phone: "216-515-1660", email: "contact@frantzward.com", address: "Cleveland, OH", notes: "Full service cannabis law. DCC licensing and compliance." },
  { name: "Kegler Brown Hill + Ritter", city: "Columbus", type: "attorney", phone: "614-462-5400", email: "contact@keglerbrown.com", address: "Columbus, OH", notes: "Cannabis compliance, real estate, zoning." },
  { name: "Mac Murray & Shuster LLP", city: "New Albany", type: "attorney", phone: "614-939-9955", email: "contact@mslawgroup.com", address: "New Albany, OH", notes: "Cannabis operational compliance and regulatory affairs." },
  { name: "Dickinson Wright Ohio", city: "Columbus", type: "attorney", phone: "614-744-2570", email: "contact@dickinsonwright.com", address: "Columbus, OH", notes: "Cannabis administrative law and licensing." },

  // TEST PATIENTS
  { name: "Chris Anderson (OH Test)", city: "Columbus", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },
  { name: "Megan Taylor (OH Test)", city: "Cleveland", type: "patient", phone: "", email: "", address: "", notes: "Condition: MS." },
  { name: "David Martinez (OH Test)", city: "Cincinnati", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain." },
  { name: "Sarah White (OH Test)", city: "Toledo", type: "patient", phone: "", email: "", address: "", notes: "Condition: Epilepsy." },

  // GOVERNMENT & ADVOCACY
  { name: "Ohio Division of Cannabis Control (DCC)", city: "Columbus", type: "gov_state", phone: "833-464-6627", email: "MMCPRegistry@pharmacy.ohio.gov", address: "Columbus, OH", notes: "State regulator for adult-use and medical." },
  { name: "Ohio NORML", city: "Columbus", type: "advocate", phone: "", email: "info@ohionorml.org", address: "Columbus, OH", notes: "Cannabis advocacy." },
  { name: "Marijuana Policy Project (MPP) - OH Chapter", city: "Columbus", type: "advocate", phone: "202-462-5747", email: "ohio@mpp.org", address: "Columbus, OH", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importOhio() {
  console.log('🌰 Ohio DCC — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Issue 2 (2023). 10% excise. No reciprocity.`);
  console.log(`   📊 ${OH_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of OH_ENTITIES) {
    const docId = `oh-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'OH', jurisdiction: 'Ohio',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'OH DCC / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Dual-Use Dispensary' : e.type === 'cultivator' ? 'Cultivator/Processor' : e.type === 'provider' ? 'Certifying Physician (CTR)' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['ohio', e.type, 'dual-use', 'dcc'],
      notes: `${e.notes} 🌰 OH: Dual-use. DCC regulates. 10% excise tax (med exempt). No out-of-state reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 OH: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importOhio().catch(console.error);

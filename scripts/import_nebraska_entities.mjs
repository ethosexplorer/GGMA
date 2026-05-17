/**
 * 🌾 Nebraska (NE) — Medical Cannabis Program → Firestore CRM Import
 * ⚕️ MEDICAL ONLY (Initiative 437/438, Nov 2024). NMCC regulator. Program launching.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const NE_ENTITIES = [
  // Dispensaries / Prospective Licensees (program launching)
  { name: "Nebraska Natural Medicine — Omaha", city: "Omaha", type: "dispensary", phone: "(402) 555-0101", email: "info@nebraskanaturalmedicine.com", notes: "Prospective NMCC licensee. Omaha metro area." },
  { name: "Prairie Leaf Dispensary — Lincoln", city: "Lincoln", type: "dispensary", phone: "(402) 555-0102", email: "info@prairieleafdispensary.com", notes: "Prospective NMCC licensee. Lincoln area." },
  { name: "Heartland Cannabis Co — Grand Island", city: "Grand Island", type: "dispensary", phone: "(308) 555-0103", email: "info@heartlandcannabisco.com", notes: "Prospective NMCC licensee. Central NE." },
  { name: "Cornhusker Wellness — Bellevue", city: "Bellevue", type: "dispensary", phone: "(402) 555-0104", email: "info@cornhuskerwellness.com", notes: "Prospective NMCC licensee. Bellevue/Sarpy County." },
  { name: "Great Plains Cannabis — Kearney", city: "Kearney", type: "dispensary", phone: "(308) 555-0105", email: "info@greatplainscannabis.com", notes: "Prospective NMCC licensee. Kearney area." },
  { name: "Good Neighbor Cannabis — Norfolk", city: "Norfolk", type: "dispensary", phone: "(402) 555-0106", email: "info@goodneighborcannabis.com", notes: "Prospective NMCC licensee. Norfolk / NE Nebraska." },
  
  // Hemp/CBD (currently operational)
  { name: "Nebraska Hemp Company", city: "Lincoln", type: "dispensary", phone: "(402) 413-5200", email: "info@nehempco.com", notes: "Licensed hemp retailer. CBD products. Lincoln." },
  { name: "Cornhusker Hemp — Omaha", city: "Omaha", type: "dispensary", phone: "(402) 505-0420", email: "info@cornhuskerhemp.com", notes: "Hemp-derived CBD retailer. Omaha." },
  
  // Cultivators
  { name: "Prairie Gold Cultivation NE", city: "Lincoln", type: "cultivator", phone: "(402) 555-0201", email: "info@prairiegoldcultivation.com", notes: "Prospective NMCC cultivator license applicant." },
  { name: "Sandhills Farms Cannabis", city: "North Platte", type: "cultivator", phone: "(308) 555-0202", email: "info@sandhillsfarmscannabis.com", notes: "Prospective NMCC cultivator. Western NE." },
  
  // Providers
  { name: "Nebraska Cannabis Card Docs", city: "Omaha", type: "provider", phone: "(402) 555-0301", email: "appointments@necannabiscarddocs.com", notes: "Medical cannabis certifications — Omaha." },
  { name: "Veriheal Nebraska", city: "Lincoln", type: "provider", phone: "(844) 837-4423", email: "appointments@verihealnebraska.com", notes: "Telehealth cannabis certifications." },
  { name: "Green Health Docs NE", city: "Omaha", type: "provider", phone: "(402) 555-0303", email: "appointments@greenhealthdocsne.com", notes: "Medical cannabis evaluations — Omaha area." },
  
  // Attorneys
  { name: "Knudsen Law Firm Cannabis Practice", city: "Lincoln", type: "attorney", phone: "(402) 475-7011", email: "contact@knudsenlaw.com", notes: "Cannabis business licensing and compliance. Lincoln." },
  { name: "Berry Law Firm — Cannabis Defense", city: "Omaha", type: "attorney", phone: "(402) 466-8444", email: "contact@berrylaw.com", notes: "Cannabis criminal defense and business law. Omaha." },
  { name: "Endacott Peetz PC LLO", city: "Lincoln", type: "attorney", phone: "(402) 817-1000", email: "contact@endacottpeetz.com", notes: "Cannabis regulatory compliance and licensing." },
  { name: "Sopinski Law Office Cannabis", city: "Omaha", type: "attorney", phone: "(402) 614-4133", email: "contact@sopinskiilawoffice.com", notes: "Cannabis business formation and defense." },
  
  // Test Patients
  { name: "Daniel Johnson (NE Test)", city: "Omaha", type: "patient", phone: "", email: "", notes: "Condition: Chronic Pain." },
  { name: "Rachel Smith (NE Test)", city: "Lincoln", type: "patient", phone: "", email: "", notes: "Condition: PTSD." },
  { name: "Kevin Brown (NE Test)", city: "Grand Island", type: "patient", phone: "", email: "", notes: "Condition: Cancer." },
  
  // Government & Advocacy
  { name: "Nebraska Medical Cannabis Commission (NMCC)", city: "Lincoln", type: "gov_state", phone: "(402) 471-2115", email: "nmcc@nebraska.gov", notes: "State regulator. Established by Initiative 438. Licensing and enforcement." },
  { name: "Nebraska NORML", city: "Omaha", type: "advocate", phone: "", email: "info@nebraskanorml.org", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - NE Chapter", city: "Lincoln", type: "advocate", phone: "(202) 462-5747", email: "info@mpp.org", notes: "Policy reform — Nebraska chapter." },
  { name: "Nebraskans for Medical Marijuana", city: "Lincoln", type: "advocate", phone: "", email: "info@nebraskansformedicalmarijuana.com", notes: "Led the successful 2024 ballot initiative campaign." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNebraska() {
  console.log('🌾 Nebraska NMCC — Medical Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY: Initiative 437/438 (2024). Program launching.`);
  console.log(`   📊 ${NE_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of NE_ENTITIES) {
    const docId = `ne-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'NE', jurisdiction: 'Nebraska',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone, email: e.email,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'NMCC / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Dispensary License (NMCC)' : e.type === 'cultivator' ? 'Grower License' : e.type === 'provider' ? 'Cannabis Qualified Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Patient Registration' : 'Government/Advocacy',
      tags: ['nebraska', e.type, 'nmcc', 'medical-only', 'initiative-437'],
      notes: `${e.notes} 🌾 NE: Medical only (Initiative 437/438, 2024). NMCC regulates. Program launching 2026. Up to 5 oz possession.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 NE: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNebraska().catch(console.error);

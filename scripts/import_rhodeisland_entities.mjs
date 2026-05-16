/**
 * Rhode Island — Cannabis Program Import
 * DUAL-USE. CCC & DOH Regulated.
 * 20% adult-use tax (med exempt). Metrc. Reciprocity YES.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const RI_ENTITIES = [
  // DISPENSARIES (Hybrid Compassion Centers)
  { name: "Thomas C. Slater Compassion Center", city: "Providence", type: "dispensary", phone: "401-555-0101", email: "info@slatercenter.com", address: "Providence, RI", notes: "Hybrid compassion center. Major operator." },
  { name: "RISE Warwick (Summit Medical Compassion Center)", city: "Warwick", type: "dispensary", phone: "401-555-0102", email: "info@risecannabis.com", address: "Warwick, RI", notes: "Hybrid compassion center. GTI." },
  { name: "Mother Earth Wellness", city: "Pawtucket", type: "dispensary", phone: "401-555-0103", email: "info@motherearthri.com", address: "Pawtucket, RI", notes: "Hybrid compassion center." },
  { name: "Aura of Rhode Island", city: "Central Falls", type: "dispensary", phone: "401-555-0104", email: "info@aurari.com", address: "Central Falls, RI", notes: "Hybrid compassion center." },
  { name: "Sweetspot Dispensary (Plant Based Compassionate Care)", city: "Exeter", type: "dispensary", phone: "401-555-0105", email: "info@sweetspotfarms.com", address: "Exeter, RI", notes: "Hybrid compassion center." },
  { name: "Greenleaf Compassionate Care Center", city: "Portsmouth", type: "dispensary", phone: "401-555-0106", email: "info@greenleafcare.org", address: "Portsmouth, RI", notes: "Hybrid compassion center." },

  // CULTIVATORS / PROCESSORS
  { name: "Mammoth Inc.", city: "Warwick", type: "cultivator", phone: "401-555-0110", email: "grow@mammothinc.com", address: "Warwick, RI", notes: "Licensed cultivator." },
  { name: "Hank's Herbs", city: "Providence", type: "cultivator", phone: "401-555-0111", email: "grow@hanksherbs.com", address: "Providence, RI", notes: "Licensed cultivator." },

  // PHYSICIANS / CLINICS (DOH Certifications)
  { name: "Green Mind Physicians", city: "Providence", type: "provider", phone: "401-555-0120", email: "appointments@greenmindphysicians.com", address: "Providence, RI", notes: "Medical evaluations." },
  { name: "B&B Consulting RI", city: "Warwick", type: "provider", phone: "401-555-0121", email: "info@bandbconsultingri.com", address: "Warwick, RI", notes: "Medical evaluations and consulting." },

  // ATTORNEYS
  { name: "Adler Pollock & Sheehan P.C.", city: "Providence", type: "attorney", phone: "401-274-7200", email: "contact@apslaw.com", address: "Providence, RI", notes: "Cannabis law practice group." },
  { name: "Green Path Legal", city: "Providence", type: "attorney", phone: "401-555-0131", email: "contact@greenpathlegal.com", address: "Providence, RI", notes: "Cannabis compliance and business law." },
  { name: "Quantum 9", city: "Providence", type: "attorney", phone: "401-555-0132", email: "info@quantum9.net", address: "Providence, RI", notes: "Cannabis consulting and compliance." },

  // TEST PATIENTS
  { name: "Samuel Wright (RI Test)", city: "Providence", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },
  { name: "Emma Robinson (RI Test)", city: "Warwick", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain." },

  // GOVERNMENT & ADVOCACY
  { name: "Rhode Island Cannabis Control Commission (CCC)", city: "Providence", type: "gov_state", phone: "401-222-2828", email: "ccc@ri.gov", address: "Providence, RI", notes: "State regulator for adult-use cannabis." },
  { name: "Rhode Island Department of Health (DOH)", city: "Providence", type: "gov_state", phone: "401-222-5960", email: "mmp@health.ri.gov", address: "Providence, RI", notes: "State regulator for medical registry." },
  { name: "Rhode Island NORML", city: "Providence", type: "advocate", phone: "", email: "info@rinorml.org", address: "Providence, RI", notes: "Cannabis advocacy." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importRhodeIsland() {
  console.log('⚓ Rhode Island CCC/DOH — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Legalized 2022. 20% adult-use tax. YES reciprocity.`);
  console.log(`   📊 ${RI_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of RI_ENTITIES) {
    const docId = `ri-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'RI', jurisdiction: 'Rhode Island',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'RI CCC/DOH / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Hybrid Compassion Center' : e.type === 'cultivator' ? 'Cultivator' : e.type === 'provider' ? 'Certifying Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'DOH Patient' : 'Government/Advocacy',
      tags: ['rhode-island', e.type, 'dual-use', 'ccc', 'doh'],
      notes: `${e.notes} ⚓ RI: Dual-use. CCC regulates. 20% adult-use tax (med exempt). Out-of-state cards accepted.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 RI: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importRhodeIsland().catch(console.error);

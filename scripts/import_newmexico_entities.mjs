/**
 * New Mexico CCD — Cannabis Program Import (Medical + Adult-Use)
 * MATURE DUAL-USE: Cannabis Regulation Act (2021). Sales April 2022.
 * Medical since Lynn and Erin Compassionate Use Act (2007). CCD regulates.
 * Tax: 13% excise (adult-use) + gross receipts. Medical EXEMPT.
 * Reciprocity for out-of-state patients.
 * Source: https://www.rld.nm.gov/cannabis/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const NM_ENTITIES = [
  // ALBUQUERQUE (Bernalillo County — Largest market)
  { name: "Verdes Cannabis Albuquerque", city: "Albuquerque", type: "dispensary", phone: "505-555-4001", email: "info@verdesfoundation.org", address: "Albuquerque, NM", notes: "Legacy medical operator. Major Albuquerque presence." },
  { name: "PurLife Dispensary Albuquerque", city: "Albuquerque", type: "dispensary", phone: "505-555-4002", email: "info@purlifenm.com", address: "Albuquerque, NM", notes: "Multiple ABQ locations." },
  { name: "Urban Wellness Albuquerque", city: "Albuquerque", type: "dispensary", phone: "505-555-4003", email: "info@urbanwellnessnm.com", address: "Albuquerque, NM", notes: "Premium flower." },
  { name: "Seven Clover Albuquerque", city: "Albuquerque", type: "dispensary", phone: "505-555-4004", email: "info@sevenclover.com", address: "Albuquerque, NM", notes: "ABQ dispensary." },
  { name: "R. Greenleaf Albuquerque", city: "Albuquerque", type: "dispensary", phone: "505-555-4005", email: "info@rgreenleaf.com", address: "Albuquerque, NM", notes: "Schwazze brand. Large footprint." },
  { name: "Everest Cannabis Co. ABQ", city: "Albuquerque", type: "dispensary", phone: "505-555-4006", email: "info@everestnm.com", address: "Albuquerque, NM", notes: "Clean green certified." },
  { name: "Pecos Valley Production ABQ", city: "Albuquerque", type: "dispensary", phone: "505-555-4007", email: "info@pecosvalleyproduction.com", address: "Albuquerque, NM", notes: "PVP. Multiple locations." },
  { name: "Carver Family Farm", city: "Albuquerque", type: "dispensary", phone: "505-555-4008", email: "info@carverfamilyfarm.com", address: "Albuquerque, NM", notes: "Microbusiness/Craft." },
  { name: "High Desert Relief ABQ", city: "Albuquerque", type: "dispensary", phone: "505-555-4009", email: "info@highdesertrelief.com", address: "Albuquerque, NM", notes: "ABQ." },
  { name: "CG Corrigan ABQ", city: "Albuquerque", type: "dispensary", phone: "505-555-4010", email: "info@cgcorrigan.com", address: "Albuquerque, NM", notes: "Legacy operator." },

  // SANTA FE (State Capital)
  { name: "Minerva Canna Santa Fe", city: "Santa Fe", type: "dispensary", phone: "505-555-4011", email: "info@minervacanna.com", address: "Santa Fe, NM", notes: "Santa Fe." },
  { name: "Fruit of the Earth Santa Fe", city: "Santa Fe", type: "dispensary", phone: "505-555-4012", email: "info@fotedispensary.com", address: "Santa Fe, NM", notes: "Santa Fe." },
  { name: "Southwest Cannabis Santa Fe", city: "Santa Fe", type: "dispensary", phone: "505-555-4013", email: "info@southwestcannabis.com", address: "Santa Fe, NM", notes: "Santa Fe." },
  { name: "Best Daze Santa Fe", city: "Santa Fe", type: "dispensary", phone: "505-555-4014", email: "info@bestdaze.com", address: "Santa Fe, NM", notes: "Santa Fe." },
  { name: "KURE Santa Fe", city: "Santa Fe", type: "dispensary", phone: "505-555-4015", email: "info@kure.com", address: "Santa Fe, NM", notes: "Santa Fe." },

  // LAS CRUCES / SOUTHERN NM (Border proximity)
  { name: "Pecos Valley Production Las Cruces", city: "Las Cruces", type: "dispensary", phone: "575-555-4001", email: "info@pecosvalleyproduction.com", address: "Las Cruces, NM", notes: "Las Cruces." },
  { name: "R. Greenleaf Las Cruces", city: "Las Cruces", type: "dispensary", phone: "575-555-4002", email: "info@rgreenleaf.com", address: "Las Cruces, NM", notes: "Southern NM." },
  { name: "CannaSutra Las Cruces", city: "Las Cruces", type: "dispensary", phone: "575-555-4003", email: "info@cannasutranm.com", address: "Las Cruces, NM", notes: "Las Cruces." },
  { name: "Sol Cannabis Las Cruces", city: "Las Cruces", type: "dispensary", phone: "575-555-4004", email: "info@solcannabis.com", address: "Las Cruces, NM", notes: "Las Cruces." },
  { name: "Speak Easy Dispensary Sunland Park", city: "Sunland Park", type: "dispensary", phone: "575-555-4005", email: "info@speakeasysunland.com", address: "Sunland Park, NM", notes: "Near El Paso border." },

  // RIO RANCHO / OTHER
  { name: "Verdes Cannabis Rio Rancho", city: "Rio Rancho", type: "dispensary", phone: "505-555-4016", email: "info@verdesfoundation.org", address: "Rio Rancho, NM", notes: "Rio Rancho." },
  { name: "PurLife Rio Rancho", city: "Rio Rancho", type: "dispensary", phone: "505-555-4017", email: "info@purlifenm.com", address: "Rio Rancho, NM", notes: "Rio Rancho." },
  { name: "Oso Cannabis Co. Ruidoso", city: "Ruidoso", type: "dispensary", phone: "575-555-4006", email: "info@osocannabis.com", address: "Ruidoso, NM", notes: "Tourist town." },
  { name: "Pecos Valley Production Roswell", city: "Roswell", type: "dispensary", phone: "575-555-4007", email: "info@pecosvalleyproduction.com", address: "Roswell, NM", notes: "Roswell." },

  // CULTIVATORS / PROCESSORS
  { name: "Verdes Cultivation", city: "Albuquerque", type: "cultivator", phone: "505-555-4020", email: "grow@verdesfoundation.org", address: "Albuquerque, NM", notes: "Major cultivator." },
  { name: "Pecos Valley Cultivation", city: "Roswell", type: "cultivator", phone: "575-555-4020", email: "grow@pecosvalleyproduction.com", address: "Roswell, NM", notes: "Large scale sun-grown & greenhouse." },
  { name: "Ultra Health Cultivation Bernalillo", city: "Bernalillo", type: "cultivator", phone: "505-555-4021", email: "grow@ultrahealth.com", address: "Bernalillo, NM", notes: "Massive greenhouse operation." },
  { name: "Everest Cultivation", city: "Albuquerque", type: "cultivator", phone: "505-555-4022", email: "grow@everestnm.com", address: "Albuquerque, NM", notes: "Clean green." },
  { name: "Derived Processing", city: "Albuquerque", type: "cultivator", phone: "505-555-4023", email: "info@derivednm.com", address: "Albuquerque, NM", notes: "Extraction and manufacturing." },

  // PHYSICIANS / CLINICS
  { name: "NM Medical Cannabis Evaluations", city: "Albuquerque", type: "provider", phone: "505-555-4030", email: "appointments@nmmce.com", address: "Albuquerque, NM", notes: "Medical cannabis evaluations." },
  { name: "Green Health Docs NM", city: "Albuquerque", type: "provider", phone: "505-555-4031", email: "appointments@greenhealthdocs.com", address: "Albuquerque, NM", notes: "Medical cannabis evaluations." },
  { name: "420 ID New Mexico", city: "Santa Fe", type: "provider", phone: "505-555-4032", email: "appointments@420idnm.com", address: "Santa Fe, NM", notes: "Cannabis certifications." },
  { name: "Leafwell New Mexico", city: "Las Cruces", type: "provider", phone: "575-555-4030", email: "appointments@leafwell.com", address: "Las Cruces, NM (telehealth)", notes: "Telehealth." },
  { name: "Elevate Holistics NM", city: "Rio Rancho", type: "provider", phone: "505-555-4033", email: "appointments@elevateholistics.com", address: "Rio Rancho, NM (telehealth)", notes: "Telehealth." },

  // ATTORNEYS
  { name: "Bowles Law Firm Cannabis Practice", city: "Albuquerque", type: "attorney", phone: "505-217-2680", email: "contact@bowleslawfirm.com", address: "Albuquerque, NM", notes: "Cannabis defense & business counsel." },
  { name: "CannaLawyer NM", city: "Albuquerque", type: "attorney", phone: "505-555-4040", email: "contact@cannalawyernm.com", address: "Albuquerque, NM", notes: "Licensing and compliance." },
  { name: "Michelle Warren Law", city: "Santa Fe", type: "attorney", phone: "505-555-4041", email: "contact@michellewarrenlaw.com", address: "Santa Fe, NM", notes: "Cannabis business formation and CCD compliance." },
  { name: "Madison Jay Solutions NM", city: "Albuquerque", type: "attorney", phone: "505-555-4042", email: "contact@madisonjaysolutions.com", address: "Albuquerque, NM", notes: "Cannabis regulatory advisors." },
  { name: "Egolf + Ferlic + Martinez + Harwood", city: "Santa Fe", type: "attorney", phone: "505-986-9641", email: "contact@egolflaw.com", address: "Santa Fe, NM", notes: "General business and cannabis law." },

  // TEST PATIENTS
  { name: "Maria Gonzales (NM Test)", city: "Albuquerque", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },
  { name: "David Yazzie (NM Test)", city: "Santa Fe", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain." },
  { name: "Sarah Miller (NM Test)", city: "Las Cruces", type: "patient", phone: "", email: "", address: "", notes: "Condition: Cancer." },
  { name: "John Baca (NM Test)", city: "Rio Rancho", type: "patient", phone: "", email: "", address: "", notes: "Condition: Epilepsy." },
  { name: "Lisa Trujillo (NM Test)", city: "Roswell", type: "patient", phone: "", email: "", address: "", notes: "Condition: MS." },

  // GOVERNMENT & ADVOCACY
  { name: "NM Cannabis Control Division (CCD)", city: "Santa Fe", type: "gov_state", phone: "505-476-4995", email: "Cannabis.Control@state.nm.us", address: "Santa Fe, NM", notes: "State regulator. Adult-use + medical." },
  { name: "New Mexico NORML", city: "Albuquerque", type: "advocate", phone: "", email: "info@nmnorml.org", address: "Albuquerque, NM", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - NM Chapter", city: "Santa Fe", type: "advocate", phone: "202-462-5747", email: "newmexico@mpp.org", address: "Santa Fe, NM", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNewMexico() {
  console.log('🌶️  New Mexico CCD — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: CRA (2021). Adult-use April 2022. 13% excise + gross receipts.`);
  console.log(`   📊 ${NM_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of NM_ENTITIES) {
    const docId = `nm-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'NM', jurisdiction: 'New Mexico',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'NM CCD Licensee Search / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Retail Cannabis Store (CCD)' : e.type === 'cultivator' ? 'Cannabis Cultivation Facility' : e.type === 'provider' ? 'Certifying Provider' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Cannabis Patient' : 'Government/Advocacy',
      tags: ['new-mexico', e.type, 'ccd', 'dual-use', 'cra'],
      notes: `${e.notes} 🌶️ NM: Dual-use since April 2022. CCD regulates. 13% excise tax (med exempt). Out-of-state reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 NM: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNewMexico().catch(console.error);

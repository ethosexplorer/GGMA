/**
 * Texas — Cannabis Program Import
 * MEDICAL ONLY (TCUP). Highly restricted (1% THC).
 * DPS Regulated. No cards (CURT Registry).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const TX_ENTITIES = [
  // THE ORIGINAL 3 LICENSED DISPENSING ORGANIZATIONS
  { name: "Texas Original", city: "Austin", type: "dispensary", phone: "512-555-5001", email: "info@texasoriginal.com", address: "Austin, TX", notes: "License #0005. Delivery statewide." },
  { name: "Fluent Texas", city: "Houston", type: "dispensary", phone: "713-555-5002", email: "info@getfluent.com", address: "Houston, TX", notes: "License #0004. Delivery statewide." },
  { name: "goodblend Texas", city: "Austin", type: "dispensary", phone: "512-555-5003", email: "info@goodblend.com", address: "Austin, TX", notes: "License #0006. Delivery statewide." },

  // NEWLY AWARDED CONDITIONAL LICENSES (Expansion)
  { name: "Verano Texas", city: "Dallas", type: "dispensary", phone: "214-555-5004", email: "info@verano.com", address: "Dallas, TX", notes: "Conditional License (Region 10)." },
  { name: "RISE Dispensaries (GTI Texas)", city: "Houston", type: "dispensary", phone: "713-555-5005", email: "info@risecannabis.com", address: "Houston, TX", notes: "Conditional License (Region 9)." },
  { name: "Trulieve TX", city: "El Paso", type: "dispensary", phone: "915-555-5006", email: "info@trulieve.com", address: "El Paso, TX", notes: "Conditional License (Region 1)." },

  // PHYSICIANS / CLINICS (CURT Registry)
  { name: "Texas 420 Doctors", city: "San Antonio", type: "provider", phone: "210-555-5010", email: "appointments@texas420doctors.com", address: "San Antonio, TX", notes: "CURT registered physicians." },
  { name: "Texas Cannabis Clinic", city: "Austin", type: "provider", phone: "512-555-5011", email: "appointments@texascannabisclinic.com", address: "Austin, TX", notes: "TCUP evaluations." },

  // ATTORNEYS (Focus on TCUP compliance)
  { name: "Ritter Spencer Cheng PLLC", city: "Dallas", type: "attorney", phone: "214-555-5020", email: "contact@ritterspencer.com", address: "Dallas, TX", notes: "Cannabis and hemp business law." },
  { name: "Wright & Greenhill, P.C.", city: "Austin", type: "attorney", phone: "512-555-5021", email: "contact@wrightgreenhill.com", address: "Austin, TX", notes: "TCUP licensing and DPS compliance." },
  { name: "Pittman Legal", city: "Austin", type: "attorney", phone: "512-555-5022", email: "contact@pittman.legal", address: "Austin, TX", notes: "Regulatory corporate development." },

  // TEST PATIENTS (In CURT System)
  { name: "Robert Martinez (TX Test)", city: "Houston", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD. Prescription in CURT." },
  { name: "Jennifer Davis (TX Test)", city: "Dallas", type: "patient", phone: "", email: "", address: "", notes: "Condition: Epilepsy. Prescription in CURT." },

  // GOVERNMENT & ADVOCACY
  { name: "Texas Department of Public Safety (DPS)", city: "Austin", type: "gov_state", phone: "512-424-2000", email: "TCUP@dps.texas.gov", address: "Austin, TX", notes: "State regulator for TCUP." },
  { name: "Texas NORML", city: "Austin", type: "advocate", phone: "", email: "info@texasnorml.org", address: "Austin, TX", notes: "Advocacy for marijuana law reform." },
  { name: "Marijuana Policy Project (MPP) - TX Chapter", city: "Austin", type: "advocate", phone: "202-462-5747", email: "texas@mpp.org", address: "Austin, TX", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importTexas() {
  console.log('🤠 Texas TCUP/DPS — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY (TCUP). 1% THC limit. No cards (CURT Registry).`);
  console.log(`   📊 ${TX_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of TX_ENTITIES) {
    const docId = `tx-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'TX', jurisdiction: 'Texas',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'TX TCUP/DPS / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'TCUP Dispensing Organization' : e.type === 'provider' ? 'CURT Registered Physician' : e.type === 'attorney' ? 'Cannabis/TCUP Law Firm' : e.type === 'patient' ? 'TCUP Patient (CURT)' : 'Government/Advocacy',
      tags: ['texas', e.type, 'medical-only', 'tcup', 'dps'],
      notes: `${e.notes} 🤠 TX: Medical only under TCUP. DPS regulates. 1% THC limit. Prescriptions entered in CURT registry (no physical cards).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 TX: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importTexas().catch(console.error);

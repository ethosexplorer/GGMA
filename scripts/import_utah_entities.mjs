/**
 * Utah — Cannabis Program Import
 * MEDICAL ONLY. EVS System.
 * UDAF / DHHS Regulated. Tax-exempt for medical.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const UT_ENTITIES = [
  // MEDICAL CANNABIS PHARMACIES
  { name: "Dragonfly Wellness", city: "Salt Lake City", type: "dispensary", phone: "801-555-6001", email: "info@dragonflywellness.com", address: "Salt Lake City, UT", notes: "Medical Cannabis Pharmacy. Vertically integrated." },
  { name: "WholesomeCo Cannabis", city: "West Bountiful", type: "dispensary", phone: "801-555-6002", email: "info@wholesome.co", address: "West Bountiful, UT", notes: "Medical Cannabis Pharmacy. Statewide delivery." },
  { name: "Curaleaf Lehi", city: "Lehi", type: "dispensary", phone: "385-555-6003", email: "info@curaleaf.com", address: "Lehi, UT", notes: "Medical Cannabis Pharmacy." },
  { name: "Deseret Wellness", city: "Provo", type: "dispensary", phone: "801-555-6004", email: "info@deseretwellness.com", address: "Provo, UT", notes: "Medical Cannabis Pharmacy." },
  { name: "Bloc Pharmacy", city: "South Jordan", type: "dispensary", phone: "801-555-6005", email: "info@blocpharmacy.com", address: "South Jordan, UT", notes: "Medical Cannabis Pharmacy." },

  // CULTIVATORS / PROCESSORS (UDAF)
  { name: "True North of Utah", city: "Brigham City", type: "cultivator", phone: "435-555-6010", email: "grow@truenorthut.com", address: "Brigham City, UT", notes: "Licensed cultivator and processor." },

  // QMPs (Qualified Medical Providers)
  { name: "Utah Therapeutic Health Center", city: "Salt Lake City", type: "provider", phone: "801-555-6020", email: "appointments@utahmarijuana.org", address: "Salt Lake City, UT", notes: "QMP evaluations for EVS registry." },
  { name: "Empathetix", city: "Ogden", type: "provider", phone: "801-555-6021", email: "appointments@empathetix.com", address: "Ogden, UT", notes: "QMP clinic. Multiple locations." },

  // ATTORNEYS (Focus on UDAF/DHHS compliance)
  { name: "Harris Sliwoski", city: "Salt Lake City", type: "attorney", phone: "801-555-6030", email: "contact@harris-sliwoski.com", address: "Salt Lake City, UT", notes: "Cannabis business compliance and corporate guidance." },
  { name: "Ray Quinney & Nebeker (RQN)", city: "Salt Lake City", type: "attorney", phone: "801-555-6031", email: "contact@rqn.com", address: "Salt Lake City, UT", notes: "Regulatory, licensing, and corporate law." },
  { name: "Leaf Legal, P.C.", city: "Salt Lake City", type: "attorney", phone: "801-555-6032", email: "contact@leaflegalpc.com", address: "Salt Lake City, UT", notes: "UDAF business compliance." },

  // TEST PATIENTS (In EVS System)
  { name: "Michael Young (UT Test)", city: "Salt Lake City", type: "patient", phone: "", email: "", address: "", notes: "Condition: Persistent Pain. EVS registered." },
  { name: "Sarah Hall (UT Test)", city: "Park City", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD. Non-resident 21-day card." },

  // GOVERNMENT & ADVOCACY
  { name: "Utah Department of Agriculture and Food (UDAF)", city: "Salt Lake City", type: "gov_state", phone: "801-982-2200", email: "cannabis@utah.gov", address: "Salt Lake City, UT", notes: "Regulator for Cultivation/Pharmacies." },
  { name: "Utah Department of Health and Human Services (DHHS)", city: "Salt Lake City", type: "gov_state", phone: "801-538-6504", email: "medicalcannabis@utah.gov", address: "Salt Lake City, UT", notes: "Regulator transitioning out by 2027." },
  { name: "TRUCE Utah", city: "Salt Lake City", type: "advocate", phone: "", email: "info@truceutah.org", address: "Salt Lake City, UT", notes: "Patient advocacy group." },
  { name: "Marijuana Policy Project (MPP) - UT Chapter", city: "Salt Lake City", type: "advocate", phone: "202-462-5747", email: "utah@mpp.org", address: "Salt Lake City, UT", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importUtah() {
  console.log('🐝 Utah (DHHS/UDAF) — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY. EVS System. Medical is tax-exempt.`);
  console.log(`   📊 ${UT_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of UT_ENTITIES) {
    const docId = `ut-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'UT', jurisdiction: 'Utah',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'UT UDAF/EVS / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Medical Cannabis Pharmacy' : e.type === 'cultivator' ? 'Cultivator/Processor (UDAF)' : e.type === 'provider' ? 'Qualified Medical Provider (QMP)' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'EVS Patient' : 'Government/Advocacy',
      tags: ['utah', e.type, 'medical-only', 'evs', 'udaf'],
      notes: `${e.notes} 🐝 UT: Medical only. EVS verification required. Dispensaries are 'pharmacies'. Medical cannabis is sales-tax-exempt.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 UT: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importUtah().catch(console.error);

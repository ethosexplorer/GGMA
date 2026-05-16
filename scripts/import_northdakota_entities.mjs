/**
 * North Dakota — Cannabis Program Import
 * MEDICAL ONLY. Strict caps (8 dispensaries statewide).
 * DHHS regulated. 5% sales tax.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const ND_ENTITIES = [
  // DISPENSARIES (The only 8 in the state)
  { name: "Pure Dakota Health Bismarck", city: "Bismarck", type: "dispensary", phone: "701-555-6001", email: "info@puredakotahealth.com", address: "Bismarck, ND", notes: "State-licensed medical dispensary." },
  { name: "Pure Dakota Health Fargo", city: "Fargo", type: "dispensary", phone: "701-555-6002", email: "info@puredakotahealth.com", address: "Fargo, ND", notes: "State-licensed medical dispensary." },
  { name: "Pure Dakota Health Williston", city: "Williston", type: "dispensary", phone: "701-555-6003", email: "info@puredakotahealth.com", address: "Williston, ND", notes: "State-licensed medical dispensary." },
  { name: "Strive Life Grand Forks", city: "Grand Forks", type: "dispensary", phone: "701-555-6004", email: "info@strivelife.com", address: "Grand Forks, ND", notes: "State-licensed medical dispensary." },
  { name: "Curaleaf Minot", city: "Minot", type: "dispensary", phone: "701-555-6005", email: "info@curaleaf.com", address: "Minot, ND", notes: "MSO. Medical dispensary." },
  { name: "Curaleaf Devils Lake", city: "Devils Lake", type: "dispensary", phone: "701-555-6006", email: "info@curaleaf.com", address: "Devils Lake, ND", notes: "MSO. Medical dispensary." },
  { name: "Curaleaf Dickinson", city: "Dickinson", type: "dispensary", phone: "701-555-6007", email: "info@curaleaf.com", address: "Dickinson, ND", notes: "MSO. Medical dispensary." },
  { name: "Curaleaf Jamestown", city: "Jamestown", type: "dispensary", phone: "701-555-6008", email: "info@curaleaf.com", address: "Jamestown, ND", notes: "MSO. Medical dispensary." },

  // CULTIVATORS / MANUFACTURING
  { name: "Pure Dakota LLC (Manufacturing)", city: "Bismarck", type: "cultivator", phone: "701-555-6010", email: "grow@puredakota.com", address: "Bismarck, ND", notes: "State-licensed manufacturing facility." },
  { name: "Grassroots Cannabis ND", city: "Fargo", type: "cultivator", phone: "701-555-6011", email: "grow@grassrootscannabis.com", address: "Fargo, ND", notes: "Acquired by Curaleaf. Cultivation and processing." },

  // PHYSICIANS / CLINICS
  { name: "North Dakota Medical Marijuana Docs", city: "Fargo", type: "provider", phone: "701-555-6020", email: "appointments@ndmmdocs.com", address: "Fargo, ND", notes: "Medical cannabis evaluations." },
  { name: "Green Health Docs ND", city: "Bismarck", type: "provider", phone: "701-555-6021", email: "appointments@greenhealthdocs.com", address: "Bismarck, ND (telehealth)", notes: "Telehealth medical cannabis evaluations." },
  { name: "Leafwell North Dakota", city: "Grand Forks", type: "provider", phone: "701-555-6022", email: "appointments@leafwell.com", address: "Grand Forks, ND (telehealth)", notes: "Telehealth." },

  // ATTORNEYS
  { name: "Ohnstad Twichell P.C. Cannabis Law", city: "West Fargo", type: "attorney", phone: "701-282-3249", email: "contact@ohnstadlaw.com", address: "West Fargo, ND", notes: "Dedicated Cannabis Law practice group. Compliance, licensing, lobbying." },
  { name: "Messner Reeves LLP ND", city: "Fargo", type: "attorney", phone: "701-555-6030", email: "contact@messner.com", address: "Fargo, ND", notes: "Cannabis business law and compliance." },
  { name: "Vogel Law Firm (Defense)", city: "Fargo", type: "attorney", phone: "701-237-6983", email: "contact@vogellaw.com", address: "Fargo, ND", notes: "Criminal defense, but often handles drug/cannabis offenses." },

  // TEST PATIENTS
  { name: "Thomas Larson (ND Test)", city: "Fargo", type: "patient", phone: "", email: "", address: "", notes: "Condition: ALS." },
  { name: "Emily Johnson (ND Test)", city: "Bismarck", type: "patient", phone: "", email: "", address: "", notes: "Condition: Crohn's Disease." },
  { name: "Brian Smith (ND Test)", city: "Minot", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },

  // GOVERNMENT & ADVOCACY
  { name: "ND DHHS - Medical Marijuana Program", city: "Bismarck", type: "gov_state", phone: "701-328-3330", email: "medmarijuana@nd.gov", address: "Bismarck, ND", notes: "State regulator for medical cannabis." },
  { name: "North Dakota NORML", city: "Fargo", type: "advocate", phone: "", email: "info@ndnorml.org", address: "Fargo, ND", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - ND Chapter", city: "Bismarck", type: "advocate", phone: "202-462-5747", email: "northdakota@mpp.org", address: "Bismarck, ND", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNorthDakota() {
  console.log('🌾 North Dakota DHHS — Medical Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY. Strict caps (8 dispensaries statewide). 5% tax.`);
  console.log(`   📊 ${ND_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of ND_ENTITIES) {
    const docId = `nd-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'ND', jurisdiction: 'North Dakota',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'ND DHHS / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Compassion Center (Dispensary)' : e.type === 'cultivator' ? 'Manufacturing Facility' : e.type === 'provider' ? 'Certifying Healthcare Provider' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Registered Patient' : 'Government/Advocacy',
      tags: ['north-dakota', e.type, 'medical-only', 'dhhs'],
      notes: `${e.notes} 🌾 ND: Medical only. Regulated by DHHS. 5% state tax. Only 8 dispensaries allowed statewide.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 ND: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNorthDakota().catch(console.error);

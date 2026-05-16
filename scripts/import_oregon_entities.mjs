/**
 * Oregon — Cannabis Program Import
 * DUAL-USE. OLCC & OHA Regulated.
 * 17% excise tax (med exempt). Metrc. No reciprocity.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const OR_ENTITIES = [
  // DISPENSARIES (Dual-use)
  { name: "Nectar Portland", city: "Portland", type: "dispensary", phone: "503-555-8001", email: "info@nectar.store", address: "Portland, OR", notes: "Oregon's largest dispensary chain. Dual-use." },
  { name: "Oregrown Dispensary", city: "Bend", type: "dispensary", phone: "541-555-8002", email: "info@oregrown.com", address: "Bend, OR", notes: "Farm-to-table dual-use." },
  { name: "Chalcedony Farms (Chalice)", city: "Portland", type: "dispensary", phone: "503-555-8003", email: "info@chalicefarms.com", address: "Portland, OR", notes: "Dual-use." },
  { name: "Moss Crossing", city: "Eugene", type: "dispensary", phone: "541-555-8004", email: "info@mosscrossing.com", address: "Eugene, OR", notes: "Dual-use boutique." },
  { name: "TJ's Provisions", city: "Eugene", type: "dispensary", phone: "541-555-8005", email: "info@visittjs.com", address: "Eugene, OR", notes: "Dual-use. Famous for flower." },
  { name: "Truth Dispensary", city: "Salem", type: "dispensary", phone: "503-555-8006", email: "info@truthdispensary.com", address: "Salem, OR", notes: "Dual-use." },

  // CULTIVATORS / PROCESSORS
  { name: "East Fork Cultivars", city: "Takilma", type: "cultivator", phone: "541-555-8010", email: "grow@eastforkcultivars.com", address: "Takilma, OR", notes: "Sun-grown CBD/THC cannabis." },
  { name: "Bögs Bakery (Edibles)", city: "Portland", type: "cultivator", phone: "503-555-8011", email: "info@bogsbakery.com", address: "Portland, OR", notes: "OLCC Licensed Processor." },

  // PHYSICIANS / CLINICS (OMMP Certifications)
  { name: "Green Leaf Clinic OR", city: "Portland", type: "provider", phone: "503-555-8020", email: "appointments@greenleafclinic.com", address: "Portland, OR", notes: "OMMP Medical evaluations." },
  { name: "OMMP Docs of Eugene", city: "Eugene", type: "provider", phone: "541-555-8021", email: "appointments@ommpdocs.com", address: "Eugene, OR", notes: "Medical cannabis evaluations." },

  // ATTORNEYS
  { name: "Harris Sliwoski LLP", city: "Portland", type: "attorney", phone: "503-555-8030", email: "contact@harris-sliwoski.com", address: "Portland, OR", notes: "Leading cannabis law firm. OLCC licensing and corporate law." },
  { name: "Cultiva Law Portland", city: "Portland", type: "attorney", phone: "503-555-8031", email: "contact@cultivalaw.com", address: "Portland, OR", notes: "Cannabis compliance and litigation." },
  { name: "Margolis Legal", city: "Portland", type: "attorney", phone: "503-555-8032", email: "contact@margolislegal.com", address: "Portland, OR", notes: "Regulatory and administrative law." },
  { name: "Loney Law Group", city: "Portland", type: "attorney", phone: "503-555-8033", email: "contact@loneylaw.com", address: "Portland, OR", notes: "Business law, OMMP/OLCC compliance." },

  // TEST PATIENTS
  { name: "Elijah Brooks (OR Test)", city: "Portland", type: "patient", phone: "", email: "", address: "", notes: "Condition: Severe Pain. OMMP Cardholder." },
  { name: "Sophia Lewis (OR Test)", city: "Eugene", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD. OMMP Cardholder." },
  { name: "Oliver Clark (OR Test)", city: "Bend", type: "patient", phone: "", email: "", address: "", notes: "Condition: Glaucoma. OMMP Cardholder." },

  // GOVERNMENT & ADVOCACY
  { name: "Oregon Liquor and Cannabis Commission (OLCC)", city: "Portland", type: "gov_state", phone: "503-872-5000", email: "marijuana@oregon.gov", address: "Portland, OR", notes: "State regulator for adult-use cannabis." },
  { name: "Oregon Health Authority (OMMP)", city: "Portland", type: "gov_state", phone: "971-673-1234", email: "medmarijuana.dispensaries@odhsoha.oregon.gov", address: "Portland, OR", notes: "State regulator for medical cannabis registry." },
  { name: "Oregon NORML", city: "Portland", type: "advocate", phone: "", email: "info@ornorml.org", address: "Portland, OR", notes: "Cannabis advocacy." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importOregon() {
  console.log('🌲 Oregon OLCC/OHA — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Measure 91 (2014). 17% excise. No reciprocity.`);
  console.log(`   📊 ${OR_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of OR_ENTITIES) {
    const docId = `or-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'OR', jurisdiction: 'Oregon',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'OR OLCC / OHA / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Dual-Use Dispensary (OLCC)' : e.type === 'cultivator' ? 'Producer/Processor (OLCC)' : e.type === 'provider' ? 'Certifying Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'OMMP Patient' : 'Government/Advocacy',
      tags: ['oregon', e.type, 'dual-use', 'olcc', 'ommp'],
      notes: `${e.notes} 🌲 OR: Dual-use. OLCC/OHA regulates. 17% excise tax (med exempt). No out-of-state reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 OR: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importOregon().catch(console.error);

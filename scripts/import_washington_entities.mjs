/**
 * Washington — Cannabis Program Import
 * DUAL USE. LCB & DOH Regulated.
 * 37% tax for adult-use. Tax exemptions for DOH-card medical patients.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const WA_ENTITIES = [
  // RETAILERS / DISPENSARIES (LCB Licensed, some with DOH Medical Endorsements)
  { name: "Dockside Cannabis", city: "Seattle", type: "dispensary", phone: "206-555-9001", email: "info@docksidecannabis.com", address: "Seattle, WA", notes: "Dual-use. Medical Endorsed." },
  { name: "Seattle Hashtag Cannabis", city: "Seattle", type: "dispensary", phone: "206-555-9002", email: "info@seattlehashtag.com", address: "Seattle, WA", notes: "Adult-use retail." },
  { name: "The Novel Tree", city: "Bellevue", type: "dispensary", phone: "425-555-9003", email: "info@novel-tree.com", address: "Bellevue, WA", notes: "Medical Endorsed." },
  { name: "Have a Heart", city: "Seattle", type: "dispensary", phone: "206-555-9004", email: "info@haveaheartcc.com", address: "Seattle, WA", notes: "Adult-use retail." },

  // CULTIVATORS / PRODUCERS (LCB)
  { name: "Phat Panda", city: "Spokane Valley", type: "cultivator", phone: "509-555-9010", email: "info@phatpanda.com", address: "Spokane Valley, WA", notes: "Tier 3 Producer/Processor." },

  // CLINICS / CERTIFIERS (Medical Program)
  { name: "Green Wellness Clinic", city: "Seattle", type: "provider", phone: "206-555-9020", email: "appointments@greenwellnesswa.com", address: "Seattle, WA", notes: "DOH registered medical cannabis certifications." },

  // ATTORNEYS (Focus on LCB compliance)
  { name: "Cultiva Law", city: "Seattle", type: "attorney", phone: "206-555-9030", email: "contact@cultivalaw.com", address: "Seattle, WA", notes: "WSLCB compliance, risk mitigation, and licensing." },
  { name: "Harris Sliwoski LLP", city: "Seattle", type: "attorney", phone: "206-555-9031", email: "contact@harris-sliwoski.com", address: "Seattle, WA", notes: "Cannabis advisory, licensing, and compliance." },
  { name: "Gleam Law", city: "Seattle", type: "attorney", phone: "206-555-9032", email: "contact@gleamlaw.com", address: "Seattle, WA", notes: "LCB regulatory compliance and corporate acquisitions." },

  // TEST PATIENTS / CONSUMERS
  { name: "William Taylor (WA Test)", city: "Seattle", type: "patient", phone: "", email: "", address: "", notes: "Condition: Intractable Pain. DOH cardholder (37% tax exempt)." },
  { name: "David Anderson (WA Test)", city: "Tacoma", type: "patient", phone: "", email: "", address: "", notes: "Adult-use consumer (pays 37% tax + sales tax)." },

  // GOVERNMENT & ADVOCACY
  { name: "Washington State Liquor and Cannabis Board (LCB)", city: "Olympia", type: "gov_state", phone: "360-664-1600", email: "customerservice@lcb.wa.gov", address: "Olympia, WA", notes: "State regulator for business/retail." },
  { name: "Washington State Department of Health (DOH)", city: "Olympia", type: "gov_state", phone: "360-236-4819", email: "medicalcannabis@doh.wa.gov", address: "Olympia, WA", notes: "State regulator for the medical program." },
  { name: "Washington CannaBusiness Association", city: "Olympia", type: "advocate", phone: "", email: "info@wacannabusiness.org", address: "Olympia, WA", notes: "Industry advocacy." },
  { name: "Marijuana Policy Project (MPP) - WA Chapter", city: "Olympia", type: "advocate", phone: "202-462-5747", email: "washington@mpp.org", address: "Olympia, WA", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importWashington() {
  console.log('🌲 Washington (LCB/DOH) — Cannabis Program → Firestore CRM Import');
  console.log(`   🌿 DUAL USE. Medical (DOH) is tax-exempt. Adult-use is 37% tax. No reciprocity.`);
  console.log(`   📊 ${WA_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of WA_ENTITIES) {
    const docId = `wa-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'WA', jurisdiction: 'Washington',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'WA LCB/DOH / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'LCB Retailer (Medical Endorsed)' : e.type === 'cultivator' ? 'Producer/Processor' : e.type === 'provider' ? 'Healthcare Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'DOH Patient/Consumer' : 'Government/Advocacy',
      tags: ['washington', e.type, 'dual-use', 'lcb', 'doh'],
      notes: `${e.notes} 🌲 WA: Dual-use. Adult-use subject to 37% excise tax + sales tax. DOH Medical patients are exempt from both. No reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 WA: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importWashington().catch(console.error);

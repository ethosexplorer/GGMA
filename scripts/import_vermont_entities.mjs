/**
 * Vermont — Cannabis Program Import
 * DUAL USE. CCB Regulated.
 * 20% total tax for adult-use. Tax-exempt for medical.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const VT_ENTITIES = [
  // DISPENSARIES (Adult-Use & Medical)
  { name: "Bern Gallery Smoke Shop & Cannabis", city: "Burlington", type: "dispensary", phone: "802-555-7001", email: "info@berngallery.com", address: "135 Main St., Burlington, VT", notes: "Adult-use retail." },
  { name: "Float On Dispensary", city: "Burlington", type: "dispensary", phone: "802-555-7002", email: "info@floatonvt.com", address: "136 1/2 Church St., Burlington, VT", notes: "Adult-use retail." },
  { name: "Green State Dispensary", city: "Burlington", type: "dispensary", phone: "802-555-7003", email: "info@greenstate.com", address: "Burlington, VT", notes: "Dual-use (Medical & Adult-use)." },
  { name: "Winooski Organics", city: "Winooski", type: "dispensary", phone: "802-555-7004", email: "info@winooskiorganics.com", address: "165 E. Allen St., Winooski, VT", notes: "Adult-use retail." },
  { name: "Dome City Cannabis", city: "Winooski", type: "dispensary", phone: "802-555-7005", email: "info@domecity.com", address: "147 E. Allen St., Winooski, VT", notes: "Adult-use retail." },

  // CULTIVATORS / MANUFACTURERS (CCB)
  { name: "Upstate Elevator Supply Co.", city: "Burlington", type: "cultivator", phone: "802-555-7010", email: "hello@upstateelevator.com", address: "699 Pine St., Burlington, VT", notes: "Licensed cultivator, manufacturer, and retailer." },

  // CLINICS / CERTIFIERS (Medical Program)
  { name: "Green Mountain Medical", city: "Burlington", type: "provider", phone: "802-555-7020", email: "appointments@greenmountainmed.com", address: "Burlington, VT", notes: "Medical cannabis evaluations." },

  // ATTORNEYS (Focus on CCB compliance)
  { name: "Vermont Cannabis Solutions", city: "Burlington", type: "attorney", phone: "802-555-7030", email: "contact@vermontcannabissolutions.com", address: "Burlington, VT", notes: "CCB licensing and business compliance." },
  { name: "Gravel & Shea PC", city: "Burlington", type: "attorney", phone: "802-555-7031", email: "contact@gravelshea.com", address: "Burlington, VT", notes: "Cannabis practice group. Business formation and CCB compliance." },

  // TEST PATIENTS / CONSUMERS
  { name: "Emily Carter (VT Test)", city: "Burlington", type: "patient", phone: "", email: "", address: "", notes: "Condition: Crohn's Disease. Medical cardholder (Tax exempt)." },
  { name: "James Smith (VT Test)", city: "Winooski", type: "patient", phone: "", email: "", address: "", notes: "Adult-use consumer (20% tax)." },

  // GOVERNMENT & ADVOCACY
  { name: "Vermont Cannabis Control Board (CCB)", city: "Montpelier", type: "gov_state", phone: "802-828-1010", email: "CCB.Info@vermont.gov", address: "Montpelier, VT", notes: "State regulator for medical and adult-use." },
  { name: "Vermont Cannabis Trade Association", city: "Montpelier", type: "advocate", phone: "", email: "info@vtcannabistrade.org", address: "Montpelier, VT", notes: "Industry advocacy." },
  { name: "Marijuana Policy Project (MPP) - VT Chapter", city: "Montpelier", type: "advocate", phone: "202-462-5747", email: "vermont@mpp.org", address: "Montpelier, VT", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importVermont() {
  console.log('🍁 Vermont (CCB) — Cannabis Program → Firestore CRM Import');
  console.log(`   🌿 DUAL USE. Medical is tax-exempt. Adult-use is 20%. No reciprocity.`);
  console.log(`   📊 ${VT_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of VT_ENTITIES) {
    const docId = `vt-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'VT', jurisdiction: 'Vermont',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'VT CCB / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Retail Dispensary (CCB)' : e.type === 'cultivator' ? 'Cultivator/Manufacturer' : e.type === 'provider' ? 'Certifying Provider' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Patient/Consumer' : 'Government/Advocacy',
      tags: ['vermont', e.type, 'dual-use', 'ccb'],
      notes: `${e.notes} 🍁 VT: Dual-use. Medical is tax-exempt; Adult-use has 20% tax (14% excise + 6% sales). No out-of-state reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 VT: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importVermont().catch(console.error);

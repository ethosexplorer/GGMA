/**
 * Tennessee — Cannabis Program Import
 * STRICTLY ILLEGAL. HDCP / Hemp Market Only.
 * TABC regulates HDCPs. Wholesale tax applies.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const TN_ENTITIES = [
  // HEMP / HDCP RETAILERS (TABC Licensed)
  { name: "Perfect Plant Hemp Co.", city: "Nashville", type: "dispensary", phone: "615-555-4001", email: "info@perfectplanthemp.com", address: "Nashville, TN", notes: "Hemp/HDCP retailer. TABC compliant." },
  { name: "Clara Jane Hemp Dispensary", city: "Nashville", type: "dispensary", phone: "615-555-4002", email: "info@clarajanehemp.com", address: "Nashville, TN", notes: "Hemp/HDCP retailer." },
  { name: "Canopy Memphis", city: "Memphis", type: "dispensary", phone: "901-555-4003", email: "info@canopymemphis.com", address: "Memphis, TN", notes: "Hemp/HDCP retailer." },
  { name: "Ounce of Hope", city: "Memphis", type: "dispensary", phone: "901-555-4004", email: "info@ounceofhope.com", address: "Memphis, TN", notes: "Hemp aquaponics farm and retailer." },
  { name: "Knoxville Hemp Dispensary", city: "Knoxville", type: "dispensary", phone: "865-555-4005", email: "info@knoxhemp.com", address: "Knoxville, TN", notes: "Hemp/HDCP retailer." },
  { name: "Snapdragon Hemp", city: "Chattanooga", type: "dispensary", phone: "423-555-4006", email: "info@snapdragonhemp.com", address: "Chattanooga, TN", notes: "Hemp/HDCP retailer and manufacturer." },

  // CULTIVATORS / MANUFACTURERS (TDA Licensed)
  { name: "Tennessee Hemp Farm", city: "Murfreesboro", type: "cultivator", phone: "615-555-4010", email: "grow@tnhempfarm.com", address: "Murfreesboro, TN", notes: "Licensed hemp cultivator." },

  // ATTORNEYS (Focus on Hemp compliance, TABC licensing, or Criminal Defense)
  { name: "Hemp Law Group", city: "Nashville", type: "attorney", phone: "615-555-4020", email: "contact@hemplawgroup.com", address: "Nashville, TN", notes: "Hemp business compliance." },
  { name: "Midtown Legal", city: "Nashville", type: "attorney", phone: "615-555-4021", email: "contact@midtownlegal.co", address: "Nashville, TN", notes: "TABC licensing and regulatory defense." },
  { name: "Buscher Law LLC", city: "Nashville", type: "attorney", phone: "615-555-4022", email: "contact@buscherlaw.com", address: "Nashville, TN", notes: "Hemp compliance and federal regulations." },
  { name: "Baker Donelson", city: "Nashville", type: "attorney", phone: "615-555-4023", email: "contact@bakerdonelson.com", address: "Nashville, TN", notes: "Corporate and regulatory cannabis law." },

  // TEST PATIENTS / CONSUMERS
  { name: "David Wilson (TN Test)", city: "Nashville", type: "patient", phone: "", email: "", address: "", notes: "Consumer of HDCPs. 21+ Verified." },
  { name: "Lisa Brown (TN Test)", city: "Memphis", type: "patient", phone: "", email: "", address: "", notes: "Advocating for medical cannabis legalization." },

  // GOVERNMENT & ADVOCACY
  { name: "Tennessee Alcoholic Beverage Commission (TABC)", city: "Nashville", type: "gov_state", phone: "615-741-1602", email: "TABC.Info@tn.gov", address: "Nashville, TN", notes: "State regulator for HDCP sales." },
  { name: "Tennessee Department of Agriculture (TDA)", city: "Nashville", type: "gov_state", phone: "615-837-5100", email: "hemp@tn.gov", address: "Nashville, TN", notes: "State regulator for Hemp Cultivation." },
  { name: "Tennessee Growers Coalition", city: "Nashville", type: "advocate", phone: "", email: "info@tngrowerscoalition.com", address: "Nashville, TN", notes: "Advocacy for the hemp industry." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importTennessee() {
  console.log('🎸 Tennessee HDCP/Hemp — Cannabis Program → Firestore CRM Import');
  console.log(`   🚨 ILLEGAL STATE. Market is restricted to TABC-regulated HDCPs.`);
  console.log(`   📊 ${TN_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of TN_ENTITIES) {
    const docId = `tn-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'TN', jurisdiction: 'Tennessee',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'TN TABC/TDA / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Hemp/HDCP Retailer (TABC)' : e.type === 'cultivator' ? 'Hemp Cultivator (TDA)' : e.type === 'attorney' ? 'Hemp Compliance Law Firm' : e.type === 'patient' ? 'HDCP Consumer / Advocate' : 'Government/Advocacy',
      tags: ['tennessee', e.type, 'illegal-state', 'hemp-hdcp', 'tabc'],
      notes: `${e.notes} 🎸 TN: Marijuana is strictly ILLEGAL. Entities are operating in the Hemp/HDCP space regulated by TABC (retail) and TDA (cultivation).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 TN: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importTennessee().catch(console.error);

/**
 * Michigan CRA — Cannabis Program Import (Medical + Adult-Use)
 * MASSIVE DUAL-USE MARKET: $3.17B in 2025 sales. 838+ active retailers.
 * Cannabis Regulatory Agency (CRA) regulates.
 * MRTMA (adult-use) + MMFLA (medical). Metrc tracking.
 * Source: https://www.michigan.gov/cra/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MI_ENTITIES = [
  // Major Retail Operators
  { name: "Lume Cannabis Co.", city: "Troy", type: "dispensary", phone: "800-698-3132", notes: "One of Michigan's largest operators. Vast network of retail locations statewide." },
  { name: "House of Dank", city: "Detroit", type: "dispensary", phone: "313-924-1470", notes: "14 locations. Vertically integrated. Brands: Pressure Pack, North Coast." },
  { name: "JARS Cannabis", city: "Detroit", type: "dispensary", phone: "734-530-9600", notes: "Multiple metro Detroit locations. Adult-use & medical." },
  { name: "Gage Cannabis Company", city: "Ferndale", type: "dispensary", phone: "248-439-7180", notes: "Multiple MI locations. Premium cannabis." },
  { name: "Pure Roots", city: "Ann Arbor", type: "dispensary", phone: "734-476-1111", notes: "Tech-forward. Ann Arbor, Battle Creek, Lansing. Non-remediated flower." },
  { name: "Herbology Cannabis Co.", city: "River Rouge", type: "dispensary", phone: "313-459-4299", notes: "Community-focused. Multiple MI locations." },
  { name: "Exclusive Brands", city: "Ann Arbor", type: "dispensary", phone: "734-585-6590", notes: "Vertically integrated. Ann Arbor area." },
  { name: "The Flower Bowl", city: "Inkster", type: "dispensary", phone: "313-683-5300", notes: "Metro Detroit dispensary." },
  { name: "High Profile Cannabis", city: "Grand Rapids", type: "dispensary", phone: "616-259-8420", notes: "West Michigan. Multiple locations." },
  { name: "Nirvana Center Michigan", city: "Coldwater", type: "dispensary", phone: "517-278-0420", notes: "Southern MI. Border community draw." },
  { name: "Liv Cannabis — Ferndale", city: "Ferndale", type: "dispensary", phone: "248-268-0420", notes: "Metro Detroit. Dual-use." },
  { name: "Information Entropy (Cookies Detroit)", city: "Detroit", type: "dispensary", phone: "313-666-0420", notes: "Cookies brand licensed partner. Detroit." },
  { name: "Cloud Cannabis — Muskegon", city: "Muskegon", type: "dispensary", phone: "231-375-0420", notes: "West Michigan. Adult-use." },
  { name: "Pinnacle Emporium", city: "Morenci", type: "dispensary", phone: "517-458-0420", notes: "Border community. Ohio customer draw." },
  { name: "Consume Cannabis Co. MI", city: "Ionia", type: "dispensary", phone: "616-522-0420", notes: "Central MI dispensary." },

  // Major Cultivators / Processors
  { name: "710 Labs Michigan", city: "Detroit", type: "cultivator", phone: "313-555-0710", notes: "Premium concentrate & flower cultivator." },
  { name: "Hytek Cannabis", city: "Kalamazoo", type: "cultivator", phone: "269-555-0301", notes: "Licensed cultivator. SW Michigan." },
  { name: "Mitten Extracts", city: "Detroit", type: "cultivator", phone: "313-555-0302", notes: "Processor — concentrates, edibles." },
  { name: "Pleasantrees", city: "Harrison Township", type: "cultivator", phone: "586-598-0420", notes: "Vertically integrated. Cultivation + processing + retail." },

  // Physicians
  { name: "Certified Marijuana Doctors MI", city: "Detroit", type: "provider", phone: "248-266-0420", notes: "Medical card evaluations across MI." },
  { name: "Dr. Green Relief Michigan", city: "Ann Arbor", type: "provider", phone: "734-555-0420", notes: "Cannabis physician evaluations." },
  { name: "Green Health Docs Michigan", city: "Detroit", type: "provider", phone: "313-555-0421", notes: "Medical cannabis certifications." },
  { name: "DocMJ Michigan", city: "Detroit", type: "provider", phone: "888-908-0143", notes: "Telehealth cannabis evaluations." },
  { name: "Heally Michigan", city: "Detroit", type: "provider", phone: "619-371-7771", notes: "Online medical cannabis card platform." },

  // Attorneys
  { name: "Scott F. Roberts Law, PLC", city: "Detroit", type: "attorney", phone: "313-832-4500", notes: "Cannabis business law — licensing, real estate, compliance. Boutique firm." },
  { name: "Varnum LLP", city: "Ann Arbor", type: "attorney", phone: "734-930-4900", notes: "Full-service — cannabis transactions, finance, regulatory compliance." },
  { name: "Warner Norcross + Judd LLP", city: "Grand Rapids", type: "attorney", phone: "616-752-2000", notes: "Cannabis license holders, investors, legislative drafting." },
  { name: "Foster Swift Collins & Smith", city: "Lansing", type: "attorney", phone: "517-371-8100", notes: "Cannabis regulatory compliance & licensing disputes." },
  { name: "Grabel & Associates", city: "Ann Arbor", type: "attorney", phone: "734-707-9100", notes: "Cannabis criminal defense. Detroit & Ann Arbor." },
  { name: "The Covert Law Firm, PLLC", city: "Detroit", type: "attorney", phone: "248-850-0052", notes: "Cannabis business + criminal defense." },

  // Test Patients
  { name: "Dwayne Jackson (MI Test)", city: "Detroit", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "Nicole Vander Berg (MI Test)", city: "Grand Rapids", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Carlos Rivera (MI Test)", city: "Ann Arbor", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Ashley Foster (MI Test)", city: "Lansing", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Brian Kowalski (MI Test)", city: "Flint", type: "patient", phone: "", notes: "Condition: Crohn's Disease." },

  // Government & Advocacy
  { name: "Michigan Cannabis Regulatory Agency (CRA)", city: "Lansing", type: "gov_state", phone: "517-284-8599", notes: "State regulator. Both MRTMA (adult-use) & MMFLA (medical)." },
  { name: "Michigan NORML", city: "Detroit", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MI Chapter", city: "Lansing", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMichigan() {
  console.log('🚗 Michigan CRA — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE MEGA-MARKET: $3.17B sales, 838+ retailers`);
  console.log(`   📊 ${MI_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MI_ENTITIES) {
    const docId = `mi-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MI', jurisdiction: 'Michigan',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'CRA / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Retailer / Provisioning Center' : e.type === 'cultivator' ? 'Grower License (Class C)' : e.type === 'provider' ? 'Cannabis Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Medical Marihuana Card' : 'Government/Advocacy',
      tags: ['michigan', e.type, 'cra', 'dual-use', 'mrtma', 'mmfla'],
      notes: `${e.notes} 🚗 MI: $3.17B market. 838+ retailers. 24% wholesale tax. Metrc tracking. CRA regulates.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MI: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMichigan().catch(console.error);

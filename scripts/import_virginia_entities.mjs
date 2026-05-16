/**
 * Virginia — Cannabis Program Import
 * MEDICAL SALES ONLY. CCA Regulated.
 * Adult-use is legal to possess/grow but NO retail sales.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const VA_ENTITIES = [
  // MEDICAL DISPENSARIES (Pharmaceutical Processors)
  { name: "gLeaf Virginia", city: "Richmond", type: "dispensary", phone: "800-555-8001", email: "info@gleaf.com", address: "Richmond, VA", notes: "Licensed Pharmaceutical Processor." },
  { name: "Cannabist (Columbia Care)", city: "Portsmouth", type: "dispensary", phone: "757-555-8002", email: "info@gocannabist.com", address: "Portsmouth, VA", notes: "Licensed Pharmaceutical Processor." },
  { name: "RISE Dispensaries VA", city: "Salem", type: "dispensary", phone: "540-555-8003", email: "info@risecannabis.com", address: "Salem, VA", notes: "Licensed Pharmaceutical Processor." },
  { name: "Beyond / Hello", city: "Manassas", type: "dispensary", phone: "703-555-8004", email: "info@beyond-hello.com", address: "Manassas, VA", notes: "Licensed Pharmaceutical Processor." },

  // PRACTITIONERS (Certifiers)
  { name: "Virginia Medical Cannabis Doctors", city: "Richmond", type: "provider", phone: "804-555-8020", email: "appointments@vamedicalcard.com", address: "Richmond, VA", notes: "CCA registered practitioner." },
  { name: "CannabisMD TeleMed", city: "Alexandria", type: "provider", phone: "703-555-8021", email: "appointments@cannabismdtelemed.com", address: "Alexandria, VA", notes: "Telehealth certifications." },

  // ATTORNEYS (Focus on CCA compliance)
  { name: "Woods Rogers Vandeventer Black", city: "Richmond", type: "attorney", phone: "804-555-8030", email: "contact@woodsrogers.com", address: "Richmond, VA", notes: "Cannabis business compliance and regulatory guidance." },
  { name: "Coates & Davenport, P.C.", city: "Richmond", type: "attorney", phone: "804-555-8031", email: "contact@coateslaw.com", address: "Richmond, VA", notes: "Cannabis licensing and CCA compliance." },

  // TEST PATIENTS
  { name: "Robert Allen (VA Test)", city: "Richmond", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Back Pain. Registered patient." },
  { name: "Lisa Brown (VA Test)", city: "Virginia Beach", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD. Registered patient." },

  // GOVERNMENT & ADVOCACY
  { name: "Virginia Cannabis Control Authority (CCA)", city: "Richmond", type: "gov_state", phone: "804-688-6112", email: "info@cca.virginia.gov", address: "Richmond, VA", notes: "State regulator." },
  { name: "Virginia NORML", city: "Richmond", type: "advocate", phone: "", email: "director@vanorml.org", address: "Richmond, VA", notes: "Advocacy for marijuana law reform." },
  { name: "Marijuana Policy Project (MPP) - VA Chapter", city: "Richmond", type: "advocate", phone: "202-462-5747", email: "virginia@mpp.org", address: "Richmond, VA", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importVirginia() {
  console.log('🏛️ Virginia (CCA) — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL SALES ONLY. Adult-use is legal but no retail framework yet.`);
  console.log(`   📊 ${VA_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of VA_ENTITIES) {
    const docId = `va-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'VA', jurisdiction: 'Virginia',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'VA CCA / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Pharmaceutical Processor (CCA)' : e.type === 'provider' ? 'Registered Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Registered Patient' : 'Government/Advocacy',
      tags: ['virginia', e.type, 'medical-sales-only', 'cca'],
      notes: `${e.notes} 🏛️ VA: Medical retail only. Adult-use retail is not yet operational. No set list of qualifying conditions.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 VA: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importVirginia().catch(console.error);

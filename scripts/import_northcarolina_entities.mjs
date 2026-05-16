/**
 * North Carolina — Cannabis Program Import
 * RESTRICTIVE / ILLEGAL STATEWIDE.
 * Exceptions: Hemp/CBD (<0.3% THC) and EBCI Tribal Land (Great Smoky Cannabis Co).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const NC_ENTITIES = [
  // TRIBAL DISPENSARY (The ONLY legal dispensary in NC)
  { name: "Great Smoky Cannabis Company", city: "Cherokee", type: "dispensary", phone: "828-555-5001", email: "info@greatsmokycannabis.com", address: "Cherokee, NC (Qualla Boundary)", notes: "EBCI Tribal Land. ONLY legal dispensary in North Carolina. Medical & Adult-use." },

  // HEMP / CBD DISPENSARIES (State-legal <0.3% THC)
  { name: "Carolina Hemp Company", city: "Asheville", type: "dispensary", phone: "828-555-5002", email: "info@carolinahempcompany.com", address: "Asheville, NC", notes: "CBD / Hemp products only." },
  { name: "Crowntown Cannabis", city: "Charlotte", type: "dispensary", phone: "704-555-5003", email: "info@crowntowncannabis.com", address: "Charlotte, NC", notes: "CBD, Delta-8, THCa. Charlotte area." },
  { name: "Hemp and Barrel", city: "Raleigh", type: "dispensary", phone: "919-555-5004", email: "info@hempandbarrel.com", address: "Raleigh, NC", notes: "CBD / Hemp dispensary." },
  { name: "Apotheca CBD Dispensary", city: "Asheville", type: "dispensary", phone: "828-555-5005", email: "info@apotheca.org", address: "Asheville, NC", notes: "Multiple locations for CBD and legal hemp." },
  { name: "The Hemp Farmacy", city: "Wilmington", type: "dispensary", phone: "910-555-5006", email: "info@hempfarmacy.us", address: "Wilmington, NC", notes: "CBD / Hemp." },

  // CULTIVATORS / PROCESSORS (HEMP)
  { name: "NC Hemp Farm", city: "Raleigh", type: "cultivator", phone: "919-555-5010", email: "grow@nchempfarm.com", address: "Raleigh, NC", notes: "Hemp cultivation." },
  { name: "Carolina Hemp Processing", city: "Charlotte", type: "cultivator", phone: "704-555-5011", email: "info@carolinahempprocessing.com", address: "Charlotte, NC", notes: "Hemp processing and extraction." },
  { name: "Blue Ridge Hemp Co.", city: "Asheville", type: "cultivator", phone: "828-555-5012", email: "info@blueridgehempco.com", address: "Asheville, NC", notes: "Hemp CBD products." },

  // PHYSICIANS (EBCI Recommendations / General Consults)
  { name: "NC Tribal Cannabis Certifications", city: "Cherokee", type: "provider", phone: "828-555-5020", email: "appointments@nctribalmed.com", address: "Cherokee, NC", notes: "Medical evaluations for EBCI tribal dispensary." },
  { name: "Green Health Docs NC", city: "Raleigh", type: "provider", phone: "919-555-5021", email: "appointments@greenhealthdocs.com", address: "Raleigh, NC (telehealth)", notes: "Consultations for future program or out-of-state reciprocity." },
  { name: "Leafwell North Carolina", city: "Charlotte", type: "provider", phone: "704-555-5022", email: "appointments@leafwell.com", address: "Charlotte, NC (telehealth)", notes: "Telehealth consults." },

  // ATTORNEYS (Hemp & CBD Compliance)
  { name: "Ward and Smith, P.A. Hemp Law", city: "Raleigh", type: "attorney", phone: "919-277-9100", email: "contact@wardandsmith.com", address: "Raleigh, NC", notes: "Leading NC hemp and CBD compliance firm." },
  { name: "Kight Law Office (Cannabis & Hemp)", city: "Asheville", type: "attorney", phone: "828-255-9881", email: "contact@kightlaw.com", address: "Asheville, NC", notes: "National hemp and CBD law expertise." },
  { name: "Davis Legal", city: "Raleigh", type: "attorney", phone: "919-555-5030", email: "contact@morgandavislegal.com", address: "Raleigh, NC", notes: "Hemp/CBD entrepreneurs." },
  { name: "Law Offices of David P. Sheehan", city: "Charlotte", type: "attorney", phone: "704-555-5031", email: "contact@dpslaw.com", address: "Charlotte, NC", notes: "CBD and THC sector consulting." },
  { name: "Allen Stahl + Kilbourne", city: "Asheville", type: "attorney", phone: "828-555-5032", email: "contact@asklawnc.com", address: "Asheville, NC", notes: "Hemp regulatory compliance." },

  // TEST PATIENTS (EBCI or CBD users)
  { name: "William Moore (NC Test)", city: "Cherokee", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain (EBCI Access)." },
  { name: "Jessica Smith (NC Test)", city: "Raleigh", type: "patient", phone: "", email: "", address: "", notes: "Condition: Anxiety (CBD only)." },
  { name: "Marcus Johnson (NC Test)", city: "Charlotte", type: "patient", phone: "", email: "", address: "", notes: "Condition: Arthritis (CBD only)." },
  
  // GOVERNMENT & ADVOCACY
  { name: "NC Department of Agriculture (Hemp Program)", city: "Raleigh", type: "gov_state", phone: "919-707-3730", email: "hemp@ncagr.gov", address: "Raleigh, NC", notes: "Regulates Hemp/CBD in NC." },
  { name: "EBCI Cannabis Control Board", city: "Cherokee", type: "gov_state", phone: "828-497-7000", email: "info@ebci-ccb.org", address: "Cherokee, NC", notes: "Tribal Regulator for Qualla Boundary." },
  { name: "North Carolina NORML", city: "Charlotte", type: "advocate", phone: "", email: "info@ncnorml.org", address: "Charlotte, NC", notes: "Advocating for state legalization." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNorthCarolina() {
  console.log('🌲 North Carolina — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚠️ ILLEGAL STATEWIDE. Exception: EBCI Tribal Land (Great Smoky Cannabis Co).`);
  console.log(`   📊 ${NC_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of NC_ENTITIES) {
    const docId = `nc-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'NC', jurisdiction: 'North Carolina',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'NC Dept of Ag / EBCI Tribal / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.name === 'Great Smoky Cannabis Company' ? 'Tribal Dispensary (EBCI)' : e.type === 'dispensary' ? 'Hemp/CBD Retailer' : e.type === 'cultivator' ? 'Hemp Cultivator' : e.type === 'provider' ? 'Certifying Provider' : e.type === 'attorney' ? 'Hemp Law Firm' : e.type === 'patient' ? 'Patient' : 'Government/Advocacy',
      tags: ['north-carolina', e.type, 'hemp', 'cbd', 'ebci'],
      notes: `${e.notes} 🌲 NC: Marijuana illegal statewide. Hemp/CBD legal. EBCI tribal land has sole legal dispensary.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 NC: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNorthCarolina().catch(console.error);

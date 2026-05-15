/**
 * Maryland MCA — Cannabis Program Import (Medical + Adult-Use)
 * DUAL-USE since July 1, 2023. Maryland Cannabis Administration (MCA).
 * 100+ dispensaries statewide. Social equity licensing program.
 * Source: https://cannabis.maryland.gov/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const MD_ENTITIES = [
  // Major Dispensary Operators (Adult-Use + Medical)
  { name: "Curaleaf Maryland", city: "Reisterstown", type: "dispensary", phone: "443-438-8700", notes: "National MSO. Multiple MD locations. Medical + adult-use." },
  { name: "Harvest HOC (Trulieve MD)", city: "Baltimore", type: "dispensary", phone: "443-681-0464", notes: "Baltimore flagship. Acquired by Trulieve. Dual-use." },
  { name: "Culta", city: "Baltimore", type: "dispensary", phone: "410-220-0420", notes: "Vertically integrated. Premium craft cannabis. Baltimore." },
  { name: "Ethos Cannabis — Baltimore", city: "Baltimore", type: "dispensary", phone: "410-649-0420", notes: "Multi-state operator. Baltimore location." },
  { name: "Sunmed Growers / GreenMart", city: "Elkridge", type: "dispensary", phone: "410-540-1017", notes: "Vertically integrated. Elkridge cultivation & retail." },
  { name: "Nature's Medicines Maryland", city: "Ellicott City", type: "dispensary", phone: "410-465-8200", notes: "Ellicott City dispensary. Medical + adult-use." },
  { name: "Gold Leaf — Annapolis", city: "Annapolis", type: "dispensary", phone: "410-224-4188", notes: "Capital region dispensary." },
  { name: "Bloom Medicinals Maryland", city: "Germantown", type: "dispensary", phone: "240-420-3800", notes: "Montgomery County dispensary." },
  { name: "Rise (GTI) Maryland", city: "Bethesda", type: "dispensary", phone: "301-825-6040", notes: "Green Thumb Industries. Bethesda location." },
  { name: "Zen Leaf Maryland", city: "Jessup", type: "dispensary", phone: "410-881-9511", notes: "Verano Holdings MSO. Jessup location." },
  { name: "Starbuds Maryland", city: "Waldorf", type: "dispensary", phone: "301-932-0420", notes: "Southern MD / Charles County." },
  { name: "Greenlight Dispensary MD", city: "Salisbury", type: "dispensary", phone: "410-546-0420", notes: "Eastern Shore dispensary." },
  { name: "Herbology — Gaithersburg", city: "Gaithersburg", type: "dispensary", phone: "301-637-0420", notes: "Montgomery County dispensary." },
  { name: "Mission Maryland", city: "Catonsville", type: "dispensary", phone: "410-415-9911", notes: "Baltimore County. Dual-use." },
  { name: "Kannavis", city: "Jessup", type: "dispensary", phone: "301-636-0420", notes: "Howard County area dispensary." },

  // Cultivators / Growers
  { name: "Evermore Cannabis Company", city: "Baltimore", type: "cultivator", phone: "410-555-0301", notes: "Licensed cultivator. Baltimore-based." },
  { name: "Curio Wellness", city: "Timonium", type: "cultivator", phone: "410-773-0100", notes: "Vertically integrated. Timonium HQ. Cultivation + processing + retail." },
  { name: "HMS Health / Hana Meds", city: "Hancock", type: "cultivator", phone: "301-555-0302", notes: "Western MD cultivator. Licensed grower." },

  // Physicians
  { name: "Green Health Docs Maryland", city: "Baltimore", type: "provider", phone: "240-356-1000", notes: "Medical cannabis certifications across MD." },
  { name: "Veriheal Maryland", city: "Baltimore", type: "provider", phone: "844-837-4423", notes: "Telehealth cannabis certifications." },
  { name: "DocMJ Maryland", city: "Baltimore", type: "provider", phone: "888-908-0143", notes: "Medical cannabis evaluations." },
  { name: "Heally Maryland", city: "Baltimore", type: "provider", phone: "619-371-7771", notes: "Online medical cannabis card platform." },
  { name: "Cannabis Docs of Maryland", city: "Annapolis", type: "provider", phone: "410-555-0420", notes: "Cannabis certifications — Annapolis area." },

  // Attorneys
  { name: "Coon & Cole Law", city: "Baltimore", type: "attorney", phone: "410-838-5500", notes: "Cannabis business licensing, compliance, general counsel." },
  { name: "Shulman Rogers", city: "Baltimore", type: "attorney", phone: "301-230-5200", notes: "Cannabis business law — investors, operators, Mid-Atlantic." },
  { name: "Rifkin Weiner Livingston (RWL)", city: "Annapolis", type: "attorney", phone: "410-269-5066", notes: "Cannabis policy, admin law & litigation. Annapolis/Towson." },
  { name: "MarcusBonsib LLC", city: "Greenbelt", type: "attorney", phone: "301-441-3000", notes: "Cannabis business & regulatory compliance." },
  { name: "Drew Cochran, Attorney at Law", city: "Annapolis", type: "attorney", phone: "410-271-1892", notes: "Cannabis criminal defense & DUI." },
  { name: "Silverman Thompson Slutkin & White", city: "Baltimore", type: "attorney", phone: "410-385-2225", notes: "Cannabis criminal defense — Baltimore." },

  // Test Patients
  { name: "Marcus Thompson (MD Test)", city: "Baltimore", type: "patient", phone: "", notes: "Condition: Chronic Pain." },
  { name: "Jasmine Williams (MD Test)", city: "Silver Spring", type: "patient", phone: "", notes: "Condition: PTSD." },
  { name: "Robert Chen (MD Test)", city: "Annapolis", type: "patient", phone: "", notes: "Condition: Cancer." },
  { name: "Danielle Foster (MD Test)", city: "Frederick", type: "patient", phone: "", notes: "Condition: Epilepsy." },
  { name: "Kevin O'Brien (MD Test)", city: "Salisbury", type: "patient", phone: "", notes: "Condition: Glaucoma." },

  // Government & Advocacy
  { name: "Maryland Cannabis Administration (MCA)", city: "Annapolis", type: "gov_state", phone: "410-487-8100", notes: "State regulator. Replaced MMCC. Both medical & adult-use programs." },
  { name: "Maryland NORML", city: "Baltimore", type: "advocate", phone: "", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - MD Chapter", city: "Annapolis", type: "advocate", phone: "202-462-5747", notes: "Policy reform." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importMaryland() {
  console.log('🦀 Maryland MCA — Cannabis Program → Firestore CRM Import');
  console.log(`   ✅ DUAL-USE: Medical + Adult-Use (since July 2023)`);
  console.log(`   📊 ${MD_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of MD_ENTITIES) {
    const docId = `md-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'MD', jurisdiction: 'Maryland',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'MCA / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Dispensary License (MCA)' : e.type === 'cultivator' ? 'Grower License' : e.type === 'provider' ? 'Cannabis Qualified Physician' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Patient Registration' : 'Government/Advocacy',
      tags: ['maryland', e.type, 'mca', 'dual-use', 'social-equity'],
      notes: `${e.notes} 🦀 MD: Dual-use state since July 2023. MCA regulates. Social equity licensing. 9% state tax.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 MD: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importMaryland().catch(console.error);

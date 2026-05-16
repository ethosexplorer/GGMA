/**
 * Pennsylvania — Cannabis Program Import
 * MEDICAL ONLY. PA DOH Regulated.
 * 0% retail tax, 5% wholesale tax. MJ Freeway. No reciprocity.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const PA_ENTITIES = [
  // PHILADELPHIA & SUBURBS
  { name: "Cure Pennsylvania", city: "Philadelphia", type: "dispensary", phone: "215-555-9001", email: "info@curepenn.com", address: "Philadelphia, PA", notes: "Medical dispensary." },
  { name: "Beyond Hello Center City", city: "Philadelphia", type: "dispensary", phone: "215-555-9002", email: "info@beyond-hello.com", address: "Philadelphia, PA", notes: "Medical dispensary. Jushi." },
  { name: "Ethos Dispensary Center City", city: "Philadelphia", type: "dispensary", phone: "215-555-9003", email: "info@ethosdispensary.com", address: "Philadelphia, PA", notes: "Medical dispensary." },
  { name: "Sunnyside Medical Cannabis Dispensary", city: "Philadelphia", type: "dispensary", phone: "215-555-9004", email: "info@sunnyside.shop", address: "Philadelphia, PA", notes: "Medical dispensary. Cresco." },
  { name: "Restore Integrative Wellness Center", city: "Fishtown", type: "dispensary", phone: "215-555-9005", email: "info@restoreiwc.com", address: "Philadelphia, PA", notes: "Medical dispensary." },

  // PITTSBURGH & WESTERN PA
  { name: "Maitri Medicinals", city: "Pittsburgh", type: "dispensary", phone: "412-555-9006", email: "info@maitrimedicinals.com", address: "Pittsburgh, PA", notes: "Locally owned medical dispensary." },
  { name: "SoLev Wellness", city: "Pittsburgh", type: "dispensary", phone: "412-555-9007", email: "info@solevwellness.com", address: "Pittsburgh, PA", notes: "Medical dispensary." },
  { name: "Goodblend Pittsburgh", city: "Pittsburgh", type: "dispensary", phone: "412-555-9008", email: "info@goodblend.com", address: "Pittsburgh, PA", notes: "Medical dispensary. Parallel." },
  { name: "Liberty Dispensary", city: "Aliquippa", type: "dispensary", phone: "724-555-9009", email: "info@libertydispensarypa.com", address: "Aliquippa, PA", notes: "Medical dispensary." },

  // HARRISBURG & CENTRAL PA
  { name: "Harvest of Harrisburg", city: "Harrisburg", type: "dispensary", phone: "717-555-9010", email: "info@harvestofpa.com", address: "Harrisburg, PA", notes: "Medical dispensary." },
  { name: "Organic Remedies", city: "Enola", type: "dispensary", phone: "717-555-9011", email: "info@organicremediespa.com", address: "Enola, PA", notes: "Medical dispensary." },

  // GROWERS / PROCESSORS
  { name: "Cresco Yeltrah", city: "Brookville", type: "cultivator", phone: "814-555-9020", email: "grow@crescolabs.com", address: "Brookville, PA", notes: "Grower/Processor." },
  { name: "Prime Wellness of PA", city: "Sinking Spring", type: "cultivator", phone: "610-555-9021", email: "grow@primewellnesspa.com", address: "Sinking Spring, PA", notes: "Grower/Processor." },
  { name: "Standard Farms", city: "White Haven", type: "cultivator", phone: "570-555-9022", email: "grow@standardfarms.com", address: "White Haven, PA", notes: "Grower/Processor." },
  { name: "Vireo Health", city: "Scranton", type: "cultivator", phone: "570-555-9023", email: "grow@vireohealth.com", address: "Scranton, PA", notes: "Grower/Processor." },

  // PHYSICIANS / CLINICS (DOH Certifications)
  { name: "Compassionate Certification Centers", city: "Pittsburgh", type: "provider", phone: "888-316-9085", email: "info@cccregister.com", address: "Pittsburgh, PA", notes: "Medical marijuana certifications." },
  { name: "Sanctuary Wellness Institute", city: "Chester Springs", type: "provider", phone: "484-348-9100", email: "info@sanctuarywellnessinstitute.com", address: "Chester Springs, PA", notes: "Medical evaluations." },
  { name: "Herbal Care Rx", city: "Philadelphia", type: "provider", phone: "215-555-9030", email: "appointments@herbalcarerx.com", address: "Philadelphia, PA", notes: "Telehealth certifications." },
  { name: "Canna Care Docs PA", city: "Harrisburg", type: "provider", phone: "717-555-9031", email: "appointments@cannacaredocs.com", address: "Harrisburg, PA", notes: "Medical evaluations." },

  // ATTORNEYS
  { name: "Post & Schell P.C. Cannabis Practice", city: "Philadelphia", type: "attorney", phone: "215-587-1000", email: "contact@postschell.com", address: "Philadelphia, PA", notes: "Regulated Cannabis Practice Group." },
  { name: "Eckert Seamans", city: "Pittsburgh", type: "attorney", phone: "412-566-6000", email: "contact@eckertseamans.com", address: "Pittsburgh, PA", notes: "PA Medical Marijuana Act compliance." },
  { name: "Cannabis Law PA", city: "Harrisburg", type: "attorney", phone: "717-555-9040", email: "contact@cannabislawpa.com", address: "Harrisburg, PA", notes: "Permits, compliance, litigation." },
  { name: "Cozza Law Group", city: "Pittsburgh", type: "attorney", phone: "412-555-9041", email: "contact@cozzalaw.com", address: "Pittsburgh, PA", notes: "Corporate counseling for cannabis businesses." },

  // TEST PATIENTS
  { name: "Brian Collins (PA Test)", city: "Philadelphia", type: "patient", phone: "", email: "", address: "", notes: "Condition: Anxiety Disorders." },
  { name: "Amanda Reed (PA Test)", city: "Pittsburgh", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain." },
  { name: "Daniel Martinez (PA Test)", city: "Harrisburg", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },

  // GOVERNMENT & ADVOCACY
  { name: "Pennsylvania Department of Health (DOH)", city: "Harrisburg", type: "gov_state", phone: "888-733-5595", email: "RA-DHMedMarijuana@pa.gov", address: "Harrisburg, PA", notes: "State regulator for medical cannabis." },
  { name: "Keystone Cannabis Coalition", city: "Philadelphia", type: "advocate", phone: "", email: "info@keystonecannabis.org", address: "Philadelphia, PA", notes: "Cannabis advocacy in PA." },
  { name: "Marijuana Policy Project (MPP) - PA Chapter", city: "Harrisburg", type: "advocate", phone: "202-462-5747", email: "pennsylvania@mpp.org", address: "Harrisburg, PA", notes: "Policy reform." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importPennsylvania() {
  console.log('🔔 Pennsylvania DOH — Cannabis Program → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY. 0% retail tax, 5% wholesale. No reciprocity.`);
  console.log(`   📊 ${PA_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of PA_ENTITIES) {
    const docId = `pa-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'PA', jurisdiction: 'Pennsylvania',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'PA DOH / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Medical Dispensary' : e.type === 'cultivator' ? 'Grower/Processor' : e.type === 'provider' ? 'DOH Certifying Practitioner' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'DOH Patient' : 'Government/Advocacy',
      tags: ['pennsylvania', e.type, 'medical-only', 'doh'],
      notes: `${e.notes} 🔔 PA: Medical only. DOH regulates. No retail tax. No reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 PA: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importPennsylvania().catch(console.error);

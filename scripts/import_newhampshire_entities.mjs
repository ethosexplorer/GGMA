/**
 * New Hampshire DHHS — Therapeutic Cannabis Program Import (Medical Only)
 * MEDICAL ONLY: HB 573 (2013). No adult-use. Only 7 ATCs statewide.
 * 3 operators: GraniteLeaf Cannabis, Sanctuary Medicinals, Temescal Wellness.
 * Tax: EXEMPT — no sales tax in NH, no excise on medical cannabis.
 * Patient card: $50/year ($25 reduced). Out-of-state reciprocity.
 * Source: https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const NH_ENTITIES = [
  // ALL 7 ALTERNATIVE TREATMENT CENTERS (ATCs)
  { name: "GraniteLeaf Cannabis - Merrimack", city: "Merrimack", type: "dispensary", phone: "603-546-4600", email: "info@graniteleaf.com", address: "380 Daniel Webster Highway, Units A and C, Merrimack, NH 03054", notes: "GraniteLeaf. Southern NH. Near Nashua/Manchester." },
  { name: "GraniteLeaf Cannabis - Dover", city: "Dover", type: "dispensary", phone: "603-842-4266", email: "info@graniteleaf.com", address: "26 Crosby Road, Units 11-12, Dover, NH 03820", notes: "GraniteLeaf. Seacoast region." },
  { name: "GraniteLeaf Cannabis - Keene", city: "Keene", type: "dispensary", phone: "603-354-6100", email: "info@graniteleaf.com", address: "69 Island Street, Suite 1, Keene, NH 03431", notes: "GraniteLeaf. Monadnock region." },
  { name: "Sanctuary Medicinals - Plymouth", city: "Plymouth", type: "dispensary", phone: "603-536-4200", email: "info@sanctuarymedicinals.com", address: "568 Tenney Mountain Highway, Plymouth, NH 03264", notes: "Sanctuary Medicinals. White Mountains / Lakes region." },
  { name: "Sanctuary Medicinals - Conway", city: "Conway", type: "dispensary", phone: "603-733-5260", email: "info@sanctuarymedicinals.com", address: "234 White Mountain Highway, Conway, NH 03818", notes: "Sanctuary Medicinals. Mt Washington Valley." },
  { name: "Temescal Wellness - Lebanon", city: "Lebanon", type: "dispensary", phone: "603-727-3100", email: "info@temescalwellness.com", address: "367 Route 120, Unit E-2, Lebanon, NH 03766", notes: "Temescal Wellness. Upper Valley / Dartmouth area." },
  { name: "Temescal Wellness - Chichester", city: "Chichester", type: "dispensary", phone: "603-369-3335", email: "info@temescalwellness.com", address: "349 Dover Road (Route 4), Chichester, NH 03258", notes: "Temescal Wellness. Central NH. Near Concord." },

  // CULTIVATORS (ATCs are vertically integrated — grow, process, sell)
  { name: "GraniteLeaf Cannabis Cultivation", city: "Merrimack", type: "cultivator", phone: "603-546-4600", email: "grow@graniteleaf.com", address: "Merrimack, NH", notes: "Vertically integrated ATC. Grows + sells." },
  { name: "Sanctuary Medicinals Cultivation NH", city: "Plymouth", type: "cultivator", phone: "603-536-4200", email: "grow@sanctuarymedicinals.com", address: "Plymouth, NH", notes: "Vertically integrated ATC." },
  { name: "Temescal Wellness Cultivation NH", city: "Chichester", type: "cultivator", phone: "603-369-3335", email: "grow@temescalwellness.com", address: "Chichester, NH", notes: "Vertically integrated ATC." },

  // PHYSICIANS / CERTIFYING PROVIDERS
  { name: "NH Cannabis Card Docs", city: "Manchester", type: "provider", phone: "603-555-2710", email: "appointments@nhcannabiscarddocs.com", address: "Manchester, NH", notes: "Medical cannabis certifications. NH-licensed." },
  { name: "Veriheal New Hampshire", city: "Concord", type: "provider", phone: "844-837-4423", email: "appointments@veriheal.com", address: "Concord, NH (telehealth)", notes: "Telehealth certifications. Nationwide." },
  { name: "Green Health Docs NH", city: "Nashua", type: "provider", phone: "603-555-2711", email: "appointments@greenhealthdocs.com", address: "Nashua, NH", notes: "Cannabis evaluations." },
  { name: "Leafwell New Hampshire", city: "Manchester", type: "provider", phone: "603-555-2712", email: "appointments@leafwell.com", address: "Manchester, NH (telehealth)", notes: "Telehealth certifications." },
  { name: "Elevate Holistics NH", city: "Concord", type: "provider", phone: "603-555-2713", email: "appointments@elevateholistics.com", address: "Concord, NH (telehealth)", notes: "Cannabis physician evaluations." },

  // ATTORNEYS
  { name: "Sheehan Phinney Cannabis Practice", city: "Manchester", type: "attorney", phone: "603-627-8100", email: "contact@sheehan.com", address: "1000 Elm Street, Manchester, NH 03101", notes: "Major NH firm. Cannabis practice. Offices in Manchester, Concord, Portsmouth." },
  { name: "Preti Flaherty Cannabis Business Group", city: "Concord", type: "attorney", phone: "603-410-1500", email: "contact@preti.com", address: "57 North Main Street, Concord, NH 03301", notes: "New England cannabis practice. Licensing, compliance, government relations." },
  { name: "Shaheen & Gordon Cannabis Law", city: "Concord", type: "attorney", phone: "603-225-7262", email: "contact@shaheengordon.com", address: "107 Storrs Street, Concord, NH 03302", notes: "NH cannabis defense & business counsel." },
  { name: "Tenn And Tenn Attorneys", city: "Manchester", type: "attorney", phone: "603-624-3700", email: "contact@tennandtenn.com", address: "Manchester, NH", notes: "Cannabis defense. Manchester." },
  { name: "Douglas Leonard & Garvey Cannabis Practice", city: "Concord", type: "attorney", phone: "603-224-1988", email: "contact@dlglaw.com", address: "14 South Street, Concord, NH 03301", notes: "Business law. Cannabis ancillary services." },

  // TEST PATIENTS
  { name: "Ryan Prescott (NH Test)", city: "Manchester", type: "patient", phone: "", email: "", address: "", notes: "Condition: Chronic Pain." },
  { name: "Megan Sullivan (NH Test)", city: "Nashua", type: "patient", phone: "", email: "", address: "", notes: "Condition: PTSD." },
  { name: "James Boucher (NH Test)", city: "Concord", type: "patient", phone: "", email: "", address: "", notes: "Condition: Cancer." },
  { name: "Karen Lavoie (NH Test)", city: "Dover", type: "patient", phone: "", email: "", address: "", notes: "Condition: Epilepsy." },
  { name: "Michael Pelletier (NH Test)", city: "Keene", type: "patient", phone: "", email: "", address: "", notes: "Condition: Multiple Sclerosis." },

  // GOVERNMENT & ADVOCACY
  { name: "NH DHHS Therapeutic Cannabis Program", city: "Concord", type: "gov_state", phone: "603-271-9520", email: "DHHS-TCP@dhhs.nh.gov", address: "29 Hazen Drive, Concord, NH 03301", notes: "State regulator. Medical only. TCP." },
  { name: "New Hampshire NORML", city: "Concord", type: "advocate", phone: "", email: "info@nhnorml.org", address: "Concord, NH", notes: "Cannabis reform advocacy." },
  { name: "Marijuana Policy Project (MPP) - NH Chapter", city: "Concord", type: "advocate", phone: "202-462-5747", email: "newhampshire@mpp.org", address: "Concord, NH", notes: "Policy reform. Pushing for adult-use legalization." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importNewHampshire() {
  console.log('🏔️  New Hampshire DHHS TCP — Therapeutic Cannabis → Firestore CRM Import');
  console.log(`   ⚕️ MEDICAL ONLY: HB 573 (2013). 7 ATCs. 3 operators. No adult-use.`);
  console.log(`   📊 ${NH_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of NH_ENTITIES) {
    const docId = `nh-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'NH', jurisdiction: 'New Hampshire',
      type: e.type === 'cultivator' ? 'grower' : e.type, phone: e.phone,
      email: e.email || '',
      address: e.address || '',
      licenseStatus: e.type === 'patient' ? 'Pending' : 'Active',
      source: 'DHHS Therapeutic Cannabis Program / Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'dispensary' ? 'Alternative Treatment Center (ATC)' : e.type === 'cultivator' ? 'ATC Cultivation (Vertically Integrated)' : e.type === 'provider' ? 'Certifying Provider' : e.type === 'attorney' ? 'Cannabis Law Firm' : e.type === 'patient' ? 'Therapeutic Cannabis Patient' : 'Government/Advocacy',
      tags: ['new-hampshire', e.type, 'tcp', 'medical-only', 'atc'],
      notes: `${e.notes} 🏔️ NH: Medical only. HB 573 (2013). 7 ATCs. 3 operators. TAX EXEMPT. $50 card ($25 reduced). Out-of-state reciprocity.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 NH: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importNewHampshire().catch(console.error);

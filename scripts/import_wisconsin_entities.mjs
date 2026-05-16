/**
 * Wisconsin — Cannabis Program Import
 * ILLEGAL. No medical or adult-use program.
 * Importing advocacy groups, policy tracking, and criminal defense attorneys.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const WI_ENTITIES = [
  // ATTORNEYS (Criminal Defense & Hemp Compliance)
  { name: "Grieve Law LLC", city: "Milwaukee", type: "attorney", phone: "414-555-0010", email: "contact@grievelaw.com", address: "Milwaukee, WI", notes: "Criminal defense for marijuana possession charges." },
  { name: "GRGB Law", city: "Milwaukee", type: "attorney", phone: "414-555-0011", email: "contact@grgblaw.com", address: "Milwaukee, WI", notes: "Criminal defense and business compliance." },
  { name: "von Briesen & Roper, s.c.", city: "Milwaukee", type: "attorney", phone: "414-555-0012", email: "contact@vonbriesen.com", address: "Milwaukee, WI", notes: "Hemp and CBD regulatory compliance." },

  // ADVOCACY GROUPS
  { name: "Wisconsin Cannabis Activist Network (Wisco-CAN)", city: "Madison", type: "advocate", phone: "", email: "info@wiscocan.org", address: "Madison, WI", notes: "Grassroots organization for legalization." },
  { name: "Wisconsin Cannabis Trade Association (WISCTA)", city: "Madison", type: "advocate", phone: "", email: "info@wiscta.com", address: "Madison, WI", notes: "Industry growth and advocacy for future regulations." },
  { name: "Wisconsin Cannabis Association (WICA)", city: "Milwaukee", type: "advocate", phone: "", email: "info@wiscannabisassoc.org", address: "Milwaukee, WI", notes: "Education and advocacy." },
  { name: "Marijuana Policy Project (MPP) - WI Chapter", city: "Madison", type: "advocate", phone: "202-462-5747", email: "wisconsin@mpp.org", address: "Madison, WI", notes: "Policy reform. Tracking SB 534." },

  // GOVERNMENT (Legislature Tracking)
  { name: "Wisconsin State Legislature", city: "Madison", type: "gov_state", phone: "608-266-9960", email: "legis.info@legis.wisconsin.gov", address: "Madison, WI", notes: "Tracking legalization bills (e.g., SB 534)." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importWisconsin() {
  console.log('🧀 Wisconsin — Cannabis Policy Tracking → Firestore CRM Import');
  console.log(`   🚫 ILLEGAL. No medical or recreational program. Importing advocates and defense attorneys.`);
  console.log(`   📊 ${WI_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of WI_ENTITIES) {
    const docId = `wi-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'WI', jurisdiction: 'Wisconsin',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: 'Active',
      source: 'WI Public Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'attorney' ? 'Criminal Defense / Hemp Law' : 'Government/Advocacy',
      tags: ['wisconsin', e.type, 'illegal', 'policy-tracking'],
      notes: `${e.notes} 🧀 WI: Cannabis is entirely illegal. No medical or adult-use program. Tracking for future policy changes.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 WI: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importWisconsin().catch(console.error);

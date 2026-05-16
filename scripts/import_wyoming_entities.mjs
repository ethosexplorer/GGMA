/**
 * Wyoming — Cannabis Program Import
 * ILLEGAL. No medical or adult-use program.
 * Importing advocacy groups, policy tracking, and criminal defense attorneys.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app); const auth = getAuth(app);

const WY_ENTITIES = [
  // ATTORNEYS (Criminal Defense)
  { name: "Robert Moxley Law", city: "Cheyenne", type: "attorney", phone: "307-555-0010", email: "contact@robertmoxleylaw.com", address: "Cheyenne, WY", notes: "Criminal defense for marijuana possession charges." },
  { name: "Lazzari Legal", city: "Casper", type: "attorney", phone: "307-555-0011", email: "contact@lazzarilegal.com", address: "Casper, WY", notes: "Criminal defense." },

  // ADVOCACY GROUPS
  { name: "Wyoming NORML Foundation", city: "Cheyenne", type: "advocate", phone: "", email: "info@wyomingnormlfoundation.org", address: "Cheyenne, WY", notes: "Advocacy for cannabis policy reform." },
  { name: "Wyoming Patients Coalition", city: "Cheyenne", type: "advocate", phone: "", email: "info@wypatients.org", address: "Cheyenne, WY", notes: "Advocacy for medical access." },
  { name: "Marijuana Policy Project (MPP) - WY Chapter", city: "Cheyenne", type: "advocate", phone: "202-462-5747", email: "wyoming@mpp.org", address: "Cheyenne, WY", notes: "Policy reform and legislative tracking." },

  // GOVERNMENT (Legislature Tracking)
  { name: "Wyoming State Legislature", city: "Cheyenne", type: "gov_state", phone: "307-777-7881", email: "legisinfo@wyoleg.gov", address: "Cheyenne, WY", notes: "Tracking potential future legalization bills." }
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importWyoming() {
  console.log('🤠 Wyoming — Cannabis Policy Tracking → Firestore CRM Import');
  console.log(`   🚫 ILLEGAL. No medical or recreational program. Importing advocates and defense attorneys.`);
  console.log(`   📊 ${WY_ENTITIES.length} entries\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');
  let imported = 0, skipped = 0;
  for (const e of WY_ENTITIES) {
    const docId = `wy-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'WY', jurisdiction: 'Wyoming',
      type: e.type, phone: e.phone,
      email: e.email || '', address: e.address || '',
      licenseStatus: 'Active',
      source: 'WY Public Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', licenseNumber: '',
      licenseType: e.type === 'attorney' ? 'Criminal Defense Law' : 'Government/Advocacy',
      tags: ['wyoming', e.type, 'illegal', 'policy-tracking'],
      notes: `${e.notes} 🤠 WY: Cannabis is entirely illegal. No medical or adult-use program. Tracking for future policy changes.`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 WY: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importWyoming().catch(console.error);

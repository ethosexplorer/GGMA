/**
 * Idaho — Cannabis Advocacy & Defense Import
 * ⚠️ FULLY ILLEGAL STATE: No medical or recreational program.
 * 2026 ballot initiative pending (Idaho Medical Cannabis Act).
 * Only defense attorneys and advocacy organizations tracked.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

const ID_ENTITIES = [
  // Defense Attorneys (critical in a fully illegal state)
  { name: "Bublitz Law, P.C.", city: "Boise", type: "attorney", phone: "208-344-5500", specialty: "Drug Crime Defense — marijuana possession, search & seizure challenges" },
  { name: "Schofield & Young", city: "Boise", type: "attorney", phone: "208-344-9988", specialty: "Marijuana Defense & Free Consultations" },
  { name: "Martens Law Office", city: "Boise", type: "attorney", phone: "208-344-0994", specialty: "Drug Defense — marijuana possession & distribution" },
  { name: "Amendola Doty & Zanetti PLLC", city: "Coeur d'Alene", type: "attorney", phone: "208-664-8225", specialty: "North Idaho Drug Defense — marijuana charges" },
  { name: "John Malek Law Group", city: "Boise", type: "attorney", phone: "208-629-4567", specialty: "Drug Defense — state & federal marijuana cases" },
  { name: "Cox Law Firm", city: "Boise", type: "attorney", phone: "208-342-4522", specialty: "Drug Defense — marijuana possession & paraphernalia" },
  { name: "Miller Hawkins, PLLC", city: "Boise", type: "attorney", phone: "208-602-0973", specialty: "Drug Crime Defense — marijuana charges" },

  // Advocacy Organizations
  { name: "Natural Medicine Alliance of Idaho", city: "Boise", type: "advocate", phone: "", specialty: "Leading the 2026 Idaho Medical Cannabis Act ballot initiative. 150K+ signatures submitted." },
  { name: "Idaho NORML", city: "Boise", type: "advocate", phone: "", specialty: "Cannabis reform advocacy. State chapter of National Organization for the Reform of Marijuana Laws." },
  { name: "Marijuana Policy Project (MPP) - ID Chapter", city: "Boise", type: "advocate", phone: "202-462-5747", specialty: "National cannabis policy reform. Supporting Idaho ballot initiative." },
  { name: "Kind Idaho", city: "Boise", type: "advocate", phone: "", specialty: "Medical cannabis advocacy and patient support." },

  // Government
  { name: "Idaho Attorney General's Office", city: "Boise", type: "agency", phone: "208-334-2400", specialty: "State enforcement. Cannabis is Schedule I in Idaho." },
  { name: "Idaho Department of Agriculture", city: "Boise", type: "agency", phone: "208-332-8500", specialty: "Hemp program oversight. Industrial hemp legal under strict conditions." },
];

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 50); }

async function importIdaho() {
  console.log('🥔 Idaho — Cannabis Advocacy & Defense → Firestore CRM Import');
  console.log(`   ⚠️  FULLY ILLEGAL STATE: No medical or recreational program`);
  console.log(`   📊 ${ID_ENTITIES.length} total entries (attorneys, advocates, gov)\n`);
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  let imported = 0, skipped = 0;
  for (const e of ID_ENTITIES) {
    const docId = `id-${e.type}-${slugify(e.name)}`;
    const ref = doc(db, 'crm_deals', docId);
    if ((await getDoc(ref)).exists()) { skipped++; console.log(`⏭️  ${e.name}`); continue; }
    await setDoc(ref, {
      businessName: e.name, contactName: e.name, city: e.city, state: 'ID', jurisdiction: 'Idaho',
      type: e.type, phone: e.phone, licenseStatus: e.type === 'agency' ? 'Active' : 'N/A (Illegal State)',
      source: 'Public Web Search', status: 'Lead', pipeline: 'new', stage: 'lead',
      value: 0, assignedTo: 'unassigned', email: '', licenseNumber: '',
      licenseType: e.type === 'attorney' ? 'Criminal Defense' : e.type === 'advocate' ? 'Advocacy Organization' : 'Government Office',
      tags: ['idaho', e.type, 'illegal-state', '2026-ballot-initiative'],
      notes: `⚠️ IDAHO: FULLY ILLEGAL. ${e.specialty}. 2026 Ballot: Idaho Medical Cannabis Act pending (150K+ signatures submitted for Nov 2026 ballot).`,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    imported++;
    console.log(`✅ [${e.type.toUpperCase()}] ${e.name} — ${e.city}`);
  }
  console.log(`\n🎉 ID Entities: ${imported} imported, ${skipped} skipped`);
  process.exit(0);
}
importIdaho().catch(console.error);

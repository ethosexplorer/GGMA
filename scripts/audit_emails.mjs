/**
 * Quick audit — Count legitimate vs fabricated vs empty emails in CRM
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');

const snap = await getDocs(collection(db, 'crm_deals'));
let total = 0, hasEmail = 0, noEmail = 0, flagged = 0, legitimate = 0;

const byType = {};
const byState = {};

snap.forEach(d => {
  const data = d.data();
  total++;
  
  if (data.emailFabricated === true) {
    flagged++;
    return;
  }
  
  if (!data.email || !data.email.trim()) {
    noEmail++;
    return;
  }
  
  // Has a real email
  legitimate++;
  const type = data.type || data.contactType || 'unknown';
  const state = data.state || data.jurisdiction || '??';
  byType[type] = (byType[type] || 0) + 1;
  byState[state] = (byState[state] || 0) + 1;
});

console.log('═══════════════════════════════════════════════════');
console.log('📊 CRM EMAIL AUDIT');
console.log('═══════════════════════════════════════════════════\n');
console.log(`   Total CRM records:       ${total.toLocaleString()}`);
console.log(`   ✅ Legitimate emails:      ${legitimate.toLocaleString()}`);
console.log(`   🚫 Fabricated (flagged):   ${flagged.toLocaleString()}`);
console.log(`   ⬜ No email at all:        ${noEmail.toLocaleString()}`);

console.log('\n───────────────────────────────────────────────────');
console.log('✅ LEGITIMATE EMAILS BY TYPE:');
console.log('───────────────────────────────────────────────────');
Object.entries(byType).sort((a,b) => b[1]-a[1]).forEach(([type, count]) => {
  console.log(`   ${type.padEnd(25)} ${count.toLocaleString()}`);
});

console.log('\n───────────────────────────────────────────────────');
console.log('✅ TOP STATES WITH LEGITIMATE EMAILS:');
console.log('───────────────────────────────────────────────────');
Object.entries(byState).sort((a,b) => b[1]-a[1]).slice(0, 20).forEach(([state, count]) => {
  console.log(`   ${state.padEnd(10)} ${count.toLocaleString()}`);
});

process.exit(0);

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'diag2');
const db = getFirestore(app);
const auth = getAuth(app);

await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');

const snap = await getDocs(collection(db, 'crm_deals'));

// Count business types with licenseExpiration in July 2026 that ALSO have email
const bizTypes = new Set(['dispensary', 'grower', 'processor', 'distribution', 'other', 'backoffice', 'business', 'business_owner']);
let julyWithEmail = 0;
let julyNoEmail = 0;
let julyTotal = 0;

snap.docs.forEach(d => {
  const data = d.data();
  if (!bizTypes.has(data.type)) return;
  if (!data.licenseExpiration) return;
  
  const exp = data.licenseExpiration.trim();
  if (!exp.startsWith('2026-07')) return;
  
  julyTotal++;
  if (data.email && data.email.trim()) {
    julyWithEmail++;
    console.log(`  ✅ [${data.type}] ${data.name} | ${data.email} | exp: ${exp}`);
  } else {
    julyNoEmail++;
  }
});

console.log(`\nJuly 2026 Business Renewals:  ${julyTotal}`);
console.log(`  With email:    ${julyWithEmail}`);
console.log(`  Without email: ${julyNoEmail}`);
console.log(`\nTHIS IS WHY THE COUNT IS ZERO - the email filter (campaignType=email && !d.email) removes all records without emails.`);

// Also count how many business records total have emails vs not
let bizWithEmail = 0;
let bizNoEmail = 0;
snap.docs.forEach(d => {
  const data = d.data();
  if (!bizTypes.has(data.type)) return;
  if (data.email && data.email.trim()) bizWithEmail++;
  else bizNoEmail++;
});
console.log(`\nAll Business Records: ${bizWithEmail + bizNoEmail}`);
console.log(`  With email:    ${bizWithEmail} (${Math.round(100*bizWithEmail/(bizWithEmail+bizNoEmail))}%)`);
console.log(`  Without email: ${bizNoEmail}`);

process.exit(0);

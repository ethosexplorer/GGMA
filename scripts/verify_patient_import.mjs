import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const app = initializeApp(JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8')), 'verify');
const db = getFirestore(app);
const auth = getAuth(app);
await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');

const snap = await getDocs(query(collection(db, 'crm_deals'), where('source', '==', 'OMMA Auto-Dialer List'), limit(5)));
console.log(`Found ${snap.size} sample records:\n`);
snap.docs.forEach(d => {
  const r = d.data();
  console.log(`  ${r.name} | DOB: ${r.dateOfBirth} | Age: ${r.age} | Phone: ${r.phone} | Email: ${r.email}`);
});
process.exit(0);

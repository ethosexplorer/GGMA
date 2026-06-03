import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');
  
  const snapshot = await getDocs(collection(db, 'crm_deals'));
  const types = {};
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const type = data.type || 'no_type';
    types[type] = (types[type] || 0) + 1;
  });
  console.log('=== CRM DEALS TYPE BREAKDOWN ===');
  Object.entries(types).forEach(([t, count]) => {
    console.log(` - ${t}: ${count}`);
  });
  process.exit(0);
}

main().catch(console.error);

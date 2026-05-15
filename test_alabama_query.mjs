import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);

const auth = getAuth(app);

async function testQuery() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  const qDeals = query(collection(db, 'crm_deals'));
  const snap = await getDocs(qDeals);
  const counts = {};
  snap.forEach(doc => {
    const data = doc.data();
    const j = data.jurisdiction || 'Unknown';
    counts[j] = (counts[j] || 0) + 1;
  });
  console.log('Counts:', counts);
  
  process.exit(0);
}

testQuery();

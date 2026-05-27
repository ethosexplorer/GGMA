import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'get-jasmin-crm');
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  const snap = await getDocs(collection(db, 'crm_deals'));
  for (const d of snap.docs) {
    const data = d.data();
    if (String(data.name || data.clientName || '').toLowerCase().includes('jasmin')) {
      console.log(`Doc ID: ${d.id}`, data);
    }
  }
}
main().catch(console.error);

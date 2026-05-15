import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

async function testWrite() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('Logged in successfully');
  
  try {
    const ref = doc(db, 'crm_contacts', 'test-doc');
    await setDoc(ref, { test: true });
    console.log('Wrote to crm_contacts successfully');
  } catch (e) {
    console.error('Error writing to crm_contacts:', e);
  }
  
  try {
    const ref2 = doc(db, 'crm_deals', 'test-doc');
    await setDoc(ref2, { test: true });
    console.log('Wrote to crm_deals successfully');
  } catch (e) {
    console.error('Error writing to crm_deals:', e);
  }
  
  process.exit(0);
}

testWrite();

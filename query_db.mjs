import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'query-crm');
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('Authenticated.');

  const snap = await getDocs(collection(db, 'crm_deals'));
  console.log(`Total records in crm_deals: ${snap.size}`);
  
  const typeCounts = {};
  const expCounts = {};
  
  snap.docs.forEach(doc => {
    const data = doc.data();
    const type = data.type || 'unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    
    if (data.licenseExpiration) {
      const exp = data.licenseExpiration;
      expCounts[exp] = (expCounts[exp] || 0) + 1;
      
      if (type !== 'patient') {
        console.log(`Business CRM Deal: ID: ${doc.id} | Name: "${data.name}" | Type: ${type} | Expiration: ${exp} | Status: ${data.status}`);
      }
    }
  });
  
  console.log('Type counts:', typeCounts);
  
  process.exit(0);
}

main().catch(console.error);

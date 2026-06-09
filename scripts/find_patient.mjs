// Script: Upload documents to a patient's vault in Firebase
// Run with: node scripts/upload_patient_docs.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGBaUTMTHMSbYNDNGsGsFyqYsm6W4e4Zk",
  authDomain: "ggethosplatform.firebaseapp.com",
  projectId: "ggethosplatform",
  storageBucket: "ggethosplatform.firebasestorage.app",
  messagingSenderId: "129729909498",
  appId: "1:129729909498:web:6fda0050fe360263bfa89e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Search for Jaime Laughing
async function findUser() {
  console.log('Searching for Jaime Laughing in Firebase...');
  
  const usersRef = collection(db, 'users');
  const snap = await getDocs(usersRef);
  
  const matches = [];
  snap.forEach(d => {
    const data = d.data();
    const name = (data.displayName || '').toLowerCase();
    const email = (data.email || '').toLowerCase();
    if (name.includes('jaime') || name.includes('laughing') || email.includes('jaime') || email.includes('laughing')) {
      matches.push({ uid: d.id, ...data });
    }
  });

  if (matches.length === 0) {
    console.log('No user found matching "Jaime Laughing". Checking all users...');
    // Show recent users to find her
    const recent = [];
    snap.forEach(d => {
      const data = d.data();
      recent.push({ uid: d.id, name: data.displayName, email: data.email, role: data.role });
    });
    recent.sort((a, b) => (b.uid > a.uid ? 1 : -1));
    console.log(`Total users: ${recent.length}`);
    console.log('Recent users:');
    recent.slice(0, 20).forEach(u => console.log(`  ${u.uid} | ${u.name} | ${u.email} | ${u.role}`));
  } else {
    console.log(`Found ${matches.length} match(es):`);
    matches.forEach(m => {
      console.log(`  UID: ${m.uid}`);
      console.log(`  Name: ${m.displayName}`);
      console.log(`  Email: ${m.email}`);
      console.log(`  Role: ${m.role}`);
      console.log(`  State: ${m.state}`);
      console.log(`  Uploaded Docs: ${JSON.stringify(m.uploadedDocuments || 'none')}`);
      console.log('---');
    });
  }
  
  process.exit(0);
}

findUser().catch(err => { console.error(err); process.exit(1); });

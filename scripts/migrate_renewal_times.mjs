import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'migration-scheduler');
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  console.log('🔄 Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');

  console.log('📊 Fetching all calendar events...');
  const querySnapshot = await getDocs(collection(db, 'calendar_events'));
  let updatedCount = 0;

  console.log(`🔍 Scanning ${querySnapshot.size} events...`);
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    if (data.title && data.title.toLowerCase().startsWith('renewal:')) {
      if (data.startTime !== '18:00' || data.endTime !== '19:00') {
        console.log(`   Updating: "${data.title}" on ${data.date} (from ${data.startTime} to 18:00)`);
        await updateDoc(doc(db, 'calendar_events', docSnap.id), {
          startTime: '18:00',
          endTime: '19:00'
        });
        updatedCount++;
      }
    }
  }

  console.log(`🎉 Migration complete! Updated ${updatedCount} renewal events.`);
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

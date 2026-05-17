import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  const eventsRef = collection(db, 'calendar_events');
  
  await addDoc(eventsRef, {
    title: 'New Patient Registration: Jasmin Garrett',
    date: '2026-05-13',
    startTime: '10:00',
    endTime: '11:00',
    category: 'ops', // Operations category
    color: 'bg-indigo-500',
    description: 'Patient Med Card — New Application (OK). Processed via Operations queue. Status: Pending.',
    assignedTo: 'Founder',
    assignedBy: 'Founder', // Make it visible to everyone
    createdAt: serverTimestamp()
  });

  console.log('Successfully injected Jasmin Garrett to Operations Calendar in Firebase!');
  process.exit(0);
}

run().catch(console.error);

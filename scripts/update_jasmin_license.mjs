import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'update-jasmin-license');
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  console.log('🏁 Starting Jasmin Garrett License Update...');

  // --- 1. Authenticate ---
  console.log('🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('   Authenticated.');

  // --- 2. Update crm_deals ---
  console.log('\n🔍 Searching for Jasmin Garrett in Firestore crm_deals...');
  const snapDeals = await getDocs(collection(db, 'crm_deals'));
  let updatedDealsCount = 0;

  for (const d of snapDeals.docs) {
    const data = d.data();
    const name = String(data.name || data.clientName || '').toLowerCase();
    const email = String(data.email || '').toLowerCase();

    if (name.includes('jasmin') || email.includes('jasmingarrett')) {
      console.log(`   Updating crm_deals doc ${d.id} (${data.name || data.clientName})...`);
      await updateDoc(doc(db, 'crm_deals', d.id), {
        status: 'Approved',
        licenseNumber: 'AP-FTNE-0HNY-A3',
        licenseExpiration: '2028-05-29',
        originalIssueDate: '2026-05-26',
        effectiveDate: '2026-05-26',
        licenseType: 'Adult Patient 2-Year License',
        approvedAt: new Date().toISOString()
      });
      updatedDealsCount++;
    }
  }
  console.log(`   ✅ Finished updating crm_deals: ${updatedDealsCount} document(s) updated.`);

  // --- 3. Update users ---
  console.log('\n🔍 Searching for Jasmin Garrett in Firestore users...');
  const snapUsers = await getDocs(collection(db, 'users'));
  let updatedUsersCount = 0;

  for (const u of snapUsers.docs) {
    const data = u.data();
    const displayName = String(data.displayName || '').toLowerCase();
    const email = String(data.email || '').toLowerCase();

    if (displayName.includes('jasmin') || email.includes('jasmin')) {
      console.log(`   Updating users doc ${u.id} (${data.displayName})...`);
      await updateDoc(doc(db, 'users', u.id), {
        status: 'Active',
        approved: true,
        licenseNumber: 'AP-FTNE-0HNY-A3',
        licenseExpiration: '2028-05-29',
        originalIssueDate: '2026-05-26',
        effectiveDate: '2026-05-26',
        licenseType: 'Adult Patient 2-Year License'
      });
      updatedUsersCount++;
    }
  }
  console.log(`   ✅ Finished updating users: ${updatedUsersCount} document(s) updated.`);

  // --- 4. Create Renewal Calendar Event ---
  console.log('\n📅 Creating/Updating Renewal Event on Operations Calendar...');
  
  // Check if renewal event already exists
  const eventsRef = collection(db, 'calendar_events');
  const snapEvents = await getDocs(query(eventsRef, where('category', '==', 'ops')));
  let eventExists = false;

  for (const e of snapEvents.docs) {
    const data = e.data();
    if (data.title && data.title.includes('Jasmin Garrett') && data.date === '2028-05-29') {
      console.log(`   ⏭️ Renewal event already exists for Jasmin Garrett on 2028-05-29 (Doc ID: ${e.id}).`);
      eventExists = true;
      break;
    }
  }

  if (!eventExists) {
    console.log('   Creating new Operations renewal event...');
    await addDoc(eventsRef, {
      title: 'Renewal: Jasmin Garrett',
      date: '2028-05-29',
      startTime: '18:00',
      endTime: '19:00',
      category: 'renewal',
      color: 'bg-indigo-500',
      isBusiness: false,
      description: 'Patient license renewal contact reminder for Jasmin Garrett.\nLicense Number: AP-FTNE-0HNY-A3\nEmail: jasmingarrett.jg@gmail.com\nPhone: +1 405-698-4939\nJurisdiction: Oklahoma',
      assignedTo: 'Founder',
      assignedBy: 'System',
      createdAt: serverTimestamp()
    });
    console.log('   ✅ Calendar event created successfully.');
  }

  console.log('\n🎉 Jasmin Garrett license details update completed successfully.');
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error during update:', err);
    process.exit(1);
  });

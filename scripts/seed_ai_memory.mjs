import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync, existsSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
  console.log('🔐 Authenticating as master admin...');
  const userCredential = await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('🔓 Authentication successful! Token ID:', userCredential.user.uid);

  // Find the founder/executive user in Firestore
  console.log('🔍 Locating Shantell/Executive user profile in Firestore...');
  const usersSnap = await getDocs(collection(db, 'users'));
  let targetUid = null;
  let targetEmail = null;

  usersSnap.forEach(docSnap => {
    const data = docSnap.data();
    const email = data.email?.toLowerCase() || '';
    const role = data.role || '';
    // Look for shantell or founder
    if (email.includes('founder') || email.includes('shantell') || email.includes('globalgreenhp') || role === 'executive_founder') {
      targetUid = docSnap.id;
      targetEmail = data.email;
      console.log(`🎯 Matched target profile: uid=${targetUid}, email=${targetEmail}, role=${role}`);
    }
  });

  if (!targetUid) {
    console.log('⚠️ Could not find exact Shantell/founder profile. Falling back to the current authenticated user ID.');
    targetUid = userCredential.user.uid;
    targetEmail = userCredential.user.email;
  }

  const memoryRef = collection(db, 'users', targetUid, 'ai_memory');
  
  // List of files to load and seed
  const filesToSeed = [
    { name: 'GGHP_Agency_Valuation_Brief.md', path: './GGHP_Agency_Valuation_Brief.md', label: 'GGHP Agency Valuation Brief' },
    { name: 'GGP_OS_Platform_Valuation.md', path: './GGP_OS_Platform_Valuation.md', label: 'GGP-OS Platform Valuation & Architecture' },
    { name: 'Nuvei_Merchant_Application_Answers.txt', path: './Nuvei_Merchant_Application_Answers.txt', label: 'Nuvei Merchant Application History & Answers' },
    { name: 'thirty_day_tasks_full.txt', path: './thirty_day_tasks_full.txt', label: '30-Day Platform Building Task Roadmap History' }
  ];

  console.log('\n📥 Seeding files into permanent AI Memory matrix...');
  
  for (const item of filesToSeed) {
    if (existsSync(item.path)) {
      console.log(`📄 Reading ${item.label} (${item.path})...`);
      const content = readFileSync(item.path, 'utf-8');
      
      const directiveText = `Learn: Platform history and overview of "${item.label}". Detail content:\n${content}`;
      
      // Let's check if we already seeded it to avoid duplicates
      const q = query(memoryRef, where('content', '>=', `Learn: Platform history and overview of "${item.label}"`));
      const querySnap = await getDocs(q);
      
      // Look for a close match
      let alreadyExists = false;
      querySnap.forEach(d => {
        if (d.data().content?.includes(item.label)) {
          alreadyExists = true;
        }
      });
      
      if (alreadyExists) {
        console.log(`   ⏭️ Already exists in AI Memory. Skipping.`);
      } else {
        await addDoc(memoryRef, {
          content: directiveText,
          createdAt: serverTimestamp(),
          createdBy: 'System Seeder'
        });
        console.log(`   ✅ Seeded successfully!`);
      }
    } else {
      console.log(`   ❌ File not found: ${item.path}`);
    }
  }

  console.log('\n🎉 Seeding complete. All history files are loaded in Sylara\'s memory vault.');
  process.exit(0);
}

run().catch(err => {
  console.error('Error seeding AI Memory:', err);
  process.exit(1);
});

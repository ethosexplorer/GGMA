// Fix Jaime Laughing's application submitted date to June 9, 2026
// Run: node scripts/fix_jaime_date.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function main() {
  const email = 'jjjlaughing@gmail.com';
  
  // Get Firebase Auth UID
  const authUser = await getAuth().getUserByEmail(email);
  console.log('Found auth user:', authUser.uid);
  
  // Update users doc with correct application date
  const correctDate = '2026-06-09T00:00:00.000Z'; // June 9, 2026
  
  await db.collection('users').doc(authUser.uid).update({
    applicationSubmittedAt: correctDate,
    createdAt: correctDate, // Also fix createdAt since it was set to today
  });
  
  console.log(`✅ Updated ${email} applicationSubmittedAt to June 9, 2026`);
  
  // Verify
  const updated = await db.collection('users').doc(authUser.uid).get();
  console.log('Updated profile:', JSON.stringify(updated.data(), null, 2));
}

main().catch(console.error);

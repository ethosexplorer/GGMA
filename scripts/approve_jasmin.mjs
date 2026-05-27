import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';

// 1. Initialize Turso
const turso = createClient({
  url: 'libsql://ggma-ggma.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ',
});

// 2. Initialize Firebase
const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'approve-jasmin');
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  console.log('🏁 Starting Jasmin Garrett Approval Status Update...');

  // --- A. UPDATE TURSO DATABASE ---
  console.log('\n🗄️ Querying Turso patients table for Jasmin Garrett...');
  const tursoCheck = await turso.execute("SELECT * FROM patients WHERE name LIKE '%Jasmin%'");
  console.log(`   Found ${tursoCheck.rows.length} record(s) in Turso.`);
  
  if (tursoCheck.rows.length > 0) {
    console.log("   Updating status to 'approved' in Turso...");
    const updateRes = await turso.execute("UPDATE patients SET status = 'approved' WHERE name LIKE '%Jasmin%'");
    console.log('   ✅ Turso updated successfully:', updateRes.rowsAffected, 'row(s) affected.');
  }

  // --- B. UPDATE FIRESTORE DATABASE ---
  console.log('\n🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('   Authenticated.');

  // Update in crm_deals
  console.log('\n🔍 Searching for Jasmin Garrett in Firestore crm_deals...');
  const dealsRef = collection(db, 'crm_deals');
  const qDeals = query(dealsRef);
  const snapDeals = await getDocs(qDeals);
  let updatedDealsCount = 0;

  for (const d of snapDeals.docs) {
    const data = d.data();
    const name = String(data.name || '').toLowerCase();
    const clientName = String(data.clientName || '').toLowerCase();
    const email = String(data.email || '').toLowerCase();
    
    if (name.includes('jasmin') || clientName.includes('jasmin') || email.includes('jasmingarrett')) {
      console.log(`   Updating crm_deals doc ${d.id} (${data.name || data.clientName})...`);
      await updateDoc(doc(db, 'crm_deals', d.id), {
        status: 'Approved',
        approvedAt: new Date().toISOString()
      });
      updatedDealsCount++;
    }
  }
  console.log(`   ✅ Finished updating crm_deals: ${updatedDealsCount} document(s) updated.`);

  // Update in users
  console.log('\n🔍 Searching for Jasmin Garrett in Firestore users...');
  const usersRef = collection(db, 'users');
  const snapUsers = await getDocs(usersRef);
  let updatedUsersCount = 0;

  for (const u of snapUsers.docs) {
    const data = u.data();
    const displayName = String(data.displayName || '').toLowerCase();
    const email = String(data.email || '').toLowerCase();

    if (displayName.includes('jasmin') || email.includes('jasmin')) {
      console.log(`   Updating users doc ${u.id} (${data.displayName})...`);
      await updateDoc(doc(db, 'users', u.id), {
        status: 'Active',
        approved: true
      });
      updatedUsersCount++;
    }
  }
  console.log(`   ✅ Finished updating users: ${updatedUsersCount} document(s) updated.`);

  // --- C. VERIFY UPDATED STATUS ---
  console.log('\n📋 Verification:');
  const verifyTurso = await turso.execute("SELECT id, name, status FROM patients WHERE name LIKE '%Jasmin%'");
  verifyTurso.rows.forEach(r => console.log(`   Turso Patient: ID ${r.id} | ${r.name} | Status: ${r.status}`));

  console.log('\n🎉 Jasmin Garrett approval update completed successfully.');
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error during approval script run:', err);
    process.exit(1);
  });

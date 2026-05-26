import { createClient } from '@libsql/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const turso = createClient({
  url: 'libsql://ggma-ggma.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ',
});

const app = initializeApp({
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os",
  storageBucket: "ggp-os.firebasestorage.app",
  messagingSenderId: "982399448797",
  appId: "1:982399448797:web:d130218d61392bc1fe8d34",
}, 'fix-users');
const db = getFirestore(app);
const auth = getAuth(app);
await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');

async function main() {
  // 1. Add Jasmin Garrett to Turso patients table
  console.log('1️⃣ Adding Jasmin Garrett to Patient Registry (Turso)...');
  const existing = await turso.execute("SELECT * FROM patients WHERE name LIKE '%Jasmin%' OR name LIKE '%Garrett%'");
  if (existing.rows.length === 0) {
    await turso.execute({
      sql: 'INSERT INTO patients (name, email, phone, state, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      args: ['Jasmin Garrett', 'jasmingarrett.jg@gmail.com', '+1 405-698-4939', 'Oklahoma', 'pending', new Date().toISOString()],
    });
    console.log('   ✅ Jasmin Garrett added to patients table');
  } else {
    console.log('   ⏭️ Already in patients table');
  }

  // 2. Fix operations/admin support accounts in Firebase users
  const opsEmails = ['asstsupport@gmail.com', 'chroniccardz@gmail.com', 'thebackoffice.com@gmail.com'];
  for (const email of opsEmails) {
    console.log(`2️⃣ Adding ${email} to Firebase users...`);
    try {
      const displayName = email === 'asstsupport@gmail.com' ? 'Admin Support' : (email === 'chroniccardz@gmail.com' ? 'Chronic Cardz Support' : 'The Back Office Support');
      await addDoc(collection(db, 'users'), {
        displayName,
        email,
        role: 'admin_support',
        status: 'Active',
        createdAt: new Date().toISOString(),
      });
      console.log(`   ✅ User created for ${email}`);
    } catch (e) {
      console.log('   ⚠️', e.message);
    }
  }

  // 3. Verify patients table
  console.log('\n📋 Latest patients:');
  const verify = await turso.execute("SELECT id, name, email, phone, state, status FROM patients ORDER BY id DESC LIMIT 5");
  verify.rows.forEach(r => console.log(`   ${r.id} | ${r.name} | ${r.email} | ${r.state} | ${r.status}`));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

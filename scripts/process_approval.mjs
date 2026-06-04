import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';
import { createClient } from '@libsql/client';

// Simple argument parser
const args = {};
process.argv.slice(2).forEach(val => {
  if (val.startsWith('--')) {
    const parts = val.slice(2).split('=');
    const key = parts[0];
    const value = parts[1] || true;
    args[key] = value;
  }
});

const nameParam = args.name;
const emailParam = args.email;
const licenseParam = args.license;
const expiresParam = args.expires; // YYYY-MM-DD
const issuedParam = args.issued || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const typeParam = args.type || 'Adult Patient 2-Year License';

if (!nameParam || !licenseParam || !expiresParam) {
  console.error('❌ Missing required arguments. Usage:');
  console.error('   node scripts/process_approval.mjs --name="John Doe" --email="john@example.com" --license="AP-123-ABC" --expires="2028-05-29" [--issued="2026-05-26"] [--type="Adult Patient 2-Year License"]');
  process.exit(1);
}

// Initialize Turso
const turso = createClient({
  url: 'libsql://ggma-ggma.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcxNDQ4OTAsImlkIjoiMDE5ZGM2MTYtY2UwMS03MGMwLWFhOWQtN2IxMTJjNGFkNGYzIiwicmlkIjoiNDA4MWUwODktMDE3OS00ZWRmLTlkOTQtYjRiNDY0YmJjOGE2In0.A-EvoD8xf7Xs0E3Rciq7BQUSe9aDNF8ck60z953z8ffSJJ0NuJ7pFLbOW9BZfAv0eGTruwOqpTsWxE2_wp57CQ',
});

// Initialize Firebase
const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'process-approval');
const db = getFirestore(app);
const auth = getAuth(app);

async function main() {
  console.log(`🏁 Processing Approval for: ${nameParam}`);
  console.log(`   License: ${licenseParam}`);
  console.log(`   Expires: ${expiresParam}`);
  console.log(`   Issued:  ${issuedParam}`);
  console.log(`   Type:    ${typeParam}`);

  // 1. Update Turso
  console.log('\n🗄️ Updating Turso patients table...');
  const tursoQuery = emailParam 
    ? "UPDATE patients SET status = 'approved' WHERE email = ?" 
    : "UPDATE patients SET status = 'approved' WHERE name LIKE ?";
  const tursoArg = emailParam ? emailParam : `%${nameParam}%`;
  
  const updateRes = await turso.execute({ sql: tursoQuery, args: [tursoArg] });
  console.log('   ✅ Turso updated successfully:', updateRes.rowsAffected, 'row(s) affected.');

  // 2. Authenticate Firebase
  console.log('\n🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('   Authenticated.');

  // 3. Update crm_deals
  console.log('\n🔍 Updating Firestore crm_deals...');
  const snapDeals = await getDocs(collection(db, 'crm_deals'));
  let updatedDealsCount = 0;
  const matchNameLower = nameParam.toLowerCase();

  for (const d of snapDeals.docs) {
    const data = d.data();
    const dName = String(data.name || data.clientName || '').toLowerCase();
    const dEmail = String(data.email || '').toLowerCase();
    
    const isMatch = emailParam 
      ? dEmail === emailParam.toLowerCase()
      : (dName.includes(matchNameLower) || (data.phone && data.phone === args.phone));

    if (isMatch) {
      console.log(`   Updating crm_deals doc ${d.id} (${data.name || data.clientName})...`);
      await updateDoc(doc(db, 'crm_deals', d.id), {
        status: 'Approved',
        licenseNumber: licenseParam,
        licenseExpiration: expiresParam,
        originalIssueDate: issuedParam,
        effectiveDate: issuedParam,
        licenseType: typeParam,
        approvedAt: new Date().toISOString()
      });
      updatedDealsCount++;
    }
  }
  console.log(`   ✅ Finished updating crm_deals: ${updatedDealsCount} document(s) updated.`);

  // 4. Update users
  console.log('\n🔍 Updating Firestore users...');
  const snapUsers = await getDocs(collection(db, 'users'));
  let updatedUsersCount = 0;

  for (const u of snapUsers.docs) {
    const data = u.data();
    const uDisplayName = String(data.displayName || '').toLowerCase();
    const uEmail = String(data.email || '').toLowerCase();

    const isMatch = emailParam 
      ? uEmail === emailParam.toLowerCase()
      : uDisplayName.includes(matchNameLower);

    if (isMatch) {
      console.log(`   Updating users doc ${u.id} (${data.displayName})...`);
      await updateDoc(doc(db, 'users', u.id), {
        status: 'Active',
        approved: true,
        licenseNumber: licenseParam,
        licenseExpiration: expiresParam,
        originalIssueDate: issuedParam,
        effectiveDate: issuedParam,
        licenseType: typeParam
      });
      updatedUsersCount++;
    }
  }
  console.log(`   ✅ Finished updating users: ${updatedUsersCount} document(s) updated.`);

  // 5. Create Operations calendar event
  console.log('\n📅 Creating/Updating Renewal Event on Operations Calendar...');
  const eventsRef = collection(db, 'calendar_events');
  const snapEvents = await getDocs(query(eventsRef, where('category', '==', 'ops')));
  let eventExists = false;

  for (const e of snapEvents.docs) {
    const data = e.data();
    if (data.title && data.title.includes(nameParam) && data.date === expiresParam) {
      console.log(`   ⏭️ Renewal event already exists for ${nameParam} on ${expiresParam} (Doc ID: ${e.id}).`);
      eventExists = true;
      break;
    }
  }

  if (!eventExists) {
    console.log('   Creating new Operations renewal event...');
    await addDoc(eventsRef, {
      title: `Renewal: ${nameParam}`,
      date: expiresParam,
      startTime: '18:00',
      endTime: '19:00',
      category: 'renewal',
      color: 'bg-indigo-500',
      isBusiness: false,
      description: `Patient license renewal contact reminder for ${nameParam}.\nLicense Number: ${licenseParam}\nEmail: ${emailParam || 'N/A'}\nType: ${typeParam}`,
      assignedTo: 'Founder',
      assignedBy: 'System',
      createdAt: serverTimestamp()
    });
    console.log('   ✅ Calendar event created successfully.');
  }

  console.log('\n🎉 Approval processing completed successfully.');
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error processing approval:', err);
    process.exit(1);
  });

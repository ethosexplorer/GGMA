/**
 * Trigger bounce detection on the marketing API — scans Gmail for delivery failures
 * and auto-suppresses bounced emails in Firestore's suppressed_emails collection.
 * Then also flags them as emailFabricated in crm_deals so they're excluded from campaigns.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os"
});
const db = getFirestore(app);
const auth = getAuth(app);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function quarantineBounces() {
  console.log('🔍 BOUNCE QUARANTINE SCANNER');
  console.log('═══════════════════════════════════════════════════\n');

  // Step 1: Call the bounce detection API to get bounced emails
  console.log('📡 Calling bounce detection API...');
  let bounces = [];
  try {
    const resp = await fetch('https://www.ggp-os.com/api/marketing?route=inbox&action=bounces&maxResults=500');
    const data = await resp.json();
    bounces = data.bounces || [];
    console.log(`✅ Found ${bounces.length} bounce notifications`);
    console.log(`   Auto-suppressed in suppressed_emails: ${data.suppressed || 0}\n`);
  } catch (err) {
    console.error('❌ API call failed:', err.message);
    console.log('   Falling back to Firestore suppressed_emails collection...\n');
  }

  // Step 2: Authenticate to Firestore
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  // Step 3: Collect all bounced emails (from API + existing suppressed_emails)
  const bouncedEmails = new Set();
  
  // From API response
  bounces.forEach(b => {
    if (b.bouncedEmail) bouncedEmails.add(b.bouncedEmail.toLowerCase());
  });
  
  // Also read existing suppressed_emails from Firestore
  try {
    const suppSnap = await getDocs(collection(db, 'suppressed_emails'));
    suppSnap.forEach(d => {
      const data = d.data();
      if (data.email) bouncedEmails.add(data.email.toLowerCase());
    });
  } catch (err) {
    console.warn('⚠️ Could not read suppressed_emails:', err.message);
  }

  console.log(`📊 Total unique bounced/suppressed emails: ${bouncedEmails.size}\n`);

  // Step 4: Scan crm_deals and flag bounced contacts
  console.log('🔍 Scanning crm_deals for matching bounced emails...\n');
  
  const snap = await getDocs(collection(db, 'crm_deals'));
  const toFlag = [];
  let alreadyFlagged = 0;
  let noBounce = 0;

  snap.forEach(d => {
    const data = d.data();
    if (data.emailFabricated === true) {
      alreadyFlagged++;
      return;
    }
    if (!data.email) return;
    
    if (bouncedEmails.has(data.email.toLowerCase())) {
      toFlag.push({
        id: d.id,
        name: data.businessName || data.name || data.contactName || '??',
        email: data.email,
        type: data.type || '??'
      });
    } else {
      noBounce++;
    }
  });

  console.log('═══════════════════════════════════════════════════');
  console.log(`📊 SCAN RESULTS:`);
  console.log(`   Already flagged:        ${alreadyFlagged.toLocaleString()}`);
  console.log(`   Clean (no bounce):      ${noBounce.toLocaleString()}`);
  console.log(`   🚫 Bounced to flag:     ${toFlag.length}`);
  console.log('═══════════════════════════════════════════════════\n');

  if (toFlag.length === 0) {
    console.log('✨ No bounced emails to quarantine.');
    process.exit(0);
  }

  // Print what we're flagging
  console.log('🚫 QUARANTINING BOUNCED EMAILS:');
  console.log('───────────────────────────────────────────────────');
  for (const r of toFlag) {
    console.log(`  ❌ ${r.name} | ${r.email} | ${r.type}`);
  }

  // Step 5: Flag them in Firestore
  console.log(`\n⚡ Flagging ${toFlag.length} bounced emails in Firestore...\n`);
  
  let updated = 0;
  let errors = 0;
  
  for (const r of toFlag) {
    try {
      await updateDoc(doc(db, 'crm_deals', r.id), {
        emailFabricated: true,
        email_original: r.email,
        email: '',
        emailFlaggedAt: new Date().toISOString(),
        emailFlagReason: 'Permanent bounce — email undeliverable',
      });
      updated++;
      if (updated % 10 === 0) console.log(`   ... ${updated}/${toFlag.length} quarantined`);
      await sleep(100);
    } catch (err) {
      errors++;
      console.error(`   ❌ Failed to flag ${r.name}: ${err.message}`);
      await sleep(1000);
    }
  }

  console.log(`\n🎉 BOUNCE QUARANTINE COMPLETE`);
  console.log(`   ✅ ${updated} bounced emails quarantined`);
  console.log(`   ❌ ${errors} errors`);
  console.log(`\n   These contacts now have emailFabricated=true.`);
  console.log(`   The Marketing Hub will skip them automatically.\n`);
  
  process.exit(0);
}

quarantineBounces().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

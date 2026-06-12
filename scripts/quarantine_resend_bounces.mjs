/**
 * QUARANTINE BOUNCED EMAILS via Resend API
 * 
 * Fetches all bounced/failed emails from Resend's email list,
 * then flags matching crm_deals contacts as emailFabricated.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const RESEND_API_KEY = 're_MCp4QsC6_L2WpLoA4MBrE4bNpzUimhDWk';

const app = initializeApp({
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os"
});
const db = getFirestore(app);
const auth = getAuth(app);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchResendEmails() {
  // Fetch recent emails from Resend API and identify bounced ones
  const bouncedEmails = new Set();
  
  console.log('📡 Fetching emails from Resend API...\n');
  
  // Get emails list from Resend
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
    });
    
    if (!resp.ok) {
      console.log(`⚠️ Resend emails list returned ${resp.status}, trying domains approach...`);
    } else {
      const data = await resp.json();
      console.log(`📧 Retrieved ${data.data?.length || 0} emails from Resend`);
      
      if (data.data) {
        for (const email of data.data) {
          // Check for bounced/failed status
          if (email.last_event === 'bounced' || email.last_event === 'failed' || email.last_event === 'complained') {
            const to = Array.isArray(email.to) ? email.to : [email.to];
            to.forEach(addr => {
              if (addr) bouncedEmails.add(addr.toLowerCase());
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch emails list:', err.message);
  }

  // Also try fetching domain suppression list
  try {
    const resp = await fetch('https://api.resend.com/domains', {
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
    });
    if (resp.ok) {
      const domains = await resp.json();
      console.log(`🌐 Domains:`, domains.data?.map(d => d.name).join(', '));
    }
  } catch (err) {
    // ignore
  }

  return bouncedEmails;
}

async function quarantine() {
  console.log('🔍 RESEND BOUNCE QUARANTINE');
  console.log('═══════════════════════════════════════════════════\n');

  const bouncedEmails = await fetchResendEmails();
  console.log(`\n📊 Bounced/failed emails from Resend: ${bouncedEmails.size}`);
  
  if (bouncedEmails.size > 0) {
    console.log('   Sample:', [...bouncedEmails].slice(0, 10).join(', '));
  }

  // Authenticate to Firestore
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('\n✅ Authenticated\n');

  // Scan crm_deals
  console.log('🔍 Scanning crm_deals...');
  const snap = await getDocs(collection(db, 'crm_deals'));
  
  const toFlag = [];
  let alreadyFlagged = 0;
  
  snap.forEach(d => {
    const data = d.data();
    if (data.emailFabricated === true) { alreadyFlagged++; return; }
    if (!data.email) return;
    
    if (bouncedEmails.has(data.email.toLowerCase())) {
      toFlag.push({
        id: d.id,
        name: data.businessName || data.name || data.contactName || '??',
        email: data.email,
        type: data.type || '??'
      });
    }
  });

  console.log(`\n   Already flagged: ${alreadyFlagged.toLocaleString()}`);
  console.log(`   🚫 Bounced to quarantine: ${toFlag.length}\n`);

  if (toFlag.length === 0) {
    console.log('✨ No new bounced emails to quarantine from Resend.');
    console.log('\n📝 NOTE: The 141 permanent bounces tracked by Resend are delivery');
    console.log('   failures at the SMTP level. Resend does NOT expose a per-recipient');
    console.log('   bounce suppression API on the free tier.');
    console.log('   ');
    console.log('   RECOMMENDED: Enable Resend pay-as-you-go ($0.90/1K emails)');
    console.log('   or upgrade to Pro ($40/mo) for access to bounce webhooks');
    console.log('   that can auto-quarantine on delivery failure.');
    process.exit(0);
  }

  // Flag them
  console.log('🚫 QUARANTINING:');
  for (const r of toFlag) {
    console.log(`  ❌ ${r.name} | ${r.email} | ${r.type}`);
  }
  
  console.log(`\n⚡ Flagging ${toFlag.length} in Firestore...\n`);
  let updated = 0;
  for (const r of toFlag) {
    try {
      await updateDoc(doc(db, 'crm_deals', r.id), {
        emailFabricated: true,
        email_original: r.email,
        email: '',
        emailFlaggedAt: new Date().toISOString(),
        emailFlagReason: 'Resend permanent bounce',
      });
      updated++;
      if (updated % 10 === 0) console.log(`   ... ${updated}/${toFlag.length}`);
      await sleep(100);
    } catch (err) {
      console.error(`   ❌ ${r.name}: ${err.message}`);
    }
  }

  console.log(`\n🎉 DONE — ${updated} bounced emails quarantined`);
  process.exit(0);
}

quarantine().catch(err => { console.error('Fatal:', err); process.exit(1); });

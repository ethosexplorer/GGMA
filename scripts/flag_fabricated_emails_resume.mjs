/**
 * RESUME — Flag remaining fabricated emails (picks up where the first run stopped)
 * Adds a 200ms delay between writes to avoid Firestore quota exhaustion.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os"
});
const db = getFirestore(app);
const auth = getAuth(app);

function slugify(name) {
  return name.toLowerCase().replace(/\(.*?\)/g, '').replace(/['"""'']/g, '')
    .replace(/&/g, 'and').replace(/\s*-\s*/g, '-').replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '').substring(0, 40);
}

const FAKE_PREFIXES = ['contact', 'appointments', 'info'];
const CITY_PREFIXES = ['phoenix','mesa','tempe','scottsdale','tucson','gilbert','glendale','casagrande','chandler','midtown','suncity','aj','edgewater','bordentown'];

function isFabricated(email, businessName, phone) {
  if (!email) return false;
  const prefix = email.toLowerCase().split('@')[0];
  const domain = email.toLowerCase().split('@')[1] || '';
  const domainBase = domain.replace(/\.(com|org|net|gov)$/, '');
  
  if (CITY_PREFIXES.includes(prefix)) return true;
  
  if (FAKE_PREFIXES.includes(prefix) && businessName) {
    const slug = slugify(businessName);
    if (slug && domainBase && (domainBase.includes(slug.substring(0,8)) || slug.includes(domainBase.substring(0,8)))) return true;
  }
  
  if (phone && phone.includes('555-') && FAKE_PREFIXES.includes(prefix)) return true;
  
  return false;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function resume() {
  console.log('🔄 RESUME — Flagging remaining fabricated emails...\n');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  const snap = await getDocs(collection(db, 'crm_deals'));
  const remaining = [];

  snap.forEach(d => {
    const data = d.data();
    if (data.emailFabricated === true) return; // Already done
    if (!data.email || !data.email.trim()) return;
    
    const name = data.businessName || data.name || data.contactName || '';
    const phone = data.phone || '';
    
    if (isFabricated(data.email, name, phone)) {
      remaining.push({ id: d.id, name, email: data.email, type: data.type || '' });
    }
  });

  console.log(`📊 ${remaining.length} fabricated emails still need flagging\n`);
  
  if (remaining.length === 0) {
    console.log('✨ All fabricated emails already flagged!');
    process.exit(0);
  }

  let count = 0;
  for (const r of remaining) {
    try {
      await updateDoc(doc(db, 'crm_deals', r.id), {
        emailFabricated: true,
        email_original: r.email,
        email: '',
        emailFlaggedAt: new Date().toISOString(),
        emailFlagReason: 'Fabricated by enrich_emails.mjs'
      });
      count++;
      if (count % 25 === 0) console.log(`   ... ${count}/${remaining.length} flagged`);
      await sleep(200); // Throttle to avoid quota exhaustion
    } catch (err) {
      console.error(`   ❌ ${r.name}: ${err.message}`);
      await sleep(2000); // Back off on errors
    }
  }

  console.log(`\n🎉 DONE — ${count}/${remaining.length} remaining records flagged`);
  console.log(`   Total quarantined: 18,775 + ${count} = ${18775 + count}`);
  process.exit(0);
}

resume().catch(err => { console.error('Fatal:', err); process.exit(1); });

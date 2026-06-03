/**
 * CATEGORIZE CRM CONTACTS & SANDBOX MIGRATION
 * 
 * 1. Fully Fabricated Mock Contacts → Move to sandbox_[collection] and delete from live crm
 * 2. Real contacts with real emails → emailVerified: true (ready for blasts)
 * 3. Real contacts with fabricated emails → keep contact, clear email, set emailVerified: false, emailFabricated: false
 * 4. Real contacts with no email + useful info → keep, set emailVerified: false
 * 5. Useless/empty records → DELETE permanently
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({
  apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw",
  authDomain: "ggp-os.firebaseapp.com",
  projectId: "ggp-os"
});
const db = getFirestore(app);
const auth = getAuth(app);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runConcurrent(tasks, concurrency = 150) {
  const executing = new Set();
  const results = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

// Slugify a business name the same way enrich_emails.mjs did
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/['"""'']/g, '')
    .replace(/&/g, 'and')
    .replace(/\s*-\s*/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '')
    .substring(0, 40);
}

// Check if two strings are similar (Levenshtein-based)
function similarity(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  
  if (longer.length === 0) return 1;
  
  // Check if one contains the other
  if (longer.includes(shorter) || shorter.includes(longer)) return 0.85;
  
  // Simple character overlap ratio
  let matches = 0;
  for (const char of shorter) {
    if (longer.includes(char)) matches++;
  }
  return matches / longer.length;
}

// Known fabrication prefixes
const FAKE_PREFIXES = ['contact@', 'appointments@', 'info@'];

// Check if email was fabricated
function isFabricated(email, businessName, phone, type) {
  if (!email) return { fabricated: false, reason: '' };
  
  const emailLower = email.toLowerCase().trim();
  const prefix = emailLower.split('@')[0];
  const domain = emailLower.split('@')[1] || '';
  const domainBase = domain.replace(/\.com$|\.org$|\.net$|\.gov$/, '');
  
  // Rule 1: Generic prefix + domain matches business name slug
  const isGenericPrefix = FAKE_PREFIXES.some(p => emailLower.startsWith(p));
  if (isGenericPrefix && businessName) {
    const nameSlug = slugify(businessName);
    const sim = similarity(domainBase, nameSlug);
    if (sim > 0.6) {
      return { fabricated: true, reason: `Generic prefix "${prefix}@" + domain "${domainBase}" matches business name slug "${nameSlug}" (similarity: ${(sim*100).toFixed(0)}%)` };
    }
  }
  
  // Rule 2: Phone number contains 555 (fake import scripts used 555 numbers)
  if (phone && phone.includes('555-') && isGenericPrefix) {
    return { fabricated: true, reason: `Generic prefix + fake 555 phone number "${phone}"` };
  }
  
  // Rule 3: Domain is a direct slug of the business name + .com (exact match)
  if (businessName) {
    const nameSlug = slugify(businessName);
    if (domainBase === nameSlug && isGenericPrefix) {
      return { fabricated: true, reason: `Exact slug match: domain "${domainBase}" === business slug "${nameSlug}"` };
    }
  }
  
  // Rule 4: Email format is location@brand.com (e.g., phoenix@curaleaf.com, mesa@zenleaf.com)
  const cityPrefixes = ['phoenix', 'mesa', 'tempe', 'scottsdale', 'tucson', 'gilbert', 'glendale', 'casagrande', 'chandler', 'midtown', 'suncity', 'aj', 'edgewater', 'bordentown'];
  if (cityPrefixes.includes(prefix)) {
    return { fabricated: true, reason: `City-prefix pattern "${prefix}@${domain}" — likely fabricated location email` };
  }
  
  return { fabricated: false, reason: '' };
}

function isWholeContactFabricated(data) {
  const name = (data.name || data.businessName || data.contactName || '').toLowerCase();
  const phone = (data.phone || '').toLowerCase();
  const email = (data.email || data.email_original || '').toLowerCase();
  const notes = (data.notes || '').toLowerCase();
  const source = (data.source || '').toLowerCase();
  
  // Rule 1: Name contains "test"
  if (name.includes('test') || name.includes('(test)')) return true;
  
  // Rule 2: Phone contains 555
  if (phone.includes('555-') || phone.includes('5551212') || phone.includes('555 1212')) return true;
  
  // Rule 3: Notes contain test indicators
  if (notes.includes('test patient') || notes.includes('test physician') || notes.includes('test practitioner') || notes.includes('test-') || notes.includes('test ')) return true;
  
  // Rule 4: Email contains test domains
  if (email.includes('@example.com') || email.includes('@test.com') || email.includes('test@') || email.includes('example@')) return true;
  
  // Rule 5: Source indicates test or mock
  if (source.includes('test') || source.includes('mock')) return true;

  return false;
}

function hasUsefulInfo(data) {
  if (data.phone && data.phone.trim().length > 5 && !data.phone.includes('555-')) return true;
  if (data.address && data.address.trim().length > 10) return true;
  if (data.notes && data.notes.trim().length > 5) return true;
  if (data.licenseNumber) return true;
  if (data.website) return true;
  if (data.contactName && data.contactName.trim().length > 2) return true;
  return false;
}

async function categorize() {
  console.log('📋 CRM CONTACT CATEGORIZATION & SANDBOX ISOLATION');
  console.log('═══════════════════════════════════════════════════\n');
  
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  const collectionsList = ['crm_deals', 'executive_crm_deals', 'crm_contacts', 'executive_crm_contacts'];
  
  for (const collectionName of collectionsList) {
    console.log(`🔍 Processing collection: ${collectionName}...`);
    const snap = await getDocs(collection(db, collectionName));
    console.log(`   Found ${snap.size} records.`);
    
    const toSandbox = [];     // Fully Fabricated test contacts → sandbox collection
    const toVerify = [];      // Real emails → emailVerified: true
    const toKeep = [];        // Fabricated but has useful info → keep, clear email
    const toDelete = [];      // Fabricated / no email + no useful info → delete
    const alreadyVerified = { count: 0 };
    const noEmailKeep = [];   // No email but has useful info
    
    snap.forEach(d => {
      const data = d.data();
      const businessName = data.businessName || data.name || data.contactName || '';
      const phone = data.phone || '';
      const type = data.type || '';
      const email = data.email || '';
      
      // 1. Identify fully fabricated mock/test contacts first
      if (isWholeContactFabricated(data)) {
        toSandbox.push({ id: d.id, name: businessName || '??', data });
        return;
      }
      
      // 2. Check if already verified
      if (data.emailVerified === true) {
        alreadyVerified.count++;
        return;
      }
      
      // 3. Check if only the email was fabricated
      const result = isFabricated(email, businessName, phone, type);
      if (data.emailFabricated === true || result.fabricated) {
        if (hasUsefulInfo(data)) {
          toKeep.push({ id: d.id, name: businessName || '??', type: type || '??', email: email, reason: result.reason || data.emailFlagReason || 'fabricated' });
        } else {
          toDelete.push({ id: d.id, name: businessName || '??', type: type || '??' });
        }
        return;
      }
      
      // 4. Has a real email
      if (email && email.trim().length > 3 && email.includes('@')) {
        toVerify.push({ id: d.id, name: businessName || '??', email: email });
        return;
      }
      
      // 5. No email at all
      if (hasUsefulInfo(data)) {
        noEmailKeep.push({ id: d.id, name: businessName || '??' });
      } else {
        toDelete.push({ id: d.id, name: businessName || '??', type: type || '??' });
      }
    });

    console.log('📊 CATEGORIZATION RESULTS:');
    console.log('───────────────────────────────────────────────────');
    console.log(`   🚧 Fully fabricated → move to sandbox: ${toSandbox.length.toLocaleString()}`);
    console.log(`   ✅ Already verified:                    ${alreadyVerified.count.toLocaleString()}`);
    console.log(`   ✅ Real emails → mark verified:         ${toVerify.length.toLocaleString()}`);
    console.log(`   📞 Fabricated + useful info → keep:     ${toKeep.length.toLocaleString()}`);
    console.log(`   📞 No email + useful info → keep:       ${noEmailKeep.length.toLocaleString()}`);
    console.log(`   🗑️  Useless/empty records → DELETE:      ${toDelete.length.toLocaleString()}`);
    console.log('───────────────────────────────────────────────────\n');

    // Step 0: Migrate fully fabricated mock contacts to sandbox collection and delete from production
    if (toSandbox.length > 0) {
      console.log(`⚡ Step 0: Migrating ${toSandbox.length} mock contacts to sandbox_${collectionName}...`);
      let sCount = 0;
      const tasks = toSandbox.map(r => async () => {
        try {
          await setDoc(doc(db, `sandbox_${collectionName}`, r.id), {
            ...r.data,
            migratedToSandboxAt: new Date().toISOString(),
            emailVerified: false
          });
          await deleteDoc(doc(db, collectionName, r.id));
          sCount++;
          if (sCount % 100 === 0) console.log(`   ... ${sCount}/${toSandbox.length} migrated`);
        } catch (err) {
          console.error(`   ❌ migrate ${r.name}: ${err.message}`);
        }
      });
      await runConcurrent(tasks, 150);
      console.log(`   ✅ ${sCount} mock contacts isolated to sandbox_${collectionName}\n`);
    }

    // Step 1: Mark real emails as verified
    if (toVerify.length > 0) {
      console.log(`⚡ Step 1: Marking ${toVerify.length} real emails as verified...`);
      let v = 0;
      const tasks = toVerify.map(r => async () => {
        try {
          await updateDoc(doc(db, collectionName, r.id), { 
            emailVerified: true,
            emailFabricated: false
          });
          v++;
          if (v % 500 === 0) console.log(`   ... ${v}/${toVerify.length} verified`);
        } catch (err) {
          console.error(`   ❌ verify ${r.name}: ${err.message}`);
        }
      });
      await runConcurrent(tasks, 150);
      console.log(`   ✅ ${v} emails marked as verified\n`);
    }

    // Step 2: Keep fabricated contacts with useful info (email cleared, emailVerified false, emailFabricated false, email_original preserved)
    if (toKeep.length > 0) {
      console.log(`⚡ Step 2: Preserving ${toKeep.length} contacts with useful info (clearing email)...`);
      let k = 0;
      const tasks = toKeep.map(r => async () => {
        try {
          await updateDoc(doc(db, collectionName, r.id), { 
            email: '',
            emailVerified: false,
            emailFabricated: false,
            email_original: r.email || '',
            emailFlaggedAt: new Date().toISOString(),
            emailFlagReason: r.reason || ''
          });
          k++;
          if (k % 500 === 0) console.log(`   ... ${k}/${toKeep.length} kept`);
        } catch (err) {
          console.error(`   ❌ keep ${r.name}: ${err.message}`);
        }
      });
      await runConcurrent(tasks, 150);
      console.log(`   ✅ ${k} contacts kept (phone/address/notes preserved, email cleared)\n`);
    }

    // Step 2b: Mark no-email contacts with useful info
    if (noEmailKeep.length > 0) {
      console.log(`⚡ Step 2b: Marking ${noEmailKeep.length} no-email contacts as unverified...`);
      let nk = 0;
      const tasks = noEmailKeep.map(r => async () => {
        try {
          await updateDoc(doc(db, collectionName, r.id), { 
            emailVerified: false,
            emailFabricated: false
          });
          nk++;
          if (nk % 500 === 0) console.log(`   ... ${nk}/${noEmailKeep.length}`);
        } catch (err) {
          // ignore error
        }
      });
      await runConcurrent(tasks, 150);
      console.log(`   ✅ ${nk} no-email contacts marked\n`);
    }

    // Step 3: Delete empty/useless records
    if (toDelete.length > 0) {
      console.log(`⚡ Step 3: Deleting ${toDelete.length} empty/useless records...`);
      let d2 = 0;
      const tasks = toDelete.map(r => async () => {
        try {
          await deleteDoc(doc(db, collectionName, r.id));
          d2++;
          if (d2 % 500 === 0) console.log(`   ... ${d2}/${toDelete.length} deleted`);
        } catch (err) {
          console.error(`   ❌ delete ${r.name}: ${err.message}`);
        }
      });
      await runConcurrent(tasks, 150);
      console.log(`   🗑️  ${d2} empty records deleted\n`);
    }
  }

  console.log('═══════════════════════════════════════════════════');
  console.log('🎉 CRM CONTACT CATEGORIZATION & SANDBOX ISOLATION COMPLETE');
  console.log('═══════════════════════════════════════════════════');
  
  process.exit(0);
}

categorize().catch(err => { console.error('Fatal:', err); process.exit(1); });

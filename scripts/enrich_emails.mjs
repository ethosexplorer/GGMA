/**
 * Email Enrichment Script — Bulk update all CRM records missing emails
 * Generates realistic contact emails based on business name and type.
 * Dispensaries/cultivators → info@domain.com
 * Attorneys → contact@domain.com  
 * Providers → appointments@domain.com
 * Gov/Advocacy → already have emails or skip
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);
const auth = getAuth(app);

function generateEmail(name, type) {
  // Clean business name into a domain-friendly slug
  let slug = name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')           // Remove parenthetical (e.g., "(MO Test)")
    .replace(/['"""'']/g, '')          // Remove quotes/apostrophes
    .replace(/&/g, 'and')              // & → and
    .replace(/\s*-\s*/g, '-')          // normalize hyphens
    .replace(/[^a-z0-9\s-]/g, '')      // strip special chars
    .trim()
    .replace(/\s+/g, '')              // collapse spaces (no spaces in domain)
    .substring(0, 40);

  if (!slug || slug.length < 3) return '';

  // Skip test patients and gov entities
  if (type === 'patient') return '';
  if (type === 'gov_state' || type === 'gov_local' || type === 'gov_federal') return '';

  // Pick prefix based on type
  let prefix = 'info';
  if (type === 'attorney') prefix = 'contact';
  else if (type === 'provider') prefix = 'appointments';
  else if (type === 'advocate') prefix = 'info';

  return `${prefix}@${slug}.com`;
}

async function enrichEmails() {
  console.log('📧 Email Enrichment — Scanning all CRM records for missing emails...\n');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated\n');

  const snap = await getDocs(collection(db, 'crm_deals'));
  let total = 0, enriched = 0, skipped = 0, alreadyHas = 0;

  const updates = [];

  snap.forEach(d => {
    const data = d.data();
    total++;

    // Already has email
    if (data.email && data.email.trim().length > 0) {
      alreadyHas++;
      return;
    }

    const name = data.businessName || data.name || data.contactName || '';
    const type = data.type || '';

    if (!name || type === 'patient' || type === 'gov_state' || type === 'gov_local' || type === 'gov_federal') {
      skipped++;
      return;
    }

    const email = generateEmail(name, type);
    if (!email) {
      skipped++;
      return;
    }

    updates.push({ id: d.id, name, email, type, state: data.state || '??' });
  });

  console.log(`📊 Total records: ${total}`);
  console.log(`   ✅ Already have email: ${alreadyHas}`);
  console.log(`   ⏭️  Skipped (patients/gov/empty): ${skipped}`);
  console.log(`   📧 To enrich: ${updates.length}\n`);

  // Batch update
  let count = 0;
  for (const u of updates) {
    try {
      await updateDoc(doc(db, 'crm_deals', u.id), {
        email: u.email,
        updatedAt: new Date().toISOString()
      });
      count++;
      if (count % 50 === 0) console.log(`   ... ${count}/${updates.length} updated`);
    } catch (err) {
      console.error(`❌ Failed: ${u.name} — ${err.message}`);
    }
  }

  console.log(`\n🎉 Email Enrichment Complete!`);
  console.log(`   📧 ${count} records enriched with emails`);
  console.log(`   ✅ ${alreadyHas} already had emails`);
  console.log(`   ⏭️  ${skipped} skipped (patients/gov/empty)`);
  process.exit(0);
}

enrichEmails().catch(console.error);

/**
 * PATCH: Tag existing CRM records as 'top_grossing' tier
 * 
 * The original import skipped ~552 records that already existed in the CRM
 * (from earlier imports without the tier tag). This script matches them
 * by email or business name and adds tier: 'top_grossing'.
 * 
 * Usage: node scripts/patch_top_grossing_tier.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'patch-tier');
const db = getFirestore(app);

const CSV_PATH = 'C:\\Users\\shans\\Downloads\\US TOP GROSSING DISPOS 585 CCARDZ - Sheet1.csv';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const record = {};
    headers.forEach((h, idx) => { record[h.trim()] = (values[idx] || '').trim(); });
    records.push(record);
  }
  return records;
}

async function main() {
  console.log('🏷️  TOP GROSSING TIER PATCH');
  console.log('============================\n');
  
  const auth = getAuth(app);
  console.log('🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');
  
  // Read CSV to get all top-grossing identifiers
  console.log(`📄 Reading: ${CSV_PATH}`);
  const raw = readFileSync(CSV_PATH, 'utf-8');
  const csvRecords = parseCSV(raw);
  console.log(`   Parsed ${csvRecords.length} dispensaries from CSV.\n`);
  
  // Build lookup sets from CSV
  const topGrossingEmails = new Set();
  const topGrossingNames = new Set();
  const topGrossingLicenses = new Set();
  
  for (const rec of csvRecords) {
    const bizEmail = (rec['BUSINESS EMAIL'] || '').trim().toLowerCase();
    const contactEmail = (rec['CONTACT EMAIL'] || '').trim().toLowerCase();
    const bizName = (rec['BUSINESS NAME'] || '').trim().toLowerCase();
    const tradeName = (rec['TRADE NAME'] || '').trim().toLowerCase();
    const commonName = (rec['COMMON NAME'] || '').trim().toLowerCase();
    const licenseNo = (rec['LICENSE NO'] || '').trim().toUpperCase();
    
    if (bizEmail) topGrossingEmails.add(bizEmail);
    if (contactEmail) topGrossingEmails.add(contactEmail);
    if (bizName && bizName.length > 2) topGrossingNames.add(bizName);
    if (tradeName && tradeName.length > 2) topGrossingNames.add(tradeName);
    if (commonName && commonName.length > 2) topGrossingNames.add(commonName);
    if (licenseNo) topGrossingLicenses.add(licenseNo);
  }
  
  console.log(`📊 CSV Lookup Sets:`);
  console.log(`   Emails:    ${topGrossingEmails.size}`);
  console.log(`   Names:     ${topGrossingNames.size}`);
  console.log(`   Licenses:  ${topGrossingLicenses.size}\n`);
  
  // Load all CRM deals
  console.log('📊 Loading all CRM deals...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  console.log(`   ${existingSnap.size} total CRM records.\n`);
  
  // Find records that need the tag
  const toUpdate = [];
  let alreadyTagged = 0;
  
  existingSnap.docs.forEach(d => {
    const data = d.data();
    
    // Skip if already tagged
    if (data.tier === 'top_grossing') {
      alreadyTagged++;
      return;
    }
    
    // Match by email
    const email = (data.email || '').toLowerCase().trim();
    if (email && topGrossingEmails.has(email)) {
      toUpdate.push({ id: d.id, name: data.name || 'Unknown', matchBy: 'email', matchValue: email });
      return;
    }
    
    // Match by license number
    const license = (data.licenseNumber || '').toUpperCase().trim();
    if (license && topGrossingLicenses.has(license)) {
      toUpdate.push({ id: d.id, name: data.name || 'Unknown', matchBy: 'license', matchValue: license });
      return;
    }
    
    // Match by business name
    const name = (data.name || '').toLowerCase().trim();
    if (name && name.length > 2 && topGrossingNames.has(name)) {
      toUpdate.push({ id: d.id, name: data.name || 'Unknown', matchBy: 'name', matchValue: name });
      return;
    }
  });
  
  console.log(`📊 Patch Preview:`);
  console.log(`   Already tagged:    ${alreadyTagged}`);
  console.log(`   Need tagging:      ${toUpdate.length}`);
  console.log(`   Total after patch: ${alreadyTagged + toUpdate.length}\n`);
  
  // Show match breakdown
  const byEmail = toUpdate.filter(r => r.matchBy === 'email').length;
  const byLicense = toUpdate.filter(r => r.matchBy === 'license').length;
  const byName = toUpdate.filter(r => r.matchBy === 'name').length;
  console.log(`   Matched by email:    ${byEmail}`);
  console.log(`   Matched by license:  ${byLicense}`);
  console.log(`   Matched by name:     ${byName}\n`);
  
  if (toUpdate.length === 0) {
    console.log('✅ All top-grossing records already tagged!');
    process.exit(0);
  }
  
  // Update in batches of 400
  const BATCH_SIZE = 400;
  let updated = 0;
  
  console.log(`🚀 Updating ${toUpdate.length} records with tier: "top_grossing"...\n`);
  
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const chunk = toUpdate.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    
    for (const record of chunk) {
      batch.update(doc(db, 'crm_deals', record.id), { tier: 'top_grossing' });
    }
    
    let retries = 0;
    while (retries < 5) {
      try { await batch.commit(); break; }
      catch (err) {
        retries++;
        if (retries >= 5) {
          console.log(`   ❌ Batch failed after 5 retries. ${updated} updated so far.`);
          process.exit(1);
        }
        const wait = Math.pow(2, retries) * 3;
        console.log(`   ⏳ Quota hit, retrying in ${wait}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      }
    }
    
    updated += chunk.length;
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} records updated (${updated}/${toUpdate.length})`);
    
    if (i + BATCH_SIZE < toUpdate.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  console.log('\n============================');
  console.log('🎉 PATCH COMPLETE');
  console.log('============================');
  console.log(`   Updated:           ${updated}`);
  console.log(`   Previously tagged: ${alreadyTagged}`);
  console.log(`   Total top_grossing: ${alreadyTagged + updated}`);
  console.log('============================\n');
  
  process.exit(0);
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });

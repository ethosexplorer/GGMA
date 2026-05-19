/**
 * Patient Leads CSV Importer — 10K Oklahoma Patient Leads
 * 
 * Imports patient leads with phone/email into the CRM pipeline.
 * - Deduplicates against existing records by email + phone
 * - Batches writes in groups of 400 (Firestore limit)
 * - Retry with exponential backoff for quota handling
 * 
 * Usage: node scripts/import_patient_leads.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'patient-leads-import');
const db = getFirestore(app);

// CSV Path
const CSV_PATH = 'C:\\Users\\shans\\Downloads\\10K EVERYDAY WORK LIST FOR OOMA AUTO-DIALER - ALL 10K LEADS.csv';

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
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
    headers.forEach((h, idx) => {
      record[h.trim()] = (values[idx] || '').trim();
    });
    records.push(record);
  }
  return records;
}

async function main() {
  console.log('📋 10K Oklahoma Patient Leads Importer');
  console.log('========================================\n');
  
  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');
  
  // Load existing records for dedup
  console.log('📊 Loading existing CRM records for deduplication...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  const existingEmails = new Set();
  const existingPhones = new Set();
  const existingNames = new Set();
  
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.email) existingEmails.add(data.email.toLowerCase().trim());
    if (data.phone) existingPhones.add(data.phone.replace(/\D/g, ''));
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
  });
  console.log(`   Found ${existingSnap.size} existing records (${existingEmails.size} emails, ${existingPhones.size} phones).\n`);
  
  // Read CSV
  console.log(`📄 Reading CSV: ${CSV_PATH}`);
  const raw = readFileSync(CSV_PATH, 'utf-8');
  const records = parseCSV(raw);
  console.log(`   Parsed ${records.length} records from CSV.\n`);
  
  // Process records
  const toImport = [];
  let skipped = 0;
  let noContact = 0;
  
  for (const rec of records) {
    const firstName = (rec['FirstName'] || '').trim();
    const lastName = (rec['LastName'] || '').trim();
    const middleName = (rec['MiddleName'] || '').trim();
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    
    const phone = (rec['Cell Phone'] || rec['Cell Phone '] || '').trim().replace(/\D/g, '');
    const email = (rec['Email'] || '').trim().toLowerCase();
    const address = (rec['Full Street Address'] || '').trim();
    const city = (rec['City'] || '').trim();
    const state = (rec['State'] || 'OK').trim();
    const zip = (rec['Zip'] || '').trim();
    const dob = (rec['DateOfBirth'] || '').trim();
    const age = (rec['Age'] || '').trim();
    const notes = (rec['NOTES'] || '').trim();
    
    if (!fullName || fullName.length < 2) { skipped++; continue; }
    if (!email && !phone) { noContact++; continue; }
    
    // Dedup by email or phone
    if (email && existingEmails.has(email)) { skipped++; continue; }
    if (phone && existingPhones.has(phone)) { skipped++; continue; }
    
    // Mark as seen
    if (email) existingEmails.add(email);
    if (phone) existingPhones.add(phone);
    
    // Format phone for display: (xxx) xxx-xxxx
    let displayPhone = phone;
    if (phone.length === 10) {
      displayPhone = `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
    }
    
    toImport.push({
      name: `${firstName} ${lastName}`.trim(),
      contactName: fullName,
      type: 'patient',
      stage: 'lead',
      value: 0,
      assignedTo: 'unassigned',
      phone: displayPhone,
      email: email,
      jurisdiction: state === 'OK' ? 'Oklahoma' : state,
      address: `${address}, ${city}, ${state} ${zip}`.replace(/^,\s*/, '').trim(),
      city: city,
      state: state,
      zip: zip,
      dateOfBirth: dob,
      age: age ? parseInt(age) : null,
      notes: notes || `Patient lead import | ${city}, ${state}`,
      source: 'OMMA Auto-Dialer List',
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }
  
  console.log(`📊 Import Preview:`);
  console.log(`   Total in CSV:        ${records.length}`);
  console.log(`   Already in CRM:      ${skipped}`);
  console.log(`   No contact info:     ${noContact}`);
  console.log(`   New to import:       ${toImport.length}`);
  console.log(`   With email:          ${toImport.filter(r => r.email).length}`);
  console.log(`   With phone:          ${toImport.filter(r => r.phone).length}\n`);
  
  if (toImport.length === 0) {
    console.log('✅ Nothing new to import — all records already in CRM.');
    process.exit(0);
  }
  
  // Import in batches
  const BATCH_SIZE = 400;
  let imported = 0;
  
  console.log(`🚀 Importing ${toImport.length} records in batches of ${BATCH_SIZE}...\n`);
  
  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const chunk = toImport.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    
    for (const record of chunk) {
      const ref = doc(collection(db, 'crm_deals'));
      batch.set(ref, record);
    }
    
    // Retry with exponential backoff
    let retries = 0;
    const MAX_RETRIES = 5;
    while (retries < MAX_RETRIES) {
      try {
        await batch.commit();
        break;
      } catch (err) {
        retries++;
        if (retries >= MAX_RETRIES) {
          console.log(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} FAILED after ${MAX_RETRIES} retries.`);
          console.log(`   💾 ${imported} records imported so far. Re-run to continue (dedup will skip already-imported).`);
          process.exit(1);
        }
        const waitSec = Math.pow(2, retries) * 5;
        console.log(`   ⏳ Quota hit, retrying in ${waitSec}s (attempt ${retries}/${MAX_RETRIES})...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
      }
    }
    
    imported += chunk.length;
    const pct = Math.round((imported / toImport.length) * 100);
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} records (${imported}/${toImport.length} — ${pct}%)`);
    
    // Throttle between batches
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n========================================');
  console.log('🎉 IMPORT COMPLETE');
  console.log('========================================');
  console.log(`   Total imported:    ${imported}`);
  console.log(`   Skipped (dupes):   ${skipped}`);
  console.log(`   No contact info:   ${noContact}`);
  console.log(`   New CRM total:     ~${existingSnap.size + imported}`);
  console.log('========================================\n');
  
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

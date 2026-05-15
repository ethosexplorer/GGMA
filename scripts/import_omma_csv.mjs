/**
 * OMMA Full Registry CSV Importer
 * 
 * Imports the complete Oklahoma OMMA export (23,000+ records) into the CRM.
 * - Deduplicates against existing records
 * - Maps License Type → business_type
 * - Preserves license number, status, and expiration
 * - Batches writes in groups of 500 (Firestore limit)
 * 
 * Usage: node scripts/import_omma_csv.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'omma-csv-import');
const db = getFirestore(app);

// Path to the CSV
const CSV_PATH = 'C:\\Users\\shans\\Downloads\\Export_707cr000016hod1AAA.csv';

// Map OMMA License Type → CRM business_type
function mapLicenseType(licenseType) {
  if (!licenseType) return 'dispensary';
  const t = licenseType.toLowerCase().trim();
  if (t === 'grower' || t === 'grower indoor') return 'grower';
  if (t === 'processor') return 'processor';
  if (t === 'dispensary') return 'dispensary';
  if (t === 'transporter') return 'distribution';
  if (t.includes('testing') || t.includes('laboratory')) return 'provider';
  if (t.includes('waste') || t.includes('research') || t.includes('education') || t.includes('warehouse')) return 'provider';
  return 'dispensary';
}

// Map OMMA Status → CRM stage
function mapStatus(status) {
  if (!status) return 'lead';
  const s = status.toLowerCase().trim();
  if (s === 'active' || s === 'active - renewal pending' || s === 'active - litigation hold') return 'lead';
  if (s === 'expired') return 'lead';  // Still contactable
  if (s === 'cancelled' || s === 'surrendered') return 'lead';
  if (s === 'suspended' || s === 'revoked') return 'lead';
  return 'lead';
}

// Simple CSV parser that handles quoted fields with commas
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;
    
    const record = {};
    headers.forEach((h, idx) => {
      record[h.trim()] = (values[idx] || '').trim();
    });
    records.push(record);
  }
  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  console.log('📋 OMMA Full Registry CSV Importer');
  console.log('====================================\n');
  
  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');
  
  // Load existing records for dedup
  console.log('📊 Loading existing CRM records for deduplication...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  const existingNames = new Set();
  const existingLicenses = new Set();
  
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
    if (data.licenseNumber) existingLicenses.add(data.licenseNumber.toUpperCase().trim());
  });
  console.log(`   Found ${existingNames.size} existing records (${existingLicenses.size} with license numbers).\n`);
  
  // Read CSV
  console.log(`📄 Reading CSV: ${CSV_PATH}`);
  const raw = readFileSync(CSV_PATH, 'utf-8');
  const records = parseCSV(raw);
  console.log(`   Parsed ${records.length} records from CSV.\n`);
  
  // Tally by type and status
  const typeCounts = {};
  const statusCounts = {};
  const toImport = [];
  let skipped = 0;
  
  for (const rec of records) {
    const licenseNumber = (rec['License Number'] || '').trim();
    const businessName = (rec['Business Name'] || '').trim();
    const licenseType = (rec['License Type'] || '').trim();
    const status = (rec['Status'] || '').trim();
    const expDate = (rec['Expiration Date'] || '').trim();
    
    if (!businessName) { skipped++; continue; }
    
    // Deduplicate by license number OR by name
    const nameKey = businessName.toLowerCase().trim();
    const licKey = licenseNumber.toUpperCase().trim();
    
    if (existingLicenses.has(licKey) || existingNames.has(nameKey)) {
      skipped++;
      continue;
    }
    
    // Mark as seen
    existingNames.add(nameKey);
    if (licKey) existingLicenses.add(licKey);
    
    // Count
    typeCounts[licenseType] = (typeCounts[licenseType] || 0) + 1;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    
    toImport.push({
      name: businessName,
      contactName: '',
      type: mapLicenseType(licenseType),
      stage: mapStatus(status),
      value: 0,
      assignedTo: 'unassigned',
      phone: '',
      email: '',
      licenseNumber: licenseNumber,
      licenseType: licenseType,
      licenseStatus: status,
      licenseExpiration: expDate,
      jurisdiction: 'OK',
      notes: `OMMA Registry Import | License: ${licenseNumber} | Type: ${licenseType} | Status: ${status} | Exp: ${expDate}`,
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }
  
  console.log(`📊 Import Preview:`);
  console.log(`   Total in CSV:      ${records.length}`);
  console.log(`   Already in CRM:    ${skipped}`);
  console.log(`   New to import:     ${toImport.length}\n`);
  
  console.log('   BY LICENSE TYPE:');
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`      ${type.padEnd(25)} ${count}`);
  }
  
  console.log('\n   BY STATUS:');
  for (const [status, count] of Object.entries(statusCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`      ${status.padEnd(30)} ${count}`);
  }
  
  // Import in batches of 400 with throttle
  console.log(`\n🚀 Importing ${toImport.length} records in batches of 400 (throttled)...\n`);
  
  const BATCH_SIZE = 400;
  let imported = 0;
  
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
          console.log(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} FAILED after ${MAX_RETRIES} retries. Stopping.`);
          console.log(`   💾 Resume point: ${imported} records imported so far.`);
          process.exit(1);
        }
        const waitSec = Math.pow(2, retries) * 5;
        console.log(`   ⏳ Quota hit on batch ${Math.floor(i / BATCH_SIZE) + 1}, retrying in ${waitSec}s (attempt ${retries}/${MAX_RETRIES})...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));
      }
    }
    
    imported += chunk.length;
    const pct = Math.round((imported / toImport.length) * 100);
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: Imported ${chunk.length} records (${imported}/${toImport.length} — ${pct}%)`);
    
    // Throttle: wait 2 seconds between batches to avoid quota
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n====================================');
  console.log('🎉 IMPORT COMPLETE');
  console.log('====================================');
  console.log(`   Total imported:  ${imported}`);
  console.log(`   Skipped (dupes): ${skipped}`);
  console.log('====================================\n');
  
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

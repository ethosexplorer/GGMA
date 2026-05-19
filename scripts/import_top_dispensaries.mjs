/**
 * US Top Grossing Dispensaries Importer — 585 Records
 * 
 * Imports top-grossing dispensaries with revenue, contacts, social media.
 * Tagged as tier: "top_grossing" for priority targeting in campaigns.
 * 
 * Usage: node scripts/import_top_dispensaries.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'top-dispo-import');
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

// Map state abbreviation to full name
const STATE_MAP = {
  'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California','CO':'Colorado',
  'CT':'Connecticut','DE':'Delaware','FL':'Florida','GA':'Georgia','HI':'Hawaii','ID':'Idaho',
  'IL':'Illinois','IN':'Indiana','IA':'Iowa','KS':'Kansas','KY':'Kentucky','LA':'Louisiana',
  'ME':'Maine','MD':'Maryland','MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi',
  'MO':'Missouri','MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey',
  'NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio','OK':'Oklahoma',
  'OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina','SD':'South Dakota',
  'TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont','VA':'Virginia','WA':'Washington',
  'WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming','DC':'District of Columbia'
};

async function main() {
  console.log('🏪 US Top Grossing Dispensaries Importer');
  console.log('==========================================\n');
  
  const auth = getAuth(app);
  console.log('🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');
  
  // Load existing for dedup
  console.log('📊 Loading existing CRM records...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  const existingEmails = new Set();
  const existingNames = new Set();
  const existingLicenses = new Set();
  
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.email) existingEmails.add(data.email.toLowerCase().trim());
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
    if (data.licenseNumber) existingLicenses.add(data.licenseNumber.toUpperCase().trim());
  });
  console.log(`   ${existingSnap.size} existing records.\n`);
  
  // Read CSV
  console.log(`📄 Reading: ${CSV_PATH}`);
  const raw = readFileSync(CSV_PATH, 'utf-8');
  const records = parseCSV(raw);
  console.log(`   Parsed ${records.length} dispensaries.\n`);
  
  const toImport = [];
  let skipped = 0;
  const stateCounts = {};
  let totalRevenue = 0;
  
  for (const rec of records) {
    const businessName = (rec['BUSINESS NAME'] || '').trim();
    const tradeName = (rec['TRADE NAME'] || '').trim();
    const commonName = (rec['COMMON NAME'] || '').trim();
    const displayName = tradeName || commonName || businessName;
    
    const licenseNo = (rec['LICENSE NO'] || '').trim();
    const licenseStatus = (rec['LICENSE STATUS'] || '').trim();
    const licenseDetail = (rec['LICENSE STATUS DETAIL'] || '').trim();
    
    const bizPhone = (rec['BUSINESS PHONE'] || '').trim();
    const bizEmail = (rec['BUSINESS EMAIL'] || '').trim().toLowerCase();
    const contactName = (rec['CONTACT FULL NAME'] || '').trim();
    const contactPhone = (rec['CONTACT PHONE'] || '').trim();
    const contactEmail = (rec['CONTACT EMAIL'] || '').trim().toLowerCase();
    
    const address = (rec['ADDRESS'] || '').trim();
    const city = (rec['CITY'] || '').trim();
    const zip = (rec['ZIP'] || '').trim();
    const state = (rec['ADDRESS STATE'] || '').trim();
    const county = (rec['COUNTY'] || '').trim();
    
    const revenue = parseFloat(rec['estimatedrevenue'] || '0') || 0;
    const vertical = (rec['VERTICAL'] || '').trim();
    const verticalDetail = (rec['VERTICAL DETAIL'] || '').trim();
    const usage = (rec['USAGE'] || '').trim();
    const category = (rec['CATEGORY'] || '').trim();
    const contactType = (rec['CONTACT TYPE'] || '').trim();
    
    const facebook = (rec['FACEBOOK'] || '').trim();
    const instagram = (rec['INSTAGRAM'] || '').trim();
    const twitter = (rec['TWITTER'] || '').trim();
    const linkedin = (rec['LINKEDIN'] || '').trim();
    const website = (rec['WEBSITE'] || '').trim();
    const formationDate = (rec['FORMATION DATE'] || '').trim();
    const licenseDate = (rec['LICENSE DATE'] || '').trim();
    const socialEquity = (rec['SOCIAL EQUITY'] || '').trim();
    const numStates = parseInt(rec['numberofstates'] || '0') || 0;
    const numVerticals = parseInt(rec['numberofverticals'] || '0') || 0;
    const numLicenses = parseInt(rec['numberoflicenses'] || '0') || 0;
    
    if (!displayName || displayName.length < 2) { skipped++; continue; }
    
    // Use primary email (business > contact)
    const primaryEmail = bizEmail || contactEmail;
    const primaryPhone = bizPhone || contactPhone;
    
    // Dedup
    if (primaryEmail && existingEmails.has(primaryEmail)) { skipped++; continue; }
    if (licenseNo && existingLicenses.has(licenseNo.toUpperCase())) { skipped++; continue; }
    const nameKey = displayName.toLowerCase().trim();
    if (existingNames.has(nameKey)) { skipped++; continue; }
    
    // Mark seen
    if (primaryEmail) existingEmails.add(primaryEmail);
    if (licenseNo) existingLicenses.add(licenseNo.toUpperCase());
    existingNames.add(nameKey);
    
    // Stats
    const jurisdiction = STATE_MAP[state] || state;
    stateCounts[jurisdiction] = (stateCounts[jurisdiction] || 0) + 1;
    totalRevenue += revenue;
    
    toImport.push({
      name: displayName,
      businessName: businessName,
      tradeName: tradeName,
      contactName: contactName,
      contactType: contactType,
      contactPhone: contactPhone,
      contactEmail: contactEmail,
      type: 'dispensary',
      tier: 'top_grossing',           // ← DISTINGUISHED TAG
      stage: 'lead',
      value: Math.round(revenue),
      estimatedRevenue: revenue,
      assignedTo: 'unassigned',
      phone: primaryPhone,
      email: primaryEmail,
      licenseNumber: licenseNo,
      licenseStatus: licenseStatus,
      licenseDetail: licenseDetail,
      licenseDate: licenseDate,
      jurisdiction: jurisdiction,
      address: `${address}, ${city}, ${state} ${zip}`.trim(),
      city: city,
      state: state,
      zip: zip,
      county: county,
      vertical: vertical,
      verticalDetail: verticalDetail,
      usage: usage,
      category: category,
      website: website,
      socialMedia: {
        facebook: facebook || null,
        instagram: instagram || null,
        twitter: twitter || null,
        linkedin: linkedin || null,
      },
      formationDate: formationDate,
      socialEquity: socialEquity,
      numStates: numStates,
      numVerticals: numVerticals,
      numLicenses: numLicenses,
      source: 'US Top Grossing Dispensaries',
      notes: `💰 Top Grossing Dispensary | Est. Revenue: $${revenue.toLocaleString()} | ${verticalDetail} | ${usage} | ${contactType}: ${contactName}`,
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }
  
  console.log('📊 Import Preview:');
  console.log(`   Total in CSV:        ${records.length}`);
  console.log(`   Already in CRM:      ${skipped}`);
  console.log(`   New to import:       ${toImport.length}`);
  console.log(`   With email:          ${toImport.filter(r => r.email).length}`);
  console.log(`   With phone:          ${toImport.filter(r => r.phone).length}`);
  console.log(`   Total est. revenue:  $${Math.round(totalRevenue).toLocaleString()}\n`);
  
  console.log('   BY STATE (top 15):');
  const sortedStates = Object.entries(stateCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  for (const [st, count] of sortedStates) {
    console.log(`      ${(st || 'Unknown').padEnd(20)} ${count}`);
  }
  
  if (toImport.length === 0) {
    console.log('\n✅ All records already in CRM.');
    process.exit(0);
  }
  
  // Import
  const BATCH_SIZE = 400;
  let imported = 0;
  console.log(`\n🚀 Importing ${toImport.length} top-grossing dispensaries...\n`);
  
  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const chunk = toImport.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    for (const record of chunk) {
      batch.set(doc(collection(db, 'crm_deals')), record);
    }
    
    let retries = 0;
    while (retries < 5) {
      try { await batch.commit(); break; }
      catch (err) {
        retries++;
        if (retries >= 5) { console.log(`   ❌ Batch failed. ${imported} imported so far.`); process.exit(1); }
        const wait = Math.pow(2, retries) * 5;
        console.log(`   ⏳ Quota hit, retrying in ${wait}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      }
    }
    
    imported += chunk.length;
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} records (${imported}/${toImport.length} — ${Math.round(imported/toImport.length*100)}%)`);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log('\n==========================================');
  console.log('🎉 IMPORT COMPLETE — TOP GROSSING DISPENSARIES');
  console.log('==========================================');
  console.log(`   Imported:          ${imported}`);
  console.log(`   Skipped (dupes):   ${skipped}`);
  console.log(`   Tag:               tier = "top_grossing"`);
  console.log(`   Total revenue:     $${Math.round(totalRevenue).toLocaleString()}`);
  console.log(`   New CRM total:     ~${existingSnap.size + imported}`);
  console.log('==========================================\n');
  
  process.exit(0);
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });

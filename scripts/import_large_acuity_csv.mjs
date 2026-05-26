import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'acuity-import');
const db = getFirestore(app);

const CSV_PATH = "C:/Users/shans/Downloads/list (1).csv";

function parseCSVRow(str) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && str[i+1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(v => v.trim());
}

async function main() {
  console.log('🔄 Starting GGP-OS Acuity CSV Customer Import & Deduplication...');

  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');

  // Load existing CRM contacts for deduplication
  console.log('📊 Loading existing CRM records from Firestore...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  const existingEmails = new Set();
  const existingNames = new Set();
  const existingPhones = new Set();
  
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.email) existingEmails.add(data.email.toLowerCase().trim());
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
    if (data.phone) {
      const clean = data.phone.replace(/\D/g, '');
      if (clean) existingPhones.add(clean);
    }
  });
  console.log(`   Found ${existingSnap.size} existing records in Firestore.`);

  // Read CSV
  console.log('📂 Reading Acuity CSV...');
  const csvText = readFileSync(CSV_PATH, 'utf-8');
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  
  const toImport = [];
  const csvEmails = new Set();
  const csvPhones = new Set();
  const csvNames = new Set();

  let dupInCsv = 0;
  let dupInDb = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    if (values.length < 2) continue;

    const firstName = values[0] || '';
    const lastName = values[1] || '';
    const name = `${firstName} ${lastName}`.trim();
    const phone = values[2] || '';
    const email = (values[3] || '').toLowerCase().trim();
    const notes = values[4] || '';
    const daysSinceLastAppt = values[5] || '';

    if (!name) continue;

    const cleanPhone = phone.replace(/\D/g, '');
    const nameKey = name.toLowerCase();

    // 1. Deduplicate within the CSV itself
    if (email && csvEmails.has(email)) { dupInCsv++; continue; }
    if (cleanPhone && csvPhones.has(cleanPhone)) { dupInCsv++; continue; }
    if (nameKey && csvNames.has(nameKey)) { dupInCsv++; continue; }

    // 2. Deduplicate against existing database records
    if (email && existingEmails.has(email)) { dupInDb++; continue; }
    if (cleanPhone && existingPhones.has(cleanPhone)) { dupInDb++; continue; }
    if (nameKey && existingNames.has(nameKey)) { dupInDb++; continue; }

    // Add to CSV sets for tracking uniqueness
    if (email) csvEmails.add(email);
    if (cleanPhone) csvPhones.add(cleanPhone);
    csvNames.add(nameKey);

    // Calculate dates
    let apptDateObj = new Date();
    if (daysSinceLastAppt && !isNaN(Number(daysSinceLastAppt))) {
      apptDateObj = new Date(Date.now() - Number(daysSinceLastAppt) * 24 * 60 * 60 * 1000);
    }
    const appointmentDate = apptDateObj.toISOString().split('T')[0];

    // Card renewal date is exactly 2 years from the last appointment for OK patients
    const renewalDateObj = new Date(apptDateObj);
    renewalDateObj.setFullYear(renewalDateObj.getFullYear() + 2);
    const renewalDate = renewalDateObj.toISOString().split('T')[0];

    // Format phone
    let cleanPhoneCRM = phone;
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length === 10) {
      cleanPhoneCRM = `(${cleanDigits.slice(0,3)}) ${cleanDigits.slice(3,6)}-${cleanDigits.slice(6)}`;
    }

    toImport.push({
      name: name,
      contactName: name,
      type: 'patient',
      stage: 'lead',
      value: 0,
      assignedTo: 'unassigned',
      phone: cleanPhoneCRM,
      email: email,
      jurisdiction: 'Oklahoma',
      notes: `Imported from Acuity CSV export.\nDays Since Last Appointment: ${daysSinceLastAppt}\nLast Appt Date (Est): ${appointmentDate}\nCalculated Card Expiry/Renewal: ${renewalDate}\n\nNotes: ${notes}`,
      licenseStatus: new Date(renewalDate) < new Date() ? 'Expired' : 'Active',
      licenseExpiration: renewalDate,
      source: 'Acuity CSV Import',
      updatedAt: new Date(),
      createdAt: new Date()
    });
  }

  console.log(`\n📊 Import Analysis:`);
  console.log(`   Unique records in CSV: ${csvNames.size}`);
  console.log(`   Filtered out internal duplicates: ${dupInCsv}`);
  console.log(`   Filtered out existing CRM records: ${dupInDb}`);
  console.log(`   Total new unique patients to write: ${toImport.length}\n`);

  if (toImport.length === 0) {
    console.log('✅ No new unique records to import.');
    process.exit(0);
  }

  // Batch insert into crm_deals
  const BATCH_SIZE = 400;
  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const chunk = toImport.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);
    
    for (const record of chunk) {
      const ref = doc(collection(db, 'crm_deals'));
      batch.set(ref, record);
    }
    
    await batch.commit();
    console.log(`   ✅ Imported batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} clients`);
  }

  console.log('\n🎉 Import & Deduplication successfully complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});

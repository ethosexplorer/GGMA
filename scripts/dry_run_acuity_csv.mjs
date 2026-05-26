import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'dry-run');
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
  const auth = getAuth(app);
  console.log('🔐 Authenticating Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.');

  console.log('🔄 Loading existing Firestore CRM records to build duplication index...');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const existingEmails = new Set();
  const existingNames = new Set();
  const existingPhones = new Set();

  snap.docs.forEach(d => {
    const data = d.data();
    if (data.email) existingEmails.add(data.email.toLowerCase().trim());
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
    if (data.phone) {
      const clean = data.phone.replace(/\D/g, '');
      if (clean) existingPhones.add(clean);
    }
  });

  console.log(`   Loaded ${snap.size} records from Firestore.`);

  console.log('📂 Reading Acuity CSV...');
  const csvText = readFileSync(CSV_PATH, 'utf-8');
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  const header = parseCSVRow(lines[0]);
  console.log('   Headers:', header);

  let totalRows = lines.length - 1;
  console.log(`   Total rows in CSV: ${totalRows}`);

  const uniqueInCsv = [];
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

    // 1. Check for duplicates within the CSV itself
    if (email && csvEmails.has(email)) { dupInCsv++; continue; }
    if (cleanPhone && csvPhones.has(cleanPhone)) { dupInCsv++; continue; }
    if (nameKey && csvNames.has(nameKey)) { dupInCsv++; continue; }

    // 2. Check for duplicates against existing DB records
    if (email && existingEmails.has(email)) { dupInDb++; continue; }
    if (cleanPhone && existingPhones.has(cleanPhone)) { dupInDb++; continue; }
    if (nameKey && existingNames.has(nameKey)) { dupInDb++; continue; }

    // Unique!
    if (email) csvEmails.add(email);
    if (cleanPhone) csvPhones.add(cleanPhone);
    csvNames.add(nameKey);

    uniqueInCsv.push({ name, email, phone, notes, daysSinceLastAppt });
  }

  console.log(`\n=== Dry Run Results ===`);
  console.log(`CSV Rows Analyzed: ${totalRows}`);
  console.log(`Duplicates within CSV: ${dupInCsv}`);
  console.log(`Duplicates already in GGP-OS DB: ${dupInDb}`);
  console.log(`New Unique Patients to Import: ${uniqueInCsv.length}`);
}

main().catch(console.error);

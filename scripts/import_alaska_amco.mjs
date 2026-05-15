// Alaska AMCO Marijuana Establishments → Firebase CRM Import
// Source: https://www.commerce.alaska.gov/web/amco/home.aspx
// Spreadsheet: MJinitiatedapplist.xlsx (652 records)
// Note: Alaska uses METRC (Franwell) for inventory tracking
// Medical marijuana info: https://health.alaska.gov/media/ocjibnfh/medicalmarijuana.pdf
import { initializeApp } from 'firebase/app';
import { collection, getDocs, doc, writeBatch, getFirestore } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';
import XLSX from 'xlsx';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'alaska-import');
const db = getFirestore(app);

// Map Alaska license types → CRM entity types
function mapLicenseType(type) {
  if (!type) return 'dispensary';
  const t = type.toLowerCase();
  if (t.includes('retail')) return 'dispensary';
  if (t.includes('standard') && t.includes('cultivation')) return 'grower';
  if (t.includes('limited') && t.includes('cultivation')) return 'grower';
  if (t.includes('product manufacturing')) return 'processor';
  if (t.includes('concentrate')) return 'processor';
  if (t.includes('testing')) return 'other';
  return 'dispensary';
}

// Map Alaska status → CRM licenseStatus
function mapStatus(status) {
  if (!status) return 'Active';
  const s = status.toLowerCase();
  if (s.includes('active-operating')) return 'Active';
  if (s.includes('active-pending')) return 'Active - Pending Inspection';
  if (s.includes('delegated')) return 'Delegated';
  if (s.includes('complete')) return 'Application Complete';
  if (s.includes('queue')) return 'In Queue';
  if (s.includes('tabled')) return 'Tabled';
  if (s === 'expired') return 'Expired';
  if (s === 'surrendered') return 'Surrendered';
  if (s === 'revoked') return 'Revoked';
  return status;
}

// Excel serial date → readable date string
function excelDateToStr(serial) {
  if (!serial || typeof serial !== 'number') return '';
  const date = new Date((serial - 25569) * 86400 * 1000);
  return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
}

async function importAlaska() {
  console.log('🏔️  Alaska AMCO Marijuana Establishments Importer');
  console.log('   Uses METRC (Franwell) inventory tracking system');
  console.log('===================================================\n');

  const auth = getAuth(app);
  console.log('🔐 Authenticating...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');

  // Parse spreadsheet
  console.log('📄 Reading Alaska AMCO spreadsheet...');
  const wb = XLSX.readFile('scripts/alaska_mj_applicants.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const allRows = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    const first = String(row[0] || '').trim();
    if (first === 'License#') continue;
    if (!isNaN(Number(first)) && Number(first) > 0) {
      allRows.push({
        license: first,
        type: String(row[1] || '').trim(),
        name: String(row[2] || '').trim(),
        status: String(row[3] || '').trim(),
        address: String(row[4] || '').trim(),
        address2: String(row[5] || '').trim(),
        city: String(row[6] || '').trim(),
        issueDate: excelDateToStr(row[7]),
        effectiveDate: excelDateToStr(row[8]),
        expireDate: excelDateToStr(row[9]),
      });
    }
  }
  console.log(`   Parsed ${allRows.length} records.\n`);

  // Stats
  const typeCounts = {};
  const statusCounts = {};
  allRows.forEach(r => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });

  console.log('📊 BY LICENSE TYPE:');
  for (const [type, count] of Object.entries(typeCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`   ${type.padEnd(48)} ${count}`);
  }
  console.log('\n📊 BY STATUS:');
  for (const [status, count] of Object.entries(statusCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`   ${status.padEnd(30)} ${count}`);
  }

  // Dedup
  const crmRef = collection(db, 'crm_deals');
  console.log('\n📊 Loading existing records for dedup...');
  const existingSnap = await getDocs(crmRef);
  const existingNames = new Set();
  const existingLicenses = new Set();
  existingSnap.docs.forEach(d => {
    const data = d.data();
    if (data.name) existingNames.add(data.name.toLowerCase().trim());
    if (data.licenseNumber) existingLicenses.add(String(data.licenseNumber).trim());
  });

  const toImport = allRows.filter(r => {
    return !existingLicenses.has(r.license) && !existingNames.has(r.name.toLowerCase().trim());
  });

  const skipped = allRows.length - toImport.length;
  console.log(`   ${skipped} already exist. ${toImport.length} new to import.\n`);

  if (toImport.length === 0) {
    console.log('✅ Nothing new to import.');
    process.exit(0);
  }

  // Batch import
  console.log(`🚀 Importing ${toImport.length} records...\n`);
  const BATCH_SIZE = 400;
  let imported = 0;

  for (let i = 0; i < toImport.length; i += BATCH_SIZE) {
    const chunk = toImport.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const r of chunk) {
      const ref = doc(crmRef);
      const fullAddress = [r.address, r.address2].filter(Boolean).join(', ');
      batch.set(ref, {
        name: r.name,
        contactName: '',
        type: mapLicenseType(r.type),
        stage: 'lead',
        value: 0,
        assignedTo: 'unassigned',
        phone: '',
        email: '',
        licenseNumber: r.license,
        licenseStatus: mapStatus(r.status),
        licenseType: r.type,
        licenseExpiration: r.expireDate,
        jurisdiction: 'Alaska',
        notes: `AMCO License #${r.license} | ${r.type} | ${fullAddress}, ${r.city}, AK | Issued: ${r.issueDate} | METRC tracked | Source: commerce.alaska.gov/web/amco`,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
    }

    let retries = 0;
    while (retries < 5) {
      try {
        await batch.commit();
        break;
      } catch (err) {
        retries++;
        if (retries >= 5) { console.error(`Batch failed after 5 retries`); process.exit(1); }
        const wait = Math.pow(2, retries) * 3;
        console.log(`   ⏳ Quota hit, retrying in ${wait}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      }
    }

    imported += chunk.length;
    const pct = Math.round((imported / toImport.length) * 100);
    console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} records (${imported}/${toImport.length} — ${pct}%)`);

    if (i + BATCH_SIZE < toImport.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n===================================================`);
  console.log(`🎉 ALASKA IMPORT COMPLETE`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Tracking: METRC (Franwell)`);
  console.log(`===================================================\n`);

  process.exit(0);
}

importAlaska().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});

/**
/**
 * CLEANUP INACTIVE LICENSES & ARCHIVE HISTORY
 * 
 * 1. Identify records with licenseStatus: Canceled, Cancelled, Surrendered, Suspended, Revoked, Suspended/Revoked.
 * 2. Identify records with licenseStatus: Expired AND licenseExpiration date < May 30, 2024 (over 2 years ago).
 * 3. Write records to a local JSONL backup file in `scripts/knowledge/archived_inactive_licenses.jsonl` to keep history.
 * 4. Delete records from production CRM database collections.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'inactive-cleanup');
const db = getFirestore(app);
const auth = getAuth(app);

const sleep = ms => new Promise(r => setTimeout(r, ms));
const isDryRun = process.argv.includes('--dry-run');

// May 30, 2026 is current system date, so 2 years ago is May 30, 2024
function isExpiredOverTwoYears(expString) {
  if (!expString) return false;
  const parsedDate = new Date(expString);
  if (isNaN(parsedDate.getTime())) return false;
  const cutoffDate = new Date('2026-05-30');
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 2); // 2024-05-30
  return parsedDate < cutoffDate;
}

const STATUSES_TO_DELETE = [
  'canceled', 'cancelled', 'surrendered',
  'suspended/revoked', 'suspended', 'revoked'
];

function checkDeletion(data) {
  const status = (data.licenseStatus || '').toLowerCase().trim();
  if (STATUSES_TO_DELETE.includes(status)) {
    return { shouldDelete: true, reason: `Status is "${data.licenseStatus}"` };
  }
  if (status === 'expired') {
    const expDate = data.licenseExpiration || '';
    if (isExpiredOverTwoYears(expDate)) {
      return { shouldDelete: true, reason: `Expired over 2 years (Expired on: ${expDate})` };
    }
  }
  return { shouldDelete: false, reason: '' };
}

async function runCleanup() {
  console.log('═══════════════════════════════════════════════════');
  console.log(`🧹 CRM INACTIVE LICENSE CLEANUP ${isDryRun ? '(DRY RUN)' : '(REAL RUN)'}`);
  console.log('═══════════════════════════════════════════════════\n');

  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');

  // Ensure backup directory exists
  const backupDir = join('.', 'scripts', 'knowledge');
  if (!isDryRun && !existsSync(backupDir)) {
    mkdirSync(backupDir, { recursive: true });
  }
  const backupFilePath = join(backupDir, 'archived_inactive_licenses.jsonl');

  const collectionsList = ['crm_deals', 'executive_crm_deals', 'crm_contacts', 'executive_crm_contacts'];
  
  let totalProcessed = 0;
  let totalDeleted = 0;
  
  const statsByStatus = {};
  const statsByReason = {};
  const statsByState = {};
  const statsByCollection = {};

  for (const collectionName of collectionsList) {
    console.log(`🔍 Scanning collection: ${collectionName}...`);
    try {
      const snap = await getDocs(collection(db, collectionName));
      console.log(`   Found ${snap.size} documents.`);

      statsByCollection[collectionName] = { scanned: snap.size, deleted: 0 };

      for (const d of snap.docs) {
        totalProcessed++;
        const data = d.data();
        const check = checkDeletion(data);

        if (check.shouldDelete) {
          totalDeleted++;
          statsByCollection[collectionName].deleted++;

          const status = data.licenseStatus || 'Unknown';
          const state = data.jurisdiction || data.state || '??';
          
          statsByStatus[status] = (statsByStatus[status] || 0) + 1;
          statsByReason[check.reason] = (statsByReason[check.reason] || 0) + 1;
          statsByState[state] = (statsByState[state] || 0) + 1;

          if (!isDryRun) {
            // Backup record to JSONL file
            const backupRecord = {
              id: d.id,
              collection: collectionName,
              archivedAt: new Date().toISOString(),
              reason: check.reason,
              data
            };
            appendFileSync(backupFilePath, JSON.stringify(backupRecord) + '\n', 'utf-8');

            // Delete from Firestore
            try {
              await deleteDoc(doc(db, collectionName, d.id));
              await sleep(60); // Throttle to prevent rate limit
            } catch (err) {
              console.error(`   ❌ Failed to delete ${d.id}: ${err.message}`);
              await sleep(1000);
            }
          }
        }
      }
      console.log(`   Processed ${collectionName}: ${statsByCollection[collectionName].deleted} marked for cleanup.\n`);
    } catch (err) {
      console.error(`   ⚠️  Skip collection "${collectionName}" due to error: ${err.message}\n`);
      statsByCollection[collectionName] = { scanned: 0, deleted: 0, error: err.message };
    }
  }

  console.log('===================================================');
  console.log(`📊 CLEANUP SUMMARY ${isDryRun ? '(DRY RUN — NO DATA CHANGED)' : '(REAL CLEANUP RUN)'}`);
  console.log('===================================================');
  console.log(`   Total Scanned:         ${totalProcessed.toLocaleString()}`);
  console.log(`   Total to Delete:       ${totalDeleted.toLocaleString()}`);
  
  if (totalDeleted > 0) {
    console.log('\n   BY COLLECTION:');
    Object.entries(statsByCollection).forEach(([col, c]) => {
      console.log(`      - ${col.padEnd(25)} Scanned: ${c.scanned.toLocaleString().padStart(6)} | Deleted: ${c.deleted.toLocaleString().padStart(6)}`);
    });

    console.log('\n   BY STATUS:');
    Object.entries(statsByStatus).sort((a,b) => b[1]-a[1]).forEach(([status, count]) => {
      console.log(`      - ${status.padEnd(25)} ${count.toLocaleString().padStart(6)}`);
    });

    console.log('\n   BY DELETION REASON:');
    Object.entries(statsByReason).sort((a,b) => b[1]-a[1]).forEach(([reason, count]) => {
      console.log(`      - ${reason.padEnd(45)} ${count.toLocaleString().padStart(6)}`);
    });

    console.log('\n   TOP STATES IMPACTED:');
    Object.entries(statsByState).sort((a,b) => b[1]-a[1]).slice(0, 15).forEach(([state, count]) => {
      console.log(`      - ${state.padEnd(25)} ${count.toLocaleString().padStart(6)}`);
    });

    if (!isDryRun) {
      console.log(`\n💾 Saved backup of deleted records to: ${backupFilePath}`);
    }
  }
  console.log('===================================================\n');
  process.exit(0);
}

runCleanup().catch(err => {
  console.error('Fatal cleanup error:', err);
  process.exit(1);
});

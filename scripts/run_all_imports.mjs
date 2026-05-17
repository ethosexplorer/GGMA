/**
 * Master batch runner — imports all states that were blocked by Firestore quota.
 * Runs each import script sequentially to avoid overwhelming Firestore.
 */
import { execSync } from 'child_process';

const SCRIPTS = [
  // States that had 0 records or partial imports
  'scripts/import_newjersey_entities.mjs',
  'scripts/import_newmexico_entities.mjs',
  'scripts/import_northcarolina_entities.mjs',
  'scripts/import_northdakota_entities.mjs',
  'scripts/import_ohio_entities.mjs',
  'scripts/import_oregon_entities.mjs',
  'scripts/import_pennsylvania_entities.mjs',
  'scripts/import_rhodeisland_entities.mjs',
  'scripts/import_southcarolina_entities.mjs',
  'scripts/import_southdakota_entities.mjs',
  'scripts/import_tennessee_entities.mjs',
  'scripts/import_texas_entities.mjs',
  'scripts/import_utah_entities.mjs',
  'scripts/import_vermont_entities.mjs',
  'scripts/import_virginia_entities.mjs',
  'scripts/import_washington_entities.mjs',
  'scripts/import_westvirginia_entities.mjs',
  'scripts/import_wisconsin_entities.mjs',
  'scripts/import_wyoming_entities.mjs',
  'scripts/import_nevada_entities.mjs',
  'scripts/import_newhampshire_entities.mjs',
  // Gov advocates master file
  'scripts/import_gov_advocates.mjs',
];

let total = 0;
let failed = 0;

for (const script of SCRIPTS) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`▶ Running: ${script}`);
  console.log('='.repeat(60));
  try {
    const output = execSync(`node ${script}`, { encoding: 'utf8', timeout: 120000 });
    console.log(output);
    total++;
  } catch (err) {
    console.error(`❌ FAILED: ${script}`);
    console.error(err.stderr || err.message);
    failed++;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`🏁 BATCH IMPORT COMPLETE`);
console.log(`   ✅ Successful: ${total}`);
console.log(`   ❌ Failed: ${failed}`);
console.log('='.repeat(60));
process.exit(failed > 0 ? 1 : 0);

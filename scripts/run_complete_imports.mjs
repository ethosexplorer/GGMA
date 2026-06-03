import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SCRIPTS_DIR = './scripts';

// Find all import scripts
const scripts = fs.readdirSync(SCRIPTS_DIR)
  .filter(f => f.startsWith('import_') && f.endsWith('.mjs'))
  // Exclude bulk CSV importers
  .filter(f => f !== 'import_omma_csv.mjs' && f !== 'import_large_acuity_csv.mjs')
  .map(f => path.join(SCRIPTS_DIR, f));

console.log(`🚀 Found ${scripts.length} import scripts to execute sequentially...`);

let successful = 0;
let failed = 0;

for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i];
  console.log(`\n======================================== [${i + 1}/${scripts.length}]`);
  console.log(`▶ Running: ${script}`);
  console.log('========================================');
  try {
    const output = execSync(`node ${script}`, { encoding: 'utf8', timeout: 180000 });
    console.log(output);
    successful++;
  } catch (err) {
    console.error(`❌ FAILED: ${script}`);
    console.error(err.stderr || err.message);
    failed++;
  }
}

console.log('\n========================================');
console.log('🏁 COMPLETE PORTFOLIO SEEDING COMPLETED');
console.log(`   ✅ Successfully executed: ${successful}`);
console.log(`   ❌ Failed to execute:      ${failed}`);
console.log('========================================');

process.exit(failed > 0 ? 1 : 0);

#!/usr/bin/env node
// ============================================================
// GGMA Enforcement Ingestion Pipeline
//
// Takes scraped enforcement records (JSON) and:
// 1. Validates each record
// 2. Deduplicates against existing Turso data
// 3. Detects status changes (e.g., Suspended → Reinstated)
// 4. Inserts new records / updates changed records
// 5. Flags stale records that haven't been re-verified
//
// Usage:
//   node scripts/enforcement/ingest.mjs < records.json
//   node scripts/enforcement/ingest.mjs --file results.json
// ============================================================

import { createClient } from '@libsql/client';
import fs from 'fs';

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'libsql://gghp-gghp.aws-us-east-2.turso.io';
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

if (!TURSO_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN is required. Set via environment variable.');
  process.exit(1);
}

const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

// ── Schema migration ────────────────────────────────────────────
async function ensureSchema() {
  console.log('📐 Ensuring enforcement table schema is up to date...');

  // Add new columns if they don't exist (SQLite doesn't support IF NOT EXISTS for ALTER TABLE)
  const columnsToAdd = [
    { name: 'state', type: 'TEXT DEFAULT ""' },
    { name: 'action_type', type: 'TEXT DEFAULT ""' },
    { name: 'effective_date', type: 'TEXT DEFAULT ""' },
    { name: 'resolution_date', type: 'TEXT DEFAULT ""' },
    { name: 'source_url', type: 'TEXT DEFAULT ""' },
    { name: 'last_verified', type: 'DATETIME' },
    { name: 'confidence', type: 'TEXT DEFAULT "unverified"' },
    { name: 'raw_text', type: 'TEXT DEFAULT ""' },
    { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
  ];

  for (const col of columnsToAdd) {
    try {
      await turso.execute(`ALTER TABLE omma_enforcement_records ADD COLUMN ${col.name} ${col.type}`);
      console.log(`   ✅ Added column: ${col.name}`);
    } catch (err) {
      // Column already exists — this is expected and fine
      if (!err.message.includes('duplicate column')) {
        // Only log non-duplicate errors
        if (!err.message.includes('already exists')) {
          console.log(`   ⚠️ Column ${col.name}: ${err.message}`);
        }
      }
    }
  }

  console.log('   ✅ Schema is current.');
}

// ── Validation ──────────────────────────────────────────────────
function validateRecord(record) {
  const errors = [];

  if (!record.state || record.state.length !== 2) errors.push('Invalid state code');
  if (!record.business_name || record.business_name.length < 2) errors.push('Missing business name');
  if (!record.source_url || !record.source_url.startsWith('http')) errors.push('Missing or invalid source_url');

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ── Deduplication + Upsert ──────────────────────────────────────
async function ingestRecords(records) {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let invalid = 0;

  for (const record of records) {
    const validation = validateRecord(record);
    if (!validation.valid) {
      console.log(`   ⚠️ Skipping invalid record: ${validation.errors.join(', ')} — ${record.business_name || 'unknown'}`);
      invalid++;
      continue;
    }

    // Check if record already exists by license_number + state
    let existing = null;
    if (record.license_number) {
      const check = await turso.execute({
        sql: 'SELECT id, status, confidence, last_verified FROM omma_enforcement_records WHERE license_number = ? AND state = ?',
        args: [record.license_number, record.state],
      });
      if (check.rows.length > 0) existing = check.rows[0];
    }

    // Also check by business_name + state if no license match
    if (!existing && record.business_name) {
      const check = await turso.execute({
        sql: 'SELECT id, status, confidence, last_verified FROM omma_enforcement_records WHERE business_name = ? AND state = ?',
        args: [record.business_name, record.state],
      });
      if (check.rows.length > 0) existing = check.rows[0];
    }

    if (existing) {
      // Record exists — check for status change
      if (existing.status !== record.status) {
        console.log(`   🔄 Status change detected: ${record.business_name} [${existing.status} → ${record.status}]`);
        await turso.execute({
          sql: `UPDATE omma_enforcement_records SET 
            status = ?, enforcement_action = ?, reasons = ?, source_url = ?,
            last_verified = CURRENT_TIMESTAMP, confidence = ?, updated_at = CURRENT_TIMESTAMP,
            effective_date = ?, raw_text = ?
            WHERE id = ?`,
          args: [
            record.status, record.action_type, record.reasons, record.source_url,
            record.confidence || 'verified', record.effective_date || '', record.raw_text || '',
            existing.id,
          ],
        });
        updated++;
      } else {
        // Same status — just refresh the last_verified timestamp
        await turso.execute({
          sql: 'UPDATE omma_enforcement_records SET last_verified = CURRENT_TIMESTAMP, confidence = ? WHERE id = ?',
          args: [record.confidence || 'verified', existing.id],
        });
        skipped++;
      }
    } else {
      // New record — insert
      await turso.execute({
        sql: `INSERT INTO omma_enforcement_records 
          (business_name, dba, license_number, license_type, status, enforcement_action,
           dates_connected, reasons, state, action_type, effective_date, resolution_date,
           source_url, last_verified, confidence, raw_text, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP)`,
        args: [
          record.business_name, record.dba || '', record.license_number || '',
          record.license_type || '', record.status || '', record.action_type || '',
          record.effective_date || '', record.reasons || '', record.state,
          record.action_type || '', record.effective_date || '', record.resolution_date || '',
          record.source_url, record.confidence || 'verified', record.raw_text || '',
        ],
      });
      inserted++;
    }
  }

  return { inserted, updated, skipped, invalid };
}

// ── Staleness check ─────────────────────────────────────────────
async function flagStaleRecords() {
  console.log('\n🕐 Checking for stale records (not verified in 30+ days)...');

  const result = await turso.execute(`
    UPDATE omma_enforcement_records 
    SET confidence = 'stale'
    WHERE last_verified IS NOT NULL 
      AND last_verified < datetime('now', '-30 days')
      AND confidence = 'verified'
  `);

  console.log(`   📋 Flagged ${result.rowsAffected || 0} records as stale.`);

  const unverifiedResult = await turso.execute(`
    UPDATE omma_enforcement_records 
    SET confidence = 'unverified'
    WHERE last_verified IS NULL OR last_verified = ''
  `);

  console.log(`   📋 Flagged ${unverifiedResult.rowsAffected || 0} records as unverified (no verification timestamp).`);
}

// ── Main execution ──────────────────────────────────────────────
async function main() {
  console.log('🚀 GGMA Enforcement Ingestion Pipeline');
  console.log('═'.repeat(50));

  await ensureSchema();

  // Read records from file or stdin
  let jsonData = '';

  const fileArg = process.argv.indexOf('--file');
  if (fileArg !== -1 && process.argv[fileArg + 1]) {
    const filePath = process.argv[fileArg + 1];
    console.log(`\n📂 Reading records from: ${filePath}`);
    jsonData = fs.readFileSync(filePath, 'utf8');
  } else {
    // Read from stdin
    console.log('\n📥 Reading records from stdin...');
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    jsonData = Buffer.concat(chunks).toString();
  }

  // Parse the JSON — handle both raw array and the wrapped format from the scraper
  let records;
  try {
    // Try to extract from the scraper's wrapped output
    const jsonMatch = jsonData.match(/ENFORCEMENT_RESULTS_JSON_START\s*([\s\S]*?)\s*ENFORCEMENT_RESULTS_JSON_END/);
    if (jsonMatch) {
      records = JSON.parse(jsonMatch[1]);
    } else {
      records = JSON.parse(jsonData);
    }
  } catch (err) {
    console.error('❌ Failed to parse JSON input:', err.message);
    process.exit(1);
  }

  if (!Array.isArray(records)) {
    console.error('❌ Input must be a JSON array of records.');
    process.exit(1);
  }

  console.log(`\n📊 Processing ${records.length} records...`);
  const results = await ingestRecords(records);

  console.log('\n' + '═'.repeat(50));
  console.log('📊 INGESTION RESULTS:');
  console.log(`   🆕 Inserted:   ${results.inserted}`);
  console.log(`   🔄 Updated:    ${results.updated}`);
  console.log(`   ⏭️  Unchanged:  ${results.skipped}`);
  console.log(`   ❌ Invalid:    ${results.invalid}`);
  console.log('═'.repeat(50));

  await flagStaleRecords();

  console.log('\n✅ Ingestion pipeline complete.');
}

main().catch(err => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});

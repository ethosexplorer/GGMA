#!/usr/bin/env node
// ============================================================
// GGMA Enforcement Pipeline — Full Orchestrator
//
// Runs the complete enforcement data pipeline:
// 1. Scrapes all configured state enforcement pages
// 2. Validates and deduplicates results
// 3. Ingests into Turso database
// 4. Flags stale/unverified records
// 5. Outputs a summary report
//
// This is what GitHub Actions calls on a daily schedule.
//
// Usage:
//   node scripts/enforcement/runner.mjs           # Run all states
//   node scripts/enforcement/runner.mjs OK CA CO   # Run specific states
// ============================================================

import puppeteer from 'puppeteer';
import { createClient } from '@libsql/client';
import { STATE_ENFORCEMENT_SOURCES } from './config.mjs';

const TURSO_URL = process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'libsql://gghp-gghp.aws-us-east-2.turso.io';
const TURSO_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

if (!TURSO_TOKEN) {
  console.error('❌ TURSO_AUTH_TOKEN is required.');
  process.exit(1);
}

const turso = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

// ── Import scraper + ingest functions inline ────────────────────
// (Duplicated here to keep runner self-contained for GitHub Actions)

function extractPattern(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function classifyActionType(text) {
  const lower = text.toLowerCase();
  if (lower.includes('emergency suspension')) return 'Emergency Suspension';
  if (lower.includes('suspend')) return 'Suspension';
  if (lower.includes('revok') || lower.includes('revoc')) return 'Revocation';
  if (lower.includes('forfeit')) return 'Forfeiture';
  if (lower.includes('surrender')) return 'Surrender';
  if (lower.includes('fine') || lower.includes('penalty') || lower.includes('$')) return 'Fine';
  if (lower.includes('warning')) return 'Warning';
  if (lower.includes('citation')) return 'Citation';
  if (lower.includes('consent order')) return 'Consent Order';
  if (lower.includes('probation')) return 'Probation';
  if (lower.includes('reinstat')) return 'Reinstatement';
  return 'Enforcement Action';
}

function classifyStatus(text) {
  const lower = text.toLowerCase();
  if (lower.includes('revoked')) return 'Revoked';
  if (lower.includes('suspended')) return 'Suspended';
  if (lower.includes('forfeited')) return 'Forfeited';
  if (lower.includes('surrendered')) return 'Surrendered';
  if (lower.includes('active')) return 'Active';
  if (lower.includes('closed')) return 'Closed';
  if (lower.includes('resolved')) return 'Resolved';
  if (lower.includes('pending')) return 'Pending';
  return 'Under Review';
}

async function scrapeState(stateCode, config) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🔍 [${stateCode}] ${config.name} — ${config.authority}`);
  console.log(`   URL: ${config.enforcementUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const records = [];

  try {
    await page.goto(config.enforcementUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 3000));

    // Extract tables
    const tableData = await page.evaluate(() => {
      const tables = Array.from(document.querySelectorAll('table'));
      const results = [];
      for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('thead th, thead td, tr:first-child th, tr:first-child td'))
          .map(th => th.innerText.trim().toLowerCase());
        const rows = Array.from(table.querySelectorAll('tbody tr, tr:not(:first-child)'));
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
          if (cells.length >= 2 && cells.some(c => c.length > 0)) {
            results.push({ headers, cells, rawText: row.innerText.trim() });
          }
        }
      }
      return results;
    });

    for (const row of tableData) {
      const findCol = (keywords) => {
        for (const kw of keywords) {
          const idx = row.headers.findIndex(h => h.includes(kw));
          if (idx !== -1 && row.cells[idx]) return row.cells[idx];
        }
        return '';
      };

      const businessName = findCol(['business', 'licensee', 'company', 'entity', 'name']) || row.cells[0] || '';
      if (!businessName || businessName.length < 2) continue;

      records.push({
        state: stateCode,
        business_name: businessName.substring(0, 200),
        dba: findCol(['dba', 'doing business', 'trade name']),
        license_number: findCol(['license', 'permit', 'registration']) || extractPattern(row.rawText, /([A-Z]{1,4}[-\s]?\d{3,10}[-\s]?\d{0,10})/i),
        license_type: findCol(['license type', 'category', 'class']),
        action_type: findCol(['action', 'type', 'disciplin', 'sanction']) || classifyActionType(row.rawText),
        status: findCol(['status', 'result', 'disposition']) || classifyStatus(row.rawText),
        effective_date: findCol(['date', 'effective', 'issued']) || extractPattern(row.rawText, /(\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2},? \d{4})/),
        reasons: findCol(['reason', 'violation', 'description', 'details', 'charge']),
        source_url: config.enforcementUrl,
        confidence: 'verified',
        raw_text: row.rawText.substring(0, 1000),
      });
    }

    // Also try list/article extraction
    if (records.length === 0) {
      const listData = await page.evaluate(() => {
        const selectors = ['article', '.card', '.panel', 'li', '[class*="enforce"]', '[class*="action"]', '[class*="disciplin"]'];
        const results = [];
        const seen = new Set();
        for (const selector of selectors) {
          const elements = Array.from(document.querySelectorAll(selector));
          for (const el of elements) {
            const text = el.innerText.trim();
            const hasKeywords = /suspend|revok|forfeit|violat|fine|penalt|citation|disciplin|consent order/i.test(text);
            if (hasKeywords && text.length > 30 && text.length < 5000 && !seen.has(text)) {
              seen.add(text);
              results.push(text);
            }
          }
        }
        return results;
      });

      for (const text of listData) {
        const businessName = extractPattern(text, /(?:business|licensee|company|entity)[:\s]+([^\n,]+)/i) ||
          extractPattern(text, /^([A-Z][A-Za-z\s&.,']+(?:LLC|Inc|Corp|Co|LP|Ltd)?)/m) || '';
        if (!businessName || businessName.length < 3) continue;

        records.push({
          state: stateCode,
          business_name: businessName.trim().substring(0, 200),
          dba: extractPattern(text, /(?:DBA|d\/b\/a)[:\s]+([^\n,]+)/i),
          license_number: extractPattern(text, /(?:license|permit)\s*#?\s*[:\s]+([A-Z0-9][-A-Z0-9]+)/i),
          license_type: extractPattern(text, /(?:license type|category)[:\s]+([^\n,]+)/i),
          action_type: classifyActionType(text),
          status: classifyStatus(text),
          effective_date: extractPattern(text, /(?:effective|date)[:\s]+(\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2},? \d{4})/i),
          reasons: extractPattern(text, /(?:reason|violation|charge)[:\s]+([^\n]+)/i) || text.substring(0, 300),
          source_url: config.enforcementUrl,
          confidence: 'verified',
          raw_text: text.substring(0, 1000),
        });
      }
    }

    console.log(`   ✅ Scraped ${records.length} records`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }

  return records;
}

// ── Ingestion ───────────────────────────────────────────────────
async function ingestRecords(records) {
  let inserted = 0, updated = 0, skipped = 0, invalid = 0;

  for (const record of records) {
    if (!record.state || !record.business_name || !record.source_url) {
      invalid++;
      continue;
    }

    // Check for existing record
    let existing = null;
    if (record.license_number) {
      const check = await turso.execute({
        sql: 'SELECT id, status FROM omma_enforcement_records WHERE license_number = ? AND state = ?',
        args: [record.license_number, record.state],
      });
      if (check.rows.length > 0) existing = check.rows[0];
    }
    if (!existing) {
      const check = await turso.execute({
        sql: 'SELECT id, status FROM omma_enforcement_records WHERE business_name = ? AND state = ?',
        args: [record.business_name, record.state],
      });
      if (check.rows.length > 0) existing = check.rows[0];
    }

    if (existing) {
      if (existing.status !== record.status) {
        await turso.execute({
          sql: `UPDATE omma_enforcement_records SET status = ?, enforcement_action = ?, reasons = ?, source_url = ?,
                last_verified = CURRENT_TIMESTAMP, confidence = 'verified', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          args: [record.status, record.action_type, record.reasons, record.source_url, existing.id],
        });
        updated++;
      } else {
        await turso.execute({
          sql: `UPDATE omma_enforcement_records SET last_verified = CURRENT_TIMESTAMP, confidence = 'verified' WHERE id = ?`,
          args: [existing.id],
        });
        skipped++;
      }
    } else {
      try {
        await turso.execute({
          sql: `INSERT INTO omma_enforcement_records 
            (business_name, dba, license_number, license_type, status, enforcement_action,
             dates_connected, reasons, state, source_url, last_verified, confidence)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'verified')`,
          args: [
            record.business_name, record.dba || '', record.license_number || '',
            record.license_type || '', record.status || '', record.action_type || '',
            record.effective_date || '', record.reasons || '', record.state,
            record.source_url,
          ],
        });
        inserted++;
      } catch (err) {
        if (err.message.includes('UNIQUE constraint')) {
          skipped++;
        } else {
          console.error(`   ⚠️ Insert error: ${err.message}`);
          invalid++;
        }
      }
    }
  }

  return { inserted, updated, skipped, invalid };
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  console.log('🚀 GGMA National Enforcement Pipeline — Full Run');
  console.log('═'.repeat(60));
  console.log(`📅 ${new Date().toISOString()}`);

  // Determine which states to run
  const args = process.argv.slice(2).map(s => s.toUpperCase());
  const statesToRun = args.length > 0
    ? args.filter(s => STATE_ENFORCEMENT_SOURCES[s])
    : Object.keys(STATE_ENFORCEMENT_SOURCES);

  console.log(`\n🎯 Running ${statesToRun.length} state(s): ${statesToRun.join(', ')}`);

  // Ensure schema columns exist
  const columnsToAdd = [
    { name: 'state', type: 'TEXT DEFAULT ""' },
    { name: 'source_url', type: 'TEXT DEFAULT ""' },
    { name: 'last_verified', type: 'DATETIME' },
    { name: 'confidence', type: 'TEXT DEFAULT "unverified"' },
    { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
  ];
  for (const col of columnsToAdd) {
    try { await turso.execute(`ALTER TABLE omma_enforcement_records ADD COLUMN ${col.name} ${col.type}`); }
    catch (_) { /* Column already exists */ }
  }

  // Scrape each state
  const allRecords = [];
  const stateResults = {};

  for (const stateCode of statesToRun) {
    const config = STATE_ENFORCEMENT_SOURCES[stateCode];
    try {
      const records = await scrapeState(stateCode, config);
      allRecords.push(...records);
      stateResults[stateCode] = { scraped: records.length, status: 'success' };
    } catch (err) {
      console.error(`   ❌ [${stateCode}] Fatal error: ${err.message}`);
      stateResults[stateCode] = { scraped: 0, status: 'error', error: err.message };
    }
  }

  // Ingest all records
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📥 INGESTING ${allRecords.length} total records into Turso...`);
  const results = await ingestRecords(allRecords);

  // Flag stale records
  try {
    await turso.execute(`
      UPDATE omma_enforcement_records SET confidence = 'stale'
      WHERE last_verified IS NOT NULL AND last_verified < datetime('now', '-30 days') AND confidence = 'verified'
    `);
  } catch (_) { /* Best effort */ }

  // Summary report
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n${'═'.repeat(60)}`);
  console.log('📊 PIPELINE SUMMARY REPORT');
  console.log(`${'═'.repeat(60)}`);
  console.log(`⏱️  Total time: ${elapsed}s`);
  console.log(`🗺️  States processed: ${Object.keys(stateResults).length}`);
  console.log(`📄 Total records scraped: ${allRecords.length}`);
  console.log(`🆕 New records inserted: ${results.inserted}`);
  console.log(`🔄 Records updated: ${results.updated}`);
  console.log(`⏭️  Unchanged (re-verified): ${results.skipped}`);
  console.log(`❌ Invalid/skipped: ${results.invalid}`);
  console.log(`${'─'.repeat(60)}`);

  console.log('\n📋 PER-STATE BREAKDOWN:');
  for (const [state, data] of Object.entries(stateResults)) {
    const icon = data.status === 'success' ? '✅' : '❌';
    console.log(`   ${icon} ${state}: ${data.scraped} records ${data.error ? `(${data.error})` : ''}`);
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('✅ Pipeline complete.');
}

main().catch(err => {
  console.error('💀 Fatal pipeline error:', err);
  process.exit(1);
});

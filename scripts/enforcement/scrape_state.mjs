#!/usr/bin/env node
// ============================================================
// GGMA National Enforcement Scraper — State Enforcement Page Scraper
// 
// This scraper visits each state's OFFICIAL enforcement/disciplinary
// actions page and extracts enforcement records into a normalized
// JSON format. Each record includes a source_url for 100% verifiability.
//
// Usage:
//   node scripts/enforcement/scrape_state.mjs OK
//   node scripts/enforcement/scrape_state.mjs CA
//   node scripts/enforcement/scrape_state.mjs ALL
// ============================================================

import puppeteer from 'puppeteer';
import { STATE_ENFORCEMENT_SOURCES } from './config.mjs';

// ── Normalized record shape ──────────────────────────────────────
// {
//   state:             'OK',
//   business_name:     'Green Health Clinic LLC',
//   dba:               'Green Health Recommendation Center',
//   license_number:    'OAA-4819-2910',
//   license_type:      'Dispensary',
//   action_type:       'Revocation',
//   status:            'Revoked',
//   effective_date:    '2025-07-14',
//   resolution_date:   null,
//   reasons:           'Compliance failure...',
//   source_url:        'https://oklahoma.gov/omma/enforcement.html',
//   scraped_at:        '2026-05-21T23:00:00.000Z',
//   confidence:        'verified',
//   raw_text:          '...'
// }

/**
 * Generic enforcement page scraper.
 * Visits the state enforcement URL, finds table rows or list items
 * that contain enforcement data, and extracts what it can.
 */
async function scrapeEnforcementPage(stateCode, config) {
  console.log(`\n🔍 [${stateCode}] Scraping enforcement page: ${config.enforcementUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const records = [];

  try {
    await page.goto(config.enforcementUrl, {
      waitUntil: 'networkidle2',
      timeout: 45000,
    });

    // Wait for content to render
    await new Promise(r => setTimeout(r, 3000));

    // ── Strategy: Extract all structured data from tables ────────
    if (config.format === 'html_table') {
      const tableData = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        const results = [];

        for (const table of tables) {
          const headers = Array.from(table.querySelectorAll('thead th, thead td, tr:first-child th, tr:first-child td'))
            .map(th => th.innerText.trim().toLowerCase());

          // Only process tables that look like enforcement data
          const headerText = headers.join(' ');
          const isEnforcementTable = headerText.includes('license') ||
            headerText.includes('action') ||
            headerText.includes('violation') ||
            headerText.includes('business') ||
            headerText.includes('status') ||
            headerText.includes('penalty') ||
            headerText.includes('disciplin');

          if (!isEnforcementTable && headers.length > 0) continue;

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
        const record = parseTableRow(row, stateCode, config.enforcementUrl);
        if (record) records.push(record);
      }
    }

    // ── Strategy: Extract from lists, articles, cards ────────────
    if (config.format === 'html_list' || records.length === 0) {
      const listData = await page.evaluate(() => {
        // Look for structured content blocks that mention enforcement keywords
        const selectors = [
          'article', '.enforcement-action', '.card', '.panel',
          '.list-item', 'li', '.result', '.action-item',
          '[class*="enforce"]', '[class*="action"]', '[class*="disciplin"]',
        ];

        const results = [];
        const seen = new Set();

        for (const selector of selectors) {
          const elements = Array.from(document.querySelectorAll(selector));
          for (const el of elements) {
            const text = el.innerText.trim();
            // Must mention enforcement-related keywords
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
        const record = parseTextBlock(text, stateCode, config.enforcementUrl);
        if (record) records.push(record);
      }
    }

    console.log(`   ✅ [${stateCode}] Extracted ${records.length} enforcement records`);

  } catch (error) {
    console.error(`   ❌ [${stateCode}] Scraper error: ${error.message}`);
  } finally {
    await browser.close();
  }

  return records;
}

/**
 * Parse a table row into a normalized enforcement record.
 */
function parseTableRow(row, stateCode, sourceUrl) {
  const { headers, cells, rawText } = row;

  // Try to map columns by header name
  const findCol = (keywords) => {
    for (const kw of keywords) {
      const idx = headers.findIndex(h => h.includes(kw));
      if (idx !== -1 && cells[idx]) return cells[idx];
    }
    return '';
  };

  const businessName = findCol(['business', 'licensee', 'company', 'entity', 'name']) || cells[0] || 'Unknown';
  const licenseNumber = findCol(['license', 'permit', 'registration']) || extractPattern(rawText, /([A-Z]{1,4}[-\s]?\d{3,10}[-\s]?\d{0,10})/i) || '';
  const actionType = findCol(['action', 'type', 'disciplin', 'sanction']) || classifyActionType(rawText);
  const status = findCol(['status', 'result', 'disposition']) || classifyStatus(rawText);
  const date = findCol(['date', 'effective', 'issued']) || extractPattern(rawText, /(\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2},? \d{4})/);
  const reasons = findCol(['reason', 'violation', 'description', 'details', 'charge']) || '';

  if (!businessName || businessName === 'Unknown') return null;

  return {
    state: stateCode,
    business_name: businessName.substring(0, 200),
    dba: findCol(['dba', 'doing business', 'trade name']) || '',
    license_number: licenseNumber.substring(0, 50),
    license_type: findCol(['license type', 'category', 'class']) || '',
    action_type: actionType,
    status: status,
    effective_date: date || '',
    resolution_date: '',
    reasons: reasons.substring(0, 500),
    source_url: sourceUrl,
    scraped_at: new Date().toISOString(),
    confidence: 'verified',
    raw_text: rawText.substring(0, 1000),
  };
}

/**
 * Parse a free-text block into a normalized enforcement record.
 */
function parseTextBlock(text, stateCode, sourceUrl) {
  const businessName = extractPattern(text, /(?:business|licensee|company|entity)[:\s]+([^\n,]+)/i) ||
    extractPattern(text, /^([A-Z][A-Za-z\s&.,']+(?:LLC|Inc|Corp|Co|LP|Ltd)?)/m) ||
    '';

  if (!businessName || businessName.length < 3) return null;

  const licenseNumber = extractPattern(text, /(?:license|permit|registration)\s*(?:#|number|no\.?)?\s*[:\s]+([A-Z0-9][-A-Z0-9]+)/i) || '';

  return {
    state: stateCode,
    business_name: businessName.trim().substring(0, 200),
    dba: extractPattern(text, /(?:DBA|d\/b\/a|doing business as)[:\s]+([^\n,]+)/i) || '',
    license_number: licenseNumber.substring(0, 50),
    license_type: extractPattern(text, /(?:license type|category|class)[:\s]+([^\n,]+)/i) || '',
    action_type: classifyActionType(text),
    status: classifyStatus(text),
    effective_date: extractPattern(text, /(?:effective|date|issued)[:\s]+(\d{1,2}\/\d{1,2}\/\d{4}|\w+ \d{1,2},? \d{4})/i) || '',
    resolution_date: '',
    reasons: extractPattern(text, /(?:reason|violation|charge|basis)[:\s]+([^\n]+)/i) || text.substring(0, 300),
    source_url: sourceUrl,
    scraped_at: new Date().toISOString(),
    confidence: 'verified',
    raw_text: text.substring(0, 1000),
  };
}

// ── Helpers ──────────────────────────────────────────────────────

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

// ── Main execution ──────────────────────────────────────────────

async function main() {
  const targetState = process.argv[2]?.toUpperCase();

  if (!targetState) {
    console.log('Usage: node scripts/enforcement/scrape_state.mjs <STATE_CODE|ALL>');
    console.log('Available states:', Object.keys(STATE_ENFORCEMENT_SOURCES).join(', '));
    process.exit(1);
  }

  let allRecords = [];

  if (targetState === 'ALL') {
    for (const [code, config] of Object.entries(STATE_ENFORCEMENT_SOURCES)) {
      const records = await scrapeEnforcementPage(code, config);
      allRecords.push(...records);
    }
  } else {
    const config = STATE_ENFORCEMENT_SOURCES[targetState];
    if (!config) {
      console.error(`❌ No enforcement source configured for state: ${targetState}`);
      process.exit(1);
    }
    allRecords = await scrapeEnforcementPage(targetState, config);
  }

  // Output results as JSON to stdout for the ingestion pipeline
  console.log('\n📊 ENFORCEMENT_RESULTS_JSON_START');
  console.log(JSON.stringify(allRecords, null, 2));
  console.log('ENFORCEMENT_RESULTS_JSON_END');

  console.log(`\n🏁 Complete. Total records scraped: ${allRecords.length}`);
}

main().catch(err => {
  console.error('Fatal scraper error:', err);
  process.exit(1);
});

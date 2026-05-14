/**
 * Multi-State Cannabis Business Finder
 * 
 * Uses Google Maps / Places data via web scraping to find cannabis businesses
 * across all 50 states and imports them into the CRM.
 * 
 * Usage: node scripts/multi_state_finder.mjs
 * 
 * This script searches for dispensaries, growers, and processors
 * in each legal cannabis state and imports the results directly to Firestore.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig, 'multi-state');
const db = getFirestore(app);

// ====================================
// STATES WITH LEGAL CANNABIS PROGRAMS
// ====================================
const LEGAL_STATES = [
  { code: 'CA', name: 'California', searchCity: 'Los Angeles' },
  { code: 'CO', name: 'Colorado', searchCity: 'Denver' },
  { code: 'WA', name: 'Washington', searchCity: 'Seattle' },
  { code: 'OR', name: 'Oregon', searchCity: 'Portland' },
  { code: 'MI', name: 'Michigan', searchCity: 'Detroit' },
  { code: 'NV', name: 'Nevada', searchCity: 'Las Vegas' },
  { code: 'IL', name: 'Illinois', searchCity: 'Chicago' },
  { code: 'MA', name: 'Massachusetts', searchCity: 'Boston' },
  { code: 'OH', name: 'Ohio', searchCity: 'Columbus' },
  { code: 'NY', name: 'New York', searchCity: 'New York' },
  { code: 'NJ', name: 'New Jersey', searchCity: 'Newark' },
  { code: 'AZ', name: 'Arizona', searchCity: 'Phoenix' },
  { code: 'MD', name: 'Maryland', searchCity: 'Baltimore' },
  { code: 'MO', name: 'Missouri', searchCity: 'St Louis' },
  { code: 'FL', name: 'Florida', searchCity: 'Miami' },
  { code: 'PA', name: 'Pennsylvania', searchCity: 'Philadelphia' },
  { code: 'MT', name: 'Montana', searchCity: 'Billings' },
  { code: 'NM', name: 'New Mexico', searchCity: 'Albuquerque' },
  { code: 'AK', name: 'Alaska', searchCity: 'Anchorage' },
  { code: 'ME', name: 'Maine', searchCity: 'Portland' },
  { code: 'CT', name: 'Connecticut', searchCity: 'Hartford' },
  { code: 'VT', name: 'Vermont', searchCity: 'Burlington' },
  { code: 'RI', name: 'Rhode Island', searchCity: 'Providence' },
  { code: 'MN', name: 'Minnesota', searchCity: 'Minneapolis' },
  { code: 'DE', name: 'Delaware', searchCity: 'Wilmington' },
  { code: 'VA', name: 'Virginia', searchCity: 'Richmond' },
  { code: 'HI', name: 'Hawaii', searchCity: 'Honolulu' },
];

const SEARCH_QUERIES = [
  'cannabis dispensary',
  'marijuana dispensary', 
  'cannabis grower',
  'cannabis processor',
];

// Classify business based on name
function classifyBusiness(name) {
  if (!name) return 'dispensary';
  const lower = name.toLowerCase();
  if (lower.includes('grow') || lower.includes('farm') || lower.includes('cultivat')) return 'grower';
  if (lower.includes('process') || lower.includes('lab') || lower.includes('extract')) return 'processor';
  if (lower.includes('clinic') || lower.includes('doctor') || lower.includes('health')) return 'provider';
  return 'dispensary';
}

async function scrapeGoogleMaps(page, searchQuery, stateCode, stateName) {
  const results = [];
  const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery + ' ' + stateName)}`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    
    // Scroll the results panel to load more
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const panel = document.querySelector('[role="feed"]') || document.querySelector('.m6QErb');
        if (panel) panel.scrollTop = panel.scrollHeight;
      });
      await new Promise(r => setTimeout(r, 2000));
    }
    
    // Extract business data from the results
    const businesses = await page.evaluate(() => {
      const items = [];
      const cards = document.querySelectorAll('[data-result-index], .Nv2PK, .hfpxzc');
      
      cards.forEach(card => {
        const nameEl = card.querySelector('.qBF1Pd, .fontHeadlineSmall, [role="heading"]');
        const addrEl = card.querySelector('.W4Efsd:nth-child(2), .UsdlK');
        const phoneEl = card.querySelector('[data-phone-number]');
        const ratingEl = card.querySelector('.MW4etd, .ZkP5Je');
        const linkEl = card.querySelector('a[href*="maps"]');
        
        const text = card.innerText || '';
        const phoneMatch = text.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
        
        if (nameEl) {
          items.push({
            name: nameEl.innerText?.trim() || '',
            address: addrEl?.innerText?.trim() || '',
            phone: phoneMatch ? phoneMatch[0] : '',
            rating: ratingEl?.innerText?.trim() || '',
            url: linkEl?.href || ''
          });
        }
      });
      return items;
    });
    
    results.push(...businesses);
  } catch (err) {
    console.log(`  ⚠️  Error scraping ${searchQuery} in ${stateName}: ${err.message}`);
  }
  
  return results;
}

async function main() {
  console.log('🌎 Multi-State Cannabis Business Finder');
  console.log('========================================\n');
  
  // Authenticate
  const auth = getAuth(app);
  console.log('🔐 Authenticating with Firebase...');
  await signInWithEmailAndPassword(auth, 'globalgreenhp@gmail.com', 'Harlem2025!');
  console.log('✅ Authenticated.\n');
  
  // Get existing records to avoid duplicates
  console.log('📊 Loading existing CRM records for deduplication...');
  const existingSnap = await getDocs(collection(db, 'crm_deals'));
  const existingNames = new Set(existingSnap.docs.map(d => (d.data().name || '').toLowerCase().trim()));
  console.log(`   Found ${existingNames.size} existing records.\n`);
  
  // Launch browser
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const grandTotal = { imported: 0, skipped: 0 };
  const stateTotals = {};
  
  for (const state of LEGAL_STATES) {
    console.log(`\n🏛️  Scanning ${state.name} (${state.code})...`);
    const stateResults = [];
    
    // Only use first query to keep it fast
    const searchQuery = `cannabis dispensary ${state.searchCity}`;
    const results = await scrapeGoogleMaps(page, searchQuery, state.code, state.name);
    stateResults.push(...results);
    
    // Deduplicate within this batch
    const unique = [];
    const seen = new Set();
    for (const biz of stateResults) {
      const key = biz.name.toLowerCase().trim();
      if (!key || seen.has(key) || existingNames.has(key)) continue;
      seen.add(key);
      existingNames.add(key);
      unique.push(biz);
    }
    
    // Import to Firestore in batches
    if (unique.length > 0) {
      const batch = writeBatch(db);
      for (const biz of unique) {
        const ref = doc(collection(db, 'crm_deals'));
        batch.set(ref, {
          name: biz.name,
          contactName: '',
          type: classifyBusiness(biz.name),
          stage: 'lead',
          value: 0,
          assignedTo: 'unassigned',
          phone: biz.phone,
          email: '',
          licenseNumber: '',
          jurisdiction: state.code,
          notes: `Imported via Google Maps scan. Address: ${biz.address}. Rating: ${biz.rating}`,
          updatedAt: new Date(),
          createdAt: new Date()
        });
      }
      await batch.commit();
      console.log(`   ✅ Imported ${unique.length} new businesses for ${state.code}`);
      grandTotal.imported += unique.length;
      stateTotals[state.code] = unique.length;
    } else {
      console.log(`   ℹ️  No new unique businesses found for ${state.code}`);
      stateTotals[state.code] = 0;
    }
  }
  
  await browser.close();
  
  console.log('\n========================================');
  console.log('📋 IMPORT RESULTS');
  console.log('========================================');
  console.log(`Total new records imported: ${grandTotal.imported}`);
  console.log('\nBy State:');
  for (const [code, count] of Object.entries(stateTotals).sort((a, b) => b[1] - a[1])) {
    if (count > 0) console.log(`   ${code.padEnd(5)} ${count} businesses`);
  }
  console.log('========================================\n');
  
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

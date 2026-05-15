/**
 * Florida OMMU Scraper
 * Target: https://knowthefactsmmj.com/mmtc/
 * Extracts MMTC dispensary locations from the OMMU public directory.
 * 
 * Florida is vertically integrated — each MMTC cultivates, processes, and dispenses.
 * The state registry (MMUR) at mmuregistry.flhealth.gov requires login.
 * The public-facing directory at knowthefactsmmj.com lists all licensed MMTCs.
 */
import puppeteer from 'puppeteer';

async function scrapeFlorida() {
  console.log('🌴 Florida OMMU Scraper — Medical Marijuana Treatment Centers');
  console.log('   Target: https://knowthefactsmmj.com/mmtc/\n');
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://knowthefactsmmj.com/mmtc/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for MMTC content to load
    await page.waitForSelector('body', { timeout: 10000 });
    
    // Extract MMTC data from the page
    const mmtcs = await page.evaluate(() => {
      const results = [];
      // Look for MMTC entries — the page typically lists company names with links
      const links = document.querySelectorAll('a[href*="mmtc"]');
      links.forEach(link => {
        const name = link.textContent?.trim();
        if (name && name.length > 2 && !name.includes('MMTC') && !name.includes('Search')) {
          results.push({ name, url: link.href });
        }
      });
      
      // Also try to extract from structured content
      const entries = document.querySelectorAll('.mmtc-entry, .entry-content li, table tr');
      entries.forEach(entry => {
        const text = entry.textContent?.trim();
        if (text && text.length > 5) {
          results.push({ name: text.substring(0, 100), raw: text });
        }
      });
      
      return results;
    });
    
    console.log(`📊 Found ${mmtcs.length} entries on MMTC page`);
    mmtcs.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.name}${m.url ? ' → ' + m.url : ''}`);
    });
    
    // Now try the dispensary search/locator
    console.log('\n🔍 Attempting dispensary search page...');
    await page.goto('https://knowthefactsmmj.com/mmtc/#search', { waitUntil: 'networkidle2', timeout: 30000 });
    
    const searchResults = await page.evaluate(() => {
      const results = [];
      const cards = document.querySelectorAll('.dispensary-card, .location-card, .mmtc-location');
      cards.forEach(card => {
        results.push({
          text: card.textContent?.trim().substring(0, 200),
        });
      });
      return results;
    });
    
    if (searchResults.length > 0) {
      console.log(`📍 Found ${searchResults.length} dispensary locations`);
    }
    
  } catch (error) {
    console.error('❌ Scraper error:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ Florida scraper complete');
}

scrapeFlorida().catch(console.error);

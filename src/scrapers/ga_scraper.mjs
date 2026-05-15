/**
 * Georgia GMCC Scraper
 * Target: https://www.gmcc.ga.gov/
 * Georgia is a CLOSED market with only 6 licensed producers.
 * This scraper monitors the GMCC dispensary directory for new locations.
 */
import puppeteer from 'puppeteer';

async function scrapeGeorgia() {
  console.log('🍑 Georgia GMCC Scraper — Licensed Cannabis Companies');
  console.log('   Target: https://www.gmcc.ga.gov/\n');
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.gmcc.ga.gov/patients/dispensaries', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('body', { timeout: 10000 });
    
    const dispensaries = await page.evaluate(() => {
      const results = [];
      const elements = document.querySelectorAll('a, li, p, td, .dispensary, .location');
      elements.forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 5 && text.length < 200 && 
            (text.toLowerCase().includes('dispensary') || text.toLowerCase().includes('pharmacy') ||
             text.toLowerCase().includes('trulieve') || text.toLowerCase().includes('botanical'))) {
          results.push(text.substring(0, 150));
        }
      });
      return [...new Set(results)];
    });
    
    console.log(`📊 Found ${dispensaries.length} dispensary references`);
    dispensaries.forEach((d, i) => console.log(`   ${i + 1}. ${d}`));
    
    // Also check licensing page
    await page.goto('https://www.gmcc.ga.gov/licensing', { waitUntil: 'networkidle2', timeout: 30000 });
    const licenses = await page.evaluate(() => {
      return document.body.innerText.substring(0, 2000);
    });
    console.log('\n📋 Licensing page excerpt:', licenses.substring(0, 500));
    
  } catch (error) {
    console.error('❌ Scraper error:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ Georgia scraper complete');
}

scrapeGeorgia().catch(console.error);

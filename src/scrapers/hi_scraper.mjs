/**
 * Hawaii DOH Scraper
 * Target: https://health.hawaii.gov/medicalcannabisregistry/
 * Hawaii has 8 licensed dispensary companies across 4 counties.
 */
import puppeteer from 'puppeteer';

async function scrapeHawaii() {
  console.log('🌺 Hawaii DOH Scraper — Medical Cannabis Dispensaries');
  console.log('   Target: https://health.hawaii.gov/medicalcannabisregistry/\n');
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://health.hawaii.gov/medicalcannabisregistry/', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('body', { timeout: 10000 });
    
    const content = await page.evaluate(() => {
      const results = [];
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        const text = link.textContent?.trim();
        const href = link.href;
        if (text && text.length > 3 && (
          text.toLowerCase().includes('dispensary') || text.toLowerCase().includes('find') ||
          href.includes('dispensary') || href.includes('cannabis')
        )) {
          results.push({ text, url: href });
        }
      });
      return results;
    });
    
    console.log(`📊 Found ${content.length} relevant links`);
    content.forEach((c, i) => console.log(`   ${i + 1}. ${c.text} → ${c.url}`));
    
  } catch (error) {
    console.error('❌ Scraper error:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ Hawaii scraper complete');
}

scrapeHawaii().catch(console.error);

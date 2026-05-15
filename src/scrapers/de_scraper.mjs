import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runDelawareScraper() {
  console.log("🚀 Starting Delaware OMC Portal Scraper...");
  const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1280, height: 800 } });
  const page = await browser.newPage();
  const businesses = [];

  try {
    // Delaware OMC licensing page
    await page.goto("https://omb.delaware.gov/marijuana-commissioner/", { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000));
    
    // OMC generally publishes a PDF matrix or links to active operators.
    // We scrape visible operator lists from the commissioner portal.
    const records = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('p, li, tr, .content-block'));
      return items.map(item => item.innerText || '').filter(t => t.includes('Compassion Center') || t.includes('Cultivation') || t.includes('Dispensary'));
    });

    for (const text of records) {
      const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+)/i);
      const phoneMatch = text.match(/(\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b)/);
      const lines = text.split('\\n').map(l => l.trim()).filter(l => l);

      if (lines.length > 0 && text.length > 10) {
        businesses.push({
          "Business Name": lines[0],
          "Address": lines.length > 1 ? lines[1] : "N/A",
          "Telephone": phoneMatch ? phoneMatch[1] : "N/A",
          "Email": emailMatch ? emailMatch[1] : "N/A",
          "Raw Data": text.replace(/\\n/g, ' | ')
        });
      }
    }

    if (businesses.length > 0) {
      const uniqueBusinesses = Array.from(new Set(businesses.map(b => JSON.stringify(b)))).map(s => JSON.parse(s));
      const headers = Object.keys(uniqueBusinesses[0]);
      const csvRows = [headers.join(',')];
      for (const b of uniqueBusinesses) {
        csvRows.push(headers.map(h => `"${b[h] ? b[h].toString().replace(/"/g, '""') : ''}"`).join(','));
      }
      const csvPath = path.join(process.cwd(), 'de_scraped_directory.csv');
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\n🎉 Success! Saved ${uniqueBusinesses.length} records to ${csvPath}`);
    } else {
      console.log("❌ No businesses extracted. Delaware may require downloading their PDF matrix directly.");
    }
  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runDelawareScraper();

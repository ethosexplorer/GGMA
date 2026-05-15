import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runAlabamaScraper() {
  console.log("🚀 Starting Alabama AMCC Licensing Portal Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];

  try {
    console.log("🌐 Navigating to Alabama AMCC Directory...");
    await page.goto("https://amcc.alabama.gov/businesses/", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 3000));

    console.log("🔍 Extracting facilities...");
    const records = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('tr, p, li'));
      const results = [];
      for (const item of items) {
        const text = item.innerText || '';
        if (text.includes('Cultivator') || text.includes('Dispensary') || text.includes('Processor')) {
           results.push(text.trim());
        }
      }
      return results;
    });

    for (let i = 0; i < records.length; i++) {
      const text = records[i];
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
        const values = headers.map(header => `"${b[header] ? b[header].toString().replace(/"/g, '""') : ''}"`);
        csvRows.push(values.join(','));
      }
      const csvPath = path.join(process.cwd(), 'al_scraped_directory.csv');
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\n🎉 Success! Saved ${uniqueBusinesses.length} records to ${csvPath}`);
    } else {
      console.log("❌ No businesses extracted. Structure might be different.");
    }

  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runAlabamaScraper();

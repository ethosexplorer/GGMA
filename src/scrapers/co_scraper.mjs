import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runColoradoScraper() {
  console.log("🚀 Starting Colorado (MED) Cannabis Registry Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; 

  try {
    console.log("🌐 Navigating to Colorado MED Portal...");
    await page.goto("https://sbg.colorado.gov/med/licensee-information", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for search portal...");
    await new Promise(r => setTimeout(r, 5000));

    console.log("🔍 Attempting to load registry spreadsheet or portal...");
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const searchBtn = links.find(b => (b.innerText || '').toLowerCase().includes('search') || (b.innerText || '').toLowerCase().includes('roster'));
      if (searchBtn) searchBtn.click();
    });

    console.log("⏳ Waiting for records...");
    await new Promise(r => setTimeout(r, 8000));

    let extractedCount = 0;
    while (extractedCount < limit) {
      const records = await page.evaluate(() => {
        const containers = Array.from(document.querySelectorAll('tr, .result-item, .card, li'));
        const results = [];
        
        for (const container of containers) {
          const text = container.innerText || '';
          if (text.includes('Active') || text.includes('MED') || text.includes('@') || text.match(/\\d{3}[-\\.\\s]?\\d{4}/)) {
             results.push(text);
          }
        }
        return results;
      });

      if (records.length === 0) break;

      for (let i = 0; i < records.length; i++) {
        if (extractedCount >= limit) break;
        
        const text = records[i];
        const extractMatch = (regex) => {
          const match = text.match(regex);
          return match ? match[1].trim() : "N/A";
        };

        const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+)/i);
        const phoneMatch = text.match(/(\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4})/);
        const lines = text.split('\\n').map(l => l.trim()).filter(l => l);

        const business = {
          "Business Name": lines.length > 0 ? lines[0] : "Unknown",
          "DBA": extractMatch(/DBA\\s*[:\\-]\\s*(.*)/i) !== "N/A" ? extractMatch(/DBA\\s*[:\\-]\\s*(.*)/i) : "",
          "License Number": extractMatch(/([0-9]{3,4}-[0-9]{4,5})/i) !== "N/A" ? extractMatch(/([0-9]{3,4}-[0-9]{4,5})/i) : "Unknown",
          "License Type": extractMatch(/(?:Type|Category)\\s*[:\\-]\\s*(.*)/i),
          "Expiration Date": extractMatch(/(?:Expires|Expiration|Valid Through)\\s*[:\\-]\\s*(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/i),
          "Physical Address": extractMatch(/Address\\s*[:\\-]\\s*(.*)/i),
          "Telephone": phoneMatch ? phoneMatch[1] : "",
          "Email": emailMatch ? emailMatch[1] : "",
          "Status": "Active", // MED public rosters default to Active/Approved only
          "Raw Data": text.replace(/\\n/g, ' | ')
        };
        
        businesses.push(business);
        extractedCount++;
      }

      if (extractedCount >= limit) break;

      const hasNext = await page.evaluate(() => {
        const nextBtns = Array.from(document.querySelectorAll('a, span, button'));
        const nextBtn = nextBtns.find(b => (b.innerText || '').toLowerCase().includes('next') || b.innerText === '>');
        if (nextBtn) {
          nextBtn.click();
          return true;
        }
        return false;
      });

      if (!hasNext) break;
      await new Promise(r => setTimeout(r, 4000));
    }

    if (businesses.length > 0) {
      const headers = Object.keys(businesses[0]);
      const csvRows = [headers.join(',')];
      for (const b of businesses) {
        const values = headers.map(header => `"${b[header] ? b[header].toString().replace(/"/g, '""') : ''}"`);
        csvRows.push(values.join(','));
      }
      const csvPath = path.join(process.cwd(), 'co_enriched_directory.csv');
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\\n🎉 Success! Saved ${businesses.length} records to ${csvPath}`);
    } else {
      console.log("❌ No businesses extracted. Structure may have changed.");
    }

  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runColoradoScraper();

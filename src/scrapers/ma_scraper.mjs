import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runMassachusettsScraper() {
  console.log("🚀 Starting Massachusetts (CCC) Cannabis Registry Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; 

  try {
    console.log("🌐 Navigating to Massachusetts CCC Portal...");
    await page.goto("https://masscannabiscontrol.com/open-data/data-catalog/", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 5000));

    let extractedCount = 0;
    while (extractedCount < limit) {
      const records = await page.evaluate(() => {
        const containers = Array.from(document.querySelectorAll('tr, .result-item, .card, li'));
        const results = [];
        for (const container of containers) {
          const text = container.innerText || '';
          if (text.includes('Active') || text.includes('MA') || text.match(/\\d{3}[-\\.\\s]?\\d{4}/)) {
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
          "License Number": extractMatch(/([A-Z]{2,4}\\d{4,8})/i) !== "N/A" ? extractMatch(/([A-Z]{2,4}\\d{4,8})/i) : "Unknown",
          "License Type": extractMatch(/(?:Type|Category)\\s*[:\\-]\\s*(.*)/i),
          "Expiration Date": extractMatch(/(?:Expires|Expiration)\\s*[:\\-]\\s*(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/i),
          "Physical Address": extractMatch(/Address\\s*[:\\-]\\s*(.*)/i),
          "Telephone": phoneMatch ? phoneMatch[1] : "",
          "Email": emailMatch ? emailMatch[1] : "",
          "Status": extractMatch(/(?:Status)\\s*[:\\-]\\s*([A-Za-z]+)/i) !== "N/A" ? extractMatch(/(?:Status)\\s*[:\\-]\\s*([A-Za-z]+)/i) : "Active",
          "Raw Data": text.replace(/\\n/g, ' | ')
        };
        
        businesses.push(business);
        extractedCount++;
      }

      break;
    }

    if (businesses.length > 0) {
      const headers = Object.keys(businesses[0]);
      const csvRows = [headers.join(',')];
      for (const b of businesses) {
        const values = headers.map(header => `"${b[header] ? b[header].toString().replace(/"/g, '""') : ''}"`);
        csvRows.push(values.join(','));
      }
      const csvPath = path.join(process.cwd(), 'ma_enriched_directory.csv');
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\\n🎉 Success! Saved ${businesses.length} records to ${csvPath}`);
    } else {
      console.log("❌ No businesses extracted.");
    }

  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runMassachusettsScraper();

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runMichiganScraper() {
  console.log("🚀 Starting Michigan CRA Portal Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; 

  try {
    console.log("🌐 Navigating to Michigan CRA Search Portal...");
    // Accela Citizen Access portal for MI CRA
    await page.goto("https://aca-prod.accela.com/MRA/GeneralProperty/PropertyLookUp.aspx?isLicensee=Y", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 5000));

    console.log("🔍 Looking for Search button...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('a, button, input'));
      const searchBtn = btns.find(b => {
        const text = (b.innerText || b.value || '').toLowerCase();
        return text === 'search' || text === 'submit';
      });
      if (searchBtn) searchBtn.click();
    });

    console.log("⏳ Waiting for search results to populate...");
    await new Promise(r => setTimeout(r, 8000));

    let extractedCount = 0;
    
    while (extractedCount < limit) {
      const records = await page.evaluate(() => {
        // Accela uses generic table rows usually with class .ACA_TabRow
        const containers = Array.from(document.querySelectorAll('tr, .ACA_TabRow, .card'));
        const results = [];
        
        for (const container of containers) {
          const text = container.innerText || '';
          if (text.includes('AU-') || text.includes('PC-') || text.includes('GR-') || text.includes('@') || text.match(/\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}/)) {
             results.push(text);
          }
        }
        return results;
      });

      console.log(`Found ${records.length} potential records on current page.`);
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
          "DBA": extractMatch(/DBA\\s*:\\s*(.*)/i) !== "N/A" ? extractMatch(/DBA\\s*:\\s*(.*)/i) : "Check Raw",
          "License Number": extractMatch(/([A-Z]{2}-\\w+-\\d+)/i) !== "N/A" ? extractMatch(/([A-Z]{2}-\\w+-\\d+)/i) : "Unknown",
          "Address": extractMatch(/Address\\s*:\\s*(.*)/i),
          "Telephone": phoneMatch ? phoneMatch[1] : "N/A",
          "Email": emailMatch ? emailMatch[1] : "N/A",
          "Status": extractMatch(/(?:License\\s+)?Status\\s*:\\s*(.*)/i) !== "N/A" ? extractMatch(/(?:License\\s+)?Status\\s*:\\s*(.*)/i) : "Active",
          "Raw Data": text.replace(/\\n/g, ' | ')
        };
        
        businesses.push(business);
        extractedCount++;
      }

      if (extractedCount >= limit) break;

      console.log("➡️ Moving to next page...");
      const hasNext = await page.evaluate(() => {
        const nextBtns = Array.from(document.querySelectorAll('a, span'));
        const nextBtn = nextBtns.find(b => b.innerText && b.innerText.includes('Next >'));
        if (nextBtn) {
          nextBtn.click();
          return true;
        }
        return false;
      });

      if (!hasNext) {
        console.log("Reached end of directory.");
        break;
      }
      
      await new Promise(r => setTimeout(r, 4000));
    }

    if (businesses.length > 0) {
      const headers = Object.keys(businesses[0]);
      const csvRows = [headers.join(',')];
      for (const b of businesses) {
        const values = headers.map(header => {
          const val = b[header] ? b[header].toString().replace(/"/g, '""') : '';
          return `"${val}"`;
        });
        csvRows.push(values.join(','));
      }
      const csvPath = path.join(process.cwd(), 'mi_enriched_directory.csv');
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\n🎉 Success! Saved ${businesses.length} records to ${csvPath}`);
    } else {
      console.log("❌ No businesses were successfully extracted.");
    }

  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runMichiganScraper();

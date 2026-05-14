import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runOhioScraper() {
  console.log("🚀 Starting Ohio eLicense Portal Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; 

  try {
    console.log("🌐 Navigating to Ohio eLicense Search Portal...");
    await page.goto("https://elicense.ohio.gov/s/license-lookup", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 5000));

    // The Ohio portal uses Salesforce Aura (same as OMMA)
    console.log("🔍 Looking for Search button...");
    await page.evaluate(() => {
      // In Ohio, we need to select a specific board if possible, or just hit Search
      const btns = Array.from(document.querySelectorAll('button'));
      const searchBtn = btns.find(b => b.innerText && b.innerText.toLowerCase().includes('search'));
      if (searchBtn) searchBtn.click();
    });

    console.log("⏳ Waiting for search results to populate...");
    await new Promise(r => setTimeout(r, 8000));

    let extractedCount = 0;
    
    while (extractedCount < limit) {
      const records = await page.evaluate(() => {
        const containers = Array.from(document.querySelectorAll('tr, article, .card, .slds-card, .slds-table tr'));
        const results = [];
        
        for (const container of containers) {
          const text = container.innerText || '';
          if (text.includes('MMCPP') || text.includes('MMCPC') || text.includes('Dispensary') || text.includes('@') || text.match(/\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}/)) {
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
          "License Number": extractMatch(/(MMCP\\w*-\\d+)/i) !== "N/A" ? extractMatch(/(MMCP\\w*-\\d+)/i) : "Unknown",
          "Address": extractMatch(/Address\\s*:\\s*(.*)/i),
          "Telephone": phoneMatch ? phoneMatch[1] : "N/A",
          "Email": emailMatch ? emailMatch[1] : "N/A",
          "Raw Data": text.replace(/\\n/g, ' | ')
        };
        
        businesses.push(business);
        extractedCount++;
      }

      if (extractedCount >= limit) break;

      console.log("➡️ Moving to next page...");
      const hasNext = await page.evaluate(() => {
        const nextBtns = Array.from(document.querySelectorAll('button, a, .pagination-next'));
        const nextBtn = nextBtns.find(b => b.innerText && b.innerText.toLowerCase().includes('next'));
        if (nextBtn && !nextBtn.disabled && !nextBtn.classList.contains('disabled')) {
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
      const csvPath = path.join(process.cwd(), 'oh_enriched_directory.csv');
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

runOhioScraper();

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runCaliforniaScraper() {
  console.log("🚀 Starting California DCC Portal Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; // Initial test limit for CA

  try {
    console.log("🌐 Navigating to California DCC Search Portal...");
    await page.goto("https://search.cannabis.ca.gov/", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 5000));

    // The CA portal typically loads a data table or requires clicking a Search button
    console.log("🔍 Attempting to load all active licenses...");
    await page.evaluate(() => {
      const searchBtns = Array.from(document.querySelectorAll('button'));
      const searchBtn = searchBtns.find(b => b.innerText && b.innerText.toLowerCase().includes('search'));
      if (searchBtn) searchBtn.click();
    });

    console.log("⏳ Waiting for search results to populate...");
    await new Promise(r => setTimeout(r, 8000));

    let extractedCount = 0;
    
    // In CA, the data is usually inside <article> or .card or table rows.
    while (extractedCount < limit) {
      const records = await page.evaluate(() => {
        // Find containers that look like a business record (has License number)
        const containers = Array.from(document.querySelectorAll('tr, article, .card, .record-container'));
        const results = [];
        
        for (const container of containers) {
          const text = container.innerText || '';
          // CA licenses usually start with C10, C11, C12, CCL, etc. Or just look for Email/Phone
          if (text.includes('License') || text.includes('@') || text.match(/\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}/)) {
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
        
        // Extract full business card info using regex since DOM changes
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
          "License Number": extractMatch(/(C\\d{2}-\\d{7}-LIC|CCL\\d{2}-\\d{7})/i) !== "N/A" ? extractMatch(/(C\\d{2}-\\d{7}-LIC|CCL\\d{2}-\\d{7})/i) : "Unknown",
          "Address": extractMatch(/Address\\s*:\\s*(.*)/i),
          "Telephone": phoneMatch ? phoneMatch[1] : "N/A",
          "Email": emailMatch ? emailMatch[1] : "N/A",
          "Raw Data": text.replace(/\\n/g, ' | ') // Keep whole business card text just in case
        };
        
        // Only add if it actually looks like a business (has email, phone, or license)
        if (business.Email !== "N/A" || business.Telephone !== "N/A" || business["License Number"] !== "Unknown") {
          businesses.push(business);
          extractedCount++;
        }
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
      const csvPath = path.join(process.cwd(), 'ca_enriched_directory.csv');
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

runCaliforniaScraper();

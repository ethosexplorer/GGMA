import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runIllinoisScraper() {
  console.log("🚀 Starting Illinois (IDFPR) Cannabis Registry Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; 

  try {
    console.log("🌐 Navigating to Illinois License Lookup Portal...");
    // Illinois IDFPR / Cannabis portal (Generic lookup URL as placeholder)
    await page.goto("https://online-dfpr.micropact.com/lookup/licenselookup.aspx", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 5000));

    console.log("🔍 Selecting Cannabis/Dispensary categories and running search...");
    // Attempt generic search interaction
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const profSelect = selects.find(s => s.innerText.toLowerCase().includes('profession') || s.name.toLowerCase().includes('profession'));
      if (profSelect) {
        const options = Array.from(profSelect.options);
        const canOpt = options.find(o => o.text.toLowerCase().includes('dispensary') || o.text.toLowerCase().includes('cannabis'));
        if (canOpt) {
          profSelect.value = canOpt.value;
          profSelect.dispatchEvent(new Event('change'));
        }
      }

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
        // Scrape table rows or result cards
        const containers = Array.from(document.querySelectorAll('tr, .result-item, .card'));
        const results = [];
        
        for (const container of containers) {
          const text = container.innerText || '';
          // Generic heuristic for finding a license block: looks for Illinois-like license numbers or emails
          if (text.includes('Active') || text.includes('Expired') || text.includes('@') || text.match(/\\d{2,3}[-\\.\\s]?\\d{4,7}/)) {
             results.push(text);
          }
        }
        return results;
      });

      console.log(`Found ${records.length} potential records on current page.`);
      if (records.length === 0) {
        console.log("No records found on page, or DOM structure differs.");
        break;
      }

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
          "License Number": extractMatch(/([A-Z0-9]{2,4}-\\d{4,6})/i) !== "N/A" ? extractMatch(/([A-Z0-9]{2,4}-\\d{4,6})/i) : "Unknown",
          "License Type": extractMatch(/(?:Type|Category)\\s*[:\\-]\\s*(.*)/i),
          "Expiration Date": extractMatch(/(?:Expires|Expiration|Valid Through)\\s*[:\\-]\\s*(\\d{1,2}\\/\\d{1,2}\\/\\d{4})/i),
          "Physical Address": extractMatch(/Address\\s*[:\\-]\\s*(.*)/i),
          "Telephone": phoneMatch ? phoneMatch[1] : "",
          "Email": emailMatch ? emailMatch[1] : "",
          "Status": extractMatch(/(?:License\\s+)?Status\\s*[:\\-]\\s*([A-Za-z]+)/i) !== "N/A" ? extractMatch(/(?:License\\s+)?Status\\s*[:\\-]\\s*([A-Za-z]+)/i) : "Active",
          "Raw Data": text.replace(/\\n/g, ' | ')
        };
        
        businesses.push(business);
        extractedCount++;
      }

      if (extractedCount >= limit) break;

      console.log("➡️ Moving to next page...");
      const hasNext = await page.evaluate(() => {
        const nextBtns = Array.from(document.querySelectorAll('a, span, button'));
        const nextBtn = nextBtns.find(b => {
          const text = (b.innerText || '').toLowerCase();
          return text.includes('next') || text === '>';
        });
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
      const csvPath = path.join(process.cwd(), 'il_enriched_directory.csv');
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\\n🎉 Success! Saved ${businesses.length} records to ${csvPath}`);
    } else {
      console.log("❌ No businesses were successfully extracted.");
    }

  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runIllinoisScraper();

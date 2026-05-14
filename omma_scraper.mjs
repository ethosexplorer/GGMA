import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runScraper() {
  console.log("🚀 Starting OMMA Portal Scraper...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 30000; 
  const csvPath = path.join(process.cwd(), 'omma_enriched_directory.csv');
  let pagesToSkip = 0;

  if (fs.existsSync(csvPath)) {
    const existingCsv = fs.readFileSync(csvPath, 'utf8');
    const existingLines = existingCsv.split('\n').filter(l => l.trim());
    
    if (existingLines.length > 1) {
      const headers = existingLines[0].split(',').map(h => h.replace(/^"|"$/g, ''));
      for (let i = 1; i < existingLines.length; i++) {
        const line = existingLines[i];
        const values = [];
        let inQuotes = false;
        let val = '';
        for (let j = 0; j < line.length; j++) {
          if (line[j] === '"') {
            if (inQuotes && line[j+1] === '"') {
              val += '"';
              j++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (line[j] === ',' && !inQuotes) {
            values.push(val);
            val = '';
          } else {
            val += line[j];
          }
        }
        values.push(val);
        
        const obj = {};
        headers.forEach((h, idx) => obj[h] = values[idx] || '');
        businesses.push(obj);
      }
      
      const uniqueBusinesses = [];
      const seenLicenses = new Set();
      for (const b of businesses) {
        const id = b['License Number'] || b['Business Name'];
        if (!seenLicenses.has(id)) {
          seenLicenses.add(id);
          uniqueBusinesses.push(b);
        }
      }
      
      businesses.length = 0;
      businesses.push(...uniqueBusinesses);
      
      console.log(`✅ Loaded ${businesses.length} unique existing records from CSV.`);
      pagesToSkip = Math.floor(businesses.length / 20);
      console.log(`⏭️ Will skip the first ${pagesToSkip} pages to resume extraction.`);
    }
  }

  try {
    console.log("🌐 Navigating to OMMA Verify Portal...");
    await page.goto("https://medportal.omma.ok.gov/s/verify-license-number", { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    console.log("⏳ Waiting for portal to initialize...");
    await new Promise(r => setTimeout(r, 4000));

    // 1. Click the "Business" tab
    console.log("👉 Switching to 'Business' tab...");
    await page.evaluate(() => {
      function findByText(text, el = document.body) {
        if (el.innerText && el.innerText.trim() === text && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'LI')) return el;
        for (const child of Array.from(el.children)) {
          const res = findByText(text, child);
          if (res) return res;
        }
        if (el.shadowRoot) {
          const res = findByText(text, el.shadowRoot);
          if (res) return res;
        }
        return null;
      }
      const businessTab = findByText('Business');
      if (businessTab) businessTab.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));

    // 2. Click "Search"
    console.log("🔍 Clicking Search...");
    await page.evaluate(() => {
      function findByText(text, el = document.body) {
        if (el.innerText && el.innerText.trim() === text && el.tagName === 'BUTTON') return el;
        for (const child of Array.from(el.children)) {
          const res = findByText(text, child);
          if (res) return res;
        }
        if (el.shadowRoot) {
          const res = findByText(text, el.shadowRoot);
          if (res) return res;
        }
        return null;
      }
      const searchBtn = findByText('Search');
      if (searchBtn) searchBtn.click();
    });

    console.log("⏳ Waiting for search results to populate...");
    await new Promise(r => setTimeout(r, 8000));

    if (pagesToSkip > 0) {
      console.log(`⏭️ Fast-forwarding ${pagesToSkip} pages...`);
      for (let p = 0; p < pagesToSkip; p++) {
        if (p % 10 === 0) console.log(`Skipping page ${p + 1}/${pagesToSkip}...`);
        const hasNext = await page.evaluate(() => {
          function findNext(text, el = document.body) {
            if (el.innerText && el.innerText.trim() === text && (el.tagName === 'BUTTON' || el.tagName === 'A')) return el;
            for (const child of Array.from(el.children)) {
              const res = findNext(text, child);
              if (res) return res;
            }
            if (el.shadowRoot) {
              const res = findNext(text, el.shadowRoot);
              if (res) return res;
            }
            return null;
          }
          const nextBtn = findNext('Next');
          if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            return true;
          }
          return false;
        });
        if (!hasNext) break;
        await new Promise(r => setTimeout(r, 2000));
      }
      console.log(`✅ Reached target page. Resuming extraction...`);
    }

    let extractedCount = businesses.length;
    
    while (extractedCount < limit) {
      const viewButtonsCount = await page.evaluate(() => {
        function findAllByText(text, el = document.body, results = []) {
          if (el.innerText && el.innerText.trim() === text && (el.tagName === 'BUTTON' || el.tagName === 'A')) {
            results.push(el);
          }
          for (const child of Array.from(el.children)) {
            findAllByText(text, child, results);
          }
          if (el.shadowRoot) {
            findAllByText(text, el.shadowRoot, results);
          }
          return results;
        }
        return findAllByText('View').length;
      });
      
      console.log(`Found ${viewButtonsCount} records on current page.`);
      if (viewButtonsCount === 0) break;

      for (let i = 0; i < viewButtonsCount; i++) {
        if (extractedCount >= limit) break;

        console.log(`\n📄 Extracting record ${extractedCount + 1}/${limit}...`);
        
        await page.evaluate((index) => {
          function findAllByText(text, el = document.body, results = []) {
            if (el.innerText && el.innerText.trim() === text && (el.tagName === 'BUTTON' || el.tagName === 'A')) {
              results.push(el);
            }
            for (const child of Array.from(el.children)) {
              findAllByText(text, child, results);
            }
            if (el.shadowRoot) {
              findAllByText(text, el.shadowRoot, results);
            }
            return results;
          }
          const btns = findAllByText('View');
          if (btns[index]) btns[index].click();
        }, i);

        await new Promise(r => setTimeout(r, 2000));

        const business = await page.evaluate(() => {
          function findModal(el = document.body) {
            if (el.classList && (el.classList.contains('slds-modal') || el.role === 'dialog')) {
              if (el.innerText && el.innerText.includes('License Details')) return el;
            }
            for (const child of Array.from(el.children)) {
              const res = findModal(child);
              if (res) return res;
            }
            if (el.shadowRoot) {
              const res = findModal(el.shadowRoot);
              if (res) return res;
            }
            return null;
          }
          
          const modal = findModal();
          if (!modal) return null;

          const textLines = modal.innerText.split('\n').map(l => l.trim()).filter(l => l);
          
          const extract = (key) => {
            for (let j = 0; j < textLines.length; j++) {
              if (textLines[j].startsWith(key)) {
                // If the line is exactly "Email : email@example.com"
                const parts = textLines[j].split(':');
                if (parts.length > 1 && parts[1].trim() !== '') {
                  return parts.slice(1).join(':').trim();
                }
                // If it's on the next line
                if (j + 1 < textLines.length) {
                  return textLines[j+1];
                }
              }
            }
            return "";
          };

          return {
            "Business Name": textLines[1] || "",
            "DBA": extract("DBA"),
            "License Number": extract("License Number"),
            "License Type": extract("License Type"),
            "Expiration Date": extract("Expiration Date"),
            "Physical Address": extract("Physical Address"),
            "Telephone": extract("Telephone Number"),
            "Email": extract("Email"),
            "Status": extract("License Status")
          };
        });

        if (business) {
          console.log(`✅ Extracted: ${business.Email || 'No Email'} | ${business.Telephone || 'No Phone'} | ${business['Business Name']}`);
          businesses.push(business);
          extractedCount++;
        }

        await page.evaluate(() => {
          function findClose(text, el = document.body) {
            if (el.innerText && el.innerText.trim() === text && el.tagName === 'BUTTON') return el;
            for (const child of Array.from(el.children)) {
              const res = findClose(text, child);
              if (res) return res;
            }
            if (el.shadowRoot) {
              const res = findClose(text, el.shadowRoot);
              if (res) return res;
            }
            return null;
          }
          const close = findClose('Close');
          if (close) close.click();
        });
        
        await new Promise(r => setTimeout(r, 1000));
      }

      if (extractedCount >= limit) break;

      console.log("➡️ Moving to next page...");
      const hasNext = await page.evaluate(() => {
        function findNext(text, el = document.body) {
          if (el.innerText && el.innerText.trim() === text && (el.tagName === 'BUTTON' || el.tagName === 'A')) return el;
          for (const child of Array.from(el.children)) {
            const res = findNext(text, child);
            if (res) return res;
          }
          if (el.shadowRoot) {
            const res = findNext(text, el.shadowRoot);
            if (res) return res;
          }
          return null;
        }
        const nextBtn = findNext('Next');
        if (nextBtn && !nextBtn.disabled) {
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
      // Deduplicate again before saving to be safe
      const uniqueBusinesses = [];
      const seenLicenses = new Set();
      for (const b of businesses) {
        const id = b['License Number'] || b['Business Name'];
        if (!seenLicenses.has(id)) {
          seenLicenses.add(id);
          uniqueBusinesses.push(b);
        }
      }

      const headers = Object.keys(uniqueBusinesses[0]);
      const csvRows = [headers.join(',')];
      for (const b of uniqueBusinesses) {
        const values = headers.map(header => {
          const val = b[header] ? b[header].toString().replace(/"/g, '""') : '';
          return `"${val}"`;
        });
        csvRows.push(values.join(','));
      }
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\n🎉 Success! Saved ${uniqueBusinesses.length} records to ${csvPath} (Duplicates removed)`);
    } else {
      console.log("❌ No businesses were successfully extracted.");
    }

  } catch (error) {
    console.error("❌ Scraper Error:", error);
  } finally {
    await browser.close();
  }
}

runScraper();

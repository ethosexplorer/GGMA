import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Master engine for the remaining US states
const STATE_PORTALS = {
  'MD': 'https://mmcc.maryland.gov/',
  'MO': 'https://health.mo.gov/safety/medical-marijuana/',
  'FL': 'https://knowthefactsmmj.com/',
  'PA': 'https://www.health.pa.gov/topics/programs/Medical%20Marijuana/',
  'MT': 'https://mtrevenue.gov/cannabis/',
  'NM': 'https://rld.state.nm.us/cannabis/',
  'AK': 'https://www.commerce.alaska.gov/web/amco/',
  'ME': 'https://www.maine.gov/dafs/omp/',
  'CT': 'https://portal.ct.gov/DCP/Medical-Marijuana-Program/',
  'VT': 'https://ccb.vermont.gov/',
  'RI': 'https://health.ri.gov/healthcare/medicalmarijuana/',
  // Scalable to all 50
};

async function runNationalScraper(stateCode) {
  const portalUrl = STATE_PORTALS[stateCode];
  if (!portalUrl) {
    console.log(`❌ No portal configured for ${stateCode}.`);
    return;
  }

  console.log(`🚀 Starting ${stateCode} National Cannabis Registry Scraper...`);
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  const businesses = [];
  const limit = 50; 

  try {
    console.log(`🌐 Navigating to ${stateCode} Portal...`);
    await page.goto(portalUrl, { 
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
          if (text.includes('Active') || text.match(/\\d{3}[-\\.\\s]?\\d{4}/)) {
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
          "License Number": extractMatch(/([A-Z0-9]{6,12})/i) !== "N/A" ? extractMatch(/([A-Z0-9]{6,12})/i) : "Unknown",
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
      const csvPath = path.join(process.cwd(), `${stateCode.toLowerCase()}_enriched_directory.csv`);
      fs.writeFileSync(csvPath, csvRows.join('\n'));
      console.log(`\\n🎉 Success! Saved ${businesses.length} records to ${csvPath}`);
    } else {
      console.log(`❌ No businesses extracted for ${stateCode}. Portal might require custom navigation.`);
    }

  } catch (error) {
    console.error(`❌ Scraper Error [${stateCode}]:`, error);
  } finally {
    await browser.close();
  }
}

// Get state code from arguments
const targetState = process.argv[2];
if (targetState) {
  runNationalScraper(targetState.toUpperCase());
} else {
  console.log("Please provide a state code: node us_national_scraper.mjs MD");
}

import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto("https://search.cannabis.ca.gov/", { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  
  // CA search portal might have an input or just a table. 
  // Let's just dump the body.
  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('ca_dom.html', html);
  await browser.close();
}
run();

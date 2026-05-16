/**
 * Tennessee Cannabis/Hemp Scraper
 * Source: https://www.tn.gov/abc/hdcp.html
 * Marijuana is strictly illegal. Hemp HDCP only via TABC.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeTennessee() {
  console.log('🎸 Tennessee — Monitor Scraper (Hemp HDCP & Advocacy)');
  console.log('  Sources:');
  console.log('    - https://www.tn.gov/abc/hdcp.html');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const tnDeals = []; snap.forEach(d => { if (d.data().state === 'TN') tnDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${tnDeals.length} Tennessee records in CRM`);
  const byType = {};
  tnDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'TN', totalRecords: tnDeals.length, byType, sources: [
    'https://www.tn.gov/abc/hdcp.html'
  ]};
}
if (process.argv[1]?.includes('tn_scraper')) scrapeTennessee().then(() => process.exit(0));

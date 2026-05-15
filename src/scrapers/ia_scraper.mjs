/**
 * Iowa Medical Cannabidiol Scraper
 * Source: https://hhs.iowa.gov/health-prevention/medical-cannabis/
 * Very restricted: Only 5 dispensary locations, 2 companies
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
const app = initializeApp({ apiKey: "AIzaSyDvEmz9VfE27P71tqwL6x9uQlXZgdEFPuw", authDomain: "ggp-os.firebaseapp.com", projectId: "ggp-os" });
const db = getFirestore(app);

export async function scrapeIowa() {
  console.log('🌽 Iowa Medical Cannabidiol — Monitor Scraper');
  const snap = await getDocs(collection(db, 'crm_deals'));
  const iaDeals = []; snap.forEach(d => { if (d.data().state === 'IA') iaDeals.push({ id: d.id, ...d.data() }); });
  console.log(`  📊 ${iaDeals.length} Iowa records in CRM`);
  const byType = {};
  iaDeals.forEach(d => { byType[d.type] = (byType[d.type] || 0) + 1; });
  Object.entries(byType).forEach(([t, c]) => console.log(`    ${t}: ${c}`));
  return { state: 'IA', totalRecords: iaDeals.length, byType, sources: ['https://hhs.iowa.gov/health-prevention/medical-cannabis/'] };
}
if (process.argv[1]?.includes('ia_scraper')) scrapeIowa().then(() => process.exit(0));

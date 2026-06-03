import fs from 'fs';

const csvContent = fs.readFileSync('./valuation_contacts_export.csv', 'utf8');
const lines = csvContent.split('\n').filter(Boolean);

const terms = ['governor', 'mayor', 'senat', 'representat', 'legislat', 'police', 'sheriff', 'dea', 'obn', 'attorney general', 'narcotic', 'enforcement'];

const matchesByTerm = {};
terms.forEach(t => { matchesByTerm[t] = []; });

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const lower = line.toLowerCase();
  
  terms.forEach(t => {
    if (lower.includes(t)) {
      matchesByTerm[t].push(line);
    }
  });
}

console.log('=== CSV SEARCH RESULTS ===');
terms.forEach(t => {
  console.log(`\n🔍 Term: "${t}" - Found ${matchesByTerm[t].length} matches:`);
  matchesByTerm[t].slice(0, 10).forEach((l, idx) => {
    console.log(`   ${idx + 1}. ${l.substring(0, 120)}`);
  });
  if (matchesByTerm[t].length > 10) {
    console.log(`   ... and ${matchesByTerm[t].length - 10} more.`);
  }
});

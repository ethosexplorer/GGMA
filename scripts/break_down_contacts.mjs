import fs from 'fs';

const csvContent = fs.readFileSync('./valuation_contacts_export.csv', 'utf8');
const lines = csvContent.split('\n').filter(Boolean);
const headers = lines[0].split(',');

const contacts = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // Parse CSV line taking care of quotes
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
  const row = matches.map(m => m.replace(/^"|"$/g, '').trim());
  
  if (row.length >= 8) {
    contacts.push({
      orgName: row[0] || '',
      contactName: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      state: row[4] || '',
      jurisdiction: row[5] || '',
      type: row[6] || '',
      category: row[7] || '',
      notes: row[9] || ''
    });
  }
}

console.log(`Loaded ${contacts.length} contacts for breakdown.`);

const breakdown = {
  police_enforcement: { label: 'Police, Sheriff, DEA, OBN & Enforcement', count: 0 },
  governor: { label: 'Governor & Executive Offices', count: 0 },
  mayor_local: { label: 'Mayor, City Manager & Local Executive', count: 0 },
  senator_legislator: { label: 'Senators, Representatives & Legislative Offices', count: 0 },
  ag_legal: { label: 'Attorney General & District Attorneys / Prosecutors', count: 0 },
  cannabis_regulator: { label: 'State Cannabis Regulators (OMMA, DCC, etc.)', count: 0 },
  advocates: { label: 'Advocacy Organizations (NORML, MPP, etc.)', count: 0 },
  researchers: { label: 'Researchers, Labs & Universities', count: 0 },
  investors: { label: 'Venture Capital & Investors', count: 0 },
  healthcare: { label: 'Healthcare Providers', count: 0 },
  other_gov: { label: 'Other Government / Public Offices', count: 0 }
};

for (const c of contacts) {
  const text = `${c.orgName} ${c.contactName} ${c.notes}`.toLowerCase();
  
  // 1. Police & Enforcement
  if (text.includes('police') || text.includes('sheriff') || text.includes('dea') || text.includes('obn') || text.includes('narcotic') || text.includes('enforcement agency') || text.includes('highway patrol') || text.includes('chief of') || text.includes('law enforcement')) {
    breakdown.police_enforcement.count++;
  }
  // 2. Governor
  else if (text.includes('governor') || text.includes('lt. governor') || text.includes('executive chamber')) {
    breakdown.governor.count++;
  }
  // 3. Mayor & Local
  else if (text.includes('mayor') || text.includes('city manager') || text.includes('city hall') || text.includes('town manager') || text.includes('municipal office')) {
    breakdown.mayor_local.count++;
  }
  // 4. Senator & Legislator
  else if (text.includes('senat') || text.includes('representat') || text.includes('legislat') || text.includes('assembly') || text.includes('congress') || text.includes('house of')) {
    breakdown.senator_legislator.count++;
  }
  // 5. AG & Legal
  else if (text.includes('attorney general') || text.includes('district attorney') || text.includes('prosecutor') || text.includes('legal counsel') || c.category === 'Attorney') {
    breakdown.ag_legal.count++;
  }
  // 6. Cannabis Regulator
  else if (text.includes('omma') || text.includes('cannabis control') || text.includes('cannabis regulation') || text.includes('marijuana control') || text.includes('regulatory agency') || text.includes('ccb') || text.includes('mca') || text.includes('dcc')) {
    breakdown.cannabis_regulator.count++;
  }
  // 7. Advocates
  else if (c.category === 'Advocate / Non-Profit' || text.includes('norml') || text.includes('policy project') || text.includes('advocacy') || text.includes('coalition')) {
    breakdown.advocates.count++;
  }
  // 8. Researchers
  else if (c.category === 'Researcher / Academic' || text.includes('research') || text.includes('university') || text.includes('academic') || text.includes('scientist')) {
    breakdown.researchers.count++;
  }
  // 9. Investors
  else if (c.category === 'Investor' || text.includes('investor') || text.includes('venture') || text.includes('capital') || text.includes('funding')) {
    breakdown.investors.count++;
  }
  // 10. Healthcare
  else if (c.category === 'Healthcare Provider' || text.includes('provider') || text.includes('clinic') || text.includes('physician')) {
    breakdown.healthcare.count++;
  }
  // 11. Other Gov
  else if (c.category === 'Government Office / Agency' || text.includes('department of') || text.includes('agency') || text.includes('commission') || text.includes('board') || text.includes('bureau') || text.includes('office of')) {
    breakdown.other_gov.count++;
  }
}

console.log('\n=============================================================');
console.log('📊 AUDIENCE CONTACT BREAKDOWN DETAILED ANALYSIS');
console.log('=============================================================');
for (const key in breakdown) {
  const item = breakdown[key];
  console.log(`• ${item.label.padEnd(55)} : ${item.count.toString().padStart(5)}`);
}
console.log('=============================================================');
console.log(`Total Classified: ${Object.values(breakdown).reduce((sum, item) => sum + item.count, 0)}`);
console.log('=============================================================');

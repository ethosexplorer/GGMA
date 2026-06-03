import fs from 'fs';

const csvContent = fs.readFileSync('./valuation_contacts_export.csv', 'utf8');
const lines = csvContent.split('\n').filter(Boolean);

const contacts = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
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

const otherGov = [];
for (const c of contacts) {
  const text = `${c.orgName} ${c.contactName} ${c.notes}`.toLowerCase();
  
  // Exclude categorized ones
  const isEnforcement = text.includes('police') || text.includes('sheriff') || text.includes('dea') || text.includes('obn') || text.includes('narcotic') || text.includes('enforcement agency') || text.includes('highway patrol') || text.includes('chief of') || text.includes('law enforcement');
  const isGov = text.includes('governor') || text.includes('lt. governor') || text.includes('executive chamber');
  const isMayor = text.includes('mayor') || text.includes('city manager') || text.includes('city hall') || text.includes('town manager') || text.includes('municipal office');
  const isLegislator = text.includes('senat') || text.includes('representat') || text.includes('legislat') || text.includes('assembly') || text.includes('congress') || text.includes('house of');
  const isLegal = text.includes('attorney general') || text.includes('district attorney') || text.includes('prosecutor') || text.includes('legal counsel') || c.category === 'Attorney';
  const isRegulator = text.includes('omma') || text.includes('cannabis control') || text.includes('cannabis regulation') || text.includes('marijuana control') || text.includes('regulatory agency') || text.includes('ccb') || text.includes('mca') || text.includes('dcc');
  const isAdvocate = c.category === 'Advocate / Non-Profit' || text.includes('norml') || text.includes('policy project') || text.includes('advocacy') || text.includes('coalition');
  const isResearcher = c.category === 'Researcher / Academic' || text.includes('research') || text.includes('university') || text.includes('academic') || text.includes('scientist');
  const isInvestor = c.category === 'Investor' || text.includes('investor') || text.includes('venture') || text.includes('capital') || text.includes('funding');
  const isProvider = c.category === 'Healthcare Provider' || text.includes('provider') || text.includes('clinic') || text.includes('physician');
  
  if (!isEnforcement && !isGov && !isMayor && !isLegislator && !isLegal && !isRegulator && !isAdvocate && !isResearcher && !isInvestor && !isProvider) {
    if (c.category === 'Government Office / Agency') {
      otherGov.push(c);
    }
  }
}

console.log(`Found ${otherGov.length} other government contacts. Peeking 50:`);
console.log('---------------------------------------------------------');
otherGov.slice(0, 50).forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.state}] ${c.orgName} | Email: ${c.email} | Notes: ${c.notes}`);
});

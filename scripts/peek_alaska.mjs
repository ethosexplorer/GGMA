// Full preview of Alaska AMCO spreadsheet — all sections
import XLSX from 'xlsx';
const wb = XLSX.readFile('scripts/alaska_mj_applicants.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Find all section headers and count rows per section
let currentSection = '';
let sectionCounts = {};
let totalBiz = 0;
let allRows = [];

for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length === 0) continue;
  
  // Section headers are rows with a single string that doesn't look like data
  const first = String(row[0] || '').trim();
  
  // Detect header row
  if (first === 'License#') continue;
  
  // Detect section titles (non-numeric first cell, single value rows or description rows)
  if (row.length <= 2 && first && isNaN(Number(first))) {
    currentSection = first;
    if (!sectionCounts[currentSection]) sectionCounts[currentSection] = 0;
    continue;
  }
  
  // Data rows have a numeric license number
  if (!isNaN(Number(first)) && Number(first) > 0) {
    sectionCounts[currentSection] = (sectionCounts[currentSection] || 0) + 1;
    totalBiz++;
    allRows.push({
      section: currentSection,
      license: first,
      type: String(row[1] || ''),
      name: String(row[2] || ''),
      status: String(row[3] || ''),
      address: String(row[4] || ''),
      address2: String(row[5] || ''),
      city: String(row[6] || ''),
    });
  }
}

console.log('=== ALASKA AMCO APPLICANT SUMMARY ===\n');
for (const [section, count] of Object.entries(sectionCounts)) {
  console.log(`  ${section}: ${count}`);
}
console.log(`\n  TOTAL: ${totalBiz}\n`);

// Show license type breakdown
const typeBreakdown = {};
allRows.forEach(r => {
  typeBreakdown[r.type] = (typeBreakdown[r.type] || 0) + 1;
});
console.log('=== BY LICENSE TYPE ===');
for (const [type, count] of Object.entries(typeBreakdown).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

// Show status breakdown
const statusBreakdown = {};
allRows.forEach(r => {
  statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;
});
console.log('\n=== BY STATUS ===');
for (const [status, count] of Object.entries(statusBreakdown).sort((a,b) => b[1] - a[1])) {
  console.log(`  ${status}: ${count}`);
}

// Show first 5 per section
console.log('\n=== SAMPLE DATA (first 3 per section) ===');
const seen = {};
for (const r of allRows) {
  if (!seen[r.section]) seen[r.section] = 0;
  if (seen[r.section] < 3) {
    console.log(`  [${r.section}] #${r.license} | ${r.name} | ${r.type} | ${r.status} | ${r.city}`);
    seen[r.section]++;
  }
}

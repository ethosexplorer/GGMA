import xlsx from 'xlsx';

const workbook = xlsx.readFile('C:\\Users\\shans\\Downloads\\NATIONWIDE CANNABIS.xlsx');

console.log('=== LINKS IN STATES SHEET ===');
const statesSheet = workbook.Sheets['STATES'];
const statesData = xlsx.utils.sheet_to_json(statesSheet);
statesData.forEach((row, idx) => {
  console.log(`\nState ${idx + 1}: ${row['STATE']}`);
  Object.entries(row).forEach(([col, val]) => {
    if (col !== 'STATE' && typeof val === 'string' && val.startsWith('http')) {
      console.log(`  - ${col}: ${val}`);
    }
  });
});

console.log('\n=== LINKS IN SHEET4 ===');
const sheet4 = workbook.Sheets['Sheet4'];
const sheet4Data = xlsx.utils.sheet_to_json(sheet4);
sheet4Data.forEach((row, idx) => {
  console.log(`State: ${row['State']} | Regulator: ${row['Regulator']}`);
  Object.entries(row).forEach(([col, val]) => {
    if (col !== 'State' && col !== 'Regulator' && typeof val === 'string' && val.startsWith('http')) {
      console.log(`  - ${col}: ${val}`);
    }
  });
});

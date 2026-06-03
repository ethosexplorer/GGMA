import xlsx from 'xlsx';

const workbook = xlsx.readFile('C:\\Users\\shans\\Downloads\\NATIONWIDE CANNABIS.xlsx');
const sheet = workbook.Sheets['APPLICATIONS'];
const data = xlsx.utils.sheet_to_json(sheet);
console.log(`Total rows in APPLICATIONS: ${data.length}`);
data.slice(0, 40).forEach((r, idx) => {
  console.log(`Row ${idx + 1}:`, JSON.stringify(r));
});

import xlsx from 'xlsx';

const workbook = xlsx.readFile('C:\\Users\\shans\\Downloads\\NATIONWIDE CANNABIS.xlsx');
console.log('=== PEEKING NATIONWIDE CANNABIS.xlsx ===');
console.log('Sheets:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  console.log(`\nSheet: ${sheetName} - Total Rows: ${data.length}`);
  if (data.length > 0) {
    console.log('Keys/Headers:', Object.keys(data[0]));
    console.log('First 5 rows:');
    data.slice(0, 5).forEach((r, idx) => {
      console.log(`  Row ${idx + 1}:`, JSON.stringify(r));
    });
  }
}

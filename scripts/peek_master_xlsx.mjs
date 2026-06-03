import xlsx from 'xlsx';

const file = 'C:\\Users\\shans\\Downloads\\Generic_Evaluation_for_All_States_MASTER 10.2025 (6).xlsx';
try {
  const workbook = xlsx.readFile(file);
  console.log('=== PEEKING MASTER XLSX ===');
  console.log('Sheets:', workbook.SheetNames);
  
  for (const sheetName of workbook.SheetNames.slice(0, 5)) {
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log(`\nSheet: ${sheetName} - Total Rows: ${data.length}`);
    if (data.length > 0) {
      console.log('Keys/Headers:', Object.keys(data[0]));
      console.log('First 3 rows:');
      data.slice(0, 3).forEach((r, idx) => {
        console.log(`  Row ${idx + 1}:`, JSON.stringify(r));
      });
    }
  }
} catch (err) {
  console.error(err);
}

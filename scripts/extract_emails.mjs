import xlsx from 'xlsx';

const workbook = xlsx.readFile('C:\\Users\\shans\\Downloads\\NATIONWIDE CANNABIS.xlsx');
const sheet = workbook.Sheets['APPLICATIONS'];
const data = xlsx.utils.sheet_to_json(sheet);

console.log('=== EXTRACTING EMAILS FROM APPLICATIONS SHEET ===');
data.forEach((row, idx) => {
  let state = row['__EMPTY_1'] || '';
  // find the closest preceding row that has a state name if current row doesn't have it
  if (!state) {
    let tempIdx = idx;
    while (tempIdx >= 0) {
      const prevRow = data[tempIdx];
      if (prevRow && prevRow['__EMPTY_1']) {
        state = prevRow['__EMPTY_1'];
        break;
      }
      tempIdx--;
    }
  }

  Object.entries(row).forEach(([col, val]) => {
    if (typeof val === 'string') {
      const emails = val.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emails) {
        console.log(`Row ${idx + 2} (${state}): Column ${col} -> Value: "${val}" (Found emails: ${emails.join(', ')})`);
      }
    }
  });
});

import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const dir = 'C:\\Users\\shans\\Downloads';
const terms = ['governor', 'mayor', 'senat', 'representat', 'legislat', 'police', 'sheriff', 'dea', 'obn', 'attorney general', 'narcotic', 'enforcement'];

try {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file.endsWith('.csv')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      let matches = 0;
      lines.forEach((line, lineIdx) => {
        const lower = line.toLowerCase();
        terms.forEach(t => {
          if (lower.includes(t)) {
            matches++;
            if (matches <= 5) {
              console.log(`[CSV] ${file} L${lineIdx+1}: matched "${t}" -> ${line.substring(0, 100)}`);
            }
          }
        });
      });
      if (matches > 0) {
        console.log(`Summary: Found ${matches} matches in CSV: ${file}\n`);
      }
    } else if (file.endsWith('.xlsx') || file.endsWith('.xls')) {
      try {
        const workbook = xlsx.readFile(filePath);
        let matches = 0;
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const data = xlsx.utils.sheet_to_json(sheet);
          data.forEach((row, rowIdx) => {
            Object.entries(row).forEach(([col, val]) => {
              if (typeof val === 'string') {
                const lower = val.toLowerCase();
                terms.forEach(t => {
                  if (lower.includes(t)) {
                    matches++;
                    if (matches <= 5) {
                      console.log(`[XLSX] ${file} (Sheet: ${sheetName}, Row: ${rowIdx+2}): matched "${t}" -> col ${col} = ${val.substring(0, 100)}`);
                    }
                  }
                });
              }
            });
          });
        }
        if (matches > 0) {
          console.log(`Summary: Found ${matches} matches in Excel: ${file}\n`);
        }
      } catch (err) {
        // ignore
      }
    }
  }
} catch (err) {
  console.error(err);
}

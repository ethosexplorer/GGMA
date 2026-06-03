import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const dir = 'C:\\Users\\shans\\Downloads';
try {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file.endsWith('.csv')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emails && emails.length > 0) {
        console.log(`Found ${emails.length} emails in CSV: ${file}`);
        console.log(`Examples:`, Array.from(new Set(emails)).slice(0, 10));
      }
    } else if (file.endsWith('.xlsx') || file.endsWith('.xls')) {
      try {
        const workbook = xlsx.readFile(filePath);
        let count = 0;
        const found = new Set();
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const data = xlsx.utils.sheet_to_json(sheet);
          data.forEach(row => {
            Object.values(row).forEach(val => {
              if (typeof val === 'string') {
                const matches = val.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
                if (matches) {
                  matches.forEach(e => {
                    found.add(e);
                    count++;
                  });
                }
              }
            });
          });
        }
        if (count > 0) {
          console.log(`Found ${count} emails in Excel: ${file} (${found.size} unique)`);
          console.log(`Examples:`, Array.from(found).slice(0, 10));
        }
      } catch (err) {
        // ignore
      }
    }
  }
} catch (err) {
  console.error(err);
}

import xlsx from 'xlsx';

const workbook = xlsx.readFile('C:\\Users\\shans\\Downloads\\NATIONWIDE CANNABIS.xlsx');
const allUrls = new Set();

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  data.forEach(row => {
    Object.values(row).forEach(val => {
      if (typeof val === 'string') {
        const matches = val.match(/https?:\/\/[^\s"',]+/g);
        if (matches) {
          matches.forEach(url => allUrls.add(url));
        }
      }
    });
  });
}

console.log(`Found ${allUrls.size} unique URLs in NATIONWIDE CANNABIS.xlsx:`);
Array.from(allUrls).sort().forEach(url => {
  console.log(` - ${url}`);
});

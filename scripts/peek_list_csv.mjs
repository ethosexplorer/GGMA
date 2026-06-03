import fs from 'fs';

const csvContent = fs.readFileSync('C:\\Users\\shans\\Downloads\\list.csv', 'utf8');
const lines = csvContent.split('\n').filter(Boolean);

console.log('=== PEEKING list.csv ===');
console.log(`Total lines: ${lines.length}`);
lines.slice(0, 30).forEach((l, idx) => {
  console.log(`${idx + 1}: ${l}`);
});

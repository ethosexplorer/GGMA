import fs from 'fs';
import path from 'path';

const searchDirs = [
  'C:\\Users\\shans\\Downloads',
  'C:\\Users\\shans\\Desktop',
  'C:\\Users\\shans\\Documents',
  'c:\\GGMA'
];

console.log('=== SEARCHING FOR CSV/XLSX FILES ===');
for (const dir of searchDirs) {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`Directory does not exist: ${dir}`);
      continue;
    }
    const files = fs.readdirSync(dir);
    const matched = files.filter(f => f.endsWith('.csv') || f.endsWith('.xlsx') || f.endsWith('.xls'));
    console.log(`\n📂 Directory: ${dir} (Found ${matched.length} files):`);
    matched.forEach(f => {
      const stats = fs.statSync(path.join(dir, f));
      console.log(`  - ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
    });
  } catch (err) {
    console.log(`Error reading ${dir}: ${err.message}`);
  }
}

const fs = require('fs');
const path = require('path');

const files = [
  'AttorneyDashboard.tsx',
  'BusinessDashboard.tsx',
  'CareWalletDashboard.tsx',
  'FounderDashboard.tsx'
];

for (let file of files) {
  const p = path.join(__dirname, 'src', 'pages', file);
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  // Match more flexibly
  const target = /<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2">\s*<FolderLock size=\{16\} \/> Upload Record\s*<\/button>/g;
  
  const replacement = `<label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
                           <FolderLock size={16} /> Upload Record
                           <input type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) alert('File "' + e.target.files[0].name + '" queued. Establishing secure connection to Vault...'); }} />
                        </label>`;

  if (target.test(c)) {
    c = c.replace(target, replacement);
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Patched Upload button in ${file}`);
  } else {
    // try even more flexible
    const target2 = /<button[^>]*>\s*<FolderLock size=\{16\} \/> Upload Record\s*<\/button>/g;
    if (target2.test(c)) {
      c = c.replace(target2, replacement);
      fs.writeFileSync(p, c, 'utf8');
      console.log(`Patched Upload button in ${file} using fallback regex`);
    } else {
      console.log(`Could not find button in ${file}`);
    }
  }
}

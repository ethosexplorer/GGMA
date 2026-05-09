const fs = require('fs');
const path = require('path');

const files = [
  'ProviderDashboard.tsx',
  'AttorneyDashboard.tsx',
  'BusinessDashboard.tsx',
  'CareWalletDashboard.tsx',
  'FounderDashboard.tsx'
];

for (let file of files) {
  const p = path.join(__dirname, 'src', 'pages', file);
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  // Replace ProviderDashboard's specific button which used Plus instead of FolderLock originally, or FolderLock in the global patch
  const target1 = /<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2">\s*<(Plus|FolderLock) size=\{16\} \/> Upload Record\s*<\/button>/g;
  
  const replacement = `<label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
                           <FolderLock size={16} /> Upload Record
                           <input type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) alert('File "' + e.target.files[0].name + '" queued. Establishing secure connection to Vault...'); }} />
                        </label>`;

  if (target1.test(c)) {
    c = c.replace(target1, replacement);
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Patched Upload button in ${file}`);
  } else {
    console.log(`Could not find button in ${file}`);
  }
}

const fs = require('fs');
const path = require('path');

const files = [
  'ProviderDashboard.tsx',
  'FounderDashboard.tsx',
  'BackOfficeDashboard.tsx',
  'AttorneyDashboard.tsx'
];

for (let file of files) {
  const p = path.join(__dirname, 'src', 'pages', file);
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  // Add import
  if (!c.includes('NotificationDropdown')) {
    // Inject at the top
    c = c.replace(/import React[^;]*;/, "$&\nimport { NotificationDropdown } from '../components/shared/NotificationDropdown';");
  }

  // Find the button wrapping the bell
  // Usually looks like:
  // <button onClick={() => document.dispatchEvent(new CustomEvent("open-sylara"))} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
  //    <Bell size={20} />
  //    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
  // </button>
  // OR just <button ...> <Bell size={20} /> </button>
  
  const btnRegex = /<button[^>]*>\s*<Bell size=\{20\} \/>[\s\S]*?<\/button>/g;
  
  if (btnRegex.test(c)) {
    c = c.replace(btnRegex, "<NotificationDropdown />");
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Patched notifications in ${file}`);
  } else {
    console.log(`Could not find Bell button in ${file}`);
  }
}

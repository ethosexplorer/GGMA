const fs = require('fs');
const path = require('path');

const files = [
  'ProviderDashboard.tsx',
  'FounderDashboard.tsx'
];

for (let file of files) {
  const p = path.join(__dirname, 'src', 'pages', file);
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  // Add import
  if (!c.includes('NotificationDropdown')) {
    c = c.replace(/import { cn } from '\.\.\/lib\/utils';/, "import { cn } from '../lib/utils';\nimport { NotificationDropdown } from '../components/shared/NotificationDropdown';");
    if (!c.includes('NotificationDropdown')) {
      c = c.replace(/import React[^;]*;/, "$&\nimport { NotificationDropdown } from '../components/shared/NotificationDropdown';");
    }
  }

  // Replace bell button
  const oldBtn = `<button onClick={() => document.dispatchEvent(new CustomEvent("open-sylara"))} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">\n              <Bell size={20} />\n              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />\n            </button>`;
  
  if (c.includes(oldBtn)) {
    c = c.replace(oldBtn, "<NotificationDropdown />");
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Patched exactly in ${file}`);
  } else {
    // Try without spaces padding
    c = c.replace(/<button onClick=\{\(\) => document\.dispatchEvent\(new CustomEvent\("open-sylara"\)\)\} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">\s*<Bell size=\{20\} \/>\s*<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" \/>\s*<\/button>/g, "<NotificationDropdown />");
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Patched using regex in ${file}`);
  }
}

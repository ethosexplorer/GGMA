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
    c = c.replace(/import React[^;]*;/, "$&\nimport { NotificationDropdown } from '../components/shared/NotificationDropdown';");
  }

  // Replace bell button
  const bellBtnRegex = /<button[^>]*>\s*<Bell size=\{20\} \/>[\s\S]*?<\/button>/;
  if (bellBtnRegex.test(c)) {
    c = c.replace(bellBtnRegex, "<NotificationDropdown />");
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Patched bell in ${file}`);
  } else {
    console.log(`Could not find Bell in ${file}`);
  }
}

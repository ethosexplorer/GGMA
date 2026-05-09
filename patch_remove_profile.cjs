const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (let file of files) {
  const p = path.join(pagesDir, file);
  let c = fs.readFileSync(p, 'utf8');

  const regex = /\{\s*user && <ProfileSettingsCard user=\{user\} roleLabel="[^"]*" \/>\s*\}/g;
  
  if (regex.test(c)) {
    c = c.replace(regex, "");
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Removed rogue ProfileSettingsCard from ${file}`);
  }
}

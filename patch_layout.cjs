const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'PublicHealthDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/\{\s*user && <ProfileSettingsCard user=\{user\} roleLabel="User Info" \/>\s*\}/g, "");

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed layout in PublicHealthDashboard.tsx');

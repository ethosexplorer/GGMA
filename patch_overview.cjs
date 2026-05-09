const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'ProviderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Make Overview identical to Queue so it has actual content
c = c.replace(
  /\{activeTab === 'queue' && \(/g,
  "{['queue', 'overview'].includes(activeTab) && ("
);

// 2. Remove overview from the placeholder array, replace it with just rendering ProfileSettingsCard for settings
c = c.replace(
  /\{\['overview', 'settings'\]\.includes\(activeTab\) && \([\s\S]*?Return to Patient Queue[\s\S]*?<\/button>\s*<\/div>\s*\)\}/,
  `{activeTab === 'settings' && (
                  <ProfileSettingsCard user={user} roleLabel="User Info" />
                )}`
);

fs.writeFileSync(p, c, 'utf8');
console.log('ProviderDashboard patched for overview and settings.');

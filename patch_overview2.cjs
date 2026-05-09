const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'ProviderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  "{ id: 'overview', label: 'Overview', icon: BarChart },\n",
  ""
);

c = c.replace(
  /\{activeTab === 'overview' && \(\s*<div className="mb-6">\s*<ImportantUpdates role="provider" \/>\s*<\/div>\s*\)\}/,
  ""
);

c = c.replace(
  /\{\['queue', 'overview'\]\.includes\(activeTab\) && \(/,
  "{activeTab === 'queue' && ("
);

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed Overview tab removal.');

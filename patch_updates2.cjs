const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'ProviderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /\{\/\* Important Updates \*\/\}\s*\{activeTab === 'queue' && \(\s*<div className="mb-6 relative group">/,
  `{/* Important Updates */}
            {activeTab === 'queue' && !hideUpdates && (
              <div className="mb-6 relative group">`
);

c = c.replace(
  /\{\/\* Right Sidebar \*\/\}\s*<div className="space-y-6">/,
  `{/* Right Sidebar */}
              <div className="space-y-6">
                {activeTab === 'queue' && hideUpdates && (
                  <button onClick={() => setHideUpdates(false)} className="w-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-sm">
                    <Bell size={16} /> View Important Updates (3)
                  </button>
                )}`
);

fs.writeFileSync(p, c, 'utf8');
console.log('ProviderDashboard updates patched cleanly.');

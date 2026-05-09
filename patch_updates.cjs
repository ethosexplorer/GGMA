const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'ProviderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

if (!c.includes('const [hideUpdates, setHideUpdates] = useState(false);')) {
  c = c.replace(
    /const \[showCertWizard, setShowCertWizard\] = useState\(false\);/,
    "const [showCertWizard, setShowCertWizard] = useState(false);\n  const [hideUpdates, setHideUpdates] = useState(false);"
  );
  
  c = c.replace(
    /\{activeTab === 'queue' && \(\s*<div className="mb-6">\s*<ImportantUpdates role="provider" \/>\s*<\/div>\s*\)\}/,
    `{activeTab === 'queue' && !hideUpdates && (
              <div className="mb-6 relative group">
                <button onClick={() => setHideUpdates(true)} className="absolute top-2 right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm transition-all z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <X size={14} /> Mark as Read
                </button>
                <ImportantUpdates role="provider" />
              </div>
            )}`
  );
  
  // Inject a button to the right column if it's hidden
  c = c.replace(
    /\{activeTab === 'queue' && \(\s*<>\s*<div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">/g,
    `{activeTab === 'queue' && (
                  <>
                    {hideUpdates && (
                      <button onClick={() => setHideUpdates(false)} className="w-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm py-3 rounded-xl mb-6 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                        <Bell size={16} /> View Important Updates (3)
                      </button>
                    )}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">`
  );
  
  fs.writeFileSync(p, c, 'utf8');
  console.log('ProviderDashboard updates patched successfully.');
}

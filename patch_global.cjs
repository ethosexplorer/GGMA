const fs = require('fs');
const path = require('path');

const files = [
  { name: 'AttorneyDashboard.tsx', sidebar: 'ggp_attorney_sidebar_order', role: 'attorney', vaultName: 'Legal & Case Vault', vaultDesc: 'Secure, permanent storage for case files, compliance records, and legal documentation.' },
  { name: 'BusinessDashboard.tsx', sidebar: 'ggp_business_sidebar_order', role: 'business', vaultName: 'Enterprise Document Vault', vaultDesc: 'Secure, permanent storage for OMMA compliance audits, operational manifests, and invoices.' },
  { name: 'CareWalletDashboard.tsx', sidebar: 'ggp_patient_sidebar_order', role: 'patient', vaultName: 'My Medical Vault', vaultDesc: 'Secure, permanent storage for your HIPAA-compliant medical records, certifications, and receipts.' },
  { name: 'FounderDashboard.tsx', sidebar: null, role: 'founder', vaultName: 'Executive Command Vault', vaultDesc: 'Secure, permanent storage for platform-wide analytics, financial statements, and administrative records.' }
];

for (let f of files) {
  const p = path.join(__dirname, 'src', 'pages', f.name);
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  // Add state
  if (!c.includes('hideUpdates')) {
    if (c.includes('const [activeTab, setActiveTab]')) {
      c = c.replace(
        /const \[activeTab, setActiveTab\] = useState\([^)]+\);/,
        "$&" + "\n  const [hideUpdates, setHideUpdates] = useState(false);"
      );
    } else {
      // For FounderDashboard which has currentTab instead of activeTab, or just state in general
      c = c.replace(
        /const \[currentTab, setCurrentTab\] = useState\([^)]+\);/,
        "$&" + "\n  const [hideUpdates, setHideUpdates] = useState(false);"
      );
    }
  }

  // Inject Dismissible ImportantUpdates
  const updateRegex = new RegExp(`<ImportantUpdates role="${f.role}" \\/>`);
  if (updateRegex.test(c) && !c.includes('hideUpdates && (')) {
    c = c.replace(updateRegex, 
      `{!hideUpdates && (
        <div className="mb-6 relative group">
          <button onClick={() => setHideUpdates(true)} className="absolute top-2 right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm transition-all z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <X size={14} /> Mark as Read
          </button>
          <ImportantUpdates role="${f.role}" />
        </div>
      )}
      {hideUpdates && (
        <button onClick={() => setHideUpdates(false)} className="w-full max-w-5xl mx-auto bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-sm mb-6">
          <Bell size={16} /> View Important Updates
        </button>
      )}`
    );
  }

  // Add Lucide Imports
  if (!c.includes('FolderLock')) {
    c = c.replace(/\} from 'lucide-react';/, ", FolderLock, Download, Eye, X } from 'lucide-react';");
  }

  // Add Vault to Sidebar (if applicable)
  if (f.sidebar) {
    if (!c.includes("id: 'vault'")) {
      const sidebarRegex = /const DEFAULT_SIDEBAR_ITEMS = \[\s*([\s\S]*?)\];/;
      const match = c.match(sidebarRegex);
      if (match) {
        c = c.replace(sidebarRegex, `const DEFAULT_SIDEBAR_ITEMS = [\n$1  { id: 'vault', label: 'Secure Vault', icon: FolderLock },\n];`);
      }
    }
  }

  // Add Vault UI
  const tabVar = c.includes('currentTab') ? 'currentTab' : 'activeTab';
  const vaultUI = `
                  {${tabVar} === 'vault' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 max-w-7xl mx-auto">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600"/> ${f.vaultName}</h3>
                          <p className="text-sm text-slate-500">${f.vaultDesc}</p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
                           <FolderLock size={16} /> Upload Record
                        </button>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                             <tr>
                               <th className="p-4">Document Name</th>
                               <th className="p-4">Category</th>
                               <th className="p-4">Date Added</th>
                               <th className="p-4 text-right">Actions</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-indigo-50 text-indigo-500 rounded"><FolderLock size={16}/></div>
                                 <div>
                                   System Initialized Secure Container
                                   <span className="block text-xs text-slate-400 font-normal">Active & Protected</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">System</span></td>
                               <td className="p-4 text-slate-600">Today</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                           </tbody>
                        </table>
                      </div>
                    </div>
                  )}
`;

  if (!c.includes(`${tabVar} === 'vault'`)) {
    // Inject at the bottom of the main component return, right before the closing divs
    if (f.name === 'FounderDashboard.tsx') {
        c = c.replace(/\{renderTabContent\(\)\}/, "{renderTabContent()}\n" + vaultUI);
        // Also add tab button
        if (!c.includes("currentTab === 'vault'")) {
           c = c.replace(/<button\s+onClick=\{\(\) => setCurrentTab\('overview'\)\}/, 
             `<button onClick={() => setCurrentTab('vault')} className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all \${currentTab === 'vault' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}\`}><FolderLock size={16}/> Vault</button>\n          $&`);
        }
    } else {
        // Find the last activeTab condition and inject it after
        c = c.replace(/\{activeTab === 'settings' && \([\s\S]*?\}\)/, `$&${vaultUI}`);
        // If settings tab wasn't found, try 'profile'
        if (!c.includes(`${tabVar} === 'vault'`)) {
             c = c.replace(/\{activeTab === 'profile' && \([\s\S]*?\}\)/, `$&${vaultUI}`);
        }
    }
  }

  fs.writeFileSync(p, c, 'utf8');
  console.log(`Patched ${f.name}`);
}

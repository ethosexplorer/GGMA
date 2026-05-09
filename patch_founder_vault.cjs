const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'FounderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Add renderVault
const vaultUI = `  const renderVault = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 max-w-7xl mx-auto">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600"/> Executive Command Vault</h3>
          <p className="text-sm text-slate-500">Secure, permanent storage for platform-wide analytics, financial statements, and administrative records.</p>
        </div>
        <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
           <FolderLock size={16} /> Upload Record
           <input type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) alert('File "' + e.target.files[0].name + '" queued. Establishing secure connection to Vault...'); }} />
        </label>
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
  );
`;

if (!c.includes('renderVault = () =>')) {
  // Inject before renderOverview
  c = c.replace(/const renderOverview = \(\) => \(/, vaultUI + "\n  const renderOverview = () => (");
}

// 2. Add to switch statement
if (!c.includes("case 'vault': return renderVault();")) {
  c = c.replace(/case 'overview': return renderOverview\(\);/, "case 'vault': return renderVault();\n        case 'overview': return renderOverview();");
}

// 3. Add to navbar (horizontal scrolling list of buttons at the top of FounderDashboard)
if (!c.includes("setCurrentTab('vault')")) {
  c = c.replace(/<button\s*onClick=\{\(\) => setCurrentTab\('overview'\)\}/, 
    `<button onClick={() => setCurrentTab('vault')} className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all \${currentTab === 'vault' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}\`}><FolderLock size={16}/> Vault</button>\n          $&`);
}

fs.writeFileSync(p, c, 'utf8');
console.log('FounderDashboard Vault injected.');

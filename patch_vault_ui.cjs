const fs = require('fs');
const path = require('path');

const files = [
  { name: 'AttorneyDashboard.tsx', role: 'attorney', vaultName: 'Legal & Case Vault', vaultDesc: 'Secure, permanent storage for case files, compliance records, and legal documentation.', var: 'activeTab' },
  { name: 'BusinessDashboard.tsx', role: 'business', vaultName: 'Enterprise Document Vault', vaultDesc: 'Secure, permanent storage for OMMA compliance audits, operational manifests, and invoices.', var: 'activeTab' },
  { name: 'CareWalletDashboard.tsx', role: 'patient', vaultName: 'My Medical Vault', vaultDesc: 'Secure, permanent storage for your HIPAA-compliant medical records, certifications, and receipts.', var: 'activeTab' }
];

for (let f of files) {
  const p = path.join(__dirname, 'src', 'pages', f.name);
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  // Vault UI with the input file trick inside
  const vaultUI = `
                  {${f.var} === 'vault' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 max-w-7xl mx-auto">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600"/> ${f.vaultName}</h3>
                          <p className="text-sm text-slate-500">${f.vaultDesc}</p>
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
                  )}
`;

  // Prevent double injection
  if (!c.includes(`${f.var} === 'vault'`)) {
    // Inject near the bottom
    c = c.replace(/(\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};)/, vaultUI + "\n$1");
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Injected Vault UI into ${f.name}`);
  } else {
    console.log(`${f.name} already has Vault UI.`);
  }
}

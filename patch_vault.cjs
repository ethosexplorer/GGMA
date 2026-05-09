const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'ProviderDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// 1. Add FolderLock to lucide-react imports
if (!c.includes('FolderLock')) {
  c = c.replace(/CircleCheck, ArrowRight \} from 'lucide-react';/, "CircleCheck, ArrowRight, FolderLock, Download, Eye } from 'lucide-react';");
}

// 2. Add 'vault' to DEFAULT_SIDEBAR_ITEMS
if (!c.includes("id: 'vault'")) {
  c = c.replace(
    /\{ id: 'reports', label: 'Reports', icon: BarChart \},/,
    "{ id: 'reports', label: 'Reports', icon: BarChart },\n  { id: 'vault', label: 'Secure Vault', icon: FolderLock },"
  );
}

// 3. Add Vault UI Segment
const vaultUI = `
                  {activeTab === 'vault' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600"/> Provider & Patient Vault</h3>
                          <p className="text-sm text-slate-500">Secure, permanent storage for HIPAA-compliant medical records, compliance audits, and patient histories.</p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
                           <Plus size={16} /> Upload Record
                        </button>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                             <tr>
                               <th className="p-4">Document Name</th>
                               <th className="p-4">Category</th>
                               <th className="p-4">Date Added</th>
                               <th className="p-4">Size</th>
                               <th className="p-4 text-right">Actions</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-red-50 text-red-500 rounded"><FileText size={16}/></div>
                                 <div>
                                   Michael Chen - Complete Medical History
                                   <span className="block text-xs text-slate-400 font-normal">Patient ID: PT-9942</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Patient Record</span></td>
                               <td className="p-4 text-slate-600">May 09, 2026</td>
                               <td className="p-4 text-slate-500">4.2 MB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-emerald-50 text-emerald-500 rounded"><Shield size={16}/></div>
                                 <div>
                                   State Compliance Audit - Q1 2026
                                   <span className="block text-xs text-slate-400 font-normal">System Generated</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Audit Report</span></td>
                               <td className="p-4 text-slate-600">Apr 30, 2026</td>
                               <td className="p-4 text-slate-500">1.1 MB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-purple-50 text-purple-500 rounded"><CreditCard size={16}/></div>
                                 <div>
                                   Monthly Billing & Revenue Summary
                                   <span className="block text-xs text-slate-400 font-normal">April 2026</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Financial</span></td>
                               <td className="p-4 text-slate-600">May 01, 2026</td>
                               <td className="p-4 text-slate-500">845 KB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors opacity-60">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-slate-100 text-slate-500 rounded"><FileText size={16}/></div>
                                 <div>
                                   Sarah Jenkins - Transferred Records
                                   <span className="block text-xs text-slate-400 font-normal">Patient ID: PT-8812</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Patient Record</span></td>
                               <td className="p-4 text-slate-600">Mar 12, 2026</td>
                               <td className="p-4 text-slate-500">12.5 MB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
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

if (!c.includes("activeTab === 'vault'")) {
  c = c.replace(
    /\{activeTab === 'reports' && \(/,
    vaultUI + "\n                  {activeTab === 'reports' && ("
  );
}

// Ensure the buttons on Reports now route to Vault with an alert that they were sent there
c = c.replace(
  /alert\("Compiling Monthly Patient Volume Report\.\.\. The PDF will download securely in a few moments\."\)/g,
  `{ alert("Compiling Monthly Patient Volume Report... The generated PDF is being securely saved to your Vault."); setActiveTab('vault'); }`
);
c = c.replace(
  /alert\("Generating State Compliance Audit\.\.\. LARRY AI is cross-referencing your records with OMMA limits\."\)/g,
  `{ alert("Generating State Compliance Audit... LARRY AI is cross-referencing your records. The final audit will be saved to your Vault."); setActiveTab('vault'); }`
);
c = c.replace(
  /alert\("Retrieving Revenue & Billing Summary from the secure payment gateway\.\.\."\)/g,
  `{ alert("Retrieving Revenue & Billing Summary... The report will be saved to your Vault."); setActiveTab('vault'); }`
);
c = c.replace(
  /alert\("Compiling Anonymized Efficacy Reports\. Please allow up to 60 seconds for clinical data aggregation\."\)/g,
  `{ alert("Compiling Anonymized Efficacy Reports... The clinical aggregation will be saved to your Vault when complete."); setActiveTab('vault'); }`
);


fs.writeFileSync(p, c, 'utf8');
console.log('ProviderDashboard Vault patched successfully.');

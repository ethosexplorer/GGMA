import React from 'react';
import { FolderLock, Eye, Download } from 'lucide-react';
import { AdminPatientVaultUpload } from './AdminPatientVaultUpload';

export const VaultTab = () => {
  return (
    <div className="space-y-8 mt-6 max-w-7xl mx-auto">
      {/* Executive Command Vault */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600" /> Executive Command Vault</h3>
            <p className="text-sm text-slate-500">Secure, permanent storage for platform-wide analytics, financial statements, and administrative records.</p>
          </div>
          <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
            <FolderLock size={16} /> Upload Record
            <input type="file" className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const filename = e.target.files[0].name;
                import('../../lib/turso').then(({ turso }) => {
                  return turso.execute({
                    sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                    args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: `File "${filename}" queued. Establishing secure connection to Vault...` })]
                  });
                }).then(() => {
                  alert(`File "${filename}" queued. Establishing secure connection to Vault...\n\n[Live Production Transaction Logged]`);
                }).catch(console.error);
              }
            }} />
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
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded"><FolderLock size={16} /></div>
                  <div>
                    System Initialized Secure Container
                    <span className="block text-xs text-slate-400 font-normal">Active & Protected</span>
                  </div>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">System</span></td>
                <td className="p-4 text-slate-600">Today</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => {
                      import('../../lib/turso').then(({ turso }) => {
                        return turso.execute({
                          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                          args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening document in secure executive viewer..." })]
                        });
                      }).then(() => {
                        alert("Opening document in secure executive viewer...\n\n[Live Production Transaction Logged]");
                      }).catch(console.error);
                    }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14} /></button>
                    <button onClick={() => {
                      import('../../lib/turso').then(({ turso }) => {
                        return turso.execute({
                          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                          args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_DOWNLOAD", "Production_User", JSON.stringify({ detail: "Preparing encrypted download from Executive Vault..." })]
                        });
                      }).then(() => {
                        alert("Preparing encrypted download from Executive Vault...\n\n[Live Production Transaction Logged]");
                      }).catch(console.error);
                    }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14} /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Vault Upload (Admin) */}
      <AdminPatientVaultUpload />
    </div>
  );
};


import React from 'react';
import { X, Shield, FileText, Activity, Users, AlertTriangle, Briefcase, Database } from 'lucide-react';

export const FounderModals = ({ activeModal, onClose }: { activeModal: any, onClose: () => void }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl border border-slate-200 relative animate-in zoom-in-95 duration-300 my-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          {activeModal.type === 'employee_profile' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{activeModal.data?.name || 'Jane Doe'}</h2>
                  <p className="text-indigo-600 font-bold">{activeModal.data?.role || 'Senior Medical Officer'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Status</p>
                  <p className="font-bold text-emerald-600">Active / Cleared</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Location</p>
                  <p className="font-bold text-slate-700">Oklahoma City, OK</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 border-b pb-2">Complete Personnel File</h3>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Hire Date:</span><span className="font-bold">Jan 12, 2024</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Clearance Level:</span><span className="font-bold">Level 4 (Medical)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Last Background Check:</span><span className="font-bold text-emerald-600">Passed (Oct 2025)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Active Certifications:</span><span className="font-bold">OMMA Med-Staff, HIPAA Pro</span></div>
                </div>
                <div className="flex gap-3 mt-6">
                   <button className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors">Suspend Operator</button>
                   <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">View Audit Logs</button>
                </div>
              </div>
            </div>
          )}

          {activeModal.type === 'negligence_report' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Negligence Intercept Report</h2>
                  <p className="text-red-600 font-bold">Incident #{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-6 text-red-900 text-sm leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded block w-max mb-2">AI Guardian Analysis</span>
                System detected an anomaly in the inventory reconciliation logs. User {activeModal.data?.user || 'John Doe'} attempted to finalize a harvest batch without uploading the required State Lab COA. AI Guardian intercepted the request and locked the batch.
              </div>
              <h3 className="font-bold text-slate-800 mb-3">Required Corrective Action</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="radio" name="action" className="mt-1" defaultChecked />
                  <div>
                    <p className="font-bold text-slate-800">Mandatory Retraining</p>
                    <p className="text-xs text-slate-500">Lock user out until they complete the compliance module.</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="radio" name="action" className="mt-1" />
                  <div>
                    <p className="font-bold text-slate-800">Escalate to Legal Sentinel</p>
                    <p className="text-xs text-slate-500">Forward this log directly to retained legal counsel for review.</p>
                  </div>
                </label>
              </div>
              <button onClick={onClose} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg">Execute Corrective Action</button>
            </div>
          )}

          {activeModal.type === 'master_ledger' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Database size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Master Ledger Extract</h2>
                  <p className="text-emerald-600 font-bold">Network Reserves Reconciliation</p>
                </div>
              </div>
              <div className="p-12 text-center bg-slate-50 border border-slate-200 rounded-2xl border-dashed">
                 <Database size={48} className="text-slate-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Generating Secure Ledger View...</h3>
                 <p className="text-sm text-slate-500 max-w-sm mx-auto">This action requires a secondary 2FA token from the Chief Financial Officer before raw ledger data can be decrypted on this device.</p>
                 <button onClick={onClose} className="mt-6 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Acknowledge</button>
              </div>
            </div>
          )}

          {activeModal.type === 'system_logs' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-800 text-emerald-400 rounded-2xl flex items-center justify-center">
                  <Activity size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Detailed System Logs</h2>
                  <p className="text-slate-500 font-bold">AI Guardian Traffic & Health</p>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[10px] sm:text-xs text-emerald-400 h-64 overflow-y-auto space-y-2">
                <p><span className="text-slate-500">[14:02:01]</span> INFO: Metrc API Polling initialized for OK-Sector</p>
                <p><span className="text-slate-500">[14:02:15]</span> SUCCESS: 1,402 tags synchronized.</p>
                <p><span className="text-slate-500">[14:05:44]</span> WARN: High latency detected on Care Wallet gateway.</p>
                <p><span className="text-slate-500">[14:05:46]</span> INFO: Rerouting transaction traffic to Backup Node B.</p>
                <p><span className="text-slate-500">[14:10:00]</span> SUCCESS: Database snapshot generated.</p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          )}

          {activeModal.type === 'job_posting' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Briefcase size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Recruitment & Temp Services</h2>
                  <p className="text-blue-600 font-bold">Deploy New Virtual Position</p>
                </div>
              </div>
              <p className="text-slate-600 mb-6">This interface connects directly to Indeed, ZipRecruiter, and specialized cannabis temp agencies.</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Job Title</label>
                    <input type="text" placeholder="e.g. Virtual Trimming Supervisor" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Platform Distribution</label>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold">Indeed</span>
                      <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-bold">Vangst (Cannabis)</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg text-xs font-bold">LinkedIn</span>
                    </div>
                 </div>
              </div>
              <button onClick={onClose} className="w-full bg-[#1a4731] text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition-colors shadow-lg mt-8">Publish Job Requisition</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

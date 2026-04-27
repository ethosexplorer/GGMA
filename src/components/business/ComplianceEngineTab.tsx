import React, { useState } from 'react';
import { Shield, Zap, AlertTriangle, CheckCircle, Database, Search, Activity, RefreshCw, BarChart2, ArrowRight, ClipboardList } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ComplianceWorkflowConsole } from './ComplianceWorkflowConsole';

export const ComplianceEngineTab = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Shield size={120} /></div>
         <div className="relative z-10 flex flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
               <h2 className="text-4xl font-black tracking-tight mb-4 leading-none">Global Compliance Engine</h2>
               <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  Real-time METRC synchronization, inventory anomaly detection, and automated regulatory reporting for nationwide operations.
               </p>
            </div>
            <div className="flex flex-col items-center gap-3">
               <div className="text-5xl font-black text-emerald-400">99.8%</div>
               <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Compliance Health</p>
            </div>
         </div>
      </div>

      {/* METRC Seed-to-Sale Operational Console */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-emerald-600" size={24} /> 
            Seed-to-Sale Operations
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Metrc Certified Module</span>
        </div>
        <ComplianceWorkflowConsole />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            {/* METRC Sync Diagnostics */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                     <Database size={24} className="text-blue-600" /> 
                     METRC Sync Diagnostics
                  </h3>
                  <button 
                    onClick={handleSync}
                    className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", 
                    isSyncing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 active:scale-95")}
                  >
                     <RefreshCw size={14} className={cn(isSyncing && "animate-spin")} /> 
                     {isSyncing ? 'Syncing...' : 'Force Global Sync'}
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { l: 'Last Batch Sync', v: 'Success', s: '2m ago', c: 'text-emerald-600' },
                    { l: 'Pending Transfers', v: '0', s: 'Synced', c: 'text-slate-400' },
                    { l: 'API Key Latency', v: '18ms', s: 'Optimal', c: 'text-emerald-600' },
                    { l: 'Facility Auth', v: 'Verified', s: '4/4 Facilities', c: 'text-emerald-600' }
                  ].map((stat, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                       <div className="flex justify-between items-end">
                          <p className="text-lg font-black text-slate-800">{stat.v}</p>
                          <p className={cn("text-[10px] font-black", stat.c)}>{stat.s}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Inventory Anomaly Detection */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                     <Zap size={24} className="text-amber-500" /> 
                     Inventory Anomaly Detection
                  </h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">AI MONITOR ACTIVE</span>
               </div>

               <div className="space-y-4">
                  {[
                    { t: 'Weight Variance Detected', d: 'Batch #8492-X in Oklahoma shows a 4.2% variance between harvest and package weights.', s: 'Critical', c: 'text-red-600', bg: 'bg-red-50' },
                    { t: 'Tag Sequence Gap', d: 'Missing METRC tags detected in sequence for California Retail Facility #002.', s: 'Alert', c: 'text-amber-600', bg: 'bg-amber-50' },
                    { t: 'Unusual Sales Volume', d: 'Location #4 (Miami) seeing 400% spike in small-unit transactions in last 2 hours.', s: 'Review', c: 'text-blue-600', bg: 'bg-blue-50' }
                  ].map((anomaly, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white hover:shadow-md transition-all">
                       <div className="flex items-start gap-4">
                          <div className={cn("mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0", anomaly.bg, anomaly.c)}>
                             <AlertTriangle size={20} />
                          </div>
                          <div>
                             <p className="font-black text-slate-800">{anomaly.t}</p>
                             <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">{anomaly.d}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3 shrink-0">
                          <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", anomaly.bg, anomaly.c)}>
                             {anomaly.s}
                          </span>
                           <button onClick={() => alert('L.A.R.R.Y Investigation initiated.\n\nPulling Metrc chain-of-custody records, cross-referencing with SINC ledger, and generating deviation report...\n\nResults saved to Vault.')} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg hover:bg-slate-700 transition-all uppercase tracking-widest cursor-pointer active:scale-95">
                              Investigate
                           </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-[#1a4731] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><BarChart2 size={80} /></div>
               <h4 className="font-black text-sm uppercase tracking-widest text-emerald-400 mb-4">Audit Readiness Score</h4>
               <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black tracking-tighter">94</span>
                  <span className="text-emerald-400 font-bold mb-1">/100</span>
               </div>
               <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[10px] font-bold text-emerald-100/60 uppercase">
                     <span>Physical vs Digital Inventory</span>
                     <span className="text-white">98%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-emerald-100/60 uppercase">
                     <span>Regulatory Paperwork</span>
                     <span className="text-white">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }}></div>
                  </div>
               </div>
                <button onClick={() => alert('Full Compliance Audit initiated by L.A.R.R.Y.\n\nScanning all facilities against OMMA inspection form v5.3...\n\nAudit results will be saved to your Vault.')} className="w-full py-4 bg-white text-[#1a4731] rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-lg cursor-pointer active:scale-95">
                   Run Full Compliance Audit
                </button>
            </div>

            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
               <div className="flex items-center gap-3 mb-4">
                  <Activity className="text-blue-600" size={24} />
                  <h4 className="text-lg font-black text-blue-900">Sync Pipeline</h4>
               </div>
               <div className="space-y-4">
                  {[
                    { n: 'OMMA API (OK)', s: 'Online', d: 'Stable' },
                    { n: 'METRC API (CA)', s: 'Online', d: 'Stable' },
                    { n: 'SINC Node (TX)', s: 'Syncing', d: '92%' }
                  ].map((node, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                       <span className="font-bold text-blue-800">{node.n || node.s}</span>
                       <div className="flex items-center gap-2">
                          <span className="font-black text-blue-600">{node.d}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

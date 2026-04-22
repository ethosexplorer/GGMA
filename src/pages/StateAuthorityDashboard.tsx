import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Landmark, FileCheck, DollarSign, Activity, 
  Map as MapIcon, Settings, Download, Search, AlertCircle, FileText, CheckCircle2,
  TrendingUp, Users, ShieldAlert, Bot, HelpCircle, Gavel, Scale, Clock, LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const StateAuthorityDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('legal_oversight');
  
  const getRoleTitle = () => user?.role === 'regulator_state' ? 'Marijuana Authority' : 'Regulator Authority';
  const getJurisdiction = () => 'STATE JURISDICTION';

  const renderLegalOversight = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Gavel size={120} className="text-amber-500" /></div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Legalization & Policy Monitor</h2>
        <p className="text-slate-400 font-medium">Tracking legislative shifts, regulatory amendments, and official state legalization progress.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
           <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Active Legislation</p>
              <p className="text-2xl font-black text-white">SB-402 (Amendment)</p>
              <div className="mt-2 text-[10px] font-bold text-blue-400 flex items-center gap-1"><Clock size={12}/> In Committee Review</div>
           </div>
           <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Approved Provisions</p>
              <p className="text-2xl font-black text-white">12 / 14</p>
              <div className="mt-2 text-[10px] font-bold text-emerald-400">85% Implementation</div>
           </div>
           <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Policy Blocks</p>
              <p className="text-2xl font-black text-white">2 Active</p>
              <div className="mt-2 text-[10px] font-bold text-red-400">Requires Attorney Review</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Scale size={18} className="text-indigo-600" /> Recent Regulatory Shifts
            </h3>
            <div className="space-y-4">
               {[
                 { t: 'Emergency Rule #882', d: 'Updated packaging requirements for edibles.', s: 'Effective Now', c: 'text-emerald-600 bg-emerald-50' },
                 { t: 'Amendment SB-104', d: 'Expansion of reciprocity for TX/MO patients.', s: 'Pending Sign', c: 'text-amber-600 bg-amber-50' },
                 { t: 'Compliance Update', d: 'New seed-to-sale reporting frequency (Daily).', s: 'Effective May 1', c: 'text-blue-600 bg-blue-50' },
               ].map((rule, i) => (
                 <div key={i} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                       <p className="font-bold text-slate-800">{rule.t}</p>
                       <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg", rule.c)}>{rule.s}</span>
                    </div>
                    <p className="text-xs text-slate-500">{rule.d}</p>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={80} /></div>
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">State-Wide Compliance Pulse</h3>
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-500">License Verification Rate</span>
                     <span className="text-emerald-400">99.4%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '99.4%' }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                     <span className="text-slate-500">Audit Completion (Q2)</span>
                     <span className="text-indigo-400">72%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500" style={{ width: '72%' }}></div>
                  </div>
               </div>
               <div className="pt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                    "State system current operating under GGHP Oversight protocols. 12,402 businesses monitored. 0 critical security breaches detected in this jurisdiction."
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderApprovalsDenials = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border-b border-slate-200 p-8 flex justify-between items-end rounded-[2rem] shadow-sm">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Authorization Hub</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processing Pipeline • State-Level Final Authority</p>
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
               <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Pending Review</p>
               <p className="text-2xl font-black text-slate-800">342</p>
            </div>
            <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
               <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Approved (24h)</p>
               <p className="text-2xl font-black text-slate-800">128</p>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
         <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
               <tr>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Applicant</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Region</th>
                  <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Command</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {[
                 { n: 'Jane Smith', e: 'j.smith@email.com', t: 'Patient Card (Adult)', r: 'Oklahoma City', st: 'Pending' },
                 { n: 'GreenLeaf Farms', e: 'ops@greenleaf.com', t: 'Cultivator License', r: 'Tulsa', st: 'Pending' },
                 { n: 'Westside Hub', e: 'admin@westside.com', t: 'Dispensary Renewal', r: 'Lawton', st: 'Pending' },
                 { n: 'Dr. Michael Martin', e: 'm.martin@health.org', t: 'Provider Auth', r: 'Norman', st: 'Pending' },
               ].map((app, i) => (
                 <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                       <p className="font-black text-slate-800">{app.n}</p>
                       <p className="text-[10px] font-bold text-slate-400 italic">{app.e}</p>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600">{app.t}</td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase">{app.r}</td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl hover:bg-emerald-500 uppercase tracking-widest">Approve</button>
                          <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl hover:bg-red-500 uppercase tracking-widest">Deny</button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  const renderJurisdictionDashboard = () => (
    <div className="space-y-6">
       <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-white">
          <h2 className="text-xl font-black italic uppercase mb-4">Jurisdiction Oversight</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { l: 'Total Licenses', v: '4,281', t: 'Active' },
               { l: 'Revenue Share', v: '4.2%', t: 'State Fee' },
               { l: 'Flagged Anomalies', v: '12', t: 'Immediate' },
               { l: 'Audit Queue', v: '154', t: 'Pending' },
             ].map((s, i) => (
               <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{s.l}</p>
                  <p className="text-2xl font-black text-white">{s.v}</p>
                  <p className="text-[9px] font-bold text-slate-500">{s.t}</p>
               </div>
             ))}
          </div>
       </div>
       <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <p className="text-center text-slate-400 font-medium py-20">Regulatory Map & Heatmap Data Loading...</p>
       </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      
      {/* LEFT SIDEBAR (INTERNAL / EXTERNAL NAVIGATION) */}
      <div className="w-72 bg-slate-950 border-r border-slate-900 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="font-black text-sm text-white leading-tight uppercase tracking-tight">{getRoleTitle()}</h2>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{getJurisdiction()}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          <div className="pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Authority Modules</div>
          {[
            { id: 'legal_oversight', label: 'Legalization Monitor', icon: Scale },
            { id: 'approvals_denials', label: 'Approvals / Denials', icon: FileCheck },
            { id: 'jurisdiction', label: 'Jurisdiction Control', icon: Activity },
            { id: 'compliance', label: 'Compliance Pulse', icon: ShieldCheck },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left", activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
          
          <div className="pt-8 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Oversight</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-white/5 hover:text-slate-100 transition-all">
             <Bot size={18} /> Ask Larry (Legal AI)
          </button>
        </div>

        <div className="p-4 mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl">
           <p className="text-[10px] text-slate-500 leading-relaxed font-bold italic">
             🔒 Scoped Authority: You are operating under the Global Green oversight framework.
           </p>
        </div>

        <button onClick={onLogout} className="p-6 border-t border-white/5 flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <LogOut size={18} /> <span className="text-sm font-black uppercase tracking-widest">Authority Exit</span>
        </button>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white shrink-0">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
               <ShieldCheck size={14} /> JURISDICTION SECURE
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10">
           {activeTab === 'legal_oversight' && renderLegalOversight()}
           {activeTab === 'approvals_denials' && renderApprovalsDenials()}
           {activeTab === 'jurisdiction' && renderJurisdictionDashboard()}
           {activeTab === 'compliance' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest italic">Live Compliance Shield Active...</div>}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, Gavel, Clock, Scale } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LegalOversightTab = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-slate-800" data-action-bound>
      {/* BREAKING NEWS BANNER */}
      <div className="bg-emerald-900 bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-emerald-900/80 p-6 rounded-2xl border border-emerald-500/50 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Shield size={12} />
                OMMA / DOJ ALERT
              </span>
              <span className="text-teal-200 text-[10px] font-bold uppercase tracking-wider">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • Federal Reclassification</span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight mb-2">DOJ Reclassifies Marijuana to Schedule III</h2>
            <p className="text-sm text-teal-100/90 leading-relaxed max-w-4xl">
              The U.S. Department of Justice issued a final order today to reclassify marijuana at the federal level. OMMA is actively monitoring this development. The move from Schedule I to Schedule III could strengthen OMMA's mission to protect patient health and safety through expanded research opportunities.
              <strong className="text-white block mt-1">"New research findings have the potential to redefine how medical marijuana is grown, processed, tested, sold, recommended and consumed," Berry said.</strong>
            </p>
          </div>
          <div className="shrink-0 flex gap-3 w-full md:w-auto">
            <button onClick={() => {
              window.open('https://www.deadiversion.usdoj.gov/online_forms_apps.html', '_blank');
              import('../../lib/turso').then(({ turso }) => {
                return turso.execute({
                  sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                  args: ['log-' + Math.random().toString(36).substr(2, 9), "DEA_PORTAL", "STATE_User", JSON.stringify({ detail: "Opening DEA Registration Requirements portal..." })]
                });
              }).catch(console.error);
            }} className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-center">
              View DEA Registration Requirements
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Gavel size={120} className="text-amber-500" /></div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Legalization & Policy Monitor</h2>
        <p className="text-slate-400 font-medium">Tracking legislative shifts, regulatory amendments, and official state legalization progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Active Legislation</p>
            <p className="text-2xl font-black text-white">SB-402 (Amendment)</p>
            <div className="mt-2 text-[10px] font-bold text-blue-400 flex items-center gap-1"><Clock size={12} /> In Committee Review</div>
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
          <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={80} /></div>
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
};

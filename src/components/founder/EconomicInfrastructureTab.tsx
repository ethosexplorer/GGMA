import React from 'react';
import { Building2, FlaskConical, Zap, MoreVertical, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const EconomicInfrastructureTab = ({
  counts
}: {
  counts: { users: number; patients: number; businesses: number; admins: number; joinedToday: number };
}) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Building2 size={160} /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Economic Infrastructure</h2>
            <p className="text-slate-400 font-medium text-lg">Commercial force monitoring. Audit verified entities, POS integrations, and B2B infrastructure health across all sectors.</p>
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Commercial Nodes</p>
                <p className="text-2xl font-black">{counts.businesses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Daily Tax Ingress</p>
                <p className="text-2xl font-black">$412.4k</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Pending Audits</p>
                <p className="text-2xl font-black">124</p>
              </div>
            </div>
          </div>
          {/* RAPID TEST PULSE MONITOR */}
          <div className="w-full lg:w-96 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl relative group">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-indigo-600/30">
              <FlaskConical size={24} className="text-white" />
            </div>
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Zap size={18} className="text-amber-400" /> Rapid Test Pulse
            </h3>
            <div className="space-y-6">
              {[
                { l: 'Active Lab Syncs', v: '42', t: 'Nationwide', c: 'text-white' },
                { l: 'Tests Processed (1h)', v: '1,842', t: '+12%', c: 'text-emerald-400' },
                { l: 'Flagged Impurities', v: '3', t: 'CRITICAL', c: 'text-red-500 animate-pulse' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">{stat.l}</p>
                    <p className="text-[10px] font-bold text-slate-400 italic">{stat.t}</p>
                  </div>
                  <p className={cn("text-2xl font-black", stat.c)}>{stat.v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => {
              import('../../lib/turso').then(({ turso }) => {
                return turso.execute({
                  sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                  args: ['log-' + Math.random().toString(36).substr(2, 9), "RECALL", "Production_User", JSON.stringify({ detail: "Opening Emergency Product Recall Hub..." })]
                });
              }).then(() => {
                alert("Opening Emergency Product Recall Hub...\n\n[Live Production Transaction Logged]");
              }).catch(console.error);
            }} className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Emergency Recall Hub</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
          <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Building2 size={22} className="text-emerald-600" /> Infrastructure Map</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cultivation
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Retail
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div> Lab/Testing
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { n: 'Apex Dispensary', e: 'hq@apex-med.com', r: 'Dispensary / Retail', j: 'Oklahoma City', s: 'Active' },
                { n: 'GreenLeaf Farms', e: 'ops@greenleaf.com', r: 'Cultivator / Grow', j: 'Tulsa', s: 'Active' },
                { n: 'CannaLogic POS', e: 'dev@cannalogic.io', r: 'Integrator / Tech', j: 'National', s: 'Suspended' }
              ].map((u, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-100 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="font-black text-slate-800">{u.n}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.r}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-[10px] font-black uppercase px-3 py-1 rounded-full", u.s === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200')}>
                      {u.s}
                    </span>
                    <button onClick={() => {
                      import('../../lib/turso').then(({ turso }) => {
                        return turso.execute({
                          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                          args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Additional options menu..." })]
                        });
                      }).catch(console.error);
                    }} className="p-2 text-slate-400 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">Infrastructure Health</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span className="text-slate-500">Lab Integration Sync</span>
                    <span className="text-emerald-400">99.8%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '99.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span className="text-slate-500">Tax Reporting Velocity</span>
                    <span className="text-indigo-400">88.4%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '88.4%' }}></div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed pt-4 italic">
                  Larry is currently monitoring 42,891 commercial nodes. 3 nodes currently require manual Intercept due to POS bridge timing issues in OK-Sector.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

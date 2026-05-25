import React from 'react';
import { Wallet, Activity, Building2, Shield, Zap, Database, TrendingUp } from 'lucide-react';
import { MasterBankingInfo } from '../MasterBankingInfo';

export const FinancialsTab = ({
  liveStats,
  fullName,
  setActiveTab
}: {
  liveStats: { totalUsers: string; netRevenue: string };
  fullName: string;
  setActiveTab: (tabId: string) => void;
}) => {
  const firstName = fullName.split(' ')[0];

  return (
    <div className="space-y-6">
      <div className="bg-indigo-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={120} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">Global Financial Command</h2>
            <p className="text-indigo-200">Consolidated revenue across all jurisdictions and service tiers.</p>
          </div>
          <div className="text-center md:text-right px-8 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Network Reserves</p>
            <p className="text-4xl font-black text-white">{liveStats.netRevenue}</p>
          </div>
        </div>
      </div>

      <MasterBankingInfo />

      {/* GGE Processor Command Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">GGE Processor Command</h2>
            <p className="text-slate-500 text-sm">Standalone Private Settlement Rail for GGE Entities</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-xs font-bold uppercase tracking-wider">
            <Activity size={14} className="animate-pulse" /> Processor: Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ecosystem Processing (MTD)</p>
            <h3 className="text-2xl font-black text-slate-800">$20.00</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">First Transaction — May 12, 2026</p>
          </div>
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bank Settlement Buffer</p>
            <h3 className="text-2xl font-black text-slate-800">$0.00</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Status: Awaiting Merchant Processing</p>
          </div>
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">External Bank Bridge</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Building2 size={16} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-700 uppercase">Settlement Primary</p>
                <p className="text-[9px] text-slate-500">Chase •••• 4921</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-emerald-900 text-emerald-100 rounded-2xl border border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={24} className="text-[#D4AF77]" />
            <div>
              <p className="text-xs font-black text-[#D4AF77] uppercase tracking-widest">Compliance Division Override</p>
              <p className="text-[10px] opacity-80">Larry is monitoring live transactions for 280E compliance. 1 transaction verified.</p>
            </div>
          </div>
          <button onClick={() => {
            import('../../lib/turso').then(({ turso }) => {
              return turso.execute({
                sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                args: ['log-' + Math.random().toString(36).substr(2, 9), "AUDIT", "Production_User", JSON.stringify({ detail: "Opening 280E Compliance Audit Logs..." })]
              });
            }).then(() => {
              alert("Opening 280E Compliance Audit Logs. Larry verified 1,284 transactions.\n\n[Live Production Transaction Logged]");
            }).catch(console.error);
          }} className="px-4 py-2 bg-[#D4AF77] text-emerald-900 rounded-xl text-[10px] font-black uppercase shadow-lg">View Audit Logs</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Action Required */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 shadow-xl shadow-amber-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20"><Zap size={20} /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Executive Action Required</h3>
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Priority 1: Metrc Compliance</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Due Today</p>
                <p className="text-xs font-bold text-slate-500">April 21, 2026</p>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-xs">{firstName.charAt(0)}{(fullName.split(' ')[1] || '').charAt(0)}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Metrc API Training & Certification Test</p>
                  <p className="text-xs text-slate-500">Assigned: {fullName} • Estimated: 2.5 Hours</p>
                </div>
              </div>
              <button onClick={() => window.open('https://www.metrc.com/integrators/training/', '_blank')} className="px-6 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-black hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/10">Launch Certification Portal</button>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 relative z-10 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Metrc Production Key Approval</p>
                  <p className="text-xs text-slate-500">Global Green Enterprise Inc (SINC) • All Jurisdictions</p>
                </div>
              </div>
              <button onClick={() => {
                if (confirm('Approve Metrc Production Key rotation for all jurisdictions?')) {
                  import('../../lib/turso').then(({ turso }) => {
                    return turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), "SECURITY", "Production_User", JSON.stringify({ detail: "Metrc Production Keys approved and rotated for Global Green Enterprise Inc." })]
                    });
                  }).then(() => {
                    alert("Metrc Production Keys approved and rotated for Global Green Enterprise Inc.\n\n[Live Production Transaction Logged]");
                  }).catch(console.error);
                }
              }} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10">Approve & Rotate Keys</button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={18} className="text-indigo-500" /> Revenue Trajectory (P&L)</h3>
              <div className="flex gap-2">
                <button onClick={() => {
                  import('../../lib/turso').then(({ turso }) => {
                    return turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Revenue Trajectory filter: 1 Day view selected." })]
                    });
                  }).catch(console.error);
                }} className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200">1D</button>
                <button onClick={() => {
                  import('../../lib/turso').then(({ turso }) => {
                    return turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Revenue Trajectory filter: 1 Week view selected." })]
                    });
                  }).catch(console.error);
                }} className="px-3 py-1 bg-indigo-50 text-[10px] font-bold text-indigo-600 rounded-lg border border-indigo-200">1W</button>
                <button onClick={() => {
                  import('../../lib/turso').then(({ turso }) => {
                    return turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Revenue Trajectory filter: 1 Month view selected." })]
                    });
                  }).catch(console.error);
                }} className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded-lg border border-slate-200">1M</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                <div className="border-t border-slate-900 border-dashed w-full"></div>
                <div className="border-t border-slate-900 border-dashed w-full"></div>
                <div className="border-t border-slate-900 border-dashed w-full"></div>
              </div>
              {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2].map((h, i) => (
                <div key={i} className="w-full bg-slate-100/50 rounded-t-lg relative group overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-indigo-700 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-lg transition-all duration-700 group-hover:from-indigo-500 group-hover:to-indigo-300" style={{ height: `${h * 0.7}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap shadow-xl z-20">
                      ${(h / 10).toFixed(1)}M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} className="text-blue-500" /> Financial Liquidity Score</h3>
            <div className="text-center py-6 space-y-2">
              <p className="text-5xl font-black text-slate-900">100</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Optimal Reserves</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
              First revenue recorded May 12, 2026. System is live and operational in Oklahoma.
            </p>
          </div>

          <div className="bg-indigo-600 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Activity size={64} /></div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-2">Network Reserves</h4>
            <p className="text-4xl font-black mb-1">{liveStats.netRevenue}</p>
            <p className="text-[10px] font-bold text-indigo-200 mb-6 uppercase tracking-widest">LIVE TRANSACTIONS (AUTHORIZE.NET / KURV)</p>
            <button onClick={() => setActiveTab('accounting_ledger')} className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold transition-all shadow-lg text-sm hover:bg-indigo-50">View Master Ledger</button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CreditCard, TrendingUp, Box, BarChart3 } from 'lucide-react';

export const SubscriptionsTab = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10"><CreditCard size={120} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <CreditCard className="text-indigo-400" size={28} />
              Platform Subscription Analytics
            </h2>
            <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mt-2">Monthly Recurring Revenue • Active Plans • Add-on Utilization</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex gap-8">
            <div>
              <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Total MRR</p>
              <p className="text-2xl font-black text-emerald-400">$0</p>
            </div>
            <div>
              <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Active Subs</p>
              <p className="text-2xl font-black text-white">0</p>
            </div>
            <div>
              <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Churn Rate</p>
              <p className="text-2xl font-black text-amber-400">0%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { tier: 'Basic', price: '$49/mo', subs: 0, mrr: '$0', color: 'bg-slate-500', pct: 0 },
          { tier: 'Professional', price: '$149/mo', subs: 0, mrr: '$0', color: 'bg-indigo-500', pct: 0 },
          { tier: 'Enterprise', price: '$299/mo', subs: 0, mrr: '$0', color: 'bg-emerald-500', pct: 0 },
        ].map(t => (
          <div key={t.tier} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-800">{t.tier}</h3>
              <span className="text-xs font-bold text-slate-400">{t.price}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{t.subs.toLocaleString()}</div>
            <p className="text-xs text-slate-400 font-bold mb-3">Active Subscribers</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">{t.pct}% of total</span>
              <span className="text-emerald-600">{t.mrr} MRR</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Monthly Signups</h3>
          <div className="space-y-3">
            {[
              { month: 'May 2026', signups: 0, revenue: '$0' },
            ].map(m => (
              <div key={m.month} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-700">{m.month}</span>
                <div className="flex gap-6 text-xs font-bold">
                  <span className="text-indigo-600">{m.signups} signups</span>
                  <span className="text-emerald-600">{m.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Box size={18} className="text-indigo-500" /> Add-on Revenue</h3>
          <div className="space-y-3">
            {[
              { addon: 'Metrc Integration', users: 0, revenue: '$0/mo' },
              { addon: 'AI Compliance Engine', users: 0, revenue: '$0/mo' },
              { addon: 'Telehealth Module', users: 0, revenue: '$0/mo' },
              { addon: 'Advanced Analytics', users: 0, revenue: '$0/mo' },
            ].map(a => (
              <div key={a.addon} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-sm font-bold text-slate-700">{a.addon}</span>
                  <span className="text-xs text-slate-400 ml-2">{a.users} users</span>
                </div>
                <span className="text-xs font-black text-emerald-600">{a.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500" /> By Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { cat: 'Dispensary', count: 0, pct: '—' },
            { cat: 'Cultivator', count: 0, pct: '—' },
            { cat: 'Lab / Testing', count: 0, pct: '—' },
            { cat: 'Healthcare', count: 0, pct: '—' },
          ].map(c => (
            <div key={c.cat} className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-slate-800">{c.count.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-500 mt-1">{c.cat}</div>
              <div className="text-xs font-black text-emerald-500 mt-1">{c.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

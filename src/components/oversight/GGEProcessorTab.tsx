import React, { useEffect, useState } from 'react';
import { Activity, Shield, Zap, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const GGEProcessorTab = () => {
  const [txCount, setTxCount] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'accounting_ledger'), (snap) => {
      setTxCount(snap.size);
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={180} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">GGE Processor Master Command</h2>
            <p className="text-emerald-300 font-bold uppercase tracking-widest text-sm">Real-time oversight of the standalone private settlement rail</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center backdrop-blur-md">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Transactions</p>
              <p className="text-3xl font-black">{txCount}</p>
            </div>
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center backdrop-blur-md">
              <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Uptime</p>
              <p className="text-3xl font-black">99.99%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { l: 'Processing Speed', v: '0.3s avg', c: 'text-emerald-400', bar: 'bg-emerald-500', w: '97%' },
          { l: 'Settlement Rate', v: '100%', c: 'text-blue-400', bar: 'bg-blue-500', w: '100%' },
          { l: 'Fraud Detection', v: '0 flags', c: 'text-amber-400', bar: 'bg-amber-500', w: '0%' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{s.l}</p>
            <p className={`text-3xl font-black ${s.c} mb-4`}>{s.v}</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${s.bar} rounded-full`} style={{width: s.w}}></div></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Zap className="text-emerald-400" /> Recent Settlements</h3>
          <div className="space-y-3">
            {[
              { id: 'TXN-0042', type: 'Subscription', amount: '$49.99', status: 'Settled', time: '2m ago' },
              { id: 'TXN-0041', type: 'B2B Transfer', amount: '$1,200.00', status: 'Settled', time: '18m ago' },
              { id: 'TXN-0040', type: 'Processing Fee', amount: '$20.00', status: 'Settled', time: '45m ago' },
              { id: 'TXN-0039', type: 'Subscription', amount: '$49.99', status: 'Settled', time: '1h ago' },
            ].map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                    <ArrowDownLeft size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{tx.id} — {tx.type}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">{tx.amount}</p>
                  <p className="text-[9px] font-black text-emerald-500/60 uppercase">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Shield className="text-indigo-400" /> Rail Security</h3>
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle size={20} className="text-emerald-400" />
                <p className="font-black text-white">All Systems Nominal</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">Private settlement rail operating within normal parameters. No anomalies detected. All encryption protocols active.</p>
            </div>
            <div className="space-y-4">
              {[
                { l: 'AES-256 Encryption', v: 'Active', c: 'text-emerald-400' },
                { l: 'PCI-DSS Compliance', v: 'Certified', c: 'text-emerald-400' },
                { l: 'Fraud Engine', v: 'Monitoring', c: 'text-blue-400' },
                { l: 'Last Security Scan', v: '< 1 min ago', c: 'text-slate-400' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.l}</span>
                  <span className={`text-xs font-black ${s.c}`}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

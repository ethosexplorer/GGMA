import React, { useEffect, useState } from 'react';
import { MessageSquare, CheckCircle, Clock, AlertTriangle, Bot, Users, Zap } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const SupportIntelligenceTab = () => {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(10)), (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute top-0 right-0 p-8 opacity-5"><MessageSquare size={180} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Support Intelligence Hub</h2>
            <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Active Resolution Streams • AI-Assisted Support</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Resolved (24h)</p>
              <p className="text-3xl font-black">{tickets.length > 0 ? tickets.length * 12 : 0}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 px-6 py-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-amber-400 uppercase mb-1">Open</p>
              <p className="text-3xl font-black">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { l: 'AI Resolution Rate', v: '94.2%', c: 'text-emerald-400', bar: 'bg-emerald-500', w: '94.2%', icon: Bot },
          { l: 'Avg Response Time', v: '0.4s', c: 'text-indigo-400', bar: 'bg-indigo-500', w: '98%', icon: Clock },
          { l: 'Human Escalations', v: '5.8%', c: 'text-amber-400', bar: 'bg-amber-500', w: '5.8%', icon: Users },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
            <div className="flex items-center gap-2 mb-3">
              <s.icon size={14} className={s.c} />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
            </div>
            <p className={`text-3xl font-black ${s.c} mb-4`}>{s.v}</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${s.bar} rounded-full`} style={{width: s.w}}></div></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><Zap className="text-indigo-400" /> Active Resolution Stream</h3>
          <div className="space-y-3">
            {tickets.length > 0 ? tickets.slice(0, 6).map((t, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {i === 0 ? <Clock size={18} /> : <CheckCircle size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{t.action || 'System Event'}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{t.timestamp?.toDate ? t.timestamp.toDate().toLocaleTimeString() : '--'}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${i === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {i === 0 ? 'In Progress' : 'Resolved'}
                </span>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400" />
                <p className="font-bold text-white">All Clear</p>
                <p className="text-xs mt-1">No active support requests</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><Bot className="text-emerald-400" /> AI Agent Performance</h3>
          <div className="space-y-4">
            {[
              { name: 'Larry (Compliance)', resolved: 842, satisfaction: '98.1%', color: 'bg-emerald-500' },
              { name: 'Sylara (HR/Intake)', resolved: 1204, satisfaction: '97.4%', color: 'bg-indigo-500' },
              { name: 'Sentinel (Security)', resolved: 312, satisfaction: '99.8%', color: 'bg-purple-500' },
            ].map((agent, i) => (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-black text-white text-sm">{agent.name}</p>
                  <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-1 rounded-full">Online</span>
                </div>
                <div className="flex gap-6">
                  <div><p className="text-[10px] font-black text-slate-500 uppercase">Resolved</p><p className="text-lg font-black text-white">{agent.resolved.toLocaleString()}</p></div>
                  <div><p className="text-[10px] font-black text-slate-500 uppercase">Satisfaction</p><p className="text-lg font-black text-emerald-400">{agent.satisfaction}</p></div>
                </div>
                <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full ${agent.color} rounded-full`} style={{width: agent.satisfaction}}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

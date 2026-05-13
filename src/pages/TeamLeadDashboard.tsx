import React, { useState, useEffect } from 'react';
import { Users, Briefcase, MessageSquare, BarChart3, BookOpen, Search, Activity, Bell, Shield, CircleCheck, AlertTriangle, UserPlus, PhoneCall, Bot, ArrowUpRight } from 'lucide-react';
import { turso } from '../lib/turso';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const NAV = [
  { id: 'home', label: 'Team Overview', icon: Activity },
  { id: 'team', label: 'My Reps', icon: Users },
  { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
  { id: 'performance', label: 'Team Performance', icon: BarChart3 },
  { id: 'settings', label: 'My Settings', icon: Shield },
];

export const TeamLeadDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [tab, setTab] = useState('home');
  const [reps, setReps] = useState<any[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  
  const leadName = user?.displayName || user?.firstName || 'Team Lead';

  useEffect(() => {
    // In a real app we'd filter by team_id
    turso.execute("SELECT * FROM users WHERE role = 'rep' OR role = 'ai_rep' LIMIT 10").then(r => setReps(r.rows)).catch(() => {});
    turso.execute("SELECT * FROM compliance_alerts WHERE status = 'Escalated to Manager' OR message LIKE '%[ESCALATED%' AND is_resolved = 0 LIMIT 10").then(r => setEscalations(r.rows)).catch(() => {});
  }, []);

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase size={140}/></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight">Welcome, {leadName.split(' ')[0]}</h2>
          <p className="text-blue-200 mt-1">Team performance and escalation command center.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Reps', value: reps.length, color: 'blue', icon: Users },
          { label: 'Open Escalations', value: escalations.length, color: escalations.length > 0 ? 'amber' : 'emerald', icon: AlertTriangle },
          { label: 'Team Calls Today', value: '0', color: 'indigo', icon: PhoneCall },
          { label: 'Issues Resolved', value: '0', color: 'emerald', icon: CircleCheck },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <s.icon size={18} className={`text-${s.color}-500`} />
            </div>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {escalations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500"/> Action Required: Escalations</h3>
          <div className="space-y-3">
            {escalations.slice(0, 3).map((a: any, i: number) => (
              <div key={i} className="p-4 rounded-xl border-l-4 bg-amber-50 border-amber-500 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{a.message}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">From Rep • {a.created_at}</p>
                </div>
                <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase" onClick={() => setTab('escalations')}>Manage</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">My Team</h2>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Rep Name</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reps.map((r: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{r.display_name || r.email || 'Unknown Rep'}</td>
                <td className="px-6 py-4">
                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", r.role === 'ai_rep' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600')}>
                    {r.role === 'ai_rep' ? 'AI Agent' : 'Human Rep'}
                  </span>
                </td>
                <td className="px-6 py-4"><span className="text-xs font-bold text-emerald-500">Active</span></td>
                <td className="px-6 py-4 text-right"><button className="text-xs font-black text-indigo-600 uppercase">View Stats</button></td>
              </tr>
            ))}
            {reps.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No reps assigned to your team yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEscalations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Escalated Tickets</h2>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        {escalations.length > 0 ? escalations.map((a: any, i: number) => (
          <div key={i} className="p-5 border border-amber-200 bg-amber-50 rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-black text-slate-800">{a.message}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Escalated Ticket • {a.created_at}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase" onClick={() => {
                turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setEscalations(prev => prev.filter(x => x.id !== a.id)));
              }}>Resolve</button>
              <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl uppercase" onClick={() => {
                turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`esc-mgr-${Date.now()}`, a.entity_id, `[ESCALATED by TEAM LEAD] ${a.message}`, 'Critical', 'Escalated to Director', 0, new Date().toISOString()] }).catch(console.error);
                alert('Escalated to Director/Manager.');
                turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setEscalations(prev => prev.filter(x => x.id !== a.id)));
              }}>Escalate Higher</button>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center"><CircleCheck size={40} className="mx-auto text-emerald-500 mb-4"/><h3 className="text-xl font-black text-slate-800 mb-2">No Escalations</h3><p className="text-slate-500">Your reps are handling everything perfectly.</p></div>
        )}
      </div>
    </div>
  );

  const getContent = () => {
    switch (tab) {
      case 'home': return renderHome();
      case 'team': return renderTeam();
      case 'escalations': return renderEscalations();
      case 'performance': return <div className="p-8 text-center text-slate-500 italic">Team performance analytics coming soon.</div>;
      case 'settings': return <ProfileSettingsCard user={user} roleLabel="Team Lead" />;
      default: return renderHome();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <div className="w-64 flex flex-col shrink-0 hidden md:flex bg-slate-950 border-r border-slate-900">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white bg-blue-600"><Briefcase size={20}/></div>
            <div>
              <h2 className="font-black text-sm text-white leading-tight uppercase tracking-tight">Team Lead</h2>
              <p className="text-[10px] font-black tracking-widest uppercase text-blue-400">{leadName.split(' ')[0]}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left", tab === item.id ? "bg-blue-600 text-white shadow-xl" : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
              <item.icon size={18} className={tab === item.id ? "text-white" : "text-slate-500"}/> {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800">
          {onLogout && <button onClick={onLogout} className="w-full py-2.5 bg-slate-900/50 text-slate-400 border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-800 hover:text-white transition-all">← Back</button>}
        </div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">{NAV.find(n => n.id === tab)?.label || 'Dashboard'}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {getContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

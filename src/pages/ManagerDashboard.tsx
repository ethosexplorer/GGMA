import React, { useState, useEffect } from 'react';
import { Users, Briefcase, MessageSquare, BarChart3, Building2, Search, Activity, Bell, Shield, CircleCheck, AlertTriangle, UserPlus, TrendingUp, Target, Globe } from 'lucide-react';
import { turso } from '../lib/turso';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const NAV = [
  { id: 'home', label: 'Regional Overview', icon: Globe },
  { id: 'teams', label: 'My Teams', icon: Users },
  { id: 'escalations', label: 'Critical Escalations', icon: AlertTriangle },
  { id: 'performance', label: 'Regional Performance', icon: BarChart3 },
  { id: 'settings', label: 'My Settings', icon: Shield },
];

export const ManagerDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [tab, setTab] = useState('home');
  const [teamLeads, setTeamLeads] = useState<any[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  
  const managerName = user?.displayName || user?.firstName || 'Manager';

  useEffect(() => {
    turso.execute("SELECT * FROM users WHERE role = 'team_lead' LIMIT 5").then(r => setTeamLeads(r.rows)).catch(() => {});
    turso.execute("SELECT * FROM compliance_alerts WHERE status = 'Escalated to Director' OR message LIKE '%TEAM LEAD]%' AND is_resolved = 0 LIMIT 10").then(r => setEscalations(r.rows)).catch(() => {});
  }, []);

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Building2 size={140}/></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight">Manager Console, {managerName.split(' ')[0]}</h2>
          <p className="text-sky-200 mt-1">Regional oversight, team lead management, and critical interventions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Teams', value: teamLeads.length || '3', color: 'sky', icon: Users },
          { label: 'Critical Escalations', value: escalations.length, color: escalations.length > 0 ? 'red' : 'emerald', icon: AlertTriangle },
          { label: 'Regional Target', value: '84%', color: 'indigo', icon: Target },
          { label: 'Growth', value: '+12%', color: 'emerald', icon: TrendingUp },
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500"/> Critical Escalations</h3>
          <div className="space-y-3">
            {escalations.slice(0, 3).map((a: any, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-red-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{a.message}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">From Team Lead • {a.created_at}</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-lg uppercase" onClick={() => setTab('escalations')}>Manage</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeams = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">My Teams</h2>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Team Lead</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Team Size</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Target Status</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {/* Mocked data for visualization until full DB is populated */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800">Sarah Jenkins (Team Alpha)</td>
              <td className="px-6 py-4">8 Reps (3 AI, 5 Human)</td>
              <td className="px-6 py-4"><span className="text-xs font-bold text-emerald-500">On Track</span></td>
              <td className="px-6 py-4 text-right"><button className="text-xs font-black text-sky-600 uppercase">View</button></td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800">Marcus Chen (Team Beta)</td>
              <td className="px-6 py-4">6 Reps (6 Human)</td>
              <td className="px-6 py-4"><span className="text-xs font-bold text-amber-500">Below Target</span></td>
              <td className="px-6 py-4 text-right"><button className="text-xs font-black text-sky-600 uppercase">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEscalations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Director-Level Escalations</h2>
      <p className="text-sm text-slate-500">These tickets have bypassed Reps and Team Leads and require your immediate attention.</p>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        {escalations.length > 0 ? escalations.map((a: any, i: number) => (
          <div key={i} className="p-5 border border-red-200 bg-red-50 rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-black text-slate-800">{a.message}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Critical Escalation • {a.created_at}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase" onClick={() => {
                turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setEscalations(prev => prev.filter(x => x.id !== a.id)));
              }}>Resolve</button>
              <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase" onClick={() => {
                turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`esc-founder-${Date.now()}`, a.entity_id, `[ESCALATED by REGIONAL MANAGER] ${a.message}`, 'CRITICAL', 'Escalated to President', 0, new Date().toISOString()] }).catch(console.error);
                alert('Escalated to President/Founder.');
                turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setEscalations(prev => prev.filter(x => x.id !== a.id)));
              }}>Escalate to Founder</button>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center"><CircleCheck size={40} className="mx-auto text-emerald-500 mb-4"/><h3 className="text-xl font-black text-slate-800 mb-2">Queue Clear</h3><p className="text-slate-500">No critical escalations at this time.</p></div>
        )}
      </div>
    </div>
  );

  const getContent = () => {
    switch (tab) {
      case 'home': return renderHome();
      case 'teams': return renderTeams();
      case 'escalations': return renderEscalations();
      case 'performance': return <div className="p-8 text-center text-slate-500 italic">Regional performance analytics coming soon.</div>;
      case 'settings': return <ProfileSettingsCard user={user} roleLabel="Regional Manager" />;
      default: return renderHome();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <div className="w-64 flex flex-col shrink-0 hidden md:flex bg-slate-950 border-r border-slate-900">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white bg-sky-600"><Globe size={20}/></div>
            <div>
              <h2 className="font-black text-sm text-white leading-tight uppercase tracking-tight">Manager</h2>
              <p className="text-[10px] font-black tracking-widest uppercase text-sky-400">{managerName.split(' ')[0]}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left", tab === item.id ? "bg-sky-600 text-white shadow-xl" : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
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

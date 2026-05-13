import React, { useState, useEffect } from 'react';
import { Users, Briefcase, MessageSquare, BarChart3, Phone, Clock, Activity, Bell, Shield,
  CircleCheck, AlertTriangle, PhoneCall, Bot, FileText, CreditCard, FolderOpen, Send,
  Plus, Loader2, BookOpen, PhoneForwarded } from 'lucide-react';
import { turso } from '../lib/turso';
import { voip800 } from '../lib/voip800';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { PhoneIntakeForm } from '../components/telephony/PhoneIntakeForm';
import { PostPaymentTab } from '../components/ops/PostPaymentTab';
import { DocumentVaultTab } from '../components/ops/DocumentVaultTab';
import { InternalMessenger } from '../components/messaging/InternalMessenger';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const CALL_CATEGORIES = ['Inquiry','Subscription','Med Card','Add-On','IT Issue','Billing','Complaint','Transfer','Other'];

export const TeamLeadDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [tab, setTab] = useState('home');
  const [reps, setReps] = useState<any[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [agentStatus, setAgentStatus] = useState('Ready');
  const [liveQueue, setLiveQueue] = useState(0);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [dialNumber, setDialNumber] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketMsg, setNewTicketMsg] = useState('');
  const [newTicketSev, setNewTicketSev] = useState('Medium');
  const [callLogCategory, setCallLogCategory] = useState('Inquiry');
  const [callLogNotes, setCallLogNotes] = useState('');
  const [callLogSaving, setCallLogSaving] = useState(false);
  const [callLogs, setCallLogs] = useState<any[]>([]);

  const leadName = user?.displayName || user?.firstName || 'Team Lead';

  useEffect(() => {
    turso.execute("SELECT * FROM users WHERE role = 'rep' OR role = 'ai_rep' LIMIT 10").then(r => setReps(r.rows)).catch(() => {});
    turso.execute("SELECT * FROM compliance_alerts WHERE status = 'Escalated to Manager' OR message LIKE '%[ESCALATED%' AND is_resolved = 0 LIMIT 10").then(r => setEscalations(r.rows)).catch(() => {});
    turso.execute('SELECT * FROM compliance_alerts WHERE is_resolved = 0 ORDER BY created_at DESC LIMIT 20').then(r => setAlerts(r.rows)).catch(() => {});
    voip800.getQueueCount().then(setLiveQueue);
    voip800.getCallHistory(15).then(setRecentCalls);
    const iv = setInterval(() => { voip800.getQueueCount().then(setLiveQueue); voip800.getCallHistory(15).then(setRecentCalls); }, 10000);
    return () => clearInterval(iv);
  }, []);

  const saveCallLog = async () => {
    setCallLogSaving(true);
    try {
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [`clog-${Date.now()}`, 'CALL_LOG', leadName, JSON.stringify({ category: callLogCategory, notes: callLogNotes, time: new Date().toISOString() })] });
      setCallLogs(prev => [{ category: callLogCategory, notes: callLogNotes, time: new Date().toLocaleTimeString() }, ...prev]);
      setCallLogNotes(''); alert('Call logged.');
    } catch(e) { console.error(e); }
    setCallLogSaving(false);
  };

  const createTicket = async () => {
    if (!newTicketMsg) return;
    try {
      await turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`tkt-${Date.now()}`, 'tl-created', `[${leadName}] ${newTicketMsg}`, newTicketSev, 'Open', 0, new Date().toISOString()] });
      setAlerts(prev => [{ id: `tkt-${Date.now()}`, message: newTicketMsg, severity: newTicketSev, status: 'Open', is_resolved: 0 }, ...prev]);
      setNewTicketMsg(''); setShowNewTicket(false);
    } catch(e) { console.error(e); }
  };

  const NAV = [
    { id: 'home', label: 'Team Overview', icon: Activity },
    { id: 'calls', label: 'Call Center', icon: Phone },
    { id: 'intake', label: 'Phone Intake', icon: FileText },
    { id: 'team', label: 'My Reps', icon: Users },
    { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
    { id: 'calllog', label: 'Call Logging', icon: BookOpen },
    { id: 'vault', label: 'Document Vault', icon: FolderOpen },
    { id: 'payment', label: 'Post Payment', icon: CreditCard },
    { id: 'messages', label: 'Internal Messages', icon: Send },
    { id: 'performance', label: 'Team Performance', icon: BarChart3 },
    { id: 'settings', label: 'My Settings', icon: Shield },
  ];

  const renderHome = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10"><Briefcase size={100}/></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight">Welcome, {leadName.split(' ')[0]}</h2>
          <p className="text-blue-200 mt-1 text-sm">Team performance and escalation command center.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Queue', value: liveQueue, color: 'text-rose-500' },
          { label: 'Active Reps', value: reps.length, color: 'text-blue-500' },
          { label: 'Escalations', value: escalations.length, color: 'text-amber-500' },
          { label: 'Calls Today', value: recentCalls.length, color: 'text-emerald-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {escalations.slice(0,3).map((a: any, i: number) => (
        <div key={i} className="p-3 rounded-xl border-l-4 bg-amber-50 border-amber-500 shadow-sm">
          <p className="font-bold text-slate-800 text-sm">{a.message}</p>
          <p className="text-[10px] text-slate-400 mt-1">Escalated • {a.created_at}</p>
        </div>
      ))}
    </div>
  );

  const renderCallCenter = () => (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-2xl p-5 text-white relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2"><Phone className="text-emerald-400" size={20}/> Call Center</h2>
            <p className="text-emerald-300 text-[10px] font-bold tracking-widest uppercase mt-1">Twilio VOIP • 1-888-963-4447</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-lg text-[10px] font-bold text-rose-300 uppercase">Queue: {liveQueue}</div>
            <select value={agentStatus} onChange={(e) => { setAgentStatus(e.target.value); window.dispatchEvent(new CustomEvent('twilio-status-change', { detail: { status: e.target.value } })); }}
              className={cn("bg-slate-900/50 border rounded-lg px-2 py-1 text-[10px] font-black uppercase outline-none", agentStatus === 'Ready' ? "text-emerald-400 border-emerald-500/50" : "text-amber-400 border-amber-500/50")}>
              <option value="Ready">Ready</option><option value="On Break">On Break</option><option value="Not available">Not Available</option>
            </select>
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black border", voip800.isConfigured() ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-red-500/20 border-red-400/30 text-red-300")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", voip800.isConfigured() ? "bg-emerald-400 animate-pulse" : "bg-red-400")}/> {voip800.isConfigured() ? 'Live' : 'Offline'}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2"><Phone size={16}/> Dial Pad</h3>
        <div className="max-w-xs mx-auto">
          <input type="text" value={dialNumber} onChange={(e) => setDialNumber(e.target.value)} placeholder="+1 (555) 555-5555" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-lg text-center font-mono tracking-widest mb-3 focus:outline-none focus:border-emerald-500"/>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
              <button key={k} onClick={() => setDialNumber(p => p + k)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-lg font-bold p-2.5 rounded-xl shadow-sm">{k}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDialNumber(p => p.slice(0,-1))} disabled={!dialNumber} className="w-14 bg-white border border-slate-200 disabled:opacity-50 text-slate-400 p-2.5 rounded-xl flex items-center justify-center">⌫</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: dialNumber } }))} disabled={!dialNumber}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"><Phone size={18}/> Dial Out</button>
          </div>
        </div>
      </div>
      {recentCalls.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Clock size={14}/> Recent Calls</h3></div>
          <div className="divide-y divide-slate-50">
            {recentCalls.slice(0,8).map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-50">
                <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", c.direction==='inbound' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')}>{c.direction === 'inbound' ? 'IN' : 'OUT'}</span>
                <span className="font-bold text-slate-800 flex-1 ml-3">{c.from}</span>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", c.status==='completed'?'bg-emerald-50 text-emerald-600':'bg-red-50 text-red-600')}>{c.status}</span>
                <span className="text-xs text-slate-400 ml-3">{c.duration > 0 ? `${Math.floor(c.duration/60)}:${(c.duration%60).toString().padStart(2,'0')}` : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800">My Reps</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100"><tr>
            <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">Rep</th>
            <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
            <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {reps.map((r: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50"><td className="px-5 py-3 font-bold text-slate-800">{r.display_name || r.email || 'Unknown'}</td>
                <td className="px-5 py-3"><span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", r.role === 'ai_rep' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600')}>{r.role === 'ai_rep' ? 'AI' : 'Human'}</span></td>
                <td className="px-5 py-3 text-xs font-bold text-emerald-500">Active</td></tr>
            ))}
            {reps.length === 0 && <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-400 italic">No reps assigned.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEscalations = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">Escalated Tickets</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
        {escalations.length > 0 ? escalations.map((a: any, i: number) => (
          <div key={i} className="p-4 border border-amber-200 bg-amber-50 rounded-xl flex justify-between items-center">
            <div><p className="font-bold text-slate-800 text-sm">{a.message}</p><p className="text-[10px] text-slate-500 mt-1">Escalated • {a.created_at}</p></div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black rounded-lg" onClick={() => { turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setEscalations(prev => prev.filter(x => x.id !== a.id))); }}>Resolve</button>
              <button className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg" onClick={() => { turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`esc-mgr-${Date.now()}`, a.entity_id, `[ESCALATED by TEAM LEAD] ${a.message}`, 'Critical', 'Escalated to Director', 0, new Date().toISOString()] }).catch(console.error); alert('Escalated to Manager.'); turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setEscalations(prev => prev.filter(x => x.id !== a.id))); }}>Escalate Higher</button>
            </div>
          </div>
        )) : <div className="p-8 text-center"><CircleCheck size={32} className="mx-auto text-emerald-500 mb-2"/><p className="text-slate-400 text-sm">No escalations.</p></div>}
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800">Support Tickets ({alerts.length})</h2>
        <button onClick={() => setShowNewTicket(true)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"><Plus size={14}/> New Ticket</button>
      </div>
      {showNewTicket && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <input value={newTicketMsg} onChange={e => setNewTicketMsg(e.target.value)} placeholder="Describe the issue..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"/>
          <div className="flex gap-2">
            <select value={newTicketSev} onChange={e => setNewTicketSev(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm"><option>Low</option><option>Medium</option><option>High</option></select>
            <button onClick={createTicket} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">Submit</button>
            <button onClick={() => setShowNewTicket(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
        {alerts.length > 0 ? alerts.map((a: any, i: number) => (
          <div key={i} className={cn("p-4 border rounded-xl flex justify-between items-center", a.severity === 'High' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100')}>
            <div><p className="font-bold text-slate-800 text-sm">{a.message}</p><p className="text-[10px] text-slate-400 mt-1">{a.severity} • {a.status}</p></div>
            <button className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black rounded-lg" onClick={() => { turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setAlerts(prev => prev.filter(x => x.id !== a.id))); }}>Resolve</button>
          </div>
        )) : <div className="p-8 text-center"><CircleCheck size={32} className="mx-auto text-emerald-500 mb-2"/><p className="text-slate-400 text-sm">No open tickets.</p></div>}
      </div>
    </div>
  );

  const renderCallLog = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">Call Logging</h2>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
          <div className="flex flex-wrap gap-2">{CALL_CATEGORIES.map(c => (<button key={c} onClick={() => setCallLogCategory(c)} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border", callLogCategory === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200")}>{c}</button>))}</div></div>
        <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Notes</label>
          <textarea value={callLogNotes} onChange={e => setCallLogNotes(e.target.value)} rows={3} placeholder="What was discussed..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"/></div>
        <button onClick={saveCallLog} disabled={callLogSaving || !callLogNotes} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm disabled:opacity-50 flex items-center gap-2">{callLogSaving ? <Loader2 size={14} className="animate-spin"/> : <CircleCheck size={14}/>} Log Call</button>
      </div>
      {callLogs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm">Today's Logs</h3></div>
          <div className="divide-y divide-slate-50">{callLogs.map((l, i) => (<div key={i} className="px-4 py-3 flex items-center gap-3"><span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{l.category}</span><span className="text-sm text-slate-700 flex-1 truncate">{l.notes}</span><span className="text-xs text-slate-400">{l.time}</span></div>))}</div>
        </div>
      )}
    </div>
  );

  const getContent = () => {
    switch (tab) {
      case 'home': return renderHome();
      case 'calls': return renderCallCenter();
      case 'intake': return <PhoneIntakeForm />;
      case 'team': return renderTeam();
      case 'escalations': return renderEscalations();
      case 'tickets': return renderTickets();
      case 'calllog': return renderCallLog();
      case 'vault': return <DocumentVaultTab />;
      case 'payment': return <PostPaymentTab />;
      case 'messages': return <InternalMessenger currentUser={{ name: leadName, role: 'team_lead', email: user?.email || '' }} />;
      case 'performance': return <div className="p-8 text-center text-slate-500 italic">Team performance analytics coming soon.</div>;
      case 'settings': return <ProfileSettingsCard user={user} roleLabel="Team Lead" />;
      default: return renderHome();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <div className="w-56 flex flex-col shrink-0 hidden md:flex bg-slate-950 border-r border-slate-900">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg text-white bg-blue-600"><Briefcase size={18}/></div>
            <div><h2 className="font-black text-xs text-white uppercase tracking-tight">Team Lead</h2><p className="text-[9px] font-black tracking-widest uppercase text-blue-400">{leadName.split(' ')[0]}</p></div>
          </div>
          <div className="bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg text-center mb-3">
            <p className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Calls Waiting</p>
            <p className="text-lg font-black text-rose-400">{liveQueue}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left", tab === item.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
              <item.icon size={15} className={tab === item.id ? "text-white" : "text-slate-500"}/> {item.label}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-slate-800">{onLogout && <button onClick={onLogout} className="w-full py-2 bg-slate-900/50 text-slate-400 border border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-800 hover:text-white">← Back</button>}</div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">{NAV.find(n => n.id === tab)?.label || 'Dashboard'}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>{getContent()}</motion.div>
        </div>
      </div>
    </div>
  );
};

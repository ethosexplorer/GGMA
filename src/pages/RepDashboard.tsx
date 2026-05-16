import React, { useState, useEffect } from 'react';
import { Users, Briefcase, MessageSquare, BarChart3, BookOpen, Phone, Clock, Search,
  TrendingUp, UserPlus, ChevronRight, Activity, Bell, Shield, HeartPulse,
  Building2, Zap, Target, ArrowUpRight, CircleCheck, AlertTriangle, Bot, X, PhoneCall,
  PhoneIncoming, PhoneOff, PhoneForwarded, FileText, CreditCard, FolderOpen, Send,
  Plus, Loader2 } from 'lucide-react';
import { turso } from '../lib/turso';
import { voip800 } from '../lib/voip800';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { PhoneIntakeForm } from '../components/telephony/PhoneIntakeForm';
import { PostPaymentTab } from '../components/ops/PostPaymentTab';
import { DocumentVaultTab } from '../components/ops/DocumentVaultTab';
import { InternalMessenger } from '../components/messaging/InternalMessenger';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';
import { StaffCRM } from '../components/crm/StaffCRM';

const CALL_CATEGORIES = ['Inquiry','Subscription','Med Card','Add-On','IT Issue','Billing','Complaint','Transfer','Other'];

interface RepDashboardProps { onLogout?: () => void | Promise<void>; user?: any; mode?: 'human' | 'ai'; }

export const RepDashboard = ({ onLogout, user, mode = 'human' }: RepDashboardProps) => {
  const [tab, setTab] = useState('home');
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

  const repName = user?.displayName || user?.firstName || 'Rep';
  const isAI = mode === 'ai';

  useEffect(() => {
    turso.execute('SELECT * FROM compliance_alerts WHERE is_resolved = 0 ORDER BY created_at DESC LIMIT 20').then(r => setAlerts(r.rows)).catch(() => {});
    voip800.getQueueCount().then(setLiveQueue);
    voip800.getCallHistory(15).then(setRecentCalls);
    const iv = setInterval(() => { voip800.getQueueCount().then(setLiveQueue); voip800.getCallHistory(15).then(setRecentCalls); }, 10000);
    return () => clearInterval(iv);
  }, []);

  const saveCallLog = async () => {
    setCallLogSaving(true);
    try {
      await turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: [`clog-${Date.now()}`, 'CALL_LOG', repName, JSON.stringify({ category: callLogCategory, notes: callLogNotes, time: new Date().toISOString() })] });
      setCallLogs(prev => [{ category: callLogCategory, notes: callLogNotes, time: new Date().toLocaleTimeString() }, ...prev]);
      setCallLogNotes(''); alert('Call logged successfully.');
    } catch(e) { console.error(e); }
    setCallLogSaving(false);
  };

  const createTicket = async () => {
    if (!newTicketMsg) return;
    try {
      await turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`tkt-${Date.now()}`, 'rep-created', `[${repName}] ${newTicketMsg}`, newTicketSev, 'Open', 0, new Date().toISOString()] });
      setAlerts(prev => [{ id: `tkt-${Date.now()}`, message: newTicketMsg, severity: newTicketSev, status: 'Open', is_resolved: 0 }, ...prev]);
      setNewTicketMsg(''); setShowNewTicket(false);
    } catch(e) { console.error(e); }
  };

  const NAV = [
    { id: 'home', label: 'Dashboard', icon: Activity },
    { id: 'b2b_crm', label: 'Global CRM Pipeline', icon: Briefcase },
    { id: 'calls', label: 'Call Center', icon: Phone },
    { id: 'intake', label: 'Phone Intake', icon: FileText },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
    { id: 'calllog', label: 'Call Logging', icon: BookOpen },
    { id: 'vault', label: 'Document Vault', icon: FolderOpen },
    { id: 'payment', label: 'Post Payment', icon: CreditCard },
    { id: 'messages', label: 'Internal Messages', icon: Send },
    { id: 'settings', label: 'My Settings', icon: Shield },
  ];

  // ── HOME ──
  const renderHome = () => (
    <div className="space-y-6">
      <div className={cn("rounded-2xl p-6 text-white shadow-xl relative overflow-hidden", isAI ? "bg-gradient-to-br from-violet-900 to-indigo-900" : "bg-gradient-to-br from-slate-900 to-indigo-900")}>
        <div className="absolute top-0 right-0 p-6 opacity-10">{isAI ? <Bot size={100}/> : <Shield size={100}/>}</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            {isAI && <span className="text-[10px] font-black bg-violet-500/30 border border-violet-400/30 px-2 py-0.5 rounded-full text-violet-200 uppercase tracking-widest">AI Agent</span>}
          </div>
          <h2 className="text-2xl font-black tracking-tight">{isAI ? 'Sylara AI Rep Console' : `Welcome, ${repName.split(' ')[0]}.`}</h2>
          <p className="text-indigo-200 mt-1 text-sm">Your shift is active. All systems live.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Queue', value: liveQueue, color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: 'Open Tickets', value: alerts.filter(a => !a.is_resolved).length, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Calls Today', value: recentCalls.length, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Logged', value: callLogs.length, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      {alerts.slice(0,3).map((a: any, i: number) => (
        <div key={i} className={cn("p-3 rounded-xl border-l-4 bg-white border shadow-sm", a.severity === 'High' ? 'border-l-red-500' : 'border-l-amber-500')}>
          <p className="font-bold text-slate-800 text-sm">{a.message}</p>
          <p className="text-[10px] text-slate-400 mt-1">{a.severity} • {a.status}</p>
        </div>
      ))}
    </div>
  );

  // ── CALL CENTER (queue + ready dropdown + dial pad + recent calls for AI) ──
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
              <option value="Ready">Ready</option>
              <option value="On Break">On Break</option>
              <option value="Not available">Not Available</option>
            </select>
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black border", voip800.isConfigured() ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-red-500/20 border-red-400/30 text-red-300")}>
              <div className={cn("w-1.5 h-1.5 rounded-full", voip800.isConfigured() ? "bg-emerald-400 animate-pulse" : "bg-red-400")}/> {voip800.isConfigured() ? 'Live' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Dial Pad */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2"><Phone size={16}/> {isAI ? 'Dial Pad' : 'Incoming / Dial'}</h3>
        <div className="max-w-xs mx-auto">
          <input type="text" value={dialNumber} onChange={(e) => setDialNumber(e.target.value)} placeholder="+1 (555) 555-5555"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-lg text-center font-mono tracking-widest mb-3 focus:outline-none focus:border-emerald-500"/>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
              <button key={k} onClick={() => setDialNumber(p => p + k)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-lg font-bold p-2.5 rounded-xl shadow-sm">{k}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDialNumber(p => p.slice(0,-1))} disabled={!dialNumber} className="w-14 bg-white border border-slate-200 disabled:opacity-50 text-slate-400 p-2.5 rounded-xl flex items-center justify-center">⌫</button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: dialNumber } }))} disabled={!dialNumber}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"><Phone size={18}/> Call</button>
            <button onClick={() => { if(dialNumber) { window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: dialNumber } })); alert('Transferring to: ' + dialNumber); } }} disabled={!dialNumber}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 shadow-lg"><PhoneForwarded size={16}/> Transfer</button>
          </div>
        </div>
      </div>

      {/* Recent Calls — all reps */}
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

  // ── TICKETS ──
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
            <select value={newTicketSev} onChange={e => setNewTicketSev(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <button onClick={createTicket} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">Submit</button>
            <button onClick={() => setShowNewTicket(false)} className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
        {alerts.length > 0 ? alerts.map((a: any, i: number) => (
          <div key={i} className={cn("p-4 border rounded-xl flex justify-between items-center", a.severity === 'High' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100')}>
            <div>
              <p className="font-bold text-slate-800 text-sm">{a.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">{a.severity} • {a.status}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black rounded-lg" onClick={() => {
                turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => setAlerts(prev => prev.filter(x => x.id !== a.id))).catch(console.error);
              }}>Resolve</button>
              <button className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg" onClick={() => {
                turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`esc-${Date.now()}`, a.entity_id || 'rep', `[ESCALATED by ${repName}] ${a.message}`, 'High', 'Escalated to Manager', 0, new Date().toISOString()] }).catch(console.error);
                alert('Escalated.');
              }}>Escalate</button>
            </div>
          </div>
        )) : <div className="p-8 text-center"><CircleCheck size={32} className="mx-auto text-emerald-500 mb-2"/><p className="text-slate-400 text-sm">No open tickets.</p></div>}
      </div>
    </div>
  );

  // ── CALL LOGGING ──
  const renderCallLog = () => (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-slate-800">Call Logging</h2>
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {CALL_CATEGORIES.map(c => (
              <button key={c} onClick={() => setCallLogCategory(c)} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border transition-all", callLogCategory === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300")}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Notes</label>
          <textarea value={callLogNotes} onChange={e => setCallLogNotes(e.target.value)} rows={3} placeholder="What was discussed / resolved..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"/>
        </div>
        <button onClick={saveCallLog} disabled={callLogSaving || !callLogNotes} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-sm disabled:opacity-50 flex items-center gap-2">
          {callLogSaving ? <Loader2 size={14} className="animate-spin"/> : <CircleCheck size={14}/>} Log Call
        </button>
      </div>
      {callLogs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 border-b border-slate-100"><h3 className="font-bold text-slate-800 text-sm">Today's Logs</h3></div>
          <div className="divide-y divide-slate-50">
            {callLogs.map((l, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{l.category}</span>
                <span className="text-sm text-slate-700 flex-1 truncate">{l.notes}</span>
                <span className="text-xs text-slate-400">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const getContent = () => {
    switch (tab) {
      case 'home': return renderHome();
      case 'b2b_crm': return <div className="h-full w-full -m-6 bg-[#080e1a] min-h-[calc(100vh-3.5rem)] overflow-auto"><StaffCRM /></div>;
      case 'calls': return renderCallCenter();
      case 'intake': return <PhoneIntakeForm />;
      case 'tickets': return renderTickets();
      case 'calllog': return renderCallLog();
      case 'vault': return <DocumentVaultTab />;
      case 'payment': return <PostPaymentTab />;
      case 'messages': return <InternalMessenger currentUser={{ name: repName, role: isAI ? 'ai_rep' : 'rep', roleId: user?.uid || 'rep' }} />;
      case 'settings': return <ProfileSettingsCard user={user} roleLabel={isAI ? 'AI Rep Agent' : 'Sales Representative'} />;
      default: return renderHome();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <div className={cn("w-56 flex flex-col shrink-0 hidden md:flex", isAI ? "bg-violet-950 border-r border-violet-900" : "bg-slate-950 border-r border-slate-900")}>
        <div className="p-4 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-lg text-white", isAI ? "bg-violet-600" : "bg-indigo-600")}>{isAI ? <Bot size={18}/> : <Briefcase size={18}/>}</div>
            <div>
              <h2 className="font-black text-xs text-white uppercase tracking-tight">{isAI ? 'AI Rep' : 'Rep Portal'}</h2>
              <p className={cn("text-[9px] font-black tracking-widest uppercase", isAI ? "text-violet-400" : "text-indigo-400")}>{repName.split(' ')[0]}</p>
            </div>
          </div>
          {/* Queue badge */}
          <div className="bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg text-center mb-3">
            <p className="text-[9px] font-black text-rose-300 uppercase tracking-widest">Calls Waiting</p>
            <p className="text-lg font-black text-rose-400">{liveQueue}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left", tab === item.id ? (isAI ? "bg-violet-600 text-white shadow-lg" : "bg-indigo-600 text-white shadow-lg") : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
              <item.icon size={15} className={tab === item.id ? "text-white" : "text-slate-500"}/> {item.label}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-slate-800">
          {onLogout && <button onClick={onLogout} className="w-full py-2 bg-slate-900/50 text-slate-400 border border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-800 hover:text-white transition-all">← Back</button>}
        </div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">{NAV.find(n => n.id === tab)?.label || 'Dashboard'}</h1>
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border", isAI ? "text-violet-600 bg-violet-50 border-violet-100" : "text-emerald-600 bg-emerald-50 border-emerald-100")}>
              <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isAI ? "bg-violet-500" : "bg-emerald-500")}/> {isAI ? 'AI ACTIVE' : 'ONLINE'}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
            {getContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

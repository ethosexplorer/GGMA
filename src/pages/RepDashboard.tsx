import React, { useState, useEffect } from 'react';
import { Users, Briefcase, MessageSquare, BarChart3, BookOpen, Phone, Clock, Search,
  TrendingUp, UserPlus, ChevronRight, Activity, Bell, Shield, HeartPulse,
  Building2, Zap, Target, ArrowUpRight, CircleCheck, AlertTriangle, Bot, X, PhoneCall,
  PhoneIncoming, PhoneOff, PhoneForwarded } from 'lucide-react';
import { turso } from '../lib/turso';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { METRC_MANUAL } from '../data/metrcManual';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const NAV = [
  { id: 'home', label: 'My Dashboard', icon: Activity },
  { id: 'calls', label: 'Incoming Calls', icon: PhoneIncoming },
  { id: 'clients', label: 'My Clients', icon: Users },
  { id: 'pipeline', label: 'My Pipeline', icon: Target },
  { id: 'tickets', label: 'My Tickets', icon: MessageSquare },
  { id: 'performance', label: 'My Performance', icon: BarChart3 },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'settings', label: 'My Settings', icon: Shield },
];

interface RepDashboardProps {
  onLogout?: () => void | Promise<void>;
  user?: any;
  mode?: 'human' | 'ai';
}

export const RepDashboard = ({ onLogout, user, mode = 'human' }: RepDashboardProps) => {
  const [tab, setTab] = useState('home');
  const [patients, setPatients] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [regSearch, setRegSearch] = useState('');
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'active' | 'ended'>('idle');
  const [activeCallTimer, setActiveCallTimer] = useState(0);
  const [callLog] = useState([
    { id: 1, from: '+1 (405) 555-8291', status: 'completed', duration: 182, time: '10:42 AM', direction: 'inbound' },
    { id: 2, from: '+1 (918) 555-3044', status: 'missed', duration: 0, time: '10:15 AM', direction: 'inbound' },
    { id: 3, from: '+1 (580) 555-7120', status: 'completed', duration: 94, time: '09:50 AM', direction: 'inbound' },
    { id: 4, from: '+1 (405) 555-1198', status: 'voicemail', duration: 31, time: '09:22 AM', direction: 'inbound' },
    { id: 5, from: '+1 (918) 555-4410', status: 'completed', duration: 245, time: 'Yesterday', direction: 'inbound' },
  ]);

  const repName = user?.displayName || user?.firstName || 'Rep';
  const isAI = mode === 'ai';

  useEffect(() => {
    turso.execute('SELECT * FROM patients LIMIT 50').then(r => setPatients(r.rows)).catch(() => {});
    turso.execute('SELECT * FROM businesses LIMIT 50').then(r => setBusinesses(r.rows)).catch(() => {});
    turso.execute('SELECT * FROM compliance_alerts WHERE is_resolved = 0 ORDER BY created_at DESC LIMIT 10').then(r => setAlerts(r.rows)).catch(() => {});
  }, []);

  const totalClients = patients.length + businesses.length;
  const openTickets = alerts.filter((a: any) => !a.is_resolved).length;

  // ── HOME ──
  const renderHome = () => (
    <div className="space-y-6">
      <div className={cn("rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden", isAI ? "bg-gradient-to-br from-violet-900 via-indigo-900 to-violet-900" : "bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900")}>
        <div className="absolute top-0 right-0 p-8 opacity-10">{isAI ? <Bot size={140}/> : <Shield size={140}/>}</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            {isAI && <span className="text-[10px] font-black bg-violet-500/30 border border-violet-400/30 px-2 py-0.5 rounded-full text-violet-200 uppercase tracking-widest">AI Agent</span>}
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">{isAI ? 'Sylara AI Rep Console' : `Welcome back, ${repName.split(' ')[0]}.`}</h2>
          <p className="text-indigo-200 mt-1">{isAI ? 'Automated client management, follow-ups, and escalation handling.' : 'Here\'s your day at a glance. Stay focused, stay productive.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'My Clients', value: totalClients, trend: 'Active', color: 'indigo', icon: Users },
          { label: 'Open Tickets', value: openTickets, trend: openTickets > 0 ? 'Needs Attention' : 'All Clear', color: openTickets > 0 ? 'amber' : 'emerald', icon: MessageSquare },
          { label: 'Pipeline Value', value: '$0', trend: 'Building', color: 'blue', icon: Target },
          { label: isAI ? 'Auto-Resolved' : 'Calls Today', value: '0', trend: 'Today', color: 'emerald', icon: isAI ? Bot : PhoneCall },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <s.icon size={18} className={`text-${s.color}-500`} />
              <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full uppercase", s.trend === 'Needs Attention' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600')}>{s.trend}</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-indigo-500"/> Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Patient Referral', icon: UserPlus, color: 'bg-emerald-600' },
            { label: 'Schedule Callback', icon: Phone, color: 'bg-blue-600' },
            { label: 'Escalate Issue', icon: AlertTriangle, color: 'bg-red-600' },
            { label: 'Log Activity', icon: Activity, color: 'bg-indigo-600' },
          ].map((a, i) => (
            <button key={i} data-action-bound="true" onClick={() => {
              turso.execute({ sql: "INSERT INTO system_logs (level, source, message) VALUES (?, ?, ?)", args: ['info', 'Rep Action', `${repName} clicked: ${a.label}`] }).catch(() => {});
              alert(`${a.label} — Coming soon!`);
            }} className={cn("flex items-center gap-3 p-4 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all shadow-sm", a.color)}>
              <a.icon size={18}/> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tickets */}
      {alerts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Bell size={18} className="text-amber-500"/> My Open Tickets</h3>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((a: any, i: number) => (
              <div key={i} className={cn("p-4 rounded-xl border-l-4 flex justify-between items-center", a.severity === 'High' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500')}>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{a.message}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">{a.severity} Priority • {a.status}</p>
                </div>
                <button data-action-bound="true" className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase" onClick={() => setTab('tickets')}>View</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── INCOMING CALLS ──
  const renderCalls = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5"><PhoneIncoming size={120}/></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2"><PhoneIncoming className="text-emerald-400" size={22}/> Incoming Call Queue</h2>
            <p className="text-indigo-300 text-xs font-bold mt-1 uppercase tracking-widest">Inbound Calls Only • Outbound Requires Jr. Admin+</p>
          </div>
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border", callStatus === 'active' ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-blue-500/20 border-blue-400/30 text-blue-300")}>
            <div className={cn("w-2 h-2 rounded-full", callStatus === 'active' ? "bg-emerald-400 animate-pulse" : "bg-blue-400 animate-pulse")}/>
            {callStatus === 'active' ? 'On Call' : 'Ready'}
          </div>
        </div>
      </div>

      {/* Incoming call simulator */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        {callStatus === 'idle' && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100">
              <PhoneIncoming size={36} className="text-blue-500"/>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Waiting for Calls</h3>
            <p className="text-slate-400 text-sm mb-6">Your line is active. Incoming calls will appear here.</p>
            <button onClick={() => setCallStatus('ringing')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-500 transition-all shadow-lg">Simulate Incoming Call</button>
          </div>
        )}

        {callStatus === 'ringing' && (
          <div className="text-center py-8 animate-pulse">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Phone size={40} className="text-emerald-600 animate-bounce"/>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-1">Incoming Call</h3>
            <p className="text-slate-500 font-bold mb-6">+1 (405) 555-9201</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setCallStatus('active'); setActiveCallTimer(0); const iv = setInterval(() => setActiveCallTimer(p => p + 1), 1000); (window as any).__callIv = iv; }} className="px-8 py-3 bg-emerald-600 text-white font-black rounded-xl text-sm hover:bg-emerald-500 shadow-lg flex items-center gap-2"><Phone size={16}/> Answer</button>
              <button onClick={() => setCallStatus('idle')} className="px-8 py-3 bg-red-600 text-white font-black rounded-xl text-sm hover:bg-red-500 shadow-lg flex items-center gap-2"><PhoneOff size={16}/> Decline</button>
            </div>
          </div>
        )}

        {callStatus === 'active' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-emerald-200">
              <PhoneCall size={28} className="text-emerald-600"/>
            </div>
            <h3 className="text-xl font-black text-emerald-700 mb-1">Call Active</h3>
            <p className="text-slate-500 font-bold">+1 (405) 555-9201</p>
            <p className="text-2xl font-black text-slate-800 font-mono mt-2">{Math.floor(activeCallTimer / 60)}:{(activeCallTimer % 60).toString().padStart(2, '0')}</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => { clearInterval((window as any).__callIv); setCallStatus('ended'); setTimeout(() => setCallStatus('idle'), 3000); }} className="px-6 py-3 bg-red-600 text-white font-black rounded-xl text-sm hover:bg-red-500 shadow-lg flex items-center gap-2"><PhoneOff size={16}/> End Call</button>
              <button onClick={() => { clearInterval((window as any).__callIv); setCallStatus('idle'); alert('Call transferred to Team Lead.'); }} className="px-6 py-3 bg-amber-500 text-white font-black rounded-xl text-sm hover:bg-amber-400 shadow-lg flex items-center gap-2"><PhoneForwarded size={16}/> Transfer to Lead</button>
            </div>
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="text-center py-8">
            <CircleCheck size={40} className="mx-auto text-emerald-500 mb-3"/>
            <h3 className="text-xl font-black text-slate-800">Call Ended</h3>
            <p className="text-slate-400 text-sm">Duration: {Math.floor(activeCallTimer / 60)}:{(activeCallTimer % 60).toString().padStart(2, '0')}</p>
          </div>
        )}
      </div>

      {/* Call History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100"><h3 className="font-black text-slate-800 text-sm flex items-center gap-2"><Clock size={16}/> Recent Calls</h3></div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">From</th>
              <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">Status</th>
              <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">Duration</th>
              <th className="px-5 py-3 font-black text-slate-500 text-[10px] uppercase tracking-widest">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {callLog.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-bold text-slate-800">{c.from}</td>
                <td className="px-5 py-3"><span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", c.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : c.status === 'missed' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}>{c.status}</span></td>
                <td className="px-5 py-3 text-slate-600">{c.duration > 0 ? `${Math.floor(c.duration/60)}:${(c.duration%60).toString().padStart(2,'0')}` : '—'}</td>
                <td className="px-5 py-3 text-xs text-slate-400 font-bold">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0"/>
        <p className="text-xs font-bold text-amber-800">Outbound dialing is restricted to Jr. Admin and above. To make an outbound call, transfer to your Team Lead or request escalation.</p>
      </div>
    </div>
  );

  // ── CLIENTS ──
  const renderClients = () => {
    const filtered = [...patients.map(p => ({ ...p, _type: 'patient' })), ...businesses.map(b => ({ ...b, _type: 'business' }))].filter(c => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (c.name || c.first_name || '').toLowerCase().includes(s) || (c.email || '').toLowerCase().includes(s);
    });
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800">My Clients ({filtered.length})</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:border-indigo-500"/></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">State</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim()}</p>
                    <p className="text-[10px] text-slate-400">{c.email || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", c._type === 'patient' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>{c._type === 'patient' ? <><HeartPulse size={10} className="inline mr-1"/>Patient</> : <><Building2 size={10} className="inline mr-1"/>Business</>}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{c.state || 'N/A'}</td>
                  <td className="px-6 py-4 text-right"><button data-action-bound="true" className="text-xs font-black text-indigo-600 uppercase hover:underline" onClick={() => alert('Client profile view coming soon.')}>View</button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No clients found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── PIPELINE ──
  const renderPipeline = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">My Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['New Leads', 'In Progress', 'Closed / Won'].map((stage, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className={cn("px-5 py-3 font-black text-sm uppercase tracking-widest border-b", i === 0 ? 'bg-blue-50 text-blue-700 border-blue-100' : i === 1 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100')}>{stage}</div>
            <div className="p-5 min-h-[200px] flex items-center justify-center">
              <p className="text-slate-400 text-sm italic text-center">Pipeline tracking activates as you work leads.<br/>Drag & drop coming soon.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── TICKETS ──
  const renderTickets = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">My Tickets ({alerts.length})</h2>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        {alerts.length > 0 ? alerts.map((a: any, i: number) => (
          <div key={i} className={cn("p-5 border rounded-2xl flex justify-between items-center", a.severity === 'High' ? 'bg-red-50 border-red-100' : a.severity === 'Medium' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100')}>
            <div>
              <p className="font-black text-slate-800">{a.message}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Severity: {a.severity} • Status: {a.status} • {a.date || 'Recent'}</p>
            </div>
            <div className="flex gap-2">
              <button data-action-bound="true" className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase" onClick={() => {
                turso.execute({ sql: 'UPDATE compliance_alerts SET is_resolved = 1 WHERE id = ?', args: [a.id] }).then(() => {
                  setAlerts(prev => prev.filter(x => x.id !== a.id));
                }).catch(console.error);
              }}>Resolve</button>
              <button data-action-bound="true" className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl uppercase" onClick={() => {
                turso.execute({ sql: "INSERT INTO compliance_alerts (id, entity_id, message, severity, status, is_resolved, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [`esc-${Date.now()}`, a.entity_id, `[ESCALATED by ${repName}] ${a.message}`, 'High', 'Escalated to Manager', 0, new Date().toISOString()] }).catch(console.error);
                alert('Escalated to your manager.');
              }}>Escalate</button>
            </div>
          </div>
        )) : (
          <div className="p-12 text-center"><CircleCheck size={40} className="mx-auto text-emerald-500 mb-4"/><h3 className="text-xl font-black text-slate-800 mb-2">All Clear</h3><p className="text-slate-500">No open tickets assigned to you.</p></div>
        )}
      </div>
    </div>
  );

  // ── PERFORMANCE ──
  const renderPerformance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">{isAI ? 'AI Agent Performance' : 'My Performance'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Clients Managed', value: totalClients, icon: Users },
          { label: 'Tickets Resolved', value: '0', icon: CircleCheck },
          { label: isAI ? 'Auto-Resolutions' : 'Calls Made', value: '0', icon: isAI ? Bot : PhoneCall },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
            <m.icon size={28} className="mx-auto text-indigo-500 mb-3"/>
            <p className="text-3xl font-black text-slate-800">{m.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="font-black text-slate-800 mb-4">Activity Timeline</h3>
        <div className="border-l-2 border-slate-200 pl-6 space-y-6">
          <div className="relative"><div className="absolute -left-[31px] w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"/><p className="text-sm font-bold text-slate-800">Account activated</p><p className="text-[10px] text-slate-400 font-bold">Today • Real-time tracking is now active</p></div>
        </div>
      </div>
    </div>
  );

  // ── KNOWLEDGE BASE ──
  const renderKnowledge = () => {
    const filtered = METRC_MANUAL.filter(s => s.title.toLowerCase().includes(regSearch.toLowerCase()) || s.content.toLowerCase().includes(regSearch.toLowerCase()));
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800">Knowledge Base</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><input type="text" value={regSearch} onChange={e => setRegSearch(e.target.value)} placeholder="Search regulations..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:border-indigo-500"/></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">{item.category}</span>
              <h3 className="text-sm font-black text-slate-800 mt-3 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.content}</p>
            </div>
          ))}
          {filtered.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">No results for "{regSearch}"</div>}
        </div>
      </div>
    );
  };

  const getContent = () => {
    switch (tab) {
      case 'home': return renderHome();
      case 'calls': return renderCalls();
      case 'clients': return renderClients();
      case 'pipeline': return renderPipeline();
      case 'tickets': return renderTickets();
      case 'performance': return renderPerformance();
      case 'knowledge': return renderKnowledge();
      case 'settings': return <ProfileSettingsCard user={user} roleLabel={isAI ? 'AI Rep Agent' : 'Sales Representative'} />;
      default: return renderHome();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className={cn("w-64 flex flex-col shrink-0 hidden md:flex", isAI ? "bg-violet-950 border-r border-violet-900" : "bg-slate-950 border-r border-slate-900")}>
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white", isAI ? "bg-violet-600" : "bg-indigo-600")}>{isAI ? <Bot size={20}/> : <Briefcase size={20}/>}</div>
            <div>
              <h2 className="font-black text-sm text-white leading-tight uppercase tracking-tight">{isAI ? 'AI Rep' : 'Rep Portal'}</h2>
              <p className={cn("text-[10px] font-black tracking-widest uppercase", isAI ? "text-violet-400" : "text-indigo-400")}>{repName.split(' ')[0]}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-left", tab === item.id ? (isAI ? "bg-violet-600 text-white shadow-xl" : "bg-indigo-600 text-white shadow-xl") : "text-slate-400 hover:bg-white/5 hover:text-slate-100")}>
              <item.icon size={18} className={tab === item.id ? "text-white" : "text-slate-500"}/> {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800">
          {onLogout && <button onClick={onLogout} className="w-full py-2.5 bg-slate-900/50 text-slate-400 border border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-800 hover:text-white transition-all">← Back</button>}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">{NAV.find(n => n.id === tab)?.label || 'Dashboard'}</h1>
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border", isAI ? "text-violet-600 bg-violet-50 border-violet-100" : "text-emerald-600 bg-emerald-50 border-emerald-100")}>
              <div className={cn("w-2 h-2 rounded-full animate-pulse", isAI ? "bg-violet-500" : "bg-emerald-500")}/> {isAI ? 'AI AGENT ACTIVE' : 'ONLINE'}
            </div>
          </div>
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

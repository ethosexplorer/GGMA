import React, { useState, useEffect } from 'react';
import { Calendar, Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones,
  Phone, PhoneCall, PhoneOff, PhoneIncoming, PhoneOutgoing, UserPlus, Globe, Zap, Database, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserCalendar } from '../components/UserCalendar';
import { AdminSupportCalendar } from '../components/AdminSupportCalendar';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { voip800 } from '../lib/voip800';

const NAV_ITEMS = [
  { section: 'CALL CENTER' },
  { id: 'call_center', label: 'Call Center Command', icon: Phone, badge: 'Live' },
  { section: 'SUPPORT OPERATIONS' },
  { id: 'admin_support_calendar', label: 'Admin Support', icon: Clock, badge: 'Help' },
  { id: 'support', label: 'Active Support Tickets', icon: MessageSquare, badge: '12' },
  { id: 'calls', label: 'Call Queue', icon: Headphones, badge: '3' },
  { id: 'backoffice', label: 'Escalations Queue', icon: Cpu, dot: true },
  { section: 'MANAGEMENT' },
  { id: 'it_support', label: 'IT Support & Diagnostics', icon: MonitorPlay },
  { id: 'hr_intelligence', label: 'HR Intelligence', icon: UserPlus },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '502' },
  { id: 'personnel', label: 'Personnel Force (Total)', icon: Users },
  { section: 'USER ASSISTANCE' },
  { id: 'patients', label: 'Patient Inquiries', icon: HeartPulse },
  { id: 'business', label: 'Business Inquiries', icon: Building2 },
];

export const OperationsDashboard = ({ onLogout, user }: { onLogout?: () => void | Promise<void>, user?: any }) => {
  const [activeTab, setActiveTab] = useState('call_center');

  // Draggable nav state with localStorage persistence
  const [opsNavItems, setOpsNavItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gghp_ops_nav_order');
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        const idToItem = new Map(NAV_ITEMS.map((item, i) => [item.id || `ops-section-${i}`, item]));
        const ordered = savedIds.map(id => idToItem.get(id)).filter(Boolean) as typeof NAV_ITEMS;
        NAV_ITEMS.forEach((item, i) => { const key = item.id || `ops-section-${i}`; if (!savedIds.includes(key)) ordered.push(item); });
        return ordered;
      }
    } catch {}
    return [...NAV_ITEMS];
  });
  const [opsDragIdx, setOpsDragIdx] = useState<number | null>(null);
  const [opsEditIdx, setOpsEditIdx] = useState<number | null>(null);

  const opsHandleDragStart = (e: any, idx: number) => { setOpsDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; };
  const opsHandleDragOver = (e: any, idx: number) => {
    e.preventDefault();
    if (opsDragIdx === null || opsDragIdx === idx) return;
    const items = [...opsNavItems]; const item = items[opsDragIdx]; items.splice(opsDragIdx, 1); items.splice(idx, 0, item);
    setOpsDragIdx(idx); setOpsNavItems(items);
    localStorage.setItem('gghp_ops_nav_order', JSON.stringify(items.map((it, i) => it.id || `ops-section-${i}`)));
  };

  const [agentStatus, setAgentStatus] = useState('Available');

  useEffect(() => {
    let timer: any;
    // Sync with WebDialer floating widget
    window.dispatchEvent(new CustomEvent('twilio-status-change', { detail: { status: agentStatus } }));

    if (agentStatus === 'Available' || agentStatus === 'Ready') {
      // Listen for missed call event (mocked here, but sets the pattern)
      const checkMissedCalls = setInterval(() => {
         // In a live system, this would poll the queue or listen to a websocket.
         // If a call is missed while available, wait 30 seconds and log out.
         const missedCallDetected = false; // Placeholder for real webhook trigger
         if (missedCallDetected) {
            setAgentStatus('Logged out');
            alert("Status changed to Logged out due to missed call.");
         }
      }, 5000);
      return () => clearInterval(checkMissedCalls);
    }
  }, [agentStatus]);

  const [liveQueue, setLiveQueue] = useState(0);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [routingTab, setRoutingTab] = useState<'routing' | 'dialpad' | 'voicemails'>('routing');
  const [dialNumber, setDialNumber] = useState('');
  const [routingRules, setRoutingRules] = useState([
    { name: 'Main → Live Agent', dest: 'Live Sr Agent', type: 'Standard', icon: PhoneIncoming, active: true },
    { name: 'Overflow → Support', dest: 'Support Desk', type: 'Sequential', icon: PhoneOutgoing, active: true },
    { name: 'After Hours → VM', dest: 'VM Box #1', type: 'Scheduled', icon: PhoneOff, active: true },
  ]);
  const [voicemails, setVoicemails] = useState<any[]>([]);
  
  // Inline UI states for Transfer/Forward to avoid prompt()
  const [showTransfer, setShowTransfer] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [forwardTarget, setForwardTarget] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const qCount = await voip800.getQueueCount();
      setLiveQueue(qCount);
      const calls = await voip800.getCallHistory(10);
      const sortedCalls = calls.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentCalls(sortedCalls);
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    voip800.getVoicemails().then(setVoicemails).catch(() => {});
  }, [routingTab]);

  const renderCallCenter = () => {
    const isConnected = voip800.isConfigured();

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5"><PhoneCall size={140} /></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-2">
                  <Phone className="text-emerald-400" size={22} /> Call Center Command
                </h2>
                <p className="text-emerald-300 font-bold tracking-widest uppercase text-[10px] mt-1">
                  Twilio VOIP • 1-888-963-4447
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <a 
                  href="https://console.twilio.com/us1/monitor/logs/calls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-rose-500/40 hover:scale-105 transition-all cursor-pointer"
                  title="Click to open Twilio Web Dialer"
                >
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Active Queue:</span>
                  <span className="text-sm font-black text-rose-400">{liveQueue}</span>
                </a>

                {/* Quick Actions */}
                <button onClick={() => setRoutingTab('voicemails')} className="bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-purple-500/40 transition-all text-purple-300 font-bold text-[10px] uppercase tracking-widest">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="5.5" cy="11.5" r="4.5"/><circle cx="18.5" cy="11.5" r="4.5"/><line x1="5.5" y1="16" x2="18.5" y2="16"/></svg>
                  Voicemail
                </button>
                <div className="relative">
                  <button onClick={() => { setShowForward(!showForward); setShowTransfer(false); }} className="bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-indigo-500/40 transition-all text-indigo-300 font-bold text-[10px] uppercase tracking-widest">
                    <PhoneOutgoing size={14} /> Forward
                  </button>
                  {showForward && (
                    <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-2xl z-50 w-64">
                      <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Forward Calls To:</p>
                      <input type="text" value={forwardTarget} onChange={(e) => setForwardTarget(e.target.value)} placeholder="e.g., +15551234567" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white mb-2 outline-none focus:border-indigo-500" />
                      <button onClick={() => {
                        if (forwardTarget) {
                          setRoutingRules(prev => [...prev, { name: 'Forwarded Line', dest: forwardTarget, type: 'Standard', icon: PhoneOutgoing, active: true }]);
                          setForwardTarget('');
                          setShowForward(false);
                        }
                      }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg">Activate Forwarding</button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => { setShowTransfer(!showTransfer); setShowForward(false); }} className="bg-sky-500/20 border border-sky-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-sky-500/40 transition-all text-sky-300 font-bold text-[10px] uppercase tracking-widest">
                    <UserPlus size={14} /> Transfer
                  </button>
                  {showTransfer && (
                    <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-2xl z-50 w-64">
                      <p className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-widest">Transfer Active Call:</p>
                      <input type="text" value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} placeholder="Extension or Number" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white mb-2 outline-none focus:border-sky-500" />
                      <button onClick={() => {
                        if (transferTarget) {
                          window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: transferTarget } }));
                          setTransferTarget('');
                          setShowTransfer(false);
                        }
                      }} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 rounded-lg">Execute Transfer</button>
                    </div>
                  )}
                </div>

                <select 
                  value={agentStatus} 
                  onChange={(e) => setAgentStatus(e.target.value)}
                  className={cn(
                    "bg-slate-900/50 border rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider outline-none cursor-pointer",
                    agentStatus === 'Ready' ? "text-emerald-400 border-emerald-500/50" :
                    agentStatus === 'Available' ? "text-blue-400 border-blue-500/50" :
                    agentStatus === 'Not available' ? "text-amber-400 border-amber-500/50" :
                    "text-red-400 border-red-500/50"
                  )}
                >
                  <option value="Ready">Ready</option>
                  <option value="Available">Available</option>
                  <option value="Not available">Not available</option>
                  <option value="Logged out">Logged out</option>
                </select>
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest border", isConnected ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-red-500/20 border-red-400/30 text-red-300")}>
                  <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400")} />
                  {isConnected ? 'Live' : 'Offline'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Number', value: '1-888-963-4447', icon: Phone },
                { label: 'Account', value: voip800.ACCOUNT_ID || '—', icon: Shield },
                { label: 'Provider', value: 'Twilio', icon: Globe },
                { label: 'Status', value: isConnected ? 'Active' : 'Setup', icon: Activity },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{s.label}</p>
                  <p className="text-sm font-black text-white mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Call Routing / Dial Pad Tabbed Area */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
            <div className="border-b border-slate-100 flex items-center justify-between px-4 pt-4">
              <div className="flex gap-6">
                <button 
                  onClick={() => setRoutingTab('routing')}
                  className={cn("pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors", routingTab === 'routing' ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-800")}
                >
                  <PhoneCall size={16} /> Call Routing
                </button>
                <button 
                  onClick={() => setRoutingTab('dialpad')}
                  className={cn("pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors", routingTab === 'dialpad' ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800")}
                >
                  <PhoneOutgoing size={16} /> Dial Pad
                </button>
                <button 
                  onClick={() => setRoutingTab('voicemails')}
                  className={cn("pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors", routingTab === 'voicemails' ? "border-purple-600 text-purple-600" : "border-transparent text-slate-500 hover:text-slate-800")}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="5.5" cy="11.5" r="4.5"/><circle cx="18.5" cy="11.5" r="4.5"/><line x1="5.5" y1="16" x2="18.5" y2="16"/></svg> Voicemails
                </button>
              </div>
              {routingTab === 'routing' && (
                <button onClick={async () => { 
                  const n = prompt('Enter Name:'); 
                  const d = prompt('Enter Number:'); 
                  if (d && n) {
                    setRoutingRules(prev => [...prev, { name: n, dest: d, type: 'Standard', icon: PhoneOutgoing, active: true }]);
                  }
                }} className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg mb-2">
                  + Add Rule
                </button>
              )}
            </div>
            
            <div className="p-4 flex-1">
              {routingTab === 'routing' ? (
                <div className="space-y-2">
                  {routingRules.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><r.icon size={14} /></div>
                        <div><p className="text-sm font-bold text-slate-800">{r.name}</p><p className="text-[10px] text-slate-500">→ {r.dest} • {r.type}</p></div>
                      </div>
                      <button onClick={() => {
                        setRoutingRules(prev => prev.map((rule, idx) => idx === i ? { ...rule, active: !rule.active } : rule));
                      }} className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-colors", r.active ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-200")}>
                        {r.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : routingTab === 'voicemails' ? (
                <div className="space-y-2">
                  {voicemails.length === 0 ? (
                    <div className="text-center p-8 text-slate-400 font-bold text-sm">No new voicemails.</div>
                  ) : voicemails.map((vm, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="5.5" cy="11.5" r="4.5"/><circle cx="18.5" cy="11.5" r="4.5"/><line x1="5.5" y1="16" x2="18.5" y2="16"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Voicemail ({vm.duration}s)</p>
                          <p className="text-[10px] text-slate-500">{vm.time}</p>
                        </div>
                      </div>
                      <a href={vm.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors">
                        Play
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-xs mx-auto">
                  <input 
                    type="text" 
                    value={dialNumber}
                    onChange={(e) => setDialNumber(e.target.value)}
                    placeholder="+1 (555) 555-5555" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xl text-center font-mono tracking-widest mb-4 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                  />
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {['1','2','3','4','5','6','7','8','9','*','0','#'].map((key) => (
                      <button 
                        key={key}
                        onClick={() => setDialNumber(prev => prev + key)}
                        className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xl font-bold p-3 rounded-xl transition-all shadow-sm"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setDialNumber(prev => prev.slice(0, -1))}
                      disabled={!dialNumber}
                      className="w-16 bg-white border border-slate-200 disabled:opacity-50 text-slate-400 p-3 rounded-xl transition-colors flex items-center justify-center shadow-sm hover:bg-slate-50"
                    >
                      ⌫
                    </button>
                    <button 
                      onClick={() => {
                        // The actual WebRTC Dial logic is handled by the WebDialer component overlay.
                        // We can communicate with it via custom events, or just alert the user to use the bottom dialer.
                        // We will trigger a custom event that WebDialer.tsx listens to!
                        window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: dialNumber } }));
                      }}
                      disabled={!dialNumber || !isConnected}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Phone size={20} /> Dial Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Quick SMS */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><MessageSquare size={16} className="text-emerald-600" /> Quick SMS</h3>
            </div>
            <div className="p-4 space-y-3">
              <input type="tel" placeholder="(555) 123-4567" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-400" id="ops-sms-to" />
              <textarea rows={2} placeholder="Message..." className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-400 resize-none" id="ops-sms-body" />
              <button onClick={async () => { const to = (document.getElementById('ops-sms-to') as HTMLInputElement)?.value; const b = (document.getElementById('ops-sms-body') as HTMLTextAreaElement)?.value; if (to && b) { const r = await voip800.sendSMS(to, b); alert(r ? '✅ Sent!' : '❌ Failed'); } else alert('Fill both fields.'); }} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg text-sm">Send SMS</button>
            </div>
          </div>
        </div>

        {/* Call Log */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><Clock size={16} /> Recent Calls</h3>
            <button onClick={async () => { const c = await voip800.getCallHistory(10); setRecentCalls(c); alert('Refreshed'); }} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg flex items-center gap-1"><Download size={12} /> Refresh</button>
          </div>
          <table className="w-full">
            <thead><tr className="bg-slate-50 text-left">{['Dir','From','To','Status','Dur','Time'].map(h => <th key={h} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {recentCalls.map((c: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3"><span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-full", c.direction==='inbound' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600')}>{c.direction === 'inbound' ? 'IN' : 'OUT'}</span></td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{c.from}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.to}</td>
                  <td className="px-4 py-3"><span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize", c.status==='completed'?'bg-emerald-50 text-emerald-600':c.status==='voicemail'?'bg-amber-50 text-amber-600':'bg-red-50 text-red-600')}>{c.status}</span></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{c.duration > 0 ? `${Math.floor(c.duration/60)}:${(c.duration%60).toString().padStart(2,'0')}` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(c.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {recentCalls.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm font-bold">No calls found in history</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Test Connection */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div><h4 className="text-sm font-bold text-slate-800">API Connection Test</h4><p className="text-xs text-slate-500">Verify Twilio WebRTC integration</p></div>
          <button onClick={async () => { const r = await voip800.verifyConnection(); alert(r.connected ? `✅ Connected\nAccount: ${r.accountId}` : `❌ Failed: ${r.error}`); }} className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg flex items-center gap-2"><Zap size={14} /> Test</button>
        </div>
      </div>
    );
  };

  const renderSupport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Average Wait Time</h4>
            <p className="text-2xl font-black text-slate-800">1m 42s</p>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Agents</h4>
            <p className="text-2xl font-black text-emerald-600">42</p>
         </div>
         <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Resolution Rate</h4>
            <p className="text-2xl font-black text-indigo-600">94%</p>
         </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
         <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><MessageSquare size={18} className="text-blue-500" /> Active Conversations</h3>
         <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400"><Users size={18} /></div>
                    <div><p className="text-sm font-bold text-slate-800">User_{4820+i} (Patient)</p><p className="text-xs text-slate-500 font-medium">Topic: License Status Inquiry</p></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Wait: 4m</span>
                    <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md">Pick Up</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderITSupport = () => (
    <div className="h-full w-full min-h-[70vh]">
      <ITSupportDashboard />
    </div>
  );

  const renderHRIntelligence = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-black flex items-center gap-2"><UserPlus size={22} className="text-purple-400" /> HR Intelligence (Sylara)</h2>
        <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest mt-1">Workforce Analytics & Talent Pipeline</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ l: 'Active Staff', v: '42', c: 'emerald' }, { l: 'Open Positions', v: '8', c: 'amber' }, { l: 'Applications', v: '156', c: 'blue' }, { l: 'Retention Rate', v: '94%', c: 'indigo' }].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className={`text-2xl font-black text-${s.c}-600`}>{s.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Recent Hires & Pipeline</h3>
        <div className="space-y-3">
          {['IT Systems Admin — Ryan Ferrari (Onboarded)', 'Compliance Analyst — Pending Background Check', 'Customer Support Lead — Interview Scheduled', 'Operations Coordinator — Application Received'].map((h, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-medium text-slate-700">{h}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplicationsQueue = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ l: 'Pending Review', v: '502', c: 'amber' }, { l: 'Approved Today', v: '38', c: 'emerald' }, { l: 'Rejected/Flagged', v: '12', c: 'red' }].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className={`text-2xl font-black text-${s.c}-600`}>{s.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={16} /> Applications Queue</h3></div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Green Leaf Dispensary LLC', type: 'Business License', state: 'Oklahoma', status: 'Pending', time: '2h ago' },
            { name: 'John D. Carter', type: 'Patient Card Renewal', state: 'Oklahoma', status: 'Under Review', time: '4h ago' },
            { name: 'MedCanna Corp', type: 'Grower License', state: 'Colorado', status: 'Flagged', time: '6h ago' },
            { name: 'Sarah Williams', type: 'Caregiver License', state: 'Oklahoma', status: 'Pending', time: '8h ago' },
            { name: 'Highland Processing Inc', type: 'Processor License', state: 'Missouri', status: 'Under Review', time: '12h ago' },
          ].map((a, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
              <div><p className="text-sm font-bold text-slate-800">{a.name}</p><p className="text-xs text-slate-500">{a.type} • {a.state}</p></div>
              <div className="flex items-center gap-3">
                <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", a.status==='Pending'?'bg-amber-50 text-amber-600':a.status==='Under Review'?'bg-blue-50 text-blue-600':'bg-red-50 text-red-600')}>{a.status}</span>
                <span className="text-xs text-slate-400">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const [personnelList, setPersonnelList] = useState([
    { name: 'Live Sr Agent', role: 'Founder/CEO', dept: 'Executive', status: 'Active', empId: 'GGE-001', ext: '101' },
    { name: 'Monica Green', role: 'Compliance Director', dept: 'Compliance', status: 'Active', empId: 'GGE-002', ext: '102' },
    { name: 'Ryan Ferrari', role: 'CEO / IT Lead', dept: 'Operations', status: 'Active', empId: 'GGE-003', ext: '103' },
    { name: 'Bob Moore', role: 'Executive Advisor', dept: 'Executive', status: 'Active', empId: 'GGE-004', ext: '104' },
    { name: 'Larry AI', role: 'Compliance Service Officer', dept: 'AI Systems', status: 'Online', empId: 'GGE-A01', ext: '901' },
    { name: 'Sylara AI', role: 'Intake & HR Agent', dept: 'AI Systems', status: 'Online', empId: 'GGE-A02', ext: '902' },
  ]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', dept: 'Operations', empId: '', ext: '' });
  const [onboardingStep, setOnboardingStep] = useState(0);

  const DEPTS = ['Executive', 'Operations', 'Compliance', 'Sales', 'Support', 'AI Systems', 'Finance', 'Legal', 'IT', 'HR'];

  const handleCompleteOnboarding = () => {
    if (!newStaff.name || !newStaff.role) return alert('Name and role are required');
    setPersonnelList(prev => [...prev, { ...newStaff, status: 'Active' }]);
    setNewStaff({ name: '', role: '', dept: 'Operations' });
    setShowAddStaff(false);
    setOnboardingStep(0);
  };

  const renderPersonnel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ l: 'Total Personnel', v: String(personnelList.length) }, { l: 'Active Today', v: String(personnelList.filter(p => p.status === 'Active' || p.status === 'Online').length) }, { l: 'On Leave', v: String(personnelList.filter(p => p.status === 'On Leave').length) }, { l: 'New This Month', v: '3' }].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className="text-2xl font-black text-slate-800">{s.v}</p>
          </div>
        ))}
      </div>

      {/* Add Staff Onboarding Modal */}
      {showAddStaff && (
        <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus size={18} />
              <h4 className="font-black text-sm">Staff Onboarding — New Entry</h4>
            </div>
            <button onClick={() => { setShowAddStaff(false); setOnboardingStep(0); }} className="text-white/60 hover:text-white">✕</button>
          </div>
          <div className="p-5 space-y-4">
            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-2">
              {['Info', 'Role', 'Review'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= onboardingStep ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                  <span className={`text-xs font-bold ${i <= onboardingStep ? 'text-indigo-600' : 'text-slate-400'}`}>{step}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 ${i < onboardingStep ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>

            {onboardingStep === 0 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Full Name *</label>
                  <input value={newStaff.name} onChange={(e) => setNewStaff(p => ({ ...p, name: e.target.value }))} placeholder="Enter full name" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                </div>
                <button onClick={() => newStaff.name ? setOnboardingStep(1) : alert('Enter a name')} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold">Next →</button>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Job Title / Role *</label>
                  <input value={newStaff.role} onChange={(e) => setNewStaff(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Dispensary Manager" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Department</label>
                  <select value={newStaff.dept} onChange={(e) => setNewStaff(p => ({ ...p, dept: e.target.value }))} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-400">
                    {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep(0)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">← Back</button>
                  <button onClick={() => newStaff.role ? setOnboardingStep(2) : alert('Enter a role')} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold">Next →</button>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Onboarding Summary</p>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Name:</span><span className="font-bold text-slate-800">{newStaff.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Role:</span><span className="font-bold text-slate-800">{newStaff.role}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Department:</span><span className="font-bold text-slate-800">{newStaff.dept}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-600">Active</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Auto-generated:</span><span className="font-bold text-indigo-600">Employee ID ({newStaff.empId || `GGE-00${personnelList.length + 1}`}), Ext ({newStaff.ext || `${100 + personnelList.length + 1}`})</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep(1)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold">← Back</button>
                  <button onClick={() => {
                    const empId = `GGE-00${personnelList.length + 1}`;
                    const ext = `${100 + personnelList.length + 1}`;
                    setPersonnelList(prev => [...prev, { ...newStaff, empId, ext, status: 'Active' }]);
                    setNewStaff({ name: '', role: '', dept: 'Operations', empId: '', ext: '' });
                    setShowAddStaff(false);
                    setOnboardingStep(0);
                  }} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2">
                    <CircleCheck size={16} /> Complete Onboarding & Add to Directory
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={16} /> Personnel Directory</h3>
          <button onClick={() => setShowAddStaff(true)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md">
            <Plus size={14} /> Add Staff
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {personnelList.map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Users size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{p.name} <span className="text-xs text-indigo-500 font-mono bg-indigo-50 px-1 py-0.5 rounded ml-2">{p.empId}</span></p>
                  <p className="text-xs text-slate-500">{p.role} • {p.dept}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ext</p>
                  <p className="text-sm font-bold text-slate-700 font-mono">{p.ext || '---'}</p>
                </div>
                <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-20 text-center", p.status === 'Active' || p.status === 'Online' ? 'text-emerald-600 bg-emerald-50' : p.status === 'On Leave' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100')}>{p.status}</span>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('twilio-dial-out', { detail: { number: p.ext } }))}
                  className="bg-sky-50 hover:bg-sky-100 text-sky-600 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <UserPlus size={12} /> Transfer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'call_center': return renderCallCenter();
      case 'admin_support_calendar': return <div className="h-full w-full"><AdminSupportCalendar /></div>;
      case 'support': return renderSupport();
      case 'it_support': return renderITSupport();
      case 'hr_intelligence': return renderHRIntelligence();
      case 'applications': return renderApplicationsQueue();
      case 'personnel': return renderPersonnel();
      default: return (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto"><Headphones size={32}/></div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab.replace(/_/g, ' ').toUpperCase()}</h3>
            <p className="text-slate-500 text-sm font-medium">This module is part of the Operations Oversight suite. Real-time escalations and support metrics are displayed here.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-900 border border-indigo-700 flex items-center justify-center text-white rounded-lg shadow-lg">
               <Headphones size={22} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight uppercase tracking-tight">Ops Center</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Internal Operations</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {opsNavItems.map((item, i) => {
            if ('section' in item && item.section) {
              return (
                <div
                  key={`ops-sec-${i}`}
                  draggable
                  onDragStart={(e) => opsHandleDragStart(e, i)}
                  onDragOver={(e) => opsHandleDragOver(e, i)}
                  onDragEnd={() => setOpsDragIdx(null)}
                  onDoubleClick={() => setOpsEditIdx(i)}
                  className="pt-4 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-grab active:cursor-grabbing flex items-center gap-1 hover:text-indigo-400 transition-colors group"
                >
                  <span className="opacity-0 group-hover:opacity-50 transition-opacity">⠿</span>
                  {opsEditIdx === i ? (
                    <input
                      autoFocus
                      defaultValue={item.section}
                      className="bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider px-1 py-0.5 rounded border border-indigo-500 outline-none w-full"
                      onBlur={(e) => {
                        const updated = [...opsNavItems];
                        updated[i] = { ...updated[i], section: e.target.value || item.section };
                        setOpsNavItems(updated);
                        setOpsEditIdx(null);
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                    />
                  ) : item.section}
                </div>
              );
            }
            return (
              <button
                key={item.id}
                draggable
                onDragStart={(e) => opsHandleDragStart(e, i)}
                onDragOver={(e) => opsHandleDragOver(e, i)}
                onDragEnd={() => setOpsDragIdx(null)}
                onClick={() => setActiveTab(item.id!)}
                className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left cursor-grab active:cursor-grabbing", activeTab === item.id ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:bg-slate-800/50", opsDragIdx === i && "opacity-50")}
              >
                <span className="flex items-center gap-3">{item.icon && <item.icon size={16} />} {item.label}</span>
                {item.badge && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
              </button>
            );
          })}
          {/* New Group button */}
          <button
            onClick={() => {
              const name = prompt('New section label name:');
              if (name) {
                const updated = [...opsNavItems, { section: name.toUpperCase() }];
                setOpsNavItems(updated);
                localStorage.setItem('gghp_ops_nav_order', JSON.stringify(updated.map((it, i) => it.id || `ops-section-${i}`)));
              }
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-indigo-400 border border-dashed border-indigo-500/30 hover:bg-indigo-500/10 transition-colors uppercase tracking-widest"
          >
            + New Group
          </button>
        </div>
        <button onClick={onLogout} className="p-4 border-t border-slate-800 flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <LogOut size={16} /> <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight capitalize">{activeTab.replace(/_/g, ' ')}</h1>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">Live Queue: Active</div>
             <Bell size={20} className="text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{getContent()}</div>
      </div>
    </div>
  );
};

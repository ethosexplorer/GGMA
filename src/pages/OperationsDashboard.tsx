import React, { useState, useEffect } from 'react';
import { Calendar, Building2, Users, FileText, Settings, Shield, Activity, Bell,
  Briefcase, HeartPulse, Scale, Gavel, FileCheck, CheckCircle2,
  Wallet, MonitorPlay, MessageSquare, BarChart3, Bot, TrendingUp,
  AlertTriangle, Search, Download, Plus, MoreVertical, Eye,
  Clock, UserCheck, FolderLock, Cpu, ArrowUpRight, LogOut, Headphones,
  Phone, PhoneCall, PhoneOff, PhoneIncoming, PhoneOutgoing, UserPlus, Globe, Zap, Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserCalendar } from '../components/UserCalendar';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { voip800 } from '../lib/voip800';

const NAV_ITEMS = [
  { section: 'CALL CENTER' },
  { id: 'call_center', label: 'Call Center Command', icon: Phone, badge: 'Live' },
  { section: 'SUPPORT OPERATIONS' },
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

  // Timer logic for missed calls
  useEffect(() => {
    let timer: any;
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

  const renderCallCenter = () => {
    const isConnected = voip800.isConfigured();
    const [liveQueue, setLiveQueue] = useState(0);
    const [recentCalls, setRecentCalls] = useState<any[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const qCount = await voip800.getQueueCount();
        setLiveQueue(qCount);
        const calls = await voip800.getCallHistory(10);
        // Sort newest first
        const sortedCalls = calls.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRecentCalls(sortedCalls);
      };
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }, []);

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
              <div className="flex items-center gap-3">
                <a 
                  href="https://app.800.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-rose-500/40 hover:scale-105 transition-all cursor-pointer"
                  title="Click to open Twilio Web Dialer"
                >
                  <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest">Active Queue:</span>
                  <span className="text-sm font-black text-rose-400">{liveQueue}</span>
                </a>
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
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border", isConnected ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300" : "bg-red-500/20 border-red-400/30 text-red-300")}>
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
          {/* Call Routing */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><PhoneCall size={16} className="text-indigo-600" /> Call Routing</h3>
              <button onClick={async () => { const d = prompt('Enter forwarding number:'); if (d) { const ok = await voip800.updateForwarding(d); alert(ok ? '✅ Updated!' : '❌ Failed'); }}} className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg">+ Add</button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { name: 'Main → Founder', dest: 'Shantell Robinson', type: 'Standard', icon: PhoneIncoming },
                { name: 'Overflow → Support', dest: 'Support Desk', type: 'Sequential', icon: PhoneOutgoing },
                { name: 'After Hours → VM', dest: 'VM Box #1', type: 'Scheduled', icon: PhoneOff },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><r.icon size={14} /></div>
                    <div><p className="text-sm font-bold text-slate-800">{r.name}</p><p className="text-[10px] text-slate-500">→ {r.dest} • {r.type}</p></div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                </div>
              ))}
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

  const renderPersonnel = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ l: 'Total Personnel', v: '1,247' }, { l: 'Active Today', v: '892' }, { l: 'On Leave', v: '45' }, { l: 'New This Month', v: '28' }].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className="text-2xl font-black text-slate-800">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Users size={16} /> Personnel Directory</h3></div>
        <div className="divide-y divide-slate-100">
          {[
            { name: 'Shantell Robinson', role: 'Founder & CEO', dept: 'Executive', status: 'Active' },
            { name: 'Monica Green', role: 'Compliance Director', dept: 'Compliance', status: 'Active' },
            { name: 'Ryan Ferrari', role: 'CEO / IT Lead', dept: 'Operations', status: 'Active' },
            { name: 'Larry AI', role: 'Compliance Service Officer', dept: 'AI Systems', status: 'Online' },
            { name: 'Sylara AI', role: 'Intake & HR Agent', dept: 'AI Systems', status: 'Online' },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Users size={14} /></div>
                <div><p className="text-sm font-bold text-slate-800">{p.name}</p><p className="text-xs text-slate-500">{p.role} • {p.dept}</p></div>
              </div>
              <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'call_center': return renderCallCenter();
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

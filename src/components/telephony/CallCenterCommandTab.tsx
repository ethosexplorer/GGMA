import React, { useState, useEffect } from 'react';
import { Phone, PhoneCall, PhoneOutgoing, UserPlus, Shield, Globe, Activity, Download, Zap, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { voip800 } from '../../lib/voip800';

export const CallCenterCommandTab = () => {
  const [liveQueue, setLiveQueue] = useState(0);
  const [routingTab, setRoutingTab] = useState('routing');
  const [agentStatus, setAgentStatus] = useState('Ready');
  const [isConnected, setIsConnected] = useState(false);
  
  const [showForward, setShowForward] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [forwardTarget, setForwardTarget] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  
  const [routingRules, setRoutingRules] = useState([
    { name: 'Main - Live Agent', dest: 'Live via WebRTC', type: 'Standard', icon: UserPlus, active: true },
    { name: 'Overflow - Support', dest: 'Support Desk', type: 'Sequential', icon: PhoneOutgoing, active: true },
    { name: 'After Hours - VM', dest: 'VM Box #1', type: 'Scheduled', icon: PhoneCall, active: true },
  ]);

  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [voicemails, setVoicemails] = useState<any[]>([]);
  const [dialNumber, setDialNumber] = useState('');

  useEffect(() => {
    setIsConnected(voip800.isConfigured());
    // Initial fetch
    voip800.getCallHistory(10).then(setRecentCalls);
    voip800.getQueueCount().then(setLiveQueue);
    voip800.getVoicemails().then(setVoicemails);

    const iv = setInterval(() => {
      voip800.getCallHistory(10).then(setRecentCalls);
      voip800.getQueueCount().then(setLiveQueue);
      voip800.getVoicemails().then(setVoicemails);
    }, 10000);
    return () => clearInterval(iv);
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
                        <p className="text-[10px] text-slate-500">{new Date(vm.time).toLocaleString()}</p>
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

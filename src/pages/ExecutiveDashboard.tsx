import React, { useState } from 'react';
import { 
  Activity, Users, Building2, Briefcase, Scale,
  FileText, FileCheck, Gavel, MonitorPlay, MessageSquare,
  BarChart3, FolderLock, Settings, Shield, Cpu,
  HeartPulse, ArrowUpRight, Wallet, Map, Globe,
  AlertCircle, Database, Lock, LogOut, CheckCircle, Search, Clock, Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { EXECUTIVE_KNOWLEDGE } from '../executiveKnowledge';

// Common Button Component
const Button = ({ children, className, icon: Icon, variant, disabled, ...props }: any) => (
  <button 
    disabled={disabled} 
    className={cn(
      "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all disabled:opacity-50", 
      variant === "outline" ? "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50" : 
      variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" :
      "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg",
      className
    )} 
    {...props}
  >
    {Icon && <Icon size={16} />} {children}
  </button>
);

const NAV_ITEMS = [
  { section: 'MAIN' },
  { id: 'overview', label: 'Global Overview', icon: Globe },
  { section: 'FINANCIAL' },
  { id: 'financial_command', label: 'Financial Command', icon: BarChart3 },
  { id: 'credit_engine', label: 'Credit Engine (Core)', icon: Wallet },
  { section: 'OPERATIONS' },
  { id: 'ecosystem', label: 'Ecosystem Activity', icon: Users },
  { id: 'compliance_command', label: 'Compliance Command', icon: Shield },
  { id: 'enforcement_intel', label: 'Enforcement Intel', icon: Gavel, dot: true },
  { section: 'GOVERNMENT' },
  { id: 'state_monitor', label: 'State Monitoring', icon: Map },
  { id: 'federal_view', label: 'Federal View', icon: Building2 },
  { section: 'INTELLIGENCE & AI' },
  { id: 'ai_control', label: 'AI Control Panel', icon: Cpu },
  { id: 'analytics', label: 'Analytics & Intel', icon: Activity },
  { section: 'CORE SYSTEM' },
  { id: 'audit_logs', label: 'Audit & Logs', icon: FileText },
  { id: 'system_control', label: 'System Control', icon: Settings },
  { id: 'alert_center', label: 'Alert Center', icon: AlertCircle, badge: '14' },
];

export const ExecutiveDashboard = ({ onLogout, user }: any) => {
  const [activeTab, setActiveTab] = useState('overview');

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Good morning Shantell. I am your private Executive AI (Sylara/Larry loop). I have securely ingested your strategic data: M&A Valuations, Pharma Expansion Models, White-Label ROI, and Security comparisons. How can I assist you today?' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgs = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newMsgs);
    setChatInput('');

    setTimeout(() => {
      let response = "I've analyzed your request.";
      const query = chatInput.toLowerCase();
      
      if (query.includes('valuation') || query.includes('buyout') || query.includes('sell')) {
        response = "Based on our current traction ($1.8M-$3M ARR), a base case buyout valuation is $15M-$36M. However, with pharma synergies or large MSO contracts, an aggressive strategic buyer could value us at $75M-$150M+. I recommend a hybrid structure: 70% cash at close, 30% earn-out over 3 years.";
      } else if (query.includes('pharma')) {
        response = "Pharma expansion is our largest multiplier. Phase 1 targets specialty pharmacies as a beachhead. By Year 4-5, successful pharma penetration could drive our total revenue to $60M-$80M+, uplifting our valuation potential to $400M-$1B+. The unified data lake perfectly solves their PDMP and HIPAA fragmentation.";
      } else if (query.includes('white label') || query.includes('roi')) {
        response = "For white-label partners, we recommend a hybrid model: $150K-$750K upfront setup, a fixed annual license, and 20-35% revenue share. A typical 100-location partner achieves a 4.5x-7x ROI over 3 years, breaking even around month 8. We retain 100% IP ownership while they scale our infrastructure.";
      } else if (query.includes('fintech') || query.includes('banking') || query.includes('security')) {
        response = "Unlike traditional fintech or banking systems that rely on vulnerable third-party APIs (causing 35% of breaches), GGP-OS is a unified backbone. We score a 9.8/10 on security compared to fintech's 7.1/10. Our immutable audit trails and real-time Larry enforcement are unmatched.";
      } else {
        response = "I have logged this inquiry. I am cross-referencing your private M&A and strategic knowledge base. Let me know if you want to drill down into Valuation, Pharma Expansion, Deals Structures, or White-Label economics.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
    }, 1000);
  };

  const renderModulePlaceholder = (title: string, desc: string, icon: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-indigo-100">
        {React.createElement(icon, { size: 40 })}
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-3">{title}</h2>
      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{desc}</p>
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold text-left w-full flex gap-3">
        <Lock className="shrink-0" size={16} />
        <p>This module has full Executive Founder permissions. Actions taken here immediately affect the global system.</p>
      </div>
      <Button onClick={() => setActiveTab('overview')} className="mt-8 px-6 py-3">Return to Global Overview</Button>
    </motion.div>
  );

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* KPIs — Full Financial Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Active Users', value: '1.2M', sub: '+8.4% this month', color: 'text-slate-800', border: 'border-slate-200' },
          { label: 'Total Revenue (MRR)', value: '$4.2M', sub: '+12.1% this month', color: 'text-indigo-600', border: 'border-indigo-200' },
          { label: 'Active Businesses', value: '412', sub: '+2.1% this month', color: 'text-slate-800', border: 'border-slate-200' },
          { label: 'Anomalies Flagged', value: '14', sub: 'Requires immediate review', color: 'text-red-600', border: 'border-red-200' },
        ].map((kpi, i) => (
          <div key={i} className={cn("bg-white border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow", kpi.border)}>
            <p className={cn("text-xs font-bold uppercase tracking-wider mb-2", kpi.color === 'text-slate-800' ? 'text-slate-500' : kpi.color)}>{kpi.label}</p>
            <h3 className={cn("text-3xl font-black", kpi.color)}>{kpi.value}</h3>
            <p className={cn("text-xs mt-2 font-medium", kpi.color === 'text-slate-800' ? 'text-emerald-600' : kpi.color)}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart Placeholder */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800">Global Revenue vs Compliance Score</h3>
                <p className="text-sm text-slate-500">Live trajectory across all 8 revenue streams</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none">
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>Year to Date</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[40, 55, 45, 70, 65, 80, 95].map((h, i) => (
                <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group">
                  <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                  <div className="absolute bottom-0 w-full bg-emerald-400 rounded-t-lg transition-all duration-500 opacity-50" style={{ height: `${h * 0.8}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span className="text-xs font-bold text-slate-600">Total Revenue</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-xs font-bold text-slate-600">Green River Score (92/100)</span></div>
            </div>
          </div>

          {/* Licensing & Override Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Priority Executive Queue</h3>
              <Button variant="outline" icon={Settings}>Configure Triage</Button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { id: 'APP-9921', type: 'Business Override', applicant: 'Apex Health LLC', status: 'Compliance Locked', time: '10 mins ago', risk: 'High' },
                { id: 'APP-9920', type: 'Credit Line Auth', applicant: 'Green Leaf Co', status: 'Pending Approval', time: '1 hour ago', risk: 'Medium' },
                { id: 'SYS-001', type: 'System Protocol', applicant: 'Larry C.', status: 'State Rules Updated', time: '3 hours ago', risk: 'Low' },
                { id: 'APP-9918', type: 'Partner API Key', applicant: 'Checkr Inc', status: 'Pending Key Gen', time: '5 hours ago', risk: 'Low' },
              ].map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-slate-500">{item.id}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">{item.type}</span>
                      {item.risk === 'High' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">High Risk</span>}
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{item.applicant}</p>
                    <p className="text-xs text-slate-500">{item.status} • {item.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700">Review</button>
                    {item.risk === 'High' && <button className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200">Force Override</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Executive AI Assistant */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-slate-700 text-white relative overflow-hidden flex flex-col" style={{ height: '400px' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="p-6 pb-4 border-b border-slate-700 relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                  <MonitorPlay size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Sylara Executive (Private)</h3>
                  <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span> M&A / Pharma / Strategy Loaded
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 custom-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl p-3 text-sm",
                    msg.role === 'user' 
                      ? "bg-indigo-600 text-white rounded-br-none" 
                      : "bg-slate-700/50 border border-slate-600 text-slate-200 rounded-bl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-slate-800/80 border-t border-slate-700 shrink-0 relative z-10">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about valuation, pharma expansion, white-label ROI..." 
                  className="w-full bg-slate-900 border border-slate-600 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  <MessageSquare size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Immutable Audit Log */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Immutable Audit Log</h3>
              <Search size={14} className="text-slate-400" />
            </div>
            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
              {[
                { time: '10:45 AM', action: 'Missing POS Sync (flagged)', entity: 'Uptown Dispensary', color: 'text-amber-500' },
                { time: '09:30 AM', action: 'User Password Reset', entity: 'System', color: 'text-slate-500' },
                { time: '08:15 AM', action: 'Metrc Sync Completed', entity: 'Apex Health LLC', color: 'text-emerald-500' },
                { time: '07:00 AM', action: 'Volume Anomaly (flagged)', entity: 'Green Leaf Co', color: 'text-red-500' },
                { time: '06:12 AM', action: 'Executive Override Applied', entity: 'Admin: Shantell', color: 'text-indigo-500' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1"><Clock size={12} className={log.color} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{log.action}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{log.time} • {log.entity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <button className="text-xs font-bold text-indigo-600 hover:underline">View Full Log Vault</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              G
            </div>
            <span className="font-black text-xl text-white tracking-tight">GGP-OS</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-slate-800 shadow-inner flex items-center justify-center text-white font-bold">
              SJ
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Sarah Jenkins</p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">God View • Founder</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item, index) => {
            if (item.section) {
              return (
                <div key={index} className="pt-4 pb-1 px-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.section}</span>
                </div>
              );
            }
            
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as string)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={cn("transition-colors", isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-indigo-400")} />
                  <span className={isActive ? "font-bold" : ""}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full", isActive ? "bg-white text-indigo-600" : "bg-slate-700 text-slate-300")}>
                    {item.badge}
                  </span>
                )}
                {item.dot && !item.badge && (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2 rounded-xl hover:bg-slate-800 text-sm font-medium">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/5 to-transparent pointer-events-none"></div>
        
        {/* Top Header */}
        <header className="h-16 px-8 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Executive Command Center</h1>
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Live</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500">
              <option>All Active States</option>
              <option>Oklahoma</option>
              <option>California</option>
            </select>
            <Button variant="outline" icon={FileText}>Export Executive Report</Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'financial_command' && renderModulePlaceholder('Financial Command', 'Total Wallet Balances, Revenue Streams, Processing volume (Kurv), Network reserves, and Cash flow tracking.', BarChart3)}
            {activeTab === 'credit_engine' && renderModulePlaceholder('Credit Engine (Core)', 'Patient/Business balances, Network reserve, Virtual card activity, and Credit activation pipeline.', Wallet)}
            {activeTab === 'ecosystem' && renderModulePlaceholder('Ecosystem Activity', 'Global view of Patients, Businesses, Providers, Attorneys, and Backoffice clients.', Users)}
            {activeTab === 'compliance_command' && renderModulePlaceholder('Compliance Command', 'Global compliance status, Violations by type, High-risk entities, and State-by-state compliance.', Shield)}
            {activeTab === 'enforcement_intel' && renderModulePlaceholder('Enforcement Intelligence', 'Real-time flags, Active violations, Enforcement actions, and Rapid testing triggers.', Gavel)}
            {activeTab === 'state_monitor' && renderModulePlaceholder('State Monitoring', 'Per-state performance, Licensing volume, Compliance rates, and Revenue by state.', Map)}
            {activeTab === 'federal_view' && renderModulePlaceholder('Federal View', 'Cross-state activity, National trends, and Risk patterns.', Building2)}
            {activeTab === 'ai_control' && renderModulePlaceholder('AI Control Panel', 'Sylara activity, Larry enforcement logs, AI decisions, and Override controls.', Cpu)}
            {activeTab === 'analytics' && renderModulePlaceholder('Analytics & Intelligence', 'Growth metrics, User behavior, Revenue projections, and Risk forecasting.', Activity)}
            {activeTab === 'audit_logs' && renderModulePlaceholder('Audit & Logs', 'Immutable audit trail of every action. User + system actions.', FileText)}
            {activeTab === 'system_control' && renderModulePlaceholder('System Control', 'Feature toggles, Permissions, Access control, and System configuration.', Settings)}
            {activeTab === 'alert_center' && renderModulePlaceholder('Alert Center', 'High-risk alerts, Financial anomalies, Compliance breaches, and System errors.', AlertCircle)}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

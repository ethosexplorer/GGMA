import React, { useState } from 'react';
import { 
  Building2, Users, FileText, Settings, Shield, Activity, Bell,
  BarChart3, Folder, TrendingUp, CheckCircle2, ChevronRight, Bot,
  CreditCard, MessageSquare, AlertTriangle, Upload, Clock, Eye, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const EXT_NAV = [
  { id: 'overview', label: 'Dashboard Overview', icon: Activity },
  { id: 'account', label: 'My Account / Organization', icon: Building2 },
  { id: 'compliance', label: 'Compliance Status', icon: Shield },
  { id: 'applications', label: 'Applications / Requests', icon: FileText },
  { id: 'payments', label: 'Transactions / Payments', icon: CreditCard },
  { id: 'wallet', label: 'Care Wallet', icon: CreditCard },
  { id: 'documents', label: 'Documents & Uploads', icon: Folder },
  { id: 'support', label: 'Support Center', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const AUDIT_LOG = [
  { time: 'Apr 19, 09:12 AM', actor: 'Sylara AI', action: 'Auto-reconciled inventory batch #4928', status: 'Success' },
  { time: 'Apr 19, 08:45 AM', actor: 'Larry Engine', action: 'Flagged discrepancy in Westside Hub sales data', status: 'Escalated' },
  { time: 'Apr 18, 04:30 PM', actor: 'Sarah T. (Admin)', action: 'Approved new patient application #8821', status: 'Success' },
  { time: 'Apr 18, 02:15 PM', actor: 'Sylara AI', action: 'Updated staff schedule for North Clinic', status: 'Success' },
];

const QUEUE = [
  { title: 'Staff Badge Renewal', sub: 'M. Johnson (Budtender)', status: 'Pending', color: 'amber' },
  { title: 'Facility Inspection Upload', sub: 'North Clinic Q3', status: 'Review', color: 'blue' },
  { title: 'License Renewal #LR-4421', sub: 'Westside Hub Annual', status: 'Approved', color: 'emerald' },
];

export const ExternalAdminDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const entityName = user?.entityName || 'Apex Health LLC';
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Sylara Greeting */}
      <div className="bg-emerald-50 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-emerald-100 shrink-0">
            <Bot size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-800">Sylara AI Assistant</h3>
            <p className="text-sm text-emerald-700">"Welcome back to {entityName} Admin — part of the Global Green Hybrid Platform (GGHP). You have 3 pending renewals and 1 anomaly at Westside Hub. Would you like me to prepare them or escalate to Executive review?"</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-50">Prepare Tasks</button>
          <button className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-700 flex items-center gap-1"><Shield size={12}/> Request Executive Review</button>
        </div>
      </div>

      {/* KPIs (Scoped to Entity) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Patients</p>
          <h3 className="text-3xl font-black text-slate-800">1,240</h3>
          <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1"><TrendingUp size={12}/> +5% this month</p>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Locations</p>
          <h3 className="text-3xl font-black text-slate-800">4</h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">All operational</p>
        </div>
        <div className="bg-white border border-red-200 p-5 rounded-2xl shadow-sm">
          <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-2">Anomalies Flagged</p>
          <h3 className="text-3xl font-black text-red-600">1</h3>
          <p className="text-xs text-red-500 mt-2 font-medium">Westside Hub Inventory</p>
        </div>
        <div className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-sm">
          <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">Compliance Score</p>
          <h3 className="text-3xl font-black text-emerald-700">98.2</h3>
          <p className="text-xs text-emerald-600 mt-2 font-medium">Green River Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm min-h-[280px] flex flex-col">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><BarChart3 size={18} className="text-emerald-500"/> Application & Renewal Trends</h3>
          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center">
            <p className="text-slate-400 font-medium">Chart: {entityName} Applications Over Time</p>
          </div>
        </div>

        {/* Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><CheckCircle2 size={18} className="text-blue-500"/> Licensing Queue</h3>
          <div className="space-y-3">
            {QUEUE.map((item, i) => (
              <div key={i} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.sub}</p>
                  </div>
                  <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full", `bg-${item.color}-50 text-${item.color}-600`)}>{item.status}</span>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mt-1">View All Queue Items <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Shield size={18} className="text-slate-500"/> Immutable Audit Log (View-Only)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs">
              <tr><th className="px-4 py-2">Timestamp</th><th className="px-4 py-2">User / AI</th><th className="px-4 py-2">Action</th><th className="px-4 py-2">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AUDIT_LOG.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{log.time}</td>
                  <td className="px-4 py-3 font-medium">{log.actor}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3"><span className={cn("font-medium", log.status === 'Success' ? "text-emerald-600" : "text-red-600")}>{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderModulePlaceholder = (title: string, desc: string, icon: any) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-[60vh]">
      <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          {React.createElement(icon, { size: 32 })}
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 text-sm mb-4">{desc}</p>
        <p className="text-xs text-slate-400 mb-6">This module is securely scoped to <span className="font-bold text-slate-600">{entityName}</span> only. Changes sync upward to the Global Green Executive Dashboard.</p>
        <button onClick={() => setActiveTab('overview')} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-900 transition-colors">Return to Dashboard</button>
      </div>
    </motion.div>
  );

  const getContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'account': return renderModulePlaceholder('My Account / Organization', 'View and manage your organization profile, locations, staff, and licensing details.', Building2);
      case 'compliance': return renderModulePlaceholder('Compliance Status', 'Pass / Fail / Flagged status for all your locations. View required actions and deadlines.', Shield);
      case 'applications': return renderModulePlaceholder('Applications / Requests', 'Track submitted applications (licenses, cards, renewals) with real-time status.', FileText);
      case 'payments': return renderModulePlaceholder('Transactions / Payments', 'View payment history, invoices, and funding records for your organization.', CreditCard);
      case 'wallet': return renderModulePlaceholder('Care Wallet', 'Your Care Wallet balance, transaction history, and funding options.', CreditCard);
      case 'documents': return renderModulePlaceholder('Documents & Uploads', 'Upload and view required documents — licenses, inspections, and compliance records.', Folder);
      case 'support': return renderModulePlaceholder('Support Center', 'Chat with Sylara AI or submit support tickets. View your ticket history.', MessageSquare);
      case 'notifications': return renderModulePlaceholder('Notifications', 'System alerts, renewal reminders, and compliance deadlines for your organization.', Bell);
      default: return renderOverview();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans relative">
      {!isUnlocked && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Lock size={48} className="text-indigo-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Restricted Access</h2>
            <p className="text-slate-500 text-sm mb-6">Enter 4-digit Oversight PIN</p>
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={(e) => {
                 setPin(e.target.value);
                 if (e.target.value === '1234') setIsUnlocked(true);
              }} 
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl p-4 text-center text-3xl font-black text-slate-800 tracking-[1em] mb-4 outline-none transition-all" 
              placeholder="••••"
            />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Authorized Personnel Only</p>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className={cn("w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0 transition-all duration-500", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Admin Dashboard</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">(GENERAL / EXTERNAL)</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600">
              <img src="https://ui-avatars.com/api/?name=Op+Manager&background=0F172A&color=fff&size=32" alt="" className="w-full h-full" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Operations Manager</p>
              <p className="text-[10px] text-slate-400">{entityName}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {EXT_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === item.id ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
              <item.icon size={16} className={cn(activeTab === item.id ? "text-emerald-400" : "")} /> {item.label}
            </button>
          ))}
        </div>
        {/* Restricted Access Notice */}
        <div className="p-3 mx-3 mb-3 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-[10px] text-slate-500 leading-relaxed"><span className="text-slate-400 font-bold">🔒 Scoped Access:</span> You can only see data for {entityName}. System-wide data, enforcement logic, and financial backend are not accessible.</p>
        </div>
      </div>

      {/* MAIN */}
      <div className={cn("flex-1 flex flex-col h-[calc(100vh)] overflow-hidden bg-slate-50 transition-all duration-500", !isUnlocked && "blur-xl scale-[0.98] opacity-50 pointer-events-none")}>
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Admin Dashboard – {entityName}</h1>
            <div className="h-4 w-px bg-slate-300" />
            <p className="text-xs text-slate-500 font-medium hidden lg:block">Oversight for your locations, licensing, and compliance only.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 text-slate-700">
              <option>All Locations ({entityName})</option>
              <option>Westside Hub</option>
              <option>North Clinic</option>
              <option>Eastside Dispensary</option>
              <option>South Processing</option>
            </select>
            <button className="relative p-2 text-slate-400 hover:text-slate-600"><Bell size={18} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{getContent()}</div>
      </div>
    </div>
  );
};


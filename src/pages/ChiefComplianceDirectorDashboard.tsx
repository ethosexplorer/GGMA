import React, { useState } from 'react';
import { 
  Shield, Activity, Users, Database, Globe, Bot, MessageSquare, Clock, HeartPulse, Building2, 
  FileCheck, BookOpen, Gavel, Zap, FlaskConical, BarChart3, LogOut, ArrowLeft, Edit2, Trash2, Plus, CircleCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { InternalMessenger } from '../components/messaging/InternalMessenger';
import { AITrainingTab } from '../components/AITrainingTab';
import { UserCalendar } from '../components/UserCalendar';
// Import existing dashboard components to render as tabs
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { ExternalAdminDashboard } from './ExternalAdminDashboard';
import { StateAuthorityDashboard } from './StateAuthorityDashboard';
import { AdminSupportCalendar } from '../components/AdminSupportCalendar';
import { EscalationSupportCalendar } from '../components/EscalationSupportCalendar';

type NavItem = { section?: string; id?: string; label?: string; icon?: any; badge?: string };

const INTERNAL_NAV_ITEMS: NavItem[] = [
  { id: '_sec_ai', section: 'ARTIFICIAL INTELLIGENCE' },
  { id: 'system_health', label: 'System Health / AI', icon: Zap },
  { id: 'hr_intelligence', label: 'HR Intelligence (Sylara)', icon: Users },
  { id: 'jurisdiction_map', label: 'Nationwide Oversight', icon: Globe },
  { id: '_sec_main', section: 'MAIN' },
  { id: 'ai_training', label: 'My Assistant & Training', icon: Bot, badge: 'AI' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 'Live' },
  { id: 'internal_scheduler', label: 'Calendar & Scheduler', icon: Clock, badge: 'New' },
  { id: 'admin_support_calendar', label: 'Admin Support', icon: Clock, badge: 'Help' },
  { id: 'escalation_support_calendar', label: 'Escalation Support', icon: Clock, badge: 'High Priority' },
  { id: '_sec_supreme', section: 'SUPREME COMMAND' },
  { id: 'patients', label: 'Registry Sovereignty', icon: HeartPulse },
  { id: 'business', label: 'Economic Infrastructure', icon: Building2 },
  { id: '_sec_ops', section: 'OPS & COMPLIANCE' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'regulatory_library', label: 'Regulatory Library', icon: BookOpen },
  { id: '_sec_oversight', section: 'OVERSIGHT HUB' },
  { id: 'internal_admin', label: 'Internal Team (GGE Call Center)', icon: Shield, badge: '!' },
  { id: 'law_enforcement', label: 'Law Enforcement (RIP)', icon: Gavel },
  { id: 'processor', label: 'GGE Processor', icon: Activity },
  { id: '_sec_federal', section: 'FEDERAL & IP MONITORS' },
  { id: 'public_health', label: 'Public Health & Labs', icon: FlaskConical },
  { id: 'rapid_testing', label: 'Rapid Testing Hub', icon: FlaskConical },
  { id: '_sec_system', section: 'SYSTEM CONTROL' },
  { id: 'reports', label: 'Master Analytics', icon: BarChart3 },
  { id: 'intel', label: 'Global Intelligence', icon: BookOpen },
];

const ChiefComplianceDirectorDashboard = ({ user, onLogout }: { user?: any, onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState('system_health');

  // Draggable nav state with localStorage persistence
  const [navItems, setNavItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gghp_compliance_nav_order');
      if (saved) {
        const savedIds = JSON.parse(saved) as string[];
        const idToItem = new Map(INTERNAL_NAV_ITEMS.map((item, i) => [item.id || `sec_${i}`, item]));
        const ordered = savedIds.map(id => idToItem.get(id)).filter(Boolean) as typeof INTERNAL_NAV_ITEMS;
        INTERNAL_NAV_ITEMS.forEach((item, i) => { const key = item.id || `sec_${i}`; if (!savedIds.includes(key)) ordered.push(item); });
        return ordered;
      }
    } catch {}
    return [...INTERNAL_NAV_ITEMS];
  });
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = (e: any, idx: number) => { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e: any, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const items = [...navItems];
    const item = items[dragIdx];
    items.splice(dragIdx, 1);
    items.splice(idx, 0, item);
    setDragIdx(idx);
    setNavItems(items);
    localStorage.setItem('gghp_compliance_nav_order', JSON.stringify(items.map((it, i) => it.id || `sec_${i}`)));
  };

  const fullName = user?.displayName || user?.email?.split('@')[0] || 'Chief Compliance Director';
  const title = "Chief Compliance Director";

  return (
    <div className="flex h-screen bg-[#0A0F1C] overflow-hidden text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0F1C] border-r border-slate-800 flex flex-col h-full shrink-0 relative z-20 shadow-2xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50 bg-[#0A0F1C] shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/50 text-emerald-400 font-bold">
              {fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">{fullName}</h2>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest">{title}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-1">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <div 
                  key={item.id || `sec_${idx}`} 
                  draggable={isEditingNav}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={() => setDragIdx(null)}
                  className={cn("pt-6 pb-2 px-3 group relative flex items-center justify-between transition-colors", isEditingNav && "cursor-grab active:cursor-grabbing hover:bg-white/5 border border-dashed border-slate-700 rounded-lg mt-2")}
                >
                  <div className="flex items-center">
                    {isEditingNav && <span className="text-slate-600 mr-2">⠿</span>}
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.section}</p>
                  </div>
                  {isEditingNav && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleEditSection(e, idx)} className="p-1 hover:text-white text-slate-400"><Edit2 size={12} /></button>
                      <button onClick={(e) => handleDeleteItem(e, idx)} className="p-1 hover:text-red-400 text-slate-400"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              );
            }
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className={cn("relative group flex items-center", isEditingNav && "border border-dashed border-slate-800 rounded-xl mb-1")}>
                <button
                  draggable={isEditingNav}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={() => setDragIdx(null)}
                  onClick={() => !isEditingNav && setActiveTab(item.id!)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                    isEditingNav && "cursor-grab active:cursor-grabbing opacity-80",
                    isActive && !isEditingNav
                      ? "bg-emerald-600/10 text-emerald-400 shadow-lg shadow-emerald-900/20 border border-emerald-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isEditingNav && <span className="text-slate-600">⠿</span>}
                    <Icon size={18} className={cn(isActive && !isEditingNav ? "text-emerald-400" : "text-slate-500")} />
                    {item.label}
                  </div>
                  {item.badge && !isEditingNav && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                      item.badge === 'Live' ? 'bg-blue-500 text-white' :
                      item.badge === 'New' ? 'bg-emerald-500 text-white' :
                      item.badge === 'High Priority' ? 'bg-red-500 text-white' :
                      item.badge === 'AI' ? 'bg-indigo-500 text-white' :
                      'bg-slate-700 text-slate-300'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
                {isEditingNav && (
                  <button onClick={(e) => handleDeleteItem(e, idx)} className="absolute right-2 p-1.5 bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0A0F1C] sticky bottom-0 shrink-0 space-y-2">
          <button 
            onClick={() => {
              if (isEditingNav) { setIsEditingNav(false); }
              else { setIsEditingNav(true); }
            }}
            className={cn("w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border", isEditingNav ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500" : "bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white")}
          >
            {isEditingNav ? <CircleCheck size={14} /> : <Edit2 size={14} />} {isEditingNav ? 'Done Editing' : 'Edit Layout'}
          </button>
          {isEditingNav && (
            <button onClick={handleAddSection} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700">
              <Plus size={14} /> Add Section
            </button>
          )}
          
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0F1C] relative">
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-800/50 bg-[#0A0F1C]/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={onLogout} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 mr-2">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-xl font-black text-white capitalize tracking-wide">
                  {INTERNAL_NAV_ITEMS.find(i => i.id === activeTab)?.label}
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{title} View</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
               <Bot size={12} /> Larry AI Online
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#0A0F1C] p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-[1600px] mx-auto h-full"
              >
                {/* TEMPORARY FALLBACKS UNTIL TABS ARE MOVED/IMPORTED */}
                {activeTab === 'system_health' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Zap size={40} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">System Health / AI</h2><p className="text-slate-400">Real-time proactive monitoring & automated resolution engine.</p></div>}
                
                {activeTab === 'hr_intelligence' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Users size={40} className="mx-auto text-blue-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">HR Intelligence Hub</h2><p className="text-slate-400">Corporate Structure & Departments managed by Larry AI.</p></div>}
                
                {activeTab === 'jurisdiction_map' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Globe size={40} className="mx-auto text-indigo-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Nationwide Jurisdiction Oversight</h2><p className="text-slate-400">Live deployment status and compliance health across the United States.</p></div>}
                
                {activeTab === 'ai_training' && <AITrainingTab />}
                {activeTab === 'messages' && <InternalMessenger currentUser={{ id: user?.uid || '1', name: fullName, role: title, avatar: null }} />}
                {activeTab === 'internal_scheduler' && <div className="bg-white rounded-3xl overflow-hidden h-full"><UserCalendar user={user} isGodView={false} /></div>}
                {activeTab === 'admin_support_calendar' && <div className="bg-white rounded-3xl overflow-hidden h-full"><AdminSupportCalendar /></div>}
                {activeTab === 'escalation_support_calendar' && <div className="bg-white rounded-3xl overflow-hidden h-full"><EscalationSupportCalendar /></div>}
                
                {activeTab === 'patients' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><HeartPulse size={40} className="mx-auto text-pink-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Registry Sovereignty</h2><p className="text-slate-400">Unified citizen oversight and state-level registration reciprocities.</p></div>}
                {activeTab === 'business' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Building2 size={40} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Economic Infrastructure</h2><p className="text-slate-400">Commercial force monitoring across all sectors.</p></div>}
                
                {activeTab === 'compliance' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><FileCheck size={40} className="mx-auto text-amber-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Compliance Monitor</h2><p className="text-slate-400">Real-time predictive anomaly detection.</p></div>}
                {activeTab === 'regulatory_library' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><BookOpen size={40} className="mx-auto text-slate-300 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Regulatory Intelligence Hub</h2><p className="text-slate-400">Standard operating procedures and statutes.</p></div>}
                
                {activeTab === 'internal_admin' && <div className="bg-white rounded-3xl overflow-hidden h-full"><ExternalAdminDashboard /></div>}
                {activeTab === 'law_enforcement' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Gavel size={40} className="mx-auto text-blue-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Law Enforcement Oversight</h2><p className="text-slate-400">Real-time dispatch, field screening & evidentiary blockchain.</p></div>}
                
                {activeTab === 'processor' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Activity size={40} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">GGE Processor Master Command</h2><p className="text-slate-400">Real-time oversight of the standalone private settlement rail.</p></div>}
                
                {activeTab === 'public_health' && <div className="bg-white rounded-3xl overflow-hidden h-full"><PublicHealthDashboard onLogout={onLogout} user={user} /></div>}
                {activeTab === 'rapid_testing' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><FlaskConical size={40} className="mx-auto text-purple-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Rapid Testing Command</h2><p className="text-slate-400">National laboratory infrastructure monitoring.</p></div>}
                
                {activeTab === 'reports' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><BarChart3 size={40} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Master Analytics Intelligence</h2><p className="text-slate-400">Predictive revenue, market saturation, and growth vectors.</p></div>}
                {activeTab === 'intel' && <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50"><Globe size={40} className="mx-auto text-blue-500 mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Legislative Intelligence Command</h2><p className="text-slate-400">Curated primary sources and real-time state legislative tracking.</p></div>}

              </motion.div>
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
export { ChiefComplianceDirectorDashboard };

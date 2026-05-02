import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Bot, FileText, Settings, Shield, Activity, 
  Clock, HeartPulse, Gavel, FileCheck, Zap, MonitorPlay, MessageSquare, 
  Cpu, Headphones, BookOpen, GraduationCap, Scale, Briefcase
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CallCenterCommandTab } from '../components/telephony/CallCenterCommandTab';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { AdminSupportCalendar } from '../components/AdminSupportCalendar';

const NAV_ITEMS = [
  { section: 'THE ACADEMY' },
  { id: 'academy_ai', label: 'AI Teacher & Training', icon: GraduationCap, badge: 'New' },
  
  { section: 'LIVE OPERATIONS' },
  { id: 'ops_livecenter', label: 'Ops LiveCenter', icon: Headphones, badge: 'Live' },
  { id: 'internal_admin', label: 'Internal Admin Ops', icon: Shield },
  { id: 'gge_processor', label: 'GGE Processor', icon: Cpu },
  
  { section: 'HR & PERSONNEL' },
  { id: 'hr_intelligence', label: 'HR Intelligence Hub', icon: Users },
  { id: 'applications_queue', label: 'Applications Queue', icon: FileText, badge: '502' },

  { section: 'SUPPORT & DIAGNOSTICS' },
  { id: 'admin_support', label: 'Admin Support Calendar', icon: Clock },
  { id: 'support_tickets', label: 'Support Tickets', icon: MessageSquare, badge: '12' },
  { id: 'it_diagnostics', label: 'IT Support & Diagnostics', icon: MonitorPlay },
  { id: 'ai_guardian', label: 'AI System Guardian', icon: Bot },
];

export const GGEWorldHRHub = ({ user }: { user?: any }) => {
  const [activeTab, setActiveTab] = useState('academy_ai');

  const renderAIAcademy = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><GraduationCap size={200} /></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Bot className="text-emerald-400" size={32} /> The Academy: AI Teacher
          </h2>
          <p className="text-emerald-100/70 text-lg mb-6 leading-relaxed">
            Intelligent onboarding and compliance training for all reps, admins, and personnel. The AI is pre-loaded with federal HR compliance laws, state-specific operational rules, and W2/1099 structures.
          </p>
          <div className="flex gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
              Start New Trainee
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-md">
              View Curriculum Library
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Scale className="text-blue-500" /> HR Compliance Memory (AI)
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { t: 'W2 vs 1099 Classification', d: 'AI-guided test on contractor vs employee laws.', s: 'Active' },
              { t: 'State Licensing Rules', d: 'Jurisdiction-specific regulations for services.', s: 'Active' },
              { t: 'Federal/State HR Compliance', d: 'Mandatory workplace protocols and safety.', s: 'Required' }
            ].map((i, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex justify-between items-center hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{i.t}</p>
                  <p className="text-xs text-slate-500">{i.d}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">{i.s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Briefcase className="text-purple-500" /> Role & Duty Assignments
            </h3>
            <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">+ Add Role</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-slate-300 transition-colors cursor-pointer">
              <p className="text-sm font-bold text-slate-600 mb-1">Define Title, Department & Duties</p>
              <p className="text-xs text-slate-400 mb-4">AI Teacher will automatically generate the training track.</p>
              <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors">Configure Tracks</button>
            </div>
            
            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
              <p className="font-bold text-slate-800 text-sm mb-2">Example Track: Medical Dispatcher</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md">Dept: Medical</span>
                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md">Title: Agent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, desc: string, Icon: any, color: string = 'text-slate-400') => (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="text-center space-y-4 max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon size={40} className={color} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
        <p className="text-slate-500 font-medium">{desc}</p>
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-8 bg-indigo-50 py-2 rounded-lg">Consolidated Module Preview</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden -m-10">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-xl shadow-slate-200/20">
        <div className="p-6 border-b border-slate-100 bg-slate-900">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-black tracking-tight leading-tight uppercase">GGE World</h2>
              <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">HR & Training Hub</h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-3">Master Oversight Sandbox</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx} className="pt-6 pb-2 px-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.section}</p>
                </div>
              );
            }
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id!)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-left",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 font-bold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon size={18} className={cn(isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600 transition-colors")} />}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                    isActive ? "bg-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-500"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Master Oversight Command</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">Sandbox Preview Mode</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1600px] mx-auto h-full"
            >
              {activeTab === 'academy_ai' && renderAIAcademy()}
              
              {activeTab === 'ops_livecenter' && <div className="h-full"><CallCenterCommandTab /></div>}
              
              {activeTab === 'hr_intelligence' && renderPlaceholder('HR Intelligence Hub', 'Manage onboarding, personnel records, and department assignments.', Users, 'text-blue-500')}
              {activeTab === 'applications_queue' && renderPlaceholder('Applications Queue', 'Review patient, business, and licensing applications.', FileText, 'text-amber-500')}
              
              {activeTab === 'internal_admin' && renderPlaceholder('Internal Admin Ops', 'Manage internal permissions, roles, and system access.', Shield, 'text-indigo-500')}
              {activeTab === 'gge_processor' && renderPlaceholder('GGE Processor', 'Real-time oversight of the standalone private settlement rail.', Cpu, 'text-purple-500')}
              
              {activeTab === 'admin_support' && <div className="bg-white rounded-3xl h-full overflow-hidden shadow-sm border border-slate-100 p-6"><AdminSupportCalendar /></div>}
              {activeTab === 'support_tickets' && renderPlaceholder('Support Tickets', 'Manage and escalate internal and external support tickets.', MessageSquare, 'text-emerald-500')}
              {activeTab === 'it_diagnostics' && <div className="bg-white rounded-3xl h-full overflow-hidden shadow-sm border border-slate-100 p-6"><ITSupportDashboard /></div>}
              {activeTab === 'ai_guardian' && renderPlaceholder('AI System Guardian', 'Predictive security monitoring and automated anomaly resolution.', Bot, 'text-rose-500')}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

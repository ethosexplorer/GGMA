import React, { useState } from 'react';
import { Calendar, Building2, PhoneCall, Calendar as CalendarIcon, Server, Users,
  Map as MapIcon, Bot, Activity, HelpCircle, FileText, CheckCircle2,
  TrendingUp, Search, Bell, Shield, Plus, Clock, Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { MasterAddOnsList } from '../components/shared/MasterAddOnsList';
import { UserCalendar } from '../components/UserCalendar';

export const BackOfficeDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('core');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">Back Office</h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Operations Support</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <button onClick={() => setActiveTab('core')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'core' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Activity size={16} className={cn(activeTab === 'core' ? "text-blue-400" : "")} /> Core Operations
          </button>
          <button onClick={() => setActiveTab('callcenter')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'callcenter' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <PhoneCall size={16} className={cn(activeTab === 'callcenter' ? "text-blue-400" : "")} /> Call Center & Reception
          </button>
          <button onClick={() => setActiveTab('scheduling')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'scheduling' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <CalendarIcon size={16} className={cn(activeTab === 'scheduling' ? "text-blue-400" : "")} /> Appointments Engine
          </button>
          <button onClick={() => setActiveTab('itsupport')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'itsupport' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Server size={16} className={cn(activeTab === 'itsupport' ? "text-blue-400" : "")} /> IT Support & Tickets
          </button>
          <button onClick={() => setActiveTab('crm')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'crm' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Users size={16} className={cn(activeTab === 'crm' ? "text-blue-400" : "")} /> Client CRM
          </button>
          <button onClick={() => setActiveTab('multiloc')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'multiloc' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Globe size={16} className={cn(activeTab === 'multiloc' ? "text-blue-400" : "")} /> Multi-Location
          </button>

          <div className="my-3 border-t border-slate-800"></div>

          <button onClick={() => setActiveTab('sylara')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left border", activeTab === 'sylara' ? "bg-indigo-900/40 text-indigo-300 border-indigo-500/50 shadow-md" : "bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800")}>
            <span className="flex items-center gap-3"><Bot size={16} className="text-indigo-400" /> AI Guidance (Sylara)</span>
          </button>
          
          <button onClick={() => setActiveTab('analytics')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left border", activeTab === 'analytics' ? "bg-slate-800 text-white border-slate-600 shadow-md" : "bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800")}>
            <span className="flex items-center gap-3"><TrendingUp size={16} className="text-slate-400" /> Advanced Analytics</span>
          </button>

          <button onClick={() => setActiveTab('addons')} className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left border mt-2", activeTab === 'addons' ? "bg-emerald-900/40 text-emerald-300 border-emerald-500/50 shadow-md" : "bg-slate-900 text-emerald-500/70 border-transparent hover:bg-slate-800")}>
            <span className="flex items-center gap-3"><Shield size={16} className="text-emerald-500" /> Master Add-Ons List</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
        
        {/* HEADER */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Operations Support Hub</h1>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Enterprise Tier • 85% AI Automated</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
               <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=Support+Admin&background=0D8ABC&color=fff" alt="Admin" className="w-full h-full" />
               </div>
               <div className="hidden lg:block">
                 <p className="text-xs font-bold text-slate-800">Support Operations</p>
                 <p className="text-[10px] text-slate-500">Global Green Enterprise</p>
               </div>
            </div>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Core Operations Tab */}
          {activeTab === 'core' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Today's Appointments</p>
                    <CalendarIcon size={16} className="text-blue-500"/>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800">142</h3>
                  <p className="text-xs text-slate-400 mt-2">12 pending confirmations</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Tickets</p>
                    <Server size={16} className="text-amber-500"/>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800">28</h3>
                  <p className="text-xs text-amber-600 mt-2 font-medium">4 requiring escalation</p>
                </div>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Call Volume</p>
                    <PhoneCall size={16} className="text-emerald-500"/>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800">894</h3>
                  <p className="text-xs text-emerald-600 mt-2 font-medium">Avg wait time: 42s</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider">AI Resolution Rate</p>
                    <Bot size={16} className="text-indigo-500"/>
                  </div>
                  <h3 className="text-3xl font-black text-indigo-700">85%</h3>
                  <p className="text-xs text-indigo-500/80 mt-2 font-medium">Handled by Virtual Attendant</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Task Stream */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-500"/> Priority Task Stream</h3>
                    <button className="text-sm font-bold text-blue-600 hover:underline">View All Tasks</button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <PhoneCall size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">Escalated Call: Compliance Audit</p>
                          <p className="text-xs text-slate-500">Caller requires human review for Q3 compliance filing.</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50">Handle</button>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <CalendarIcon size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">Reschedule Conflict: Dr. Mercer</p>
                          <p className="text-xs text-slate-500">Virtual Attendant could not automatically resolve double-booking.</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50">Resolve</button>
                    </div>

                    <div className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <Server size={14} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">POS Hardware Issue - Tulsa Branch</p>
                          <p className="text-xs text-slate-500">Terminal 3 is offline. Remote reboot failed.</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50">Ticket</button>
                    </div>
                  </div>
                </div>

                {/* Sylara Assistant Widget */}
                <div className="bg-indigo-900 bg-gradient-to-b from-indigo-900 to-slate-900 border border-indigo-800 rounded-2xl p-5 shadow-lg text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot size={20} className="text-indigo-400" />
                    <h3 className="font-bold text-white">Sylara Operational AI</h3>
                  </div>
                  
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-indigo-500/30 mb-4">
                    <p className="text-sm text-indigo-100 leading-relaxed">
                      "I've successfully routed 142 patient calls this morning and automatically booked 38 appointments. Call volume is projected to spike at 2:00 PM; I recommend shifting 2 staff members from tickets to phones."
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors">
                      Approve Staffing Shift
                    </button>
                    <button className="w-full px-3 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-bold text-slate-300 transition-colors">
                      Review AI Chat Logs
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Master Add-Ons List Tab */}
          {activeTab === 'addons' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full -m-6">
              <MasterAddOnsList />
            </motion.div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'core' && activeTab !== 'addons' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'callcenter' && <PhoneCall size={32} />}
                  {activeTab === 'scheduling' && <CalendarIcon size={32} />}
                  {activeTab === 'itsupport' && <Server size={32} />}
                  {activeTab === 'crm' && <Users size={32} />}
                  {activeTab === 'multiloc' && <Globe size={32} />}
                  {activeTab === 'sylara' && <Bot size={32} />}
                  {activeTab === 'analytics' && <TrendingUp size={32} />}
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 capitalize">{activeTab.replace('loc', 'location').replace('it', 'IT ')} Module</h2>
                <p className="text-slate-500 text-sm mb-6">
                  This specialized back-office module is active and connected via the GGP-OS infrastructure. It handles cross-dashboard routing and AI-driven automation.
                </p>
                <button onClick={() => setActiveTab('core')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
                  Return to Core Operations
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


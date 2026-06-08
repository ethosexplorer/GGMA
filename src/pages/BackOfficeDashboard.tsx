import React, { useState } from 'react';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import { Calendar, Building2, PhoneCall, Calendar as CalendarIcon, Server, Users,
  Map as MapIcon, Bot, Activity, HelpCircle, FileText, TrendingUp, Search, Bell, Shield, Plus, Clock, Globe, CircleCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { MasterAddOnsList } from '../components/shared/MasterAddOnsList';
import { UserCalendar } from '../components/UserCalendar';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

export const BackOfficeDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('core');

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-800 font-sans">
      {/* TOP NAVIGATION BAR */}
      <div className="bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="font-bold text-xs text-white leading-tight">Back Office</h2>
              <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider">Operations Support</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700 shrink-0" />
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 min-w-max">
              {[
                { id: 'core', label: 'Core Operations', icon: Activity },
                { id: 'callcenter', label: 'Call Center', icon: PhoneCall },
                { id: 'scheduling', label: 'Appointments', icon: CalendarIcon },
                { id: 'itsupport', label: 'IT Support', icon: Server },
                { id: 'crm', label: 'Client CRM', icon: Users },
                { id: 'multiloc', label: 'Multi-Location', icon: Globe },
                { id: 'sylara', label: 'AI Guidance', icon: Bot },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'addons', label: 'Add-Ons', icon: Shield },
              ].map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0", activeTab === item.id ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200")}>
                  <item.icon size={13} /> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
        {/* HEADER */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Operations Support Hub</h1>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Enterprise Tier • 85% AI Automated</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
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
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><CircleCheck size={18} className="text-blue-500"/> Priority Task Stream</h3>
                    <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="text-sm font-bold text-blue-600 hover:underline">View All Tasks</button>
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
                      <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50">Handle</button>
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
                      <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50">Resolve</button>
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
                      <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-bold hover:bg-slate-50">Ticket</button>
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
                    <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold transition-colors">
                      Approve Staffing Shift
                    </button>
                    <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-bold text-slate-300 transition-colors">
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


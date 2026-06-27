import React, { useState } from 'react';
import { ShadowOverlay } from '../components/shared/ShadowOverlay';
import { useDraggableSidebar } from '../hooks/useDraggableSidebar';
import { Users, Calendar, Video, MapPin, FileText, Share2, Shield, CreditCard, 
  BarChart, Settings, Bell, Search, Zap, Plus, PhoneCall, AlertTriangle, ChevronRight, FlaskConical, X, UserCheck, CircleCheck, ArrowRight, FolderLock, Download, Eye, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import { StatCard } from '../components/StatCard';
import { CannabisCertWizard } from '../components/provider/CannabisCertWizard';
import { UserCalendar } from '../components/UserCalendar';
import { ImportantUpdates } from '../components/ImportantUpdates';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const DEFAULT_SIDEBAR_ITEMS = [
  { id: 'queue', label: 'Patient Queue', icon: Users },
  { id: 'schedule', label: 'Schedule & Appts', icon: Calendar },
  { id: 'telehealth', label: 'Telehealth Visits', icon: Video },
  { id: 'traditional', label: 'Traditional Visits', icon: MapPin },
  { id: 'certifications', label: 'Certifications', icon: FileText },
  { id: 'impairment', label: 'Ocular Metrics (SINC)', icon: Zap },
  { id: 'billing', label: 'Billing & Insurance', icon: CreditCard },
  { id: 'reports', label: 'Reports', icon: BarChart },
  { id: 'vault', label: 'Secure Vault', icon: FolderLock },
  { id: 'settings', label: 'Settings & Profile', icon: Settings },
];

const patientQueue = [
  { id: 'PT-9942', name: 'Michael Chen', type: 'Cannabis Eval', source: 'Patient Portal', date: 'Today, 2:00 PM', state: 'OK', status: 'Pending', condition: 'Chronic Pain' },
  { id: 'PT-8812', name: 'Sarah Jenkins', type: 'Traditional', source: 'Direct Booking', date: 'Today, 3:30 PM', state: 'OK', status: 'Scheduled', condition: 'General Wellness' },
  { id: 'PT-7721', name: 'James Wilson', type: 'Renewal', source: 'SINC Referral', date: 'Tomorrow, 10:00 AM', state: 'OK', status: 'Pending', condition: 'PTSD' },
  { id: 'PT-6643', name: 'Maria Gonzalez', type: 'Telehealth', source: 'LARRY Referral', date: 'Apr 21, 1:00 PM', state: 'TX', status: 'Scheduled', condition: 'Anxiety' },
];

const alerts = [
  { type: 'recall', msg: 'Batch recall on "GreenLeaf Tincture" ΓÇö 2 of your patients affected.', time: '1h ago', icon: FlaskConical, color: 'text-amber-500 bg-amber-50' },
  { type: 'oversight', msg: 'OVERSIGHT ALERT: 3 Certifications pending past SLA. Action required immediately to avoid rating penalty.', time: '3h ago', icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-200' },
  { type: 'lead', msg: 'New Referral Lead from SINC Dispensary Network.', time: '5h ago', icon: Zap, color: 'text-emerald-500 bg-emerald-50' },
];

export const ProviderDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('queue');
  const [showCertWizard, setShowCertWizard] = useState(false);
  const [hideUpdates, setHideUpdates] = useState(() => localStorage.getItem('ggp_updates_read') === 'true');
  const [tokens, setTokens] = useState(15);
  const [unlockedPatients, setUnlockedPatients] = useState<string[]>([]);

  // Drag-and-drop sidebar reordering
  const { items: sidebarItems, handleDragStart, handleDragEnter, handleDragEnd, handleDragOver } = useDraggableSidebar(DEFAULT_SIDEBAR_ITEMS, 'ggp_provider_sidebar_order');

  const handleUnlock = (patientId: string) => {
    if (12 + unlockedPatients.length >= 20) {
      (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Active Patient Limit Reached. Complete existing consultations before taking new referrals. This ensures compliance with state telehealth volume limits." })] }).catch(console.error) ); alert("Active Patient Limit Reached. Complete existing consultations before taking new referrals. This ensures compliance with state telehealth volume limits.\n\n[Live Production Transaction Logged]"); })();
      return;
    }

    if (tokens > 0) {
      if (confirm(`Accept patient referral ${patientId}? This costs 1 Token.`)) {
        setTokens(t => t - 1);
        setUnlockedPatients([...unlockedPatients, patientId]);
        (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Patient accepted. They have been moved to your active schedule." })] }).catch(console.error) ); alert("Patient accepted. They have been moved to your active schedule.\n\n[Live Production Transaction Logged]"); })();
      }
    } else {
      (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Not enough tokens. Please purchase a Token Pack." })] }).catch(console.error) ); alert("Not enough tokens. Please purchase a Token Pack.\n\n[Live Production Transaction Logged]"); })();
      setActiveTab('billing');
    }
  };

  const handleBuyTokens = () => {
    if (confirm('Purchase 10 Token Pack for $499?')) {
      setTokens(t => t + 10);
      (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Tokens successfully purchased and added to your balance." })] }).catch(console.error) ); alert("Tokens successfully purchased and added to your balance.\n\n[Live Production Transaction Logged]"); })();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* LEFT SIDEBAR (Medical Blue Theme) */}
      <div className="w-64 bg-[#0f1b2d] border-r border-[#1e3a5f] text-slate-300 hidden md:flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-black text-lg leading-tight tracking-tight">GGP Health</h2>
              <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Provider Network</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-[#1e3a5f]/50 border border-[#2a4d7a] mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">DR</div>
              <div>
                <p className="font-bold text-white text-sm">Dr. Jane Doe</p>
                <p className="text-[10px] text-blue-300">Oklahoma Licensed</p>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase w-full">
                Tier: Medium (249/mo)
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowCertWizard(true)}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 mb-6 shadow-lg shadow-emerald-900/20"
          >
            <FileText size={16} /> Issue Certification
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <button
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-grab active:cursor-grabbing",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-[#1e3a5f]/50 hover:text-slate-200"
              )}
            >
              <item.icon size={16} className={cn(activeTab === item.id ? "text-blue-200" : "text-slate-500")} />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-[#1e3a5f]">
          
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patient, ID, or case..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="w-px h-6 bg-slate-200" />
            <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Upgrade options and enterprise tier pricing will be available after the pilot period." })] }).catch(console.error) ); alert("Upgrade options and enterprise tier pricing will be available after the pilot period.\n\n[Live Production Transaction Logged]"); }} className="px-4 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
              Upgrade to Full AI
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Users size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">Visits This Month</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">142</h3>
                  <span className="text-sm font-bold text-emerald-500 mb-1">+12%</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Share2 size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">New Leads / Referrals</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">28</h3>
                  <span className="text-sm font-bold text-emerald-500 mb-1">+5 from SINC</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><FileText size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">Pending Certifications</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">6</h3>
                  <span className="text-sm font-bold text-amber-500 mb-1">Action Required</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><Shield size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">Compliance Score</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">98%</h3>
                  <span className="text-sm font-bold text-blue-500 mb-1">Larry Certified</span>
                </div>
              </div>
            </div>

            {/* Important Updates */}
            {activeTab === 'queue' && !hideUpdates && (
              <div className="mb-6 relative group">
                <button onClick={() => { setHideUpdates(true); localStorage.setItem('ggp_updates_read', 'true'); localStorage.setItem('ggp_updates_read_date', new Date().toISOString()); }} className="absolute top-2 right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm transition-all z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <X size={14} /> Mark as Read
                </button>
                <ImportantUpdates role="provider" />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content (Patient Queue) */}
              <div className="lg:col-span-2 space-y-6">
                
                {activeTab === 'queue' && (
                  <>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ProfileSettingsCard user={user} roleLabel="User Info" />

                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" /> Patient Queue & Upcoming
                      </h3>
                      <p className="text-sm text-slate-500">Manage today's consultations and pending certifications.</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Patient Queue filter options: Cannabis Eval, Traditional, Renewal, Telehealth. Advanced filters available in Full AI tier." })] }).catch(console.error) ); alert("Patient Queue filter options: Cannabis Eval, Traditional, Renewal, Telehealth. Advanced filters available in Full AI tier.\n\n[Live Production Transaction Logged]"); }} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Filter</button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-5 py-3">Patient</th>
                          <th className="px-5 py-3">Type & Condition</th>
                          <th className="px-5 py-3">Schedule</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patientQueue.filter(p => !unlockedPatients.includes(p.id)).map((pt, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-800">{pt.name}</div>
                              <div className="text-xs text-slate-500">{pt.id} ΓÇó {pt.source}</div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", 
                                pt.type.includes('Cannabis') || pt.type.includes('Renewal') ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                              )}>
                                {pt.type}
                              </span>
                              <div className="text-xs text-slate-500 mt-1">{pt.condition}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-medium text-slate-700">{pt.date}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} /> {pt.state}</div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit",
                                pt.status === 'Pending' ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                              )}>
                                {pt.status === 'Pending' ? <AlertTriangle size={12} /> : <Calendar size={12} />} {pt.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button onClick={() => handleUnlock(pt.id)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-md shadow-blue-900/10">
                                  <Users size={14} /> Accept Referral (1 Token)
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Patient Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-blue-600" /> Patient Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated providers receive "Top Provider" acknowledgement and priority lead routing.</p>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                      A Rating (4.8/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">Sarah J.</p>
                          <p className="text-xs text-slate-500">Telehealth Visit ΓÇó Yesterday</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">ΓÿàΓÿàΓÿàΓÿàΓÿà</div>
                      </div>
                      <p className="text-sm text-slate-600">"Dr. Doe was very attentive and the entire process through the patient portal was smooth."</p>
                    </div>
                  </div>
                </div>

                {/* Sylara Assistant Widget */}
                <div className="bg-blue-50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/20">
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2">
                      Sylara Intelligence <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-200 text-blue-800">Active</span>
                    </h4>
                    <p className="text-sm text-blue-800 mt-1">
                      "You have 3 new leads and 2 pending certifications. Would you like me to pre-fill the state forms for Michael Chen's evaluation?"
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Sylara is pre-filling state intake forms based on Michael Chen\\'s previous medical history..." })] }).catch(console.error) ); alert("Sylara is pre-filling state intake forms based on Michael Chen\\'s previous medical history...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-md">
                        Pre-fill Forms
                      </button>
                      <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Routing to Sylara Lead generation dashboard..." })] }).catch(console.error) ); alert("Routing to Sylara Lead generation dashboard...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-sm font-bold transition-colors">
                        View Leads
                      </button>
                    </div>
                  </div>
                </div>
                </>
                )}

                {activeTab === 'telehealth' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Video className="text-blue-600" /> My Active Telehealth
                      </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {unlockedPatients.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">You have no active telehealth patients. Accept referrals from the Queue.</div>
                      ) : (
                        patientQueue.filter(p => unlockedPatients.includes(p.id) && p.type !== 'Traditional').map((pt, i) => (
                          <div key={i} className="p-6 hover:bg-slate-50">
                            <h4 className="font-bold text-slate-900 text-lg mb-1">{pt.name}</h4>
                            <p className="text-sm text-slate-500">{pt.type} ΓÇó {pt.state} ΓÇó Appt: {pt.date}</p>
                            <div className="mt-4 flex gap-3">
                              <button onClick={() => alert('Launching Secure Telehealth Virtual Room for ' + pt.name)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"><Video size={16}/> Join Virtual Room</button>
                              <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Loading patient intake forms..." })] }).catch(console.error) ); alert("Loading patient intake forms...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">View Intake Form</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'traditional' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <MapPin className="text-emerald-600" /> My Traditional Visits
                      </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {patientQueue.filter(p => unlockedPatients.includes(p.id) && p.type === 'Traditional').length === 0 ? (
                        <div className="p-8 text-center text-slate-500">You have no active traditional visits. Accept referrals from the Queue.</div>
                      ) : (
                        patientQueue.filter(p => unlockedPatients.includes(p.id) && p.type === 'Traditional').map((pt, i) => (
                          <div key={i} className="p-6 hover:bg-slate-50">
                            <h4 className="font-bold text-slate-900 text-lg mb-1">{pt.name}</h4>
                            <p className="text-sm text-slate-500">{pt.type} ΓÇó {pt.state} ΓÇó Appt: {pt.date}</p>
                            <div className="mt-4 flex gap-3">
                              <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Checking patient \' + pt.name + \' into the physical clinic lobby." })] }).catch(console.error) ); alert("Checking patient \' + pt.name + \' into the physical clinic lobby.\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700">Check In to Clinic</button>
                              <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Loading patient intake forms..." })] }).catch(console.error) ); alert("Loading patient intake forms...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">View Intake Form</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'impairment' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                          <Zap className="text-blue-600" /> Patient Ocular & Impairment Metrics
                        </h2>
                        <p className="text-sm text-slate-500">Track visual reaction times and pupil response data synced from IMMAD roadside or clinical devices.</p>
                      </div>
                      <button onClick={() => alert("Re-syncing clinical screening databases...")} className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50">Sync Data</button>
                    </div>

                    {/* Roster & Metrics */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                          <tr>
                            <th className="p-4">Patient</th>
                            <th className="p-4">Ocular Latency</th>
                            <th className="p-4">Saccadic Tracking</th>
                            <th className="p-4">Active Impairment Rating</th>
                            <th className="p-4">State Compliance status</th>
                            <th className="p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-800">Michael Chen<br/><span className="text-xs text-slate-400 font-normal">PT-9942</span></td>
                            <td className="p-4 font-mono text-xs">240ms (Normal)</td>
                            <td className="p-4 text-emerald-600 font-bold">Stable (96%)</td>
                            <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Pass (Safe)</span></td>
                            <td className="p-4"><span className="text-emerald-600 font-bold flex items-center gap-1"><CircleCheck size={12}/> Compliant</span></td>
                            <td className="p-4"><button onClick={() => alert("Calibrating dosage to 10mg THC oral daily based on 98% cognitive baseline stability.")} className="text-blue-600 hover:underline font-bold text-xs">Calibrate Dosage</button></td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-800">Sarah Jenkins<br/><span className="text-xs text-slate-400 font-normal">PT-8812</span></td>
                            <td className="p-4 font-mono text-xs text-amber-600 font-bold">380ms (Delayed)</td>
                            <td className="p-4 text-amber-600 font-bold">Unstable (72%)</td>
                            <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Moderate Impairment</span></td>
                            <td className="p-4"><span className="text-amber-600 font-bold flex items-center gap-1"><AlertTriangle size={12}/> Review Advised</span></td>
                            <td className="p-4"><button onClick={() => alert("Dosage safety review triggered. Contacting Sarah Jenkins...")} className="text-amber-600 hover:underline font-bold text-xs">Trigger Review</button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Chart / Analytical Widget */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-md">Clinical Screening Standard (IMMAD Alignment)</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          Active cognitive impairment is measured through ophthalmic pupillary reflex delay and visual tracking latency. By recording these baseline values during telehealth reviews, providers can verify that the patient's prescribed medical marijuana dosage is not causing chronic motor or visual impairment.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm shrink-0 w-full md:w-56">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Latency</p>
                        <p className="text-3xl font-black text-slate-900">260ms</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">Within normal bounds</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <CreditCard className="text-blue-600" /> Billing & Referral Tokens
                    </h2>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mb-8 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Available Referral Tokens</p>
                        <h3 className="text-4xl font-black text-slate-900">{tokens}</h3>
                      </div>
                      <button onClick={handleBuyTokens} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md">
                        Purchase 10 Tokens ($499)
                      </button>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                      <h3 className="font-bold text-blue-800 mb-2">Telehealth Reimbursement Network</h3>
                      <p className="text-sm text-blue-700">Accept traditional Medicare/Medicaid and convert to cash-pay equivalent through the GGP Wallet system.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'schedule' && (
                  <UserCalendar user={{...user, role: 'provider', email: 'provider@example.com'}} title="Provider Schedule" subtitle="Appointments ΓÇó Telehealth ΓÇó Clinics" />
                )}


                  {activeTab === 'certifications' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Recent Certifications</h3>
                          <p className="text-sm text-slate-500">Track and manage state-filed medical evaluations.</p>
                        </div>
                        <button onClick={() => setShowCertWizard(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
                           <Plus size={16} /> New Cert
                        </button>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                             <tr>
                               <th className="p-4">Patient</th>
                               <th className="p-4">Condition</th>
                               <th className="p-4">Date Issued</th>
                               <th className="p-4">Status</th>
                               <th className="p-4">Actions</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800">Michael Chen<br/><span className="text-xs text-slate-400 font-normal">PT-9942</span></td>
                               <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Chronic Pain</span></td>
                               <td className="p-4 text-slate-600">Apr 21, 2026</td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 w-max"><CircleCheck size={10}/> Filed</span></td>
                               <td className="p-4"><button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening certification PDF in secure viewer..." })] }).catch(console.error) ); alert("Opening certification PDF in secure viewer...\n\n[Live Production Transaction Logged]"); }} className="text-blue-600 hover:underline font-bold">View PDF</button></td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800">Sarah Jenkins<br/><span className="text-xs text-slate-400 font-normal">PT-8812</span></td>
                               <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Anxiety</span></td>
                               <td className="p-4 text-slate-600">Apr 15, 2026</td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 w-max"><CircleCheck size={10}/> Filed</span></td>
                               <td className="p-4"><button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening certification PDF in secure viewer..." })] }).catch(console.error) ); alert("Opening certification PDF in secure viewer...\n\n[Live Production Transaction Logged]"); }} className="text-blue-600 hover:underline font-bold">View PDF</button></td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800">James Wilson<br/><span className="text-xs text-slate-400 font-normal">PT-7721</span></td>
                               <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">PTSD (Renewal)</span></td>
                               <td className="p-4 text-slate-600">Apr 10, 2026</td>
                               <td className="p-4"><span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 w-max">Pending State</span></td>
                               <td className="p-4"><button onClick={() => { setShowCertWizard(true); import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "CERT_REVIEW", "Production_User", JSON.stringify({ detail: "Opening pending certification for review..." })] }).catch(console.error) ); }} className="text-blue-600 hover:underline font-bold">Review</button></td>
                             </tr>
                           </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  
                  {activeTab === 'vault' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600"/> Provider & Patient Vault</h3>
                          <p className="text-sm text-slate-500">Secure, permanent storage for HIPAA-compliant medical records, compliance audits, and patient histories.</p>
                        </div>
                        <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
                           <FolderLock size={16} /> Upload Record
                           <input type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "File \"\' + e.target.files[0].name + \'\" queued. Establishing secure connection to Vault..." })] }).catch(console.error) ); alert("File \"\' + e.target.files[0].name + \'\" queued. Establishing secure connection to Vault...\n\n[Live Production Transaction Logged]"); })(); }} />
                        </label>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                             <tr>
                               <th className="p-4">Document Name</th>
                               <th className="p-4">Category</th>
                               <th className="p-4">Date Added</th>
                               <th className="p-4">Size</th>
                               <th className="p-4 text-right">Actions</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-red-50 text-red-500 rounded"><FileText size={16}/></div>
                                 <div>
                                   Michael Chen - Complete Medical History
                                   <span className="block text-xs text-slate-400 font-normal">Patient ID: PT-9942</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Patient Record</span></td>
                               <td className="p-4 text-slate-600">May 09, 2026</td>
                               <td className="p-4 text-slate-500">4.2 MB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening document in secure HIPAA-compliant viewer..." })] }).catch(console.error) ); alert("Opening document in secure HIPAA-compliant viewer...\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_DOWNLOAD", "Production_User", JSON.stringify({ detail: "Preparing encrypted download. File will be saved to your local device." })] }).catch(console.error) ); alert("Preparing encrypted download. File will be saved to your local device.\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-emerald-50 text-emerald-500 rounded"><Shield size={16}/></div>
                                 <div>
                                   State Compliance Audit - Q1 2026
                                   <span className="block text-xs text-slate-400 font-normal">System Generated</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Audit Report</span></td>
                               <td className="p-4 text-slate-600">Apr 30, 2026</td>
                               <td className="p-4 text-slate-500">1.1 MB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening document in secure HIPAA-compliant viewer..." })] }).catch(console.error) ); alert("Opening document in secure HIPAA-compliant viewer...\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_DOWNLOAD", "Production_User", JSON.stringify({ detail: "Preparing encrypted download. File will be saved to your local device." })] }).catch(console.error) ); alert("Preparing encrypted download. File will be saved to your local device.\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-purple-50 text-purple-500 rounded"><CreditCard size={16}/></div>
                                 <div>
                                   Monthly Billing & Revenue Summary
                                   <span className="block text-xs text-slate-400 font-normal">April 2026</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Financial</span></td>
                               <td className="p-4 text-slate-600">May 01, 2026</td>
                               <td className="p-4 text-slate-500">845 KB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening document in secure HIPAA-compliant viewer..." })] }).catch(console.error) ); alert("Opening document in secure HIPAA-compliant viewer...\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_DOWNLOAD", "Production_User", JSON.stringify({ detail: "Preparing encrypted download. File will be saved to your local device." })] }).catch(console.error) ); alert("Preparing encrypted download. File will be saved to your local device.\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                             <tr className="hover:bg-slate-50 transition-colors opacity-60">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-slate-100 text-slate-500 rounded"><FileText size={16}/></div>
                                 <div>
                                   Sarah Jenkins - Transferred Records
                                   <span className="block text-xs text-slate-400 font-normal">Patient ID: PT-8812</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Patient Record</span></td>
                               <td className="p-4 text-slate-600">Mar 12, 2026</td>
                               <td className="p-4 text-slate-500">12.5 MB</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_VIEW", "Production_User", JSON.stringify({ detail: "Opening document in secure HIPAA-compliant viewer..." })] }).catch(console.error) ); alert("Opening document in secure HIPAA-compliant viewer...\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "VAULT_DOWNLOAD", "Production_User", JSON.stringify({ detail: "Preparing encrypted download. File will be saved to your local device." })] }).catch(console.error) ); alert("Preparing encrypted download. File will be saved to your local device.\n\n[Live Production Transaction Logged]"); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                           </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reports' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">Provider Intelligence & Reports</h3>
                        <p className="text-sm text-slate-500">Automated compliance, revenue, and clinical outcome metrics.</p>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><BarChart size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">Monthly Patient Volume</h4>
                           <p className="text-xs text-slate-500 mb-4">Telehealth vs Traditional breakdown with SINC referral metrics.</p>
                           <button onClick={() => { (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Compiling Monthly Patient Volume Report... The generated PDF is being securely saved to your Vault." })] }).catch(console.error) ); alert("Compiling Monthly Patient Volume Report... The generated PDF is being securely saved to your Vault.\n\n[Live Production Transaction Logged]"); })(); setActiveTab('vault'); }} className="text-blue-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Shield size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">State Compliance Audit</h4>
                           <p className="text-xs text-slate-500 mb-4">LARRY AI certified compliance score and pre-audit readiness report.</p>
                           <button onClick={() => { (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Generating State Compliance Audit... LARRY AI is cross-referencing your records. The final audit will be saved to your Vault." })] }).catch(console.error) ); alert("Generating State Compliance Audit... LARRY AI is cross-referencing your records. The final audit will be saved to your Vault.\n\n[Live Production Transaction Logged]"); })(); setActiveTab('vault'); }} className="text-emerald-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><CreditCard size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">Revenue & Billing Summary</h4>
                           <p className="text-xs text-slate-500 mb-4">Subscription, consultation fees, and pending invoice totals.</p>
                           <button onClick={() => { (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Retrieving Revenue & Billing Summary... The report will be saved to your Vault." })] }).catch(console.error) ); alert("Retrieving Revenue & Billing Summary... The report will be saved to your Vault.\n\n[Live Production Transaction Logged]"); })(); setActiveTab('vault'); }} className="text-purple-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-5 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group">
                           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><FileText size={24}/></div>
                           <h4 className="font-bold text-slate-800 mb-1">Prescription Outcome Data</h4>
                           <p className="text-xs text-slate-500 mb-4">Anonymized efficacy reports linked to specific product categories.</p>
                           <button onClick={() => { (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Compiling Anonymized Efficacy Reports... The clinical aggregation will be saved to your Vault when complete." })] }).catch(console.error) ); alert("Compiling Anonymized Efficacy Reports... The clinical aggregation will be saved to your Vault when complete.\n\n[Live Production Transaction Logged]"); })(); setActiveTab('vault'); }} className="text-amber-600 font-bold text-sm flex items-center gap-1">Generate <ArrowRight size={14}/></button>
                        </div>
                      </div>
                    </div>
                  )}

                
                {activeTab === 'settings' && (
                  <ProfileSettingsCard user={user} roleLabel="User Info" />
                )}



              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                
                {activeTab === 'queue' && hideUpdates && (
                  <button onClick={() => { setHideUpdates(false); localStorage.removeItem('ggp_updates_read'); }} className="w-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-sm">
                    <Bell size={16} /> View Important Updates (3)
                  </button>
                )}

                {/* Prepare for Next Call */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Video size={18} className="text-blue-600" /> Prepare for Next Call
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="font-bold text-slate-900">Michael Chen (2:00 PM)</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <CircleCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" /> ID Verified & Valid
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <CircleCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Intake Forms Complete
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" /> Review Prior Records
                      </li>
                    </ul>
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Launching Secure Telehealth Waiting Room..." })] }).catch(console.error) ); alert("Launching Secure Telehealth Waiting Room...\n\n[Live Production Transaction Logged]"); }} className="w-full mt-2 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold hover:bg-blue-100 transition-colors">
                      Enter Waiting Room
                    </button>
                  </div>
                </div>

                {/* OMMA State Resources */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" /> State Resources
                  </h3>
                  <div className="space-y-2">
                    <a href="https://oklahoma.gov/content/dam/ok/en/omma/docs/patient-caregiver/Adult%20Patient%20Physician%20Recommendation%20Form.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <span className="text-xs font-bold text-slate-700">Adult Recommendation Form</span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                    </a>
                    <a href="https://oklahoma.gov/content/dam/ok/en/omma/docs/patient-caregiver/Minor%20Patient%20Physician%20Recommendation%20Form.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <span className="text-xs font-bold text-slate-700">Minor Recommendation Form</span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                    </a>
                    <a href="https://oklahoma.gov/omma/patients-caregivers.html" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                      <span className="text-xs font-bold text-slate-700">OMMA Patient Portal</span>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
                    </a>
                  </div>
                </div>

                {/* Alerts & Notifications */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Bell size={18} className="text-amber-500" /> Action Items
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {alerts.map((a, i) => (
                      <div key={i} className={cn("p-3 rounded-xl border flex items-start gap-3", a.color.replace('bg-', 'border-').replace('text-', 'border-') + '/30', a.color.split(' ')[1])}>
                        <a.icon size={16} className={cn("shrink-0 mt-0.5", a.color.split(' ')[0])} />
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-snug">{a.msg}</p>
                          <p className="text-xs text-slate-500 mt-1">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Quick Links */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-3">System Connections</h3>
                  <div className="space-y-2">
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Connecting to Public Health & Labs integration portal..." })] }).catch(console.error) ); alert("Connecting to Public Health & Labs integration portal...\n\n[Live Production Transaction Logged]"); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <FlaskConical size={16} className="text-purple-500" /> Public Health & Labs
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Connecting to L.A.R.R.Y Enforcement Module..." })] }).catch(console.error) ); alert("Connecting to L.A.R.R.Y Enforcement Module...\n\n[Live Production Transaction Logged]"); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield size={16} className="text-emerald-500" /> Larry Enforcement
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Routing case to L.A.R.R.Y Enforcement for audit..." })] }).catch(console.error) ); alert("Routing case to L.A.R.R.Y Enforcement for audit...\n\n[Live Production Transaction Logged]"); }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Share2 size={16} className="text-blue-500" /> Route Case to LARRY C.
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wizard Modal overlay */}
      {showCertWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowCertWizard(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Issue Cannabis Certification</h2>
            <p className="text-slate-500 mb-6 text-sm">Complete the state-required workflow. Larry will verify your OMMA credentials automatically.</p>
            
            <CannabisCertWizard 
              onCancel={() => setShowCertWizard(false)} 
              onComplete={() => {
                setShowCertWizard(false);
                (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Certification Filed Successfully" })] }).catch(console.error) ); alert("Certification Filed Successfully\n\n[Live Production Transaction Logged]"); })();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};


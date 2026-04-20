import React, { useState } from 'react';
import { 
  Users, Calendar, Video, MapPin, FileText, Share2, Shield, CreditCard, 
  BarChart, Settings, Bell, Search, Zap, Plus, PhoneCall, AlertTriangle, ChevronRight, CheckCircle2, FlaskConical, X, UserCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';
import { CannabisCertWizard } from '../components/provider/CannabisCertWizard';

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: BarChart },
  { id: 'queue', label: 'Patient Queue', icon: Users },
  { id: 'schedule', label: 'Schedule & Appts', icon: Calendar },
  { id: 'telehealth', label: 'Telehealth Visits', icon: Video },
  { id: 'traditional', label: 'Traditional Visits', icon: MapPin },
  { id: 'certifications', label: 'Certifications', icon: FileText },
  { id: 'referrals', label: 'Referrals (SINC / LARRY)', icon: Share2 },
  { id: 'compliance', label: 'Compliance (Larry)', icon: Shield },
  { id: 'billing', label: 'Billing & Insurance', icon: CreditCard },
  { id: 'reports', label: 'Reports', icon: BarChart },
  { id: 'settings', label: 'Settings & Profile', icon: Settings },
];

const patientQueue = [
  { id: 'PT-9942', name: 'Michael Chen', type: 'Cannabis Eval', source: 'Patient Portal', date: 'Today, 2:00 PM', state: 'OK', status: 'Pending', condition: 'Chronic Pain' },
  { id: 'PT-8812', name: 'Sarah Jenkins', type: 'Traditional', source: 'Direct Booking', date: 'Today, 3:30 PM', state: 'OK', status: 'Scheduled', condition: 'General Wellness' },
  { id: 'PT-7721', name: 'James Wilson', type: 'Renewal', source: 'SINC Referral', date: 'Tomorrow, 10:00 AM', state: 'OK', status: 'Pending', condition: 'PTSD' },
  { id: 'PT-6643', name: 'Maria Gonzalez', type: 'Telehealth', source: 'LARRY Referral', date: 'Apr 21, 1:00 PM', state: 'TX', status: 'Scheduled', condition: 'Anxiety' },
];

const alerts = [
  { type: 'recall', msg: 'Batch recall on "GreenLeaf Tincture" — 2 of your patients affected.', time: '1h ago', icon: FlaskConical, color: 'text-amber-500 bg-amber-50' },
  { type: 'oversight', msg: 'OVERSIGHT ALERT: 3 Certifications pending past SLA. Action required immediately to avoid rating penalty.', time: '3h ago', icon: AlertTriangle, color: 'text-red-500 bg-red-50 border-red-200' },
  { type: 'lead', msg: 'New Referral Lead from SINC Dispensary Network.', time: '5h ago', icon: Zap, color: 'text-emerald-500 bg-emerald-50' },
];

export const ProviderDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('queue');
  const [showCertWizard, setShowCertWizard] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* LEFT SIDEBAR (Medical Blue Theme) */}
      <div className="w-64 bg-[#0f1b2d] border-r border-[#1e3a5f] text-slate-300 hidden md:flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <img src="/gghp-logo.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
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
            <Plus size={16} /> New Consultation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
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
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-sm font-medium">Logout</span>
          </button>
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
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <button className="px-4 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content (Patient Queue) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" /> Patient Queue & Upcoming
                      </h3>
                      <p className="text-sm text-slate-500">Manage today's consultations and pending certifications.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Filter</button>
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
                        {patientQueue.map((pt, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="font-bold text-slate-800">{pt.name}</div>
                              <div className="text-xs text-slate-500">{pt.id} • {pt.source}</div>
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
                                {pt.type === 'Traditional' ? (
                                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                                    Check In
                                  </button>
                                ) : pt.status === 'Pending' && (pt.type.includes('Cannabis') || pt.type.includes('Renewal')) ? (
                                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors">
                                    Issue Cert
                                  </button>
                                ) : (
                                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1">
                                    <Video size={14} /> Join
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                
                {/* Client Reviews & Ratings */}
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
                          <p className="text-xs text-slate-500">Telehealth Visit • Yesterday</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"Dr. Doe was very attentive and the entire process through the patient portal was smooth."</p>
                    </div>
                  </div>
                </div>

                {/* Sylara Assistant Widget */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 flex items-start gap-4 shadow-sm">
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
                      <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-md">
                        Pre-fill Forms
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-sm font-bold transition-colors">
                        View Leads
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                
                {/* Prepare for Next Call */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Video size={18} className="text-blue-600" /> Prepare for Next Call
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="font-bold text-slate-900">Michael Chen (2:00 PM)</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> ID Verified & Valid
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> Intake Forms Complete
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" /> Review Prior Records
                      </li>
                    </ul>
                    <button className="w-full mt-2 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold hover:bg-blue-100 transition-colors">
                      Enter Waiting Room
                    </button>
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
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <FlaskConical size={16} className="text-purple-500" /> Public Health & Labs
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield size={16} className="text-emerald-500" /> Larry Enforcement
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Share2 size={16} className="text-blue-500" /> Route Case to LARRY C.
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>

                {/* Patient Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-blue-600" /> Patient Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated providers receive "Top Provider" acknowledgement.</p>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      A Rating (4.8/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-800">Sarah J.</p>
                      <p className="text-sm text-slate-600">"Dr. Jane was very attentive and the entire process through the patient portal was smooth."</p>
                    </div>
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
                // Add success toast logic here later
                alert('Certification Filed Successfully');
              }} 
            />
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Shield, Scale, Briefcase, FileText, Search, BookOpen, Clock, AlertTriangle, 
  ChevronRight, Lock, Unlock, Zap, BarChart2, Bell, MessageSquare, CreditCard,
  CheckCircle, PlusCircle, LayoutDashboard, UserCheck, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'browse', label: 'Browse Cases', icon: Search },
  { id: 'active', label: 'My Active Cases', icon: Briefcase },
  { id: 'library', label: 'Law Library', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'billing', label: 'Billing & Compassion Balance', icon: CreditCard },
];

const availableCases = [
  { id: 'FL-9942', state: 'Florida', title: 'Licensing Dispute & Application Review', urgency: 'HIGH URGENCY', docs: 12, value: '$50k', clientType: 'Business', time: '14 days left', sla: 'SLA: 24h', triaged: true },
  { id: 'CA-8812', state: 'California', title: '280E Tax Audit Representation', urgency: 'MEDIUM URGENCY', docs: 45, value: '$120k', clientType: 'Business', time: '30 days left', sla: 'SLA: 48h', triaged: true },
  { id: 'MI-7721', state: 'Michigan', title: 'Compliance & SOP Drafting', urgency: 'STANDARD', docs: 3, value: '$5k', clientType: 'Business/Provider', time: 'Flexible', sla: 'SLA: 5d', triaged: true },
  { id: 'OK-6643', state: 'Oklahoma', title: 'Patient License Appeal (OMMA)', urgency: 'HIGH URGENCY', docs: 8, value: '$2k', clientType: 'Patient', time: '7 days left', sla: 'SLA: 12h', triaged: true },
];

const alerts = [
  { type: 'action', msg: 'Client "GreenLeaf Dispensary" missed inventory audit.', time: '1h ago', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { type: 'oversight', msg: 'OVERSIGHT ALERT: Client "Jane Doe" review SLA missed by 12 hours. Rating dropped to B.', time: '3h ago', icon: ShieldAlert, color: 'text-red-500 bg-red-50 border-red-200' },
  { type: 'case', msg: 'New Case matched your profile: Texas Operations setup.', time: '5h ago', icon: Briefcase, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
];

export const AttorneyDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tokens, setTokens] = useState(12);

  const handleUnlock = (caseId: string) => {
    if (tokens > 0) {
      if (confirm(`Unlock client contact for case ${caseId}? This costs 1 Token.`)) {
        setTokens(t => t - 1);
        alert('Client contact unlocked. Case added to My Active Cases.');
      }
    } else {
      alert('Not enough tokens. Please purchase a Token Pack.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* LEFT SIDEBAR (Legal Green Theme) */}
      <div className="w-64 bg-[#0a1f16] border-r border-[#153a28] text-slate-300 hidden md:flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-black text-xl leading-tight tracking-tight">L.A.R.R.Y. C.</h2>
              <p className="text-[9px] text-emerald-500/80 font-bold tracking-widest uppercase">Legal Archive & Compliance</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-[#153a28]/50 border border-[#1a4731] mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">AW</div>
              <div>
                <p className="font-bold text-white text-sm">Alex Wright, Esq.</p>
                <p className="text-[10px] text-emerald-300">Compliance Counsel</p>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <span className="inline-block px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase text-center">
                Tier: Full AI (699/mo)
              </span>
              <span className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase text-center">
                GGP Rating: A+ (99.2%)
              </span>
            </div>
          </div>

          <button 
            className="w-full py-2.5 rounded-xl bg-[#1a4731] hover:bg-[#153a28] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 mb-6 shadow-lg shadow-black/20 border border-[#2a6b4a]"
          >
            <PlusCircle size={16} /> New Case Intake
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
                  ? "bg-[#1a4731] text-white shadow-md shadow-black/20 border border-[#2a6b4a]" 
                  : "text-slate-400 hover:bg-[#153a28]/50 hover:text-slate-200"
              )}
            >
              <item.icon size={16} className={cn(activeTab === item.id ? "text-emerald-400" : "text-slate-500")} />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-[#153a28]">
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
            <div className="relative w-96">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search cases, statutes, or client records..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-slate-200" />
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Network Sync
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
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Briefcase size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">Active Cases</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">9</h3>
                  <span className="text-sm font-bold text-slate-400 mb-1">/ 15 Cap</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><Lock size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">Case Unlock Balance</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">{tokens}</h3>
                  <span className="text-sm font-bold text-slate-400 mb-1">/ 20 Limit</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Search size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">New Cases Viewed</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">27</h3>
                  <span className="text-sm font-bold text-emerald-500 mb-1">Total Market</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><CheckCircle2 size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">SLA Performance</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">100%</h3>
                  <span className="text-sm font-bold text-emerald-500 mb-1">On Time</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content (Available Cases) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Sylara AI Assistant Banner */}
                <div className="bg-gradient-to-r from-[#0f291c] to-[#1a4731] rounded-2xl border border-[#2a6b4a] p-6 flex items-start gap-4 shadow-lg shadow-emerald-900/10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/20">
                    <SparklesIcon />
                  </div>
                  <div className="flex-1 text-white">
                    <h4 className="font-bold flex items-center gap-2 text-lg">
                      Sylara & Larry Legal Triage <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-500/50">Active</span>
                    </h4>
                    <p className="text-sm text-emerald-100/90 mt-1">
                      "Alex, Larry and I have pre-processed a Florida licensing dispute. We gathered all 12 documents and verified the client. It requires attorney action within 24h to maintain your A+ rating. Would you like me to draft the appeal template and unlock the client file for 1 token?"
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-colors shadow-md text-slate-900">
                        Draft Appeal & Unlock
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                        View Pre-Processed File
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Briefcase size={20} className="text-[#1a4731]" /> New Triage-Ready Cases
                      </h3>
                      <p className="text-sm text-slate-500">Auto-populated and pre-processed by Larry. Accept to maintain SLA and Ratings.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Filter by State</button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {availableCases.map((c, i) => (
                      <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", 
                                c.urgency === 'HIGH URGENCY' ? "bg-red-100 text-red-700" : 
                                c.urgency === 'MEDIUM URGENCY' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                              )}>
                                {c.urgency}
                              </span>
                              {c.triaged && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Pre-Triaged
                                </span>
                              )}
                              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                c.sla.includes('24h') || c.sla.includes('12h') ? "bg-red-50 text-red-600 border-red-200" : "bg-slate-100 text-slate-600 border-slate-200"
                              )}>
                                {c.sla}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-base">{c.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{c.state} • {c.clientType} • {c.docs} Documents • Est. Value: {c.value}</p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <button 
                              onClick={() => handleUnlock(c.id)}
                              className="px-4 py-2 rounded-xl bg-[#1a4731] hover:bg-[#153a28] text-white text-sm font-bold transition-colors flex items-center gap-2 w-full sm:w-auto shadow-md shadow-black/10"
                            >
                              <Unlock size={14} /> Unlock Contact (1 Token)
                            </button>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">
                                Watch Case
                              </button>
                              <button className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">
                                Summary
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                
                {/* Client Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-[#1a4731]" /> Client Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated attorneys receive "Top Counsel" acknowledgement and priority case routing.</p>
                    </div>
                    <div className="bg-[#1a4731] text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                      A+ Rating (4.9/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">GreenLeaf LLC</p>
                          <p className="text-xs text-slate-500">Business Setup • 2 days ago</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"Alex was incredibly fast and handled our entire state compliance application within 24 hours. Highly recommended."</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">Michael S.</p>
                          <p className="text-xs text-slate-500">Patient Appeal • 1 week ago</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"The best legal representation I've had. The AI system made uploading my docs seamless."</p>
                    </div>
                  </div>
                
                {/* Client Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-[#1a4731]" /> Client Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated attorneys receive "Top Counsel" acknowledgement and priority case routing.</p>
                    </div>
                    <div className="bg-[#1a4731] text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                      A+ Rating (4.9/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">GreenLeaf LLC</p>
                          <p className="text-xs text-slate-500">Business Setup • 2 days ago</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"Alex was incredibly fast and handled our entire state compliance application within 24 hours. Highly recommended."</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">Michael S.</p>
                          <p className="text-xs text-slate-500">Patient Appeal • 1 week ago</p>
                        </div>
                        <div className="text-emerald-500 flex tracking-tighter">★★★★★</div>
                      </div>
                      <p className="text-sm text-slate-600">"The best legal representation I've had. The AI system made uploading my docs seamless."</p>
                    </div>
                  </div>
                </div>

                {/* Add-on Upsells Section */}
                <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> Unlock More Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-[#1a4731] transition-colors cursor-pointer">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <BarChart2 size={16} className="text-blue-500" /> Business Client View
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 mb-3">Access live operations and readiness scores for every client you serve.</p>
                      <button className="text-xs font-bold text-[#1a4731] group-hover:underline">Add for $49/mo &rarr;</button>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-[#1a4731] transition-colors cursor-pointer">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <FileText size={16} className="text-emerald-500" /> Patient Record Access
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 mb-3">Consented patient and provider history for individual cases.</p>
                      <button className="text-xs font-bold text-[#1a4731] group-hover:underline">Add for $29/mo &rarr;</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                
                {/* Token & Limit Status */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-[#1a4731]" /> Token Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-600">Response Tokens</span>
                        <span className="font-bold text-slate-900">{tokens} / 20</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(tokens / 20) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-600">Active Cases</span>
                        <span className="font-bold text-slate-900">9 / 15</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(9 / 15) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md">
                      Buy Token Pack
                    </button>
                  </div>
                </div>

                {/* Priority Alerts */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-500" /> Priority Alerts
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {alerts.map((a, i) => (
                      <div key={i} className={cn("p-3 rounded-xl border flex items-start gap-3", a.color)}>
                        <a.icon size={16} className={cn("shrink-0 mt-0.5", a.color.split(' ')[0])} />
                        <div>
                          <p className="text-sm font-medium text-slate-800 leading-snug">{a.msg}</p>
                          <p className="text-xs text-slate-500 mt-1">{a.time}</p>
                          {a.type === 'action' && (
                            <button className="mt-2 text-xs font-bold text-amber-700 hover:underline">Take Action &rarr;</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Quick Links */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 mb-3">Compliance Modules</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield size={16} className="text-[#1a4731]" /> Larry Enforcement
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-[#1a4731]" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard size={16} className="text-emerald-500" /> Compassion Balance & Financials
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-500" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <BookOpen size={16} className="text-blue-500" /> Gov / State Interface
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>

                {/* Client Reviews & Ratings */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <UserCheck size={20} className="text-[#1a4731]" /> Client Reviews & Ratings
                      </h3>
                      <p className="text-sm text-slate-500">Top-rated attorneys receive "Top Counsel" acknowledgement.</p>
                    </div>
                    <div className="bg-[#1a4731] text-white px-3 py-1 rounded-lg text-sm font-bold">
                      A+ Rating (4.9/5)
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-800">GreenLeaf LLC</p>
                      <p className="text-sm text-slate-600">"Alex was incredibly fast and handled our entire state compliance application within 24 hours. Highly recommended."</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple SparklesIcon Component for Sylara
const SparklesIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);

import React, { useState } from 'react';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import { ShadowOverlay } from '../components/shared/ShadowOverlay';
import { useDraggableSidebar } from '../hooks/useDraggableSidebar';
import { Shield, Scale, Briefcase, FileText, Search, BookOpen, Clock, AlertTriangle, 
  ChevronRight, Lock, Unlock, Zap, BarChart2, Bell, MessageSquare, CreditCard,
  CheckCircle, PlusCircle, LayoutDashboard, UserCheck, ShieldAlert, Calendar, CircleCheck , FolderLock, Download, Eye, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ImportantUpdates } from '../components/ImportantUpdates';
import { StatCard } from '../components/StatCard';
import { UserCalendar } from '../components/UserCalendar';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const DEFAULT_SIDEBAR_ITEMS = [
{ id: 'calendar', label: 'My Calendar', icon: Calendar },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'browse', label: 'Browse Cases', icon: Search },
  { id: 'active', label: 'My Active Cases', icon: Briefcase },
  { id: 'library', label: 'Law Library', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'billing', label: 'Billing & Compassion Balance', icon: CreditCard },
  { id: 'vault', label: 'Secure Vault', icon: FolderLock },
];

const availableCases = [
  { id: 'FL-9942', state: 'Florida', title: 'Licensing Dispute & Application Review', urgency: 'HIGH URGENCY', docs: 12, value: '$50k', clientType: 'Business', time: '14 days left', sla: 'SLA: 24h', triaged: true },
  { id: 'CA-8812', state: 'California', title: '280E Tax Audit Representation', urgency: 'MEDIUM URGENCY', docs: 45, value: '$120k', clientType: 'Business', time: '14 days left', sla: 'SLA: 48h', triaged: true },
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
  const [hideUpdates, setHideUpdates] = useState(false);
  const [tokens, setTokens] = useState(12);
  const [unlockedCases, setUnlockedCases] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  // Drag-and-drop sidebar reordering
  const { items: sidebarItems, handleDragStart, handleDragEnter, handleDragEnd, handleDragOver } = useDraggableSidebar(DEFAULT_SIDEBAR_ITEMS, 'ggp_attorney_sidebar_order');

  const handleUnlock = (caseId: string) => {
    if (9 + unlockedCases.length >= 15) {
      alert('Active Case Limit Reached. You cannot unlock more cases until you close existing ones. This ensures fair case distribution across the network.');
      return;
    }

    if (tokens > 0) {
      if (confirm(`Unlock client contact for case ${caseId}? This costs 1 Token.`)) {
        setTokens(t => t - 1);
        setUnlockedCases([...unlockedCases, caseId]);
        alert('Client contact unlocked. Case added to My Active Cases.');
        setActiveTab('active');
      }
    } else {
      alert('Not enough tokens. Please purchase a Token Pack.');
      setActiveTab('billing');
    }
  };

  const handleBuyTokens = () => {
    if (confirm('Purchase 10 Token Pack for $1,999?')) {
      setTokens(t => t + 10);
      alert('Tokens successfully purchased and added to your balance.');
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
            onClick={() => setIsIntakeOpen(true)}
            className="w-full py-2.5 rounded-xl bg-[#1a4731] hover:bg-[#153a28] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 mb-6 shadow-lg shadow-black/20 border border-[#2a6b4a]"
          >
            <PlusCircle size={16} /> New Case Intake
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
            <NotificationDropdown />
            <div className="w-px h-6 bg-slate-200" />
            <button onClick={() => alert('Syncing with national compliance network...')} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Network Sync
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {activeTab === 'calendar' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <UserCalendar user={user} />
              </div>
            )}

            
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {!hideUpdates && (
        <div className="mb-6 relative group">
          <button onClick={() => setHideUpdates(true)} className="absolute top-2 right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm transition-all z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <X size={14} /> Mark as Read
          </button>
          <ImportantUpdates role="attorney" />
        </div>
      )}
      {hideUpdates && (
        <button onClick={() => setHideUpdates(false)} className="w-full max-w-5xl mx-auto bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors shadow-sm mb-6">
          <Bell size={16} /> View Important Updates
        </button>
      )}
              {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Briefcase size={20} /></div>
                  <p className="text-sm font-semibold text-slate-600">Active Cases</p>
                </div>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-black text-slate-900">{9 + unlockedCases.length}</h3>
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
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600"><CircleCheck size={20} /></div>
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
                <div className="bg-[#0f291c] bg-gradient-to-r from-[#0f291c] to-[#1a4731] rounded-2xl border border-[#2a6b4a] p-6 flex items-start gap-4 shadow-lg shadow-emerald-900/10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/20">
                    <SparklesIcon />
                  </div>
                  <div className="flex-1 text-white">
                    <h4 className="font-bold flex items-center gap-2 text-lg">
                      Sylara & L.A.R.R.Y Legal Triage <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-500/50">Active</span>
                    </h4>
                    <p className="text-sm text-emerald-100/90 mt-1">
                      "Alex, Sylara and I have pre-processed a Florida licensing dispute. We gathered all 12 documents and verified the client. It requires attorney action within 24h to maintain your A+ rating. Would you like me to draft the appeal template and unlock the client file for 1 token?"
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleUnlock('FL-9942')} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold transition-colors shadow-md">
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
                    {availableCases.filter(c => !unlockedCases.includes(c.id)).map((c, i) => (
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
                                  <CircleCheck size={10} /> Pre-Triaged
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
                              <button onClick={() => alert('Case added to Watchlist.')} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">Watch Case</button>
                              <button onClick={() => alert('Generating AI Summary of case documents...')} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors text-center">Summary</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <div onClick={() => alert('Initiating Stripe upgrade for Business Client View module...')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-[#1a4731] transition-colors cursor-pointer">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <BarChart2 size={16} className="text-blue-500" /> Business Client View
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 mb-3">Access live operations and readiness scores for every client you serve.</p>
                      <button className="text-xs font-bold text-[#1a4731] group-hover:underline">Add for $49/mo &rarr;</button>
                    </div>
                    <div onClick={() => alert('Initiating Stripe upgrade for Patient Record Access module...')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:border-[#1a4731] transition-colors cursor-pointer">
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
                        <span className="font-bold text-slate-900">{9 + unlockedCases.length} / 15</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((9 + unlockedCases.length) / 15) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <button onClick={handleBuyTokens} className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md">
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
                    <button onClick={() => alert('Opening Larry Enforcement Module...')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <Shield size={16} className="text-[#1a4731]" /> Larry Enforcement
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-[#1a4731]" />
                    </button>
                    <button onClick={() => setActiveTab('billing')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard size={16} className="text-emerald-500" /> Compassion Balance & Financials
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-500" />
                    </button>
                    <button onClick={() => alert('Syncing with State Regulatory Interfaces...')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 border border-transparent hover:border-slate-200 transition-all group">
                      <div className="flex items-center gap-2 font-medium">
                        <BookOpen size={16} className="text-blue-500" /> Gov / State Interface
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-500" />
                    </button>
                  </div>
                </div>

                {/* Client Reviews & Ratings Sidebar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
            )}

            {activeTab === 'browse' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <Search size={48} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Browse All Open Cases</h2>
                <p className="text-slate-500 max-w-md">Search the national database for compliance disputes, licensing requests, and patient appeals.</p>
                <div className="mt-8 w-full max-w-lg relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search by jurisdiction, issue type, or keyword..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#1a4731] outline-none" onKeyDown={(e) => { if(e.key === 'Enter') alert('Searching National Database for: ' + e.currentTarget.value + '... Connecting to L.A.R.R.Y Index.'); }} />
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Briefcase className="text-[#1a4731]" /> My Active Cases
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {unlockedCases.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">You have no active cases. Unlock cases from the Dashboard.</div>
                  ) : (
                    availableCases.filter(c => unlockedCases.includes(c.id)).map((c, i) => (
                      <div key={i} className="p-6 hover:bg-slate-50">
                        <h4 className="font-bold text-slate-900 text-lg mb-1">{c.title}</h4>
                        <p className="text-sm text-slate-500">{c.state} • {c.clientType} • Case ID: {c.id}</p>
                        <div className="mt-4 flex gap-3">
                          <button onClick={() => alert('Opening secure message thread with client...')} className="px-4 py-2 bg-[#1a4731] text-white rounded-lg text-sm font-bold hover:bg-[#153a28]">Message Client</button>
                          <button onClick={() => alert('Uploading to Secure Vault...')} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50">Submit Document</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <BookOpen size={48} className="text-emerald-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">GGP Law Library</h2>
                <p className="text-slate-500 max-w-md">Access state-by-state regulations, federal compliance standards, and L.A.R.R.Y's legal analysis models.</p>
                <button onClick={() => alert('Accessing State/Federal Statutes Database...')} className="mt-6 px-6 py-3 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-md">Browse Library</button>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <BarChart2 size={48} className="text-blue-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Performance Reports</h2>
                <p className="text-slate-500 max-w-md">View your SLA completion rates, client ratings, and compliance success metrics.</p>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <CreditCard className="text-[#1a4731]" /> Billing & Token Balance
                </h2>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mb-8 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Available Unlock Tokens</p>
                    <h3 className="text-4xl font-black text-slate-900">{tokens}</h3>
                  </div>
                  <button onClick={handleBuyTokens} className="px-6 py-3 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-md shadow-black/10">
                    Purchase 10 Tokens
                  </button>
                </div>
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h3 className="font-bold text-emerald-800 mb-2">Compassion Balance Network</h3>
                  <p className="text-sm text-emerald-700">Contribute unused tokens to the pro-bono network for patients in need to maintain your Tier 1 platform status.</p>
                </div>
              </div>
            )}
                  {activeTab === 'vault' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 max-w-7xl mx-auto">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FolderLock size={20} className="text-indigo-600"/> Legal & Case Vault</h3>
                          <p className="text-sm text-slate-500">Secure, permanent storage for case files, compliance records, and legal documentation.</p>
                        </div>
                        <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer">
                           <FolderLock size={16} /> Upload Record
                           <input type="file" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) alert('File "' + e.target.files[0].name + '" queued. Establishing secure connection to Vault...'); }} />
                        </label>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                             <tr>
                               <th className="p-4">Document Name</th>
                               <th className="p-4">Category</th>
                               <th className="p-4">Date Added</th>
                               <th className="p-4 text-right">Actions</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-slate-50 transition-colors">
                               <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                                 <div className="p-2 bg-indigo-50 text-indigo-500 rounded"><FolderLock size={16}/></div>
                                 <div>
                                   System Initialized Secure Container
                                   <span className="block text-xs text-slate-400 font-normal">Active & Protected</span>
                                 </div>
                               </td>
                               <td className="p-4"><span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">System</span></td>
                               <td className="p-4 text-slate-600">Today</td>
                               <td className="p-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                   <button onClick={() => alert('Opening Secure Document Viewer...')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Eye size={14}/></button>
                                   <button onClick={() => alert('Decrypting and downloading vault asset...')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded shadow-sm"><Download size={14}/></button>
                                 </div>
                               </td>
                             </tr>
                           </tbody>
                        </table>
                      </div>
                    </div>
                  )}





          </div>
        </div>
      </div>
    
      {isIntakeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-[600px] max-w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><PlusCircle size={20} className="text-[#1a4731]" /> Secure Case Intake Portal</h3>
                <p className="text-sm text-slate-500 mt-1">L.A.R.R.Y will automatically scan uploaded documents for compliance risks.</p>
              </div>
              <button onClick={() => setIsIntakeOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Client Jurisdiction / State</label>
                <select className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1a4731]">
                  <option>Select State...</option>
                  <option>Alabama</option>
                  <option>Alaska</option>
                  <option>Arizona</option>
                  <option>Arkansas</option>
                  <option>California</option>
                  <option>Colorado</option>
                  <option>Connecticut</option>
                  <option>Delaware</option>
                  <option>Florida</option>
                  <option>Georgia</option>
                  <option>Hawaii</option>
                  <option>Idaho</option>
                  <option>Illinois</option>
                  <option>Indiana</option>
                  <option>Iowa</option>
                  <option>Kansas</option>
                  <option>Kentucky</option>
                  <option>Louisiana</option>
                  <option>Maine</option>
                  <option>Maryland</option>
                  <option>Massachusetts</option>
                  <option>Michigan</option>
                  <option>Minnesota</option>
                  <option>Mississippi</option>
                  <option>Missouri</option>
                  <option>Montana</option>
                  <option>Nebraska</option>
                  <option>Nevada</option>
                  <option>New Hampshire</option>
                  <option>New Jersey</option>
                  <option>New Mexico</option>
                  <option>New York</option>
                  <option>North Carolina</option>
                  <option>North Dakota</option>
                  <option>Ohio</option>
                  <option>Oklahoma</option>
                  <option>Oregon</option>
                  <option>Pennsylvania</option>
                  <option>Rhode Island</option>
                  <option>South Carolina</option>
                  <option>South Dakota</option>
                  <option>Tennessee</option>
                  <option>Texas</option>
                  <option>Utah</option>
                  <option>Vermont</option>
                  <option>Virginia</option>
                  <option>Washington</option>
                  <option>West Virginia</option>
                  <option>Wisconsin</option>
                  <option>Wyoming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Upload Initial Case Documents (PDF/ZIP)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { alert('Establishing secure vault connection...'); setIsIntakeOpen(false); }}>
                  <FolderLock size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-600">Click to Browse Local System</p>
                  <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, DOCX, ZIP, PNG</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsIntakeOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => { alert('Intake initiated. L.A.R.R.Y is scanning docs...'); setIsIntakeOpen(false); }} className="px-5 py-2.5 font-bold text-white bg-[#1a4731] hover:bg-[#153a28] rounded-xl transition-colors shadow-md">Initialize Case File</button>
            </div>
          </div>
        </div>
      )}
  
    </div>
  );
};

// Simple SparklesIcon Component for L.A.R.R.Y
const SparklesIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);


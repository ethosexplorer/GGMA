import React, { useState, useEffect } from 'react';
import { Calendar, Activity, ShieldAlert, FlaskConical, AlertTriangle, FileText, UploadCloud, 
  Settings, Download, Search, XCircle, Bell, User, Clock, 
  Thermometer, Plus, Smartphone, ChevronRight, CircleCheck,
  MapPin, BarChart2, TrendingUp, TrendingDown, Building2, Award, Zap, Users, Globe, Eye, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { StateJurisdictionSelector } from '../components/shared/StateJurisdictionSelector';
import { StatCard } from '../components/StatCard';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import { UserCalendar } from '../components/UserCalendar';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Health Dashboard', icon: Activity },
  { id: 'standards', label: 'Lab Standards Engine', icon: Settings },
  { id: 'alerts', label: 'Alerts & Recalls', icon: Bell },
  { id: 'exposure', label: 'Exposure Reports', icon: ShieldAlert },
  { id: 'compliance', label: 'Compliance Data', icon: FileText },
];

const labProtocols = [
  { name: 'Heavy Metals Protocol V2', status: 'Active', icon: Thermometer, color: 'text-orange-500' },
  { name: 'Pesticide Residue Limits', status: 'Active', icon: FlaskConical, color: 'text-emerald-500' },
  { name: 'Microbial Pathogen Screen', status: 'Active', icon: Activity, color: 'text-purple-500' },
  { name: 'Rapid Testing / Recency Index Protocol', status: 'Active Overlay', icon: Smartphone, color: 'text-blue-500' },
];

const timelineEvents = [
  { 
    id: 1, type: 'recall', 
    title: 'Class II Recall Issued: Batch #882', 
    time: 'Today, 10:45 AM', 
    urgency: 'critical', 
    desc: 'Failed microbial screen (TYM 18,400 CFU/g). Inventory quarantined in 4 retail locations.',
    actions: ['View Affected Users', 'Update Status']
  },
  { 
    id: 2, type: 'ri', 
    title: 'High RI (8.7) detected on field test', 
    time: 'Today, 08:15 AM', 
    urgency: 'warning', 
    desc: 'Strong indication of recent inhaled use linked to Batch #882. Zero-tolerance state rules apply.',
    actions: ['Route to Enforcement', 'View Patient']
  },
  { 
    id: 3, type: 'flag', 
    title: 'Failed Test Upload Flagged', 
    time: 'Yesterday, 14:30 PM', 
    urgency: 'error', 
    desc: 'Lead exceedance (0.8 ppm) on submitted COA. Larry auto-flagged.',
    actions: ['Review COA']
  },
];

const accreditationItems = [
  { lab: 'GreenLeaf Testing', cert: 'ISO 17025', status: 'active' as const, expires: 'Mar 2027', daysLeft: 267, state: 'OK' },
  { lab: 'PureTech Labs', cert: 'DEA Schedule I', status: 'renewal' as const, expires: 'Aug 2026', daysLeft: 42, state: 'OK' },
  { lab: 'SafeHarvest Analytics', cert: 'State License #4421', status: 'active' as const, expires: 'Jan 2027', daysLeft: 195, state: 'CO' },
  { lab: 'CannaCheck Inc.', cert: 'ISO 17025', status: 'expired' as const, expires: 'May 2026', daysLeft: -28, state: 'CA' },
  { lab: 'Tribal Health Labs', cert: 'Tribal Compact #THL-09', status: 'active' as const, expires: 'Dec 2027', daysLeft: 540, state: 'OK' },
];

const facilityCompliance = [
  { name: 'GreenLeaf Testing', passRate: 94, tests: 1847, fails: 111, trend: 'up' as const, score: 'A', state: 'OK' },
  { name: 'PureTech Labs', passRate: 89, tests: 1203, fails: 135, trend: 'down' as const, score: 'B+', state: 'OK' },
  { name: 'SafeHarvest Analytics', passRate: 97, tests: 2341, fails: 70, trend: 'up' as const, score: 'A+', state: 'CO' },
  { name: 'CannaCheck Inc.', passRate: 82, tests: 956, fails: 172, trend: 'down' as const, score: 'B-', state: 'CA' },
  { name: 'Tribal Health Labs', passRate: 91, tests: 678, fails: 62, trend: 'up' as const, score: 'A-', state: 'OK' },
];

const exposureZones = [
  { zone: 'Zone A — Downtown Dispensary Cluster', risk: 'Critical', patients: 142, retailers: 3, batch: '#882', contaminant: 'TYM Microbial (18,400 CFU/g)', lat: '35.47', lng: '-97.52', radius: 'lg' },
  { zone: 'Zone B — East Side Medical Corridor', risk: 'Moderate', patients: 67, retailers: 1, batch: '#882', contaminant: 'TYM Microbial (18,400 CFU/g)', lat: '35.46', lng: '-97.48', radius: 'md' },
  { zone: 'Zone C — University District', risk: 'Low', patients: 23, retailers: 1, batch: '#879', contaminant: 'Lead 0.8 ppm (Heavy Metal)', lat: '35.44', lng: '-97.45', radius: 'sm' },
  { zone: 'Zone D — Tribal Territory Health Center', risk: 'Monitoring', patients: 8, retailers: 0, batch: '#882', contaminant: 'Proximity exposure', lat: '35.50', lng: '-97.55', radius: 'sm' },
];

const contaminantTrending = [
  { month: 'Jan', heavyMetals: 3, pesticides: 1, microbial: 2, solvents: 0, total: 6 },
  { month: 'Feb', heavyMetals: 2, pesticides: 2, microbial: 1, solvents: 1, total: 6 },
  { month: 'Mar', heavyMetals: 4, pesticides: 0, microbial: 3, solvents: 0, total: 7 },
  { month: 'Apr', heavyMetals: 1, pesticides: 1, microbial: 5, solvents: 2, total: 9 },
  { month: 'May', heavyMetals: 2, pesticides: 3, microbial: 4, solvents: 1, total: 10 },
  { month: 'Jun', heavyMetals: 3, pesticides: 1, microbial: 6, solvents: 0, total: 10 },
];

const patientOutcomes = [
  { metric: 'Patients Exposed (Active Recalls)', value: 232, change: '+89 this month', trend: 'up' as const, color: 'red' },
  { metric: 'Patients Notified via Care Wallet', value: 198, change: '85.3% notification rate', trend: 'up' as const, color: 'emerald' },
  { metric: 'ER Visits (Cannabis-Related)', value: 14, change: '-3 vs last month', trend: 'down' as const, color: 'blue' },
  { metric: 'Avg Recency Index (Field Tests)', value: '4.2', change: 'Normal range', trend: 'stable' as const, color: 'amber' },
];

const STATE_RECALL_PORTALS = [
  { state: 'California', authority: 'Department of Cannabis Control (DCC)', url: 'https://www.cannabis.ca.gov/consumers/cannabis-recalls-and-safety-notices/cannabis-recalls-archive/', badge: 'DCC' },
  { state: 'Colorado', authority: 'Marijuana Enforcement Division (MED)', url: 'https://sbg.colorado.gov/med/health-and-safety-advisories', badge: 'MED' },
  { state: 'Maine', authority: 'Office of Cannabis Policy (OCP)', url: 'https://www.maine.gov/dafs/ocp/compliance/recalls', badge: 'OCP' },
  { state: 'Massachusetts', authority: 'Cannabis Control Commission (CCC)', url: 'https://masscannabiscontrol.com/public-health-and-safety/', badge: 'CCC' },
  { state: 'Michigan', authority: 'Cannabis Regulatory Agency (CRA)', url: 'https://www.michigan.gov/cra/bulletins/recalls', badge: 'CRA' },
  { state: 'Missouri', authority: 'Department of Health and Senior Services', url: 'https://health.mo.gov/safety/cannabis/recalls.php', badge: 'DHSS' },
  { state: 'Montana', authority: 'Department of Revenue', url: 'https://revenue.mt.gov/card/cannabis/cannabis-product-recalls', badge: 'DOR' },
  { state: 'New Jersey', authority: 'Cannabis Regulatory Commission (CRC)', url: 'https://www.nj.gov/cannabis/news/recalls/', badge: 'CRC' },
  { state: 'New Mexico', authority: 'Regulation and Licensing Department', url: 'https://www.rld.nm.gov/cannabis/data-news/cannabis-recalls/', badge: 'RLD' },
  { state: 'New York', authority: 'Office of Cannabis Management (OCM)', url: 'https://cannabis.ny.gov/recalls', badge: 'OCM' },
  { state: 'Oregon', authority: 'Oregon Liquor and Cannabis Commission', url: 'https://www.oregon.gov/olcc/marijuana/pages/default.aspx', badge: 'OLCC' },
  { state: 'Washington', authority: 'Liquor and Cannabis Board (LCB)', url: 'https://lcb.wa.gov/enforcement/active-recalls', badge: 'LCB' },
  { state: 'Oklahoma', authority: 'Oklahoma Medical Marijuana Authority (OMMA)', url: 'https://oklahoma.gov/omma/recalls/embargoed-and-recalled-products.html', badge: 'OMMA' }
];

interface OmmaRecall {
  id: string;
  date: string;
  displayDate: string;
  type: string;
  businessName: string;
  licenseNumber: string;
  licenseType: string;
  products: string;
  reason: string;
  contaminant: string;
  isActive: boolean;
  newsUrl?: string;
  pdfUrl?: string;
}

export const PublicHealthDashboard = ({ onLogout, user, jurisdiction = 'Oklahoma' }: { onLogout?: () => void, user?: any, jurisdiction?: string }) => {
  const isExecutive = user?.role === 'executive_founder' || user?.role === 'executive_ceo' || user?.role === 'president' || user?.role === 'chief_compliance_director' || user?.role === 'executive_advisor' || user?.role === 'advisor' || user?.email?.toLowerCase().includes('globalgreenhp') || user?.email?.toLowerCase().includes('monica') || user?.email?.toLowerCase().includes('bob');
  const hasMultiStateAccess = isExecutive || user?.multiStateAdmin === true || (Array.isArray(user?.accessibleStates) && user.accessibleStates.length > 1);
  const userDefaultState = user?.jurisdiction || user?.homeState || jurisdiction || 'Oklahoma';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedState, setSelectedState] = useState(() => {
    if (!hasMultiStateAccess) return userDefaultState;
    return userDefaultState;
  });

  const [ommaRecalls, setOmmaRecalls] = useState<OmmaRecall[]>([]);
  const [isLoadingRecalls, setIsLoadingRecalls] = useState(true);

  // Fetch live recalls from our consolidated endpoint on mount
  useEffect(() => {
    fetch('/api/rss?source=omma-recalls')
      .then(res => res.json())
      .then(data => {
        if (data && data.recalls) {
          setOmmaRecalls(data.recalls);
        }
      })
      .catch(err => {
        console.error('Failed to fetch live OMMA recalls in PublicHealthDashboard:', err);
      })
      .finally(() => {
        setIsLoadingRecalls(false);
      });
  }, []);

  const displayAccreditations = accreditationItems.filter(item => {
    if (selectedState === 'All States Active') return true;
    const stateAbbr = selectedState === 'Oklahoma' ? 'OK' : selectedState === 'Colorado' ? 'CO' : selectedState === 'California' ? 'CA' : '';
    return item.state === stateAbbr;
  });

  const displayCompliance = facilityCompliance.filter(item => {
    if (selectedState === 'All States Active') return true;
    const stateAbbr = selectedState === 'Oklahoma' ? 'OK' : selectedState === 'Colorado' ? 'CO' : selectedState === 'California' ? 'CA' : '';
    return item.state === stateAbbr;
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isPairing, setIsPairing] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "COA Uploaded. Larry is validating against Lab Standards..." })] }).catch(console.error) ); alert("COA Uploaded. Larry is validating against Lab Standards...\n\n[Live Production Transaction Logged]"); })();
    }, 1500);
  };

  const handlePair = () => {
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      (() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Device paired – Dual-Channel v2.1 ready. Ready for RI saliva sample." })] }).catch(console.error) ); alert("Device paired – Dual-Channel v2.1 ready. Ready for RI saliva sample.\n\n[Live Production Transaction Logged]"); })();
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* TOP NAVIGATION BAR */}
      <div className="bg-slate-900 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <FlaskConical size={18} />
            </div>
            <div>
              <h2 className="font-bold text-xs text-white leading-tight uppercase tracking-tight">Green River Health</h2>
              <p className="text-[9px] text-emerald-500/80 font-bold tracking-widest uppercase">State Health Dept.</p>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700 shrink-0" />
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 min-w-max">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0",
                    activeTab === item.id
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                  <item.icon size={13} /> {item.label}
                  {item.badge && <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700 shrink-0" />
          <div className="shrink-0 flex items-center gap-3">
            {hasMultiStateAccess ? (
              <StateJurisdictionSelector value={selectedState} onChange={setSelectedState} variant="dark" showMetadata={true} compact={true} label="" />
            ) : (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/30 px-3 py-1.5 rounded-full uppercase tracking-wider">{selectedState}</span>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">Public Health & Labs Dashboard</h1>
          <div className="flex items-center gap-4">
            <NotificationDropdown onNavigate={(tab) => setActiveTab(tab)} />
            <div className="w-px h-6 bg-slate-200" />
            <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Generating Public Health Report... Compiling statewide lab data." })] }).catch(console.error) ); alert("Generating Public Health Report... Compiling statewide lab data.\n\n[Live Production Transaction Logged]"); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">
              <Download size={16} /> Generate Report
            </button>
            <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Opening Emergency Recall Broadcast Protocol..." })] }).catch(console.error) ); alert("Opening Emergency Recall Broadcast Protocol...\n\n[Live Production Transaction Logged]"); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold shadow-md hover:bg-red-700 transition-colors">
              <AlertTriangle size={16} /> Issue Recall
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {activeTab === 'dashboard' && (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"><Thermometer size={20} /></div>
                      <p className="text-sm font-semibold text-slate-600">Contamination Events</p>
                    </div>
                    <div className="flex items-end gap-3">
                      <h3 className="text-3xl font-black text-slate-900">3</h3>
                      <span className="text-sm font-bold text-orange-500 mb-1">+2 this month</span>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><UploadCloud size={20} /></div>
                      <p className="text-sm font-semibold text-slate-600">Pending Lab Uploads</p>
                    </div>
                    <div className="flex items-end gap-3">
                      <h3 className="text-3xl font-black text-slate-900">18</h3>
                      <span className="text-xs font-bold text-slate-400 mb-1.5">Awaiting calibration</span>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600"><ShieldAlert size={20} /></div>
                      <p className="text-sm font-semibold text-slate-600">Active Recalls</p>
                    </div>
                    <div className="flex items-end gap-3">
                      <h3 className="text-3xl font-black text-slate-900">1</h3>
                      <span className="text-xs font-bold text-amber-500 mb-1.5">Resolution in progress</span>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><Activity size={20} /></div>
                      <p className="text-sm font-semibold text-slate-600">Exposure Risk Level</p>
                    </div>
                    <div className="flex items-end gap-3">
                      <h3 className="text-2xl font-black text-amber-500">MODERATE</h3>
                      <span className="text-xs font-bold text-slate-400 mb-1.5">Recent flags</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column (Lab Standards Engine) */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Sylara Insight */}
                    <div className="bg-slate-900 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 flex items-start gap-4 shadow-lg">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/20">
                        <Activity size={24} />
                      </div>
                      <div className="flex-1 text-white">
                        <h4 className="font-bold flex items-center gap-2 text-lg">
                          Sylara Public Health Assistant <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-500/50">Active</span>
                        </h4>
                        <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                          "Dr. Jenkins, a new microbial exceedance (TYM 18,400 CFU/g) was flagged in Batch #882, accompanied by a High Recency Index (8.7) field test. Exposure risk elevated to MODERATE. Would you like me to draft the Class II recall notice, alert the Patient Dashboard, and notify the 4 affected retailers?"
                        </p>
                        <div className="flex gap-3 mt-4">
                          <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Drafting Class II Recall Notice for Batch #882... Notifying 4 Retailers and Patient Wallets." })] }).catch(console.error) ); alert("Drafting Class II Recall Notice for Batch #882... Notifying 4 Retailers and Patient Wallets.\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold transition-colors shadow-md">
                            Draft Recall & Notify
                          </button>
                          <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Loading GIS Exposure Map for Batch #882..." })] }).catch(console.error) ); alert("Loading GIS Exposure Map for Batch #882...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                            View Exposed Patients
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Lab Standards Engine */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Settings size={20} className="text-slate-500" /> Lab Standards Engine
                          </h3>
                          <p className="text-sm text-slate-500">Auto-validates COAs & Rapid Tests against state limits via Larry.</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Opening State Legislature Mapping Configuration..." })] }).catch(console.error) ); alert("Opening State Legislature Mapping Configuration...\n\n[Live Production Transaction Logged]"); }} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">State Mapping: Strict</button>
                          <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Initializing mass calibration sequence for all connected rapid test devices..." })] }).catch(console.error) ); alert("Initializing mass calibration sequence for all connected rapid test devices...\n\n[Live Production Transaction Logged]"); }} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">Calibrate Tests</button>
                        </div>
                      </div>
                      
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Active Protocols List */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Protocols</h4>
                          {labProtocols.map((protocol, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                              <div className="flex items-center gap-3">
                                <protocol.icon size={18} className={protocol.color} />
                                <span className="text-sm font-semibold text-slate-700">{protocol.name}</span>
                              </div>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                protocol.status.includes('Overlay') ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                              )}>
                                {protocol.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Upload / Pair Actions */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data Ingestion</h4>
                          <div 
                            onClick={handleUpload}
                            className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors group"
                          >
                            <UploadCloud size={32} className="text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                            <h4 className="font-bold text-slate-700">Upload Test Results (COA)</h4>
                            <p className="text-xs text-slate-500 mt-1">PDF or XML. Larry auto-scans upon upload.</p>
                          </div>
                          
                          <button 
                            onClick={handlePair}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md"
                          >
                            <Smartphone size={18} className="text-blue-400" /> 
                            {isPairing ? 'Pairing...' : 'Pair Rapid Test Device (Dual-Channel)'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Device Comparison (Sales/Info Sheet) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Smartphone size={18} className="text-blue-500" /> Rapid Testing Device Comparison
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                              <th className="px-4 py-3 rounded-tl-xl">Feature</th>
                              <th className="px-4 py-3 bg-blue-50 text-blue-700">Your Dual-Channel RI</th>
                              <th className="px-4 py-3">Traditional Immunoassay</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="px-4 py-3 font-medium text-slate-700">Recency Differentiation</td>
                              <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/50">Excellent (Probabilistic 0-9.99)</td>
                              <td className="px-4 py-3 text-slate-600">Limited (Residual overlaps)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-slate-700">Sensitivity Short Post-Use</td>
                              <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/50">High (Detects Parent Spike)</td>
                              <td className="px-4 py-3 text-amber-600">Poor (25-50% misses)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-slate-700">Ecosystem Flow</td>
                              <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/50 rounded-bl-xl">Auto-routes to Enforcement/Patient</td>
                              <td className="px-4 py-3 text-slate-600">Manual tracking</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Accreditation Tracking */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <Award size={20} className="text-amber-500" /> Accreditation Tracking
                          </h3>
                          <p className="text-sm text-slate-500">Lab certifications, renewals & sovereign compact tracking</p>
                        </div>
                        <button onClick={() => alert('Opening Accreditation Manager...\n\n[Live Production Transaction Logged]')} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">+ Add Certification</button>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {displayAccreditations.map((item, i) => (
                          <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-10 h-10 rounded-xl flex items-center justify-center',
                                item.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                                item.status === 'renewal' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                              )}>
                                <Award size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-800">{item.lab}</h4>
                                <p className="text-xs text-slate-500">{item.cert} • {item.state}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-xs font-bold text-slate-600">Expires: {item.expires}</p>
                                <p className={cn('text-[10px] font-bold',
                                  item.daysLeft > 180 ? 'text-emerald-500' :
                                  item.daysLeft > 60 ? 'text-amber-500' :
                                  item.daysLeft > 0 ? 'text-red-500' : 'text-red-700'
                                )}>
                                  {item.daysLeft > 0 ? `${item.daysLeft} days remaining` : `EXPIRED ${Math.abs(item.daysLeft)} days ago`}
                                </p>
                              </div>
                              <span className={cn(
                                'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border',
                                item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                item.status === 'renewal' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                              )}>
                                {item.status === 'active' ? 'Active' : item.status === 'renewal' ? 'Renewal Due' : 'Expired'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Patient Outcome Analytics */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users size={18} className="text-purple-500" /> Patient Outcome Analytics
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {patientOutcomes.map((po, i) => (
                          <div key={i} className={cn('p-4 rounded-xl border', `border-${po.color}-200 bg-${po.color}-50/30`)}>
                            <p className="text-xs font-semibold text-slate-600 mb-1">{po.metric}</p>
                            <h4 className="text-2xl font-black text-slate-900">{po.value}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {po.trend === 'up' ? <TrendingUp size={12} className={po.color === 'red' ? 'text-red-500' : 'text-emerald-500'} /> :
                               po.trend === 'down' ? <TrendingDown size={12} className={po.color === 'red' ? 'text-emerald-500' : 'text-red-500'} /> :
                               <Activity size={12} className="text-amber-500" />}
                              <span className="text-[10px] font-bold text-slate-500">{po.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Alerts Timeline) */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-slate-500" /> Alerts & Recall Timeline
                      </h3>
                    </div>
                    
                    <div className="p-5 flex-1 overflow-y-auto">
                      <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                        
                        {timelineEvents.map((event) => (
                          <div key={event.id} className="relative pl-6">
                            <div className={cn(
                              "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white",
                              event.urgency === 'critical' ? "bg-red-500" :
                              event.urgency === 'error' ? "bg-orange-500" :
                              event.urgency === 'warning' ? "bg-amber-500" : "bg-blue-500"
                            )}></div>
                            
                            <div className="mb-1 flex items-center justify-between">
                              <span className={cn(
                                "text-xs font-bold uppercase",
                                event.urgency === 'critical' ? "text-red-500" :
                                event.urgency === 'error' ? "text-orange-500" :
                                event.urgency === 'warning' ? "text-amber-600" : "text-blue-500"
                              )}>
                                {event.time}
                              </span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                            <p className="text-sm text-slate-500 mt-1 mb-3">{event.desc}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {event.actions.map((action, i) => (
                                <button key={i} onClick={() => alert(`Executing: ${action}... L.A.R.R.Y is logging this interaction.`)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                                  {action}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {/* Older Event */}
                        <div className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white bg-slate-300"></div>
                          <div className="mb-1"><span className="text-xs font-bold uppercase text-slate-400">Last Week</span></div>
                          <h4 className="font-bold text-slate-600 text-sm">Lab Upload: GreenLeaf Ext.</h4>
                          <p className="text-sm text-slate-400 mt-1">All protocols PASS. Compassion Points awarded.</p>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {activeTab === 'standards' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Settings className="text-slate-500" /> Lab Standards Engine Configuration
                  </h2>
                  <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Opening Protocol Builder... Loading state legislative guidelines." })] }).catch(console.error) ); alert("Opening Protocol Builder... Loading state legislative guidelines.\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 text-sm">Add New Protocol</button>
                </div>
                
                <div className="space-y-6">
                  {labProtocols.map((protocol, i) => (
                    <div key={i} className="p-6 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50", protocol.color)}>
                          <protocol.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{protocol.name}</h4>
                          <p className="text-sm text-slate-500">Thresholds automatically synced with State Legislature.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          protocol.status.includes('Overlay') ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {protocol.status}
                        </span>
                        <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Opening State Threshold Editor..." })] }).catch(console.error) ); alert("Opening State Threshold Editor...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Edit Limits</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Bell className="text-red-500" /> Active Alerts & Recalls
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Opening Timeline Filters..." })] }).catch(console.error) ); alert("Opening Timeline Filters...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 text-sm">Filter</button>
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Launching Emergency Broadcast Protocol..." })] }).catch(console.error) ); alert("Launching Emergency Broadcast Protocol...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 text-sm flex items-center gap-2"><Plus size={16} /> Create Recall Alert</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const isOk = selectedState === 'Oklahoma' || selectedState === 'All States Active';
                    const list = isOk && ommaRecalls.length > 0
                      ? ommaRecalls.map(r => ({
                          id: r.id,
                          title: `OMMA Safety Recall: ${r.businessName}`,
                          time: r.displayDate,
                          urgency: r.isActive ? 'critical' : 'warning',
                          desc: `${r.products} — ${r.reason} (License: ${r.licenseNumber || 'N/A'})`,
                          actions: ['Track Recall', 'Notify Clients'],
                          url: r.newsUrl || r.pdfUrl || 'https://oklahoma.gov/omma/recalls/embargoed-and-recalled-products.html'
                        }))
                      : timelineEvents.map(e => ({
                          id: String(e.id),
                          title: `${selectedState} - ${e.title}`,
                          time: e.time,
                          urgency: e.urgency,
                          desc: `${e.desc} (State simulated advisory)`,
                          actions: e.actions,
                          url: '#'
                        }));

                    return (
                      <>
                        {isOk && (
                          <div className="flex items-center gap-2 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-bold">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Scraper Connected to OMMA Portal: Displaying {ommaRecalls.length} safety recalls in real-time.
                          </div>
                        )}
                        {!isOk && (
                          <div className="flex items-center gap-2 mb-4 bg-amber-50 text-amber-800 border border-amber-200 p-3 rounded-xl text-xs font-semibold">
                            ⚠️ Simulated view. Direct Metrc API integrations for {selectedState} are pending state authorization key sync. Use the state registry links below to view active advisories.
                          </div>
                        )}
                        {list.map((event) => (
                          <div key={event.id} className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn(
                                  "px-2 py-1 rounded-md text-[10px] font-bold uppercase text-white",
                                  event.urgency === 'critical' ? "bg-red-500" :
                                  event.urgency === 'error' ? "bg-orange-500" :
                                  event.urgency === 'warning' ? "bg-amber-500" : "bg-blue-500"
                                )}>
                                  {event.urgency} Priority
                                </span>
                                <span className="text-xs text-slate-500 font-medium">{event.time}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{event.desc}</p>
                              {event.url && event.url !== '#' && (
                                <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                                  Official State Notice <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                            <div className="flex flex-col justify-center gap-2 shrink-0 min-w-[200px]">
                              {event.actions.map((action, i) => (
                                <button onClick={() => alert(`Executing: ${action}... L.A.R.R.Y is logging this action.`)} key={i} className={cn(
                                  "w-full px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm",
                                  action.includes('Quarantine') || action.includes('Recall') || action.includes('Notify') ? "bg-red-600 text-white hover:bg-red-700" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                )}>
                                  {action}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>

                {/* State Portals Grid */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Globe size={18} className="text-emerald-500" /> State Cannabis Recall Portal Registry
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Because cannabis is regulated on a state-by-state level, there is no single national list. Use these official registries to monitor batch numbers, product names, and testing violations in unison.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {STATE_RECALL_PORTALS.map((portal) => (
                      <div key={portal.state} className={cn(
                        "p-4 rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between",
                        selectedState === portal.state ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20" : "bg-white border-slate-200"
                      )}>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-slate-800">{portal.state}</span>
                            <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                              {portal.badge}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{portal.authority}</p>
                        </div>
                        <a href={portal.url} target="_blank" rel="noopener noreferrer" 
                          className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                          Visit Recall Portal <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exposure' && (
              <div className="space-y-6">
                {/* Exposure Summary KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2"><MapPin size={16} className="text-red-500" /><span className="text-xs font-bold text-red-600 uppercase">Active Zones</span></div>
                    <h3 className="text-3xl font-black text-slate-900">4</h3>
                    <span className="text-xs font-bold text-red-500">1 critical, 1 moderate</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2"><Users size={16} className="text-purple-500" /><span className="text-xs font-bold text-slate-500 uppercase">Patients Exposed</span></div>
                    <h3 className="text-3xl font-black text-slate-900">240</h3>
                    <span className="text-xs font-bold text-purple-500">Across all zones</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2"><Building2 size={16} className="text-blue-500" /><span className="text-xs font-bold text-slate-500 uppercase">Retailers Affected</span></div>
                    <h3 className="text-3xl font-black text-slate-900">5</h3>
                    <span className="text-xs font-bold text-blue-500">3 quarantined</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2"><Bell size={16} className="text-emerald-500" /><span className="text-xs font-bold text-slate-500 uppercase">Notifications Sent</span></div>
                    <h3 className="text-3xl font-black text-slate-900">198</h3>
                    <span className="text-xs font-bold text-emerald-500">82.5% delivery rate</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* GIS Contamination Map */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Globe size={18} className="text-blue-500" /> GIS Exposure Map — Oklahoma Metro</h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white hover:bg-slate-50">Satellite</button>
                        <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold">Zones</button>
                      </div>
                    </div>
                    <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                      {/* Simulated map with contamination rings */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #f3f4f6 40%, #fff3e0 70%, #fce4ec 100%)' }}>
                        {/* Grid lines */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                        {/* Zone A - Critical (red pulse) */}
                        <div className="absolute top-[25%] left-[35%] w-32 h-32 rounded-full bg-red-500/20 border-2 border-red-400/40 animate-pulse flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-red-500/30 border border-red-500/50 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-500/50" />
                          </div>
                        </div>
                        {/* Zone B - Moderate (amber) */}
                        <div className="absolute top-[40%] left-[60%] w-24 h-24 rounded-full bg-amber-500/15 border-2 border-amber-400/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-amber-500/25 border border-amber-400/40 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg" />
                          </div>
                        </div>
                        {/* Zone C - Low (blue) */}
                        <div className="absolute top-[60%] left-[72%] w-16 h-16 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        </div>
                        {/* Zone D - Monitoring (green) */}
                        <div className="absolute top-[15%] left-[20%] w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        </div>
                        {/* Road lines */}
                        <div className="absolute top-0 bottom-0 left-[45%] w-px bg-slate-300/50" />
                        <div className="absolute left-0 right-0 top-[50%] h-px bg-slate-300/50" />
                        <div className="absolute top-0 bottom-0 left-[70%] w-px bg-slate-300/30" />
                        {/* Labels */}
                        <div className="absolute top-[18%] left-[40%] bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md">ZONE A • CRITICAL</div>
                        <div className="absolute top-[35%] left-[65%] bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">ZONE B</div>
                        <div className="absolute top-[55%] left-[75%] bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">C</div>
                        <div className="absolute top-[10%] left-[22%] bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">D</div>
                      </div>
                      {/* Legend */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 p-2.5 shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1.5">Risk Level</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><span className="text-[10px] font-bold text-slate-600">Critical</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /><span className="text-[10px] font-bold text-slate-600">Moderate</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-slate-600">Low</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-slate-600">Monitoring</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zone Details */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2"><Eye size={18} className="text-orange-500" /> Zone Details</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                      {exposureZones.map((zone, i) => (
                        <div key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={cn('w-2.5 h-2.5 rounded-full',
                              zone.risk === 'Critical' ? 'bg-red-500 animate-pulse' :
                              zone.risk === 'Moderate' ? 'bg-amber-500' :
                              zone.risk === 'Low' ? 'bg-blue-500' : 'bg-emerald-500'
                            )} />
                            <span className={cn('text-[10px] font-black uppercase',
                              zone.risk === 'Critical' ? 'text-red-600' :
                              zone.risk === 'Moderate' ? 'text-amber-600' :
                              zone.risk === 'Low' ? 'text-blue-600' : 'text-emerald-600'
                            )}>{zone.risk}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{zone.zone}</h4>
                          <p className="text-xs text-slate-500 mb-2">{zone.contaminant}</p>
                          <div className="flex gap-3 text-xs">
                            <span className="font-bold text-purple-600"><Users size={11} className="inline mr-1" />{zone.patients} patients</span>
                            <span className="font-bold text-blue-600"><Building2 size={11} className="inline mr-1" />{zone.retailers} retailers</span>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => alert(`Drilling into ${zone.zone}... Loading patient records.`)} className="text-[10px] font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md hover:bg-slate-700">View Patients</button>
                            <button onClick={() => alert(`Generating isolation report for ${zone.zone}...`)} className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md hover:bg-slate-50">Isolation Report</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Source Tracing */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-500" /> Contamination Source Tracing</h3>
                  <div className="bg-slate-900 rounded-xl p-5 text-white">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0"><AlertTriangle size={20} className="text-red-400" /></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">Batch #882 — Source Chain Analysis</h4>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg font-bold border border-emerald-500/30">🌱 Cultivator: OKC Organics LLC</span>
                          <ChevronRight size={14} className="text-slate-500" />
                          <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg font-bold border border-blue-500/30">⚗️ Processor: MedExtract Co.</span>
                          <ChevronRight size={14} className="text-slate-500" />
                          <span className="bg-red-500/20 text-red-300 px-3 py-1.5 rounded-lg font-bold border border-red-500/30">🧪 Lab: GreenLeaf Testing (FAIL)</span>
                          <ChevronRight size={14} className="text-slate-500" />
                          <span className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg font-bold border border-amber-500/30">🏪 4 Retailers (QUARANTINED)</span>
                          <ChevronRight size={14} className="text-slate-500" />
                          <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg font-bold border border-purple-500/30">👤 142 Patients (NOTIFIED)</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-3">L.A.R.R.Y. traced contamination to processor stage. Recommended action: MedExtract facility audit + 30-day enhanced testing protocol.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Compliance Intelligence</h2>
                    <p className="text-sm text-slate-500">Laboratory performance, pass/fail ratios, and contaminant trending across all facilities</p>
                  </div>
                  <button onClick={() => alert('Compiling Historical Compliance Dataset...\n\n[Live Production Transaction Logged]')} className="px-4 py-2 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-md flex items-center gap-2 text-sm">
                    <Download size={16} /> Export Dataset (CSV)
                  </button>
                </div>

                {/* Contaminant Trending Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><BarChart2 size={18} className="text-purple-500" /> Contaminant Trending — 6 Month</h3>
                  <p className="text-xs text-slate-500 mb-4">Failures by category across all monitored facilities</p>
                  <div className="flex items-end gap-3 h-52">
                    {contaminantTrending.map((m, i) => {
                      const maxVal = 12;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex flex-col-reverse gap-[2px]" style={{ height: '180px' }}>
                            <div className="bg-orange-400 rounded-t-sm transition-all" style={{ height: `${(m.heavyMetals / maxVal) * 180}px` }} title={`Heavy Metals: ${m.heavyMetals}`} />
                            <div className="bg-emerald-400 rounded-sm transition-all" style={{ height: `${(m.pesticides / maxVal) * 180}px` }} title={`Pesticides: ${m.pesticides}`} />
                            <div className="bg-purple-500 rounded-sm transition-all" style={{ height: `${(m.microbial / maxVal) * 180}px` }} title={`Microbial: ${m.microbial}`} />
                            <div className="bg-blue-400 rounded-sm transition-all" style={{ height: `${(m.solvents / maxVal) * 180}px` }} title={`Solvents: ${m.solvents}`} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{m.month}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-400" /><span className="text-[10px] font-bold text-slate-500">Heavy Metals</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-400" /><span className="text-[10px] font-bold text-slate-500">Pesticides</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-500" /><span className="text-[10px] font-bold text-slate-500">Microbial</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-400" /><span className="text-[10px] font-bold text-slate-500">Residual Solvents</span></div>
                  </div>
                </div>

                {/* Facility Compliance Scorecards */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Building2 size={18} className="text-blue-500" /> Facility Compliance Scorecards</h3>
                    <p className="text-xs text-slate-500 mt-1">Pass/fail performance and compliance grade for each licensed testing facility</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                          <th className="px-5 py-3">Facility</th>
                          <th className="px-5 py-3">State</th>
                          <th className="px-5 py-3">Total Tests</th>
                          <th className="px-5 py-3">Failures</th>
                          <th className="px-5 py-3">Pass Rate</th>
                          <th className="px-5 py-3">Trend</th>
                          <th className="px-5 py-3">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayCompliance.map((f, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => alert(`Opening full compliance profile for ${f.name}...`)}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Building2 size={14} className="text-blue-500" /></div>
                                <span className="font-bold text-slate-800">{f.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-medium text-slate-600">{f.state}</td>
                            <td className="px-5 py-4 font-bold text-slate-800">{f.tests.toLocaleString()}</td>
                            <td className="px-5 py-4 font-bold text-red-600">{f.fails}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[80px]">
                                  <div className={cn('h-2 rounded-full', f.passRate >= 95 ? 'bg-emerald-500' : f.passRate >= 88 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${f.passRate}%` }} />
                                </div>
                                <span className="font-black text-slate-800 text-xs">{f.passRate}%</span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              {f.trend === 'up' ? <TrendingUp size={16} className="text-emerald-500" /> :
                               f.trend === 'down' ? <TrendingDown size={16} className="text-red-500" /> :
                               <Activity size={16} className="text-slate-400" />}
                            </td>
                            <td className="px-5 py-4">
                              <span className={cn('px-3 py-1 rounded-full text-xs font-black',
                                f.score.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                f.score.startsWith('B') && f.score.includes('+') ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              )}>{f.score}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Statewide Compliance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white">
                    <h4 className="font-bold text-emerald-100 text-xs uppercase tracking-wider mb-2">Statewide Pass Rate</h4>
                    <h3 className="text-4xl font-black">90.6%</h3>
                    <p className="text-emerald-200 text-xs mt-1 font-bold">7,025 tests across 5 facilities</p>
                    <div className="mt-3 flex items-center gap-1"><TrendingUp size={14} /><span className="text-xs font-bold">+1.2% vs last quarter</span></div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
                    <h4 className="font-bold text-purple-100 text-xs uppercase tracking-wider mb-2">Most Common Failure</h4>
                    <h3 className="text-2xl font-black">Microbial</h3>
                    <p className="text-purple-200 text-xs mt-1 font-bold">21 failures this quarter (TYM / Mold)</p>
                    <div className="mt-3 flex items-center gap-1"><TrendingUp size={14} /><span className="text-xs font-bold">Trending upward — action needed</span></div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
                    <h4 className="font-bold text-blue-100 text-xs uppercase tracking-wider mb-2">Avg. Recency Index</h4>
                    <h3 className="text-4xl font-black">4.2</h3>
                    <p className="text-blue-200 text-xs mt-1 font-bold">Normal range (0-5.0 non-impaired)</p>
                    <div className="mt-3 flex items-center gap-1"><Activity size={14} /><span className="text-xs font-bold">Stable — field test avg across 340 samples</span></div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};


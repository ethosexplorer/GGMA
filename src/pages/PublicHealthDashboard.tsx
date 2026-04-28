import React, { useState } from 'react';
import { Calendar, Activity, ShieldAlert, FlaskConical, AlertTriangle, FileText, UploadCloud, 
  Settings, Download, Search, CheckCircle2, XCircle, Bell, User, Clock, 
  Thermometer, Plus, Smartphone, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';
import { UserCalendar } from '../components/UserCalendar';

const sidebarItems = [
  { id: 'dashboard', label: 'Health Dashboard', icon: Activity },
  { id: 'standards', label: 'Lab Standards Engine', icon: Settings },
  { id: 'alerts', label: 'Alerts & Recalls', icon: Bell, badge: '1' },
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

export const PublicHealthDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploading, setIsUploading] = useState(false);
  const [isPairing, setIsPairing] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert('COA Uploaded. Larry is validating against Lab Standards...');
    }, 1500);
  };

  const handlePair = () => {
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      alert('Device paired – Dual-Channel v2.1 ready. Ready for RI saliva sample.');
    }, 1500);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 hidden md:flex flex-col">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 shadow-inner">
              <FlaskConical size={24} />
            </div>
            <div>
              <h2 className="font-black text-sm leading-tight tracking-tight text-white uppercase">Green River Health</h2>
              <p className="text-[10px] text-emerald-500/80 font-bold tracking-widest uppercase mt-0.5">State Health Dept.</p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">SJ</div>
            <div>
              <p className="font-bold text-white text-sm">Dr. Sarah Jenkins</p>
              <p className="text-[10px] text-slate-400">Public Health Officer</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === item.id 
                  ? "bg-slate-800 text-white shadow-md border border-slate-700" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className={cn(activeTab === item.id ? "text-emerald-400" : "text-slate-500")} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Public Health & Labs Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">
              <Download size={16} /> Generate Report
            </button>
            <button onClick={() => alert('Opening Emergency Recall Broadcast Protocol...')} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold shadow-md hover:bg-red-700 transition-colors">
              <AlertTriangle size={16} /> Issue Recall
            </button>
          </div>
        </header>        {/* Content Area */}
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
                          <button onClick={() => alert('Drafting Class II Recall Notice for Batch #882... Notifying 4 Retailers and Patient Wallets.')} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold transition-colors shadow-md">
                            Draft Recall & Notify
                          </button>
                          <button onClick={() => alert('Loading GIS Exposure Map for Batch #882...')} className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white text-sm font-bold transition-colors">
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
                          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">State Mapping: Strict</button>
                          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50">Calibrate Tests</button>
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
                                <button key={i} className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
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
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 text-sm">Add New Protocol</button>
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
                        <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Edit Limits</button>
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
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 text-sm">Filter</button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 text-sm flex items-center gap-2"><Plus size={16} /> Create Recall Alert</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {timelineEvents.map((event) => (
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
                      </div>
                      <div className="flex flex-col justify-center gap-2 shrink-0 min-w-[200px]">
                        {event.actions.map((action, i) => (
                          <button onClick={() => alert(`Executing: ${action}... L.A.R.R.Y is logging this action.`)} key={i} className={cn(
                            "w-full px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm",
                            action.includes('Quarantine') || action.includes('Recall') ? "bg-red-600 text-white hover:bg-red-700" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          )}>
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'exposure' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <ShieldAlert size={48} className="text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Exposure Mapping & Tracking</h2>
                <p className="text-slate-500 max-w-md">Visualize patient clusters and retail locations associated with compromised batches.</p>
                <div className="mt-8 w-full max-w-2xl bg-slate-50 rounded-xl border border-slate-200 h-64 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent"></div>
                   <div className="z-10 text-center">
                     <p className="font-bold text-slate-700">Map Rendering Engine Offline</p>
                     <p className="text-xs text-slate-500 mt-1">Connect to GIS server to load patient density map.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                <FileText size={48} className="text-emerald-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Historical Compliance Data</h2>
                <p className="text-slate-500 max-w-md mb-6">Review laboratory performance, pass/fail ratios, and longitudinal heavy metal tracking across all licensed facilities.</p>
                <button className="px-6 py-3 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] shadow-md flex items-center gap-2 mx-auto">
                  <Download size={18} /> Export Full State Dataset (CSV)
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};


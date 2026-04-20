import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Landmark, FileCheck, DollarSign, Activity, 
  Map as MapIcon, Settings, Download, Search, AlertCircle, FileText, CheckCircle2,
  TrendingUp, Users, ShieldAlert, Bot, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export const StateAuthorityDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const getRoleTitle = () => {
    if (user?.role === 'regulator_city') return 'City Regulator';
    if (user?.role === 'regulator_county') return 'County Regulator';
    if (user?.role === 'regulator_state') return 'Marijuana Authority';
    if (user?.role === 'regulator_mayor') return 'Office of the Mayor';
    if (user?.role === 'regulator_senator') return 'Senatorial Oversight';
    if (user?.role === 'regulator_governor') return 'Office of the Governor';
    if (user?.role === 'regulator_us_attorney') return 'US Attorney Monitoring';
    return 'Regulator Authority';
  };

  const getJurisdiction = () => {
    if (user?.role === 'regulator_city') return 'MUNICIPAL';
    if (user?.role === 'regulator_county') return 'COUNTY';
    if (user?.role?.includes('mayor')) return 'CITY EXECUTIVE';
    if (user?.role?.includes('governor') || user?.role?.includes('state')) return 'STATE';
    if (user?.role?.includes('senator')) return 'FEDERAL/STATE LEGISLATIVE';
    return 'REGULATORY JURISDICTION';
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 font-sans">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-green-900/40 border border-green-500/50 flex items-center justify-center text-green-400">
              <Landmark size={22} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">{getRoleTitle()}</h2>
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">{getJurisdiction()}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <button onClick={() => setActiveTab('dashboard')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'dashboard' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Activity size={16} className={cn(activeTab === 'dashboard' ? "text-green-400" : "")} /> Executive Overview
          </button>
          <button onClick={() => setActiveTab('licensing')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'licensing' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <FileCheck size={16} className={cn(activeTab === 'licensing' ? "text-green-400" : "")} /> Licensing & Registries
          </button>
          <button onClick={() => setActiveTab('compliance')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'compliance' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <ShieldAlert size={16} className={cn(activeTab === 'compliance' ? "text-green-400" : "")} /> Compliance & Enforce
          </button>
          <button onClick={() => setActiveTab('testing')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'testing' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Search size={16} className={cn(activeTab === 'testing' ? "text-green-400" : "")} /> Testing & Traceability
          </button>
          <button onClick={() => setActiveTab('revenue')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'revenue' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <DollarSign size={16} className={cn(activeTab === 'revenue' ? "text-green-400" : "")} /> Revenue & Taxes
          </button>
          <button onClick={() => setActiveTab('health')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'health' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Building2 size={16} className={cn(activeTab === 'health' ? "text-green-400" : "")} /> Public Health & Safety
          </button>
          <button onClick={() => setActiveTab('audit')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'audit' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <FileText size={16} className={cn(activeTab === 'audit' ? "text-green-400" : "")} /> Audit & Oversight
          </button>

          <div className="my-3 border-t border-slate-800"></div>

          <button onClick={() => setActiveTab('lease')} className={cn("w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold transition-all text-left shadow-lg border", activeTab === 'lease' ? "bg-gradient-to-r from-emerald-900 to-slate-900 text-emerald-400 border-emerald-500/50" : "bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500/30")}>
            <span className="flex items-center gap-3"><Settings size={18} className="text-emerald-500" /> Lease Management</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#080d12]">
        
        {/* HEADER */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white tracking-tight">{getRoleTitle()} — Jurisdiction: {getJurisdiction()}</h1>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">LARRY AI COMPLIANCE ENGINE ACTIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2">
               Sync <Activity size={14}/>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
               <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center overflow-hidden">
                 <img src="https://ui-avatars.com/api/?name=State+Admin&background=0D8ABC&color=fff" alt="Admin" className="w-full h-full" />
               </div>
               <div className="hidden lg:block">
                 <p className="text-xs font-bold text-white">Marijuana Authority Admin</p>
                 <p className="text-[10px] text-slate-400">Legal Licensing & Approval Body</p>
               </div>
            </div>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Executive Overview Tab */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
              
              {/* KPI Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Licenses</p>
                    <span className="text-emerald-400 text-xs font-bold flex items-center"><TrendingUp size={12} className="mr-1"/> +2.4%</span>
                  </div>
                  <h3 className="text-3xl font-black text-white">12,482</h3>
                  <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full w-[60%]"></div>
                    <div className="bg-purple-500 h-full w-[25%]"></div>
                    <div className="bg-amber-500 h-full w-[15%]"></div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Monthly Tax Rev</p>
                    <span className="text-emerald-400 text-xs font-bold flex items-center"><TrendingUp size={12} className="mr-1"/> +1.1%</span>
                  </div>
                  <h3 className="text-3xl font-black text-white">$14.2M</h3>
                  <p className="text-xs text-slate-500 mt-2">Tracked via operator sync</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">State Compliance Rate</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/50 text-emerald-400 border border-emerald-800">Larry Rated</span>
                  </div>
                  <h3 className="text-3xl font-black text-emerald-500">94.8%</h3>
                  <p className="text-xs text-slate-500 mt-2">Target: 95.0%</p>
                </div>

                <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-red-400/80 text-xs font-bold uppercase tracking-wider">Open Flags / Inv</p>
                    <AlertCircle size={16} className="text-red-500" />
                  </div>
                  <h3 className="text-3xl font-black text-red-500">87</h3>
                  <p className="text-xs text-red-400/60 mt-2">24 critical priority</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Interactive Map */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-[400px] relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-3 shrink-0">
                      <h3 className="font-bold text-white flex items-center gap-2"><MapIcon size={18} className="text-blue-400"/> Interactive State Map</h3>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Compliance</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Rapid Tests</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">Tax Heat</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-slate-950/50 rounded-xl border border-slate-800 relative">
                       {/* Abstract Map Viz */}
                       <div className="absolute inset-0 opacity-30 flex items-center justify-center">
                          <MapIcon size={200} className="text-slate-700" />
                       </div>
                       <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                       <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-emerald-500 rounded-full"></div>
                       <div className="absolute bottom-1/3 right-1/2 w-4 h-4 bg-amber-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Licensing Pipeline */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                      <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileCheck size={18} className="text-blue-400"/> Licensing Pipeline</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">New Applications</span>
                          <span className="text-sm font-bold text-white">142</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Pending Review</span>
                          <span className="text-sm font-bold text-amber-400">38</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Approved (Month)</span>
                          <span className="text-sm font-bold text-emerald-400">1,204</span>
                        </div>
                        <button className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                          State Final Approval Queue
                        </button>
                      </div>
                    </div>

                    {/* Lease Performance */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={100} /></div>
                      <h3 className="font-bold text-white mb-1 flex items-center gap-2 relative z-10"><Settings size={18} className="text-emerald-400"/> Lease Performance</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-4 relative z-10">State Authority Pro Tier</p>
                      
                      <div className="space-y-3 relative z-10">
                        <div>
                          <p className="text-xs text-slate-400">Monthly Lease Amount</p>
                          <p className="text-lg font-bold text-white">$7,999</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Contract End Date</p>
                          <p className="text-sm font-medium text-slate-200">Dec 31, 2027</p>
                        </div>
                        <button onClick={() => setActiveTab('lease')} className="w-full mt-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                          Manage Lease & SLAs
                        </button>
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-6">
                  {/* Real-time Alerts */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2"><AlertCircle size={18} className="text-red-400"/> Real-Time Alerts</h3>
                      <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">Rolled up from City/County</span>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl">
                        <p className="text-xs font-bold text-red-400 mb-1">Statewide Recall Initiated</p>
                        <p className="text-sm text-slate-300">Heavy metals failure - Batch #992</p>
                      </div>
                      <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                        <p className="text-xs font-bold text-amber-400 mb-1">Rapid Test Spike</p>
                        <p className="text-sm text-slate-300">Oklahoma County shows +14% high recency index tests today.</p>
                      </div>
                      <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                        <p className="text-xs font-bold text-blue-400 mb-1">POS Anomaly</p>
                        <p className="text-sm text-slate-300">Dispensary #449 volume spike.</p>
                      </div>
                    </div>
                  </div>

                  {/* Sylara Assistant */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Bot size={18} className="text-blue-400"/> Sylara AI Assistant</h3>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-3">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "State Admin, there are 18 new operator applications that have passed all Larry compliance checks and are awaiting your final approval signature."
                      </p>
                    </div>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 font-bold py-2.5 rounded-lg text-sm transition-colors">
                      Review & Approve (18)
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* LICENSING & REGISTRY (APPROVAL QUEUE) */}
          {activeTab === 'licensing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
               <div className="flex justify-between items-end mb-8">
                  <div>
                     <h2 className="text-3xl font-black text-white mb-2">Pending License Approvals</h2>
                     <p className="text-slate-400">Review and authorize new business and provider applications for the current cycle.</p>
                  </div>
                  <div className="flex gap-3">
                     <button className="px-5 py-2.5 bg-slate-800 rounded-xl text-sm font-bold border border-slate-700">Bulk Verify</button>
                     <button className="px-5 py-2.5 bg-green-600 rounded-xl text-sm font-bold shadow-lg">Finalize Batch</button>
                  </div>
               </div>

               <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-950/50 border-b border-slate-800">
                           <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity Name</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Larry AI Status</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jurisdiction</th>
                           <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                        {[
                          { name: 'Pure Greens LLC', type: 'Processor', ai: 'Verified', jurisdiction: 'OKC Municipal', color: 'text-green-400' },
                          { name: 'Dr. Sarah Smith', type: 'Medical Provider', ai: 'Verified', jurisdiction: 'State-Wide', color: 'text-green-400' },
                          { name: 'High Desert Oasis', type: 'Dispensary', ai: 'Flagged', jurisdiction: 'Tulsa County', color: 'text-amber-400' },
                          { name: 'Vortex Extraction', type: 'Cultivation', ai: 'Verified', jurisdiction: 'OKC Municipal', color: 'text-green-400' },
                          { name: 'Health First Clinic', type: 'Medical Provider', ai: 'Review Required', jurisdiction: 'Norman City', color: 'text-blue-400' }
                        ].map((item, i) => (
                          <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                             <td className="px-8 py-6 font-bold text-white">{item.name}</td>
                             <td className="px-8 py-6 text-sm text-slate-400">{item.type}</td>
                             <td className="px-8 py-6">
                                <span className={cn("text-[10px] font-black uppercase px-3 py-1 rounded-full bg-slate-800 border border-slate-700", item.color)}>
                                   {item.ai}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-sm text-slate-400">{item.jurisdiction}</td>
                             <td className="px-8 py-6">
                                <div className="flex gap-2">
                                   <button className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-all"><CheckCircle2 size={16}/></button>
                                   <button className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-all"><ShieldAlert size={16}/></button>
                                   <button className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"><Search size={16}/></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}

          {/* Lease Management Tab */}
          {activeTab === 'lease' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-black text-white mb-1">Lease Management</h1>
                  <p className="text-sm text-slate-400">GGP-OS State Authority Infrastructure</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Download size={16}/> Download Invoice
                  </button>
                  <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm text-white font-bold hover:bg-blue-500 transition-colors">
                    Upgrade Lease
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Column 1: Overview */}
                <div className="bg-slate-900 border border-emerald-900/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase rounded-full border border-emerald-500/30">Active & Compliant</span>
                  </div>
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2">Current Lease</h3>
                  <div className="text-3xl font-black text-white mb-1">State Pro Lease</div>
                  <div className="text-2xl text-slate-300 font-medium mb-4">$7,999<span className="text-sm text-slate-500"> / month</span></div>
                  
                  <div className="space-y-3 mt-6 border-t border-slate-800 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Contract Term</span>
                      <span className="text-sm font-medium text-white">2 Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">End Date</span>
                      <span className="text-sm font-medium text-white">Dec 31, 2027</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
                    <p className="text-xs text-emerald-400 leading-relaxed font-medium">
                      GGP-OS operates the full regulatory backbone (licensing, compliance, enforcement, public health). <strong>You retain final authority on every approval and enforcement action.</strong>
                    </p>
                  </div>
                </div>

                {/* Column 2: Billing & SLAs */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
                  <h3 className="font-bold text-white mb-4">Billing & SLAs</h3>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">System Uptime (SLA)</p>
                        <p className="text-lg font-bold text-emerald-500">99.99%</p>
                      </div>
                      <CheckCircle2 size={24} className="text-emerald-500 opacity-50" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Next Invoice Due</p>
                        <p className="text-lg font-bold text-white">May 01, 2026</p>
                      </div>
                      <p className="text-lg font-bold text-slate-400">$7,999</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg text-sm border border-slate-700 transition-colors">
                    View Payment History
                  </button>
                </div>

                {/* Column 3: Contact & Terms */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-4">Dedicated Support</h3>
                  <div className="flex items-center gap-4 mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=Sarah+Manager&background=0D8ABC&color=fff" alt="Manager" className="w-full h-full" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Sarah Jenkins</p>
                      <p className="text-xs text-slate-400">State Success Manager</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full flex justify-between items-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors border border-slate-700">
                      View Full Contract Terms <FileText size={16} className="text-slate-500" />
                    </button>
                    <button className="w-full flex justify-between items-center px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors border border-slate-700">
                      Review Usage Metrics <Activity size={16} className="text-slate-500" />
                    </button>
                  </div>
                </div>

              </div>
              
              {/* ROI Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                 <h2 className="text-xl font-bold text-white mb-2">Quarterly ROI Summary</h2>
                 <p className="text-slate-400 max-w-2xl mx-auto">
                   Your lease has processed <strong className="text-white">1,847 applications</strong>, triggered <strong className="text-white">242 rapid tests</strong>, and tracked <strong className="text-emerald-400">$42.4M</strong> in state tax revenue this quarter.
                 </p>
              </div>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

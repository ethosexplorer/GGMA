import React, { useState } from 'react';
import { 
  ShieldAlert, Map, Search, FileText, Activity, MapPin, CheckCircle2, 
  XCircle, AlertTriangle, AlertCircle, Fingerprint, Zap, Crosshair, HelpCircle, Download, Bot, CreditCard, Shield, Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const flags = [
  { id: 1, type: 'volume', title: 'Suspicious Volume Anomaly', entity: 'Apex Health LLC', time: 'Just now', severity: 'high', desc: 'Exceeding daily sales limits.' },
  { id: 2, type: 'pos', title: 'Unregistered POS Sync', entity: 'Westside Dispensary', time: '12m ago', severity: 'medium', desc: 'Unknown hardware detected.' },
  { id: 3, type: 'license', title: 'Invalid License Check', entity: 'UID-8922', time: '1h ago', severity: 'high', desc: 'Multiple failed validations.' }
];

export const EnforcementDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('rapid_testing'); 
  const [rapidTestStep, setRapidTestStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const MOCK_PATIENT = {
    name: 'Jason Thorne',
    licenseId: 'OK-4892-2291',
    status: 'Active',
    stops: 4,
    rating: 82, // Responsibility score
    lastStop: 'Apr 02, 2026',
    offenses: ['Failed Rapid Test (Apr 2025)', 'Broken Taillight (Jan 2026)'],
    rapidTests: 3
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes('jason') || searchQuery.includes('4892')) {
      setSelectedPatient(MOCK_PATIENT);
      setRapidTestStep(2);
    }
  };

  const handleStartTest = () => {
    setRapidTestStep(3);
    setTimeout(() => {
      setRapidTestStep(4);
    }, 2500); 
  };

  const handleTestOutcome = (pass: boolean) => {
    // Logic to update rating
    setRapidTestStep(5);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 font-sans">
      {/* LEFT SIDEBAR (DARK THEME) */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="GGMA Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">RIP Command</h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                {user?.role === 'enforcement_federal' ? 'Federal Authority' : 
                 user?.role === 'enforcement_state' ? 'State Enforcement' : 
                 user?.role === 'enforcement_county' ? 'County Enforcement' : 
                 user?.role === 'enforcement_city' ? 'City Enforcement' : 'Officer'}
              </p>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white border border-slate-600">
              <img src="https://ui-avatars.com/api/?name=Officer+Davis&background=0D8ABC&color=fff" alt="Officer" className="w-full h-full rounded-full" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Officer Davis</p>
              <p className="text-[10px] text-slate-400">Oklahoma City PD</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <button onClick={() => setActiveTab('dashboard')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'dashboard' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Map size={16} className={cn(activeTab === 'dashboard' ? "text-blue-400" : "")} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('lookup')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'lookup' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Search size={16} className={cn(activeTab === 'lookup' ? "text-blue-400" : "")} /> License Lookup
          </button>
          <button onClick={() => setActiveTab('traceability')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'traceability' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Fingerprint size={16} className={cn(activeTab === 'traceability' ? "text-blue-400" : "")} /> Traceability
          </button>
          <button onClick={() => setActiveTab('alerts')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'alerts' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <AlertCircle size={16} className={cn(activeTab === 'alerts' ? "text-blue-400" : "")} /> Compliance Alerts
          </button>
          
          <div className="my-2 border-t border-slate-800"></div>
          
          {/* Prominent Rapid Testing Tab */}
          <button onClick={() => setActiveTab('rapid_testing')} className={cn("w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold transition-all text-left shadow-lg border", activeTab === 'rapid_testing' ? "bg-gradient-to-r from-emerald-900 to-slate-900 text-emerald-400 border-emerald-500/50" : "bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500/30")}>
            <span className="flex items-center gap-3"><Zap size={18} className="text-emerald-500" /> Rapid Testing</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
          
          <div className="my-2 border-t border-slate-800"></div>

          <button onClick={() => setActiveTab('reports')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'reports' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <FileText size={16} className={cn(activeTab === 'reports' ? "text-blue-400" : "")} /> Field Reports
          </button>
          <button onClick={() => setActiveTab('audit')} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left", activeTab === 'audit' ? "bg-slate-800 text-white shadow-md border border-slate-700" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200")}>
            <Activity size={16} className={cn(activeTab === 'audit' ? "text-blue-400" : "")} /> Audit Log
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Rapid Testing Screen */}
        {activeTab === 'rapid_testing' && (
          <div className="flex-1 flex flex-col bg-[#0a0f18] text-white overflow-hidden relative">
            
            <div className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 shrink-0">
               <div>
                 <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                   <Zap className="text-emerald-500" size={28} /> RIP: Real-time Intelligence & Policing
                   <span className="text-slate-500 font-normal">| Forensic Intelligence</span>
                 </h2>
                 <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mt-1">Real-time Patient Analysis & Responsibility Rating</p>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    LARRY AI SCANNER ONLINE
                  </div>
               </div>
            </div>



            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-4xl mx-auto">
                
                {/* STEP 1: PATIENT SEARCH / TRAFFIC STOP INITIATION */}
                {rapidTestStep === 1 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 py-12">
                    <div className="text-center space-y-3 mb-10">
                      <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Crosshair className="text-blue-500" size={40} />
                      </div>
                      <h3 className="text-4xl font-black tracking-tight">Traffic Stop Identification</h3>
                      <p className="text-slate-400 max-w-md mx-auto">Scan Medical ID, Driver's License, or search by name to retrieve the patient's responsibility rating and stop history.</p>
                    </div>
                    <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={24} />
                       <input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-[2.5rem] py-7 pl-16 pr-40 text-xl font-bold focus:border-emerald-500 outline-none transition-all shadow-2xl backdrop-blur-xl"
                        placeholder="Scan Card or Enter ID..." 
                        autoFocus
                       />
                       <button type="submit" className="absolute right-3 top-3 bottom-3 bg-blue-600 px-8 rounded-[1.8rem] font-black text-sm hover:bg-blue-500 transition-all shadow-lg active:scale-95">IDENTIFY</button>
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 max-w-2xl mx-auto">
                       <div className="p-5 bg-slate-900/30 rounded-3xl border border-slate-800/50 flex flex-col items-center text-center">
                          <Fingerprint className="text-blue-400 mb-2" size={24} />
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Biometric Match</p>
                       </div>
                       <div className="p-5 bg-slate-900/30 rounded-3xl border border-slate-800/50 flex flex-col items-center text-center">
                          <CreditCard className="text-emerald-400 mb-2" size={24} />
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OCR ID Scan</p>
                       </div>
                       <div className="p-5 bg-slate-900/30 rounded-3xl border border-slate-800/50 flex flex-col items-center text-center">
                          <MapPin className="text-red-400 mb-2" size={24} />
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GPS Geofence</p>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PATIENT PROFILE & RESPONSIBILITY RATING */}
                {rapidTestStep === 2 && selectedPatient && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 py-6">
                    <div className="flex justify-between items-center bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800/50 backdrop-blur-md">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-[2rem] bg-slate-800 border border-slate-700 overflow-hidden">
                             <img src={`https://ui-avatars.com/api/?name=${selectedPatient.name}&background=random&color=fff&size=128`} alt="" className="w-full h-full" />
                          </div>
                          <div>
                             <h2 className="text-4xl font-black text-white mb-1">{selectedPatient.name}</h2>
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <Shield className="text-blue-500" size={14}/> Medical License: {selectedPatient.licenseId}
                             </p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                          <div className="bg-emerald-900/30 border border-emerald-500/30 px-6 py-2 rounded-full text-emerald-400 text-xs font-black tracking-widest">
                             {selectedPatient.status}
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold">EXPIRES: JAN 2028</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="md:col-span-1 bg-slate-900/50 rounded-[3rem] p-8 border border-slate-800/50 backdrop-blur-md flex flex-col items-center justify-center text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Responsibility Rating</p>
                          <div className="relative w-40 h-40 flex items-center justify-center">
                             <svg className="w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/50" />
                                <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className={cn(selectedPatient.rating > 80 ? "text-emerald-500" : "text-amber-500")} strokeDasharray="464.7" strokeDashoffset={464.7 * (1 - selectedPatient.rating/100)} strokeLinecap="round" />
                             </svg>
                             <div className="absolute flex flex-col items-center">
                                <span className="text-5xl font-black">{selectedPatient.rating}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Points</span>
                             </div>
                          </div>
                          <p className={cn("mt-6 text-xs font-black uppercase tracking-widest", selectedPatient.rating > 80 ? "text-emerald-400" : "text-amber-400")}>
                             {selectedPatient.rating > 80 ? 'Low Risk Profile' : 'Attention Required'}
                          </p>
                       </div>

                       <div className="md:col-span-2 space-y-6">
                          <div className="bg-slate-900/50 rounded-[3rem] p-8 border border-slate-800/50 backdrop-blur-md">
                             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={16} className="text-blue-500"/> Stop & Test History</h4>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                   <span className="text-slate-400 font-bold text-sm">Total Stops (12mo)</span>
                                   <div className="flex items-center gap-2">
                                      <span className="text-xl font-black">{selectedPatient.stops}</span>
                                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">STATE AVG: 1.2</span>
                                   </div>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-slate-400 font-bold text-sm">Rapid Tests Executed</span>
                                   <span className="text-xl font-black">{selectedPatient.rapidTests}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-800/50">
                                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Critical Flags</p>
                                   <div className="flex flex-wrap gap-2">
                                      {selectedPatient.offenses.map((o: string, i: number) => (
                                         <span key={i} className="bg-red-950/40 text-red-400 text-[10px] font-black px-3 py-1.5 rounded-xl border border-red-900/50 flex items-center gap-2">
                                            <AlertTriangle size={12}/> {o}
                                         </span>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <button onClick={() => setRapidTestStep(1)} className="flex-1 bg-slate-800/50 py-5 rounded-[2rem] font-black text-sm hover:bg-slate-700 transition-all border border-slate-700">RELEASE</button>
                             <button onClick={handleStartTest} className="flex-[2] bg-emerald-600 py-5 px-8 rounded-[2rem] font-black text-sm hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3"><Zap size={20}/> EXECUTE RAPID TEST</button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: TESTING ANIMATION */}
                {rapidTestStep === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 space-y-10">
                    <div className="relative">
                      <div className="w-56 h-56 rounded-[4rem] border-4 border-slate-800 flex items-center justify-center relative z-10 bg-slate-900/50 shadow-2xl backdrop-blur-md">
                        <Zap className="text-emerald-500 animate-pulse" size={80} />
                      </div>
                      <div className="absolute -inset-4 w-64 h-64 rounded-[4.5rem] border-4 border-emerald-500/20 animate-ping"></div>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="flex items-center gap-4 justify-center">
                         <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-6 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>)}
                         </div>
                         <h3 className="text-3xl font-black italic tracking-wider">ANALYZING SAMPLE...</h3>
                      </div>
                      <p className="text-slate-500 font-mono text-sm tracking-widest">SECURE SYNC: LARRY AI CLOUD V4.2 • DUAL-CHANNEL RECENCY index</p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: OUTCOME RECORDING */}
                {rapidTestStep === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center max-w-xl mx-auto py-12">
                    <div className="p-10 bg-slate-900/60 border-4 border-emerald-500/30 rounded-[4rem] shadow-2xl backdrop-blur-xl">
                       <div className="w-24 h-24 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                          <CheckCircle2 className="text-emerald-500" size={48} />
                       </div>
                       <h3 className="text-4xl font-black mb-3">TEST COMPLETE</h3>
                       <p className="text-slate-400 mb-10 text-lg">Visual markers and sensor arrays have stabilized. Confirm final disposition below.</p>
                       <div className="grid grid-cols-2 gap-6">
                          <button onClick={() => handleTestOutcome(true)} className="bg-emerald-600 py-7 rounded-[2rem] font-black text-2xl hover:bg-emerald-500 transition-all shadow-lg active:scale-95 shadow-emerald-500/20">PASS</button>
                          <button onClick={() => handleTestOutcome(false)} className="bg-red-600 py-7 rounded-[2rem] font-black text-2xl hover:bg-red-500 transition-all shadow-lg active:scale-95 shadow-red-500/20">FAIL</button>
                       </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] pt-4">Immutable Cryptographic Sync to State Authority & Federal Oversight</p>
                  </motion.div>
                )}

                {/* STEP 5: FINAL REPORT & DISPOSITION */}
                {rapidTestStep === 5 && selectedPatient && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 py-6">
                      <div className="bg-slate-900/60 rounded-[4rem] border border-slate-800/50 p-10 backdrop-blur-xl shadow-2xl">
                         <h3 className="text-3xl font-black mb-8 flex items-center gap-4"><FileText className="text-blue-500" size={32}/> Stop Disposition Report</h3>
                         <div className="space-y-8">
                            <div className="p-8 bg-red-950/20 border border-red-900/30 rounded-[2.5rem]">
                               <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                     <Bot size={18}/>
                                  </div>
                                  <h4 className="text-red-400 font-black tracking-widest text-sm uppercase">LARRY AI COMPLIANCE ENGINE</h4>
                               </div>
                               <p className="text-lg text-slate-300 leading-relaxed mb-6 font-medium">Patient has <span className="text-white font-black underline">{selectedPatient.stops + 1} stops</span> in 12 months with repeated recency flags. Responsibility rating recalculated from 82 to <strong className="text-white text-2xl font-black underline ml-1">71</strong>.</p>
                               <div className="flex flex-wrap gap-3">
                                  <span className="bg-red-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                                     <AlertTriangle size={14}/> MANDATORY SAFETY COURSE
                                  </span>
                                  <span className="bg-slate-800 text-slate-300 text-xs font-black px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
                                     <Activity size={14}/> REVOCATION REVIEW TRIGGERED
                                  </span>
                               </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-800/50">
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Stop ID / Case Number</p>
                                  <p className="text-xl font-black text-white">CASE-OKC-{Math.floor(Math.random() * 90000) + 10000}</p>
                               </div>
                               <div className="bg-slate-800/30 p-6 rounded-3xl border border-slate-800/50">
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Jurisdiction Log</p>
                                  <p className="text-xl font-black text-white">OKC METRO PD • SECTOR 4</p>
                               </div>
                            </div>
                            <div className="flex gap-4">
                               <button className="flex-1 bg-slate-800 py-5 rounded-[2rem] font-black text-sm hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2"><Download size={18}/> EXPORT DATA</button>
                               <button onClick={() => { setRapidTestStep(1); setSelectedPatient(null); }} className="flex-[2] bg-blue-600 py-5 rounded-[2rem] font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">FINISH STOP & SECURE SYNC</button>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard View (Placeholder to show integration) */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-6 overflow-y-auto">
             <div className="flex justify-between items-end mb-6">
               <div>
                 <h1 className="text-2xl font-bold text-white mb-1">RIP: Local Command</h1>
                 <p className="text-sm text-slate-400">Oklahoma City Jurisdiction Map & Live Alerts</p>
               </div>
               <div className="flex items-center gap-2">
                 <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-medium hover:bg-slate-700 transition-colors">
                   Sync Data
                 </button>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Active Local Flags</p>
                  <h3 className="text-2xl font-bold text-white">12</h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Rapid Tests Today</p>
                  <h3 className="text-2xl font-bold text-white">4</h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Licenses Checked</p>
                  <h3 className="text-2xl font-bold text-white">142</h3>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Recent Violations</p>
                  <h3 className="text-2xl font-bold text-white">3</h3>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[400px] relative">
                  {/* Simulated Map */}
                  <div className="absolute inset-0 bg-slate-950/80 bg-[url('https://maps.wikimedia.org/osm-intl/12/963/1592.png')] bg-cover bg-center opacity-40 mix-blend-screen"></div>
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded text-xs font-bold text-white border border-slate-700">Live Map: OKC Area</div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 shadow-lg -mt-0.5 -ml-0.5"></div>
               </div>
               
               <div className="space-y-4">
                 <h3 className="font-bold text-white flex items-center gap-2"><AlertCircle size={18} className="text-red-400" /> Real-Time Flags</h3>
                 {flags.map(flag => (
                   <div key={flag.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{flag.title}</span>
                       <span className="text-[10px] text-slate-500">{flag.time}</span>
                     </div>
                     <p className="text-sm text-white font-medium mb-1">{flag.entity}</p>
                     <p className="text-xs text-slate-400 mb-3">{flag.desc}</p>
                     <div className="flex gap-2">
                       <button className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded text-xs font-bold transition-colors">
                         Investigate
                       </button>
                       <button onClick={() => setActiveTab('rapid_testing')} className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded text-xs font-bold transition-colors">
                         Rapid Test
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

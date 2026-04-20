import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Map, Search, FileText, Activity, MapPin, CheckCircle2, 
  XCircle, AlertTriangle, AlertCircle, Fingerprint, Zap, Crosshair, HelpCircle, Download, Bot, CreditCard, Shield, Clock, Wind, Car, User, Wifi
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
  
  // Breathalyzer state
  const [breathTestState, setBreathTestState] = useState<'idle' | 'blowing' | 'analyzing' | 'complete'>('idle');
  const [breathLevel, setBreathLevel] = useState(0);
  const [breathResult, setBreathResult] = useState<{thc: number, pass: boolean, probability2hr: number} | null>(null);

  const MOCK_PATIENT = {
    name: 'Jason Thorne',
    licenseId: 'OK-4892-2291',
    status: 'Active',
    stops: 4,
    rating: 82, 
    lastStop: 'Apr 02, 2026',
    offenses: ['Failed Rapid Test (Apr 2025)', 'Broken Taillight (Jan 2026)'],
    rapidTests: 3
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setSelectedPatient(MOCK_PATIENT);
      setRapidTestStep(2);
    }
  };

  const handleStartRapidTest = () => {
    setRapidTestStep(3);
    setTimeout(() => {
      setRapidTestStep(4);
    }, 2500); 
  };

  const handleRapidTestOutcome = (pass: boolean) => {
    setRapidTestStep(5);
  };

  const simulateBreathalyzer = () => {
    setBreathTestState('blowing');
    setBreathLevel(0);
    const interval = setInterval(() => {
      setBreathLevel(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBreathTestState('analyzing');
          setTimeout(() => {
             // 94% probability that consumption occurred within the last 2 hours based on THC peak
             setBreathResult({ thc: 0.02, pass: true, probability2hr: 94 });
             setBreathTestState('complete');
          }, 2000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 font-sans">
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-12 h-12 object-contain" />
            <div>
              <h2 className="font-bold text-sm text-white leading-tight">RIP Command</h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                Law Enforcement
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

          {/* New Interactive Breathalyzer Tab */}
          <button onClick={() => setActiveTab('breathalyzer')} className={cn("w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold transition-all text-left shadow-lg border mt-2", activeTab === 'breathalyzer' ? "bg-gradient-to-r from-blue-900 to-slate-900 text-blue-400 border-blue-500/50" : "bg-slate-800 text-slate-300 border-slate-700 hover:border-blue-500/30")}>
            <span className="flex items-center gap-3"><Wind size={18} className="text-blue-500" /> Live Breathalyzer</span>
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
        
        {/* Original Rapid Testing Screen */}
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
                             <button onClick={handleStartRapidTest} className="flex-[2] bg-emerald-600 py-5 px-8 rounded-[2rem] font-black text-sm hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3"><Zap size={20}/> EXECUTE RAPID TEST</button>
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
                          <button onClick={() => handleRapidTestOutcome(true)} className="bg-emerald-600 py-7 rounded-[2rem] font-black text-2xl hover:bg-emerald-500 transition-all shadow-lg active:scale-95 shadow-emerald-500/20">PASS</button>
                          <button onClick={() => handleRapidTestOutcome(false)} className="bg-red-600 py-7 rounded-[2rem] font-black text-2xl hover:bg-red-500 transition-all shadow-lg active:scale-95 shadow-red-500/20">FAIL</button>
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
                               <button onClick={() => { setRapidTestStep(1); setSelectedPatient(null); setSearchQuery(''); }} className="flex-[2] bg-blue-600 py-5 rounded-[2rem] font-black hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-white">FINISH STOP & SECURE SYNC</button>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Breathalyzer Simulator Screen */}
        {activeTab === 'breathalyzer' && (
          <div className="flex-1 flex flex-col bg-[#0a0f18] text-white overflow-hidden relative">
            <div className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 shrink-0">
               <div>
                 <h2 className="text-2xl font-black text-blue-400 flex items-center gap-3 tracking-tight">
                   <Wind className="text-blue-500" size={28} /> Breathalyzer Test Simulator
                   <span className="text-slate-500 font-normal">| Connected Field Device</span>
                 </h2>
                 <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
                   <Wifi size={12} className="animate-pulse" /> Live Backend Sync Active
                 </p>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                
                {breathTestState === 'idle' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-slate-900/60 p-12 rounded-[4rem] border-4 border-slate-800 shadow-2xl backdrop-blur-xl">
                    <div className="w-32 h-32 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                       <Wind size={64} className="text-blue-500" />
                    </div>
                    <h3 className="text-4xl font-black mb-4">Device Ready</h3>
                    <p className="text-slate-400 mb-10 text-lg">Instruct the suspect to blow steadily into the device until the progress indicator reaches 100%.</p>
                    <button 
                      onClick={simulateBreathalyzer}
                      className="bg-blue-600 w-full py-8 rounded-[2rem] font-black text-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-95 shadow-blue-500/20 text-white tracking-widest"
                    >
                      START BREATHALYZER
                    </button>
                  </motion.div>
                )}

                {breathTestState === 'blowing' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-slate-900/60 p-12 rounded-[4rem] border-4 border-slate-800 shadow-2xl backdrop-blur-xl">
                    <h3 className="text-3xl font-black mb-10 text-blue-400">Capturing Breath Sample...</h3>
                    
                    <div className="relative w-72 h-72 mx-auto mb-8">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-800/50" />
                        <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-blue-500 transition-all duration-150 ease-linear" strokeDasharray="816.8" strokeDashoffset={816.8 * (1 - breathLevel/100)} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Wind className={cn("text-blue-500", breathLevel < 100 && "animate-pulse")} size={72} />
                        <span className="text-4xl font-black mt-2 text-white">{breathLevel}%</span>
                      </div>
                    </div>
                    <p className="text-slate-500 font-bold tracking-widest uppercase animate-pulse flex items-center justify-center gap-2">
                       <Activity size={16} /> Streaming sensor data to backend...
                    </p>
                  </motion.div>
                )}

                {breathTestState === 'analyzing' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-slate-900/60 p-12 rounded-[4rem] border-4 border-blue-500/30 shadow-2xl backdrop-blur-xl">
                    <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
                       <Zap size={64} className="text-emerald-500 animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Sample Captured</h3>
                    <div className="flex items-center justify-center gap-2 mb-6">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                    <p className="text-slate-400 text-sm tracking-widest font-mono">CALCULATING THC CONTENT • CROSS-REFERENCING FEDERAL DB</p>
                  </motion.div>
                )}

                {breathTestState === 'complete' && breathResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-slate-900/60 p-12 rounded-[4rem] border-4 border-slate-700 shadow-2xl backdrop-blur-xl">
                    <h3 className="text-2xl font-black mb-6 text-slate-400 tracking-widest uppercase">Result Transmitted</h3>
                    <div className="text-8xl font-black text-emerald-400 mb-2">
                       {breathResult.thc} <span className="text-3xl text-emerald-600">ng/mL</span>
                    </div>
                    <div className="inline-block bg-emerald-900/30 text-emerald-400 px-6 py-2 rounded-full font-black tracking-widest border border-emerald-500/30 mb-4 text-xl">
                       {breathResult.pass ? 'PASS - BELOW LIMIT' : 'FAIL - IMPAIRED'}
                    </div>

                    <div className="bg-slate-800/80 border border-blue-500/30 p-4 rounded-2xl mb-10 max-w-sm mx-auto shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-2"><Clock size={12}/> AI Recency Analysis</p>
                       <p className="text-xl font-black text-white">{breathResult.probability2hr}% Probability</p>
                       <p className="text-xs text-blue-400 mt-1 font-bold">Of consumption within the last 2 hours</p>
                    </div>
                    
                    <div className="bg-slate-800/50 p-6 rounded-3xl mb-8 flex items-center justify-center gap-4 text-slate-400">
                       <CheckCircle2 className="text-emerald-500" size={24} /> Backend Oversight received result.
                    </div>

                    <button 
                      onClick={() => setBreathTestState('idle')}
                      className="bg-slate-800 w-full py-6 rounded-[2rem] font-black text-xl hover:bg-slate-700 transition-all border border-slate-700 text-white tracking-widest"
                    >
                      RESET DEVICE
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18]">
            <h1 className="text-3xl font-black text-white mb-6">Local Command Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Active Flags', val: '12', color: 'text-red-400' },
                { label: 'Breathalyzer Tests Today', val: '4', color: 'text-emerald-400' },
                { label: 'Licenses Checked', val: '142', color: 'text-blue-400' },
                { label: 'Recent Violations', val: '3', color: 'text-amber-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={cn("text-4xl font-black", stat.color)}>{stat.val}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><AlertCircle className="text-red-500"/> Real-Time Flags</h3>
                <div className="space-y-4">
                  {flags.map(f => (
                    <div key={f.id} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div>
                        <p className="font-bold text-red-400">{f.title}</p>
                        <p className="text-sm text-slate-400">{f.entity} - {f.desc}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{f.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-emerald-900/30 rounded-full border border-emerald-500/30 flex items-center justify-center mb-4">
                    <MapPin className="text-emerald-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Live Geofence Active</h3>
                  <p className="text-slate-400 mb-6 max-w-sm">You are currently monitoring sector 4. All data is securely synchronized with local command.</p>
                  <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold text-white hover:bg-blue-500 transition-all">View Full Map</button>
              </div>
            </div>
          </div>
        )}

        {/* Lookup Tab */}
        {activeTab === 'lookup' && (
          <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18]">
             <h1 className="text-3xl font-black text-white mb-6">License Lookup</h1>
             <div className="max-w-2xl">
               <div className="flex gap-4 mb-8">
                 <input className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Enter License ID or Name..." />
                 <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all">Search</button>
               </div>
               
               <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex gap-6 items-center shadow-xl">
                 <div className="w-32 h-32 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff&size=128" alt="" />
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-3xl font-black text-white">Sarah Jenkins</h3>
                       <p className="text-blue-400 font-bold mb-4 tracking-widest uppercase text-xs">License: OK-8821-4432</p>
                     </div>
                     <span className="bg-emerald-900/50 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-emerald-500/30">ACTIVE</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                       <p className="text-[10px] text-slate-500 font-bold uppercase">DOB</p>
                       <p className="text-white font-bold">11/04/1988</p>
                     </div>
                     <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                       <p className="text-[10px] text-slate-500 font-bold uppercase">Allotment</p>
                       <p className="text-white font-bold">2.4 oz Remaining</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* Traceability Tab */}
        {activeTab === 'traceability' && (
          <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18]">
            <h1 className="text-3xl font-black text-white mb-6">Seed-to-Sale Traceability</h1>
            <div className="max-w-3xl">
              <div className="flex gap-4 mb-10">
                 <input className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Scan or Enter Tag UID (e.g., 1A4000000...)" defaultValue="1A4000000XYZ" />
                 <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">Trace</button>
              </div>
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Package Lifecycle Timeline</h3>
                <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-10">
                   {[
                     { step: 'Cultivated', entity: 'Green Valley Farms', date: 'Oct 12, 2025', icon: <Wind size={16} /> },
                     { step: 'Tested', entity: 'Apex Labs', date: 'Jan 05, 2026', badge: 'PASSED', icon: <Activity size={16} /> },
                     { step: 'Transported', entity: 'SecureMovers LLC', date: 'Jan 10, 2026', icon: <Car size={16} /> },
                     { step: 'Retail Inventory', entity: 'OKC Wellness Center', date: 'Jan 12, 2026', icon: <CheckCircle2 size={16} /> },
                   ].map((s, i) => (
                     <div key={i} className="relative">
                       <div className="absolute -left-[49px] w-10 h-10 rounded-full bg-blue-900/50 border-4 border-[#0a0f18] flex items-center justify-center text-blue-400">
                         {s.icon}
                       </div>
                       <h4 className="font-bold text-white text-lg">{s.step}</h4>
                       <p className="text-slate-400">{s.entity}</p>
                       <p className="text-xs text-slate-500 mt-1">{s.date} {s.badge && <span className="ml-2 text-emerald-400 font-bold bg-emerald-900/30 border border-emerald-500/30 px-2 py-0.5 rounded">{s.badge}</span>}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18]">
            <h1 className="text-3xl font-black text-white mb-6">Compliance Alerts</h1>
            <div className="space-y-4 max-w-4xl">
              {flags.map(f => (
                <div key={f.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center transition-all hover:border-slate-600 cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-red-900/30 flex items-center justify-center border border-red-500/30 shrink-0">
                       <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{f.title}</h4>
                      <p className="text-slate-400 mt-1">{f.entity} - <span className="text-slate-500">{f.desc}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 font-bold">{f.time}</span>
                    <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all border border-slate-700">Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18]">
            <div className="flex justify-between items-center mb-6 max-w-5xl">
               <h1 className="text-3xl font-black text-white">Field Reports</h1>
               <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Create New Report</button>
            </div>
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden max-w-5xl shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="p-6 font-bold">Case #</th>
                    <th className="p-6 font-bold">Date & Time</th>
                    <th className="p-6 font-bold">Type</th>
                    <th className="p-6 font-bold">Status</th>
                    <th className="p-6 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { id: 'CASE-OKC-9812', date: 'Today, 14:22', type: 'Traffic Stop / Rapid Test', status: 'Closed' },
                    { id: 'CASE-OKC-9811', date: 'Yesterday, 09:15', type: 'Dispensary Audit', status: 'Pending Review' },
                    { id: 'CASE-OKC-9810', date: 'Apr 18, 16:45', type: 'License Verification', status: 'Closed' },
                  ].map(r => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-6 font-bold text-white">{r.id}</td>
                      <td className="p-6 text-slate-400">{r.date}</td>
                      <td className="p-6 text-slate-400">{r.type}</td>
                      <td className="p-6">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", r.status === 'Closed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30')}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button className="text-blue-400 hover:text-blue-300 font-bold text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="flex-1 p-8 overflow-y-auto bg-[#0a0f18]">
            <h1 className="text-3xl font-black text-white mb-6">System Audit Log</h1>
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-2 max-w-5xl shadow-xl">
              <div className="space-y-1">
                 {[
                   { action: 'User Login Authenticated', user: 'Officer Davis', time: '08:00 AM', detail: 'IP: 192.168.1.45' },
                   { action: 'License Search Query Executed', user: 'Officer Davis', time: '09:14 AM', detail: 'Target: OK-4892-2291' },
                   { action: 'Rapid Breathalyzer Test Initiated', user: 'Officer Davis', time: '09:16 AM', detail: 'Device SN: 88219' },
                   { action: 'Test Results Synchronized', user: 'System (LARRY AI)', time: '09:18 AM', detail: 'Hash: 0x9f8...a21' },
                   { action: 'Geofence Sector Updated', user: 'Officer Davis', time: '10:05 AM', detail: 'Sector 4' },
                 ].map((log, i) => (
                   <div key={i} className="flex items-center p-4 bg-slate-800/20 hover:bg-slate-800/50 rounded-xl transition-colors text-sm">
                     <span className="text-slate-500 w-32 font-mono text-xs">{log.time}</span>
                     <div className="flex items-center gap-2 w-48">
                        <div className={cn("w-2 h-2 rounded-full", log.user.includes('System') ? "bg-emerald-500" : "bg-blue-500")}></div>
                        <span className="font-bold text-slate-300">{log.user}</span>
                     </div>
                     <span className="text-white flex-1">{log.action}</span>
                     <span className="text-slate-500 font-mono text-xs max-w-xs truncate">{log.detail}</span>
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

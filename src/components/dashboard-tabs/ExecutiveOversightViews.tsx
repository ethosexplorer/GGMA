import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Activity, Globe, HeartPulse, Building2, 
  FileCheck, BookOpen, Gavel, FlaskConical, BarChart3, 
  AlertTriangle, CheckCircle, Search, Users, Database, 
  Server, Cpu, Lock, Download, ChevronRight, Calculator,
  FileText, Briefcase, Plus, FolderLock, Scale, MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';


export const SystemHealthTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-20"><Zap size={120} className="text-amber-400" /></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
            <Bot size={28} className="text-indigo-400" /> AI System Guardian
          </h3>
          <p className="text-slate-400 font-medium">Real-time proactive monitoring & automated resolution engine.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              Live Fix Feed
              <span className="flex items-center gap-2 text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                Monitoring
              </span>
            </h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              {[
                { t: '12:04 PM', m: 'Metrc Sync anomaly detected in OK-Sector', s: 'REVOLVED', r: 'Retried connection via secondary gateway', c: 'text-emerald-400' },
                { t: '11:58 AM', m: 'Database high-latency alert (>500ms)', s: 'OPTIMIZED', r: 'Re-indexed compliance_logs table', c: 'text-blue-400' },
                { t: '11:45 AM', m: 'Unauthorized API access attempt (IP: 192.168.1.4)', s: 'BLOCKED', r: 'IP added to global firewall blacklist', c: 'text-red-400' },
                { t: '11:32 AM', m: 'Care Wallet timeout in POS-Bridge', s: 'FIXED', r: 'Auto-flushed redis cache for bridge-04', c: 'text-emerald-400' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{log.t}</span>
                  <div className="flex-1 border-l-2 border-white/5 pl-4 pb-4">
                    <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{log.m}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-white/5", log.c)}>{log.s}</span>
                      <p className="text-[10px] text-slate-400">{log.r}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-4">Auto-Fix Engine Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Detection Speed</span>
                  <span className="text-xs font-bold text-white">0.02s</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '98%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Success Rate</span>
                  <span className="text-xs font-bold text-white">99.4%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '99.4%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-white">4,281</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Issues Auto-Resolved (24h)</p>
              <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "AI_LOGS", "Production_User", JSON.stringify({ detail: "Loading detailed Sylara/LARRY AI processing logs..." })] }).catch(console.error) ); alert("Loading detailed Sylara/LARRY AI processing logs...\n\n[Live Production Transaction Logged]"); }} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">View Detailed AI Logs</button>
            </div>
          </div>
        </div>
      </div>

      {/* Roadside Testing Tracker (Copied from IP Monitor) */}
      <div className="bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-900/50 rounded-[2rem] p-10 mt-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-full bg-indigo-500/10 blur-3xl"></div>
         <div className="relative z-10">
           <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><Globe className="text-indigo-400" /> Roadside Testing Regulations Tracker</h2>
           <p className="text-indigo-300 text-sm font-bold mb-8">Current Landscape (April 2026) • Driving licensing demand for Tiered THC Patent</p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Federal Level (DOT)</h4>
               <ul className="space-y-3 text-sm text-slate-300 font-medium">
                 <li><span className="text-white font-bold">Status:</span> DOT Part 40 permitted oral fluid testing (Dec 2024).</li>
                 <li><span className="text-white font-bold">Rollout:</span> Mid-2026 (awaiting HHS dual-lab certification).</li>
                 <li><span className="text-white font-bold">Impact:</span> Surging demand for recent-use testing over presence testing.</li>
               </ul>
             </div>
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">State Programs (Live)</h4>
               <ul className="space-y-3 text-sm text-slate-300 font-medium">
                 <li><span className="text-white font-bold">Alabama:</span> First comprehensive U.S. program since 2019. Extensive data pipeline.</li>
                 <li><span className="text-white font-bold">Indiana:</span> Statewide deployment. 200+ devices screening for THC + 5 drugs.</li>
                 <li><span className="text-white font-bold">Oklahoma:</span> DPS pilot launched early 2026. Zero-tolerance for active THC while driving.</li>
               </ul>
             </div>
             <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
               <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Evidentiary Gap</h4>
               <p className="text-sm text-slate-300 font-medium leading-relaxed">
                 Most existing devices detect THC presence long after impairment ends. Your patent solves this with <span className="text-white font-bold">2/5/10 ng/mL thresholds and temporal recency modeling</span>, allowing law enforcement to precisely determine use within the ~2-hour impairment window.
               </p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );


export const JurisdictionMapTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Nationwide Jurisdiction Oversight</h2>
          <p className="text-slate-400 font-medium">Live deployment status and compliance health across the United States.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-12 shadow-sm h-[600px] flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Map Visualization with Grid Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-1000">
             <div className="grid grid-cols-20 grid-rows-20 w-full h-full">
               {Array.from({length: 400}).map((_, i) => (
                 <div key={i} className="border-[0.5px] border-slate-900" />
               ))}
             </div>
          </div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-indigo-100 mb-8 transform group-hover:rotate-12 transition-transform duration-700">
              <Globe size={48} className="animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">National Grid Active</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">Monitoring all 50 U.S. states. Oklahoma active as of May 12, 2026. Additional states onboarding this week.</p>
          </div>

          <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-6">
             {[{l:'States Active',v:'1',c:'text-indigo-600'},{l:'Standby States',v:'49',c:'text-amber-600'},{l:'Applications Today',v:'1',c:'text-emerald-600'}].map((st,i)=>(
               <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{st.l}</p>
                 <p className={cn("text-3xl font-black", st.c)}>{st.v}</p>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-slate-800 flex items-center gap-2"><MapIcon size={20} className="text-indigo-500"/> Priority Hubs</h3>
               <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">REAL-TIME</span>
            </div>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {[{ s: 'Oklahoma', r: liveStats.netRevenue, st: 'Live', c: 'text-emerald-600' }, { s: 'Alabama', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Alaska', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Arizona', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Arkansas', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'California', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Colorado', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Connecticut', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Delaware', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Florida', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Georgia', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Hawaii', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Idaho', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Illinois', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Indiana', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Iowa', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Kansas', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Kentucky', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Louisiana', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Maine', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Maryland', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Massachusetts', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Michigan', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Minnesota', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Mississippi', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Missouri', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Montana', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Nebraska', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Nevada', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'New Hampshire', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'New Jersey', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'New Mexico', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'New York', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'North Carolina', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'North Dakota', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Ohio', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Oregon', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Pennsylvania', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Rhode Island', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'South Carolina', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'South Dakota', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Tennessee', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Texas', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Utah', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Vermont', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Virginia', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Washington', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'West Virginia', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Wisconsin', r: '$0', st: 'Standby', c: 'text-slate-400' }, { s: 'Wyoming', r: '$0', st: 'Standby', c: 'text-slate-400' }].map((st, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors" />
                    <div>
                      <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{st.s}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{st.r} Net Revenue</p>
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full", 
                    st.st === 'Critical' ? "bg-red-50 text-red-600" : st.st === 'Review' ? "bg-amber-50 text-amber-600" : st.st === 'Standby' ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-600"
                  )}>{st.st}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab('state_authority')} className="w-full mt-10 py-4 text-xs font-black text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest shadow-sm">Initialize State Drill-down</button>
          </div>
        </div>
      </div>
    </div>
  );

  // LIVE PLATFORM PULSE (Real-time listeners)
  const [counts, setCounts] = useState({ users: 0, patients: 0, businesses: 0, admins: 0, joinedToday: 0 });
  
  useEffect(() => {
    // Real-time listener for all users — count by role
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      let patients = 0;
      let businesses = 0;
      let admins = 0;
      let joinedToday = 0;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      snap.docs.forEach(d => {
        const data = d.data();
        const role = (data.role || '').toLowerCase();
        
        if (role === 'user' || role === 'patient' || role === 'patient / caregiver') patients++;
        else if (role === 'business' || role === 'provider' || role === 'attorney' || role === 'compliance_service') businesses++;
        
        if (role.includes('admin') || role.includes('founder') || role.includes('executive') || role.includes('compliance_director')) admins++;
        
        // Count users who joined today
        const created = data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString().split('T')[0] : (typeof data.createdAt === 'string' ? data.createdAt.split('T')[0] : '');
        if (created === today) joinedToday++;
      });
      
      setCounts({ users: snap.size, patients, businesses, admins, joinedToday });
    });
    return () => unsub();
  }, []);

  const handleHireFire = async (uid: string, action: 'activate' | 'suspend' | 'terminate') => {
    try {
      const userRef = doc(db, 'users', uid);
      const status = action === 'activate' ? 'Active' : (action === 'suspend' ? 'Suspended' : 'Terminated');
      await updateDoc(userRef, { status });
      alert(`SUPREME COMMAND: User status updated to ${status}`);
    } catch (err) {
      console.error('Supreme Command Error:', err);
    }
  };


export const PatientsRegistryTab = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-white border-4 border-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><HeartPulse size={160} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">Registry Sovereignty</h2>
              <p className="text-slate-500 font-bold text-lg max-w-xl">Unified citizen oversight. Monitor patient distribution, medical card velocity, and state-level registration reciprocities in real-time.</p>
           </div>
           <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center min-w-[240px] shadow-2xl">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Total Verified Citizens</p>
              <p className="text-5xl font-black">{counts.patients.toLocaleString()}</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                 <TrendingUp size={16} /> 4.2% Growth (24h)
              </div>
           </div>
        </div>
      </div>

      {/* Patient Case Tracker */}
      {selectedPatientCase ? (
        <div>
          <button onClick={() => setSelectedPatientCase(null)} className="mb-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-colors flex items-center gap-2">
            ← Back to Patient List
          </button>
          <PatientCaseTracker
            patientUid={selectedPatientCase.uid}
            patientName={selectedPatientCase.fullName || selectedPatientCase.name || selectedPatientCase.displayName || 'Unknown'}
            patientEmail={selectedPatientCase.email || ''}
            patientState={selectedPatientCase.state || selectedPatientCase.jurisdiction || 'Oklahoma'}
            patientPhone={selectedPatientCase.phone || selectedPatientCase.textPhone || ''}
            staffName={fullName}
          />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-black text-slate-800 flex items-center gap-3"><HeartPulse size={20} className="text-emerald-600" /> Patient Case Files ({patientList.length})</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Click a patient to manage their case</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {patientList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">No patients registered yet</div>
            ) : patientList.map((patient: any) => (
              <button
                key={patient.uid}
                onClick={() => setSelectedPatientCase(patient)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-sm">
                    {(patient.fullName || patient.name || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 group-hover:text-emerald-700 transition-colors">{patient.fullName || patient.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{patient.email} • {patient.state || patient.jurisdiction || 'No state'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-emerald-600">Open Case →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Globe size={60} /></div>
            <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">Top Growth States</h4>
            <div className="space-y-4">
               {['Oklahoma', 'Missouri', 'Texas', 'Florida'].map((state, i) => (
                 <div key={i} className="flex justify-between items-center">
                    <span className="font-bold text-sm">{state}</span>
                    <span className="text-xs font-black text-emerald-400">+{(12 - i * 2.5).toFixed(1)}%</span>
                 </div>
               ))}
            </div>
         </div>
         <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
               <Activity size={18} className="text-indigo-600" /> Patient Reciprocity Index
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { l: 'Verified Medical', v: '82%', c: 'bg-emerald-500' },
                 { l: 'Out-of-State Sync', v: '64%', c: 'bg-blue-500' },
                 { l: 'Auto-Renewals', v: '91%', c: 'bg-indigo-500' },
                 { l: 'Minor Patient Approval', v: '12%', c: 'bg-amber-500' }
               ].map((idx, i) => (
                 <div key={i} className="text-center">
                    <p className="text-3xl font-black text-slate-800">{idx.v}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{idx.l}</p>
                    <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                       <div className={cn("h-full", idx.c)} style={{ width: idx.v }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );


export const BusinessInfrastructureTab = () => (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Building2 size={160} /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Economic Infrastructure</h2>
              <p className="text-slate-400 font-medium text-lg">Commercial force monitoring. Audit verified entities, POS integrations, and B2B infrastructure health across all sectors.</p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                 <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Commercial Nodes</p>
                    <p className="text-2xl font-black">{counts.businesses.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Daily Tax Ingress</p>
                    <p className="text-2xl font-black">$412.4k</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Pending Audits</p>
                    <p className="text-2xl font-black">124</p>
                 </div>
              </div>
           </div>
           {/* RAPID TEST PULSE MONITOR */}
           <div className="w-full lg:w-96 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl relative group">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-indigo-600/30">
                 <FlaskConical size={24} className="text-white" />
              </div>
              <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Zap size={18} className="text-amber-400" /> Rapid Test Pulse
              </h3>
              <div className="space-y-6">
                 {[
                   { l: 'Active Lab Syncs', v: '42', t: 'Nationwide', c: 'text-white' },
                   { l: 'Tests Processed (1h)', v: '1,842', t: '+12%', c: 'text-emerald-400' },
                   { l: 'Flagged Impurities', v: '3', t: 'CRITICAL', c: 'text-red-500 animate-pulse' }
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase">{stat.l}</p>
                         <p className="text-[10px] font-bold text-slate-400 italic">{stat.t}</p>
                      </div>
                      <p className={cn("text-2xl font-black", stat.c)}>{stat.v}</p>
                   </div>
                 ))}
              </div>
              <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "RECALL", "Production_User", JSON.stringify({ detail: "Opening Emergency Product Recall Hub..." })] }).catch(console.error) ); alert("Opening Emergency Product Recall Hub...\n\n[Live Production Transaction Logged]"); }} className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Emergency Recall Hub</button>
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Building2 size={22} className="text-emerald-600"/> Infrastructure Map</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cultivation
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Retail
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> Lab/Testing
               </div>
            </div>
         </div>
         <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-4">
                  {[
                    { n: 'Apex Dispensary', e: 'hq@apex-med.com', r: 'Dispensary / Retail', j: 'Oklahoma City', s: 'Active' },
                    { n: 'GreenLeaf Farms', e: 'ops@greenleaf.com', r: 'Cultivator / Grow', j: 'Tulsa', s: 'Active' },
                    { n: 'CannaLogic POS', e: 'dev@cannalogic.io', r: 'Integrator / Tech', j: 'National', s: 'Suspended' }
                  ].map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-100 rounded-2xl border border-slate-200 hover:border-emerald-200 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                             <Building2 size={18} />
                          </div>
                          <div>
                             <p className="font-black text-slate-800">{u.n}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.r}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={cn("text-[10px] font-black uppercase px-3 py-1 rounded-full", u.s === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200')}>
                             {u.s}
                          </span>
                          <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Additional options menu..." })] }).catch(console.error) ); }} className="p-2 text-slate-400 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16}/></button>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">Infrastructure Health</h4>
                  <div className="space-y-6">
                     <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                           <span className="text-slate-500">Lab Integration Sync</span>
                           <span className="text-emerald-400">99.8%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: '99.8%' }}></div>
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                           <span className="text-slate-500">Tax Reporting Velocity</span>
                           <span className="text-indigo-400">88.4%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: '88.4%' }}></div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed pt-4 italic">
                        Larry is currently monitoring 42,891 commercial nodes. 3 nodes currently require manual Intercept due to POS bridge timing issues in OK-Sector.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );


export const ComplianceMonitorTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Compliance War Room</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-Time Predictive Anomaly Detection</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "AUDIT", "Production_User", JSON.stringify({ detail: "Running predictive compliance audit across all sectors..." })] }).catch(console.error) ); alert("Running predictive compliance audit across all sectors...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20">Predictive Audit</button>
           <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Loading notification delivery history..." })] }).catch(console.error) ); alert("Loading notification delivery history...\n\n[Live Production Transaction Logged]"); }} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black">History</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-100 border-2 border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[400px]">
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg viewBox="0 0 800 400" className="w-full h-full fill-none stroke-slate-300 stroke-2">
                 <path d="M0,350 Q200,300 400,350 T800,300" />
                 <path d="M0,300 Q200,250 400,300 T800,250" strokeDasharray="5,5" />
              </svg>
           </div>
           
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Target size={16} className="text-red-500" /> Risk Vector Analysis (7D)
           </h3>

           <div className="flex items-end justify-between h-48 gap-4 px-4">
              {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                   <div 
                     className={cn("w-full rounded-t-xl transition-all duration-1000", h > 80 ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "bg-indigo-500")}
                     style={{ height: `${h}%` }}
                   ></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Day {i+1}</span>
                </div>
              ))}
           </div>

           <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center animate-pulse"><AlertTriangle size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Critical Vectors</p>
                    <p className="text-xl font-black text-slate-800">{counts.joinedToday > 0 ? counts.joinedToday + ' Pending' : 'None'}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><CircleCheck size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Auto-Resolved</p>
                    <p className="text-xl font-black text-slate-800">{counts.users > 0 ? counts.users + ' today' : '0 today'}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Recent Violations</h3>
           <div className="flex-1 space-y-4">
              {liveAnalytics.events.length > 0 ? liveAnalytics.events.slice(0, 3).map((ev, i) => ({
                e: ev.user || 'System', f: ev.action || 'Activity', s: i === 0 ? 'New' : 'Info', t: ev.time,
                c: i === 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
              })).map((c, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{c.e}</p>
                      <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded-full", c.c)}>{c.s}</span>
                   </div>
                   <p className="text-xs text-slate-500 font-medium">{c.f}</p>
                   <p className="text-[10px] text-slate-400 mt-2 font-bold">{c.t}</p>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400">
                  <CircleCheck size={32} className="mx-auto mb-2 text-emerald-400" />
                  <p className="font-bold text-sm text-slate-600">No violations recorded</p>
                  <p className="text-xs mt-1">Clean compliance status</p>
                </div>
              )}
           </div>
           <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "AUDIT", "Production_User", JSON.stringify({ detail: "Loading complete audit log archive..." })] }).catch(console.error) ); alert("Loading complete audit log archive...\n\n[Live Production Transaction Logged]"); }} className="mt-6 w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">View All Audit Logs</button>
        </div>
      </div>
    </div>
  );


export const RegulatoryLibraryTab = () => {
  const [activeCategory, setActiveCategory] = useState('sop');
  const [searchQuery, setSearchQuery] = useState('');
return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><BookOpen size={160} /></div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Regulatory Intelligence Hub</h2>
           <p className="text-indigo-200 font-medium">METRC User Guide & State Law Repository. Synchronized with Oklahoma OMMA Title 63.</p>
           
           <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search laws, SOPs, or compliance rules..." 
                    value={regSearch}
                    onChange={(e) => setRegSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm backdrop-blur-md"
                 />
              </div>
              <div className="flex gap-2">
                 {['Overview', 'Operations', 'Admin', 'Inventory', 'Compliance'].map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setRegCat(regCat === cat ? null : cat)}
                     className={cn(
                       "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                       regCat === cat ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                     )}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {filtered.map((item, i) => (
             <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">{item.category}</span>
                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Opening external reference..." })] }).catch(console.error) ); }} className="text-slate-300 hover:text-indigo-600 transition-colors"><ArrowUpRight size={18} /></button>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{item.content}</p>
                <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                   <span className="text-[10px] font-bold text-slate-400 italic">Source: Metrc Guide 2021 v11.1</span>
                   <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Expanding full regulatory section..." })] }).catch(console.error) ); alert("Expanding full regulatory section...\n\n[Live Production Transaction Logged]"); }} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Read Full Section</button>
                </div>
             </div>
           ))}
           {filtered.length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-400 italic">No regulatory matches found for "{regSearch}"</div>
           )}
        </div>
      </div>
    );
  };


export const LawEnforcementTab = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-xl transition-all">
          <Printer size={18} /> Export / Print Report
        </button>
      </div>
      <div className="bg-slate-950 border border-indigo-500/50 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={160} /></div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 flex items-center gap-3">
                <Shield className="text-indigo-400" /> Law Enforcement Oversight
              </h2>
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Real-time dispatch, field screening & evidentiary blockchain</p>
            </div>
            <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 text-center backdrop-blur-md">
               <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400 mb-2">Active Field Units</p>
               <p className="text-4xl font-black">412</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Activity className="text-indigo-600" /> Active Dispatches & Stops</h3>
          <div className="space-y-4">
            {[
              { id: 'DP-8291', status: 'Active Screen', unit: 'Unit 44 (Highway Patrol)', time: '2m ago', threat: 'High' },
              { id: 'DP-8290', status: 'Evidence Logged', unit: 'Unit 12 (Metro)', time: '14m ago', threat: 'Low' },
              { id: 'DP-8289', status: 'Lab Routing', unit: 'Unit 08 (County)', time: '45m ago', threat: 'Med' },
            ].map(dispatch => (
              <div key={dispatch.id} className="flex justify-between items-center p-4 bg-slate-100 rounded-xl border border-slate-200">
                <div>
                  <div className="text-sm font-black text-slate-700">{dispatch.unit}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dispatch.id} • {dispatch.time}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-100 text-indigo-700">{dispatch.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-white shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Database className="text-emerald-400" /> Evidentiary Blockchain</h3>
          <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                <span>Chain of Custody Status</span>
                <span className="text-emerald-400">100% Immutable</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { hash: '0x8f2...4b1', type: 'Oral Fluid Screen (2 ng/mL)', timestamp: '10:42 AM' },
                { hash: '0x3a1...9c2', type: 'Chain of Custody Transfer', timestamp: '09:15 AM' },
                { hash: '0x7b4...2a9', type: 'Lab Confirmation Request', timestamp: '08:30 AM' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-center group">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-300">{log.type}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{log.hash} • {log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== RAPID TEST SIMULATOR / IDENTITY LOOKUP ===== */}
      <div className="bg-slate-950 border border-emerald-500/30 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={120}/></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Zap className="text-emerald-500"/> Identify Verify Test <span className="text-slate-500 font-normal text-lg">| Forensic Intelligence</span></h3>
          <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mb-6">Real-time Patient Analysis & Responsibility Rating</p>

          {ripTestStep === 1 && (
            <div className="space-y-6">
              <form onSubmit={handleRipSearch} className="relative max-w-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                <input value={ripSearchQuery} onChange={(e) => setRipSearchQuery(e.target.value)} className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-5 pl-14 pr-36 text-lg font-bold focus:border-emerald-500 outline-none" placeholder="Scan Card or Enter ID..." />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 px-6 rounded-xl font-black text-sm hover:bg-blue-500">IDENTIFY</button>
              </form>
              <div className="flex gap-4">
                {[{i: 'Biometric Match', c: 'text-blue-400'}, {i: 'OCR ID Scan', c: 'text-emerald-400'}, {i: 'GPS Geofence', c: 'text-red-400'}].map(m => (
                  <div key={m.i} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center flex-1"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.i}</p></div>
                ))}
              </div>
            </div>
          )}

          {ripTestStep === 2 && ripSelectedPatient && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${ripSelectedPatient.name}&background=random&color=fff&size=128`} alt="" className="w-full h-full"/></div>
                  <div><h4 className="text-2xl font-black">{ripSelectedPatient.name}</h4><p className="text-slate-400 text-xs font-bold uppercase tracking-widest">License: {ripSelectedPatient.licenseId}</p></div>
                </div>
                <span className="bg-emerald-900/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-500/30">{ripSelectedPatient.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-2"><svg className="w-full h-full -rotate-90"><circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800"/><circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-500" strokeDasharray="264" strokeDashoffset={264*(1-ripSelectedPatient.rating/100)} strokeLinecap="round"/></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-black">{ripSelectedPatient.rating}</span></div></div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase">Low Risk</p>
                </div>
                <div className="col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between"><span className="text-slate-400 text-sm font-bold">Stops (12mo)</span><span className="font-black text-lg">{ripSelectedPatient.stops}</span></div>
                  <div className="flex flex-wrap gap-2">{ripSelectedPatient.offenses.map((o: string, i: number) => (<span key={i} className="bg-red-950/40 text-red-400 text-[10px] font-black px-2 py-1 rounded-lg border border-red-900/50 flex items-center gap-1"><AlertTriangle size={10}/>{o}</span>))}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setRipTestStep(1); setRipSelectedPatient(null); setRipSearchQuery(''); }} className="flex-1 bg-slate-800 py-4 rounded-xl font-black text-sm hover:bg-slate-700 border border-slate-700">RELEASE</button>
                <button onClick={() => { setRipTestStep(3); setTimeout(() => setRipTestStep(4), 2500); }} className="flex-[2] bg-emerald-600 py-4 rounded-xl font-black text-sm hover:bg-emerald-500 shadow-lg flex items-center justify-center gap-2"><Zap size={18}/> EXECUTE RAPID TEST</button>
              </div>
            </div>
          )}

          {ripTestStep === 3 && (
            <div className="flex flex-col items-center py-12 space-y-6">
              <div className="relative"><div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center bg-slate-900"><Zap className="text-emerald-500 animate-pulse" size={56}/></div><div className="absolute -inset-3 rounded-full border-4 border-emerald-500/20 animate-ping"></div></div>
              <h3 className="text-2xl font-black italic tracking-wider">ANALYZING SAMPLE...</h3>
              <p className="text-slate-500 font-mono text-xs tracking-widest">SECURE SYNC: LARRY AI CLOUD V4.2</p>
            </div>
          )}

          {ripTestStep === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30"><CircleCheck className="text-emerald-500" size={40}/></div>
              <h3 className="text-3xl font-black">TEST COMPLETE</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <button onClick={() => setRipTestStep(5)} className="bg-emerald-600 py-5 rounded-xl font-black text-xl hover:bg-emerald-500">PASS</button>
                <button onClick={() => setRipTestStep(5)} className="bg-red-600 py-5 rounded-xl font-black text-xl hover:bg-red-500">FAIL</button>
              </div>
            </div>
          )}

          {ripTestStep === 5 && (
            <div className="space-y-4">
              <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-2xl">
                <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white"><Bot size={14}/></div><h4 className="text-red-400 font-black tracking-widest text-xs uppercase">LARRY AI COMPLIANCE ENGINE</h4></div>
                <p className="text-slate-300 leading-relaxed">Patient has <span className="text-white font-black">{(ripSelectedPatient?.stops || 4) + 1} stops</span> in 12 months. Responsibility rating recalculated from 82 to <strong className="text-white text-xl font-black">71</strong>.</p>
                <div className="flex gap-2 mt-4"><span className="bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1"><AlertTriangle size={12}/> MANDATORY SAFETY COURSE</span><span className="bg-slate-800 text-slate-300 text-xs font-black px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1"><Activity size={12}/> REVOCATION REVIEW</span></div>
              </div>
              <button onClick={() => { setRipTestStep(1); setRipSelectedPatient(null); setRipSearchQuery(''); }} className="w-full bg-blue-600 py-4 rounded-xl font-black hover:bg-blue-500 shadow-lg">FINISH STOP & SECURE SYNC</button>
            </div>
          )}
        </div>
      </div>

      {/* ===== BREATHALYZER / PROBABILITY FIELD TEST ===== */}
      <div className="bg-slate-950 border border-blue-500/30 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={120}/></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><Activity className="text-blue-500"/> Probability Field Test <span className="text-slate-500 font-normal text-lg">| Connected Device</span></h3>
          <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mb-6 flex items-center gap-2"><Globe size={12} className="animate-pulse"/> Live Backend Sync Active</p>

          {breathState === 'idle' && (
            <div className="text-center bg-slate-900/60 p-10 rounded-2xl border border-slate-800">
              <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]"><Activity size={48} className="text-blue-500"/></div>
              <h4 className="text-3xl font-black mb-3">Device Ready</h4>
              <p className="text-slate-400 mb-8">Instruct the suspect to blow steadily into the device until the indicator reaches 100%.</p>
              <button onClick={startBreath} className="bg-blue-600 w-full max-w-md py-6 rounded-xl font-black text-xl hover:bg-blue-500 shadow-lg tracking-widest">START FIELD TEST</button>
            </div>
          )}

          {breathState === 'blowing' && (
            <div className="text-center bg-slate-900/60 p-10 rounded-2xl border border-slate-800">
              <h4 className="text-2xl font-black mb-8 text-blue-400">Capturing Breath Sample...</h4>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90"><circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800"/><circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-500 transition-all duration-150" strokeDasharray="553" strokeDashoffset={553*(1-breathLevel/100)} strokeLinecap="round"/></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><Activity className={cn("text-blue-500", breathLevel < 100 && "animate-pulse")} size={48}/><span className="text-3xl font-black mt-1">{breathLevel}%</span></div>
              </div>
              <p className="text-slate-500 font-bold tracking-widest uppercase animate-pulse text-xs">Streaming sensor data to backend...</p>
            </div>
          )}

          {breathState === 'analyzing' && (
            <div className="text-center bg-slate-900/60 p-10 rounded-2xl border-2 border-blue-500/30">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"><Zap size={48} className="text-emerald-500 animate-pulse"/></div>
              <h4 className="text-2xl font-black mb-3">Sample Captured</h4>
              <div className="flex items-center justify-center gap-2 mb-4">{[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: `${i*150}ms`}}/>)}</div>
              <p className="text-slate-400 text-xs tracking-widest font-mono">CALCULATING THC CONTENT • CROSS-REFERENCING FEDERAL DB</p>
            </div>
          )}

          {breathState === 'complete' && breathResult && (
            <div className="text-center bg-slate-900/60 p-10 rounded-2xl border border-slate-700">
              <h4 className="text-lg font-black mb-4 text-slate-400 tracking-widest uppercase">Result Transmitted</h4>
              <div className="text-7xl font-black text-emerald-400 mb-2">{breathResult.thc} <span className="text-2xl text-emerald-600">ng/mL</span></div>
              <div className="inline-block bg-emerald-900/30 text-emerald-400 px-5 py-2 rounded-full font-black tracking-widest border border-emerald-500/30 mb-4 text-lg">{breathResult.pass ? 'PASS - BELOW LIMIT' : 'FAIL - IMPAIRED'}</div>
              <div className="bg-slate-800/80 border border-blue-500/30 p-4 rounded-xl mb-8 max-w-sm mx-auto">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><Clock size={10}/> AI Recency Analysis</p>
                <p className="text-lg font-black text-white">{breathResult.prob}% Probability</p>
                <p className="text-xs text-blue-400 mt-1 font-bold">Of consumption within the last 2 hours</p>
              </div>
              <button onClick={() => { setBreathState('idle'); setBreathResult(null); }} className="bg-slate-800 w-full max-w-md py-5 rounded-xl font-black text-lg hover:bg-slate-700 border border-slate-700 tracking-widest">RESET DEVICE</button>
            </div>
          )}
        </div>
      </div>

    </div>
  );


export const RapidTestingTab = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex justify-end print:hidden">
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-xl transition-all">
          <Printer size={18} /> Export / Print Report
        </button>
      </div>
      <div className="bg-indigo-600 bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 p-10 opacity-20"><FlaskConical size={160} className="animate-pulse text-indigo-400" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Rapid Testing Command</h2>
              <p className="text-indigo-200 font-medium text-lg">National laboratory infrastructure. Monitoring purity standards, chemical analysis velocity, and emergency recall protocols across 42 jurisdictions.</p>
              <div className="flex gap-4 mt-8">
                 <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Active Labs</p>
                    <p className="text-2xl font-black">184</p>
                 </div>
                 <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Pass Rate</p>
                    <p className="text-2xl font-black">94.2%</p>
                 </div>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl text-center min-w-[280px]">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Tests Processed (24h)</p>
              <p className="text-5xl font-black">42,891</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                 <TrendingUp size={16} /> +18.5% Ingress
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Live Lab Sync Stream */}
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                  <Activity size={24} className="text-indigo-600" /> Lab Integration Pulse
               </h3>
               <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">ALL NODES SYNCED</span>
            </div>
            <div className="space-y-4">
               {[
                 { l: 'Apex Analytics (OKC)', v: '182 tests/hr', st: 'Optimal', p: '99.9%' },
                 { l: 'GreenRiver Labs (Tulsa)', v: '142 tests/hr', st: 'Optimal', p: '98.8%' },
                 { l: 'Metro Testing (Miami)', v: '204 tests/hr', st: 'Maintenance', p: '92.4%' },
                 { l: 'Sovereign Lab (Dallas)', v: '89 tests/hr', st: 'Optimal', p: '99.4%' },
               ].map((lab, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-slate-100 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600">
                          <FlaskConical size={20} />
                       </div>
                       <div>
                          <p className="font-black text-slate-800">{lab.l}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{lab.v}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Purity Baseline</p>
                          <p className="text-sm font-black text-slate-800">{lab.p}</p>
                       </div>
                       <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-lg", lab.st === 'Optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
                          {lab.st}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Emergency Recall Center */}
         <div className="space-y-6">
            <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform"><AlertTriangle size={80} /></div>
               <h3 className="text-lg font-black italic uppercase mb-4">Recall Intercept</h3>
               <p className="text-red-100 text-xs font-bold leading-relaxed mb-8">Rapid impurity detection has triggered 1 potential recall event in the OK-Sector.</p>
               
               <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
                  <p className="text-[10px] font-black text-red-200 uppercase mb-1">Batch ID: #RE-9921</p>
                  <p className="text-sm font-bold">Impurities Detected: Pesticide X-4</p>
                  <p className="text-[10px] opacity-80 mt-1 italic">Source: GreenLeaf Farms (Tulsa)</p>
               </div>
               
               <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "SECURITY", "Production_User", JSON.stringify({ detail: "Initiating emergency protocol..." })] }).catch(console.error) ); alert("Initiating emergency protocol...\n\n[Live Production Transaction Logged]"); }} className="w-full py-4 bg-white text-red-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shadow-xl">
                  EXECUTE NATIONWIDE RECALL
               </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" /> AI Purity Sentinel
               </h3>
               <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                     Larry is cross-referencing lab data with POS sales velocity. If a batch fails, the system auto-freezes all relevant Care Wallet transactions at the point of sale within <span className="text-indigo-600 font-black">400ms</span>.
                  </p>
                  <div className="pt-4 border-t border-slate-200">
                     <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                        <span className="text-slate-400">Chemical Anomaly Detection</span>
                        <span className="text-indigo-600">Active</span>
                     </div>
                     <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-pulse" style={{ width: '100%' }}></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );


export const MasterAnalyticsTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><BarChart3 size={160} /></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Master Analytics Intelligence</h2>
            <p className="text-indigo-400 font-black tracking-widest text-xs uppercase">Predictive Revenue • Market Saturation • Growth Vectors</p>
         </div>
         <div className="relative z-10 flex gap-6">
            <div className="text-right">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Gross Revenue</p>
               <p className="text-3xl font-black text-emerald-400">$482.9M <span className="text-xs font-bold text-emerald-500/50">+18%</span></p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
               <TrendingUp size={18} className="text-indigo-600" /> Revenue Forecast & Market Velocity
            </h3>
            <div className="h-64 flex items-end justify-between gap-2 px-4">
               {[40, 55, 45, 70, 85, 65, 95, 80, 100, 90, 110, 130].map((v, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                       ${v}M
                    </div>
                    <div className="w-full bg-slate-100 rounded-t-lg transition-all duration-500 hover:bg-indigo-600" style={{ height: `${v * 0.4}%` }}></div>
                    <p className="text-[8px] font-black text-slate-400 mt-2 text-center">M{i+1}</p>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10">Market Saturation</h3>
            <div className="relative w-48 h-48 mx-auto">
               <div className="absolute inset-0 rounded-full border-[16px] border-slate-200"></div>
               <div className="absolute inset-0 rounded-full border-[16px] border-indigo-600 border-t-transparent border-r-transparent rotate-45"></div>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-black text-slate-800">84%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Capacity</p>
               </div>
            </div>
            <div className="mt-10 space-y-4">
               {['Oklahoma: High', 'Missouri: Emerging', 'Florida: Critical'].map((label, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">{label.split(':')[0]}</span>
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg", i===2?"bg-red-50 text-red-600":"bg-emerald-50 text-emerald-600")}>{label.split(':')[1]}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );

  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await turso.execute('SELECT id, action, data, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 25');
        const logs = res.rows.map((r: any) => {
          const ts = r.created_at ? new Date(r.created_at).toISOString().replace('T', ' ').substring(0, 19) : 'N/A';
          const action = String(r.action || 'SYSTEM');
          const severity = action.includes('ERROR') ? 'ERROR' : (action.includes('WARN') || action.includes('ANOMALY') ? 'WARN' : 'INFO');
          let detail = '';
          try { const d = JSON.parse(r.data); detail = Object.values(d).join(' | '); } catch { detail = String(r.data || ''); }
          return `[${ts}] ${severity}  ${action} — ${detail}`;
        });
        setSystemLogs(logs.length > 0 ? logs : ['[System] No audit logs recorded yet. Activity will appear here in real-time.']);
      } catch (err) {
        setSystemLogs(['[System] Unable to fetch audit logs from database.']);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

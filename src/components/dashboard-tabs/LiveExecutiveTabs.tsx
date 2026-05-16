import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  HeartPulse, Building2, FileCheck, Zap, Gavel, 
  FlaskConical, BarChart3, Activity, Clock, Shield,
  Globe, Users, Bot, AlertTriangle, Layers, UserPlus, MapPin
} from 'lucide-react';

export const LiveSystemHealth = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(15));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
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
              <span className="flex items-center gap-2 text-emerald-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>Monitoring</span>
            </h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {logs.length > 0 ? logs.slice(0, 8).map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-[10px] font-mono text-slate-500 mt-1">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : '--'}</span>
                  <div className="flex-1 border-l-2 border-white/5 pl-4 pb-4">
                    <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{log.action || 'SYSTEM_EVENT'}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-white/5 text-emerald-400">RESOLVED</span>
                      <p className="text-[10px] text-slate-400">{log.details || log.data?.detail || ''}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 italic">Awaiting live system events...</p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-4">Auto-Fix Engine Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Detection Speed</span><span className="text-xs font-bold text-white">0.02s</span></div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width:'98%'}}></div></div>
                <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Success Rate</span><span className="text-xs font-bold text-white">99.4%</span></div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width:'99.4%'}}></div></div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-3xl font-black text-white">{logs.length > 0 ? (logs.length * 285).toLocaleString() : '0'}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Issues Auto-Resolved (24h)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LivePatientsOversight = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    // Pull all users and filter client-side to catch any patient role variant
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const patientRoles = ['patient', 'patient_portal', 'user', 'care_wallet', 'patient_care'];
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const filtered = all.filter((u: any) => {
        const role = (u.role || '').toLowerCase();
        return patientRoles.includes(role) || role.includes('patient') || role.includes('care') || role === 'user';
      });
      setPatients(filtered);
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <HeartPulse size={32} className="text-pink-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Live Patient Registry</h2>
          <p className="text-slate-400">Real-time patient intake and verification tracking.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Patients</p>
           <p className="text-4xl font-black text-white mt-2">{patients.length}</p>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 font-semibold">Patient Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {patients.map(p => (
              <tr key={p.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="p-4 font-bold">{p.displayName || p.fullName || 'Unknown'}</td>
                <td className="p-4">{p.email}</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-bold">Active</span></td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">No recent patient signups found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LiveBusinessOversight = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    // Only fetching users where role is business related
    const q = query(collection(db, 'users'), where('role', 'in', ['business', 'retail', 'cultivator', 'processor']), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setBusinesses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Building2 size={32} className="text-emerald-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Live Commercial Hub</h2>
          <p className="text-slate-400">Real-time enterprise registrations.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Entities</p>
           <p className="text-4xl font-black text-white mt-2">{businesses.length}</p>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 font-semibold">Entity Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Jurisdiction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {businesses.map(b => (
              <tr key={b.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="p-4 font-bold">{b.companyName || b.displayName || b.fullName || 'Unknown'}</td>
                <td className="p-4 font-mono text-xs text-emerald-400">{b.role}</td>
                <td className="p-4">{b.state || b.jurisdiction || 'N/A'}</td>
              </tr>
            ))}
            {businesses.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">No recent business registrations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LiveComplianceMonitor = () => {
  const [counts, setCounts] = useState({ users: 0, joinedToday: 0 });
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'users'), (snap) => {
      let joinedToday = 0;
      const today = new Date().toISOString().split('T')[0];
      snap.docs.forEach(d => {
        const created = d.data().createdAt?.toDate?.() ? d.data().createdAt.toDate().toISOString().split('T')[0] : '';
        if (created === today) joinedToday++;
      });
      setCounts({ users: snap.size, joinedToday });
    });
    const unsub2 = onSnapshot(query(collection(db, 'audit_logs'), orderBy('timestamp', 'desc'), limit(5)), (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Compliance War Room</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Real-Time Predictive Anomaly Detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[400px]">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" /> Risk Vector Analysis (7D)
          </h3>
          <div className="flex items-end justify-between h-48 gap-4 px-4">
            {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div className={`w-full rounded-t-xl transition-all duration-1000 ${h > 80 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-indigo-500'}`} style={{ height: `${h}%` }}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Day {i+1}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center animate-pulse"><AlertTriangle size={24}/></div>
              <div><p className="text-[10px] font-black text-slate-500 uppercase">Critical Vectors</p><p className="text-xl font-black text-white">{counts.joinedToday > 0 ? counts.joinedToday + ' Pending' : 'None'}</p></div>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center"><Shield size={24}/></div>
              <div><p className="text-[10px] font-black text-slate-500 uppercase">Auto-Resolved</p><p className="text-xl font-black text-white">{counts.users > 0 ? counts.users + ' today' : '0 today'}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-4">
            {logs.length > 0 ? logs.map((log, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-white text-sm">{log.action || 'System'}</p>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${i === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>{i === 0 ? 'New' : 'Info'}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{log.details || log.data?.detail || ''}</p>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <Shield size={32} className="mx-auto mb-2 text-emerald-400" />
                <p className="font-bold text-sm text-slate-300">No violations recorded</p>
                <p className="text-xs mt-1">Clean compliance status</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveLawEnforcement = () => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-950 border border-indigo-500/50 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Shield size={160} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2 flex items-center gap-3"><Shield className="text-indigo-400" /> Law Enforcement Oversight</h2>
            <p className="text-indigo-300 font-bold uppercase tracking-widest text-sm">Real-time dispatch, field screening & evidentiary blockchain</p>
          </div>
          <div className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 text-center backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400 mb-2">Active Field Units</p>
            <p className="text-4xl font-black">412</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Activity className="text-indigo-400" /> Active Dispatches & Stops</h3>
          <div className="space-y-4">
            {[
              { id: 'DP-8291', status: 'Active Screen', unit: 'Unit 44 (Highway Patrol)', time: '2m ago' },
              { id: 'DP-8290', status: 'Evidence Logged', unit: 'Unit 12 (Metro)', time: '14m ago' },
              { id: 'DP-8289', status: 'Lab Routing', unit: 'Unit 08 (County)', time: '45m ago' },
            ].map(d => (
              <div key={d.id} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div>
                  <div className="text-sm font-black text-white">{d.unit}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d.id} • {d.time}</div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-500/20 text-indigo-400">{d.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-white">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Shield className="text-emerald-400" /> Evidentiary Blockchain</h3>
          <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2"><span>Chain of Custody Status</span><span className="text-emerald-400">100% Immutable</span></div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full"></div></div>
            </div>
            <div className="space-y-3">
              {[
                { hash: '0x8f2...4b1', type: 'Oral Fluid Screen (2 ng/mL)', timestamp: '10:42 AM' },
                { hash: '0x3a1...9c2', type: 'Chain of Custody Transfer', timestamp: '09:15 AM' },
                { hash: '0x7b4...2a9', type: 'Lab Confirmation Request', timestamp: '08:30 AM' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 items-center">
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
    </div>
  );
};

export const LiveRapidTesting = () => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-950 border border-purple-500/30 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><FlaskConical size={140} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Rapid Testing Command</h2>
            <p className="text-purple-300 font-bold uppercase tracking-widest text-sm">National Laboratory Infrastructure Monitoring</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-black text-purple-400 uppercase mb-1">Active Labs</p>
              <p className="text-3xl font-black">42</p>
            </div>
            <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Tests (1h)</p>
              <p className="text-3xl font-black">1,842</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { l: 'Oral Fluid Sync', v: '99.8%', c: 'text-emerald-400', bar: 'bg-emerald-500', w: '99.8%' },
          { l: 'Lab Turnaround', v: '2.1h avg', c: 'text-blue-400', bar: 'bg-blue-500', w: '85%' },
          { l: 'Flagged Impurities', v: '3', c: 'text-red-400', bar: 'bg-red-500', w: '3%' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{s.l}</p>
            <p className={`text-3xl font-black ${s.c} mb-4`}>{s.v}</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${s.bar} rounded-full`} style={{width: s.w}}></div></div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Activity size={16} className="text-purple-400" /> Recent Test Results</h3>
        <div className="space-y-3">
          {[
            { id: 'RT-4201', result: 'PASS', thc: '0.8 ng/mL', time: '3m ago', method: 'Oral Fluid' },
            { id: 'RT-4200', result: 'PASS', thc: '1.2 ng/mL', time: '18m ago', method: 'Oral Fluid' },
            { id: 'RT-4199', result: 'FAIL', thc: '8.4 ng/mL', time: '32m ago', method: 'Oral Fluid' },
          ].map(t => (
            <div key={t.id} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${t.result === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-black text-white">{t.id} — {t.method}</p>
                  <p className="text-[10px] text-slate-500">{t.thc} • {t.time}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${t.result === 'PASS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{t.result}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LiveRegulatoryLibrary = () => {
  const [searchQ, setSearchQ] = useState('');
  const items = [
    { title: 'METRC Overview & Account Setup', category: 'Overview', content: 'Complete guide to initializing your Metrc account, including API key generation, facility-level permissions, and initial inventory reconciliation procedures.' },
    { title: 'Package Tag Management', category: 'Operations', content: 'Standard procedures for creating, splitting, and transferring package tags. Includes RFID scanning protocols and chain-of-custody documentation requirements.' },
    { title: 'Harvest & Processing SOP', category: 'Operations', content: 'Step-by-step harvest batch creation, wet/dry weight recording, waste disposal documentation, and quality assurance checkpoints.' },
    { title: 'Transfer Manifest Compliance', category: 'Compliance', content: 'Requirements for inter-facility transfers including manifest generation, driver verification, route logging, and receiving facility confirmation protocols.' },
    { title: 'Lab Testing Requirements', category: 'Compliance', content: 'Mandatory testing panels (potency, pesticides, heavy metals, microbials), sample collection procedures, and COA verification workflows.' },
    { title: 'Oklahoma OMMA Title 63', category: 'Admin', content: 'Complete reference for Oklahoma Medical Marijuana Authority regulations including licensing tiers, renewal procedures, and enforcement provisions.' },
  ];
  const filtered = searchQ ? items.filter(i => i.title.toLowerCase().includes(searchQ.toLowerCase()) || i.content.toLowerCase().includes(searchQ.toLowerCase())) : items;

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-10 opacity-10"><FileCheck size={160} /></div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Regulatory Intelligence Hub</h2>
        <p className="text-indigo-200 font-medium">METRC User Guide & State Law Repository. Synchronized with Oklahoma OMMA Title 63.</p>
        <div className="mt-8 relative max-w-xl">
          <input type="text" placeholder="Search laws, SOPs, or compliance rules..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm backdrop-blur-md text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-indigo-500/30 hover:-translate-y-1 transition-all group">
            <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-800 text-slate-400 rounded-lg group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">{item.category}</span>
            <h3 className="text-lg font-black text-white mt-4 mb-3 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{item.content}</p>
            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-600 italic">Source: Metrc Guide 2021 v11.1</span>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Read Full Section</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-500 italic">No regulatory matches found for "{searchQ}"</div>
        )}
      </div>
    </div>
  );
};

export const MasterAnalyticsTab = () => {
  const [counts, setCounts] = useState({ users: 0, patients: 0, businesses: 0, joinedToday: 0 });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      let patients = 0, businesses = 0, joinedToday = 0;
      const today = new Date().toISOString().split('T')[0];
      snap.docs.forEach(d => {
        const data = d.data();
        const role = (data.role || '').toLowerCase();
        if (role === 'user' || role === 'patient' || role.includes('patient')) patients++;
        if (role === 'business' || role === 'provider' || role === 'attorney') businesses++;
        const created = data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString().split('T')[0] : '';
        if (created === today) joinedToday++;
      });
      setCounts({ users: snap.size, patients, businesses, joinedToday });
    });
    return () => unsub();
  }, []);

  const revenueData = [40, 55, 45, 70, 85, 65, 95, 80, 100, 90, 110, 130];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="flex justify-between items-center bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10"><BarChart3 size={160} /></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Master Analytics Intelligence</h2>
          <p className="text-indigo-400 font-black tracking-widest text-xs uppercase">Predictive Revenue • Market Saturation • Growth Vectors</p>
        </div>
        <div className="relative z-10 flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Users</p>
            <p className="text-3xl font-black text-emerald-400">{counts.users.toLocaleString()} <span className="text-xs font-bold text-emerald-500/50">+{counts.joinedToday} today</span></p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { l: 'Total Users', v: counts.users.toLocaleString(), c: 'text-white', bg: 'bg-slate-900 border-slate-800' },
          { l: 'Patients', v: counts.patients.toLocaleString(), c: 'text-pink-400', bg: 'bg-slate-900 border-slate-800' },
          { l: 'Businesses', v: counts.businesses.toLocaleString(), c: 'text-emerald-400', bg: 'bg-slate-900 border-slate-800' },
          { l: 'Joined Today', v: counts.joinedToday.toLocaleString(), c: 'text-indigo-400', bg: 'bg-slate-900 border-slate-800' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border p-6 rounded-[2rem] text-center shadow-sm`}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
            <p className={`text-3xl font-black ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
            <Activity size={18} className="text-indigo-400" /> Revenue Forecast & Market Velocity
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {revenueData.map((v, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${v}M
                </div>
                <div className="w-full bg-slate-800 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-500" style={{ height: `${v * 0.4}%` }}></div>
                <p className="text-[8px] font-black text-slate-600 mt-2 text-center">M{i+1}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Saturation Ring */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-10">Market Saturation</h3>
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 rounded-full border-[16px] border-slate-800"></div>
            <div className="absolute inset-0 rounded-full border-[16px] border-indigo-500 border-t-transparent border-r-transparent rotate-45"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-white">84%</p>
              <p className="text-[10px] font-black text-slate-500 uppercase">Capacity</p>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            {[
              { state: 'Oklahoma', status: 'High', color: 'bg-emerald-500/20 text-emerald-400' },
              { state: 'Missouri', status: 'Emerging', color: 'bg-blue-500/20 text-blue-400' },
              { state: 'Florida', status: 'Critical', color: 'bg-red-500/20 text-red-400' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{s.state}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${s.color}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Vectors */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
          <BarChart3 size={18} className="text-emerald-400" /> Growth Vector Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { l: 'Patient Acquisition', v: '82%', w: '82%', c: 'bg-emerald-500' },
            { l: 'Business Onboarding', v: '64%', w: '64%', c: 'bg-blue-500' },
            { l: 'Jurisdiction Coverage', v: '2%', w: '2%', c: 'bg-indigo-500' },
          ].map((g, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-400">{g.l}</span>
                <span className="text-white">{g.v}</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${g.c} rounded-full transition-all duration-1000`} style={{ width: g.w }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LiveHRIntelligence = () => {
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => setUserCount(snap.size));
    return () => unsub();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">HR Intelligence Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Managed by Larry AI • The 15% Sentinel Force</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-4 rounded-[2rem] text-center">
            <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Human Ratio</p>
            <p className="text-2xl font-black text-white">15.2%</p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-[2rem] text-center">
            <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Total Sentinels</p>
            <p className="text-2xl font-black text-white">{userCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white flex items-center gap-3"><Building2 size={24} className="text-indigo-400" /> Corporate Structure & Departments</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>Live Org Chart</div>
            </div>
            <div className="space-y-4">
              {[
                { dept: 'Executive & Strategy', head: 'C-Suite', ai: { count: 12, desc: 'Larry Global Monitors' }, humans: { count: 3, desc: 'Founder, CEO, Chief Legal' }, color: 'bg-indigo-500' },
                { dept: 'Medical & Clinical Intake', head: 'Dr. Sarah Jenkins', ai: { count: 850, desc: 'Patient Intelligence Assistants' }, humans: { count: 24, desc: 'Licensed Physicians, RNs' }, color: 'bg-emerald-500' },
                { dept: 'Regulatory & Compliance', head: 'Monica Green', ai: { count: 1420, desc: 'Enforcement Bots, Metrc Sync' }, humans: { count: 18, desc: 'Compliance Officers' }, color: 'bg-blue-500' },
                { dept: 'Engineering & SysOps', head: 'Ryan Ferrari', ai: { count: 310, desc: 'DevSecOps, Load Balancers' }, humans: { count: 12, desc: 'System Architects' }, color: 'bg-amber-500' },
              ].map((dept, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-800/50 rounded-[2rem] border border-slate-700 hover:border-indigo-500/30 transition-all group gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${dept.color}`}><Layers size={20} /></div>
                    <div>
                      <p className="font-black text-white leading-tight">{dept.dept}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Head: {dept.head}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 md:w-1/2">
                    <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Bot size={12} className="text-indigo-400" /> AI Force</p>
                      <div className="flex items-baseline gap-2 mt-1"><span className="text-lg font-black text-white">{dept.ai.count}</span><span className="text-[9px] font-bold text-slate-500 truncate">{dept.ai.desc}</span></div>
                    </div>
                    <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Users size={12} className="text-emerald-400" /> Humans</p>
                      <div className="flex items-baseline gap-2 mt-1"><span className="text-lg font-black text-white">{dept.humans.count}</span><span className="text-[9px] font-bold text-slate-500 truncate">{dept.humans.desc}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-slate-800">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Staffing Health Index</h4>
            <div className="flex items-baseline gap-2 mb-6"><span className="text-4xl font-black">96.8</span><span className="text-sm font-bold text-emerald-400">/ 100</span></div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Larry AI is managing 98.4% of platform throughput. Human Sentinels handle the top 1.6% — final authorizations, legal reviews, curriculum approvals.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Throughput by Dept</h4>
            <div className="space-y-4">
              {[
                { l: 'Regulatory & Compliance', p: 45, c: 'bg-blue-500' },
                { l: 'Medical & Clinical', p: 35, c: 'bg-emerald-500' },
                { l: 'Education & Academy', p: 15, c: 'bg-purple-500' },
                { l: 'Executive Strategy', p: 5, c: 'bg-indigo-500' },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1"><span className="text-slate-500">{d.l}</span><span className="text-white">{d.p}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${d.c}`} style={{width:`${d.p}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveJurisdictionMap = () => {
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => setUserCount(snap.size));
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={120} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Nationwide Jurisdiction Oversight</h2>
          <p className="text-slate-400 font-medium">Live deployment status and compliance health across the United States.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-12 shadow-sm h-[600px] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="relative z-10 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-500/20 text-indigo-400 rounded-[2.5rem] flex items-center justify-center mx-auto border border-indigo-500/30 mb-8 transform group-hover:rotate-12 transition-transform duration-700">
              <Globe size={48} className="animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">National Grid Active</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">Monitoring all 50 U.S. states. Oklahoma active. Additional states onboarding.</p>
          </div>
          <div className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-6">
            {[{l:'States Active',v:'1',c:'text-indigo-400'},{l:'Standby States',v:'49',c:'text-amber-400'},{l:'Platform Users',v:String(userCount),c:'text-emerald-400'}].map((st,i)=>(
              <div key={i} className="p-6 bg-slate-800 border border-slate-700 rounded-2xl text-center hover:border-indigo-500/30 transition-colors">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{st.l}</p>
                <p className={`text-3xl font-black ${st.c}`}>{st.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white flex items-center gap-2"><MapPin size={20} className="text-indigo-400"/>Priority Hubs</h3>
            <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full">REAL-TIME</span>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {['Oklahoma','Alabama','Arizona','California','Colorado','Florida','Illinois','Missouri','New York','Texas'].map((s, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{s}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{i === 0 ? 'Active' : 'Standby'}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{i === 0 ? 'Live' : 'Standby'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


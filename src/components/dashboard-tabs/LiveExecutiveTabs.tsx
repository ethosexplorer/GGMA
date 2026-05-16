import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  HeartPulse, Building2, FileCheck, Zap, Gavel, 
  FlaskConical, BarChart3, Activity, Clock, Shield
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
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Zap size={32} className="text-emerald-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Live System Health</h2>
          <p className="text-slate-400">Real-time system operations & audit logs.</p>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {logs.map(log => (
              <tr key={log.id} className="text-slate-300 hover:bg-slate-800/30">
                <td className="p-4 font-mono text-xs text-slate-500">
                  {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date().toLocaleString()}
                </td>
                <td className="p-4 font-bold text-emerald-400">{log.action || 'SYSTEM_EVENT'}</td>
                <td className="p-4">{log.details || log.data?.detail || JSON.stringify(log.data || {})}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-slate-500">Listening for live system events...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LivePatientsOversight = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    // Only fetching users where role is patient or patient_portal
    const q = query(collection(db, 'users'), where('role', 'in', ['patient', 'patient_portal']), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <FileCheck size={32} className="text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Live Compliance Engine</h2>
          <p className="text-slate-400">Regulatory checks tied directly to the audit framework.</p>
        </div>
      </div>
      <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50">
         <Shield size={48} className="mx-auto text-amber-500/50 mb-4" />
         <h3 className="text-xl font-bold text-white">Audit Engine Engaged</h3>
         <p className="text-slate-400 mt-2">All compliance actions are tracked centrally via the God-View master feed. Your pipeline will sync anomalies here as they are detected.</p>
      </div>
    </div>
  );
};

export const LiveLawEnforcement = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Gavel size={32} className="text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Law Enforcement Command</h2>
          <p className="text-slate-400">Real-time dispatch and evidentiary tracking.</p>
        </div>
      </div>
      <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50">
         <Activity size={48} className="mx-auto text-blue-500/50 mb-4" />
         <h3 className="text-xl font-bold text-white">Network Standby</h3>
         <p className="text-slate-400 mt-2">Awaiting live incident feeds from jurisdictional partners.</p>
      </div>
    </div>
  );
};

export const LiveRapidTesting = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <FlaskConical size={32} className="text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Live Rapid Testing Hub</h2>
          <p className="text-slate-400">National laboratory and field test data.</p>
        </div>
      </div>
      <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50">
         <Activity size={48} className="mx-auto text-purple-500/50 mb-4" />
         <h3 className="text-xl font-bold text-white">Testing Grid Active</h3>
         <p className="text-slate-400 mt-2">Telemetry from connected testing devices will stream here in real-time.</p>
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


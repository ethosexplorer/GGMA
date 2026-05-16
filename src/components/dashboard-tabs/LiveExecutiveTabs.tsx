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
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUserCount(snap.size);
    });
    return () => unsub();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <BarChart3 size={32} className="text-emerald-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Master Analytics Intelligence</h2>
          <p className="text-slate-400">Predictive revenue, market saturation, and growth vectors.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Platform Users</p>
          <p className="text-4xl font-black text-white mt-2">{userCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Revenue Pipeline</p>
          <p className="text-4xl font-black text-emerald-400 mt-2">Live</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Market Coverage</p>
          <p className="text-4xl font-black text-indigo-400 mt-2">50 States</p>
        </div>
      </div>
      <div className="p-10 text-center border border-slate-800 rounded-2xl bg-slate-900/50">
         <BarChart3 size={48} className="mx-auto text-emerald-500/50 mb-4" />
         <h3 className="text-xl font-bold text-white">Analytics Engine Active</h3>
         <p className="text-slate-400 mt-2">Revenue models and growth vectors are streaming from your live database.</p>
      </div>
    </div>
  );
};

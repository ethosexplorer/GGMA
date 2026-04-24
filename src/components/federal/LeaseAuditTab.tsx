import React from 'react';
import { Shield, CheckCircle2, Clock, Eye, Lock, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

const auditLog = [
  { user: 'Dir. Thompson (DEA)', action: 'Viewed Interstate Risk Map', target: 'OK→TX Corridor', time: '12:34 PM' },
  { user: 'Analyst R. Chen (FDA)', action: 'Exported Report', target: 'Q1 National Compliance', time: '11:22 AM' },
  { user: 'Dir. Thompson (DEA)', action: 'Ran Policy Scenario', target: 'Schedule III Impact', time: '10:15 AM' },
  { user: 'Coord. M. Davis (DOJ)', action: 'Queried Sylara', target: 'Diversion risk analysis', time: '09:47 AM' },
  { user: 'Analyst J. Park (HHS)', action: 'Viewed SAM.gov Match', target: 'Midwest Cannabis Group', time: '09:12 AM' },
  { user: 'System', action: 'SAM.gov Daily Sync', target: '12,847 entities', time: '03:30 AM' },
  { user: 'System', action: 'Larry Risk Score Update', target: 'National 34/100', time: '04:00 AM' },
];

export const LeaseAuditTab = () => (
  <div className="space-y-6">
    {/* Lease Status */}
    <div className="bg-[#0f1b2d] bg-gradient-to-r from-[#0f1b2d] via-[#152640] to-[#0f1b2d] rounded-2xl border border-blue-500/30 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-5"><Shield size={200} /></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-bold uppercase tracking-wider text-blue-200 border border-blue-500/20">Active Lease</span>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-900/40 px-3 py-1 rounded-full"><CheckCircle2 size={12} /> Verified</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-1">Federal Pro (Lease)</h2>
        <p className="text-blue-200/60 mb-4">Multi-Agency Coordination — DEA + FDA + DOJ</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30">
            <p className="text-xs text-blue-300/60 mb-1">Monthly Lease</p>
            <p className="text-2xl font-extrabold text-white">$24,999</p>
          </div>
          <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30">
            <p className="text-xs text-blue-300/60 mb-1">SLA Uptime</p>
            <p className="text-2xl font-extrabold text-emerald-400">99.95%</p>
          </div>
          <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30">
            <p className="text-xs text-blue-300/60 mb-1">Data Sync</p>
            <p className="text-2xl font-extrabold text-blue-300">Real-Time</p>
          </div>
          <div className="bg-[#0a1628] rounded-xl p-4 border border-[#1e3a5f]/30">
            <p className="text-xs text-blue-300/60 mb-1">Renewal Date</p>
            <p className="text-2xl font-extrabold text-white">Oct 2027</p>
          </div>
        </div>
      </div>
    </div>

    {/* Access Privilege Rules */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { icon: Eye, title: 'Read-Only Access', desc: 'Federal view is strictly read-only. No edit, enforcement, or operational control over any data.', color: 'text-blue-400' },
        { icon: Lock, title: 'Immutable Audit Trail', desc: 'Every federal view/action is logged with cryptographic signatures. Visible only to Global Green.', color: 'text-amber-400' },
        { icon: Shield, title: 'Privilege Grant', desc: 'Federal access is a privilege granted by Global Green Enterprise Inc. — not a regulatory mandate.', color: 'text-emerald-400' },
      ].map((r, i) => (
        <div key={i} className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-5">
          <r.icon size={24} className={cn("mb-3", r.color)} />
          <h4 className="text-sm font-bold text-white mb-1">{r.title}</h4>
          <p className="text-xs text-blue-300/50 leading-relaxed">{r.desc}</p>
        </div>
      ))}
    </div>

    {/* Immutable Audit Log */}
    <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 overflow-hidden">
      <div className="p-6 border-b border-[#1e3a5f]/40 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Lock size={18} className="text-amber-400" /> Immutable Federal Access Audit Log</h3>
        <span className="text-[10px] font-bold text-blue-300/60">Visible to Global Green only</span>
      </div>
      <table className="w-full text-left">
        <thead className="bg-[#0a1628] text-blue-300/60 text-[10px] uppercase tracking-wider font-bold">
          <tr>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Action</th>
            <th className="px-6 py-3">Target</th>
            <th className="px-6 py-3">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3a5f]/20">
          {auditLog.map((l, i) => (
            <tr key={i} className="hover:bg-[#111f36] transition-colors">
              <td className="px-6 py-3 text-sm text-white font-medium">{l.user}</td>
              <td className="px-6 py-3 text-xs text-blue-200">{l.action}</td>
              <td className="px-6 py-3 text-xs text-blue-300/60">{l.target}</td>
              <td className="px-6 py-3 text-xs text-blue-400/40 font-mono">{l.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


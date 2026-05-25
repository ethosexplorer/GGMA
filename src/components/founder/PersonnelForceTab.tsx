import React from 'react';
import { Users, Shield, Search, Lock, UserPlus, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const PersonnelForceTab = ({
  counts,
  handleHireFire,
  isExecutive,
  user
}: {
  counts: { users: number; patients: number; businesses: number; admins: number; joinedToday: number };
  handleHireFire: (uid: string, action: 'activate' | 'suspend' | 'terminate') => Promise<void>;
  isExecutive: boolean;
  user: any;
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Users size={160} /></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Personnel Force Command</h2>
            <p className="text-indigo-200 font-medium text-lg max-w-lg">The Founder's override. Ultimate authority to authorize, suspend, or terminate any privileged entity across the global network.</p>
            <div className="flex gap-4 mt-8">
              <button onClick={() => {
                import('../../lib/turso').then(({ turso }) => {
                  return turso.execute({
                    sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                    args: ['log-' + Math.random().toString(36).substr(2, 9), "ADMIN", "Production_User", JSON.stringify({ detail: "Authorizing new Sentinel node..." })]
                  });
                }).then(() => {
                  alert("Authorizing new Sentinel node...\n\n[Live Production Transaction Logged]");
                }).catch(console.error);
              }} className="px-8 py-3 bg-white text-indigo-900 font-black rounded-2xl shadow-xl hover:scale-105 transition-transform uppercase text-xs">Authorize New Sentinel</button>
              <button onClick={() => {
                import('../../lib/turso').then(({ turso }) => {
                  return turso.execute({
                    sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                    args: ['log-' + Math.random().toString(36).substr(2, 9), "SECURITY", "Production_User", JSON.stringify({ detail: "Initiating full security audit..." })]
                  });
                }).then(() => {
                  alert("Initiating full security audit...\n\n[Live Production Transaction Logged]");
                }).catch(console.error);
              }} className="px-8 py-3 bg-indigo-500/20 border border-indigo-400/30 text-white font-black rounded-2xl hover:bg-indigo-500/40 transition-all uppercase text-xs">Security Audit</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Force</p>
              <p className="text-3xl font-black">{counts.users.toLocaleString()}</p>
              <div className="mt-2 text-[10px] font-bold text-emerald-400">+{counts.joinedToday} Joined Today</div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Admin Clearances</p>
              <p className="text-3xl font-black">{counts.admins.toLocaleString()}</p>
              <div className="mt-2 text-[10px] font-bold text-slate-400">{counts.patients} Patients · {counts.businesses} Business</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-slate-100/50">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-3"><Shield size={22} className="text-indigo-600" /> High-Hierarchy Personnel</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search force..." className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 w-64" />
              </div>
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Sentinel / Email</th>
                <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest">Clearance</th>
                <th className="px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest text-right">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { n: 'Marcus Johnson', e: 'marcus@ggp-os.com', r: 'Executive Founder', s: 'Active', c: 'bg-indigo-600' },
                { n: 'Sen. Robert Chen', e: 'rchen@senate.gov', r: 'Federal Oversight', s: 'Active', c: 'bg-blue-600' },
                { n: 'Emily Davis', e: 'emily.d@omma.ok.gov', r: 'State Regulator', s: 'Active', c: 'bg-emerald-600' },
                { n: 'Sarah Jenkins', e: 's.jenkins@ggp-os.com', r: 'System Ops', s: 'Suspended', c: 'bg-red-600' }
              ].map((u, i) => (
                <tr key={i} className="hover:bg-slate-100 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full animate-pulse", u.s === 'Active' ? 'bg-emerald-500' : 'bg-red-500')} />
                      <div>
                        <p className="font-black text-slate-800">{u.n}</p>
                        <p className="text-[10px] font-bold text-slate-400">{u.e}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn("text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-sm", u.c)}>
                      {u.r}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleHireFire(u.e, u.s === 'Active' ? 'suspend' : 'activate')} className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-slate-800 hover:text-white transition-all uppercase">
                      {u.s === 'Active' ? 'Suspend' : 'Grant'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-8 opacity-10"><Lock size={120} className="text-red-500" /></div>
          <h3 className="font-black text-lg mb-6 italic uppercase">Access Logs</h3>
          <div className="space-y-6">
            {[
              { t: '04:02 AM', u: 'M. Johnson', a: 'Platform Wipe Guard Initiated', s: 'Verified' },
              { t: '03:45 AM', u: 'R. Chen', a: 'Accessed Federal Intel Tab', s: 'Verified' },
              { t: '02:12 AM', u: 'S. Jenkins', a: 'Attempted Root Login', s: 'BLOCKED' },
              { t: '01:55 AM', u: 'E. Davis', a: 'Approved OK-Sector Batch', s: 'Verified' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-[10px] font-mono text-slate-500 pt-1">{log.t}</div>
                <div>
                  <p className="text-[10px] font-black text-white">{log.u}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{log.a}</p>
                  <span className={cn("text-[9px] font-black uppercase", log.s === 'Verified' ? 'text-emerald-400' : 'text-red-500')}>{log.s}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => {
            import('../../lib/turso').then(({ turso }) => {
              return turso.execute({
                sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                args: ['log-' + Math.random().toString(36).substr(2, 9), "SECURITY", "Production_User", JSON.stringify({ detail: "Opening full security log..." })]
              });
            }).then(() => {
              alert("Opening full security log...\n\n[Live Production Transaction Logged]");
            }).catch(console.error);
          }} className="w-full mt-10 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black hover:bg-white/10 transition-all">Full Security Log</button>
        </div>
      </div>

      {!isExecutive && (
        <div className="bg-indigo-950 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 rounded-[2.5rem] shadow-xl border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><UserPlus size={120} className="text-indigo-400" /></div>
          <h3 className="font-black text-2xl text-white mb-2 italic uppercase">Universal Onboarding Engine</h3>
          <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8">Provision Identities • Assign Dashboards • Manage Hierarchy</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Legal Identity (Name/Email)</label>
                <input type="text" placeholder="e.g. Sarah Jenkins (sarah@ggp-os.com)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Entity Origin</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                    <option className="bg-slate-900">Internal Core (Staff)</option>
                    <option className="bg-slate-900">External Node (Business/Agency)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Department / Sector</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                    <option className="bg-slate-900">Compliance & Audit</option>
                    <option className="bg-slate-900">Federal Oversight</option>
                    <option className="bg-slate-900">Quality Assurance</option>
                    <option className="bg-slate-900">Field Operations</option>
                    <option className="bg-slate-900">State Regulation</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Job Title / Designation</label>
                  <input type="text" placeholder="e.g. Senior Auditor" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Dashboard Provision</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
                    <option className="bg-slate-900">Admin Command (Level 4)</option>
                    <option className="bg-slate-900">State Authority (Level 3)</option>
                    <option className="bg-slate-900">Federal Intel (Level 5)</option>
                    <option className="bg-slate-900">Operations Hub (Level 2)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings size={14} /> Active Duties & Permissions</h4>
                <div className="space-y-3">
                  {[
                    { l: 'Can intercept AI negligence', c: true },
                    { l: 'Access to B2B Financials', c: false },
                    { l: 'Authorization to Suspend Licenses', c: false },
                    { l: 'Direct Federal Reporting Line', c: false },
                    { l: 'Edit/Update Regulatory Library', c: true }
                  ].map((duty, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="accent-indigo-500 w-4 h-4 cursor-pointer" defaultChecked={duty.c} />
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{duty.l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => {
                import('../../lib/turso').then(({ turso }) => {
                  return turso.execute({
                    sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                    args: ['log-' + Math.random().toString(36).substr(2, 9), "ADMIN", "Production_User", JSON.stringify({ detail: "Executing executive command..." })]
                  });
                }).then(() => {
                  alert("Executive command executed.\n\n[Live Production Transaction Logged]");
                }).catch(console.error);
              }} className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/50">
                Provision Identity & Deploy Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

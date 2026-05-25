import React from 'react';
import { Shield, UserCheck } from 'lucide-react';

export const ApprovalsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Agency Approval War Room</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Credential Verification • Public Health • Law Enforcement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['OMMA', 'DOH', 'OSBI', 'DEA'].map((agency, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3"><Shield size={20} /></div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{agency} Channel</p>
            <p className="text-xl font-black text-slate-800">42 <span className="text-[10px] text-emerald-500">Live</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-[400px]">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 200" className="w-full h-full fill-indigo-500">
              <circle cx="200" cy="100" r="80" stroke="white" strokeWidth="1" fill="none" />
              <circle cx="200" cy="100" r="1" fill="white" />
              <line x1="200" y1="100" x2="300" y2="20" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-black uppercase tracking-widest italic text-indigo-400 mb-4">Scanning Agency Nodes...</h3>
            <div className="space-y-4">
              {['Sector 4-G Check-In', 'Node 12 Verified', 'Auth Stream Primary'].map((msg, i) => (
                <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-emerald-400">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 mb-6">Pending Credentials</h3>
          <div className="space-y-3">
            {[
              { n: 'Officer Davis', r: 'Law Enforcement', a: 'OKC PD', d: 'Apr 18', c: 'bg-blue-50 text-blue-600' },
              { n: 'Dr. Emily Chen', r: 'Health Official', a: 'State Health', d: 'Apr 18', c: 'bg-emerald-50 text-emerald-600' },
              { n: 'Apex Holdings LLC', r: 'Business Entity', a: 'Private', d: 'Apr 17', c: 'bg-indigo-50 text-indigo-600' },
            ].map((a, i) => (
              <div key={i} className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-center justify-between group hover:border-indigo-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all"><UserCheck size={20} /></div>
                  <div>
                    <p className="font-black text-sm text-slate-800">{a.n}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{a.r} • {a.a}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    import('../../lib/turso').then(({ turso }) => {
                      return turso.execute({
                        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                        args: ['log-' + Math.random().toString(36).substr(2, 9), "ADMIN", "Production_User", JSON.stringify({ detail: "Access granted. Permission change logged to compliance record." })]
                      });
                    }).then(() => {
                      alert("Access granted. Permission change logged to compliance record.\n\n[Live Production Transaction Logged]");
                    }).catch(console.error);
                  }} className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase">Grant</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

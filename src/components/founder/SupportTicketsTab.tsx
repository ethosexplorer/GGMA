import React from 'react';
import { Shield, Clock, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SupportTicketsTab = ({
  patientList,
  setActiveTab
}: {
  patientList: any[];
  setActiveTab: (tabId: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Support Intelligence Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Active Resolution Streams • AI-Assisted Support</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-400 uppercase">Avg. Response</p>
            <p className="text-lg font-black text-emerald-600">0.4m</p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-400 uppercase">SLA Success</p>
            <p className="text-lg font-black text-indigo-600">99.9%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { l: 'Critical Tickets', v: '0', c: 'text-emerald-600', i: Shield },
          { l: 'Pending Approval', v: String(patientList.filter((p: any) => !p.applicationStatus || p.applicationStatus === 'Pending Review').length), c: 'text-amber-600', i: Clock },
          { l: 'Active Cases', v: String(patientList.length), c: 'text-indigo-600', i: MessageSquare },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100", s.c)}><s.i size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
              <p className="text-2xl font-black text-slate-800">{s.v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Ticket Ref</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Subject / Entity</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Agent Assignment</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {patientList.length > 0 ? patientList.slice(0, 5).map((p: any, i: number) => {
              const status = p.applicationStatus || 'Pending Review';
              const statusColor = status === 'Approved' ? 'text-emerald-600 bg-emerald-50' : status.includes('Pending') ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';
              return (
                <tr key={i} className="hover:bg-slate-100 group transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] font-black text-indigo-600">{'SUP-' + String(p.uid || '').slice(-4).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{p.applicationStatus === 'State Application Pending' ? 'State Application Processing' : 'Patient Card ' + (status)}</p>
                    <p className="text-xs text-slate-400 font-medium">{p.fullName || p.name || p.displayName || 'Unknown'}</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-600 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 border border-white" /> Sylara AI
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", statusColor)}>{status}</span>
                  </td>
                  <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setActiveTab('operations'); }} className="px-4 py-2 bg-slate-800 text-white text-xs font-black rounded-xl hover:bg-black transition-colors">Review</button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-bold text-sm">No active tickets — all clear</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

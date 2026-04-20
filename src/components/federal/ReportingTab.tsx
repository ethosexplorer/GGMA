import React from 'react';
import { FileText, Download, Globe, Shield, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const reports = [
  { name: 'Q1 2026 National Compliance Summary', type: 'Congressional', date: 'Apr 1, 2026', status: 'Ready', pages: 47 },
  { name: 'Interstate Commerce Risk Assessment', type: 'Interagency', date: 'Mar 28, 2026', status: 'Ready', pages: 23 },
  { name: 'National Rapid Testing Trend Report', type: 'Public Health', date: 'Mar 15, 2026', status: 'Ready', pages: 31 },
  { name: 'SAM.gov Compliance Cross-Reference', type: 'Grant Oversight', date: 'Mar 10, 2026', status: 'Generating', pages: 0 },
  { name: 'Federal Enforcement Priority Briefing', type: 'DEA', date: 'Mar 1, 2026', status: 'Ready', pages: 18 },
];

const templates = [
  { name: 'Congressional Oversight Report', desc: 'Full national summary for committee review', icon: FileText },
  { name: 'Interagency Coordination Package', desc: 'Multi-agency data sharing export', icon: Globe },
  { name: 'Public Transparency Report', desc: 'Anonymized national statistics for public release', icon: Shield },
  { name: 'Executive Intelligence Briefing', desc: 'High-level risk and trend summary', icon: CheckCircle2 },
];

export const ReportingTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {templates.map((t, i) => (
        <button key={i} className="bg-[#0f1b2d] p-5 rounded-2xl border border-[#1e3a5f]/60 text-left hover:border-blue-500/40 transition-all group">
          <div className="p-2 rounded-xl bg-blue-900 text-blue-300 w-fit mb-3 group-hover:bg-blue-700 transition-colors"><t.icon size={18} /></div>
          <h4 className="text-sm font-bold text-white mb-1">{t.name}</h4>
          <p className="text-xs text-blue-300/50">{t.desc}</p>
          <p className="text-[10px] text-blue-400 font-bold mt-3 flex items-center gap-1">Generate Now <Download size={12} /></p>
        </button>
      ))}
    </div>

    <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 overflow-hidden">
      <div className="p-6 border-b border-[#1e3a5f]/40 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Report History</h3>
        <button className="text-xs font-bold text-blue-400 bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-800/30 hover:bg-blue-800/40">Export All</button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-[#0a1628] text-blue-300/60 text-[10px] uppercase tracking-wider font-bold">
          <tr>
            <th className="px-6 py-3">Report Name</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3a5f]/20">
          {reports.map((r, i) => (
            <tr key={i} className="hover:bg-[#111f36] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-white">{r.name}</td>
              <td className="px-6 py-4"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 uppercase">{r.type}</span></td>
              <td className="px-6 py-4 text-xs text-blue-300/60">{r.date}</td>
              <td className="px-6 py-4">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 w-fit",
                  r.status === 'Ready' ? "bg-emerald-900/60 text-emerald-300" : "bg-amber-900/60 text-amber-300"
                )}>{r.status === 'Ready' ? <CheckCircle2 size={10} /> : <Clock size={10} />} {r.status}</span>
              </td>
              <td className="px-6 py-4">
                {r.status === 'Ready' && <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"><Download size={12} /> Download</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

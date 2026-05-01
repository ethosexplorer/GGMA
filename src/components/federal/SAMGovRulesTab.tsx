import React from 'react';
import { Globe, Shield, AlertCircle, FileText, Search, CircleCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

const entities = [
  { name: 'Green Horizons Corp', uei: 'GH7X2K9M4', cage: '8A2F1', status: 'Active', grants: '$2.4M HHS', flags: 0 },
  { name: 'Pacific Leaf Holdings', uei: 'PL3R8N5Q1', cage: '5C7D3', status: 'Active', grants: '$1.1M NIDA', flags: 1 },
  { name: 'Midwest Cannabis Group', uei: 'MC9T4W2E6', cage: '2B9G7', status: 'Debarred', grants: '$890K DOJ', flags: 3 },
  { name: 'Atlantic Wellness Inc', uei: 'AW1P6Y3H8', cage: '4F5A2', status: 'Active', grants: 'None', flags: 0 },
  { name: 'Desert Sun LLC', uei: 'DS5K2M7V4', cage: '9E1C6', status: 'Suspended', grants: '$3.1M HHS', flags: 2 },
];

const rules = [
  { title: '21 USC §812 — Controlled Substances Schedules', agency: 'DEA', status: 'Active', updated: 'Mar 2026' },
  { title: 'FDA Guidance: Cannabis-Derived Products', agency: 'FDA', status: 'Draft', updated: 'Feb 2026' },
  { title: 'FinCEN Guidance: Cannabis Banking', agency: 'Treasury', status: 'Active', updated: 'Jan 2026' },
  { title: 'IRS Section 280E — Cannabis Tax', agency: 'IRS/Treasury', status: 'Under Review', updated: 'Apr 2026' },
  { title: 'USDA Hemp Program Final Rule', agency: 'USDA', status: 'Active', updated: 'Dec 2025' },
  { title: 'DOJ Cole Memo (Rescinded)', agency: 'DOJ', status: 'Rescinded', updated: 'Jan 2018' },
];

export const SAMGovRulesTab = () => (
  <div className="space-y-6">
    {/* Federal Rules Aggregator */}
    <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText size={18} className="text-blue-400" /> Federal Rules Aggregator</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400/40" />
          <input type="text" placeholder="Search rules..." className="bg-[#0a1628] border border-[#1e3a5f]/40 text-sm text-white placeholder:text-blue-400/30 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500/60" />
        </div>
      </div>
      <div className="space-y-2">
        {rules.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#1e3a5f]/40 bg-[#0a1628] hover:bg-[#111f36] transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={14} className="text-blue-400/60" />
              <div>
                <p className="text-sm font-medium text-white">{r.title}</p>
                <p className="text-[10px] text-blue-300/50">{r.agency} • Updated {r.updated}</p>
              </div>
            </div>
            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded uppercase",
              r.status === 'Active' ? "bg-emerald-900/60 text-emerald-300" :
              r.status === 'Draft' ? "bg-blue-900/60 text-blue-300" :
              r.status === 'Under Review' ? "bg-amber-900/60 text-amber-300" : "bg-red-900/60 text-red-300"
            )}>{r.status}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-blue-400/40 mt-3">Visibility only — no enforcement power. Centralized view of all federal rules and guidance.</p>
    </div>

    {/* SAM.gov Integration */}
    <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Globe size={18} className="text-blue-400" /> SAM.gov Entity Cross-Reference</h3>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded flex items-center gap-1"><CircleCheck size={10} /> Daily Sync Active</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0a1628] text-blue-300/60 text-[10px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">UEI</th>
              <th className="px-4 py-3">CAGE</th>
              <th className="px-4 py-3">SAM Status</th>
              <th className="px-4 py-3">Federal Grants</th>
              <th className="px-4 py-3">Larry Flags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e3a5f]/20">
            {entities.map((e, i) => (
              <tr key={i} className="hover:bg-[#111f36] transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white">{e.name}</td>
                <td className="px-4 py-3 text-xs text-blue-300/60 font-mono">{e.uei}</td>
                <td className="px-4 py-3 text-xs text-blue-300/60 font-mono">{e.cage}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded uppercase",
                    e.status === 'Active' ? "bg-emerald-900/60 text-emerald-300" :
                    e.status === 'Debarred' ? "bg-red-900/60 text-red-300" : "bg-amber-900/60 text-amber-300"
                  )}>{e.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-blue-200">{e.grants}</td>
                <td className="px-4 py-3">
                  {e.flags > 0
                    ? <span className="text-[10px] font-bold text-red-400 bg-red-900/40 px-2 py-0.5 rounded flex items-center gap-1 w-fit"><AlertCircle size={10} /> {e.flags} flags</span>
                    : <span className="text-[10px] font-bold text-emerald-400">Clear</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-blue-400/40 mt-3">Read-only SAM.gov integration. Auto cross-checks UEI/CAGE codes. No data written back. Full audit trail. CJIS/HIPAA-grade encryption.</p>
    </div>
  </div>
);

import React from 'react';
import { Building2, Shield, Clock, TrendingUp, Filter, Plus, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

// Simple Button mock for the extraction
const Button = ({ children, className, icon: Icon, variant, ...props }: any) => (
  <button className={cn("inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm border", 
    variant === "outline" ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50" : "bg-[#1a4731] text-white border-transparent hover:bg-[#153a28]",
    className)} {...props}>
    {Icon && <Icon size={14} />} {children}
  </button>
);

export const BusinessDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Active Entities" value="12" icon={Building2} color="bg-[#1a4731]" />
      <StatCard label="Compliance Score" value="98%" trend={1} icon={Shield} color="bg-emerald-600" />
      <StatCard label="Pending Audits" value="2" icon={Clock} color="bg-amber-500" />
      <StatCard label="Total Revenue" value="$42.5k" trend={12} icon={TrendingUp} color="bg-indigo-600" />
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Entity Management</h3>
          <p className="text-sm text-slate-500">Manage your business units and compliance status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Filter} className="px-3 py-1.5 text-xs">Filter</Button>
          <Button icon={Plus} className="px-3 py-1.5 text-xs">Add Entity</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-emerald-50 text-[#1a4731] text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Entity Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Audit</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'GGMA North Dispensary', type: 'Retail', state: 'Kansas', status: 'Compliant', date: 'Sep 20, 2023' },
              { name: 'Green Valley Cultivation', type: 'Production', state: 'Missouri', status: 'Compliant', date: 'Aug 15, 2023' },
              { name: 'Central Logistics Hub', type: 'Distribution', state: 'Kansas', status: 'Review', date: 'Oct 01, 2023' },
              { name: 'West Coast Retail', type: 'Retail', state: 'Colorado', status: 'Compliant', date: 'Jul 12, 2023' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.type}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.state}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.status === 'Compliant' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

import React from 'react';
import { BarChart3, TrendingUp, Users, Target, Download, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

const Button = ({ children, className, icon: Icon, variant, ...props }: any) => (
  <button className={cn("inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm border", 
    variant === "outline" ? "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50" : "bg-indigo-700 text-white border-transparent hover:bg-indigo-800",
    className)} {...props}>
    {Icon && <Icon size={14} />} {children}
  </button>
);

export const ExecutiveDashboard = () => (
  <div className="space-y-8">
    <div className="flex justify-end gap-3 mb-4">
        <Button variant="outline" icon={Calendar}>Last 30 Days</Button>
        <Button icon={Download}>Export Report</Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Market Value" value="$1.2B" trend={8} icon={TrendingUp} color="bg-indigo-700" />
      <StatCard label="Active Programs" value="24" trend={1} icon={Target} color="bg-indigo-600" />
      <StatCard label="Registered Patients" value="850K" trend={12} icon={Users} color="bg-indigo-500" />
      <StatCard label="Avg Processing Time" value="4.2 Days" trend={-15} icon={BarChart3} color="bg-emerald-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-slate-500 mb-4 font-medium">Market Growth Visualization Placeholder</p>
          <BarChart3 size={48} className="text-slate-300" />
       </div>
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-slate-500 mb-4 font-medium">Program Adoption Visualization Placeholder</p>
          <TrendingUp size={48} className="text-slate-300" />
       </div>
    </div>
  </div>
);

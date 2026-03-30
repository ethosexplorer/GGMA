import React from 'react';
import { Building2, AlertCircle, Shield, Clock, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

const Button = ({ children, className, icon: Icon, variant, ...props }: any) => (
  <button className={cn("inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm border", 
    variant === "outline" ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50" : "bg-[#1a4731] text-white border-transparent hover:bg-[#153a28]",
    className)} {...props}>
    {Icon && <Icon size={14} />} {children}
  </button>
);

export const OversightDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Entities" value="156" icon={Building2} color="bg-[#1a4731]" />
      <StatCard label="Active Alerts" value="12" icon={AlertCircle} color="bg-red-500" />
      <StatCard label="Compliance Rate" value="94.2%" trend={2} icon={Shield} color="bg-emerald-600" />
      <StatCard label="Pending Reviews" value="45" icon={Clock} color="bg-amber-500" />
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Compliance Monitoring</h3>
        <Button variant="outline" icon={Filter} className="px-3 py-1.5 text-xs">Filter Alerts</Button>
      </div>
      <div className="space-y-4">
        {[
          { entity: 'GGMA North Dispensary', issue: 'License Renewal Pending', severity: 'High', time: '1h ago' },
          { entity: 'Green Valley Cultivation', issue: 'Monthly Report Overdue', severity: 'Medium', time: '4h ago' },
          { entity: 'Central Logistics Hub', issue: 'Security Protocol Update', severity: 'Low', time: '1d ago' },
        ].map((alert, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-2 h-2 rounded-full",
                alert.severity === 'High' ? "bg-red-500" :
                  alert.severity === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
              )}></div>
              <div>
                <p className="font-bold text-slate-900">{alert.entity}</p>
                <p className="text-sm text-slate-500">{alert.issue}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                alert.severity === 'High' ? "bg-red-50 text-red-600" :
                  alert.severity === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-[#1a4731]"
              )}>
                {alert.severity}
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

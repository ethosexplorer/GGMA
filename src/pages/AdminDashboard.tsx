import React from 'react';
import { Users, FileText, Settings, Shield, Plus, MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';

const Button = ({ children, className, icon: Icon, variant, ...props }: any) => (
  <button className={cn("inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm border", 
    variant === "outline" ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50" : "bg-slate-800 text-white border-transparent hover:bg-slate-900",
    className)} {...props}>
    {Icon && <Icon size={14} />} {children}
  </button>
);

export const AdminDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Users" value="12,450" trend={5} icon={Users} color="bg-slate-800" />
      <StatCard label="Active Licenses" value="3,210" trend={2} icon={FileText} color="bg-slate-600" />
      <StatCard label="System Health" value="99.9%" icon={Settings} color="bg-slate-800" />
      <StatCard label="Security Incidents" value="0" icon={Shield} color="bg-emerald-500" />
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Recent User Registrations</h3>
        </div>
        <Button icon={Plus} className="px-3 py-1.5 text-xs">Invite User</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Alice Smith', email: 'alice@example.com', role: 'Business Admin', status: 'Active', date: 'Oct 10, 2023' },
              { name: 'Bob Jones', email: 'bob@example.com', role: 'Patient', status: 'Pending', date: 'Oct 09, 2023' },
              { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Physician', status: 'Active', date: 'Oct 08, 2023' },
            ].map((user, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    user.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.date}</td>
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

import React from 'react';
import { motion } from 'motion/react';
import {
  Shield, BarChart2, Users, Activity, Globe, Clock, CheckCircle,
  Loader2, TrendingUp, Leaf
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/shared/StatCard';
import { Button } from '../components/shared/Button';
export const ExecutiveDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Revenue" value="$2.4M" trend={15} icon={TrendingUp} color="bg-indigo-700" />
      <StatCard label="Market Share" value="18.4%" trend={3} icon={BarChart3} color="bg-[#1a4731]" />
      <StatCard label="Active Users" value="45.2k" trend={22} icon={Users} color="bg-emerald-700" />
      <StatCard label="Compliance Index" value="99.4" icon={Shield} color="bg-slate-800" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Growth Projection</h3>
            <p className="text-sm text-slate-500">Quarterly revenue growth vs target</p>
          </div>
          <select className="bg-slate-50 border-none rounded-lg text-sm font-medium px-4 py-2">
            <option>Last 12 Months</option>
            <option>Last 3 Years</option>
          </select>
        </div>
        <div className="h-64 flex items-end gap-4 px-4">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80",
                  i === 11 ? "bg-indigo-600" : "bg-slate-200"
                )}
                style={{ height: `${h}%` }}
              ></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6">Revenue by Segment</h3>
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {[
            { label: 'Healthcare', value: 45, color: 'bg-indigo-600' },
            { label: 'Business Services', value: 30, color: 'bg-emerald-500' },
            { label: 'Government', value: 15, color: 'bg-emerald-500' },
            { label: 'Other', value: 10, color: 'bg-slate-200' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">{item.label}</span>
                <span className="text-slate-900">{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
          Download Executive Report
        </button>
      </div>
    </div>
  </div>
);





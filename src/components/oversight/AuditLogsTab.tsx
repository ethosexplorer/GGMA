import React, { useState } from 'react';
import { Search, Filter, Download, Shield, User, Clock, MapPin, Eye, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AuditLogsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const auditLogs = [
    { id: 'LOG-8821', user: 'Ryan Ferrari', action: 'Executive Emergency Broadcast', entity: 'Platform Global', timestamp: '2 mins ago', status: 'Authorized', severity: 'High', details: 'Alert: Heavy Rain Expected in OK', ip: '192.168.1.42' },
    { id: 'LOG-8820', user: 'Bob Moore', action: 'State Fact Update', entity: 'California', timestamp: '15 mins ago', status: 'Completed', severity: 'Medium', details: 'Updated Compliance Standards v4.2', ip: '172.16.0.12' },
    { id: 'LOG-8819', user: 'System Engine', action: 'Automated METRC Sync', entity: 'Oklahoma Retail #4', timestamp: '45 mins ago', status: 'Success', severity: 'Low', details: 'Synced 4,208 tags across 4 facilities', ip: 'GGHP-BACKBONE-01' },
    { id: 'LOG-8818', user: 'Oversight Staff', action: 'Portal Access', entity: 'Federal Command', timestamp: '1 hour ago', status: 'Authorized', severity: 'Low', details: 'Session started for ID #992', ip: '10.0.4.19' },
    { id: 'LOG-8817', user: 'External Auditor', action: 'Document Download', entity: 'Legal Vault', timestamp: '3 hours ago', status: 'Authorized', severity: 'Medium', details: 'Downloaded P&L Trajectory 2026', ip: '45.12.8.201' },
    { id: 'LOG-8816', user: 'Unidentified User', action: 'Failed Login Attempt', entity: 'Founder Dashboard', timestamp: '5 hours ago', status: 'Denied', severity: 'Critical', details: 'Multiple password failures detected', ip: '198.51.100.1' },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <Shield size={28} className="text-emerald-600" />
                  System-Wide Audit Log
               </h2>
               <p className="text-slate-500 font-medium mt-1">Immutable record of all administrative and automated platform actions.</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
               <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all">
                  <Download size={18} /> Export CSV
               </button>
               <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all">
                  <FileText size={18} /> Generate PDF Report
               </button>
            </div>
         </div>

         <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Search logs by user, action, or entity..." 
                 className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm shadow-inner"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all">
               <Filter size={20} /> Filters
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
         <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-white border-b border-slate-200">
               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Log ID</th>
                  <th className="px-6 py-5">Initiator</th>
                  <th className="px-6 py-5">Action & Entity</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Severity</th>
                  <th className="px-8 py-5 text-right">Timestamp</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {auditLogs.filter(log => 
                 log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 log.entity.toLowerCase().includes(searchTerm.toLowerCase())
               ).map((log, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                     <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">{log.id}</td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner border", 
                             log.user === 'System Engine' ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-emerald-50 text-emerald-600 border-emerald-100")}>
                              {log.user === 'System Engine' ? <Cpu size={18}/> : <User size={18}/>}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800">{log.user}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{log.ip}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <p className="text-sm font-black text-slate-800">{log.action}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <MapPin size={12} className="text-slate-400" />
                           <p className="text-xs font-bold text-slate-500">{log.entity}</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic">"{log.details}"</p>
                     </td>
                     <td className="px-6 py-6">
                        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border", 
                          log.status === 'Denied' ? "bg-red-50 text-red-600 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100")}>
                           {log.status === 'Denied' ? <AlertCircle size={12}/> : <CheckCircle size={12}/>}
                           {log.status}
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-1">
                           {[1,2,3].map(step => (
                             <div key={step} className={cn("h-1.5 w-4 rounded-full", 
                               step <= (log.severity === 'Critical' ? 3 : log.severity === 'High' ? 2 : 1) 
                                 ? log.severity === 'Critical' ? "bg-red-500" : log.severity === 'High' ? "bg-amber-500" : "bg-blue-500"
                                 : "bg-slate-200"
                             )}></div>
                           ))}
                           <span className="text-[10px] font-black text-slate-400 uppercase ml-2">{log.severity}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-500">
                           <Clock size={14} />
                           <span className="text-sm font-bold">{log.timestamp}</span>
                        </div>
                        <button className="mt-2 text-[10px] font-black text-emerald-600 uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View Details</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
         <p className="text-xs font-bold text-slate-500">Showing {auditLogs.length} recent system events</p>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all">Next</button>
         </div>
      </div>
    </div>
  );
};

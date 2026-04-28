import React, { useState, useEffect } from 'react';
import { 
  Phone, Users, MessageSquare, Shield, Activity, TrendingUp, 
  ChevronRight, Mic, Play, Pause, RefreshCw, Star, Search,
  Briefcase, HeartPulse, Scale, BarChart2, Laptop, UserPlus, 
  DollarSign, Globe, Zap, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { voip800, CallCenterStats } from '../../lib/voip800';

interface Department {
  id: string;
  name: string;
  icon: any;
  services: string[];
  status: 'active' | 'training' | 'human_esc';
  successRate: number;
}

const departments: Department[] = [
  { id: 'appts', name: 'Appointments / Scheduling', icon: Clock, services: ['Patient Intake', 'Physician Referral', 'Holistic Scheduling', 'Business Meetings'], status: 'active', successRate: 98.2 },
  { id: 'support', name: 'General Support', icon: Phone, services: ['Logistics', 'Supply Chain', 'Virtual Assistance', 'Med-Tech Support'], status: 'active', successRate: 94.5 },
  { id: 'medical', name: 'Medical Department', icon: HeartPulse, services: ['Nursing Liaison', 'Prescription Assist', 'Lab Diagnostics', 'Urgent Care Triage'], status: 'human_esc', successRate: 91.2 },
  { id: 'legal', name: 'Legal / Regulatory', icon: Scale, services: ['Contracts', 'Compliance Audits', 'Larry Division', 'Licensing'], status: 'active', successRate: 99.1 },
  { id: 'sales', name: 'Sales & Patient Drives', icon: TrendingUp, services: ['Memberships', 'Subscription Programs', 'Affiliate Sales', 'Market Leads'], status: 'active', successRate: 88.7 },
  { id: 'marketing', name: 'Marketing & PR', icon: Zap, services: ['Brand Analysis', 'Social Media Sync', 'Public Relations', 'Lead Gen'], status: 'training', successRate: 72.4 },
  { id: 'qa', name: 'Quality Assurance', icon: Shield, services: ['SOP Enforcement', 'Survey Follow-ups', 'KPI Monitoring', 'Record Keeping'], status: 'active', successRate: 96.8 },
  { id: 'tech', name: 'Tech / Cybersecurity', icon: Laptop, services: ['HIPAA/PHI Security', 'Anti-Hack Shield', 'IT Migration', 'AI Optimization'], status: 'active', successRate: 99.9 },
  { id: 'hr', name: 'Human Resources', icon: UserPlus, services: ['Onboarding', 'Payroll/Benefits', 'Diversity/Ethics', 'ADR Conflict Resolution'], status: 'active', successRate: 93.4 },
  { id: 'financials', name: 'Financials', icon: DollarSign, services: ['NomadCash Auditing', 'AR/AP', 'Escrow Accounts', 'Business Valuation'], status: 'active', successRate: 97.2 },
  { id: 'bilingual', name: 'Bilingual Routing', icon: Globe, services: ['Multi-Language Support', 'Spanish/English Sync', 'Global Distribution', 'Culture Matching'], status: 'active', successRate: 95.0 },
];

export const VirtualAttendantTab = () => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [stats, setStats] = useState<CallCenterStats | null>(null);
  const [liveQueue, setLiveQueue] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await voip800.getCallCenterStats();
      const qCount = await voip800.getQueueCount();
      setStats(data);
      setLiveQueue(qCount);
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // refresh every 5s for queue accuracy
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* GGE World Call Center Header */}
      <div className="bg-[#0A3D2A] rounded-3xl p-8 border border-[#1a4731] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Globe size={160} className="text-[#D4AF77]" /></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF77]/20 flex items-center justify-center text-[#D4AF77]">
                  <Mic size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">GGE World Call Center</h1>
                  <p className="text-[#D4AF77] font-bold text-sm tracking-widest uppercase">800.com Live Integration</p>
                </div>
              </div>
              <p className="text-emerald-100/60 max-w-lg mt-2">
                The 85% AI / 15% Human Virtual Attendant System. Powered by Global Green Enterprise Inc. 
                Full-cycle RAG-augmented intelligence led by Sylara, Call Center Commander.
              </p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-md p-4 rounded-2xl border border-emerald-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Status</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-black text-white">{voip800.isConfigured() ? '800.com Linked' : 'Offline'}</p>
                  <p className="text-[10px] text-emerald-100/50">Current Capacity: {stats?.activeAgents || 0} Agent(s) Ready</p>
                </div>
                <div className="text-center ml-4 px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-xl">
                  <p className="text-[9px] font-bold text-rose-300 uppercase tracking-widest">Active Queue</p>
                  <p className="text-lg font-black text-rose-400">{liveQueue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-[#D4AF77] uppercase tracking-widest mb-1">Avg Resolution Time</p>
              <p className="text-2xl font-black text-white">{stats?.averageCallDuration || 0}s</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-[#D4AF77] uppercase tracking-widest mb-1">Total Live Volume</p>
              <p className="text-2xl font-black text-white">{stats?.totalCalls || 0}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Answered Calls</p>
              <p className="text-2xl font-black text-white">{stats?.answeredCalls || 0}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Missed Calls</p>
              <p className="text-2xl font-black text-white">{stats?.missedCalls || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Briefcase size={20} className="text-[#0A3D2A]" /> Call Center Departments
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#D4AF77] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {departments.map((dept) => (
            <div 
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "group p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden",
                selectedDept?.id === dept.id 
                  ? "bg-[#0A3D2A] border-[#D4AF77] shadow-lg shadow-emerald-900/20" 
                  : "bg-white border-slate-200 hover:border-[#D4AF77] hover:shadow-md"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  selectedDept?.id === dept.id ? "bg-[#D4AF77] text-[#0A3D2A]" : "bg-slate-50 text-slate-600 group-hover:bg-[#D4AF77]/10 group-hover:text-[#D4AF77]"
                )}>
                  <dept.icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                    dept.status === 'active' ? "bg-emerald-50 text-emerald-600" : 
                    dept.status === 'training' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {dept.status.replace('_', ' ')}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold mt-1",
                    selectedDept?.id === dept.id ? "text-[#D4AF77]" : "text-slate-400"
                  )}>
                    {dept.successRate}% Success
                  </span>
                </div>
              </div>
              
              <h3 className={cn(
                "font-black text-sm mb-2",
                selectedDept?.id === dept.id ? "text-white" : "text-slate-800"
              )}>
                {dept.name}
              </h3>
              
              <ul className="space-y-1.5 mb-4">
                {dept.services.map((service, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className={cn("w-1 h-1 rounded-full", selectedDept?.id === dept.id ? "bg-[#D4AF77]/50" : "bg-slate-300")} />
                    <span className={cn("text-[10px]", selectedDept?.id === dept.id ? "text-emerald-100/70" : "text-slate-500")}>
                      {service}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={cn(
                "flex items-center justify-between pt-3 border-t",
                selectedDept?.id === dept.id ? "border-emerald-800" : "border-slate-100"
              )}>
                <span className={cn("text-[9px] font-bold", selectedDept?.id === dept.id ? "text-[#D4AF77]" : "text-slate-400")}>85% AI Active</span>
                <ChevronRight size={14} className={selectedDept?.id === dept.id ? "text-[#D4AF77]" : "text-slate-300"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Agent Control Panel */}
      {selectedDept && (
        <div className="bg-white rounded-3xl border-2 border-[#D4AF77] p-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#0A3D2A] flex items-center justify-center text-[#D4AF77]">
                  <selectedDept.icon size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{selectedDept.name} AI Agent</h2>
                  <p className="text-slate-500 font-medium">Sylara Approved RAG-Model v2.4</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active System Prompt</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 font-mono leading-relaxed">
                    "You are the GGE World {selectedDept.name} Coordinator @Thebackoffice.com. You handle all {selectedDept.services[0].toLowerCase()} and {selectedDept.services[1].toLowerCase()}... [RAG Context Loaded]"
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3 bg-[#0A3D2A] text-[#D4AF77] rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 hover:scale-[1.02] transition-transform">
                    <RefreshCw size={16} /> Retrain with Sylara
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                    <MessageSquare size={16} /> View Transcripts
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Live Training Session</h4>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-24 h-24 rounded-full border-4 border-[#D4AF77] border-t-transparent animate-spin flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#0A3D2A] flex items-center justify-center">
                      <Mic size={32} className="text-[#D4AF77] animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-800">Processing Audio Feed...</p>
                    <p className="text-[10px] text-slate-500 mt-1">ElevenLabs Voice ID: 21m00Tcm...</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 p-2 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold">MONITOR</button>
                    <button className="flex-1 p-2 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold">PAUSE</button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <Shield size={20} className="text-emerald-600 shrink-0" />
                <p className="text-[10px] text-emerald-800 leading-tight">
                  <strong>Compliance Lock:</strong> This agent is forced-escalated to Larry for any PHI/PII data collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

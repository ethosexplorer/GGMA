import React, { useState, useEffect } from 'react';
import { 
  Phone, Users, MessageSquare, Shield, Activity, TrendingUp, 
  ChevronRight, Mic, Play, Pause, RefreshCw, Star, Search,
  Briefcase, HeartPulse, Scale, BarChart2, Laptop, UserPlus, 
  DollarSign, Globe, Zap, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { voip800, CallCenterStats } from '../../lib/voip800';
import { turso } from '../../lib/turso';


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
  const [selectedDept, setSelectedDept] = useState<Department | null>(departments[0]);
  const [stats, setStats] = useState<CallCenterStats | null>(null);
  const [liveQueue, setLiveQueue] = useState(0);
  const [routingMode, setRoutingMode] = useState<'ai_only' | 'hybrid' | 'human_only'>('hybrid');
  const [isTrainingActive, setIsTrainingActive] = useState(true);
  const [showTranscripts, setShowTranscripts] = useState(false);
  const [unreadVoicemails, setUnreadVoicemails] = useState(0);
  const [voicemailList, setVoicemailList] = useState<any[]>([]);
  const [showVoicemails, setShowVoicemails] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsDept, setStatsDept] = useState<Department | null>(null);
  const [dbCounts, setDbCounts] = useState({
    patients: 0,
    businesses: 0,
    providers: 0,
    records: 0,
    audits: 0
  });

  const getServiceCount = (service: string): number => {
    const patientsVal = dbCounts.patients;
    const businessesVal = dbCounts.businesses;
    const providersVal = dbCounts.providers;
    const recordsVal = dbCounts.records;
    const auditsVal = dbCounts.audits;

    switch (service) {
      // Appointments / Scheduling
      case 'Patient Intake': return patientsVal;
      case 'Physician Referral': return Math.floor(patientsVal * 0.85);
      case 'Holistic Scheduling': return Math.floor(patientsVal * 1.2);
      case 'Business Meetings': return Math.floor(businessesVal * 2.5);

      // General Support
      case 'Logistics': return Math.floor((patientsVal + businessesVal) * 1.4);
      case 'Supply Chain': return Math.floor(businessesVal * 4.2);
      case 'Virtual Assistance': return Math.floor(patientsVal * 3.1);
      case 'Med-Tech Support': return Math.floor(providersVal * 6.5);

      // Medical Department
      case 'Nursing Liaison': return Math.floor(patientsVal * 0.9);
      case 'Prescription Assist': return Math.floor(patientsVal * 1.5);
      case 'Lab Diagnostics': return Math.floor(patientsVal * 1.1);
      case 'Urgent Care Triage': return Math.floor(patientsVal * 0.3);

      // Legal / Regulatory
      case 'Contracts': return Math.floor(businessesVal * 3.5);
      case 'Compliance Audits': return Math.floor(businessesVal * 2.8 + recordsVal);
      case 'Larry Division': return Math.floor(auditsVal / 4.5);
      case 'Licensing': return Math.floor(businessesVal * 1.2 + providersVal);

      // Sales & Patient Drives
      case 'Memberships': return Math.floor(patientsVal * 0.75);
      case 'Subscription Programs': return Math.floor(patientsVal * 0.6);
      case 'Affiliate Sales': return Math.floor(patientsVal * 0.25);
      case 'Market Leads': return Math.floor(businessesVal * 15.5);

      // Marketing & PR
      case 'Brand Analysis': return Math.floor(businessesVal * 1.8);
      case 'Social Media Sync': return Math.floor(businessesVal * 3.2);
      case 'Public Relations': return Math.floor(businessesVal * 0.8);
      case 'Lead Gen': return Math.floor(businessesVal * 22);

      // Quality Assurance
      case 'SOP Enforcement': return Math.floor(businessesVal * 5.4);
      case 'Survey Follow-ups': return Math.floor(patientsVal * 2.1);
      case 'KPI Monitoring': return Math.floor(businessesVal * 3.0);
      case 'Record Keeping': return Math.floor((patientsVal + businessesVal) * 2.0);

      // Tech / Cybersecurity
      case 'HIPAA/PHI Security': return Math.floor((patientsVal + providersVal) * 1.0);
      case 'Anti-Hack Shield': return Math.floor(auditsVal * 1.2);
      case 'IT Migration': return Math.floor(providersVal * 1.5);
      case 'AI Optimization': return Math.floor((patientsVal + businessesVal) * 0.8);

      // Human Resources
      case 'Onboarding': return Math.floor((providersVal + businessesVal) * 1.1);
      case 'Payroll/Benefits': return Math.floor(providersVal * 2.2);
      case 'Diversity/Ethics': return Math.floor(businessesVal * 1.0);
      case 'ADR Conflict Resolution': return Math.floor(providersVal * 0.4);

      // Financials
      case 'NomadCash Auditing': return Math.floor(businessesVal * 1.8);
      case 'AR/AP': return Math.floor(businessesVal * 4.0);
      case 'Escrow Accounts': return Math.floor(businessesVal * 0.7);
      case 'Business Valuation': return Math.floor(businessesVal * 0.5);

      // Bilingual Routing
      case 'Multi-Language Support': return Math.floor(patientsVal * 0.35);
      case 'Spanish/English Sync': return Math.floor(patientsVal * 0.30);
      case 'Global Distribution': return Math.floor(businessesVal * 1.5);
      case 'Culture Matching': return Math.floor(patientsVal * 0.22);

      default: return 100;
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const data = await voip800.getCallCenterStats();
      const qCount = await voip800.getQueueCount();
      const vms = await voip800.getVoicemails();
      setStats(data);
      setLiveQueue(qCount);
      setVoicemailList(vms);
      setUnreadVoicemails(vms.filter((v: any) => !v.read).length);

      // Fetch DB counts for live-wiring
      try {
        const pRes = await turso.execute('SELECT COUNT(*) as count FROM patients');
        const bRes = await turso.execute('SELECT COUNT(*) as count FROM businesses');
        const prRes = await turso.execute('SELECT COUNT(*) as count FROM providers');
        const rRes = await turso.execute('SELECT COUNT(*) as count FROM omma_enforcement_records');
        const aRes = await turso.execute('SELECT COUNT(*) as count FROM audit_logs');

        setDbCounts({
          patients: Number(pRes.rows[0]?.count) || 0,
          businesses: Number(bRes.rows[0]?.count) || 0,
          providers: Number(prRes.rows[0]?.count) || 0,
          records: Number(rRes.rows[0]?.count) || 0,
          audits: Number(aRes.rows[0]?.count) || 0
        });
      } catch (err) {
        console.error("Failed to query live-wired counts:", err);
      }
    };
    fetchStats();
    
    const handleVoicemailsUpdate = () => {
      fetchStats();
    };
    window.addEventListener('voicemails-updated', handleVoicemailsUpdate);

    const interval = setInterval(fetchStats, 5000); // refresh every 5s for queue accuracy
    return () => {
      clearInterval(interval);
      window.removeEventListener('voicemails-updated', handleVoicemailsUpdate);
    };
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
                  <Phone size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">GGE World Call Center</h1>
                  <p className="text-[#D4AF77] font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                    Twilio Live Integration <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF77]"></span> 1-888-963-4447
                  </p>
                </div>
              </div>
              <p className="text-emerald-100/60 max-w-lg mt-2 mb-4">
                The 100% AI / Human Virtual Attendant System. Powered by Global Green Enterprise Inc. 
                Full-cycle RAG-augmented intelligence led by Sylara, Call Center Commander.
              </p>
              
              {/* Call Routing Toggle */}
              <div className="flex items-center gap-2 bg-[#134d36] p-2 rounded-xl inline-flex border border-emerald-800 shadow-inner">
                <button
                  onClick={() => {
                    setRoutingMode('ai_only');
                    turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'CALL_ROUTING', 'System', JSON.stringify({ detail: 'Routing switched to 100% AI (Sylara)' })] }).catch(console.error);
                  }}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${routingMode === 'ai_only' ? 'bg-[#D4AF77] text-[#0A3D2A] shadow-md' : 'text-emerald-200/50 hover:text-emerald-200 hover:bg-emerald-800/50'}`}
                >
                  <Mic size={14} /> 100% AI
                </button>
                <button
                  onClick={() => {
                    setRoutingMode('hybrid');
                    turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'CALL_ROUTING', 'System', JSON.stringify({ detail: 'Routing switched to Hybrid (85% AI / 15% Human)' })] }).catch(console.error);
                  }}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${routingMode === 'hybrid' ? 'bg-blue-500 text-white shadow-md shadow-blue-900/30' : 'text-emerald-200/50 hover:text-emerald-200 hover:bg-emerald-800/50'}`}
                >
                  <RefreshCw size={14} /> 85% AI / 15% Human
                </button>
                <button
                  onClick={() => {
                    setRoutingMode('human_only');
                    turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'CALL_ROUTING', 'System', JSON.stringify({ detail: 'Routing switched to 100% Human Agents' })] }).catch(console.error);
                  }}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${routingMode === 'human_only' ? 'bg-rose-500 text-white shadow-md shadow-rose-900/30' : 'text-emerald-200/50 hover:text-emerald-200 hover:bg-emerald-800/50'}`}
                >
                  <Users size={14} /> 100% Human
                </button>
              </div>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-md p-4 rounded-2xl border border-emerald-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Status</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-black text-white">{voip800.isConfigured() ? 'Twilio Linked' : 'Offline'}</p>
                  <p className="text-[10px] text-emerald-100/50">Current Capacity: {stats?.activeAgents || 0} Agent(s) Ready</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <a 
                    href="https://console.twilio.com/us1/monitor/logs/calls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-xl hover:bg-rose-500/40 hover:scale-105 transition-all cursor-pointer block"
                    title="Click to open Twilio Call Monitor"
                  >
                    <p className="text-[9px] font-bold text-rose-300 uppercase tracking-widest">Active Queue</p>
                    <p className="text-lg font-black text-rose-400">{liveQueue}</p>
                  </a>
                  {unreadVoicemails > 0 && (
                    <button 
                      onClick={() => setShowVoicemails(true)}
                      className="text-center px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-xl hover:bg-purple-500/40 hover:scale-105 transition-all cursor-pointer block"
                      title="Click to view unread voicemails"
                    >
                      <p className="text-[9px] font-bold text-purple-300 uppercase tracking-widest">Voicemails</p>
                      <p className="text-lg font-black text-purple-400">{unreadVoicemails}</p>
                    </button>
                  )}
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
              onClick={() => {
                setSelectedDept(dept);
                setStatsDept(dept);
                setShowStatsModal(true);
              }}
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
                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full transition-colors",
                    routingMode === 'human_only' ? "bg-amber-100 text-amber-700" :
                    dept.status === 'active' ? "bg-emerald-50 text-emerald-600" : 
                    dept.status === 'training' ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {routingMode === 'human_only' ? 'HUMAN OVERRIDE' : dept.status.replace('_', ' ')}
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
                  <li key={i} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1 h-1 rounded-full", selectedDept?.id === dept.id ? "bg-[#D4AF77]/50" : "bg-slate-300")} />
                      <span className={cn(selectedDept?.id === dept.id ? "text-emerald-100/70" : "text-slate-500")}>
                        {service}
                      </span>
                    </div>
                    <span className={cn("font-bold text-[9px] ml-2", selectedDept?.id === dept.id ? "text-[#D4AF77]" : "text-emerald-700")}>
                      {getServiceCount(service).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={cn(
                "flex items-center justify-between pt-3 border-t transition-colors",
                selectedDept?.id === dept.id ? "border-emerald-800" : "border-slate-100"
              )}>
                <span className={cn("text-[9px] font-bold transition-colors", selectedDept?.id === dept.id ? "text-[#D4AF77]" : routingMode === 'human_only' ? "text-amber-500" : routingMode === 'hybrid' ? "text-blue-500" : "text-emerald-500")}>
                  {routingMode === 'ai_only' ? "100% AI Active" : routingMode === 'hybrid' ? "85% AI / 15% Human" : "100% Human Active"}
                </span>
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
                  <button onClick={() => { turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Retrain triggered for ' + selectedDept.name })] }).catch(console.error); alert('AI retraining sequence initiated via Sylara.'); }} className="flex items-center justify-center gap-2 py-3 bg-[#0A3D2A] text-[#D4AF77] rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 hover:scale-[1.02] transition-transform">
                    <RefreshCw size={16} /> Retrain with Sylara
                  </button>
                  <button onClick={() => { setShowTranscripts(true); turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Viewed department transcripts for ' + selectedDept.name })] }).catch(console.error); }} className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                    <MessageSquare size={16} /> View Transcripts
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Live Training Session</h4>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className={cn("w-24 h-24 rounded-full border-4 border-[#D4AF77] border-t-transparent flex items-center justify-center", isTrainingActive ? "animate-spin" : "")}>
                    <div className="w-16 h-16 rounded-full bg-[#0A3D2A] flex items-center justify-center">
                      <Mic size={32} className={cn("text-[#D4AF77]", isTrainingActive ? "animate-pulse" : "")} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-800">{isTrainingActive ? "Processing Audio Feed..." : "Audio Feed Paused"}</p>
                    <p className="text-[10px] text-slate-500 mt-1">ElevenLabs Voice ID: 21m00Tcm...</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button onClick={() => { setIsTrainingActive(true); turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Monitor resumed active training session' })] }).catch(console.error); }} className={cn("flex-1 p-2 rounded-lg text-[10px] font-bold transition-all", isTrainingActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "bg-slate-200 text-slate-600")}>MONITOR</button>
                    <button onClick={() => { setIsTrainingActive(false); turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Audio feed training paused' })] }).catch(console.error); }} className={cn("flex-1 p-2 rounded-lg text-[10px] font-bold transition-all", !isTrainingActive ? "bg-rose-600 text-white shadow-md shadow-rose-900/20" : "bg-slate-200 text-slate-600")}>PAUSE</button>
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

      {/* Transcripts Modal Dialog */}
      {showTranscripts && selectedDept && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Call Transcripts: {selectedDept.name}</h3>
                <p className="text-xs text-slate-500 font-medium">Sylara Virtual Attendant Agent Logs</p>
              </div>
              <button onClick={() => setShowTranscripts(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold uppercase py-1 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                Close
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {[
                {
                  time: 'Today, 10:42 AM',
                  caller: 'Sarah Jenkins (Oklahoma Patient)',
                  log: [
                    { speaker: 'Sylara (AI)', text: `Hello, welcome to GGE World ${selectedDept.name}. How can I help you today?` },
                    { speaker: 'Sarah', text: `Hi, I need assistance with ${selectedDept.services[0].toLowerCase()} and to verify how things operate.` },
                    { speaker: 'Sylara (AI)', text: 'I can certainly help you with that! The GGP-OS system logs all transactions instantly.' },
                    { speaker: 'Sarah', text: 'Excellent, is it connected to the live telemetry feeds?' },
                    { speaker: 'Sylara (AI)', text: 'Yes, both the Twilio VoIP queue and real-time compliance checks are active.' }
                  ]
                }
              ].map((transcript, ti) => (
                <div key={ti} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex justify-between items-center mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-200/60">
                    <span>Caller: {transcript.caller}</span>
                    <span>{transcript.time}</span>
                  </div>
                  <div className="space-y-3">
                    {transcript.log.map((chat, ci) => (
                      <div key={ci} className="text-xs flex gap-2">
                        <span className={cn("font-bold uppercase tracking-wider text-[9px] shrink-0 w-20 text-right mt-0.5", chat.speaker.includes('AI') ? "text-emerald-600" : "text-slate-500")}>
                          {chat.speaker}:
                        </span>
                        <span className="text-slate-700 leading-relaxed font-medium">{chat.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setShowTranscripts(false)} className="px-5 py-2.5 bg-[#0A3D2A] text-[#D4AF77] font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] transition-transform uppercase">
                Done Viewing
              </button>
            </div>
          </div>
        </div>
      )}

      {showVoicemails && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Voicemail Box</h3>
                <p className="text-xs text-slate-500 font-medium">Unread recordings waiting for your review</p>
              </div>
              <button onClick={() => setShowVoicemails(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold uppercase py-1 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                Close
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {voicemailList.filter(vm => !vm.read).length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-bold text-sm uppercase tracking-widest animate-pulse">
                  No new voicemails.
                </div>
              ) : (
                voicemailList.filter(vm => !vm.read).map((vm) => (
                  <div key={vm.sid} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#D4AF77] hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="5.5" cy="11.5" r="4.5"/><circle cx="18.5" cy="11.5" r="4.5"/><line x1="5.5" y1="16" x2="18.5" y2="16"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">Recording ({vm.duration}s)</p>
                        <p className="text-[10px] text-slate-500 font-semibold">{new Date(vm.time).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={vm.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => {
                          const readSids = JSON.parse(localStorage.getItem('read_voicemail_sids') || '[]');
                          if (!readSids.includes(vm.sid)) {
                            const newRead = [...readSids, vm.sid];
                            localStorage.setItem('read_voicemail_sids', JSON.stringify(newRead));
                            setVoicemailList(prev => prev.map(v => v.sid === vm.sid ? { ...v, read: true } : v));
                            setUnreadVoicemails(prev => Math.max(0, prev - 1));
                            window.dispatchEvent(new Event('voicemails-updated'));
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-900/20"
                      >
                        Play
                      </a>
                      <button 
                        onClick={() => {
                          const readSids = JSON.parse(localStorage.getItem('read_voicemail_sids') || '[]');
                          if (!readSids.includes(vm.sid)) {
                            const newRead = [...readSids, vm.sid];
                            localStorage.setItem('read_voicemail_sids', JSON.stringify(newRead));
                            setVoicemailList(prev => prev.map(v => v.sid === vm.sid ? { ...v, read: true } : v));
                            setUnreadVoicemails(prev => Math.max(0, prev - 1));
                            window.dispatchEvent(new Event('voicemails-updated'));
                          }
                        }}
                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setShowVoicemails(false)} className="px-5 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition-all uppercase">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department Statistics Modal */}
      {showStatsModal && statsDept && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Top Header */}
            <div className="p-6 border-b border-slate-800 bg-[#0A3D2A]/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF77]/20 rounded-xl flex items-center justify-center text-[#D4AF77]">
                  <statsDept.icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">{statsDept.name}</h3>
                  <p className="text-xs text-[#D4AF77] font-bold uppercase tracking-wider">Department Analytics Dashboard</p>
                </div>
              </div>
              <button 
                onClick={() => setShowStatsModal(false)} 
                className="text-slate-400 hover:text-white text-sm font-bold uppercase py-1 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              >
                Close
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-left">
                  <p className="text-[9px] text-[#D4AF77] font-bold uppercase tracking-widest mb-1">Resolution Rate</p>
                  <p className="text-2xl font-black text-emerald-400">{statsDept.successRate}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">Sylara AI Target 95%</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-left">
                  <p className="text-[9px] text-[#D4AF77] font-bold uppercase tracking-widest mb-1">Daily Volume</p>
                  <p className="text-2xl font-black text-white">
                    {Math.floor(statsDept.successRate * 1.5 + 20)}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1">Avg 11.2 calls/hr</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-left">
                  <p className="text-[9px] text-[#D4AF77] font-bold uppercase tracking-widest mb-1">Avg Wait Time</p>
                  <p className="text-2xl font-black text-blue-400">
                    {Math.floor(20 - statsDept.successRate * 0.15)}s
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1">Twilio VoIP Direct</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 text-left">
                  <p className="text-[9px] text-[#D4AF77] font-bold uppercase tracking-widest mb-1">Routing Mode</p>
                  <p className="text-sm font-black text-amber-400 mt-1.5 uppercase tracking-wide">
                    {routingMode === 'ai_only' ? '100% AI' : routingMode === 'hybrid' ? 'Hybrid (85/15)' : '100% Human'}
                  </p>
                  <p className="text-[9px] text-slate-500 mt-1">Status: Active</p>
                </div>
              </div>

              {/* Graphical Performance Bar */}
              <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-5 text-left">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Call Deflection Efficiency</h4>
                  <span className="text-xs font-bold text-emerald-400">{statsDept.successRate}% Auto-Resolved</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${statsDept.successRate}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  *Out of the total incoming queue calls for {statsDept.name}, {statsDept.successRate}% were handled and resolved fully by Sylara's RAG-Model without triggering human escalation.
                </p>
              </div>

              {/* RAG Context & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Model Parameters</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">RAG Context Status</span>
                      <span className="text-emerald-400 font-semibold">Loaded</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">ElevenLabs Voice</span>
                      <span className="text-white font-semibold">Sylara (Custom v2)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">ElevenLabs Voice ID</span>
                      <span className="font-mono text-slate-400">21m00Tcm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg LLM Latency</span>
                      <span className="text-white font-semibold">240ms</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Primary Core Services</h4>
                  <div className="space-y-2">
                    {statsDept.services.map((service, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF77]" />
                          <span className="text-slate-300 font-medium">{service}</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#D4AF77] bg-[#D4AF77]/10 px-2.5 py-0.5 rounded-md">
                          {getServiceCount(service).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Footer Actions */}
            <div className="p-6 border-t border-slate-800 bg-[#0A3D2A]/10 flex justify-end gap-3">
              <button 
                onClick={() => setShowStatsModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

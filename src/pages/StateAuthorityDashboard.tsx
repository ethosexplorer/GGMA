import React, { useState, useEffect, useMemo } from 'react';
import { ShadowOverlay } from '../components/shared/ShadowOverlay';
import { Calendar, Building2, ShieldCheck, Landmark, FileCheck, DollarSign, Activity, 
  Map as MapIcon, Settings, Download, Search, AlertCircle, FileText, XCircle,
  TrendingUp, Users, ShieldAlert, Bot, HelpCircle, Gavel, Scale, Clock, LogOut, Lock, CircleCheck, Sparkles, CreditCard, Eye,
  Layers, Network, Factory, FlaskConical, Truck, Store, Leaf, ArrowRight, ArrowRightLeft, BarChart3, 
  Globe, Briefcase, GraduationCap, HeartPulse, Banknote, Receipt, PieChart, Cpu, Database,
  CheckCircle2, AlertTriangle, XOctagon, Percent, Hash, ChevronRight, Zap, BadgeCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { UserCalendar } from '../components/UserCalendar';
import { PublicHealthDashboard } from './PublicHealthDashboard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';
import { CEYECommandCenter } from '../components/ceye/CEYECommandCenter';
import { StateJurisdictionSelector } from '../components/shared/StateJurisdictionSelector';
import { STATE_REGULATORY_MAP, getTraceabilityBadgeColor, getCannabisStatusColor } from '../lib/stateRegulatory';
import { getStateMetrics, getComparisonRow } from '../lib/stateMetrics';

// ═══════════════════════════════════════════════════════════════════════
//  STATE AUTHORITY DASHBOARD — Full Economic Ecosystem, Dynamic per State
// ═══════════════════════════════════════════════════════════════════════

export const StateAuthorityDashboard = ({ onLogout, user, embedded = false, jurisdiction = 'Oklahoma' }: { onLogout?: () => void, user?: any, embedded?: boolean, jurisdiction?: string }) => {
  const isExecutive = user?.role === 'executive_founder' || user?.role === 'executive_ceo' || user?.role === 'president' || user?.role === 'chief_compliance_director' || user?.role === 'executive_advisor' || user?.role === 'advisor' || user?.email?.toLowerCase().includes('globalgreenhp') || user?.email?.toLowerCase().includes('monica') || user?.email?.toLowerCase().includes('bob');
  const hasMultiStateAccess = isExecutive || user?.multiStateAdmin === true || (Array.isArray(user?.accessibleStates) && user.accessibleStates.length > 1);
  const userDefaultState = user?.jurisdiction || user?.homeState || jurisdiction || 'Oklahoma';

  const [activeTab, setActiveTab] = useState('statewide_overview');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pin, setPin] = useState('');
  const [tier, setTier] = useState<'basic' | 'pro' | 'custom'>('pro');
  const [stateJurisdiction, setStateJurisdiction] = useState(() => {
    if (!hasMultiStateAccess) return userDefaultState;
    return localStorage.getItem('state_authority_jurisdiction') || userDefaultState;
  });

  useEffect(() => {
    if (hasMultiStateAccess) {
      localStorage.setItem('state_authority_jurisdiction', stateJurisdiction);
    }
  }, [stateJurisdiction, hasMultiStateAccess]);

  const stateData = stateJurisdiction !== 'All States Active' ? STATE_REGULATORY_MAP[stateJurisdiction] : null;
  const m = useMemo(() => getStateMetrics(stateJurisdiction), [stateJurisdiction]);
  const tierLevels = { basic: 1, pro: 2, custom: 3 };
  const hasAccess = (requiredTier: string) => tierLevels[tier] >= tierLevels[requiredTier as keyof typeof tierLevels];
  const getJurisdiction = () => stateData ? `${stateData.abbr} — ${stateData.licensingAuthority}` : 'ALL JURISDICTIONS';
  const authority = stateData?.licensingAuthority || 'Cannabis Authority';
  const tracker = stateData?.traceabilitySystem || 'Metrc';
  const fmt = (n: number) => n.toLocaleString();
  const fmtM = (n: number) => n >= 1 ? `$${n.toFixed(1)}M` : `<$1M`;

  // ═══════════════════════════════════════════════════════════════
  //  TAB: STATEWIDE OVERVIEW — Economic Hero + Governance Hierarchy
  // ═══════════════════════════════════════════════════════════════
  const renderStatewideOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* GOVERNANCE HIERARCHY */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0c1a2e] to-slate-900 p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">State Governance Structure</span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Live Data
            </span>
          </div>

          {/* Org Chart: Parent → Operating Authority */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:border-indigo-500/30 transition-all">
              <div className="absolute top-3 right-3">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">Parent Agency</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
                  <Landmark size={28} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{stateData?.abbr || 'STATE'} Enterprise Services</h3>
                  <p className="text-xs text-indigo-300 font-bold">Office of Management & Enterprise Services</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Central Purchasing • Information Services • Financial Services • Human Capital Management • State enterprise technology procurement</p>
            </div>

            <div className="flex items-center gap-2 text-slate-600 shrink-0">
              <div className="hidden md:flex items-center">
                <div className="w-8 h-[2px] bg-gradient-to-r from-indigo-500/50 to-emerald-500/50"></div>
                <ChevronRight size={16} className="text-emerald-500/60 -ml-1" />
              </div>
              <div className="md:hidden flex flex-col items-center">
                <div className="w-[2px] h-6 bg-gradient-to-b from-indigo-500/50 to-emerald-500/50"></div>
                <ChevronRight size={16} className="text-emerald-500/60 rotate-90 -mt-1" />
              </div>
            </div>

            <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative group hover:border-emerald-500/40 transition-all ring-1 ring-emerald-500/10">
              <div className="absolute top-3 right-3">
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Operating Authority</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
                  <Leaf size={28} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{authority}</h3>
                  <p className="text-xs text-emerald-300 font-bold">{stateJurisdiction} Cannabis Authority</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Licensing • Compliance • Inspections • Patient registry • Seed-to-sale tracking via {tracker}</p>
            </div>
          </div>

          {/* Economic Snapshot KPIs — ALL DYNAMIC */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Active Licenses', value: fmt(m.activeLicenses), sub: `+${Math.round(m.activeLicenses * 0.033)} this quarter`, color: 'text-white', icon: FileCheck },
              { label: 'Annual Tax Revenue', value: fmtM(m.annualTaxRevenue), sub: `${stateData?.taxRate || 'State tax'} collected`, color: 'text-emerald-400', icon: DollarSign },
              { label: 'Jobs Created', value: fmt(m.totalJobs), sub: 'Direct + indirect', color: 'text-blue-400', icon: Users },
              { label: 'Economic Multiplier', value: `${m.economicMultiplier}x`, sub: 'Per $1 invested', color: 'text-amber-400', icon: TrendingUp },
              { label: 'Patient Cards Active', value: m.patientCards > 0 ? fmt(m.patientCards) : 'N/A', sub: stateData?.reciprocity ? '✅ Reciprocity' : m.patientCards > 0 ? 'State residents' : 'No medical program', color: 'text-cyan-400', icon: HeartPulse },
              { label: 'Compliance Rate', value: `${m.complianceRate.toFixed(1)}%`, sub: 'Statewide average', color: 'text-violet-400', icon: ShieldCheck },
            ].map((kpi, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{kpi.label}</p>
                  <kpi.icon size={14} className="text-slate-600" />
                </div>
                <p className={cn("text-xl font-black", kpi.color)}>{kpi.value}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INDUSTRY VERTICALS — DYNAMIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { vertical: 'Cannabis', authority: authority, status: stateData?.cannabisStatus || 'N/A', statusColor: getCannabisStatusColor(stateData?.cannabisStatus || 'Prohibited'), icon: Leaf, gradient: 'from-emerald-600 to-teal-700', border: 'border-emerald-500/30', licenses: fmt(m.activeLicenses) },
          { vertical: 'Hemp / Agriculture', authority: m.agDept, status: stateData?.hempProgram ? 'Active Program' : 'No Program', statusColor: stateData?.hempProgram ? 'text-emerald-400' : 'text-slate-500', icon: Factory, gradient: 'from-green-700 to-lime-800', border: 'border-green-500/30', licenses: fmt(m.hempLicenses) },
          { vertical: 'Alcohol & Beverage', authority: stateData?.alcoholAuthority || 'ABC', status: 'Regulated', statusColor: 'text-amber-400', icon: Store, gradient: 'from-amber-700 to-orange-800', border: 'border-amber-500/30', licenses: fmt(m.alcoholLicenses) },
          { vertical: 'Pharmaceuticals', authority: stateData?.pharmaBoard || 'Board of Pharmacy', status: 'Regulated', statusColor: 'text-cyan-400', icon: FlaskConical, gradient: 'from-cyan-700 to-blue-800', border: 'border-cyan-500/30', licenses: fmt(m.pharmaLicenses) },
        ].map((v, i) => (
          <div key={i} className={cn("rounded-2xl overflow-hidden border shadow-lg hover:shadow-xl transition-all group", v.border)}>
            <div className={cn("bg-gradient-to-br p-5 text-white", v.gradient)}>
              <div className="flex items-center justify-between mb-3">
                <v.icon size={24} className="opacity-80" />
                <span className={cn("text-[9px] font-black uppercase tracking-widest", v.statusColor)}>{v.status}</span>
              </div>
              <h3 className="text-lg font-black">{v.vertical}</h3>
              <p className="text-[10px] text-white/60 font-bold mt-1">{v.authority}</p>
            </div>
            <div className="bg-slate-900 p-4 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Active Licenses</span>
                <span className="text-sm font-black text-white">{v.licenses}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FEDERAL RECLASSIFICATION ALERT */}
      <div className="bg-emerald-900 bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-emerald-900/80 p-6 rounded-2xl border border-emerald-500/50 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <ShieldCheck size={12} /> DOJ ALERT
              </span>
              <span className="text-teal-200 text-[10px] font-bold uppercase tracking-wider">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — Federal Reclassification</span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight mb-2">DOJ Reclassifies Marijuana to Schedule III</h2>
            <p className="text-sm text-teal-100/90 leading-relaxed max-w-4xl">
              The U.S. Department of Justice issued a final order to reclassify marijuana at the federal level. {authority} is actively monitoring this development. The move from Schedule I to Schedule III expands research opportunities and could unlock new state commerce channels.
            </p>
          </div>
          <button onClick={() => window.open('https://www.deadiversion.usdoj.gov/online_forms_apps.html', '_blank')} className="shrink-0 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-lg uppercase tracking-widest">
            View DEA Requirements
          </button>
        </div>
      </div>

      {/* REGULATORY SHIFTS + COMPLIANCE PULSE — DYNAMIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Scale size={18} className="text-indigo-600" /> Recent Regulatory Shifts
          </h3>
          <div className="space-y-4">
            {[
              { t: 'Emergency Rule Update', d: `Updated packaging requirements for edibles across all ${stateJurisdiction} dispensaries.`, s: 'Effective Now', c: 'text-emerald-600 bg-emerald-50' },
              { t: `${stateData?.abbr || 'State'} Amendment SB-104`, d: `Expansion of ${stateData?.reciprocity ? 'existing' : 'new'} reciprocity provisions for neighboring state patients.`, s: 'Pending Sign', c: 'text-amber-600 bg-amber-50' },
              { t: 'Enterprise Technology RFP', d: `Statewide cannabis technology platform procurement — licensing & compliance via ${stateData?.abbr || 'State'} Enterprise Services.`, s: 'Open', c: 'text-indigo-600 bg-indigo-50' },
              { t: 'Compliance Update', d: `New seed-to-sale reporting frequency (Daily) via ${tracker} integration.`, s: 'Effective May 1', c: 'text-blue-600 bg-blue-50' },
            ].map((rule, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-slate-800">{rule.t}</p>
                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shrink-0 ml-3", rule.c)}>{rule.s}</span>
                </div>
                <p className="text-xs text-slate-500">{rule.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={80} /></div>
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">State-Wide Compliance Pulse</h3>
          <div className="space-y-6">
            {[
              { label: 'License Verification Rate', value: `${m.licenseVerificationRate.toFixed(1)}%`, pct: m.licenseVerificationRate, color: 'bg-emerald-500', text: 'text-emerald-400' },
              { label: 'Audit Completion (Q2)', value: `${m.auditCompletion}%`, pct: m.auditCompletion, color: 'bg-indigo-500', text: 'text-indigo-400' },
              { label: 'Inspection Pass Rate', value: `${m.inspectionPassRate.toFixed(1)}%`, pct: m.inspectionPassRate, color: 'bg-blue-500', text: 'text-blue-400' },
              { label: `${tracker} Sync Compliance`, value: `${m.metrcSyncCompliance.toFixed(1)}%`, pct: m.metrcSyncCompliance, color: 'bg-cyan-500', text: 'text-cyan-400' },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-slate-500">{bar.label}</span>
                  <span className={bar.text}>{bar.value}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", bar.color)} style={{ width: `${Math.min(bar.pct, 100)}%` }}></div>
                </div>
              </div>
            ))}
            <div className="pt-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                "State system operating under GGHP Oversight protocols. {authority} monitoring {fmt(m.activeLicenses)} active licenses. 0 critical security breaches detected."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: ECONOMIC IMPACT — GDP, Jobs, Tax Flow, State Comparison
  // ═══════════════════════════════════════════════════════════════
  const renderEconomicImpact = () => {
    const neighbors = m.neighbors.map(n => getComparisonRow(n)).filter(Boolean);
    const currentRow = getComparisonRow(stateJurisdiction);
    
    return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl border border-slate-700/50 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><BarChart3 size={200} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Cannabis Economic Impact — {stateJurisdiction}</h2>
          <p className="text-slate-400 font-medium mb-8">How the regulated cannabis industry contributes to {stateJurisdiction}'s economy across employment, tax revenue, and GDP.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Industry GDP Contribution</p>
              <p className="text-4xl font-black text-white">${m.gdpContribution.toFixed(2)}B</p>
              <p className="text-xs text-slate-400 mt-2 font-bold">{m.gdpPercent}% of state GDP • +{m.gdpGrowth}% YoY growth</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${Math.min(m.gdpPercent * 10, 100)}%` }}></div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Total Tax Revenue (Annual)</p>
              <p className="text-4xl font-black text-white">{fmtM(m.annualTaxRevenue)}</p>
              <p className="text-xs text-slate-400 mt-2 font-bold">{stateData?.taxRate || 'State'} cannabis tax</p>
              <div className="mt-4 flex gap-1">
                {[m.educationPct, m.courtsPct, m.operationsPct, m.generalFundPct].map((w, i) => (
                  <div key={i} className={cn("h-2 rounded-full", ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-violet-500'][i])} style={{ width: `${w}%` }}></div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Total Jobs Supported</p>
              <p className="text-4xl font-black text-white">{fmt(m.totalJobs)}</p>
              <p className="text-xs text-slate-400 mt-2 font-bold">Direct: {fmt(m.directJobs)} • Indirect: {fmt(m.indirectJobs)}</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAX REVENUE ALLOCATION — DYNAMIC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Banknote size={18} className="text-emerald-600" /> Tax Revenue Allocation — Where {stateJurisdiction}'s Money Goes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { dest: 'Public Education', pct: `${m.educationPct}%`, amount: fmtM(m.annualTaxRevenue * m.educationPct / 100), icon: GraduationCap, color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { dest: 'Drug Courts & Treatment', pct: `${m.courtsPct}%`, amount: fmtM(m.annualTaxRevenue * m.courtsPct / 100), icon: Scale, color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { dest: `${authority} Operations`, pct: `${m.operationsPct}%`, amount: fmtM(m.annualTaxRevenue * m.operationsPct / 100), icon: Landmark, color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
            { dest: 'General Fund', pct: `${m.generalFundPct}%`, amount: fmtM(m.annualTaxRevenue * m.generalFundPct / 100), icon: Briefcase, color: 'bg-violet-50 border-violet-200 text-violet-700' },
          ].map((item, i) => (
            <div key={i} className={cn("p-5 rounded-2xl border", item.color)}>
              <item.icon size={24} className="mb-3 opacity-60" />
              <p className="text-2xl font-black">{item.pct}</p>
              <p className="text-sm font-bold mt-1">{item.dest}</p>
              <p className="text-xs font-bold mt-2 opacity-60">{item.amount} annually</p>
            </div>
          ))}
        </div>
      </div>

      {/* JOB CREATION — DYNAMIC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Users size={18} className="text-blue-600" /> Jobs Created by Sector — {stateJurisdiction}
        </h3>
        <div className="space-y-4">
          {[
            { sector: 'Retail / Dispensaries', pct: 30, color: 'bg-emerald-500' },
            { sector: 'Cultivation & Growing', pct: 22, color: 'bg-green-500' },
            { sector: 'Processing & Manufacturing', pct: 15, color: 'bg-blue-500' },
            { sector: 'Testing & Laboratories', pct: 10, color: 'bg-cyan-500' },
            { sector: 'Transportation & Distribution', pct: 8, color: 'bg-amber-500' },
            { sector: 'Compliance & Legal', pct: 6, color: 'bg-violet-500' },
            { sector: 'Ancillary Services (Tech, Consulting)', pct: 9, color: 'bg-indigo-500' },
          ].map((job, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-600 w-64 shrink-0 truncate">{job.sector}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", job.color)} style={{ width: `${job.pct}%` }}></div>
              </div>
              <span className="text-sm font-black text-slate-800 w-16 text-right">{fmt(Math.round(m.totalJobs * job.pct / 100))}</span>
              <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{job.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* STATE COMPARISON — DYNAMIC neighbors */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-white">
        <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Globe size={18} /> Regional State Comparison — Cannabis Commerce
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                {['State', 'Status', 'Licenses', 'Tax Rate', 'Revenue', 'Reciprocity'].map(h => (
                  <th key={h} className={cn("py-3 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest", h === 'State' ? 'text-left' : 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {currentRow && (
                <tr className="bg-emerald-500/5 border-l-2 border-l-emerald-500 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{currentRow.state} <span className="text-[8px] font-black text-emerald-400 uppercase ml-2">Current</span></td>
                  <td className="py-3 px-4 text-right text-xs font-bold text-slate-400">{currentRow.status}</td>
                  <td className="py-3 px-4 text-right font-black text-white">{currentRow.licenses}</td>
                  <td className="py-3 px-4 text-right text-xs font-bold text-slate-400">{currentRow.tax}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">{currentRow.revenue}</td>
                  <td className="py-3 px-4 text-right">{currentRow.reciprocity ? <span className="text-emerald-400 text-xs font-bold">✅ Yes</span> : <span className="text-slate-600 text-xs font-bold">❌ No</span>}</td>
                </tr>
              )}
              {neighbors.map((s: any, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{s.state}</td>
                  <td className="py-3 px-4 text-right text-xs font-bold text-slate-400">{s.status}</td>
                  <td className="py-3 px-4 text-right font-black text-white">{s.licenses}</td>
                  <td className="py-3 px-4 text-right text-xs font-bold text-slate-400">{s.tax}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">{s.revenue}</td>
                  <td className="py-3 px-4 text-right">{s.reciprocity ? <span className="text-emerald-400 text-xs font-bold">✅ Yes</span> : <span className="text-slate-600 text-xs font-bold">❌ No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOCIAL EQUITY — DYNAMIC */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-8">
        <h3 className="text-sm font-black text-violet-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <BadgeCheck size={18} /> Social Equity & Community Impact — {stateJurisdiction}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Minority-Owned Licenses', value: fmt(m.minorityOwned), sub: `${Math.round(m.minorityOwned / m.activeLicenses * 100)}% of total` },
            { label: 'Rural Economic Zones', value: String(m.ruralZones), sub: `Active across ${m.counties} counties` },
            { label: 'Veteran-Owned Businesses', value: fmt(m.veteranOwned), sub: `${(m.veteranOwned / m.activeLicenses * 100).toFixed(1)}% of licensees` },
            { label: 'Social Equity Fund', value: fmtM(m.socialEquityFund), sub: 'Grants dispersed (FY26)' },
          ].map((eq, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-violet-100 shadow-sm">
              <p className="text-2xl font-black text-violet-800">{eq.value}</p>
              <p className="text-sm font-bold text-slate-700 mt-1">{eq.label}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{eq.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  //  TAB: LICENSE COMMAND — DYNAMIC cities/regions
  // ═══════════════════════════════════════════════════════════════
  const renderApprovalsDenials = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border-b border-slate-200 p-8 flex justify-between items-end rounded-2xl shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Authorization Hub</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Processing Pipeline — {stateJurisdiction} Final Authority</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Pending Review</p>
            <p className="text-2xl font-black text-slate-800">{Math.round(m.activeLicenses * 0.08)}</p>
          </div>
          <div className="px-6 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Approved (24h)</p>
            <p className="text-2xl font-black text-slate-800">{Math.round(m.activeLicenses * 0.03)}</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Applicant', 'Type', 'Region', 'Command'].map((h, i) => (
                <th key={h} className={cn("px-8 py-5 font-black text-slate-500 text-[10px] uppercase tracking-widest", i === 3 && 'text-right')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { n: 'Jane Smith', e: 'j.smith@email.com', t: 'Patient Card (Adult)', r: m.cities[0] },
              { n: 'GreenLeaf Farms', e: 'ops@greenleaf.com', t: 'Cultivator License', r: m.cities[1] },
              { n: 'Westside Hub', e: 'admin@westside.com', t: 'Dispensary Renewal', r: m.cities[3] },
              { n: 'Dr. Michael Martin', e: 'm.martin@health.org', t: 'Provider Auth', r: m.cities[2] },
              { n: 'Prairie Processing Co.', e: 'info@prairie.com', t: 'Processor License', r: m.cities[4] },
            ].map((app, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <button onClick={() => setSelectedApplicant(app)} className="font-black text-indigo-600 hover:text-indigo-800 hover:underline text-left">{app.n}</button>
                  <p className="text-[10px] font-bold text-slate-400 italic mt-1">{app.e}</p>
                </td>
                <td className="px-8 py-6 text-xs font-bold text-slate-600">{app.t}</td>
                <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase">{app.r}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "LICENSE_APPROVE", "STATE_User", JSON.stringify({ detail: "Application approved." })] }).catch(console.error)); alert("Application approved."); }} className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl hover:bg-emerald-500 uppercase tracking-widest">Approve</button>
                    <button onClick={() => { if (confirm('Deny this application?')) { import('../lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "LICENSE_DENY", "STATE_User", JSON.stringify({ detail: "Application denied." })] }).catch(console.error)); alert("Application denied."); } }} className="px-4 py-2 bg-red-600 text-white text-[10px] font-black rounded-xl hover:bg-red-500 uppercase tracking-widest">Deny</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: COMPLIANCE PULSE — DYNAMIC
  // ═══════════════════════════════════════════════════════════════
  const renderCompliancePulse = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Compliance Monitoring — {stateJurisdiction}</h2>
        <p className="text-slate-500 text-sm mb-8">Real-time compliance tracking across all {authority} licensed entities.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Inspections (YTD)', value: fmt(m.totalInspections), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Violations Issued', value: fmt(m.violationsIssued), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
            { label: 'Licenses Suspended', value: String(m.licensesSuspended), icon: XOctagon, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
            { label: 'Compliance Rate', value: `${m.complianceRate.toFixed(1)}%`, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
          ].map((stat, i) => (
            <div key={i} className={cn("p-5 rounded-2xl border", stat.bg)}>
              <stat.icon size={24} className={cn("mb-3", stat.color)} />
              <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Top Violation Categories</h3>
        <div className="space-y-3">
          {[
            { category: `${tracker} Reporting Discrepancies`, pct: 34, color: 'bg-amber-500' },
            { category: 'Packaging / Labeling Non-Compliance', pct: 21, color: 'bg-orange-500' },
            { category: 'Security Camera Requirements', pct: 17, color: 'bg-red-500' },
            { category: 'Waste Disposal Protocols', pct: 13, color: 'bg-violet-500' },
            { category: 'Operating Hours Violations', pct: 9, color: 'bg-blue-500' },
            { category: 'Other', pct: 6, color: 'bg-slate-400' },
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-600 w-56 shrink-0 truncate">{v.category}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", v.color)} style={{ width: `${v.pct}%` }}></div>
              </div>
              <span className="text-sm font-black text-slate-800 w-10 text-right">{Math.round(m.violationsIssued * v.pct / 100)}</span>
              <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{v.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={16} className="text-slate-600" /> Recent Enforcement Actions — {stateJurisdiction}</h3>
        <div className="space-y-3">
          {[
            { entity: `Cloud Nine Dispensary (${m.cities[0]})`, action: 'License Suspended — 30 days', reason: `Failure to report 3 consecutive ${tracker} manifests`, severity: 'high' },
            { entity: `Harvest Moon Farms (${m.cities[1]})`, action: 'Written Warning', reason: 'Security camera blind spot identified during inspection', severity: 'medium' },
            { entity: `PureLeaf Labs (${m.cities[2]})`, action: 'Fine — $2,500', reason: 'COA not uploaded within 72-hour window', severity: 'medium' },
            { entity: `GreenState Processing (${m.cities[3]})`, action: 'Corrective Action Plan Required', reason: 'Waste disposal not documented per state regulations', severity: 'low' },
          ].map((e, i) => (
            <div key={i} className={cn("p-4 rounded-xl border flex items-start gap-4", e.severity === 'high' ? 'bg-red-50 border-red-200' : e.severity === 'medium' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200')}>
              <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", e.severity === 'high' ? 'bg-red-500' : e.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-400')}></div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{e.entity}</p>
                <p className="text-sm font-bold text-slate-700">{e.action}</p>
                <p className="text-xs text-slate-500 mt-1">{e.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: OMES ENTERPRISE VIEW
  // ═══════════════════════════════════════════════════════════════
  const renderOMESEnterprise = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2744] p-8 rounded-3xl border border-indigo-500/20 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <span className="px-3 py-1 bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Enterprise Integration</span>
          <h2 className="text-3xl font-black tracking-tight mb-2 mt-3">GGP-OS × {stateData?.abbr || 'State'} Enterprise Services</h2>
          <p className="text-slate-400 font-medium max-w-3xl">How the Global Green Platform maps to {stateJurisdiction}'s Office of Management & Enterprise Services — enabling a single state technology contract for comprehensive cannabis industry oversight.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { division: 'Central Purchasing', desc: 'State procurement, vendor management, and contract administration', ggpModule: 'CRM Pipeline & Vendor Registry', icon: Briefcase, color: 'border-indigo-200 bg-indigo-50', iconColor: 'text-indigo-600', capabilities: ['RFP response automation', 'Vendor qualification tracking', 'Contract lifecycle management', 'Procurement compliance reporting'] },
          { division: 'Information Services', desc: 'State IT infrastructure, data hosting, cybersecurity standards', ggpModule: 'Platform Architecture & CEYE', icon: Cpu, color: 'border-cyan-200 bg-cyan-50', iconColor: 'text-cyan-600', capabilities: ['SOC 2 Type II compliant hosting', `${stateJurisdiction} data residency requirements`, 'Role-based access control (RBAC)', 'Real-time threat monitoring (CEYE)'] },
          { division: 'Financial Services', desc: 'Tax collection, fee processing, state revenue reporting', ggpModule: 'Accounting Ledger & Revenue Engine', icon: DollarSign, color: 'border-emerald-200 bg-emerald-50', iconColor: 'text-emerald-600', capabilities: ['Automated fee collection & receipts', 'Tax revenue dashboarding', 'Financial audit trail (immutable)', `Integration with ${stateJurisdiction} treasury`] },
          { division: 'Human Capital Management', desc: 'Staff credentialing, inspector scheduling, workforce management', ggpModule: 'Operations Dashboard & Staffing', icon: Users, color: 'border-amber-200 bg-amber-50', iconColor: 'text-amber-600', capabilities: ['Inspector scheduling & routing', 'Credential verification pipeline', 'Training & certification tracking', 'Performance analytics'] },
        ].map((div, i) => (
          <div key={i} className={cn("rounded-2xl border overflow-hidden shadow-sm", div.color)}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100", div.iconColor)}>
                  <div.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{div.division}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{div.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-white/60 rounded-xl border border-white">
                <ArrowRightLeft size={14} className="text-indigo-500 shrink-0" />
                <span className="text-xs font-bold text-indigo-700">GGP-OS Module: {div.ggpModule}</span>
              </div>
              <ul className="space-y-2">
                {div.capabilities.map((cap, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />{cap}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CONTRACT VALUE */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 rounded-2xl text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Database size={140} /></div>
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-4">State Contract Value Proposition — {stateJurisdiction}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { metric: 'Projected Annual Savings', value: fmtM(m.annualTaxRevenue * 0.055), desc: 'Versus maintaining 4+ separate legacy systems' },
              { metric: 'Implementation Timeline', value: '90 Days', desc: 'Full deployment with data migration & training' },
              { metric: 'ROI Payback Period', value: '14 Months', desc: 'Including licensing revenue optimization' },
            ].map((mv, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">{mv.metric}</p>
                <p className="text-3xl font-black text-white">{mv.value}</p>
                <p className="text-xs text-white/70 mt-2 font-medium">{mv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: CROSS-AGENCY COORDINATION — DYNAMIC agencies
  // ═══════════════════════════════════════════════════════════════
  const renderCrossAgency = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Cross-Agency Data Flow — {stateJurisdiction}</h2>
        <p className="text-slate-500 text-sm mb-8">How cannabis regulatory data flows between {stateJurisdiction} state agencies for coordinated oversight.</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { agency: authority, role: 'Licensing, Compliance, Patient Registry', icon: Leaf, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', flows: [`Sends license data → ${m.taxAgency}`, `Receives background checks ← ${m.investigationAgency}`, 'Sends violation reports → AG Office'] },
            { agency: stateData?.alcoholAuthority || 'ABC', role: 'Co-located license verification', icon: Store, color: 'bg-amber-50 border-amber-200 text-amber-700', flows: ['Cross-references dispensary locations', 'Shares proximity violation alerts', 'Joint inspection coordination'] },
            { agency: `${stateData?.abbr || 'State'} ${m.taxAgency}`, role: 'Revenue collection & reporting', icon: Receipt, color: 'bg-blue-50 border-blue-200 text-blue-700', flows: [`Receives ${stateData?.taxRate || 'excise'} from sales`, 'Validates business tax compliance', 'Reports to state treasury'] },
            { agency: `${m.agDept} (Agriculture)`, role: 'Hemp program & cultivation oversight', icon: Factory, color: 'bg-green-50 border-green-200 text-green-700', flows: ['Manages hemp licenses separately', `Coordinates with ${authority} on dual licenses`, 'Pesticide testing standards'] },
            { agency: stateData?.pharmaBoard || 'Board of Pharmacy', role: 'Medical product standards', icon: FlaskConical, color: 'bg-cyan-50 border-cyan-200 text-cyan-700', flows: ['Product safety & dosage standards', 'Provider credentialing support', 'Pharmacovigilance data'] },
            { agency: m.investigationAgency, role: 'Background checks & investigations', icon: ShieldAlert, color: 'bg-red-50 border-red-200 text-red-700', flows: ['Processes owner/operator backgrounds', 'Criminal history verification', `Investigative referrals from ${authority}`] },
            { agency: `${tracker} (Tracking)`, role: 'Seed-to-sale tracking system', icon: Database, color: 'bg-violet-50 border-violet-200 text-violet-700', flows: ['Real-time plant/product tracking', 'Manifest verification for transport', 'Inventory reconciliation alerts'] },
            { agency: `${stateData?.abbr || 'State'} Attorney General`, role: 'Enforcement & legal authority', icon: Gavel, color: 'bg-slate-100 border-slate-200 text-slate-700', flows: ['Receives enforcement referrals', 'Prosecutes illegal operations', 'Consumer protection oversight'] },
          ].map((a, i) => (
            <div key={i} className={cn("rounded-2xl border p-5 hover:shadow-md transition-all", a.color)}>
              <a.icon size={22} className="mb-3 opacity-70" />
              <h4 className="text-sm font-black mb-1">{a.agency}</h4>
              <p className="text-[10px] font-bold text-slate-500 mb-3">{a.role}</p>
              <ul className="space-y-1.5">
                {a.flows.map((f, j) => (
                  <li key={j} className="text-[10px] text-slate-600 font-medium flex items-start gap-1.5">
                    <ArrowRight size={10} className="shrink-0 mt-0.5 opacity-50" />{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* INTERAGENCY ALERT FEED — DYNAMIC */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-white">
        <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Zap size={16} /> Interagency Alert Feed — Live</h3>
        <div className="space-y-3">
          {[
            { from: m.investigationAgency, to: authority, msg: `Background check flagged — Applicant has prior felony conviction requiring review`, time: '2h ago', severity: 'high' },
            { from: authority, to: `${stateData?.abbr || ''} ${m.taxAgency}`, msg: `New dispensary license issued — ${m.cities[0]} (License #${stateData?.abbr || 'ST'}-7201-R) — tax registration required`, time: '4h ago', severity: 'info' },
            { from: tracker, to: authority, msg: `Inventory discrepancy alert — ${m.cities[1]} facility reports unaccounted product in manifest`, time: '6h ago', severity: 'medium' },
            { from: stateData?.alcoholAuthority || 'ABC', to: authority, msg: `Proximity violation — New dispensary application within 1,000ft of licensed liquor establishment`, time: '1d ago', severity: 'medium' },
            { from: 'Attorney General', to: authority, msg: `Enforcement action complete — Illegal operation in ${m.cities[3]} county shut down`, time: '2d ago', severity: 'info' },
          ].map((alert, i) => (
            <div key={i} className={cn("p-4 rounded-xl border flex items-start gap-4", alert.severity === 'high' ? 'bg-red-500/5 border-red-500/20' : alert.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/10')}>
              <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", alert.severity === 'high' ? 'bg-red-500 animate-pulse' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500')}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  <span className="text-indigo-400">{alert.from}</span><ArrowRight size={10} /><span className="text-emerald-400">{alert.to}</span>
                  <span className="ml-auto text-slate-600">{alert.time}</span>
                </div>
                <p className="text-sm text-slate-300 font-medium">{alert.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: COMMERCE & SUPPLY CHAIN — DYNAMIC
  // ═══════════════════════════════════════════════════════════════
  const renderCommerceSupplyChain = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-8 rounded-3xl border border-emerald-500/20 text-white shadow-2xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Seed-to-Sale Commerce Pipeline — {stateJurisdiction}</h2>
        <p className="text-slate-400 text-sm mb-8">End-to-end supply chain tracked via {tracker} integration</p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {[
            { stage: 'Seed', icon: '🌱', count: fmt(m.cultivators), label: 'Cultivators' },
            { stage: 'Grow', icon: '🌿', count: m.plantsTracked, label: 'Plants Tracked' },
            { stage: 'Process', icon: '⚗️', count: fmt(m.processors), label: 'Processors' },
            { stage: 'Test', icon: '🔬', count: String(m.labs), label: 'Labs' },
            { stage: 'Transport', icon: '🚛', count: fmt(m.manifestsPerMonth), label: 'Manifests/mo' },
            { stage: 'Retail', icon: '🏪', count: fmt(m.dispensaries), label: 'Dispensaries' },
            { stage: 'Patient', icon: '👤', count: m.patientCards > 1000 ? `${(m.patientCards / 1000).toFixed(0)}K` : fmt(m.patientCards), label: 'Cardholders' },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center min-w-[120px] hover:bg-white/10 transition-colors">
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-lg font-black text-white">{s.count}</p>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
              {i < 6 && <ArrowRight size={16} className="text-emerald-500/40 shrink-0 hidden md:block" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* BUSINESS STATS — DYNAMIC */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Building2 size={18} className="text-indigo-600" /> Active Businesses by License Category — {stateJurisdiction}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { type: 'Dispensaries', count: m.dispensaries, icon: Store, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { type: 'Cultivators', count: m.cultivators, icon: Leaf, color: 'text-green-600 bg-green-50 border-green-200' },
            { type: 'Processors', count: m.processors, icon: Factory, color: 'text-blue-600 bg-blue-50 border-blue-200' },
            { type: 'Labs', count: m.labs, icon: FlaskConical, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
            { type: 'Transporters', count: m.transporters, icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { type: 'Waste Disposal', count: m.wasteDisposal, icon: Activity, color: 'text-violet-600 bg-violet-50 border-violet-200' },
          ].map((biz, i) => (
            <div key={i} className={cn("p-4 rounded-2xl border text-center", biz.color)}>
              <biz.icon size={22} className="mx-auto mb-2 opacity-60" />
              <p className="text-2xl font-black">{fmt(biz.count)}</p>
              <p className="text-[10px] font-bold mt-1">{biz.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MARKET + TRACKING — DYNAMIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Market Price Averages — {stateJurisdiction}</h3>
          <div className="space-y-4">
            {[
              { product: 'Flower (Top Shelf)', price: `$${m.flowerPrice.toFixed(2)}/g` },
              { product: 'Concentrates', price: `$${m.concentratePrice.toFixed(2)}/g` },
              { product: 'Edibles (100mg)', price: `$${m.ediblePrice.toFixed(2)}` },
              { product: 'Cartridges (1g)', price: `$${m.cartridgePrice.toFixed(2)}` },
              { product: 'Topicals', price: `$${m.topicalPrice.toFixed(2)}` },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-sm font-bold text-slate-700">{p.product}</span>
                <span className="text-sm font-black text-slate-800">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Database size={16} className="text-violet-600" /> {tracker} Sync Status
          </h3>
          <div className="space-y-4">
            {[
              { metric: 'API Uptime', value: '99.97%', status: 'Healthy', statusColor: 'text-emerald-600 bg-emerald-50' },
              { metric: 'Last Full Sync', value: '2 min ago', status: 'Active', statusColor: 'text-blue-600 bg-blue-50' },
              { metric: 'Manifests Today', value: fmt(Math.round(m.manifestsPerMonth / 30)), status: 'Normal', statusColor: 'text-emerald-600 bg-emerald-50' },
              { metric: 'Failed Syncs (24h)', value: String(Math.round(m.activeLicenses * 0.001)), status: 'Low', statusColor: 'text-amber-600 bg-amber-50' },
              { metric: 'Data Latency', value: '< 30s', status: 'Optimal', statusColor: 'text-emerald-600 bg-emerald-50' },
            ].map((mv, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                <span className="text-sm font-bold text-slate-600">{mv.metric}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-800">{mv.value}</span>
                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg", mv.statusColor)}>{mv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: STATE REVENUE & TAX — DYNAMIC
  // ═══════════════════════════════════════════════════════════════
  const renderRevenueTax = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 p-8 rounded-3xl border border-emerald-500/30 text-white">
        <h2 className="text-3xl font-black tracking-tight mb-2">State Revenue & Tax Dashboard — {stateJurisdiction}</h2>
        <p className="text-emerald-200/70 font-medium">Cannabis tax collection, fee revenue, and allocation tracking.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'YTD Tax Revenue', value: fmtM(m.ytdRevenue), sub: `${Math.round(m.ytdRevenue / m.annualTaxRevenue * 100)}% of annual projection` },
            { label: 'Monthly Average', value: fmtM(m.monthlyAverage), sub: 'Across FY2026' },
            { label: 'License Fee Revenue', value: fmtM(m.licenseFeeRevenue), sub: `${fmt(m.activeLicenses)} active licenses` },
            { label: 'Penalty Collections', value: fmtM(m.penaltyCollections), sub: `${fmt(m.violationsIssued)} violations enforced` },
          ].map((kpi, i) => (
            <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-white">{kpi.value}</p>
              <p className="text-[10px] font-bold text-emerald-100/50 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <BarChart3 size={18} className="text-emerald-600" /> Monthly Revenue Trend (FY2026)
        </h3>
        <div className="space-y-3">
          {m.monthlyRevenue.map((mr, i) => {
            const maxRevenue = Math.max(...m.monthlyRevenue.map(r => r.revenue));
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 w-20 shrink-0">{mr.month}</span>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${(mr.revenue / maxRevenue * 100)}%` }}></div>
                </div>
                <span className="text-sm font-black text-slate-800 w-20 text-right">{fmtM(mr.revenue)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  TAB: JURISDICTION MONITORING (KEPT, DYNAMIC)
  // ═══════════════════════════════════════════════════════════════
  const renderJurisdictionDashboard = () => (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-white">
        <h2 className="text-xl font-black uppercase mb-4">Jurisdiction Oversight — {stateJurisdiction}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { l: 'Total Licenses', v: fmt(m.activeLicenses), t: 'Active' },
            { l: 'Revenue Share', v: stateData?.taxRate || 'N/A', t: 'State Fee' },
            { l: 'Flagged Anomalies', v: String(Math.round(m.activeLicenses * 0.003)), t: 'Immediate' },
            { l: 'Audit Queue', v: String(Math.round(m.activeLicenses * 0.036)), t: 'Pending' },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{s.l}</p>
              <p className="text-2xl font-black text-white">{s.v}</p>
              <p className="text-[9px] font-bold text-slate-500">{s.t}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <p className="text-center text-slate-400 font-medium py-20">Regulatory Map & Heatmap Data Loading...</p>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  //  NAVIGATION ITEMS
  // ═══════════════════════════════════════════════════════════════
  const navItems = [
    { section: 'Executive' },
    { id: 'statewide_overview', label: 'Statewide Overview', icon: Globe, tier: 'basic' },
    { id: 'economic_impact', label: 'Economic Impact', icon: BarChart3, tier: 'basic' },
    { section: 'Regulatory' },
    { id: 'approvals_denials', label: 'License Command', icon: FileCheck, tier: 'basic' },
    { id: 'compliance', label: 'Compliance Pulse', icon: ShieldCheck, tier: 'pro' },
    { id: 'jurisdiction', label: 'Intrastate Monitoring', icon: Activity, tier: 'pro' },
    { section: 'Interagency' },
    { id: 'omes_enterprise', label: 'Enterprise View', icon: Layers, tier: 'pro' },
    { id: 'cross_agency', label: 'Cross-Agency', icon: Network, tier: 'pro' },
    { section: 'Industry' },
    { id: 'commerce_supply', label: 'Commerce & Supply', icon: Truck, tier: 'basic' },
    { id: 'health_labs', label: 'Health & Labs', icon: FlaskConical, tier: 'basic' },
    { id: 'revenue_tax', label: 'Revenue & Tax', icon: DollarSign, tier: 'pro' },
    { section: 'System' },
    { id: 'jurisdiction_trend', label: 'Trend Engine', icon: Sparkles, tier: 'custom' },
    { id: 'ceye', label: 'CEYE Command', icon: Eye, tier: 'custom' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, tier: 'basic' },
  ];

  if (embedded) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 overflow-hidden text-slate-800 font-sans relative">
        {/* EMBEDDED TOP NAVIGATION BAR */}
        <div className="bg-[#10301f] border-b border-emerald-800/30 shrink-0">
          <div className="flex items-center gap-4 px-6 py-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <Landmark size={18} />
              </div>
              <div>
                <h2 className="font-bold text-xs text-white leading-tight uppercase tracking-tight">State Authority</h2>
                <p className="text-[9px] text-emerald-500/80 font-bold tracking-widest uppercase">OMMA Regulatory Hub</p>
              </div>
            </div>
            <div className="w-px h-8 bg-emerald-800/40 shrink-0" />
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 min-w-max">
                {navItems.filter(item => 'id' in item).map((item: any) => {
                  const allowed = hasAccess(item.tier);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      disabled={!allowed}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0",
                        activeTab === item.id
                          ? "bg-emerald-600 text-white shadow-md"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                        !allowed && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {Icon && <Icon size={13} />} {item.label}
                      {!allowed && <Lock size={10} className="text-slate-500/50 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="w-px h-8 bg-emerald-800/40 shrink-0" />
            <div className="shrink-0 flex items-center gap-3">
              {hasMultiStateAccess ? (
                <StateJurisdictionSelector value={stateJurisdiction} onChange={setStateJurisdiction} variant="dark" showMetadata={true} compact={true} label="" />
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/30 px-3 py-1.5 rounded-full uppercase tracking-wider">{stateJurisdiction}</span>
              )}
            </div>
          </div>
        </div>

        {/* EMBEDDED MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
            <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">
              {(navItems.find((n: any) => n.id === activeTab) as any)?.label || activeTab.replace(/_/g, ' ')}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <ShieldCheck size={14} /> JURISDICTION SECURE
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> ALL SYSTEMS ONLINE
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6">
            {(() => {
              const allTabs = navItems.filter((n: any) => n.id);
              const currentTab = allTabs.find((t: any) => t.id === activeTab) as any;
              if (currentTab && !hasAccess(currentTab.tier)) {
                return (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-indigo-900/10 rounded-full flex items-center justify-center mb-6 border border-indigo-800/20">
                      <Lock size={32} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-3">Tier Upgrade Required</h2>
                    <p className="text-slate-500 max-w-md mb-8">
                      The <strong>{currentTab.label}</strong> module is restricted to the <span className="capitalize text-indigo-600 font-bold">{currentTab.tier}</span> tier.
                    </p>
                    <button onClick={() => setActiveTab('subscription')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">View Upgrade Options</button>
                  </div>
                );
              }
              return (
                <>
                  {activeTab === 'statewide_overview' && renderStatewideOverview()}
                  {activeTab === 'economic_impact' && renderEconomicImpact()}
                  {activeTab === 'approvals_denials' && renderApprovalsDenials()}
                  {activeTab === 'compliance' && renderCompliancePulse()}
                  {activeTab === 'jurisdiction' && renderJurisdictionDashboard()}
                  {activeTab === 'omes_enterprise' && renderOMESEnterprise()}
                  {activeTab === 'cross_agency' && renderCrossAgency()}
                  {activeTab === 'commerce_supply' && renderCommerceSupplyChain()}
                  {activeTab === 'health_labs' && <div className="h-full w-full -m-8"><PublicHealthDashboard /></div>}
                  {activeTab === 'revenue_tax' && renderRevenueTax()}
                  {activeTab === 'jurisdiction_trend' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest italic">AI Trend Engine Generating Forecasts...</div>}
                  {activeTab === 'ceye' && <div className="h-full w-full -m-8 min-h-screen overflow-auto bg-[#060a14]"><CEYECommandCenter role="state_authority" /></div>}
                  {activeTab === 'subscription' && <SubscriptionPortal userRole="regulator" initialPlanId={`state_${tier}`} />}
                </>
              );
            })()}
          </div>
        </div>

        {/* APPLICANT DETAIL MODAL */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedApplicant.n}</h3>
                  <p className="text-sm font-bold text-slate-500">{selectedApplicant.t} — {selectedApplicant.r}, {stateData?.abbr || stateJurisdiction}</p>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={28} /></button>
              </div>
              <div className="p-8 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="text-sm font-bold text-slate-800">{selectedApplicant.e}</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p><p className="text-sm font-bold text-slate-800">(555) 123-4567</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Address</p><p className="text-sm font-bold text-slate-800">123 Commerce St, {selectedApplicant.r}, {stateData?.abbr || stateJurisdiction}</p></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Application Details</h4>
                    <div className="space-y-4">
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Application ID</p><p className="text-sm font-bold text-slate-800">APP-{stateData?.abbr || 'ST'}-849201</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Submission Date</p><p className="text-sm font-bold text-slate-800">April 22, 2026</p></div>
                      <div><p className="text-[10px] font-bold text-slate-400 uppercase">Background Check</p><div className="flex items-center gap-1 text-emerald-600 text-sm font-bold mt-1"><CircleCheck size={16} /> Passed ({m.investigationAgency})</div></div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Document Vault</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Identification.pdf', 'Proof_of_Residency.pdf', 'Affidavit_Lawful_Presence.pdf'].map((doc, i) => (
                      <div key={i} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3"><FileText size={20} className="text-indigo-500" /><span className="text-xs font-bold text-slate-700">{doc}</span></div>
                        <Download size={16} className="text-slate-400 group-hover:text-indigo-500" />
                      </div>
                    ))}
                    {(selectedApplicant.t?.includes('Cultivator') || selectedApplicant.t?.includes('Dispensary')) && (
                      <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3"><FileText size={20} className="text-indigo-500" /><span className="text-xs font-bold text-slate-700">Certificate_of_Compliance.pdf</span></div>
                        <Download size={16} className="text-slate-400 group-hover:text-indigo-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-200 uppercase text-xs transition-colors">Cancel</button>
                <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 uppercase text-xs shadow-lg transition-colors">Deny Application</button>
                <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 uppercase text-xs shadow-lg transition-colors">Approve License</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {!isUnlocked && !embedded && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <Lock size={48} className="text-indigo-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Restricted Access</h2>
            <p className="text-slate-500 text-sm mb-6">Enter 4-digit Regulatory PIN</p>
            <input type="password" maxLength={4} value={pin}
              onChange={(e) => { setPin(e.target.value); if (e.target.value === '1234' || e.target.value === '0000') setIsUnlocked(true); }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl p-4 text-center text-3xl font-black text-slate-800 tracking-[1em] mb-4 outline-none transition-all" 
              placeholder="••••" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Authorized Personnel Only</p>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className={cn("w-full md:w-64 bg-[#1a4731] text-white flex flex-col shrink-0 transition-all duration-500", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Landmark size={24} />
            </div>
            <div>
              <h2 className="font-black text-sm text-white leading-tight uppercase tracking-tight">Regulatory &<br/>Commerce Authority</h2>
            </div>
          </div>
          <div className="mb-4 px-3 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
            <Landmark size={12} className="text-indigo-400 shrink-0" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by {stateData?.abbr || 'State'} Enterprise Services</span>
          </div>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-3">{getJurisdiction()}</p>
          {hasMultiStateAccess ? (
            <StateJurisdictionSelector value={stateJurisdiction} onChange={setStateJurisdiction} variant="dark" showMetadata={true} compact={true} label="State" />
          ) : (
            <div className="mt-2 text-center py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Locked Region
            </div>
          )}
          <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="w-full mt-4 bg-slate-900 border border-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl outline-none">
            <option value="basic">Basic Tier</option>
            <option value="pro">Pro Tier</option>
            <option value="custom">Custom Tier</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-0.5 mt-2">
          {navItems.map((item, i) => {
            if ('section' in item && !('id' in item)) {
              return <div key={i} className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.section}</div>;
            }
            if (!('id' in item)) return null;
            const allowed = hasAccess(item.tier!);
            return (
              <button key={item.id} onClick={() => allowed && setActiveTab(item.id!)} className={cn("w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left", activeTab === item.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/40" : "text-slate-400 hover:bg-white/5 hover:text-slate-100", !allowed && "opacity-50 cursor-not-allowed")}>
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon size={16} />}
                  <span className="text-xs">{item.label}</span>
                </div>
                {!allowed && <Lock size={12} className="text-slate-500/50" />}
              </button>
            );
          })}
          <div className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Oversight</div>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-larry-modal', { detail: { variant: 'legal' } }))} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-white/5 hover:text-slate-100 transition-all">
            <Bot size={16} /> Ask Larry (Legal AI)
          </button>
        </div>

        <div className="p-4 mx-4 mb-4 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-[10px] text-slate-500 leading-relaxed font-bold italic">🔒 Scoped Authority: Operating under Global Green oversight framework.</p>
        </div>
      </div>

      {/* MAIN VIEW */}
      <div className={cn("flex-1 flex flex-col h-[calc(100vh)] overflow-hidden transition-all duration-500", !isUnlocked && "blur-md scale-[0.98] opacity-50 pointer-events-none")}>
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-10 bg-white shrink-0">
          <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">
            {(navItems.find((n: any) => n.id === activeTab) as any)?.label || activeTab.replace(/_/g, ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <ShieldCheck size={14} /> JURISDICTION SECURE
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> ALL SYSTEMS ONLINE
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {(() => {
            const allTabs = navItems.filter((n: any) => n.id);
            const currentTab = allTabs.find((t: any) => t.id === activeTab) as any;
            if (currentTab && !hasAccess(currentTab.tier)) {
              return (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-indigo-900/10 rounded-full flex items-center justify-center mb-6 border border-indigo-800/20">
                    <Lock size={32} className="text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-3">Tier Upgrade Required</h2>
                  <p className="text-slate-500 max-w-md mb-8">
                    The <strong>{currentTab.label}</strong> module is restricted to the <span className="capitalize text-indigo-600 font-bold">{currentTab.tier}</span> tier.
                  </p>
                  <button onClick={() => setActiveTab('subscription')} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">View Upgrade Options</button>
                </div>
              );
            }
            return (
              <>
                {activeTab === 'statewide_overview' && renderStatewideOverview()}
                {activeTab === 'economic_impact' && renderEconomicImpact()}
                {activeTab === 'approvals_denials' && renderApprovalsDenials()}
                {activeTab === 'compliance' && renderCompliancePulse()}
                {activeTab === 'jurisdiction' && renderJurisdictionDashboard()}
                {activeTab === 'omes_enterprise' && renderOMESEnterprise()}
                {activeTab === 'cross_agency' && renderCrossAgency()}
                {activeTab === 'commerce_supply' && renderCommerceSupplyChain()}
                {activeTab === 'health_labs' && <div className="h-full w-full -m-8"><PublicHealthDashboard /></div>}
                {activeTab === 'revenue_tax' && renderRevenueTax()}
                {activeTab === 'jurisdiction_trend' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest italic">AI Trend Engine Generating Forecasts...</div>}
                {activeTab === 'ceye' && <div className="h-full w-full -m-8 min-h-screen overflow-auto bg-[#060a14]"><CEYECommandCenter role="state_authority" /></div>}
                {activeTab === 'subscription' && <SubscriptionPortal userRole="regulator" initialPlanId={`state_${tier}`} />}
              </>
            );
          })()}
        </div>
      </div>

      {/* APPLICANT DETAIL MODAL — DYNAMIC state abbr */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedApplicant.n}</h3>
                <p className="text-sm font-bold text-slate-500">{selectedApplicant.t} — {selectedApplicant.r}, {stateData?.abbr || stateJurisdiction}</p>
              </div>
              <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={28} /></button>
            </div>
            <div className="p-8 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                  <div className="space-y-4">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="text-sm font-bold text-slate-800">{selectedApplicant.e}</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p><p className="text-sm font-bold text-slate-800">(555) 123-4567</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Address</p><p className="text-sm font-bold text-slate-800">123 Commerce St, {selectedApplicant.r}, {stateData?.abbr || stateJurisdiction}</p></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Application Details</h4>
                  <div className="space-y-4">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Application ID</p><p className="text-sm font-bold text-slate-800">APP-{stateData?.abbr || 'ST'}-849201</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Submission Date</p><p className="text-sm font-bold text-slate-800">April 22, 2026</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Background Check</p><div className="flex items-center gap-1 text-emerald-600 text-sm font-bold mt-1"><CircleCheck size={16} /> Passed ({m.investigationAgency})</div></div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Document Vault</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['Identification.pdf', 'Proof_of_Residency.pdf', 'Affidavit_Lawful_Presence.pdf'].map((doc, i) => (
                    <div key={i} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3"><FileText size={20} className="text-indigo-500" /><span className="text-xs font-bold text-slate-700">{doc}</span></div>
                      <Download size={16} className="text-slate-400 group-hover:text-indigo-500" />
                    </div>
                  ))}
                  {(selectedApplicant.t?.includes('Cultivator') || selectedApplicant.t?.includes('Dispensary')) && (
                    <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3"><FileText size={20} className="text-indigo-500" /><span className="text-xs font-bold text-slate-700">Certificate_of_Compliance.pdf</span></div>
                      <Download size={16} className="text-slate-400 group-hover:text-indigo-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-200 uppercase text-xs transition-colors">Cancel</button>
              <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 uppercase text-xs shadow-lg transition-colors">Deny Application</button>
              <button onClick={() => setSelectedApplicant(null)} className="px-6 py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 uppercase text-xs shadow-lg transition-colors">Approve License</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

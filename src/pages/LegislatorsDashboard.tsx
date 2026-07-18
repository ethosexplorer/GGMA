import React, { useState } from 'react';
import {
  LayoutDashboard, BookOpen, DollarSign, HeartPulse, PieChart, Scale, Shield,
  CreditCard, Lock, TrendingUp, Building2, Users, FileText, Gavel, Vote,
  BarChart3, Globe, ArrowUpRight, ArrowDownRight, Landmark, Briefcase, Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PolicyScenariosTab } from '../components/federal/PolicyScenariosTab';
import { LegislativeIntelTab } from '../components/federal/LegislativeIntelTab';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';

const tabs = [
  { id: 'overview', label: 'Policy & Economic Overview', icon: LayoutDashboard, tier: 'basic' },
  { id: 'legislative', label: 'Legislative Tracker', icon: Gavel, tier: 'basic' },
  { id: 'economic', label: 'Economic Impact Reports', icon: DollarSign, tier: 'pro' },
  { id: 'health', label: 'Constituent Health Data', icon: HeartPulse, tier: 'pro' },
  { id: 'budget', label: 'Budget & Fiscal Analysis', icon: PieChart, tier: 'pro' },
  { id: 'scenarios', label: 'Policy Scenario Modeling', icon: Scale, tier: 'custom' },
  { id: 'intel', label: 'Regulatory Intel Feed', icon: BookOpen, tier: 'custom' },
  { id: 'subscription', label: 'Subscription', icon: CreditCard, tier: 'basic' },
];

// ── Policy & Economic Overview ──────────────────────────────────────────
const PolicyEconomicOverview = ({ user }: { user?: any }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Profile Card */}
    <ProfileSettingsCard user={user} roleLabel="Official Name" />

    {/* Top KPIs */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'State GDP Contribution', value: '$8.7B', icon: TrendingUp, color: 'bg-indigo-600', trend: '+14.2%', up: true },
        { label: 'Annual Tax Revenue', value: '$2.1B', icon: DollarSign, color: 'bg-emerald-600', trend: '+11.8%', up: true },
        { label: 'Jobs Created', value: '321,400', icon: Users, color: 'bg-violet-600', trend: '+8.6%', up: true },
        { label: 'Active Licenses', value: '48,291', icon: Building2, color: 'bg-sky-600', trend: '+6.1%', up: true },
      ].map((s, i) => (
        <div key={i} className="bg-[#111827] p-6 rounded-2xl border border-indigo-900/40 hover:border-indigo-500/40 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2.5 rounded-xl text-white shadow-lg", s.color)}>
              <s.icon size={18} />
            </div>
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1",
              s.up ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/40' : 'bg-red-900/50 text-red-400 border border-red-800/40'
            )}>
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {s.trend}
            </span>
          </div>
          <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-wider mb-1">{s.label}</p>
          <h3 className="text-2xl font-black text-white">{s.value}</h3>
        </div>
      ))}
    </div>

    {/* Two-column: Licensing + Revenue Trend */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* License Pipeline */}
      <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-400" /> License Pipeline Status
        </h3>
        <p className="text-xs text-indigo-300/40 mb-5">Current application and renewal lifecycle</p>
        <div className="space-y-4">
          {[
            { stage: 'Pending Applications', count: 1284, pct: 100, color: 'bg-amber-500' },
            { stage: 'Under Review', count: 892, pct: 69, color: 'bg-indigo-500' },
            { stage: 'Approved (30d)', count: 641, pct: 50, color: 'bg-emerald-500' },
            { stage: 'Renewals Due (90d)', count: 2103, pct: 80, color: 'bg-violet-500' },
            { stage: 'Denied / Suspended', count: 47, pct: 4, color: 'bg-red-500' },
          ].map((s, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-200 font-medium">{s.stage}</span>
                <span className="text-white font-bold">{s.count.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-[#0a0f1a] rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", s.color)} style={{ width: `${s.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quarterly Revenue */}
      <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <BarChart3 size={18} className="text-emerald-400" /> Quarterly Revenue Trend
        </h3>
        <p className="text-xs text-indigo-300/40 mb-5">Tax revenue by quarter (current FY)</p>
        <div className="space-y-4">
          {[
            { quarter: 'Q1 FY2026', rev: '$487M', growth: '+9.2%', bar: 65 },
            { quarter: 'Q2 FY2026', rev: '$521M', growth: '+12.1%', bar: 70 },
            { quarter: 'Q3 FY2026', rev: '$548M', growth: '+14.8%', bar: 74 },
            { quarter: 'Q4 FY2026 (proj)', rev: '$574M', growth: '+16.2%', bar: 78 },
          ].map((q, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#0a0f1a] border border-indigo-900/30">
              <div className="w-28 shrink-0">
                <p className="text-sm font-bold text-white">{q.quarter}</p>
              </div>
              <div className="flex-1">
                <div className="h-3 bg-[#080c16] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all" style={{ width: `${q.bar}%` }}></div>
                </div>
              </div>
              <div className="text-right w-24 shrink-0">
                <p className="text-sm font-bold text-white">{q.rev}</p>
                <p className="text-xs font-bold text-emerald-400">{q.growth}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom banner */}
    <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/30 rounded-2xl border border-indigo-800/40 p-6 flex items-center gap-6">
      <div className="p-4 bg-indigo-600/20 rounded-2xl border border-indigo-500/30">
        <Landmark size={32} className="text-indigo-400" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-1">GGP-OS Government Partnership</h3>
        <p className="text-indigo-300/60 text-sm max-w-2xl">
          All data presented is anonymized and aggregated at the state level. No individual business or patient records are accessible from this portal. Data is refreshed in real-time from the GGP-OS compliance infrastructure.
        </p>
      </div>
    </div>
  </div>
);

// ── Legislative Tracker ─────────────────────────────────────────────────
const LegislativeTrackerTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col gap-2 mb-2">
      <h2 className="text-2xl font-black text-white tracking-tight">Active Legislation Tracker</h2>
      <p className="text-indigo-300/60 text-sm max-w-2xl font-medium">
        Monitor pending bills, regulatory amendments, and policy proposals affecting the cannabis industry across all 50 states.
      </p>
    </div>

    {/* Status overview */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Bills Introduced', value: '147', color: 'text-indigo-400', bg: 'bg-indigo-900/30' },
        { label: 'In Committee', value: '68', color: 'text-amber-400', bg: 'bg-amber-900/30' },
        { label: 'Passed Chamber', value: '23', color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
        { label: 'Signed Into Law', value: '9', color: 'text-violet-400', bg: 'bg-violet-900/30' },
      ].map((s, i) => (
        <div key={i} className={cn("p-5 rounded-xl border border-indigo-900/30 text-center", s.bg)}>
          <p className="text-3xl font-black text-white mb-1">{s.value}</p>
          <p className={cn("text-xs font-bold uppercase tracking-widest", s.color)}>{s.label}</p>
        </div>
      ))}
    </div>

    {/* Active Bills Table */}
    <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 overflow-hidden">
      <div className="p-5 border-b border-indigo-900/30 flex items-center gap-3">
        <Gavel size={18} className="text-indigo-400" />
        <h3 className="text-base font-bold text-white">Priority Legislation</h3>
      </div>
      <div className="divide-y divide-indigo-900/20">
        {[
          { bill: 'HR-4420', title: 'Cannabis Banking Access Act (SAFE Act Renewal)', state: 'Federal', status: 'In Committee', statusColor: 'text-amber-400 bg-amber-900/30', date: 'Mar 14, 2026' },
          { bill: 'SB-1122', title: 'Interstate Commerce Pilot Program Authorization', state: 'Federal', status: 'Introduced', statusColor: 'text-indigo-400 bg-indigo-900/30', date: 'Apr 2, 2026' },
          { bill: 'HB-2847', title: 'Medical Cannabis Patient Protection Expansion', state: 'Oklahoma', status: 'Passed House', statusColor: 'text-emerald-400 bg-emerald-900/30', date: 'May 18, 2026' },
          { bill: 'AB-991', title: 'Cannabis Tax Revenue Allocation Reform', state: 'California', status: 'In Committee', statusColor: 'text-amber-400 bg-amber-900/30', date: 'Jun 7, 2026' },
          { bill: 'SB-340', title: 'Social Equity License Accelerator Act', state: 'Illinois', status: 'Signed', statusColor: 'text-violet-400 bg-violet-900/30', date: 'Jan 22, 2026' },
          { bill: 'HB-1050', title: 'Lab Testing Standards Uniformity Act', state: 'Colorado', status: 'Passed Senate', statusColor: 'text-emerald-400 bg-emerald-900/30', date: 'Jul 1, 2026' },
          { bill: 'SB-778', title: 'Cannabis Workforce Development & Training', state: 'Michigan', status: 'Introduced', statusColor: 'text-indigo-400 bg-indigo-900/30', date: 'Jun 29, 2026' },
        ].map((b, i) => (
          <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-indigo-900/10 transition-colors group">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <span className="text-xs font-black text-indigo-400 bg-indigo-900/30 px-2.5 py-1 rounded-lg border border-indigo-800/30 shrink-0">
                {b.bill}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{b.title}</p>
                <p className="text-xs text-indigo-300/40 font-medium">{b.state} • Introduced {b.date}</p>
              </div>
            </div>
            <span className={cn("text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-transparent shrink-0 ml-4", b.statusColor)}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Regulatory Timeline */}
    <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
      <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
        <Calendar size={18} className="text-indigo-400" /> Regulatory Change Timeline
      </h3>
      <div className="relative pl-8 space-y-6">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-emerald-500"></div>
        {[
          { date: 'Jul 2026', event: 'DEA Schedule III Final Rule — Comment period closes', type: 'Federal' },
          { date: 'Aug 2026', event: 'Oklahoma OMMA fee restructure takes effect', type: 'State' },
          { date: 'Sep 2026', event: 'SAFE Banking Act floor vote (projected)', type: 'Federal' },
          { date: 'Oct 2026', event: 'Interstate commerce pilot — 3-state launch', type: 'Federal' },
          { date: 'Jan 2027', event: 'New lab testing standards (AOAC) mandatory compliance deadline', type: 'Industry' },
        ].map((e, i) => (
          <div key={i} className="relative flex gap-4">
            <div className="absolute -left-5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#111827] mt-1.5 shadow-lg shadow-indigo-500/30"></div>
            <div className="flex-1 p-4 rounded-xl bg-[#0a0f1a] border border-indigo-900/30 hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-black text-indigo-400">{e.date}</span>
                <span className="text-[10px] font-bold text-indigo-300/40 uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-900/30">{e.type}</span>
              </div>
              <p className="text-sm font-medium text-white">{e.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Economic Impact Reports ─────────────────────────────────────────────
const EconomicImpactTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col gap-2 mb-2">
      <h2 className="text-2xl font-black text-white tracking-tight">Economic Impact Analysis</h2>
      <p className="text-indigo-300/60 text-sm max-w-2xl font-medium">
        Comprehensive economic contribution data across all legalized jurisdictions. All figures sourced from state revenue departments and GGP-OS transaction monitoring.
      </p>
    </div>

    {/* National Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: 'Total Industry GDP', value: '$41.2B', sub: 'Annual (2025-2026)', icon: TrendingUp, color: 'from-indigo-600 to-violet-600' },
        { label: 'Total Tax Revenue', value: '$8.4B', sub: 'All Legal States Combined', icon: DollarSign, color: 'from-emerald-600 to-teal-600' },
        { label: 'Direct Employment', value: '428,000+', sub: 'Full-Time Equivalent Jobs', icon: Users, color: 'from-violet-600 to-purple-600' },
      ].map((c, i) => (
        <div key={i} className={cn("relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br", c.color)}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <c.icon size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">{c.label}</p>
            <h3 className="text-3xl font-black mb-1">{c.value}</h3>
            <p className="text-sm text-white/60 font-medium">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>

    {/* State Rankings */}
    <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
      <h3 className="text-lg font-bold text-white mb-4">State Economic Contribution Rankings</h3>
      <div className="space-y-3">
        {[
          { rank: 1, state: 'California', gdp: '$7.9B', tax: '$1.24B', jobs: '82,400', pct: 100 },
          { rank: 2, state: 'Colorado', gdp: '$4.1B', tax: '$498M', jobs: '44,200', pct: 52 },
          { rank: 3, state: 'Illinois', gdp: '$3.8B', tax: '$412M', jobs: '38,100', pct: 48 },
          { rank: 4, state: 'Michigan', gdp: '$3.2B', tax: '$389M', jobs: '31,800', pct: 41 },
          { rank: 5, state: 'Washington', gdp: '$2.8B', tax: '$342M', jobs: '28,600', pct: 35 },
          { rank: 6, state: 'Oregon', gdp: '$2.1B', tax: '$287M', jobs: '22,100', pct: 27 },
          { rank: 7, state: 'Nevada', gdp: '$1.9B', tax: '$248M', jobs: '19,400', pct: 24 },
          { rank: 8, state: 'Oklahoma', gdp: '$1.7B', tax: '$198M', jobs: '17,800', pct: 22 },
        ].map((s) => (
          <div key={s.rank} className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0f1a] border border-indigo-900/20 hover:border-indigo-500/30 transition-colors">
            <span className="text-lg font-black text-indigo-400/60 w-8 text-center">#{s.rank}</span>
            <span className="text-sm font-bold text-white w-28">{s.state}</span>
            <div className="flex-1">
              <div className="h-2 bg-[#080c16] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${s.pct}%` }}></div>
              </div>
            </div>
            <div className="flex gap-6 text-right shrink-0">
              <div>
                <p className="text-xs text-indigo-300/40 font-bold">GDP</p>
                <p className="text-sm font-bold text-white">{s.gdp}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-300/40 font-bold">Tax Rev</p>
                <p className="text-sm font-bold text-emerald-400">{s.tax}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-300/40 font-bold">Jobs</p>
                <p className="text-sm font-bold text-violet-400">{s.jobs}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Cost-Benefit Summary */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Cost-Benefit Analysis (National)</h3>
        <div className="space-y-4">
          {[
            { label: 'Tax Revenue Generated', value: '$8.4B', type: 'benefit' },
            { label: 'Regulatory & Enforcement Costs', value: '-$1.2B', type: 'cost' },
            { label: 'Healthcare Savings (Opioid Reduction)', value: '$3.1B', type: 'benefit' },
            { label: 'Criminal Justice Savings', value: '$2.8B', type: 'benefit' },
            { label: 'Administrative Overhead', value: '-$480M', type: 'cost' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#0a0f1a] border border-indigo-900/20">
              <span className="text-sm font-medium text-indigo-200">{item.label}</span>
              <span className={cn("text-sm font-black", item.type === 'benefit' ? 'text-emerald-400' : 'text-red-400')}>{item.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 rounded-xl bg-indigo-900/30 border border-indigo-700/40">
            <span className="text-sm font-bold text-white">Net Economic Benefit</span>
            <span className="text-lg font-black text-emerald-400">+$12.62B</span>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Revenue Allocation Breakdown</h3>
        <div className="space-y-4">
          {[
            { label: 'General Fund', pct: 35, value: '$2.94B', color: 'bg-indigo-500' },
            { label: 'Education & Schools', pct: 25, value: '$2.10B', color: 'bg-violet-500' },
            { label: 'Public Health Programs', pct: 15, value: '$1.26B', color: 'bg-emerald-500' },
            { label: 'Infrastructure & Roads', pct: 10, value: '$840M', color: 'bg-sky-500' },
            { label: 'Social Equity Funds', pct: 8, value: '$672M', color: 'bg-amber-500' },
            { label: 'Law Enforcement', pct: 7, value: '$588M', color: 'bg-red-500' },
          ].map((a, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-200 font-medium">{a.label}</span>
                <span className="text-white font-bold">{a.value} <span className="text-indigo-400/60 text-xs">({a.pct}%)</span></span>
              </div>
              <div className="h-1.5 bg-[#080c16] rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", a.color)} style={{ width: `${a.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Constituent Health Data ──────────────────────────────────────────────
const ConstituentHealthTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col gap-2 mb-2">
      <h2 className="text-2xl font-black text-white tracking-tight">Constituent Health Outcomes</h2>
      <p className="text-indigo-300/60 text-sm max-w-2xl font-medium">
        Anonymized public health data showing patient demographics and health outcomes in legalized jurisdictions. All data is HIPAA-compliant and aggregated.
      </p>
    </div>

    {/* Health KPIs */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Registered Patients', value: '482,912', trend: '+18.4%', up: true },
        { label: 'Opioid Rx Reduction', value: '-22.1%', trend: 'In Legal States', up: true },
        { label: 'Lab Safety Pass Rate', value: '98.4%', trend: '1.2M Tests', up: true },
        { label: 'ER Visit Reduction', value: '-8.7%', trend: 'Cannabis-related', up: true },
      ].map((s, i) => (
        <div key={i} className="bg-[#111827] p-5 rounded-2xl border border-indigo-900/40">
          <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-wider mb-2">{s.label}</p>
          <h3 className="text-2xl font-black text-white mb-1">{s.value}</h3>
          <p className="text-xs text-emerald-400 font-bold">{s.trend}</p>
        </div>
      ))}
    </div>

    {/* Demographics + Outcomes */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Patient Demographics (Aggregated)</h3>
        <div className="space-y-4">
          {[
            { label: 'Age 18-25', pct: 12, color: 'bg-sky-500' },
            { label: 'Age 26-35', pct: 28, color: 'bg-indigo-500' },
            { label: 'Age 36-50', pct: 31, color: 'bg-violet-500' },
            { label: 'Age 51-65', pct: 20, color: 'bg-emerald-500' },
            { label: 'Age 65+', pct: 9, color: 'bg-amber-500' },
          ].map((d, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-200 font-medium">{d.label}</span>
                <span className="text-white font-bold">{d.pct}%</span>
              </div>
              <div className="h-2 bg-[#0a0f1a] rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", d.color)} style={{ width: `${d.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Top Qualifying Conditions</h3>
        <div className="space-y-3">
          {[
            { condition: 'Chronic Pain', patients: '201,400', pct: 42 },
            { condition: 'PTSD / Anxiety', patients: '96,580', pct: 20 },
            { condition: 'Epilepsy / Seizure Disorders', patients: '48,290', pct: 10 },
            { condition: 'Cancer (Chemo Side Effects)', patients: '38,630', pct: 8 },
            { condition: 'Multiple Sclerosis', patients: '24,150', pct: 5 },
            { condition: 'Crohn\'s / IBS', patients: '19,320', pct: 4 },
            { condition: 'Other Qualifying Conditions', patients: '54,542', pct: 11 },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0f1a] border border-indigo-900/20">
              <span className="text-sm font-medium text-indigo-200 flex-1">{c.condition}</span>
              <span className="text-xs text-indigo-300/40 font-bold">{c.patients}</span>
              <span className="text-sm font-black text-white w-12 text-right">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="p-5 bg-indigo-900/20 rounded-2xl border border-indigo-800/30">
      <p className="text-xs text-indigo-300/50 font-medium text-center">
        <Shield size={14} className="inline mr-1.5 text-indigo-400" />
        All patient data is anonymized, aggregated, and HIPAA-compliant. No personally identifiable information (PII) is accessible from this portal. Data sourced from state health department registries and GGP-OS compliance infrastructure.
      </p>
    </div>
  </div>
);

// ── Budget & Fiscal Analysis ─────────────────────────────────────────────
const BudgetFiscalTab = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col gap-2 mb-2">
      <h2 className="text-2xl font-black text-white tracking-tight">Budget & Fiscal Analysis</h2>
      <p className="text-indigo-300/60 text-sm max-w-2xl font-medium">
        Comprehensive fiscal impact modeling and budget allocation tools for legislative decision-making.
      </p>
    </div>

    {/* Fiscal KPIs */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[
        { label: 'Projected Annual Revenue (FY2027)', value: '$2.4B', sub: '+14% YoY growth', icon: TrendingUp },
        { label: 'Current Budget Allocation', value: '$2.1B', sub: 'Across 6 categories', icon: PieChart },
        { label: 'Unallocated Surplus', value: '$312M', sub: 'Available for appropriation', icon: DollarSign },
      ].map((k, i) => (
        <div key={i} className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6 flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 shrink-0">
            <k.icon size={22} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-wider mb-1">{k.label}</p>
            <h3 className="text-2xl font-black text-white">{k.value}</h3>
            <p className="text-xs text-emerald-400 font-bold mt-1">{k.sub}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Revenue vs Expenditure */}
    <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
      <h3 className="text-lg font-bold text-white mb-5">Revenue vs. Expenditure (Fiscal Year 2025-2026)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Revenue Sources</h4>
          <div className="space-y-3">
            {[
              { source: 'Excise Tax', amount: '$1.12B', pct: 53 },
              { source: 'Sales Tax', amount: '$546M', pct: 26 },
              { source: 'License & Application Fees', amount: '$284M', pct: 14 },
              { source: 'Penalties & Fines', amount: '$148M', pct: 7 },
            ].map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0a0f1a] border border-indigo-900/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-200">{r.source}</p>
                  <p className="text-xs text-indigo-300/40">{r.pct}% of total</p>
                </div>
                <p className="text-lg font-black text-emerald-400">{r.amount}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Expenditures</h4>
          <div className="space-y-3">
            {[
              { source: 'Regulatory Operations', amount: '$412M', pct: 24 },
              { source: 'Enforcement & Compliance', amount: '$348M', pct: 20 },
              { source: 'Lab Testing Infrastructure', amount: '$198M', pct: 12 },
              { source: 'Administrative & IT', amount: '$142M', pct: 8 },
              { source: 'Unallocated Surplus', amount: '$312M', pct: 36, highlight: true },
            ].map((e, i) => (
              <div key={i} className={cn("p-4 rounded-xl border flex items-center justify-between",
                e.highlight ? "bg-indigo-900/30 border-indigo-700/40" : "bg-[#0a0f1a] border-indigo-900/20"
              )}>
                <div>
                  <p className="text-sm font-medium text-indigo-200">{e.source}</p>
                  <p className="text-xs text-indigo-300/40">{e.pct}% of total</p>
                </div>
                <p className={cn("text-lg font-black", e.highlight ? "text-indigo-400" : "text-red-400")}>{e.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Fiscal Forecast */}
    <div className="bg-[#111827] rounded-2xl border border-indigo-900/40 p-6">
      <h3 className="text-lg font-bold text-white mb-4">5-Year Fiscal Forecast</h3>
      <div className="space-y-4">
        {[
          { year: 'FY2027', revenue: '$2.4B', growth: '+14%', confidence: '94%' },
          { year: 'FY2028', revenue: '$2.8B', growth: '+17%', confidence: '89%' },
          { year: 'FY2029', revenue: '$3.3B', growth: '+18%', confidence: '83%' },
          { year: 'FY2030', revenue: '$3.7B', growth: '+12%', confidence: '76%' },
          { year: 'FY2031', revenue: '$4.1B', growth: '+11%', confidence: '68%' },
        ].map((f, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#0a0f1a] border border-indigo-900/20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-base font-black text-white w-20">{f.year}</span>
              <div className="h-2 w-48 bg-[#080c16] rounded-full overflow-hidden hidden md:block">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" style={{ width: `${parseInt(f.confidence)}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-lg font-black text-white">{f.revenue}</p>
                <p className="text-xs font-bold text-emerald-400">{f.growth} projected</p>
              </div>
              <div className="text-right w-24 hidden md:block">
                <p className="text-xs text-indigo-300/40 font-bold">Confidence</p>
                <p className="text-sm font-black text-indigo-400">{f.confidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-indigo-400/40 mt-4">
        Projections based on current growth trajectories, pending legislative changes, and interstate commerce modeling. Confidence intervals decrease with forecast horizon.
      </p>
    </div>
  </div>
);


// ── Main Dashboard ──────────────────────────────────────────────────────
export const LegislatorsDashboard = ({ onLogout, user }: { onLogout?: () => void, user?: any }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tier, setTier] = useState<'basic' | 'pro' | 'custom'>('pro');

  const tierLevels = { basic: 1, pro: 2, custom: 3 };
  const hasAccess = (requiredTier: string) => tierLevels[tier] >= tierLevels[requiredTier as keyof typeof tierLevels];

  return (
    <div className="h-screen bg-[#0a0e1a] overflow-hidden relative font-sans text-white">
      <div className="h-full flex flex-col transition-all duration-500">
        {/* Top Header */}
        <header className="bg-[#0d1224] border-b border-indigo-900/30 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <img src="/gghp-branding.png" alt="GGP-OS" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wide">GGP-OS Legislators & Governors Portal</h1>
              <p className="text-[10px] text-indigo-400/50 font-semibold uppercase tracking-widest">Economic & Policy Insight • Real-Time Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="bg-[#111827] border border-indigo-900/40 text-indigo-300 text-xs px-2 py-1.5 rounded-lg outline-none cursor-pointer">
              <option value="basic">Basic Tier</option>
              <option value="pro">Pro Tier</option>
              <option value="custom">Custom Tier</option>
            </select>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2.5 py-1 rounded-full border border-emerald-800/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-indigo-300 text-xs font-bold">LG</div>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-60 bg-[#0d1224] border-r border-indigo-900/20 flex flex-col shrink-0">
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
              {tabs.map(t => {
                const allowed = hasAccess(t.tier);
                return (
                  <button key={t.id} onClick={() => allowed && setActiveTab(t.id)}
                    className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all",
                      activeTab === t.id
                        ? "bg-indigo-900/50 text-indigo-200 border border-indigo-700/40 shadow-sm shadow-indigo-900/20"
                        : "text-indigo-300/50 hover:bg-[#111827] hover:text-indigo-200 border border-transparent",
                      !allowed && "opacity-40 cursor-not-allowed"
                    )}>
                    <div className="flex items-center gap-2.5">
                      <t.icon size={15} className={activeTab === t.id ? "text-indigo-400" : "text-indigo-400/30"} />
                      {t.label}
                    </div>
                    {!allowed && <Lock size={12} className="text-indigo-500/50" />}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-indigo-900/20">
              <div className="bg-[#0a0f1a] rounded-xl p-3 border border-indigo-900/30">
                <p className="text-[9px] text-indigo-400/40 uppercase font-bold tracking-wider mb-1">Subscription Tier</p>
                <p className="text-xs font-bold text-indigo-200 capitalize">Government {tier}</p>
                <p className="text-[10px] text-indigo-300/40 mt-0.5">
                  {tier === 'custom' ? '$45,000/mo' : tier === 'pro' ? '$12,999/mo' : '$2,999/mo'}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {(() => {
              const currentTab = tabs.find(t => t.id === activeTab);
              if (currentTab && !hasAccess(currentTab.tier)) {
                return (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-indigo-900/20 rounded-full flex items-center justify-center mb-8 border border-indigo-800/30">
                      <Lock size={40} className="text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">Tier Upgrade Required</h2>
                    <p className="text-indigo-300/70 max-w-lg mb-8 text-lg">
                      The <strong>{currentTab.label}</strong> module requires the <span className="capitalize text-indigo-400 font-bold">{currentTab.tier}</span> tier.
                      Upgrade your office's subscription to unlock advanced analytics, policy modeling, and real-time data feeds.
                    </p>
                    <button onClick={() => setActiveTab('subscription')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-900/30 transition-all active:scale-95">
                      View Upgrade Options
                    </button>
                  </div>
                );
              }

              return (
                <div className="max-w-7xl mx-auto">
                  {activeTab === 'overview' && <PolicyEconomicOverview user={user} />}
                  {activeTab === 'legislative' && <LegislativeTrackerTab />}
                  {activeTab === 'economic' && <EconomicImpactTab />}
                  {activeTab === 'health' && <ConstituentHealthTab />}
                  {activeTab === 'budget' && <BudgetFiscalTab />}
                  {activeTab === 'scenarios' && <PolicyScenariosTab />}
                  {activeTab === 'intel' && <LegislativeIntelTab />}
                  {activeTab === 'subscription' && <SubscriptionPortal userRole="political_executive" initialPlanId={`gov_${tier}`} />}
                </div>
              );
            })()}
          </main>
        </div>
      </div>
    </div>
  );
};

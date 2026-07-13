import React, { useState } from 'react';
import {
  Home, Building2, Users, FileText, Shield, Activity, Search, Plus, Eye,
  Clock, UserCheck, CheckCircle, X, XCircle, Filter, ChevronRight,
  DollarSign, Star, MapPin, Leaf, Briefcase, ClipboardList, CalendarCheck,
  TrendingUp, AlertTriangle, Mail, Phone, Download, MoreVertical,
  Bed, Bath, Maximize, Heart, Award, Sparkles, ShieldCheck, CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ─── SAMPLE APPLICATIONS DATA ───
const SAMPLE_APPLICATIONS = [
  { id: 'CC-APP-001', name: 'James Carter', type: 'Tenant', email: 'james.carter@email.com', phone: '(405) 555-0142', property: 'Modern Cannabis-Friendly Loft', location: 'Oklahoma City, OK', status: 'Pending Review', submitted: '2026-07-12', creditScore: 720, cannabis_card: true, employment: 'Verified', income: '$4,200/mo', notes: '' },
  { id: 'CC-APP-002', name: 'Sarah Mitchell', type: 'Tenant', email: 'sarah.m@email.com', phone: '(918) 555-0387', property: 'Cozy 420-Friendly Cottage', location: 'Norman, OK', status: 'Background Check', submitted: '2026-07-11', creditScore: 685, cannabis_card: true, employment: 'Verified', income: '$3,800/mo', notes: 'Previous landlord reference positive' },
  { id: 'CC-APP-003', name: 'David Rosenberg', type: 'Landlord', email: 'drosenberg@realty.com', phone: '(480) 555-0219', property: '3BR House — Edmond, OK', location: 'Edmond, OK', status: 'Approved', submitted: '2026-07-09', creditScore: 0, cannabis_card: false, employment: 'N/A', income: 'N/A', notes: 'Platinum tier selected. Signed contract.' },
  { id: 'CC-APP-004', name: 'Maria Gonzalez', type: 'Tenant', email: 'mgonzalez@gmail.com', phone: '(405) 555-0901', property: 'Downtown Cannabis-Friendly Studio', location: 'Tulsa, OK', status: 'Pending Review', submitted: '2026-07-13', creditScore: 740, cannabis_card: true, employment: 'Pending', income: '$5,100/mo', notes: '' },
  { id: 'CC-APP-005', name: 'Tom Williams', type: 'Landlord', email: 'twilliams@okprops.com', phone: '(405) 555-0555', property: '4-Unit Multi-Family — Moore, OK', location: 'Moore, OK', status: 'Verification', submitted: '2026-07-10', creditScore: 0, cannabis_card: false, employment: 'N/A', income: 'N/A', notes: 'Gold tier. Wants inspection schedule.' },
  { id: 'CC-APP-006', name: 'Ashley Park', type: 'Short-Term Guest', email: 'ashpark@travel.com', phone: '(602) 555-0733', property: 'Desert Oasis Cannabis Retreat', location: 'Bullhead City, AZ', status: 'Approved', submitted: '2026-07-08', creditScore: 0, cannabis_card: true, employment: 'N/A', income: 'N/A', notes: 'Guest for Jul 15-20. Executive tier property.' },
];

// ─── SAMPLE PROPERTIES ───
const MANAGED_PROPERTIES = [
  { id: 'PROP-001', name: 'Modern Cannabis-Friendly Loft', location: 'Oklahoma City, OK', type: 'Apartment', tier: 'Gold', rent: 1450, status: 'Occupied', tenant: 'Marcus Reed', nextInspection: '2026-07-18', occupancy: '100%' },
  { id: 'PROP-002', name: 'Cozy 420-Friendly Cottage', location: 'Norman, OK', type: 'House', tier: 'Green', rent: 1200, status: 'Vacant', tenant: '—', nextInspection: '—', occupancy: '0%' },
  { id: 'PROP-003', name: 'Luxury CannaCrib Suite', location: 'Scottsdale, AZ', type: 'Short-Term', tier: 'Executive', rent: 189, status: 'Booked', tenant: 'Ashley Park (Jul 15-20)', nextInspection: '2026-07-15', occupancy: '85%' },
  { id: 'PROP-004', name: 'Spacious Grow-Friendly Rancher', location: 'Edmond, OK', type: 'House', tier: 'Platinum', rent: 1800, status: 'Occupied', tenant: 'David Rosenberg (Owner)', nextInspection: '2026-07-20', occupancy: '100%' },
  { id: 'PROP-005', name: 'Cannabis-Friendly Commercial Space', location: 'Moore, OK', type: 'Commercial', tier: 'Platinum', rent: 3200, status: 'Vacant', tenant: '—', nextInspection: '—', occupancy: '0%' },
  { id: 'PROP-006', name: 'Midtown 420 Friendly Townhome', location: 'Oklahoma City, OK', type: 'House', tier: 'Gold', rent: 1650, status: 'Occupied', tenant: 'Jasmine Wells', nextInspection: '2026-07-22', occupancy: '100%' },
];

const STATUS_COLORS: Record<string, string> = {
  'Pending Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'Background Check': 'bg-blue-100 text-blue-700 border-blue-200',
  'Verification': 'bg-purple-100 text-purple-700 border-purple-200',
  'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Denied': 'bg-red-100 text-red-700 border-red-200',
  'Occupied': 'bg-emerald-100 text-emerald-700',
  'Vacant': 'bg-amber-100 text-amber-700',
  'Booked': 'bg-blue-100 text-blue-700',
};

const TIER_COLORS: Record<string, string> = {
  'Green': 'bg-emerald-100 text-emerald-700',
  'Gold': 'bg-amber-100 text-amber-700',
  'Platinum': 'bg-violet-100 text-violet-700',
  'Executive': 'bg-purple-100 text-purple-700',
};

type SubTab = 'overview' | 'applications' | 'properties' | 'inspections' | 'landlords';

export const CannaCribsManagementTab = () => {
  const [subTab, setSubTab] = useState<SubTab>('overview');
  const [appFilter, setAppFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<typeof SAMPLE_APPLICATIONS[0] | null>(null);

  const filteredApps = SAMPLE_APPLICATIONS.filter(a => {
    if (appFilter === 'All') return true;
    if (appFilter === 'Tenants') return a.type === 'Tenant';
    if (appFilter === 'Landlords') return a.type === 'Landlord';
    if (appFilter === 'Short-Term') return a.type === 'Short-Term Guest';
    if (appFilter === 'Pending') return a.status === 'Pending Review';
    return true;
  });

  const subTabs = [
    { id: 'overview' as SubTab, label: 'Overview', icon: Activity },
    { id: 'applications' as SubTab, label: 'Applications', icon: ClipboardList },
    { id: 'properties' as SubTab, label: 'Properties', icon: Home },
    { id: 'inspections' as SubTab, label: 'Inspections', icon: Eye },
    { id: 'landlords' as SubTab, label: 'Landlords', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Leaf className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-green-600">Canna</span>
              <span className="text-amber-500">Cribs</span>
              <span className="text-slate-400 text-sm font-bold">Management</span>
            </h1>
            <p className="text-xs text-slate-500">Cannabis-Friendly Real Estate Platform — Back Office</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/cannacribs" target="_blank" className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-1.5">
            <Eye size={14} /> View Live Site
          </a>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all shadow-sm flex items-center gap-1.5">
            <Plus size={14} /> Add Property
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all',
              subTab === t.id
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Properties', value: '6', change: '+2 this month', icon: Home, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Active Tenants', value: '4', change: '67% occupancy', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Apps', value: '2', change: 'Review needed', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Monthly Revenue', value: '$6,489', change: '+18% MoM', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', kpi.bg)}>
                    <kpi.icon size={18} className={kpi.color} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
                <div className="text-xs text-slate-500 font-medium">{kpi.label}</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">{kpi.change}</div>
              </div>
            ))}
          </div>

          {/* Revenue Breakdown + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Tier */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-600" />
                Revenue by Service Tier
              </h3>
              <div className="space-y-3">
                {[
                  { tier: 'Green', properties: 1, revenue: '$49', color: 'bg-emerald-500' },
                  { tier: 'Gold', properties: 2, revenue: '$298', color: 'bg-amber-500' },
                  { tier: 'Platinum', properties: 2, revenue: '$598', color: 'bg-violet-500' },
                  { tier: 'Executive', properties: 1, revenue: '$499', color: 'bg-purple-500' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-3 h-3 rounded-full', r.color)} />
                      <span className="text-sm font-bold text-slate-700">{r.tier}</span>
                      <span className="text-xs text-slate-400">{r.properties} properties</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{r.revenue}/mo</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-black text-green-700">Total Tier Revenue</span>
                  <span className="text-lg font-black text-green-700">$1,444/mo</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <Activity size={16} className="text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', event: 'New Application', detail: 'Maria Gonzalez — Tenant app for Studio, Tulsa', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { time: '1 hr ago', event: 'Inspection Complete', detail: 'Modern Loft, OKC — All 30 points passed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { time: '3 hrs ago', event: 'Lease Signed', detail: 'Jasmine Wells — Midtown Townhome, 12-mo lease', color: 'text-blue-600', bg: 'bg-blue-50' },
                  { time: 'Yesterday', event: 'Cleaning Done', detail: 'Desert Oasis, AZ — Turnover clean + odor mitigation', color: 'text-purple-600', bg: 'bg-purple-50' },
                  { time: 'Jul 11', event: 'Landlord Onboarded', detail: 'Tom Williams — 4-Unit, Moore OK — Gold tier', color: 'text-green-600', bg: 'bg-green-50' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mt-0.5', a.bg, a.color)}>
                      {a.event}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-700 font-medium">{a.detail}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Fee Schedule */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-violet-600" />
              Tenant & Guest Fee Schedule
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { fee: 'Application Fee', amount: '$45', type: 'Per application' },
                { fee: 'Background Check', amount: '$35', type: 'Per tenant' },
                { fee: 'Lease Processing', amount: '$75', type: 'Per lease' },
                { fee: 'Short-Term Booking', amount: '12%', type: 'Per booking' },
                { fee: 'Cannabis Card Verify', amount: '$15', type: 'Per verification' },
                { fee: 'Renter\'s Insurance', amount: '$29', type: 'Per month' },
                { fee: 'Move-In/Out Inspect', amount: '$95', type: 'Per event' },
                { fee: 'Key Deposit', amount: '$50', type: 'Refundable' },
              ].map((f, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg text-center">
                  <div className="text-lg font-black text-green-600">{f.amount}</div>
                  <div className="text-xs font-bold text-slate-700">{f.fee}</div>
                  <div className="text-[10px] text-slate-400">{f.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ APPLICATIONS ═══ */}
      {subTab === 'applications' && (
        <div className="space-y-4">
          {/* Application Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{selectedApp.name}</h3>
                    <p className="text-xs text-slate-500">{selectedApp.id} • {selectedApp.type} Application</p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 space-y-5">
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-bold border', STATUS_COLORS[selectedApp.status])}>{selectedApp.status}</span>
                    <span className="text-xs text-slate-400">Submitted {selectedApp.submitted}</span>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Email</div>
                      <div className="text-sm text-slate-700 font-medium">{selectedApp.email}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Phone</div>
                      <div className="text-sm text-slate-700 font-medium">{selectedApp.phone}</div>
                    </div>
                  </div>

                  {/* Property */}
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-[10px] text-green-600 uppercase font-bold mb-1">Property Applied For</div>
                    <div className="text-sm text-slate-900 font-bold">{selectedApp.property}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {selectedApp.location}</div>
                  </div>

                  {/* Verification Details (Tenant only) */}
                  {selectedApp.type === 'Tenant' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-black text-slate-900">{selectedApp.creditScore}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Credit Score</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-black text-slate-900">{selectedApp.cannabis_card ? '✅' : '❌'}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Cannabis Card</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-black text-slate-900">{selectedApp.employment}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Employment</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-black text-slate-900">{selectedApp.income}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Income</div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedApp.notes && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="text-[10px] text-amber-600 uppercase font-bold mb-1">Notes</div>
                      <div className="text-sm text-slate-700">{selectedApp.notes}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all text-sm flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all border border-red-200 text-sm flex items-center justify-center gap-2">
                      <XCircle size={16} /> Deny
                    </button>
                    <button className="py-3 px-4 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all border border-blue-200 text-sm flex items-center justify-center gap-2">
                      <Mail size={16} /> Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            {['All', 'Tenants', 'Landlords', 'Short-Term', 'Pending'].map(f => (
              <button
                key={f}
                onClick={() => setAppFilter(f)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-bold transition-all', appFilter === f ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Applicant</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Type</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Property</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Submitted</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-green-50/30 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="p-3">
                      <div className="font-bold text-sm text-slate-900">{app.name}</div>
                      <div className="text-xs text-slate-400">{app.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold',
                        app.type === 'Tenant' ? 'bg-blue-100 text-blue-700' :
                        app.type === 'Landlord' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      )}>{app.type}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-xs text-slate-700 font-medium">{app.property}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={8} /> {app.location}</div>
                    </td>
                    <td className="p-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border', STATUS_COLORS[app.status])}>{app.status}</span>
                    </td>
                    <td className="p-3 text-xs text-slate-500">{app.submitted}</td>
                    <td className="p-3">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}>
                        <Eye size={14} className="text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ PROPERTIES ═══ */}
      {subTab === 'properties' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MANAGED_PROPERTIES.map((prop, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      {prop.type === 'House' && <Home size={14} className="text-green-600" />}
                      {prop.type === 'Apartment' && <Building2 size={14} className="text-green-600" />}
                      {prop.type === 'Short-Term' && <Star size={14} className="text-green-600" />}
                      {prop.type === 'Commercial' && <Briefcase size={14} className="text-green-600" />}
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', TIER_COLORS[prop.tier])}>{prop.tier}</span>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', STATUS_COLORS[prop.status])}>{prop.status}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{prop.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin size={10} /> {prop.location}</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-sm font-black text-green-600">${prop.rent.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400">{prop.type === 'Short-Term' ? '/night' : '/mo'}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-sm font-black text-slate-900">{prop.occupancy}</div>
                    <div className="text-[9px] text-slate-400">Occupancy</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-sm font-black text-slate-900">{prop.nextInspection !== '—' ? '📋' : '—'}</div>
                    <div className="text-[9px] text-slate-400">Inspect</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <span className="font-semibold">Tenant:</span> {prop.tenant}
                </div>
                {prop.nextInspection !== '—' && (
                  <div className="text-[10px] text-blue-600 font-bold mt-1">
                    Next Inspection: {prop.nextInspection}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ INSPECTIONS ═══ */}
      {subTab === 'inspections' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <Eye size={16} className="text-violet-600" /> 30-Point Inspection Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'Exterior Condition', 'Interior Walls & Paint', 'Flooring Condition',
                'Windows & Locks', 'Doors & Hinges', 'Plumbing & Fixtures',
                'Electrical Outlets', 'HVAC System', 'Smoke Detectors',
                'CO Detectors', 'Fire Extinguisher', 'Appliance Function',
                'Kitchen Condition', 'Bathroom Condition', 'Pest Inspection',
                'Cannabis Odor Level', 'Ventilation System', 'Air Filtration',
                'Grow Area (if any)', 'Waste Disposal', 'Yard/Exterior Clean',
                'Parking Area', 'Security System', 'Key/Lock Integrity',
                'Furniture Condition', 'Linen/Bedding Check', 'Supply Inventory',
                'Neighbor Complaints', 'Photo Documentation', 'Overall Rating',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-xs text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Inspections */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <CalendarCheck size={16} className="text-blue-600" /> Upcoming Inspections
            </h3>
            <div className="space-y-3">
              {MANAGED_PROPERTIES.filter(p => p.nextInspection !== '—').map((prop, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <CalendarCheck size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{prop.name}</div>
                      <div className="text-xs text-slate-400">{prop.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-blue-600">{prop.nextInspection}</div>
                    <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold', TIER_COLORS[prop.tier])}>{prop.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaning Service Tiers */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" /> Cleaning Service Tiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { tier: 'Standard Clean', price: '$85', desc: 'Surface cleaning, vacuum, mop, bathroom/kitchen scrub, trash removal', color: 'border-emerald-200 bg-emerald-50' },
                { tier: 'Deep Clean', price: '$175', desc: 'Standard + appliance interior, baseboard, window sill, cabinet wipe, grout cleaning', color: 'border-amber-200 bg-amber-50' },
                { tier: 'Turnover Clean + Odor', price: '$350', desc: 'Deep clean + ozone treatment, air scrub, carpet steam, linen change, move-in ready', color: 'border-purple-200 bg-purple-50' },
              ].map((c, i) => (
                <div key={i} className={cn('rounded-xl border-2 p-4', c.color)}>
                  <div className="text-xl font-black text-slate-900 mb-1">{c.price}</div>
                  <div className="text-sm font-bold text-slate-700 mb-2">{c.tier}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ LANDLORDS ═══ */}
      {subTab === 'landlords' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users size={16} className="text-purple-600" /> Registered Landlords
              </h3>
              <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-500 transition-all flex items-center gap-1">
                <Plus size={12} /> Onboard Landlord
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Landlord</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Properties</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Tier</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Revenue</th>
                  <th className="text-left p-3 text-[10px] font-black uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'David Rosenberg', email: 'drosenberg@realty.com', properties: 2, tier: 'Platinum', revenue: '$598/mo', status: 'Active' },
                  { name: 'Tom Williams', email: 'twilliams@okprops.com', properties: 1, tier: 'Gold', revenue: '$149/mo', status: 'Onboarding' },
                  { name: 'Linda Chen', email: 'lchen@email.com', properties: 1, tier: 'Executive', revenue: '$499/mo', status: 'Active' },
                  { name: 'Robert Jackson', email: 'rjackson@prop.com', properties: 1, tier: 'Green', revenue: '$49/mo', status: 'Active' },
                ].map((ll, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-sm text-slate-900">{ll.name}</div>
                      <div className="text-xs text-slate-400">{ll.email}</div>
                    </td>
                    <td className="p-3 text-sm font-bold text-slate-700">{ll.properties}</td>
                    <td className="p-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-black uppercase', TIER_COLORS[ll.tier])}>{ll.tier}</span>
                    </td>
                    <td className="p-3 text-sm font-bold text-green-600">{ll.revenue}</td>
                    <td className="p-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold',
                        ll.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      )}>{ll.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CannaCribsManagementTab;

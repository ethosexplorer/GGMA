import React, { useState } from 'react';
import { CheckCircle2, XCircle, Shield, Briefcase, ChevronDown, ChevronUp, User, Star, DollarSign, Calendar, TrendingUp, FileText, Award, Clock, Building2, Cpu, Scale, Headphones, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Department Definitions ───
interface HRFile {
  hireDate: string;
  salary: string;
  payGrade: string;
  lastRaise?: string;
  lastRaiseAmount?: string;
  nextReview: string;
  performanceRating?: number; // 1-5
  promotionEligible: boolean;
  promotionNotes?: string;
  certifications?: string[];
  disciplinaryNotes?: string;
  pto?: string;
  emergencyContact?: string;
}

interface StaffMember {
  id: string;
  title: string;
  name: string;
  initials: string;
  color: string;
  status: 'active' | 'onboarding' | 'probation' | 'inactive';
  duties: string[];
  granted: string[];
  blocked: string[];
  hr: HRFile;
}

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  members: StaffMember[];
}

const DEPARTMENTS: Department[] = [
  {
    id: 'executive', name: 'Executive Leadership', icon: <Shield size={20} />, color: 'amber', bgGradient: 'from-amber-500 to-orange-600',
    members: [
      {
        id: 'founder', title: 'Founder & Chairman', name: 'Shantell Robinson', initials: 'SR', color: 'bg-amber-500', status: 'active',
        duties: [
          'Final authority on all application approvals and denials',
          'Sole decision-maker on staff hiring and termination',
          'Owns all intellectual property, patents, and copyrights',
          'Controls all financial accounts, revenue, and banking',
          'Sets strategic direction and expansion roadmap',
          'Manages investor relations and state contracts',
          'Emergency broadcast authority across all portals',
          'Board-level override on any executive decision',
        ],
        granted: ['Every tab and system in GGP-OS — unrestricted'],
        blocked: [],
        hr: {
          hireDate: '2024-01-15', salary: 'Equity / Owner', payGrade: 'C-Suite',
          nextReview: 'N/A — Owner', performanceRating: 5, promotionEligible: false,
          certifications: ['Oklahoma LLC Filing', 'OMMA Business License', 'Metrc Integrator Approval'],
          pto: 'Unlimited', emergencyContact: 'On file',
        },
      },
    ],
  },
  {
    id: 'operations', name: 'IT & Operations', icon: <Cpu size={20} />, color: 'blue', bgGradient: 'from-blue-500 to-indigo-600',
    members: [
      {
        id: 'ceo', title: 'CEO — IT & Operations', name: 'Ryan Ferrari', initials: 'RF', color: 'bg-blue-500', status: 'active',
        duties: [
          'Manage IT infrastructure, servers, and system uptime',
          'Hire and manage IT support staff (final approval by Founder)',
          'Monitor application performance (APM), errors, and latency',
          'Handle support ticket escalations and resolution SLAs',
          'Toggle feature flags during system emergencies',
          'Coordinate with engineering on bug fixes and deployments',
          'Oversee internal scheduling and operations logistics',
          'Report system health and staffing status to Founder',
        ],
        granted: [
          'IT Support & Diagnostics', 'Support Tickets & Scheduling',
          'Personnel Force (View)', 'Compliance Monitor (View)',
          'Regulatory Library (View)', 'Master Analytics',
          'Global Intelligence', 'System Logs',
          'Feature Flags (Emergency Toggles)', 'Platform Billing',
        ],
        blocked: [
          'Accounting Ledger / Revenue', 'Global Financials',
          'IP / Patent Monitor', 'HR Intelligence (Hiring/Firing)',
          'Agency Approvals (Approve/Deny)', 'Federal Command',
          'State Authority / Regulator', 'System Health / AI Guardian',
          'Master Launch Script', 'Nationwide Jurisdiction Map',
        ],
        hr: {
          hireDate: '2024-03-01', salary: '$85,000/yr', payGrade: 'L6 — Executive',
          lastRaise: '2025-03-01', lastRaiseAmount: '+$10,000', nextReview: '2026-09-01',
          performanceRating: 4, promotionEligible: true,
          promotionNotes: 'Strong candidate for CTO if tech team expands',
          certifications: ['AWS Cloud Practitioner', 'Vercel Enterprise'],
          pto: '15 days/yr', emergencyContact: 'On file',
        },
      },
    ],
  },
  {
    id: 'compliance', name: 'Compliance & Regulatory', icon: <Scale size={20} />, color: 'emerald', bgGradient: 'from-emerald-500 to-green-600',
    members: [
      {
        id: 'compliance_director', title: 'Chief Compliance Director', name: 'Monica Green', initials: 'MG', color: 'bg-emerald-500', status: 'active',
        duties: [
          'Oversee all cannabis business compliance (dispensaries, growers, labs)',
          'Monitor Metrc seed-to-sale tracking and sync status',
          'Manage the full OMMA regulatory form library (30+ forms)',
          'Review incoming business applications (no approve/deny authority)',
          'Ensure patient registry integrity and data accuracy',
          'Coordinate with state inspectors on compliance checklists',
          'Flag compliance violations and escalate to Founder',
          'Report business and regulatory status to Founder weekly',
        ],
        granted: [
          'Economic Infrastructure (Businesses)', 'Compliance Monitor (Metrc/OMMA)',
          'Regulatory Library (OMMA Forms)', 'Applications Queue (View Only)',
          'Registry Sovereignty (Patients)', 'IT Support & Diagnostics',
          'Support Tickets & Scheduling', 'Personnel Force (View)',
          'Master Analytics', 'Global Intelligence',
        ],
        blocked: [
          'Accounting Ledger / Revenue', 'Global Financials',
          'IP / Patent Monitor', 'HR Intelligence (Hiring/Firing)',
          'Agency Approvals (Approve/Deny)', 'Federal Command',
          'State Authority / Regulator', 'System Health / AI Guardian',
          'Master Launch Script', 'Nationwide Jurisdiction Map',
        ],
        hr: {
          hireDate: '2024-06-15', salary: '$72,000/yr', payGrade: 'L5 — Director',
          lastRaise: '2025-06-15', lastRaiseAmount: '+$7,000', nextReview: '2026-06-15',
          performanceRating: 4, promotionEligible: true,
          promotionNotes: 'Eligible for VP of Compliance upon multi-state expansion',
          certifications: ['OMMA Compliance Certified', 'Metrc Administrator'],
          pto: '12 days/yr', emergencyContact: 'On file',
        },
      },
    ],
  },
  {
    id: 'call_center', name: 'GGE World Call Center', icon: <Headphones size={20} />, color: 'purple', bgGradient: 'from-purple-500 to-violet-600',
    members: [
      {
        id: 'call_center_lead', title: 'Call Center Team Lead', name: 'Open Position', initials: '??', color: 'bg-purple-400', status: 'onboarding',
        duties: [
          'Manage inbound/outbound patient communication queue',
          'Train new call center agents on GGHP protocols',
          'Monitor call quality and SLA compliance',
          'Escalate complex patient issues to Compliance or Founder',
          'Generate weekly call volume and resolution reports',
        ],
        granted: [
          'GGE World Call Center', 'Support Tickets & Scheduling',
          'Calendar & Scheduler', 'Messages', 'Applications Queue (View)',
        ],
        blocked: [
          'Accounting Ledger / Revenue', 'Global Financials', 'HR Intelligence',
          'Agency Approvals', 'Federal Command', 'State Authority',
          'Master Launch Script', 'System Health / AI',
        ],
        hr: {
          hireDate: 'TBD', salary: '$45,000/yr (proposed)', payGrade: 'L3 — Team Lead',
          nextReview: 'Post-hire 90 days', performanceRating: 0, promotionEligible: false,
          promotionNotes: 'New hire — 90-day probation before review',
          pto: '10 days/yr',
        },
      },
    ],
  },
  {
    id: 'analytics', name: 'Analytics & Intelligence', icon: <BarChart3 size={20} />, color: 'cyan', bgGradient: 'from-cyan-500 to-teal-600',
    members: [
      {
        id: 'data_analyst', title: 'Data Analyst', name: 'Open Position', initials: '??', color: 'bg-cyan-400', status: 'onboarding',
        duties: [
          'Generate weekly platform analytics and KPI reports',
          'Monitor poll/survey data and produce research summaries',
          'Track user engagement metrics across all portals',
          'Build dashboards for compliance and revenue insights',
          'Support Founder with investor-ready data packages',
        ],
        granted: [
          'Master Analytics', 'Global Intelligence', 'Compliance Monitor (View)',
          'Personnel Force (View)', 'Support Tickets (View)',
        ],
        blocked: [
          'Accounting Ledger / Revenue', 'Global Financials', 'HR Intelligence',
          'Agency Approvals', 'Federal Command', 'Master Launch Script',
        ],
        hr: {
          hireDate: 'TBD', salary: '$55,000/yr (proposed)', payGrade: 'L3 — Analyst',
          nextReview: 'Post-hire 90 days', performanceRating: 0, promotionEligible: false,
          pto: '10 days/yr',
        },
      },
    ],
  },
];

// ─── Star Rating Component ───
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={14} className={i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
    ))}
  </div>
);

// ─── Status Badge ───
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    onboarding: 'bg-amber-100 text-amber-700 border-amber-200',
    probation: 'bg-orange-100 text-orange-700 border-orange-200',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${styles[status] || styles.inactive}`}>
      {status}
    </span>
  );
};

// ─── Staff Card (Collapsed Icon) ───
const StaffIcon = ({ member, isSelected, onClick }: { member: StaffMember; isSelected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
      isSelected
        ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
    }`}
  >
    <div className={`w-14 h-14 ${member.color} rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg relative`}>
      {member.initials}
      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
        member.status === 'active' ? 'bg-emerald-400' : member.status === 'onboarding' ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'
      }`} />
    </div>
    <div className="text-center">
      <p className="text-xs font-black text-slate-800 leading-tight">{member.name}</p>
      <p className="text-[9px] font-bold text-slate-400 leading-tight mt-0.5">{member.title}</p>
    </div>
    <StatusBadge status={member.status} />
  </button>
);

// ─── Expanded Staff Detail ───
const StaffDetail = ({ member, isFounder }: { member: StaffMember; isFounder: boolean }) => {
  const [activeTab, setActiveTab] = useState<'role' | 'hr'>('role');

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg mt-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-slate-100 bg-slate-50">
          <div className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg`}>
            {member.initials}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-800">{member.title}</h3>
            <p className="text-sm text-slate-500 font-bold">{member.name}</p>
          </div>
          <StatusBadge status={member.status} />
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-100">
          {[
            { id: 'role' as const, label: 'Role & Access', icon: <Shield size={14} /> },
            { id: 'hr' as const, label: 'HR File', icon: <FileText size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-5">
          {activeTab === 'role' && (
            <>
              {/* Duties */}
              <div>
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Briefcase size={14} /> Job Duties & Responsibilities
                </h4>
                <ul className="space-y-2">
                  {member.duties.map((duty, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-indigo-400 font-black mt-0.5">•</span>
                      <span className="font-medium text-slate-700">{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Permissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">✅ Has Access</h4>
                  <div className="space-y-2">
                    {member.granted.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span className="font-bold text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {isFounder && member.blocked.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">❌ Blocked</h4>
                    <div className="space-y-2">
                      {member.blocked.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <XCircle size={15} className="text-red-400 shrink-0" />
                          <span className="font-medium text-slate-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'hr' && (
            <div className="space-y-5">
              {/* Core HR Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Hire Date', value: member.hr.hireDate, icon: <Calendar size={14} /> },
                  { label: 'Salary', value: member.hr.salary, icon: <DollarSign size={14} /> },
                  { label: 'Pay Grade', value: member.hr.payGrade, icon: <TrendingUp size={14} /> },
                  { label: 'Next Review', value: member.hr.nextReview, icon: <Clock size={14} /> },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">{item.icon}<span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span></div>
                    <p className="text-sm font-black text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Compensation History */}
              {member.hr.lastRaise && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <h5 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <DollarSign size={12} /> Last Raise
                  </h5>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700">{member.hr.lastRaise}</span>
                    <span className="text-sm font-black text-emerald-600">{member.hr.lastRaiseAmount}</span>
                  </div>
                </div>
              )}

              {/* Performance */}
              {member.hr.performanceRating > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h5 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Star size={12} /> Performance Rating
                  </h5>
                  <div className="flex items-center gap-3">
                    <StarRating rating={member.hr.performanceRating} />
                    <span className="text-sm font-bold text-slate-600">{member.hr.performanceRating}/5</span>
                  </div>
                </div>
              )}

              {/* Promotion */}
              <div className={`rounded-xl p-4 border ${member.hr.promotionEligible ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'}`}>
                <h5 className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1.5 ${member.hr.promotionEligible ? 'text-purple-700' : 'text-slate-500'}`}>
                  <Award size={12} /> Promotion Status
                </h5>
                <p className="text-sm font-bold text-slate-700">
                  {member.hr.promotionEligible ? '✅ Eligible for Promotion' : '⏳ Not Yet Eligible'}
                </p>
                {member.hr.promotionNotes && <p className="text-xs text-slate-500 mt-1 italic">{member.hr.promotionNotes}</p>}
              </div>

              {/* Certifications */}
              {member.hr.certifications && member.hr.certifications.length > 0 && (
                <div>
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Certifications</h5>
                  <div className="flex flex-wrap gap-2">
                    {member.hr.certifications.map((cert, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">{cert}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* PTO */}
              {member.hr.pto && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="font-bold text-slate-500">PTO:</span>
                  <span className="font-black text-slate-700">{member.hr.pto}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───
interface Props {
  viewerRole: 'founder' | 'ceo' | 'compliance_director';
}

export const RolePermissionsPanel = ({ viewerRole }: Props) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const isFounder = viewerRole === 'founder';

  // Filter departments based on viewer role
  const visibleDepartments = isFounder
    ? DEPARTMENTS
    : DEPARTMENTS.map(dept => ({
        ...dept,
        members: dept.members.filter(m => m.id === viewerRole),
      })).filter(dept => dept.members.length > 0);

  const toggleMember = (id: string) => {
    setSelectedMemberId(prev => prev === id ? null : id);
  };

  // Count total staff
  const totalStaff = DEPARTMENTS.reduce((sum, d) => sum + d.members.length, 0);
  const activeStaff = DEPARTMENTS.reduce((sum, d) => sum + d.members.filter(m => m.status === 'active').length, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {isFounder ? 'Personnel Directory' : 'My Role & Duties'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {isFounder ? `${totalStaff} Staff • ${activeStaff} Active • ${DEPARTMENTS.length} Departments` : 'Quick reference — duties, access, and boundaries'}
            </p>
          </div>
        </div>
        {isFounder && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Active
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2" /> Onboarding
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ml-2" /> Inactive
            </div>
          </div>
        )}
      </div>

      {/* Department Sections */}
      {visibleDepartments.map(dept => (
        <div key={dept.id} className="space-y-4">
          {/* Department Header */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${dept.bgGradient} rounded-xl flex items-center justify-center shadow-sm`}>
              {React.cloneElement(dept.icon as React.ReactElement, { className: 'text-white', size: 16 })}
            </div>
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">{dept.name}</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{dept.members.length} {dept.members.length === 1 ? 'member' : 'members'}</span>
          </div>

          {/* Staff Icon Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {dept.members.map(member => (
              <StaffIcon
                key={member.id}
                member={member}
                isSelected={selectedMemberId === member.id}
                onClick={() => toggleMember(member.id)}
              />
            ))}
          </div>

          {/* Expanded Detail (below grid) */}
          <AnimatePresence>
            {dept.members.map(member =>
              selectedMemberId === member.id ? (
                <StaffDetail key={member.id + '-detail'} member={member} isFounder={isFounder} />
              ) : null
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

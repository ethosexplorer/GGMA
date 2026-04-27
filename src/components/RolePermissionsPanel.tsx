import React from 'react';
import { CheckCircle2, XCircle, Shield, Briefcase } from 'lucide-react';

const ROLES: Record<string, { title: string; name: string; duties: string[]; granted: string[]; blocked: string[] }> = {
  founder: {
    title: 'Founder & Chairman',
    name: 'Shantell Robinson',
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
    granted: [
      'Every tab and system in GGP-OS — unrestricted',
    ],
    blocked: [],
  },
  ceo: {
    title: 'CEO — IT & Operations',
    name: 'Ryan Ferrari',
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
  },
  compliance_director: {
    title: 'Chief Executive Compliance Director',
    name: 'Monica Green',
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
  },
};

interface Props {
  viewerRole: 'founder' | 'ceo' | 'compliance_director';
}

export const RolePermissionsPanel = ({ viewerRole }: Props) => {
  const rolesToShow = viewerRole === 'founder' ? Object.keys(ROLES) : [viewerRole];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <Shield size={24} className="text-indigo-600" />
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {viewerRole === 'founder' ? 'All Roles & Responsibilities' : 'My Role & Responsibilities'}
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick reference — duties, access, and boundaries</p>
        </div>
      </div>

      {rolesToShow.map((roleId) => {
        const role = ROLES[roleId];
        return (
          <div key={roleId} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">{role.title}</h3>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{role.name}</span>
            </div>

            {/* Job Duties */}
            <div>
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Briefcase size={14} /> Job Duties & Responsibilities
              </h4>
              <ul className="space-y-2">
                {role.duties.map((duty, i) => (
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
                  {role.granted.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      <span className="font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {viewerRole === 'founder' && role.blocked.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">❌ Blocked</h4>
                  <div className="space-y-2">
                    {role.blocked.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <XCircle size={15} className="text-red-400 shrink-0" />
                        <span className="font-medium text-slate-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

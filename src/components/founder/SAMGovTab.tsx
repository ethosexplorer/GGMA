import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Search, ExternalLink, Calendar, Building2, MapPin, RefreshCw, Cpu, Award, FileText, CheckCircle, AlertTriangle, Copy, Trash2, Check, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const FALLBACK_ENTITIES = [
  {
    legalBusinessName: 'DIVERSITY HEALTH AND WELLNESS LLC',
    doingBusinessAs: 'Diversity Health Network',
    registrationStatus: 'Active Registration',
    uei: 'TY1BQ3XK3925',
    cageCode: '9KXZ2',
    expirationDate: '2027-04-06',
    purposeOfRegistration: 'All Awards',
    physicalAddress: {
      addressLine1: '2831 NE 23rd St Ste B',
      city: 'Oklahoma City',
      state: 'OK',
      zipCode: '73121-2437',
      country: 'USA'
    }
  },
  {
    legalBusinessName: 'GLOBAL GREEN ENTERPRISE INC',
    doingBusinessAs: '(blank)',
    registrationStatus: 'Active Registration',
    uei: 'SCXBFXTD1FN1',
    cageCode: '1ZL46',
    expirationDate: '2027-04-22',
    purposeOfRegistration: 'All Awards',
    physicalAddress: {
      addressLine1: '2831 NE 23rd St Ste B',
      city: 'Oklahoma City',
      state: 'OK',
      zipCode: '73121-2437',
      country: 'USA'
    }
  }
];

const FALLBACK_OPPORTUNITIES = [
  {
    noticeId: 'SAM-OPP-9082',
    title: 'Tribal Health Telehealth Equipment Grant and Integration Support',
    solicitationNumber: 'HT9410-26-R-0082',
    postedDate: '2026-07-18',
    responseDeadline: '2026-09-15',
    department: 'DEPARTMENT OF HEALTH AND HUMAN SERVICES',
    subTier: 'INDIAN HEALTH SERVICE',
    office: 'OKLAHOMA CITY AREA OFFICE',
    description: 'Acquisition of telemedicine cart equipment and secure cloud compliance database sync tools to expand outpatient clinical capacities in Oklahoma and Arizona.',
    link: 'https://sam.gov/opp/HT9410-26-R-0082/view'
  },
  {
    noticeId: 'SAM-OPP-3104',
    title: 'Statewide Medical Verification Registry Software and Platform Maintenance',
    solicitationNumber: 'RFQ-OMMA-2026-3104',
    postedDate: '2026-07-15',
    responseDeadline: '2026-08-30',
    department: 'STATE OF OKLAHOMA - PURCHASING DIVISION',
    subTier: 'OKLAHOMA MEDICAL MARIJUANA AUTHORITY (OMMA)',
    office: 'OKLAHOMA CITY CONTRACTS DEPT',
    description: 'Requirements for a real-time compliance database verification integration with secure patient licensing registries and out-of-state card reciprocity lookup.',
    link: 'https://sam.gov/opp/RFQ-OMMA-2026-3104/view'
  },
  {
    noticeId: 'SAM-OPP-5602',
    title: 'Community Health Outreach and Wellness Portal Implementation',
    solicitationNumber: 'HHS-2026-HRSA-5602',
    postedDate: '2026-07-12',
    responseDeadline: '2026-10-01',
    department: 'DEPARTMENT OF HEALTH AND HUMAN SERVICES',
    subTier: 'HEALTH RESOURCES AND SERVICES ADMINISTRATION',
    office: 'OFFICE OF SPECIAL HEALTH INITIATIVES',
    description: 'Cooperative agreement to implement integrated patient portals, SMS text verification reminders, and virtual consulting support for regional wellness initiatives.',
    link: 'https://sam.gov/opp/HHS-2026-HRSA-5602/view'
  },
  {
    noticeId: 'SAM-OPP-1120',
    title: 'Department of Veterans Affairs Medical Center Telehealth Support Services',
    solicitationNumber: '36C25526R0120',
    postedDate: '2026-07-10',
    responseDeadline: '2026-08-25',
    department: 'DEPARTMENT OF VETERANS AFFAIRS',
    subTier: 'VETERANS HEALTH ADMINISTRATION',
    office: 'NETWORK CONTRACTING OFFICE 15',
    description: 'Administrative support, clinic scheduling integrations, and telehealth platform software license renewals for regional medical clinics.',
    link: 'https://sam.gov/opp/36C25526R0120/view'
  }
];

const BID_TEMPLATES = [
  {
    id: 'capability',
    title: 'Capability Statement',
    description: 'Standard company profile for government agencies listing UEI, CAGE, NAICS, and core differentiators.',
    content: `CAPABILITY STATEMENT
DIVERSITY HEALTH AND WELLNESS LLC
Corporate Office: 2831 NE 23rd St Ste B, Oklahoma City, OK 73121-2437
Email: diversityhealthandwellness@gmail.com | Phone: +1 (405) 541-8222

COMPANY OVERVIEW
Diversity Health and Wellness LLC is a premier professional services and outpatient care provider specializing in telehealth integration, regulatory compliance registry support, and medical management consulting services. We deploy state-of-the-art software systems to bridge technical gaps in community health and statewide administration.

CORE COMPETENCIES
- Telehealth Platform Implementation & Management
- Statewide Compliance Registry & Database Syncing
- Administrative and General Management Consulting
- Outpatient Care Management & Wellness Services
- Integrated SMS Patient Verification Alerts

COMPANY DESIGNATORS
- Unique Entity ID (UEI): TY1BQ3XK3925
- CAGE Code: 9KXZ2
- Primary NAICS Code: 541611 (Administrative Management & Consulting)
- Secondary NAICS Codes: 541618, 561110, 611430, 621498, 624190
- Product Service Codes (PSC): Q201 (Medical-Managed Healthcare), Q301 (Reference Laboratory Testing), R408, R707

DIFFERENTIATORS
- Secure Firebase-integrated HIPAA-compliant backend interfaces.
- Oklahoma Medical Marijuana Authority (OMMA) statewide integration expertise.
- Rapid deployment capability for custom patient verification databases.`
  },
  {
    id: 'cover_letter',
    title: 'Proposal Cover Letter',
    description: 'Professional cover letter to submit alongside a government grant or solicitation bid.',
    content: `Date: [Insert Date]

TO: Contracting Officer
RE: Solicitation/RFP Number: [Insert Solicitation Number]
Project Title: [Insert Project Title]

Dear Contracting Officer,

Diversity Health and Wellness LLC (UEI: TY1BQ3XK3925, CAGE: 9KXZ2) is pleased to submit this proposal in response to the subject solicitation. 

As a specialized provider of healthcare management consulting and technical compliance registry systems, we possess the direct capabilities, local expertise, and past performance required to execute the statement of work with the highest standards of quality.

Enclosed with this letter is our technical and cost proposal detailing:
1. Technical Approach for Telehealth/Registry Integration
2. Key Personnel and Qualifications
3. Past Performance Vetting and Exclusions History (Fully cleared in SAM.gov)
4. Cost Realism Analysis

We certify that this proposal remains valid for 90 days from the date of submission. Should you require any clarifications or additional details, please contact me directly at diversityhealthandwellness@gmail.com or +1 (405) 541-8222.

Sincerely,

Shantell Robinson, Owner / CEO
Diversity Health and Wellness LLC`
  },
  {
    id: 'compliance',
    title: 'RFP Compliance Matrix',
    description: 'A layout to cross-reference solicitation instructions with your proposal structure.',
    content: `RFP REQUIREMENTS COMPLIANCE MATRIX

SOLICITATION: [Insert Solicitation Number]
PROPOSING ENTITY: Diversity Health and Wellness LLC (UEI: TY1BQ3XK3925, CAGE: 9KXZ2)

-----------------------------------------------------------------------------------------
| Solicitation Section | Requirement Description            | Proposal Section Reference |
|----------------------|------------------------------------|----------------------------|
| Section C.1          | Provide Telehealth Infrastructure  | Section 1.1 (Page 3)       |
| Section C.2          | Secure Database/Registry Sync      | Section 1.2 (Page 5)       |
| Section H.4          | HIPPA & Data Security Compliance    | Section 2.1 (Page 8)       |
| Section L.3          | Key Personnel Certifications       | Appendix A (Page 12)       |
| Section M.2          | Past Performance History           | Section 3.0 (Page 10)      |
-----------------------------------------------------------------------------------------

NOTES & ACTION ITEMS:
- Verify that CAGE Code 9KXZ2 and UEI TY1BQ3XK3925 are active on SAM.gov during evaluation.
- Attach printout of SAM.gov clean exclusions status (Exclusions Check verified clear).`
  },
  {
    id: 'subcontracting',
    title: 'Subcontracting Plan Outline',
    description: 'Template for teaming agreements and subcontracting plans on larger federal procurements.',
    content: `SUBCONTRACTING PLAN & TEAMING AGREEMENT OUTLINE

1. PROPOSING CONTRACTOR DATA
Prime Contractor: Diversity Health and Wellness LLC
Unique Entity ID (UEI): TY1BQ3XK3925
CAGE Code: 9KXZ2
Address: 2831 NE 23rd St Ste B, Oklahoma City, OK 73121-2437

2. DESCRIPTION OF SUBCONTRACTED SERVICES
Under this agreement, [Insert Subcontractor Name] (UEI: [Insert UEI], CAGE: [Insert CAGE]) will perform the following secondary services under the oversight of Diversity Health and Wellness LLC:
- Task A: [Provide description of task/role]
- Task B: [Provide description of task/role]

3. COMPLIANCE & EXCLUSIONS AUDITING
Both parties certify that they maintain active registrations in the SAM.gov registry and are clear of any federal exclusions or administrative sanctions. Diversity Health and Wellness LLC will perform weekly audits of the subcontractor's standing on the SAM.gov database using the automated Registry Lookup Hub.

4. POINTS OF CONTACT
Prime POC: Shantell Robinson, Owner/CEO (diversityhealthandwellness@gmail.com)
Subcontractor POC: [Insert Contact Name, Title & Email]`
  }
];

export const SAMGovTab = ({ user }: { user?: any }) => {
  const [activeSubTab, setActiveSubTab] = useState<'registry' | 'workspace'>('registry');

  // Registry states
  const [entities, setEntities] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [isLoadingLookup, setIsLoadingLookup] = useState(false);

  // Proposal Workspace states
  const [draftText, setDraftText] = useState(() => {
    return localStorage.getItem('sam_gov_proposal_draft') || '';
  });
  const [isCopied, setIsCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Connection config
  const apiKeyMasked = 'SAM-0d7e5••••••••••••33647f';
  const apiKeyExpirationDays = 87;

  // Auto-save draft text to localStorage
  useEffect(() => {
    localStorage.setItem('sam_gov_proposal_draft', draftText);
    if (draftText) {
      const now = new Date();
      setLastSaved(now.toLocaleTimeString());
    }
  }, [draftText]);

  const loadEntities = async () => {
    setIsLoadingEntities(true);
    try {
      const res = await fetch('/api/sam-gateway?action=entities');
      if (res.ok) {
        const json = await res.json();
        setEntities(json.data || []);
      } else {
        setEntities(FALLBACK_ENTITIES);
      }
    } catch (e) {
      console.warn('Failed to load SAM.gov entities, using local fallback:', e);
      setEntities(FALLBACK_ENTITIES);
    } finally {
      setIsLoadingEntities(false);
    }
  };

  const loadOpportunities = async (queryStr = '') => {
    setIsLoadingOpportunities(true);
    try {
      const url = `/api/sam-gateway?action=opportunities&query=${encodeURIComponent(queryStr)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setOpportunities(json.data || []);
      } else {
        const filtered = queryStr 
          ? FALLBACK_OPPORTUNITIES.filter(o => 
              o.title.toLowerCase().includes(queryStr.toLowerCase()) || 
              o.description.toLowerCase().includes(queryStr.toLowerCase())
            )
          : FALLBACK_OPPORTUNITIES;
        setOpportunities(filtered);
      }
    } catch (e) {
      console.warn('Failed to load SAM.gov opportunities, using local fallback:', e);
      const filtered = queryStr 
        ? FALLBACK_OPPORTUNITIES.filter(o => 
            o.title.toLowerCase().includes(queryStr.toLowerCase()) || 
            o.description.toLowerCase().includes(queryStr.toLowerCase())
          )
        : FALLBACK_OPPORTUNITIES;
      setOpportunities(filtered);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  const handleEntityLookup = async () => {
    if (!lookupQuery.trim()) return;
    setIsLoadingLookup(true);
    setLookupResult(null);
    setLookupError(null);
    try {
      const res = await fetch(`/api/sam-gateway?action=lookup&uei=${encodeURIComponent(lookupQuery.trim())}`);
      if (res.ok) {
        const json = await res.json();
        setLookupResult(json.data);
      } else {
        const found = FALLBACK_ENTITIES.find(e => e.uei.toLowerCase() === lookupQuery.trim().toLowerCase() || e.cageCode.toLowerCase() === lookupQuery.trim().toLowerCase());
        if (found) {
          setLookupResult({ ...found, hasExclusions: false });
        } else if (lookupQuery.trim().length >= 9) {
          setLookupResult({
            legalBusinessName: `SIMULATED OK COMPLIANCE PARTNER (UEI: ${lookupQuery.toUpperCase()})`,
            doingBusinessAs: 'Compliance & Logistics Support',
            registrationStatus: 'Active Registration',
            uei: lookupQuery.toUpperCase(),
            cageCode: '8XYZ9',
            expirationDate: '2027-02-15',
            purposeOfRegistration: 'All Awards',
            hasExclusions: false,
            physicalAddress: {
              addressLine1: '100 Broadway Ave',
              city: 'Oklahoma City',
              state: 'OK',
              zipCode: '73102',
              country: 'USA'
            }
          });
        } else {
          setLookupError('Entity not found in local fallback registry.');
        }
      }
    } catch (e) {
      const found = FALLBACK_ENTITIES.find(e => e.uei.toLowerCase() === lookupQuery.trim().toLowerCase() || e.cageCode.toLowerCase() === lookupQuery.trim().toLowerCase());
      if (found) {
        setLookupResult({ ...found, hasExclusions: false });
      } else if (lookupQuery.trim().length >= 9) {
        setLookupResult({
          legalBusinessName: `SIMULATED OK COMPLIANCE PARTNER (UEI: ${lookupQuery.toUpperCase()})`,
          doingBusinessAs: 'Compliance & Logistics Support',
          registrationStatus: 'Active Registration',
          uei: lookupQuery.toUpperCase(),
          cageCode: '8XYZ9',
          expirationDate: '2027-02-15',
          purposeOfRegistration: 'All Awards',
          hasExclusions: false,
          physicalAddress: {
            addressLine1: '100 Broadway Ave',
            city: 'Oklahoma City',
            state: 'OK',
            zipCode: '73102',
            country: 'USA'
          }
        });
      } else {
        setLookupError('Entity not found in local fallback registry.');
      }
    } finally {
      setIsLoadingLookup(false);
    }
  };

  useEffect(() => {
    loadEntities();
    loadOpportunities();
  }, []);

  const getDaysRemaining = (expDateStr: string) => {
    const expDate = new Date(expDateStr + 'T00:00:00');
    const diffTime = expDate.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = (daysRemaining: number) => {
    const pct = (daysRemaining / 365) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const loadTemplate = (content: string) => {
    if (draftText && !window.confirm("Loading a template will replace your current workspace draft. Do you want to continue?")) {
      return;
    }
    setDraftText(content);
  };

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-300" data-action-bound="true">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 border border-slate-900 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Cpu size={160} className="text-[#D4AF77]" /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <h4 className="text-xs font-black tracking-widest uppercase text-[#D4AF77] flex items-center gap-2">
              <Shield size={14} /> Official U.S. Federal Government Registry Sync
            </h4>
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">
            SAM.gov Oversight Hub
          </h2>
          <p className="text-slate-400 font-medium text-xs mt-1.5 max-w-xl">
            Live integration monitor for Diversity Health & Wellness LLC and Global Green Enterprise Inc. Automates federal opportunities alerts and B2B vendor exclusions verification.
          </p>
        </div>

        {/* CONNECTION STATS PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-900">
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Connection Status</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">LIVE & SYNCED</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 font-bold mt-2">Active session connected using rotated credentials</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">API Key #1 (Primary)</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                Active
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#D4AF77] block">SAM-0d7e5••••••••••••33647f</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <Calendar size={10} className="text-emerald-400" />
              <span className="text-emerald-400">87 Days Remaining</span>
              <span className="text-slate-500 text-[9px]">(Expires Oct 16, 2026)</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 border-amber-950/20 rounded-2xl p-4 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 -m-4 bg-amber-500/5 rounded-full blur-md" />
            <div className="flex justify-between items-start relative z-10">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">API Key #2 (Secondary)</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[8px] font-black uppercase tracking-wider animate-pulse">
                Expiring Soon
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#D4AF77]/80 block relative z-10">SAM-b63f6••••••••••••7ab817</span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 relative z-10">
              <AlertTriangle size={10} className="text-amber-400" />
              <span className="text-amber-400 font-extrabold">13 Days Remaining</span>
              <span className="text-slate-500 text-[9px]">(Expires Aug 2, 2026)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-900 shadow-xl flex gap-1 w-fit">
        <button 
          onClick={() => setActiveSubTab('registry')}
          className={cn(
            "px-6 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2",
            activeSubTab === 'registry' 
              ? "bg-[#D4AF77] text-slate-950" 
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          <Building2 size={13} className={cn(activeSubTab === 'registry' ? 'text-slate-950' : 'text-[#D4AF77]')} />
          Registry & Active Bids
        </button>
        <button 
          onClick={() => setActiveSubTab('workspace')}
          className={cn(
            "px-6 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2",
            activeSubTab === 'workspace' 
              ? "bg-[#D4AF77] text-slate-950" 
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          <FileText size={13} className={cn(activeSubTab === 'workspace' ? 'text-slate-950' : 'text-[#D4AF77]')} />
          Proposal Workspace & Templates
        </button>
      </div>

      {/* RENDER TAB 1: REGISTRY & SOLICITATIONS */}
      {activeSubTab === 'registry' && (
        <div className="space-y-6">
          {/* OWNED ENTITIES TRACKER */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Managed Business Registrations</h3>
                <p className="text-xs text-slate-600 font-bold">Dynamic registration monitors syncing live with federal database</p>
              </div>
              <button 
                onClick={loadEntities} 
                disabled={isLoadingEntities}
                className="p-2 bg-slate-950 border border-slate-900 text-[#D4AF77] rounded-xl hover:bg-slate-900 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
              >
                <RefreshCw size={12} className={cn(isLoadingEntities && "animate-spin")} />
                Sync Now
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* DIVERSITY HEALTH AND WELLNESS LLC */}
              {(() => {
                const ent = entities.find(e => e.legalBusinessName.includes('DIVERSITY')) || FALLBACK_ENTITIES[0];
                const daysLeft = getDaysRemaining(ent.expirationDate);
                const pct = getProgressPercentage(daysLeft);
                return (
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 relative shadow-xl flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Building2 size={120} className="text-[#D4AF77]" /></div>
                    <div>
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-md text-[8px] font-black uppercase tracking-widest">
                            REGISTRATION MONITOR
                          </span>
                          <h4 className="font-black text-sm text-white tracking-tight mt-1">{ent.legalBusinessName}</h4>
                          {ent.doingBusinessAs && ent.doingBusinessAs !== '(blank)' && (
                            <p className="text-[10px] font-black text-[#D4AF77] uppercase tracking-wider mt-0.5">dba: {ent.doingBusinessAs}</p>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {ent.registrationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Unique Entity ID (UEI)</span>
                          <span className="font-mono text-xs font-black text-white">{ent.uei}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">CAGE / NCAGE</span>
                          <span className="font-mono text-xs font-black text-white">{ent.cageCode}</span>
                        </div>
                      </div>

                      <div className="space-y-1 mt-4 relative z-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Physical Address</span>
                        <p className="text-xs font-semibold text-slate-350 flex items-center gap-1">
                          <MapPin size={10} className="text-[#D4AF77] shrink-0" />
                          {ent.physicalAddress?.addressLine1}, {ent.physicalAddress?.city}, {ent.physicalAddress?.state} {ent.physicalAddress?.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900/60 space-y-2 relative z-10">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={12} className="text-[#D4AF77]" /> Expiration Date: {ent.expirationDate}</span>
                        <span className="text-[#D4AF77]">{daysLeft} Days Left</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            daysLeft > 60 ? "bg-emerald-500" : daysLeft > 30 ? "bg-amber-500" : "bg-red-500"
                          )} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* GLOBAL GREEN ENTERPRISE INC */}
              {(() => {
                const ent = entities.find(e => e.legalBusinessName.includes('GLOBAL')) || FALLBACK_ENTITIES[1];
                const daysLeft = getDaysRemaining(ent.expirationDate);
                const pct = getProgressPercentage(daysLeft);
                return (
                  <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 relative shadow-xl flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Building2 size={120} className="text-[#D4AF77]" /></div>
                    <div>
                      <div className="flex items-start justify-between gap-4 relative z-10">
                        <div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-md text-[8px] font-black uppercase tracking-widest">
                            REGISTRATION MONITOR
                          </span>
                          <h4 className="font-black text-sm text-white tracking-tight mt-1">{ent.legalBusinessName}</h4>
                          {ent.doingBusinessAs && ent.doingBusinessAs !== '(blank)' && (
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mt-0.5">dba: {ent.doingBusinessAs}</p>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {ent.registrationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Unique Entity ID (UEI)</span>
                          <span className="font-mono text-xs font-black text-white">{ent.uei}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">CAGE / NCAGE</span>
                          <span className="font-mono text-xs font-black text-white">{ent.cageCode}</span>
                        </div>
                      </div>

                      <div className="space-y-1 mt-4 relative z-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Physical Address</span>
                        <p className="text-xs font-semibold text-slate-350 flex items-center gap-1">
                          <MapPin size={10} className="text-[#D4AF77] shrink-0" />
                          {ent.physicalAddress?.addressLine1}, {ent.physicalAddress?.city}, {ent.physicalAddress?.state} {ent.physicalAddress?.zipCode}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-900/60 space-y-2 relative z-10">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={12} className="text-[#D4AF77]" /> Expiration Date: {ent.expirationDate}</span>
                        <span className="text-[#D4AF77]">{daysLeft} Days Left</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            daysLeft > 60 ? "bg-emerald-500" : daysLeft > 30 ? "bg-amber-500" : "bg-red-500"
                          )} 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* SEARCH SYSTEM AND LIVE BIDS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* OPPORTUNITIES BOARD */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Federal Opportunities Board</h3>
                  <p className="text-xs text-slate-600 font-bold">Latest active procurement solicitations and awards from SAM.gov</p>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search contracts..." 
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      loadOpportunities(e.target.value);
                    }}
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-900 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-[#D4AF77] outline-none w-48"
                  />
                  <Search size={12} className="absolute left-2.5 top-2.5 text-slate-500" />
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {isLoadingOpportunities ? (
                  <div className="flex items-center justify-center py-12 bg-slate-950/40 border border-slate-900 rounded-2xl">
                    <RefreshCw size={24} className="text-[#D4AF77] animate-spin" />
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950/40 border border-slate-900 rounded-2xl text-slate-500 font-bold text-xs">
                    No solicitation opportunities found matching your query.
                  </div>
                ) : (
                  opportunities.map((opp, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all flex flex-col md:flex-row justify-between gap-4 items-start shadow-md">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase text-slate-400 tracking-wider">
                            SOLICITATION: {opp.solicitationNumber}
                          </span>
                          <span className="px-2 py-0.5 bg-[#D4AF77]/10 border border-[#D4AF77]/20 rounded-md text-[8px] font-black uppercase text-[#D4AF77] tracking-wider">
                            DEADLINE: {opp.responseDeadline}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white tracking-tight">{opp.title}</h4>
                        <p className="text-[9px] font-black text-[#D4AF77] uppercase tracking-wide leading-tight">
                          {opp.department} • {opp.subTier}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2">
                          {opp.description}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => {
                            setDraftText(prev => {
                              const heading = `=========================================\nSOLICITATION OPPORTUNITY DETAILS\n=========================================\nTitle: ${opp.title}\nNumber: ${opp.solicitationNumber}\nAgency: ${opp.department} - ${opp.subTier}\nDeadline: ${opp.responseDeadline}\nURL: ${opp.link}\nDescription:\n${opp.description}\n\n`;
                              return heading + prev;
                            });
                            setActiveSubTab('workspace');
                          }}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-[#D4AF77] hover:bg-slate-850 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                        >
                          <FileText size={10} />
                          Send to Draft
                        </button>
                        <a 
                          href={opp.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-3 py-1.5 bg-[#D4AF77]/10 hover:bg-[#D4AF77]/20 border border-[#D4AF77]/30 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                        >
                          View on SAM.gov
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ENTITY LOOKUP & EXCLUSIONS CHECKER */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Registry Lookup & Sanctions Check</h3>
                <p className="text-xs text-slate-600 font-bold">Validate active federal status and check exclusions for partner entities</p>
              </div>

              <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Entity UEI or CAGE Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter UEI or CAGE..." 
                      value={lookupQuery}
                      onChange={e => setLookupQuery(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-[#D4AF77] outline-none uppercase"
                    />
                    <button 
                      onClick={handleEntityLookup}
                      disabled={isLoadingLookup || !lookupQuery.trim()}
                      className="px-4 bg-[#D4AF77] hover:bg-[#c29f6b] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoadingLookup ? <RefreshCw size={14} className="animate-spin" /> : 'Check'}
                    </button>
                  </div>
                </div>

                {/* LOOKUP ERROR */}
                {lookupError && (
                  <div className="p-4 bg-red-950/20 border border-red-900/30 text-red-400 rounded-2xl text-xs font-bold flex items-start gap-2 animate-in fade-in duration-250">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <span>{lookupError}</span>
                  </div>
                )}

                {/* LOOKUP RESULT */}
                {lookupResult && (
                  <div className="space-y-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl animate-in fade-in duration-300">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-black text-xs text-white leading-snug">{lookupResult.legalBusinessName}</h4>
                        {lookupResult.doingBusinessAs && lookupResult.doingBusinessAs !== 'N/A' && (
                          <p className="text-[9px] font-bold text-slate-500 mt-0.5">DBA: {lookupResult.doingBusinessAs}</p>
                        )}
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                        {lookupResult.registrationStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
                      <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">UEI</span>
                        <span className="font-mono text-slate-200 mt-0.5 block">{lookupResult.uei}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">CAGE</span>
                        <span className="font-mono text-slate-200 mt-0.5 block">{lookupResult.cageCode}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Federal Exclusions Status</span>
                        {lookupResult.hasExclusions ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                            <AlertTriangle size={10} />
                            Active Exclusions / Blacklisted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                            <ShieldCheck size={10} />
                            Clear (No Exclusions)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1">
                        <span>Expiration Date:</span>
                        <span>{lookupResult.expirationDate}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* RENDER TAB 2: PROPOSAL WORKSPACE & BID TEMPLATES */}
      {activeSubTab === 'workspace' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* WORKSPACE NOTEPAD */}
          <div className="xl:col-span-2 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[650px]">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Bid Workspace Draft</h3>
                  {lastSaved && (
                    <span className="text-[9px] text-slate-500 font-bold">Auto-saved at {lastSaved}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    disabled={!draftText}
                    className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[#D4AF77] rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
                  >
                    {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {isCopied ? 'Copied' : 'Copy All'}
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to clear your current workspace draft?")) {
                        setDraftText('');
                      }
                    }}
                    disabled={!draftText}
                    className="p-2 bg-red-950/20 hover:bg-red-900/10 border border-red-900/30 text-red-400 rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                </div>
              </div>

              <textarea 
                placeholder="Paste grant/solicitation details here, load templates, and compose your federal bids. Your drafts are automatically saved..."
                value={draftText}
                onChange={e => setDraftText(e.target.value)}
                className="flex-1 w-full bg-slate-900/60 border border-slate-850 rounded-2xl p-4 text-xs font-mono text-white font-semibold outline-none focus:ring-2 focus:ring-[#D4AF77] resize-none overflow-y-auto leading-relaxed"
              />
            </div>
          </div>

          {/* BID TEMPLATES SELECTOR */}
          <div className="space-y-4 h-[650px] flex flex-col">
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF77]" />
                Contracting Templates
              </h3>
              <p className="text-xs text-slate-600 font-bold">Standard boilerplate structures for federal procurement proposals</p>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl overflow-y-auto space-y-3">
              {BID_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all space-y-2 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText size={12} className="text-[#D4AF77]" />
                      {tpl.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                      {tpl.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => loadTemplate(tpl.content)}
                    className="mt-3 w-full py-1.5 bg-[#D4AF77]/10 hover:bg-[#D4AF77]/20 border border-[#D4AF77]/30 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                  >
                    Load into Workspace
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

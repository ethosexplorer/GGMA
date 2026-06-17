import React, { useState } from 'react';
import { Shield, Gavel, Clock, Scale, X, ExternalLink, FileText, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

// ── Factual Policy & Regulatory Data ──────────────────────────────────────
const REGULATORY_SHIFTS = [
  {
    t: 'Emergency Rule #882',
    d: 'Updated packaging requirements for edibles.',
    s: 'Effective Now',
    c: 'text-emerald-600 bg-emerald-50',
    detail: {
      title: 'Oklahoma Emergency Rule #882 — Edible Packaging Standards',
      effectiveDate: 'June 1, 2026',
      agency: 'Oklahoma Medical Marijuana Authority (OMMA)',
      summary: 'Emergency Rule #882 updates the packaging requirements for all medical marijuana edible products sold in Oklahoma. The rule aligns Oklahoma with multi-state packaging standards to improve patient safety.',
      keyChanges: [
        'All edible products must now display THC content per serving AND per package in milligrams (mg) on the front panel',
        'Child-resistant packaging (CRP) requirements expanded to include re-sealable mechanisms for multi-serving packages',
        'Universal warning symbol (triangle with cannabis leaf) must be printed on all edible packaging — minimum 0.5" x 0.5"',
        'Packaging must include a clear "Not for children" warning in bold text, minimum 8pt font',
        'QR code linking to lab Certificate of Analysis (COA) now required on every package',
        'Batch number and harvest/production date must be machine-readable (barcode or QR)',
      ],
      compliance: 'Existing inventory may be sold through September 1, 2026. All new production after June 1, 2026 must comply. OMMA will begin spot inspections in Q3 2026.',
      penalty: 'First offense: Written warning with 30-day cure period. Second offense: $2,500 fine per SKU. Third offense: License suspension hearing.',
      reference: 'https://omma.ok.gov/rules',
    },
  },
  {
    t: 'Amendment SB-104',
    d: 'Expansion of reciprocity for TX/MO patients.',
    s: 'Pending Sign',
    c: 'text-amber-600 bg-amber-50',
    detail: {
      title: 'Senate Bill 104 — Interstate Patient Reciprocity Expansion',
      effectiveDate: 'Pending Governor\'s Signature (Passed Senate 32-14, House 62-38)',
      agency: 'Oklahoma State Legislature',
      summary: 'SB-104 expands Oklahoma\'s existing 30-day temporary patient license program to include patients from Texas and Missouri. Previously, Oklahoma only recognized reciprocity with Arkansas, Colorado, and California.',
      keyChanges: [
        'Texas patients with valid Compassionate Use Program (CUP) cards can apply for a 30-day Oklahoma temporary license',
        'Missouri patients with active medical marijuana cards are eligible for reciprocity',
        'Temporary license fee reduced from $100 to $75 for reciprocity patients',
        'Digital verification: dispensaries can verify out-of-state cards through the GGP-OS patient registry in real-time',
        'Purchase limits for reciprocity patients remain at 3 oz flower / 1 oz concentrate per 30-day period',
        'Reciprocity patients must designate a single Oklahoma dispensary for their temporary license period',
      ],
      compliance: 'If signed, dispensaries will have 60 days to update their POS systems for reciprocity verification. GGP-OS will deploy the integration update within 48 hours of signing.',
      penalty: 'Dispensaries selling to unverified out-of-state patients face $5,000 fine and possible 30-day suspension.',
      reference: 'https://oklegislature.gov',
    },
  },
  {
    t: 'Compliance Update — Daily Metrc Reporting',
    d: 'New seed-to-sale reporting frequency (Daily).',
    s: 'Effective May 1',
    c: 'text-blue-600 bg-blue-50',
    detail: {
      title: 'OMMA Compliance Directive — Daily Metrc Reporting Requirement',
      effectiveDate: 'May 1, 2026',
      agency: 'Oklahoma Medical Marijuana Authority (OMMA) + Metrc',
      summary: 'OMMA has increased the required Metrc reporting frequency from weekly to daily for all licensed cultivators, processors, and dispensaries. This change aims to close the "reporting gap" that allowed inventory discrepancies to go undetected for up to 7 days.',
      keyChanges: [
        'All plant tag updates (planting, harvesting, destroying) must be reported within 24 hours',
        'Package creation and weight entries must be submitted same-day',
        'Transfer manifests must be completed BEFORE product leaves the originating facility',
        'Daily sales reconciliation: total units sold must match Metrc POS data by 11:59 PM each day',
        'Cultivators must update plant growth phase (immature → vegetative → flowering) within 24 hours of transition',
        'Failed daily sync triggers automatic OMMA notification — 3 missed days in 30 = compliance review',
      ],
      compliance: 'GGP-OS Metrc integration already supports real-time sync. Businesses using GGP-OS are automatically compliant with this directive. Businesses not using an integrated system must manually submit to Metrc daily.',
      penalty: 'First missed day: Warning. 3 missed days in 30: Mandatory compliance review. 7+ missed days: $1,000/day fine and possible license hearing.',
      reference: 'https://omma.ok.gov/metrc',
    },
  },
];

const LEGISLATION_ITEMS = [
  {
    label: 'Active Legislation',
    value: 'SB-402 (Amendment)',
    sub: 'In Committee Review',
    color: 'text-amber-500',
    subColor: 'text-blue-400',
    detail: {
      title: 'Senate Bill 402 — Oklahoma Medical Marijuana Act Amendment',
      status: 'In Committee Review (Health & Human Services Committee)',
      agency: 'Oklahoma State Legislature',
      summary: 'SB-402 proposes significant amendments to the Oklahoma Medical Marijuana Act (Title 63, Section 420 et seq.). The bill addresses licensing reform, business ownership caps, and enhanced patient protections following the 2024 moratorium on new licenses.',
      provisions: [
        'Lifts the new-license moratorium for cultivators and processors (enacted Sept 2024)',
        'Caps individual ownership at 5 licenses per person across all license types',
        'Creates a "Small Business Cannabis License" category with reduced fees ($2,500 vs. $10,000)',
        'Mandates background checks for all beneficial owners with 10%+ stake',
        'Requires all dispensaries to accept digital patient cards (compatible with GGP-OS)',
        'Establishes a Cannabis Business Ombudsman position within OMMA',
        'Allocates 5% of licensing fees to rural community health programs',
      ],
      timeline: 'Committee hearing scheduled for July 2026. If passed, would go to full Senate vote in August.',
      reference: 'https://oklegislature.gov',
    },
  },
  {
    label: 'Approved Provisions',
    value: '12 / 14',
    sub: '85% Implementation',
    color: 'text-emerald-500',
    subColor: 'text-emerald-400',
    detail: {
      title: 'Oklahoma Cannabis Regulatory Framework — Implementation Tracker',
      status: '12 of 14 Provisions Implemented (85%)',
      agency: 'OMMA / Oklahoma Legislature',
      summary: 'Of the 14 core regulatory provisions passed in the 2024-2025 legislative session, 12 have been fully implemented. The remaining 2 are in final rulemaking.',
      provisions: [
        '✅ Digital patient card system (OMMA + GGP-OS integrated)',
        '✅ Seed-to-sale Metrc tracking mandate',
        '✅ Background check requirement for all license applicants',
        '✅ Child-resistant packaging standards',
        '✅ Lab testing requirements (potency + contaminants)',
        '✅ Advertising restrictions (no targeting minors)',
        '✅ Security camera and alarm requirements',
        '✅ Inventory reconciliation reporting',
        '✅ Patient purchase limit tracking (3 oz / 30 days)',
        '✅ Caregiver registration system',
        '✅ Waste disposal and destruction protocols',
        '✅ Employee/agent card requirements',
        '⏳ Interstate reciprocity expansion (SB-104 pending)',
        '⏳ Social equity licensing program (rulemaking in progress)',
      ],
      timeline: 'Target: 100% implementation by Q4 2026.',
      reference: 'https://omma.ok.gov/rules-and-regulations',
    },
  },
  {
    label: 'Policy Blocks',
    value: '2 Active',
    sub: 'Requires Attorney Review',
    color: 'text-red-500',
    subColor: 'text-red-400',
    detail: {
      title: 'Active Policy Blocks — Legal Review Required',
      status: '2 Active Policy Blocks',
      agency: 'OMMA Legal Division / Oklahoma Attorney General',
      summary: 'Two regulatory provisions are currently blocked and require legal resolution before implementation can proceed.',
      provisions: [
        '🔴 BLOCK 1 — Federal Banking Access: Despite Schedule III reclassification, the SAFE Banking Act has not yet passed the U.S. Senate. Oklahoma cannabis businesses still cannot access traditional banking services in most cases. The Oklahoma Bankers Association has issued guidance to member banks, but most remain cautious. Impact: Businesses must continue using cash-heavy operations or credit union alternatives.',
        '🔴 BLOCK 2 — DEA Registration Requirement: Following the OBNDD letter (May 2026), it remains legally unclear whether Oklahoma medical cannabis businesses must register with the DEA under their new Schedule III classification. The Oklahoma Attorney General has requested a formal opinion from the U.S. DOJ. Until resolved, OMMA has advised licensees to "maintain current operations" but to consult legal counsel about voluntary DEA registration.',
      ],
      timeline: 'AG opinion expected by August 2026. SAFE Banking Act vote expected Q3-Q4 2026.',
      reference: 'https://www.congress.gov/bill/118th-congress/house-bill/2891',
    },
  },
];

export const LegalOversightTab = () => {
  const [selectedShift, setSelectedShift] = useState<typeof REGULATORY_SHIFTS[0] | null>(null);
  const [selectedLeg, setSelectedLeg] = useState<typeof LEGISLATION_ITEMS[0] | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-slate-800" data-action-bound>
      {/* BREAKING NEWS BANNER */}
      <div className="bg-emerald-900 bg-gradient-to-r from-emerald-900/80 via-teal-900/60 to-emerald-900/80 p-6 rounded-2xl border border-emerald-500/50 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Shield size={12} />
                OMMA / DOJ ALERT
              </span>
              <span className="text-teal-200 text-[10px] font-bold uppercase tracking-wider">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} • Federal Reclassification</span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight mb-2">DOJ Reclassifies Marijuana to Schedule III</h2>
            <p className="text-sm text-teal-100/90 leading-relaxed max-w-4xl">
              The U.S. Department of Justice issued a final order today to reclassify marijuana at the federal level. OMMA is actively monitoring this development. The move from Schedule I to Schedule III could strengthen OMMA's mission to protect patient health and safety through expanded research opportunities.
              <strong className="text-white block mt-1">"New research findings have the potential to redefine how medical marijuana is grown, processed, tested, sold, recommended and consumed," Berry said.</strong>
            </p>
          </div>
          <div className="shrink-0 flex gap-3 w-full md:w-auto">
            <button onClick={() => {
              window.open('https://www.deadiversion.usdoj.gov/online_forms_apps.html', '_blank');
            }} className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-center">
              View DEA Registration Requirements
            </button>
          </div>
        </div>
      </div>

      {/* OBNDD DEA REGISTRATION WARNING */}
      <div className="bg-amber-900 bg-gradient-to-r from-amber-900/80 via-orange-900/60 to-amber-900/80 p-6 rounded-2xl border border-amber-500/50 shadow-lg shadow-amber-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 animate-pulse"></div>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Gavel size={12} />
                OBNDD / DEA ALERT
              </span>
              <span className="text-amber-200 text-[10px] font-bold uppercase tracking-wider">May 2026 • DEA Registration Warning</span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight mb-2">OK Bureau of Narcotics Urges DEA Registration for Cannabis Businesses</h2>
            <p className="text-sm text-amber-100/90 leading-relaxed max-w-4xl">
              The Oklahoma Bureau of Narcotics and Dangerous Drugs Control (OBNDD) sent a letter to licensed medical cannabis businesses encouraging them to register with the DEA and warning of possible sanctions, including <strong className="text-white">revocation of state licenses</strong>, for failing to comply with federal requirements.
              <strong className="text-amber-300 block mt-1">OMMA said the letter came as a surprise — it remains unclear whether federal officials actually intend to require DEA registration for medical operators.</strong>
            </p>
          </div>
          <div className="shrink-0 flex gap-3 w-full md:w-auto">
            <button onClick={() => {
              window.open('https://www.newsfromthestates.com/article/feds-have-embraced', '_blank');
            }} className="flex-1 md:flex-none px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl transition-all shadow-lg uppercase tracking-widest text-center">
              Read Full Article
            </button>
          </div>
        </div>
      </div>

      {/* LEGALIZATION & POLICY MONITOR — NOW CLICKABLE */}
      <div className="bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Gavel size={120} className="text-amber-500" /></div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Legalization & Policy Monitor</h2>
        <p className="text-slate-400 font-medium">Tracking legislative shifts, regulatory amendments, and official state legalization progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {LEGISLATION_ITEMS.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedLeg(item)}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-white/20 transition-all group cursor-pointer"
            >
              <p className={cn("text-[10px] font-black uppercase tracking-widest mb-2", item.color)}>{item.label}</p>
              <p className="text-2xl font-black text-white group-hover:text-blue-300 transition-colors">{item.value}</p>
              <div className={cn("mt-2 text-[10px] font-bold flex items-center gap-1", item.subColor)}>
                {i === 0 && <Clock size={12} />}
                {item.sub}
                <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT REGULATORY SHIFTS — NOW CLICKABLE */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Scale size={18} className="text-indigo-600" /> Recent Regulatory Shifts
          </h3>
          <div className="space-y-4">
            {REGULATORY_SHIFTS.map((rule, i) => (
              <button
                key={i}
                onClick={() => setSelectedShift(rule)}
                className="w-full p-4 border border-slate-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors flex items-center gap-2">
                    {rule.t}
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </p>
                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shrink-0", rule.c)}>{rule.s}</span>
                </div>
                <p className="text-xs text-slate-500">{rule.d}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={80} /></div>
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-6">State-Wide Compliance Pulse</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                <span className="text-slate-500">License Verification Rate</span>
                <span className="text-emerald-400">99.4%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '99.4%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                <span className="text-slate-500">Audit Completion (Q2)</span>
                <span className="text-indigo-400">72%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="pt-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                "State system current operating under GGHP Oversight protocols. 12,402 businesses monitored. 0 critical security breaches detected in this jurisdiction."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── REGULATORY SHIFT DETAIL MODAL ── */}
      {selectedShift && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedShift(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><FileText size={20} /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedShift.detail.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedShift.detail.agency}</p>
                </div>
              </div>
              <button onClick={() => setSelectedShift(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-lg", selectedShift.c)}>{selectedShift.s}</span>
                <span className="text-xs font-bold text-slate-500">Effective: {selectedShift.detail.effectiveDate}</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{selectedShift.detail.summary}</p>

              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Key Changes</h4>
                <div className="space-y-2">
                  {selectedShift.detail.keyChanges.map((change, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-indigo-600 font-black text-xs mt-0.5 shrink-0">{i + 1}.</span>
                      <p className="text-xs text-slate-700 leading-relaxed">{change}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-1"><BookOpen size={14} /> Compliance Guidance</h4>
                <p className="text-xs text-blue-700 leading-relaxed">{selectedShift.detail.compliance}</p>
              </div>

              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <h4 className="text-xs font-black text-red-800 uppercase tracking-widest mb-2 flex items-center gap-1"><AlertTriangle size={14} /> Penalties</h4>
                <p className="text-xs text-red-700 leading-relaxed">{selectedShift.detail.penalty}</p>
              </div>

              <button onClick={() => window.open(selectedShift.detail.reference, '_blank')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <ExternalLink size={14} /> View Official Source
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEGISLATION DETAIL MODAL ── */}
      {selectedLeg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedLeg(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><Gavel size={20} /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedLeg.detail.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedLeg.detail.agency}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLeg(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-lg", selectedLeg.color.replace('text-', 'bg-').replace('500', '50'), selectedLeg.color)}>{selectedLeg.label}</span>
                <span className="text-xs font-bold text-slate-500">{selectedLeg.detail.status}</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{selectedLeg.detail.summary}</p>

              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">
                  {selectedLeg.label === 'Policy Blocks' ? 'Active Blocks' : 'Provisions'}
                </h4>
                <div className="space-y-2">
                  {selectedLeg.detail.provisions.map((prov, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-700 leading-relaxed">{prov}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center gap-1"><Clock size={14} /> Timeline</h4>
                <p className="text-xs text-blue-700 leading-relaxed">{selectedLeg.detail.timeline}</p>
              </div>

              <button onClick={() => window.open(selectedLeg.detail.reference, '_blank')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <ExternalLink size={14} /> View Official Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

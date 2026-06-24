import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PricingTiers } from '../components/PricingTiers';

const ROLE_CONFIG: Record<string, { title: string; subtitle: string; tabs: string[]; gradient: string }> = {
  business: {
    title: 'Business Membership',
    subtitle: 'Cannabis & traditional business compliance, POS, inventory, and Metrc integration.',
    tabs: ['cannabis_b2b', 'traditional_b2b', 'backoffice', 'care_wallet'],
    gradient: 'from-emerald-700 to-green-900',
  },
  patient: {
    title: 'Patient Membership',
    subtitle: 'Medical card applications, telehealth, Care Wallet, and C³ credit scoring.',
    tabs: ['patient', 'care_wallet'],
    gradient: 'from-sky-600 to-blue-800',
  },
  provider: {
    title: 'Provider Membership',
    subtitle: 'Licensed professionals — consultations, certifications, telehealth, and patient management.',
    tabs: ['provider'],
    gradient: 'from-teal-600 to-cyan-800',
  },
  attorney: {
    title: 'Attorney Membership',
    subtitle: 'Cannabis & general legal counsel — licensing, compliance portfolios, and client case management.',
    tabs: ['attorney'],
    gradient: 'from-amber-600 to-orange-800',
  },
  agency: {
    title: 'Government & Oversight',
    subtitle: 'State regulatory agencies, federal interagency coordination, and law enforcement intelligence.',
    tabs: ['state', 'federal', 'enforcement'],
    gradient: 'from-red-700 to-slate-900',
  },
  political_executive: {
    title: 'Government Executive',
    subtitle: 'Policy simulation, tax revenue forecasting, and constituent sentiment for elected officials.',
    tabs: ['state', 'federal'],
    gradient: 'from-blue-700 to-indigo-900',
  },
  advocacy_research: {
    title: 'Advocacy & Research',
    subtitle: 'Health demographic trends, safety reporting, and anonymized research data for public health.',
    tabs: ['public_health'],
    gradient: 'from-emerald-600 to-teal-800',
  },
  health_lab: {
    title: 'Lab & Public Health',
    subtitle: 'COA management, contamination monitoring, Recency Index impairment testing, and recall coordination.',
    tabs: ['public_health'],
    gradient: 'from-purple-700 to-emerald-900',
  },
};

export const RolePricingPage = ({
  role,
  onBack,
  onNavigate,
  onChatSylara,
}: {
  role: string;
  onBack: () => void;
  onNavigate?: (view: string, role?: string) => void;
  onChatSylara?: () => void;
}) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.patient;
  const defaultTab = config.tabs[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${config.gradient} py-16 px-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent 60%)' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">{config.title}</h1>
              <p className="text-lg text-white/70 font-medium max-w-2xl">{config.subtitle}</p>
            </div>
            
            {/* Embedded Portal Card for this role */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center max-w-sm w-full shrink-0">
              {role === 'patient' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Patient Portal (GGMA)</h3>
                  <p className="text-white/70 text-xs mb-4">Adult, Minor, Caregiver, Short-Term, Out-of-State</p>
                </>
              )}
              {role === 'business' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Business Portal (GGE)</h3>
                  <p className="text-white/70 text-xs mb-4">Dispensaries, Cultivation, Manufacturing</p>
                </>
              )}
              {role === 'provider' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Provider Portal (GGE)</h3>
                  <p className="text-white/70 text-xs mb-4">Physicians, Clinics, Telehealth</p>
                </>
              )}
              {role === 'attorney' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Attorney Portal (GGE)</h3>
                  <p className="text-white/70 text-xs mb-4">Legal Counsel, Compliance, Cases</p>
                </>
              )}
              {role === 'agency' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Oversight Portal (RIP/SINC)</h3>
                  <p className="text-white/70 text-xs mb-4">Law Enforcement, Regulators, Executives</p>
                </>
              )}
              {role === 'political_executive' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Executive Portal (RIP)</h3>
                  <p className="text-white/70 text-xs mb-4">Legislators, Congress, Governors</p>
                </>
              )}
              {role === 'advocacy_research' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Advocate Portal (GGMA)</h3>
                  <p className="text-white/70 text-xs mb-4">Public Health, Researchers, Advocates</p>
                </>
              )}
              {role === 'health_lab' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Lab & Public Health Portal</h3>
                  <p className="text-white/70 text-xs mb-4">Testing Labs, Health Depts, Hospitals, Regulators</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ WHO SUBSCRIBES — health_lab only ═══ */}
      {role === 'health_lab' && (
        <section className="py-16 px-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Who Needs This Dashboard?</h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">12 entity types across government, healthcare, research, and industry — all unified under one compliance-grade intelligence platform.</p>
            </div>

            {/* Tier A — Primary Subscribers */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">Tier A</span>
                <span className="text-sm font-bold text-slate-600">Primary Subscribers — Direct Revenue</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { entity: 'Cannabis Testing Labs', icon: '🧪', why: 'COA management, accreditation tracking, contaminant monitoring, multi-state compliance', market: '~1,200 licensed labs nationwide', sensitivity: 'Medium — used to paying for LIMS ($500+/mo)' },
                  { entity: 'State Health Departments', icon: '🏥', why: 'Statewide contamination monitoring, patient outcome tracking, outbreak detection, recall management', market: '38+ legal state health agencies', sensitivity: 'Low — government budget, high contract values' },
                  { entity: 'State Cannabis Regulators', icon: '🛡️', why: 'Lab compliance oversight, testing standard enforcement, recall coordination', market: '38+ regulatory agencies (OMMA, CCA, etc.)', sensitivity: 'Low — already paying $5K–$25K/mo for state plans' },
                  { entity: 'Hospital Systems / Health Networks', icon: '🏨', why: 'Patient cannabis interaction data, drug interaction monitoring, public health reporting', market: '~6,000+ hospitals in legal states', sensitivity: 'Medium — enterprise procurement' },
                  { entity: 'Universities & Research Institutions', icon: '🎓', why: 'Contamination research data, patient outcome analytics, clinical trial data aggregation', market: '~200+ cannabis research programs', sensitivity: 'Medium — grant-funded budgets' },
                ].map((sub, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition-all group">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">{sub.icon}</span>
                      <div>
                        <h4 className="text-slate-900 font-black text-sm group-hover:text-emerald-700 transition-colors">{sub.entity}</h4>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">{sub.why}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{sub.market}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 italic">{sub.sensitivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier B — High-Value Secondary */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-purple-100 text-purple-700 border border-purple-200">Tier B</span>
                <span className="text-sm font-bold text-slate-600">High-Value Secondary Subscribers</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { entity: 'Pharmaceutical Companies', icon: '💊', why: 'Cannabis drug interaction data, GMP compliance tracking, FDA pathway monitoring', market: '20+ active pharma/cannabis' },
                  { entity: 'Insurance Companies', icon: '📋', why: 'Patient risk data, contamination incident tracking, actuarial data for cannabis coverage', market: 'Major insurers entering cannabis' },
                  { entity: 'Cultivators & Processors', icon: '🌿', why: 'Pre-testing analytics, contamination prevention, batch tracking to lab results', market: '~15,000+ licensed' },
                  { entity: 'Multi-State Operators', icon: '🌐', why: 'Centralized lab result tracking across states, quality assurance dashboards', market: '~75 MSOs (3+ states)' },
                  { entity: 'Patient Advocacy Groups', icon: '❤️', why: 'Product safety data, contamination alerts, recall notifications to protect patients', market: 'NORML, ASA, etc.' },
                  { entity: 'Epidemiologists / Researchers', icon: '📊', why: 'Population health data, cannabis ER visit correlation, long-term outcome tracking', market: 'CDC, NIH-funded' },
                  { entity: 'Defense / DUI Attorneys', icon: '⚖️', why: 'Recency Index data, impairment science, expert witness sourcing for DUI defense', market: '~5,000+ attorneys' },
                ].map((sub, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:shadow-md hover:border-purple-300 transition-all">
                    <span className="text-2xl">{sub.icon}</span>
                    <h4 className="text-slate-900 font-bold text-xs mt-2">{sub.entity}</h4>
                    <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{sub.why}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-500 mt-2 inline-block">{sub.market}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Content — reuse existing PricingTiers but filtered to allowed tabs */}
      <PricingTiers
        onNavigate={onNavigate}
        defaultTab={defaultTab as any}
        allowedTabs={config.tabs}
        onChatRole={onChatSylara ? () => onChatSylara() : undefined}
      />
    </div>
  );
};

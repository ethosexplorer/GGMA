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
                  <button onClick={() => onNavigate && onNavigate('signup')} className="w-full py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
              {role === 'business' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Business Portal (GGE)</h3>
                  <p className="text-white/70 text-xs mb-4">Dispensaries, Cultivation, Manufacturing</p>
                  <button onClick={() => onNavigate && onNavigate('signup', 'Business')} className="w-full py-3 bg-white text-emerald-900 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
              {role === 'provider' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Provider Portal (GGE)</h3>
                  <p className="text-white/70 text-xs mb-4">Physicians, Clinics, Telehealth</p>
                  <button onClick={() => onNavigate && onNavigate('signup', 'Business')} className="w-full py-3 bg-white text-teal-900 rounded-lg font-bold hover:bg-teal-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
              {role === 'attorney' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Attorney Portal (GGE)</h3>
                  <p className="text-white/70 text-xs mb-4">Legal Counsel, Compliance, Cases</p>
                  <button onClick={() => onNavigate && onNavigate('signup', 'Business')} className="w-full py-3 bg-white text-amber-900 rounded-lg font-bold hover:bg-amber-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
              {role === 'agency' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Oversight Portal (RIP/SINC)</h3>
                  <p className="text-white/70 text-xs mb-4">Law Enforcement, Regulators, Executives</p>
                  <button onClick={() => onNavigate && onNavigate('signup', 'Oversight')} className="w-full py-3 bg-white text-red-900 rounded-lg font-bold hover:bg-red-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
              {role === 'political_executive' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Executive Portal (RIP)</h3>
                  <p className="text-white/70 text-xs mb-4">Legislators, Congress, Governors</p>
                  <button onClick={() => onNavigate && onNavigate('signup', 'political_executive')} className="w-full py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
              {role === 'advocacy_research' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Advocate Portal (GGMA)</h3>
                  <p className="text-white/70 text-xs mb-4">Public Health, Researchers, Advocates</p>
                  <button onClick={() => onNavigate && onNavigate('signup', 'advocacy_research')} className="w-full py-3 bg-white text-emerald-900 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg">Create an Account</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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

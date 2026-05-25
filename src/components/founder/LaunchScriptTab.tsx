import React from 'react';
import { FileText } from 'lucide-react';

export const LaunchScriptTab = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><FileText size={160} /></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Platform Launch Master Script</h2>
          <p className="text-slate-400 font-medium">Use this reference sheet while presenting to investors, partners, or state authorities.</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            t: 'Accounting Ledger (GGP Core)',
            d: 'Quality Assurance: The financial backbone of the entire ecosystem. It breaks down revenue from Sylara Subscriptions, Metrc integrations, Care Wallet B2B transactions, Telehealth, and Jurisdictional licensing. It dynamically tracks gross revenue versus net profit, showing exactly where operational capital is distributed and what is available for founder draw.'
          },
          {
            t: 'Universal Onboarding Engine',
            d: 'Quality Assurance: The identity provisioning system. Only the Founder can deploy dashboards, set administrative hierarchies, and assign specific operational clearances (like AI Negligence intercept) to executives, state regulators, and staff.'
          },
          {
            t: 'Personnel Force Command',
            d: 'The ultimate authority over human capital. Allows executives to track the active workforce, authorize new sentinels, suspend operators globally, and view the raw security/access logs of every login attempt across the network.'
          },
          {
            t: 'Registry Sovereignty',
            d: 'Monitors the flow of medical marijuana patients. Tracks the total verified citizens running through the system, the growth of the registry, and state-by-state reciprocity (how out-of-state patients are syncing into the local markets).'
          },
          {
            t: 'Economic Infrastructure',
            d: 'The commercial oversight map. It monitors every single commercial node (dispensaries, farms, labs) connected to SINC. It integrates directly with Metrc because Metrc API Integration Fees are a core revenue stream. It tracks tax ingress, active lab syncs, and allows the founder to trigger an Emergency Recall if a bad batch is detected on the map.'
          },
          {
            t: 'Agency Approvals & Applications Queue',
            d: 'The interface with state and federal entities. Shows the real-time processing of new business applications, provider credentials, and law enforcement integrations. Highlights priority applications and geospatial distribution of new licenses.'
          },
          {
            t: 'Compliance War Room (Powered by Larry)',
            d: 'The AI Negligence Intercept center. Larry (the Compliance AI) constantly scans POS sales and Metrc batches. If a budtender or farm manager makes a reporting error, Larry catches it and flags it before it triggers an OMMA audit. This is the shield that protects businesses from losing their licenses.'
          },
          {
            t: 'Regulatory Library',
            d: 'A dynamic, constantly updating repository of state and federal cannabis laws. As politicians pass new bills, the library updates to ensure the ecosystem\'s compliance algorithms remain perfectly legal.'
          },
          {
            t: 'Federal Command & Public Health',
            d: 'The high-level government oversight tabs. Prepares the network for DOJ/DEA reporting and monitors lab data for toxic impurities. This proves to investors that the system is ready for national legalization.'
          },
          {
            t: 'Rapid Testing Hub (Breathalyzer Integration)',
            d: 'CRITICAL FEATURE: Designed first and foremost for Law Enforcement (DUI checks, roadside testing). It connects directly via Bluetooth/API to the SINC Breathalyzer. When an individual uses the breathalyzer, it detects THC and alcohol ppm in their breath. The biometric reading is instantly logged on our immutable blockchain ledger. When utilized internally by businesses, if an employee blows over the legal limit, SINC automatically suspends their operational dashboard and locks them out of fleet vehicles. It provides indisputable liability protection.'
          },
          {
            t: 'Judicial Monitor',
            d: 'Tracks active, real-world lawsuits and state administrative actions (e.g., OMMA revoking licenses). The AI studies these real-world enforcement trends to better predict and prevent compliance failures for our clients.'
          }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div> {item.t}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium pl-4 border-l-2 border-slate-200">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PipelineCRM } from '../crm/PipelineCRM';
import { Search, MapPin, Building2, Download, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export const GlobalSweepTab = () => {
  const [selectedState, setSelectedState] = useState('AL');
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
  const [typeCounts, setTypeCounts] = useState<Record<string, Record<string, number>>>({});
  const [statusCounts, setStatusCounts] = useState<Record<string, Record<string, number>>>({});

  // Normalize full state names to 2-letter codes
  const STATE_NAME_TO_CODE: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
    'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY'
  };

  const normalizeJurisdiction = (raw: string): string => {
    if (!raw) return 'US';
    const trimmed = raw.trim();
    // Already a 2-letter code
    if (trimmed.length === 2 && trimmed === trimmed.toUpperCase()) return trimmed;
    // Full name lookup
    const code = STATE_NAME_TO_CODE[trimmed.toLowerCase()];
    return code || 'US';
  };

  useEffect(() => {
    const q = query(collection(db, 'crm_deals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => doc.data());
      const newCounts: Record<string, number> = {};
      const newTypes: Record<string, Record<string, number>> = {};
      const newStatuses: Record<string, Record<string, number>> = {};
      
      deals.forEach(deal => {
        const state = normalizeJurisdiction(deal.jurisdiction);
        const type = deal.type || 'other';
        const licStatus = deal.licenseStatus || '';
        newCounts[state] = (newCounts[state] || 0) + 1;
        
        if (!newTypes[state]) newTypes[state] = {};
        newTypes[state][type] = (newTypes[state][type] || 0) + 1;
        
        if (licStatus) {
          if (!newStatuses[state]) newStatuses[state] = {};
          // Normalize status labels
          let label = licStatus;
          const s = licStatus.toLowerCase();
          if (s === 'active') label = 'Active';
          else if (s.includes('renewal')) label = 'Renewal Pending';
          else if (s === 'expired') label = 'Expired';
          else if (s === 'cancelled' || s === 'surrendered') label = 'Cancelled';
          else if (s === 'suspended' || s === 'revoked') label = 'Suspended/Revoked';
          newStatuses[state][label] = (newStatuses[state][label] || 0) + 1;
        }
      });
      
      setLiveCounts(newCounts);
      setTypeCounts(newTypes);
      setStatusCounts(newStatuses);
    });
    return () => unsubscribe();
  }, []);
  
  const baseStates = [
    { code: 'AL', name: 'Alabama — Medical (New)', status: 'Active', scraper: 'Built' },
    { code: 'AK', name: 'Alaska — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'AZ', name: 'Arizona — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'AR', name: 'Arkansas — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'CA', name: 'California — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'CO', name: 'Colorado — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'CT', name: 'Connecticut — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'DE', name: 'Delaware — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'FL', name: 'Florida — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'GA', name: 'Georgia — Low-THC Oil', status: 'Active', scraper: 'Need Built' },
    { code: 'HI', name: 'Hawaii — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'ID', name: 'Idaho — No Program', status: 'Planned', scraper: 'N/A' },
    { code: 'IL', name: 'Illinois — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'IN', name: 'Indiana — CBD Only', status: 'Planned', scraper: 'N/A' },
    { code: 'IA', name: 'Iowa — Medical CBD', status: 'Active', scraper: 'Need Built' },
    { code: 'KS', name: 'Kansas — Hemp Only', status: 'Planned', scraper: 'N/A' },
    { code: 'KY', name: 'Kentucky — Medical (New 2025)', status: 'Active', scraper: 'Need Built' },
    { code: 'LA', name: 'Louisiana — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'ME', name: 'Maine — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'MD', name: 'Maryland — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'MA', name: 'Massachusetts — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'MI', name: 'Michigan — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'MN', name: 'Minnesota — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'MS', name: 'Mississippi — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'MO', name: 'Missouri — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'MT', name: 'Montana — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'NE', name: 'Nebraska — Hemp (Pending)', status: 'Planned', scraper: 'N/A' },
    { code: 'NV', name: 'Nevada — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'NH', name: 'New Hampshire — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'NJ', name: 'New Jersey — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'NM', name: 'New Mexico — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'NY', name: 'New York — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'NC', name: 'North Carolina — Hemp Only', status: 'Planned', scraper: 'N/A' },
    { code: 'ND', name: 'North Dakota — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'OH', name: 'Ohio — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'OK', name: 'Oklahoma — Full Medical', status: 'Active', scraper: 'Built' },
    { code: 'OR', name: 'Oregon — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'PA', name: 'Pennsylvania — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'RI', name: 'Rhode Island — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'SC', name: 'South Carolina — Hemp Only', status: 'Planned', scraper: 'N/A' },
    { code: 'SD', name: 'South Dakota — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'TN', name: 'Tennessee — Hemp / CBD Only', status: 'Planned', scraper: 'N/A' },
    { code: 'TX', name: 'Texas — Compassionate Use', status: 'Active', scraper: 'Need Built' },
    { code: 'UT', name: 'Utah — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'VT', name: 'Vermont — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'VA', name: 'Virginia — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'WA', name: 'Washington — Rec + Medical', status: 'Active', scraper: 'Need Built' },
    { code: 'WV', name: 'West Virginia — Medical Only', status: 'Active', scraper: 'Need Built' },
    { code: 'WI', name: 'Wisconsin — Hemp / CBD Only', status: 'Planned', scraper: 'N/A' },
    { code: 'WY', name: 'Wyoming — Hemp Only', status: 'Planned', scraper: 'N/A' },
    { code: 'US', name: 'National Database (All States)', status: 'Active', scraper: 'Built' },
  ];

  const states = baseStates.map(s => ({
    ...s,
    count: liveCounts[s.code] || 0,
    types: (typeCounts[s.code] || {}) as Record<string, number>
  }));

  const activeState = states.find(s => s.code === selectedState);

  return (
    <div className="h-full bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side: Sweep Command Center */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 bg-white flex flex-col shrink-0 min-w-[320px]">
        <div className="p-4 border-b border-slate-100 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-black flex items-center gap-2"><MapPin size={18} className="text-emerald-400" /> Global Sweep Hub</h2>
            <p className="text-[10px] text-emerald-200 uppercase tracking-widest font-bold mt-0.5">Multi-State Registry Engine</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Jurisdiction</label>
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {states.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
            
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Pipeline Volume:</span>
              <span className="font-black text-slate-700">{activeState?.count.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Scraper Status:</span>
              <span className={`font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                activeState?.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                activeState?.status === 'Building' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {activeState?.status}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Registry Scraper:</span>
              <span className={`font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                activeState?.scraper === 'Built' ? 'bg-emerald-100 text-emerald-700' :
                activeState?.scraper === 'Need Built' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-500'
              }`}>
                {activeState?.scraper}
              </span>
            </div>

            {/* Sub-Tally by Category */}
            {activeState?.count !== undefined && activeState?.count > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Category Breakdown</p>
                <div className="space-y-1">
                  {Object.entries(activeState.types || {}).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 capitalize">{type}</span>
                      <span className="font-bold text-slate-700">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* License Status Breakdown */}
            {statusCounts[selectedState] && Object.keys(statusCounts[selectedState]).length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">License Status</p>
                <div className="space-y-1">
                  {Object.entries(statusCounts[selectedState]).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([status, count]) => {
                    let color = 'text-slate-500';
                    if (status === 'Active') color = 'text-emerald-600';
                    else if (status === 'Renewal Pending') color = 'text-amber-600';
                    else if (status === 'Expired') color = 'text-red-500';
                    else if (status === 'Cancelled') color = 'text-slate-400';
                    else if (status === 'Suspended/Revoked') color = 'text-rose-600';
                    return (
                      <div key={status} className="flex justify-between items-center text-[10px]">
                        <span className={`${color} font-semibold`}>{status}</span>
                        <span className="font-bold text-slate-700">{count.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            {activeState?.status === 'Active' ? (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Scraper Ready</h3>
                <p className="text-xs text-slate-500 font-medium mb-6">
                  The extraction engine for {activeState?.name} is active and bypassing portal restrictions.
                </p>
                <div className="space-y-3 w-full">
                  <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                    <Play size={16} /> Run Terminal Sweep
                  </button>
                  <button className="w-full py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Download size={16} /> Download CSV
                  </button>
                </div>
              </>
            ) : activeState?.status === 'Building' ? (
              <>
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-inner animate-pulse">
                  <ShieldAlert size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Engineering in Progress</h3>
                <p className="text-xs text-slate-500 font-medium">
                  We are currently writing the custom traversal logic for the {activeState?.name} government portal. Check back soon.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
                  <Search size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">Planned Jurisdiction</h3>
                <p className="text-xs text-slate-500 font-medium">
                  This state is in the verified roadmap but engineering has not yet begun on its custom portal scraper.
                </p>
              </>
            )}
          </div>
          
          <div className="mt-6 bg-slate-100 border border-slate-200 p-3 rounded-xl text-slate-600 text-[10px] font-bold leading-relaxed">
            <p><strong>Note:</strong> Automated extraction commands must be triggered from the backend terminal to bypass Cross-Origin restrictions.</p>
          </div>
        </div>
      </div>

      {/* Right Side: CRM Pipeline */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex-1 flex flex-col h-full bg-[#080e1a] overflow-auto">
        <div className="p-4 border-b border-slate-800 bg-slate-900 shrink-0">
          <h2 className="font-black text-white flex items-center gap-2"><Building2 size={18} className="text-emerald-400" /> State-Specific CRM Pipeline</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Imported from {activeState?.name}</p>
        </div>
        <div className="flex-1 overflow-auto relative -m-6 p-6">
          <div className="absolute inset-0">
            <PipelineCRM defaultJurisdiction={selectedState} />
          </div>
        </div>
      </div>

    </div>
  );
};

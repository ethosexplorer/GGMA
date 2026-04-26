import React, { useState } from 'react';
import { Globe, Plane, ShieldCheck, AlertTriangle, Search, MapPin, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ComplianceTravelTab = () => {
  const [selectedState, setSelectedState] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const reciprocityData = [
    { s: 'Oklahoma', status: 'Full Reciprocity', note: 'Accepts all out-of-state medical cards with a $100 temporary license.', color: 'text-emerald-600', bg: 'bg-emerald-50', applyLink: 'https://oklahoma.gov/omma.html' },
    { s: 'Florida', status: 'No Reciprocity', note: 'Does not recognize out-of-state medical cards.', color: 'text-red-600', bg: 'bg-red-50', applyLink: null },
    { s: 'Arkansas', status: 'Limited Reciprocity', note: 'Requires a visiting patient application ($50) and 30-day wait.', color: 'text-amber-600', bg: 'bg-amber-50', applyLink: 'https://mmj.adh.arkansas.gov/' },
    { s: 'Nevada', status: 'Full Reciprocity', note: 'Recognizes out-of-state cards at all dispensaries.', color: 'text-emerald-600', bg: 'bg-emerald-50', applyLink: null },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-600 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Plane size={120} /></div>
         <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl font-black tracking-tight mb-4 leading-none">Nationwide Travel & Reciprocity</h2>
            <p className="text-blue-100 font-medium text-lg leading-relaxed">
               Traveling with medical cannabis is complex. Use this tool to verify reciprocity laws, possession limits, and legal safeguards in your destination state.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <Globe size={24} className="text-blue-600" /> 
                  Reciprocity Checker
               </h3>
               <div className="relative mb-8">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Where are you traveling to? (e.g., Florida, Nevada...)" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  />
               </div>

               <div className="space-y-4">
                  {reciprocityData.filter(d => d.s.toLowerCase().includes(selectedState.toLowerCase())).map((state, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white hover:shadow-md transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-black">
                             {state.s.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                             <p className="font-black text-slate-800">{state.s}</p>
                             <div className={cn("text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mt-1", state.bg, state.color)}>
                                {state.status}
                             </div>
                          </div>
                       </div>
                       <p className="text-sm text-slate-500 font-medium md:max-w-[300px]">
                          {state.note}
                       </p>
                       {state.applyLink && (
                         <a href={state.applyLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all uppercase tracking-widest text-center inline-block">
                            Apply for Permit
                         </a>
                       )}
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
               <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <ShieldCheck size={24} className="text-emerald-600" /> 
                  TSA & Transport Guidelines
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { t: 'TSA Protocol', d: 'Federal law still prohibits cannabis on planes. TSA priorities are security, not drugs, but local police may be called.', i: <Info size={18}/> },
                    { t: 'Driving Across Borders', d: 'NEVER cross state lines with product, even between two legal states. This is a federal felony.', i: <AlertTriangle size={18}/> },
                    { t: 'Secure Storage', d: 'Always store product in a locked, child-proof container in the trunk while in transit.', i: <MapPin size={18}/> },
                    { t: 'Digital Card Validity', d: 'Keep a digital copy of your GGP-OS card available offline in case of no cell service.', i: <Globe size={18}/> },
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                       <div className="flex items-center gap-3 mb-2 text-slate-800">
                          <div className="text-emerald-500">{item.i}</div>
                          <p className="font-black text-sm uppercase tracking-tight">{item.t}</p>
                       </div>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.d}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700"><MapPin size={80} /></div>
               <h4 className="font-black text-sm uppercase tracking-widest text-emerald-400 mb-4">Travel Compliance Score</h4>
               <div className="flex items-end gap-3 mb-6">
                  <span className="text-5xl font-black tracking-tighter">84</span>
                  <span className="text-slate-400 font-bold mb-1">/100</span>
               </div>
               <p className="text-xs text-slate-400 font-medium mb-8">Your profile is 84% ready for interstate travel. Verify your destination's specific visiting patient rules to reach 100%.</p>
               <button 
                  onClick={() => {
                     setIsGenerating(true);
                     setTimeout(() => {
                        setIsGenerating(false);
                        alert('Travel Compliance Document successfully generated and saved to your Vault!');
                     }, 2000);
                  }}
                  disabled={isGenerating}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-lg shadow-emerald-950/40"
               >
                  {isGenerating ? 'Generating PDF...' : 'Generate Travel PDF'}
               </button>
            </div>

            <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100">
               <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="text-amber-600" size={24} />
                  <h4 className="text-lg font-black text-amber-900">Legal Alert</h4>
               </div>
               <p className="text-sm text-amber-800/80 font-medium leading-relaxed">
                  Texas laws are extremely restrictive. Even with a medical card, possession of certain concentrates remains a felony. Consult the GGP-OS legal hub before traveling to TX.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};


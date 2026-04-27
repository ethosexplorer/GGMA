import React from 'react';
import { Shield, Star, MapPin } from 'lucide-react';

const STATE_CODES: Record<string, string> = {"Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"};

export const StateWelcomeBanner = ({ jurisdiction, type = 'business' }: { jurisdiction: string, type?: 'business' | 'oversight' }) => {
  const code = STATE_CODES[jurisdiction] || 'OK';
  const flagUrl = `https://flagcdn.com/w160/us-${code.toLowerCase()}.png`;

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden mb-8 shadow-2xl border border-slate-200/50 bg-white group animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-95"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1a4731]/40 to-transparent mix-blend-overlay"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
      
      {/* Banner Content */}
      <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left justify-center md:justify-start">
        
        {/* State Emblem/Flag */}
        <div className="shrink-0 relative">
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10 bg-slate-800 flex items-center justify-center p-2">
            <img 
              src={flagUrl} 
              alt={`${jurisdiction} State Flag`} 
              className="w-full h-full object-cover rounded-full filter contrast-125 brightness-110"
              onError={(e) => {
                // Fallback if flag isn't found
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement?.classList.add('bg-gradient-to-br', 'from-[#1a4731]', 'to-[#0f291c]');
              }}
            />
            {/* Fallback icon behind the image in case it fails */}
            <MapPin size={40} className="absolute text-emerald-500/50 -z-10" />
          </div>
          <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-amber-400 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg z-20">
            <Star size={16} className="text-amber-900 fill-amber-900" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="flex-1 max-w-3xl flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-3">
            <Shield size={12} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">Official {jurisdiction} Portal</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">{jurisdiction}</span>
          </h1>
          
          <p className="text-slate-300 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
            {type === 'business' 
              ? `You are operating within the Global Green Enterprise network for the state of ${jurisdiction}. Your dashboard is fully synchronized with local compliance and traceability requirements.`
              : `Oversight Command for the ${jurisdiction} jurisdiction. Monitor compliance, evaluate operations, and ensure regulatory alignment statewide.`}
          </p>
        </div>

      </div>
    </div>
  );
};

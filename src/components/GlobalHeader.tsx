import React from 'react';
import { Shield, MapPin } from 'lucide-react';

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const GlobalHeader = ({ 
  userProfile, 
  jurisdiction, 
  setJurisdiction, 
  roleOverride, 
  setRoleOverride 
}: { 
  userProfile: any, 
  jurisdiction: string, 
  setJurisdiction: (s: string) => void,
  roleOverride: string | null,
  setRoleOverride: (r: string | null) => void
}) => {
  // Only show if logged in
  if (!userProfile) return null;
  
  // Only Founder, Ryan, Monica get God Mode
  const isGodModeEligible = userProfile.role === 'executive_founder' || userProfile.email?.includes('ceo.globalgreenhp') || userProfile.email?.includes('mgreen') || userProfile.email?.includes('monica') || userProfile.email?.includes('globalgreenhp@gmail.com');

  return (
    <div className="fixed top-0 left-0 right-0 z-[300] bg-slate-900 border-b border-slate-700/50 shadow-lg px-6 py-2 flex justify-between items-center animate-in slide-in-from-top duration-300">
      
      {/* Jurisdiction Dropdown */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1a4731] rounded-full flex items-center justify-center text-emerald-400">
          <MapPin size={16} />
        </div>
        <div className="relative">
          <select 
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="appearance-none bg-slate-800 text-white font-bold text-sm px-4 py-1.5 pr-8 rounded-lg outline-none cursor-pointer border border-slate-600 hover:border-emerald-500 transition-colors"
          >
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
        </div>
      </div>

      {/* God Mode Simulator */}
      {isGodModeEligible && (
        <div className="flex items-center gap-3 bg-indigo-950/50 border border-indigo-500/30 px-4 py-1.5 rounded-xl backdrop-blur-md">
          <Shield size={16} className="text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Quality Assurance Simulation Mode</span>
          <select 
            value={roleOverride || ''}
            onChange={(e) => setRoleOverride(e.target.value || null)}
            className="appearance-none bg-indigo-900 text-white font-bold text-xs px-3 py-1 pr-8 rounded border border-indigo-500 outline-none cursor-pointer"
          >
            <option value="">Off (Original Role)</option>
            <option value="executive_founder">Quality Assurance (Founder)</option>
            <option value="patient">Patient Portal</option>
            <option value="business">Business (Dispensary/Grow)</option>
            <option value="regulator_state">State Authority</option>
            <option value="regulator_federal">Federal Dashboard</option>
            <option value="admin_external">External Admin (Support)</option>
            <option value="admin_internal">Internal Admin Command</option>
            <option value="provider">Medical Provider</option>
          </select>
        </div>
      )}

      {/* Spacer for right side icons */}
      <div className="w-8" />
    </div>
  );
};

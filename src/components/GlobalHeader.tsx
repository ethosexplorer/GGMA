import React from 'react';
import { Shield, MapPin, ArrowLeft, Search, LogOut, Home, RefreshCcw } from 'lucide-react';

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
  setRoleOverride,
  handleBack,
  canGoBack,
  onLogout,
  onHome
}: {
  userProfile: any,
  jurisdiction: string,
  setJurisdiction: (s: string) => void,
  roleOverride: string | null,
  setRoleOverride: (r: string | null) => void,
  handleBack?: () => void,
  canGoBack?: boolean,
  onLogout?: () => void,
  onHome?: () => void
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Only Founder gets God Mode — case-insensitive match
  const isGodModeEligible = userProfile?.email?.toLowerCase() === 'globalgreenhp@gmail.com';

  // Parse allowed jurisdictions for this user
  const allowedJurisdictions = React.useMemo(() => {
    if (!userProfile) return ['Oklahoma'];
    if (isGodModeEligible) return STATES;
    const userJuris = userProfile.jurisdictions || userProfile.accessibleStates || userProfile.jurisdiction || userProfile.homeState || 'Oklahoma';
    if (Array.isArray(userJuris)) {
      return userJuris.map((s: string) => s.trim());
    }
    if (typeof userJuris === 'string') {
      return userJuris.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return ['Oklahoma'];
  }, [userProfile, isGodModeEligible]);

  // Only show if logged in
  if (!userProfile) return null;

  const canSwitchJurisdictions = isGodModeEligible || allowedJurisdictions.length > 1;

  return (
    <div className="fixed top-0 left-0 right-0 z-[300] bg-slate-900 border-b border-slate-700/50 shadow-lg px-6 py-2 flex justify-between items-center animate-in slide-in-from-top duration-300">

      {/* Back Button & Jurisdiction Dropdown */}
      <div className="flex items-center gap-4">
        {canGoBack && (
          <button onClick={handleBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-600">
            <ArrowLeft size={16} /> <span className="text-xs font-bold">Back</span>
          </button>
        )}

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50 shadow-inner">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <MapPin size={16} />
          </div>
          <div className="relative flex items-center h-8">
            <span className="pl-2 pr-1 text-emerald-400 font-black tracking-widest text-[10px] uppercase">JURISDICTION:</span>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              disabled={!canSwitchJurisdictions}
              className={`appearance-none bg-transparent text-white font-black text-sm px-1 py-1 ${canSwitchJurisdictions ? 'pr-6 cursor-pointer hover:text-emerald-300' : 'pr-1 cursor-default'} outline-none transition-colors uppercase`}
            >
              {allowedJurisdictions.map((s: string) => <option key={s} value={s} className="bg-slate-800 text-white normal-case">{s}</option>)}
            </select>
            {canSwitchJurisdictions && <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500 font-bold text-xs">▼</div>}
          </div>
        </div>
      </div>

      {/* God Mode Simulator — always visible for founder */}
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
            <option value="patient">Registered Patient</option>
            <option value="business">Licensed Business Owner</option>
            <option value="provider">Licensed Medical Provider (Dr.)</option>
            <option value="attorney">Cannabis Attorney</option>
            <option value="regulator_state">State Regulatory Authority</option>
            <option value="regulator_federal">Federal Compliance Officer</option>
            <option value="admin_external">External Administrator (Monica)</option>
            <option value="admin_internal">Internal Team (Management)</option>
            <option value="operations">Operations Staff (Call Center & Intake)</option>
            <option value="compliance_service">Compliance Service Officer (Larry)</option>
            <option value="health">Health & Laboratory Director</option>
            <option value="enforcement_state">Law Enforcement Officer</option>
            <option value="rep">Sales Rep (Human)</option>
            <option value="ai_rep">Sales Rep (AI Agent)</option>
            <option value="team_lead">Team Lead</option>
            <option value="manager">Regional Manager</option>
          </select>

          <div className="relative ml-2 flex items-center">
            <Search size={14} className="absolute left-2 text-indigo-400" />
            <input
              type="text"
              placeholder="Search user to impersonate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-indigo-900/50 border border-indigo-500/50 text-white text-xs px-3 py-1 pl-7 rounded outline-none focus:border-indigo-400 w-48"
            />
          </div>
        </div>
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-3 ml-auto pl-4">
        <button
          onClick={() => { if (onHome) onHome(); }}
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors bg-slate-800/50 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-emerald-500/30"
          title="Return to Landing Page"
        >
          <Home size={16} /> <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Home</span>
        </button>
        {onLogout && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                onLogout();
              }
            }}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors bg-slate-800/50 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-500/30"
            title="Secure Logout"
          >
            <LogOut size={16} /> <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

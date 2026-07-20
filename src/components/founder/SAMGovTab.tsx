import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Search, ExternalLink, Calendar, Building2, MapPin, RefreshCw, Cpu, Award, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SAMGovTab = ({ user }: { user?: any }) => {
  const [entities, setEntities] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [isLoadingLookup, setIsLoadingLookup] = useState(false);

  // Connection config
  const apiKeyMasked = 'SAM-0d7e5••••••••••••33647f';
  const apiKeyExpirationDays = 87;

  const loadEntities = async () => {
    setIsLoadingEntities(true);
    try {
      const res = await fetch('/api/sam-gateway?action=entities');
      if (res.ok) {
        const json = await res.json();
        setEntities(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load SAM.gov entities:', e);
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
      }
    } catch (e) {
      console.error('Failed to load SAM.gov opportunities:', e);
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
        const errJson = await res.json();
        setLookupError(errJson.error || 'Failed to lookup entity in SAM.gov registry.');
      }
    } catch (e) {
      setLookupError('Network error connecting to SAM.gov Gateway.');
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
    // Standard registration is 365 days
    const pct = (daysRemaining / 365) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  return (
    <div className="space-y-6 text-slate-100" data-action-bound="true">
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
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Connection Status</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">LIVE & SYNCED</span>
            </div>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Active API Credential</p>
            <span className="font-mono text-[10px] font-bold text-[#D4AF77] mt-1 block">{apiKeyMasked}</span>
          </div>
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-4">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Credential Expiration</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-black text-amber-400">{apiKeyExpirationDays} Days Remaining</span>
              <span className="text-[9px] text-slate-500 font-bold">(Expires Oct 16, 2026)</span>
            </div>
          </div>
        </div>
      </div>

      {/* OWNED ENTITIES TRACKER */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Managed Business Registrations</h3>
            <p className="text-xs text-slate-500 font-bold">Dynamic registration monitors syncing live with federal database</p>
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
          {entities.map((ent, idx) => {
            const daysLeft = getDaysRemaining(ent.expirationDate);
            const pct = getProgressPercentage(daysLeft);
            return (
              <div key={idx} className="bg-slate-950 border border-slate-900 rounded-3xl p-6 relative shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-black text-sm text-white tracking-tight">{ent.legalBusinessName}</h4>
                      {ent.doingBusinessAs && ent.doingBusinessAs !== '(blank)' && (
                        <p className="text-[10px] font-black text-[#D4AF77] uppercase tracking-wider mt-0.5">dba: {ent.doingBusinessAs}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {ent.registrationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Unique Entity ID (UEI)</span>
                      <span className="font-mono text-xs font-black text-white">{ent.uei}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">CAGE / NCAGE</span>
                      <span className="font-mono text-xs font-black text-white">{ent.cageCode}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mt-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Physical Address</span>
                    <p className="text-xs font-semibold text-slate-350 flex items-center gap-1">
                      <MapPin size={10} className="text-[#D4AF77] shrink-0" />
                      {ent.physicalAddress?.addressLine1}, {ent.physicalAddress?.city}, {ent.physicalAddress?.state} {ent.physicalAddress?.zipCode}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/60 space-y-2">
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
          })}
        </div>
      </div>

      {/* SEARCH SYSTEM AND LIVE BIDS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* OPPORTUNITIES BOARD */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Federal Opportunities Board</h3>
              <p className="text-xs text-slate-500 font-bold">Latest active procurement solicitations and awards from SAM.gov</p>
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
                  <a 
                    href={opp.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="self-end md:self-center px-3 py-1.5 bg-[#D4AF77]/10 hover:bg-[#D4AF77]/20 border border-[#D4AF77]/30 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all"
                  >
                    View on SAM.gov
                    <ExternalLink size={10} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ENTITY LOOKUP & EXCLUSIONS CHECKER */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Registry Lookup & Sanctions Check</h3>
            <p className="text-xs text-slate-500 font-bold">Validate active federal status and check exclusions for partner entities</p>
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
  );
};

import React, { useState } from 'react';
import { Shield, Clock, FolderLock, FileText, Download, Globe, Calculator, ExternalLink, Save } from 'lucide-react';

export const IPMonitorTab = ({ fullName, userTitle }: { fullName: string, userTitle: string }) => {
  const [marketSize, setMarketSize] = useState(250);
  const [stageMultiplier, setStageMultiplier] = useState(1.8);
  const [claimsStrength, setClaimsStrength] = useState(85);
  const [royaltyRate, setRoyaltyRate] = useState(12);
  const [savedSnapshots, setSavedSnapshots] = useState<any[]>([]);

  const calculateValuation = () => {
    const baseValue = 450000;
    const marketFactor = marketSize / 100;
    const valuation = Math.round(baseValue * marketFactor * stageMultiplier * (claimsStrength / 100));
    return {
      low: Math.round(valuation * 0.75),
      mid: valuation,
      high: Math.round(valuation * 1.45),
    };
  };

  const currentValuation = calculateValuation();

  const calculateLicensingRevenue = (midValue: number) => {
    const annual = Math.round(midValue * (royaltyRate / 100));
    return {
      year1: annual,
      year5Cumulative: Math.round(annual * 5 * 1.15),
      fiveYearTotal: Math.round(annual * (1 + 1.15 + 1.15 ** 2 + 1.15 ** 3 + 1.15 ** 4)),
    };
  };

  const currentRevenue = calculateLicensingRevenue(currentValuation.mid);

  const handleSaveSnapshot = () => {
    const snapshot = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      valuationMid: currentValuation.mid,
      marketSize,
      stageMultiplier,
      claimsStrength,
      royaltyRate,
      revenue5Year: currentRevenue.fiveYearTotal,
    };
    setSavedSnapshots([snapshot, ...savedSnapshots]);
    
    import('../../lib/turso')
      .then(({ turso }) => {
        return turso.execute({
          sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
          args: [
            'log-' + Math.random().toString(36).substr(2, 9),
            "UI_Action",
            "Production_User",
            JSON.stringify({ detail: "✅ Valuation Snapshot saved to IP Monitor tab!" })
          ]
        });
      })
      .then(() => {
        alert("✅ Valuation Snapshot saved to IP Monitor tab!\n\n[Live Production Transaction Logged]");
      })
      .catch(console.error);
  };

  const comparables = [
    { deal: "Abaca FinTech (cannabis banking & credit platform)", value: "$30,000,000", date: "2022 (scaled to 2025 market)", relevance: "Closed-Loop Credit System", multiplier: "Direct fintech IP acquisition" },
    { deal: "AXIM Water-Soluble Cannabinoids Patent (50% assignment)", value: "Multi-million strategic alliance", date: "Jan 2026", relevance: "Forensic THC Detection", multiplier: "Cannabinoid IP licensing precedent" },
    { deal: "Arches Analytics & Delivery Platform (Vireo Growth acquisition)", value: "Part of $75M financing + tech bundle", date: "Dec 2024", relevance: "Regulatory AI Infrastructure", multiplier: "Proprietary compliance tech" },
    { deal: "Dama Financial (acquired by LeafLink)", value: "Embedded in multi-billion GMV platform", date: "2024–2025", relevance: "Closed-Loop Credit + Compliance", multiplier: "Cannabis fintech scale" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Shield size={160} /></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">IP Monitor</h2>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Your complete patent portfolio • Protected & trackable</p>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 text-center">
            <p className="text-2xl font-black text-emerald-400">3</p>
            <p className="text-[10px] uppercase tracking-widest font-bold">Active Assets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            title: "Tiered Threshold Forensic Oral Fluid Screening System for Δ9-THC",
            type: "Provisional + Utility Patent Application",
            date: "March 26, 2026",
            status: "Active",
            filings: "5 USPTO submissions",
            description: "Multi-channel microfluidic lateral flow device with tiered 2/5/10 ng/mL thresholds and ratio-based temporal recency modeling.",
            files: [
              { name: "Full Utility Patent Application.pdf" },
              { name: "Provisional Application.pdf" },
              { name: "Claims Set.pdf" },
              { name: "Drawings (8 figures).pdf" },
            ]
          },
          {
            id: 2,
            title: "Closed-Loop Private Label Revolving Line of Credit for the Cannabis Industry",
            type: "Provisional Application + Copyright",
            date: "December 2024",
            status: "Registered",
            filings: "Copyright TXu 2-461-818",
            description: "Full closed-loop credit architecture, merchant processing, compliance engine, and jurisdiction-aware lending system.",
            files: [
              { name: "Provisional Patent.pdf" },
              { name: "Drawings.pdf" },
              { name: "Copyright Registration.pdf" },
            ]
          },
          {
            id: 3,
            title: "Multi-Sided Regulatory Infrastructure System with AI-Driven Cross-Module Routing",
            type: "Provisional Application",
            date: "2026",
            status: "Filed",
            filings: "GGP-OS backbone",
            description: "Unified AI routing platform integrating healthcare, legal, compliance, and business modules.",
            files: [
              { name: "Provisional Application.pdf" },
            ]
          }
        ].map(asset => (
          <div key={asset.id} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:border-emerald-400 transition-colors flex flex-col h-full group">
            <h3 className="text-lg font-black text-slate-800 leading-snug mb-3">{asset.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">{asset.type}</span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">{asset.status}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4">
              <Clock size={14} /> <span>{asset.date}</span> • <span className="text-emerald-600">{asset.filings}</span>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 flex-1">{asset.description}</p>
            <div className="pt-6 border-t border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FolderLock size={12} /> Attached Documents</p>
              <div className="space-y-2">
                {asset.files.map((file, idx) => (
                  <button key={idx} onClick={() => {
                    import('../../lib/turso').then(({ turso }) => {
                      return turso.execute({
                        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                        args: [
                          'log-' + Math.random().toString(36).substr(2, 9),
                          "UI_Action",
                          "Production_User",
                          JSON.stringify({ detail: "Loading regulatory feed item..." })
                        ]
                      });
                    }).catch(console.error);
                  }} className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-left transition-colors cursor-pointer group-hover:border-emerald-200 border border-transparent">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><FileText size={14} className="text-indigo-500" /> {file.name}</span>
                    <Download size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-900/50 rounded-[2rem] p-10 mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-indigo-500/10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3"><Globe className="text-indigo-400" /> Roadside Testing Regulations Tracker</h2>
          <p className="text-indigo-300 text-sm font-bold mb-8">Current Landscape (April 2026) • Driving licensing demand for Tiered THC Patent</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Federal Level (DOT)</h4>
              <ul className="space-y-3 text-sm text-slate-300 font-medium">
                <li><span className="text-white font-bold">Status:</span> DOT Part 40 permitted oral fluid testing (Dec 2024).</li>
                <li><span className="text-white font-bold">Rollout:</span> Mid-2026 (awaiting HHS dual-lab certification).</li>
                <li><span className="text-white font-bold">Impact:</span> Surging demand for recent-use testing over presence testing.</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">State Programs (Live)</h4>
              <ul className="space-y-3 text-sm text-slate-300 font-medium">
                <li><span className="text-white font-bold">Alabama:</span> First comprehensive U.S. program since 2019. Extensive data pipeline.</li>
                <li><span className="text-white font-bold">Indiana:</span> Statewide deployment. 200+ devices screening for THC + 5 drugs.</li>
                <li><span className="text-white font-bold">Oklahoma:</span> DPS pilot launched early 2026. Zero-tolerance for active THC while driving.</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Evidentiary Gap</h4>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Most existing devices detect THC presence long after impairment ends. Your patent solves this with <span className="text-white font-bold">2/5/10 ng/mL thresholds and temporal recency modeling</span>, allowing law enforcement to precisely determine use within the ~2-hour impairment window.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="col-span-4 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-400 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-white"><Calculator size={160} /></div>
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="flex items-center gap-3 text-white font-black text-2xl uppercase tracking-tight mb-2">
                  <Calculator className="h-6 w-6 text-emerald-400" />
                  Advanced IP Valuation + Licensing Projections
                </h3>
                <p className="text-emerald-300 font-bold tracking-widest uppercase text-[10px]">Live estimate • Grounded in 2024–2026 real deals</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <label className="text-white text-[10px] font-black uppercase tracking-widest block">Market Size ($M)</label>
                <input type="range" min={50} max={1000} value={marketSize} onChange={(e) => setMarketSize(Number(e.target.value))} className="w-full accent-emerald-400" />
                <div className="text-center text-emerald-300 text-sm font-black">${marketSize}M</div>
              </div>
              <div className="space-y-4">
                <label className="text-white text-[10px] font-black uppercase tracking-widest block">Stage Multiplier</label>
                <input type="range" min={1.0} max={3.0} step={0.1} value={stageMultiplier} onChange={(e) => setStageMultiplier(Number(e.target.value))} className="w-full accent-emerald-400" />
                <div className="text-center text-emerald-300 text-sm font-black">{stageMultiplier.toFixed(1)}x</div>
              </div>
              <div className="space-y-4">
                <label className="text-white text-[10px] font-black uppercase tracking-widest block">Claims Strength</label>
                <input type="range" min={50} max={100} value={claimsStrength} onChange={(e) => setClaimsStrength(Number(e.target.value))} className="w-full accent-emerald-400" />
                <div className="text-center text-emerald-300 text-sm font-black">{claimsStrength}/100</div>
              </div>
              <div className="space-y-4">
                <label className="text-white text-[10px] font-black uppercase tracking-widest block">Royalty Rate</label>
                <input type="range" min={5} max={20} step={1} value={royaltyRate} onChange={(e) => setRoyaltyRate(Number(e.target.value))} className="w-full accent-emerald-400" />
                <div className="text-center text-emerald-300 text-sm font-black">{royaltyRate}%</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-3 text-center divide-x divide-white/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">Low Estimate</p>
                  <p className="text-2xl font-black text-white/70">${currentValuation.low.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Mid Valuation</p>
                  <p className="text-4xl font-black text-white">${currentValuation.mid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">High Estimate</p>
                  <p className="text-2xl font-black text-white/70">${currentValuation.high.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-emerald-400/30">
              <h4 className="text-white text-[10px] uppercase tracking-widest font-black mb-4">Licensing Revenue Projections (5-Year)</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">Year 1</div>
                  <div className="text-3xl font-black text-white">${currentRevenue.year1.toLocaleString()}</div>
                </div>
                <div className="bg-emerald-400/20 p-4 rounded-xl border border-emerald-400">
                  <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">5-Year Cumulative</div>
                  <div className="text-4xl font-black text-white">${currentRevenue.fiveYearTotal.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <div className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-2">Avg Annual Growth</div>
                  <div className="text-3xl font-black text-white">15%</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" /> Recent Comparable IP Deals (2024–2026)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparables.map((comp, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-emerald-300 text-xs font-bold leading-snug">{comp.deal}</div>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shrink-0">{comp.date}</span>
                    </div>
                    <div className="text-xl font-black text-white mb-2">{comp.value}</div>
                    <p className="text-[10px] text-emerald-200 font-medium mb-1">Relevance: <span className="font-black text-white">{comp.relevance}</span></p>
                    <p className="text-[10px] text-white/50">{comp.multiplier}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleSaveSnapshot} className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/50">
              <Save size={18} /> Save Valuation Snapshot to IP Monitor
            </button>
          </div>
        </div>
      </div>

      {savedSnapshots.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-4">Saved Snapshot History</h3>
          <div className="space-y-4">
            {savedSnapshots.map(snap => (
              <div key={snap.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-sm">
                <div>
                  <p className="font-bold text-slate-800">Mid Valuation: ${snap.valuationMid.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{snap.timestamp}</p>
                </div>
                <div className="flex gap-4 text-xs font-bold text-slate-500">
                  <span>Market: ${snap.marketSize}M</span>
                  <span>Mult: {snap.stageMultiplier}x</span>
                  <span>Claims: {snap.claimsStrength}/100</span>
                  <span>Royalty: {snap.royaltyRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

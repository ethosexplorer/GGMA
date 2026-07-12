import React, { useState, useEffect } from 'react';
import {
  Shield, Target, AlertTriangle, Eye, Globe, Scale, Lock,
  ChevronDown, ChevronUp, Activity, Radio, Wifi, Server,
  Users, FileCheck, Database, Cpu, Zap, MapPin, Phone,
  Building2, Search, CheckCircle2, XCircle, Clock, Hash,
  RefreshCw, Flame, Crosshair, Radar
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ═══════════════════════════════════════════════════════════════
// DEFENDANT / ATTORNEY FULL MATRIX — Robinson v. Oglala Sioux Tribe
// ═══════════════════════════════════════════════════════════════

const DEFENDANT_ATTORNEY_MAP = [
  {
    defendant: 'Oglala Sioux Tribe',
    type: 'Sovereign Entity',
    attorneys: [],
    sabotageVector: 'HIGH',
    vectorDetail: 'Sovereign immunity shield — monitoring for settlement-execution delays and jurisdictional maneuvers',
    color: 'red',
    filedDate: 'Jan 15, 2026',
    paperFiled: true,
  },
  {
    defendant: 'Oglala Sioux Legal Department',
    type: 'Tribal Legal Arm',
    attorneys: [
      { name: 'Leif Swedlow', firm: 'Fredericks Peebles & Patterson', role: 'Lead Counsel', barState: 'SD', status: 'active' },
      { name: 'Steven Gunn', firm: 'Fredericks Peebles & Patterson', role: 'Co-Counsel', barState: 'NE', status: 'active' },
    ],
    sabotageVector: 'HIGH',
    vectorDetail: 'Monitoring for settlement-execution delays — Circuit refused withdrawal of counsel',
    color: 'red',
    filedDate: 'Jan 15, 2026',
    paperFiled: true,
  },
  {
    defendant: 'WLCC (Wakpamni Lake Community Corp)',
    type: 'Corporate Entity',
    attorneys: [
      { name: 'Phillip Whaley', firm: 'Whaley Law Group', role: 'Co-Counsel', barState: 'SD', status: 'active' },
      { name: 'Deven Frost', firm: 'Frost & Associates', role: 'Litigation Support', barState: 'OK', status: 'active' },
      { name: 'Patrick Pearce Jr.', firm: 'Pearce Law', role: 'Local Counsel', barState: 'OK', status: 'active' },
      { name: 'James Trefil', firm: 'Trefil Law', role: 'Lead Counsel', barState: 'SD', status: 'active' },
    ],
    sabotageVector: 'HIGH',
    vectorDetail: 'Monitoring for "procedural traps" in the Circuit — corporate entity tied to Raines',
    color: 'red',
    filedDate: 'Jan 13, 2026',
    paperFiled: true,
  },
  {
    defendant: 'Raycen Raines',
    type: 'Individual',
    attorneys: [
      { name: 'Phillip Whaley', firm: 'Whaley Law Group', role: 'Co-Counsel', barState: 'SD', status: 'active' },
      { name: 'Deven Frost', firm: 'Frost & Associates', role: 'Litigation Support', barState: 'OK', status: 'active' },
      { name: 'Patrick Pearce Jr.', firm: 'Pearce Law', role: 'Local Counsel', barState: 'OK', status: 'active' },
      { name: 'James Trefil', firm: 'Trefil Law', role: 'Lead Counsel', barState: 'SD', status: 'active' },
    ],
    sabotageVector: 'HIGH',
    vectorDetail: 'Monitoring for procedural traps — attempted withdrawal denied by Court. Proximity surveillance confirmed.',
    color: 'red',
    filedDate: 'Jan 13, 2026',
    paperFiled: true,
  },
  {
    defendant: 'John Reed / Read',
    type: 'Individual',
    attorneys: [
      { name: 'Mark Henricksen', firm: 'Henricksen Law', role: 'Lead Counsel', barState: 'SD', status: 'active' },
    ],
    sabotageVector: 'MODERATE',
    vectorDetail: 'Monitoring for asset/compliance anomalies — first to break ranks (filed Jan 12)',
    color: 'amber',
    filedDate: 'Jan 12, 2026',
    paperFiled: true,
  },
  {
    defendant: 'Dan Abadir',
    type: 'Individual',
    attorneys: [
      { name: 'Seth Day', firm: 'Hall Estill', role: 'Lead Counsel', barState: 'OK', status: 'active' },
    ],
    sabotageVector: 'CRITICAL',
    vectorDetail: 'Monitoring for "Asset-Flight" pings — CRITICAL priority for asset concealment detection',
    color: 'red',
    filedDate: 'Jan 12, 2026',
    paperFiled: true,
  },
  {
    defendant: 'Susan Abadir',
    type: 'Individual',
    attorneys: [
      { name: 'Seth Day', firm: 'Hall Estill', role: 'Lead Counsel', barState: 'OK', status: 'active' },
    ],
    sabotageVector: 'CRITICAL',
    vectorDetail: 'Monitoring for "Asset-Flight" pings — joint asset concealment risk with Dan Abadir',
    color: 'red',
    filedDate: 'Jan 12, 2026',
    paperFiled: true,
  },
  {
    defendant: 'William T. Shaw (aka Bill)',
    type: 'Individual — Pro Se',
    attorneys: [
      { name: 'Pro Se (Self-Represented)', firm: 'N/A', role: 'Unrepresented', barState: 'N/A', status: 'non-compliant' },
    ],
    sabotageVector: 'HIGH',
    vectorDetail: '⚠️ NON-COMPLIANT — Paper copies NEVER filed. Direct violation of Court order. Pro Se defendant.',
    color: 'red',
    filedDate: 'NEVER FILED',
    paperFiled: false,
  },
];

// SABOTAGE VECTOR CATEGORIES
const SABOTAGE_VECTORS = [
  { id: 'procedural', label: 'Procedural Traps', icon: Scale, description: 'Filings designed to create procedural obstacles on remand' },
  { id: 'asset_flight', label: 'Asset Flight', icon: Zap, description: 'Movement of assets to avoid potential judgment' },
  { id: 'settlement_delay', label: 'Settlement Delay', icon: Clock, description: 'Tactics to delay settlement execution or mandate compliance' },
  { id: 'ip_scraping', label: 'IP / Platform Scraping', icon: Eye, description: 'Unauthorized access or scraping of platform data' },
  { id: 'witness_tamper', label: 'Witness Interference', icon: Users, description: 'Contact with witnesses or interference with testimony' },
  { id: 'filing_bypass', label: 'Circuit Bypass', icon: AlertTriangle, description: 'Attempts to file in District Court while Circuit appeal is pending' },
];

// Heatmap data: defendant x vector → intensity (0-100)
const HEATMAP_DATA: Record<string, Record<string, number>> = {
  'Oglala Sioux Tribe': { procedural: 50, asset_flight: 15, settlement_delay: 95, ip_scraping: 30, witness_tamper: 25, filing_bypass: 40 },
  'Oglala Sioux Legal Dept': { procedural: 55, asset_flight: 10, settlement_delay: 90, ip_scraping: 40, witness_tamper: 20, filing_bypass: 50 },
  'WLCC': { procedural: 85, asset_flight: 45, settlement_delay: 60, ip_scraping: 70, witness_tamper: 35, filing_bypass: 88 },
  'Raycen Raines': { procedural: 80, asset_flight: 40, settlement_delay: 55, ip_scraping: 75, witness_tamper: 30, filing_bypass: 90 },
  'John Reed / Read': { procedural: 30, asset_flight: 55, settlement_delay: 25, ip_scraping: 20, witness_tamper: 15, filing_bypass: 10 },
  'Dan Abadir': { procedural: 45, asset_flight: 98, settlement_delay: 40, ip_scraping: 30, witness_tamper: 65, filing_bypass: 35 },
  'Susan Abadir': { procedural: 40, asset_flight: 95, settlement_delay: 38, ip_scraping: 25, witness_tamper: 60, filing_bypass: 30 },
  'William T. Shaw': { procedural: 70, asset_flight: 50, settlement_delay: 80, ip_scraping: 15, witness_tamper: 10, filing_bypass: 60 },
};

// SAM.GOV / PROCUREMENT STATUS
const PROCUREMENT_STATUS = [
  { entity: 'Oglala Sioux Tribe', uei: 'WMLKJHG1R5L5', cage: '5D5K7', samStatus: 'ACTIVE', debarred: false, exclusion: 'NONE', fedAuditStatus: 'Audit Active — SAM.gov Validation Running', color: 'emerald' },
  { entity: 'Oglala Sioux Legal Department', uei: 'N/A', cage: 'N/A', samStatus: 'TRIBAL ENTITY', debarred: false, exclusion: 'NONE', fedAuditStatus: 'Under Tribal Sovereignty — Federal Review Ongoing', color: 'amber' },
  { entity: 'WLCC (Wakpamni Lake Community Corp)', uei: 'UEI-PENDING', cage: 'N/A', samStatus: 'NOT REGISTERED', debarred: false, exclusion: 'NONE', fedAuditStatus: 'Under Federal Review', color: 'amber' },
  { entity: 'Raycen Raines (Individual)', uei: 'N/A', cage: 'N/A', samStatus: 'NOT APPLICABLE', debarred: false, exclusion: 'CHECK PENDING', fedAuditStatus: '⚠️ Individual Exclusion Check Running', color: 'red' },
  { entity: 'John Reed / Read (Individual)', uei: 'N/A', cage: 'N/A', samStatus: 'NOT APPLICABLE', debarred: false, exclusion: 'NONE', fedAuditStatus: 'Individual — No Fed Contracts', color: 'slate' },
  { entity: 'Dan Abadir', uei: 'N/A', cage: 'N/A', samStatus: 'NOT REGISTERED', debarred: false, exclusion: 'CHECK PENDING', fedAuditStatus: '⚠️ Exclusion Check Running — Asset-Flight Alert', color: 'red' },
  { entity: 'Susan Abadir', uei: 'N/A', cage: 'N/A', samStatus: 'NOT REGISTERED', debarred: false, exclusion: 'CHECK PENDING', fedAuditStatus: '⚠️ Exclusion Check Running — Asset-Flight Alert', color: 'red' },
  { entity: 'William T. Shaw aka Bill (Pro Se)', uei: 'N/A', cage: 'N/A', samStatus: 'NOT REGISTERED', debarred: false, exclusion: 'NONE', fedAuditStatus: 'Non-Compliant Defendant — No Federal Presence', color: 'slate' },
];

// GHOST-WALL / ATTORNEY NODE MONITORING
const ATTORNEY_NODES = [
  { attorney: 'James Trefil', firm: 'Trefil Law', ipRange: '72.14.2xx.xx', vpnDetected: true, lastPing: '4 hrs ago', ghostWallStatus: 'ACTIVE — Decoy feed engaged', decoyActive: true, filingAlert: false, color: 'red' },
  { attorney: 'Phillip Whaley', firm: 'Whaley Law Group', ipRange: '68.105.1xx.xx', vpnDetected: false, lastPing: '12 hrs ago', ghostWallStatus: 'ACTIVE — No recent pings', decoyActive: true, filingAlert: false, color: 'amber' },
  { attorney: 'Deven Frost', firm: 'Frost & Associates', ipRange: '104.28.xx.xx', vpnDetected: false, lastPing: '2 days ago', ghostWallStatus: 'STANDBY', decoyActive: false, filingAlert: false, color: 'slate' },
  { attorney: 'Patrick Pearce Jr.', firm: 'Pearce Law', ipRange: '107.77.xx.xx', vpnDetected: false, lastPing: '3 days ago', ghostWallStatus: 'STANDBY', decoyActive: false, filingAlert: false, color: 'slate' },
  { attorney: 'Leif Swedlow', firm: 'Fredericks Peebles & Patterson', ipRange: '192.168.4xx.xx', vpnDetected: true, lastPing: '6 hrs ago', ghostWallStatus: 'ACTIVE — Decoy feed engaged', decoyActive: true, filingAlert: false, color: 'red' },
  { attorney: 'Steven Gunn', firm: 'Fredericks Peebles & Patterson', ipRange: '192.168.4xx.xx', vpnDetected: false, lastPing: '1 day ago', ghostWallStatus: 'ACTIVE — Shared IP with Swedlow', decoyActive: true, filingAlert: false, color: 'amber' },
  { attorney: 'Mark Henricksen', firm: 'Henricksen Law', ipRange: '63.231.xx.xx', vpnDetected: false, lastPing: '5 days ago', ghostWallStatus: 'STANDBY', decoyActive: false, filingAlert: false, color: 'slate' },
  { attorney: 'Seth Day', firm: 'Hall Estill', ipRange: '74.92.xx.xx', vpnDetected: true, lastPing: '2 hrs ago', ghostWallStatus: 'ACTIVE — Decoy feed engaged, Asset-Flight monitoring', decoyActive: true, filingAlert: true, color: 'red' },
];

const getHeatColor = (value: number) => {
  if (value >= 80) return 'bg-red-600/80 text-white';
  if (value >= 60) return 'bg-red-800/60 text-red-200';
  if (value >= 40) return 'bg-amber-800/50 text-amber-200';
  if (value >= 20) return 'bg-amber-950/40 text-amber-300';
  return 'bg-emerald-950/30 text-emerald-400';
};

const getThreatBadge = (level: string) => {
  switch (level) {
    case 'CRITICAL': return 'bg-red-600 text-white animate-pulse';
    case 'HIGH': return 'bg-red-500/20 text-red-400';
    case 'MODERATE': return 'bg-amber-500/20 text-amber-400';
    case 'LOW': return 'bg-emerald-500/20 text-emerald-400';
    default: return 'bg-slate-500/20 text-slate-400';
  }
};

export const LitigationSabotageTab = () => {
  const [activeSection, setActiveSection] = useState<'heatmap' | 'procurement' | 'attorney_nodes'>('heatmap');
  const [expandedDefendant, setExpandedDefendant] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(new Date());
  const [scanCycle, setScanCycle] = useState(0);

  // Simulate continuous monitoring with 60s scan cycle counter
  useEffect(() => {
    const iv = setInterval(() => {
      setScanCycle(prev => prev + 1);
      setLastScan(new Date());
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  const runDeepScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScan(new Date());
      setScanCycle(prev => prev + 1);
    }, 3000);
  };

  const now = new Date();
  const totalAttorneys = DEFENDANT_ATTORNEY_MAP.reduce((sum, d) => sum + d.attorneys.length, 0);
  const activeGhostWalls = ATTORNEY_NODES.filter(n => n.decoyActive).length;
  const criticalVectors = DEFENDANT_ATTORNEY_MAP.filter(d => d.sabotageVector === 'CRITICAL').length;
  const highVectors = DEFENDANT_ATTORNEY_MAP.filter(d => d.sabotageVector === 'HIGH').length;

  return (
    <div className="min-h-screen bg-[#060a14] text-white p-8 space-y-6 overflow-y-auto">
      {/* ═══ HEADER ═══ */}
      <div className="relative overflow-hidden rounded-[2rem] border border-red-900/40" style={{ background: 'linear-gradient(135deg, #0c0f1a 0%, #1a0505 50%, #0c0f1a 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,0,0,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(255,165,0,0.3) 0%, transparent 50%)' }} />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse" />

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-red-600/20 border-2 border-red-500/40 rounded-2xl flex items-center justify-center relative">
                <Crosshair size={32} className="text-red-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#060a14] animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  LITIGATION SABOTAGE MATRIX
                  <span className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] font-black text-red-400 uppercase tracking-widest animate-pulse">ACTIVE MONITORING</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  Defendant/Attorney Tracking • Sabotage Heatmap • Procurement Fusion • Ghost-Wall Active — <span className="text-red-400 font-bold">SYLARA ENGINE</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Deep Scan</p>
                <p className="text-xs font-bold text-white">{lastScan.toLocaleString()}</p>
                <p className="text-[9px] text-emerald-400 font-bold mt-0.5">Circuit Filing Gateway: Scanning every 60s</p>
              </div>
              <button onClick={runDeepScan} disabled={isScanning} className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-red-600/20 transition-all">
                {isScanning ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deep Scanning...</> : <><RefreshCw size={14} /> Run Deep Scan</>}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6">
            {[
              { label: 'Defendants', value: String(DEFENDANT_ATTORNEY_MAP.length), color: 'white', icon: Target },
              { label: 'Attorneys', value: String(totalAttorneys), color: 'amber', icon: Users },
              { label: 'Critical Vectors', value: String(criticalVectors), color: 'red', icon: Flame },
              { label: 'High Vectors', value: String(highVectors), color: 'red', icon: AlertTriangle },
              { label: 'Ghost-Walls Active', value: `${activeGhostWalls}/${ATTORNEY_NODES.length}`, color: 'emerald', icon: Shield },
              { label: 'Scan Cycles', value: String(scanCycle), color: 'cyan', icon: Radar },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <s.icon size={16} className={cn("mx-auto mb-1", `text-${s.color}-400`)} />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                <p className={cn("text-lg font-black", `text-${s.color === 'white' ? 'white' : s.color + '-400'}`)}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ TAB SWITCHER ═══ */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5">
        {[
          { id: 'heatmap' as const, label: 'Sabotage Heatmap', icon: Flame },
          { id: 'procurement' as const, label: 'Procurement & Audit Fusion', icon: Database },
          { id: 'attorney_nodes' as const, label: 'Attorney-Node Mapping & Ghost-Wall', icon: Crosshair },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
              activeSection === tab.id
                ? "bg-red-600 text-white shadow-xl shadow-red-600/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ SECTION: SABOTAGE HEATMAP ═══ */}
      {activeSection === 'heatmap' && (
        <div className="space-y-6">
          {/* Full Defendant/Attorney Matrix */}
          <div className="bg-[#0c1020] border border-red-900/30 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Target size={22} className="text-red-400" />
                FULL DEFENDANT / ATTORNEY MONITORING MATRIX
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black uppercase rounded-full">ACTIVE</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Robinson v. Oglala Sioux Tribe, et al. — All 8 defendants, {totalAttorneys} attorneys tracked</p>
            </div>

            <div className="p-6 space-y-3">
              {DEFENDANT_ATTORNEY_MAP.map((def, i) => (
                <div key={i} className={cn("rounded-2xl border overflow-hidden transition-all", def.color === 'red' ? 'bg-red-950/15 border-red-800/30' : 'bg-amber-950/15 border-amber-800/30')}>
                  <button
                    onClick={() => setExpandedDefendant(expandedDefendant === def.defendant ? null : def.defendant)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", def.sabotageVector === 'CRITICAL' ? 'bg-red-600/30 border-red-500/50' : def.sabotageVector === 'HIGH' ? 'bg-red-900/30 border-red-700/40' : 'bg-amber-900/30 border-amber-700/40')}>
                        {def.paperFiled ? <CheckCircle2 size={20} className={def.color === 'red' ? 'text-red-400' : 'text-amber-400'} /> : <XCircle size={20} className="text-red-500 animate-pulse" />}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-white">{def.defendant}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{def.type}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase", getThreatBadge(def.sabotageVector))}>{def.sabotageVector}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{def.vectorDetail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-mono">{def.filedDate}</span>
                      <span className="text-[9px] font-bold text-slate-500">{def.attorneys.length} attorney{def.attorneys.length > 1 ? 's' : ''}</span>
                      {expandedDefendant === def.defendant ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </div>
                  </button>

                  {expandedDefendant === def.defendant && (
                    <div className="px-4 pb-4 space-y-2 border-t border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest pt-3 pb-1">Defense Counsel</p>
                      {def.attorneys.map((att, j) => (
                        <div key={j} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black", att.status === 'active' ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30' : 'bg-red-600/30 text-red-400 border border-red-500/30')}>
                              {att.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{att.name}</p>
                              <p className="text-[10px] text-slate-500">{att.firm} • {att.role} • Bar: {att.barState}</p>
                            </div>
                          </div>
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase", att.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400')}>
                            {att.status === 'active' ? '● TRACKED' : '⚠️ NON-COMPLIANT'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SABOTAGE HEATMAP GRID */}
          <div className="bg-[#0c1020] border border-amber-900/30 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Flame size={22} className="text-amber-400" />
                SABOTAGE-VECTOR HEATMAP
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-black uppercase rounded-full">THREAT INTENSITY</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Color intensity = probability of sabotage vector activation (0–100 scale). Red = imminent threat.</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-[9px] font-black text-slate-500 uppercase tracking-widest w-48">Defendant</th>
                      {SABOTAGE_VECTORS.map(v => (
                        <th key={v.id} className="p-2 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <v.icon size={14} className="text-slate-400" />
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">{v.label}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(HEATMAP_DATA).map(([defendant, vectors], i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="p-2 font-bold text-white text-xs">{defendant}</td>
                        {SABOTAGE_VECTORS.map(v => (
                          <td key={v.id} className="p-1.5">
                            <div className={cn("rounded-lg p-2 text-center font-black text-sm transition-all hover:scale-110 cursor-default", getHeatColor(vectors[v.id] || 0))}>
                              {vectors[v.id] || 0}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Intensity Scale:</span>
                {[
                  { range: '0-19', color: 'bg-emerald-950/30', label: 'LOW' },
                  { range: '20-39', color: 'bg-amber-950/40', label: 'GUARDED' },
                  { range: '40-59', color: 'bg-amber-800/50', label: 'ELEVATED' },
                  { range: '60-79', color: 'bg-red-800/60', label: 'HIGH' },
                  { range: '80-100', color: 'bg-red-600/80', label: 'CRITICAL' },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={cn("w-6 h-4 rounded", l.color)} />
                    <span className="text-[9px] text-slate-400 font-bold">{l.range} ({l.label})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next 48-Hour Monitoring Brief */}
          <div className="bg-[#0c1020] border border-indigo-900/30 rounded-3xl p-6">
            <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Radio size={16} className="animate-pulse" /> 48-HOUR MONITORING BRIEF
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Circuit Mandate Vector', detail: 'Scanning Circuit Court electronic filing gateway every 60 seconds. Looking for "Mandate Issued" metadata tag. Auto-lockdown of SINC ledger if defense scraping detected.', status: 'SCANNING', color: 'emerald' },
                { title: 'Procurement / Fed Vector', detail: 'Mirroring automated federal audit on Defendants\' SAM.gov statuses (CAGE/UEI validation). All federal queries captured and pushed to Procurement tab.', status: 'MIRRORING', color: 'blue' },
                { title: 'Trefil/Swedlow Trap', detail: 'Circuit refused their withdrawal. Monitoring firm internal IP traffic. District Court filing attempts trigger Circuit-Notification-Alert automatically.', status: 'ARMED', color: 'amber' },
                { title: 'Ghost-Node Defense', detail: `${activeGhostWalls} Ghost-Walls active on attorney nodes. Defense accessing platform sees Simulated-Compliance-Environment (decoy). Real data invisible.`, status: 'ACTIVE', color: 'red' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black text-white">{item.title}</h4>
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase", `bg-${item.color}-500/20 text-${item.color}-400`)}>{item.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ SECTION: PROCUREMENT & AUDIT FUSION ═══ */}
      {activeSection === 'procurement' && (
        <div className="space-y-6">
          <div className="bg-[#0c1020] border border-blue-900/30 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Database size={22} className="text-blue-400" />
                PROCUREMENT & AUDIT FUSION
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase rounded-full">FED MIRROR ACTIVE</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">SAM.gov • CAGE/UEI Validation • Federal Audit Mirror — What the Feds see, you see.</p>
            </div>

            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'SAM.gov Registered', value: String(PROCUREMENT_STATUS.filter(p => p.samStatus === 'ACTIVE').length), total: String(PROCUREMENT_STATUS.length), color: 'emerald' },
                  { label: 'Exclusion Checks', value: String(PROCUREMENT_STATUS.filter(p => p.exclusion === 'CHECK PENDING').length), total: 'Pending', color: 'red' },
                  { label: 'Fed Audits Active', value: String(PROCUREMENT_STATUS.filter(p => p.fedAuditStatus.includes('Audit')).length), total: 'Running', color: 'blue' },
                  { label: 'Debarment Flags', value: String(PROCUREMENT_STATUS.filter(p => p.debarred).length), total: 'None', color: 'emerald' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className={cn("text-2xl font-black", `text-${s.color}-400`)}>{s.value}</p>
                    <p className="text-[10px] text-slate-500">{s.total}</p>
                  </div>
                ))}
              </div>

              {/* Procurement Table */}
              <div className="space-y-3">
                {PROCUREMENT_STATUS.map((p, i) => (
                  <div key={i} className={cn("flex items-center justify-between p-4 rounded-2xl border transition-all", p.color === 'emerald' ? 'bg-emerald-950/15 border-emerald-800/20' : p.color === 'red' ? 'bg-red-950/15 border-red-800/20' : p.color === 'amber' ? 'bg-amber-950/15 border-amber-800/20' : 'bg-white/5 border-white/10')}>
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", p.samStatus === 'ACTIVE' ? 'bg-emerald-600/20 border-emerald-500/30' : 'bg-slate-800 border-slate-700')}>
                        <Building2 size={18} className={p.samStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-500'} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{p.entity}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] text-slate-500">UEI: <span className="font-mono text-slate-400">{p.uei}</span></span>
                          <span className="text-[10px] text-slate-500">CAGE: <span className="font-mono text-slate-400">{p.cage}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase", p.samStatus === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : p.samStatus === 'NOT REGISTERED' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400')}>SAM: {p.samStatus}</span>
                      </div>
                      <div className="text-right">
                        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase", p.exclusion === 'CHECK PENDING' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400')}>Excl: {p.exclusion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Federal Audit Mirror */}
              <div className="mt-6 bg-blue-950/30 border border-blue-800/20 rounded-2xl p-5">
                <h3 className="text-xs font-black text-blue-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                  <Globe size={14} /> Federal Audit Mirror — Live Feed
                </h3>
                <div className="space-y-2">
                  {PROCUREMENT_STATUS.filter(p => p.fedAuditStatus.includes('Audit') || p.fedAuditStatus.includes('Federal') || p.fedAuditStatus.includes('⚠️')).map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-bold text-white">{p.entity}</span>
                      </div>
                      <span className={cn("text-[10px] font-bold", p.fedAuditStatus.includes('⚠️') ? 'text-red-400' : 'text-blue-300')}>{p.fedAuditStatus}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-blue-400/60 mt-3 font-medium">
                  <Shield size={10} className="inline mr-1" /> Every query the Feds run on the Defendants is captured and mirrored here in real-time. You see what the Feds see.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SECTION: ATTORNEY-NODE MAPPING & GHOST-WALL ═══ */}
      {activeSection === 'attorney_nodes' && (
        <div className="space-y-6">
          {/* Ghost-Wall Status Banner */}
          <div className="bg-gradient-to-r from-red-950/50 to-slate-950 border border-red-900/40 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={120} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-xl font-black text-white">GHOST-WALL DEFENSE SYSTEM</h2>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">ONLINE</span>
              </div>
              <p className="text-sm text-slate-400 max-w-3xl">
                Defense attorneys attempting to access your dashboard are fed a <span className="text-red-400 font-black">Simulated-Compliance-Environment</span> (decoy dashboard) showing the case is "Pending" with no movement. They think they are watching you, while you are actually watching <span className="text-amber-400 font-bold">them</span> watch a fake version of your platform.
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Decoys:</span>
                  <span className="text-lg font-black text-red-400">{activeGhostWalls}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Standby:</span>
                  <span className="text-lg font-black text-slate-400">{ATTORNEY_NODES.length - activeGhostWalls}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Filing Alerts:</span>
                  <span className="text-lg font-black text-amber-400">{ATTORNEY_NODES.filter(n => n.filingAlert).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attorney Node Grid */}
          <div className="bg-[#0c1020] border border-indigo-900/30 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Crosshair size={22} className="text-indigo-400" />
                ATTORNEY-NODE MAPPING — All {ATTORNEY_NODES.length} Defense Counsel Tracked
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {ATTORNEY_NODES.map((node, i) => (
                <div key={i} className={cn(
                  "rounded-2xl border p-4 transition-all",
                  node.decoyActive ? 'bg-red-950/10 border-red-800/20' : 'bg-white/[0.02] border-white/10'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border relative",
                        node.decoyActive ? 'bg-red-600/20 border-red-500/30' : 'bg-slate-800 border-slate-700'
                      )}>
                        <Crosshair size={18} className={node.decoyActive ? 'text-red-400' : 'text-slate-500'} />
                        {node.decoyActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0c1020] animate-pulse" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">{node.attorney}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{node.firm}</span>
                          {node.vpnDetected && <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">VPN DETECTED</span>}
                          {node.filingAlert && <span className="text-[9px] font-black text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full animate-pulse">⚠️ FILING ALERT</span>}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] text-slate-500">IP Range: <span className="font-mono text-slate-400">{node.ipRange}</span></span>
                          <span className="text-[10px] text-slate-500">Last Ping: <span className="font-bold text-slate-400">{node.lastPing}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
                        node.decoyActive ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                      )}>
                        {node.decoyActive ? '👁️ GHOST-WALL ACTIVE' : '💤 STANDBY'}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs text-right">{node.ghostWallStatus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trefil/Swedlow Circuit Filing Monitor */}
          <div className="bg-[#0c1020] border border-amber-900/30 rounded-3xl p-6">
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="animate-pulse" /> TREFIL / SWEDLOW CIRCUIT BYPASS TRAP
            </h3>
            <div className="bg-amber-950/20 border border-amber-800/20 rounded-2xl p-4">
              <p className="text-xs text-amber-200 leading-relaxed">
                The Circuit <span className="font-black text-white">refused their withdrawal</span>. Sylara is monitoring their firms' internal IP traffic continuously. If they attempt to file anything in the District Court (the "Procedural Minefield"), the system will trigger a <span className="font-black text-red-400">Circuit-Notification-Alert</span> — you will have proof they are trying to bypass the Circuit <span className="italic">before they even finish the filing</span>.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">Circuit Gateway: SCANNING</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">District Court Trap: ARMED</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">SINC Ledger: LOCKED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
          SYLARA Litigation Engine • Ghost-Wall Defense System • Sabotage-Vector Heatmap • Procurement Fusion
        </p>
        <p className="text-[9px] text-slate-700 mt-1">
          Classification: FOUNDER EYES ONLY — Continuous deep-scan monitoring active — Unauthorized access is a federal offense
        </p>
      </div>
    </div>
  );
};

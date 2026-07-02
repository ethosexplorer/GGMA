import React, { useState, useEffect, useRef } from 'react';
import {
  Eye, Shield, AlertTriangle, Building2, Truck, Camera, FileCheck, BarChart3,
  MapPin, Bell, Clock, Users, Zap, Radio, Target, Lock, Wifi, Activity,
  ChevronRight, ExternalLink, Search, Filter, Download, RefreshCw,
  CheckCircle2, XCircle, TrendingUp, TrendingDown, ArrowUpRight, Layers, Bot
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { LarryMedCardChatbot } from '../LarryMedCardChatbot';

// ═══════════════════════════════════════════════════
// CEYE — Command Enforcement Yield Ecosystem
// "See Everything, Understand More, Decide Better"
// ═══════════════════════════════════════════════════

interface CEYEProps {
  role?: 'founder' | 'enforcement' | 'state_authority' | 'federal' | 'president';
  compact?: boolean;
}

// ── SIMULATED FACILITY DATA ──
const FACILITIES = [
  { id: 'FAC-001', name: 'GreenLeaf Cultivation Center', city: 'Tulsa', state: 'OK', type: 'Cultivator', compliance: 94, risk: 'low', cameras: 12, lastInspection: '2026-06-28', lat: 36.15, lng: -95.99, alerts: 0, status: 'active' },
  { id: 'FAC-002', name: 'Oklahoma Premium Processors', city: 'Oklahoma City', state: 'OK', type: 'Processor', compliance: 87, risk: 'medium', cameras: 8, lastInspection: '2026-06-25', lat: 35.47, lng: -97.52, alerts: 2, status: 'active' },
  { id: 'FAC-003', name: 'MedRX Dispensary #14', city: 'Norman', state: 'OK', type: 'Dispensary', compliance: 91, risk: 'low', cameras: 6, lastInspection: '2026-06-30', lat: 35.22, lng: -97.44, alerts: 0, status: 'active' },
  { id: 'FAC-004', name: 'High Plains Testing Lab', city: 'Edmond', state: 'OK', type: 'Testing Lab', compliance: 98, risk: 'low', cameras: 4, lastInspection: '2026-06-29', lat: 35.65, lng: -97.48, alerts: 0, status: 'active' },
  { id: 'FAC-005', name: 'SunRise Farms Outdoor', city: 'Stillwater', state: 'OK', type: 'Cultivator', compliance: 72, risk: 'high', cameras: 3, lastInspection: '2026-06-15', lat: 36.12, lng: -97.06, alerts: 4, status: 'flagged' },
  { id: 'FAC-006', name: 'Valley Wellness Dispensary', city: 'Broken Arrow', state: 'OK', type: 'Dispensary', compliance: 89, risk: 'low', cameras: 6, lastInspection: '2026-06-27', lat: 36.05, lng: -95.78, alerts: 1, status: 'active' },
  { id: 'FAC-007', name: 'Pure Extract Co', city: 'Lawton', state: 'OK', type: 'Processor', compliance: 65, risk: 'critical', cameras: 2, lastInspection: '2026-05-20', lat: 34.60, lng: -98.39, alerts: 7, status: 'flagged' },
  { id: 'FAC-008', name: 'CrossState Transport Hub', city: 'Amarillo', state: 'TX', type: 'Transport Hub', compliance: 95, risk: 'low', cameras: 16, lastInspection: '2026-06-30', lat: 35.22, lng: -101.83, alerts: 0, status: 'active' },
  { id: 'FAC-009', name: 'Phoenix MedCanna Labs', city: 'Phoenix', state: 'AZ', type: 'Testing Lab', compliance: 96, risk: 'low', cameras: 10, lastInspection: '2026-06-28', lat: 33.45, lng: -112.07, alerts: 0, status: 'active' },
  { id: 'FAC-010', name: 'Desert Bloom Cultivation', city: 'Tucson', state: 'AZ', type: 'Cultivator', compliance: 88, risk: 'medium', cameras: 8, lastInspection: '2026-06-22', lat: 32.22, lng: -110.97, alerts: 1, status: 'active' },
  { id: 'FAC-011', name: 'Mile High Processors', city: 'Denver', state: 'CO', type: 'Processor', compliance: 93, risk: 'low', cameras: 14, lastInspection: '2026-06-29', lat: 39.74, lng: -104.99, alerts: 0, status: 'active' },
  { id: 'FAC-012', name: 'Rocky Mountain Dispensary', city: 'Boulder', state: 'CO', type: 'Dispensary', compliance: 97, risk: 'low', cameras: 6, lastInspection: '2026-06-30', lat: 40.01, lng: -105.27, alerts: 0, status: 'active' },
  { id: 'FAC-013', name: 'Great Plains Distribution', city: 'Wichita', state: 'KS', type: 'Transport Hub', compliance: 82, risk: 'medium', cameras: 10, lastInspection: '2026-06-20', lat: 37.69, lng: -97.34, alerts: 3, status: 'active' },
  { id: 'FAC-014', name: 'NorthStar Cannabis Co', city: 'Minneapolis', state: 'MN', type: 'Cultivator', compliance: 91, risk: 'low', cameras: 12, lastInspection: '2026-06-26', lat: 44.98, lng: -93.27, alerts: 0, status: 'active' },
  { id: 'FAC-015', name: 'Pacific Coast Testing', city: 'Portland', state: 'OR', type: 'Testing Lab', compliance: 99, risk: 'low', cameras: 8, lastInspection: '2026-06-30', lat: 45.52, lng: -122.68, alerts: 0, status: 'active' },
];

// ── SIMULATED TRANSPORT DATA ──
const TRANSPORTS = [
  { id: 'TRN-4401', driver: 'Marcus Johnson', vehicle: 'Unit 44-01 (Sprinter)', origin: 'GreenLeaf Cultivation', destination: 'MedRX Dispensary #14', status: 'in_transit', eta: '14:30 CST', weight: '12.4 lbs', manifest: 'MAN-88712', compliance: 'compliant', route: 'I-44 → US-77', progress: 72 },
  { id: 'TRN-4402', driver: 'Lisa Chen', vehicle: 'Unit 22-03 (Transit)', origin: 'OK Premium Processors', destination: 'Valley Wellness', status: 'in_transit', eta: '15:15 CST', weight: '8.2 lbs', manifest: 'MAN-88713', compliance: 'compliant', route: 'US-169 S', progress: 45 },
  { id: 'TRN-4403', driver: 'David Reyes', vehicle: 'Unit 33-07 (ProMaster)', origin: 'Pure Extract Co', destination: 'CrossState Hub', status: 'deviation', eta: '16:00 CST', weight: '22.1 lbs', manifest: 'MAN-88714', compliance: 'deviation_alert', route: 'I-44 W → DETOUR', progress: 38 },
  { id: 'TRN-4404', driver: 'Sarah Mitchell', vehicle: 'Unit 11-02 (Sprinter)', origin: 'High Plains Lab', destination: 'SunRise Farms', status: 'loading', eta: '17:30 CST', weight: '0.0 lbs', manifest: 'MAN-88715', compliance: 'pending', route: 'I-35 N', progress: 5 },
  { id: 'TRN-4405', driver: 'James Park', vehicle: 'Unit 55-01 (Box Truck)', origin: 'Mile High Processors', destination: 'Rocky Mountain Disp', status: 'delivered', eta: 'Delivered', weight: '45.6 lbs', manifest: 'MAN-88710', compliance: 'compliant', route: 'US-36 W', progress: 100 },
  { id: 'TRN-4406', driver: 'Ana Gutierrez', vehicle: 'Unit 66-04 (Transit)', origin: 'Desert Bloom Cult', destination: 'Phoenix MedCanna', status: 'in_transit', eta: '13:45 MST', weight: '15.8 lbs', manifest: 'MAN-88716', compliance: 'compliant', route: 'I-10 W → I-19', progress: 61 },
];

// ── SIMULATED ALERT STREAM ──
const ALERT_TEMPLATES = [
  { type: 'weight', severity: 'high', msg: 'Weight discrepancy detected: Manifest MAN-88714 shows 22.1 lbs, scale reads 21.3 lbs (-0.8 lbs)', facility: 'Pure Extract Co', icon: AlertTriangle },
  { type: 'route', severity: 'critical', msg: 'Route deviation alert: TRN-4403 deviated 2.4 miles from approved corridor on I-44 W', facility: 'CrossState Hub', icon: MapPin },
  { type: 'camera', severity: 'medium', msg: 'Camera CAM-07-B offline at SunRise Farms for 47 minutes — auto-reconnect failed', facility: 'SunRise Farms', icon: Camera },
  { type: 'license', severity: 'high', msg: 'License expiration warning: Pure Extract Co processing license expires in 12 days', facility: 'Pure Extract Co', icon: FileCheck },
  { type: 'compliance', severity: 'low', msg: 'Scheduled compliance audit completed: High Plains Testing Lab — Score: 98/100', facility: 'High Plains Lab', icon: CheckCircle2 },
  { type: 'access', severity: 'medium', msg: 'After-hours facility access: Badge #4412 entered GreenLeaf Cultivation at 02:17 AM', facility: 'GreenLeaf Cultivation', icon: Lock },
  { type: 'inventory', severity: 'high', msg: 'Inventory reconciliation gap: 340g unaccounted in daily audit at OK Premium Processors', facility: 'OK Premium Processors', icon: AlertTriangle },
  { type: 'transport', severity: 'low', msg: 'Transport TRN-4405 successfully delivered — all seals intact, weight verified ✓', facility: 'Rocky Mountain Disp', icon: CheckCircle2 },
  { type: 'sensor', severity: 'medium', msg: 'Temperature sensor alert: Grow Room 3 at Desert Bloom reading 94°F (threshold: 85°F)', facility: 'Desert Bloom Cult', icon: Activity },
  { type: 'regulatory', severity: 'high', msg: 'New OMMA regulatory update: Emergency rule change affecting processor waste disposal protocols', facility: 'System-Wide', icon: Shield },
  { type: 'camera', severity: 'critical', msg: 'Multiple cameras offline: FAC-007 Pure Extract — 2 of 2 cameras down simultaneously', facility: 'Pure Extract Co', icon: XCircle },
  { type: 'weight', severity: 'low', msg: 'Weight verification passed: TRN-4401 manifest matches within 0.02 lbs tolerance', facility: 'MedRX Dispensary', icon: CheckCircle2 },
];

// ── CAMERA FEED DATA ──
const CAMERA_FEEDS = [
  { id: 'CAM-01-A', facility: 'GreenLeaf Cultivation', location: 'Main Entrance', status: 'online', aiTags: ['Motion', 'Badge'], fps: 30, resolution: '4K' },
  { id: 'CAM-01-B', facility: 'GreenLeaf Cultivation', location: 'Grow Room 1', status: 'online', aiTags: ['Plant Health', 'Climate'], fps: 15, resolution: '1080p' },
  { id: 'CAM-02-A', facility: 'OK Premium Processors', location: 'Processing Floor', status: 'online', aiTags: ['PPE Check', 'Weight'], fps: 30, resolution: '4K' },
  { id: 'CAM-02-B', facility: 'OK Premium Processors', location: 'Loading Dock', status: 'online', aiTags: ['Vehicle', 'Manifest'], fps: 30, resolution: '4K' },
  { id: 'CAM-03-A', facility: 'MedRX Dispensary', location: 'Sales Floor', status: 'online', aiTags: ['ID Verify', 'POS'], fps: 30, resolution: '1080p' },
  { id: 'CAM-04-A', facility: 'High Plains Lab', location: 'Testing Suite', status: 'online', aiTags: ['Chain of Custody'], fps: 15, resolution: '1080p' },
  { id: 'CAM-05-A', facility: 'SunRise Farms', location: 'Perimeter North', status: 'degraded', aiTags: ['Intrusion'], fps: 10, resolution: '720p' },
  { id: 'CAM-05-B', facility: 'SunRise Farms', location: 'Greenhouse', status: 'online', aiTags: ['Climate', 'Growth'], fps: 15, resolution: '1080p' },
  { id: 'CAM-07-A', facility: 'Pure Extract Co', location: 'Extraction Lab', status: 'offline', aiTags: [], fps: 0, resolution: 'N/A' },
  { id: 'CAM-07-B', facility: 'Pure Extract Co', location: 'Storage Vault', status: 'offline', aiTags: [], fps: 0, resolution: 'N/A' },
  { id: 'CAM-08-A', facility: 'CrossState Hub', location: 'Bay 1', status: 'online', aiTags: ['Vehicle', 'Seal Check'], fps: 30, resolution: '4K' },
  { id: 'CAM-09-A', facility: 'Phoenix MedCanna', location: 'Lab Floor', status: 'online', aiTags: ['Chain of Custody'], fps: 30, resolution: '4K' },
];

const CEYE_TABS = [
  { id: 'command', label: 'Command', icon: Target },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'facilities', label: 'Facilities', icon: Building2 },
  { id: 'transport', label: 'Transport', icon: Truck },
  { id: 'cameras', label: 'Cameras', icon: Camera },
  { id: 'evidence', label: 'Evidence', icon: FileCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'gary', label: 'Gary AI', icon: Bot },
];

export const CEYECommandCenter: React.FC<CEYEProps> = ({ role = 'founder', compact = false }) => {
  const [activeTab, setActiveTab] = useState('command');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [mapPulse, setMapPulse] = useState(0);
  const alertIntervalRef = useRef<any>(null);

  // Generate rolling alerts
  useEffect(() => {
    const initial = ALERT_TEMPLATES.slice(0, 6).map((a, i) => ({
      ...a,
      id: `ALT-${1000 + i}`,
      time: new Date(Date.now() - i * 120000).toLocaleTimeString(),
      timestamp: Date.now() - i * 120000,
    }));
    setAlerts(initial);

    alertIntervalRef.current = setInterval(() => {
      const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
      const newAlert = {
        ...template,
        id: `ALT-${Date.now().toString(36)}`,
        time: new Date().toLocaleTimeString(),
        timestamp: Date.now(),
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    }, 8000);

    return () => clearInterval(alertIntervalRef.current);
  }, []);

  // Map pulse animation
  useEffect(() => {
    const iv = setInterval(() => setMapPulse(p => p + 1), 2000);
    return () => clearInterval(iv);
  }, []);

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const riskColor = (r: string) => {
    switch (r) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-amber-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'in_transit': return { label: 'In Transit', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'deviation': return { label: 'DEVIATION', color: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' };
      case 'loading': return { label: 'Loading', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'delivered': return { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      default: return { label: s, color: 'bg-slate-500/20 text-slate-400' };
    }
  };

  const alertCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length;

  // ═══ RENDER: COMMAND MAP ═══
  const renderCommandMap = () => (
    <div className="space-y-6">
      {/* Live Map Visualization */}
      <div className="relative bg-[#060d1a] border border-cyan-900/30 rounded-2xl overflow-hidden" style={{ height: '480px' }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Radial glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)'
        }} />

        {/* Map Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-[#060d1a] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">Live Sensor Fusion Map</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Active</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full" /> Alert</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> Transport</span>
          </div>
        </div>

        {/* Facility Nodes */}
        {FACILITIES.map((f, i) => {
          const x = 10 + ((f.lng + 122.7) / 32) * 80;
          const y = 10 + ((46 - f.lat) / 16) * 80;
          const isSelected = selectedFacility === f.id;
          const nodeColor = f.risk === 'critical' ? 'bg-red-500' : f.risk === 'high' ? 'bg-amber-500' : 'bg-emerald-500';
          const pulseColor = f.risk === 'critical' ? 'bg-red-400' : f.risk === 'high' ? 'bg-amber-400' : 'bg-emerald-400';

          return (
            <button
              key={f.id}
              onClick={() => setSelectedFacility(isSelected ? null : f.id)}
              className="absolute z-10 group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Pulse ring */}
              {(f.alerts > 0 || f.risk === 'critical') && (
                <div className={cn("absolute inset-0 rounded-full animate-ping opacity-30", pulseColor)} style={{ width: '24px', height: '24px', margin: '-4px' }} />
              )}
              {/* Node */}
              <div className={cn(
                "w-4 h-4 rounded-full border-2 border-[#060d1a] transition-all shadow-lg",
                nodeColor,
                isSelected && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#060d1a] scale-150"
              )} />
              {/* Label */}
              <div className={cn(
                "absolute left-6 top-1/2 -translate-y-1/2 bg-[#0c1526] border border-slate-700/50 rounded-lg px-2 py-1 whitespace-nowrap transition-all shadow-xl",
                isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
              )}>
                <p className="text-[10px] font-bold text-white">{f.name}</p>
                <p className="text-[9px] text-slate-500">{f.city}, {f.state} • {f.type}</p>
              </div>
            </button>
          );
        })}

        {/* Transport Routes (animated dashes) */}
        {TRANSPORTS.filter(t => t.status === 'in_transit' || t.status === 'deviation').map((t, i) => {
          const startX = 30 + i * 12;
          const startY = 40 + i * 8;
          const endX = startX + 15;
          const endY = startY - 5;
          return (
            <svg key={t.id} className="absolute inset-0 w-full h-full pointer-events-none z-5" style={{ overflow: 'visible' }}>
              <line
                x1={`${startX}%`} y1={`${startY}%`}
                x2={`${endX}%`} y2={`${endY}%`}
                stroke={t.status === 'deviation' ? '#ef4444' : '#06b6d4'}
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.6"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
              </line>
              {/* Transport icon */}
              <circle cx={`${startX + (endX - startX) * (t.progress / 100)}%`} cy={`${startY + (endY - startY) * (t.progress / 100)}%`} r="5" fill={t.status === 'deviation' ? '#ef4444' : '#06b6d4'} opacity="0.9">
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          );
        })}

        {/* Selected Facility Detail Panel */}
        {selectedFacility && (() => {
          const f = FACILITIES.find(fac => fac.id === selectedFacility);
          if (!f) return null;
          return (
            <div className="absolute bottom-4 left-4 right-4 bg-[#0c1526]/95 backdrop-blur-md border border-cyan-800/30 rounded-2xl p-5 z-30 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("w-3 h-3 rounded-full", riskColor(f.risk))} />
                    <h3 className="text-lg font-black text-white">{f.name}</h3>
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase border", f.status === 'flagged' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30')}>{f.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">{f.city}, {f.state} • {f.type} • {f.id}</p>
                </div>
                <button onClick={() => setSelectedFacility(null)} className="text-slate-500 hover:text-white transition-colors">
                  <XCircle size={18} />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3 mt-4">
                {[
                  { label: 'Compliance', value: `${f.compliance}%`, color: f.compliance >= 90 ? 'text-emerald-400' : f.compliance >= 75 ? 'text-amber-400' : 'text-red-400' },
                  { label: 'Risk Level', value: f.risk.toUpperCase(), color: f.risk === 'low' ? 'text-emerald-400' : f.risk === 'medium' ? 'text-amber-400' : 'text-red-400' },
                  { label: 'Cameras', value: `${f.cameras} Active`, color: 'text-cyan-400' },
                  { label: 'Active Alerts', value: String(f.alerts), color: f.alerts > 0 ? 'text-red-400' : 'text-emerald-400' },
                  { label: 'Last Inspection', value: f.lastInspection, color: 'text-slate-300' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                    <p className={cn("text-sm font-black mt-0.5", s.color)}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label: 'Total Facilities', value: FACILITIES.length.toString(), icon: Building2, color: 'cyan' },
          { label: 'Active Transports', value: TRANSPORTS.filter(t => t.status === 'in_transit').length.toString(), icon: Truck, color: 'cyan' },
          { label: 'Cameras Online', value: `${CAMERA_FEEDS.filter(c => c.status === 'online').length}/${CAMERA_FEEDS.length}`, icon: Camera, color: 'emerald' },
          { label: 'Active Alerts', value: alertCount.toString(), icon: AlertTriangle, color: alertCount > 3 ? 'red' : 'amber' },
          { label: 'Avg Compliance', value: `${Math.round(FACILITIES.reduce((a, f) => a + f.compliance, 0) / FACILITIES.length)}%`, icon: Shield, color: 'emerald' },
          { label: 'Route Deviations', value: TRANSPORTS.filter(t => t.status === 'deviation').length.toString(), icon: MapPin, color: TRANSPORTS.some(t => t.status === 'deviation') ? 'red' : 'emerald' },
        ].map((s, i) => {
          const colors: Record<string, string> = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400' };
          const bgColors: Record<string, string> = { cyan: 'bg-cyan-500/10 border-cyan-500/20', emerald: 'bg-emerald-500/10 border-emerald-500/20', amber: 'bg-amber-500/10 border-amber-500/20', red: 'bg-red-500/10 border-red-500/20' };
          return (
            <div key={i} className={cn("rounded-xl p-4 text-center border transition-all hover:scale-[1.02]", bgColors[s.color])}>
              <s.icon size={18} className={cn("mx-auto mb-2", colors[s.color])} />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className={cn("text-xl font-black mt-1", colors[s.color])}>{s.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ═══ RENDER: ALERTS ═══
  const renderAlerts = () => (
    <div className="space-y-4">
      {/* Alert Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-black text-white">Live Alert Feed</h3>
          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-full border border-red-500/30 animate-pulse">{alerts.length} Active</span>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setSearchQuery(f === 'all' ? '' : f)}
              className={cn("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
                searchQuery === f || (f === 'all' && !searchQuery) ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'
              )}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Alert Stream */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {alerts
          .filter(a => !searchQuery || a.severity === searchQuery)
          .map((alert, i) => {
            const AlertIcon = alert.icon;
            return (
              <div key={alert.id || i} className={cn("p-4 rounded-xl border transition-all hover:bg-white/[0.03]", severityColor(alert.severity))}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", severityColor(alert.severity))}>
                    <AlertIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase border", severityColor(alert.severity))}>{alert.severity}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[8px] font-bold rounded uppercase">{alert.type}</span>
                      <span className="text-[10px] text-slate-600 font-mono ml-auto">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{alert.msg}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">📍 {alert.facility}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );

  // ═══ RENDER: FACILITIES ═══
  const renderFacilities = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white">Monitored Facilities</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-64"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {FACILITIES
          .filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.state.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(f => (
            <div key={f.id} className={cn("bg-white/[0.03] border rounded-2xl p-5 hover:bg-white/[0.05] transition-all cursor-pointer group", f.status === 'flagged' ? 'border-red-800/40' : 'border-white/10')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", riskColor(f.risk))} />
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors">{f.name}</span>
                </div>
                {f.alerts > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black rounded-full animate-pulse">{f.alerts} Alert{f.alerts > 1 ? 's' : ''}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mb-3">{f.city}, {f.state} • {f.type} • {f.id}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase">Compliance</p>
                  <p className={cn("text-sm font-black", f.compliance >= 90 ? 'text-emerald-400' : f.compliance >= 75 ? 'text-amber-400' : 'text-red-400')}>{f.compliance}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase">Cameras</p>
                  <p className="text-sm font-black text-cyan-400">{f.cameras}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase">Risk</p>
                  <p className={cn("text-sm font-black uppercase", f.risk === 'low' ? 'text-emerald-400' : f.risk === 'medium' ? 'text-amber-400' : 'text-red-400')}>{f.risk}</p>
                </div>
              </div>
              {/* Compliance bar */}
              <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", f.compliance >= 90 ? 'bg-emerald-500' : f.compliance >= 75 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${f.compliance}%` }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // ═══ RENDER: TRANSPORT ═══
  const renderTransport = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white">Active Transport Manifests</h3>
        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black rounded-full border border-cyan-500/20">
          {TRANSPORTS.filter(t => t.status === 'in_transit').length} In Transit
        </span>
      </div>
      <div className="space-y-3">
        {TRANSPORTS.map(t => {
          const badge = statusBadge(t.status);
          return (
            <div key={t.id} className={cn("bg-white/[0.03] border rounded-2xl p-5 transition-all hover:bg-white/[0.05]", t.status === 'deviation' ? 'border-red-800/40' : 'border-white/10')}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-white">{t.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase border", badge.color)}>{badge.label}</span>
                    {t.compliance === 'deviation_alert' && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black rounded-full border border-red-500/30 animate-pulse">⚠️ DEVIATION</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{t.driver} • {t.vehicle}</p>
                </div>
                <span className="text-xs font-bold text-slate-400">ETA: {t.eta}</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="bg-white/5 rounded-lg p-2"><p className="text-[8px] font-black text-slate-500 uppercase">From</p><p className="text-xs font-bold text-white truncate">{t.origin}</p></div>
                <div className="bg-white/5 rounded-lg p-2"><p className="text-[8px] font-black text-slate-500 uppercase">To</p><p className="text-xs font-bold text-white truncate">{t.destination}</p></div>
                <div className="bg-white/5 rounded-lg p-2"><p className="text-[8px] font-black text-slate-500 uppercase">Weight</p><p className="text-xs font-bold text-cyan-400">{t.weight}</p></div>
                <div className="bg-white/5 rounded-lg p-2"><p className="text-[8px] font-black text-slate-500 uppercase">Manifest</p><p className="text-xs font-bold text-slate-300 font-mono">{t.manifest}</p></div>
              </div>
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-slate-500">{t.route}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", t.status === 'deviation' ? 'bg-red-500' : t.status === 'delivered' ? 'bg-emerald-500' : 'bg-cyan-500')}
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
                <span className="text-[9px] font-bold text-cyan-400">{t.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ═══ RENDER: CAMERAS ═══
  const renderCameras = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-white">Camera Network</h3>
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <span className="text-emerald-400">{CAMERA_FEEDS.filter(c => c.status === 'online').length} Online</span>
          <span className="text-amber-400">{CAMERA_FEEDS.filter(c => c.status === 'degraded').length} Degraded</span>
          <span className="text-red-400">{CAMERA_FEEDS.filter(c => c.status === 'offline').length} Offline</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {CAMERA_FEEDS.map(cam => (
          <div key={cam.id} className={cn("rounded-2xl border overflow-hidden transition-all hover:scale-[1.02]",
            cam.status === 'offline' ? 'border-red-800/40 opacity-60' : cam.status === 'degraded' ? 'border-amber-800/40' : 'border-white/10'
          )}>
            {/* Camera feed placeholder */}
            <div className={cn("h-32 relative flex items-center justify-center",
              cam.status === 'offline' ? 'bg-red-950/30' : 'bg-[#0a1020]'
            )}>
              {cam.status === 'offline' ? (
                <div className="text-center">
                  <XCircle size={24} className="text-red-500 mx-auto mb-1" />
                  <p className="text-[10px] font-black text-red-400 uppercase">Signal Lost</p>
                </div>
              ) : (
                <>
                  {/* Simulated feed lines */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.1) 2px, rgba(6,182,212,0.1) 4px)',
                  }} />
                  <Camera size={28} className="text-slate-700" />
                  {/* AI badge */}
                  {cam.aiTags.length > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500/30 text-indigo-300 text-[8px] font-black rounded-full border border-indigo-500/40 flex items-center gap-1">
                      <Zap size={8} /> AI
                    </div>
                  )}
                  {/* Status indicator */}
                  <div className={cn("absolute top-2 left-2 w-2.5 h-2.5 rounded-full border border-[#0a1020]",
                    cam.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  )} />
                  {/* FPS */}
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-slate-600">{cam.fps}fps • {cam.resolution}</span>
                </>
              )}
            </div>
            <div className="p-3 bg-white/[0.02]">
              <p className="text-xs font-bold text-white truncate">{cam.id}</p>
              <p className="text-[10px] text-slate-500 truncate">{cam.facility} — {cam.location}</p>
              {cam.aiTags.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {cam.aiTags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-bold rounded border border-indigo-500/20">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══ RENDER: EVIDENCE ═══
  const renderEvidence = () => {
    const evidenceItems = alerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 10);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">Evidence Builder</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500">{selectedEvidence.size} items selected</span>
            <button
              disabled={selectedEvidence.size === 0}
              className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
                selectedEvidence.size > 0
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              )}
            >
              <Download size={14} /> Generate Package
            </button>
          </div>
        </div>

        <div className="bg-cyan-950/20 border border-cyan-800/20 rounded-xl p-4 mb-4">
          <p className="text-[10px] font-bold text-cyan-300">
            <Shield size={12} className="inline mr-1" />
            Select events below to compile a court-ready evidence package. All items include timestamped metadata, chain-of-custody logs, and SHA-256 integrity hashes.
          </p>
        </div>

        <div className="space-y-2">
          {evidenceItems.map((item, i) => {
            const isSelected = selectedEvidence.has(item.id);
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id || i}
                onClick={() => {
                  setSelectedEvidence(prev => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id);
                    else next.add(item.id);
                    return next;
                  });
                }}
                className={cn(
                  "w-full p-4 rounded-xl border transition-all text-left flex items-start gap-3",
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20"
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
                )}
              >
                <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  isSelected ? "bg-cyan-500 border-cyan-500" : "border-slate-600"
                )}>
                  {isSelected && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", severityColor(item.severity))}>
                  <ItemIcon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase border", severityColor(item.severity))}>{item.severity}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{item.msg}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">📍 {item.facility}</p>
                </div>
              </button>
            );
          })}
        </div>

        {evidenceItems.length === 0 && (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <Shield size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600">No critical events to build evidence from</p>
            <p className="text-xs text-slate-700 mt-1">High-severity alerts will appear here for evidence compilation</p>
          </div>
        )}
      </div>
    );
  };

  // ═══ RENDER: ANALYTICS ═══
  const renderAnalytics = () => {
    const complianceData = [94, 87, 91, 98, 72, 89, 65, 95, 96, 88, 93, 97];
    const maxCompliance = Math.max(...complianceData);
    const riskDist = { low: FACILITIES.filter(f => f.risk === 'low').length, medium: FACILITIES.filter(f => f.risk === 'medium').length, high: FACILITIES.filter(f => f.risk === 'high').length, critical: FACILITIES.filter(f => f.risk === 'critical').length };
    const totalFac = FACILITIES.length;

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-black text-white">CEYE Analytics Dashboard</h3>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Avg Compliance Score', value: `${Math.round(FACILITIES.reduce((a, f) => a + f.compliance, 0) / FACILITIES.length)}%`, trend: '+2.3%', up: true, color: 'emerald' },
            { label: 'Total Monitored Facilities', value: FACILITIES.length.toString(), trend: '+3 this month', up: true, color: 'cyan' },
            { label: 'Critical Risk Facilities', value: FACILITIES.filter(f => f.risk === 'critical' || f.risk === 'high').length.toString(), trend: '-1 resolved', up: false, color: 'red' },
            { label: 'Transport Compliance Rate', value: `${Math.round((TRANSPORTS.filter(t => t.compliance === 'compliant').length / TRANSPORTS.length) * 100)}%`, trend: 'Stable', up: true, color: 'cyan' },
          ].map((card, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{card.label}</p>
              <p className={cn("text-3xl font-black", `text-${card.color}-400`)}>{card.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {card.up ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-red-400" />}
                <span className={cn("text-[10px] font-bold", card.up ? 'text-emerald-400' : 'text-red-400')}>{card.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Compliance by Facility */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Compliance by Facility</h4>
            <div className="flex items-end gap-2 h-40">
              {FACILITIES.slice(0, 12).map((f, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className={cn("w-full rounded-t-lg transition-all group-hover:opacity-100 opacity-80",
                      f.compliance >= 90 ? 'bg-emerald-500' : f.compliance >= 75 ? 'bg-amber-500' : 'bg-red-500'
                    )}
                    style={{ height: `${(f.compliance / maxCompliance) * 100}%` }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-slate-800 text-white text-[9px] px-2 py-1 rounded font-bold whitespace-nowrap z-10 shadow-xl">
                    {f.name.substring(0, 20)} — {f.compliance}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Risk Distribution</h4>
            <div className="space-y-3">
              {[
                { label: 'Low Risk', count: riskDist.low, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                { label: 'Medium Risk', count: riskDist.medium, color: 'bg-amber-500', textColor: 'text-amber-400' },
                { label: 'High Risk', count: riskDist.high, color: 'bg-orange-500', textColor: 'text-orange-400' },
                { label: 'Critical', count: riskDist.critical, color: 'bg-red-500', textColor: 'text-red-400' },
              ].map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400">{r.label}</span>
                    <span className={cn("text-xs font-black", r.textColor)}>{r.count} ({Math.round((r.count / totalFac) * 100)}%)</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", r.color)} style={{ width: `${(r.count / totalFac) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Type Breakdown */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Alert Types (Last 24h)</h5>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Weight', count: alerts.filter(a => a.type === 'weight').length, color: 'text-amber-400' },
                  { label: 'Route', count: alerts.filter(a => a.type === 'route').length, color: 'text-red-400' },
                  { label: 'Camera', count: alerts.filter(a => a.type === 'camera').length, color: 'text-cyan-400' },
                  { label: 'License', count: alerts.filter(a => a.type === 'license').length, color: 'text-violet-400' },
                  { label: 'Access', count: alerts.filter(a => a.type === 'access').length, color: 'text-orange-400' },
                  { label: 'Sensor', count: alerts.filter(a => a.type === 'sensor').length, color: 'text-yellow-400' },
                ].map((t, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                    <p className={cn("text-lg font-black", t.color)}>{t.count}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══ MAIN RENDER ═══
  return (
    <div className="min-h-screen bg-[#060a14] text-white overflow-y-auto">
      {/* ═══ HEADER ═══ */}
      <div className="relative overflow-hidden border-b border-cyan-900/30" style={{ background: 'linear-gradient(135deg, #060a14 0%, #0a1628 50%, #060a14 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(6,182,212,0.4) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(16,185,129,0.3) 0%, transparent 50%)' }} />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-600 via-emerald-500 to-cyan-600" />

        <div className="relative z-10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-cyan-600/20 border-2 border-cyan-500/40 rounded-2xl flex items-center justify-center relative">
                <Eye size={28} className="text-cyan-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#060a14] animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  CEYE Command Center
                  <span className="px-3 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-0.5">
                  Command Enforcement Yield Ecosystem — <span className="text-cyan-400 font-bold italic">"See Everything, Understand More, Decide Better"</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">View Mode</p>
                <p className="text-xs font-bold text-white capitalize">{role.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Sensors', status: 'online', color: 'emerald' },
                  { label: 'Cameras', status: `${CAMERA_FEEDS.filter(c => c.status === 'online').length}/${CAMERA_FEEDS.length}`, color: CAMERA_FEEDS.some(c => c.status === 'offline') ? 'amber' : 'emerald' },
                  { label: 'Network', status: 'secure', color: 'emerald' },
                ].map((s, i) => (
                  <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase">{s.label}</p>
                    <p className={cn("text-[10px] font-black uppercase", `text-${s.color}-400`)}>{s.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TAB BAR ═══ */}
      <div className="border-b border-white/10 bg-[#080d1a] px-8">
        <div className="flex items-center gap-1">
          {CEYE_TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[2px]",
                  isActive
                    ? "text-cyan-400 border-cyan-400 bg-cyan-500/5"
                    : "text-slate-500 border-transparent hover:text-white hover:bg-white/5"
                )}
              >
                <TabIcon size={14} />
                {tab.label}
                {tab.id === 'alerts' && alertCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[18px] text-center">{alertCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="p-8">
        {activeTab === 'command' && renderCommandMap()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'facilities' && renderFacilities()}
        {activeTab === 'transport' && renderTransport()}
        {activeTab === 'cameras' && renderCameras()}
        {activeTab === 'evidence' && renderEvidence()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'gary' && (
          <div className="bg-[#0b1324] rounded-3xl border border-cyan-900/30 overflow-hidden shadow-2xl max-w-4xl mx-auto" style={{ height: '650px' }}>
            <LarryMedCardChatbot variant="gary" inline={true} activeRole={role} />
          </div>
        )}
      </div>
    </div>
  );
};

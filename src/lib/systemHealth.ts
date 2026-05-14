// Real-Time System Health Monitor
// Pings actual services and detects freezes, latency spikes, outages

import { turso } from './turso';
import { db } from '../firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export interface ServiceHealth {
  name: string;
  status: 'online' | 'degraded' | 'offline' | 'checking';
  latencyMs: number;
  lastChecked: string;
  error?: string;
  details?: string;
}

export interface SystemHealthReport {
  overallStatus: 'healthy' | 'degraded' | 'critical' | 'frozen';
  services: ServiceHealth[];
  freezeDetected: boolean;
  freezeReason?: string;
  timestamp: string;
  uptimePercent: number;
  avgLatencyMs: number;
  criticalCount: number;
  degradedCount: number;
}

// Threshold configuration
const LATENCY_WARN_MS = 3000;   // 3 seconds = degraded
const LATENCY_CRITICAL_MS = 8000; // 8 seconds = critical
const FREEZE_THRESHOLD = 2;      // 2+ critical services = freeze

async function checkTurso(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const result = await Promise.race([
      turso.execute('SELECT 1 as ping'),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    const latency = Date.now() - start;
    const rows = (result as any)?.rows?.length || 0;
    return {
      name: 'Turso Database',
      status: latency > LATENCY_CRITICAL_MS ? 'degraded' : (latency > LATENCY_WARN_MS ? 'degraded' : 'online'),
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      details: `${rows} row(s) returned in ${latency}ms`
    };
  } catch (err: any) {
    return {
      name: 'Turso Database',
      status: 'offline',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: err.message || 'Connection failed',
      details: 'Database unreachable'
    };
  }
}

async function checkFirestore(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const q = query(collection(db, 'users'), limit(1));
    await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    const latency = Date.now() - start;
    return {
      name: 'Firebase / Firestore',
      status: latency > LATENCY_CRITICAL_MS ? 'degraded' : (latency > LATENCY_WARN_MS ? 'degraded' : 'online'),
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      details: `Auth & data layer responding in ${latency}ms`
    };
  } catch (err: any) {
    return {
      name: 'Firebase / Firestore',
      status: 'offline',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: err.message || 'Connection failed',
      details: 'Authentication & data layer unreachable'
    };
  }
}

async function checkVercelEdge(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const res = await Promise.race([
      fetch('https://www.ggp-os.com/', { method: 'HEAD', mode: 'no-cors' }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    const latency = Date.now() - start;
    return {
      name: 'Vercel Edge (ggp-os.com)',
      status: latency > LATENCY_CRITICAL_MS ? 'degraded' : (latency > LATENCY_WARN_MS ? 'degraded' : 'online'),
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      details: `CDN edge responding in ${latency}ms`
    };
  } catch (err: any) {
    return {
      name: 'Vercel Edge (ggp-os.com)',
      status: 'offline',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: err.message || 'Unreachable',
      details: 'Production CDN unreachable'
    };
  }
}

async function checkTextBelt(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const res = await Promise.race([
      fetch('https://textbelt.com/status/test', { method: 'GET' }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    const latency = Date.now() - start;
    return {
      name: 'TextBelt SMS Gateway',
      status: latency > LATENCY_CRITICAL_MS ? 'degraded' : (latency > LATENCY_WARN_MS ? 'degraded' : 'online'),
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      details: `SMS gateway responding in ${latency}ms`
    };
  } catch (err: any) {
    return {
      name: 'TextBelt SMS Gateway',
      status: 'offline',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: err.message || 'Unreachable',
      details: 'SMS delivery service unreachable'
    };
  }
}

async function checkVoIP(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // Check if VoIP/Twilio is reachable
    const res = await Promise.race([
      fetch('https://api.twilio.com/', { method: 'HEAD', mode: 'no-cors' }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    const latency = Date.now() - start;
    return {
      name: 'VoIP / Twilio',
      status: latency > LATENCY_CRITICAL_MS ? 'degraded' : (latency > LATENCY_WARN_MS ? 'degraded' : 'online'),
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      details: `Voice & telephony in ${latency}ms`
    };
  } catch (err: any) {
    return {
      name: 'VoIP / Twilio',
      status: 'offline',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: err.message || 'Unreachable',
      details: 'Telephony infrastructure unreachable'
    };
  }
}

async function checkStripe(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const res = await Promise.race([
      fetch('https://api.stripe.com/', { method: 'HEAD', mode: 'no-cors' }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);
    const latency = Date.now() - start;
    return {
      name: 'Stripe Payments',
      status: latency > LATENCY_CRITICAL_MS ? 'degraded' : (latency > LATENCY_WARN_MS ? 'degraded' : 'online'),
      latencyMs: latency,
      lastChecked: new Date().toISOString(),
      details: `Payment processing in ${latency}ms`
    };
  } catch (err: any) {
    return {
      name: 'Stripe Payments',
      status: 'offline',
      latencyMs: Date.now() - start,
      lastChecked: new Date().toISOString(),
      error: err.message || 'Unreachable',
      details: 'Payment processing unreachable'
    };
  }
}

/**
 * Run a full health check across all services
 * Returns structured report with freeze detection
 */
export async function runHealthCheck(): Promise<SystemHealthReport> {
  const services = await Promise.allSettled([
    checkTurso(),
    checkFirestore(),
    checkVercelEdge(),
    checkTextBelt(),
    checkVoIP(),
    checkStripe()
  ]);

  const results: ServiceHealth[] = services.map(s => 
    s.status === 'fulfilled' ? s.value : {
      name: 'Unknown Service',
      status: 'offline' as const,
      latencyMs: 10000,
      lastChecked: new Date().toISOString(),
      error: 'Health check failed'
    }
  );

  const criticalCount = results.filter(s => s.status === 'offline').length;
  const degradedCount = results.filter(s => s.status === 'degraded').length;
  const onlineCount = results.filter(s => s.status === 'online').length;
  const totalLatency = results.reduce((sum, s) => sum + s.latencyMs, 0);
  const avgLatency = Math.round(totalLatency / results.length);
  const uptimePercent = Math.round((onlineCount / results.length) * 100);

  const freezeDetected = criticalCount >= FREEZE_THRESHOLD;
  let freezeReason: string | undefined;
  if (freezeDetected) {
    const offlineNames = results.filter(s => s.status === 'offline').map(s => s.name).join(', ');
    freezeReason = `${criticalCount} critical services down: ${offlineNames}`;
  }

  let overallStatus: SystemHealthReport['overallStatus'] = 'healthy';
  if (freezeDetected) overallStatus = 'frozen';
  else if (criticalCount > 0) overallStatus = 'critical';
  else if (degradedCount > 0) overallStatus = 'degraded';

  return {
    overallStatus,
    services: results,
    freezeDetected,
    freezeReason,
    timestamp: new Date().toISOString(),
    uptimePercent,
    avgLatencyMs: avgLatency,
    criticalCount,
    degradedCount
  };
}

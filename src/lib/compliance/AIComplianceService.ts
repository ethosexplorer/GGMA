import { turso } from '../turso';
import { AdvancedAIIntelligence } from './AdvancedAIIntelligence';

export interface ComplianceAlert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  data?: any;
}

export class AIComplianceService {
  static async runChecks(facilityId: string): Promise<ComplianceAlert[]> {
    const alerts: ComplianceAlert[] = [];

    // 1. Inventory Mismatch: Package weight exceeds source harvest weight
    const mismatchQuery = await turso.execute({
      sql: `
        SELECT p.id, p.weight as pkg_weight, h.weight as harvest_weight 
        FROM packages p
        JOIN harvests h ON p.source_id = h.id
        WHERE p.source_type = 'harvest' 
        AND p.facility_id = ?
        AND p.weight > h.weight
      `,
      args: [facilityId]
    });

    if (mismatchQuery.rows.length > 0) {
      alerts.push({
        type: 'INVENTORY_MISMATCH',
        message: 'Package weight exceeds source harvest weight',
        severity: 'high'
      });
    }

    // 2. Missing Chain of Custody: Package with no source
    const missingChainQuery = await turso.execute({
      sql: `
        SELECT id FROM packages 
        WHERE source_id IS NULL OR source_id = ''
        AND facility_id = ?
      `,
      args: [facilityId]
    });

    if (missingChainQuery.rows.length > 0) {
      alerts.push({
        type: 'CHAIN_BROKEN',
        message: 'Package missing valid origin/source ID',
        severity: 'high'
      });
    }

    // 3. Rapid Transfers: More than 5 transfers in 24 hours
    const rapidTransfersQuery = await turso.execute({
      sql: `
        SELECT COUNT(*) as count FROM transfers 
        WHERE from_facility = ? 
        AND created_at > datetime('now', '-1 day')
      `,
      args: [facilityId]
    });

    const transferCount = Number(rapidTransfersQuery.rows[0]?.count || 0);
    if (transferCount > 5) {
      alerts.push({
        type: 'RAPID_TRANSFERS',
        message: `High transfer volume detected: ${transferCount} transfers in 24h`,
        severity: 'medium'
      });
    }

    // 4. Wallet Fraud Signals: Large transactions with no audit correlation
    const walletQuery = await turso.execute({
      sql: `
        SELECT balance FROM wallets WHERE user_id = ?
      `,
      args: [facilityId] // Using facilityId as user_id for mock
    });

    const balance = Number(walletQuery.rows[0]?.balance || 0);
    if (balance > 1000000) {
      alerts.push({
        type: 'WALLET_ANOMALY',
        message: 'High wallet balance requires executive review',
        severity: 'medium'
      });
    }

    // 5. Advanced: Yield vs Reported Anomalies
    const predictions = await AdvancedAIIntelligence.predictYield(facilityId);
    const anomalies = predictions.filter(p => p.status === 'SUSPICIOUS_HIGH');
    if (anomalies.length > 0) {
      alerts.push({
        type: 'YIELD_ANOMALY',
        message: `Batch ${anomalies[0].batchId} reported weight significantly higher than strain average.`,
        severity: 'high'
      });
    }

    // 6. Advanced: Laundering Patterns
    const launderingAlerts = await AdvancedAIIntelligence.detectLaunderingPatterns(facilityId);
    launderingAlerts.forEach(a => alerts.push(a));

    return alerts;
  }
}

import { turso } from '../turso';

export interface YieldPrediction {
  batchId: string;
  strain: string;
  predictedWeight: number;
  actualWeight?: number;
  variance: number;
  status: 'OPTIMAL' | 'UNDERPERFORMING' | 'SUSPICIOUS_HIGH';
}

export class AdvancedAIIntelligence {
  /**
   * Predicts yield for flowering plants based on strain averages and environmental health.
   */
  static async predictYield(facilityId: string): Promise<YieldPrediction[]> {
    const { rows } = await turso.execute({
      sql: `
        SELECT pb.id, pb.strain, pb.count, p.phase 
        FROM plant_batches pb
        JOIN plants p ON pb.id = p.batch_id
        WHERE pb.facility_id = ? AND p.phase = 'FLOWERING'
        GROUP BY pb.id
      `,
      args: [facilityId]
    });

    // Fetch actual harvest data for this facility to compare against predictions
    const harvestData = await turso.execute({
      sql: `SELECT source_id, SUM(weight) as actual_weight FROM packages 
            WHERE facility_id = ? AND source_type = 'harvest' 
            GROUP BY source_id`,
      args: [facilityId]
    });
    const actualWeights: Record<string, number> = {};
    harvestData.rows.forEach((r: any) => {
      actualWeights[r.source_id] = Number(r.actual_weight || 0);
    });

    return rows.map((r: any) => {
      // Historical average: 450g per plant for OG Kush, 550g for Sour Diesel
      const avgYield = r.strain.includes('Kush') ? 450 : 550;
      const predicted = r.count * avgYield;
      
      // Calculate real variance from actual harvest data if available
      const actual = actualWeights[r.id] || 0;
      const variance = actual > 0 ? ((actual - predicted) / predicted) * 100 : 0;
      
      return {
        batchId: r.id,
        strain: r.strain,
        predictedWeight: predicted,
        actualWeight: actual > 0 ? actual : undefined,
        variance,
        status: variance > 15 ? 'SUSPICIOUS_HIGH' : variance < -15 ? 'UNDERPERFORMING' : 'OPTIMAL'
      };
    });
  }

  /**
   * Detects potential money laundering patterns in sales data.
   */
  static async detectLaunderingPatterns(facilityId: string): Promise<any[]> {
    const alerts: any[] = [];

    // Pattern 1: Smurfing (Many small cash-like transactions just below reporting thresholds)
    const smurfingQuery = await turso.execute({
      sql: `
        SELECT entity_id, COUNT(*) as tx_count, SUM(amount) as total 
        FROM transactions 
        WHERE entity_id = ? AND amount < 1000 
        AND created_at > datetime('now', '-1 hour')
        GROUP BY entity_id
        HAVING tx_count > 20
      `,
      args: [facilityId]
    });

    if (smurfingQuery.rows.length > 0) {
      alerts.push({
        type: 'SMURFING_PATTERN',
        message: 'High frequency of small transactions detected in a 1-hour window.',
        severity: 'high'
      });
    }

    // Pattern 2: Inventory Inconsistency (High sales value with low inventory decrement)
    // This will be a real multi-table check once Metrc package adjustments are tracked
    const traceabilityQuery = await turso.execute({
      sql: `
        SELECT SUM(t.amount) as sales_total
        FROM transactions t
        WHERE t.entity_id = ? AND t.type = 'B2C Sales'
        AND t.created_at > datetime('now', '-1 day')
      `,
      args: [facilityId]
    });

    const dailySales = Number(traceabilityQuery.rows[0]?.sales_total || 0);
    if (dailySales > 5000) {
      // Only alert if there are actual high-value sales to investigate
      alerts.push({
        type: 'TRACEABILITY_GAP',
        message: `$${dailySales.toLocaleString()} in daily sales detected — verify corresponding Metrc package adjustments.`,
        severity: 'high'
      });
    }

    return alerts;
  }
}

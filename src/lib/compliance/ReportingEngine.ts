import { turso } from '../turso';
import { MultiStateAdapter } from './MultiStateAdapter';

export interface ReportConfig {
  facilityId: string;
  type: 'inventory' | 'sales' | 'transfers' | 'audit';
  format: 'json' | 'csv' | 'xml';
}

export class ReportingEngine {
  /**
   * Generates a regulatory-compliant report for a specific facility.
   */
  static async generateReport(config: ReportConfig) {
    const rules = MultiStateAdapter.getRules('OKLAHOMA'); // Defaulting to OK for now
    console.log(`Generating ${config.type} report for ${config.facilityId} in ${rules.reportFormat} format...`);
    
    let data: any[] = [];

    switch (config.type) {
      case 'inventory':
        const invRes = await turso.execute({
          sql: "SELECT * FROM packages WHERE facility_id = ? AND status = 'ACTIVE'",
          args: [config.facilityId]
        });
        data = invRes.rows;
        break;
      
      case 'sales':
        const salesRes = await turso.execute({
          sql: "SELECT * FROM transactions WHERE entity_id = ? AND type = 'B2C Sales'",
          args: [config.facilityId]
        });
        data = salesRes.rows;
        break;

      case 'transfers':
        const transRes = await turso.execute({
          sql: "SELECT * FROM transfers WHERE from_facility = ? OR to_facility = ?",
          args: [config.facilityId, config.facilityId]
        });
        data = transRes.rows;
        break;

      case 'audit':
        const auditRes = await turso.execute({
          sql: "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100"
        });
        data = auditRes.rows;
        break;
    }

    if (config.format === 'json') {
      return JSON.stringify({
        header: {
          jurisdiction: `${MultiStateAdapter.getRules('OKLAHOMA').jurisdiction}`,
          software: "GGP-OS SINC"
        },
        data
      }, null, 2);
    } else if (config.format === 'csv') {
      return this.convertToCSV(data);
    }
    
    return data;
  }

  /**
   * Converts JSON data to CSV format for regulator imports.
   */
  private static convertToCSV(data: any[]) {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Simulates a push-button submission to a state regulatory API (e.g., Metrc/OMMA).
   */
  static async submitToState(reportData: string, type: string) {
    // In a real app, this would be an encrypted POST to a government endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        const submissionId = `SUB-${Math.floor(Math.random() * 900000) + 100000}`;
        resolve({
          success: true,
          submissionId,
          timestamp: new Date().toISOString(),
          message: `State regulator (OMMA) has received the ${type} submission.`
        });
      }, 2000);
    });
  }
}

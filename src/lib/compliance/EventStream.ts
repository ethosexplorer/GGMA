import { turso } from '../turso';

export interface ComplianceEvent {
  id: string;
  type: 'PHASE_CHANGE' | 'HARVEST' | 'PACKAGE' | 'TRANSFER' | 'SALE' | 'ALERT';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export class EventStream {
  /**
   * Simulates a live stream of compliance events by fetching recent audit logs.
   */
  static async getLiveFeed(): Promise<ComplianceEvent[]> {
    const { rows } = await turso.execute(`
      SELECT id, action as type, data, created_at as timestamp 
      FROM audit_logs 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    return rows.map((r: any) => {
      const data = JSON.parse(r.data);
      let message = '';
      let severity: 'low' | 'medium' | 'high' = 'low';

      switch (r.type) {
        case 'PLANT_PHASE_CHANGE':
          message = `Plant ${data.plantId} moved from ${data.from} to ${data.to}`;
          severity = 'low';
          break;
        case 'HARVEST_CREATED':
          message = `New harvest created: ${data.wetWeight}g recorded`;
          severity = 'medium';
          break;
        case 'PACKAGE_CREATED':
          message = `Inventory package generated for ${data.harvestId}`;
          severity = 'medium';
          break;
        case 'TRANSFER_CREATED':
          message = `External transfer initiated to ${data.toFacility}`;
          severity = 'high';
          break;
        default:
          message = `System Action: ${r.type}`;
          severity = 'low';
      }

      return {
        id: r.id,
        type: r.type,
        message,
        timestamp: r.timestamp,
        severity
      };
    });
  }
}

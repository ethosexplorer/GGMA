import { turso } from './turso';

// ─── Regulatory Sweep Tracking ───
// Twice-monthly national sweep system (1st and 15th)
// Tracks: last sweep date, state-by-state updates, changelog

export interface RegSweepEntry {
  id: string;
  sweep_date: string;
  sweep_type: 'full' | 'priority';
  states_updated: string; // JSON array of state abbreviations
  changes_summary: string;
  performed_by: string;
  created_at: string;
}

export interface StateRegUpdate {
  id: string;
  state_code: string;
  state_name: string;
  update_type: string; // 'licensing_fee', 'new_legislation', 'enforcement_action', 'moratorium', 'emergency_rule', 'court_ruling', 'application_window', 'other'
  summary: string;
  source_url: string;
  effective_date: string;
  performed_by: string;
  created_at: string;
}

// All 50 states + DC
export const ALL_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export const UPDATE_TYPES = [
  'New Legislation Signed',
  'Licensing Fee Change',
  'Application Window Change',
  'Enforcement Action',
  'Moratorium Issued',
  'Emergency Rule',
  'Court Ruling',
  'Federal Rescheduling Impact',
  'Tax Rate Change',
  'Testing Requirement Change',
  'Compliance Update',
  'Other'
];

// Initialize tables
export const initRegSweepTables = async () => {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS reg_sweeps (
      id TEXT PRIMARY KEY,
      sweep_date TEXT NOT NULL,
      sweep_type TEXT NOT NULL DEFAULT 'full',
      states_updated TEXT DEFAULT '[]',
      changes_summary TEXT DEFAULT '',
      performed_by TEXT DEFAULT 'Staff',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await turso.execute(`
    CREATE TABLE IF NOT EXISTS reg_state_updates (
      id TEXT PRIMARY KEY,
      state_code TEXT NOT NULL,
      state_name TEXT NOT NULL,
      update_type TEXT NOT NULL,
      summary TEXT NOT NULL,
      source_url TEXT DEFAULT '',
      effective_date TEXT DEFAULT '',
      performed_by TEXT DEFAULT 'Staff',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Get the last sweep
export const getLastSweep = async (): Promise<RegSweepEntry | null> => {
  try {
    const res = await turso.execute('SELECT * FROM reg_sweeps ORDER BY created_at DESC LIMIT 1');
    return res.rows.length > 0 ? res.rows[0] as any : null;
  } catch {
    return null;
  }
};

// Get state-level update history
export const getStateUpdates = async (stateCode?: string): Promise<StateRegUpdate[]> => {
  try {
    if (stateCode) {
      const res = await turso.execute({ sql: 'SELECT * FROM reg_state_updates WHERE state_code = ? ORDER BY created_at DESC', args: [stateCode] });
      return res.rows as any;
    }
    const res = await turso.execute('SELECT * FROM reg_state_updates ORDER BY created_at DESC LIMIT 100');
    return res.rows as any;
  } catch {
    return [];
  }
};

// Get last update per state (for the matrix)
export const getLastUpdatePerState = async (): Promise<Record<string, string>> => {
  try {
    const res = await turso.execute('SELECT state_code, MAX(created_at) as last_updated FROM reg_state_updates GROUP BY state_code');
    const map: Record<string, string> = {};
    for (const row of res.rows) {
      map[String(row.state_code)] = String(row.last_updated);
    }
    return map;
  } catch {
    return {};
  }
};

// Log a sweep
export const logSweep = async (type: 'full' | 'priority', statesUpdated: string[], summary: string, performedBy: string = 'Staff') => {
  const id = 'sweep-' + Math.random().toString(36).substr(2, 9);
  await turso.execute({
    sql: 'INSERT INTO reg_sweeps (id, sweep_date, sweep_type, states_updated, changes_summary, performed_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, new Date().toISOString().split('T')[0], type, JSON.stringify(statesUpdated), summary, performedBy, new Date().toISOString()]
  });
  return id;
};

// Log a state-level update
export const logStateUpdate = async (stateCode: string, stateName: string, updateType: string, summary: string, sourceUrl: string = '', effectiveDate: string = '', performedBy: string = 'Staff') => {
  const id = 'reg-' + Math.random().toString(36).substr(2, 9);
  await turso.execute({
    sql: 'INSERT INTO reg_state_updates (id, state_code, state_name, update_type, summary, source_url, effective_date, performed_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [id, stateCode, stateName, updateType, summary, sourceUrl, effectiveDate, performedBy, new Date().toISOString()]
  });

  // Audit log
  await turso.execute({
    sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
    args: ['log-' + Math.random().toString(36).substr(2, 9), 'REG_UPDATE', performedBy, JSON.stringify({ state: stateCode, type: updateType, summary })]
  });

  return id;
};

// Calculate next sweep date
export const getNextSweepDate = (): { date: string; type: 'full' | 'priority' } => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (day < 15) {
    // Next sweep is the 15th (priority)
    return { date: new Date(year, month, 15).toLocaleDateString(), type: 'priority' };
  } else {
    // Next sweep is 1st of next month (full)
    return { date: new Date(year, month + 1, 1).toLocaleDateString(), type: 'full' };
  }
};

// Calculate sweep freshness
export const getSweepFreshness = (lastSweepDate: string | null): { status: 'fresh' | 'due' | 'overdue'; label: string; color: string } => {
  if (!lastSweepDate) return { status: 'overdue', label: 'Never Performed', color: 'text-red-600' };

  const last = new Date(lastSweepDate);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince <= 7) return { status: 'fresh', label: `${daysSince}d ago`, color: 'text-emerald-600' };
  if (daysSince <= 15) return { status: 'due', label: `${daysSince}d ago — Due Soon`, color: 'text-amber-600' };
  return { status: 'overdue', label: `${daysSince}d ago — OVERDUE`, color: 'text-red-600' };
};

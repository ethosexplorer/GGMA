import { turso } from './turso';

export const initDatabase = async () => {
  try {
    // 1. Patient Portal Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        medical_condition TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Business Dashboard Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS businesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_name TEXT NOT NULL,
        license_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        compliance_score INTEGER DEFAULT 100,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Provider Dashboard Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialty TEXT,
        license_number TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Care Wallet Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        transaction_type TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Enforcement / State Authority Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS enforcement_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agency TEXT NOT NULL,
        action TEXT NOT NULL,
        target_id TEXT,
        notes TEXT,
        logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Founder Ledger Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS founder_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origin_vector TEXT NOT NULL,
        type TEXT NOT NULL,
        gross_revenue TEXT NOT NULL,
        net_profit TEXT NOT NULL,
        status TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed founder_ledger if empty
    const ledgerCheck = await turso.execute('SELECT COUNT(*) as count FROM founder_ledger');
    if (ledgerCheck.rows[0].count === 0) {
      const seeds = [
        { n: 'Jasmin Garrett — Patient Application Processing Fee', t: 'Service Fee (Chime)', g: '$20.00', net: '$20.00', s: 'Settled', c: 'bg-emerald-600' },
      ];
      for (const item of seeds) {
        await turso.execute({
          sql: 'INSERT INTO founder_ledger (origin_vector, type, gross_revenue, net_profit, status, color) VALUES (?, ?, ?, ?, ?, ?)',
          args: [item.n, item.t, item.g, item.net, item.s, item.c]
        });
      }
    }

    // 6.5. Founder Payables Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS founder_payables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        amount TEXT NOT NULL,
        due_date TEXT NOT NULL,
        status TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed founder_payables if empty
    const payablesCheck = await turso.execute('SELECT COUNT(*) as count FROM founder_payables');
    if (payablesCheck.rows[0].count === 0) {
      const seeds = [
        { name: 'Metrc Monthly API License', amount: '$250.00', due_date: '2026-06-15', status: 'Unpaid', color: 'bg-amber-500' },
        { name: 'Stripe Payment Processing Invoice', amount: '$1,200.00', due_date: '2026-06-10', status: 'Paid', color: 'bg-emerald-600' },
        { name: 'Twilio Telephony & Voice Bundle', amount: '$450.00', due_date: '2026-06-20', status: 'Pending', color: 'bg-indigo-600' }
      ];
      for (const item of seeds) {
        await turso.execute({
          sql: 'INSERT INTO founder_payables (name, amount, due_date, status, color) VALUES (?, ?, ?, ?, ?)',
          args: [item.name, item.amount, item.due_date, item.status, item.color]
        });
      }
    }    // 7. Platform Settings Table (Global News Ticker & Emergency Broadcasts)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);

    // Seed platform settings if not present
    const settingsCheck = await turso.execute('SELECT COUNT(*) as count FROM platform_settings');
    if (settingsCheck.rows[0].count === 0) {
      const defaultSettings = [
        { k: 'gghp_marquee_news', v: '🔴 BREAKING: DOJ Final Order — Medical Cannabis & FDA-Approved Products Moved to Schedule III (April 23, 2026) | ⚖️ DEA HEARING: Expedited administrative hearing on broader rescheduling begins JUNE 29, 2026 | 🚨 DEA: Synthetic cannabinoid HHC classified as illegal Schedule I substance | 💰 280E TAX RELIEF: Schedule III status allows medical cannabis businesses to deduct normal business expenses' },
        { k: 'gghp_marquee_speed', v: 'medium' },
        { k: 'gghp_platform_alert', v: '🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • GLOBAL GREEN HYBRID PLATFORM (GGHP) • ALL SECTORS (GGMA/RIP/SINC) OPERATIONAL' },
        { k: 'gghp_platform_alert_speed', v: 'fast' },
        { k: 'gghp_platform_alert_type', v: 'Urgent Alert (Red)' }
      ];
      for (const setting of defaultSettings) {
        await turso.execute({
          sql: 'INSERT INTO platform_settings (key, value) VALUES (?, ?)',
          args: [setting.k, setting.v]
        });
      }
    }

    // 8. OMMA Historical Enforcement Records Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS omma_enforcement_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_name TEXT NOT NULL,
        dba TEXT,
        license_number TEXT UNIQUE NOT NULL,
        license_type TEXT,
        status TEXT,
        enforcement_action TEXT,
        dates_connected TEXT,
        reasons TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed OMMA historical enforcement records if empty
    const recordsCheck = await turso.execute('SELECT COUNT(*) as count FROM omma_enforcement_records');
    if (recordsCheck.rows[0].count === 0) {
      const records = [
        {
          name: 'Green Health Clinic LLC',
          dba: 'Green Health Recommendation Center',
          license: 'OAA-4819-2910',
          type: 'Medical Marijuana Recommendation Referral Center',
          status: 'Revoked',
          action: 'Administrative License Revocation',
          date: 'July 14, 2025',
          reason: 'Compliance failure under Title 442, failure to verify physician credentials prior to certificate upload.'
        },
        {
          name: 'Apex Health LLC',
          dba: 'Apex Wellness OKC',
          license: 'OAA-8922-1102',
          type: 'Dispensary',
          status: 'Suspended',
          action: 'Emergency License Suspension',
          date: 'May 12, 2026',
          reason: 'Excessive daily sales volume anomalies and failure to upload real-time Metrc tracking records.'
        },
        {
          name: 'Oklahoma Flower Co.',
          dba: 'OK Flower Cultivation',
          license: 'GAA-3329-8812',
          type: 'Grower / Cultivator',
          status: 'Forfeited',
          action: 'Voluntary Forfeiture during Administrative Hearing',
          date: 'April 10, 2026',
          reason: 'Banned pesticide detections (Myclobutanil) during pre-harvest compliance inspection.'
        },
        {
          name: 'Lotus Dispo LLC',
          dba: 'Lotus Dispensary & Lounge',
          license: 'OAA-1002-3982',
          type: 'Dispensary',
          status: 'Surrendered',
          action: 'License Surrendered after Security Audit',
          date: 'February 18, 2026',
          reason: 'Inoperable video surveillance backup systems and zoning compliance failure.'
        },
        {
          name: 'OK Budz Cultivation Inc',
          dba: 'OK Budz',
          license: 'GAA-4482-9901',
          type: 'Grower / Cultivator',
          status: 'Active (Passed Inspection)',
          action: 'Annual Compliance Verification',
          date: 'May 20, 2026',
          reason: 'Successfully resolved minor administrative record-keeping notice; fully compliant.'
        }
      ];
      for (const r of records) {
        await turso.execute({
          sql: 'INSERT INTO omma_enforcement_records (business_name, dba, license_number, license_type, status, enforcement_action, dates_connected, reasons) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          args: [r.name, r.dba, r.license, r.type, r.status, r.action, r.date, r.reason]
        });
      }
    }

    console.log("✅ Turso Database initialized: Created tables for all major modules.");
  } catch (error) {
    console.error("❌ Failed to initialize Turso tables:", error);
  }
};



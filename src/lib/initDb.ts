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

    console.log("✅ Turso Database initialized: Created tables for all major modules.");
  } catch (error) {
    console.error("❌ Failed to initialize Turso tables:", error);
  }
};



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
        { n: 'Sylara Medical Subscriptions', t: 'SaaS / Recurring', g: '$4.2M', net: '$3.8M', s: 'Settled', c: 'bg-emerald-600' },
        { n: 'Metrc Integration Fees', t: 'API Gateway', g: '$1.8M', net: '$1.5M', s: 'Settled', c: 'bg-emerald-600' },
        { n: 'Care Wallet Transactions', t: 'B2B Processor', g: '$6.5M', net: '$1.2M', s: 'Liquid', c: 'bg-blue-600' },
        { n: 'Telehealth Consults', t: 'Service Fee', g: '$1.2M', net: '$950k', s: 'Settled', c: 'bg-emerald-600' },
        { n: 'State Jurisdiction Licensing', t: 'Enterprise', g: '$1.1M', net: '$880k', s: 'Pending', c: 'bg-amber-500' },
        { n: 'Back Office Operations (Cannabis)', t: 'Admin Services', g: '$2.4M', net: '$1.9M', s: 'Active', c: 'bg-emerald-600' },
        { n: 'Back Office Operations (General)', t: 'Admin Services', g: '$1.1M', net: '$820k', s: 'Active', c: 'bg-emerald-600' },
        { n: 'Attorney / Legal Retainers (Cannabis)', t: 'Professional Svc', g: '$1.8M', net: '$1.4M', s: 'Active', c: 'bg-emerald-600' },
        { n: 'Attorney / Legal Retainers (General)', t: 'Professional Svc', g: '$890k', net: '$680k', s: 'Active', c: 'bg-blue-600' },
        { n: 'Ecosystem Add-ons (Patient)', t: 'Marketplace', g: '$620k', net: '$540k', s: 'Active', c: 'bg-emerald-600' },
        { n: 'Ecosystem Add-ons (Cross-Dashboard)', t: 'Marketplace', g: '$1.3M', net: '$1.1M', s: 'Active', c: 'bg-blue-600' },
        { n: 'Distributor / Reseller Fees', t: 'Channel Revenue', g: '$950k', net: '$710k', s: 'Active', c: 'bg-emerald-600' },
        { n: 'Partner Affiliate Commissions', t: 'Partner Program', g: '$480k', net: '$380k', s: 'Active', c: 'bg-blue-600' },
        { n: 'Enforcement & Finance AI Bundles', t: 'Gov / Enterprise', g: '$2.1M', net: '$1.7M', s: 'Active', c: 'bg-indigo-600' },
      ];
      for (const item of seeds) {
        await turso.execute({
          sql: 'INSERT INTO founder_ledger (origin_vector, type, gross_revenue, net_profit, status, color) VALUES (?, ?, ?, ?, ?, ?)',
          args: [item.n, item.t, item.g, item.net, item.s, item.c]
        });
      }
    }    console.log("✅ Turso Database initialized: Created tables for all major modules.");
  } catch (error) {
    console.error("❌ Failed to initialize Turso tables:", error);
  }
};



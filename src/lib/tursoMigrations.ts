import { turso } from './turso';

export async function initializeDatabase() {
  try {
    // Check if entities table exists to avoid errors on multiple calls
    console.log('Initializing Turso Database schemas...');

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        state TEXT NOT NULL,
        status TEXT NOT NULL,
        last_audit TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        item_name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit TEXT NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY(entity_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        date TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY(entity_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS compliance_alerts (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        is_resolved INTEGER DEFAULT 0,
        FOREIGN KEY(entity_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS insurance_policies (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        amount REAL NOT NULL,
        expires_at TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY(entity_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        entity_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        uploaded_at TEXT NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY(entity_id) REFERENCES entities(id)
      )
    `);

    // --- Metrc Compliance & Care OS Tables ---

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS plant_batches (
        id TEXT PRIMARY KEY,
        strain TEXT NOT NULL,
        count INTEGER NOT NULL,
        status TEXT NOT NULL,
        facility_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(facility_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY,
        batch_id TEXT NOT NULL,
        tag_id TEXT UNIQUE NOT NULL,
        phase TEXT NOT NULL,
        facility_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(batch_id) REFERENCES plant_batches(id),
        FOREIGN KEY(facility_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS harvests (
        id TEXT PRIMARY KEY,
        plant_id TEXT NOT NULL,
        weight REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(plant_id) REFERENCES plants(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS packages (
        id TEXT PRIMARY KEY,
        source_type TEXT NOT NULL, -- plant | harvest | package
        source_id TEXT NOT NULL,
        tag_id TEXT UNIQUE NOT NULL,
        weight REAL NOT NULL,
        status TEXT NOT NULL,
        facility_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(facility_id) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS transfers (
        id TEXT PRIMARY KEY,
        from_facility TEXT NOT NULL,
        to_facility TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(from_facility) REFERENCES entities(id),
        FOREIGN KEY(to_facility) REFERENCES entities(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS transfer_items (
        id TEXT PRIMARY KEY,
        transfer_id TEXT NOT NULL,
        package_id TEXT NOT NULL,
        FOREIGN KEY(transfer_id) REFERENCES transfers(id),
        FOREIGN KEY(package_id) REFERENCES packages(id)
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        balance REAL DEFAULT 0,
        type TEXT NOT NULL DEFAULT 'personal', -- personal | facility
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        user_id TEXT NOT NULL,
        data TEXT NOT NULL, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert mock data if DB is empty
    const { rows } = await turso.execute('SELECT COUNT(*) as count FROM entities');
    if (rows[0] && rows[0].count === 0) {
      console.log('Inserting initial mock data...');
      
      const entitiesQuery = `
        INSERT INTO entities (id, name, type, state, status, last_audit) VALUES 
        ('ent-1', 'GGMA North Dispensary', 'Retail', 'Oklahoma', 'Compliant', 'Apr 21, 2026'),
        ('ent-2', 'Green Valley Cultivation', 'Production', 'Oklahoma', 'Compliant', 'Apr 15, 2026'),
        ('ent-3', 'Central Logistics Hub', 'Distribution', 'Oklahoma', 'Review', 'Apr 20, 2026')
      `;
      await turso.execute(entitiesQuery);

      const inventoryQuery = `
        INSERT INTO inventory (id, entity_id, item_name, category, quantity, unit, price) VALUES 
        ('inv-1', 'ent-1', 'Blue Dream Flower', 'Flower', 250, 'Grams', 12.0),
        ('inv-2', 'ent-1', 'CBD Gummies 500mg', 'Edibles', 100, 'Units', 25.50),
        ('inv-3', 'ent-2', 'Raw Cannabis Oil', 'Concentrates', 50, 'Liters', 800.0)
      `;
      await turso.execute(inventoryQuery);

      const txQuery = `
        INSERT INTO transactions (id, entity_id, date, amount, type, status) VALUES 
        ('tx-1', 'ent-1', '2026-04-14', 1250.00, 'B2C Sales', 'Completed'),
        ('tx-2', 'ent-3', '2026-04-15', 5400.00, 'B2B Wholesale', 'Processing'),
        ('tx-3', 'ent-1', '2026-04-15', 315.00, 'B2C Sales', 'Completed')
      `;
      await turso.execute(txQuery);

      // --- Compliance Mock Data ---
      await turso.execute(`
        INSERT INTO plant_batches (id, strain, count, status, facility_id) VALUES 
        ('pb-1', 'OG Kush', 100, 'IMMATURE', 'ent-2'),
        ('pb-2', 'Sour Diesel', 50, 'VEGETATIVE', 'ent-2')
      `);

      await turso.execute(`
        INSERT INTO plants (id, batch_id, tag_id, phase, facility_id) VALUES 
        ('p-1', 'pb-2', '1A4FF0100000022000001001', 'FLOWERING', 'ent-2'),
        ('p-2', 'pb-2', '1A4FF0100000022000001002', 'FLOWERING', 'ent-2')
      `);

      await turso.execute(`
        INSERT INTO packages (id, source_type, source_id, tag_id, weight, status, facility_id) VALUES 
        ('pkg-1', 'harvest', 'h-1', '1A4FF0100000022000002001', 500.0, 'ACTIVE', 'ent-2'),
        ('pkg-2', 'package', 'pkg-1', '1A4FF0100000022000002002', 100.0, 'IN_TRANSIT', 'ent-2')
      `);

      await turso.execute(`
        INSERT INTO wallets (id, user_id, balance, type) VALUES 
        ('wal-1', 'admin-1', 15000000.0, 'personal'),
        ('wal-2', 'ent-1', 500000.0, 'facility')
      `);

      const alertsQuery = `
        INSERT INTO compliance_alerts (id, entity_id, message, severity, date, status, is_resolved) VALUES 
        ('alt-1', 'ent-3', 'Monthly Distribution Report Overdue', 'High', '1h ago', 'Action Required', 0),
        ('alt-2', 'ent-1', 'Routine License Renewal Upcoming in 30 days', 'Medium', '1d ago', 'Pending', 0),
        ('alt-3', 'ent-2', 'Security Protocol Update Acknowledged', 'Low', '2d ago', 'Completed', 1)
      `;
      await turso.execute(alertsQuery);

      const insuranceQuery = `
        INSERT INTO insurance_policies (id, entity_id, type, provider, amount, expires_at, status) VALUES 
        ('ins-1', 'ent-1', 'Grower Surety Bond', 'ProSure Group', 50000, '08/15/2026', 'Active'),
        ('ins-2', 'ent-1', 'General Liability', 'Strive Insurance', 2000000, '12/01/2027', 'Active'),
        ('ins-3', 'ent-3', 'Waste Disposal Liab.', 'Missing', 5000000, 'Action Required', 'Not Uploaded')
      `;
      await turso.execute(insuranceQuery);

      const documentsQuery = `
        INSERT INTO documents (id, entity_id, name, type, uploaded_at, url) VALUES 
        ('doc-1', 'ent-1', '2026_Surety_Bond_ProSure.pdf', 'Bond / Insurance', '08/15/2025', '#'),
        ('doc-2', 'ent-2', 'Attestation_of_Land_Ownership.pdf', 'Compliance', '05/10/2025', '#'),
        ('doc-3', 'ent-1', 'Standard_Operating_Procedures.pdf', 'SOP / Policies', '01/01/2025', '#')
      `;
      await turso.execute(documentsQuery);
    }
    
    console.log('Turso schemas ready.');
  } catch (err) {
    console.error('Error initializing Turso DB:', err);
  }
}

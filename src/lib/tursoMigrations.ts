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

    // Insert mock data if DB is empty
    const { rows } = await turso.execute('SELECT COUNT(*) as count FROM entities');
    if (rows[0] && rows[0].count === 0) {
      console.log('Inserting initial mock data...');
      
      const entitiesQuery = `
        INSERT INTO entities (id, name, type, state, status, last_audit) VALUES 
        ('ent-1', 'GGMA North Dispensary', 'Retail', 'Kansas', 'Compliant', 'Sep 20, 2026'),
        ('ent-2', 'Green Valley Cultivation', 'Production', 'Missouri', 'Compliant', 'Aug 15, 2026'),
        ('ent-3', 'Central Logistics Hub', 'Distribution', 'Kansas', 'Review', 'Oct 01, 2026')
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
        ('tx-1', 'ent-1', '2026-10-14', 1250.00, 'B2C Sales', 'Completed'),
        ('tx-2', 'ent-3', '2026-10-15', 5400.00, 'B2B Wholesale', 'Processing'),
        ('tx-3', 'ent-1', '2026-10-15', 315.00, 'B2C Sales', 'Completed')
      `;
      await turso.execute(txQuery);

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

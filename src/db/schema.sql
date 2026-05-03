-- GGP-OS Production Cloud Database Schema (Turso / libSQL)

-- Users & Authentication Table (Syncs with Auth0/Vercel Auth)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Auth0 or Firebase UUID
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'user', -- e.g., 'founder', 'regulator', 'attorney', 'business', 'patient'
    jurisdiction TEXT, -- e.g., 'Oklahoma', 'Federal'
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Organization / Agency Table (The "Tenants")
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL, -- e.g., 'OMMA', 'Diversity Health'
    type TEXT NOT NULL, -- e.g., 'government', 'dispensary', 'farm'
    jurisdiction TEXT,
    subscription_tier TEXT, -- e.g., 'Custom Enterprise'
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User-Organization Mapping (RBAC)
CREATE TABLE IF NOT EXISTS organization_members (
    user_id TEXT REFERENCES users(id),
    org_id TEXT REFERENCES organizations(id),
    org_role TEXT NOT NULL, -- e.g., 'admin', 'auditor', 'staff'
    PRIMARY KEY (user_id, org_id)
);

-- Invoices & Bank "Request for Pay" (Syncs with Bank/Payment API)
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    org_id TEXT REFERENCES organizations(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'failed'
    due_date DATETIME,
    paid_at DATETIME,
    payment_method TEXT, -- e.g., 'ACH', 'Bank Transfer', 'Credit Card'
    bank_reference_id TEXT, -- The tracking ID from your bank's Request for Pay API
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Audit & Compliance Logs (For Founder Dashboard & Regulatory)
CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level TEXT DEFAULT 'info',
    source TEXT,
    message TEXT,
    user_id TEXT REFERENCES users(id),
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

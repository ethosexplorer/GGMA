const fs = require('fs');

// 1. Create FounderDashboard.tsx (The God View)
let founderC = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
founderC = founderC.replace(/AdminDashboard/g, 'FounderDashboard');
// Add "Plus More" - System Logs, Global Financials
founderC = founderC.replace('const NAV_ITEMS = [', `const NAV_ITEMS = [
  { section: 'FOUNDER EXCLUSIVE' },
  { id: 'global_financials', label: 'Global Financials', icon: TrendingUp },
  { id: 'system_logs', label: 'Platform System Logs', icon: Cpu },
  { id: 'audit_vault', label: 'Master Audit Vault', icon: FolderLock },`);
fs.writeFileSync('src/pages/FounderDashboard.tsx', founderC);

// 2. Modify AdminDashboard.tsx (The Jesus View) - Remove some sections
let adminC = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
// Remove FOUNDER EXCLUSIVE (not added yet) and maybe some sensitive parts
adminC = adminC.replace('{ id: \'overview\', label: \'Master Overview\', icon: Activity },', '{ id: \'overview\', label: \'Admin Overview\', icon: Activity },');
// Hide Master Overview logic? Let's just remove some high level system stuff if it existed.
// The user said "give them less and me exactly like the one shown plus more".
// I'll remove "User Management" or "System Settings" from Jesus view? 
// Actually I'll just remove the "SYSTEM" section from Jesus view.
const systemSectionStart = adminC.indexOf('{ section: \'SYSTEM\' },');
const systemSectionEnd = adminC.indexOf('];', systemSectionStart);
adminC = adminC.substring(0, systemSectionStart) + '];'; 

fs.writeFileSync('src/pages/AdminDashboard.tsx', adminC);

// 3. Create RegulatorDashboard.tsx (State View)
let regulatorC = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
regulatorC = regulatorC.replace(/AdminDashboard/g, 'RegulatorDashboard');
// Regulators only care about approvals and compliance
const regNav = `const NAV_ITEMS = [
  { section: 'STATE OVERSIGHT' },
  { id: 'overview', label: 'Jurisdiction Overview', icon: Activity },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '8' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '342' },
  { section: 'COMPLIANCE' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'enforcement', label: 'RIP Enforcement Queue', icon: Gavel, dot: true },
  { id: 'reports', label: 'Regulatory Reports', icon: BarChart3 },
];`;
const regNavStart = regulatorC.indexOf('const NAV_ITEMS = [');
const regNavEnd = regulatorC.indexOf('];', regNavStart) + 2;
regulatorC = regulatorC.substring(0, regNavStart) + regNav + regulatorC.substring(regNavEnd);
fs.writeFileSync('src/pages/RegulatorDashboard.tsx', regulatorC);

// 4. Create OperationsDashboard.tsx (Call Center)
let opsC = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');
opsC = opsC.replace(/AdminDashboard/g, 'OperationsDashboard');
const opsNav = `const NAV_ITEMS = [
  { section: 'SUPPORT OPERATIONS' },
  { id: 'support', label: 'Active Support Tickets', icon: MessageSquare, badge: '12' },
  { id: 'calls', label: 'Call Queue', icon: Headphones, badge: '3' },
  { id: 'backoffice', label: 'Escalations Queue', icon: Cpu, dot: true },
  { section: 'USER ASSISTANCE' },
  { id: 'patients', label: 'Patient Inquiries', icon: HeartPulse },
  { id: 'business', label: 'Business Inquiries', icon: Building2 },
];`;
const opsNavStart = opsC.indexOf('const NAV_ITEMS = [');
const opsNavEnd = opsC.indexOf('];', opsNavStart) + 2;
opsC = opsC.substring(0, opsNavStart) + opsNav + opsC.substring(opsNavEnd);
fs.writeFileSync('src/pages/OperationsDashboard.tsx', opsC);

console.log('Dashboards created: Founder, Admin(Jesus), Regulator, Operations.');

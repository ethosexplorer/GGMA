const fs = require('fs');

function createDashboard(sourcePath, targetPath, newNav, newTitle, newRoleLabel) {
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Replace Name
    const className = targetPath.split('/').pop().replace('.tsx', '');
    content = content.replace(/AdminDashboard/g, className);
    
    // Replace Nav Items
    const navStart = content.indexOf('const NAV_ITEMS = [');
    const navEnd = content.indexOf('];', navStart) + 2;
    content = content.substring(0, navStart) + newNav + content.substring(navEnd);
    
    // Replace Title
    content = content.replace('Oversight Command', newTitle);
    
    // Replace Role Label
    content = content.replace('{user?.role?.toUpperCase()?.replace("_", " ") || "OVERSIGHT COMMAND"}', newRoleLabel);

    fs.writeFileSync(targetPath, content);
}

const adminSource = 'src/pages/AdminDashboard.tsx';

// 1. FounderDashboard (God View)
const founderNav = `const NAV_ITEMS = [
  { section: 'FOUNDER EXCLUSIVE' },
  { id: 'global_financials', label: 'Global Financials', icon: TrendingUp },
  { id: 'system_logs', label: 'Platform System Logs', icon: Cpu },
  { section: 'MANAGEMENT' },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'patients', label: 'Patient Management', icon: HeartPulse },
  { id: 'business', label: 'Business Management', icon: Building2 },
  { section: 'OPS & COMPLIANCE' },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '8' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '342' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { section: 'SYSTEM' },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'settings', label: 'System Settings', icon: Settings },
];`;
createDashboard(adminSource, 'src/pages/FounderDashboard.tsx', founderNav, 'Founder Command', 'EXECUTIVE FOUNDER • GOD VIEW');

// 2. RegulatorDashboard (State View)
const regulatorNav = `const NAV_ITEMS = [
  { section: 'STATE OVERSIGHT' },
  { id: 'overview', label: 'Jurisdiction Overview', icon: Activity },
  { id: 'approvals', label: 'Agency Approvals', icon: UserCheck, badge: '8' },
  { id: 'applications', label: 'Applications Queue', icon: FileText, badge: '342' },
  { section: 'COMPLIANCE' },
  { id: 'compliance', label: 'Compliance Monitor', icon: FileCheck },
  { id: 'enforcement', label: 'RIP Enforcement Queue', icon: Gavel, dot: true },
  { id: 'reports', label: 'Regulatory Reports', icon: BarChart3 },
];`;
createDashboard(adminSource, 'src/pages/RegulatorDashboard.tsx', regulatorNav, 'State Oversight', 'STATE REGULATOR • JURISDICTION');

// 3. OperationsDashboard (Call Center)
const opsNav = `const NAV_ITEMS = [
  { section: 'SUPPORT OPERATIONS' },
  { id: 'support', label: 'Active Support Tickets', icon: MessageSquare, badge: '12' },
  { id: 'calls', label: 'Call Queue', icon: Headphones, badge: '3' },
  { id: 'backoffice', label: 'Escalations Queue', icon: Cpu, dot: true },
  { section: 'USER ASSISTANCE' },
  { id: 'patients', label: 'Patient Inquiries', icon: HeartPulse },
  { id: 'business', label: 'Business Inquiries', icon: Building2 },
];`;
// Need Headphones import
let opsC = fs.readFileSync(adminSource, 'utf8');
if (!opsC.includes('Headphones')) {
    opsC = opsC.replace('import {', 'import { Headphones,');
}
fs.writeFileSync('src/pages/OperationsDashboard.tsx', opsC);
createDashboard('src/pages/OperationsDashboard.tsx', 'src/pages/OperationsDashboard.tsx', opsNav, 'Support Operations', 'INTERNAL OPERATIONS • CALL CENTER');

console.log('Dashboards properly recreated.');

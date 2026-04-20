const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// Update normalizedRole logic in DashboardLayout
// to map roles to the correct portal menus
c = c.replace(
    'const normalizedRole = safeRoleMatch.includes(\'federal\') ? \'federal\'\n    : safeRoleMatch.includes(\'admin\') ? \'admin\' \n    : safeRoleMatch.includes(\'exec\') ? \'executive\'\n    : safeRoleMatch.includes(\'over\') ? \'oversight\'\n    : safeRoleMatch.includes(\'business\') ? \'business\'\n    : \'patient\';',
    'const normalizedRole = safeRoleMatch.includes(\'federal\') ? \'federal\'\n    : (safeRoleMatch.includes(\'admin\') || safeRoleMatch.includes(\'exec\') || safeRoleMatch.includes(\'over\') || safeRoleMatch.includes(\'enforcement\') || safeRoleMatch.includes(\'regulator\') || safeRoleMatch.includes(\'backoffice\')) ? \'oversight\'\n    : (safeRoleMatch.includes(\'business\') || safeRoleMatch.includes(\'provider\') || safeRoleMatch.includes(\'attorney\')) ? \'business\'\n    : \'patient\';'
);

// Update Oversight menu items to be more inclusive
c = c.replace(
    'oversight: [\n      { icon: LayoutDashboard, label: \'Compliance Overview\' },\n      { icon: Video, label: \'Telehealth Monitoring\' },\n      { icon: Activity, label: \'Monitoring\' },\n      { icon: FileText, label: \'Reports\' },\n      { icon: Users, label: \'Entities\' },\n      { icon: Settings, label: \'Settings\' },\n    ],',
    'oversight: [\n      { icon: LayoutDashboard, label: \'Oversight Overview\' },\n      { icon: ShieldAlert, label: \'RIP Command\' },\n      { icon: Activity, label: \'Regulatory Monitoring\' },\n      { icon: Users, label: \'Entity Audit\' },\n      { icon: BarChart3, label: \'Executive Analytics\' },\n      { icon: Cpu, label: \'Operations Support\' },\n      { icon: Settings, label: \'Settings\' },\n    ],'
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx DashboardLayout normalization and menus updated.');

const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*'lucide-react'/);
if (!importMatch) {
    console.log('No lucide-react imports found');
    process.exit(1);
}

const importedIcons = new Set(importMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0]).filter(Boolean));
const iconUsages = content.match(/<([A-Z][a-zA-Z0-9]+)/g) || [];
const usedIcons = new Set(iconUsages.map(s => s.substring(1)));

console.log('Imported:', importedIcons.size);
console.log('Used:', usedIcons.size);

const missing = [];
for (const icon of usedIcons) {
    if (!importedIcons.has(icon) && !['motion', 'AnimatePresence', 'Route', 'Routes', 'BrowserRouter', 'Link', 'Navigate', 'Provider', 'MapChart', 'AdminDashboard', 'FounderDashboard', 'RegulatorDashboard', 'OperationsDashboard', 'ExternalAdminDashboard', 'TeleHealthDashboard', 'BusinessDashboard', 'SubscriptionPortal', 'LegislativeIntelTab', 'CreditScoreTab', 'CareWalletTab', 'AppointmentTab', 'MyCardsTab', 'MyApplicationsTab', 'ComplianceDashboard', 'ProviderDirectoryTab', 'AttorneyDirectoryTab', 'DocumentVaultTab', 'EducationTab', 'MarketplaceTab', 'AttorneyMarketplaceTab', 'CardIntakeWizard', 'App', 'Component', 'FirebaseUser'].includes(icon)) {
        missing.push(icon);
    }
}

console.log('Missing Icons:', missing);

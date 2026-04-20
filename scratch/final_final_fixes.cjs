const fs = require('fs');

// 1. Fix App.tsx - Add Gavel and Headphones to imports
let appC = fs.readFileSync('src/App.tsx', 'utf8');
if (!appC.includes('Gavel') && appC.includes('lucide-react')) {
    appC = appC.replace('Shield,', 'Shield, Gavel, Headphones,');
}
fs.writeFileSync('src/App.tsx', appC);

// 2. Fix BusinessDashboard.tsx
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');

// Remove the content I injected in the wrong place
businessC = businessC.replace(/{activeTab === 'wallet' && <CareWalletTab user={user} \/>}\n\nexport const BusinessDashboard/g, 'export const BusinessDashboard');

// Correctly inject the wallet tab content inside the component
// Find the end of the last tab content or a good spot
const integrationsTab = "{activeTab === 'integrations' && (";
if (businessC.includes(integrationsTab)) {
    const walletTabContent = `{activeTab === 'wallet' && <CareWalletTab userProfile={user} />}`; // Fixed prop name to userProfile
    businessC = businessC.replace(integrationsTab, walletTabContent + '\n    ' + integrationsTab);
}

// Ensure Wallet is in imports
if (!businessC.includes('Wallet') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('Building2,', 'Building2, Wallet,');
}

fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

console.log('Final fixes applied to App.tsx and BusinessDashboard.tsx.');

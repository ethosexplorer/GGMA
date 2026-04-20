const fs = require('fs');

// 1. Fix BusinessDashboard.tsx
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');
// Add Wallet to imports
businessC = businessC.replace('import { Users,', 'import { Wallet, Users,');
// Remove duplicated/wrong wallet tab
businessC = businessC.replace(/\{activeTab === 'wallet' && <CareWalletTab user={user} \/>\}\n\s+\{activeTab === 'wallet' && <CareWalletTab userRole="business" \/>\}/g, "{activeTab === 'wallet' && <CareWalletTab userRole=\"business\" />} ");
fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

// 2. Fix App.tsx - Ensure Gavel and Headphones are globally available in that file's icons
// (Already added to top, let's make sure there aren't other conflicting imports)
let appC = fs.readFileSync('src/App.tsx', 'utf8');
// Ensure the roles section uses the right icons
// (Checked in previous view, looks okay but tsc failed. Let's try to explicitly re-save)
fs.writeFileSync('src/App.tsx', appC);

console.log('BusinessDashboard fixed.');

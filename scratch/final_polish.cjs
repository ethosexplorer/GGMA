const fs = require('fs');

// 1. Fix App.tsx - Add Gavel and Headphones to THE main lucide-react import
let appC = fs.readFileSync('src/App.tsx', 'utf8');
const iconImportStart = appC.indexOf('import {');
const iconImportEnd = appC.indexOf('} from \'lucide-react\';');
if (iconImportStart !== -1 && iconImportEnd !== -1) {
    let icons = appC.substring(iconImportStart + 8, iconImportEnd);
    if (!icons.includes('Gavel')) icons += '  Gavel,\n';
    if (!icons.includes('Headphones')) icons += '  Headphones,\n';
    appC = appC.substring(0, iconImportStart + 8) + icons + appC.substring(iconImportEnd);
}
fs.writeFileSync('src/App.tsx', appC);

// 2. Fix BusinessDashboard.tsx
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');

// Ensure Wallet is in imports
if (!businessC.includes('Wallet') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('import {', 'import { Wallet,');
}

// Fix CareWalletTab prop
businessC = businessC.replace(/<CareWalletTab userProfile={user} \/>/g, '<CareWalletTab userRole="business" />');

fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

console.log('Final polish applied. Icons added, Wallet prop fixed.');

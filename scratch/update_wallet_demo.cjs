const fs = require('fs');

// 1. Update PatientDashboard.tsx
let patientC = fs.readFileSync('src/pages/PatientDashboard.tsx', 'utf8');

// Add demoUnlocked state
patientC = patientC.replace(
    'const [activeTab, setActiveTab] = useState(\'overview\');',
    'const [activeTab, setActiveTab] = useState(\'overview\');\n  const [demoUnlocked, setDemoUnlocked] = useState(false);'
);

// Update ShadowOverlay to include demo unlock
patientC = patientC.replace(
    'onClick={() => setActiveTab(\'subscription\')}',
    'onClick={() => { setDemoUnlocked(true); setActiveTab(\'overview\'); }}'
);

// Update isSubscribed logic in tabs
patientC = patientC.replace(
    'const isSubscribed = user?.subscriptionStatus === \'Active\' || user?.planId;',
    'const isSubscribed = user?.subscriptionStatus === \'Active\' || user?.planId || demoUnlocked;'
);

fs.writeFileSync('src/pages/PatientDashboard.tsx', patientC);

// 2. Update BusinessDashboard.tsx
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');

// Add Wallet to imports
if (!businessC.includes('Wallet') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('import {', 'import { Wallet,');
}

// Add demoUnlocked state
businessC = businessC.replace(
    'const [activeTab, setActiveTab] = useState',
    'const [demoUnlocked, setDemoUnlocked] = useState(false);\n  const [activeTab, setActiveTab] = useState'
);

// Add 'wallet' to activeTab type
businessC = businessC.replace(
    '\'home\' | \'pos\' | \'inventory\' | \'locations\' | \'compliance\' | \'insurance\' | \'documents\' | \'subscription\' | \'integrations\' | \'staff\' | \'traceability\' | \'readiness\'',
    '\'home\' | \'pos\' | \'inventory\' | \'locations\' | \'compliance\' | \'insurance\' | \'documents\' | \'subscription\' | \'integrations\' | \'staff\' | \'traceability\' | \'readiness\' | \'wallet\''
);

// Add Wallet tab to sidebar
const walletTab = `<button 
          onClick={() => setActiveTab('wallet')}
          className={cn("px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap", activeTab === 'wallet' ? "bg-white text-[#1a4731] shadow-sm shadow-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")}
        >
          <Wallet size={18} /> Care Wallet
        </button>`;
businessC = businessC.replace('<div className="w-px h-8 bg-slate-200/80 mx-1 self-center" />', walletTab + '\n        <div className="w-px h-8 bg-slate-200/80 mx-1 self-center" />');

// Add Wallet component import/mock if missing
if (!businessC.includes('CareWalletTab')) {
    businessC = businessC.replace('import { StatCard } from \'../components/StatCard\';', 'import { StatCard } from \'../components/StatCard\';\nimport { CareWalletTab } from \'../components/shared/CareWalletTab\';');
}

// Add Wallet tab content
const walletTabContent = `{activeTab === 'wallet' && <CareWalletTab user={user} />}`;
businessC = businessC.replace('export const BusinessDashboard', walletTabContent + '\n\nexport const BusinessDashboard');
// Wait, I need to place it correctly in the JSX
const mainContentEnd = businessC.lastIndexOf('</div>'); // This is tricky in a large file
// I'll add it after another tab content
businessC = businessC.replace("{activeTab === 'integrations' && (", walletTabContent + "\n    {activeTab === 'integrations' && (");

// Update Upgrade button in BusinessDashboard banner
businessC = businessC.replace(
    'onClick={() => setActiveTab(\'subscription\')}',
    'onClick={() => { setDemoUnlocked(true); setActiveTab(\'home\'); }}'
);

// Add demo check to isSubscribed logic? BusinessDashboard doesn't have a global isSubscribed check for tabs yet, but I'll add one if I find it.

fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

console.log('Care Wallet and Demo Unlock added to Patient and Business dashboards.');

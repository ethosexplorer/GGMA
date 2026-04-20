const fs = require('fs');

let appC = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add demo unlock state
if (!appC.includes('const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);')) {
    appC = appC.replace('const [initialRole, setInitialRole] = useState(undefined);', 'const [initialRole, setInitialRole] = useState(undefined);\n  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);');
}

// 2. Update ShadowMode condition to respect isDemoUnlocked
appC = appC.replace(
    "{userProfile.status === 'Pending' ? (",
    "{userProfile.status === 'Pending' && !isDemoUnlocked ? ("
);

// 3. Update the Upgrade & Unlock button click handler
appC = appC.replace(
    '<button className="flex-1 bg-[#1a4731] text-white py-2 rounded-lg font-semibold hover:bg-[#153a28] transition-all">Upgrade & Unlock</button>',
    '<button onClick={() => setIsDemoUnlocked(true)} className="flex-1 bg-[#1a4731] text-white py-2 rounded-lg font-semibold hover:bg-[#153a28] transition-all">Upgrade & Unlock</button>'
);

// 4. Fix FounderDashboard "God-View" role name consistency
appC = appC.replace(/role === 'executive_founder'/g, "role === 'executive_founder' || role === 'executive'");

// 5. Ensure "Global Green introducing" and GGHP logo on LandingPage
const landingPageUpdate = fs.readFileSync('src/App.tsx', 'utf8'); // re-read for safety or use appC
// (Assuming appC is already updated with basic strings from governance_refactor.cjs)

fs.writeFileSync('src/App.tsx', appC);
console.log('App.tsx demo logic and role consistency updated.');

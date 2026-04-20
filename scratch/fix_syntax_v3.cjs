const fs = require('fs');

// 1. Fix App.tsx - Remove setInitialRole calls from LandingPage
let appC = fs.readFileSync('src/App.tsx', 'utf8');
appC = appC.replace(/setInitialRole\('[^']+'\);/g, ''); // Remove the calls
appC = appC.replace(/onClick=\{\(\) => \{ onNavigate\('signup', '([^']+)'\); \}\}/g, "onClick={() => onNavigate('signup', '$1')}");

fs.writeFileSync('src/App.tsx', appC);

// 2. Fix BusinessDashboard.tsx - import Users
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');
if (!businessC.includes('Users') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('import {', 'import { Users,');
}
fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

console.log('App.tsx and BusinessDashboard.tsx syntax fixed correctly (v3).');

const fs = require('fs');

// 1. Fix App.tsx - pass setInitialRole to LandingPage
let appC = fs.readFileSync('src/App.tsx', 'utf8');
appC = appC.replace(
    'const LandingPage = ({ onNavigate }: { onNavigate: (view: \'login\' | \'signup\' | \'patient-portal\' | \'support\' | \'larry-chatbot\' | \'larry-business\', role?: string) => void }) => {',
    'const LandingPage = ({ onNavigate, setInitialRole }: { onNavigate: (view: \'login\' | \'signup\' | \'patient-portal\' | \'support\' | \'larry-chatbot\' | \'larry-business\', role?: string) => void, setInitialRole: (role: any) => void }) => {'
);
// Fix usage of LandingPage in App component
appC = appC.replace(
    '<LandingPage onNavigate={setView} />',
    '<LandingPage onNavigate={setView} setInitialRole={setInitialRole} />'
);

fs.writeFileSync('src/App.tsx', appC);

// 2. Fix BusinessDashboard.tsx - import Users
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');
if (!businessC.includes('Users') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('import {', 'import { Users,');
}
fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

console.log('App.tsx and BusinessDashboard.tsx syntax fixed.');

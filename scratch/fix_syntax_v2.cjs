const fs = require('fs');

// 1. Fix App.tsx - Revert LandingPage definition and update usage
let appC = fs.readFileSync('src/App.tsx', 'utf8');

// Revert definition
appC = appC.replace(
    'const LandingPage = ({ onNavigate, setInitialRole }: { onNavigate: (view: \'login\' | \'signup\' | \'patient-portal\' | \'support\' | \'larry-chatbot\' | \'larry-business\', role?: string) => void, setInitialRole: (role: any) => void }) => {',
    'const LandingPage = ({ onNavigate }: { onNavigate: (view: \'login\' | \'signup\' | \'patient-portal\' | \'support\' | \'larry-chatbot\' | \'larry-business\', role?: string) => void }) => {'
);

// Update usage (the one tsc complained about)
const oldUsage = `<LandingPage
              onNavigate={(v, role) => {
                setView(v as any);
                setInitialRole(role);
              }}
            />`;
const newUsage = `<LandingPage
              onNavigate={(v, role) => {
                setView(v as any);
                setInitialRole(role);
              }}
            />`; 
// Wait, the previous script changed it to <LandingPage onNavigate={setView} setInitialRole={setInitialRole} /> but maybe it didn't find the multi-line block.

// Let's do a more robust replacement for usage
const usageStart = appC.indexOf('{view === \'landing\' && (');
const usageEnd = appC.indexOf(')}', usageStart) + 2;
const fixedUsage = `{view === 'landing' && (
            <LandingPage
              onNavigate={(v, role) => {
                setView(v as any);
                if (role) setInitialRole(role);
              }}
            />
          )}`;
appC = appC.substring(0, usageStart) + fixedUsage + appC.substring(usageEnd);

fs.writeFileSync('src/App.tsx', appC);

// 2. Fix BusinessDashboard.tsx - import Users
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');
if (!businessC.includes('Users') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('import { ', 'import { Users, ');
}
fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

console.log('App.tsx and BusinessDashboard.tsx syntax fixed correctly.');

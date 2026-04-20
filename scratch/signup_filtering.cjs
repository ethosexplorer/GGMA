const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix the SignupScreen icons loop
const oldLoop = `                                {cat === 'Public' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Law Enforcement' && <Shield size={18} className="text-[#1a4731]" />}
                                {cat === 'Regulators' && <Activity size={18} className="text-orange-500" />}
                                {cat === 'Executive' && <BarChart3 size={18} className="text-indigo-500" />}
                                {cat === 'Operations' && <Cpu size={18} className="text-slate-500" />}`;

const newLoop = `                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}`;

c = c.replace(oldLoop, newLoop);

// 2. Modify LandingPage to use category names
c = c.replace(
    "onClick={() => onNavigate('signup', 'business')}",
    "onClick={() => onNavigate('signup', 'Business')}"
);
c = c.replace(
    "onClick={() => onNavigate('signup', 'user')}",
    "onClick={() => onNavigate('signup', 'Patient')}"
);
c = c.replace(
    "onClick={() => onNavigate('login', 'admin')}",
    "onClick={() => onNavigate('signup', 'Oversight')}"
);

// 3. Modify SignupScreen to filter categories if initialRole is a category
// Change initialRole to initialCategory in App state and SignupScreen props
c = c.replace(
    'const [signupRole, setSignupRole] = useState<string>("user");',
    'const [signupRole, setSignupRole] = useState<string>("Patient");'
);

// 4. In SignupScreen, filter categories
const oldCatMap = "['Patient', 'Business', 'Oversight'].map((cat) => (";
const newCatMap = "['Patient', 'Business', 'Oversight'].filter(cat => !initialRole || initialRole === 'all' || cat === initialRole).map((cat) => (";
c = c.replace(oldCatMap, newCatMap);

// 5. Update the "Oversight Portal" card button label to "Oversight Access"
c = c.replace('Admin Login', 'Oversight Access');

// 6. Ensure Oversight roles lead to OversightDashboard
// The user said: "Regulators, Executive and operation in admin portal tab to sign up their orginal way we had with their own individual dashboards"
// In App.tsx renderDashboardByRole:
const oldAdminRender = "case 'admin':\n      return <AdminDashboard onLogout={onLogout} user={user} />;";
const newAdminRender = `    case 'admin':
    case 'enforcement_state':
    case 'regulator_state':
    case 'executive_founder':
    case 'backoffice_staff':
      return <AdminDashboard onLogout={onLogout} user={user} />;`;

c = c.replace(oldAdminRender, newAdminRender);

fs.writeFileSync('src/App.tsx', c);
console.log('Signup separation and Category filtering implemented.');

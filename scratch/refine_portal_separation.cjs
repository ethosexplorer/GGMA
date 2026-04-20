const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the categories in SignupScreen
c = c.replace(
    "['Public', 'Law Enforcement', 'Regulators', 'Executive', 'Operations']",
    "['Patient', 'Business', 'Oversight']"
);

// 2. Update the category icons and labels in the loop
const oldCatIcons = `                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Public' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Law Enforcement' && <Shield size={18} className="text-[#1a4731]" />}
                                {cat === 'Regulators' && <Activity size={18} className="text-orange-500" />}
                                {cat === 'Executive' && <BarChart3 size={18} className="text-indigo-500" />}
                                {cat === 'Operations' && <Cpu size={18} className="text-slate-500" />}
                                {cat}
                            </h2>`;

const newCatIcons = `                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}
                                {cat} Portal Roles
                            </h2>`;

c = c.replace(oldCatIcons, newCatIcons);

// 3. Update the Landing Page Portal Cards
// Change "Government / Admin Portal Card" back to "Oversight Portal" (I already did that, but let's make sure)
c = c.replace(
    '<p className="text-sm italic text-slate-600 mb-6">\n                Regulators, Law Enforcement, Auditors, Public Health\n              </p>',
    '<p className="text-sm italic text-slate-600 mb-6">\n                Law Enforcement (RIP), Regulators, Executives, Operations\n              </p>'
);

// 4. Update the Business Portal Card to mention the 4 roles
c = c.replace(
    '<p className="text-slate-500 text-sm leading-relaxed mb-4">\n                Enterprise-grade tools for dispensaries, cultivators, and medical clinics to manage state-mandated reporting and financials.\n              </p>',
    '<p className="text-slate-500 text-sm leading-relaxed mb-4">\n                Unified ecosystem for Compliance Services, Business Entities, Medical Providers, and Legal Counsel.\n              </p>'
);

// 5. Fix the redirect for Business Onboarding to open the right category
// In App.tsx, look for the LandingPage buttons
// We already have onNavigate('signup', 'business') which sets initialRoleCategory

// 6. Add "compliance_service" to the renderDashboardByRole
const oldRender = `    case 'business':
      return <BusinessDashboard onLogout={onLogout} user={user} />;
    case 'provider':`;

const newRender = `    case 'compliance_service':
    case 'business':
      return <BusinessDashboard onLogout={onLogout} user={user} />;
    case 'provider':`;

c = c.replace(oldRender, newRender);

// 7. Add "compliance_service" to DashboardLayout normalization
const oldNorm = `  const normalizedRole = 
    (role === 'business' || role === 'provider' || role === 'attorney') ? 'business' :
    (role.startsWith('regulator') || role.startsWith('enforcement') || role.startsWith('executive') || role === 'backoffice_staff') ? 'admin' : 
    'user';`;

const newNorm = `  const normalizedRole = 
    (role === 'business' || role === 'compliance_service' || role === 'provider' || role === 'attorney') ? 'business' :
    (role.startsWith('regulator') || role.startsWith('enforcement') || role.startsWith('executive') || role === 'backoffice_staff') ? 'admin' : 
    'user';`;

c = c.replace(oldNorm, newNorm);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx refined for Portal separation.');

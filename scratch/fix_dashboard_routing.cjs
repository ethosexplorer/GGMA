const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Correct renderDashboardByRole logic
const renderStart = c.indexOf('const renderDashboardByRole = (profile: any) => {');
const renderEnd = c.indexOf('  };', renderStart) + 4;

const newRender = `  const renderDashboardByRole = (profile: any) => {
    if (!profile) return null;
    const role = profile.role;
    
    // Oversight Portal Routing
    if (role === 'admin' || role === 'executive_founder' || role === 'executive_ceo') {
      return <AdminDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'enforcement_state' || role?.startsWith('enforcement')) {
      return <EnforcementDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'regulator_state' || role?.startsWith('regulator')) {
      return <AdminDashboard onLogout={handleLogout} user={profile} />; 
    }
    if (role === 'backoffice_staff' || role?.startsWith('backoffice')) {
      return <AdminDashboard onLogout={handleLogout} user={profile} />; 
    }

    // Business Portal Routing
    if (role === 'provider') {
      return <ProviderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'attorney') {
      return <AttorneyDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'business' || role === 'compliance_service') {
      return <BusinessDashboard onLogout={handleLogout} user={profile} />;
    }

    // Patient Portal Routing
    if (role === 'user' || role === 'Patient / Caregiver') {
      return (
        <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
          <PatientDashboard user={profile} />
        </DashboardLayout>
      );
    }
    
    // Fallback to Patient Dashboard for unknown user roles
    return (
      <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
        <PatientDashboard user={profile} />
      </DashboardLayout>
    );
  };`;

c = c.substring(0, renderStart) + newRender + c.substring(renderEnd);

// 2. Fix Signup roles icons
const oldLoop = c.match(/<h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">[\s\S]*?<\/h2>/);
if (oldLoop) {
    const newLoop = `<h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}
                                {cat}
                            </h2>`;
    c = c.replace(oldLoop[0], newLoop);
}

// 3. Ensure "Oversight Portal" Card button navigates to 'Oversight' category
c = c.replace(
    "onClick={() => onNavigate('signup', 'Oversight')}",
    "onClick={() => { onNavigate('signup', 'Oversight'); setInitialRole('Oversight'); }}"
);
c = c.replace(
    "onClick={() => onNavigate('signup', 'Business')}",
    "onClick={() => { onNavigate('signup', 'Business'); setInitialRole('Business'); }}"
);
c = c.replace(
    "onClick={() => onNavigate('signup', 'Patient')}",
    "onClick={() => { onNavigate('signup', 'Patient'); setInitialRole('Patient'); }}"
);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx Dashboard routing and Signup navigation fixed.');

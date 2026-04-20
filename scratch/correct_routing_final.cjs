const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Correct the roles array in SignupScreen
const rolesStart = c.indexOf('const roles = [');
const rolesEnd = c.indexOf('];', rolesStart) + 2;

const newRoles = `  const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES
    { id: 'compliance_service', label: 'Patient / Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies that manage cards and compliance for their own client base.' },
    { id: 'business', label: 'Business Entity (Dispensary/Cultivator)', category: 'Business', icon: Building2, desc: 'Commercial operators requiring state-integrated compliance tools.' },
    { id: 'provider', label: 'Medical Provider', category: 'Business', icon: Stethoscope, desc: 'Physicians and clinics performing evaluations and certifications.' },
    { id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel managing multi-state licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing (RIP) for authorized agencies.' },
    { id: 'regulator_state', label: 'Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'State-level licensing authority and legal oversight bodies.' },
    { id: 'executive_founder', label: 'Executive Founder', category: 'Oversight', icon: BarChart3, desc: 'Platform Founder and Leadership. Ultimate Oversight Command.' },
    { id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },
  ];`;

c = c.substring(0, rolesStart) + newRoles + c.substring(rolesEnd);

// 2. Correct renderDashboardByRole
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
      return <AdminDashboard onLogout={handleLogout} user={profile} />; // Use Oversight Command
    }
    if (role === 'backoffice_staff' || role?.startsWith('backoffice')) {
      return <AdminDashboard onLogout={handleLogout} user={profile} />; // Use Oversight Command
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
    
    // Fallback
    return (
      <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
        <div className="p-20 text-center">
          <h2 className="text-2xl font-bold">Dashboard for {role} not implemented yet.</h2>
        </div>
      </DashboardLayout>
    );
  };`;

c = c.substring(0, renderStart) + newRender + c.substring(renderEnd);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx routing and roles corrected.');

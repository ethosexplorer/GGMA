const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the roles array with the new 3-set structure + Call Center
const rolesStart = c.indexOf('const roles = [');
const rolesEnd = c.indexOf('];', rolesStart) + 2;

const newRoles = `  const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES
    { id: 'business_owner', label: 'Business Owner / CEO', category: 'Business', icon: Building2, desc: 'Commercial operators requiring state-integrated compliance tools.' },
    { id: 'compliance_service', label: 'Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies that manage cards and compliance for their own client base.' },
    { id: 'medical_provider_md', label: 'Medical Provider (MD/DO)', category: 'Business', icon: Stethoscope, desc: 'Licensed physicians performing evaluations and certifications.' },
    { id: 'medical_provider_staff', label: 'Medical Office Staff', category: 'Business', icon: Users, desc: 'Administrative staff for medical practices.' },
    { id: 'attorney_lawyer', label: 'Attorney / Lawyer', category: 'Business', icon: Briefcase, desc: 'Legal counsel managing licensing and compliance portfolios.' },
    { id: 'attorney_staff', label: 'Legal Support Staff', category: 'Business', icon: Users, desc: 'Paralegals and administrative staff for law firms.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'executive_founder', label: 'Executive Founder', category: 'Oversight', icon: BarChart3, desc: 'Ultimate Oversight Command. God-view access.' },
    { id: 'internal_admin', label: 'Internal Administrator', category: 'Oversight', icon: Shield, desc: 'High-level system administration. Jesus-view access.' },
    { id: 'regulator_state', label: 'State Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'Government oversight for patient/business approvals.' },
    { id: 'enforcement_rip', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Gavel, desc: 'Real-time Intelligence & Policing for field officers.' },

    // CALL CENTER / OPERATIONS ROLES
    { id: 'ops_manager', label: 'Operations Manager', category: 'Operations', icon: Cpu, desc: 'Managing escalation and human support workflows.' },
    { id: 'ops_supervisor', label: 'Call Center Supervisor', category: 'Operations', icon: Headphones, desc: 'Supervising agent activity and complex case resolution.' },
    { id: 'ops_agent', label: 'Support Agent', category: 'Operations', icon: MessageSquare, desc: 'Human-in-the-loop support for patient and business inquiries.' },
  ];`;

c = c.substring(0, rolesStart) + newRoles + c.substring(rolesEnd);

// 2. Update the Signup Category loop to include "Operations"
const catLoopStart = c.indexOf("['Patient', 'Business', 'Oversight']");
if (catLoopStart !== -1) {
    c = c.replace("['Patient', 'Business', 'Oversight']", "['Patient', 'Business', 'Oversight', 'Operations']");
}

// 3. Update the category icons in the loop
const catIconsOld = `                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}`;

const catIconsNew = `                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}
                                {cat === 'Operations' && <Headphones size={18} className="text-indigo-500" />}`;

c = c.replace(catIconsOld, catIconsNew);

// 4. Update renderDashboardByRole with the new specific roles
const renderStart = c.indexOf('const renderDashboardByRole = (profile: any) => {');
const renderEnd = c.indexOf('  };', renderStart) + 4;

const newRender = `  const renderDashboardByRole = (profile: any) => {
    if (!profile) return null;
    const role = profile.role;
    
    // Oversight Portal Routing
    if (role === 'executive_founder') {
      return <FounderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'internal_admin' || role === 'admin') {
      return <AdminDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'regulator_state' || role === 'regulator_local' || role?.startsWith('regulator')) {
      return <RegulatorDashboard onLogout={handleLogout} user={profile} />; 
    }
    if (role === 'enforcement_rip' || role?.startsWith('enforcement')) {
      return <EnforcementDashboard onLogout={handleLogout} user={profile} />;
    }

    // Operations / Call Center Routing
    if (role?.startsWith('ops_')) {
      return <OperationsDashboard onLogout={handleLogout} user={profile} />;
    }

    // Business Portal Routing
    if (role?.startsWith('medical_provider_')) {
      return <ProviderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role?.startsWith('attorney_')) {
      return <AttorneyDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'business_owner' || role === 'business_manager' || role === 'business' || role === 'compliance_service') {
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
        <PatientDashboard user={profile} />
      </DashboardLayout>
    );
  };`;

c = c.substring(0, renderStart) + newRender + c.substring(renderEnd);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx roles and routing updated for God/Jesus/State/Ops views.');

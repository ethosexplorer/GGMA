const fs = require('fs');

// 1. Fix BusinessDashboard.tsx - Ensure Wallet and CareWalletTab are correct
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');
if (!businessC.includes('Wallet') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('Building2,', 'Building2, Wallet,');
}
// Clean up double wallet tab and fix prop
businessC = businessC.replace(/\{activeTab === 'wallet' && <CareWalletTab user=\{user\} \/>\}/g, '');
businessC = businessC.replace(/\{activeTab === 'wallet' && <CareWalletTab userRole="business" \/>\}/g, '');
// Inject correctly
if (businessC.includes("{activeTab === 'integrations' && (")) {
    businessC = businessC.replace("{activeTab === 'integrations' && (", "{activeTab === 'wallet' && <CareWalletTab userRole=\"business\" />}\n    {activeTab === 'integrations' && (");
}
fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

// 2. Fix App.tsx
let appC = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Icons in App.tsx
if (!appC.includes('Gavel') && appC.includes('lucide-react')) {
    appC = appC.replace('Shield,', 'Shield, Gavel, Headphones,');
}

// Update renderDashboardByRole to match the 4 domains
const renderDashboardByRoleCode = `const renderDashboardByRole = (profile: any) => {
    if (!profile) return null;
    const role = profile.role;
    
    // 1. OVERSIGHT PORTAL
    if (role === 'executive_founder') {
      return <FounderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'internal_admin' || role === 'admin') {
      return <AdminDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'regulator_state' || role?.startsWith('regulator')) {
      return <RegulatorDashboard onLogout={handleLogout} user={profile} />; 
    }
    if (role === 'enforcement_rip' || role === 'RIP' || role?.startsWith('enforcement')) {
      return <EnforcementDashboard onLogout={handleLogout} user={profile} />;
    }

    // 2. OPERATIONS / CALL CENTER PORTAL
    if (role === 'ops_staff' || role?.startsWith('ops_')) {
      return <OperationsDashboard onLogout={handleLogout} user={profile} />;
    }

    // 3. BUSINESS PORTAL
    if (role === 'business_owner' || role === 'business_entity' || role === 'compliance_service' || role?.startsWith('business_')) {
      return <BusinessDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role?.startsWith('medical_provider_')) {
      return <ProviderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role?.startsWith('attorney_')) {
      return <AttorneyDashboard onLogout={handleLogout} user={profile} />;
    }

    // 4. PATIENT PORTAL
    if (role === 'user' || role === 'Patient / Caregiver' || role === 'patient') {
      return (
        <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
          <PatientDashboard user={profile} />
        </DashboardLayout>
      );
    }
    
    // Default
    return (
      <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
        <PatientDashboard user={profile} />
      </DashboardLayout>
    );
  };`;

appC = appC.replace(/const renderDashboardByRole = \(profile: any\) => \{[\s\S]+?\n\s+};/m, renderDashboardByRoleCode);

// Update SignupScreen roles to the refined list
const signupRoles = `const roles = [
    { id: 'patient', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL
    { id: 'business_owner', label: 'Business Entity (Owner/CEO)', category: 'Business', icon: Building2, desc: 'Commercial operators requiring state-integrated compliance tools.' },
    { id: 'compliance_service', label: 'Patient / Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies that manage cards and compliance for their own client base.' },
    { id: 'medical_provider_md', label: 'Medical Provider (Physician)', category: 'Business', icon: Stethoscope, desc: 'Licensed professionals performing evaluations and certifications.' },
    { id: 'attorney_lawyer', label: 'Attorney / Law Firm', category: 'Business', icon: Gavel, desc: 'Legal counsel managing licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL
    { id: 'executive_founder', label: 'Executive Founder (God-View)', category: 'Oversight', icon: BarChart3, desc: 'Super-user access for ultimate platform governance and visibility.' },
    { id: 'internal_admin', label: 'Internal Administrator (Jesus-View)', category: 'Oversight', icon: Shield, desc: 'Platform management and high-level operational support.' },
    { id: 'regulator_state', label: 'State Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'Government oversight for approvals and jurisdiction tracking.' },
    { id: 'enforcement_rip', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing for field officers.' },

    // OPERATIONS PORTAL
    { id: 'ops_staff', label: 'Operations / Call Center', category: 'Operations', icon: Headphones, desc: 'Support agents managing human-in-the-loop workflows.' },
  ];`;

appC = appC.replace(/const roles = \[[\s\S]+?\];/m, signupRoles);

// Update Landing Page branding
appC = appC.replace(/Global Green introducing/g, 'Global Green introducing');
appC = appC.replace(/Oversight Portal/g, 'Oversight & RIP Portal');

fs.writeFileSync('src/App.tsx', appC);

console.log('Core governance structure updated.');

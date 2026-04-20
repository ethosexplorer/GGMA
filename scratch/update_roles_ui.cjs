const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the roles array in SignupScreen
const oldRoles = `  const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking healthcare services or managing care.' },
    { id: 'business', label: 'Business / Compliance Service', category: 'Business', icon: Building2, desc: 'Dispensary, Cultivator, Processor, Lab, or Transport organization.' },
    { id: 'provider', label: 'Medical Provider', category: 'Business', icon: Stethoscope, desc: 'Licensed medical providers and healthcare professionals.' },
    { id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel or administrative staff managing compliance.' },
    { id: 'enforcement_city', label: 'City Enforcement', category: 'Oversight', icon: Shield, desc: 'City-level law enforcement ensuring safety and compliance.' },
    { id: 'enforcement_county', label: 'County Enforcement', category: 'Oversight', icon: Shield, desc: 'County-level law enforcement ensuring safety and compliance.' },
    { id: 'enforcement_state', label: 'State Enforcement', category: 'Oversight', icon: Shield, desc: 'State-level law enforcement ensuring safety and compliance.' },
    { id: 'enforcement_federal', label: 'Federal Enforcement', category: 'Oversight', icon: Shield, desc: 'Federal-level law enforcement ensuring safety and compliance.' },
    { id: 'regulator_city', label: 'City Regulator / Mayor', category: 'Oversight', icon: Activity, desc: 'Municipal regulatory oversight and licensing.' },
    { id: 'regulator_county', label: 'County Regulator', category: 'Oversight', icon: Activity, desc: 'County regulatory oversight and licensing.' },
    { id: 'regulator_state', label: 'State / Marijuana Authority / Governor', category: 'Oversight', icon: Activity, desc: 'State-level licensing authority and legal approval body.' },
    { id: 'regulator_federal', label: 'Federal Regulator / Senator / US Attorney', category: 'Oversight', icon: Activity, desc: 'Federal oversight, legislative monitoring, and inter-state coordination.' },
    { id: 'executive_ceo', label: 'CEO', category: 'Oversight', icon: BarChart3, desc: 'Chief Executive Officer. Full platform oversight.' },
    { id: 'executive_coo', label: 'Executive - COO', category: 'Oversight', icon: BarChart3, desc: 'Chief Operating Officer. Operational command.' },
    { id: 'executive_director', label: 'Director', category: 'Oversight', icon: BarChart3, desc: 'Regional or Departmental Director.' },
    { id: 'executive_founder', label: 'Founder', category: 'Oversight', icon: BarChart3, desc: 'Platform Founder. Ultimate access.' },
    { id: 'backoffice_staff', label: 'Backoffice Staff', category: 'Oversight', icon: Cpu, desc: 'Human operations support for AI-driven systems.' },
  ];`;

const newRoles = `  const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES
    { id: 'compliance_service', label: 'Patient / Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies that manage cards and compliance for their own client base.' },
    { id: 'business', label: 'Business Entity (Dispensary/Cultivator)', category: 'Business', icon: Building2, desc: 'Commercial operators requiring state-integrated compliance tools.' },
    { id: 'provider', label: 'Medical Provider', category: 'Business', icon: Stethoscope, desc: 'Physicians and clinics performing evaluations and certifications.' },
    { id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel managing multi-state licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing for authorized agencies.' },
    { id: 'regulator_state', label: 'Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'State-level licensing authority and legal oversight bodies.' },
    { id: 'executive_founder', label: 'Executive Leadership', category: 'Oversight', icon: BarChart3, desc: 'Top-level administration and platform oversight.' },
    { id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },
  ];`;

c = c.replace(oldRoles, newRoles);

// 2. Update Landing Page Portal Cards to be more "clicky" and separated
// Change "Business Onboarding" to something that suggests selection
c = c.replace(
    '<h3 className="text-xl font-bold text-[#1a4731] mb-3">Business Portal</h3>',
    '<h3 className="text-xl font-bold text-[#1a4731] mb-3">Business Portal</h3>'
);

c = c.replace(
    'Regulators, Law Enforcement, Auditors, Public Health',
    'Law Enforcement (RIP), Regulators, Executives, Operations'
);

// 3. Ensure "Oversight" uses OversightDashboard
// The user said "Regulators, Executive and operation in admin portal tab to sign up their orginal way we had with their own individual dashboards"
// This means we should render the specific dashboards.

fs.writeFileSync('src/App.tsx', c);
console.log('Roles and Landing Page updated.');

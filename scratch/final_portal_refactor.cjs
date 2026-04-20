const fs = require('fs');

// 1. Fix BusinessDashboard.tsx - Wallet icon and duplicated tab
let businessC = fs.readFileSync('src/pages/BusinessDashboard.tsx', 'utf8');
if (!businessC.includes('Wallet') && businessC.includes('lucide-react')) {
    businessC = businessC.replace('Building2,', 'Building2, Wallet,');
}
// Remove duplicate wallet tab if exists
businessC = businessC.replace(/\{activeTab === 'wallet' && <CareWalletTab user=\{user\} \/>\}\n\s+\{activeTab === 'wallet' && <CareWalletTab userRole="business" \/>\}/g, '{activeTab === "wallet" && <CareWalletTab userRole="business" />}');
fs.writeFileSync('src/pages/BusinessDashboard.tsx', businessC);

// 2. Update App.tsx
let appC = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Icons
if (!appC.includes('Gavel') && appC.includes('lucide-react')) {
    appC = appC.replace('Shield,', 'Shield, Gavel, Headphones,');
}

// Update Landing Page Hero
const heroText = `<p className="text-[#1a4731] font-black tracking-[0.4em] uppercase text-[10px] mb-[-15px] opacity-80 flex items-center gap-2 justify-center">
            <Sparkles size={12} className="text-amber-500" /> Global Green introducing
          </p>`;
appC = appC.replace(/<p className="text=\[#1a4731\] font-bold tracking-\[0\.3em\] uppercase text-xs mb-\[-10px\] opacity-70">Global Green introducing<\/p>/, heroText);

// Update Oversight Card in Landing Page
const oversightCardText = `<h3 className="text-xl font-bold text-[#3E2723] mb-3">Oversight & RIP Portal</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Authorized command center for real-time intelligence, policing (RIP), and regulatory oversight. Establish jurisdiction-wide compliance nodes.
              </p>`;
appC = appC.replace(/<h3 className="text-xl font-bold text=\[#3E2723\] mb-3">Oversight Portal<\/h3>[\s\S]+?<p className="text-slate-500 text-sm leading-relaxed mb-4">[\s\S]+?<\/p>/, oversightCardText);

// Update Roles in SignupScreen to be more professional
const roleDefinitions = `const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES
    { id: 'business_owner', label: 'Business Entity (Owner/CEO)', category: 'Business', icon: Building2, desc: 'Commercial operators requiring state-integrated compliance tools.' },
    { id: 'compliance_service', label: 'Patient / Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies that manage cards and compliance for their own client base.' },
    { id: 'medical_provider_md', label: 'Medical Provider (Physician)', category: 'Business', icon: Stethoscope, desc: 'Licensed MD/DO/NP/PA performing evaluations and certifications.' },
    { id: 'attorney_lawyer', label: 'Attorney / Law Firm', category: 'Business', icon: Gavel, desc: 'Legal counsel managing licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'executive_founder', label: 'Executive Founder', category: 'Oversight', icon: BarChart3, desc: 'Super-user God-View. Ultimate platform visibility and global controls.' },
    { id: 'internal_admin', label: 'Internal Administrator', category: 'Oversight', icon: Shield, desc: 'System-wide Jesus-View. Platform management and operational support.' },
    { id: 'regulator_state', label: 'State Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'Government oversight for patient/business approvals and compliance.' },
    { id: 'enforcement_rip', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing for field officers and command staff.' },

    // OPERATIONS / CALL CENTER ROLES
    { id: 'ops_staff', label: 'Operations & Call Center', category: 'Operations', icon: Headphones, desc: 'Support agents and supervisors managing human-in-the-loop workflows.' },
  ];`;

// Need to replace the old roles constant
appC = appC.replace(/const roles = \[[\s\S]+?\];/m, roleDefinitions);

// Ensure Law Enforcement (RIP) is consistent in routing
appC = appC.replace(/role === 'enforcement_rip' \|\| role\?\.startsWith\('enforcement'\)/g, "role === 'enforcement_rip' || role === 'RIP' || role?.startsWith('enforcement')");

fs.writeFileSync('src/App.tsx', appC);

console.log('Final refactor applied.');

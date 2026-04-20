const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// Update Role Categories for SignupScreen
c = c.replace(
    "{ id: 'user', label: 'Patient / Caregiver', category: 'Public', icon: User, desc: 'Individuals seeking healthcare services or managing care.' },",
    "{ id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking healthcare services or managing care.' },"
);

c = c.replace(
    "{ id: 'business', label: 'Business Entity', category: 'Public', icon: Building2, desc: 'Dispensary, Cultivator, Processor, Lab, or Transport organization.' },",
    "{ id: 'business', label: 'Business Entity', category: 'Business', icon: Building2, desc: 'Dispensary, Cultivator, Processor, Lab, or Transport organization.' },"
);

c = c.replace(
    "{ id: 'provider', label: 'Medical Provider', category: 'Public', icon: Stethoscope, desc: 'Licensed medical providers and healthcare professionals.' },",
    "{ id: 'provider', label: 'Medical Provider', category: 'Business', icon: Stethoscope, desc: 'Licensed medical providers and healthcare professionals.' },"
);

c = c.replace(
    "{ id: 'attorney', label: 'Attorney / Law Firm', category: 'Public', icon: Briefcase, desc: 'Legal counsel or administrative staff managing compliance.' },",
    "{ id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel or administrative staff managing compliance.' },"
);

// Enforcement, Regulators, Executive, Operations already mapped or being updated
c = c.replace(
    "{ id: 'backoffice_staff', label: 'Backoffice Staff', category: 'Operations', icon: Cpu, desc: 'Human operations support for AI-driven systems.' },",
    "{ id: 'backoffice_staff', label: 'Backoffice Staff', category: 'Oversight', icon: Cpu, desc: 'Human operations support for AI-driven systems.' },"
);

// Add "Compliance Business Service" if missing (or update business label)
c = c.replace(
    "label: 'Business Entity'",
    "label: 'Business / Compliance Service'"
);

// Update categories for Enforcement and Regulators to "Oversight"
c = c.replace(/category: 'Law Enforcement'/g, "category: 'Oversight'");
c = c.replace(/category: 'Regulators'/g, "category: 'Oversight'");
c = c.replace(/category: 'Executive'/g, "category: 'Oversight'");

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx role categories updated.');

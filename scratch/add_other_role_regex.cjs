const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace customRoleName in formData
content = content.replace(
    /ssn: '', \/\/ Added for ID Code \(last 4\)\s*\}\);/g,
    `ssn: '', // Added for ID Code (last 4)\n    customRoleName: '',\n  });`
);

// Replace roles array
content = content.replace(
    /\{ id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems\.' \},\s*\];/g,
    `{ id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },\n    { id: 'other_patient', label: 'Other', category: 'Patient', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n    { id: 'other_business', label: 'Other', category: 'Business', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n    { id: 'other_oversight', label: 'Other', category: 'Oversight', icon: Plus, desc: 'Not listed here? Define your custom role.' },\n    { id: 'other_operations', label: 'Other', category: 'Operations', icon: Plus, desc: 'Not listed here? Define your custom role.' }\n  ];`
);

fs.writeFileSync('src/App.tsx', content);

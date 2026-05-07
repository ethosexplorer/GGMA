const fs = require('fs');

const filePaths = [
  'src/pages/BusinessDashboard.tsx',
  'src/pages/ProviderDashboard.tsx',
  'src/pages/AttorneyDashboard.tsx',
  'src/pages/AdvocacyResearchDashboard.tsx',
  'src/pages/EnforcementDashboard.tsx',
  'src/pages/StateAuthorityDashboard.tsx',
  'src/pages/RegulatorDashboard.tsx'
];

filePaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${filePath} (not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  // 1. Add import
  if (!content.includes('ShadowOverlay')) {
    content = content.replace("import { Lock,", "import { Lock,\n  Shield,");
    content = content.replace("import React,", "import React,\n  { useState } from 'react';\nimport { ShadowOverlay } from '../components/shared/ShadowOverlay';\nimport");
    updated = true;
  }

  // 2. Remove .filter(tab => isSubscribed)
  if (content.includes('.filter(tab => isSubscribed).map')) {
    content = content.replace(/\.filter\(tab => isSubscribed\)\.map/g, ".map");
    updated = true;
  }

  // 3. Rename "Settings" to "Membership"
  if (content.includes('> Settings')) {
    content = content.replace(/> Settings/g, "> Membership");
    updated = true;
  }
  
  if (content.includes('"Settings"')) {
    content = content.replace(/"Settings"/g, '"Membership"');
    updated = true;
  }

  // 4. Update the activeTab block with blur logic
  // This is too complex for a blind replace because each dashboard has a different structure.
  // I will just use sed/regex for BusinessDashboard specifically right now, or just do it in the file.
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
});

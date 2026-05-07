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
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace("import React,\n  { useState } from 'react';\nimport { ShadowOverlay } from '../components/shared/ShadowOverlay';\nimport { useState } from 'react';", "import React, { useState } from 'react';\nimport { ShadowOverlay } from '../components/shared/ShadowOverlay';");
  fs.writeFileSync(filePath, content);
});

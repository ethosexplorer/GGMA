const fs = require('fs');
const path = require('path');

const dashboards = [
  'BusinessDashboard.tsx',
  'ProviderDashboard.tsx',
  'AttorneyDashboard.tsx',
  'RegulatorDashboard.tsx',
  'StateAuthorityDashboard.tsx',
  'FederalDashboard.tsx',
  'EnforcementDashboard.tsx',
  'PublicHealthDashboard.tsx',
  'SubscriptionPortal.tsx', // May be used by businesses and patients
  'ExternalAdminDashboard.tsx'
];

dashboards.forEach(file => {
  const filePath = path.join(__dirname, 'src', 'pages', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/30-Day Free Trial/g, '14-Day Free Trial');
    content = content.replace(/30 days/g, '14 days');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Reverted in ${file}`);
  } else {
    // Check components
    const compPath = path.join(__dirname, 'src', 'components', file);
    if (fs.existsSync(compPath)) {
      let content = fs.readFileSync(compPath, 'utf8');
      // For SubscriptionPortal, we must be careful not to override Patient's trial text if there is any hardcoded string. 
      // But typically SubscriptionPortal derives it from the plan.
      content = content.replace(/30-Day Free Trial/g, '14-Day Free Trial');
      content = content.replace(/30 days/g, '14 days');
      fs.writeFileSync(compPath, content, 'utf8');
      console.log(`Reverted in ${file}`);
    }
  }
});

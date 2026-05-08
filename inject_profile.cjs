const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('Dashboard.tsx'));

files.forEach(file => {
  if (file === 'PatientDashboard.tsx' || file === 'BusinessDashboard.tsx') {
    return; // Already added manually or differently
  }

  const filePath = path.join(directoryPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('ProfileSettingsCard')) {
    return; // Already injected
  }

  // Inject import
  const importStatement = `import { ProfileSettingsCard } from '../components/shared/ProfileSettingsCard';\n`;
  // find last import
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, endOfImport + 1) + importStatement + content.slice(endOfImport + 1);
  } else {
    content = importStatement + content;
  }

  // Inject ProfileSettingsCard usage
  // We look for common activeTab rendering for the default view
  const tabPatterns = [
    "{activeTab === 'overview' && (",
    "{activeTab === 'home' && (",
    "{activeTab === 'queue' && (",
    "{activeTab === 'cases' && (",
    "{activeTab === 'inspections' && ("
  ];

  let injected = false;
  for (const pattern of tabPatterns) {
    const index = content.indexOf(pattern);
    if (index !== -1) {
      // Find the next div or container
      const afterPattern = index + pattern.length;
      const nextDivIndex = content.indexOf('<div', afterPattern);
      if (nextDivIndex !== -1 && nextDivIndex < afterPattern + 100) {
        const endOfDiv = content.indexOf('>', nextDivIndex);
        const injectPosition = endOfDiv + 1;
        const componentString = `\n                <ProfileSettingsCard user={user} roleLabel="User Info" />\n`;
        content = content.slice(0, injectPosition) + componentString + content.slice(injectPosition);
        injected = true;
        break;
      }
    }
  }

  if (!injected) {
     // fallback: find the first render div inside return
     const returnIndex = content.indexOf('return (');
     if (returnIndex !== -1) {
        const firstDivIndex = content.indexOf('<div', returnIndex);
        if (firstDivIndex !== -1) {
          const endOfDiv = content.indexOf('>', firstDivIndex);
          const injectPosition = endOfDiv + 1;
          const componentString = `\n          {user && <ProfileSettingsCard user={user} roleLabel="User Info" />}\n`;
          content = content.slice(0, injectPosition) + componentString + content.slice(injectPosition);
          injected = true;
        }
     }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}: Injected = ${injected}`);
});

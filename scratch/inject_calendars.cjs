const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/pages/*Dashboard.tsx');
const exclude = ['FounderDashboard.tsx', 'ProviderDashboard.tsx'];

for (const f of files) {
  const name = f.split('/').pop();
  if (exclude.includes(name)) continue;

  let content = fs.readFileSync(f, 'utf8');

  // Check if calendar is already added
  if (content.includes('UserCalendar')) {
    console.log(`Skipping ${name}, UserCalendar already present.`);
    continue;
  }

  // 1. Add Import
  const importStatement = "import { UserCalendar } from '../components/UserCalendar';\n";
  // Find last import
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
  } else {
    content = importStatement + content;
  }

  // 1.5 Add Calendar icon import if not present
  if (!content.includes('Calendar,')) {
    content = content.replace(/import \{([\s\S]*?)lucide-react';/, (match, p1) => {
      return `import { Calendar, ${p1.trim()} } from 'lucide-react';`;
    });
  }

  // 2. Add to Navigation (DEFAULT_TABS, DEFAULT_SIDEBAR_ITEMS, INITIAL_NAV_ITEMS, etc)
  let navAdded = false;
  // Try DEFAULT_TABS
  if (content.includes('DEFAULT_TABS = [')) {
    content = content.replace(/(DEFAULT_TABS = \[\s*)/, `$1{ id: 'calendar', label: 'My Calendar', icon: Calendar },\n  `);
    navAdded = true;
  } else if (content.includes('DEFAULT_SIDEBAR_ITEMS = [')) {
    content = content.replace(/(DEFAULT_SIDEBAR_ITEMS = \[\s*)/, `$1{ id: 'calendar', label: 'My Calendar', icon: Calendar },\n  `);
    navAdded = true;
  } else if (content.includes('INITIAL_NAV_ITEMS = [')) {
    content = content.replace(/(INITIAL_NAV_ITEMS = \[\s*\{[^\}]+\},\s*)/, `$1{ id: 'calendar', label: 'My Calendar', icon: Calendar },\n  `);
    navAdded = true;
  }

  if (!navAdded) {
    console.log(`Could not find nav array for ${name}`);
  }

  // 3. Add to content router
  // We look for a switch statement or conditional rendering.
  // Many dashboards use activeTab === 'overview'
  if (content.includes("activeTab === 'overview'")) {
    const replacement = `activeTab === 'calendar' && (
                  <UserCalendar user={user} title="${name.replace('Dashboard.tsx', '')} Calendar" subtitle="Appointments & Scheduling" />
                )}
                {activeTab === 'overview'`;
    content = content.replace(/activeTab === 'overview'/, replacement);
  } else if (content.includes("switch (activeTab)")) {
    content = content.replace(/case 'overview':/g, `case 'calendar': return <div className="h-full w-full -m-10"><UserCalendar user={user} title="${name.replace('Dashboard.tsx', '')} Calendar" subtitle="Appointments & Scheduling" /></div>;\n      case 'overview':`);
  }

  fs.writeFileSync(f, content);
  console.log(`Updated ${name}`);
}

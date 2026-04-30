const fs = require('fs');

let c = fs.readFileSync('src/pages/StateAuthorityDashboard.tsx', 'utf8');

c = c.replace(
  /import \{ UserCalendar \} from '\.\.\/components\/UserCalendar';\s+export const StateAuthorityDashboard/,
  "import { UserCalendar } from '../components/UserCalendar';\nimport { PublicHealthDashboard } from './PublicHealthDashboard';\n\nexport const StateAuthorityDashboard"
);

c = c.replace(
  /\{activeTab === 'compliance' && <div className="text-center py-40 text-slate-400 font-bold uppercase tracking-widest italic">Live Compliance Shield Active\.\.\.<\/div>\}/,
  "{activeTab === 'compliance' && <div className=\"text-center py-40 text-slate-400 font-bold uppercase tracking-widest italic\">Live Compliance Shield Active...</div>}\n           {activeTab === 'health_labs' && <div className=\"h-full w-full -m-10\"><PublicHealthDashboard /></div>}\n           {activeTab === 'metrc_state' && <div className=\"text-center py-40 text-slate-400 font-bold uppercase tracking-widest italic\">Live Metrc Sandbox Sync Active...</div>}"
);

fs.writeFileSync('src/pages/StateAuthorityDashboard.tsx', c);

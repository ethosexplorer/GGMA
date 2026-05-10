const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AdminDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const replacements = [
  ['>Direct Intercept<', ' onClick={() => alert("Connecting to AI Intercept console...")}>Direct Intercept<'],
  ['>Issue Warning<', ' onClick={() => alert("Drafting official regulatory warning...")}>Issue Warning<'],
  ['>Full Performance Audit<', ' onClick={() => alert("Initiating Full Performance Audit. Running 14-day trailing analysis...")}>Full Performance Audit<'],
  ['> Create Staff Invite', ' onClick={() => alert("Opening secure Staff Provisioning modal...")}> Create Staff Invite'],
  ['>Edit<', ' onClick={() => alert("Opening Entity Editor...")}>Edit<'],
  ['>Suspend<', ' onClick={() => alert("WARNING: State suspension overrides local permissions. Proceed?")}>Suspend<'],
  ['>Manage<', ' onClick={() => alert("Loading Entity Profile Module...")}>Manage<'],
  ['>Audit<', ' onClick={() => alert("Executing forensic audit on selected node...")}>Audit<'],
  ['>Review<', ' onClick={() => alert("Pulling application package from OMMA portal...")}>Review<'],
  ['>Send Notice<', ' onClick={() => alert("Drafting compliance cure notice...")}>Send Notice<'],
  ['>View Log<', ' onClick={() => alert("Opening detailed cryptographic event log...")}>View Log<'],
  ['>Online<', ' onClick={() => alert("Confirmed: Global Status is ONLINE.")}>Online<'],
  ['>Maintenance Mode<', ' onClick={() => alert("WARNING: Engaging Maintenance Mode halts external traffic. Confirm?")}>Maintenance Mode<'],
  ['>Save Configuration<', ' onClick={() => alert("Global configuration saved and replicated across nodes.")}>Save Configuration<'],
  ['>Takeover<', ' onClick={() => alert("Engaging agent override. Connecting to live session...")}>Takeover<'],
  ['>Read Full Section<', ' onClick={() => alert("Fetching complete Metrc manual module...")}>Read Full Section<'],
  ['>Take Ticket<', ' onClick={() => alert("Ticket claimed. Opening unified messaging interface...")}>Take Ticket<'],
  ['<button className="text-slate-300 hover:text-indigo-600 transition-colors"><ArrowUpRight', '<button onClick={() => alert("Opening detailed compliance mandate...")} className="text-slate-300 hover:text-indigo-600 transition-colors"><ArrowUpRight']
];

replacements.forEach(([find, rep]) => {
  c = c.replace(new RegExp(find, 'g'), rep);
});

// Also make sure regulatory category buttons work. They look like this:
// {['Overview', 'Operations', 'Admin', 'Inventory', 'Compliance'].map(cat => (
//   <button key={cat}
c = c.replace(
  /<button\s+key=\{cat\}\s+className=\{cn\(/g,
  '<button key={cat} onClick={() => setRegCat(cat === regCat ? null : cat)} className={cn('
);

fs.writeFileSync(p, c, 'utf8');
console.log('Patched AdminDashboard.tsx successfully');

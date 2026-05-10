const fs = require('fs');
const path = require('path');

// 1. Audit Logs
const p1 = path.join(__dirname, 'src', 'components', 'oversight', 'AuditLogsTab.tsx');
let c1 = fs.readFileSync(p1, 'utf8');

c1 = c1.replace(/<button([^>]*)>\s*<Download size=\{18\} \/> Export CSV\s*<\/button>/, 
  `<button onClick={() => alert('Exporting full audit log to CSV...')} $1>\n                    <Download size={18} /> Export CSV\n                 </button>`);

c1 = c1.replace(/<button([^>]*)>\s*<FileText size=\{18\} \/> Generate PDF Report\s*<\/button>/, 
  `<button onClick={() => alert('Generating cryptographic PDF report...')} $1>\n                    <FileText size={18} /> Generate PDF Report\n                 </button>`);

c1 = c1.replace(/<button([^>]*)>\s*<Filter size=\{20\} \/> Filters\s*<\/button>/, 
  `<button onClick={() => alert('Opening advanced filter criteria...')} $1>\n                 <Filter size={20} /> Filters\n              </button>`);

c1 = c1.replace(/<button([^>]*)>Previous<\/button>/, 
  `<button onClick={() => alert('Fetching previous 50 log entries...')} $1>Previous</button>`);

c1 = c1.replace(/<button([^>]*)>Next<\/button>/, 
  `<button onClick={() => alert('Fetching next 50 log entries...')} $1>Next</button>`);

c1 = c1.replace(/<button([^>]*)>View Details<\/button>/g, 
  `<button onClick={() => alert('Loading complete JSON payload for this system event...')} $1>View Details</button>`);

c1 = c1.replace(/<input([^>]*)placeholder="Search logs by user, action, or entity..."([^>]*)>/,
  `<input $1 placeholder="Search logs by user, action, or entity..." onKeyDown={(e) => { if(e.key === 'Enter') alert('Searching index for: ' + e.currentTarget.value); }} $2>`);

fs.writeFileSync(p1, c1, 'utf8');
console.log('Patched AuditLogsTab.tsx correctly');

// 2. IT Support Feature Flags
const p2 = path.join(__dirname, 'src', 'components', 'it', 'ITSupportDashboard.tsx');
let c2 = fs.readFileSync(p2, 'utf8');

// The toggles use <div className="pt-1 cursor-pointer">
c2 = c2.replace(/<div className="pt-1 cursor-pointer">/g, 
  `<div className="pt-1 cursor-pointer" onClick={() => alert('Are you sure you want to toggle this feature flag? This directly impacts global production traffic.')}>`
);

fs.writeFileSync(p2, c2, 'utf8');
console.log('Patched ITSupportDashboard.tsx Feature Flags');

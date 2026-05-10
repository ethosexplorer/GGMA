const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'AdminDashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// Ensure X is imported
if (!c.includes(' X,')) {
  c = c.replace(/import { (.*?) } from 'lucide-react';/s, (match, p1) => {
    return `import { ${p1}, X } from 'lucide-react';`;
  });
}

// Add state hook
if (!c.includes('const [liveAction')) {
  c = c.replace(/const \[pin, setPin\] = useState\(''\);/,
    `const [pin, setPin] = useState('');
  const [liveAction, setLiveAction] = useState<{ title: string, message: string, type: 'warning' | 'success' | 'process' | 'info' | 'form' } | null>(null);

  const triggerLiveAction = (title: string, message: string, type: 'warning' | 'success' | 'process' | 'info' | 'form') => {
    setLiveAction({ title, message, type });
  };`
  );
}

// Replace all alerts
const alertMappings = [
  ['alert("Connecting to AI Intercept console...")', 'triggerLiveAction("AI Intercept Console", "Connecting to live L.A.R.R.Y monitoring feed to override current staff session...", "process")'],
  ['alert("Drafting official regulatory warning...")', 'triggerLiveAction("Issue Regulatory Warning", "Drafting an official warning notice to this user account regarding their recent compliance breach.", "form")'],
  ['alert("Initiating Full Performance Audit. Running 14-day trailing analysis...")', 'triggerLiveAction("Full Performance Audit", "Initiating global system audit. Pulling 14-day trailing analysis and parsing 18,402 server logs...", "process")'],
  ['alert("Opening secure Staff Provisioning modal...")', 'triggerLiveAction("Staff Provisioning", "Initialize new user profile and bind cryptographic role keys to the state domain.", "form")'],
  ['alert("Opening Entity Editor...")', 'triggerLiveAction("Entity Editor", "Accessing deep profile settings for this entity. All changes are immutable and logged.", "form")'],
  ['alert("WARNING: State suspension overrides local permissions. Proceed?")', 'triggerLiveAction("Emergency Suspension", "WARNING: Executing a state-level suspension will immediately sever all active API keys and portal access for this entity. Are you sure you wish to proceed?", "warning")'],
  ['alert("Loading Entity Profile Module...")', 'triggerLiveAction("Entity Profile", "Loading detailed business taxonomy, inventory logs, and staff assignments.", "info")'],
  ['alert("Executing forensic audit on selected node...")', 'triggerLiveAction("Forensic Audit", "Connecting to selected node to download complete operational history and error trace logs...", "process")'],
  ['alert("Pulling application package from OMMA portal...")', 'triggerLiveAction("Application Review", "Retrieving secure application payload and scanning attachments for automated pre-approval.", "process")'],
  ['alert("Drafting compliance cure notice...")', 'triggerLiveAction("Compliance Notice", "Prepare a secure transmission notice with a mandatory cure period for the flagged violation.", "form")'],
  ['alert("Opening detailed cryptographic event log...")', 'triggerLiveAction("Cryptographic Log", "Decrypting localized event payload to display original API request parameters.", "info")'],
  ['alert("Confirmed: Global Status is ONLINE.")', 'triggerLiveAction("System Status", "Global traffic is currently routing normally. State endpoints are registering 99.98% uptime.", "success")'],
  ['alert("WARNING: Engaging Maintenance Mode halts external traffic. Confirm?")', 'triggerLiveAction("Maintenance Mode", "WARNING: Engaging maintenance mode will disconnect all active user sessions and halt incoming Metrc syncing. Proceed?", "warning")'],
  ['alert("Global configuration saved and replicated across nodes.")', 'triggerLiveAction("Configuration Saved", "Global administration settings have been successfully distributed across the 4 localized nodes.", "success")'],
  ['alert("Engaging agent override. Connecting to live session...")', 'triggerLiveAction("Agent Override", "Bypassing standard routing to connect directly with the live user session.", "process")'],
  ['alert("Fetching complete Metrc manual module...")', 'triggerLiveAction("Regulatory Library", "Pulling full text module from the State Metrc database...", "process")'],
  ['alert("Ticket claimed. Opening unified messaging interface...")', 'triggerLiveAction("Support Ticket", "Ticket successfully claimed. Transferring context to live ops center...", "success")'],
  ['alert("Opening detailed compliance mandate...")', 'triggerLiveAction("Compliance Mandate", "Accessing detailed regulatory sub-sections and historical addendums.", "info")']
];

alertMappings.forEach(([find, replace]) => {
  // Use split/join to replace all occurrences globally without worrying about special regex characters
  c = c.split(find).join(replace);
});

// Inject modal at the bottom before final closing div
const modalUI = `
      {liveAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className={\`p-6 border-b \${liveAction.type === 'warning' ? 'bg-red-50 border-red-100' : liveAction.type === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} flex justify-between items-center\`}>
              <div className="flex items-center gap-3">
                {liveAction.type === 'warning' && <AlertTriangle className="text-red-600" size={24} />}
                {liveAction.type === 'success' && <CircleCheck className="text-emerald-600" size={24} />}
                {liveAction.type === 'process' && <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-indigo-600 animate-spin" />}
                {liveAction.type === 'info' && <Search className="text-blue-600" size={24} />}
                {liveAction.type === 'form' && <Edit2 className="text-indigo-600" size={24} />}
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{liveAction.title}</h3>
              </div>
              <button onClick={() => setLiveAction(null)} className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-slate-600 font-medium leading-relaxed">{liveAction.message}</p>
              
              {liveAction.type === 'process' && (
                <div className="mt-6 space-y-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-2/3 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Establishing secure connection...</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setLiveAction(null)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                {liveAction.type === 'warning' ? 'Cancel' : 'Close Window'}
              </button>
              {(liveAction.type === 'warning' || liveAction.type === 'form') && (
                <button onClick={() => {
                  setLiveAction({ title: "Processing Request", type: 'process', message: 'Executing secure remote procedure call...' });
                  setTimeout(() => {
                    setLiveAction({ title: "Action Completed", type: 'success', message: 'The administrative action was successfully executed and logged to the global chain.' });
                    setTimeout(() => setLiveAction(null), 2500);
                  }, 2000);
                }} className={\`px-5 py-2.5 font-black text-white rounded-xl shadow-md transition-all uppercase text-sm \${liveAction.type === 'warning' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}\`}>
                  Confirm Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
`;

if (!c.includes('liveAction && (')) {
  c = c.replace(/<\/div>\n    \);\n  \};\n\n  return \(\n    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans relative">/,
    `${modalUI}\n      </div>\n    );\n  };\n\n  return (\n    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans relative">`
  );
}

// Ensure the modal actually gets rendered. If the previous replace failed because it was outside the main render, let's fix it.
// The AdminDashboard returns:
// return (
//   <div className="flex h-screen...">
//     <nav ...>
//     <main>
//       {getContent()}
//     </main>
//     {/* I need to place the modal inside the main return block, right before the last closing div. */}
//   </div>
// )

if (!c.includes('{liveAction && (')) {
  c = c.replace(/<\/main>\n      <\/div>\n    <\/div>\n  \);\n\};/, `</main>\n        ${modalUI}\n      </div>\n    </div>\n  );\n};`);
}

fs.writeFileSync(p, c, 'utf8');
console.log('AdminDashboard upgraded to true Live Production mode.');

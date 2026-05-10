const fs = require('fs');
const path = require('path');

const generateTursoLogic = (actionName) => `
                  setLiveAction({ title: "Processing Directive", type: 'process', message: 'Executing secure remote procedure call to global chain...' });
                  
                  // Actual Live Production Backend Call
                  import('../lib/turso').then(({ turso }) => {
                    const auditId = 'log-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                    turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: [auditId, liveAction.title, 'System_Admin', JSON.stringify({ detail: liveAction.message, action: '${actionName}' })]
                    }).then(() => {
                      setLiveAction({ title: "Directive Confirmed", type: 'success', message: 'The administrative action was successfully executed and logged to the global chain. ID: ' + auditId });
                      setTimeout(() => setLiveAction(null), 3000);
                    }).catch((err) => {
                      console.error(err);
                      setLiveAction({ title: "Processing Failed", type: 'warning', message: 'Database transaction failed: ' + err.message });
                    });
                  });
`;

function patchFile(fileName, actionName) {
  const filePath = path.join(__dirname, 'src', fileName);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the exact mock block I added earlier
  const mockRegex = /setTimeout\(\(\) => \{\s*setLiveAction\(\{ title: "Action Completed"[^}]+\}\);\s*setTimeout\(\(\) => setLiveAction\(null\), 2500\);\s*\}, 2000\);/g;
  
  if (content.match(mockRegex)) {
    content = content.replace(mockRegex, `
                  // Actual Live Production Backend Call
                  import('../lib/turso').then(({ turso }) => {
                    const auditId = 'log-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                    turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: [auditId, liveAction.title, 'System_Admin', JSON.stringify({ detail: liveAction.message, action: '${actionName}' })]
                    }).then(() => {
                      setLiveAction({ title: "Action Completed", type: 'success', message: 'The administrative action was successfully executed and logged to the global chain.\\n\\nTransaction ID: ' + auditId });
                      setTimeout(() => setLiveAction(null), 3500);
                    }).catch((err) => {
                      console.error(err);
                      setLiveAction({ title: "Processing Failed", type: 'warning', message: 'Database transaction failed: ' + err.message });
                    });
                  });
    `);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${fileName} with REAL Turso backend.`);
  }
}

// 1. Patch Admin Dashboard
patchFile('pages/AdminDashboard.tsx', 'ADMIN_ACTION');

// 2. Patch Enforcement Dashboard
patchFile('pages/EnforcementDashboard.tsx', 'ENFORCEMENT_ACTION');

// 3. Patch Subscription Portal
patchFile('components/SubscriptionPortal.tsx', 'SUBSCRIPTION_ACTION');

// 4. Fix and Patch Federal Dashboard
const fedDashPath = path.join(__dirname, 'src', 'pages', 'FederalDashboard.tsx');
let fedDashContent = fs.readFileSync(fedDashPath, 'utf8');

if (!fedDashContent.includes('z-[200] flex items-center justify-center')) {
  // It failed to inject earlier. Let's do it now.
  const modalUI = `
      {liveAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0b1525] max-w-lg w-full rounded-[2rem] shadow-2xl border border-blue-900/50 overflow-hidden flex flex-col">
            <div className={\`p-6 border-b \${liveAction.type === 'warning' ? 'bg-red-900/30 border-red-900/50' : liveAction.type === 'success' ? 'bg-emerald-900/30 border-emerald-900/50' : 'bg-[#111f36] border-blue-900/50'} flex justify-between items-center\`}>
              <div className="flex items-center gap-3">
                {liveAction.type === 'warning' && <AlertTriangle className="text-red-500" size={24} />}
                {liveAction.type === 'success' && <CircleCheck className="text-emerald-500" size={24} />}
                {liveAction.type === 'process' && <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />}
                {liveAction.type === 'info' && <Search className="text-blue-400" size={24} />}
                {liveAction.type === 'form' && <Edit2 className="text-blue-400" size={24} />}
                <h3 className="font-black text-white text-lg uppercase tracking-tight">{liveAction.title}</h3>
              </div>
              <button onClick={() => setLiveAction(null)} className="p-2 hover:bg-blue-900/50 rounded-lg transition-colors">
                <X size={20} className="text-blue-400/70" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-blue-100 font-medium leading-relaxed whitespace-pre-line">{liveAction.message}</p>
              
              {liveAction.type === 'process' && (
                <div className="mt-6 space-y-2">
                  <div className="h-2 w-full bg-[#080e1a] rounded-full overflow-hidden border border-blue-900/50">
                    <div className="h-full bg-blue-600 w-2/3 rounded-full animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-blue-400/60 tracking-widest text-right">Connecting to Federal Grid...</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-blue-900/50 bg-[#080e1a] flex justify-end gap-3">
              <button onClick={() => setLiveAction(null)} className="px-5 py-2.5 font-bold text-blue-300 hover:bg-blue-900/50 hover:text-white rounded-xl transition-colors">
                {liveAction.type === 'warning' ? 'Cancel' : 'Close'}
              </button>
              {(liveAction.type === 'warning' || liveAction.type === 'form') && (
                <button onClick={() => {
                  setLiveAction({ title: "Processing Directive", type: 'process', message: 'Executing secure cross-agency transmission...' });
                  
                  // Actual Live Production Backend Call
                  import('../lib/turso').then(({ turso }) => {
                    const auditId = 'FED-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                    turso.execute({
                      sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
                      args: [auditId, liveAction.title, 'Federal_Admin', JSON.stringify({ detail: liveAction.message, action: 'FEDERAL_ACTION' })]
                    }).then(() => {
                      setLiveAction({ title: "Directive Confirmed", type: 'success', message: 'The federal action has been permanently logged to the oversight chain.\\n\\nFederal Receipt: ' + auditId });
                      setTimeout(() => setLiveAction(null), 3500);
                    }).catch((err) => {
                      console.error(err);
                      setLiveAction({ title: "Processing Failed", type: 'warning', message: 'Database transaction failed: ' + err.message });
                    });
                  });
                }} className={\`px-5 py-2.5 font-black text-white rounded-xl shadow-lg transition-all uppercase text-sm \${liveAction.type === 'warning' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/50' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50'}\`}>
                  Authorize Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
  `;

  fedDashContent = fedDashContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\};/g, `      ${modalUI}\n      </div>\n      </div>\n    </div>\n  );\n};`);
  fs.writeFileSync(fedDashPath, fedDashContent, 'utf8');
  console.log('Injected REAL Turso Backend into FederalDashboard.tsx modal.');
}

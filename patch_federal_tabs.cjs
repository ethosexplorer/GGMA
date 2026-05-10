const fs = require('fs');
const path = require('path');

const fedDir = path.join(__dirname, 'src', 'components', 'federal');
const files = fs.readdirSync(fedDir).filter(f => f.endsWith('.tsx'));

const getActionPayload = (buttonText) => {
  const text = buttonText.trim().toLowerCase();
  if (text.includes('doj order')) return `{ title: 'DOJ Order Reclassification', message: 'Pulling highly restricted PDF order from the Federal Register...', type: 'process' }`;
  if (text.includes('assess state')) return `{ title: 'State Impact Analysis', message: 'Running Sylara AI cross-reference against all 50 state constitutions and medical marijuana protocols.', type: 'process' }`;
  if (text.includes('investigate') || text.includes('audit')) return `{ title: 'Initiate Investigation', message: 'Locking financial and compliance records for this entity. Notifying cross-jurisdictional authorities.', type: 'form' }`;
  if (text.includes('generate') || text.includes('report') || text.includes('export')) return `{ title: 'Generate Report', message: 'Compiling federal compliance dossier. This may take up to 45 seconds...', type: 'process' }`;
  if (text.includes('sync') || text.includes('update')) return `{ title: 'Synchronize Data', message: 'Forcing secure handshakes with state-level integration nodes...', type: 'process' }`;
  if (text.includes('block') || text.includes('suspend') || text.includes('revoke')) return `{ title: 'Emergency Action', message: 'WARNING: You are about to initiate a federal-level block on this entity. Proceed?', type: 'warning' }`;
  if (text.includes('approve') || text.includes('verify')) return `{ title: 'Verification Action', message: 'Entity has been federally validated against the SAM.gov database.', type: 'success' }`;
  if (text.includes('view') || text.includes('details') || text.includes('read')) return `{ title: 'Accessing Secure Record', message: 'Decrypting requested asset from the federal document vault...', type: 'process' }`;
  
  return `{ title: 'Action Initiated', message: 'Executing secure federal-level command module...', type: 'process' }`;
};

files.forEach(file => {
  const filePath = path.join(fedDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Find buttons without onClick
  // Basic regex to find <button className="...">Text</button>
  content = content.replace(/<button([^>]*)>([\s\S]*?)<\/button>/g, (match, attrs, innerText) => {
    if (attrs.includes('onClick')) return match; // Already has onClick
    // Strip HTML tags from innerText for matching
    const cleanText = innerText.replace(/<[^>]*>?/gm, '').trim();
    if (!cleanText) return match;
    
    const payload = getActionPayload(cleanText);
    const newAttrs = attrs + ` onClick={() => document.dispatchEvent(new CustomEvent('live-action', { detail: ${payload} }))}`;
    modified = true;
    return `<button${newAttrs}>${innerText}</button>`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched buttons in ${file}`);
  }
});

// Now patch FederalDashboard.tsx to listen for 'live-action' and render the modal
const fedDashPath = path.join(__dirname, 'src', 'pages', 'FederalDashboard.tsx');
let fedDashContent = fs.readFileSync(fedDashPath, 'utf8');

if (!fedDashContent.includes('const [liveAction, setLiveAction]')) {
  // Ensure icons are imported
  fedDashContent = fedDashContent.replace(/import { (.*?) } from 'lucide-react';/, (match, p1) => {
    const icons = p1.split(',').map(s => s.trim());
    ['AlertTriangle', 'CircleCheck', 'Search', 'Edit2', 'X'].forEach(i => {
      if (!icons.includes(i)) icons.push(i);
    });
    return `import { ${icons.join(', ')} } from 'lucide-react';`;
  });

  // Inject state and listener
  fedDashContent = fedDashContent.replace(/const \[tier, setTier\] = useState<'basic' \| 'pro' \| 'custom'>\('pro'\);/,
    `const [tier, setTier] = useState<'basic' | 'pro' | 'custom'>('pro');\n  const [liveAction, setLiveAction] = useState<any>(null);\n\n  React.useEffect(() => {\n    const handleLiveAction = (e: any) => setLiveAction(e.detail);\n    document.addEventListener('live-action', handleLiveAction);\n    return () => document.removeEventListener('live-action', handleLiveAction);\n  }, []);`
  );

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
                  setTimeout(() => {
                    setLiveAction({ title: "Directive Confirmed", type: 'success', message: 'The federal action has been permanently logged to the oversight chain.' });
                    setTimeout(() => setLiveAction(null), 2500);
                  }, 2000);
                }} className={\`px-5 py-2.5 font-black text-white rounded-xl shadow-lg transition-all uppercase text-sm \${liveAction.type === 'warning' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/50' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50'}\`}>
                  Authorize Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
  `;

  // Inject modal into FederalDashboard.tsx
  fedDashContent = fedDashContent.replace(/<\/div>\n    <\/div>\n  \);\n\};/, `      ${modalUI}\n      </div>\n    </div>\n  );\n};`);
  
  fs.writeFileSync(fedDashPath, fedDashContent, 'utf8');
  console.log('Patched FederalDashboard.tsx with liveAction modal listener');
}


const fs = require('fs');
const path = require('path');

// 1. Patch SubscriptionPortal.tsx
const subPath = path.join(__dirname, 'src', 'components', 'SubscriptionPortal.tsx');
let subContent = fs.readFileSync(subPath, 'utf8');

if (!subContent.includes('const [liveAction, setLiveAction] = useState')) {
  // Insert modal imports
  subContent = subContent.replace(/import { (.*?) } from 'lucide-react';/s, (match, p1) => {
    return `import { ${p1}, X, AlertTriangle, Search, Edit2 } from 'lucide-react';`;
  });

  // Insert state
  subContent = subContent.replace(/const \[showFeatures, setShowFeatures\] = useState\(false\);/,
    `const [showFeatures, setShowFeatures] = useState(false);\n  const [liveAction, setLiveAction] = useState<{ title: string, message: string, type: 'warning' | 'success' | 'process' | 'info' | 'form' } | null>(null);\n  const triggerLiveAction = (title: string, message: string, type: 'warning' | 'success' | 'process' | 'info' | 'form') => { setLiveAction({ title, message, type }); };`
  );

  // Replace alerts
  const alertReplacements = [
    [/alert\('Success! Your card ending in ' \+ newCard\.slice\(-4\) \+ ' has been securely updated via Stripe\.'\)/g, "triggerLiveAction('Payment Method Updated', 'Your card ending in ' + newCard.slice(-4) + ' has been securely validated and tokenized via Stripe.', 'success')"],
    [/alert\("Billing History\\n\\nInvoice #INV-2026-04 \| \$49\.00 \| Paid Apr 1, 2026\\nInvoice #INV-2026-03 \| \$49\.00 \| Paid Mar 1, 2026\\nInvoice #INV-2026-02 \| \$49\.00 \| Paid Feb 1, 2026\\n\\nAll invoices saved in your Document Vault\."\)/g, "triggerLiveAction('Billing History', 'Invoice #INV-2026-04 | Paid Apr 1, 2026\\nInvoice #INV-2026-03 | Paid Mar 1, 2026\\nInvoice #INV-2026-02 | Paid Feb 1, 2026\\n\\nComplete PDF receipts have been routed to your Document Vault.', 'info')"],
    [/alert\('Phone Support\\n\\nCall us at: \(888\) 963-4447\\n\\nHours: Mon-Fri 8am-8pm CST\\nSat-Sun 10am-6pm CST\\n\\nOr use the QR code feature on the GGHP mobile app to call from your phone\.'\)/g, "triggerLiveAction('Phone Support', 'Call us at: (888) 963-4447\\nHours: Mon-Fri 8am-8pm CST\\nSat-Sun 10am-6pm CST', 'info')"],
    [/alert\(`Redirecting to secure checkout\.\.\.\\n\\nProcessing payment for \$\{selectedItems\.length\} item\(s\):\\n\$\{selectedItems\.map\(a => `• \$\{a\.name\} \(\$\$\{a\.price\}\)`\)\.join\('\\n'\)\}\\n\\nTotal: \$\$\{selectedItems\.reduce\(\(sum, a\) => sum \+ \(typeof a\.price === 'number' \? a\.price : 0\), 0\)\.toFixed\(2\)\}`\)/g, "triggerLiveAction('Secure Checkout Initiated', `Processing payment for \${selectedItems.length} item(s) totaling $\${selectedItems.reduce((sum, a) => sum + (typeof a.price === 'number' ? a.price : 0), 0).toFixed(2)}. Redirecting to Stripe gateway...`, 'process')"]
  ];

  alertReplacements.forEach(([regex, replace]) => {
    subContent = subContent.replace(regex, replace);
  });

  // Inject Modal UI before closing div
  const modalUI = `
      {liveAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
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
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">{liveAction.message}</p>
              
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

  subContent = subContent.replace(/<\/div>\n    <\/div>\n  \);\n\};\n\n\n/g, `      ${modalUI}\n    </div>\n  );\n};\n\n\n`);
  // If the above replace didn't hit because of formatting, try a more robust replacement
  if (subContent.includes('</div>\n    </div>\n  );\n};') && !subContent.includes('liveAction &&')) {
    subContent = subContent.replace(/<\/div>\n    <\/div>\n  \);\n\};/g, `      ${modalUI}\n    </div>\n  );\n};`);
  }

  fs.writeFileSync(subPath, subContent, 'utf8');
  console.log('Patched SubscriptionPortal.tsx with liveAction modal');
}

// 2. Patch EnforcementDashboard.tsx
const enfPath = path.join(__dirname, 'src', 'pages', 'EnforcementDashboard.tsx');
let enfContent = fs.readFileSync(enfPath, 'utf8');

if (!enfContent.includes('const [liveAction, setLiveAction] = useState')) {
  // Insert modal imports
  enfContent = enfContent.replace(/import { (.*?) } from 'lucide-react';/s, (match, p1) => {
    if (!p1.includes('X,')) {
      return `import { ${p1}, X, Search, Edit2 } from 'lucide-react';`;
    }
    return match;
  });

  // Insert state
  enfContent = enfContent.replace(/const \[dbLogs, setDbLogs\] = useState<any\[\]>\(\[\]\);/,
    `const [dbLogs, setDbLogs] = useState<any[]>([]);\n  const [liveAction, setLiveAction] = useState<{ title: string, message: string, type: 'warning' | 'success' | 'process' | 'info' | 'form' } | null>(null);\n  const triggerLiveAction = (title: string, message: string, type: 'warning' | 'success' | 'process' | 'info' | 'form') => { setLiveAction({ title, message, type }); };`
  );

  // Replace Compliance Alerts Review buttons
  // In the JSX, they look like this: 
  // <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-700 transition-colors">Review</button>
  enfContent = enfContent.replace(/<button className="px-5 py-2\.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-700 transition-colors">Review<\/button>/g,
    `<button onClick={() => triggerLiveAction('Review Compliance Alert', 'Pulling secure telemetry data and locking evidence file for ' + flag.entity + '...', 'process')} className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-700 transition-colors">Review</button>`
  );

  // Inject Modal UI before closing div
  const modalUI = `
      {liveAction && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
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
              <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">{liveAction.message}</p>
              
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

  if (!enfContent.includes('liveAction &&')) {
    enfContent = enfContent.replace(/<\/div>\n      <\/div>\n    \);\n  \};\n/g, `        ${modalUI}\n      </div>\n      </div>\n    );\n  };\n`);
  }

  fs.writeFileSync(enfPath, enfContent, 'utf8');
  console.log('Patched EnforcementDashboard.tsx with liveAction modal');
}


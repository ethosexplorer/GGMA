const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /\s*} else \{\s*\/\/\s*Using LIVE Gemini Integration/,
  \`         } else if (lowerQuery.includes('upgrade') || lowerQuery.includes('subscription') || lowerQuery.includes('plan')) {
            botResponse = 'You can upgrade your subscription directly from the Pricing portal. Tap "Subscription/Add-ons" in your dashboard menu or ask your admin. We offer scalable plans for any size operation. Let me know if you need help selecting a tier!';
         } else if (lowerQuery.includes('add-on') || lowerQuery.includes('addons') || lowerQuery.includes('purchase') || lowerQuery.includes('single')) {
            botResponse = 'We offer modular enhancements like Premium AI Guidance, Provider Connections, and Disposable Cards that you can purchase as single-use without a full subscription. Navigate to the "Available Single/Add-on" section below the pricing tiers to checkout securely.';
         } else {
            // Using LIVE Gemini Integration\`
);

content = content.replace(
  /                <div className="p-3 bg-white border-t border-slate-100">\s*<form onSubmit=\{handleSendMessage\} className="flex gap-2">/,
  \`                <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                    <button onClick={(e) => { e.preventDefault(); setInputValue("Upgrade Subscription"); handleSendMessage(undefined, "Upgrade Subscription"); }} className="shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest">Upgrade Plan</button>
                    <button onClick={(e) => { e.preventDefault(); setInputValue("Purchase Add-ons"); handleSendMessage(undefined, "Purchase Add-ons"); }} className="shrink-0 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest">Purchase Add-ons</button>
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">\`
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated App.tsx");

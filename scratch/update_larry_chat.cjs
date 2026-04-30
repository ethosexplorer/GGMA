const fs = require('fs');

const path = 'src/pages/BusinessDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const old1 = `<div className="flex flex-col gap-2 mt-2">
                       <button onClick={() => { if(lowStockAlerts.length > 0) setActiveTab("inventory"); else if (unresolvedAlerts.length > 0) setActiveTab("compliance"); else setActiveTab("reporting"); }} className="text-xs font-bold bg-white text-[#1a4731] px-4 py-2.5 rounded-xl text-left hover:bg-slate-100 transition-colors shadow-sm w-max self-end hidden sm:block">
                         {lowStockAlerts.length > 0 ? "Review Procurement" : unresolvedAlerts.length > 0 ? "Review Alerts" : "Generate Report"}
                       </button>
                    </div>`;

const new1 = `<div className="flex flex-row justify-end gap-2 mt-2">
                       <button onClick={() => { if(lowStockAlerts.length > 0) setActiveTab("inventory"); else if (unresolvedAlerts.length > 0) setActiveTab("compliance"); else setActiveTab("reporting"); }} className="text-xs font-bold bg-white text-[#1a4731] px-4 py-2.5 rounded-xl text-left hover:bg-slate-100 transition-colors shadow-sm hidden sm:block">
                         {lowStockAlerts.length > 0 ? "Review Procurement" : unresolvedAlerts.length > 0 ? "Review Alerts" : "Generate Report"}
                       </button>
                       <button onClick={() => { setDemoUnlocked(true); navigateTab('subscription'); }} className="text-xs font-bold bg-amber-500 text-white px-4 py-2.5 rounded-xl text-left hover:bg-amber-600 transition-colors shadow-sm hidden sm:block">
                         Activate Subscriptions / Add-ons
                       </button>
                    </div>`;

const old2 = `<input type="text" placeholder="Ask L.A.R.R.Y to run an audit..." className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all" onKeyDown={(e) => { if(e.key === "Enter") { alert("L.A.R.R.Y is analyzing your request. Standby."); e.currentTarget.value = ""; } }} />`;

const new2 = `<input type="text" placeholder="Ask L.A.R.R.Y to run an audit or manage subscriptions..." className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all" onKeyDown={(e) => { if(e.key === "Enter") { const val = e.currentTarget.value.toLowerCase(); if(val.includes('subscription') || val.includes('add-on') || val.includes('purchase') || val.includes('upgrade')) { setDemoUnlocked(true); navigateTab('subscription'); } else { alert("L.A.R.R.Y is analyzing your request. Standby."); } e.currentTarget.value = ""; } }} />`;

function replaceContent(c, o, n, label) {
    if (c.includes(o)) {
        console.log("Matched " + label + " (LF)");
        return c.replace(o, n);
    } else if (c.includes(o.replace(/\\n/g, '\\r\\n'))) {
        console.log("Matched " + label + " (CRLF)");
        return c.replace(o.replace(/\\n/g, '\\r\\n'), n.replace(/\\n/g, '\\r\\n'));
    } else {
        console.log("Failed to match " + label);
        return c;
    }
}

content = replaceContent(content, old1, new1, '1');
content = replaceContent(content, old2, new2, '2');

fs.writeFileSync(path, content, 'utf8');
console.log("Done");

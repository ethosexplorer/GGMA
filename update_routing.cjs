const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `} else if (lower.includes('human') || lower.includes('coordinator') || lower.includes('shantell') || lower.includes('speak with someone')) {`;
const replace1 = `} else if (lower.includes('human') || lower.includes('coordinator') || lower.includes('shantell') || lower.includes('speak with someone') || lower.includes('political') || lower.includes('media') || lower.includes('press') || lower.includes('enforcement') || lower.includes('state authority') || lower.includes('federal')) {`;

app = app.split(target1).join(replace1);

const target2 = `} else if (lower.includes('speak with shantell') || lower.includes('human')) {`;
const replace2 = `} else if (lower.includes('speak with shantell') || lower.includes('human') || lower.includes('political') || lower.includes('media') || lower.includes('press') || lower.includes('enforcement') || lower.includes('state authority') || lower.includes('federal')) {`;

app = app.split(target2).join(replace2);

fs.writeFileSync('src/App.tsx', app);

let founder = fs.readFileSync('src/pages/FounderDashboard.tsx', 'utf8');

// Insert the Live Alert Stream right sidebar at the end of the flex container
const insertPoint = `        <div className="flex-1 overflow-y-auto p-10">{getContent()}</div>
        
        {/* Proactive System Alert */}`;

const rightSidebar = `        <div className="flex-1 overflow-y-auto p-10">{getContent()}</div>
        
        {/* GLOBAL ALERTS STREAM (RIGHT SIDEBAR) */}
        <div className={cn("w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 transition-all duration-500 hidden xl:flex", !isUnlocked && "blur-md opacity-50 pointer-events-none")}>
           <div className="h-20 border-b border-slate-200 flex items-center px-6 bg-slate-50 shrink-0">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 flex items-center gap-2"><Bell size={16} className="text-indigo-600" /> Incoming Alerts Queue</h3>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar">
              <div className="p-4 bg-white border-l-4 border-cyan-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">State Auth</span>
                    <span className="text-[9px] text-slate-400 font-bold">Just Now</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">OMMA Regulatory Update Triggered</p>
                 <button className="mt-3 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Route to My Scheduler</button>
              </div>
              <div className="p-4 bg-white border-l-4 border-red-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded">Federal</span>
                    <span className="text-[9px] text-slate-400 font-bold">2m ago</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">DOJ compliance review request logged.</p>
                 <button className="mt-3 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Route to My Scheduler</button>
              </div>
              <div className="p-4 bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">SINC Alert</span>
                    <span className="text-[9px] text-slate-400 font-bold">14m ago</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">High-risk B2B transaction flagged.</p>
                 <button className="mt-3 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Route to My Scheduler</button>
              </div>
              <div className="p-4 bg-white border-l-4 border-purple-500 rounded-r-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Direct Transfer</span>
                    <span className="text-[9px] text-slate-400 font-bold">31m ago</span>
                 </div>
                 <p className="text-xs font-bold text-slate-800">Media/Press Inquiry transferred from Sylara.</p>
                 <button className="mt-3 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"><ArrowUpRight size={12}/> Route to My Scheduler</button>
              </div>
              
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400 flex flex-col items-center justify-center">
                 <Bell size={24} className="mb-2 opacity-50" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Listening for incoming alerts...</p>
              </div>
           </div>
        </div>

        {/* Proactive System Alert */}`;

founder = founder.replace(insertPoint, rightSidebar);
fs.writeFileSync('src/pages/FounderDashboard.tsx', founder);

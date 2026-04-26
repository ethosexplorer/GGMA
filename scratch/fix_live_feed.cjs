const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for regulatoryFeed at the top of the file (near other lib imports)
const importAnchor = "from '../lib/subscriptionPlans';";
const newImport = importAnchor + "\nimport { fetchRegulatoryFeed, formatFeedDate, type RegulatoryUpdate } from '../lib/regulatoryFeed';";
if (c.includes(importAnchor) && !c.includes('regulatoryFeed')) {
  c = c.replace(importAnchor, newImport);
  console.log('✅ Added regulatoryFeed import');
} else if (c.includes('regulatoryFeed')) {
  console.log('ℹ️ Import already exists');
} else {
  console.log('❌ Could not find import anchor');
}

// 2. Find the LandingPage component and add state + effect for live feed
// Find "const LandingPage" and then add state hooks after it
const landingAnchor = "const LandingPage = ({";
const landingIdx = c.indexOf(landingAnchor);
if (landingIdx >= 0) {
  // Find the first useState in LandingPage to add ours before it
  const afterLanding = c.indexOf('const [', landingIdx);
  if (afterLanding >= 0) {
    // Check if we already added it
    if (!c.includes('liveFeed')) {
      const feedState = `const [liveFeed, setLiveFeed] = useState<RegulatoryUpdate[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  
  useEffect(() => {
    fetchRegulatoryFeed(5).then(items => {
      setLiveFeed(items);
      setFeedLoading(false);
    }).catch(() => setFeedLoading(false));
    
    // Refresh every hour
    const interval = setInterval(() => {
      fetchRegulatoryFeed(5).then(items => setLiveFeed(items));
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  `;
      c = c.substring(0, afterLanding) + feedState + c.substring(afterLanding);
      console.log('✅ Added liveFeed state and effect');
    } else {
      console.log('ℹ️ liveFeed state already exists');
    }
  }
}

// 3. Replace the hardcoded Regulatory Intelligence content with live feed rendering
// Find the entire block from "Strategic News & Updates Sidebar" to "Secure Your Infrastructure"
const sidebarStart = c.indexOf('{/* Strategic News & Updates Sidebar */}');
const sidebarEndMarker = "Secure Your Infrastructure";
const sidebarEnd = c.indexOf(sidebarEndMarker);

if (sidebarStart >= 0 && sidebarEnd >= 0) {
  // Find the closing </div> after "Secure Your Infrastructure" button
  const afterSecure = c.indexOf('</div>', sidebarEnd);
  const afterSecure2 = c.indexOf('</div>', afterSecure + 6);
  
  const newSidebar = `{/* Strategic News & Updates Sidebar — LIVE FEED */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-6 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Regulatory Intelligence</h3>
               <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                 <AlertCircle size={12} /> Live Updates
               </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar relative z-10">
               {liveFeed.length > 0 ? (
                 <>
                   {liveFeed.map((item, idx) => (
                     <div key={idx}>
                       {idx > 0 && <div className="w-full h-px bg-slate-100 mb-5"></div>}
                       <div className="group cursor-pointer" onClick={() => window.open(item.link, '_blank')}>
                         <div className="flex items-center gap-2 mb-1">
                           {item.isBreaking && (
                             <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">Breaking</span>
                           )}
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatFeedDate(item.pubDate)}</p>
                         </div>
                         <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors leading-snug">{item.title}</h4>
                         <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                         <p className="text-[10px] text-emerald-600 font-bold mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">Read full article →</p>
                       </div>
                     </div>
                   ))}
                   <div className="pt-4 border-t border-slate-100">
                     <p className="text-[10px] text-slate-400 text-center">
                       Source: <a href="https://www.marijuanamoment.net" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Marijuana Moment</a> • Updates every 30 min
                     </p>
                   </div>
                 </>
               ) : feedLoading ? (
                 <div className="flex flex-col items-center justify-center py-8 gap-3">
                   <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-xs text-slate-400 font-bold">Loading live regulatory feed...</p>
                 </div>
               ) : (
                 <>
                   {/* Fallback to hardcoded content */}
                   <div className="group">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">Breaking</span>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                     </div>
                     <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors">Cannabis Officially Rescheduled: Schedule I → Schedule III</h4>
                     <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc marker:text-emerald-500">
                        <li><strong className="text-slate-800">Acting Attorney General</strong> signed order moving state-licensed medical marijuana from Schedule I to Schedule III of the CSA.</li>
                        <li><strong className="text-slate-800">GGHP Impact:</strong> DEA registration tracking, 280E tax deductions, and banking access modules now active across all portals.</li>
                     </ul>
                   </div>
                   <div className="w-full h-px bg-slate-100"></div>
                   <div className="group">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Industry Trend</p>
                     <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors">OMMA: 7-Day Routine Inspection Windows</h4>
                     <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc marker:text-emerald-500">
                        <li><strong className="text-slate-800">SINC Solution:</strong> 24/7 AI-driven mock audits. Your business is audit-ready before OMMA even issues the 7-day notice.</li>
                     </ul>
                   </div>
                 </>
               )}
            </div>
            
            <button onClick={() => document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' })} className="w-full mt-6 py-3 bg-[#1a4731] text-white rounded-xl text-sm font-bold hover:bg-[#153a28] transition-colors shadow-lg shadow-emerald-900/20 relative z-10">
               Secure Your Infrastructure
            </button>
          </div>`;

  c = c.substring(0, sidebarStart) + newSidebar + c.substring(afterSecure2 + 6);
  console.log('✅ Replaced Regulatory Intelligence panel with live feed');
} else {
  console.log('❌ Could not find sidebar markers: start=' + (sidebarStart >= 0) + ' end=' + (sidebarEnd >= 0));
}

fs.writeFileSync('src/App.tsx', c, 'utf8');
console.log('✅ File saved');

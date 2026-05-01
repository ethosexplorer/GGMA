const LandingPage = ({ onNavigate, jurisdiction, setJurisdiction }: { onNavigate: (view: 'login' | 'signup' | 'patient-portal' | 'support' | 'larry-chatbot' | 'larry-business' | 'legal-advocacy', role?: string) => void, jurisdiction?: string, setJurisdiction?: (s: string) => void }) => {
  const [liveFeed, setLiveFeed] = useState<RegulatoryUpdate[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  
  useEffect(() => {
    setFeedLoading(true);
    fetchRegulatoryFeed(5, jurisdiction).then(items => {
      setLiveFeed(items);
      setFeedLoading(false);
    }).catch(() => setFeedLoading(false));
    
    // Refresh every hour
    const interval = setInterval(() => {
      fetchRegulatoryFeed(5, jurisdiction).then(items => setLiveFeed(items));
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [jurisdiction]);
  
  const [broadcastMsg, setBroadcastMsg] = useState('🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • GLOBAL GREEN HYBRID PLATFORM (GGHP) • ALL SECTORS (GGMA/RIP/SINC) OPERATIONAL');
  
    const [inTheKnowNews, setInTheKnowNews] = useState([
      '🔴 BREAKING: Federal Marijuana Rescheduling - Schedule I → Schedule III NOW OFFICIAL',
      'Sylara AI processed 50,000+ compliance checks this hour'
    ]);

    useEffect(() => {
      const fetchNews = async () => {
        try {
          // Live API Scraping for hottest hourly news
          const query = jurisdiction ? encodeURIComponent(`${jurisdiction} (marijuana OR cannabis)`) : 'marijuana OR cannabis';
          const res = await fetch(`https://www.reddit.com/search.json?q=${query}&sort=hot&limit=5`);
          const json = await res.json();
          if (json?.data?.children?.length > 0) {
            const livePosts = json.data.children
              .filter((child: any) => !child.data.over_18)
              .map((child: any) => `🔴 LIVE NEWS: ${child.data.title.substring(0, 80)}...`);
            setInTheKnowNews((prev) => [...livePosts, ...prev.slice(0, 3)]);
          }
        } catch (err) {
          console.error('Failed to auto-scrape news:', err);
        }
      };
      fetchNews();
      const interval = setInterval(fetchNews, 3600000); // Scrape hourly
      return () => clearInterval(interval);
    }, [jurisdiction]);


  useEffect(() => {
    // Sync with Founder's Emergency Broadcast
    const syncAlert = () => {
      const savedAlert = localStorage.getItem('gghp_platform_alert');
      if (savedAlert) setBroadcastMsg(savedAlert);
    };
    syncAlert();
    window.addEventListener('storage', syncAlert);
    const interval = setInterval(syncAlert, 1000); // Polling for demo
    return () => {
      window.removeEventListener('storage', syncAlert);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* URGENT PLATFORM ALERT TICKER */}
      <div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-red-700 relative z-[60]">
        <div className="inline-block animate-marquee-fast font-black text-sm uppercase tracking-widest">
          {broadcastMsg} &nbsp; • &nbsp; {broadcastMsg} &nbsp; • &nbsp; {broadcastMsg}
        </div>
      </div>


      {/* 🌐 LANGUAGE BAR — Always visible at the very top */}
      <div className="bg-slate-900 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-2 flex items-center justify-between z-[60] relative">
        <div className="flex items-center gap-3">
          <Globe size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Speak Your Language</span>
        </div>
        <div className="flex items-center gap-3">
            {jurisdiction && (
              <div className="hidden md:flex items-center mr-4 pr-4 border-r border-slate-700/50 gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
                <span className="text-emerald-400 font-black text-xl tracking-widest uppercase drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  {jurisdiction}
                </span>
                <span className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest leading-none mt-1">PORTAL</span>
              </div>
            )}
            {jurisdiction && setJurisdiction && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50 shadow-inner mr-2">
                <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <MapPin size={12} />
                </div>
                <div className="relative flex items-center h-6">
                  <span className="pl-2 pr-1 text-emerald-400 font-black tracking-widest text-[9px] uppercase hidden lg:inline">JURISDICTION:</span>
                  <select 
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="appearance-none bg-transparent text-white font-black text-xs px-1 py-1 pr-6 outline-none cursor-pointer hover:text-emerald-300 transition-colors uppercase"
                  >
                    {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map(s => <option key={s} value={s} className="bg-slate-800 text-white normal-case">{s}</option>)}
                  </select>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500 font-bold text-[10px]">▼</div>
                </div>
              </div>
            )}
            <LanguageSelector currentLanguage="en" onLanguageChange={(code) => { 
            const gCode = code === 'zh' ? 'zh-CN' : code;
            if (gCode === 'en') {
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
            } else {
              document.cookie = `googtrans=/en/${gCode}; path=/;`;
              document.cookie = `googtrans=/en/${gCode}; path=/; domain=` + window.location.hostname;
            }
            window.location.reload();
          }} compact />
          <span className="text-[10px] text-emerald-400 font-bold hidden lg:inline">26 Languages • Sylara AI speaks yours</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <img src="/gghp-logo.png" alt="GGHP Logo" className="h-14 md:h-16 w-auto object-contain object-left" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center">
            <div className="w-12 h-12 bg-[#1a4731] rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#state-facts" className="hover:text-[#1a4731] transition-colors">State Facts</a>
          <button onClick={() => onNavigate('education' as any)} className="hover:text-[#1a4731] transition-colors font-medium flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-600" /> Education Academy
          </button>
          <button onClick={() => onNavigate('larry-chatbot', 'ggma')} className="hover:text-[#1a4731] transition-colors font-medium">GGMA Sector</button>
          <button onClick={() => onNavigate('larry-chatbot', 'rip')} className="hover:text-[#1a4731] transition-colors font-medium">RIP Intelligence</button>
          <button onClick={() => onNavigate('larry-chatbot', 'sinc')} className="hover:text-[#1a4731] transition-colors font-medium">SINC Compliance</button>
          <button onClick={() => onNavigate('legal-advocacy' as any)} className="hover:text-amber-600 transition-colors font-bold text-amber-700 flex items-center gap-1">
            <Scale size={14} /> Legal Support
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <button 
            onClick={() => onNavigate('larry-chatbot')} 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100 font-bold hover:bg-emerald-100 transition-all shadow-sm group"
          >
            <Calendar size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            Chat with SYLARA OUR AI Cannabis Concierge
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => onNavigate('login')}>Login</Button>
        </div>
      </nav>

      {/* 🗳️ COMMUNITY POLLS — Featured Banner */}
      <FeaturedPoll />

      {/* "IN THE KNOW" NEWS TICKER */}
      <div className="bg-emerald-950 text-emerald-100 py-3 border-b border-emerald-900/20 overflow-hidden whitespace-nowrap relative z-40 mb-8">
        <div className="inline-block animate-marquee font-bold text-xs uppercase tracking-[0.2em]">
          <span className="bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded text-[9px] mr-4">IN THE KNOW</span>
          {inTheKnowNews.join(' • ')} &nbsp; • &nbsp; {inTheKnowNews.join(' • ')}
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto">
        <StateWelcomeBanner jurisdiction={jurisdiction || 'Oklahoma'} type="business" />
      </div>

      {/* Hero Section */}
      <section className="pt-10 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-emerald-50 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="inline-block bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-xl mb-4 transform hover:scale-105 transition-transform">
            <p className="text-emerald-950 font-black tracking-widest uppercase text-sm mb-1 flex items-center justify-center gap-2">
              <Headphones className="text-emerald-500" size={18} /> Call Center Operations
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a4731] tracking-tight">
              1-888-964-GGHP
            </h2>
          </div>

          <p className="text-emerald-950 font-bold tracking-[0.3em] uppercase text-xs mb-[-10px] opacity-70">Global Green Enterprise Inc introducing</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Infrastructure Active: 50 States + DC Secure
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a4731] leading-[1.05] tracking-tight">
            The Gold Standard in <br /> <span className="text-emerald-600">Compliance Infrastructure</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Global Green Enterprise Inc introduces the Global Green Hybrid Platform (GGHP) — a unified compliance ecosystem for GGMA, RIP, and SINC.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search state laws, statutes, or business regulations..."
              className="w-full pl-12 pr-32 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg"
            />
            <button className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-[#1a4731] hover:bg-[#153a28] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20">
              Quick Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button onClick={() => onNavigate('login')} className="px-8 py-4 bg-[#1a4731] text-white rounded-2xl font-bold hover:bg-[#153a28] transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2">
              Access Enterprise Hub
              <ArrowRight size={18} />
            </button>
            <a href="#membership-tiers" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              View Compliance Tiers
            </a>
          </div>
        </div>
      </section>

      {/* GGHP Infrastructure Banner & News Column */}
      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#1a4731] rounded-[3rem] overflow-hidden shadow-2xl relative border border-white/10 group flex flex-col h-full min-h-[400px]">
             <img src="/gghp-branding.png" alt="GGHP Platform" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f2d1e] via-[#0f2d1e]/40 to-transparent"></div>
             <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">GGHP</h2>
                  <p className="text-indigo-200 font-medium">Platform state: <span className="text-emerald-400 font-bold">Operational</span> • Umbrella: <span className="text-white font-bold">GGHP (Global Green Enterprise Inc)</span></p>
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Global Green Hybrid Platform (GGHP) • GGMA • RIP • SINC</p>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-sm font-bold">
                   50 States Live • 24/7 Monitoring
                </div>
             </div>
          </div>

          {/* Strategic News & Updates Sidebar — LIVE FEED */}
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
          </div>
        </div>
      </section>

      {/* ═══ CREDENTIALS, CERTIFICATIONS & TRUST ═══ */}
      <section id="credentials-section" className="py-20 px-6 bg-slate-50 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              <Shield size={12} /> Verified &amp; Registered
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Credentials &amp; Certifications</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Fully registered across all levels of Oklahoma government. Built by 30+ years of corporate leadership and 8 years of cannabis industry expertise.</p>
          </div>

          {/* Government Registration Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🇺🇸</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">✅ ACTIVE</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">SAM.gov</h4>
              <p className="text-slate-500 text-[11px] mb-1">Federal Supplier</p>
              <p className="text-slate-400 text-[10px] font-mono">CAGE: 9KXZ2</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🏛️</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">✅ REGISTERED</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">OMES</h4>
              <p className="text-slate-500 text-[11px] mb-1">State Vendor</p>
              <p className="text-slate-400 text-[10px] font-mono">Oklahoma State Procurement</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🏙️</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">✅ APPROVED</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">OKC City &amp; Trusts</h4>
              <p className="text-slate-500 text-[11px] mb-1">Municipal Approved</p>
              <p className="text-slate-400 text-[10px] font-mono">BidNet Direct • City of OKC</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-rose-100 hover:border-rose-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">👩‍💼</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700">✅ CERTIFIED</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">WOSB</h4>
              <p className="text-slate-500 text-[11px] mb-1">Woman-Owned Small Business</p>
              <p className="text-slate-400 text-[10px] font-mono">SBA Certification</p>
            </div>
          </div>

          {/* Additional Registration Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { label: 'Oklahoma ERP/PeopleSoft', icon: '📊' },
              { label: 'BidNet Direct (Municipal)', icon: '📋' },
              { label: 'OKC Bids & Auctions', icon: '🔨' },
              { label: 'County-Level Procurement', icon: '🏘️' },
              { label: 'Metrc Validated Integrator', icon: '🔗' },
              { label: 'HIPAA Compliant', icon: '🔒' },
              { label: 'AES-256 Encryption', icon: '🛡️' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all">
                <span>{badge.icon}</span> {badge.label}
              </div>
            ))}
          </div>

          {/* Founder Credentials + Company Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Accreditations Card */}
            <div className="bg-[#0f2d1e] rounded-2xl p-8 text-white relative overflow-hidden group border border-emerald-900/50 shadow-xl flex flex-col justify-center">
              {/* Neon Shield Map Badge */}
              <div className="absolute inset-y-0 right-0 w-[55%] z-0 flex items-center justify-end opacity-90 transition-opacity duration-700 pointer-events-none pr-4 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d1e] via-[#0f2d1e]/80 to-transparent z-10"></div>
                 <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-[#0f2d1e] to-transparent z-10"></div>
                 <img src="/gghp-branding.png" alt="GGHP Badge" className="w-[120%] h-[120%] object-cover object-[center_30%] opacity-80 mix-blend-screen scale-125 translate-x-[15%]" />
              </div>

              <div className="relative z-10 md:max-w-[75%]">
                <div className="flex items-center gap-2 mb-6 inline-flex bg-[#0f2d1e]/80 px-3 py-1.5 rounded-full border border-emerald-800/30 backdrop-blur-sm shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Platform Accreditations</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 bg-[#0f2d1e]/60 p-3 rounded-xl backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">🌿</span>
                    <div>
                      <p className="text-white font-black text-sm">8 Years in Cannabis</p>
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Regulatory compliance, licensing, and patient advocacy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[#0f2d1e]/60 p-3 rounded-xl backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">🏢</span>
                    <div>
                      <p className="text-white font-black text-sm">30+ Years Corporate Administration</p>
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Enterprise build, structure, and management leadership</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[#0f2d1e]/60 p-3 rounded-xl backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">🔗</span>
                    <div>
                      <p className="text-white font-black text-sm">Validated Metrc Integrator</p>
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Oklahoma sandbox certified — production API access</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap relative z-10">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-emerald-300 border border-white/10 hover:bg-emerald-500/20 transition-colors cursor-default">Global Green Enterprise Inc</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-emerald-300 border border-white/10 hover:bg-emerald-500/20 transition-colors cursor-default">Diversity Health & Wellness LLC</span>
              </div>
            </div>

            {/* Company Highlights */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Platform Highlights</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50', label: 'States + DC', sub: 'Infrastructure Active' },
                  { value: '26', label: 'Languages', sub: 'Global Accessibility' },
                  { value: '22+', label: 'Polls Active', sub: 'Community Engagement' },
                  { value: '99.9%', label: 'Uptime SLA', sub: 'Enterprise Reliability' },
                  { value: '3', label: 'AI Engines', sub: 'Sylara • L.A.R.R.Y • SINC' },
                  { value: '5', label: 'Gov Levels', sub: 'Federal → City Registered' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors">
                    <p className="text-2xl font-black text-emerald-950">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-700">{stat.label}</p>
                    <p className="text-[10px] text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Partners Bar */}
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Integrated With &amp; Registered On</p>
            <div className="flex flex-wrap justify-center items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
              {['SAM.gov', 'OMES', 'Metrc', 'BidNet Direct', 'OKC City', 'OK ERP', 'Calendly', 'GoHealthUSA'].map((partner, i) => (
                <span key={i} className="text-xs font-black text-slate-500 uppercase tracking-wider px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🏛️ DEA Schedule III Ready Banner */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[11px] font-black text-blue-300 uppercase tracking-widest">Federal Compliance Ready</span>
              </div>
              <h2 className="text-4xl font-black text-white leading-tight">
                DEA Schedule III<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Registration Ready</span>
              </h2>
              <p className="text-blue-100/70 text-lg leading-relaxed max-w-xl">
                GGP-OS maps directly to all 5 primary sections of the DEA's federal registration application. State-licensed dispensaries can prepare, verify, and export their compliance data — all from one platform.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Metrc Integrated', icon: '🔗' },
                  { label: 'OMMA Certified', icon: '✅' },
                  { label: 'SOP Library', icon: '📋' },
                  { label: 'Personnel Tracking', icon: '👥' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[11px] font-bold text-blue-200">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-black text-sm hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/25"
                >
                  Explore Business Portal
                </button>
                <span className="text-blue-400/60 text-xs font-bold">60-day application window • Deadline: June 22, 2026</span>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-1 gap-3 w-full lg:w-auto lg:min-w-[280px]">
              {[
                { sec: '§1', title: 'Business Info', pct: 100 },
                { sec: '§2', title: 'Drug Codes', pct: 100 },
                { sec: '§3', title: 'State Licenses', pct: 100 },
                { sec: '§4', title: 'Liability', pct: 100 },
                { sec: '§5', title: 'SOPs & Compliance', pct: 92 },
                { sec: '§6', title: 'Payment', pct: 0 },
                { sec: '§7', title: 'Submission', pct: 0 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">{s.sec}</span>
                  <span className="text-xs font-bold text-white flex-1">{s.title}</span>
                  <div className="w-16 bg-white/10 rounded-full h-1.5">
                    <div className={`h-full rounded-full ${s.pct === 100 ? 'bg-emerald-400' : s.pct > 0 ? 'bg-blue-400' : 'bg-white/20'}`} style={{ width: `${Math.max(s.pct, 8)}%` }} />
                  </div>
                  <span className={`text-[10px] font-black ${s.pct === 100 ? 'text-emerald-400' : s.pct > 0 ? 'text-blue-400' : 'text-white/30'}`}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-24 bg-slate-100/50 border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Select Your Portal</h2>
            <p className="text-slate-500">Secure, verified access tailored to your regulatory requirements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#4FC3F7] bg-gradient-to-br from-[#4FC3F7] to-[#0288D1] flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <circle cx="8" cy="10" r="2" />
                  <path d="M8 14c-2 0-3 1-3 2" />
                  <path d="M8 14c2 0 3 1 3 2" />
                  <line x1="14" y1="9" x2="20" y2="9" />
                  <line x1="14" y1="13" x2="18" y2="13" />
                  <circle cx="18" cy="16" r="2" fill="white" stroke="white" />
                  <path d="M17.2 16l0.5 0.5 1.1-1.1" stroke="#0288D1" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Patient Portal (GGMA)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The GGMA Consumer Sector. Securely apply for your medical license, manage renewals, and access your digital Care Wallet.
              </p>
              <p className="text-sm italic text-slate-600 mb-6">
                Adult, Minor, Caregiver, Short-Term, Out-of-State
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Patient Portal Login
              </button>
            </div>

            {/* Business Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#81C784] bg-gradient-to-br from-[#81C784] to-[#2E7D32] flex items-center justify-center mb-6 shadow-lg shadow-green-200/50">
                <Building2 className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Business Portal (GGE)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The GGE B2B Sector. Centralized hub for professional operations, seed-to-sale inventory, and compliance audit shielding.
              </p>
              <p className="text-sm italic text-slate-600 mb-6 font-bold">
                Providers, Attorneys, Dispensaries, Cultivation, Manufacturing, Medcard Services
              </p>
              <button
                onClick={() => { onNavigate('login', 'Business');  }}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Business Login / Signup
              </button>
            </div>

            {/* Government / Admin Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FFB74D] bg-gradient-to-br from-[#FFB74D] to-[#E65100] flex items-center justify-center mb-6 shadow-lg shadow-orange-200/50">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Oversight Portal (RIP/SINC)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The Governance Sector. Authorized command center for real-time intelligence (RIP) and secure infrastructure compliance (SINC).
              </p>
              <p className="text-sm italic text-slate-600 mb-6">
                Law Enforcement (RIP), Regulators, Executives, Operations
              </p>
              <button
                onClick={() => { onNavigate('login', 'Oversight');  }}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Secure Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Success Stories (GGMA Sector Reviews) */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                ⭐ Community Trust
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verified Patient Success</h2>
              <p className="text-slate-500 max-w-md font-medium">Hear from our community members about their journey with the GGMA Sector.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-slate-700">4.9/5 Average Rating</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { name: 'Marcus T.', date: 'Oct 2024', text: 'The intake process with Sylara was so fast. Had my recommendation in 15 minutes!', rating: 5 },
               { name: 'Sarah J.', date: 'Nov 2023', text: 'Global Green makes compliance feel like common sense. The Care Wallet is a game changer.', rating: 5 },
               { name: 'David L.', date: 'Feb 2024', text: 'Finally a platform that understands Oklahoma regulations from the inside out.', rating: 5 }
             ].map((review, i) => (
               <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
                 <div className="flex gap-1 mb-4">
                   {Array.from({ length: review.rating }).map((_, j) => (
                     <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                   ))}
                 </div>
                 <p className="text-slate-700 font-medium mb-6 leading-relaxed italic">"{review.text}"</p>
                 <div className="flex items-center justify-between">
                   <div className="font-bold text-slate-900 text-sm">{review.name}</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</div>
                 </div>
               </div>
             ))}
          </div>

          <div className="mt-12 text-center">
             <button 
               onClick={() => window.open('https://vocalvideo.com/c/ccardzmedcard-com-as6sui63', '_blank')}
               className="inline-flex items-center gap-2 text-[#1a4731] font-bold hover:underline cursor-pointer bg-transparent border-none"
             >
               View All Verified Testimonials
               <ArrowRight size={16} />
             </button>
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      <PricingTiers onNavigate={(view) => onNavigate(view as any)} />

      {/* Partners & Paid Advertisements */}
      <section className="py-20 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-6">
           <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Strategic Infrastructure Partners & Sponsors</p>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {['Apex Health', 'Verity Labs', 'GreenGrid', 'SecureLogix', 'OMMA', 'METRC'].map((p, i) => (
                <div key={i} className="flex items-center justify-center h-12 bg-transparent border border-transparent rounded-xl hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all font-black text-slate-900 text-sm italic">
                  {p}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* C3 Introduction Section */}
      <section id="c3-score" className="py-24 px-6 bg-slate-900 bg-gradient-to-br from-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border-r border-b border-white/20"></div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
              ✨ The Industry's First Cannabis Credit Bureau
            </div>
            <h2 className="text-5xl font-black tracking-tight leading-tight">
              What is <span className="text-emerald-400">C³</span>?
            </h2>
            <p className="text-xl text-emerald-50/80 leading-relaxed font-medium">
              C³ stands for **Compassion, Compliance & Community** — the industry's first <strong className="text-emerald-400">Cannabis Credit Bureau</strong>. Like a FICO score for cannabis, C³ is our proprietary real-time trust metric that quantifies ethical participation, regulatory adherence, and community impact across the entire Global Green ecosystem.
            </p>
            <div className="space-y-6">
              {[
                { t: 'Compassion', d: 'Rewards accessible patient care and social equity participation.' },
                { t: 'Compliance', d: 'Verifies real-time adherence to Metrc and state statutes via L.A.R.R.Y.' },
                { t: 'Community', d: 'Measures engagement with our educational and operational support hubs.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 font-black text-emerald-400">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{item.t}</h4>
                    <p className="text-emerald-100/60 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full aspect-square bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center relative group">
            <div className="absolute inset-0 bg-emerald-400/20 blur-[100px] rounded-full scale-50 group-hover:scale-75 transition-transform duration-1000 opacity-50"></div>
            <div className="text-8xl font-black text-emerald-400 mb-4 tracking-tighter relative">C³</div>
            <div className="text-2xl font-bold text-white mb-2 relative">Score Verification Active</div>
            <p className="text-emerald-100/40 text-sm mb-8 relative">Integrated across all GGMA, RIP, and SINC sectors</p>
            <button 
              onClick={() => { const el = document.getElementById('membership-tiers'); if (el) { el.scrollIntoView({ behavior: 'smooth' }); } else { onNavigate('login'); } }}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 relative"
            >
              View Your Score Potential
            </button>
          </div>
        </div>
      </section>

      
      {/* C³ Score Deep Dive — What it does for YOU */}
      <section id="c3-score-details" className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 rounded-full border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
              ✨ C³ Score Explained
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              How C³ <span className="text-emerald-600">Works For You</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Your C³ Score is a living, real-time trust rating that measures Compassion, Compliance & Community across every interaction in the Global Green ecosystem. The higher your score, the more benefits you unlock.
            </p>
          </div>

          {/* How It's Calculated */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                score: 'Compassion', 
                emoji: '💚', 
                weight: '33%',
                color: 'from-teal-500 to-emerald-600',
                items: [
                  'Patient accessibility & social equity participation',
                  'Affordable pricing initiatives for underserved communities',
                  'Caregiver engagement & support network involvement',
                  'Charitable contributions & community health programs'
                ]
              },
              { 
                score: 'Compliance', 
                emoji: '🛡️', 
                weight: '34%',
                color: 'from-blue-500 to-indigo-600',
                items: [
                  'Real-time Metrc & seed-to-sale adherence',
                  'OMMA license status & renewal tracking',
                  'L.A.R.R.Y AI audit pass rates',
                  'Zero violations, zero diversions verified'
                ]
              },
              { 
                score: 'Community', 
                emoji: '🤝', 
                weight: '33%',
                color: 'from-purple-500 to-violet-600',
                items: [
                  'Platform engagement & educational course completion',
                  'Peer referrals & network growth',
                  'Community forum participation & feedback',
                  'Support ticket response quality & transparency'
                ]
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-2xl mb-5 shadow-lg`}>
                  {pillar.emoji}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-1">{pillar.score}</h3>
                <p className="text-emerald-600 text-xs font-bold mb-4 uppercase tracking-widest">{pillar.weight} of total score</p>
                <ul className="space-y-2.5">
                  {pillar.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benefits by Tier */}
          <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-10 mb-16">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">Benefits by C³ Score Tier</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { tier: 'Bronze', range: '0-249', color: 'bg-amber-700', benefits: ['Basic platform access', 'Standard support', 'Community forums'] },
                { tier: 'Silver', range: '250-499', color: 'bg-slate-400', benefits: ['Priority support queue', 'Monthly compliance reports', '5% add-on discounts'] },
                { tier: 'Gold', range: '500-749', color: 'bg-amber-500', benefits: ['Dedicated account manager', 'Quarterly strategy review', '15% off renewals', 'Early feature access'] },
                { tier: 'Platinum', range: '750-1000', color: 'bg-emerald-600', benefits: ['White-glove onboarding', 'Custom API integrations', '25% lifetime discount', 'Advisory board invitation', 'Featured partner listing'] }
              ].map((t, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all">
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <Star size={18} className="text-white" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-1">{t.tier}</h4>
                  <p className="text-xs text-emerald-600 font-bold mb-4">{t.range} points</p>
                  <ul className="space-y-2">
                    {t.benefits.map((b, j) => (
                      <li key={j} className="text-xs text-slate-600 flex items-start gap-2">
                        <Check size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Who it helps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-emerald-50 rounded-[2rem] border border-emerald-200 p-8">
              <h3 className="text-xl font-black text-emerald-900 mb-4 flex items-center gap-2"><User size={20} /> For Patients</h3>
              <ul className="space-y-3 text-sm text-emerald-800">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Track your compliance journey — card renewals, physician visits, and care milestones</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Earn rewards for staying compliant and engaging with educational resources</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Higher scores unlock discounts at participating dispensaries</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> Build a verified patient trust profile visible to your care team</li>
              </ul>
            </div>
            <div className="bg-slate-900 rounded-[2rem] border border-slate-700 p-8 text-white">
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><Building2 size={20} /> For Businesses</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Demonstrate audit readiness to OMMA and state regulators in real-time</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Reduce compliance violations and avoid costly fines with AI-driven monitoring</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Attract investors and partners with a verified, transparent trust score</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" /> Qualify for reduced insurance premiums and preferred vendor listings</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button 
              onClick={() => document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
            >
              Start Building Your C³ Score
              <ArrowRight size={18} />
            </button>
            <p className="text-sm text-slate-500 mt-4 font-medium">Subscribe to any plan to begin earning your C³ Score</p>
          </div>
        </div>
      </section>

      {/* Maps & Stats Section */}
      <section id="jurisdiction-intelligence" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
               Live Data Feed
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Real-time <br /> <span className="text-emerald-600">State Jurisdiction</span> Intelligence
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              We've uploaded regulatory facts and compliance standards for all 50 states. Our nationwide aggregator Establishment monitors 400+ data points hourly to ensure you are never out of compliance.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">100%</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">US Territory Coverage</p>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-3xl font-black text-emerald-600">2.4M</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Patient Records</p>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full h-[500px] bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-emerald-500 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <MapChart />
          </div>
        </div>
      </section>

      {/* State Facts & Compliance Standards Grid */}
      <section id="state-facts" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="space-y-4">
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">GGHP Oversight Command Hub</h1>
            <p className="text-slate-500 font-medium">Unified access to Global Green Enterprise Inc sectors: GGMA, RIP, and SINC.</p>
              </div>
              <button 
                onClick={() => onNavigate('login')}
                className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center gap-2"
              >
                 Explore Full Database <ArrowRight size={18} />
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { s: 'Oklahoma', t: '7% Excise Tax', c: 'Open Medical', d: '2,400 Dispensaries' },
                { s: 'Florida', t: '0% Excise Tax', c: 'Strict Medical', d: '630 Dispensaries' },
                { s: 'California', t: '15% Excise Tax', c: 'Full Recreational', d: '1,100 Dispensaries' },
                { s: 'Texas', t: 'Low THC Only', c: 'Restrictive', d: '3 Active Hubs' }
              ].map((st, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group">
                   <h4 className="text-xl font-black text-slate-900 mb-4">{st.s}</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Activity size={14} className="text-emerald-500" /> {st.t}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Shield size={14} className="text-blue-500" /> {st.c}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Building2 size={14} className="text-amber-500" /> {st.d}</div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-emerald-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Statutes <ChevronRight size={14} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Attorney Marketplace Preview Section */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-full bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
           <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                 <Gavel size={12} />
                 Legal Advocacy Hub
              </div>
              <h2 className="text-5xl font-black tracking-tight leading-[1.1]">
                 Find Verified <br /> <span className="text-emerald-400">Cannabis Legal Counsel</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                 Navigating multi-state regulations requires elite legal expertise. Our Attorney Marketplace connects you with bar-verified counsel specializing in OMMA licensing, METRC compliance, and patient rights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button 
                   onClick={() => onNavigate('legal-advocacy')}
                   className="flex-1 px-4 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 text-center text-sm"
                 >
                    Intake & Schedule Consult
                 </button>
                 <button 
                    onClick={() => {
                      const el = document.getElementById('membership-tiers');
                      if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
                      else { onNavigate('login'); }
                    }}
                   className="relative flex-1 px-4 py-4 bg-slate-800/80 backdrop-blur-md text-slate-500 rounded-2xl font-black border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition-all shadow-xl text-center text-sm group"
                 >
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center group-hover:bg-slate-900/80 transition-all">
                      <Lock size={16} className="mr-2" /> <span className="group-hover:hidden">Locked</span><span className="hidden group-hover:inline">Subscribe to Unlock</span>
                    </div>
                    Legal Marketplace
                 </button>
              </div>
              <div className="mt-4 flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl w-max">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">ATY</div>
                    ))}
                 </div>
                 <span className="text-xs font-bold text-slate-300">120+ Verified Attorneys Active</span>
              </div>
           </div>
           
           <div className="lg:w-1/2 w-full">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 space-y-6">
                 {[
                   { name: 'Sarah J. Richardson', exp: 'OMMA Licensing Expert', tag: 'Oklahoma' },
                   { name: 'Marcus Thorne', exp: 'M&A / Corporate', tag: 'Multi-State' },
                   { name: 'Elena Vance', exp: 'Patient Rights & Criminal', tag: 'Texas/FL' }
                 ].map((atty, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">AT</div>
                         <div>
                            <p className="font-bold text-white">{atty.name}</p>
                            <p className="text-xs text-slate-400">{atty.exp}</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">{atty.tag}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity">
              <img src="/gghp-logo.png" alt="GGHP Logo" className="w-64 h-24 object-contain hover:scale-110 transition-all cursor-pointer" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
              }} />
              <div className="fallback-logo hidden">
                <div className="w-12 h-12 rounded-xl bg-[#1a4731] flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 max-w-3xl mx-auto leading-relaxed uppercase tracking-wide">
            Disclaimer: Global Green Enterprise Inc (GGHP) infrastructure is designed to aggregate and assist with regulatory compliance across GGMA, RIP, and SINC sectors. Compliance is subject to state, local, and federal jurisdictions. Use of this platform does not constitute legal advice. By accessing this portal, you agree to our terms of service, multi-factor authentication requirements, and role-based data restrictions.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-[#1a4731] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Accessibility</a>
            <a href="tel:14054927297" className="hover:text-[#1a4731] transition-colors font-black"></a>
          </div>
        </div>
      </footer>

      {/* 🗳️ Sticky Poll Widget — appears on scroll */}
      <StickyPollWidget />

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, AlertCircle, ChevronRight, ArrowRight, Globe, MapPin,
  Map as MapIcon, MessageSquare, ChevronDown, Send, GraduationCap, Sparkles, Scale,
  Briefcase, Bot, BookOpen, Phone, Star, ArrowUpCircle, Home, Check, Wallet,
  HeartHandshake, HelpCircle, Building2, Leaf, Activity, Gavel, Headphones,
  Users, ShoppingCart, PackageSearch, ClipboardList, Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/shared/Button';
import MapChart from '../components/MapChart';
import { FeaturedPoll, StickyPollWidget, RevolvingSurveyBanner } from '../components/CommunityPolls';
import { RegulatoryFeedWidget } from '../components/shared/RegulatoryFeedWidget';
import { StateWelcomeBanner } from '../components/shared/StateWelcomeBanner';
import { fetchRegulatoryFeed, formatFeedDate, type RegulatoryUpdate } from '../lib/regulatoryFeed';
import { LanguageSelector } from '../components/LanguageSelector';
export const LandingPage = ({ onNavigate, jurisdiction, setJurisdiction }: { onNavigate: (view: 'what-is-care-wallet' | 'what-is-c3' | 'login' | 'signup' | 'patient-portal' | 'support' | 'larry-chatbot' | 'larry-business' | 'legal-advocacy', role?: string) => void, jurisdiction?: string, setJurisdiction?: (s: string) => void }) => {
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
  const [broadcastSpeed, setBroadcastSpeed] = useState('fast');
  const [broadcastType, setBroadcastType] = useState('Urgent Alert (Red)');
  const [inTheKnowNews, setInTheKnowNews] = useState<string[]>([
    '🔴 BREAKING: DOJ Final Order — Medical Cannabis & FDA-Approved Products Moved to Schedule III (April 23, 2026)',
    '⚖️ DEA HEARING: Expedited administrative hearing on broader marijuana rescheduling begins JUNE 29, 2026',
    '🚨 OBNDD WARNING: Oklahoma Bureau of Narcotics urges licensed cannabis businesses to register with DEA — warns of possible license revocation for non-compliance',
    '⚠️ OMMA RESPONSE: Oklahoma Medical Marijuana Authority says OBNDD letter came as a surprise — unclear if feds will enforce DEA registration',
    '🚨 DEA: Synthetic cannabinoid HHC classified as illegal Schedule I substance — NOT legal hemp',
    '💰 280E TAX RELIEF: Schedule III status allows medical cannabis businesses to deduct normal business expenses',
    '📋 NORTH CAROLINA: Advisory Council recommends lawmakers establish regulated marijuana market',
    '🏛️ TEXAS: Judge issues temporary injunction allowing smokable hemp THCA flower sales through July 27',
    '🔬 UC SAN DIEGO STUDY: 24 million American adults report cannabis microdosing — published May 4, 2026',
    '📈 NABIS acquires New Jersey cannabis distribution license — positioning for interstate commerce',
    '⚠️ INDUSTRY ALERT: Operators report confusion over DEA registration paperwork requiring disclosure of past activity',
    '🌿 CALIFORNIA: Dept. of Cannabis Control streamlines license transition process for new federal landscape',
    '📊 GGP-OS PLATFORM: Sylara AI processed 50,000+ compliance checks this hour across 50 states',
  ]);
  const [marqueeSpeed, setMarqueeSpeed] = useState('medium');

  // Live Trust Counter State (scaling dynamically based on date + live increments)
  const [patientHelpCount, setPatientHelpCount] = useState(() => {
    const epoch = new Date('2026-01-01T00:00:00Z').getTime();
    const now = Date.now();
    const daysElapsed = (now - epoch) / (1000 * 60 * 60 * 24);
    return Math.floor(583000 + daysElapsed * 10);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const epoch = new Date('2026-01-01T00:00:00Z').getTime();
      const now = Date.now();
      const daysElapsed = (now - epoch) / (1000 * 60 * 60 * 24);
      setPatientHelpCount(Math.floor(583000 + daysElapsed * 10));
    }, 60000); // Update every minute to keep it aligned with the 10-per-day rate
    return () => clearInterval(timer);
  }, []);

  // OMMA Real-time Enforcement Tracker states
  const [ommaSearchQuery, setOmmaSearchQuery] = useState('');
  const [ommaSearchResults, setOmmaSearchResults] = useState<any[]>([]);
  const [ommaSearchLoading, setOmmaSearchLoading] = useState(false);
  const [recentEnforcements, setRecentEnforcements] = useState<any[]>([]);

  // Fetch recent enforcements on load
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await turso.execute('SELECT * FROM omma_enforcement_records ORDER BY created_at DESC LIMIT 3');
        setRecentEnforcements(res.rows);
      } catch (err) {
        console.error('Failed to fetch recent OMMA enforcements:', err);
      }
    };
    fetchRecent();
  }, []);

  // Real-time Search Handler
  const handleOmmaSearch = async (queryStr: string) => {
    setOmmaSearchQuery(queryStr);
    if (!queryStr.trim()) {
      setOmmaSearchResults([]);
      return;
    }
    setOmmaSearchLoading(true);
    try {
      const res = await turso.execute({
        sql: 'SELECT * FROM omma_enforcement_records WHERE business_name LIKE ? OR dba LIKE ? OR license_number LIKE ? LIMIT 10',
        args: [`%${queryStr}%`, `%${queryStr}%`, `%${queryStr}%`]
      });
      setOmmaSearchResults(res.rows);
    } catch (err) {
      console.error('OMMA Search Error:', err);
    } finally {
      setOmmaSearchLoading(false);
    }
  };

  useEffect(() => {
    const syncPlatformSettings = async () => {
      try {
        const res = await turso.execute('SELECT key, value FROM platform_settings');
        if (res.rows && res.rows.length > 0) {
          let customNews: string[] = [];
          res.rows.forEach((row: any) => {
            const val = row.value;
            if (row.key === 'gghp_platform_alert') {
              setBroadcastMsg(val);
            } else if (row.key === 'gghp_platform_alert_speed') {
              setBroadcastSpeed(val);
            } else if (row.key === 'gghp_platform_alert_type') {
              setBroadcastType(val);
            } else if (row.key === 'gghp_marquee_news') {
              if (val) {
                customNews = val.split('|').map((s: string) => s.trim()).filter(Boolean);
              }
            } else if (row.key === 'gghp_marquee_speed') {
              setMarqueeSpeed(val);
            }
          });
          if (customNews.length > 0) {
            setInTheKnowNews(customNews);
          }
        }
      } catch (err) {
        console.error('Failed to sync platform settings from Turso:', err);
      }
    };

    syncPlatformSettings();
    const interval = setInterval(syncPlatformSettings, 60000); // Scaled: 3s→60s for 100k+ user support
    return () => clearInterval(interval);
  }, []);

  const alertTypeStyles: Record<string, string> = {
    'Urgent Alert (Red)': 'bg-red-600 text-white border-b border-red-700',
    'Caution (Yellow)': 'bg-yellow-500 text-yellow-950 border-b border-yellow-600',
    'Warning (Orange)': 'bg-orange-500 text-white border-b border-orange-600',
    'Notice (Pink)': 'bg-pink-600 text-white border-b border-pink-700',
    'Info Ticker (Blue)': 'bg-blue-600 text-white border-b border-blue-700',
    'Special Announcement (Purple)': 'bg-purple-600 text-white border-b border-purple-700',
    'Info Ticker (Green)': 'bg-emerald-950 text-emerald-300 border-b border-emerald-900/30',
    'Success Blast (Emerald)': 'bg-emerald-600 text-white border-b border-emerald-700'
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* URGENT PLATFORM ALERT TICKER */}
      <div className={`${
        alertTypeStyles[broadcastType] || 'bg-red-600 text-white border-b border-red-700'
      } py-2 overflow-hidden whitespace-nowrap relative z-[60]`}>
        <div className={`inline-block animate-marquee-${broadcastSpeed} font-black text-sm uppercase tracking-widest`}>
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

        <div className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button onClick={() => onNavigate('products-services' as any)} className="hover:text-emerald-700 transition-colors font-bold text-emerald-800 flex items-center gap-1">
            <ShoppingCart size={14} /> Products & Services
          </button>
          <button onClick={() => onNavigate('support' as any)} className="hover:text-[#1a4731] transition-colors font-bold text-[#1a4731] flex items-center gap-1">
            <HelpCircle size={14} /> Resource Center
          </button>
          <button onClick={() => onNavigate('federal-state' as any)} className="hover:text-blue-600 transition-colors font-bold text-blue-800 flex items-center gap-1">
            <Scale size={14} /> Federal vs State
          </button>
          <button onClick={() => onNavigate('state-facts' as any)} className="hover:text-[#1a4731] transition-colors">State Facts & Polls</button>
          <button onClick={() => onNavigate('education' as any)} className="hover:text-[#1a4731] transition-colors">Education Academy</button>
          <button onClick={() => onNavigate('legal-advocacy' as any)} className="hover:text-amber-600 transition-colors font-bold text-amber-700 flex items-center gap-1">
            <Scale size={14} /> Legal Support
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <a href="sms:+16452468277" className="flex items-center gap-2 text-blue-600 font-bold">
            <MessageCircle size={14} /> 645-246-8277
          </a>
          <a href="tel:18889634447" className="flex items-center gap-2 text-[#1a4731] font-black">
            <Phone size={14} /> 1-888-963-4447
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => onNavigate('login')}>Portal Login</Button>
        </div>
      </nav>

      {/* "IN THE KNOW" NEWS TICKER */}
      <div className="bg-emerald-950 text-emerald-100 py-3 border-b border-emerald-900/20 overflow-hidden whitespace-nowrap relative z-40">
        <div className={`inline-block animate-marquee-${marqueeSpeed} font-bold text-xs uppercase tracking-[0.2em]`}>
          <span className="bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded text-[9px] mr-4">IN THE KNOW</span>
          {inTheKnowNews.join(' • ')} &nbsp; • &nbsp; {inTheKnowNews.join(' • ')}
        </div>
      </div>

      {/* Global State Jurisdiction Banner */}
      <div className="bg-slate-50 border-b border-slate-200 shadow-sm relative z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <StateWelcomeBanner jurisdiction={jurisdiction || 'Oklahoma'} type="business" />
        </div>
      </div>

      {/* ═══ SIMPLIFIED HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f14] via-[#0f2d1e] to-[#1a4731]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(16,185,129,0.3), transparent 70%)' }} />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20 pb-24 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-emerald-300 uppercase tracking-widest backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Infrastructure Active: 50 States + DC
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-emerald-400 font-black uppercase tracking-[0.2em] text-xs md:text-sm">Global Green Enterprise Inc <span className="text-white/60 mx-1">INTRODUCING</span></div>
            <div className="text-white font-black uppercase tracking-widest text-sm md:text-base border-y border-white/20 py-3 px-8 inline-block bg-white/5 backdrop-blur-sm shadow-xl rounded-2xl">
              The Gold Standard In Compliance Infrastructure
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            The Compliance Operating System<br />
            <span className="text-emerald-400">for Legal Cannabis</span>
          </h1>

          <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed font-medium">
            One platform. Every stakeholder. Full compliance.<br />
            Businesses, patients, attorneys, regulators, and law enforcement — all connected.
          </p>

          {/* ROLE SELECTOR BUTTONS */}
          <div className="pt-4">
            <p className="text-emerald-300/60 text-xs font-black uppercase tracking-[0.3em] mb-6">I am a...</p>
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              {[
                { label: 'Business', icon: '🏢', desc: 'Compliance & Licensing', tier: 'business' },
                { label: 'Patient', icon: '🏥', desc: 'Telehealth & Cards', tier: 'patient' },
                { label: 'Provider', icon: '🩺', desc: 'Consultations & Care', tier: 'provider' },
                { label: 'Attorney', icon: '⚖️', desc: 'Cases & Regulatory', tier: 'attorney' },
                { label: 'Agency', icon: '🛡️', desc: 'Oversight & Enforcement', tier: 'agency' },
                { label: 'Gov Office', icon: '🏛️', desc: 'Policy & Economy', tier: 'political_executive' },
                { label: 'Advocate', icon: '🤝', desc: 'Health & Impact', tier: 'advocacy_research' },
              ].map(role => (
                <button key={role.label} onClick={() => {
                    if (role.tier === 'patient') {
                      onNavigate('larry-chatbot' as any, 'ggma-patient');
                    } else if (role.tier === 'agency') {
                      onNavigate('larry-chatbot' as any, 'rip');
                    } else {
                      onNavigate('larry-chatbot' as any, role.tier);
                    }
                }} className="group bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 hover:border-emerald-400/50 hover:scale-[1.03] transition-all duration-300 w-36 sm:w-40 md:w-44 flex-shrink-0">
                  <div className="text-3xl mb-3">{role.icon}</div>
                  <div className="text-white font-black text-sm">{role.label}</div>
                  <div className="text-emerald-300/60 text-[10px] font-bold mt-1 uppercase tracking-wider">{role.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button onClick={() => onNavigate('larry-chatbot')} className="px-8 py-4 bg-emerald-500 text-[#0a1f14] rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-900/30 flex items-center gap-2">
              💬 Chat with Sylara AI
            </button>
          </div>
        </div>
      </section>

      {/* Regulatory Intelligence Feed Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <RegulatoryFeedWidget jurisdiction={jurisdiction} />
        </div>
      </section>
      {/* Community Voice / Polls Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
              🗳️ Community Voice & Insights
            </h3>
            <p className="text-sm text-slate-500 mt-1">Shape the future of ethical cannabis and check how your views align with our community</p>
          </div>
          <RevolvingSurveyBanner />
        </div>
      </section>

      {/* Partners & Paid Advertisements */}
      <section className="py-20 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-6">
           <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Strategic Infrastructure Partners & Sponsors</p>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {['LOT Network', 'SAM.gov', 'BidNet Direct', 'GoHealthUSA', 'OMMA', 'METRC'].map((p, i) => (
                <div key={i} className="flex items-center justify-center h-12 bg-transparent border border-transparent rounded-xl hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all font-black text-slate-900 text-sm italic">
                  {p}
                </div>
              ))}
           </div>
        </div>
      </section>

      
      {/* C3 Teaser Section */}
      <section style={{ background: 'linear-gradient(to bottom right, #0f172a, #064e3b)' }} className="py-20 px-6 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="md:w-2/3 space-y-6">
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
              ✨ The Industry's First Cannabis Credit Bureau
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Powered by the <span className="text-emerald-400">C³ Framework</span>
            </h2>
            <p className="text-lg text-emerald-50/80 leading-relaxed font-medium">
              C³ stands for **Compassion, Compliance & Community**. It is our proprietary real-time trust metric that quantifies ethical participation and regulatory adherence across the entire Global Green ecosystem.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('what-is-c3')}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl font-black transition-all shadow-lg"
              >
                Discover the C³ Framework
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-full aspect-square bg-white/5 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center p-8 text-center relative group">
              <div style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)' }} className="absolute inset-0 blur-[60px] rounded-full scale-50 group-hover:scale-75 transition-transform duration-1000 opacity-50"></div>
              <div className="text-7xl font-black text-emerald-400 tracking-tighter relative">C³</div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Wallet Teaser Section */}
      <section style={{ background: 'linear-gradient(to bottom right, #172554, #0f172a)' }} className="py-20 px-6 text-white relative overflow-hidden border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 relative z-10">
          <div className="md:w-2/3 space-y-6">
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-widest">
              <HeartHandshake size={14} /> Introduced by Compassion Network
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              The <span className="text-blue-400">Care Wallet</span> Ecosystem
            </h2>
            <p className="text-lg text-blue-50/80 leading-relaxed font-medium">
              Every dollar you load and spend securely tracks your compliance and earns you Care Points. Use it to pay for state fees, telehealth visits, and more, all while boosting your C³ Score.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('what-is-care-wallet')}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-black transition-all shadow-lg shadow-blue-500/20"
              >
                Explore the Care Wallet
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-full aspect-square bg-white/5 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center p-8 text-center relative group">
              <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }} className="absolute inset-0 blur-[60px] rounded-full scale-50 group-hover:scale-75 transition-transform duration-1000 opacity-50"></div>
              <Wallet size={80} className="text-blue-400 relative" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Highlights Section */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
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

          {/* High-Level Trust Badges */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
            {/* LOT Network Member Badge */}
            <a href="https://lotnet.com/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-white border-2 border-blue-100 hover:border-blue-300 rounded-2xl px-8 py-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <img src="https://lotnet.com/wp-content/uploads/2017/12/lotnetworkbadge-blue-130x130.png" alt="LOT Network Member" className="w-16 h-16 object-contain" />
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">LOT Network Member</p>
                <p className="text-[11px] text-slate-500 font-medium">Defensive Patent Protection — 6,000+ Members</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1">Protected against PAE litigation from 24.5% of all U.S. patents</p>
              </div>
            </a>

            {/* BBB A+ Rated Badge */}
            <a href="https://www.bbb.org/us/ok/oklahoma-city/profile/medical-marijuana-card/chronic-cardz-0995-90108724" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 bg-white border-2 border-[#163a5f] hover:border-[#1e5082] rounded-2xl px-8 py-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-16 h-16 flex items-center justify-center bg-[#163a5f] rounded-xl text-white font-black text-2xl tracking-tighter shadow-inner">BBB</div>
              <div className="text-left">
                <p className="text-sm font-black text-[#163a5f] group-hover:text-[#1e5082] transition-colors">A+ Rated Business</p>
                <p className="text-[11px] text-slate-500 font-medium">Better Business Bureau Since 2018</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">6+ Years of verified community trust</p>
              </div>
            </a>
          </div>

          {/* Founder Credentials + Company Stats */}
          <div className="grid grid-cols-1 max-w-4xl mx-auto gap-6 mb-12">
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
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Oklahoma certified — full production API access</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 relative z-10">
                <div className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest pl-1">Platform Affiliates</div>
                <div className="flex gap-2 flex-wrap">
                  {['Global Green Enterprise Inc', 'National Cannabis Association Group', 'CCardz', '@thebackoffice.com', 'Diversity Health and Wellness', 'Diversity Health Network', 'Omni Credit'].map((dba, i) => (
                    <span key={i} className={cn("px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-default", i === 0 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-white/5 text-emerald-100/70 border-white/10 hover:bg-white/10")}>
                      {dba}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Trust Partners Bar */}
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Integrated With &amp; Registered On</p>
            <div className="flex flex-wrap justify-center items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
              {['SAM.gov', 'OMES', 'Metrc', 'BidNet Direct', 'OKC City', 'OK ERP', 'Calendly', 'GoHealthUSA', 'LOT Network', 'BBB A+ Rated'].map((partner, i) => (
                <span key={i} className="text-xs font-black text-slate-500 uppercase tracking-wider px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </section>





      {/* ═══ PRODUCTS & SERVICES — Authorize.net Merchant Review Section ═══ */}
      {/* Products & Services section has been moved to its own dedicated page */}

      {/* Patient Success Stories (GGMA Sector Reviews) */}
      <section className="py-24 px-6 bg-white overflow-hidden border-t border-slate-200">
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
               { name: 'James C.', date: 'Aug 2024', text: 'She is real professional very helpful and really quick. She\'s also understanding she understood that my wife needed help so she did what she could to fill me in a spot immediately. Even though she was booked for the day, she still got my wife\'s medical just spoke to the doctor and waiting for my card now 5 stars.', rating: 5 },
               { name: 'Bobbie P.', date: 'Oct 2024', text: 'They were absolutely wonderful. Being a newly legal state, they were knowledgeable and informative. They were quick, courteous, professional and efficient. They handled everything! They cross the "T\'s" and dot the "i\'s", for you. Available at any time that I\'ve had a question. It was such a relief to have their help. 10/10 recommend!!!', rating: 5 },
               { name: 'Diana Faith D.', date: 'Jul 2024', text: 'I\'m more than grateful for the owner and her staff at Global Green. I have breast cancer and previously had access to medical marijuana until my move from a legalized state and moving to Oklahoma. The process to obtain a license is much harder and time consuming but the owner got the job done and very quickly I might add. I truly appreciate the ease, understanding, quality and professionalism from Global Green. I highly recommend using this service, you won\'t be sorry!!', rating: 5 }
             ].map((review, i) => (
               <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
                 <div className="flex gap-1 mb-4">
                   {Array.from({ length: review.rating }).map((_, j) => (
                     <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                   ))}
                 </div>
                 <p className="text-slate-700 font-medium mb-6 leading-relaxed italic line-clamp-6">"{review.text}"</p>
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

          {/* Live Trust Counter Banner */}
          <div className="mt-16 bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50 border border-emerald-100 rounded-3xl p-8 max-w-4xl mx-auto shadow-sm relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.03),transparent_70%)]" />
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Activity Network</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-y-3 font-bold text-slate-800 text-base md:text-xl leading-none">
                <span className="mr-2 font-black text-slate-700">We've helped</span>
                
                <div className="flex items-center">
                  {patientHelpCount.toLocaleString().split('').map((char, index) => {
                    if (char === ',') {
                      return (
                        <span key={index} className="text-2xl font-black text-emerald-600 px-1 select-none">
                          ,
                        </span>
                      );
                    }
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center justify-center w-7 h-9 md:w-8 md:h-10 bg-[#eff4f5] text-[#0a6d71] border border-[#d6e8e4] rounded-lg text-lg md:text-2xl font-black shadow-sm mx-0.5 select-none"
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
                
                <span className="ml-2 font-black text-slate-700">get their recommendation or get their business licenses nationwide</span>
              </div>

              <div className="mt-4 max-w-2xl">
                <p className="text-slate-500 font-bold text-[11px] md:text-xs leading-relaxed uppercase tracking-wider">
                  Since 2020 through our affiliate{' '}
                  <span className="text-emerald-800 font-black">Chronic Cardz (CCardz) Administrative Services</span>
                </p>
                <p className="text-slate-400 font-medium text-[9px] uppercase tracking-widest mt-1">
                  Secure Intake • State Regulatory Compliance • HIPAA Audited
                </p>
              </div>
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

          {/* Footer Trust Badges */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://lotnet.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <img src="https://lotnet.com/wp-content/uploads/2017/12/lotnetworkbadge-blue-65x65.png" alt="LOT Network Member" className="w-8 h-8 object-contain" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LOT Network Member</span>
            </a>
            <a href="https://www.bbb.org/us/ok/oklahoma-city/profile/medical-marijuana-card/chronic-cardz-0995-90108724" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 flex items-center justify-center bg-[#163a5f] rounded text-white font-black text-xs tracking-tighter">BBB</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A+ Rated</span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-[#1a4731] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Accessibility</a>
            <a href="tel:14054927297" className="hover:text-[#1a4731] transition-colors font-black"></a>
          </div>
        </div>
      </footer>


    </div>
  );
};


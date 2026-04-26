import React, { useState } from 'react';
import {
  Activity, Calendar, Stethoscope, Shield, FileText, Clock, Plus, LayoutDashboard, CreditCard,
  Wallet, Award, Search, FolderOpen, Heart, Bell, Sparkles, TrendingUp, Users, Briefcase, Lock, 
  ArrowRight, CheckCircle2, Zap, Brain, Video, Globe, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { StatCard } from '../components/StatCard';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { CareWalletTab } from '../components/shared/CareWalletTab';
import { ApplicationsTab } from '../components/patient/ApplicationsTab';
import { MyCardsTab } from '../components/patient/MyCardsTab';
import { CreditScoreTab } from '../components/patient/CreditScoreTab';
import { ProviderDirectoryTab } from '../components/patient/ProviderDirectoryTab';
import { AttorneyMarketplaceTab } from '../components/shared/AttorneyMarketplaceTab';
import { DocumentVaultTab } from '../components/patient/DocumentVaultTab';
import { ComplianceTravelTab } from '../components/patient/ComplianceTravelTab';

const Button = ({ children, className, disabled, ...props }: any) => (
  <button
    disabled={disabled}
    className={cn(
      "px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 active:scale-95",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const tabs = [
  { id: 'overview', label: 'Health Hub', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'travel', label: 'Travel & Reciprocity', icon: Globe },
  { id: 'telehealth', label: 'Telehealth', icon: Video },
  { id: 'cards', label: 'My Cards', icon: CreditCard },
  { id: 'wallet', label: 'Care Wallet', icon: Wallet },
  { id: 'c3score', label: 'C³ Score', icon: Award },
  { id: 'providers', label: 'Care Team', icon: Search },
  { id: 'attorneys', label: 'Legal Counsel', icon: Briefcase },
  { id: 'documents', label: 'Vault', icon: FolderOpen },
  { id: 'subscription', label: 'Membership', icon: Sparkles },
];

export const PatientDashboard = ({ user, onLogout, onSignup, onOpenConcierge, key }: { user?: any; onLogout?: () => void; onSignup?: () => void; onOpenConcierge?: () => void; key?: string }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoUnlocked, setDemoUnlocked] = useState(false); 
  const isSubscribed = user?.subscriptionStatus === 'Active' || user?.planId || demoUnlocked;
  const hasBasic = isSubscribed || user?.planId === 'b2c_basic';

  const ShadowOverlay = ({ title, description, moduleName }: { title: string, description: string, moduleName: string }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/40 backdrop-blur-md rounded-3xl overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-[#1a4731] mx-auto shadow-inner">
           <Lock size={36} />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
           <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-left">
           <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-[#1a4731] uppercase tracking-widest mb-1">Benefit</p>
              <p className="text-xs font-bold text-slate-600">Priority Access</p>
           </div>
           <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-[#1a4731] uppercase tracking-widest mb-1">Benefit</p>
              <p className="text-xs font-bold text-slate-600">AI Care Sync</p>
           </div>
        </div>

        <button 
           onClick={() => { setDemoUnlocked(true); setActiveTab('overview'); }} 
           className="w-full bg-[#1a4731] text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
        >
           Upgrade to Unlock {moduleName}
           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Education & Guidance via Sylara AI</p>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6 relative">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap bg-white rounded-2xl border border-slate-200 p-1 shadow-sm gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 relative whitespace-nowrap",
                activeTab === tab.id
                  ? tab.id === 'subscription' ? "bg-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md" : "bg-slate-100 text-[#1a4731]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                !isSubscribed && tab.id !== 'applications' && tab.id !== 'subscription' && "opacity-70"
              )}
            >
              <tab.icon size={16} />
              <span className="hidden lg:inline">{tab.label}</span>
              {!isSubscribed && tab.id !== 'applications' && tab.id !== 'subscription' && (
                <Lock size={10} className="text-slate-400" />
              )}
            </button>
          ))}
        </div>
        
        <div className="hidden xl:flex items-center gap-3">
           {onOpenConcierge && (
             <button onClick={onOpenConcierge} className="mr-2 flex items-center gap-2 px-4 py-2 bg-[#1a4731] text-white rounded-xl font-black shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#153a28] transition-all text-sm">
               <Sparkles size={16} className="text-emerald-300" /> Start New Action
             </button>
           )}
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
              <p className={cn("text-xs font-bold", isSubscribed ? "text-emerald-600" : "text-amber-500")}>
                 {isSubscribed ? 'Premium Member' : 'Basic (Limited)'}
              </p>
           </div>
           <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", isSubscribed ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-amber-50 border-amber-200 text-amber-500")}>
              {isSubscribed ? <Award size={20} /> : <Zap size={20} />}
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6 relative min-h-[600px]"
          >
            {!isSubscribed && (
              <ShadowOverlay 
                title="Your Health Intelligence" 
                description="The Health Hub provides real-time scoring, C³ compassion tracking, and instant medical card status. Upgrade to unlock the full patient dashboard." 
                moduleName="Health Hub"
              />
            )}
            
            <div className={cn("space-y-6 transition-all duration-500", !isSubscribed && "blur-sm pointer-events-none select-none grayscale-[0.5]")}>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Care Wallet" value="$198.50" trend={12} icon={Wallet} color="bg-[#1a4731]" />
                <StatCard label="Card Status" value="Active" icon={Shield} color="bg-emerald-600" />
                <StatCard label="C³ Score" value="662" trend={12} icon={Award} color="bg-yellow-600" />
                <StatCard label="Next Renewal" value="Jan 2028" icon={Calendar} color="bg-blue-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                       <Activity size={24} className="text-[#1a4731]" />
                       Recent Activity
                    </h3>
                    <button className="text-sm text-[#1a4731] font-bold hover:underline">View History</button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: 'Care Wallet Reload', date: '2 hours ago', type: 'Wallet', status: '+$200.00', statusColor: 'text-emerald-600' },
                      { title: 'Dispensary Purchase — Green Leaf', date: 'Yesterday', type: 'Care Wallet', status: '-$45.00', statusColor: 'text-slate-700' },
                      { title: 'Telehealth Visit — Dr. Johnson', date: '3 days ago', type: 'Telehealth', status: 'Completed', statusColor: 'text-emerald-600' },
                      { title: 'Blood Test Results', date: '1 week ago', type: 'Lab Report', status: 'Ready', statusColor: 'text-blue-600' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-500 group-hover:text-[#1a4731] transition-colors">
                            {item.type === 'Wallet' || item.type === 'Care Wallet' ? <Wallet size={20} /> :
                             item.type === 'Telehealth' ? <Stethoscope size={20} /> :
                             <FileText size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type} • {item.date}</p>
                          </div>
                        </div>
                        <span className={cn("text-sm font-black", item.statusColor)}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Dashboard Type Selector (Medical vs Telehealth) */}
                  <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/10">
                     <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Dashboard View</h4>
                     <div className="grid grid-cols-2 gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                        <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-xs font-black">
                           <Shield size={14}/> Medical
                        </button>
                        <button onClick={() => setActiveTab('telehealth')} className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-white/5 text-xs font-bold text-slate-400">
                           <Video size={14}/> Telehealth
                        </button>
                     </div>
                  </div>

                  {/* Sylara Widget */}
                  <div className="bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-[#0f291c] rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/20 border border-emerald-800/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-400/20 transition-all"></div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
                         <Brain size={24} />
                      </div>
                      <h4 className="font-black text-lg tracking-tight leading-none">Ask Sylara AI</h4>
                    </div>
                    <p className="text-sm text-emerald-100/80 mb-8 font-medium leading-relaxed relative z-10">
                      "I've analyzed your C³ score. Consistent reloading and health checkups could boost you to Platinum status by June."
                    </p>
                    <button className="w-full py-4 rounded-2xl bg-emerald-500 text-white text-sm font-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2">
                      Instant Consultation
                    </button>
                  </div>

                  {/* Upcoming Appt */}
                  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-4">Next Appointment</h3>
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 relative group cursor-pointer hover:bg-blue-100/50 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <p className="font-black text-blue-900">Dr. Sarah Johnson</p>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Telehealth</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-blue-800 font-bold">
                        <Clock size={14} className="text-blue-500" />
                        <span>Tomorrow • 09:30 AM</span>
                      </div>
                      <ArrowRight className="absolute bottom-4 right-4 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={16}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── APPLICATIONS TAB ─── */}
        {activeTab === 'applications' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
             <div className="bg-[#1a4731] rounded-[3rem] p-10 text-white relative overflow-hidden mb-8">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="max-w-xl relative z-10">
                   <h2 className="text-4xl font-black tracking-tight mb-4 leading-none">State Medical Card Application</h2>
                   <p className="text-emerald-100/80 font-medium text-lg leading-relaxed mb-8">Choose your path: Manual self-service for free, or let Sylara AI handle the entire regulatory process for you.</p>
                   <div className="flex items-center gap-6">
                      <div className="flex -space-x-3">
                         {[1,2,3].map(i => <img key={i} className="w-10 h-10 rounded-full border-2 border-[#1a4731]" src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} alt=""/>)}
                      </div>
                      <p className="text-xs font-bold text-emerald-200">Joined 12,402 patients this month</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                   <div className="w-16 h-16 bg-slate-100 text-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                      <FileText size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 mb-3">Manual Entry</h3>
                   <p className="text-slate-500 mb-10 flex-1 leading-relaxed">The traditional path. Manually upload documents, track state status, and resolve issues yourself. Perfect for simple renewals.</p>
                   <div className="bg-slate-50 px-5 py-2.5 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 w-fit">Standard Process</div>
                   <Button onClick={() => window.open('https://www.renewoklahomacard.com/', '_blank')} className="w-full bg-slate-900 text-white py-5 text-lg hover:bg-slate-800 transition-colors">Launch Self-Service</Button>
                </div>

                <div className="bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-[#0f291c] p-10 rounded-[3rem] border border-emerald-800/50 shadow-2xl flex flex-col relative overflow-hidden group">
                   {!hasBasic && <Lock className="absolute top-10 right-10 text-emerald-400/30" size={32} />}
                   <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-950/40 group-hover:scale-110 transition-transform">
                      <Sparkles size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-white mb-3">Sylara AI Assisted</h3>
                   <p className="text-emerald-100/80 mb-10 flex-1 leading-relaxed">Let our AI engine drive. Automated document verification, instant compliance flagging, and direct-to-state API submission.</p>
                   <div className="bg-emerald-500/20 border border-emerald-400/30 px-5 py-2.5 rounded-2xl text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6 w-fit">Recommended Path</div>
                   <Button 
                      onClick={() => hasBasic ? onOpenConcierge?.() : setActiveTab('subscription')} 
                      className="w-full bg-emerald-500 text-white py-5 text-lg hover:bg-emerald-400 transition-colors shadow-xl shadow-emerald-950/40"
                   >
                      {hasBasic ? 'Start AI Session' : 'Upgrade to Unlock Sylara'}
                   </Button>
                </div>
             </div>
             <ApplicationsTab user={user} />
          </motion.div>
        )}

        {/* ─── TRAVEL TAB ─── */}
        {activeTab === 'travel' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 relative min-h-[600px]">
             {!isSubscribed && (
               <ShadowOverlay 
                 title="Nationwide Travel Intel" 
                 description="Unlock real-time reciprocity data, legal travel safeguards, and state-specific permit applications." 
                 moduleName="Travel Hub"
               />
             )}
             <div className={cn("transition-all duration-500", !isSubscribed && "blur-md pointer-events-none")}>
                <ComplianceTravelTab />
             </div>
          </motion.div>
        )}

        {/* ─── TELEHEALTH TAB ─── */}
        {activeTab === 'telehealth' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 relative min-h-[600px]">
             {!isSubscribed && (
               <ShadowOverlay 
                 title="Virtual Care Network" 
                 description="Access 24/7 telehealth consultations with specialized medical providers. Instant referrals, digital prescriptions, and AI-assisted care planning." 
                 moduleName="Telehealth"
               />
             )}
             <div className={cn("space-y-6 transition-all duration-500", !isSubscribed && "blur-md pointer-events-none")}>
                <div className="bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-4 max-w-xl">
                      <h2 className="text-4xl font-black tracking-tight leading-none">Instant Virtual Care</h2>
                      <p className="text-blue-100 text-lg font-medium">Connect with a specialist in under 15 minutes. Secure, private, and fully integrated with your Care Wallet.</p>
                      <div className="flex gap-4 pt-4">
                         <button 
                           onClick={() => ((window as any).Calendly ? (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/shantell-ggma' }) : window.open('https://calendly.com/shantell-ggma', '_blank'))}
                           className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-900/20 hover:scale-105 transition-transform"
                         >
                           Book Now
                         </button>
                         <button 
                           onClick={() => setActiveTab('providers')}
                           className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-black border border-blue-400 hover:bg-blue-400 transition-colors"
                         >
                           View Network
                         </button>
                      </div>
                   </div>
                   <div className="w-48 h-48 bg-white/10 rounded-[3rem] flex items-center justify-center border border-white/20">
                      <Video size={80} className="text-blue-200" />
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-black mb-6">Upcoming Consultations</h3>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">SJ</div>
                            <div>
                               <p className="font-bold text-slate-900">Dr. Sarah Johnson</p>
                               <p className="text-xs text-slate-500">General Practice • Tomorrow 9:30 AM</p>
                            </div>
                         </div>
                         <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black">Join Call</button>
                      </div>
                   </div>
                   <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                      <h3 className="text-xl font-black mb-6">Medical History Access</h3>
                      <div className="space-y-3">
                         {[1,2].map(i => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200">
                               <span className="text-sm font-bold text-slate-700">Consultation Summary - Mar {12+i}, 2026</span>
                               <FileText size={18} className="text-slate-400" />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* ─── LOCKED TABS ─── */}
        {(activeTab === 'cards' || activeTab === 'wallet' || activeTab === 'c3score' || activeTab === 'providers' || activeTab === 'attorneys' || activeTab === 'documents') && !isSubscribed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-[600px]">
             <ShadowOverlay 
                title={`${tabs.find(t => t.id === activeTab)?.label} Locked`} 
                description={`Unlock the full potential of your ${tabs.find(t => t.id === activeTab)?.label} module with a premium membership. Get instant access to verified networks and secure data vaulting.`} 
                moduleName={tabs.find(t => t.id === activeTab)?.label || 'Module'}
             />
             <div className="blur-md pointer-events-none opacity-50 grayscale">
                <div className="bg-white rounded-3xl border border-slate-200 p-12 h-[500px]"></div>
             </div>
          </motion.div>
        )}

        {/* ─── MY CARDS TAB ─── */}
        {activeTab === 'cards' && isSubscribed && <MyCardsTab />}

        {/* ─── CARE WALLET TAB ─── */}
        {activeTab === 'wallet' && isSubscribed && <CareWalletTab userRole="patient" />}

        {/* ─── C³ SCORE TAB ─── */}
        {activeTab === 'c3score' && isSubscribed && <CreditScoreTab />}

        {/* ─── FIND PROVIDERS TAB ─── */}
        {activeTab === 'providers' && isSubscribed && <ProviderDirectoryTab />}

        {/* ─── FIND ATTORNEYS TAB ─── */}
        {activeTab === 'attorneys' && isSubscribed && (
          <div className="h-[800px] rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl">
            <AttorneyMarketplaceTab />
          </div>
        )}

        {/* ─── DOCUMENTS TAB ─── */}
        {activeTab === 'documents' && isSubscribed && <DocumentVaultTab />}

        {/* ─── SUBSCRIPTION TAB ─── */}
        {activeTab === 'subscription' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SubscriptionPortal userRole="user" initialPlanId="b2c_basic" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};





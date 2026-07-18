import React, { useState } from 'react';
import { PatientDashboard } from '../../pages/PatientDashboard';
import { BusinessDashboard } from '../../pages/BusinessDashboard';
import { ProviderDashboard } from '../../pages/ProviderDashboard';
import { AttorneyDashboard } from '../../pages/AttorneyDashboard';
import { StateAuthorityDashboard } from '../../pages/StateAuthorityDashboard';
import { FederalDashboard } from '../../pages/FederalDashboard';
import { EnforcementDashboard } from '../../pages/EnforcementDashboard';
import { BackOfficeDashboard } from '../../pages/BackOfficeDashboard';
import { EducationPortal } from '../../pages/EducationPortal';
import { sendSMS } from '../../lib/textbelt';
import { MonitorPlay, Building2, HeartPulse, ShieldAlert, Stethoscope, Scale, Gavel, Globe, Shield, PhoneCall, GraduationCap, Mail, MessageSquare, Copy, Send, Check, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';

export const InvestorSandboxTab = ({ isMaster = false }: { isMaster?: boolean }) => {
  const [activeMock, setActiveMock] = useState<'patient' | 'business' | 'provider' | 'attorney' | 'oversight' | 'federal' | 'enforcement' | 'back_office' | 'education' | 'none'>('none');
  const [recipientName, setRecipientName] = useState('Investor Partner');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const getSMSMessage = (name: string, link: string) => {
    return `Hi ${name}, here is your direct, password-free link to the GGHP-OS Platform Sandbox. Explore the Patient, Business, and Provider portals with SINC & IMMAD compliance: ${link}`;
  };

  const getEmailMessage = (name: string, link: string) => {
    return `Subject: Interactive GGHP-OS Platform Demo & Sandbox Link

Hi ${name},

Thank you for your interest in the Global Green Hybrid Platform (GGHP-OS).

As requested, here is your direct, password-free link to our interactive sandbox:
${link}

In this demo environment, you will find:
1. GGP Academy & Pitch Hub: Walk through our weekly roadmaps, patent registrations, and funding requests.
2. Business Portal: Explore daily pre-shift visual screening and SINC rapid testing logs.
3. Patient Portal: Perform camera-based driver safety self-checks.
4. Provider Network: View quantitative ocular response latencies and calibrate dosages.

Please let me know if you have any questions.

Best regards,
Shantell Robinson
Founder & CEO, Global Green Hybrid Platform`;
  };

  if (activeMock === 'education') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-emerald-950/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-emerald-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-emerald-400" /> INVESTOR DEMO: PRESENTATION & PITCH HUB</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-emerald-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <div className="pt-12 min-h-screen bg-slate-50">
          <EducationPortal onBack={() => setActiveMock('none')} />
        </div>
      </div>
    );
  }

  if (activeMock === 'patient') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-indigo-900/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-indigo-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-indigo-400" /> INVESTOR DEMO: PATIENT PORTAL</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-indigo-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <PatientDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'business') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-emerald-900/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-emerald-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-emerald-400" /> INVESTOR DEMO: BUSINESS PORTAL</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-emerald-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <BusinessDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'provider') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-blue-900/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-blue-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-blue-400" /> INVESTOR DEMO: HEALTHCARE PROVIDER</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-blue-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <ProviderDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'attorney') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-amber-900/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-amber-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-amber-400" /> INVESTOR DEMO: ATTORNEY PORTAL</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-amber-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <AttorneyDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'oversight') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-slate-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-slate-400" /> INVESTOR DEMO: REGULATORY OVERSIGHT</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-slate-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <StateAuthorityDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'federal') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-slate-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-slate-400" /> INVESTOR DEMO: FEDERAL COMMAND</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-slate-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <FederalDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'enforcement') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-slate-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-slate-400" /> INVESTOR DEMO: LAW ENFORCEMENT</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-slate-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <EnforcementDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  if (activeMock === 'back_office') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-100 overflow-y-auto">
        <div className="fixed top-2 left-1/2 -translate-x-1/2 bg-cyan-900/90 backdrop-blur-md text-white py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-4 shadow-xl z-[10000] border border-cyan-500/30">
          <span className="flex items-center gap-2"><MonitorPlay size={14} className="text-cyan-400" /> INVESTOR DEMO: BACK OFFICE</span>
          <div className="w-px h-3 bg-white/20"></div>
          <button onClick={() => setActiveMock('none')} className="hover:text-cyan-300 transition-colors">Exit Sandbox ✕</button>
        </div>
        <BackOfficeDashboard user={{ role: 'executive_founder', subscriptionStatus: 'Active', email: 'investor@globalgreenhp.com', planId: 'pro' }} onLogout={() => setActiveMock('none')} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><MonitorPlay size={160} /></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Investor Sandbox</h2>
            <p className="text-slate-400 font-medium">Safe environment loaded with mock data for investor pitches. Real production data is protected.</p>
         </div>
      </div>

      {isMaster && (
        <div className="bg-white rounded-[2.5rem] border border-emerald-900/20 shadow-md p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Send size={20} className="text-[#1a4731]" />
                Master Share Panel
              </h3>
              <p className="text-xs text-slate-500 mt-1">Send or copy demo sandboxes to investors and underwriters instantly.</p>
            </div>
            <span className="text-[10px] font-black text-[#1a4731] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">Master Access Only</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Recipient Name</label>
              <input 
                type="text" 
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-[#1a4731] outline-none" 
                placeholder="e.g. Denise Valenti" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Phone Number (SMS)</label>
              <input 
                type="text" 
                value={recipientPhone}
                onChange={e => setRecipientPhone(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-[#1a4731] outline-none" 
                placeholder="e.g. 4055551234" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Email Address</label>
              <input 
                type="text" 
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:border-[#1a4731] outline-none" 
                placeholder="e.g. investor@example.com" 
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/demo`);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all shadow-sm",
                copiedLink ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              {copiedLink ? "Link Copied!" : "Copy Demo Link"}
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(getSMSMessage(recipientName, `${window.location.origin}/demo`));
                setCopiedSMS(true);
                setTimeout(() => setCopiedSMS(false), 2000);
              }}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all shadow-sm",
                copiedSMS ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {copiedSMS ? <Check size={14} /> : <MessageSquare size={14} />}
              {copiedSMS ? "SMS Copied!" : "Copy SMS Pitch"}
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText(getEmailMessage(recipientName, `${window.location.origin}/demo`));
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
              }}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all shadow-sm",
                copiedEmail ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {copiedEmail ? <Check size={14} /> : <Mail size={14} />}
              {copiedEmail ? "Email Copied!" : "Copy Email Pitch"}
            </button>

            {recipientPhone && (
              <button 
                onClick={async () => {
                  setSmsSent(true);
                  const msg = getSMSMessage(recipientName, `${window.location.origin}/demo`);
                  const res = await sendSMS(recipientPhone, msg);
                  if (res.success) {
                    alert(`Demo link sent successfully to ${recipientPhone}!`);
                  } else {
                    alert(`Failed to send SMS: ${res.message || res.error}`);
                  }
                  setSmsSent(false);
                }}
                disabled={smsSent}
                className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
              >
                <Send size={14} />
                {smsSent ? "Sending..." : "Send SMS via Twilio"}
              </button>
            )}

            {recipientEmail && (
              <a 
                href={`mailto:${recipientEmail}?subject=Interactive%20GGHP-OS%20Platform%20Demo%20%26%20Sandbox%20Link&body=${encodeURIComponent(getEmailMessage(recipientName, `${window.location.origin}/demo`).split('\n\n').slice(1).join('\n\n'))}`}
                className="px-4 py-2.5 bg-[#1a4731] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#153a28] transition-all shadow-sm"
              >
                <Mail size={14} />
                Send Email (Mailto)
              </a>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveMock('education')}
          className="bg-[#0f291c] bg-gradient-to-br from-[#0f291c] to-[#1a4731] p-8 rounded-3xl border border-emerald-900/30 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all group text-left relative overflow-hidden flex flex-col text-white"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0 border border-emerald-500/30">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-xl font-black mb-2">Academy & Pitch Hub</h3>
          <p className="text-emerald-100/80 font-medium text-sm flex-1">Launch the interactive briefing deck, funding ask scenarios, 3-year vision roadmap, and intellectual property registries.</p>
          <div className="mt-8 flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest animate-pulse">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('patient')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <HeartPulse size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Patient Portal</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Launch the consumer-facing app loaded with mock wallet balances, test documents, and active prescriptions.</p>
          <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('business')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Business Portal</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Launch the commercial dashboard featuring simulated Metrc syncs, B2B transactions, and compliance flags.</p>
          <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('provider')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Stethoscope size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Provider Network</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Demo the healthcare physician portal with mock patient consultations and certification workflows.</p>
          <div className="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('attorney')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Scale size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Attorney Dashboard</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Showcase the legal services portal with mock pro-se filings and client communication logs.</p>
          <div className="mt-8 flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('oversight')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-800 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-slate-200 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Gavel size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Regulatory & Commerce Authority</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Present the full-state economic ecosystem dashboard — OMES/OMMA hierarchy, cross-agency coordination, supply chain tracking, economic impact, and compliance monitoring. Dynamic for all 50 states.</p>
          <div className="mt-8 flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('federal')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-500 transition-all group text-left relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Federal Command</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Launch the DOJ/DEA oversight mock dashboard with federal agency data flows.</p>
          <div className="mt-8 flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('enforcement')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-800 transition-all group text-left relative overflow-hidden flex flex-col lg:col-span-3"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-slate-200 text-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <Shield size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Law Enforcement</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Present the RIP Command dashboard with mock breathalyzer tests and field screening logs.</p>
          <div className="mt-8 flex items-center gap-2 text-slate-800 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>

        <button 
          onClick={() => setActiveMock('back_office')}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-400 transition-all group text-left relative overflow-hidden flex flex-col lg:col-span-3"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
          <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner shrink-0">
            <PhoneCall size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Back Office Operations</h3>
          <p className="text-slate-500 font-medium text-sm flex-1">Demo the internal backend operations, showing AI-driven support routing, ticketing, and scheduling.</p>
          <div className="mt-8 flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-widest">
            Launch Sandbox &rarr;
          </div>
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 mt-8">
        <ShieldAlert className="text-amber-500 shrink-0" size={24} />
        <div>
          <h4 className="font-black text-amber-900 mb-1">Production Isolation Active</h4>
          <p className="text-amber-800/80 text-sm font-medium">
            Any actions taken inside these sandbox portals (like creating transactions or accepting applications) will be reset when you exit. They will not affect the live production database on Monday.
          </p>
        </div>
      </div>
    </div>
  );
};

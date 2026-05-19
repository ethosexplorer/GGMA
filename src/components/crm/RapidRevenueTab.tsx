import React from 'react';
import { Calendar, CheckSquare, Target, Mail, PhoneCall, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RapidRevenueTab = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Target size={160} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">Active Sprint</span>
            <span className="bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/30">May 18, 2026 - Jun 15, 2026</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Realtime Daily Tasks</h2>
          <h3 className="text-2xl font-bold text-indigo-300 mb-4">GGP-OS: 30-Day "Rapid Revenue" Marketing Strategy</h3>
          <p className="text-slate-300 font-medium max-w-3xl leading-relaxed">
            Since the goal is to generate revenue and active onboarders <strong className="text-white">fast</strong>, we are utilizing a mixture of mass outreach via our CRM and high-touch Telephony calls.
            <br /><br />
            We are targeting the pain points of <strong className="text-white">compliance time, tax calculation errors, and patient lead generation</strong>. We will offer a <strong className="text-white">30-Day Free Trial</strong> to hook them, but we will strongly encourage an immediate <strong className="text-emerald-400">Paid Setup Fee ($299)</strong> to configure their state compliance and SMS integration, ensuring quick cash flow.
          </p>
        </div>
      </div>

      {/* Calendar Overview */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Calendar className="text-indigo-600" /> The 30-Day Calendar Overview
        </h3>
        <p className="text-sm font-bold text-slate-500 italic mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          *These tasks have already been injected into your UserCalendar.tsx dashboard.*
        </p>

        <div className="space-y-4">
          {[
            { date: 'May 18', title: 'Phase 1: Launch "Shock & Awe" Email Campaign to all imported leads.', status: 'active' },
            { date: 'May 20', title: 'Monitor initial trial signups and setup fee conversions.', status: 'upcoming' },
            { date: 'May 25', title: 'Phase 2: Send out the "Video Demo" follow-up email.', status: 'upcoming' },
            { date: 'June 1', title: 'Phase 3: Telephony VIP Outreach (Direct call blocks to large chains and attorneys).', status: 'upcoming' },
            { date: 'June 8', title: 'Phase 4: Final "Beta Pricing" FOMO push.', status: 'upcoming' },
            { date: 'June 15', title: 'Convert free trials to standard recurring billing.', status: 'upcoming' }
          ].map((item, i) => (
            <div key={i} className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all",
              item.status === 'active' ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100 hover:border-slate-300"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-sm text-center leading-tight",
                item.status === 'active' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-500"
              )}>
                {item.date.split(' ')[0]}<br/>{item.date.split(' ')[1]}
              </div>
              <div className="flex-1">
                <p className={cn("font-bold", item.status === 'active' ? "text-indigo-900" : "text-slate-700")}>{item.title}</p>
              </div>
              {item.status === 'active' && <div className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full">Starts Tomorrow</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Email Copy */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Mail className="text-indigo-600" /> Email & Flyer Copy (Phase 1)
        </h3>

        <div className="space-y-8">
          {/* Hook 1 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Hook 1</span>
              <h4 className="font-black text-slate-800">The Clinic / Practitioner Hook</h4>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 mb-4">
              <p className="text-sm"><strong className="text-slate-400 uppercase tracking-widest text-[10px] mr-2">Subject:</strong> <span className="font-bold text-slate-800">Double your patient intake without hiring more staff.</span></p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-sm text-slate-600 space-y-4">
              <p>Hi [Name],</p>
              <p>Most cannabis clinics in [State] are wasting 10+ hours a week on manual patient verifications, filing out state registry forms, and chasing down payments.</p>
              <p className="font-bold text-slate-800 text-base">GGP-OS is the operating system built specifically to automate your clinic.</p>
              <ul className="space-y-2 pl-4 border-l-2 border-indigo-200 ml-2">
                <li><strong className="text-slate-800">Automated SMS Reminders:</strong> Patients get texted a link to their forms.</li>
                <li><strong className="text-slate-800">State Registry Integration:</strong> Automatically match conditions to your state's active requirements.</li>
                <li><strong className="text-slate-800">Integrated Billing:</strong> Collect consultation fees before the patient even hits your Telehealth waiting room.</li>
              </ul>
              <p>We are onboarding our final batch of beta partners in [State]. Try GGP-OS free for 30 Days. If it doesn't save you time and increase your pipeline, walk away.</p>
              <p className="font-bold text-indigo-600"><a href="https://ggp-os.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Start Your Free Trial Now</a> | <a href="https://calendly.com/globalgreenhpmeet/gghp-demo" target="_blank" rel="noopener noreferrer" className="hover:underline">Book a 10-Min Demo</a></p>
            </div>
          </div>

          {/* Hook 2 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Hook 2</span>
              <h4 className="font-black text-slate-800">The Dispensary Hook (Dual-Use & Medical)</h4>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 mb-4">
              <p className="text-sm"><strong className="text-slate-400 uppercase tracking-widest text-[10px] mr-2">Subject:</strong> <span className="font-bold text-slate-800">Are you miscalculating state cannabis tax exemptions?</span></p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-sm text-slate-600 space-y-4">
              <p>Hi [Name],</p>
              <p>Depending on your state, miscalculating a medical patient's tax exemption at checkout can result in severe state penalties—or worse, a loss of your business license.</p>
              <p>GGP-OS takes the risk out of compliance. Our platform connects directly with state resources to ensure that every patient walking through your door is instantly verified for medical status, ensuring exact compliance with local tax code.</p>
              <ul className="space-y-2 pl-4 border-l-2 border-indigo-200 ml-2">
                <li><strong className="text-slate-800">Instant Verification:</strong> Don't guess if an out-of-state card is valid. We track state reciprocity laws in real-time.</li>
                <li><strong className="text-slate-800">Pipeline CRM:</strong> See exactly who your highest-value patients are.</li>
                <li><strong className="text-slate-800">Compliance Built-In:</strong> From METRC reporting to local authority requirements.</li>
              </ul>
              <p>We are helping dispensaries like yours automate compliance. Start a 30-Day Free Trial today and let our team handle your custom state configuration.</p>
              <p className="font-bold text-indigo-600"><a href="https://calendly.com/globalgreenhpmeet/gghp-demo" target="_blank" rel="noopener noreferrer" className="hover:underline">Claim Your Free Trial</a></p>
            </div>
          </div>

          {/* Hook 3 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Hook 3</span>
              <h4 className="font-black text-slate-800">The Attorney / Law Firm Hook</h4>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 mb-4">
              <p className="text-sm"><strong className="text-slate-400 uppercase tracking-widest text-[10px] mr-2">Subject:</strong> <span className="font-bold text-slate-800">Manage your clients' cannabis licensing & compliance from one dashboard.</span></p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 text-sm text-slate-600 space-y-4">
              <p>Hi [Name],</p>
              <p>As an attorney navigating the complex regulations of [State]'s cannabis program, managing permit renewals and METRC compliance for multiple clients is a massive administrative burden.</p>
              <p className="font-bold text-slate-800 text-base">GGP-OS gives your firm a centralized Command Center.</p>
              <p>Monitor your clients' regulatory standing, track changes in state and federal law, and automate document collection for licensing renewals all in one place.</p>
              <p>Let's schedule a 10-minute walk-through to show you how law firms are using GGP-OS to manage their cannabis portfolios.</p>
              <p className="font-bold text-indigo-600"><a href="https://calendly.com/globalgreenhpmeet/gghp-demo" target="_blank" rel="noopener noreferrer" className="hover:underline">Book a Walk-Through</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

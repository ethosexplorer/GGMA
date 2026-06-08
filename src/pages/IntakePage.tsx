import React, { useEffect } from 'react';
import { Leaf, ArrowLeft, Phone, Mail, Shield } from 'lucide-react';

/**
 * Public-facing GGP Intake Form Page
 * 
 * Embeds the JotForm intake form (261585644243057) so patients
 * can fill out their information before their appointment.
 * 
 * Accessible at: /intake  (no login required)
 * Direct link:   https://ggp-os.com/intake
 */
interface IntakePageProps {
  onBack?: () => void;
}

export default function IntakePage({ onBack }: IntakePageProps) {
  useEffect(() => {
    // Load JotForm embed handler for responsive sizing
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).jotformEmbedHandler) {
        (window as any).jotformEmbedHandler(
          "iframe[id='JotFormIFrame-261585644243057']",
          "https://form.jotform.com/"
        );
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a4731] via-emerald-800 to-[#1a4731] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors text-sm font-bold"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Leaf size={20} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest">GGP-OS Medical</p>
                <p className="text-[10px] text-emerald-200/70">ggp-os.com</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              GGP Intake Form
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Complete the form below to fast-track your appointment or registration. Your information will be 
              securely available to your assigned representative at the time of your visit — no paperwork needed.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-emerald-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
              <Shield size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-wide">HIPAA Secure</p>
              <p className="text-[10px] text-slate-500">Your data is encrypted & protected</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <Phone size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Call Center</p>
              <p className="text-[10px] text-slate-500">1-888-963-4447</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
              <Mail size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Email Support</p>
              <p className="text-[10px] text-slate-500">asstsupport@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded JotForm */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <iframe
            id="JotFormIFrame-261585644243057"
            title="GGP Intake"
            onLoad={() => window.parent.scrollTo(0, 0)}
            allowTransparency={true}
            allow="geolocation; microphone; camera; fullscreen; payment"
            src="https://form.jotform.com/261585644243057"
            frameBorder={0}
            style={{ minWidth: '100%', maxWidth: '100%', height: '700px', border: 'none' }}
            scrolling="no"
          />
        </div>
      </div>

      {/* Communication Standards & Policy */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a4731] to-emerald-800 px-6 py-4">
            <h2 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-emerald-300" />
              Communication Standards &amp; Policy
            </h2>
            <p className="text-emerald-200/80 text-xs mt-1">GGP-OS Professional Communication Guidelines</p>
          </div>
          <div className="p-6 space-y-5 text-sm text-slate-700 leading-relaxed">
            <p>
              In order to maintain a confidential, professional level of communication between GGP-OS and its clients, 
              the following standards will be followed in regard to text messaging and phone/email services. As our 
              team members spend the day working with clients and collaborating with outside service providers to deliver 
              comprehensive services, it is expected that mutual respect for response times is adhered to from all parties. 
              For this reason, text messaging, voicemail, and email should be limited to an "as needed" basis and used 
              in a manner that allows our team to respond in a reasonable time frame.
            </p>

            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-black text-lg mt-0.5">•</span>
                <p>Text messaging can be used to schedule, change, or cancel appointments. <span className="font-bold text-slate-800">(24-hour cancellation policy still applies, and the provider may charge for missed sessions and those not canceled prior to the 24-hour window)</span></p>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-black text-lg mt-0.5">•</span>
                <p>Text messages regarding setting up or changes to appointment times will be responded to within <span className="font-bold text-slate-800">24 business hours</span>. Please note our team is working with other clients throughout the day, so an immediate response is not to be expected.</p>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-black text-lg mt-0.5">•</span>
                <p>If urgent matters need to be discussed, call and leave a message. If a text message is sent regarding service-related issues, it will be discussed via phone or at your next scheduled meeting, at the representative's discretion based on urgency and availability.</p>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-black text-lg mt-0.5">•</span>
                <p>Phone calls will be limited to <span className="font-bold text-slate-800">10 minutes</span>, at the representative's discretion. If additional consultation time is needed, a scheduled billable session may be recommended.</p>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-black text-lg mt-0.5">•</span>
                <p>Emailing will be limited to making or changing appointment times and general inquiries. Note that this method of contact will be responded to within <span className="font-bold text-slate-800">48 business hours</span>. Detailed service consultations will not be addressed through email.</p>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                <span className="text-red-600 font-black text-lg mt-0.5">⚠</span>
                <p className="font-bold text-red-800">Text messaging SHOULD NOT be used if you are experiencing a medical emergency. Call 911.</p>
              </div>

              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-emerald-600 font-black text-lg mt-0.5">•</span>
                <p>This practice does not charge for text messaging services, but standard rates may apply as provided by your wireless plan. Contact your carrier for information on pricing plans and details regarding text messaging.</p>
              </div>

              <div className="flex gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-blue-600 font-black text-lg mt-0.5">•</span>
                <p>GGP-OS utilizes a secure Electronic Health Record and communication platform (<span className="font-bold text-blue-800">GGP-OS Medical</span>) which provides secure messaging for clients and providers. Clients may opt to use this service once they have set up and logged into their portal.</p>
              </div>
            </div>

            {/* HIPAA Compliance Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4">
              <p className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield size={14} className="text-emerald-600" />
                HIPAA Business Associate Addendum — Included Functionality
              </p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                As of July 21, 2020, the following functionality is included under the applicable HIPAA Business 
                Associate Addendum: Gmail, Calendar, Drive (including Docs, Sheets, Slides, and Forms), Apps Script, 
                Keep, Sites, Jamboard, Hangouts (chat messaging feature only), Google Chat, Google Meet, Google Voice 
                (managed users only), Google Cloud Search, Cloud Identity Management, Google Groups, Google Tasks, 
                and Vault (if applicable).
              </p>
            </div>

            {/* Contact Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-slate-500">
              <a href="https://ggp-os.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-600 transition-colors">https://ggp-os.com</a>
              <span>•</span>
              <span>1-888-963-GGHP (4447)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Leaf size={16} className="text-emerald-400" />
            <span className="font-black text-sm tracking-wide">Global Green Hybrid Platform</span>
          </div>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            GGP-OS is a HIPAA-compliant healthcare technology platform. All patient information
            is encrypted at rest and in transit. Your data will only be shared with your assigned provider.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
            <a href="https://ggp-os.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">ggp-os.com</a>
            <span>•</span>
            <span>1-888-963-4447</span>
            <span>•</span>
            <a href="https://www.renewoklahomacard.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">renewoklahomacard.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

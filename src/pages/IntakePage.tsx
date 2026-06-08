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



      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Leaf size={16} className="text-emerald-400" />
            <span className="font-black text-sm tracking-wide">Global Green Hybrid Platform</span>
          </div>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            GGP-OS is a secure, compliant technology platform. All information
            is encrypted at rest and in transit. Your data will only be shared with your assigned provider, agent, assistant or representative.
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

import React, { useState } from 'react';
import { Shield, Check, Mail, Lock, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export const RegistrationMockup = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-[#1a4731] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl"></div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
            <Shield size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-emerald-100/80 text-sm mt-2 font-medium">Join the Global Green Hybrid Platform (GGHP)</p>
        </div>

        <div className="p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium outline-none" 
                placeholder="john@example.com"
                defaultValue="doctor@clinic.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone size={16} />
              </div>
              <input 
                type="tel" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium outline-none" 
                placeholder="(555) 000-0000"
                defaultValue="(405) 555-0123"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium outline-none" 
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>
          </div>

          <div className="pt-2 pb-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div 
                className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-all ${
                  agreed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-300 text-transparent group-hover:border-emerald-400'
                }`}
                onClick={() => setAgreed(!agreed)}
              >
                <Check size={14} strokeWidth={3} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-700 select-none" onClick={() => setAgreed(!agreed)}>
                  I wish to receive account updates via SMS.
                </p>
                <p className="text-[11px] leading-relaxed text-slate-500 mt-1.5 select-none border-l-2 border-slate-200 pl-2">
                  By checking this box, you consent to receive 2FA codes and account notifications via SMS from Global Green Hybrid Platform (GGHP) to the provided mobile number. <strong className="text-slate-700">Message and data rates may apply. Reply STOP to opt out.</strong> Information is not shared or sold to third parties for marketing purposes. Read our <a href="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </label>
          </div>

          <button className="w-full py-4 rounded-xl bg-[#1a4731] hover:bg-[#123323] text-white font-black text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
            Create Account & Verify Phone
          </button>
        </div>
      </motion.div>
    </div>
  );
};

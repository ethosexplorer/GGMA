import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

export const ShadowOverlay = ({ title, description, moduleName, onUpgrade }: { title: string, description: string, moduleName: string, onUpgrade?: () => void }) => (
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
         onClick={onUpgrade} 
         className="w-full bg-[#1a4731] text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
      >
         Upgrade to Unlock {moduleName}
         <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Education & Guidance via Sylara AI</p>
    </motion.div>
  </div>
);

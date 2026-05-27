import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
export const SylaraFloatingWidget = ({ onClick, persona = 'sylara', userProfile, activeRole }: { onClick: () => void, persona?: 'sylara' | 'larry', userProfile?: any, activeRole?: string }) => {
  const currentRole = activeRole || userProfile?.role;
  const isRyan = currentRole === 'executive_founder' && userProfile && userProfile.email?.toLowerCase().includes('ceo.globalgreenhp');
  const isMonica = currentRole === 'executive_founder' && userProfile && (userProfile.email?.toLowerCase().includes('compliance.globalgreenhp') || userProfile.email?.toLowerCase().includes('monica'));
  const isFounderAssistant = currentRole === 'executive_founder' && userProfile && userProfile.role === 'executive_founder' && !isRyan && !isMonica;

  let title = persona === 'sylara' ? 'Sylara Intake Agent' : 'L.A.R.R.Y Enforcement Engine';
  let subtitle = persona === 'sylara' ? 'Personal Assistant' : 'Legal & Compliance AI';

  if (isRyan) {
    title = 'L.A.R.R.Y Chief of Operations';
    subtitle = 'Supreme Command AI';
  } else if (isMonica) {
    title = 'Sylara Compliance Director';
    subtitle = 'Compliance Assistant';
  } else if (isFounderAssistant) {
    title = 'Sylara Executive';
    subtitle = 'Personal Assistant';
  }

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <button 
        onClick={onClick}
        className={cn(
          "text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group border",
          persona === 'sylara' 
            ? "bg-purple-700 hover:bg-purple-800 border-purple-500/30" 
            : "bg-[#1a4731] hover:bg-[#133625] border-emerald-500/30"
        )}
      >
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner border border-white/20">
          <img src={persona === 'sylara' ? "/sylara-logo.svg" : "/larry-logo.png"} alt={persona} className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:block text-left pr-2">
          <div className="text-sm font-bold leading-tight">
            {title}
          </div>
          <div className="text-[11px] text-white/80">
            {subtitle}
          </div>
        </div>
      </button>
    </div>
  );
};

// --- Screens ---

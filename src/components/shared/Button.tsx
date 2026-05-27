import React from 'react';
import { cn } from '../../lib/utils';
export const Button = ({ children, variant = 'primary', className, icon: Icon, ...props }: any) => {
  const variants = {
    primary: "bg-[#1a4731] text-white hover:bg-[#153a28] shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    outline: "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    success: "bg-[#A3B18A] text-white hover:bg-[#8A9A73]"
  };

  return (
    <button
      {...props}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- Screens ---

// --- Dashboards ---

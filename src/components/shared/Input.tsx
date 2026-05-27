import React from 'react';
import { cn } from '../../lib/utils';
export const Input = ({ label, error, icon: Icon, rightElement, onClickIcon, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {rightElement}
      </div>
    )}
    <div className="relative">
      <input
        {...props}
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 transition-all",
          Icon && "pr-10",
          props.className
        )}
      />
      {Icon && (
        <div
          className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-slate-400", onClickIcon && "cursor-pointer hover:text-slate-600")}
          onClick={onClickIcon}
        >
          <Icon size={18} />
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

import React from 'react';
import { Sparkles, Brain, Phone, Calendar, Play, ArrowRight, Zap, Target } from 'lucide-react';

export const RapidRevenueTab = () => {
  const handleNavigateToSylara = () => {
    // Navigate to 'ai_training' which is labeled "My Asst AI" (Sylara Assistant)
    window.dispatchEvent(new CustomEvent('gghp-navigate', { detail: { tab: 'ai_training' } }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      
      {/* Premium Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20 mb-8">
        <div className="absolute -top-12 -right-12 p-8 opacity-5 text-indigo-400">
          <Target size={240} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-500/30">
              Workspace Update
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">
              Co-Working Active
            </span>
          </div>
          
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
            Consolidated Daily Ops Console
          </h2>
          <h3 className="text-xl font-bold text-indigo-300">
            Realtime Tasks & Dialer Migrated to Sylara Workspace
          </h3>
          <p className="text-slate-300 font-medium max-w-2xl leading-relaxed text-sm">
            To create an elite, unified operating environment, your Daily Checklist, Dialer Control Panel, and Campaign Execution triggers have been integrated directly next to <strong className="text-white">Sylara AI</strong>. You can now talk to your personal assistant and manage tasks in the exact same workspace.
          </p>

          <div className="pt-4">
            <button 
              onClick={handleNavigateToSylara}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-102 flex items-center gap-2 border-none cursor-pointer shadow-lg shadow-indigo-950/50"
            >
              Enter Sylara Workspace <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Spotlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Brain size={20} />
          </div>
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Dynamic Checklist Sync</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Write events or appointments on your Operations Calendar, and they will show up instantly on your workspace task list. Add, edit, soft-delete, and reassign tasks directly in the workspace.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Phone size={20} />
          </div>
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Embedded Dialer Center</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            A dedicated line control widget is built directly below your tasks. Toggle online/offline status, view line states, and call contacts from your daily task list in one click.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Play size={20} />
          </div>
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">One-Click Campaign Send</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            When daily Resend limits pause a broadcast, Sylara schedules a resume task for the next day. Click "Resume Send" directly from the task card to trigger the next batch in one click.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles size={20} />
          </div>
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Human-Like AI Chat</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Instruct Sylara, dictate call notes, or request a complete daily briefing. Speak to her all day using natural voice dictation while reviewing your tasks on the same screen.
          </p>
        </div>

      </div>

    </div>
  );
};

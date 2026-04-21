import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, Clock, ShieldCheck, AlertCircle, 
  ChevronRight, Terminal, Radio 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { EventStream, ComplianceEvent } from '../../lib/compliance/EventStream';

export const LiveEventStream: React.FC = () => {
  const [events, setEvents] = useState<ComplianceEvent[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const fetchEvents = async () => {
      const newEvents = await EventStream.getLiveFeed();
      setEvents(newEvents);
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Radio className={cn("text-emerald-500", isLive && "animate-pulse")} size={20} />
             {isLive && <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>}
          </div>
          <div>
            <h3 className="text-white font-black text-sm tracking-tight">Compliance Event Stream</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real-time Kafka Feed Simulator</p>
          </div>
        </div>
        <button 
          onClick={() => setIsLive(!isLive)}
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            isLive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
          )}
        >
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Event Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px] hide-scrollbar">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
            <Terminal size={32} className="mb-2 opacity-20" />
            Waiting for events...
          </div>
        ) : (
          events.map((event, i) => (
            <div 
              key={event.id} 
              className={cn(
                "p-3 rounded-xl border border-slate-800 bg-slate-900/40 transition-all hover:bg-slate-800/60 group",
                i === 0 && "border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/5"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    event.severity === 'high' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : 
                    event.severity === 'medium' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : 
                    "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  )} />
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{event.type}</span>
                </div>
                <span className="text-[9px] text-slate-600 flex items-center gap-1">
                  <Clock size={10} /> {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                <ChevronRight className="inline-block text-slate-700 mr-1" size={12} />
                {event.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Footer / Status */}
      <div className="p-3 border-t border-slate-800 bg-black/20 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1">
              <Zap size={12} className="text-blue-400" />
              <span className="text-[9px] font-black text-slate-500">LATENCY: 42ms</span>
           </div>
           <div className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-[9px] font-black text-slate-500">INTEGRITY: 100%</span>
           </div>
        </div>
        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">GGP-SECURE FEED</span>
      </div>
    </div>
  );
};

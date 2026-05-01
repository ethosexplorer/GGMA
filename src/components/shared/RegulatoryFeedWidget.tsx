import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { fetchRegulatoryFeed, formatFeedDate, type RegulatoryUpdate } from '../lib/regulatoryFeed';

export const RegulatoryFeedWidget = ({ jurisdiction, compact = false }: { jurisdiction?: string, compact?: boolean }) => {
  const [feed, setFeed] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRegulatoryFeed(compact ? 3 : 5, jurisdiction)
      .then(items => { setFeed(items); setLoading(false); })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetchRegulatoryFeed(compact ? 3 : 5, jurisdiction).then(items => setFeed(items));
    }, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [jurisdiction, compact]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          {jurisdiction ? `${jurisdiction} Regulatory Intel` : 'Cannabis Law Updates'}
        </h3>
        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
          <AlertCircle size={10} /> Live
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-bold">Loading feed...</span>
          </div>
        ) : feed.length > 0 ? (
          feed.map((item, idx) => (
            <div key={idx} className="group cursor-pointer" onClick={() => window.open(item.link, '_blank')}>
              {idx > 0 && <div className="w-full h-px bg-slate-100 mb-4" />}
              <div className="flex items-center gap-2 mb-1">
                {item.isBreaking && (
                  <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Breaking</span>
                )}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatFeedDate(item.pubDate)}</p>
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug">{item.title}</h4>
              {!compact && <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.description}</p>}
            </div>
          ))
        ) : (
          <div className="group">
            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">Breaking</span>
            <h4 className="text-sm font-bold text-slate-800 mt-2">Cannabis Rescheduled: Schedule I → Schedule III</h4>
            <p className="text-xs text-slate-500 mt-1">DEA registration tracking, 280E tax deductions, and banking access modules now active.</p>
          </div>
        )}
      </div>
      <p className="text-[9px] text-slate-400 text-center mt-4 pt-3 border-t border-slate-100">
        Source: <a href="https://www.marijuanamoment.net" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Marijuana Moment</a> • Auto-updates
      </p>
    </div>
  );
};

import React from 'react';
import { ExternalLink, BookOpen, Shield, Globe, Newspaper, Search } from 'lucide-react';
import { INTELLIGENCE_RESOURCES } from '../../lib/intelligenceSources';

export const LegislativeIntelTab = () => {
  const categories = Array.from(new Set(INTELLIGENCE_RESOURCES.map(r => r.category)));

  const getIcon = (category: string) => {
    switch (category) {
      case 'Federal': return <Shield size={18} className="text-blue-400" />;
      case 'State': return <Globe size={18} className="text-emerald-400" />;
      case 'Policy': return <BookOpen size={18} className="text-amber-400" />;
      case 'News': return <Newspaper size={18} className="text-purple-400" />;
      case 'Research': return <Search size={18} className="text-indigo-400" />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-white tracking-tight">Legislative Intelligence Command</h2>
        <p className="text-blue-300/60 text-sm max-w-2xl font-medium">
          Curated primary sources, federal directives, and real-time state legislative tracking to maintain a 100% accurate regulatory footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTELLIGENCE_RESOURCES.map((source, i) => (
          <a
            key={i}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 bg-[#0b1525] border border-[#1e3a5f]/40 rounded-2xl hover:bg-[#111f36] hover:border-blue-500/50 transition-all duration-300 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="p-3 bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                {getIcon(source.category)}
              </div>
              <ExternalLink size={14} className="text-blue-300/20 group-hover:text-blue-400 transition-colors" />
            </div>
            
            <div>
              <div className="text-[10px] font-black text-blue-400/50 uppercase tracking-[0.2em] mb-1">
                {source.category} Source
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                {source.title}
              </h3>
              <p className="text-xs text-blue-300/40 mt-2 line-clamp-2 leading-relaxed">
                {source.description}
              </p>
            </div>

            <div className="mt-2 pt-4 border-t border-[#1e3a5f]/20 flex items-center justify-between">
               <span className="text-[10px] font-bold text-blue-300/30 uppercase tracking-widest">Verify Primary Link</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </a>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-br from-[#0b1525] to-[#0a1628] rounded-[2rem] border border-[#1e3a5f]/40 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={120} className="text-blue-400" />
         </div>
         <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Automated Legislative Tracking</h3>
            <p className="text-blue-300/50 text-sm max-w-xl">
               Your GGP-OS infrastructure is integrated with these sources. Changes in state statutes or federal directives are automatically processed by Sylara AI to suggest updates to your compliance framework.
            </p>
         </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, Send, Globe, TrendingUp, Shield, FileText, Zap, Bot, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateGeminiResponse } from '../../lib/gemini';

const sampleQueries = [
  'What are the top national diversion risks this quarter?',
  'Model the tax impact of Schedule III implementation',
  'Which states show highest Recency Index volatility?',
  'Generate congressional briefing for Q1 2026',
];

export const SylaraFederalTab = () => {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', text: 'I am Sylara, your Federal Intelligence Co-Pilot. How can I assist you with national compliance analytics today?' }
  ]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userText = text;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const response = await generateGeminiResponse(userText, 'general', chatHistory.slice(-5));
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', text: '[AI Offline] Cannot reach the intelligence grid. Verify your VITE_GEMINI_API_KEY.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sylara Header */}
      <div className="bg-[#0f1b2d] bg-gradient-to-r from-[#0f1b2d] via-[#1a2d4a] to-[#0f1b2d] rounded-2xl border border-blue-500/30 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5"><Sparkles size={200} /></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white"><Sparkles size={20} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Sylara AI — Federal Intelligence Co-Pilot</h3>
              <p className="text-xs text-blue-300/60">National strategic intelligence • Policy guidance • Predictive analytics</p>
            </div>
          </div>
          <p className="text-sm text-blue-200/70 mt-3 max-w-3xl">Sylara for Federal serves as your national strategic intelligence co-pilot — helping agencies navigate the complex federal-state cannabis landscape with predictive forecasting, policy scenario modeling, and cross-jurisdictional risk mapping.</p>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, title: 'Predictive Trend Forecasting', desc: 'Analyzes aggregated data to predict compliance shifts, market trends, diversion risks, and economic impacts nationally.' },
          { icon: Zap, title: 'Policy Scenario Modeling', desc: 'Simulates outcomes of federal actions — rescheduling effects on interstate commerce, research, and tax revenue.' },
          { icon: Globe, title: 'Cross-Jurisdictional Risk Mapping', desc: 'Identifies federal concerns like interstate diversion or scheduling conflicts using anonymized state-level data.' },
          { icon: Shield, title: 'Resource Optimization', desc: 'Recommends federal priority areas for investigations or coordination with state partners.' },
          { icon: FileText, title: 'Audit-Ready Summaries', desc: 'Generates explainable reports with transparent data sources for congressional or inter-agency use.' },
          { icon: Sparkles, title: 'Larry Integration', desc: 'Sylara insights feed directly into Larry monitoring — creating a closed federal oversight loop.' },
        ].map((c, i) => (
          <div key={i} className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-5">
            <div className="p-2 rounded-xl bg-blue-900 text-blue-300 w-fit mb-3"><c.icon size={18} /></div>
            <h4 className="text-sm font-bold text-white mb-1">{c.title}</h4>
            <p className="text-xs text-blue-300/50 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Active AI Terminal */}
      <div className="bg-[#0f1b2d] rounded-2xl border border-[#1e3a5f]/60 p-6 flex flex-col h-[600px]">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bot className="text-blue-400" size={20} /> Live Intelligence Terminal</h3>
        
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
          {chatHistory.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-xl bg-blue-900 text-blue-300 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
              )}
              <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed", 
                msg.role === 'user' ? "bg-blue-600 text-white" : "bg-[#0a1628] border border-[#1e3a5f]/40 text-blue-100"
              )}>
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  FA
                </div>
              )}
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-900 text-blue-300 flex items-center justify-center shrink-0">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="bg-[#0a1628] border border-[#1e3a5f]/40 text-blue-100 rounded-2xl px-4 py-3 text-sm">
                  Analyzing federal vectors...
                </div>
             </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {sampleQueries.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)} disabled={isTyping}
              className="text-[10px] font-bold text-blue-300/60 bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-800/30 hover:bg-blue-800/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {q}
            </button>
          ))}
        </div>

        <div className="relative mt-auto shrink-0">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(query)}
            disabled={isTyping}
            placeholder="Ask Sylara a custom query..."
            className="w-full bg-[#0a1628] border border-[#1e3a5f]/60 text-white placeholder:text-blue-400/30 text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500/60 transition-all disabled:opacity-50" />
          <button onClick={() => handleSend(query)} disabled={isTyping || !query.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"><Send size={18} /></button>
        </div>
      </div>
    </div>
  );
};


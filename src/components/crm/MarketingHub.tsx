import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Users, Filter, BarChart2, Activity, MapPin, Building2, LayoutTemplate, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms';
  status: 'draft' | 'scheduled' | 'sent';
  audienceSize: number;
  sentDate?: string;
  openRate?: number;
  clickRate?: number;
}

export const MarketingHub = () => {
  const [activeTab, setActiveTab] = useState<'composer' | 'campaigns' | 'analytics'>('composer');
  const [campaignType, setCampaignType] = useState<'email' | 'sms'>('email');
  
  // Composer State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  
  // Audience Data
  const [totalLeads, setTotalLeads] = useState(0);
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  
  // UI State
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Load CRM Audience Data
  useEffect(() => {
    const q = query(collection(db, 'crm_deals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => doc.data());
      setTotalLeads(deals.length);
      
      const states = Array.from(new Set(deals.map(d => d.jurisdiction).filter(Boolean))) as string[];
      setJurisdictions(states.sort());
      
      const types = Array.from(new Set(deals.map(d => d.type).filter(Boolean))) as string[];
      setBusinessTypes(types.sort());
      
      // Calculate filtered audience
      const filtered = deals.filter(d => {
        const matchesState = selectedState === 'All' || d.jurisdiction === selectedState;
        const matchesType = selectedType === 'All' || d.type === selectedType;
        return matchesState && matchesType;
      });
      setFilteredCount(filtered.length);
    });
    return () => unsubscribe();
  }, [selectedState, selectedType]);

  const handleSend = () => {
    if (!subject && campaignType === 'email') return alert('Please enter a subject');
    if (!message) return alert('Please enter a message');
    if (filteredCount === 0) return alert('No audience selected');

    setIsSending(true);
    // Simulate send delay
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSendSuccess(false);
        setSubject('');
        setMessage('');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <div className="px-10 py-8 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl shrink-0">
        <div className="flex items-end justify-between max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Send className="text-indigo-400 w-5 h-5" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white">Marketing Hub</h1>
            </div>
            <p className="text-slate-400 font-medium">Broadcast targeted email and SMS campaigns to your CRM pipeline.</p>
          </div>
          
          {/* Top Metrics */}
          <div className="flex gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Total Reachable</p>
              <p className="text-2xl font-black text-white">{totalLeads.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Active Campaigns</p>
              <p className="text-2xl font-black text-indigo-400">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Composer */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Type Selector */}
            <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex gap-2 backdrop-blur-md">
              <button 
                onClick={() => setCampaignType('email')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all duration-300",
                  campaignType === 'email' 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Mail size={18} /> Email Blast
              </button>
              <button 
                onClick={() => setCampaignType('sms')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all duration-300",
                  campaignType === 'sms' 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <MessageSquare size={18} /> SMS Push
              </button>
            </div>

            {/* Composer Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                {campaignType === 'email' ? <Mail size={200} /> : <MessageSquare size={200} />}
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <h2 className="text-xl font-black text-white">Compose {campaignType === 'email' ? 'Email' : 'SMS'}</h2>
                  <button className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-400/10 px-4 py-2 rounded-lg">
                    <LayoutTemplate size={14} /> Use Template
                  </button>
                </div>

                {campaignType === 'email' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Line</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter a compelling subject line..."
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Body</label>
                    {campaignType === 'sms' && (
                      <span className="text-[10px] font-bold text-slate-500">{message.length} / 160 chars</span>
                    )}
                  </div>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={campaignType === 'email' ? "Write your HTML or plain text email here..." : "Type your SMS message..."}
                    className={cn(
                      "w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium resize-none",
                      campaignType === 'email' ? 'h-64' : 'h-32'
                    )}
                  />
                  {campaignType === 'sms' && message.length > 160 && (
                    <p className="text-[10px] text-amber-400 mt-2 font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> Message exceeds 160 characters and may be split into multiple texts.
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button 
                    onClick={handleSend}
                    disabled={isSending || filteredCount === 0}
                    className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300",
                      sendSuccess 
                        ? "bg-emerald-500 text-white" 
                        : isSending || filteredCount === 0
                          ? "bg-white/10 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                    )}
                  >
                    {sendSuccess ? 'Sent Successfully!' : isSending ? 'Sending...' : 'Launch Campaign'}
                    {!sendSuccess && !isSending && <Send size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Audience Selection */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 shadow-xl">
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <Users className="text-indigo-400" /> Target Audience
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MapPin size={12} /> Jurisdiction
                  </label>
                  <select 
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors font-medium appearance-none"
                  >
                    <option value="All">All States (National)</option>
                    {jurisdictions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Building2 size={12} /> Business Type
                  </label>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors font-medium appearance-none capitalize"
                  >
                    <option value="All">All Types</option>
                    {businessTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                  <div className="bg-indigo-950/50 border border-indigo-500/20 rounded-2xl p-6 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Estimated Recipients</p>
                    <p className="text-5xl font-black text-white mb-1">{filteredCount.toLocaleString()}</p>
                    <p className="text-xs text-indigo-300/70 font-medium">Matching your CRM filters</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign History Widget */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock className="text-slate-400" size={16} /> Recent Blasts
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: "Q1 B2B Promo", type: "email", sent: "2 hrs ago", reach: 1240 },
                  { name: "OK License Renewal", type: "sms", sent: "Yesterday", reach: 850 },
                  { name: "Founder Welcome", type: "email", sent: "Mar 10", reach: 3100 }
                ].map((camp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", camp.type === 'email' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400')}>
                        {camp.type === 'email' ? <Mail size={14} /> : <MessageSquare size={14} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{camp.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{camp.sent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-300">{camp.reach}</p>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500">Sent</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                View All Analytics →
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

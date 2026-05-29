import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Phone, Mail, MessageSquare, HelpCircle, Send, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SupportPage = ({ onNavigate }: { onNavigate: (view: 'landing') => void }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [expandedFaqCard, setExpandedFaqCard] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([{
    role: 'bot',
    text: 'Hi there! I am the GGMA Support Assistant. How can I help you regarding cannabis regulations or app support?'
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{title: string, snippet: string, pageid: number}[]>([]);
  const [viewedArticle, setViewedArticle] = useState<{title: string, content: string} | null>(null);

  const faqs = [
    { q: "How do I check my application status?", a: 'You can view your real-time application status by navigating to the "Applications" tab in your portal dashboard. Status updates are polled directly from the state database.' },
    { q: "Is my health and personal information secure?", a: 'Yes, we use end-to-end encryption and comply with all regulatory standards to ensure your data is secure.' },
    { q: "How do I verify a patient's digital card?", a: 'Use the QR code scanner in the mobile app, or enter the card number in the verification portal.' },
    { q: "What formats are allowed for document uploads?", a: 'We accept PDF, JPG, and PNG formats. File size must not exceed 10MB.' },
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setViewedArticle(null);
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Cannabis+${encodeURIComponent(searchQuery)}&utf8=&format=json&origin=*`);
      const data = await res.json();
      setSearchResults(data.query?.search || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewArticle = async (pageid: number, title: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageid}&format=json&origin=*`);
      const data = await res.json();
      const page = data.query.pages[pageid];
      setViewedArticle({ title: page.title, content: page.extract });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearArticleView = () => setViewedArticle(null);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `Thank you for asking about "${userMsg}". Our compliance agents are currently reviewing all states. If you need immediate assistance with licensing in your jurisdiction, please call us at 1-888-963-4447.`
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support Portal Active</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left / Middle: Search and FAQs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Card */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle size={100} className="text-emerald-400" /></div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              GGMA Help & Support
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Access real-time regulatory information, look up state cannabis rules, or consult with our automated support agent for immediate guidance on licensing and compliance.
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-[2rem] space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">Search Regulatory Knowledge</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search cannabis rules, license requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-wider"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Viewed Article Detail */}
            {viewedArticle && (
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl relative">
                <button 
                  onClick={clearArticleView}
                  className="absolute top-4 right-4 text-xs font-bold text-slate-500 hover:text-white"
                >
                  ✕ Close
                </button>
                <h3 className="text-md font-bold text-emerald-400 mb-2">{viewedArticle.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed max-h-60 overflow-y-auto pr-2">
                  {viewedArticle.content}
                </p>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && !viewedArticle && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search Results</h3>
                <div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
                  {searchResults.map((result) => (
                    <div 
                      key={result.pageid} 
                      onClick={() => handleViewArticle(result.pageid, result.title)}
                      className="p-4 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700 border border-slate-800/80 rounded-xl cursor-pointer transition-all"
                    >
                      <h4 className="text-xs font-bold text-slate-200 hover:text-emerald-400 flex items-center justify-between">
                        {result.title}
                        <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-bold">View Article</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1" dangerouslySetInnerHTML={{ __html: result.snippet + '...' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">Frequently Asked Questions</h2>
            <div className="grid gap-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-800/60 bg-slate-900/30 rounded-2xl overflow-hidden transition-all"
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 text-left"
                  >
                    <span className="text-sm font-bold text-slate-200">{faq.q}</span>
                    <ChevronDown 
                      size={16} 
                      className={cn("text-slate-400 transition-transform duration-300", activeFaq === idx && "rotate-180")} 
                    />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-4 pt-1 border-t border-slate-800/40 text-xs text-slate-400 leading-relaxed bg-slate-950/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Chatbot & Direct Support */}
        <div className="space-y-8">
          
          {/* Support Contacts Card */}
          <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-[2rem] space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-200">Direct Support</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you need immediate legal, compliance, or patient account assistance, contact us directly:
            </p>
            <div className="space-y-3">
              <a href="tel:18889634447" className="flex items-center gap-3 p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Phone size={16} /></div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Toll-Free Support</div>
                  <div className="text-xs font-black text-slate-200">1-888-963-4447</div>
                </div>
              </a>
              <a href="mailto:support@globalgreenhp.com" className="flex items-center gap-3 p-3 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Mail size={16} /></div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Email Support</div>
                  <div className="text-xs font-black text-slate-200">support@globalgreenhp.com</div>
                </div>
              </a>
            </div>
          </div>

          {/* AI Chatbot Assistant */}
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-[2rem] overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Sylara AI Assistant</h3>
                  <p className="text-[9px] text-slate-500">Online & Ready</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[350px]">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-emerald-600/90 text-white rounded-br-none self-end ml-auto" 
                      : "bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none self-start"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-slate-950 border border-slate-800 text-slate-500 rounded-2xl rounded-bl-none p-3.5 text-xs self-start italic">
                  Sylara is writing...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
              <input
                type="text"
                placeholder="Ask about state regulations..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button 
                type="submit"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
};

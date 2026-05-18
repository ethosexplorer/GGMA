import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Send, Users, Filter, BarChart2, Activity, MapPin, Building2, LayoutTemplate, Clock, AlertCircle, Save, Trash2, X, Plus, ChevronDown, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: any;
}

export const MarketingHub = () => {
  const [activeTab, setActiveTab] = useState<'composer' | 'campaigns' | 'analytics'>('composer');
  const [campaignType, setCampaignType] = useState<'email' | 'sms'>('email');
  
  // Composer State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>(['All']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['All']);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sendMode, setSendMode] = useState<'broadcast' | 'direct'>('broadcast');
  const [directContact, setDirectContact] = useState('');
  
  // Audience Data
  const [totalLeads, setTotalLeads] = useState(0);
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  const [filteredAudience, setFilteredAudience] = useState<any[]>([]);
  
  // UI State
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Template State
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Load CRM Audience Data
  useEffect(() => {
    const q = query(collection(db, 'crm_deals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => doc.data());
      setTotalLeads(deals.length);
      
      const states = Array.from(new Set(deals.map(d => d.jurisdiction).filter(Boolean))) as string[];
      setJurisdictions(states.sort((a, b) => a.localeCompare(b)));
      
      const types = Array.from(new Set(deals.map(d => d.type).filter(Boolean))) as string[];
      setBusinessTypes(types.sort((a, b) => a.localeCompare(b)));
      
      // Calculate filtered audience
      const filtered = deals.filter(d => {
        const matchesState = selectedStates.includes('All') || selectedStates.includes(d.jurisdiction);
        const matchesType = selectedTypes.includes('All') || selectedTypes.includes(d.type);
        // Also ensure they have the necessary contact info
        if (campaignType === 'email' && !d.email) return false;
        if (campaignType === 'sms' && !d.phone) return false;
        return matchesState && matchesType;
      });
      setFilteredCount(filtered.length);
      setFilteredAudience(filtered);
    });
    return () => unsubscribe();
  }, [selectedStates, selectedTypes, campaignType]);

  // Load saved templates
  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'marketing_templates')), snap => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailTemplate)));
    });
    return () => u();
  }, []);

  const saveTemplate = async () => {
    if (!templateName.trim()) return;
    await addDoc(collection(db, 'marketing_templates'), {
      name: templateName, subject, body: message, createdAt: serverTimestamp()
    });
    setTemplateName('');
    setShowSaveTemplate(false);
  };

  const loadTemplate = (t: EmailTemplate) => {
    setSubject(t.subject || '');
    setMessage(t.body || '');
    setShowTemplates(false);
  };

  const deleteTemplate = async (id: string) => {
    await deleteDoc(doc(db, 'marketing_templates', id));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Max 5MB for inline base64
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB for inline embedding.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      if (file.type === 'text/html') {
        // HTML templates: read as text and inject directly
        const text = await file.text();
        setMessage(prev => prev + `\n${text}\n`);
      } else if (file.type.startsWith('image/')) {
        // Images: convert to base64 data URL for inline embedding
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        setMessage(prev => prev + `\n<div style="text-align: center; margin: 20px 0;">\n  <img src="${dataUrl}" alt="${file.name}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />\n</div>\n`);
      } else if (file.type === 'application/pdf') {
        // PDFs: convert to base64 download link
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
        setMessage(prev => prev + `\n<a href="${dataUrl}" download="${file.name}" style="color: #4f46e5; font-weight: bold; text-decoration: underline;">📎 Download: ${file.name}</a>\n`);
      } else {
        alert('Unsupported file type. Please upload an image, HTML template, or PDF.');
        return;
      }
      alert('✅ Asset embedded into message body successfully!');
    } catch (error: any) {
      console.error('File read failed:', error);
      alert('Failed to process file: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSend = async () => {
    if (!subject && campaignType === 'email') return alert('Please enter a subject');
    if (!message) return alert('Please enter a message');
    
    let finalAudience = filteredAudience;
    if (sendMode === 'direct') {
      if (!directContact) return alert(`Please enter a recipient ${campaignType === 'email' ? 'email' : 'phone number'}`);
      finalAudience = [{
        email: campaignType === 'email' ? directContact : undefined,
        phone: campaignType === 'sms' ? directContact : undefined,
        jurisdiction: 'Direct Message',
        type: 'Single Recipient'
      }];
    } else {
      if (filteredAudience.length === 0) return alert('No valid audience selected. Ensure contacts have phone/email.');
    }

    setIsSending(true);
    
    try {
      // Strip base64 images from message for the API payload to avoid body size limits
      // Keep images under 500KB inline, strip larger ones
      let apiMessage = message;
      const base64Regex = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]{500000,}/g;
      if (base64Regex.test(apiMessage)) {
        apiMessage = apiMessage.replace(base64Regex, '[Image embedded - too large for email API]');
      }

      const response = await fetch('/api/marketing/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: campaignType,
          subject,
          message: apiMessage,
          recipients: finalAudience
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        alert(`Campaign API Error (${response.status}): ${errorText.substring(0, 300)}`);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setSendSuccess(true);
        // Log to Turso
        import('../../lib/turso').then(({ turso }) => {
          turso.execute({ 
            sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", 
            args: ['log-' + Math.random().toString(36).substr(2, 9), "Marketing_Campaign", "System", JSON.stringify({ type: campaignType, count: finalAudience.length, success: data.results?.successful })] 
          }).catch(console.error);
        });
        
        setTimeout(() => {
          setSendSuccess(false);
          setSubject('');
          setMessage('');
        }, 4000);
      } else {
        alert('Campaign Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Marketing API fetch error:', err);
      alert(`Network Error: ${err.message || 'Failed to contact the marketing API.'}\n\nCheck browser console (F12) for details.`);
    } finally {
      setIsSending(false);
    }
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
                  <div className="flex gap-2">
                    <button onClick={() => setShowTemplates(true)} className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-400/10 px-4 py-2 rounded-lg">
                      <LayoutTemplate size={14} /> Use Template
                    </button>
                    <button onClick={() => setShowSaveTemplate(true)} className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-400/10 px-4 py-2 rounded-lg">
                      <Save size={14} /> Save as Template
                    </button>
                  </div>
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
                  
                  {/* Upload Toolbar */}
                  {campaignType === 'email' && (
                    <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-4">
                      <label className={cn(
                        "cursor-pointer flex items-center gap-2 text-xs font-bold transition-colors px-4 py-2 rounded-lg",
                        isUploading ? "bg-slate-800 text-slate-500" : "bg-indigo-400/10 text-indigo-400 hover:text-indigo-300"
                      )}>
                        {isUploading ? <Activity size={14} className="animate-spin" /> : <LayoutTemplate size={14} />} 
                        {isUploading ? 'Uploading to Cloud...' : 'Upload Flyer / HTML Template'}
                        <input type="file" className="hidden" accept="image/*,.html,.pdf" onChange={handleFileUpload} disabled={isUploading} />
                      </label>
                      <span className="text-[10px] text-slate-500 font-medium">Assets are instantly injected into your message body.</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      if (!subject && campaignType === 'email') return alert('Please enter a subject');
                      if (!message) return alert('Please enter a message');
                      if (sendMode === 'direct' && !directContact) return alert(`Please enter a recipient ${campaignType === 'email' ? 'email' : 'phone number'}`);
                      setShowPreview(true);
                    }}
                    disabled={isSending || (sendMode === 'broadcast' && filteredCount === 0) || (!message)}
                    className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye size={16} /> Preview
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={isSending || (sendMode === 'broadcast' && filteredCount === 0) || (sendMode === 'direct' && !directContact)}
                    className={cn(
                      "flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300",
                      sendSuccess 
                        ? "bg-emerald-500 text-white" 
                        : isSending || (sendMode === 'broadcast' && filteredCount === 0)
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="text-indigo-400" /> Target Audience
                </h3>
                <div className="bg-slate-950 flex p-1 rounded-lg border border-slate-700">
                  <button onClick={() => setSendMode('broadcast')} className={cn("px-4 py-2 rounded-md text-[10px] font-bold uppercase transition-all", sendMode === 'broadcast' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-white")}>Broadcast</button>
                  <button onClick={() => setSendMode('direct')} className={cn("px-4 py-2 rounded-md text-[10px] font-bold uppercase transition-all", sendMode === 'direct' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-white")}>Direct</button>
                </div>
              </div>

              {sendMode === 'direct' ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      {campaignType === 'email' ? <Mail size={12} /> : <MessageSquare size={12} />} Recipient {campaignType === 'email' ? 'Email' : 'Phone Number'}
                    </label>
                    <input 
                      type={campaignType === 'email' ? 'email' : 'tel'} 
                      value={directContact}
                      onChange={(e) => setDirectContact(e.target.value)}
                      placeholder={campaignType === 'email' ? 'e.g., recipient@domain.com' : 'e.g., 555-123-4567'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors font-medium"
                    />
                  </div>
                  <div className="p-6 border border-indigo-500/30 bg-indigo-500/5 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Direct Message Mode</p>
                    <p className="text-2xl font-black text-white">1 Recipient</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MapPin size={12} /> Jurisdiction
                  </label>
                  <button 
                    onClick={() => setShowStateDropdown(!showStateDropdown)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-left text-white outline-none focus:border-indigo-500 transition-colors font-medium flex justify-between items-center"
                  >
                    <span className="truncate">
                      {selectedStates.includes('All') ? 'All States (National)' : selectedStates.join(', ')}
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  {showStateDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto p-2">
                      <label className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedStates.includes('All')} 
                          onChange={() => setSelectedStates(['All'])} 
                          className="accent-indigo-500 w-4 h-4" 
                        />
                        <span className="text-sm font-medium text-white">All States (National)</span>
                      </label>
                      <div className="h-px bg-slate-800 my-1"></div>
                      {jurisdictions.map(s => (
                        <label key={s} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedStates.includes(s) && !selectedStates.includes('All')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStates(prev => prev.includes('All') ? [s] : [...prev, s]);
                              } else {
                                setSelectedStates(prev => {
                                  const next = prev.filter(x => x !== s);
                                  return next.length === 0 ? ['All'] : next;
                                });
                              }
                            }}
                            className="accent-indigo-500 w-4 h-4" 
                          />
                          <span className="text-sm font-medium text-white">{s}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Building2 size={12} /> Business Type
                  </label>
                  <button 
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-left text-white outline-none focus:border-indigo-500 transition-colors font-medium flex justify-between items-center"
                  >
                    <span className="truncate capitalize">
                      {selectedTypes.includes('All') ? 'All Types' : selectedTypes.join(', ')}
                    </span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto p-2">
                      <label className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes('All')} 
                          onChange={() => setSelectedTypes(['All'])} 
                          className="accent-indigo-500 w-4 h-4" 
                        />
                        <span className="text-sm font-medium text-white">All Types</span>
                      </label>
                      <div className="h-px bg-slate-800 my-1"></div>
                      {businessTypes.map(t => (
                        <label key={t} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedTypes.includes(t) && !selectedTypes.includes('All')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTypes(prev => prev.includes('All') ? [t] : [...prev, t]);
                              } else {
                                setSelectedTypes(prev => {
                                  const next = prev.filter(x => x !== t);
                                  return next.length === 0 ? ['All'] : next;
                                });
                              }
                            }}
                            className="accent-indigo-500 w-4 h-4" 
                          />
                          <span className="text-sm font-medium text-white capitalize">{t}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Estimated Recipients</p>
                  <p className="text-4xl font-black text-white mb-2">{filteredCount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 font-medium">Matching your CRM filters</p>
                </div>
              </div>
              )}
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
      {/* Template Picker Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white">My Templates</h3>
              <button onClick={() => setShowTemplates(false)} className="p-1 hover:bg-slate-800 rounded-lg"><X size={20} className="text-slate-400" /></button>
            </div>
            {templates.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No templates saved yet. Compose a message and click "Save as Template".</p>}
            {templates.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl mb-3 hover:bg-slate-800 transition-colors">
                <div className="cursor-pointer flex-1" onClick={() => loadTemplate(t)}>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500 truncate">{t.subject || 'No subject'}</p>
                </div>
                <button onClick={() => deleteTemplate(t.id)} className="p-2 hover:bg-red-500/20 rounded-lg ml-2"><Trash2 size={14} className="text-red-400" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-white">Save Template</h3>
              <button onClick={() => setShowSaveTemplate(false)} className="p-1 hover:bg-slate-800 rounded-lg"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Template Name *</label>
                <input value={templateName} onChange={e => setTemplateName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" placeholder="e.g. AZ Cannabis Promo" />
              </div>
              <p className="text-xs text-slate-500">Subject: {subject || '(none)'}</p>
              <p className="text-xs text-slate-500">Body: {message.substring(0, 100) || '(empty)'}...</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowSaveTemplate(false)} className="px-4 py-2 text-slate-400 font-bold text-sm">Cancel</button>
              <button onClick={saveTemplate} disabled={!templateName.trim()} className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg disabled:opacity-50 hover:bg-emerald-700">Save</button>
            </div>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <Eye className="text-indigo-400" /> Campaign Preview
              </h3>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X size={24} className="text-slate-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 flex flex-col md:flex-row gap-8 bg-slate-950/50">
              {/* Preview Rendering */}
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-inner min-h-[400px]">
                {campaignType === 'email' ? (
                  <div className="text-slate-800">
                    <p className="border-b border-slate-200 pb-4 mb-6 font-bold">Subject: <span className="font-normal text-slate-600">{subject}</span></p>
                    <div dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br/>') }} className="prose prose-slate max-w-none" />
                  </div>
                ) : (
                  <div className="max-w-sm mx-auto bg-slate-100 rounded-3xl p-4 border-4 border-slate-200 shadow-xl relative">
                    <div className="w-16 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
                    <div className="bg-emerald-500 text-white p-4 rounded-2xl rounded-br-sm shadow-md mb-2 relative left-4 w-[90%]">
                      <p className="whitespace-pre-wrap text-sm">{message}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Campaign Stats Summary */}
              <div className="w-full md:w-72 shrink-0 space-y-6">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Overview</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Total Recipients</p>
                      <p className="text-3xl font-black text-white">{sendMode === 'direct' ? '1' : filteredCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Method</p>
                      <p className="text-lg font-bold text-indigo-400 capitalize flex items-center gap-2">
                        {campaignType === 'email' ? <Mail size={16} /> : <MessageSquare size={16} />} {campaignType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Target</p>
                      <p className="text-sm font-bold text-white leading-tight">
                        {sendMode === 'direct' ? directContact : (selectedStates.includes('All') ? 'National (All States)' : selectedStates.join(', '))}
                      </p>
                    </div>
                    {sendMode === 'broadcast' && (
                      <div>
                        <p className="text-xs text-slate-500 font-bold mb-1">Business Types</p>
                        <p className="text-sm font-bold text-white leading-tight capitalize">
                          {selectedTypes.includes('All') ? 'All Types' : selectedTypes.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 shrink-0 flex justify-end gap-4 bg-slate-900 rounded-b-3xl">
              <button 
                onClick={() => setShowPreview(false)} 
                className="px-6 py-3 text-slate-300 font-bold hover:bg-slate-800 rounded-xl transition-colors"
              >
                Keep Editing
              </button>
              <button 
                onClick={() => {
                  setShowPreview(false);
                  handleSend();
                }}
                disabled={isSending}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={18} /> Confirm & Launch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

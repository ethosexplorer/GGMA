import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, Shield, Scale, Wrench, User, Building2, HelpCircle, Send, Phone, Mail, MessageCircle, ArrowLeft, ExternalLink, FileText, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateGeminiResponse } from '../lib/gemini';

// ═══ POLLS ═══
const COMMUNITY_POLLS = [
  { id: 'p1', question: 'Should cannabis be fully legalized at the federal level?', options: ['Yes — Full Legalization', 'Medical Only', 'Decriminalized Only', 'No Change'], votes: [1847, 623, 312, 89] },
  { id: 'p2', question: 'What is your biggest challenge with cannabis compliance?', options: ['Understanding state laws', 'Application paperwork', 'Cost of licensing', 'Finding a physician'], votes: [934, 712, 1203, 445] },
  { id: 'p3', question: 'How did you hear about GGP-OS?', options: ['Google Search', 'Social Media', 'Word of Mouth', 'Provider Referral', 'Other'], votes: [567, 823, 1102, 389, 201] },
];

// ═══ Q&A DATA ═══
const GENERAL_TOPICS = [
  { title: 'Platform Navigation', icon: BookOpen, items: [
    { q: 'How do I navigate the dashboard?', a: 'After logging in, your role-specific dashboard loads automatically. Use the sidebar tabs to access Applications, Documents, Calendar, Settings, and more. The top bar shows notifications and your jurisdiction selector.' },
    { q: 'How do I switch between tabs?', a: 'Click any tab in the left sidebar or top navigation. Key tabs: Home (overview), Applications (track status), Documents (uploads), Calendar (scheduling), and Support (this page).' },
    { q: 'Where is the jurisdiction selector?', a: 'In the top navigation bar — look for the green pin icon with "JURISDICTION" next to it. Select your state to see state-specific regulations, fees, and compliance info across the entire platform.' },
    { q: 'How do I use the search function?', a: 'The search bar at the top of the Resource Center filters all Q&A topics instantly. On your dashboard, use the search icon in the sidebar for documents and records.' },
  ]},
  { title: 'Account & Registration', icon: User, items: [
    { q: 'How do I create an account?', a: 'Click "Portal Login" on the landing page, then select your role (Patient, Business, Provider, or Attorney). Follow the guided intake wizard — L.A.R.R.Y. or Sylara AI will walk you through every step.' },
    { q: 'What roles are available?', a: 'Patient (medical card holders), Business Owner (dispensary/grower/processor), Provider (physicians/clinics), Attorney (legal counsel), and Regulator (state officials). Each gets a specialized dashboard.' },
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login screen. A secure reset link will be sent to your registered email. If you don\'t receive it within 5 minutes, check your spam folder.' },
    { q: 'Is there a free trial?', a: 'Yes! Every new account gets a full 30-day free trial with access to all platform features. No credit card required to start.' },
  ]},
  { title: 'How-To Guides', icon: Building2, items: [
    { q: 'How do I upload documents?', a: 'Go to the Documents tab in your dashboard. Click "Upload" and select your files (PDF, JPG, PNG — max 10MB each). Documents are encrypted and stored securely for compliance review.' },
    { q: 'How do I check my application status?', a: 'Navigate to the "Applications" tab in your portal dashboard. Status updates are polled directly from the state database in real-time. You\'ll also receive notifications for any changes.' },
    { q: 'How do I schedule a telehealth visit?', a: 'Go to the TeleHealth tab in your Patient Portal. Select an available time slot with a certified physician in your state. You\'ll need a stable internet connection and a device with camera/mic.' },
    { q: 'How do I use the CRM pipeline?', a: 'Business users can access the Pipeline CRM from their dashboard. It shows all leads, active deals, and conversion stages. Click any deal card to view details, add notes, or update the stage.' },
    { q: 'How do I use the Calendar?', a: 'Click the Calendar tab in your dashboard. You can add events, set reminders, and view assigned tasks. Founders/executives can also assign events to team members with notifications.' },
  ]},
  { title: 'Technical Support', icon: Wrench, items: [
    { q: 'The platform is loading slowly.', a: 'Try clearing your browser cache, disabling browser extensions, or switching to Chrome/Firefox. GGP-OS is optimized for modern browsers. If issues persist, contact support.' },
    { q: 'What file formats are accepted?', a: 'We accept PDF, JPG, and PNG for document uploads. Maximum file size is 10MB per document.' },
    { q: 'Is my data secure?', a: 'Yes. We use end-to-end encryption, Firebase Auth, and comply with all state and federal data protection standards. Your health information is never shared or sold.' },
    { q: 'The page looks broken on my phone.', a: 'GGP-OS is optimized for desktop and tablet. Mobile support is improving — try rotating to landscape mode or using a larger screen for the best experience.' },
  ]},
];

const LEGAL_TOPICS = [
  { title: 'Federal Law', icon: Scale, items: [
    { q: 'What is DEA Schedule III reclassification?', a: 'As of April 23, 2026, the DOJ issued a Final Order moving medical cannabis and FDA-approved cannabis products to Schedule III. This allows 280E tax relief, banking access, and interstate commerce for registered operators.' },
    { q: 'Do I need to register with the DEA?', a: 'If you are a licensed medical cannabis dispensary, YES. The DEA registration window opened April 23, 2026, with a 60-day deadline (June 22, 2026). Fee: $794 via the DEA portal. GGP-OS has a full guided wizard.' },
    { q: 'What happens if I don\'t register?', a: 'You lose eligibility for: 280E tax breaks (deducting normal business expenses), banking services, and interstate commerce. You CAN still operate under your state license during the review period.' },
    { q: 'What SOPs does the DEA require?', a: '10 Standard Operating Procedures: ordering, receiving, inventory, storage, security, dispensing/delivery, destruction/disposal, theft/loss reporting, suspicious order due diligence, and records retention.' },
  ]},
  { title: 'State Compliance', icon: Shield, items: [
    { q: 'How do I know my state\'s regulations?', a: 'GGP-OS has the complete regulatory database for all 50 states + DC built into Sylara AI. Ask her about your specific state and she\'ll provide the exact regulator, tracking system, tax rates, and compliance requirements.' },
    { q: 'What is seed-to-sale tracking?', a: 'States require cannabis to be tracked from cultivation to final sale. Systems include Metrc (most states), BioTrack (FL, DE, NM), MJ Freeway (PA, several others), and Leaf Data (WA). Currently, GGP-OS fully integrates with Metrc, with integrations for the others on our active roadmap.' },
    { q: 'Does my state have patient reciprocity?', a: 'Some states accept out-of-state medical cards (e.g., OK, ME, MI, DC, AR). Reciprocity rules vary — ask Sylara for your specific state\'s policy.' },
    { q: 'Can I grow cannabis at home?', a: 'Home cultivation rules vary dramatically by state. Some allow it for medical patients (e.g., OK: 6 mature plants), others prohibit it entirely. Check your state dashboard for specifics.' },
  ]},
  { title: 'Patient Rights', icon: FileText, items: [
    { q: 'Can my employer fire me for having a medical card?', a: 'Employment protections vary by state. Some states (like OK) explicitly protect medical card holders from employment discrimination. Others do not. Consult the Attorney Directory in GGP-OS for state-specific legal counsel.' },
    { q: 'Can I travel with my medical cannabis?', a: 'Interstate transport of cannabis remains federally complicated. Within your state, you can transport within legal limits. Across state lines, check both states\' reciprocity laws. Air travel follows TSA/federal rules.' },
    { q: 'How do I file a complaint against a dispensary?', a: 'Contact your state\'s cannabis regulatory authority (e.g., OMMA in OK, DCC in CA, CCB in NV). GGP-OS provides direct links to every state regulator in the State Dashboard.' },
  ]},
];

export const ResourceCenter = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'legal'>('general');
  const [expandedTopic, setExpandedTopic] = useState<number>(0);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', role: 'Patient', subject: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role:'user'|'bot',text:string}[]>([
    { role: 'bot', text: 'Hi! I\'m Sylara, your Resource Center assistant. Ask me anything about cannabis regulations, your account, or how to use GGP-OS.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);

  const handleChat = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatTyping) return;
    const msg = chatInput;
    setChatMessages(p => [...p, { role: 'user', text: msg }]);
    setChatInput('');
    setChatTyping(true);
    try {
      const resp = await generateGeminiResponse(msg, 'general', chatMessages.slice(-6));
      setChatMessages(p => [...p, { role: 'bot', text: resp }]);
    } catch {
      setChatMessages(p => [...p, { role: 'bot', text: 'I\'m having trouble connecting right now. Please try again or use the contact form.' }]);
    }
    setChatTyping(false);
  };

  const topics = activeTab === 'general' ? GENERAL_TOPICS : LEGAL_TOPICS;

  // Search filter
  const filteredTopics = searchQuery.trim()
    ? topics.map(t => ({
        ...t,
        items: t.items.filter(i => i.q.toLowerCase().includes(searchQuery.toLowerCase()) || i.a.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(t => t.items.length > 0)
    : topics;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setContactForm({ name: '', email: '', role: 'Patient', subject: '', message: '' });
  };

  const toggleQ = (key: string) => setExpandedQ(expandedQ === key ? null : key);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/gghp-logo.png" alt="GGHP" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="w-px h-6 bg-slate-300" />
          <span className="text-slate-800 font-black text-sm tracking-wide">Resource Center</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="sms:+16452468277" className="hidden sm:flex items-center gap-2 text-blue-600 font-bold text-sm">
            <MessageCircle size={14} /> iMessage: 645-246-8277
          </a>
          <span className="hidden sm:block w-px h-4 bg-slate-300" />
          <a href="tel:18889634447" className="hidden sm:flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Phone size={14} /> 1-888-963-4447
          </a>
          <button onClick={() => onNavigate('landing')} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={14} className="inline mr-1" /> Back to Portal
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0f2d1e] to-[#1a4731] text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
            <HelpCircle size={12} /> 50-State Support • 24/7 AI Assistance
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">How can we help?</h1>
          <p className="text-emerald-200/80 text-lg max-w-xl mx-auto">Search our knowledge base, browse by topic, or chat with Sylara AI for instant answers.</p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/60" size={20} />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder:text-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 text-sm font-medium"
            />
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
        <div className="flex bg-white rounded-2xl shadow-lg border border-slate-200 p-1.5 max-w-md mx-auto">
          <button onClick={() => { setActiveTab('general'); setExpandedTopic(0); setSearchQuery(''); }}
            className={cn("flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              activeTab === 'general' ? "bg-[#1a4731] text-white shadow-md" : "text-slate-500 hover:text-slate-700")}>
            <HelpCircle size={16} /> General Support
          </button>
          <button onClick={() => { setActiveTab('legal'); setExpandedTopic(0); setSearchQuery(''); }}
            className={cn("flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              activeTab === 'legal' ? "bg-amber-700 text-white shadow-md" : "text-slate-500 hover:text-slate-700")}>
            <Scale size={16} /> Legal & Compliance
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: Topics + Q&A */}
          <div className="flex-1 space-y-4">
            {filteredTopics.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-400 font-bold">No results found for "{searchQuery}"</p>
                <p className="text-slate-400 text-sm mt-2">Try a different search or browse by topic.</p>
              </div>
            )}
            {filteredTopics.map((topic, ti) => (
              <div key={ti} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Topic Header */}
                <button onClick={() => setExpandedTopic(expandedTopic === ti ? -1 : ti)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                      activeTab === 'general' ? "bg-[#A3B18A]" : "bg-amber-600")}>
                      <topic.icon size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-black text-slate-800">{topic.title}</h3>
                      <p className="text-xs text-slate-400 font-medium">{topic.items.length} questions</p>
                    </div>
                  </div>
                  {expandedTopic === ti ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>

                {/* Q&A Items */}
                {expandedTopic === ti && (
                  <div className="border-t border-slate-100">
                    {topic.items.map((item, qi) => {
                      const key = `${ti}-${qi}`;
                      return (
                        <div key={qi} className="border-b border-slate-50 last:border-0">
                          <button onClick={() => toggleQ(key)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-emerald-50/30 transition-colors">
                            <span className="font-bold text-sm text-slate-700 pr-4">{item.q}</span>
                            {expandedQ === key ? <ChevronUp size={16} className="text-emerald-600 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                          </button>
                          {expandedQ === key && (
                            <div className="px-5 pb-4 -mt-1">
                              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed border-l-4 border-emerald-400">
                                {item.a}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: Quick Contact + Quick Links */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6">
            {/* Quick Contact Form */}
            <div className="bg-gradient-to-br from-[#1a4731] to-[#0f2d1e] rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-black mb-1 flex items-center gap-2"><Mail size={18} /> Quick Message</h3>
              <p className="text-emerald-200/70 text-xs mb-5">Our team typically responds within 2 hours.</p>

              {formSent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/30">
                    <Send size={24} className="text-white" />
                  </div>
                  <p className="font-black text-lg">Message Sent!</p>
                  <p className="text-emerald-200/70 text-sm mt-1">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3">
                  <input value={contactForm.name} onChange={e => setContactForm(f => ({...f, name: e.target.value}))}
                    placeholder="Your Name *" className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/50" />
                  <input value={contactForm.email} onChange={e => setContactForm(f => ({...f, email: e.target.value}))} type="email"
                    placeholder="Email Address *" className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/50" />
                  <select value={contactForm.role} onChange={e => setContactForm(f => ({...f, role: e.target.value}))}
                    className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-400/50">
                    {['Patient', 'Business', 'Provider', 'Attorney', 'Other'].map(r => <option key={r} value={r} className="text-slate-800">{r}</option>)}
                  </select>
                  <input value={contactForm.subject} onChange={e => setContactForm(f => ({...f, subject: e.target.value}))}
                    placeholder="Subject" className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/50" />
                  <textarea value={contactForm.message} onChange={e => setContactForm(f => ({...f, message: e.target.value}))} rows={3}
                    placeholder="How can we help? *" className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 resize-none" />
                  <button type="submit" className="w-full py-3 bg-white text-[#1a4731] font-black rounded-xl hover:bg-emerald-50 transition-colors shadow-md text-sm">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Quick Links</h4>
              {[
                { label: 'State Laws Aggregator', desc: 'Search cannabis regulations by state', action: () => onNavigate('state-facts') },
                { label: 'Education Academy', desc: 'Self-paced cannabis compliance courses', action: () => onNavigate('education') },
                { label: 'Legal Advocacy Hub', desc: 'Attorney directory & legal resources', action: () => onNavigate('legal-advocacy') },
                { label: 'Portal Login', desc: 'Access your dashboard', action: () => onNavigate('login') },
              ].map((link, i) => (
                <button key={i} onClick={link.action}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group">
                  <div>
                    <p className="font-bold text-sm text-slate-800 group-hover:text-emerald-800">{link.label}</p>
                    <p className="text-xs text-slate-400">{link.desc}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-300 group-hover:text-emerald-500 shrink-0" />
                </button>
              ))}
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Contact Us</h4>
              <a href="sms:+16452468277" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 font-bold text-sm hover:bg-blue-100 transition-colors">
                <MessageCircle size={16} /> 💬 iMessage: (645) 246-8277
              </a>
              <a href="tel:18889634447" className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-sm hover:bg-emerald-100 transition-colors">
                <Phone size={16} /> 📞 1-888-963-4447
              </a>
              <a href="mailto:support@globalgreenhp.com" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors">
                <Mail size={16} /> support@globalgreenhp.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COMMUNITY POLLS ═══ */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-sm">
            <BarChart3 size={18} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Community Polls</h2>
            <p className="text-xs text-slate-400 font-medium">Your voice matters — vote and see what others think</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COMMUNITY_POLLS.map(poll => {
            const totalVotes = poll.votes.reduce((a, b) => a + b, 0) + (pollVotes[poll.id] !== undefined ? 1 : 0);
            const hasVoted = pollVotes[poll.id] !== undefined;
            return (
              <div key={poll.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="font-bold text-sm text-slate-800 mb-4">{poll.question}</p>
                <div className="space-y-2">
                  {poll.options.map((opt, oi) => {
                    const voteCount = poll.votes[oi] + (pollVotes[poll.id] === oi ? 1 : 0);
                    const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                    return (
                      <button key={oi} disabled={hasVoted}
                        onClick={() => setPollVotes(p => ({ ...p, [poll.id]: oi }))}
                        className={cn("w-full text-left rounded-xl border transition-all relative overflow-hidden",
                          hasVoted ? "cursor-default" : "hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer",
                          pollVotes[poll.id] === oi ? "border-indigo-400 bg-indigo-50" : "border-slate-100")}>
                        {hasVoted && (
                          <div className="absolute inset-0 bg-indigo-100/40 rounded-xl" style={{ width: `${pct}%` }} />
                        )}
                        <div className="relative flex items-center justify-between px-3 py-2.5">
                          <span className={cn("text-xs font-bold", pollVotes[poll.id] === oi ? "text-indigo-700" : "text-slate-600")}>{opt}</span>
                          {hasVoted && <span className="text-xs font-black text-indigo-600">{pct}%</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-3 text-right">{totalVotes.toLocaleString()} votes</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Sylara Chat */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-[340px] overflow-hidden mb-3 flex flex-col h-[420px] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-r from-[#1a4731] to-[#0f2d1e] p-4 text-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <h3 className="font-black text-sm leading-tight">Sylara AI</h3>
                <p className="text-[10px] text-emerald-300/80">Resource Center Assistant</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-white/60 hover:text-white">✕</button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto bg-slate-50 flex flex-col gap-2">
              {chatMessages.map((m, i) => (
                <div key={i} className={cn("flex max-w-[85%]", m.role === 'user' ? "ml-auto" : "mr-auto")}>
                  <div className={cn("p-3 rounded-2xl text-[13px] leading-relaxed",
                    m.role === 'user' ? "bg-[#1a4731] text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none")}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatTyping && (
                <div className="flex max-w-[85%] mr-auto">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 rounded-tl-none text-sm">Thinking...</div>
                </div>
              )}
            </div>

            <form onSubmit={handleChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                placeholder="Ask Sylara anything..."
                className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/30 focus:bg-white" />
              <button type="submit" disabled={!chatInput.trim() || chatTyping}
                className="p-2 bg-[#1a4731] text-white rounded-lg hover:bg-[#0f291c] disabled:opacity-50">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-[#1a4731] to-[#2c6e4d] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
          {chatOpen ? <span className="text-xl">✕</span> : <MessageCircle size={24} />}
          {!chatOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

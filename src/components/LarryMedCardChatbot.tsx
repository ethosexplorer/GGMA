import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Bot, User, Calendar, Clock, Phone, Mail, CheckCircle,
  Loader2, ChevronDown, Leaf, ArrowLeft, Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// ── Intake Sector Labels ──
const SECTOR_LABELS: Record<string, { emoji: string; label: string; desc: string }> = {
  'med-card':     { emoji: '🏥', label: 'Patient Intake',     desc: 'Medical cannabis card applications & telehealth' },
  'ggma':         { emoji: '🏥', label: 'Patient Intake',     desc: 'GGMA patient onboarding & state licensing' },
  'ggma-patient': { emoji: '🏥', label: 'Patient Intake',     desc: 'Patient registration & compliance' },
  'patient':      { emoji: '🏥', label: 'Patient Intake',     desc: 'Patient card application assistance' },
  'business':     { emoji: '🏢', label: 'Business Intake',    desc: 'Commercial licensing & compliance setup' },
  'sinc':         { emoji: '🛡️', label: 'SINC Compliance',    desc: 'Encrypted audit trails & seed-to-sale' },
  'rip':          { emoji: '🕵️', label: 'RIP Enforcement',    desc: 'Regulatory intelligence & enforcement' },
  'provider':     { emoji: '👨‍⚕️', label: 'Provider Intake',    desc: 'Physician/clinic network registration' },
  'legal':        { emoji: '⚖️', label: 'Attorney Intake',    desc: 'Legal marketplace onboarding' },
  'attorney':     { emoji: '⚖️', label: 'Attorney Intake',    desc: 'Legal professional network registration' },
  'government':   { emoji: '🏛️', label: 'Government Office',  desc: 'Policy analysis & regulatory integration' },
  'political_executive': { emoji: '🏛️', label: 'Government Office', desc: 'Economic impact & policy tools' },
  'advocate':     { emoji: '🤝', label: 'Advocacy & Health',  desc: 'Social equity & community resources' },
  'advocacy_research': { emoji: '🤝', label: 'Advocacy & Research', desc: 'Health impact & policy research' },
  'general':      { emoji: '🌿', label: 'General Intake',     desc: 'Platform onboarding & support' },
};

// ── Callback time slots ──
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

// ── Chat step flow ──
type Step = 'greeting' | 'ask_name' | 'ask_phone' | 'ask_email' | 'ask_state' | 'schedule_date' | 'schedule_time' | 'confirm' | 'done';

interface ChatMsg { role: 'bot' | 'user'; text: string }

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export const LarryMedCardChatbot = ({ onNavigate, onProfileCreated, variant = 'med-card', userProfile, jurisdiction = 'Oklahoma', activeRole, inline = false }: any) => {
  const sector = SECTOR_LABELS[variant] || SECTOR_LABELS['general'];
  const currentRole = activeRole || userProfile?.role;
  const emailLower = userProfile?.email?.toLowerCase() || '';
  const isRyan = emailLower.includes('ceo.globalgreenhp') || currentRole === 'president';
  const isMonica = emailLower.includes('compliance.globalgreenhp') || emailLower.includes('monica') || currentRole === 'chief_compliance_director';
  const isBob = emailLower.includes('bobmoore') || currentRole === 'executive_advisor' || currentRole === 'advisor';
  const isFounderAssistant = currentRole === 'executive_founder' && !isRyan && !isMonica && !isBob;
  const isExecutive = isRyan || isMonica || isBob || isFounderAssistant;

  // ── Executive greeting for internal users ──
  const getExecGreeting = () => {
    if (isRyan) return '🛡️ **CEO Access Authenticated.** Good Morning, Ryan. I am **Sylara**. All operational pipelines are fully online. How can I assist your executive oversight today?';
    if (isMonica) return '🛡️ **Compliance Access Authenticated.** Good Morning, Monica! I am **Sylara**. Compliance dashboard is synced. How can I support your compliance operations today?';
    if (isBob) return '🛡️ **Advisory Access Authenticated.** Good Morning, Bob. I am **Sylara**. All regulatory analytics are updated. How can I assist your analysis today?';
    if (isFounderAssistant) return '✨ **Good Morning, Shantell!** I am **Sylara**, your Executive Personal Assistant. I have your daily summaries and appointments ready. How can I support you today?';
    return null;
  };

  const getPublicGreeting = () =>
    `👋 Welcome! I am **Sylara** — your **${sector.label} Agent** at the Global Green Hybrid Platform.\n\n` +
    `${sector.emoji} **${sector.label}**: ${sector.desc}\n\n` +
    `To get started, I'll collect a few details and then schedule a **phone callback** with a live intake specialist who will walk you through the full process.\n\n` +
    `What is your **full name**?`;

  const [step, setStep] = useState<Step>(isExecutive ? 'greeting' : 'ask_name');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: isExecutive ? (getExecGreeting() || getPublicGreeting()) : getPublicGreeting() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contactData, setContactData] = useState({ name: '', phone: '', email: '', state: jurisdiction, date: '', time: '' });
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Next available dates (next 7 business days) ──
  const getNextDates = () => {
    const dates: string[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1); // Start from tomorrow
    while (dates.length < 7) {
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Skip weekends
        dates.push(d.toISOString().split('T')[0]);
      }
      d.setDate(d.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const addBotMsg = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = (overrideText?: string) => {
    const text = (overrideText || inputValue).trim();
    if (!text) return;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text }]);

    // ── Executive free-form chat (no intake flow) ──
    if (isExecutive && step === 'greeting') {
      addBotMsg(`Understood. I've noted your request: "${text}". For complex operations, please use the relevant dashboard tab. Is there anything else I can help with?`);
      return;
    }

    switch (step) {
      case 'ask_name':
        setContactData(prev => ({ ...prev, name: text }));
        setStep('ask_phone');
        addBotMsg(`Thank you, **${text}**! 📱 What is the best **phone number** to reach you for the callback?`);
        break;
      case 'ask_phone':
        setContactData(prev => ({ ...prev, phone: text }));
        setStep('ask_email');
        addBotMsg(`Got it! 📧 What is your **email address**? (We'll send a confirmation to this address)`);
        break;
      case 'ask_email':
        setContactData(prev => ({ ...prev, email: text }));
        setStep('ask_state');
        addBotMsg(`Perfect! 🗺️ Which **state** are you located in? (This determines your regulatory requirements)`);
        break;
      case 'ask_state': {
        const matched = US_STATES.find(s => s.toLowerCase() === text.toLowerCase()) || text;
        setContactData(prev => ({ ...prev, state: matched }));
        setStep('schedule_date');
        addBotMsg(`Great — **${matched}**! 📅 Now let's schedule your callback. Please select a **date** below:`);
        break;
      }
      default:
        break;
    }
  };

  const handleDateSelect = (date: string) => {
    setContactData(prev => ({ ...prev, date }));
    setMessages(prev => [...prev, { role: 'user', text: formatDate(date) }]);
    setStep('schedule_time');
    addBotMsg(`📅 **${formatDate(date)}** — great choice! Now select a **time slot** for your callback:`);
  };

  const handleTimeSelect = async (time: string) => {
    const finalData = { ...contactData, time };
    setContactData(finalData);
    setMessages(prev => [...prev, { role: 'user', text: time }]);
    setStep('confirm');

    addBotMsg(
      `✅ **Callback Scheduled!**\n\n` +
      `📋 **Summary:**\n` +
      `• **Name:** ${finalData.name}\n` +
      `• **Phone:** ${finalData.phone}\n` +
      `• **Email:** ${finalData.email}\n` +
      `• **State:** ${finalData.state}\n` +
      `• **Sector:** ${sector.label}\n` +
      `• **Date:** ${formatDate(finalData.date)}\n` +
      `• **Time:** ${time}\n\n` +
      `A **live intake specialist** will call you at the scheduled time to complete your ${sector.label.toLowerCase()} process over the phone.\n\n` +
      `📧 A confirmation email will be sent to **${finalData.email}**.\n\n` +
      `Thank you for choosing the Global Green Hybrid Platform!`
    );

    // ── Write to Firestore Operations Calendar ──
    try {
      await addDoc(collection(db, 'calendar_events'), {
        title: `📞 ${sector.emoji} Callback: ${finalData.name} (${sector.label})`,
        date: finalData.date,
        startTime: convertTo24(time),
        endTime: convertTo24(time, 30), // 30 min block
        category: 'ops',
        color: 'bg-indigo-500',
        description: [
          `📞 Intake Callback — ${sector.label}`,
          `👤 Name: ${finalData.name}`,
          `📱 Phone: ${finalData.phone}`,
          `📧 Email: ${finalData.email}`,
          `🗺️ State: ${finalData.state}`,
          `🏷️ Sector: ${variant}`,
          `Source: Sylara Intake Bot`,
        ].join('\n'),
        attendees: finalData.email,
        location: 'Phone Call',
        assignedTo: 'ops_team',
        assignedBy: 'Sylara',
        createdAt: serverTimestamp(),
      });
      console.log('✅ Intake callback scheduled to Operations Calendar');
    } catch (err) {
      console.error('Failed to schedule callback:', err);
    }

    setStep('done');
  };

  // ── 12h → 24h time conversion ──
  const convertTo24 = (time12: string, addMinutes = 0) => {
    const [timePart, period] = time12.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    minutes += addMinutes;
    if (minutes >= 60) { hours += 1; minutes -= 60; }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // ── Render markdown-lite (bold) ──
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
            : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={cn("flex flex-col h-full", inline ? "max-h-[600px]" : "min-h-screen bg-gradient-to-b from-[#f8faf9] to-white")}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a4731] to-emerald-600 px-6 py-4 flex items-center gap-3 shadow-lg">
        {!inline && onNavigate && (
          <button onClick={() => onNavigate('landing')} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          <Sparkles size={22} />
        </div>
        <div>
          <h1 className="text-white font-black text-lg tracking-tight">Sylara</h1>
          <p className="text-white/60 text-xs font-medium">{sector.emoji} {sector.label} Agent • GGHP</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-200 text-xs font-bold">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Bot size={16} />
                </div>
              )}
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                msg.role === 'user'
                  ? 'bg-[#1a4731] text-white rounded-br-md'
                  : 'bg-white border border-slate-200/80 text-slate-700 rounded-bl-md'
              )}>
                {renderText(msg.text)}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-[#1a4731] flex items-center justify-center text-white shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Date Picker (shown during schedule_date step) ── */}
        {step === 'schedule_date' && !isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-[#1a4731] flex items-center justify-center text-white shrink-0 mt-1">
              <Calendar size={16} />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-md p-4 shadow-sm max-w-[80%]">
              <p className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" /> Select a date:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {getNextDates().map(date => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Time Picker (shown during schedule_time step) ── */}
        {step === 'schedule_time' && !isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-[#1a4731] flex items-center justify-center text-white shrink-0 mt-1">
              <Clock size={16} />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-md p-4 shadow-sm max-w-[80%]">
              <p className="text-xs font-bold text-slate-600 mb-3 flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-600" /> Select a time (CST):
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(time => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      {step !== 'done' && step !== 'confirm' && step !== 'schedule_date' && step !== 'schedule_time' && (
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={
                step === 'ask_name' ? 'Enter your full name...' :
                step === 'ask_phone' ? 'Enter phone number...' :
                step === 'ask_email' ? 'Enter email address...' :
                step === 'ask_state' ? 'Enter your state...' :
                'Type a message...'
              }
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              disabled={isTyping}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#1a4731] text-white flex items-center justify-center hover:bg-[#153a28] transition-all disabled:opacity-40 shadow-sm shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Done state — restart option */}
      {step === 'done' && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 text-center">
          <p className="text-xs text-slate-500 mb-2">Your callback has been scheduled and added to the Operations Calendar.</p>
          <button
            onClick={() => onNavigate?.('landing')}
            className="px-6 py-2.5 bg-[#1a4731] text-white text-sm font-bold rounded-xl hover:bg-[#153a28] transition-all"
          >
            ← Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

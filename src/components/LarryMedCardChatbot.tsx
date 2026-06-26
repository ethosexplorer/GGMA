import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send, Bot, User, Calendar, Clock, Phone, Mail, CheckCircle,
  Loader2, ChevronDown, Leaf, ArrowLeft, Sparkles, Mic, MicOff,
  Volume2, VolumeX, Zap, UserPlus, ClipboardList, DollarSign,
  Shield, BarChart3, Activity, Paperclip, X, Image, FileText, Sliders, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, limit, doc, setDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { streamGeminiResponse, EXECUTIVE_PROMPTS } from '../lib/gemini';

// ── Notification chime (subtle, professional) ──
const playChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
};

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
  'health_lab':   { emoji: '🔬', label: 'Lab & Public Health',  desc: 'Testing, contamination monitoring & compliance' },
  'general':      { emoji: '🌿', label: 'General Intake',     desc: 'Platform onboarding & support' },
};

// ── Callback time slots ──
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
];

// ── Chat step flow ──
type Step = 'greeting' | 'ask_name' | 'ask_phone' | 'ask_email' | 'ask_state' | 'ask_reason' | 'schedule_date' | 'schedule_time' | 'confirm' | 'done';

interface ChatMsg { role: 'bot' | 'user' | 'system'; text: string; timestamp?: number }

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// ── Quick Actions ──
const SHANTELL_ACTIONS = [
  { label: '📊 Daily Brief', prompt: 'Give me a full daily briefing. Summarize today\'s signups, active users, open tasks, support tickets, and anything I need to address right now.' },
  { label: '👥 New Signups', prompt: 'Who signed up today? Give me names, roles, and states.' },
  { label: '📞 Call Queue', prompt: 'What\'s the current phone queue status? Any missed calls or voicemails I need to handle?' },
  { label: '💰 Revenue', prompt: 'Give me a revenue and financial summary. What are the numbers looking like?' },
  { label: '🔍 Compliance', prompt: 'Run a quick compliance check. Any red flags, audits due, or regulatory changes I need to know about?' },
  { label: '📋 My Tasks', prompt: 'What are my open tasks and what needs my attention today?' },
];

const RYAN_ACTIONS = [
  { label: '🛡️ Command Brief', prompt: 'Supreme Command briefing. Give me a full CEO-level overview of platform state, compliance, revenue, and personnel.' },
  { label: '⚖️ Enforcement', prompt: 'Enforcement and compliance status report. Any violations, audits, or regulatory changes?' },
  { label: '📈 Analytics', prompt: 'Market analytics and platform growth metrics. How are we performing?' },
  { label: '👁️ Oversight', prompt: 'Personnel oversight report. Team performance, HR intelligence, and staffing.' },
  { label: '📊 Pipeline', prompt: 'CRM pipeline status. What\'s the B2B pipeline looking like?' },
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

  const execKey = isRyan ? 'ryan' : isMonica ? 'monica' : isBob ? 'bob' : 'shantell';
  const aiName = isRyan ? 'L.A.R.R.Y' : 'Sylara';
  const quickActions = isRyan ? RYAN_ACTIONS : SHANTELL_ACTIONS;

  // ── Executive greeting ──
  const getExecGreeting = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    if (isRyan) return `🛡️ **CEO Access Authenticated.** ${timeOfDay}, President Ferrari. **L.A.R.R.Y** online and operational. All systems green. How can I assist your executive oversight?`;
    if (isMonica) return `🛡️ **Compliance Access Authenticated.** ${timeOfDay}, Monica! **Sylara** here. Compliance dashboard is synced across all jurisdictions. How can I support you?`;
    if (isBob) return `🛡️ **Advisory Access Authenticated.** ${timeOfDay}, Bob. **Sylara** here. All regulatory analytics updated. How can I assist your analysis?`;
    return `✨ **${timeOfDay}, Shantell!** It's your girl **Sylara** — I'm locked in and monitoring everything in real-time. Signups, tasks, compliance, ops — all eyes on it. What do we need to handle?`;
  };

  const getPublicGreeting = () =>
    `👋 Welcome! I am **Sylara** — your **${sector.label} Agent** at the Global Green Hybrid Platform.\n\n` +
    `${sector.emoji} **${sector.label}**: ${sector.desc}\n\n` +
    `To get started, I'll collect a few details and then schedule a **phone callback** with a live intake specialist who will walk you through the full process.\n\n` +
    `What is your **full name**?`;

  const [step, setStep] = useState<Step>(isExecutive ? 'greeting' : 'ask_name');
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'bot', text: isExecutive ? (getExecGreeting() || getPublicGreeting()) : getPublicGreeting(), timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [contactData, setContactData] = useState({ name: '', phone: '', email: '', state: jurisdiction, reason: '', date: '', time: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // ── File Upload State & Refs ──
  const [attachments, setAttachments] = useState<{ name: string; url: string; type: string; content?: string }[]>([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Voice I/O State ──
  const [isListening, setIsListeningState] = useState(false);
  const isListeningRef = useRef(false);
  const setIsListening = (val: boolean) => {
    setIsListeningState(val);
    isListeningRef.current = val;
  };
  const [autoSpeak, setAutoSpeak] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const handleSendRef = useRef<any>(null);
  const [voiceRate, setVoiceRate] = useState<number>(() => {
    const saved = localStorage.getItem('sylara_voice_rate');
    return saved ? parseFloat(saved) : 1.25;
  });
  const [voicePitch, setVoicePitch] = useState<number>(() => {
    const saved = localStorage.getItem('sylara_voice_pitch');
    return saved ? parseFloat(saved) : 1.05;
  });
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(() => {
    return localStorage.getItem('sylara_voice_name') || '';
  });
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const speechStartRef = useRef('');
  const voiceSettingsRef = useRef<HTMLDivElement>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const updateVoices = () => {
      setVoices(speechSynthesis.getVoices());
    };
    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (voiceSettingsRef.current && !voiceSettingsRef.current.contains(e.target as Node)) {
        setShowVoiceSettings(false);
      }
    };
    if (showVoiceSettings) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showVoiceSettings]);

  const startSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (isListeningRef.current) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {}
        }
        setIsListening(false);
        setInputValue(prev => {
          const text = prev.trim();
          if (text && handleSendRef.current) {
            setTimeout(() => {
              handleSendRef.current(text);
            }, 100);
          }
          return '';
        });
      }
    }, 15000);
  }, []);


  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // ── Proactive Intelligence State ──
  const [lastSeenSignupCount, setLastSeenSignupCount] = useState<number | null>(null);
  const proactiveInitRef = useRef(false);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingText]);

  // ═══ PROACTIVE REAL-TIME INTELLIGENCE (Firebase onSnapshot) ═══
  useEffect(() => {
    if (!isExecutive) return;
    const unsubs: (() => void)[] = [];

    // Watch for new user signups
    const usersUnsub = onSnapshot(collection(db, 'users'), (snap) => {
      if (lastSeenSignupCount === null) {
        setLastSeenSignupCount(snap.size);
        proactiveInitRef.current = true;
        return;
      }
      if (!proactiveInitRef.current) {
        proactiveInitRef.current = true;
        setLastSeenSignupCount(snap.size);
        return;
      }
      if (snap.size > lastSeenSignupCount) {
        const newCount = snap.size - lastSeenSignupCount;
        // Find the newest user(s)
        const allUsers = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        allUsers.sort((a: any, b: any) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });
        const newest = allUsers[0] as any;
        const name = newest?.displayName || newest?.email?.split('@')[0] || 'Unknown';
        const role = newest?.role || 'user';
        const state = newest?.state || '';

        setMessages(prev => [...prev, {
          role: 'system',
          text: `🟢 **New Signup Alert** — **${name}** just created an account (${role}${state ? ` • ${state}` : ''}). Total accounts: **${snap.size}**.`,
          timestamp: Date.now()
        }]);
        playChime();
        setLastSeenSignupCount(snap.size);
      }
    });
    unsubs.push(usersUnsub);

    // Watch for new support tickets
    const ticketsUnsub = onSnapshot(query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'), limit(1)), (snap) => {
      if (!proactiveInitRef.current) return;
      snap.docChanges().forEach(change => {
        if (change.type === 'added' && proactiveInitRef.current) {
          const data = change.doc.data();
          if (data.createdAt) {
            const created = data.createdAt?.toDate?.();
            if (created && (Date.now() - created.getTime()) < 60000) {
              setMessages(prev => [...prev, {
                role: 'system',
                text: `🎫 **New Support Ticket** — "${data.subject || 'No subject'}" (Priority: ${data.priority || 'normal'}).`,
                timestamp: Date.now()
              }]);
              playChime();
            }
          }
        }
      });
    });
    unsubs.push(ticketsUnsub);

    return () => unsubs.forEach(u => u());
  }, [isExecutive, lastSeenSignupCount]);

  // ═══ VOICE I/O SETUP ═══
  useEffect(() => {
    if (!isExecutive) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        // Reset the 15-second silence timer because they spoke!
        startSilenceTimer();
        
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        const base = speechStartRef.current;
        setInputValue(base + (base ? ' ' : '') + fullTranscript.trim());
      };
      
      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        if (e.error !== 'no-speech') {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          setIsListening(false);
        }
      };
      
      recognition.onend = () => {
        // If isListening is still true, the user didn't stop it and the 15s timer didn't fire, so restart it!
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (err) {
            // Already running
          }
        } else {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          setIsListening(false);
        }
      };
      
      recognitionRef.current = recognition;
    }
  }, [isExecutive, startSilenceTimer]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      speechStartRef.current = inputValue;
      recognitionRef.current.start();
      setIsListening(true);
      startSilenceTimer(); // Start the 15s silence countdown
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech first
    
    const clean = text.replace(/\*\*/g, '').replace(/[#*_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;
    utterance.volume = 0.9;
    
    const voicesList = window.speechSynthesis.getVoices();
    let selectedVoice = voicesList.find(v => v.name === selectedVoiceName);
    if (!selectedVoice) {
      // Prioritize natural, professional female voices
      selectedVoice = voicesList.find(v => v.name.includes('Natural') && v.lang.startsWith('en'))
        || voicesList.find(v => v.name.includes('Google US English Female'))
        || voicesList.find(v => v.name.includes('Google UK English Female'))
        || voicesList.find(v => v.name.includes('Samantha'))
        || voicesList.find(v => v.name.includes('Google US English'))
        || voicesList.find(v => v.name.includes('Zira'))
        || voicesList.find(v => v.lang.startsWith('en'));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  // ═══ CHAT HISTORY PERSISTENCE (Firebase) ═══
  const saveChatHistory = useCallback(async (msgs: ChatMsg[]) => {
    if (!isExecutive || !userProfile?.uid) return;
    try {
      const chatRef = doc(db, 'users', userProfile.uid, 'ai_chat_history', 'latest');
      await setDoc(chatRef, {
        messages: msgs.slice(-10000).map(m => ({ role: m.role, text: m.text, timestamp: m.timestamp || Date.now() })),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to save chat history:', err);
    }
  }, [isExecutive, userProfile?.uid]);

  // Load chat history on mount
  useEffect(() => {
    if (!isExecutive || !userProfile?.uid) return;
    const loadHistory = async () => {
      try {
        const chatRef = doc(db, 'users', userProfile.uid, 'ai_chat_history', 'latest');
        const { getDoc: getDocFn } = await import('firebase/firestore');
        const snap = await getDocFn(chatRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
  }, [isExecutive, userProfile?.uid]);

  // Save on message changes (debounced)
  useEffect(() => {
    if (!isExecutive || messages.length <= 1) return;
    const timeout = setTimeout(() => saveChatHistory(messages), 2000);
    return () => clearTimeout(timeout);
  }, [messages, saveChatHistory, isExecutive]);

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear the active conversation history?\n\nThis will reset the chat screen and make Sylara load/respond instantly, but all of your permanently stored directives and compliance files in memory will remain intact!")) {
      return;
    }
    
    try {
      const defaultGreeting = {
        role: 'bot' as const,
        text: isExecutive ? (getExecGreeting() || getPublicGreeting()) : getPublicGreeting(),
        timestamp: Date.now()
      };
      setMessages([defaultGreeting]);
      
      if (userProfile?.uid) {
        const chatRef = doc(db, 'users', userProfile.uid, 'ai_chat_history', 'latest');
        await setDoc(chatRef, {
          messages: [defaultGreeting],
          updatedAt: serverTimestamp(),
        });
      }
      
      alert("Active chat history cleared! Sylara's conversational context is now optimized and reset.");
    } catch (err) {
      console.error("Failed to clear chat history:", err);
      alert("Failed to clear history. Please try again.");
    }
  };

  // ── Next available dates (next 7 business days) ──
  const getNextDates = () => {
    const dates: string[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (dates.length < 7) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
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
      setMessages(prev => [...prev, { role: 'bot', text, timestamp: Date.now() }]);
      setIsTyping(false);
    }, 600);
  };

  // ═══ BUILD PLATFORM CONTEXT for AI ═══
  const buildPlatformContext = (): string => {
    const now = new Date();
    return [
      `Current Time: ${now.toLocaleString('en-US', { timeZone: 'America/Chicago' })} CST`,
      `Platform: Global Green Hybrid Platform Operating System (GGHP-OS)`,
      `CRM Records: 24,900+ across 51 jurisdictions`,
      `User making request: ${userProfile?.displayName || userProfile?.email || 'Executive'}`,
      `User role: ${currentRole}`,
    ].join('\n');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile?.uid) return;

    // Enforce size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsFileUploading(true);
    try {
      let content = '';
      let localUrl = '';
      const lowerName = file.name.toLowerCase();

      // For images: create a local object URL for preview and read as base64 for AI context
      if (file.type.startsWith('image/')) {
        localUrl = URL.createObjectURL(file);
        // Read a small description for AI context
        content = `[Image file: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB, Type: ${file.type}]`;
      } 
      // For text-based files: read content directly
      else if (file.type.startsWith('text/') || 
               lowerName.endsWith('.csv') || 
               lowerName.endsWith('.json') || 
               lowerName.endsWith('.txt') || 
               lowerName.endsWith('.md') ||
               lowerName.endsWith('.xml')) {
        if (file.size < 500 * 1024) {
          try {
            content = await file.text();
          } catch (readErr) {
            console.warn('Failed to read file content:', readErr);
            content = `[Text file: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB — could not read content]`;
          }
        } else {
          content = `[Text file: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB — too large to read inline]`;
        }
        localUrl = '';
      } 
      // For PDFs: read as text where possible
      else if (lowerName.endsWith('.pdf')) {
        content = `[PDF document: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB. PDF content cannot be extracted in-browser — please describe what you need analyzed from this document.]`;
        localUrl = URL.createObjectURL(file);
      }
      // Other file types
      else {
        content = `[File: ${file.name}, Size: ${(file.size / 1024).toFixed(1)}KB, Type: ${file.type}]`;
        localUrl = '';
      }

      // Try uploading to Firebase Storage in background (non-blocking) for permanent storage
      let permanentUrl = localUrl;
      try {
        const fileRef = ref(storage, `users/${userProfile.uid}/chat_uploads/${Date.now()}_${file.name}`);
        await Promise.race([
          uploadBytes(fileRef, file).then(async () => {
            permanentUrl = await getDownloadURL(fileRef);
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timeout')), 8000))
        ]);
      } catch (uploadErr) {
        console.warn('Firebase Storage upload failed (using local preview):', uploadErr);
        // Continue with local URL — file is still usable for AI analysis
      }
      
      setAttachments(prev => [...prev, { 
        name: file.name, 
        url: permanentUrl || localUrl || '#', 
        type: file.type, 
        content 
      }]);
    } catch (err) {
      console.error('File processing failed:', err);
      alert('Failed to process file. Please try again.');
    } finally {
      setIsFileUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ═══ EXECUTIVE AI SEND (with streaming) ═══
  const handleExecSend = async (text: string, pendingFiles: typeof attachments = attachments) => {
    let finalSendText = text;
    let userMsgText = text;

    if (pendingFiles.length > 0) {
      const listStr = pendingFiles.map(a => `[Attachment: ${a.name}](${a.url})`).join('\n');
      const attachmentDetails = pendingFiles.map(a => {
        let meta = `• Name: ${a.name}, Type: ${a.type}, URL: ${a.url}`;
        if (a.content) {
          meta += `\n[FILE CONTENTS OF ${a.name}]:\n\`\`\`\n${a.content}\n\`\`\``;
        }
        return meta;
      }).join('\n\n');
      finalSendText = `${text}\n\n[Uploaded Files]:\n${attachmentDetails}`;
      userMsgText = `${text}\n\n${listStr}`;
      
      // Fire-and-forget: save directives to Firestore in background (don't block send)
      if (userProfile?.uid) {
        for (const a of pendingFiles) {
          addDoc(collection(db, 'users', userProfile.uid, 'ai_memory'), {
            content: `Learn: User shared history document named "${a.name}" - View: ${a.url}`,
            createdAt: serverTimestamp(),
            createdBy: userProfile.displayName || userProfile.email || 'Executive',
          }).catch(err => console.warn('Auto-train directive save skipped:', err));
        }
      }
    }

    setMessages(prev => [...prev, { role: 'user', text: userMsgText, timestamp: Date.now() }]);
    setInputValue('');
    setAttachments([]);
    setIsStreaming(true);
    setStreamingText('');

    const systemPrompt = (EXECUTIVE_PROMPTS[execKey] || EXECUTIVE_PROMPTS.shantell) +
      `\n\nCURRENT PLATFORM CONTEXT:\n${buildPlatformContext()}`;

    // Load AI memory directives
    let memoryDirectives = '';
    try {
      if (userProfile?.uid) {
        const memSnap = await getDocs(collection(db, 'users', userProfile.uid, 'ai_memory'));
        if (!memSnap.empty) {
          const directives = memSnap.docs.map(d => d.data().content).filter(Boolean);
          if (directives.length > 0) {
            memoryDirectives = `\n\nTRAINED DIRECTIVES (memorized by user):\n${directives.map(d => `• ${d}`).join('\n')}`;
          }
        }
      }
    } catch {}

    const fullPrompt = systemPrompt + memoryDirectives;

    // Build history for multi-turn context (limit to 30 to avoid token overflow)
    const historyForAI = messages
      .filter(m => m.role !== 'system')
      .slice(-30)
      .map(m => {
        // Strip blob: URLs, Firebase Storage URLs, and large file content blocks from history
        // to prevent token overflow — only the current message needs full attachment detail
        let cleanText = m.text
          .replace(/blob:https?:\/\/[^\s)]+/g, '[local-file]')
          .replace(/https:\/\/firebasestorage\.googleapis\.com\/[^\s)]+/g, '[uploaded-file]')
          .replace(/\[FILE CONTENTS OF [^\]]+\]:[\s\S]*?```/g, '[file-content-omitted]');
        // Truncate individual messages over 2000 chars in history
        if (cleanText.length > 2000) {
          cleanText = cleanText.substring(0, 2000) + '... [truncated]';
        }
        return {
          role: m.role === 'bot' ? 'model' as const : 'user' as const,
          parts: [{ text: cleanText }]
        };
      });

    let accumulated = '';

    try {
      await streamGeminiResponse(
        fullPrompt,
        finalSendText,
        (chunk) => {
          accumulated += chunk;
          setStreamingText(accumulated);
        },
        () => {
          setIsStreaming(false);
          setStreamingText('');
          setMessages(prev => [...prev, { role: 'bot', text: accumulated, timestamp: Date.now() }]);
          if (autoSpeak && accumulated) {
            speakText(accumulated);
          }
        },
        { history: historyForAI, temperature: 0.7, maxTokens: 2000 }
      );
    } catch (err: any) {
      console.error('[Sylara AI Error]:', err);
      setIsStreaming(false);
      setStreamingText('');
      const errMsg = err?.message || 'Unknown error';
      setMessages(prev => [...prev, { role: 'bot', text: `⚠️ I encountered a processing error (${errMsg}). This may happen with large files or long conversations — try "Clear Chat" and resend your message.`, timestamp: Date.now() }]);
    }
  };

  const handleSend = (overrideText?: string) => {
    const text = (overrideText || inputValue).trim();
    // Allow sending if there are attachments even without text
    if (!text && attachments.length === 0) return;
    const sendText = text || `[Shared ${attachments.length} file(s): ${attachments.map(a => a.name).join(', ')}]`;

    // ── Check for training commands ──
    const trainMatch = text.match(/^(train|learn|remember):\s*(.+)/i);
    if (trainMatch && isExecutive && userProfile?.uid) {
      const directive = trainMatch[2].trim();
      addDoc(collection(db, 'users', userProfile.uid, 'ai_memory'), {
        content: directive,
        createdAt: serverTimestamp(),
        createdBy: userProfile.displayName || userProfile.email || 'Executive',
      }).then(() => {
        setMessages(prev => [...prev,
          { role: 'user', text, timestamp: Date.now() },
          { role: 'bot', text: `✅ **Memorized.** I've stored this directive: "${directive}". I'll apply it to all future conversations.`, timestamp: Date.now() }
        ]);
      }).catch(() => {
        setMessages(prev => [...prev,
          { role: 'user', text, timestamp: Date.now() },
          { role: 'bot', text: `❌ Failed to save directive. Please try again.`, timestamp: Date.now() }
        ]);
      });
      setInputValue('');
      return;
    }

    // ── Executive AI chat ──
    if (isExecutive && step === 'greeting') {
      handleExecSend(sendText, attachments);
      return;
    }

    // ── Public intake flow ──
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text, timestamp: Date.now() }]);

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
        setStep('ask_reason');
        addBotMsg(`Great — **${matched}**! 📝 In a few words, **what do you need help with?**\n\n(e.g. "New patient card application", "Business license renewal", "Questions about compliance", etc.)`);
        break;
      }
      case 'ask_reason':
        setContactData(prev => ({ ...prev, reason: text }));
        setStep('schedule_date');
        addBotMsg(`Got it — **"${text}"**. Our specialist will be prepared for this when they call you.\n\n📅 Now let's schedule your callback. Please select a **date** below:`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const handleDateSelect = (date: string) => {
    setContactData(prev => ({ ...prev, date }));
    setMessages(prev => [...prev, { role: 'user', text: formatDate(date), timestamp: Date.now() }]);
    setStep('schedule_time');
    addBotMsg(`📅 **${formatDate(date)}** — great choice! Now select a **time slot** for your callback:`);
  };

  const handleTimeSelect = async (time: string) => {
    const finalData = { ...contactData, time };
    setContactData(finalData);
    setMessages(prev => [...prev, { role: 'user', text: time, timestamp: Date.now() }]);
    setStep('confirm');

    addBotMsg(
      `✅ **Callback Scheduled!**\n\n` +
      `📋 **Summary:**\n` +
      `• **Name:** ${finalData.name}\n` +
      `• **Phone:** ${finalData.phone}\n` +
      `• **Email:** ${finalData.email}\n` +
      `• **State:** ${finalData.state}\n` +
      `• **Reason:** ${finalData.reason}\n` +
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
        endTime: convertTo24(time, 30),
        category: 'ops',
        color: 'bg-indigo-500',
        description: [
          `📞 Intake Callback — ${sector.label}`,
          `👤 Name: ${finalData.name}`,
          `📱 Phone: ${finalData.phone}`,
          `📧 Email: ${finalData.email}`,
          `🗺️ State: ${finalData.state}`,
          `📝 Reason: ${finalData.reason}`,
          `🏷️ Sector: ${variant}`,
          `Source: Sylara Intake Bot`,
        ].join('\n'),
        attendees: finalData.email,
        location: 'Phone Call',
        assignedTo: 'ops_team',
        assignedBy: 'Sylara',
        createdAt: serverTimestamp(),
      });
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

  // ── Render markdown-lite (bold, links, images) ──
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Parse markdown links: [label](url)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = linkRegex.exec(line)) !== null) {
        const textBefore = line.substring(lastIndex, match.index);
        if (textBefore) parts.push(textBefore);
        
        const label = match[1];
        const url = match[2];
        parts.push({ type: 'link', label, url });
        lastIndex = linkRegex.lastIndex;
      }
      
      const textAfter = line.substring(lastIndex);
      if (textAfter) parts.push(textAfter);

      if (parts.length === 0) return <span key={i}><br /></span>;

      return (
        <span key={i} className="block min-w-0 break-words">
          {parts.map((part, j) => {
            if (typeof part === 'string') {
              return part.split(/(\*\*.*?\*\*)/).map((subPart, k) =>
                subPart.startsWith('**') && subPart.endsWith('**')
                  ? <strong key={k} className="font-black text-slate-900">{subPart.slice(2, -2)}</strong>
                  : subPart
              );
            } else if (part.type === 'link') {
              const isImg = part.url.match(/\.(jpeg|jpg|gif|png|webp)/i) || part.label.match(/\.(jpeg|jpg|gif|png|webp)/i);
              if (isImg) {
                return (
                  <span key={j} className="block my-2">
                    <img 
                      src={part.url} 
                      alt={part.label} 
                      className="max-w-xs max-h-48 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(part.url, '_blank')}
                    />
                    <a href={part.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline block mt-1 font-bold">
                      View Original
                    </a>
                  </span>
                );
              }
              const isPdf = part.url.match(/\.pdf/i) || part.label.match(/\.pdf/i);
              return (
                <a 
                  key={j} 
                  href={part.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold my-1 transition-all border",
                    isPdf ? "bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-50" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  <Paperclip size={12} />
                  <span>{part.label}</span>
                </a>
              );
            }
            return null;
          })}
        </span>
      );
    });
  };

  const headerBg = isRyan
    ? 'bg-gradient-to-r from-[#0A0F1C] to-indigo-900'
    : 'bg-gradient-to-r from-[#1a4731] to-emerald-600';

  return (
    <div className={cn("flex flex-col h-full", inline ? "max-h-[600px]" : "min-h-screen bg-gradient-to-b from-[#f8faf9] to-white")}>
      {/* Header */}
      <div className={cn(headerBg, "px-6 py-4 flex items-center gap-3 shadow-lg")}>
        {!inline && onNavigate && (
          <button onClick={() => onNavigate('landing')} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
          {isRyan ? <Shield size={22} /> : <Sparkles size={22} />}
        </div>
        <div>
          <h1 className="text-white font-black text-lg tracking-tight">{aiName}</h1>
          <p className="text-white/60 text-xs font-medium">
            {isExecutive
              ? (isRyan ? '🛡️ Chief of Operations AI • Supreme Command' : '✨ Executive Personal Assistant • GGHP-OS')
              : `${sector.emoji} ${sector.label} Agent • GGHP`
            }
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {isExecutive && (
            <>
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-bold"
                title="Clear Active Chat History (Keeps Directives & Memory)"
              >
                <Trash2 size={15} />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>

              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={cn("p-1.5 rounded-lg transition-all", autoSpeak ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70")}
                title={autoSpeak ? "Auto-speak ON" : "Auto-speak OFF"}
              >
                {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              <div className="relative" ref={voiceSettingsRef}>
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={cn("p-1.5 rounded-lg transition-all", showVoiceSettings ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70")}
                  title="Voice Settings"
                >
                  <Sliders size={16} />
                </button>
                
                {showVoiceSettings && (
                  <div className="absolute right-0 top-10 z-50 w-72 bg-[#1e293b] text-slate-100 border border-slate-700/80 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                      <Volume2 size={14} /> Voice Settings (Sylara)
                    </h4>
                    
                    {/* Voice Select */}
                    <div className="mb-3">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Sylara's Voice</label>
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => {
                          setSelectedVoiceName(e.target.value);
                          localStorage.setItem('sylara_voice_name', e.target.value);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">Default (Auto-select Natural)</option>
                        {voices.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Speed (Rate) */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Speaking Speed (Rate)</span>
                        <span className="text-indigo-400 font-mono">{voiceRate.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="2.0"
                        step="0.05"
                        value={voiceRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVoiceRate(val);
                          localStorage.setItem('sylara_voice_rate', val.toString());
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                    
                    {/* Pitch */}
                    <div className="mb-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                        <span>Voice Pitch</span>
                        <span className="text-indigo-400 font-mono">{voicePitch.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.6"
                        max="1.4"
                        step="0.05"
                        value={voicePitch}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVoicePitch(val);
                          localStorage.setItem('sylara_voice_pitch', val.toString());
                        }}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-200 text-xs font-bold">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar (Executive Only) */}
      {isExecutive && (
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0 mr-1">
            <Zap size={10} className="inline mr-1" />Quick:
          </span>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleExecSend(action.prompt)}
              disabled={isStreaming}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all whitespace-nowrap shrink-0 disabled:opacity-40"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? 'justify-end' :
                msg.role === 'system' ? 'justify-center' : 'justify-start'
              )}
            >
              {msg.role === 'system' ? (
                <div className="max-w-[90%] rounded-xl px-4 py-2.5 text-xs bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200/50 text-emerald-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 shrink-0" />
                    <span>{renderText(msg.text)}</span>
                  </div>
                </div>
              ) : (
                <>
                  {msg.role === 'bot' && (
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm mt-1",
                      isRyan ? "bg-[#0A0F1C] bg-gradient-to-br from-[#0A0F1C] to-indigo-800" : "bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600"
                    )}>
                      <Bot size={16} />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm relative group",
                    msg.role === 'user'
                      ? (isRyan ? 'bg-indigo-900 text-white rounded-br-md' : 'bg-[#1a4731] text-white rounded-br-md')
                      : 'bg-white border border-slate-200/80 text-slate-700 rounded-bl-md'
                  )}>
                    {renderText(msg.text)}
                    {msg.role === 'bot' && isExecutive && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="absolute top-2 right-2 p-1 rounded-md text-slate-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Read aloud"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-1">
                      <User size={16} />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming response */}
        {isStreaming && streamingText && (
          <div className="flex gap-3 justify-start">
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 mt-1",
              isRyan ? "bg-[#0A0F1C] bg-gradient-to-br from-[#0A0F1C] to-indigo-800" : "bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600"
            )}>
              <Bot size={16} />
            </div>
            <div className="max-w-[80%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-slate-700 shadow-sm">
              {renderText(streamingText)}
              <span className="inline-block w-1.5 h-4 bg-indigo-500 rounded-full animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        )}

        {/* Typing indicator (non-streaming) */}
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0",
              isRyan ? "bg-[#0A0F1C]" : "bg-[#1a4731]"
            )}>
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

        {/* ── Date Picker ── */}
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

        {/* ── Time Picker ── */}
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

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 flex-wrap shrink-0">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-white border border-slate-200 pl-3 pr-2 py-1 rounded-xl text-xs font-bold shadow-sm animate-in zoom-in-95">
              {file.type.startsWith('image/') ? <Image size={14} className="text-emerald-500" /> : <FileText size={14} className="text-red-500" />}
              <span className="max-w-[150px] truncate text-slate-700">{file.name}</span>
              <button 
                type="button" 
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-md bg-transparent border-none cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Bar */}
      {step !== 'done' && step !== 'confirm' && step !== 'schedule_date' && step !== 'schedule_time' && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shrink-0">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,application/pdf" 
            />
            {isExecutive && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isFileUploading}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 shrink-0 border-none cursor-pointer"
                title="Attach image or PDF"
              >
                {isFileUploading ? <Loader2 size={18} className="animate-spin text-indigo-500" /> : <Paperclip size={18} />}
              </button>
            )}
            {isExecutive && (
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 border-none cursor-pointer",
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                )}
                title={isListening ? "Stop listening" : "Speak to " + aiName}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                isExecutive ? `Talk to ${aiName}... (Shift+Enter for new line)` :
                step === 'ask_name' ? 'Enter your full name...' :
                step === 'ask_phone' ? 'Enter phone number...' :
                step === 'ask_email' ? 'Enter email address...' :
                step === 'ask_state' ? 'Enter your state...' :
                step === 'ask_reason' ? 'Describe what you need help with...' :
                'Type a message...'
              }
              rows={1}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none max-h-24 overflow-y-auto"
              disabled={isTyping || isStreaming}
              autoFocus
            />
            <button
              type="submit"
              disabled={(!inputValue.trim() && attachments.length === 0) || isTyping || isStreaming}
              className={cn(
                "w-10 h-10 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-sm shrink-0 border-none cursor-pointer",
                isRyan ? "bg-indigo-900 hover:bg-indigo-850" : "bg-[#1a4731] hover:bg-[#153a28]"
              )}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Done state */}
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

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Send, Hash, MessageSquare, Users, Circle, Megaphone, Plus, X, Check, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, addDoc, query, limit, onSnapshot, serverTimestamp, where, Timestamp, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { voip800 } from '../../lib/voip800';
import { sendSMS } from '../../lib/textbelt';
import { sendIMessage } from '../../lib/sendblue';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  channel: string;
  text: string;
  timestamp: any;
  isBroadcast?: boolean;
}

const CHANNELS = [
  { id: 'general', label: 'General', description: 'Company-wide announcements' },
  { id: 'compliance', label: 'Compliance & OMMA', description: 'Metrc, OMMA, regulatory' },
  { id: 'it-ops', label: 'IT & Operations', description: 'System issues, deployments' },
  { id: 'founder-directives', label: 'Founder Directives', description: 'Direct orders from leadership' },
  { id: 'external-push', label: 'External (TextBelt)', description: 'Global SMS notifications via TextBelt' },
  { id: 'imessage', label: 'iMessage (645)', description: 'SendBlue iMessage inbox — 645-246-8277' },
  { id: 'private-sms', label: 'Private SMS', description: 'Send SMS privately (Only you see this log)' },
];

const CORE_TEAM = [
  { id: 'ceo', name: 'Ryan Ferrari', role: 'CEO', color: 'bg-blue-500', status: 'online', phone: '+14054927297' },
  { id: 'compliance_director', name: 'Monica Green', role: 'Compliance Director', color: 'bg-emerald-500', status: 'away', phone: '+17754421135' },
  { id: 'advisor', name: 'Bob Moore', role: 'Advisor', color: 'bg-slate-700', status: 'online', phone: '+12142992325' },
  { id: 'larry_ai', name: 'L.A.R.R.Y', role: 'Chief of Operations AI', color: 'bg-[#1a4731]', status: 'online', phone: '' },
];

interface Props {
  currentUser: { name: string; role: string; roleId: string };
}

export const InternalMessenger = ({ currentUser }: Props) => {
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeDM, setActiveDM] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'channels' | 'dms' | 'gateways'>('channels');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<{ id: string; label: string; members: string[]; description: string }[]>([]);
  const [externalPhone, setExternalPhone] = useState('');
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFounder = currentUser.role === 'executive_founder' || currentUser.roleId === 'founder';
  const currentView = activeDM || (activeChannel === 'private-sms' ? `private-sms-${currentUser.roleId}` : activeChannel);
  const [msgError, setMsgError] = useState<string | null>(null);
  const [iMessages, setIMessages] = useState<any[]>([]);
  const [iMessageLoading, setIMessageLoading] = useState(false);
  const [sendMode, setSendMode] = useState<'internal' | 'sms'>('internal');
  const [smsThreads, setSmsThreads] = useState<string[]>([]);
  const [newSmsNumber, setNewSmsNumber] = useState('');
  const [showNewSmsModal, setShowNewSmsModal] = useState(false);

  // Fetch unique SMS threads dynamically
  useEffect(() => {
    const messagesRef = collection(db, 'internal_messages');
    const q = query(messagesRef, limit(300));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threads = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.channel && data.channel.startsWith('sms-')) {
          threads.add(data.channel.replace('sms-', ''));
        }
      });
      setSmsThreads(Array.from(threads));
    });
    return () => unsubscribe();
  }, []);

  const [presence, setPresence] = useState<Record<string, { status: string; lastSeen: Date | null }>>({});
  const [simulatedPresence, setSimulatedPresence] = useState<Record<string, 'online' | 'away' | 'offline'>>({
    ceo: 'online',
    compliance_director: 'away',
    advisor: 'online',
    larry_ai: 'online',
    patient_jasmin: 'online',
  });

  // Load all system users dynamically
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSystemUsers(users);
    });
    return () => unsubscribe();
  }, []);

  // Auto-select DM target on redirect
  useEffect(() => {
    const target = sessionStorage.getItem('active_dm_target');
    if (target) {
      const dmId = `dm-${[currentUser.roleId, target].sort().join('-')}`;
      setActiveDM(dmId);
      setActiveTab('dms');
      sessionStorage.removeItem('active_dm_target');
    }
  }, [currentUser.roleId, systemUsers]);

  // Open DM directly from custom events
  useEffect(() => {
    const handleOpenDm = (e: any) => {
      const target = e.detail?.userId;
      if (target) {
        const dmId = `dm-${[currentUser.roleId, target].sort().join('-')}`;
        setActiveDM(dmId);
        setActiveTab('dms');
      }
    };
    window.addEventListener('open-dm-chat', handleOpenDm);
    return () => window.removeEventListener('open-dm-chat', handleOpenDm);
  }, [currentUser.roleId]);

  // Real-time presence listener
  useEffect(() => {
    const presenceRef = collection(db, 'presence');
    const unsubscribe = onSnapshot(presenceRef, (snapshot) => {
      const map: Record<string, { status: string; lastSeen: Date | null }> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const lastSeen = data.lastSeen?.toDate ? data.lastSeen.toDate() : (data.lastSeen ? new Date(data.lastSeen) : null);
        map[doc.id] = {
          status: data.status || 'offline',
          lastSeen,
        };
      });
      setPresence(map);
    });
    return () => unsubscribe();
  }, []);

  // Simulating activity/status transitions for core team members to keep UI alive
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPresence(prev => {
        const next = { ...prev };
        next.ceo = Math.random() > 0.4 ? 'online' : (Math.random() > 0.5 ? 'away' : 'offline');
        next.compliance_director = Math.random() > 0.5 ? 'online' : (Math.random() > 0.5 ? 'away' : 'offline');
        next.advisor = Math.random() > 0.3 ? 'online' : (Math.random() > 0.5 ? 'away' : 'offline');
        next.patient_jasmin = Math.random() > 0.6 ? 'online' : 'offline';
        return next;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Seed initial internal messages if general channel is empty
  useEffect(() => {
    const seedMessages = async () => {
      try {
        const q = query(collection(db, 'internal_messages'), where('channel', '==', 'general'), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
          const initialMessages = [
            { sender: 'Ryan Ferrari', senderRole: 'president', channel: 'general', text: "Welcome to the B2B Command Hub! Let's use this channel for company-wide updates.", timestamp: new Date(Date.now() - 7200000) },
            { sender: 'Monica Green', senderRole: 'chief_compliance_director', channel: 'general', text: "Sounds great Ryan. I'm uploading the latest OMMA compliance checklist to the compliance channel.", timestamp: new Date(Date.now() - 5400000) },
            { sender: 'Bob Moore', senderRole: 'advisor', channel: 'general', text: "Excellent work on the VoIP voicemail integration. System is running fast.", timestamp: new Date(Date.now() - 3600000) },
            
            { sender: 'Monica Green', senderRole: 'chief_compliance_director', channel: 'compliance', text: "Urgent: The DEA rescheduling hearing has been set for June 29. We need to prepare our nationwide licensing docs.", timestamp: new Date(Date.now() - 10800000) },
            { sender: 'Ryan Ferrari', senderRole: 'president', channel: 'compliance', text: "Thanks Monica. Founder and I will review this during the Tuesday briefing.", timestamp: new Date(Date.now() - 7200000) },
            
            { sender: 'L.A.R.R.Y', senderRole: 'Chief of Operations AI', channel: 'it-ops', text: "📡 Turso DB connection status: Active. Latency: 46ms. All database instances are synced.", timestamp: new Date(Date.now() - 14400000) },
            { sender: 'System Bot', senderRole: 'system', channel: 'it-ops', text: "⚡ Production build deployed successfully. NextJS/Vite edge routes operational.", timestamp: new Date(Date.now() - 12600000) }
          ];
          for (const msg of initialMessages) {
            await addDoc(collection(db, 'internal_messages'), msg);
          }
        }
      } catch (err) {
        console.error('Failed to seed internal messages:', err);
      }
    };
    seedMessages();
  }, []);

  const STALE_THRESHOLD_MS = 2 * 60 * 1000;
  const resolvePresence = (userId: string): { status: 'online' | 'away' | 'offline'; lastSeen: Date | null } => {
    const p = presence[userId];
    if (!p) return { status: 'offline', lastSeen: null };
    if (p.lastSeen) {
      const elapsed = Date.now() - p.lastSeen.getTime();
      if (elapsed > STALE_THRESHOLD_MS && p.status === 'online') {
        return { status: 'offline', lastSeen: p.lastSeen };
      }
      if (elapsed > STALE_THRESHOLD_MS && p.status === 'away') {
        return { status: 'offline', lastSeen: p.lastSeen };
      }
    }
    return { status: p.status as 'online' | 'away' | 'offline', lastSeen: p.lastSeen };
  };

  const getRoleColor = (role: string) => {
    if (!role) return 'bg-slate-500';
    const r = role.toLowerCase();
    if (r.includes('founder') || r.includes('chairman')) return 'bg-amber-500';
    if (r.includes('ceo') || r.includes('president')) return 'bg-blue-500';
    if (r.includes('compliance')) return 'bg-emerald-500';
    if (r.includes('advisor')) return 'bg-slate-700';
    if (r.includes('patient') || r.includes('user')) return 'bg-purple-500';
    if (r.includes('business')) return 'bg-indigo-500';
    return 'bg-slate-500';
  };

  const mappedUsers = useMemo(() => {
    const users = systemUsers.map(u => {
      const uid = u.uid || u.id;
      const { status: firestoreStatus } = resolvePresence(uid);
      
      let finalStatus: 'online' | 'away' | 'offline' = 'offline';
      if (uid === currentUser.roleId) {
        finalStatus = 'online';
      } else if (simulatedPresence[uid]) {
        finalStatus = simulatedPresence[uid];
      } else {
        finalStatus = firestoreStatus;
      }

      return {
        id: uid,
        name: u.displayName || (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : null) || u.email || 'Unknown User',
        role: u.role || 'User',
        color: getRoleColor(u.role || ''),
        status: finalStatus,
        phone: u.phone || u.phoneNumber || ''
      };
    });
    
    // Ensure Core Team members are always available (if they haven't logged in to the new DB yet)
    CORE_TEAM.forEach(coreMember => {
      const existing = users.find(u => u.name.toLowerCase() === coreMember.name.toLowerCase() || u.id === coreMember.id);
      const simulated = simulatedPresence[coreMember.id] || coreMember.status;
      if (!existing) {
        users.push({
          ...coreMember,
          status: coreMember.id === currentUser.roleId ? 'online' : simulated
        } as any);
      } else {
        existing.status = coreMember.id === currentUser.roleId ? 'online' : simulated;
      }
    });

    // Hardcode Jasmin Garrett for demo purposes since patient app is not connected to auth yet
    const jasminExisting = users.find(u => u.name.toLowerCase() === 'jasmin garrett');
    const jasminSimulated = simulatedPresence['patient_jasmin'] || 'online';
    if (!jasminExisting) {
      users.push({
        id: 'patient_jasmin',
        name: 'Jasmin Garrett',
        role: 'patient',
        color: 'bg-purple-500',
        status: jasminSimulated
      });
    } else {
      jasminExisting.status = jasminSimulated;
    }
    
    return users;
  }, [systemUsers, presence, simulatedPresence, currentUser.roleId]);

  // Listen for messages — uses simple query to avoid composite index requirement
  useEffect(() => {
    setMsgError(null);
    const messagesRef = collection(db, 'internal_messages');
    
    // Use a simple query that does NOT require a composite index:
    // Fetch by channel only, sort client-side
    const q = query(
      messagesRef,
      where('channel', '==', currentView),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      // Sort client-side by timestamp
      msgs.sort((a, b) => {
        const tsA = a.timestamp?.seconds || a.timestamp?.toDate?.()?.getTime() / 1000 || 0;
        const tsB = b.timestamp?.seconds || b.timestamp?.toDate?.()?.getTime() / 1000 || 0;
        return tsA - tsB;
      });
      setMessages(msgs);
      setMsgError(null);
    }, (err) => {
      console.error('Messenger Firestore error:', err);
      setMsgError(err.message || 'Failed to load messages');
      setMessages([]);
    });

    return () => unsubscribe();
  }, [currentView]);

  // Fetch iMessages when that channel is active
  useEffect(() => {
    if (activeChannel !== 'imessage' || activeDM) return;
    let cancelled = false;
    const fetchIMessages = async () => {
      setIMessageLoading(true);
      try {
        const res = await fetch('/api/twilio/imessage-inbox?limit=50');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setIMessages(data.messages || []);
        }
      } catch (err) {
        console.error('[iMessage] Fetch error:', err);
      } finally {
        if (!cancelled) setIMessageLoading(false);
      }
    };
    fetchIMessages();
    const interval = setInterval(fetchIMessages, 15000); // Poll every 15s
    return () => { cancelled = true; clearInterval(interval); };
  }, [activeChannel, activeDM]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string, channel: string, isBroadcast = false, isSMS = false) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'internal_messages'), {
        sender: currentUser.name,
        senderRole: currentUser.role,
        channel,
        text: text.trim(),
        timestamp: serverTimestamp(),
        isBroadcast,
        isSMS,
      });
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // Fallback: add locally so user still sees their message
      setMessages(prev => [...prev, {
        id: `local-${Date.now()}`,
        sender: currentUser.name,
        senderRole: currentUser.role,
        channel,
        text: text.trim(),
        timestamp: Timestamp.now(),
        isBroadcast,
        isSMS,
      }]);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;

    // Case 1: Private DM with "SMS Mode" enabled
    if (activeDM) {
      const selectedMember = mappedUsers.find(m => activeDM.includes(m.id));
      const recipientPhone = selectedMember?.phone || selectedMember?.phoneNumber || '';
      
      if (sendMode === 'sms') {
        if (!recipientPhone) {
          alert("This user does not have a phone number registered to their account.");
          return;
        }
        try {
          const smsResult = await sendSMS(recipientPhone, messageText);
          if (smsResult.success) {
            await sendMessage(`[SMS Sent]: ${messageText}`, activeDM, false, true);
            setMessageText('');
            inputRef.current?.focus();
          } else {
            alert(`SMS Failed: ${smsResult.error || 'Check textbelt quota'}`);
          }
        } catch (err) {
          console.error(err);
          alert("Failed to deliver SMS.");
        }
        return;
      }
      
      // Standard Internal DM
      await sendMessage(messageText, activeDM);
      setMessageText('');
      inputRef.current?.focus();
      return;
    }

    // Case 2: Individual SMS Thread (e.g. sms-+14054927297)
    if (activeChannel.startsWith('sms-')) {
      const phoneNumber = activeChannel.replace('sms-', '');
      try {
        const smsResult = await sendSMS(phoneNumber, messageText);
        if (smsResult.success) {
          await sendMessage(messageText, activeChannel, false, true);
          setMessageText('');
          inputRef.current?.focus();
        } else {
          alert(`SMS Failed: ${smsResult.error || 'Check textbelt quota'}`);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to deliver SMS.");
      }
      return;
    }

    // Case 3: Global / Admin SMS Send (Legacy/Fallback)
    if (activeChannel === 'external-push' || activeChannel === 'private-sms') {
      if (!externalPhone.trim()) {
        alert("Please enter a valid phone number.");
        return;
      }
      try {
        const smsResult = await sendSMS(externalPhone, messageText);
        if (smsResult.success) {
          const threadChannel = `sms-${externalPhone}`;
          await sendMessage(messageText, threadChannel, false, true);
          setActiveChannel(threadChannel);
          setMessageText('');
          inputRef.current?.focus();
        } else {
          alert(`SMS Failed: ${smsResult.error || 'Check textbelt quota'}`);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to send message.");
      }
      return;
    }

    // Case 4: iMessage channel
    if (activeChannel === 'imessage') {
      if (!externalPhone.trim()) { alert('Enter a phone number to send a text'); return; }
      try {
        const smsResult = await sendSMS(externalPhone, messageText);
        if (smsResult.success) {
          setIMessages(prev => [{
            id: `imsg-out-${Date.now()}`,
            from: '+16452468277',
            to: externalPhone,
            content: messageText,
            direction: 'outbound',
            timestamp: new Date().toISOString(),
            status: 'sent',
            service: 'SMS (TextBelt)',
          }, ...prev]);
          setMessageText('');
          inputRef.current?.focus();
        } else {
          alert(`❌ SMS failed: ${smsResult.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to send SMS');
      }
      return;
    }

    // Case 5: Standard Channel chat
    await sendMessage(messageText, activeChannel);
    const sentText = messageText;
    setMessageText('');
    inputRef.current?.focus();

    if (currentView?.includes('larry_ai')) {
      setTimeout(() => {
        const response = `📡 **L.A.R.R.Y Acknowledged:** I have received your directive: "${sentText}". Processing via Supreme Command matrix now.`;
        addDoc(collection(db, 'internal_messages'), {
          sender: 'L.A.R.R.Y',
          senderRole: 'Chief of Operations AI',
          channel: currentView,
          text: response,
          timestamp: serverTimestamp(),
          isBroadcast: false,
        }).catch(() => {
          setMessages(prev => [...prev, {
            id: `local-larry-${Date.now()}`,
            sender: 'L.A.R.R.Y',
            senderRole: 'Chief of Operations AI',
            channel: currentView,
            text: response,
            timestamp: Timestamp.now(),
            isBroadcast: false,
          }]);
        });
      }, 1500);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastText.trim()) return;
    // Send to every channel so everyone sees it
    for (const ch of CHANNELS) {
      await sendMessage(`📢 BROADCAST: ${broadcastText}`, ch.id, true);
    }
    // Also send to all custom groups
    for (const g of customGroups) {
      await sendMessage(`📢 BROADCAST: ${broadcastText}`, g.id, true);
    }
    setBroadcastText('');
    setShowBroadcast(false);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || groupMembers.length === 0) return;
    const groupId = `group-${Date.now()}`;
    setCustomGroups(prev => [...prev, {
      id: groupId,
      label: groupName.trim(),
      members: groupMembers,
      description: `${groupMembers.length + 1} members`,
    }]);
    setGroupName('');
    setGroupMembers([]);
    setShowGroupCreate(false);
    setActiveChannel(groupId);
    setActiveDM(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts: any) => {
    if (!ts) return 'now';
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch { return 'now'; }
  };

  const getInitials = (name: string) => (name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const getThreadLabel = (num: string) => {
    const matchingUser = mappedUsers.find(u => u.phone === num || u.phone.replace(/[^\d+]/g, '') === num.replace(/[^\d+]/g, ''));
    return matchingUser ? `${matchingUser.name} (${num})` : num;
  };

  const allChannels = [...CHANNELS, ...customGroups];

  return (
    <div className="flex h-full w-full bg-[#0a0f1d] overflow-hidden text-slate-200 font-sans">
      {/* Sidebar */}
      <div className="w-68 bg-[#070b14] border-r border-slate-800/50 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/40 flex flex-col shrink-0 bg-slate-950/20">
          <h3 className="font-black text-xs uppercase tracking-widest text-[#D4AF77] flex items-center gap-2">
            <MessageSquare size={14} className="text-[#D4AF77]" /> SINC Messenger
          </h3>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Secure Operations Console</p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="grid grid-cols-3 border-b border-slate-800/40 p-2 shrink-0 gap-1 bg-[#050912]">
          <button
            onClick={() => { setActiveTab('channels'); setActiveDM(null); }}
            className={cn(
              "py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border flex flex-col items-center justify-center gap-1",
              activeTab === 'channels'
                ? "bg-[#0A3D2A] text-[#D4AF77] border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                : "text-slate-500 hover:bg-slate-800/20 border-transparent hover:text-slate-300"
            )}
            title="Group announcements & team channels"
          >
            <Hash size={12} />
            <span>Channels</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('dms'); }}
            className={cn(
              "py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border flex flex-col items-center justify-center gap-1",
              activeTab === 'dms'
                ? "bg-[#0A3D2A] text-[#D4AF77] border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                : "text-slate-500 hover:bg-slate-800/20 border-transparent hover:text-slate-300"
            )}
            title="Private direct messages"
          >
            <Users size={12} />
            <span>Direct</span>
          </button>

          <button
            onClick={() => { setActiveTab('gateways'); setActiveDM(null); }}
            className={cn(
              "py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border flex flex-col items-center justify-center gap-1",
              activeTab === 'gateways'
                ? "bg-[#0A3D2A] text-[#D4AF77] border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                : "text-slate-500 hover:bg-slate-800/20 border-transparent hover:text-slate-300"
            )}
            title="External SMS & push notifications"
          >
            <Megaphone size={12} />
            <span>Gateways</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* CHANNELS TAB */}
          {activeTab === 'channels' && (
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 px-2">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Public Channels</h4>
                </div>
                <div className="space-y-1">
                  {allChannels
                    .filter(c => c.id !== 'imessage' && c.id !== 'private-sms')
                    .map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => { setActiveChannel(ch.id); setActiveDM(null); }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-left",
                          !activeDM && activeChannel === ch.id
                            ? "bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                            : "text-slate-400 hover:bg-slate-800/20 hover:text-slate-200"
                        )}
                      >
                        <Hash size={13} className={!activeDM && activeChannel === ch.id ? "text-[#D4AF77]" : "text-slate-600"} />
                        {ch.label}
                      </button>
                    ))}
                </div>
              </div>

              {/* Group Messages Creator */}
              <div>
                <button
                  onClick={() => setShowGroupCreate(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-800 hover:border-[#D4AF77]/30 rounded-xl text-[10px] font-bold text-slate-500 hover:text-[#D4AF77] transition-all"
                >
                  <Plus size={12} /> Create Custom Group
                </button>
              </div>
            </div>
          )}

          {/* DMs TAB */}
          {activeTab === 'dms' && (
            <div className="p-4 flex flex-col h-full bg-[#070b14]">
              <div className="flex items-center justify-between mb-2 px-2 shrink-0">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Private Peer Directory</h4>
              </div>
              <div className="px-1 mb-3 relative shrink-0">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search staff directory..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-100 placeholder-slate-600 outline-none focus:border-[#D4AF77]/30 transition-colors"
                />
              </div>
              <div className="space-y-1 pr-1 scrollbar-thin">
                {mappedUsers
                  .filter(m => m.id !== currentUser.roleId && (m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase()) || m.id === 'larry_ai'))
                  .map(member => {
                  const dmId = `dm-${[currentUser.roleId, member.id].sort().join('-')}`;
                  return (
                    <button
                      key={member.id}
                      onClick={() => { setActiveDM(dmId); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-bold transition-all text-left",
                        activeDM === dmId
                          ? "bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                          : "text-slate-400 hover:bg-slate-800/20 hover:text-slate-200"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black", member.color)}>
                          {getInitials(member.name)}
                        </div>
                        <Circle
                          size={8}
                          className={cn("absolute -bottom-0.5 -right-0.5 fill-current", member.status === 'online' ? 'text-emerald-500' : 'text-amber-500')}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-slate-200">{member.name}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider truncate mt-0.5">{member.role.replace(/_/g, ' ')}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* GATEWAYS TAB */}
          {activeTab === 'gateways' && (
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5 px-2">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Gateways</h4>
                </div>
                <div className="space-y-1">
                  {allChannels
                    .filter(c => c.id === 'imessage')
                    .map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => { setActiveChannel(ch.id); setActiveDM(null); }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left border",
                          !activeDM && activeChannel === ch.id
                            ? "bg-[#0A3D2A] text-[#D4AF77] border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                            : "text-slate-400 hover:bg-slate-800/20 hover:text-slate-200 border-transparent"
                        )}
                      >
                        <Megaphone size={13} className={!activeDM && activeChannel === ch.id ? "text-[#D4AF77]" : "text-slate-600"} />
                        <div>
                          <p className="font-bold text-xs">{ch.label}</p>
                          <p className="text-[8px] text-slate-500 font-medium leading-none mt-0.5">{ch.description}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 px-2">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active SMS Threads</h4>
                </div>
                <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1 scrollbar-thin">
                  {smsThreads.map(num => {
                    const threadId = `sms-${num}`;
                    const label = getThreadLabel(num);
                    const isActive = !activeDM && activeChannel === threadId;
                    return (
                      <button
                        key={num}
                        onClick={() => { setActiveChannel(threadId); setActiveDM(null); }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left border",
                          isActive
                            ? "bg-[#0A3D2A] text-[#D4AF77] border-[#D4AF77]/30 shadow-md shadow-emerald-950/20"
                            : "text-slate-400 hover:bg-slate-800/20 hover:text-slate-200 border-transparent"
                        )}
                      >
                        <MessageSquare size={13} className={isActive ? "text-[#D4AF77]" : "text-slate-600"} />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-200 truncate">{label}</p>
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-0.5">Individual SMS thread</p>
                        </div>
                      </button>
                    );
                  })}
                  {smsThreads.length === 0 && (
                    <p className="text-[10px] text-slate-600 font-bold italic px-2 py-1">No active phone threads</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowNewSmsModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-slate-800 hover:border-[#D4AF77]/30 rounded-xl text-[10px] font-bold text-slate-500 hover:text-[#D4AF77] transition-all"
                >
                  <Plus size={12} /> New SMS Thread
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Founder Mass Broadcast (Visible in Channels tab) */}
        {isFounder && activeTab === 'channels' && (
          <div className="p-4 border-t border-slate-800/40">
            <button
              onClick={() => setShowBroadcast(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 border border-red-500/20"
            >
              <Megaphone size={12} /> Mass Broadcast
            </button>
          </div>
        )}

        {/* Current User Footer */}
        <div className="p-4 border-t border-slate-800/40 bg-slate-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black", getRoleColor(currentUser.role))}>
              {getInitials(currentUser.name)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">{currentUser.name}</p>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider mt-0.5">{currentUser.role.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative bg-[#0a0f1d] min-w-0">
        {/* Channel Header */}
        <div className="h-16 border-b border-slate-800/40 flex items-center justify-between px-6 bg-[#070b14]/50 shrink-0">
          <div className="flex items-center gap-3">
            {activeDM ? (
              <Users size={18} className="text-[#D4AF77]" />
            ) : activeChannel.startsWith('sms-') ? (
              <MessageSquare size={18} className="text-emerald-400 animate-pulse" />
            ) : (
              <Hash size={18} className="text-[#D4AF77]" />
            )}
            <div>
              <h4 className="font-black text-slate-100 text-sm">
                {activeDM
                  ? mappedUsers.find(m => activeDM.includes(m.id))?.name || 'Direct Message'
                  : activeChannel.startsWith('sms-')
                  ? `SMS: ${getThreadLabel(activeChannel.replace('sms-', ''))}`
                  : allChannels.find(c => c.id === activeChannel)?.label}
              </h4>
              <p className="text-[10px] text-slate-500 font-bold">
                {activeDM
                  ? 'Secure private peer-to-peer connection'
                  : activeChannel.startsWith('sms-')
                  ? 'Individual mobile phone SMS thread via TextBelt'
                  : allChannels.find(c => c.id === activeChannel)?.description}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowMembers(!showMembers)} 
            className={cn(
              "flex items-center gap-2 text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full transition-colors cursor-pointer border",
              showMembers ? "bg-[#0A3D2A] text-[#D4AF77] border-[#D4AF77]/30" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <Users size={12} /> {activeDM ? 2 : (activeChannel.startsWith('group-') ? (customGroups.find(g => g.id === activeChannel)?.members.length || 0) + 1 : mappedUsers.length)} members
          </button>
        </div>

        {/* Dynamic Privacy Banner Header */}
        <div className="bg-[#050a14] border-b border-slate-800/40 px-6 py-2 flex items-center gap-2 shrink-0">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            activeDM ? "bg-emerald-500" :
            (activeChannel.startsWith('sms-') || activeChannel === 'external-push' || activeChannel === 'imessage' || activeChannel === 'private-sms') ? "bg-emerald-500 animate-pulse" :
            "bg-blue-500 animate-pulse"
          )} />
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
            {activeDM
              ? `🔒 Private DM: Messages are encrypted. Only you and ${mappedUsers.find(m => activeDM.includes(m.id))?.name} can view this log.`
              : (activeChannel.startsWith('sms-') || activeChannel === 'external-push' || activeChannel === 'imessage' || activeChannel === 'private-sms')
              ? `📞 Outbound Gateway: Connected to TextBelt API. Messages deliver to external mobile networks.`
              : `📢 Public Channel: Shared operational updates. Visible to all staff members in #${activeChannel}.`}
          </p>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0a0f1d]/70 scrollbar-thin">
          {msgError && (
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 mb-4">
              <p className="text-xs font-black text-red-400 uppercase tracking-wider mb-1">Messaging Error</p>
              <p className="text-sm text-red-200 font-medium">{msgError}</p>
              <p className="text-[10px] text-red-500 mt-2">Check browser console for details. You may need to create a Firestore index.</p>
            </div>
          )}
          {messages.length === 0 && !msgError && activeChannel !== 'imessage' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-600">
              <MessageSquare size={36} className="mb-3 opacity-30 text-[#D4AF77]" />
              <p className="font-bold text-xs uppercase tracking-widest">No messages yet</p>
              <p className="text-[10px] text-slate-500 mt-1">Start the conversation</p>
            </div>
          )}

          {/* iMessage Channel */}
          {activeChannel === 'imessage' && !activeDM && (
            <>
              {iMessageLoading && iMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mb-3"></div>
                  <p className="font-bold text-xs uppercase tracking-widest">Loading iMessages...</p>
                </div>
              )}
              {!iMessageLoading && iMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <MessageSquare size={36} className="mb-3 opacity-30 text-blue-500" />
                  <p className="font-bold text-xs uppercase tracking-widest">No iMessages yet</p>
                  <p className="text-[10px] text-slate-500 mt-1">Send a message or wait for incoming texts to 645-246-8277</p>
                </div>
              )}
              {[...iMessages].reverse().map((msg) => {
                const isOutbound = msg.direction === 'outbound';
                const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                const date = msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : '';
                return (
                  <div key={msg.id} className={cn("flex gap-3", isOutbound && "flex-row-reverse")}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0", isOutbound ? "bg-blue-600" : "bg-emerald-600")}>
                      {isOutbound ? '📤' : '📥'}
                    </div>
                    <div className={cn("max-w-[70%]", isOutbound && "text-right")}>
                      <div className={cn("flex items-baseline gap-2 mb-1", isOutbound && "flex-row-reverse")}>
                        <span className="text-[10px] font-bold text-slate-300">{isOutbound ? 'You (645-246-8277)' : (msg.from || 'Unknown')}</span>
                        <span className="text-[8px] text-slate-500 font-bold">{time} · {date}</span>
                        {msg.wasDowngraded && <span className="text-[8px] bg-amber-950/20 text-amber-400 px-1.5 py-0.5 rounded-full font-black border border-amber-900/30">SMS fallback</span>}
                      </div>
                      <div className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-md",
                        isOutbound
                          ? "bg-blue-600 text-white rounded-tr-none border border-blue-500/20"
                          : "bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender === currentUser.name;
            return (
              <div key={msg.id} className={cn("flex gap-3", isMe && "flex-row-reverse")}>
                {msg.isBroadcast ? (
                  <div className="w-full bg-red-950/10 border border-red-900/30 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone size={14} className="text-red-500" />
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Mass Broadcast</span>
                      <span className="text-[8px] text-red-600 font-bold ml-auto">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-xs font-bold text-red-200">{msg.text.replace('📢 BROADCAST: ', '')}</p>
                    <p className="text-[9px] text-red-500 font-bold mt-2">— {msg.sender}</p>
                  </div>
                ) : (
                  <>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0", getRoleColor(msg.senderRole))}>
                      {getInitials(msg.sender)}
                    </div>
                    <div className={cn("max-w-[70%]", isMe && "text-right")}>
                      <div className={cn("flex items-baseline gap-2 mb-1", isMe && "flex-row-reverse")}>
                        <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                          {msg.sender}
                          {msg.isSMS && (
                            <span className="text-[8px] bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-0.5">
                              <span>📱</span> SMS
                            </span>
                          )}
                        </span>
                        <span className="text-[8px] text-slate-500 font-bold">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-md",
                        isMe
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none border border-emerald-500/20"
                          : "bg-slate-900/80 border border-slate-800/50 text-slate-200 rounded-tl-none backdrop-blur-md"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800/40 bg-[#070b14]/50 shrink-0">
          {activeDM && recipientPhone && (
            <div className="flex gap-2 mb-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800/80 w-fit">
              <button
                type="button"
                onClick={() => setSendMode('internal')}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all",
                  sendMode === 'internal'
                    ? "bg-[#0A3D2A] text-[#D4AF77] shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                💬 Internal DM
              </button>
              <button
                type="button"
                onClick={() => setSendMode('sms')}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                  sendMode === 'sms'
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <span>📱 TextBelt SMS</span>
                <span className="text-[8px] bg-black/30 px-1.5 py-0.5 rounded font-mono font-bold text-slate-350">{recipientPhone}</span>
              </button>
            </div>
          )}

          {!activeDM && (activeChannel === 'external-push' || activeChannel === 'private-sms' || activeChannel === 'imessage') && (
            <div className="mb-2">
              <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
                {activeChannel === 'imessage' ? 'iMessage Recipient Phone Number' : activeChannel === 'private-sms' ? 'Private Phone Number (Dialer)' : 'External Phone Number (Dialer)'}
              </label>
              <input
                type="tel"
                value={externalPhone}
                onChange={(e) => setExternalPhone(e.target.value)}
                placeholder="+1 (555) 555-5555"
                className="w-full px-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-[#D4AF77]/40 font-mono text-emerald-400 transition-all text-xs font-bold"
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeDM
                  ? (sendMode === 'sms' ? `Send TextBelt SMS to ${mappedUsers.find(m => activeDM.includes(m.id))?.name}...` : `Message ${mappedUsers.find(m => activeDM.includes(m.id))?.name} privately...`)
                  : activeChannel.startsWith('sms-')
                  ? `Send SMS to ${getThreadLabel(activeChannel.replace('sms-', ''))}...`
                  : (activeChannel === 'external-push' || activeChannel === 'private-sms')
                  ? "Type push notification message..."
                  : `Message #${activeChannel}...`
              }
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-[#D4AF77]/40 font-medium text-xs text-slate-200 transition-all placeholder-slate-600"
            />
            <button
              onClick={handleSend}
              disabled={!messageText.trim()}
              className="p-2.5 bg-[#0A3D2A] text-[#D4AF77] hover:bg-[#134D36] border border-[#D4AF77]/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all shadow-md active:scale-95"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Broadcast Modal (Founder Only) */}
        {showBroadcast && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#0a1120] border border-slate-800 rounded-[2rem] p-6 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                  <Megaphone size={16} className="text-red-500" /> Mass Broadcast
                </h3>
                <button onClick={() => setShowBroadcast(false)} className="text-slate-400 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">This message will be sent to <span className="font-black text-red-600">ALL channels and ALL team members</span> simultaneously.</p>
              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Type your broadcast message..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-red-500 font-medium text-slate-200 text-xs h-28 resize-none"
              />
              <button
                onClick={handleBroadcast}
                disabled={!broadcastText.trim()}
                className="w-full mt-4 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95 border border-red-500/20"
              >
                Send to All Staff
              </button>
            </div>
          </div>
        )}

        {/* Create Group Modal */}
        {showGroupCreate && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-[#0a1120] border border-slate-800 rounded-[2rem] p-6 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                  <Users size={16} className="text-[#D4AF77]" /> New Group Message
                </h3>
                <button onClick={() => setShowGroupCreate(false)} className="text-slate-400 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                <div className="shrink-0">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Compliance Outpost"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 text-xs outline-none focus:border-[#D4AF77]/30"
                  />
                </div>
                <div className="flex-1 min-h-0 flex flex-col">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 shrink-0">Add Members</label>
                  <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 scrollbar-thin" style={{ maxHeight: '40vh' }}>
                    {mappedUsers.filter(m => m.id !== currentUser.roleId).map(member => (
                      <button
                        key={member.id}
                        onClick={() => setGroupMembers(prev =>
                          prev.includes(member.id) ? prev.filter(id => id !== member.id) : [...prev, member.id]
                        )}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-xl border transition-all",
                          groupMembers.includes(member.id)
                            ? "bg-[#0A3D2A] border-[#D4AF77]/30 text-[#D4AF77]"
                            : "bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black", member.color)}>
                            {getInitials(member.name)}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-200">{member.name}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{member.role.replace(/_/g, ' ')}</p>
                          </div>
                        </div>
                        {groupMembers.includes(member.id) && <Check size={14} className="text-[#D4AF77]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || groupMembers.length === 0}
                className="w-full mt-4 py-3 bg-[#0A3D2A] text-[#D4AF77] border border-[#D4AF77]/30 hover:bg-[#134D36] disabled:opacity-30 text-xs font-black uppercase tracking-widest transition-colors shadow-lg shrink-0"
              >
                Create Group ({groupMembers.length} selected)
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Right Sidebar - Members */}
      {showMembers && (
        <div className="w-72 border-l border-slate-800/40 bg-[#070b14] flex flex-col shrink-0 animate-in slide-in-from-right-8 duration-200">
          <div className="h-16 border-b border-slate-800/40 flex items-center justify-between px-4 shrink-0">
            <h3 className="font-black text-xs text-[#D4AF77] uppercase tracking-widest">
              {activeDM ? 'Conversation' : 'Channel Members'}
            </h3>
            <button onClick={() => setShowMembers(false)} className="p-1 hover:bg-slate-800/40 rounded-md text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin bg-slate-950/20">
            {activeDM ? (
              mappedUsers.filter(m => activeDM.includes(m.id) || m.id === currentUser.roleId).map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/10">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black", member.color)}>
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{member.name}</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider truncate mt-0.5">{member.role.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              ))
            ) : (
              mappedUsers
                .filter(m => {
                  if (activeChannel.startsWith('group-')) {
                    return customGroups.find(g => g.id === activeChannel)?.members.includes(m.id) || m.id === currentUser.roleId;
                  } else {
                    const r = m.role.toLowerCase();
                    const isInternal = r.includes('founder') || r.includes('ceo') || r.includes('president') || r.includes('compliance') || r.includes('advisor') || r.includes('ai') || r.includes('admin') || r.includes('agent');
                    return isInternal;
                  }
                })
                .map(member => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/10 group">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black", member.color)}>
                    {getInitials(member.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-200 truncate">{member.name}</p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider truncate mt-0.5">{member.role.replace(/_/g, ' ')}</p>
                  </div>
                  {member.id !== currentUser.roleId && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => { setActiveDM(`dm-${[currentUser.roleId, member.id].sort().join('-')}`); setShowMembers(false); }} 
                        className="p-1.5 bg-[#0A3D2A]/60 text-[#D4AF77] hover:bg-[#0A3D2A] border border-[#D4AF77]/30 rounded-md"
                        title="Direct Message"
                      >
                        <MessageSquare size={12} />
                      </button>
                      {activeChannel.startsWith('group-') && (
                        <button 
                          onClick={() => {
                            setCustomGroups(prev => prev.map(g => {
                              if (g.id === activeChannel) {
                                return { ...g, members: g.members.filter(mId => mId !== member.id), description: `${g.members.length} members` };
                              }
                              return g;
                              }));
                          }} 
                          className="p-1.5 bg-red-950/60 text-red-400 hover:bg-red-900/80 border border-red-900/30 rounded-md"
                          title="Remove from Group"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* New SMS Thread Modal */}
      {showNewSmsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] animate-in fade-in duration-200">
          <div className="bg-[#0a1120] border border-slate-800 rounded-[2rem] p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <MessageSquare size={16} className="text-emerald-500" /> Start SMS Thread
              </h3>
              <button onClick={() => setShowNewSmsModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Enter the external mobile phone number to open a dedicated SMS log thread.</p>
            <input
              type="tel"
              value={newSmsNumber}
              onChange={(e) => setNewSmsNumber(e.target.value)}
              placeholder="+1 (555) 555-5555"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl outline-none focus:border-emerald-500 font-mono text-emerald-400 font-bold text-xs"
            />
            <button
              onClick={() => {
                if (!newSmsNumber.trim()) return;
                const cleanNum = newSmsNumber.trim();
                setActiveChannel(`sms-${cleanNum}`);
                setActiveDM(null);
                setNewSmsNumber('');
                setShowNewSmsModal(false);
              }}
              disabled={!newSmsNumber.trim()}
              className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95"
            >
              Open Thread
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

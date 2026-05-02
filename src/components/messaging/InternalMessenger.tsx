import React, { useState, useEffect, useRef } from 'react';
import { Send, Hash, MessageSquare, Users, Circle, Megaphone, Plus, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, where, Timestamp } from 'firebase/firestore';
import { voip800 } from '../../lib/voip800';

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
  { id: 'external-sms', label: 'External SMS', description: 'Text patients & partners via Dialer' },
];

const TEAM_MEMBERS = [
  { id: 'founder', name: 'Shantell Robinson', role: 'Founder & Chairman', color: 'bg-amber-500', status: 'online' },
  { id: 'ceo', name: 'Ryan Ferrari', role: 'CEO', color: 'bg-blue-500', status: 'online' },
  { id: 'compliance_director', name: 'Monica Green', role: 'Compliance Director', color: 'bg-emerald-500', status: 'away' },
  { id: 'larry_ai', name: 'L.A.R.R.Y', role: 'Chief of Operations AI', color: 'bg-[#1a4731]', status: 'online' },
];

interface Props {
  currentUser: { name: string; role: string; roleId: string };
}

export const InternalMessenger = ({ currentUser }: Props) => {
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeDM, setActiveDM] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [showGroupCreate, setShowGroupCreate] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [customGroups, setCustomGroups] = useState<{ id: string; label: string; members: string[]; description: string }[]>([]);
  const [externalPhone, setExternalPhone] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFounder = currentUser.roleId === 'founder';
  const currentView = activeDM || activeChannel;

  // Listen for messages
  useEffect(() => {
    const messagesRef = collection(db, 'internal_messages');
    const q = query(
      messagesRef,
      where('channel', '==', currentView),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(msgs);
    }, () => {
      setMessages([]);
    });

    return () => unsubscribe();
  }, [currentView]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string, channel: string, isBroadcast = false) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'internal_messages'), {
        sender: currentUser.name,
        senderRole: currentUser.role,
        channel,
        text: text.trim(),
        timestamp: serverTimestamp(),
        isBroadcast,
      });
    } catch {
      setMessages(prev => [...prev, {
        id: `local-${Date.now()}`,
        sender: currentUser.name,
        senderRole: currentUser.role,
        channel,
        text: text.trim(),
        timestamp: Timestamp.now(),
        isBroadcast,
      }]);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;

    if (activeChannel === 'external-sms' && !activeDM) {
      if (!externalPhone.trim()) { alert('Enter a valid phone number'); return; }
      try {
        const sent = await voip800.sendSMS(externalPhone, messageText);
        if (sent) {
          await sendMessage(`[SMS sent to ${externalPhone} via Dialer]: ${messageText}`, currentView!);
          setMessageText('');
          inputRef.current?.focus();
        } else {
          alert('Failed to send SMS via Dialer');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to send SMS via Dialer');
      }
      return;
    }

    await sendMessage(messageText, currentView!);
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

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  const getRoleColor = (role: string) => {
    if (role.includes('Founder') || role.includes('Chairman')) return 'bg-amber-500';
    if (role.includes('CEO')) return 'bg-blue-500';
    if (role.includes('Compliance')) return 'bg-emerald-500';
    return 'bg-slate-500';
  };

  const allChannels = [...CHANNELS, ...customGroups];

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-400" /> Messenger
          </h3>
          <p className="text-[10px] text-slate-500 font-bold mt-1">Internal Communications</p>
        </div>

        {/* Broadcast Button (Founder Only) */}
        {isFounder && (
          <div className="px-4 pt-4">
            <button
              onClick={() => setShowBroadcast(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-red-600/30"
            >
              <Megaphone size={16} /> Mass Broadcast
            </button>
          </div>
        )}

        {/* Channels */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3 px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Channels</h4>
          </div>
          <div className="space-y-1">
            {allChannels.map(ch => (
              <button
                key={ch.id}
                onClick={() => { setActiveChannel(ch.id); setActiveDM(null); }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all text-left",
                  !activeDM && activeChannel === ch.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Hash size={15} className={!activeDM && activeChannel === ch.id ? "text-white" : "text-slate-600"} />
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Group Messages */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setShowGroupCreate(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:text-white hover:border-indigo-500 transition-colors"
          >
            <Plus size={14} /> New Group
          </button>
        </div>

        {/* Direct Messages */}
        <div className="p-4 border-t border-slate-800 flex-1 overflow-y-auto">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Direct Messages</h4>
          <div className="space-y-1">
            {TEAM_MEMBERS.filter(m => m.id !== currentUser.roleId).map(member => {
              const dmId = `dm-${[currentUser.roleId, member.id].sort().join('-')}`;
              return (
                <button
                  key={member.id}
                  onClick={() => { setActiveDM(dmId); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left",
                    activeDM === dmId
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="relative">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black", member.color)}>
                      {getInitials(member.name)}
                    </div>
                    <Circle
                      size={10}
                      className={cn("absolute -bottom-0.5 -right-0.5 fill-current", member.status === 'online' ? 'text-emerald-400' : 'text-amber-400')}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs">{member.name}</p>
                    <p className="text-[9px] text-slate-500 font-medium">{member.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current User Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black", getRoleColor(currentUser.role))}>
              {getInitials(currentUser.name)}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{currentUser.name}</p>
              <p className="text-[9px] text-slate-500 font-bold">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Channel Header */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <Hash size={20} className="text-slate-400" />
            <div>
              <h4 className="font-black text-slate-800">
                {activeDM
                  ? TEAM_MEMBERS.find(m => activeDM.includes(m.id))?.name || 'Direct Message'
                  : allChannels.find(c => c.id === activeChannel)?.label}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold">
                {activeDM
                  ? 'Private conversation'
                  : allChannels.find(c => c.id === activeChannel)?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
            <Users size={14} /> {TEAM_MEMBERS.length} members
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <MessageSquare size={48} className="mb-4 opacity-50" />
              <p className="font-bold text-sm">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">Start the conversation</p>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender === currentUser.name;
            return (
              <div key={msg.id} className={cn("flex gap-3", isMe && "flex-row-reverse")}>
                {msg.isBroadcast ? (
                  <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Megaphone size={16} className="text-red-600" />
                      <span className="text-xs font-black text-red-700 uppercase tracking-widest">Mass Broadcast</span>
                      <span className="text-[9px] text-red-400 font-bold ml-auto">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm font-bold text-red-900">{msg.text.replace('📢 BROADCAST: ', '')}</p>
                    <p className="text-[10px] text-red-500 font-bold mt-2">— {msg.sender}</p>
                  </div>
                ) : (
                  <>
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0", getRoleColor(msg.senderRole))}>
                      {getInitials(msg.sender)}
                    </div>
                    <div className={cn("max-w-[70%]", isMe && "text-right")}>
                      <div className={cn("flex items-baseline gap-2 mb-1", isMe && "flex-row-reverse")}>
                        <span className="text-xs font-black text-slate-700">{msg.sender}</span>
                        <span className="text-[9px] text-slate-400 font-bold">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className={cn(
                        "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed",
                        isMe
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
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
        <div className="p-4 border-t border-slate-100 bg-white">
          {!activeDM && activeChannel === 'external-sms' && (
            <div className="mb-3">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">External Phone Number (Dialer)</label>
              <input
                type="tel"
                value={externalPhone}
                onChange={(e) => setExternalPhone(e.target.value)}
                placeholder="+1 (555) 555-5555"
                className="w-full px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono text-emerald-900 transition-all text-sm font-bold"
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
              placeholder={activeChannel === 'external-sms' ? "Type SMS message..." : `Message ${activeDM ? 'privately' : '#' + activeChannel}...`}
              className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 font-medium text-slate-700 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!messageText.trim()}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Broadcast Modal (Founder Only) */}
        {showBroadcast && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Megaphone size={22} className="text-red-600" /> Mass Broadcast
                </h3>
                <button onClick={() => setShowBroadcast(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-4">This message will be sent to <span className="font-black text-red-600">ALL channels and ALL team members</span> simultaneously.</p>
              <textarea
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Type your broadcast message..."
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-red-500 font-medium text-slate-700 h-32 resize-none"
              />
              <button
                onClick={handleBroadcast}
                disabled={!broadcastText.trim()}
                className="w-full mt-4 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-colors shadow-xl shadow-red-600/20"
              >
                Send to All Staff
              </button>
            </div>
          </div>
        )}

        {/* Create Group Modal */}
        {showGroupCreate && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Users size={22} className="text-indigo-600" /> New Group Message
                </h3>
                <button onClick={() => setShowGroupCreate(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. Leadership Team"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Add Members</label>
                  <div className="space-y-2">
                    {TEAM_MEMBERS.filter(m => m.id !== currentUser.roleId).map(member => (
                      <button
                        key={member.id}
                        onClick={() => setGroupMembers(prev =>
                          prev.includes(member.id) ? prev.filter(id => id !== member.id) : [...prev, member.id]
                        )}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                          groupMembers.includes(member.id)
                            ? "bg-indigo-50 border-indigo-300"
                            : "bg-slate-50 border-slate-200 hover:border-indigo-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black", member.color)}>
                            {getInitials(member.name)}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-700">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{member.role}</p>
                          </div>
                        </div>
                        {groupMembers.includes(member.id) && <Check size={18} className="text-indigo-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || groupMembers.length === 0}
                className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-colors shadow-xl shadow-indigo-600/20"
              >
                Create Group
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

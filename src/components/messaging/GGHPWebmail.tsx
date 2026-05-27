import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { 
  Mail, Send, Inbox, RefreshCw, Folder, Trash2, X, Plus, ChevronDown, 
  AlertCircle, AlertTriangle, Reply, Search, Archive, Star, 
  ShieldCheck, CornerUpLeft, CornerUpRight, PlusCircle, CheckSquare, Square
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, onSnapshot, query, addDoc, limit } from 'firebase/firestore';

interface EmailMessage {
  id: string;
  seq: number;
  from: string;
  to: string;
  subject: string;
  date: string;
  isRead: boolean;
  isReply?: boolean;
  messageId?: string;
  bouncedEmail?: string;
}

interface IMAPFolder {
  name: string;
  path: string;
}

const EMAIL_ALIASES = [
  { email: 'founder@ggp-os.com', label: '👑 Shantell Robinson (Founder)' },
  { email: 'president@ggp-os.com', label: '🏛️ President' },
  { email: 'ceo@ggp-os.com', label: '💼 CEO' },
  { email: 'leadership@ggp-os.com', label: '👥 Executive Leadership' },
  { email: 'operations@ggp-os.com', label: '⚙️ Operations Division' },
  { email: 'compliance@ggp-os.com', label: '🛡️ Compliance Director' },
  { email: 'it@ggp-os.com', label: '🛠️ IT Support & Diagnostics' },
  { email: 'legal@ggp-os.com', label: '⚖️ Legal Council' },
  { email: 'provider@ggp-os.com', label: '🩺 Clinical Provider Support' },
  { email: 'patient@ggp-os.com', label: '👤 Patient Services' },
  { email: 'telehealth@ggp-os.com', label: '💻 Telehealth Network' },
  { email: 'dispensary@ggp-os.com', label: '🏪 Dispensary Support' },
  { email: 'grow@ggp-os.com', label: '🌱 Cultivation & Grows' },
  { email: 'processor@ggp-os.com', label: '🧪 Processors & Extractors' },
  { email: 'transporter@ggp-os.com', label: '🚛 Transporters' },
  { email: 'labproducttest@ggp-os.com', label: '🔬 Lab Product Testing' },
  { email: 'labrapidtest@ggp-os.com', label: '🧪 Lab Rapid Testing' },
  { email: 'escalation@ggp-os.com', label: '⚠️ Escalations Department' },
  { email: 'support@ggp-os.com', label: '🩺 General Help & Support' },
  { email: 'billing@ggp-os.com', label: '💳 Billing & Payments' },
  { email: 'finance@ggp-os.com', label: '📊 Finance & Accounting' },
  { email: 'message@ggp-os.com', label: '💬 Core Telephony / Messages' },
];

export const GGHPWebmail = () => {
  const [activeFolder, setActiveFolder] = useState<string>('INBOX');
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [folders, setFolders] = useState<IMAPFolder[]>([]);
  
  // Searching & Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  
  // Selected Email Details View
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [emailBody, setEmailBody] = useState<string>('');
  const [loadingBody, setLoadingBody] = useState(false);
  
  // Move Folder Modal
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Composer Modal
  const [showCompose, setShowCompose] = useState(false);
  const [composeFrom, setComposeFrom] = useState(EMAIL_ALIASES[0].email);
  const [composeTo, setComposeTo] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);

  // Fetch all IMAP Folders
  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/marketing?route=gmail&action=folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error('Failed to load folders:', err);
    }
  };

  // Fetch Emails for Active Folder
  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    setCheckedIds(new Set());
    setSelectedEmail(null);
    try {
      let action = 'inbox';
      let mailbox = activeFolder;
      
      if (activeFolder === '[Gmail]/Sent Mail') action = 'sent';
      else if (activeFolder === '[Gmail]/Spam') action = 'bounces';
      
      // Fetch inbox or custom folder
      const queryParams = new URLSearchParams({
        route: 'gmail',
        action: mailbox === 'INBOX' ? 'inbox' : mailbox === '[Gmail]/Sent Mail' ? 'sent' : 'inbox',
        mailbox: mailbox,
        maxResults: '25'
      });

      const res = await fetch(`/api/marketing?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.messages || data.sent || [];
        setEmails(list);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed. Please verify credentials in your environment.');
    } finally {
      setLoading(false);
    }
  };

  // Load email body
  const viewEmail = async (msg: EmailMessage) => {
    setSelectedEmail(msg);
    setEmailBody('');
    setLoadingBody(true);
    try {
      const res = await fetch(`/api/marketing?route=gmail&action=message&uid=${msg.id}&mailbox=${encodeURIComponent(activeFolder)}`);
      if (res.ok) {
        const data = await res.json();
        setEmailBody(data.body || '(No text content)');
      } else {
        setEmailBody('Failed to load message content.');
      }
    } catch (err: any) {
      setEmailBody(`Error loading message: ${err.message || err}`);
    } finally {
      setLoadingBody(false);
    }
  };

  // Delete selected emails
  const deleteSelected = async () => {
    if (checkedIds.size === 0) return;
    if (!confirm(`Permanently delete ${checkedIds.size} message(s)?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/marketing?route=gmail&action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uids: Array.from(checkedIds),
          mailbox: activeFolder
        })
      });
      if (res.ok) {
        alert('Messages deleted.');
        setCheckedIds(new Set());
        fetchEmails();
      } else {
        alert('Delete operation failed.');
      }
    } catch (err: any) {
      alert(`Error deleting: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Move selected to folder
  const moveSelected = async (targetFolder: string) => {
    if (checkedIds.size === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/marketing?route=gmail&action=move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uids: Array.from(checkedIds),
          fromMailbox: activeFolder,
          toMailbox: targetFolder
        })
      });
      if (res.ok) {
        alert(`Messages moved to ${targetFolder}`);
        setCheckedIds(new Set());
        setShowMoveModal(false);
        fetchEmails();
      } else {
        alert('Move operation failed.');
      }
    } catch (err: any) {
      alert(`Error moving: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Create folder
  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/marketing?route=gmail&action=move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uids: [],
          fromMailbox: 'INBOX',
          toMailbox: newFolderName.trim()
        })
      });
      if (res.ok) {
        alert(`Folder "${newFolderName}" successfully created.`);
        setNewFolderName('');
        fetchFolders();
      } else {
        alert('Failed to create folder.');
      }
    } catch (err: any) {
      alert(`Error creating folder: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Send Email
  const handleSend = async () => {
    if (!composeTo.trim()) return alert('Please enter recipient email.');
    if (!composeSubject.trim()) return alert('Please enter a subject.');
    if (!composeMessage.trim()) return alert('Please enter message body.');

    setIsSending(true);
    try {
      const toList = composeTo.split(',').map(e => ({ email: e.trim() })).filter(r => r.email);
      const ccList = composeCc.split(',').map(e => e.trim()).filter(Boolean);
      const bccList = composeBcc.split(',').map(e => e.trim()).filter(Boolean);
      
      const res = await fetch('/api/marketing?route=send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          fromEmail: `"${EMAIL_ALIASES.find(a => a.email === composeFrom)?.label || 'GGHP OS'}" <${composeFrom}>`,
          subject: composeSubject,
          message: composeMessage,
          recipients: toList,
          cc: ccList.length > 0 ? ccList : undefined,
          bcc: bccList.length > 0 ? bccList : undefined
        })
      });

      if (res.ok) {
        alert('Email sent successfully!');
        setShowCompose(false);
        // Clear composer state
        setComposeTo('');
        setComposeCc('');
        setComposeBcc('');
        setComposeSubject('');
        setComposeMessage('');
        fetchEmails();
      } else {
        const data = await res.json();
        alert(`Send failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error sending email: ${err.message || err}`);
    } finally {
      setIsSending(false);
    }
  };

  // Quick reply
  const setupReply = (mode: 'reply' | 'forward') => {
    if (!selectedEmail) return;
    
    let subject = selectedEmail.subject;
    if (mode === 'reply' && !subject.toLowerCase().startsWith('re:')) subject = `Re: ${subject}`;
    if (mode === 'forward' && !subject.toLowerCase().startsWith('fwd:')) subject = `Fwd: ${subject}`;
    
    setComposeTo(mode === 'reply' ? selectedEmail.from : '');
    setComposeSubject(subject);
    setComposeMessage(`\n\n--- On ${new Date(selectedEmail.date).toLocaleString()}, ${selectedEmail.from} wrote:\n\n${emailBody}`);
    
    // Auto-detect alias match in original recipient list to select correct from-email
    const originalTo = String(selectedEmail.to || '').toLowerCase();
    const matchedAlias = EMAIL_ALIASES.find(a => originalTo.includes(a.email));
    if (matchedAlias) {
      setComposeFrom(matchedAlias.email);
    }

    setShowCompose(true);
  };

  // Load data on mount
  useEffect(() => {
    fetchFolders();
    fetchEmails();
  }, [activeFolder]);

  // Load Saved Templates from Firestore
  useEffect(() => {
    const qTemplates = query(collection(db, 'marketing_templates'));
    const unsub = onSnapshot(qTemplates, snap => {
      setTemplates(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Filtered emails
  const filteredEmails = emails.filter(e => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (e.subject || '').toLowerCase().includes(q) || 
           (e.from || '').toLowerCase().includes(q) ||
           (e.to || '').toLowerCase().includes(q);
  });

  return (
    <div className="h-[750px] flex bg-[#0c1322] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* 1. Sidebar Folders */}
      <div className="w-64 border-r border-white/5 bg-[#080e1a]/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Compose Button */}
          <button 
            onClick={() => setShowCompose(true)}
            className="w-full mb-6 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98]"
          >
            <Plus size={14} /> New Message
          </button>
          
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 px-2">Folders</h4>
          
          {/* Main Mailboxes */}
          <div className="space-y-1">
            <button 
              onClick={() => setActiveFolder('INBOX')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                activeFolder === 'INBOX' ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2"><Inbox size={14} /> Inbox</span>
            </button>
            <button 
              onClick={() => setActiveFolder('[Gmail]/Sent Mail')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                activeFolder === '[Gmail]/Sent Mail' ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2"><Send size={14} /> Sent</span>
            </button>
            <button 
              onClick={() => setActiveFolder('[Gmail]/Spam')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all",
                activeFolder === '[Gmail]/Spam' ? "bg-indigo-600 text-white font-black" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2"><AlertTriangle size={14} /> Spam / Bounces</span>
            </button>
          </div>

          <hr className="border-white/5 my-4" />

          {/* Custom folders from IMAP */}
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-2 flex justify-between items-center">
            <span>Files & Labels</span>
            <Folder size={12} className="text-slate-600" />
          </h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {folders
              .filter(f => !['INBOX', '[Gmail]/Sent Mail', '[Gmail]/Spam', '[Gmail]/Trash', '[Gmail]/All Mail', '[Gmail]/Drafts', '[Gmail]/Starred', '[Gmail]/Important'].includes(f.path))
              .map(folder => (
                <button
                  key={folder.path}
                  onClick={() => setActiveFolder(folder.path)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left truncate transition-all",
                    activeFolder === folder.path ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  <Folder size={12} className="shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </button>
              ))}
            {folders.length === 0 && (
              <p className="text-[10px] text-slate-600 italic px-2">No custom files.</p>
            )}
          </div>
        </div>

        {/* Create Folder Form */}
        <div className="border-t border-white/5 pt-4">
          <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">New File / Label</label>
          <div className="flex gap-1.5">
            <input 
              type="text" 
              placeholder="e.g. Licensing" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500 transition-all"
            />
            <button 
              onClick={createFolder}
              className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white px-2.5 py-1.5 rounded-lg border border-indigo-500/20 text-xs font-bold transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* 2. Messages List */}
      <div className="w-[380px] border-r border-white/5 flex flex-col bg-[#0b1322] shrink-0">
        
        {/* Search & Action Bar */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-600" size={14} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, subject..."
              className="w-full bg-[#080e1a] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <button 
                onClick={fetchEmails}
                disabled={loading}
                className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Refresh messages"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
              
              {checkedIds.size > 0 && (
                <>
                  <button 
                    onClick={deleteSelected}
                    className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ml-2"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                  <button 
                    onClick={() => setShowMoveModal(true)}
                    className="p-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Folder size={12} /> Move
                  </button>
                </>
              )}
            </div>
            
            <span className="text-[10px] text-slate-500 font-bold">
              {filteredEmails.length} messages
            </span>
          </div>
        </div>

        {/* Email Scroll List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {loading && emails.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw size={20} className="animate-spin text-indigo-400" />
              <span>Connecting to IMAP & loading mailbox...</span>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs italic">
              No messages found.
            </div>
          ) : (
            filteredEmails.map((msg) => {
              const isChecked = checkedIds.has(msg.id);
              const isSelected = selectedEmail?.id === msg.id;
              
              return (
                <div 
                  key={msg.id}
                  onClick={() => viewEmail(msg)}
                  className={cn(
                    "p-4 flex gap-3 items-start cursor-pointer hover:bg-white/5 transition-all",
                    isSelected ? "bg-indigo-500/10 border-l-2 border-indigo-500" : "",
                    !msg.isRead && !isSelected ? "bg-white/[0.02]" : ""
                  )}
                >
                  {/* Select Checkbox */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = new Set(checkedIds);
                      if (isChecked) next.delete(msg.id);
                      else next.add(msg.id);
                      setCheckedIds(next);
                    }}
                    className="mt-0.5 text-slate-500 hover:text-white transition-colors"
                  >
                    {isChecked ? <CheckSquare size={14} className="text-indigo-400" /> : <Square size={14} />}
                  </div>

                  {/* Read dot Indicator */}
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", msg.isRead ? "bg-transparent" : "bg-cyan-400")} />

                  {/* Sender & Subject info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className={cn("text-xs truncate", !msg.isRead ? "font-bold text-white" : "font-semibold text-slate-300")}>
                        {msg.from}
                      </p>
                      <span className="text-[9px] text-slate-500 shrink-0 font-medium">
                        {msg.date ? new Date(msg.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : ''}
                      </span>
                    </div>
                    <p className={cn("text-xs truncate text-slate-200 mb-0.5", !msg.isRead ? "font-semibold" : "")}>
                      {msg.subject}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Message Body View */}
      <div className="flex-1 flex flex-col bg-[#080e1a]/40 relative">
        {selectedEmail ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Message Header bar */}
            <div className="p-6 border-b border-white/5 bg-[#080e1a]/80 flex justify-between items-start shrink-0">
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white mb-1.5">{selectedEmail.subject}</h3>
                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-semibold"><span className="text-slate-500 font-normal">From:</span> {selectedEmail.from}</p>
                  <p className="text-xs text-slate-400"><span className="text-slate-500 font-normal">To:</span> {selectedEmail.to}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{selectedEmail.date ? new Date(selectedEmail.date).toLocaleString() : ''}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setupReply('reply')}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all"
                >
                  <Reply size={12} /> Reply
                </button>
                <button 
                  onClick={() => setupReply('forward')}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <CornerUpRight size={12} /> Forward
                </button>
              </div>
            </div>

            {/* Email Message Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20 font-sans text-sm text-slate-200">
              {loadingBody ? (
                <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-indigo-400" />
                  <span>Loading full email body...</span>
                </div>
              ) : emailBody.trim().startsWith('<') ? (
                // Render html securely in iframe or direct dangerouslySetInnerHTML (sandbox it ideally)
                <div 
                  className="bg-slate-900/40 rounded-2xl p-4 border border-white/5 overflow-auto max-w-full"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(emailBody) }} 
                />
              ) : (
                <div className="bg-slate-900/40 rounded-2xl p-6 border border-white/5 whitespace-pre-wrap leading-relaxed max-w-full">
                  {emailBody}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 text-xs">
            <Mail size={40} className="text-slate-700 mb-3" />
            <p className="font-semibold text-slate-400 mb-1">No Email Selected</p>
            <p>Select a message from the list to view its content and take actions.</p>
          </div>
        )}
      </div>

      {/* 4. MOVE TO FOLDER MODAL */}
      {showMoveModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#0b1322] border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
            <button 
              onClick={() => setShowMoveModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
              <Folder className="text-indigo-400" /> Move Messages
            </h3>
            <p className="text-xs text-slate-400 mb-6">Select a folder or label to organize the {checkedIds.size} selected emails.</p>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2">
              <button 
                onClick={() => moveSelected('INBOX')}
                className="w-full flex items-center gap-2 p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white transition-all text-left"
              >
                <Inbox size={12} className="text-indigo-400" /> Inbox
              </button>
              {folders
                .filter(f => !['[Gmail]/Trash', '[Gmail]/All Mail', '[Gmail]/Drafts', '[Gmail]/Starred', '[Gmail]/Important'].includes(f.path))
                .map(folder => (
                  <button
                    key={folder.path}
                    onClick={() => moveSelected(folder.path)}
                    className="w-full flex items-center gap-2 p-3 bg-slate-900 hover:bg-white/5 border border-white/5 rounded-xl text-xs font-semibold text-slate-300 transition-all text-left"
                  >
                    <Folder size={12} className="text-indigo-400 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. COMPOSE MESSAGE MODAL */}
      {showCompose && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#0b1322] border border-white/10 rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl flex flex-col h-[650px]">
            
            <button 
              onClick={() => {
                if (composeMessage.trim() && !confirm('Discard draft?')) return;
                setShowCompose(false);
              }}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 shrink-0">
              <Mail className="text-indigo-400" /> Compose Message
            </h3>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              
              {/* Alias From Dropdown */}
              <div className="relative">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">From (Alias)</label>
                <select
                  value={composeFrom}
                  onChange={(e) => setComposeFrom(e.target.value)}
                  className="w-full bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  {EMAIL_ALIASES.map(alias => (
                    <option key={alias.email} value={alias.email}>
                      {alias.label} &lt;{alias.email}&gt;
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 bottom-3.5 text-slate-500 pointer-events-none" size={14} />
              </div>

              {/* To Recipient */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">To</label>
                <input 
                  type="text" 
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="recipient@domain.com (comma separated)"
                  className="w-full bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              {/* CC / BCC fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">CC</label>
                  <input 
                    type="text" 
                    value={composeCc}
                    onChange={(e) => setComposeCc(e.target.value)}
                    placeholder="cc@domain.com"
                    className="w-full bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">BCC</label>
                  <input 
                    type="text" 
                    value={composeBcc}
                    onChange={(e) => setComposeBcc(e.target.value)}
                    placeholder="bcc@domain.com"
                    className="w-full bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Subject</label>
                  <input 
                    type="text" 
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
                
                {/* Template picker */}
                <div className="relative shrink-0">
                  <button 
                    onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
                    type="button"
                    className="bg-slate-900 border border-white/10 hover:border-slate-700 text-slate-300 font-bold text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    Templates <ChevronDown size={12} />
                  </button>
                  {showTemplatesDropdown && (
                    <div className="absolute right-0 bottom-full mb-2 bg-[#0b1322] border border-white/10 rounded-xl p-2 w-64 shadow-2xl z-50 max-h-48 overflow-y-auto space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 px-2.5 py-1">Saved CRM Templates</p>
                      {templates.map(t => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setComposeSubject(t.subject || '');
                            setComposeMessage(t.body || '');
                            setShowTemplatesDropdown(false);
                          }}
                          type="button"
                          className="w-full text-left px-2.5 py-2 hover:bg-white/5 rounded-lg text-xs text-slate-300 truncate font-semibold"
                        >
                          {t.name}
                        </button>
                      ))}
                      {templates.length === 0 && (
                        <p className="text-[10px] text-slate-500 italic p-2 text-center">No templates.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Message Body</label>
                <textarea 
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Compose your email here..."
                  className="w-full h-44 bg-[#080e1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-indigo-500 transition-all font-medium resize-none"
                />
              </div>

            </div>

            {/* Modal Send Footer */}
            <div className="pt-6 border-t border-white/5 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowCompose(false)}
                className="px-5 py-3 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSend}
                disabled={isSending}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? 'Sending...' : 'Send Email'} <Send size={12} />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Mail, MessageSquare, Send, Users, Filter, BarChart2, Activity, MapPin, Building2, LayoutTemplate, Clock, AlertCircle, Save, Trash2, X, Plus, ChevronDown, ChevronLeft, ChevronRight, Eye, MousePointerClick, MailOpen, TrendingUp, Inbox, AlertTriangle, Reply, RefreshCw, Folder, Pencil, Check, CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';
import { db } from '../../firebase';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { getStaticGovContacts } from '../../lib/govContacts';


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
  attachment?: string;
  attachmentName?: string;
  audienceTypes?: string[];
  isValuation?: boolean;
  createdAt: any;
}

// Module-level cache to persist deals across tab switches in Marketing Campaigns
let cachedDealsForMarketing: any[] | null = null;

const STATE_NAME_TO_CODE: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'district of columbia': 'DC', 'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY'
};

const getJurisdictionCode = (raw: string) => {
  if (!raw) return 'US';
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return STATE_NAME_TO_CODE[trimmed] || 'US';
};

const JURISDICTIONS = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

const ENTITY_TYPES = [
  { id: 'dispensary', label: 'Dispensary / Retail' },
  { id: 'grower', label: 'Grower / Cultivator' },
  { id: 'processor', label: 'Processor / Manufacturer' },
  { id: 'provider', label: 'Provider / Clinic' },
  { id: 'attorney', label: 'Attorney / Law Firm' },
  { id: 'backoffice', label: 'Independent / Backoffice' },
  { id: 'patient', label: 'Patient' },
  { id: 'agency', label: 'Gov / Enforcement Agency' },
  { id: 'distribution', label: 'Distribution / Transport' },
  { id: 'advocate', label: 'Advocate / Partner' },
  { id: 'other', label: 'Other Business' },
];

const possibleStates = (stateCode: string) => {
  const code = stateCode.toUpperCase();
  const fullName = Object.keys(STATE_NAME_TO_CODE).find(k => STATE_NAME_TO_CODE[k] === code);
  const list = [code, code.toLowerCase()];
  if (fullName) {
    list.push(fullName);
    list.push(fullName.toLowerCase());
    list.push(fullName.toUpperCase());
    const cap = fullName.charAt(0).toUpperCase() + fullName.slice(1).toLowerCase();
    list.push(cap);
  }
  return Array.from(new Set(list)).slice(0, 10);
};

const getStatesSearchList = (codes: string[]) => {
  const list: string[] = [];
  codes.forEach(c => {
    const possible = possibleStates(c);
    list.push(...possible);
  });
  return Array.from(new Set(list));
};

const parseNominalDate = (dateStr: string) => {
  if (!dateStr) return null;
  const s = dateStr.trim();
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) {
    return {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10) - 1, // 0-indexed month
      day: parseInt(match[3], 10)
    };
  }
  match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    return {
      year: parseInt(match[3], 10),
      month: parseInt(match[1], 10) - 1, // 0-indexed month
      day: parseInt(match[2], 10)
    };
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  if (s.includes('-') && !s.includes('/')) {
    return { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() };
  } else {
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }
};

export const MarketingHub = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'composer' | 'campaigns' | 'analytics'>('composer');
  const [campaignType, setCampaignType] = useState<'email' | 'sms'>('email');
  
  // Composer State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStates, setSelectedStates] = useState<string[]>(['All']);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['All']);
  const [selectedTier, setSelectedTier] = useState<'all' | 'top_grossing' | 'standard'>('all');
  const [renewalMode, setRenewalMode] = useState<'off' | 'month' | 'all_expired'>('off');
  const [renewalMonth, setRenewalMonth] = useState(() => {
    return { year: 2026, month: 3 }; // April 2026 (3 is 0-indexed April)
  });
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sendMode, setSendMode] = useState<'broadcast' | 'direct'>('broadcast');
  const [directContact, setDirectContact] = useState('');
  const [totalLeadsCount, setTotalLeadsCount] = useState(41271);
  const [verifiedEmailsCount, setVerifiedEmailsCount] = useState(1854);
  const [filteredCount, setFilteredCount] = useState(0);
  const [filteredAudience, setFilteredAudience] = useState<any[]>([]);
  const [loadingAudience, setLoadingAudience] = useState(false);
  
  // Audience Data
  const [deals, setDeals] = useState<any[]>(cachedDealsForMarketing || []);
  
  // UI State
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sendProgress, setSendProgress] = useState('');
  
  // Campaign Management State
  const [ccEmails, setCcEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');
  const [dailyLimit, setDailyLimit] = useState(500);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);

  // Template State
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateSubject, setEditTemplateSubject] = useState('');
  const [editTemplateBody, setEditTemplateBody] = useState('');

  // Tracking Analytics State
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<any[]>([]);

  // Gmail Inbox State
  const [gmailTab, setGmailTab] = useState<'inbox' | 'sent' | 'bounces' | 'replies'>('inbox');
  const [gmailInbox, setGmailInbox] = useState<any[]>([]);
  const [gmailSent, setGmailSent] = useState<any[]>([]);
  const [gmailBounces, setGmailBounces] = useState<any[]>([]);
  const [gmailReplies, setGmailReplies] = useState<any[]>([]);
  const [gmailStats, setGmailStats] = useState<any>(null);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError] = useState('');

  // Webmail popup and folders states
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [selectedEmailBody, setSelectedEmailBody] = useState<string>('');
  const [loadingEmailBody, setLoadingEmailBody] = useState(false);
  const [checkedEmailIds, setCheckedEmailIds] = useState<Set<string>>(new Set());
  const [allFolders, setAllFolders] = useState<{ name: string; path: string }[]>([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/marketing?route=gmail&action=folders&account=marketing');
      if (res.ok) {
        const data = await res.json();
        setAllFolders(data.folders || []);
      }
    } catch (err) {
      console.error('Failed to fetch IMAP folders:', err);
    }
  };

  const handleViewEmail = async (msg: any, folderType: string) => {
    let imapMailbox = 'INBOX';
    if (folderType === 'sent') imapMailbox = '[Gmail]/Sent Mail';
    else if (folderType === 'spam') imapMailbox = '[Gmail]/Spam';
    
    setSelectedEmail({ ...msg, folderType });
    setSelectedEmailBody('');
    setLoadingEmailBody(true);
    try {
      const res = await fetch(`/api/marketing?route=gmail&action=message&uid=${msg.id}&mailbox=${encodeURIComponent(imapMailbox)}&account=marketing`);
      if (res.ok) {
        const data = await res.json();
        setSelectedEmailBody(data.body || '(Empty body)');
      } else {
        setSelectedEmailBody('Failed to retrieve email content from server.');
      }
    } catch (err: any) {
      setSelectedEmailBody(`Error loading email: ${err.message || err}`);
    } finally {
      setLoadingEmailBody(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (checkedEmailIds.size === 0) return;
    if (!confirm(`Delete ${checkedEmailIds.size} selected message(s)?`)) return;
    
    let imapMailbox = 'INBOX';
    if (gmailTab === 'sent') imapMailbox = '[Gmail]/Sent Mail';
    
    setGmailLoading(true);
    try {
      const res = await fetch('/api/marketing?route=gmail&action=delete&account=marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uids: Array.from(checkedEmailIds),
          mailbox: imapMailbox
        })
      });
      if (res.ok) {
        alert('Messages successfully deleted!');
        setCheckedEmailIds(new Set());
        fetchGmail();
      } else {
        alert('Failed to delete messages.');
      }
    } catch (err: any) {
      alert(`Error deleting messages: ${err.message || err}`);
    } finally {
      setGmailLoading(false);
    }
  };

  const handleMoveSelected = async (targetFolder: string) => {
    if (checkedEmailIds.size === 0) return;
    let imapMailbox = 'INBOX';
    if (gmailTab === 'sent') imapMailbox = '[Gmail]/Sent Mail';
    
    setGmailLoading(true);
    try {
      const res = await fetch('/api/marketing?route=gmail&action=move&account=marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uids: Array.from(checkedEmailIds),
          fromMailbox: imapMailbox,
          toMailbox: targetFolder
        })
      });
      if (res.ok) {
        alert(`Successfully moved messages to ${targetFolder}`);
        setCheckedEmailIds(new Set());
        setShowMoveModal(false);
        fetchGmail();
      } else {
        alert('Failed to move messages.');
      }
    } catch (err: any) {
      alert(`Error moving messages: ${err.message || err}`);
    } finally {
      setGmailLoading(false);
    }
  };

  // Bounce suppression list
  const [suppressedEmails, setSuppressedEmails] = useState<Set<string>>(new Set());

  const fetchGmail = async () => {
    setGmailLoading(true);
    setGmailError('');
    try {
      const safeFetch = async (url: string) => { try { const r = await fetch(url); const text = await r.text(); return JSON.parse(text); } catch { return { error: 'Server unavailable' }; } };
      const [inboxRes, bouncesRes, repliesRes, sentRes, profileRes] = await Promise.all([
        safeFetch('/api/marketing?route=gmail&action=inbox&maxResults=15&account=marketing'),
        safeFetch('/api/marketing?route=gmail&action=bounces&maxResults=10&account=marketing'),
        safeFetch('/api/marketing?route=gmail&action=replies&maxResults=10&account=marketing'),
        safeFetch('/api/marketing?route=gmail&action=sent&maxResults=15&account=marketing'),
        safeFetch('/api/marketing?route=gmail&action=profile&account=marketing'),
      ]);
      if (inboxRes.error) throw new Error(inboxRes.error);
      setGmailInbox(inboxRes.messages || []);
      setGmailBounces(bouncesRes.bounces || []);
      setGmailReplies(repliesRes.replies || []);
      setGmailSent(sentRes.sent || []);
      setGmailStats(profileRes);
      fetchFolders();
    } catch (err: any) {
      setGmailError(err.message || 'Failed to connect to Gmail');
    } finally {
      setGmailLoading(false);
    }
  };

  useEffect(() => { fetchGmail(); }, []);

  // Load suppressed emails from Firestore
  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'suppressed_emails')), snap => {
      const emails = new Set<string>(snap.docs.map(d => (d.data().email || '').toLowerCase()));
      setSuppressedEmails(emails);
      if (emails.size > 0) console.log(`[Bounce Guard] ${emails.size} emails suppressed from future campaigns`);
    });
    return () => u();
  }, []);

  // Load general metrics once on mount
  useEffect(() => {
    const loadGeneralStats = async () => {
      try {
        const [totalSnap, verifiedSnap] = await Promise.all([
          getCountFromServer(collection(db, 'crm_deals')),
          getCountFromServer(query(collection(db, 'crm_deals'), where('emailVerified', '==', true)))
        ]);
        setTotalLeadsCount(totalSnap.data().count);
        setVerifiedEmailsCount(verifiedSnap.data().count);
      } catch (err) {
        console.error('Failed to load general crm stats:', err);
      }
    };
    loadGeneralStats();
  }, []);

  // Load audience on-demand based on filters
  useEffect(() => {
    let active = true;
    const loadFilteredAudience = async () => {
      setLoadingAudience(true);
      try {
        let q = query(collection(db, 'crm_deals'));
        const activeStates = selectedStates.filter(s => s !== 'All');
        const activeTypes = selectedTypes.filter(t => t !== 'All');

        // 1. Build the server query (apply server range filters for renewals to prevent truncation issues)
        if (renewalMode === 'month') {
          const startYear = renewalMonth.year;
          const startMonth = renewalMonth.month; // 0-indexed
          const startDateStr = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-01`;
          const lastDay = new Date(startYear, startMonth + 1, 0).getDate();
          const endDateStr = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
          
          q = query(q, where('licenseExpiration', '>=', startDateStr), where('licenseExpiration', '<=', endDateStr));
        } else if (renewalMode === 'all_expired') {
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          
          q = query(q, where('licenseExpiration', '<', todayStr));
        } else {
          // Default: Build query with state/type/tier on server (apply at most one 'in' operator to avoid Firestore errors)
          if (activeStates.length > 0) {
            const statesList = getStatesSearchList(activeStates);
            q = query(q, where('jurisdiction', 'in', statesList.slice(0, 30)));
            if (activeTypes.length === 1 && activeTypes[0] !== 'agency' && activeTypes[0] !== 'advocate') {
              q = query(q, where('type', '==', activeTypes[0]));
            }
          } else if (activeTypes.length > 0) {
            const expandedTypes = [...activeTypes];
            if (activeTypes.includes('agency')) {
              expandedTypes.push(
                'gov_state', 'gov_local', 'gov_federal', 
                'enforcement', 'enforcement_state', 'enforcement_local', 'enforcement_federal',
                'police', 'dea', 'obn', 'mayor', 'governor', 'senator', 'legislative', 'political', 'attorney_general'
              );
            }
            q = query(q, where('type', 'in', Array.from(new Set(expandedTypes)).slice(0, 30)));
          }

          // Apply tier filter on server if possible
          if (selectedTier === 'top_grossing') {
            q = query(q, where('tier', '==', 'top_grossing'));
          }
        }

        // 2. Fetch total count from server for stats (cheap, fast)
        const countSnap = await getCountFromServer(q).catch(() => ({ data: () => ({ count: 150 }) }));
        const matchedCount = countSnap.data().count;

        // 3. Fetch documents for actual campaign execution (up to 20,000 to cover all verified contacts)
        const fetchLimit = 20000;
        const docsSnap = await getDocs(query(q, limit(fetchLimit)));
        const fetchedDeals = docsSnap.docs.map(d => {
          const data = d.data();
          const rawType = data.type || 'other';
          const type = (rawType.startsWith('gov_') || rawType.startsWith('enforcement_') || rawType === 'enforcement' || ['police', 'dea', 'obn', 'mayor', 'governor', 'senator', 'legislative', 'political', 'attorney_general'].includes(rawType)) ? 'agency' : rawType;
          return { id: d.id, ...data, type } as any;
        });

        // 3b. Load static government contacts to merge (guarantees completeness offline/under quota constraints)
        const staticContacts = getStaticGovContacts();
        const normalizedStatic = staticContacts.map(c => {
          const rawType = c.type;
          const type = (rawType.startsWith('gov_') || rawType.startsWith('enforcement_') || rawType === 'enforcement' || ['police', 'dea', 'obn', 'mayor', 'governor', 'senator', 'legislative', 'political', 'attorney_general'].includes(rawType)) ? 'agency' : rawType;
          return { ...c, type };
        });

        // Merge fetched and static contacts (by email or id to prevent duplicates)
        const allDealsMap = new Map();
        normalizedStatic.forEach(c => {
          if (c.email) allDealsMap.set(c.email.toLowerCase(), c);
        });
        fetchedDeals.forEach(d => {
          if (d.email) {
            allDealsMap.set(d.email.toLowerCase(), d);
          } else {
            allDealsMap.set(d.id, d);
          }
        });
        const combinedDeals = Array.from(allDealsMap.values());

        // 4. Apply remaining filters client-side on the fetched subset
        const finalFiltered = combinedDeals.filter(d => {
          // Ensure contact info is present
          if (campaignType === 'email' && !d.email) return false;
          if (campaignType === 'sms' && !d.phone) return false;

          // Apply state, type, tier filters client-side (to filter server-retrieved expiring records or as double check)
          if (activeStates.length > 0) {
            const code = getJurisdictionCode(d.jurisdiction);
            if (!activeStates.includes(code)) return false;
          }
          if (activeTypes.length > 0) {
            if (!activeTypes.includes(d.type)) return false;
          }
          if (selectedTier === 'top_grossing' && d.tier !== 'top_grossing') return false;
          if (selectedTier === 'standard' && d.tier === 'top_grossing') return false;
          
          if (campaignType === 'email' && suppressedEmails.has((d.email || '').toLowerCase())) return false;
          if (campaignType === 'email' && d.emailFabricated === true) return false;

          // Block fabricated emails (flagged by quarantine script or matching known fake patterns)
          if (campaignType === 'email') {
            const em = (d.email || '').toLowerCase();
            const prefix = em.split('@')[0];
            const domain = em.split('@')[1] || '';
            const domainBase = domain.replace(/\.(com|org|net|gov)$/, '');
            // Block contact@/appointments@/info@ with slug-matching domains
            if (['contact', 'appointments', 'info'].includes(prefix)) {
              const nameSlug = (d.businessName || d.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
              if (nameSlug && domainBase && (domainBase.includes(nameSlug.substring(0, 8)) || nameSlug.includes(domainBase.substring(0, 8)))) return false;
            }
          }

          // Renewal filter (double-check matching dates)
          if (renewalMode !== 'off') {
            const nominal = parseNominalDate(d.licenseExpiration);
            if (!nominal) return false;
            
            if (renewalMode === 'all_expired') {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const expDateObj = new Date(nominal.year, nominal.month, nominal.day);
              if (expDateObj.getTime() >= today.getTime()) return false;
            } else if (renewalMode === 'month') {
              if (nominal.year !== renewalMonth.year || nominal.month !== renewalMonth.month) return false;
            }
          }
          return true;
        });

        if (active) {
          setDeals(combinedDeals);
          setFilteredCount(finalFiltered.length);
          setFilteredAudience(finalFiltered);
          setLoadingAudience(false);
        }
      } catch (err) {
        console.error('Failed to load filtered audience:', err);
        if (active) setLoadingAudience(false);
      }
    };

    // Debounce to avoid querying on every checkbox click
    const timer = setTimeout(loadFilteredAudience, 300);
    return () => { active = false; clearTimeout(timer); };
  }, [selectedStates, selectedTypes, selectedTier, renewalMode, renewalMonth, campaignType, suppressedEmails]);

  const totalLeads = totalLeadsCount;
  const jurisdictions = JURISDICTIONS;
  const businessTypes = ENTITY_TYPES.map(t => t.id);

  // Load saved templates
  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'marketing_templates')), snap => {
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailTemplate)));
    });
    return () => u();
  }, []);

  // Load active campaign + all campaigns for analytics
  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'marketing_campaigns')), snap => {
      const campaigns = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllCampaigns(campaigns);
      const active = campaigns.find((c: any) => c.status === 'active');
      setActiveCampaign(active || null);
    });
    return () => u();
  }, []);

  // Load tracking events (recent)
  useEffect(() => {
    const u = onSnapshot(query(collection(db, 'marketing_tracking'), orderBy('timestamp', 'desc'), limit(50)), snap => {
      setTrackingEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => u();
  }, []);

  // Seed Valuation Brief templates if not already present
  useEffect(() => {
    const seedValuationTemplates = async () => {
      try {
        const snap = await getDocs(collection(db, 'marketing_templates'));
        const existing = snap.docs.map(d => d.data().name || '');
        const VALUATION_URL = 'https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html';
        const ATTACHMENT_NAME = 'GGHP_Agency_Valuation_Brief.html';
        const footer = `<div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;"><p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Respectfully,</strong></p><p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Shantell Robinson</p><p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Founder and CEO, Global Green Enterprise Inc.</p><p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | 645-246-8277<br>CAGE: 9KXZ2 | UEI: TY1BQ3XK3925 | SAM.gov Active | BBB A+ Rated<br>WOSB Certified | HIPAA Compliant | AES-256 Encryption</p></div>`;
        const header = (sub: string) => `<div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">${sub}</p><h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Global Green Hybrid Platform</h1></div>`;
        const cta = `<div style="text-align: center; margin: 32px 0;"><a href="${VALUATION_URL}" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px;">View the Full Valuation Brief</a></div>`;
        const wrap = (content: string) => `<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;">${content}</div>`;

        const presets = [
          {
            name: 'Valuation Brief - HUB (All Types)',
            subject: '51 Jurisdictions. Zero Interoperability. Until Now.',
            audienceTypes: ['agency', 'advocate', 'attorney', 'provider', 'backoffice', 'distribution', 'other'],
            body: wrap(header('Strategic Valuation Brief') + '<p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">To Whom It May Concern,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Cannabis regulation is the most fragmented compliance landscape in American government. Every state operates its own licensing authority, tracking system, and enforcement protocols &mdash; none of which communicate with each other.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>We solved that.</strong></p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> is the first and only unified compliance operating system that connects state regulators, federal agencies, law enforcement, attorneys, providers, and advocacy organizations on a single, auditable, real-time backbone &mdash; across all 50 states and DC.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">The attached Strategic Valuation Brief outlines what this platform replaces, how it works, and why your office needs access to it before interstate commerce begins.</p><div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 800; margin: 0 0 12px;">Key Facts</p><p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">Registered at every level of government (SAM.gov, OMES, BidNet, OKC Trusts)<br>WOSB and Minority-Owned certified<br>HIPAA compliant, AES-256 encrypted, court-admissible audit trails<br>Two AI engines (Sylara + L.A.R.R.Y) &mdash; predictive enforcement, not reactive<br>Metrc validated integrator with full production API access</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">This is not a pitch deck. It is an infrastructure briefing. No financials, no pricing &mdash; just the architecture your jurisdiction is missing.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">I welcome a 15-minute call at your convenience.</p>' + cta + footer),
          },
          {
            name: 'Valuation Brief - Gov/Agency',
            subject: 'Briefing: The First Compliance OS Registered at Every Level of Government',
            audienceTypes: ['agency'],
            body: wrap(header('Strategic Valuation Brief &mdash; Government and State Agencies') + '<p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Dear Director,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Your agency oversees a cannabis market with no unified compliance infrastructure. Licensees operate across disconnected tracking systems, enforcement is reactive, and cross-jurisdictional visibility does not exist.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> was built specifically to solve this for agencies like yours. It is not a vendor product seeking approval &mdash; it is a compliance operating system already registered at the federal, state, county, and municipal level.</p><div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 800; margin: 0 0 12px;">The Attached Brief Details</p><p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">How GGHP-OS replaces fragmented tracking with real-time, cross-state visibility<br>The L.A.R.R.Y predictive enforcement engine that forecasts violations before they occur<br>Role-based dashboards purpose-built for regulatory authorities<br>Full SAM.gov integration with daily entity verification and debarment monitoring</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">We are currently scheduling agency evaluation briefings. No commitment required &mdash; just a conversation about what your office is currently missing.</p>' + cta + footer),
          },
          {
            name: 'Valuation Brief - Advocates',
            subject: 'The Data Your Advocacy Work Has Been Missing',
            audienceTypes: ['advocate'],
            body: wrap(header('Strategic Valuation Brief &mdash; Advocacy and Research') + '<p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Good afternoon,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Evidence-based cannabis policy requires data that does not exist in any public system today &mdash; anonymized health outcomes, social equity metrics, community impact measurements, and compliance trends across jurisdictions.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> is the first platform that aggregates this data across all 50 states into a single, auditable infrastructure. For advocacy and research organizations, this means access to the intelligence layer that turns position papers into policy.</p><div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px 24px; margin: 24px 0;"><p style="font-size: 14px; color: #166534; line-height: 1.8; margin: 0;">We are a certified <strong>Woman-Owned, Minority-Owned, Black American-Owned, and American Indian-Owned</strong> small business. This platform was built by someone who understands the communities your organization serves.</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">I would welcome a brief conversation about how we can support your work.</p>' + cta + footer),
          },
          {
            name: 'Valuation Brief - Attorneys',
            subject: "Your Clients' Compliance Records Should Be Court-Ready. They're Not.",
            audienceTypes: ['attorney'],
            body: wrap(header('Strategic Valuation Brief &mdash; Legal Professionals') + '<p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Counselor,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">When you represent a cannabis licensee, the compliance data you need is scattered across state portals, spreadsheets, and disconnected tracking systems. Nothing is standardized. Nothing is court-ready.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> changes that. Every action on our platform is logged with timestamps, user attribution, explainable AI reasoning, and an immutable audit trail &mdash; built to withstand regulatory scrutiny and legal challenge.</p><div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 800; margin: 0 0 12px;">The Attached Brief Outlines</p><p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">How the platform creates evidentiary-grade compliance records<br>Real-time license status verification across all 50 states<br>Dynamic risk scoring with explainable, defensible methodology<br>Cross-jurisdictional visibility for multi-state operators</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">If your practice touches cannabis licensing, compliance disputes, or regulatory defense, this platform is the infrastructure behind your next case.</p>' + cta + footer),
          },
          {
            name: 'Valuation Brief - Providers',
            subject: 'Your Patient Pipeline Deserves Real-Time Compliance Infrastructure',
            audienceTypes: ['provider'],
            body: wrap(header('Strategic Valuation Brief &mdash; Healthcare Providers') + '<p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Doctor,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Your patients depend on timely medical card approvals, renewal reminders, and compliant physician coordination across state lines. The current system is manual, fragmented, and slow.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> automates the entire patient intake lifecycle &mdash; from telehealth scheduling and physician matching to state registry submission and renewal alerts &mdash; across all 50 states and 26 languages.</p><div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px 24px; margin: 24px 0;"><p style="font-size: 14px; color: #0C4A6E; line-height: 1.8; margin: 0;">We are scheduling provider onboarding calls this month. No obligation &mdash; just a walkthrough of what the platform does for your practice.</p></div>' + cta + footer),
          },
        ];

        for (const preset of presets) {
          if (!existing.includes(preset.name)) {
            await addDoc(collection(db, 'marketing_templates'), {
              ...preset,
              attachment: VALUATION_URL,
              attachmentName: ATTACHMENT_NAME,
              isValuation: true,
              createdAt: serverTimestamp(),
            });
          }
        }
      } catch (err) {
        console.error('Failed to seed valuation templates:', err);
      }
    };
    seedValuationTemplates();
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
    if (t.audienceTypes && t.audienceTypes.length > 0) {
      setSelectedTypes(t.audienceTypes);
      setSelectedStates(['All']);
      setSelectedTier('all');
      setRenewalMode('off');
      setCampaignType('email');
      setSendMode('broadcast');
    }
    setShowTemplates(false);
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template permanently?')) return;
    await deleteDoc(doc(db, 'marketing_templates', id));
  };

  const startEditTemplate = (t: EmailTemplate) => {
    setEditingTemplateId(t.id);
    setEditTemplateName(t.name);
    setEditTemplateSubject(t.subject || '');
    setEditTemplateBody(t.body || '');
  };

  const saveEditTemplate = async () => {
    if (!editingTemplateId || !editTemplateName.trim()) return;
    await updateDoc(doc(db, 'marketing_templates', editingTemplateId), {
      name: editTemplateName,
      subject: editTemplateSubject,
      body: editTemplateBody,
      updatedAt: serverTimestamp(),
    });
    setEditingTemplateId(null);
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
    
    let finalAudience: { email?: string; phone?: string; crmId?: string }[] = [];
    if (sendMode === 'direct') {
      if (!directContact) return alert(`Please enter a recipient ${campaignType === 'email' ? 'email' : 'phone number'}`);
      const directRecipients = directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
      if (directRecipients.length === 0) return alert('No valid recipients found.');
      if (directRecipients.length > 30 && !confirm(`⚠️ You're sending to ${directRecipients.length} recipients in Direct mode.\n\nDirect mode sends each email individually, and more than 30 may cause timeouts.\n\nFor large sends, Broadcast mode is recommended.\n\nContinue anyway?`)) return;
      finalAudience = directRecipients.map(r => ({ email: campaignType === 'email' ? r : undefined, phone: campaignType === 'sms' ? r : undefined }));
    } else {
      if (filteredAudience.length === 0) return alert('No valid audience selected.');
      // Strip to email/phone only, sort alphabetically
      finalAudience = filteredAudience
        .map(d => ({ email: campaignType === 'email' ? d.email : undefined, phone: campaignType === 'sms' ? d.phone : undefined, crmId: d.id }))
        .filter(r => r.email || r.phone)
        .sort((a, b) => ((a.email || a.phone || '') as string).localeCompare((b.email || b.phone || '') as string));
    }

    // For broadcast: apply daily limit and skip already-sent
    let batchAudience = finalAudience;
    let campaignDoc = activeCampaign;
    const sentSet = new Set<string>(campaignDoc?.sentEmails || []);
    
    if (sendMode === 'broadcast') {
      // Filter out already-sent recipients
      batchAudience = finalAudience.filter(r => !sentSet.has(r.email || r.phone || ''));
      // Apply daily limit
      batchAudience = batchAudience.slice(0, dailyLimit);
      
      if (batchAudience.length === 0) {
        return alert(campaignDoc ? '✅ All recipients have been reached! Campaign complete.' : 'No unsent recipients available.');
      }
      
      const firstEmail = batchAudience[0]?.email || batchAudience[0]?.phone || '';
      const lastEmail = batchAudience[batchAudience.length - 1]?.email || batchAudience[batchAudience.length - 1]?.phone || '';
      const rangeLabel = `${firstEmail.charAt(0).toUpperCase()}–${lastEmail.charAt(0).toUpperCase()}`;
      
      if (!confirm(`Send ${batchAudience.length} emails (${rangeLabel} range)?\n\nAlready sent: ${sentSet.size}\nRemaining after this: ${finalAudience.length - sentSet.size - batchAudience.length}\nDaily limit: ${dailyLimit}`)) {
        return;
      }
    }

    setIsSending(true);
    setSendProgress('Preparing campaign...');
    
    try {
      // Compress images
      let apiMessage = message;
      const attachments: { filename: string; content: string; contentType: string; cid: string }[] = [];
      const compressImage = (dataUrl: string): Promise<string> => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ratio = Math.min(1, 600 / img.width);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.5).split(',')[1]);
        };
        img.onerror = () => resolve('');
        img.src = dataUrl;
      });
      
      const imageMatches: { fullMatch: string; dataUrl: string }[] = [];
      let m;
      const scanRegex = /src="(data:image\/[^;]+;base64,[^"]+)"/g;
      while ((m = scanRegex.exec(apiMessage)) !== null) imageMatches.push({ fullMatch: m[0], dataUrl: m[1] });
      
      if (imageMatches.length > 0) setSendProgress(`Compressing ${imageMatches.length} image(s)...`);
      for (let i = 0; i < imageMatches.length; i++) {
        const compressed = await compressImage(imageMatches[i].dataUrl);
        if (!compressed) continue;
        const cid = `flyer-${i}@ggp-os`;
        attachments.push({ filename: `flyer-${i}.jpg`, content: compressed, contentType: 'image/jpeg', cid });
        apiMessage = apiMessage.replace(imageMatches[i].fullMatch, `src="cid:${cid}"`);
      }
      
      // Parse CC/BCC
      const ccList = ccEmails.split(',').map(e => e.trim()).filter(Boolean);
      const bccList = bccEmails.split(',').map(e => e.trim()).filter(Boolean);
      
      // Batch send — 20 per API call (throttled backend, ~7s per batch)
      const BATCH_SIZE = 20;
      const batches: typeof batchAudience[] = [];
      for (let i = 0; i < batchAudience.length; i += BATCH_SIZE) batches.push(batchAudience.slice(i, i + BATCH_SIZE));
      
      const totalResults = { total: batchAudience.length, successful: 0, failed: 0 };
      const successfulRecipients: string[] = [];
      
      for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
        setSendProgress(`Sending batch ${batchIdx + 1}/${batches.length} (${totalResults.successful} delivered, ${totalResults.failed} failed) — throttled for reliability...`);
        try {
          const res = await fetch('/api/marketing?route=send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: campaignType, subject, message: apiMessage,
              recipients: batches[batchIdx],
              attachments: attachments.length > 0 ? attachments : undefined,
              cc: ccList.length > 0 ? ccList : undefined,
              bcc: bccList.length > 0 ? bccList : undefined,
              campaignId: campaignDoc?.id || undefined,
            })
          });
          if (!res.ok) { totalResults.failed += batches[batchIdx].length; continue; }
          const data = await res.json();
          totalResults.successful += data.results?.successful || 0;
          totalResults.failed += data.results?.failed || 0;
          
          // Gather successful ones from this batch
          const batchErrors = data.results?.errors || [];
          const failedInBatch = new Set(batchErrors.map((e: any) => e.recipient?.email || e.recipient?.phone || ''));
          for (const r of batches[batchIdx]) {
            const key = r.email || r.phone || '';
            if (key && !failedInBatch.has(key)) {
              successfulRecipients.push(key);
            }
          }
        } catch { totalResults.failed += batches[batchIdx].length; }
      }
      
      // Track campaign in Firestore (broadcast only)
      if (sendMode === 'broadcast') {
        const newSentEmails = [...Array.from(sentSet), ...successfulRecipients];
        const firstChar = batchAudience[0]?.email?.charAt(0)?.toUpperCase() || '?';
        const lastChar = batchAudience[batchAudience.length - 1]?.email?.charAt(0)?.toUpperCase() || '?';
        const rangeLabel = `${firstChar}–${lastChar}`;
        const targetTotal = Math.max(campaignDoc?.totalRecipients || 0, finalAudience.length);
        const isComplete = newSentEmails.length >= targetTotal;
        
        const campaignData = {
          name: subject || 'Untitled Campaign',
          subject, message: message, type: campaignType,
          status: isComplete ? 'completed' : 'active',
          totalRecipients: targetTotal,
          sentCount: newSentEmails.length,
          sentEmails: newSentEmails,
          dailyLimit,
          lastRange: rangeLabel,
          lastSentAt: serverTimestamp(),
          ...(campaignDoc ? {} : { createdAt: serverTimestamp() }),
        };
        
        if (campaignDoc?.id) {
          await updateDoc(doc(db, 'marketing_campaigns', campaignDoc.id), campaignData);
        } else {
          const newDoc = await addDoc(collection(db, 'marketing_campaigns'), campaignData);
          campaignDoc = { id: newDoc.id, ...campaignData };
        }
        setActiveCampaign({ ...campaignDoc, ...campaignData });
        
        // Create calendar task for next batch
        if (!isComplete) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const remaining = finalAudience.length - newSentEmails.length;
          await addDoc(collection(db, 'realtime_tasks'), {
            title: `📧 Continue Email Campaign: ${subject}`,
            description: `Send next ${Math.min(dailyLimit, remaining)} emails. ${newSentEmails.length}/${finalAudience.length} sent so far (${rangeLabel} completed). ${remaining} remaining.`,
            dueDate: tomorrow.toISOString().split('T')[0],
            status: 'pending',
            priority: 'high',
            category: 'marketing',
            createdAt: serverTimestamp(),
          });
        }
      }
      
      // Done
      setSendProgress('');
      setSendSuccess(true);
      const remaining = sendMode === 'broadcast' ? finalAudience.length - (activeCampaign?.sentCount || 0) - successfulRecipients.length : 0;
      alert(`✅ Batch Complete!\n\nSent: ${totalResults.successful.toLocaleString()}\nFailed: ${totalResults.failed.toLocaleString()}${sendMode === 'broadcast' ? `\nRemaining: ${remaining.toLocaleString()}` : ''}${remaining > 0 ? '\n\n📅 Next batch task added to calendar for tomorrow.' : sendMode === 'broadcast' ? '\n\n🎉 Campaign complete! All recipients reached.' : ''}`);
      
      import('../../lib/turso').then(({ turso }) => {
        turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "Marketing_Campaign", "System", JSON.stringify({ type: campaignType, count: successfulRecipients.length, success: totalResults.successful, failed: totalResults.failed })] }).catch(console.error);
      });
      
      setTimeout(() => { setSendSuccess(false); }, 4000);
    } catch (err: any) {
      console.error('Marketing API error:', err);
      alert(`Network Error: ${err.message || 'Failed to contact API.'}`);
    } finally {
      setIsSending(false);
      setSendProgress('');
    }
  };

  const isPatientRenewal = selectedTypes.includes('patient');
  const renewalTypeLabel = isPatientRenewal ? 'Patient' : 'Business';
  const renewalTypeLabelPlural = isPatientRenewal ? 'patients' : 'businesses';
  const renewalCardOrLicense = isPatientRenewal ? 'cards' : 'licenses';

  return (
    <div className="h-full min-h-full flex flex-col bg-slate-900 text-slate-100 font-sans">
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
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Verified Emails</p>
              <p className="text-2xl font-black text-white">{verifiedEmailsCount.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Active Campaigns</p>
              <p className="text-2xl font-black text-indigo-400">{allCampaigns.filter(c => c.status === 'active').length || 0}</p>
            </div>
            {gmailStats && (
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Inbox</p>
                <p className="text-2xl font-black text-cyan-400">{gmailStats.unread || 0}<span className="text-sm text-slate-500 ml-1">unread</span></p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-10 pb-20 bg-slate-900">
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
            <div id="marketing-composer" className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-500">
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

                {/* From Address */}
                {campaignType === 'email' && (
                  <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 rounded-xl px-5 py-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">From</span>
                    <span className="text-sm font-bold text-white">
                      {(() => {
                        const email = import.meta.env.VITE_SMTP_FROM_EMAIL || 'marketing@ggp-os.com';
                        const match = email.match(/<([^>]+)>/);
                        return match ? match[1] : email;
                      })()}
                    </span>
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-emerald-500/30 shrink-0">Official Domain</span>
                  </div>
                )}

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

                {/* CC / BCC Fields */}
                {campaignType === 'email' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CC (optional)</label>
                      <input 
                        type="text" 
                        value={ccEmails}
                        onChange={(e) => setCcEmails(e.target.value)}
                        placeholder="email1@..., email2@..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">BCC (optional)</label>
                      <input 
                        type="text" 
                        value={bccEmails}
                        onChange={(e) => setBccEmails(e.target.value)}
                        placeholder="email1@..., email2@..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-all font-medium text-sm"
                      />
                    </div>
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
                    {sendSuccess ? 'Sent Successfully!' : isSending ? (sendProgress || 'Sending...') : 'Launch Campaign'}
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
                      {campaignType === 'email' ? <Mail size={12} /> : <MessageSquare size={12} />} Recipient{directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).length > 1 ? 's' : ''} {campaignType === 'email' ? '(Email)' : '(Phone)'}
                    </label>
                    <textarea 
                      value={directContact}
                      onChange={(e) => setDirectContact(e.target.value)}
                      placeholder={campaignType === 'email' ? 'Enter emails separated by commas or new lines:\ne.g., john@example.com, jane@example.com' : 'Enter phone numbers separated by commas:\ne.g., 555-123-4567, 555-987-6543'}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors font-medium resize-none text-sm"
                    />
                    <p className="text-[9px] text-slate-500 mt-1.5 font-medium">Separate multiple recipients with commas, semicolons, or new lines</p>
                  </div>
                  <div className={cn("p-6 rounded-2xl text-center", directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).length > 30 ? 'border border-amber-500/30 bg-amber-500/5' : 'border border-indigo-500/30 bg-indigo-500/5')}>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Direct Message Mode</p>
                    <p className="text-2xl font-black text-white">{directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).length || 0} Recipient{directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).length !== 1 ? 's' : ''}</p>
                    {directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).length > 30 && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-[10px] text-amber-400 font-bold flex items-center justify-center gap-1.5">
                          <AlertTriangle size={12} /> Recommended max: 30 recipients
                        </p>
                        <p className="text-[9px] text-amber-400/70 mt-1">Sending to more than 30 may cause SMTP timeouts. Use Broadcast mode for large sends.</p>
                      </div>
                    )}
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

                {/* Patient Renewal Filter */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <CalendarDays size={12} /> {renewalTypeLabel} Renewal Filter
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => setRenewalMode('off')}
                      className={cn(
                        "py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                        renewalMode === 'off' ? "bg-slate-600 text-white shadow-sm" : "bg-slate-950 text-slate-500 border border-slate-700 hover:text-white"
                      )}
                    >Off</button>
                    <button
                      onClick={() => setRenewalMode('month')}
                      className={cn(
                        "py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                        renewalMode === 'month' ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30" : "bg-slate-950 text-slate-500 border border-slate-700 hover:text-white"
                      )}
                    >📅 By Month</button>
                    <button
                      onClick={() => setRenewalMode('all_expired')}
                      className={cn(
                        "py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                        renewalMode === 'all_expired' ? "bg-red-600 text-white shadow-sm shadow-red-500/30" : "bg-slate-950 text-slate-500 border border-slate-700 hover:text-white"
                      )}
                    >🔴 All Expired</button>
                  </div>

                  {renewalMode === 'month' && (
                    <div className="bg-slate-950 rounded-xl border border-slate-700 p-3">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setRenewalMonth(prev => {
                            const d = new Date(prev.year, prev.month - 1, 1);
                            return { year: d.getFullYear(), month: d.getMonth() };
                          })}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <div className="text-center">
                          <p className="text-white font-black text-sm">
                            {new Date(renewalMonth.year, renewalMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-[9px] text-slate-500 font-bold mt-0.5">{renewalTypeLabelPlural} expiring this month</p>
                        </div>
                        <button
                          onClick={() => setRenewalMonth(prev => {
                            const d = new Date(prev.year, prev.month + 1, 1);
                            return { year: d.getFullYear(), month: d.getMonth() };
                          })}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                          <CalendarDays size={12} />
                          {filteredCount} {filteredCount === 1 ? renewalTypeLabel.toLowerCase() : renewalTypeLabelPlural} with {renewalCardOrLicense} expiring in {new Date(renewalMonth.year, renewalMonth.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}

                  {renewalMode === 'all_expired' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-1">
                      <p className="text-[10px] text-red-400 font-bold flex items-center gap-1.5">
                        <CalendarDays size={12} /> Showing all {renewalTypeLabelPlural} with expired {renewalCardOrLicense}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-1">{filteredCount} {filteredCount === 1 ? renewalTypeLabel.toLowerCase() : renewalTypeLabelPlural} past their renewal date</p>
                    </div>
                  )}
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <TrendingUp size={12} /> Priority Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all' as const, label: 'All Leads' },
                      { id: 'top_grossing' as const, label: '💰 Top Grossing' },
                      { id: 'standard' as const, label: 'Standard' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTier(t.id)}
                        className={cn(
                          "py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                          selectedTier === t.id
                            ? t.id === 'top_grossing' ? "bg-amber-500 text-black shadow-sm shadow-amber-500/30" : "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-950 text-slate-500 border border-slate-700 hover:text-white"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  {selectedTier === 'top_grossing' && (
                    <p className="text-[10px] text-amber-400 mt-2 font-bold flex items-center gap-1">
                      💰 Targeting top-grossing dispensaries only (~$3.9B combined revenue)
                    </p>
                  )}
                </div>

                {/* ═══ CAMPAIGN PRESETS ═══ */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <label htmlFor="campaign-presets-select" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    📋 Campaign Presets
                  </label>
                  <p className="text-[9px] text-slate-500 font-medium mb-3">One-click presets to target audience segments with Valuation Briefs or License/Card Renewal Reminders.</p>

                  <select
                    id="campaign-presets-select"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'hub') {
                        setSelectedTypes(['agency', 'advocate', 'attorney', 'provider', 'backoffice', 'distribution', 'other']);
                        setSelectedStates(['All']);
                        setSelectedTier('all');
                        setRenewalMode('off');
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject('51 Jurisdictions. Zero Interoperability. Until Now.');
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;">
  <div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;">
    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Strategic Valuation Brief</p>
    <h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Global Green Hybrid Platform</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">The first unified compliance operating system for regulated cannabis.</p>
  </div>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">To Whom It May Concern,</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Cannabis regulation is the most fragmented compliance landscape in American government. Every state operates its own licensing authority, tracking system, and enforcement protocols &mdash; none of which communicate with each other.</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>We solved that.</strong></p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> is the first and only unified compliance operating system that connects state regulators, federal agencies, law enforcement, governor's offices, attorneys, providers, and advocacy organizations on a single, auditable, real-time backbone &mdash; across all 50 states and DC.</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">The attached Strategic Valuation Brief outlines what this platform replaces, how it works, and why your office needs access to it before interstate commerce begins.</p>
  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
    <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 800; margin: 0 0 12px;">Key Facts</p>
    <p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">Registered at every level of government (SAM.gov, OMES, BidNet, OKC Trusts)<br>WOSB and Minority-Owned certified<br>HIPAA compliant, AES-256 encrypted, court-admissible audit trails<br>Two AI engines (Sylara + L.A.R.R.Y) &mdash; predictive enforcement, not reactive<br>Metrc validated integrator with full production API access</p>
  </div>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">This is not a pitch deck. It's an infrastructure briefing. No financials, no pricing &mdash; just the architecture your jurisdiction is missing.</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">I welcome a 15-minute call at your convenience.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">View the Full Valuation Brief</a>
  </div>
  <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;">
    <p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Respectfully,</strong></p>
    <p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Shantell Robinson</p>
    <p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Founder and CEO, Global Green Enterprise Inc.</p>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | 645-246-8277<br>CAGE: 9KXZ2 | UEI: TY1BQ3XK3925 | SAM.gov Active | BBB A+ Rated<br>WOSB Certified | HIPAA Compliant | AES-256 Encryption</p>
  </div>
</div>`);
                        alert('✅ HUB Preset Loaded!\n\n📋 Audience: All agency, gov, advocate, attorney, provider types\n📧 Subject & body pre-filled with valuation brief\n🌐 All states selected\n\nReview the audience count and hit Launch Campaign when ready.');
                      } else if (val === 'gov') {
                        setSelectedTypes(['agency']);
                        setSelectedStates(['All']);
                        setSelectedTier('all');
                        setRenewalMode('off');
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject('Briefing: The First Compliance OS Registered at Every Level of Government');
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;"><div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Strategic Valuation Brief &mdash; Government and State Agencies</p><h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Global Green Hybrid Platform</h1><p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">Purpose-built compliance infrastructure for regulatory authorities.</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Dear Director,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Your agency oversees a cannabis market with no unified compliance infrastructure. Licensees operate across disconnected tracking systems, enforcement is reactive, and cross-jurisdictional visibility does not exist.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> was built specifically to solve this for agencies like yours. It is not a vendor product seeking approval &mdash; it is a compliance operating system already registered at the federal, state, county, and municipal level.</p><div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 800; margin: 0 0 12px;">The Attached Brief Details</p><p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">How GGHP-OS replaces fragmented tracking with real-time, cross-state visibility<br>The L.A.R.R.Y predictive enforcement engine that forecasts violations before they occur<br>Role-based dashboards purpose-built for regulatory authorities<br>Full SAM.gov integration with daily entity verification and debarment monitoring</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">We are currently scheduling agency evaluation briefings. No commitment required &mdash; just a conversation about what your office is currently missing.</p><div style="text-align: center; margin: 32px 0;"><a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px;">View the Full Valuation Brief</a></div><div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;"><p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Respectfully,</strong></p><p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Shantell Robinson</p><p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Founder and CEO, Global Green Enterprise Inc.</p><p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | 645-246-8277<br>CAGE: 9KXZ2 | SAM.gov Active | BBB A+ Rated</p></div></div>`);
                      } else if (val === 'advocates') {
                        setSelectedTypes(['advocate']);
                        setSelectedStates(['All']);
                        setSelectedTier('all');
                        setRenewalMode('off');
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject('The Data Your Advocacy Work Has Been Missing');
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;"><div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Strategic Valuation Brief &mdash; Advocacy and Research</p><h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Global Green Hybrid Platform</h1><p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">Intelligence infrastructure for evidence-based policy advocacy.</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Good afternoon,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Evidence-based cannabis policy requires data that does not exist in any public system today &mdash; anonymized health outcomes, social equity metrics, community impact measurements, and compliance trends across jurisdictions.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> is the first platform that aggregates this data across all 50 states into a single, auditable infrastructure. For advocacy and research organizations, this means access to the intelligence layer that turns position papers into policy.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">The attached brief outlines the platform's architecture, its proprietary scoring systems (including the C3 Cannabis Compassion Score), and how advocacy organizations fit into the stakeholder ecosystem.</p><div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 16px 24px; margin: 24px 0;"><p style="font-size: 14px; color: #166534; line-height: 1.8; margin: 0;">We are a certified <strong>Woman-Owned, Minority-Owned, Black American-Owned, and American Indian-Owned</strong> small business. This platform was built by someone who understands the communities your organization serves.</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">I would welcome a brief conversation about how we can support your work.</p><div style="text-align: center; margin: 32px 0;"><a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px;">View the Full Valuation Brief</a></div><div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;"><p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Warm regards,</strong></p><p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Shantell Robinson</p><p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Founder and CEO, Global Green Enterprise Inc.</p><p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | 645-246-8277<br>CAGE: 9KXZ2 | SAM.gov Active | BBB A+ Rated</p></div></div>`);
                      } else if (val === 'attorneys') {
                        setSelectedTypes(['attorney']);
                        setSelectedStates(['All']);
                        setSelectedTier('all');
                        setRenewalMode('off');
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject("Your Clients' Compliance Records Should Be Court-Ready. They're Not.");
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;"><div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Strategic Valuation Brief &mdash; Legal Professionals</p><h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Global Green Hybrid Platform</h1><p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">Evidentiary-grade compliance records for legal proceedings.</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Counselor,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">When you represent a cannabis licensee, the compliance data you need is scattered across state portals, spreadsheets, and disconnected tracking systems. Nothing is standardized. Nothing is court-ready.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> changes that. Every action on our platform is logged with timestamps, user attribution, explainable AI reasoning, and an immutable audit trail &mdash; built to withstand regulatory scrutiny and legal challenge.</p><div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;"><p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 800; margin: 0 0 12px;">The Attached Brief Outlines</p><p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">How the platform creates evidentiary-grade compliance records<br>Real-time license status verification across all 50 states<br>Dynamic risk scoring with explainable, defensible methodology<br>Cross-jurisdictional visibility for multi-state operators</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">If your practice touches cannabis licensing, compliance disputes, or regulatory defense, this platform is the infrastructure behind your next case. Available for a call at your convenience.</p><div style="text-align: center; margin: 32px 0;"><a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px;">View the Full Valuation Brief</a></div><div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;"><p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Regards,</strong></p><p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Shantell Robinson</p><p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Founder and CEO, Global Green Enterprise Inc.</p><p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | 645-246-8277<br>CAGE: 9KXZ2 | SAM.gov Active | BBB A+ Rated</p></div></div>`);
                      } else if (val === 'providers') {
                        setSelectedTypes(['provider']);
                        setSelectedStates(['All']);
                        setSelectedTier('all');
                        setRenewalMode('off');
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject('Your Patient Pipeline Deserves Real-Time Compliance Infrastructure');
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;"><div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;"><p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Strategic Valuation Brief &mdash; Healthcare Providers</p><h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Global Green Hybrid Platform</h1><p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">Automated patient intake and compliance infrastructure for clinics.</p></div><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Doctor,</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Your patients depend on timely medical card approvals, renewal reminders, and compliant physician coordination across state lines. The current system is manual, fragmented, and slow.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>GGHP-OS</strong> automates the entire patient intake lifecycle &mdash; from telehealth scheduling and physician matching to state registry submission and renewal alerts &mdash; across all 50 states and 26 languages.</p><p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">The attached brief outlines how the platform's AI engine (Sylara) handles the majority of patient interactions without human escalation, and how providers like you gain real-time visibility into patient compliance status, renewal timelines, and cross-state reciprocity.</p><div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 16px 24px; margin: 24px 0;"><p style="font-size: 14px; color: #0C4A6E; line-height: 1.8; margin: 0;">We are scheduling provider onboarding calls this month. No obligation &mdash; just a walkthrough of what the platform does for your practice.</p></div><div style="text-align: center; margin: 32px 0;"><a href="https://globalgreenhp.com/GGHP_Agency_Valuation_Brief.html" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px;">View the Full Valuation Brief</a></div><div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;"><p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Best,</strong></p><p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Shantell Robinson</p><p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Founder and CEO, Global Green Enterprise Inc.</p><p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | 645-246-8277<br>CAGE: 9KXZ2 | SAM.gov Active | BBB A+ Rated</p></div></div>`);
                      } else if (val === 'patient_renewal') {
                        setSelectedTypes(['patient']);
                        setSelectedStates(['OK']);
                        setSelectedTier('all');
                        setRenewalMode('month');
                        setRenewalMonth({ year: 2026, month: 3 }); // Set to April 2026 by default
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject('Action Required: Your Medical Cannabis Card is Expiring Soon');
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;">
  <div style="background: linear-gradient(135deg, #0A3D2A, #1E5E44); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;">
    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Medical Card Renewal Reminder</p>
    <h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Your Medical Cannabis Card is Expiring Soon</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">Keep your patient status active to ensure uninterrupted access.</p>
  </div>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Hello,</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">According to our compliance records, your state-issued Medical Cannabis Patient Card is set to expire soon. In order to maintain your legal patient status, tax-exempt benefits, and purchasing limits, you must complete your physician renewal consultation and submit your state application prior to the expiration date.</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>We have made the renewal process simple:</strong></p>
  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
    <p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">
      1. <strong>Book a Physician Consultation:</strong> Consult with a licensed medical professional via our secure HIPAA-compliant telehealth platform.<br/>
      2. <strong>Get Your Recommendation:</strong> Receive your physician certification automatically synced to the state registry.<br/>
      3. <strong>State Submission:</strong> Complete your application check within 5 minutes.
    </p>
  </div>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">Click below to schedule your consultation and secure your medical status today.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://globalgreenhp.com/schedule" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #1E5E44); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">Schedule Renewal Consultation</a>
  </div>
  <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;">
    <p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Respectfully,</strong></p>
    <p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Patient Care Compliance Team</p>
    <p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Global Green Hybrid Platform</p>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | support@globalgreenhp.com<br>HIPAA Compliant | AES-256 Encryption</p>
  </div>
</div>`);
                        alert('✅ Patient Renewal Preset Loaded!\n\n📋 Audience: All Patient types\n📅 Renewal Mode: Expiring in Selected Month\n📧 Subject & body pre-filled with patient card renewal template\n🌐 All states selected\n\nReview the audience count and hit Launch Campaign when ready.');
                      } else if (val === 'business_renewal') {
                        setSelectedTypes(['dispensary', 'grower', 'processor', 'distribution', 'other']);
                        setSelectedStates(['All']);
                        setSelectedTier('all');
                        setRenewalMode('month');
                        setRenewalMonth({ year: 2026, month: 3 }); // Set to April 2026 by default
                        setCampaignType('email');
                        setSendMode('broadcast');
                        setSubject('Compliance Alert: Your Cannabis Business License is Expiring Soon');
                        setMessage(`<div style="font-family: 'Inter', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 0;">
  <div style="background: linear-gradient(135deg, #061F15, #0A3D2A); padding: 40px 32px; border-radius: 16px; color: white; margin-bottom: 28px;">
    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF77; font-weight: 800; margin: 0 0 16px;">Compliance & Licensing Alert</p>
    <h1 style="font-size: 26px; font-weight: 900; margin: 0 0 8px; line-height: 1.2;">Your Cannabis Business License Expiration Reminder</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin: 0;">Keep your operations active, compliant, and open.</p>
  </div>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">To the Licensee / Compliance Officer,</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;">Our system has flagged that your state cannabis business license is approaching its expiration date. Operating on an expired or unrenewed license is a major compliance violation that can result in immediate closure, hefty fines, or suspension of your tracking system access.</p>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 18px;"><strong>Steps to secure your renewal:</strong></p>
  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
    <p style="font-size: 14px; color: #334155; line-height: 2; margin: 0;">
      • <strong>Submit Renewal Application:</strong> Upload all tax clearance certificates, property disclosures, and local authority permits to the state registry portal.<br/>
      • <strong>Update Track-and-Trace Integration:</strong> Ensure your Metrc/API keys are up to date and that no pending inventory transfers are halted.<br/>
      • <strong>Audit Compliance Records:</strong> Run a pre-renewal check of your security logs and daily inventory counts to prepare for state inspection.
    </p>
  </div>
  <p style="font-size: 15px; color: #334155; line-height: 1.8; margin: 0 0 28px;">If you have already submitted your renewal application, please reply to this email or update your status in the GGHP-OS compliance portal to keep our tracking logs synchronized.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="https://globalgreenhp.com/compliance" style="display: inline-block; background: linear-gradient(135deg, #0A3D2A, #134D36); color: #E8D5B5; padding: 16px 44px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">Open Compliance Dashboard</a>
  </div>
  <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; margin-top: 32px;">
    <p style="font-size: 14px; color: #334155; margin: 0 0 4px;"><strong>Best Regards,</strong></p>
    <p style="font-size: 15px; color: #0A3D2A; font-weight: 800; margin: 0 0 4px;">Global Green Compliance Team</p>
    <p style="font-size: 13px; color: #64748B; margin: 0 0 12px;">Global Green Enterprise Inc.</p>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.8; margin: 0;">1-888-963-4447 | compliance@globalgreenhp.com<br>WOSB Certified | SAM.gov Active | Metrc Validated Integrator</p>
  </div>
</div>`);
                        alert('✅ Business Renewal Preset Loaded!\n\n📋 Audience: All Cannabis Business types\n📅 Renewal Mode: Expiring in Selected Month\n📧 Subject & body pre-filled with business license renewal template\n🌐 All states selected\n\nReview the audience count and hit Launch Campaign when ready.');
                      }
                      // Reset the value so the select acts as a trigger button
                      e.target.value = '';
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors font-medium cursor-pointer text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Campaign Preset...</option>
                    <option value="hub">🏛️ HUB — All Agency & Partner Types</option>
                    <option value="gov">🏢 Gov/Agency Preset</option>
                    <option value="advocates">📣 Advocates Preset</option>
                    <option value="attorneys">⚖️ Attorneys Preset</option>
                    <option value="providers">🩺 Providers Preset</option>
                    <option value="patient_renewal">🩺 Patient Card Renewal Preset</option>
                    <option value="business_renewal">🏢 Business License Renewal Preset</option>
                  </select>
                  <p className="text-[9px] text-slate-500 mt-2 font-medium text-center">SWEEP sends segmented campaigns per audience type</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-5">
                  {/* Daily Send Limit */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Daily Send Limit</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 250, 500].map(lim => (
                        <button key={lim} onClick={() => setDailyLimit(lim)} className={cn("py-2 rounded-lg text-xs font-black transition-all", dailyLimit === lim ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-950 text-slate-500 border border-slate-700 hover:text-white")}>{lim}</button>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  {(() => {
                    // Compute ACTUAL unsent within the current filtered audience
                    const sentSet = new Set<string>(activeCampaign?.sentEmails || []);
                    const unsentInFilter = filteredAudience.filter(d => {
                      const key = campaignType === 'email' ? (d.email || '') : (d.phone || '');
                      return key && !sentSet.has(key);
                    }).length;
                    const thisBatch = Math.max(0, Math.min(dailyLimit, unsentInFilter));
                    const sentInFilter = filteredCount - unsentInFilter;
                    
                    return (
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-700 space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">This Batch</p>
                      <p className="text-3xl font-black text-white">{thisBatch.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 font-medium">of {filteredCount.toLocaleString()} total recipients ({sentInFilter > 0 ? `${sentInFilter} already sent` : 'none sent yet'})</p>
                    
                      {/* Timeline */}
                      <div className="pt-3 border-t border-slate-800">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Estimated Timeline</p>
                        <p className="text-sm font-bold text-white">{unsentInFilter > 0 ? `${Math.ceil(unsentInFilter / dailyLimit)} days to complete` : 'All sent ✅'}</p>
                      </div>

                      {/* Active Campaign Progress */}
                      {activeCampaign && activeCampaign.status === 'active' && (
                        <div className="pt-3 border-t border-slate-800">
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Active Campaign Progress</p>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, (activeCampaign.sentCount / activeCampaign.totalRecipients) * 100)}%` }} />
                          </div>
                          <p className="text-xs font-bold text-white">{activeCampaign.sentCount.toLocaleString()} / {activeCampaign.totalRecipients.toLocaleString()} sent</p>
                          {activeCampaign.lastRange && <p className="text-[10px] text-slate-500 mt-1">Last batch: {activeCampaign.lastRange}</p>}
                          <button
                            onClick={async () => {
                              if (!confirm('Start a new campaign? This will reset the "already sent" tracker so all recipients become eligible again.')) return;
                              const { updateDoc: uDoc, doc: dRef } = await import('firebase/firestore');
                              await uDoc(dRef(db, 'marketing_campaigns', activeCampaign.id), { status: 'completed' });
                              setActiveCampaign(null);
                            }}
                            className="mt-3 w-full py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-500/30 transition-all"
                          >
                            ↻ New Campaign (Reset Sent Tracker)
                          </button>
                        </div>
                      )}
                    </div>
                    );
                  })()}
                </div>
              </div>
              )}
            </div>

            {/* 📋 Campaign History */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                <BarChart2 className="text-indigo-400" size={16} /> Campaign History
              </h3>
              {allCampaigns.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-6">No campaigns sent yet</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {allCampaigns
                    .sort((a: any, b: any) => {
                      // Active first, then by sent date desc
                      if (a.status === 'active' && b.status !== 'active') return -1;
                      if (b.status === 'active' && a.status !== 'active') return 1;
                      const tA = a.lastSentAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
                      const tB = b.lastSentAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
                      return tB.getTime() - tA.getTime();
                    })
                    .map((camp: any, i: number) => {
                      const pct = camp.totalRecipients > 0 ? Math.min(100, Math.round((camp.sentCount / camp.totalRecipients) * 100)) : 0;
                      const remaining = Math.max(0, (camp.totalRecipients || 0) - (camp.sentCount || 0));
                      const isActive = camp.status === 'active';
                      const isCurrentActive = activeCampaign?.id === camp.id;
                      const sentDate = camp.lastSentAt?.toDate?.() || camp.createdAt?.toDate?.();
                      const dateLabel = sentDate ? sentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
                      
                      return (
                        <div key={camp.id || i} className={cn(
                          "p-4 rounded-2xl border transition-all",
                          isCurrentActive 
                            ? "bg-emerald-500/10 border-emerald-500/30" 
                            : isActive 
                              ? "bg-indigo-500/10 border-indigo-500/20" 
                              : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                        )}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="text-sm font-black text-white truncate">{camp.name || camp.subject || 'Untitled Campaign'}</p>
                              <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                                {dateLabel && `${dateLabel} • `}{camp.type === 'sms' ? 'SMS' : 'Email'}{camp.lastRange ? ` • Range: ${camp.lastRange}` : ''}
                              </p>
                            </div>
                            <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0",
                              isActive ? 'bg-emerald-500/20 text-emerald-400' : 
                              camp.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 
                              'bg-slate-700 text-slate-400'
                            )}>
                              {isCurrentActive ? '● Active' : camp.status || 'draft'}
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                            <div className={cn("h-full rounded-full transition-all", isActive ? "bg-emerald-500" : "bg-indigo-500")} style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] text-slate-400 font-bold">
                              {(camp.sentCount || 0).toLocaleString()} / {(camp.totalRecipients || 0).toLocaleString()} sent ({pct}%)
                              {remaining > 0 && <span className="text-amber-400 ml-1">• {remaining.toLocaleString()} left</span>}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="space-y-2 mt-3">
                            {/* Warning if campaign has no saved message body */}
                            {!camp.message && remaining > 0 && (
                              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <p className="text-[10px] text-amber-400 font-bold flex items-center gap-1.5 mb-2">
                                  <AlertTriangle size={12} /> Message body not saved — load a template or paste your content above
                                </p>
                                <button
                                  onClick={() => {
                                    // Pre-fill subject and scroll to composer
                                    if (camp.subject) setSubject(camp.subject);
                                    setSendMode('broadcast');
                                    setCampaignType(camp.type || 'email');
                                    setShowTemplates(true);
                                  }}
                                  className="w-full py-2 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <LayoutTemplate size={10} /> Load from Saved Template
                                </button>
                              </div>
                            )}
                            <div className="flex gap-2">
                            {remaining > 0 && (
                              <button
                                onClick={async () => {
                                  // If this isn't the active campaign, switch to it
                                  if (!isCurrentActive) {
                                    if (activeCampaign && activeCampaign.id !== camp.id) {
                                      await updateDoc(doc(db, 'marketing_campaigns', activeCampaign.id), { status: 'completed' });
                                    }
                                    await updateDoc(doc(db, 'marketing_campaigns', camp.id), { status: 'active' });
                                    setActiveCampaign(camp);
                                  }
                                  // Pre-fill the composer with subject + message
                                  if (camp.subject) setSubject(camp.subject);
                                  if (camp.message) setMessage(camp.message);
                                  setSendMode('broadcast');
                                  setCampaignType(camp.type || 'email');
                                  // Scroll to the composer
                                  setTimeout(() => {
                                    const el = document.getElementById('marketing-composer');
                                    if (el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      el.style.borderColor = '#22c55e';
                                      el.style.boxShadow = '0 0 30px rgba(34,197,94,0.3)';
                                      setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 2000);
                                    }
                                  }, 100);
                                  // If no message body, prompt them
                                  if (!camp.message) {
                                    setTimeout(() => {
                                      alert('📝 Subject loaded! Paste your email body/flyer in the Message Body field, then hit Launch Campaign.\n\nGoing forward, the body will be auto-saved with every send.');
                                    }, 300);
                                  }
                                }}
                                className={cn(
                                  "flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5",
                                  isCurrentActive 
                                    ? "bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/20" 
                                    : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
                                )}
                              >
                                <Send size={10} /> {isCurrentActive ? `Send Next ${Math.min(dailyLimit, remaining)}` : `Resume (${Math.min(dailyLimit, remaining)} next)`}
                              </button>
                            )}
                            {remaining === 0 && (
                              <p className="flex-1 py-2 text-center text-[10px] font-bold text-blue-400 uppercase tracking-wider">✅ Completed</p>
                            )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* 📬 Gmail Inbox Monitor */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Inbox className="text-cyan-400" size={16} /> Marketing Inbox
                </h3>
                <button
                  onClick={fetchGmail}
                  disabled={gmailLoading}
                  className={cn("flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all", gmailLoading ? "text-slate-500 bg-slate-800" : "text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20")}
                >
                  <RefreshCw size={10} className={gmailLoading ? 'animate-spin' : ''} />
                  {gmailLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {/* Gmail Tabs */}
              <div className="flex gap-1 mb-4 bg-slate-800/50 rounded-xl p-1">
                {([
                  { id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: gmailInbox.length },
                  { id: 'sent' as const, label: 'Sent', icon: Send, count: gmailSent.length },
                  { id: 'bounces' as const, label: 'Bounces', icon: AlertTriangle, count: gmailBounces.length },
                  { id: 'replies' as const, label: 'Replies', icon: Reply, count: gmailReplies.length },
                ]).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setGmailTab(tab.id); setCheckedEmailIds(new Set()); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      gmailTab === tab.id
                        ? "bg-white/10 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <tab.icon size={10} />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-black", 
                        tab.id === 'bounces' ? 'bg-red-500/20 text-red-400' : 
                        tab.id === 'replies' ? 'bg-emerald-500/20 text-emerald-400' : 
                        'bg-slate-700 text-slate-300'
                      )}>{tab.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {gmailError && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                  <AlertCircle size={14} className="text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-300">{gmailError}</p>
                </div>
              )}

              {/* Batch Actions Bar */}
              {checkedEmailIds.size > 0 && (
                <div className="flex gap-2 mb-3 bg-slate-800/80 p-2.5 rounded-xl border border-white/5 animate-in fade-in duration-200">
                  <span className="text-[10px] text-slate-400 font-bold self-center ml-2">{checkedEmailIds.size} selected</span>
                  <button onClick={handleDeleteSelected} className="ml-auto flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-lg transition-all">
                    <Trash2 size={10} /> Delete
                  </button>
                  <button onClick={() => setShowMoveModal(true)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                    <Folder size={10} /> Move To Folder
                  </button>
                </div>
              )}

              {/* Gmail Content */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gmailTab === 'inbox' && gmailInbox.map((msg, i) => {
                  const isChecked = checkedEmailIds.has(String(msg.id));
                  return (
                    <div key={msg.id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleViewEmail(msg, 'inbox')}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => {
                          const next = new Set(checkedEmailIds);
                          if (e.target.checked) next.add(String(msg.id));
                          else next.delete(String(msg.id));
                          setCheckedEmailIds(next);
                        }}
                        className="mt-1 accent-indigo-500 w-4 h-4 shrink-0" 
                      />
                      <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", msg.isRead ? 'bg-slate-600' : 'bg-cyan-400')} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">{msg.from}</p>
                        <p className="text-[11px] text-slate-400 truncate">{msg.subject}</p>
                      </div>
                      <p className="text-[9px] text-slate-600 shrink-0 mt-1">{msg.date ? new Date(msg.date).toLocaleDateString() : ''}</p>
                    </div>
                  );
                })}
                {gmailTab === 'sent' && gmailSent.map((s, i) => {
                  const isChecked = checkedEmailIds.has(String(s.id));
                  return (
                    <div key={s.id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleViewEmail(s, 'sent')}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => {
                          const next = new Set(checkedEmailIds);
                          if (e.target.checked) next.add(String(s.id));
                          else next.delete(String(s.id));
                          setCheckedEmailIds(next);
                        }}
                        className="mt-1 accent-indigo-500 w-4 h-4 shrink-0" 
                      />
                      <Send size={14} className="text-indigo-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-200 truncate">To: {s.to}</p>
                        <p className="text-[11px] text-slate-400 truncate">{s.subject}</p>
                      </div>
                      <p className="text-[9px] text-slate-600 shrink-0 mt-1">{s.date ? new Date(s.date).toLocaleDateString() : ''}</p>
                    </div>
                  );
                })}
                {gmailTab === 'bounces' && gmailBounces.map((b, i) => {
                  const isChecked = checkedEmailIds.has(String(b.id));
                  return (
                    <div key={b.id || i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10 cursor-pointer" onClick={() => handleViewEmail(b, 'bounces')}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => {
                          const next = new Set(checkedEmailIds);
                          if (e.target.checked) next.add(String(b.id));
                          else next.delete(String(b.id));
                          setCheckedEmailIds(next);
                        }}
                        className="mt-1 accent-indigo-500 w-4 h-4 shrink-0" 
                      />
                      <AlertTriangle size={14} className="text-red-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-red-300 truncate">{b.bouncedEmail || 'Unknown recipient'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{b.subject}</p>
                      </div>
                      <p className="text-[9px] text-slate-600 shrink-0 mt-1">{b.date ? new Date(b.date).toLocaleDateString() : ''}</p>
                    </div>
                  );
                })}
                {gmailTab === 'replies' && gmailReplies.map((r, i) => {
                  const isChecked = checkedEmailIds.has(String(r.id));
                  return (
                    <div key={r.id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => handleViewEmail(r, 'replies')}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onClick={(e) => e.stopPropagation()} 
                        onChange={(e) => {
                          const next = new Set(checkedEmailIds);
                          if (e.target.checked) next.add(String(r.id));
                          else next.delete(String(r.id));
                          setCheckedEmailIds(next);
                        }}
                        className="mt-1 accent-indigo-500 w-4 h-4 shrink-0" 
                      />
                      <Reply size={14} className="text-emerald-400 mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-300 truncate">{r.from}</p>
                        <p className="text-[10px] text-slate-400 truncate">{r.subject}</p>
                      </div>
                      <p className="text-[9px] text-slate-600 shrink-0 mt-1">{r.date ? new Date(r.date).toLocaleDateString() : ''}</p>
                    </div>
                  );
                })}
                {((gmailTab === 'inbox' && gmailInbox.length === 0) || 
                  (gmailTab === 'sent' && gmailSent.length === 0) || 
                  (gmailTab === 'bounces' && gmailBounces.length === 0) || 
                  (gmailTab === 'replies' && gmailReplies.length === 0)) && !gmailLoading && !gmailError && (
                  <p className="text-sm text-slate-500 italic text-center py-6">
                    {gmailTab === 'inbox' ? 'Inbox clear ✨' : gmailTab === 'sent' ? 'No sent messages' : gmailTab === 'bounces' ? 'No bounces detected 🎉' : 'No replies yet'}
                  </p>
                )}
              </div>

              {/* Quick Stats Footer */}
              {gmailStats && (
                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-800">
                  <div className="text-center flex-1">
                    <p className="text-lg font-black text-white">{gmailStats.inbox?.toLocaleString() || 0}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Total</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-lg font-black text-cyan-400">{gmailStats.unread || 0}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Unread</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-lg font-black text-indigo-400">{gmailStats.sent?.toLocaleString() || 0}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Sent</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-lg font-black text-red-400">{gmailStats.spam || 0}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Spam</p>
                  </div>
                </div>
              )}
            </div>
            {/* Campaign Analytics — REAL-TIME */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={16} /> Campaign Analytics
              </h3>
              
              {/* Aggregate Stats */}
              {(() => {
                const totalSent = allCampaigns.reduce((s, c) => s + (c.sentCount || 0), 0);
                const totalOpens = allCampaigns.reduce((s, c) => s + (c.totalOpens || 0), 0);
                const uniqueOpens = allCampaigns.reduce((s, c) => s + (c.openedEmails?.length || 0), 0);
                const totalClicks = allCampaigns.reduce((s, c) => s + (c.totalClicks || 0), 0);
                const openRate = totalSent > 0 ? ((uniqueOpens / totalSent) * 100).toFixed(1) : '0';
                const clickRate = totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : '0';
                return (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Send size={10} className="text-indigo-400" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Sent</p>
                      </div>
                      <p className="text-xl font-black text-white">{totalSent.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MailOpen size={10} className="text-cyan-400" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Opens</p>
                      </div>
                      <p className="text-xl font-black text-cyan-400">{uniqueOpens.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{openRate}% rate</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MousePointerClick size={10} className="text-amber-400" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Clicks</p>
                      </div>
                      <p className="text-xl font-black text-amber-400">{totalClicks.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{clickRate}% rate</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Activity size={10} className="text-emerald-400" />
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Campaigns</p>
                      </div>
                      <p className="text-xl font-black text-emerald-400">{allCampaigns.length}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Real Campaigns List */}
              <div className="space-y-3">
                {allCampaigns.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">No campaigns yet</p>}
                {allCampaigns.slice(0, 5).map((camp, i) => {
                  const openRate = camp.sentCount > 0 ? ((camp.openedEmails?.length || 0) / camp.sentCount * 100).toFixed(0) : '0';
                  return (
                    <div key={camp.id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", camp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400')}>
                          <Mail size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate max-w-[140px]">{camp.name || camp.subject || 'Untitled'}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {camp.sentCount?.toLocaleString() || 0} sent • {openRate}% opened
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-full", camp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : camp.status === 'completed' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400')}>
                          {camp.status || 'draft'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Tracking Events */}
              {trackingEvents.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Live Activity Feed</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {trackingEvents.slice(0, 10).map((ev, i) => (
                      <div key={ev.id || i} className="flex items-center gap-2 text-[11px]">
                        {ev.type === 'open' ? <MailOpen size={10} className="text-cyan-400 shrink-0" /> : <MousePointerClick size={10} className="text-amber-400 shrink-0" />}
                        <span className="text-slate-300 truncate flex-1">{ev.recipientEmail}</span>
                        <span className="text-slate-500 shrink-0">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <button onClick={() => { setShowTemplates(false); setEditingTemplateId(null); }} className="p-1 hover:bg-slate-800 rounded-lg"><X size={20} className="text-slate-400" /></button>
            </div>
            {templates.length === 0 && <p className="text-slate-500 text-sm text-center py-8">No templates saved yet. Compose a message and click "Save as Template".</p>}
            {templates.filter(t => (t as any).isValuation).length > 0 && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Valuation Brief Templates</p>
                <p className="text-[9px] text-slate-400">Pre-built templates with the GGHP Valuation Brief attached. Click to load, edit to customize.</p>
              </div>
            )}
            {templates.map(t => (
              <div key={t.id} className="p-4 bg-slate-800/50 rounded-xl mb-3 hover:bg-slate-800 transition-colors">
                {editingTemplateId === t.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Template Name</label>
                      <input value={editTemplateName} onChange={e => setEditTemplateName(e.target.value)} className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Subject Line</label>
                      <input value={editTemplateSubject} onChange={e => setEditTemplateSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Message Body</label>
                      <textarea value={editTemplateBody} onChange={e => setEditTemplateBody(e.target.value)} rows={6} className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500 resize-none" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingTemplateId(null)} className="px-3 py-1.5 text-slate-400 text-xs font-bold hover:text-white">Cancel</button>
                      <button onClick={saveEditTemplate} className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-500 flex items-center gap-1"><Check size={12} /> Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="cursor-pointer flex-1" onClick={() => loadTemplate(t)}>
                      <p className="font-bold text-white text-sm flex items-center gap-2">{t.name} {(t as any).isValuation && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-emerald-500/30">Brief Attached</span>}</p>
                      <p className="text-xs text-slate-500 truncate">{t.subject || 'No subject'}</p>
                      {(t as any).attachment && <p className="text-[10px] text-indigo-400 mt-1 flex items-center gap-1"><LayoutTemplate size={10} /> {(t as any).attachmentName || 'Attachment'}</p>}
                      {(t as any).audienceTypes && <p className="text-[9px] text-slate-600 mt-0.5">Audience: {(t as any).audienceTypes.join(', ')}</p>}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button onClick={() => startEditTemplate(t)} className="p-2 hover:bg-indigo-500/20 rounded-lg" title="Edit template">
                        <Pencil size={14} className="text-indigo-400" />
                      </button>
                      <button onClick={() => deleteTemplate(t.id)} className="p-2 hover:bg-red-500/20 rounded-lg" title="Delete template">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                )}
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
              <div className="flex-1 bg-white rounded-2xl p-8 shadow-inner min-h-[400px] flex flex-col">
                {campaignType === 'email' ? (
                  <div className="text-slate-800 flex-1 flex flex-col">
                    <p className="border-b border-slate-200 pb-4 mb-4 font-bold shrink-0">Subject: <span className="font-normal text-slate-600">{subject}</span></p>
                    <iframe 
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <style>
                              body { 
                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                                color: #334155; 
                                line-height: 1.6; 
                                margin: 0; 
                                font-size: 14px;
                              }
                            </style>
                          </head>
                          <body>
                            ${message.includes('<html') || message.includes('<body') ? message : message.replace(/\n/g, '<br/>')}
                          </body>
                        </html>
                      `}
                      sandbox=""
                      title="Email Preview"
                      className="w-full flex-1 min-h-[300px] border-0 outline-none"
                    />
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
                      <p className="text-3xl font-black text-white">{sendMode === 'direct' ? (directContact.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).length || 1).toLocaleString() : filteredCount.toLocaleString()}</p>
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
                    {sendMode === 'broadcast' && (
                      <div className="pt-3 border-t border-slate-700">
                        <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">✅ CRM ID attached to each recipient</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">Every email is traceable to a unique CRM record</p>
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

      {/* Email View Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between bg-slate-950/40">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{selectedEmail.folderType} Message</p>
                <h3 className="text-xl font-black text-white leading-tight">{selectedEmail.subject || '(No Subject)'}</h3>
                <p className="text-xs text-slate-400 font-medium mt-2">
                  <span className="text-slate-500">From:</span> {selectedEmail.from || 'Unknown'} 
                  {selectedEmail.to && <> <span className="text-slate-500 ml-3">To:</span> {selectedEmail.to}</>}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEmail(null)} 
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap select-text custom-scrollbar bg-slate-950/20">
              {loadingEmailBody ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="text-xs font-bold uppercase tracking-wider">Loading message content...</p>
                </div>
              ) : (
                selectedEmailBody ? (
                  selectedEmailBody.trim().startsWith('<') || selectedEmailBody.includes('</') ? (
                    <iframe
                      title="Email Content"
                      srcDoc={`<style>body{font-family:sans-serif;color:#e2e8f0;background-color:#0f172a;line-height:1.6;margin:0;padding:10px;}a{color:#818cf8;}</style>${selectedEmailBody}`}
                      className="w-full h-[400px] border-0 rounded-xl bg-[#0f172a]"
                    />
                  ) : (
                    selectedEmailBody
                  )
                ) : (
                  <p className="text-slate-500 italic text-center py-10">This message has no text body.</p>
                )
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-slate-950/20">
              <button
                onClick={() => {
                  const uids = new Set([String(selectedEmail.id)]);
                  setCheckedEmailIds(uids);
                  setSelectedEmail(null);
                  setShowMoveModal(true);
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Organize (Move)
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Delete this message?')) return;
                  let imapMailbox = 'INBOX';
                  if (selectedEmail.folderType === 'sent') imapMailbox = '[Gmail]/Sent Mail';
                  try {
                    const res = await fetch(`/api/marketing?route=gmail&action=delete&uids=${selectedEmail.id}&mailbox=${encodeURIComponent(imapMailbox)}`);
                    if (res.ok) {
                      alert('Message deleted');
                      setSelectedEmail(null);
                      fetchGmail();
                    } else {
                      alert('Failed to delete');
                    }
                  } catch (e: any) {
                    alert('Error: ' + e.message);
                  }
                }}
                className="px-5 py-2.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-red-500/20"
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Select / Create Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[160] p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Folder className="text-indigo-400" size={22} /> Move to Folder
              </h3>
              <button onClick={() => setShowMoveModal(false)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            
            <p className="text-xs text-slate-400 font-medium mb-4">Select an existing IMAP folder or create a new folder/label to organize the {checkedEmailIds.size} selected email(s).</p>
            
            {/* List of folders */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto mb-6 pr-1 custom-scrollbar">
              {allFolders
                .filter(f => f.path !== 'INBOX' && f.path !== '[Gmail]/Sent Mail' && f.path !== '[Gmail]/Spam' && f.path !== '[Gmail]/Trash')
                .map(folder => (
                  <button
                    key={folder.path}
                    onClick={() => handleMoveSelected(folder.path)}
                    className="w-full flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-200 hover:text-white rounded-xl text-sm font-bold text-left transition-colors"
                  >
                    <Folder size={14} className="text-indigo-400" />
                    {folder.name}
                  </button>
              ))}
              {allFolders.filter(f => f.path !== 'INBOX' && f.path !== '[Gmail]/Sent Mail' && f.path !== '[Gmail]/Spam' && f.path !== '[Gmail]/Trash').length === 0 && (
                <p className="text-xs text-slate-500 italic">No custom folders created yet.</p>
              )}
            </div>
            
            {/* Create new folder input */}
            <div className="border-t border-white/5 pt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Create New Folder</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Clients, Regulatory, Hot Leads"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 text-xs font-medium"
                />
                <button
                  onClick={() => {
                    if (!newFolderName.trim()) return;
                    handleMoveSelected(newFolderName.trim());
                    setNewFolderName('');
                  }}
                  disabled={!newFolderName.trim()}
                  className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
                >
                  Create & Move
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

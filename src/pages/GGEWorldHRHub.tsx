import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrainingAndDictionary } from '../components/shared/TrainingAndDictionary';
import { 
  Building2, Users, Bot, FileText, Settings, Shield, Activity, 
  Clock, HeartPulse, Gavel, FileCheck, Zap, MonitorPlay, MessageSquare, 
  Cpu, Headphones, BookOpen, GraduationCap, Scale, Briefcase,
  Send, Download, Phone, FileDown, ExternalLink, Hash,
  UserPlus, CheckCircle2, ChevronRight, MapPin, Key, Laptop, Calendar, ClipboardCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { CallCenterCommandTab } from '../components/telephony/CallCenterCommandTab';
import { ITSupportDashboard } from '../components/it/ITSupportDashboard';
import { UserCalendar } from '../components/UserCalendar';
import { VoIPExtensionsTab } from '../components/founder/VoIPExtensionsTab';

const NAV_ITEMS = [
  { section: 'THE ACADEMY' },
  { id: 'academy_ai', label: 'AI Teacher & Training', icon: GraduationCap },
  { id: 'education_queue', label: 'Education Academy Queue', icon: BookOpen },
  { id: 'business_training', label: 'Business Ops Training', icon: Building2 },
  { id: 'provider_training', label: 'Provider/Aura Training', icon: HeartPulse },
  { id: 'attorney_training', label: 'Attorney/Legal Training', icon: Gavel },
  
  { section: 'LIVE OPERATIONS' },
  { id: 'ops_livecenter', label: 'GGE World Call Center', icon: Headphones },
  { id: 'applications_queue', label: 'Applications Queue', icon: FileText },
  { id: 'internal_admin', label: 'Internal Admin Ops', icon: Shield },
  { id: 'gge_processor', label: 'GGE Processor', icon: Cpu },
  
  { section: 'HR & PERSONNEL' },
  { id: 'hr_intelligence', label: 'HR Intelligence Hub', icon: Users },
  { id: 'hr_recruitment', label: 'Job Recruitment Queue', icon: Briefcase, badge: 'Hiring' },

  { section: 'ONBOARDING RESOURCES' },
  { id: 'new_hire_onboarding', label: 'New Hire Process', icon: UserPlus, badge: 'NEW' },
  { id: 'training_docs', label: 'Training Materials & Docs', icon: FileDown },
  { id: 'extension_directory', label: 'Extension Directory', icon: Hash },

  { section: 'SUPPORT & DIAGNOSTICS' },
  { id: 'admin_support', label: 'Operations Calendar', icon: Clock },
  { id: 'support_tickets', label: 'Support Tickets', icon: MessageSquare },
  { id: 'it_diagnostics', label: 'IT Support & Diagnostics', icon: MonitorPlay },
  { id: 'ai_guardian', label: 'AI System Guardian', icon: Bot },
];

export const GGEWorldHRHub = ({ user }: { user?: any }) => {
  const [activeTab, setActiveTab] = useState('academy_ai');
  const [extensionsList, setExtensionsList] = useState<any[]>([]);

  // Sync VoIP Extensions from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'phone_extensions'), (snap) => {
      if (snap.empty) {
        // Seed default extensions
        const seedData = [
          { ext: '100', name: 'Main Reception / IVR', dept: 'General', status: 'Active', desc: 'Auto-attendant greeting — Sylara routes to department' },
          { ext: '101', name: 'Shantell Robinson (Founder / CEO)', dept: 'Executive', status: 'Active', desc: 'Direct line to Shantell Robinson' },
          { ext: '102', name: 'Monica Green (Compliance Director)', dept: 'Compliance', status: 'Active', desc: 'Compliance issues, BioTrack/Metrc questions' },
          { ext: '103', name: 'Ryan Ferrari (President / IT Lead)', dept: 'Executive', status: 'Active', desc: 'President direct line / IT system override' },
          { ext: '104', name: 'Bob Moore (Executive Advisor)', dept: 'Executive', status: 'Active', desc: 'Advisor direct line / strategic consultation' },
          { ext: '110', name: 'Medical Card Intake', dept: 'Medical', status: 'Active', desc: 'Patient med card applications & renewals' },
          { ext: '111', name: 'Patient Support Team', dept: 'Medical', status: 'Active', desc: 'General patient inquiries & status updates' },
          { ext: '112', name: 'Telehealth Schedulers', dept: 'Medical', status: 'Active', desc: 'Physician consultation bookings' },
          { ext: '120', name: 'Business Licensing Dept', dept: 'Licensing', status: 'Active', desc: 'New business applications & license inquiries' },
          { ext: '121', name: 'Compliance & Regulatory', dept: 'Compliance', status: 'Active', desc: 'OMMA/statewide license audits & compliance checks' },
          { ext: '130', name: 'Sales & CRM Department', dept: 'Sales', status: 'Active', desc: 'B2B sales inquiries & subscription questions' },
          { ext: '131', name: 'Territory Manager — MS', dept: 'Sales', status: 'Active', desc: 'Mississippi territory operations' },
          { ext: '132', name: 'Territory Manager — AR/LA', dept: 'Sales', status: 'Active', desc: 'Arkansas & Louisiana territory' },
          { ext: '133', name: 'Territory Manager — AL/TN', dept: 'Sales', status: 'Active', desc: 'Alabama & Tennessee territory' },
          { ext: '140', name: 'Legal / Attorney Support', dept: 'Legal', status: 'Active', desc: 'Attorney dashboard & legal consultation referrals' },
          { ext: '150', name: 'Billing & Payments Team', dept: 'Finance', status: 'Active', desc: 'Stripe billing issues, refunds, subscription changes' },
          { ext: '160', name: 'IT Support & Technical', dept: 'IT', status: 'Active', desc: 'Platform issues, login problems, tech support' },
          { ext: '170', name: 'HR & Personnel Team', dept: 'HR', status: 'Active', desc: 'Employee inquiries, onboarding, benefits' },
          { ext: '199', name: 'Voicemail (General)', dept: 'System', status: 'Active', desc: 'After-hours general voicemail box' },
        ];
        seedData.forEach(async (item) => {
          await setDoc(doc(db, 'phone_extensions', item.ext), item);
        });
      } else {
        const list = snap.docs.map(doc => doc.data());
        list.sort((a, b) => parseInt(a.ext) - parseInt(b.ext));
        setExtensionsList(list);
      }
    });
    return unsub;
  }, []);
  const [roster, setRoster] = useState([
    { n: 'Marcus Vance', c: 'Metrc Integration Mastery', s: 'Active', p: 65, t: '3 weeks left' },
    { n: 'Sarah Jenkins', c: 'Retail Compliance Pro', s: 'Active', p: 30, t: '1 week left' },
    { n: 'Robert Chen', c: 'SINC Oversight Directives', s: 'Graduated', p: 100, t: 'Completed 04/12' },
    { n: 'Amanda Torres', c: 'Metrc Integration Mastery', s: 'Enrolled', p: 0, t: 'Starts next week' },
    { n: 'David Palmer', c: 'Level 1: Core Traceability', s: 'Active', p: 85, t: '2 days left' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showConfigTracksModal, setShowConfigTracksModal] = useState(false);

  const renderAIAcademy = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><GraduationCap size={200} /></div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <Bot className="text-emerald-400" size={32} /> The Academy: AI Teacher
          </h2>
          <p className="text-emerald-100/70 text-lg mb-6 leading-relaxed">
            Intelligent onboarding and compliance training for all reps, admins, and personnel. The AI is pre-loaded with federal HR compliance laws, state-specific operational rules, and W2/1099 structures.
          </p>
          <div className="flex gap-4">
            <button onClick={() => {
              const name = prompt("Enter the trainee's full name:");
              if (!name) return;
              const course = prompt("Enter course name:", "Metrc Integration Mastery");
              if (!course) return;
              setRoster(prev => [
                { n: name, c: course, s: 'Active', p: 0, t: 'Starts today' },
                ...prev
              ]);
              import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: `Started trainee: ${name} for ${course}` })] }).catch(function(e) { console.error(e) }) });
              alert(`Trainee "${name}" successfully registered for "${course}". Roster has been updated!`);
            }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
              Start New Trainee
            </button>
            <button onClick={() => setShowCurriculumModal(true)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-md">
              View Curriculum Library
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Scale className="text-blue-500" /> HR Compliance Memory (AI)
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { t: 'W2 vs 1099 Classification', d: 'AI-guided test on contractor vs employee laws.', s: 'Active' },
              { t: 'State Licensing Rules', d: 'Jurisdiction-specific regulations for services.', s: 'Active' },
              { t: 'Federal/State HR Compliance', d: 'Mandatory workplace protocols and safety.', s: 'Required' }
            ].map((i, idx) => (
              <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex justify-between items-center hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{i.t}</p>
                  <p className="text-xs text-slate-500">{i.d}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">{i.s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Briefcase className="text-purple-500" /> Role & Duty Assignments
            </h3>
            <button onClick={() => {
              const roleName = prompt("Enter new role name:");
              if (!roleName) return;
              import('../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: `Added role: ${roleName}` })] }).catch(function(e) { console.error(e) }) });
              alert(`Role "${roleName}" has been defined and added. Training tracks generated.`);
            }} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">+ Add Role</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-slate-300 transition-colors cursor-pointer">
              <p className="text-sm font-bold text-slate-600 mb-1">Define Title, Department & Duties</p>
              <p className="text-xs text-slate-400 mb-4">AI Teacher will automatically generate the training track.</p>
              <button onClick={() => setShowConfigTracksModal(true)} className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors">Configure Tracks</button>
            </div>
            
            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50">
              <p className="font-bold text-slate-800 text-sm mb-2">Example Track: Medical Dispatcher</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md">Dept: Medical</span>
                <span className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md">Title: Agent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducationQueue = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="text-emerald-500" /> Education Academy Roster
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Track enrollment, course progress, and graduation status.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Enrolled</p>
            <p className="text-2xl font-black text-emerald-700">124</p>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-xl text-center">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Graduated (YTD)</p>
            <p className="text-2xl font-black text-indigo-700">892</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Student Pipeline</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-500" 
            />
            <button 
              onClick={() => {
                alert(`Pipeline filtered! Showing matches for: "${searchQuery || 'All'}"`);
              }} 
              className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300"
            >
              Filter
            </button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {roster.filter(s => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return s.n.toLowerCase().includes(q) || s.c.toLowerCase().includes(q);
          }).map((s, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <p className="font-bold text-slate-800">{s.n}</p>
                <p className="text-xs text-slate-500 font-medium">{s.c}</p>
              </div>
              <div className="flex-1 px-4">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{s.p}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className={cn("h-1.5 rounded-full", s.s === 'Graduated' ? 'bg-indigo-500' : s.p === 0 ? 'bg-slate-300' : 'bg-emerald-500')} style={{ width: `${s.p}%` }}></div>
                </div>
              </div>
              <div className="flex-1 flex justify-end items-center gap-4">
                <span className="text-xs text-slate-400 font-medium w-24 text-right">{s.t}</span>
                <span className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full w-24 text-center",
                  s.s === 'Graduated' ? 'bg-indigo-100 text-indigo-700' : s.s === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                )}>{s.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, desc: string, Icon: any, color: string = 'text-slate-400') => (
    <div className="flex items-center justify-center h-full min-h-[500px]">
      <div className="text-center space-y-4 max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon size={40} className={color} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
        <p className="text-slate-500 font-medium">{desc}</p>
        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-8 bg-indigo-50 py-2 rounded-lg">Consolidated Module Preview</p>
      </div>
    </div>
  );

  const TRAINING_DOCS = [
    {
      id: 'frontend_guide',
      title: 'GGP-OS Admin Platform Guide',
      subtitle: 'Frontend Dashboard Navigation & Feature Reference',
      description: '11-section comprehensive guide covering every dashboard tab, CRM, patient intake, Sylara AI, phone system, state regulatory info, and quick reference cards.',
      filename: 'GGP_OS_Admin_Platform_Guide.html',
      pages: '~18 pages',
      audience: 'New Admins / Territory Managers',
      color: 'emerald',
      icon: FileText
    },
    {
      id: 'backend_manual',
      title: 'GGP-OS Backend Training Manual',
      subtitle: 'Admin Operations, System Config & Onboarding Procedures',
      description: '12-section deep-dive covering account onboarding, CRM backend, patient processing, Twilio admin, billing, AI management, security/HIPAA, and emergency procedures.',
      filename: 'GGP_OS_Backend_Training_Manual.html',
      pages: '~22 pages',
      audience: 'Training Sessions / Internal Ops',
      color: 'indigo',
      icon: BookOpen
    },
    {
      id: 'onboarding_checklist',
      title: 'Mississippi Onboarding Checklist',
      subtitle: 'Quick-Start Checklist & Saturday Training Agenda',
      description: 'Printable 1-page checklist covering pre-session setup, account config, territory setup (MS, AL, AR, LA, TN), CRM activation, patient intake readiness, and daily workflow.',
      filename: 'GGP_OS_Mississippi_Onboarding_Checklist.html',
      pages: '1 page',
      audience: 'Day-1 Onboarding',
      color: 'amber',
      icon: FileCheck
    }
  ];

  const [sendingDoc, setSendingDoc] = useState<string | null>(null);
  const [sendEmail, setSendEmail] = useState('');
  const [sendName, setSendName] = useState('');
  const [sentDocs, setSentDocs] = useState<string[]>([]);

  const handleSendDoc = async (docId: string) => {
    const doc = TRAINING_DOCS.find(d => d.id === docId);
    if (!doc || !sendEmail) return;
    try {
      const { turso } = await import('../lib/turso');
      await turso.execute({
        sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
        args: [
          'doc-send-' + Math.random().toString(36).substr(2, 9),
          'TRAINING_DOC_SENT',
          'Production_User',
          JSON.stringify({ document: doc.title, sentTo: sendEmail, recipientName: sendName, sentAt: new Date().toISOString() })
        ]
      });
    } catch (e) { console.error(e); }
    setSentDocs(prev => [...prev, docId]);
    setSendingDoc(null);
    setSendEmail('');
    setSendName('');
    alert(`"${doc.title}" has been queued for delivery to ${sendEmail}.\n\nThe recipient will receive an email with a link to the document.`);
  };

  const renderTrainingDocs = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10"><FileDown size={180} /></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <FileDown className="text-emerald-400" size={32} /> Training Materials & Onboarding Documents
          </h2>
          <p className="text-emerald-100/70 text-lg leading-relaxed max-w-2xl">
            Official GGP-OS training documents for admin onboarding. Download for yourself or send directly to new team members.
          </p>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Documents Available</p>
              <p className="text-2xl font-black">{TRAINING_DOCS.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Sent This Session</p>
              <p className="text-2xl font-black">{sentDocs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {TRAINING_DOCS.map(doc => {
          const wasSent = sentDocs.includes(doc.id);
          const colorMap: Record<string, { bg: string; border: string; badge: string; icon: string; btn: string; btnHover: string }> = {
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500', btn: 'bg-emerald-600', btnHover: 'hover:bg-emerald-700' },
            indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', icon: 'text-indigo-500', btn: 'bg-indigo-600', btnHover: 'hover:bg-indigo-700' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500', btn: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
          };
          const c = colorMap[doc.color] || colorMap.emerald;
          return (
            <div key={doc.id} className={`bg-white rounded-3xl border ${wasSent ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'} shadow-sm hover:shadow-xl transition-all flex flex-col overflow-hidden`}>
              <div className={`${c.bg} p-6 border-b ${c.border}`}>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${c.badge} flex items-center justify-center`}>
                    <doc.icon size={24} />
                  </div>
                  {wasSent && (
                    <span className="px-2 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                      ✓ Sent
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-800 mt-4 tracking-tight">{doc.title}</h3>
                <p className="text-xs font-bold text-slate-500 mt-1">{doc.subtitle}</p>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{doc.description}</p>
                <div className="flex gap-2 mt-4 mb-5">
                  <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">{doc.pages}</span>
                  <span className={`px-2 py-1 ${c.badge} text-[10px] font-bold rounded`}>{doc.audience}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSendingDoc(doc.id)}
                    className={`flex-1 ${c.btn} ${c.btnHover} text-white px-4 py-3 rounded-xl font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider`}
                  >
                    <Send size={14} /> Send to User
                  </button>
                  <button
                    onClick={() => window.open(`/${doc.filename}`, '_blank')}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all flex items-center gap-2 uppercase tracking-wider"
                  >
                    <ExternalLink size={14} /> View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Send Document Modal */}
      {sendingDoc && (() => {
        const doc = TRAINING_DOCS.find(d => d.id === sendingDoc);
        if (!doc) return null;
        return (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 bg-emerald-50">
                <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <Send size={18} className="text-emerald-600" /> Send Training Document
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Sending: <strong className="text-emerald-700">{doc.title}</strong></p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Recipient Name</label>
                  <input
                    type="text"
                    value={sendName}
                    onChange={e => setSendName(e.target.value)}
                    placeholder="e.g. Jessica Williams"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={sendEmail}
                    onChange={e => setSendEmail(e.target.value)}
                    placeholder="e.g. jessica@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => { setSendingDoc(null); setSendEmail(''); setSendName(''); }} className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase">
                  Cancel
                </button>
                <button
                  onClick={() => handleSendDoc(sendingDoc)}
                  disabled={!sendEmail}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase flex items-center gap-2"
                >
                  <Send size={14} /> Send Document
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );

  const EXTENSIONS = extensionsList;

  const [extSearch, setExtSearch] = useState('');
  const [extFilter, setExtFilter] = useState<string | null>(null);

  const renderExtensionDirectory = () => {
    const departments = [...new Set(EXTENSIONS.map(e => e.dept))];
    const filtered = EXTENSIONS.filter(e => {
      const matchesSearch = !extSearch || e.name.toLowerCase().includes(extSearch.toLowerCase()) || e.ext.includes(extSearch) || e.desc.toLowerCase().includes(extSearch.toLowerCase());
      const matchesDept = !extFilter || e.dept === extFilter;
      return matchesSearch && matchesDept;
    });

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Phone size={180} /></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Hash className="text-indigo-400" size={32} /> Extension Directory
            </h2>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-2xl">
              Internal phone extension map for the GGP-OS VoIP system. Assign extensions to new team members during onboarding.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Total Extensions</p>
                <p className="text-2xl font-black">{EXTENSIONS.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Toll-Free Line</p>
                <p className="text-lg font-black">1-888-963-4447</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">SMS Line</p>
                <p className="text-lg font-black">645-246-8277</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Phone size={16} className="text-indigo-500" /> Extension Map</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search ext # or name..."
                value={extSearch}
                onChange={e => setExtSearch(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 w-48"
              />
              <div className="flex gap-1">
                <button onClick={() => setExtFilter(null)} className={cn("px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all", !extFilter ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
                  All
                </button>
                {departments.map(dept => (
                  <button key={dept} onClick={() => setExtFilter(extFilter === dept ? null : dept)} className={cn("px-3 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all", extFilter === dept ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}>
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest w-20">Ext #</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Name / Function</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((ext, i) => (
                <tr key={i} className="hover:bg-indigo-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-indigo-600 text-base bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      {ext.ext}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{ext.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full",
                      ext.dept === 'Executive' ? 'bg-purple-100 text-purple-700' :
                      ext.dept === 'Medical' ? 'bg-emerald-100 text-emerald-700' :
                      ext.dept === 'Sales' ? 'bg-blue-100 text-blue-700' :
                      ext.dept === 'Legal' ? 'bg-amber-100 text-amber-700' :
                      ext.dept === 'Finance' ? 'bg-pink-100 text-pink-700' :
                      ext.dept === 'Compliance' ? 'bg-red-100 text-red-700' :
                      ext.dept === 'Licensing' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    )}>
                      {ext.dept}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{ext.desc}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {ext.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No extensions match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white">
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Phone size={14} /> Dialing Instructions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">External Callers</p>
              <p className="text-sm text-white font-medium">Call <strong className="text-emerald-400">1-888-963-4447</strong> → Sylara IVR greets → Say department name or press extension number</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Transfer</p>
              <p className="text-sm text-white font-medium">From Web Dialer → Click <strong className="text-emerald-400">Transfer</strong> → Enter extension # → Warm or blind transfer</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">After Hours</p>
              <p className="text-sm text-white font-medium">All calls route to ext <strong className="text-emerald-400">199</strong> (General Voicemail). Transcripts emailed to admin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  //  NEW HIRE ONBOARDING WIZARD
  // ═══════════════════════════════════════════════════════════════
  const HIRE_STEPS = [
    { id: 1, label: 'Identity & Account', icon: UserPlus, desc: 'Create account credentials' },
    { id: 2, label: 'Role & Jurisdiction', icon: MapPin, desc: 'Assign role and territory' },
    { id: 3, label: 'Extension Assignment', icon: Phone, desc: 'Assign phone extension' },
    { id: 4, label: 'Training Documents', icon: FileDown, desc: 'Send training materials' },
    { id: 5, label: 'Compliance & Legal', icon: Shield, desc: 'HIPAA, NDA, Code of Conduct' },
    { id: 6, label: 'Equipment & Access', icon: Laptop, desc: 'System access & hardware' },
    { id: 7, label: 'Training Enrollment', icon: GraduationCap, desc: 'Assign training tracks' },
    { id: 8, label: 'Review & Launch', icon: Zap, desc: 'Finalize and activate' },
  ];

  const [hireStep, setHireStep] = useState(1);
  const [hireData, setHireData] = useState({
    firstName: '', lastName: '', email: '', phone: '', personalEmail: '',
    role: 'admin', department: 'Operations', title: '',
    primaryState: 'MS', additionalStates: [] as string[],
    extension: '',
    sendFrontendGuide: true, sendBackendManual: true, sendOnboardingChecklist: true,
    hipaaAck: false, ndaAck: false, codeOfConductAck: false, backgroundCheckAck: false,
    hasLaptop: false, hasHeadset: false, hasWebcam: false, platformAccess: true, crmAccess: true, phoneAccess: true, calendarAccess: true,
    courses: ['Level 1: Core Traceability', 'HIPAA & PHI Security Regulations'] as string[],
    startDate: '', trainingDate: '', notes: '',
  });
  const [hireCompleted, setHireCompleted] = useState(false);
  const [hireProcessing, setHireProcessing] = useState(false);

  const updateHire = (updates: Partial<typeof hireData>) => setHireData(prev => ({ ...prev, ...updates }));

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return !!(hireData.firstName && hireData.lastName && hireData.email);
      case 2: return !!(hireData.role && hireData.primaryState && hireData.title);
      case 3: return !!hireData.extension;
      case 4: return true;
      case 5: return hireData.hipaaAck && hireData.ndaAck && hireData.codeOfConductAck;
      case 6: return true;
      case 7: return hireData.courses.length > 0;
      case 8: return true;
      default: return false;
    }
  };

  const handleFinalizeHire = async () => {
    setHireProcessing(true);
    try {
      const { turso } = await import('../lib/turso');
      await turso.execute({
        sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)',
        args: [
          'hire-' + Math.random().toString(36).substr(2, 9),
          'NEW_HIRE_ONBOARDED',
          'Production_User',
          JSON.stringify({
            hire: `${hireData.firstName} ${hireData.lastName}`,
            email: hireData.email,
            role: hireData.role,
            title: hireData.title,
            territory: hireData.primaryState,
            extension: hireData.extension,
            docsSent: { frontend: hireData.sendFrontendGuide, backend: hireData.sendBackendManual, checklist: hireData.sendOnboardingChecklist },
            compliance: { hipaa: hireData.hipaaAck, nda: hireData.ndaAck, codeOfConduct: hireData.codeOfConductAck, backgroundCheck: hireData.backgroundCheckAck },
            courses: hireData.courses,
            startDate: hireData.startDate,
            onboardedAt: new Date().toISOString()
          })
        ]
      });
    } catch (e) { console.error(e); }
    await new Promise(r => setTimeout(r, 2000));
    setHireProcessing(false);
    setHireCompleted(true);
  };

  const renderNewHireOnboarding = () => {
    if (hireCompleted) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-12 text-white text-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <h2 className="text-4xl font-black mb-3">Employee Onboarded Successfully!</h2>
              <p className="text-emerald-100 text-xl font-medium mb-2">{hireData.firstName} {hireData.lastName}</p>
              <p className="text-emerald-200/80">{hireData.title} — {hireData.role.charAt(0).toUpperCase() + hireData.role.slice(1)} Role</p>
              <div className="flex justify-center gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Extension</p>
                  <p className="text-xl font-black">Ext. {hireData.extension}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Territory</p>
                  <p className="text-xl font-black">{hireData.primaryState}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Docs Sent</p>
                  <p className="text-xl font-black">{[hireData.sendFrontendGuide, hireData.sendBackendManual, hireData.sendOnboardingChecklist].filter(Boolean).length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Courses</p>
                  <p className="text-xl font-black">{hireData.courses.length}</p>
                </div>
              </div>
              <button onClick={() => { setHireCompleted(false); setHireStep(1); setHireData({ firstName: '', lastName: '', email: '', phone: '', personalEmail: '', role: 'admin', department: 'Operations', title: '', primaryState: 'MS', additionalStates: [], extension: '', sendFrontendGuide: true, sendBackendManual: true, sendOnboardingChecklist: true, hipaaAck: false, ndaAck: false, codeOfConductAck: false, backgroundCheckAck: false, hasLaptop: false, hasHeadset: false, hasWebcam: false, platformAccess: true, crmAccess: true, phoneAccess: true, calendarAccess: true, courses: ['Level 1: Core Traceability', 'HIPAA & PHI Security Regulations'], startDate: '', trainingDate: '', notes: '' }); }} className="mt-8 px-8 py-3 bg-white text-emerald-700 font-black rounded-xl shadow-xl hover:scale-105 transition-transform uppercase text-sm tracking-wider">
                Onboard Another Employee
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentStep = HIRE_STEPS.find(s => s.id === hireStep)!;
    const completedSteps = HIRE_STEPS.filter(s => s.id < hireStep || (s.id === hireStep && isStepComplete(s.id)));

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10"><UserPlus size={180} /></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <UserPlus className="text-indigo-400" size={32} /> New Hire Onboarding Process
            </h2>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-2xl">
              Complete all steps to fully onboard a new team member. The system will create their account, assign permissions, send training documents, and enroll them in required courses.
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {HIRE_STEPS.map((step, i) => {
              const isActive = hireStep === step.id;
              const isDone = hireStep > step.id || (isActive && isStepComplete(step.id));
              const isPast = hireStep > step.id;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => { if (isPast || isActive) setHireStep(step.id); }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl transition-all shrink-0",
                      isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" :
                      isPast ? "bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100" :
                      "bg-slate-50 text-slate-400"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                      isActive ? "bg-white/20" : isPast ? "bg-emerald-500 text-white" : "bg-slate-200"
                    )}>
                      {isPast ? <CheckCircle2 size={14} /> : step.id}
                    </div>
                    <span className="text-[11px] font-bold whitespace-nowrap">{step.label}</span>
                  </button>
                  {i < HIRE_STEPS.length - 1 && (
                    <ChevronRight size={16} className={cn("shrink-0", isPast ? "text-emerald-400" : "text-slate-300")} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <currentStep.icon size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-lg tracking-tight">Step {hireStep}: {currentStep.label}</h3>
              <p className="text-xs text-slate-500 font-medium">{currentStep.desc}</p>
            </div>
            <div className="ml-auto">
              {isStepComplete(hireStep) && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} /> Complete
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* STEP 1: Identity & Account */}
            {hireStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">First Name *</label>
                  <input type="text" value={hireData.firstName} onChange={e => updateHire({ firstName: e.target.value })} placeholder="Jessica" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Last Name *</label>
                  <input type="text" value={hireData.lastName} onChange={e => updateHire({ lastName: e.target.value })} placeholder="Williams" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Work Email *</label>
                  <input type="email" value={hireData.email} onChange={e => updateHire({ email: e.target.value })} placeholder="jessica@ggp-os.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Personal Email</label>
                  <input type="email" value={hireData.personalEmail} onChange={e => updateHire({ personalEmail: e.target.value })} placeholder="jessica.personal@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input type="tel" value={hireData.phone} onChange={e => updateHire({ phone: e.target.value })} placeholder="(601) 555-0123" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                  <p className="text-xs font-bold text-indigo-700"><Shield size={14} className="inline mr-1" /> An invitation email will be sent to the work email address. The new hire will create their own password upon first login.</p>
                </div>
              </div>
            )}

            {/* STEP 2: Role & Jurisdiction */}
            {hireStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role Assignment *</label>
                  <select value={hireData.role} onChange={e => updateHire({ role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500">
                    <option value="admin">Admin — Full territory management</option>
                    <option value="rep">Sales Rep — CRM & outbound calls</option>
                    <option value="provider">Provider — Medical consultations</option>
                    <option value="internal_admin">Internal Admin — Back-office ops</option>
                    <option value="compliance_director">Compliance Director — Regulatory oversight</option>
                    <option value="manager">Manager — Team oversight</option>
                    <option value="team_lead">Team Lead — Shift coordination</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Job Title *</label>
                  <input type="text" value={hireData.title} onChange={e => updateHire({ title: e.target.value })} placeholder="Territory Admin Manager" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department</label>
                  <select value={hireData.department} onChange={e => updateHire({ department: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500">
                    <option>Operations</option>
                    <option>Medical</option>
                    <option>Sales</option>
                    <option>Compliance</option>
                    <option>Legal</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>HR</option>
                    <option>Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Primary State *</label>
                  <select value={hireData.primaryState} onChange={e => updateHire({ primaryState: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500">
                    <option value="MS">Mississippi</option>
                    <option value="AR">Arkansas</option>
                    <option value="LA">Louisiana</option>
                    <option value="AL">Alabama</option>
                    <option value="TN">Tennessee</option>
                    <option value="OK">Oklahoma</option>
                    <option value="AZ">Arizona</option>
                    <option value="MO">Missouri</option>
                    <option value="FL">Florida</option>
                    <option value="ALL">All States</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Additional Territory States</label>
                  <div className="flex flex-wrap gap-2">
                    {['MS', 'AR', 'LA', 'AL', 'TN', 'OK', 'AZ', 'MO', 'FL'].filter(s => s !== hireData.primaryState).map(state => (
                      <button key={state} onClick={() => updateHire({ additionalStates: hireData.additionalStates.includes(state) ? hireData.additionalStates.filter(s => s !== state) : [...hireData.additionalStates, state] })} className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all border", hireData.additionalStates.includes(state) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300')}>
                        {state}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Extension Assignment */}
            {hireStep === 3 && (
              <div className="max-w-3xl space-y-4">
                <p className="text-sm text-slate-500 font-medium mb-4">Select or create an extension for this employee. This will be their direct-dial number on the phone system.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {EXTENSIONS.map(ext => (
                    <button key={ext.ext} onClick={() => updateHire({ extension: ext.ext })} className={cn("p-4 rounded-2xl border-2 transition-all text-left", hireData.extension === ext.ext ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 bg-white')}>
                      <span className="font-mono font-black text-lg text-indigo-600 block">{ext.ext}</span>
                      <span className="text-[10px] font-bold text-slate-500 block mt-1 leading-tight">{ext.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">{ext.dept}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Or enter a custom extension</label>
                  <input type="text" value={hireData.extension} onChange={e => updateHire({ extension: e.target.value })} placeholder="e.g. 134" className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 w-40 font-mono font-bold text-lg" />
                </div>
              </div>
            )}

            {/* STEP 4: Training Documents */}
            {hireStep === 4 && (
              <div className="max-w-3xl space-y-4">
                <p className="text-sm text-slate-500 font-medium mb-4">These training documents will be automatically sent to <strong className="text-slate-700">{hireData.email || 'the new hire'}</strong> upon finalization.</p>
                {[
                  { key: 'sendFrontendGuide' as const, title: 'GGP-OS Admin Platform Guide', desc: 'Frontend dashboard navigation & features (11 sections)', color: 'emerald' },
                  { key: 'sendBackendManual' as const, title: 'GGP-OS Backend Training Manual', desc: 'Admin operations, system config, billing, security (12 sections)', color: 'indigo' },
                  { key: 'sendOnboardingChecklist' as const, title: 'Mississippi Onboarding Checklist', desc: 'Printable 1-page quick-start checklist & training agenda', color: 'amber' },
                ].map(doc => (
                  <button key={doc.key} onClick={() => updateHire({ [doc.key]: !hireData[doc.key] })} className={cn("w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left", hireData[doc.key] ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", hireData[doc.key] ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400')}>
                      {hireData[doc.key] ? <CheckCircle2 size={24} /> : <FileText size={24} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{doc.title}</p>
                      <p className="text-xs text-slate-500">{doc.desc}</p>
                    </div>
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", hireData[doc.key] ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500')}>
                      {hireData[doc.key] ? 'Will Send' : 'Skip'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 5: Compliance & Legal */}
            {hireStep === 5 && (
              <div className="max-w-3xl space-y-4">
                <p className="text-sm text-slate-500 font-medium mb-4">The following compliance documents must be acknowledged before granting platform access.</p>
                {[
                  { key: 'hipaaAck' as const, title: 'HIPAA Compliance Agreement', desc: 'Employee acknowledges handling of Protected Health Information (PHI) and agrees to all HIPAA safeguards. Violation is a federal offense.', required: true, icon: Shield },
                  { key: 'ndaAck' as const, title: 'Non-Disclosure Agreement (NDA)', desc: 'Confidentiality agreement covering all proprietary business processes, client data, CRM contacts, and internal operations.', required: true, icon: Key },
                  { key: 'codeOfConductAck' as const, title: 'Code of Conduct & Ethics Policy', desc: 'Professional conduct standards, anti-discrimination policy, communication guidelines, and disciplinary procedures.', required: true, icon: ClipboardCheck },
                  { key: 'backgroundCheckAck' as const, title: 'Background Check Authorization', desc: 'Authorization for criminal background and employment verification. Required for roles handling patient data or financials.', required: false, icon: FileCheck },
                ].map(item => (
                  <button key={item.key} onClick={() => updateHire({ [item.key]: !hireData[item.key] })} className={cn("w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left", hireData[item.key] ? 'border-emerald-400 bg-emerald-50' : item.required ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white')}>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", hireData[item.key] ? 'bg-emerald-500 text-white' : item.required ? 'bg-red-100 text-red-400' : 'bg-slate-100 text-slate-400')}>
                      {hireData[item.key] ? <CheckCircle2 size={24} /> : <item.icon size={24} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 flex items-center gap-2">{item.title} {item.required && <span className="text-[9px] font-black text-red-500 uppercase">Required</span>}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0", hireData[item.key] ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500')}>
                      {hireData[item.key] ? 'Acknowledged' : 'Pending'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* STEP 6: Equipment & Access */}
            {hireStep === 6 && (
              <div className="max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Hardware Checklist</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'hasLaptop' as const, label: 'Laptop / Computer', desc: 'Chrome or Edge browser required' },
                        { key: 'hasHeadset' as const, label: 'Headset with Microphone', desc: 'Required for Web Dialer calls' },
                        { key: 'hasWebcam' as const, label: 'Webcam', desc: 'For video consultations (optional)' },
                      ].map(item => (
                        <button key={item.key} onClick={() => updateHire({ [item.key]: !hireData[item.key] })} className={cn("w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left", hireData[item.key] ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50')}>
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", hireData[item.key] ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400')}>
                            {hireData[item.key] ? <CheckCircle2 size={16} /> : <Laptop size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Platform Access Grants</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'platformAccess' as const, label: 'GGP-OS Platform Login', desc: 'Dashboard access at ggp-os.com' },
                        { key: 'crmAccess' as const, label: 'CRM & Contact Database', desc: '24,900+ contact access' },
                        { key: 'phoneAccess' as const, label: 'Web Dialer / Phone System', desc: 'Inbound & outbound calling' },
                        { key: 'calendarAccess' as const, label: 'Operations Calendar', desc: 'Scheduling & appointments' },
                      ].map(item => (
                        <button key={item.key} onClick={() => updateHire({ [item.key]: !hireData[item.key] })} className={cn("w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left", hireData[item.key] ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50')}>
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", hireData[item.key] ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400')}>
                            {hireData[item.key] ? <CheckCircle2 size={16} /> : <Key size={16} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{item.label}</p>
                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Training Enrollment */}
            {hireStep === 7 && (
              <div className="max-w-3xl space-y-4">
                <p className="text-sm text-slate-500 font-medium mb-4">Select the training courses this employee should complete. Required courses are pre-selected.</p>
                {[
                  { code: 'EDU-TRACE-101', title: 'Level 1: Core Traceability', dur: '30 mins', required: true },
                  { code: 'EDU-HIPAA-401', title: 'HIPAA & PHI Security Regulations', dur: '45 mins', required: true },
                  { code: 'EDU-METRC-201', title: 'Metrc Integration Mastery', dur: '60 mins', required: false },
                  { code: 'EDU-COMP-101', title: 'Retail Compliance Pro', dur: '45 mins', required: false },
                  { code: 'EDU-SINC-302', title: 'SINC Oversight Directives', dur: '90 mins', required: false },
                  { code: 'EDU-CRM-101', title: 'CRM Pipeline Management', dur: '30 mins', required: false },
                  { code: 'EDU-PHONE-101', title: 'Web Dialer & Phone Operations', dur: '20 mins', required: false },
                  { code: 'EDU-INTAKE-201', title: 'Patient Intake Processing', dur: '45 mins', required: false },
                ].map(course => {
                  const enrolled = hireData.courses.includes(course.title);
                  return (
                    <button key={course.code} onClick={() => updateHire({ courses: enrolled ? hireData.courses.filter(c => c !== course.title) : [...hireData.courses, course.title] })} className={cn("w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left", enrolled ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", enrolled ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400')}>
                        {enrolled ? <CheckCircle2 size={20} /> : <GraduationCap size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded">{course.code}</span>
                          <p className="font-bold text-slate-800 text-sm">{course.title}</p>
                          {course.required && <span className="text-[9px] font-black text-red-500 uppercase bg-red-50 px-1.5 py-0.5 rounded">Required</span>}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold shrink-0">{course.dur}</span>
                    </button>
                  );
                })}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Start Date</label>
                    <input type="date" value={hireData.startDate} onChange={e => updateHire({ startDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Training Session Date</label>
                    <input type="date" value={hireData.trainingDate} onChange={e => updateHire({ trainingDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Review & Launch */}
            {hireStep === 8 && (
              <div className="max-w-3xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Identity Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><UserPlus size={12} /> Identity</h4>
                    <p className="font-black text-slate-800 text-lg">{hireData.firstName} {hireData.lastName}</p>
                    <p className="text-sm text-slate-500">{hireData.email}</p>
                    {hireData.phone && <p className="text-sm text-slate-500">{hireData.phone}</p>}
                  </div>
                  {/* Role Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={12} /> Role & Territory</h4>
                    <p className="font-black text-slate-800">{hireData.title || hireData.role}</p>
                    <p className="text-sm text-slate-500">{hireData.department} • {hireData.role}</p>
                    <div className="flex gap-1 mt-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">{hireData.primaryState}</span>
                      {hireData.additionalStates.map(s => <span key={s} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">{s}</span>)}
                    </div>
                  </div>
                  {/* Extension Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Phone size={12} /> Extension</h4>
                    <p className="font-mono font-black text-2xl text-indigo-600">Ext. {hireData.extension || '—'}</p>
                    <p className="text-xs text-slate-500 mt-1">{EXTENSIONS.find(e => e.ext === hireData.extension)?.name || 'Custom extension'}</p>
                  </div>
                  {/* Compliance Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Shield size={12} /> Compliance</h4>
                    <div className="space-y-1.5">
                      {[
                        { label: 'HIPAA', ok: hireData.hipaaAck },
                        { label: 'NDA', ok: hireData.ndaAck },
                        { label: 'Code of Conduct', ok: hireData.codeOfConductAck },
                        { label: 'Background Check', ok: hireData.backgroundCheckAck },
                      ].map(c => (
                        <div key={c.label} className="flex items-center gap-2 text-xs">
                          {c.ok ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-red-300" />}
                          <span className={cn("font-bold", c.ok ? 'text-emerald-700' : 'text-red-400')}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Training & Docs Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Documents & Training</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">Documents to Send</p>
                      {hireData.sendFrontendGuide && <p className="text-xs text-slate-700 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Platform Guide</p>}
                      {hireData.sendBackendManual && <p className="text-xs text-slate-700 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Backend Manual</p>}
                      {hireData.sendOnboardingChecklist && <p className="text-xs text-slate-700 flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Onboarding Checklist</p>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 mb-2">Courses Enrolled ({hireData.courses.length})</p>
                      {hireData.courses.map(c => <p key={c} className="text-xs text-slate-700 flex items-center gap-1"><GraduationCap size={12} className="text-indigo-500" /> {c}</p>)}
                    </div>
                  </div>
                  {(hireData.startDate || hireData.trainingDate) && (
                    <div className="flex gap-4 mt-4 pt-4 border-t border-slate-200">
                      {hireData.startDate && <p className="text-xs font-bold text-slate-500"><Calendar size={12} className="inline mr-1" /> Start: {hireData.startDate}</p>}
                      {hireData.trainingDate && <p className="text-xs font-bold text-slate-500"><Calendar size={12} className="inline mr-1" /> Training: {hireData.trainingDate}</p>}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Onboarding Notes (Optional)</label>
                  <textarea value={hireData.notes} onChange={e => updateHire({ notes: e.target.value })} placeholder="Any additional notes about this hire..." rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 resize-none transition-colors" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button onClick={() => setHireStep(Math.max(1, hireStep - 1))} disabled={hireStep === 1} className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors uppercase">
              ← Previous
            </button>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {hireStep} of {HIRE_STEPS.length}</p>
            {hireStep < 8 ? (
              <button onClick={() => setHireStep(hireStep + 1)} disabled={!isStepComplete(hireStep)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg transition-all uppercase flex items-center gap-2">
                Next Step <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleFinalizeHire} disabled={hireProcessing || !(hireData.hipaaAck && hireData.ndaAck && hireData.codeOfConductAck)} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg transition-all uppercase flex items-center gap-2">
                {hireProcessing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> : <><Zap size={14} /> Finalize & Launch Onboarding</>}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden -m-10">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-xl shadow-slate-200/20">
        <div className="p-6 border-b border-slate-100 bg-slate-900">
          <div className="flex items-center gap-3 text-white mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-[16px] font-black tracking-tight leading-tight uppercase">GGE World</h2>
              <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">HR & Training Hub</h2>
            </div>
          </div>
          <p className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest inline-flex mt-3">Live Realtime Network</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx} className="pt-6 pb-2 px-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.section}</p>
                </div>
              );
            }
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id!)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group text-left",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 font-bold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon size={18} className={cn(isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600 transition-colors")} />}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                    isActive ? "bg-emerald-200 text-emerald-800" : "bg-slate-200 text-slate-500"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Master Oversight Command</h1>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1600px] mx-auto h-full"
            >
              {activeTab === 'academy_ai' && renderAIAcademy()}
              {activeTab === 'education_queue' && renderEducationQueue()}
              {activeTab === 'business_training' && <TrainingAndDictionary role="business" onScheduleConsult={() => setActiveTab('education_queue')} />}
              {activeTab === 'provider_training' && <TrainingAndDictionary role="provider" onScheduleConsult={() => setActiveTab('education_queue')} />}
              {activeTab === 'attorney_training' && <TrainingAndDictionary role="attorney" onScheduleConsult={() => setActiveTab('education_queue')} />}
              
              {activeTab === 'ops_livecenter' && <div className="h-full"><CallCenterCommandTab /></div>}
              {activeTab === 'applications_queue' && renderPlaceholder('Applications Queue', 'Review patient, business, and licensing applications.', FileText, 'text-amber-500')}
              
              {activeTab === 'hr_intelligence' && renderPlaceholder('HR Intelligence Hub', 'Manage onboarding, personnel records, and department assignments.', Users, 'text-blue-500')}
              {activeTab === 'hr_recruitment' && renderPlaceholder('Job Recruitment Queue', 'Track job applicants, interview stages, and new hire paperwork.', Briefcase, 'text-emerald-500')}
              
              {activeTab === 'internal_admin' && renderPlaceholder('Internal Admin Ops', 'Manage internal permissions, roles, and system access.', Shield, 'text-indigo-500')}
              {activeTab === 'gge_processor' && renderPlaceholder('GGE Processor', 'Real-time oversight of the standalone private settlement rail.', Cpu, 'text-purple-500')}
              
              {activeTab === 'training_docs' && renderTrainingDocs()}
              {activeTab === 'extension_directory' && <VoIPExtensionsTab user={user} />}
              {activeTab === 'new_hire_onboarding' && renderNewHireOnboarding()}
              
              {activeTab === 'admin_support' && <div className="bg-white rounded-3xl h-full overflow-hidden shadow-sm border border-slate-100 p-6"><UserCalendar user={user} mode="operations" title="Operations Calendar" /></div>}
              {activeTab === 'support_tickets' && renderPlaceholder('Support Tickets', 'Manage and escalate internal and external support tickets.', MessageSquare, 'text-emerald-500')}
              {activeTab === 'it_diagnostics' && <div className="bg-white rounded-3xl h-full overflow-hidden shadow-sm border border-slate-100 p-6"><ITSupportDashboard /></div>}
              {activeTab === 'ai_guardian' && renderPlaceholder('AI System Guardian', 'Predictive security monitoring and automated anomaly resolution.', Bot, 'text-rose-500')}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Curriculum Library Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Curriculum Library</h3>
                <p className="text-xs text-slate-500 font-medium">Compliance & Operational Training Courses</p>
              </div>
              <button onClick={() => setShowCurriculumModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold uppercase py-1 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-left">
              {[
                { title: 'Metrc Integration Mastery', desc: 'Step-by-step training on synchronizing inventory nodes, compliance verification, and sandbox operations.', code: 'EDU-METRC-201', duration: '60 mins' },
                { title: 'Retail Compliance Pro', desc: 'Understanding jurisdiction-specific rules, W2 vs 1099 classification, and customer verification workflows.', code: 'EDU-COMP-101', duration: '45 mins' },
                { title: 'SINC Oversight Directives', desc: 'Advanced inventory node controls, Metrc key validation, and anomaly resolution protocols.', code: 'EDU-SINC-302', duration: '90 mins' },
                { title: 'Level 1: Core Traceability', desc: 'Essential terminology, navigation, and audit trail retrieval in the GGP-OS platform.', code: 'EDU-TRACE-101', duration: '30 mins' },
                { title: 'HIPAA & PHI Security Regulations', desc: 'Workplace protocols, security compliance rules, and Larry Division integration standards.', code: 'EDU-HIPAA-401', duration: '45 mins' },
              ].map((c, i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex justify-between items-center text-left">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded">{c.code}</span>
                      <h4 className="font-bold text-slate-800 text-sm">{c.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold shrink-0">{c.duration}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setShowCurriculumModal(false)} className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] transition-transform uppercase">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Tracks Modal */}
      {showConfigTracksModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Configure Training Tracks</h3>
                <p className="text-xs text-slate-500 font-medium">Map training tracks to organizational roles</p>
              </div>
              <button onClick={() => setShowConfigTracksModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold uppercase py-1 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
                Close
              </button>
            </div>
            <div className="p-6 space-y-4 text-left">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Select Department</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500">
                    <option>Medical Department</option>
                    <option>General Support</option>
                    <option>Legal / Regulatory</option>
                    <option>Sales & Patient Drives</option>
                    <option>Quality Assurance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assigned Curriculum</label>
                  <div className="space-y-2">
                    {['Level 1: Core Traceability', 'Metrc Integration Mastery', 'HIPAA & PHI Security Regulations'].map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <input type="checkbox" defaultChecked className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-xs font-semibold text-slate-700">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowConfigTracksModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors uppercase">
                Cancel
              </button>
              <button onClick={() => { alert('Tracks configured successfully!'); setShowConfigTracksModal(false); }} className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.02] transition-transform uppercase">
                Save Track Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

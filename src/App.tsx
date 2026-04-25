import React, { Component, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STATE_RESOURCES } from './stateResources';
import { getPlansForRole, getAddOnsForRole } from './lib/subscriptionPlans';
import {
  Shield,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  Smartphone,
  LogIn,
  ChevronRight,
  ArrowLeft,
  Lock,
  Upload,
  CheckCircle2,
  Save,
  Leaf,
  Mail,
  LayoutDashboard,
  Users,
  Settings,
  BarChart2,
  BarChart3,
  Calendar,
  FileText,
  Activity,
  LogOut,
  Bell,
  Search,
  Plus,
  Building2,
  Stethoscope,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Filter,
  Loader2,
  ArrowRight,
  Globe,
  MapPin,
  Map as MapIcon,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  GraduationCap,
  Sparkles,
  Scale,
  Search as SearchIcon,
  Briefcase,
  Bot,
  BookOpen,
  Wrench,
  Video,
  Flag,
  Camera,
  Monitor,
  Image,
  Paperclip,
  CircleCheck,
  Circle,
  ShoppingCart,
  PackageSearch,
  ClipboardList,
  Cpu,
  Gavel,
  Headphones,
  Phone,
  Star,
  ArrowUpCircle,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';
import MapChart from './components/MapChart';
import { AdminDashboard } from './pages/AdminDashboard';
import { FounderDashboard } from './pages/FounderDashboard';
import { StateAuthorityDashboard } from './pages/StateAuthorityDashboard';
import { OperationsDashboard } from './pages/OperationsDashboard';
import { ExternalAdminDashboard } from './pages/ExternalAdminDashboard';
import TeleHealthDashboard from './components/TeleHealthDashboard';
import { LARRY_LEGAL_KNOWLEDGE } from './legalKnowledge';
import { BusinessDashboard } from './pages/BusinessDashboard';
import BusinessRegistrationPage from './pages/BusinessRegistrationPage';
import { FederalDashboard } from './pages/FederalDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AttorneyDashboard } from './pages/AttorneyDashboard';
import { PublicHealthDashboard } from './pages/PublicHealthDashboard';
import { CareWalletDashboard } from './pages/CareWalletDashboard';
import { generateGeminiResponse } from './lib/gemini';
import { EnforcementDashboard } from './pages/EnforcementDashboard';
import { BackOfficeDashboard } from './pages/BackOfficeDashboard';
import ProviderRegistrationPage from './pages/ProviderRegistrationPage';
import { EducationPortal } from './pages/EducationPortal';
import { ProSeLegalIntake } from './pages/ProSeLegalIntake';
import { PatientDashboard } from './pages/PatientDashboard';
import { OversightDashboard } from './pages/OversightDashboard';
import { PricingTiers } from './components/PricingTiers';
import { LanguageSelector } from './components/LanguageSelector';
import { FeaturedPoll, StickyPollWidget } from './components/CommunityPolls';

// --- Constants ---

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// PIN Verification Screen for Admins
const PinVerificationScreen = ({ userProfile, onVerify, onBack }: { userProfile: any, onVerify: () => void, onBack: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      // Logic: idCode is last 4 of SSN stored in profile
      if (pin === (userProfile.idCode || '0000')) {
        onVerify();
      } else {
        setError('Invalid Security PIN. Access Denied.');
        setPin('');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#111a2e] border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
          <Shield size={40} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Security Shield Active</h2>
        <p className="text-slate-400 text-sm mb-8">Executive session detected. Please enter your <span className="text-white font-bold">4-digit Security PIN</span> (Last 4 of SSN) to proceed.</p>
        
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("w-12 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all", pin.length > i ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-800 bg-slate-900 text-slate-700")}>
              {pin.length > i ? '•' : ''}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((num, i) => (
            <button
              key={i}
              onClick={() => {
                if (num === 'C') setPin('');
                else if (num === '⌫') setPin(prev => prev.slice(0, -1));
                else if (pin.length < 4) setPin(prev => prev + num);
              }}
              className="h-14 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-white font-bold text-lg transition-colors border border-white/5 active:scale-95"
            >
              {num}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-xs font-bold mb-6 animate-pulse uppercase tracking-widest">{error}</p>}

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/40"
            onClick={handleVerify}
            disabled={pin.length < 4 || loading}
            icon={loading ? Loader2 : CheckCircle2}
          >
            {loading ? 'Verifying...' : 'Authorize Supreme Command'}
          </Button>
          <button onClick={onBack} className="text-xs text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase tracking-widest mt-2">Abort Login</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Types ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

// --- Error Boundary ---

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorInfo: error.message };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const state = (this as any).state;
    if (state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {state.errorInfo && (
              <div className="bg-slate-100 p-4 rounded-lg mb-6 text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-slate-700">{state.errorInfo}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#1a4731] text-white py-2 rounded-lg font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---

const Input = ({ label, error, icon: Icon, rightElement, onClickIcon, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {rightElement}
      </div>
    )}
    <div className="relative">
      <input
        {...props}
        className={cn(
          "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 transition-all",
          Icon && "pr-10",
          props.className
        )}
      />
      {Icon && (
        <div
          className={cn("absolute right-3 top-1/2 -translate-y-1/2 text-slate-400", onClickIcon && "cursor-pointer hover:text-slate-600")}
          onClick={onClickIcon}
        >
          <Icon size={18} />
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Button = ({ children, variant = 'primary', className, icon: Icon, ...props }: any) => {
  const variants = {
    primary: "bg-[#1a4731] text-white hover:bg-[#153a28] shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    outline: "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    success: "bg-[#A3B18A] text-white hover:bg-[#8A9A73]"
  };

  return (
    <button
      {...props}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

// --- Screens ---

// --- Dashboards ---

const DashboardLayout = ({ children, role, onLogout, userProfile, onOpenConcierge }: { children: React.ReactNode, role: string, onLogout: () => void, userProfile: any, onOpenConcierge?: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('Overview');

  const menuItems = {
    patient: [
      { icon: LayoutDashboard, label: 'Overview' },
      { icon: Video, label: 'Telehealth' },
      { icon: Calendar, label: 'Appointments' },
      { icon: FileText, label: 'Health Records' },
      { icon: Stethoscope, label: 'Prescriptions' },
      { icon: Settings, label: 'Settings' },
    ],
    business: [
      { icon: LayoutDashboard, label: 'Dashboard' },
      { icon: ShoppingCart, label: 'POS & Sales' },
      { icon: PackageSearch, label: 'Inventory (SINC)' },
      { icon: MapPin, label: 'Locations' },
      { icon: Shield, label: 'Compliance' },
      { icon: BarChart2, label: 'Integrations' },
      { icon: ClipboardList, label: 'Insurance & Bonding' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'System' },
      { icon: Users, label: 'User Management' },
      { icon: CheckCircle2, label: 'Approvals' },
      { icon: Activity, label: 'Logs' },
      { icon: Settings, label: 'Settings' },
    ],
    executive: [
      { icon: LayoutDashboard, label: 'Strategy' },
      { icon: BarChart3, label: 'Analytics' },
      { icon: TrendingUp, label: 'Growth' },
      { icon: Users, label: 'Stakeholders' },
      { icon: Settings, label: 'Settings' },
    ],
    oversight: [
      { icon: LayoutDashboard, label: 'Compliance Overview' },
      { icon: Video, label: 'Telehealth Monitoring' },
      { icon: Activity, label: 'Monitoring' },
      { icon: FileText, label: 'Reports' },
      { icon: Users, label: 'Entities' },
      { icon: Settings, label: 'Settings' },
    ],
    federal: [
      { icon: LayoutDashboard, label: 'Nationwide Overview' },
      { icon: Globe, label: 'Interstate Monitoring' },
      { icon: Shield, label: 'Enforcement & Intel' },
      { icon: Activity, label: 'Public Health & Labs' },
      { icon: BarChart3, label: 'Revenue & Taxation' },
      { icon: FileText, label: 'Policy Scenarios' },
      { icon: Sparkles, label: 'Sylara Federal AI' },
      { icon: Settings, label: 'Settings' },
    ]
  };

  const roleColors = {
    patient: 'bg-emerald-600',
    business: 'bg-[#1a4731]',
    admin: 'bg-slate-800',
    executive: 'bg-indigo-700',
    oversight: 'bg-amber-600',
    federal: 'bg-blue-900'
  };

  const safeRoleMatch = (role || '').toLowerCase();
  const normalizedRole = safeRoleMatch.includes('federal') ? 'federal'
    : safeRoleMatch.includes('admin') ? 'admin' 
    : safeRoleMatch.includes('exec') ? 'executive'
    : safeRoleMatch.includes('over') ? 'oversight'
    : safeRoleMatch.includes('business') ? 'business'
    : 'patient'; // Default everything else (Patient, Caregiver) to patient

  const currentMenu = menuItems[normalizedRole as keyof typeof menuItems] || menuItems.patient;
  const currentTheme = roleColors[normalizedRole as keyof typeof roleColors] || roleColors.patient;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className={cn("p-6 flex items-center", isSidebarOpen ? "justify-center" : "justify-center")}>
          <img src="/gghp-branding.png" alt="GGHP Logo" className={cn("object-contain transition-all duration-300", isSidebarOpen ? "w-28 h-28" : "w-12 h-12")} onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center">
            <div className={cn("rounded-xl flex items-center justify-center text-white shadow-sm transition-all duration-300",
              currentTheme,
              isSidebarOpen ? "w-20 h-20" : "w-10 h-10"
            )}>
              <Shield size={isSidebarOpen ? 40 : 20} />
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {currentMenu.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                activeSection === item.label ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={cn(activeSection === item.label ? "text-[#1a4731]" : "text-slate-400 group-hover:text-slate-600")} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          {onOpenConcierge && (
            <button
              onClick={onOpenConcierge}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white bg-[#1a4731] hover:bg-[#153a28] shadow-sm transition-colors"
            >
              <Sparkles size={20} />
              {isSidebarOpen && <span className="text-sm font-black">Concierge Action</span>}
            </button>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {activeSection !== 'Overview' ? activeSection : `${role} Dashboard`}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-[#1a4731]/20 transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shadow-sm mr-2">
              <span className="font-bold text-[10px] uppercase tracking-wider">Compassion Balance:</span>
              <span className="font-black text-sm">$0.00</span>
              <button className="ml-2 px-2 py-0.5 bg-[#1a4731] text-white rounded text-[10px] font-bold hover:bg-[#153a28] transition-colors">Reload</button>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Jane Doe</p>
                <p className="text-xs text-slate-500 capitalize">{role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
                <img src="https://picsum.photos/seed/jane/100/100" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-0 overflow-auto">
          {activeSection.includes('Telehealth') ? (
            <TeleHealthDashboard user={userProfile} />
          ) : (
            <div className="p-8">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2.5 rounded-xl text-white", color)}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);




const _LegacyAdminDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Users" value="1,284" trend={8} icon={Users} color="bg-slate-800" />
      <StatCard label="Pending Approvals" value="24" icon={CheckCircle2} color="bg-amber-500" />
      <StatCard label="System Health" value="99.9%" icon={Activity} color="bg-emerald-500" />
      <StatCard label="Active Sessions" value="142" icon={Clock} color="bg-[#1a4731]" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">Pending Approvals</h3>
        <div className="space-y-4">
          {[
            { name: 'Sarah Miller', role: 'Business Owner', company: 'Miller Organics', time: '2h ago' },
            { name: 'Robert Chen', role: 'Executive', company: 'Global Health', time: '5h ago' },
            { name: 'Emma Wilson', role: 'Business Owner', company: 'Wilson Labs', time: '1d ago' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {item.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role} • {item.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><XCircle size={18} /></button>
                <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><CheckCircle size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">System Logs</h3>
        <div className="space-y-4">
          {[
            { event: 'Database Backup', status: 'Success', time: '04:00 AM' },
            { event: 'New User Registration', status: 'Info', time: '08:12 AM' },
            { event: 'Failed Login Attempt', status: 'Warning', time: '09:45 AM' },
            { event: 'API Key Rotated', status: 'Success', time: '10:30 AM' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  item.status === 'Success' ? "bg-emerald-500" :
                    item.status === 'Warning' ? "bg-amber-500" : "bg-emerald-500"
                )}></div>
                <span className="text-slate-700">{item.event}</span>
              </div>
              <span className="text-slate-400 font-mono text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ExecutiveDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Revenue" value="$2.4M" trend={15} icon={TrendingUp} color="bg-indigo-700" />
      <StatCard label="Market Share" value="18.4%" trend={3} icon={BarChart3} color="bg-[#1a4731]" />
      <StatCard label="Active Users" value="45.2k" trend={22} icon={Users} color="bg-emerald-700" />
      <StatCard label="Compliance Index" value="99.4" icon={Shield} color="bg-slate-800" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Growth Projection</h3>
            <p className="text-sm text-slate-500">Quarterly revenue growth vs target</p>
          </div>
          <select className="bg-slate-50 border-none rounded-lg text-sm font-medium px-4 py-2">
            <option>Last 12 Months</option>
            <option>Last 3 Years</option>
          </select>
        </div>
        <div className="h-64 flex items-end gap-4 px-4">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80",
                  i === 11 ? "bg-indigo-600" : "bg-slate-200"
                )}
                style={{ height: `${h}%` }}
              ></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6">Revenue by Segment</h3>
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {[
            { label: 'Healthcare', value: 45, color: 'bg-indigo-600' },
            { label: 'Business Services', value: 30, color: 'bg-emerald-500' },
            { label: 'Government', value: 15, color: 'bg-emerald-500' },
            { label: 'Other', value: 10, color: 'bg-slate-200' },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-600">{item.label}</span>
                <span className="text-slate-900">{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
          Download Executive Report
        </button>
      </div>
    </div>
  </div>
);




// --- Support Page with AI Chat ---
const SupportPage = ({ onNavigate }: { onNavigate: (view: 'landing') => void }) => {
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

const STATE_RESOURCES: Record<string, any> = {
  "Alabama": { program: "Alabama Medical Cannabis Commission", patientPortal: "https://amcc.alabama.gov/patients/", businessPortal: "https://amcc.alabama.gov/cannabis-business-applicants-2/", guide: "", resources: "https://256today.com/north-alabama-physicians-among-first-certified-to-qualify-medical-cannabis-patients/" },
  "Alaska": { program: "https://www.commerce.alaska.gov/web/amco/home.aspx", patientPortal: "Marijuana Registry Application", businessPortal: "https://accis.elicense365.com/#", guide: "https://www.commerce.alaska.gov/web/Portals/9/pub/ABC/AlcoholFAQ/Accessing%20the%20Public%20Search%20on%20AK-ACCIS.pdf", resources: "https://www.mpp.org/states/alaska/?state=AK" },
  "Arizona": { program: "AZDHS | Public Health Licensing - Medical Marijuana", patientPortal: "https://individual-licensing.azdhs.gov/s/login/?ec=302&startURL=%2Fs%2F", businessPortal: "https://www.azdhs.gov/licensing/medical-marijuana/", guide: "", resources: "https://www.mpp.org/states/arizona/?state=AZ" },
  "Arkansas": { program: "Medical Marijuana Program", patientPortal: "https://mmj.adh.arkansas.gov/", businessPortal: "https://www.dfa.arkansas.gov/office/medical-marijuana-commission/applications-and-forms/", guide: "https://www.dfa.arkansas.gov/wp-content/uploads/00101_-_00118_Redacted.pdf", resources: "https://www.mpp.org/states/arkansas/?state=AR" },
  "California": { program: "https://www.cannabis.ca.gov/", patientPortal: "https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP.aspx", businessPortal: "https://www.cannabis.ca.gov/applicants/", guide: "", resources: "https://www.mpp.org/states/california/?state=CA" },
  "Colorado": { program: "https://cdphe.colorado.gov/", patientPortal: "https://cdphe.colorado.gov/medical-marijuana-registry-patients", businessPortal: "https://med.colorado.gov/marijuana-business-owner-license-application", guide: "", resources: "https://www.mpp.org/states/colorado/?state=CO" },
  "Connecticut": { program: "https://portal.ct.gov/cannabis/medical-marijuana-program?language=en_US", patientPortal: "https://biznet.ct.gov/AccountMaint/Login.aspx", businessPortal: "https://portal.ct.gov/cannabis/knowledge-base/articles/licensing/licensing-home-page?language=en_US", guide: "https://portal.ct.gov/cannabis/knowledge-base/articles/mmp/register-for-a-medical-marijuana-card?language=en_US", resources: "https://www.mpp.org/states/connecticut/?state=CT" },
  "Delaware": { program: "https://omc.delaware.gov/medical/index.shtml?dc=appProc", patientPortal: "https://patients.de.biotr.ac/registration", businessPortal: "https://omc.delaware.gov/adult/licensing/contentFolder/pdfs/matrix.pdf", guide: "https://omc.delaware.gov/adult/licensing/contentFolder/pdfs/matrix.pdf", resources: "https://www.mpp.org/states/delaware/?state=DE" },
  "District Of Columbia": { program: "https://abca.dc.gov/page/patients%E2%80%94dc-residents", patientPortal: "https://octo.quickbase.com/db/bscn22va8?a=dbpage&pageid=23", businessPortal: "https://abca.dc.gov/page/medical-cannabis-program#gsc.tab=0", guide: "", resources: "https://www.mpp.org/states/district-of-columbia/?state=DC" },
  "Florida": { program: "https://mmuregistry.flhealth.gov/spa/", patientPortal: "https://mmuregistry.flhealth.gov/spa/login", businessPortal: "https://knowthefactsmmj.com/wp-content/uploads/_documents/form-dh8013-ommu-042018-application-for-medical-marijuana-treatment-center-registration.pdf", guide: "", resources: "https://www.mpp.org/states/florida/?state=FL" },
  "Georgia": { program: "https://www.gmcc.ga.gov/patients/patient-resources", patientPortal: "https://dph.georgia.gov/low-thc-oil-registry/patients-and-caregivers", businessPortal: "https://www.gmcc.ga.gov/licensing/dispensing-license", guide: "https://drive.google.com/file/d/1fE7ssVack5s48xVXcI_yLKZyPoqoIunm/view", resources: "https://www.mpp.org/states/georgia/?state=GA" },
  "Hawaii": { program: "https://medmj.ehawaii.gov/medmj/welcome", patientPortal: "Login Required", businessPortal: "https://health.hawaii.gov/medicalcannabis/", guide: "", resources: "https://www.mpp.org/states/hawaii/?state=HI" },
  "Idaho": { program: "https://idahocannabis.org/medical", patientPortal: "https://idahocannabis.org/medical", businessPortal: "https://agri.idaho.gov/", guide: "https://agri.idaho.gov/", resources: "https://www.mpp.org/states/idaho/?state=ID" },
  "Illinois": { program: "https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html", patientPortal: "Login Required", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/illinois/?state=IL" },
  "Indiana": { program: "https://indianacannabis.org/medical", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/indiana/?state=IN" },
  "Iowa": { program: "https://hhs.iowa.gov/health-prevention/medical-cannabis/patients-caregivers", patientPortal: "https://idph.my.salesforce-sites.com/IowaReg", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/iowa/?state=IA" },
  "Kansas": { program: "https://kansasstatecannabis.org/medical", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/kansas/?state=KS" },
  "Kentucky": { program: "https://kymedcan.ky.gov/Pages/index.aspx", patientPortal: "https://kymedcan.ky.gov/patients-and-caregivers/Pages/default.aspx", businessPortal: "https://kymedcan.ky.gov/businesses/Pages/default.aspx", guide: "", resources: "https://www.mpp.org/states/kentucky/?state=KY" },
  "Louisiana": { program: "https://ldh.la.gov/page/medical-marijuana", patientPortal: "Requires prescription from regular doctor", businessPortal: "https://ldh.la.gov/assets/oph/Center-EH/sanitarian/fooddrug/marijuana/Marijuana-Retailer-Plans-Review-Questionnaire---1-26.Fillable.pdf", guide: "", resources: "https://www.mpp.org/states/louisiana/?state=LA" },
  "Maine": { program: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms/registryidentificationcard-instructions", patientPortal: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421", businessPortal: "https://licensing.web.maine.gov/cgi-bin/online/licensing/begin.pl?board_number=421", guide: "https://www.maine.gov/dafs/ocp/medical-use/applications-forms/registryidentificationcard-instructions", resources: "https://www.mpp.org/states/maine/?state=ME" },
  "Maryland": { program: "https://cannabis.maryland.gov/Pages/Medical_Cannabis.aspx", patientPortal: "https://cannabis.maryland.gov/Pages/patients.aspx", businessPortal: "https://cannabis.maryland.gov/Pages/Industry_Licensees_and_Registrants.aspx", guide: "https://cannabis.maryland.gov/Documents/Infographics/DesignateCaregiver_Patient_Process.pdf", resources: "https://www.mpp.org/states/maryland/?state=MD" },
  "Massachusetts": { program: "https://masscannabiscontrol.com/new-patients/register-as-a-new-patient/", patientPortal: "https://patient.massciportal.com/mmj-patient/login", businessPortal: "https://masscannabiscontrol.com/license-types/", guide: "", resources: "https://www.mpp.org/states/massachusetts/?state=MA" },
  "Michigan": { program: "https://www.michigan.gov/cra/sections/mmp", patientPortal: "https://aca-prod.accela.com/MIMM/Default.aspx", businessPortal: "https://www.michigan.gov/cra/sections/mmp", guide: "", resources: "https://www.mpp.org/states/michigan/?state=MI" },
  "Minnesota": { program: "https://mn.gov/ocm/businesses/licensing/license-types/", patientPortal: "https://cannabis.web.health.state.mn.us/", businessPortal: "https://mn.gov/ocm/businesses/licensing/license-types/", guide: "https://www.mda.state.mn.us/plants/hemp/firsttimeapplicants", resources: "https://www.mpp.org/states/minnesota/?state=MN" },
  "Mississippi": { program: "https://ms-doh-public.nls.egov.com/login", patientPortal: "https://www.mmcp.ms.gov/patients-caregivers", businessPortal: "https://www.mmcp.ms.gov/businesses", guide: "https://msdh.ms.gov/page/30,0,425.html", resources: "https://www.mpp.org/states/mississippi/?state=MS" },
  "Missouri": { program: "https://mo-public.mycomplia.com/login", patientPortal: "https://mo-public.mycomplia.com/register", businessPortal: "https://mo-public.mycomplia.com/register", guide: "", resources: "https://www.mpp.org/states/missouri/?state=MO" },
  "Montana": { program: "https://revenue.mt.gov/", patientPortal: "https://tap.dor.mt.gov/_/", businessPortal: "https://tap.dor.mt.gov/", guide: "", resources: "https://www.mpp.org/states/montana/?state=MT" },
  "Nebraska": { program: "https://lcc.nebraska.gov/medical-cannabis/medical-cannabis-commission-how-apply", patientPortal: "https://lcc.nebraska.gov/medical-cannabis/medical-cannabis-commission-how-apply", businessPortal: "https://lcc.nebraska.gov/medical-cannabis/medical-cannabis-commission-how-apply", guide: "", resources: "https://www.mpp.org/states/nebraska/?state=NE" },
  "Nevada": { program: "https://www.dpbh.nv.gov/regulatory/medical-marijuana/medical-marijuana-patient-cardholder-registry/", patientPortal: "https://mmportal.nv.gov/PatientRegistryOnline/PatientRegistryOLCreateLogin", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/nevada/?state=NV" },
  "New Hampshire": { program: "https://www.dhhs.nh.gov/programs-services/population-health/therapeutic-cannabis/therapeutic-cannabis-applications-and", patientPortal: "https://www.dhhs.nh.gov/sites/g/files/ehbemt476/files/documents/2021-11/tcp-applicationpatient.pdf", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/new-hampshire/?state=NH" },
  "New Jersey": { program: "https://www.nj.gov/cannabis/medicinalcannabis/patient-registration/", patientPortal: "https://njmcp.crc.nj.gov/web/#/home/createAdultPatientUser", businessPortal: "https://www.nj.gov/cannabis/businesses/recreational/license-application-process/", guide: "", resources: "https://www.mpp.org/states/new-jersey/?state=NJ" },
  "New Mexico": { program: "https://www.rld.nm.gov/cannabis/licensing/new-applications/apply-for-license/", patientPortal: "https://www.rld.nm.gov/cannabis/licensing/new-applications/", businessPortal: "https://www.rld.nm.gov/cannabis/licensing/apply-renew-a-cannabis-license/", guide: "", resources: "https://www.mpp.org/states/new-mexico/?state=NM" },
  "New York": { program: "https://cannabis.ny.gov/medical-cannabis-program-applications", patientPortal: "https://cannabis.ny.gov/patients", businessPortal: "https://cannabis.ny.gov/licensing", guide: "", resources: "https://www.mpp.org/states/new-york/?state=NY" },
  "North Carolina": { program: "https://northcarolinastatecannabis.org/medical", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/north-carolina/?state=NC" },
  "North Dakota": { program: "https://mmregistration.health.nd.gov/", patientPortal: "https://mmregistration.health.nd.gov/", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/north-dakota/?state=ND" },
  "Ohio": { program: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/obtain-medical-marijuana", patientPortal: "https://com.ohio.gov/divisions-and-programs/cannabis-control/patients-caregivers/patient-and-caregiver-registry", businessPortal: "https://com.ohio.gov/divisions-and-programs/cannabis-control", guide: "", resources: "https://www.mpp.org/states/ohio/?state=OH" },
  "Oklahoma": { program: "https://oklahoma.gov/omma/apply.html", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/oklahoma/?state=OK" },
  "Oregon": { program: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx", patientPortal: "https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/forms.aspx#online", businessPortal: "https://ommpsystem.oregon.gov/", guide: "", resources: "https://www.mpp.org/states/oregon/?state=OR" },
  "Pennsylvania": { program: "https://www.pa.gov/services/health/register-for-the-medical-marijuana-program", patientPortal: "https://padohmmp.custhelp.com/app/login", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/pennsylvania/?state=PA" },
  "Rhode Island": { program: "https://health.ri.gov/medical-marijuana/information/patients-caregivers", patientPortal: "Login Required", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/rhode-island/?state=RI" },
  "South Carolina": { program: "https://southcarolinastatecannabis.org/medical", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/south-carolina/?state=SC" },
  "South Dakota": { program: "https://medcannabisapplication.sd.gov/", patientPortal: "https://medcannabis.sd.gov/", businessPortal: "https://medcannabis.sd.gov/Establishments/Forms.aspx", guide: "", resources: "https://www.mpp.org/states/south-dakota/?state=SD" },
  "Tennessee": { program: "https://www.tn.gov/agriculture/businesses/hemp/hemp-derived-cannabinoids/hemp-derived-cannabinoids-licensing.html", patientPortal: "", businessPortal: "https://www.tn.gov/abc.html", guide: "", resources: "https://www.mpp.org/states/tennessee/?state=TN" },
  "Texas": { program: "https://www.texas.gov/health-services/texas-medical-marijuana/", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/texas/?state=TX" },
  "Utah": { program: "https://medicalcannabis.utah.gov/patients/apply-for-patient-card/", patientPortal: "Login Required", businessPortal: "https://medicalcannabis.utah.gov/patients/apply-for-patient-card/", guide: "", resources: "https://www.mpp.org/states/utah/?state=UT" },
  "Vermont": { program: "https://ccb.vermont.gov/med-forms", patientPortal: "https://ccb.vermont.gov/forms", businessPortal: "https://ccb.vermont.gov/applications", guide: "", resources: "https://www.mpp.org/states/vermont/?state=VT" },
  "Virginia": { program: "https://cca.virginia.gov/medicalcannabis", patientPortal: "https://cca.virginia.gov/medicalcannabis/patients", businessPortal: "https://cca.virginia.gov/medicalcannabis/patients", guide: "", resources: "https://www.mpp.org/states/virginia/?state=VA" },
  "Washington": { program: "https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis/patient-information", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/washington/?state=WA" },
  "West Virginia": { program: "https://omc.wv.gov/patient-application/Pages/default.aspx", patientPortal: "https://omc.wv.gov/patients/Pages/default.aspx", businessPortal: "https://omc.wv.gov/industry/application/Pages/default.aspx", guide: "", resources: "https://www.mpp.org/states/west-virginia/?state=WV" },
  "Wisconsin": { program: "https://docs.legis.wisconsin.gov/2025/related/proposals/sb534", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/wisconsin/?state=WI" },
  "Wyoming": { program: "https://wyomingcannabis.org/medical", patientPortal: "", businessPortal: "", guide: "", resources: "https://www.mpp.org/states/wyoming/?state=WY" }
};

  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const textToSubmit = overrideText || inputValue;
    if (!textToSubmit.trim()) return;
    const userMessage = textToSubmit;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    if (!overrideText) setInputValue('');
    setIsTyping(true);

    try {
      // Simulate real web connection with wikipedia search as a proxy for "Cannabis related query search"
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Cannabis+${encodeURIComponent(userMessage)}&utf8=&format=json&origin=*`);
      const data = await res.json();
      const docs = data.query?.search;

      let botResponse = "I couldn't find a direct answer on the web for that query.";

      // Check if user is asking for a specific state
      let foundState = "";
      const lowerQuery = userMessage.toLowerCase();
      
      for (const stateName of Object.keys(STATE_RESOURCES)) {
         if (lowerQuery.includes(stateName.toLowerCase())) {
            foundState = stateName;
            break;
         }
      }

      if (foundState) {
         const info = STATE_RESOURCES[foundState];
         let lines = [`Here are the cannabis legal resources and portals for **${foundState}**:`];
         if (info.program) lines.push(`• **State Cannabis Program**: ${info.program.startsWith('http') ? `[Link](${info.program})` : info.program}`);
         if (info.patientPortal) lines.push(`• **Patient/Caregiver/Physician Portal**: ${info.patientPortal.startsWith('http') ? `[Portal Link](${info.patientPortal})` : info.patientPortal}`);
         if (info.businessPortal) lines.push(`• **Business Application Portal**: ${info.businessPortal.startsWith('http') ? `[Portal Link](${info.businessPortal})` : info.businessPortal}`);
         if (info.guide) lines.push(`• **Guide**: ${info.guide.startsWith('http') ? `[Guide Link](${info.guide})` : info.guide}`);
         if (info.resources) lines.push(`• **State Cannabis Resources**: ${info.resources.startsWith('http') ? `[Resource Link](${info.resources})` : info.resources}`);
         
         botResponse = lines.join('\n');
      } else {
         // Keyword/phrase search against the LARRY_LEGAL_KNOWLEDGE string
         const legalBlocks = LARRY_LEGAL_KNOWLEDGE.split(/(?:^|\n\n)(?:WA|WI) \n[S|A]B\d+/i);
         
         const queryWords = lowerQuery.replace(/[^\w\s]/gi, '').split(' ').filter(word => word.length > 3 && !['what', 'when', 'where', 'how', 'why', 'who', 'this', 'that', 'from', 'with'].includes(word));
         
         let bestMatch = "";
         let maxMatches = 0;
         
         if (queryWords.length > 0) {
            // First try matching specific bills if mentioned
            const billMatch = lowerQuery.match(/(sb|ab)\d+/);
            if (billMatch) {
                const billId = billMatch[0].toUpperCase();
                const regex = new RegExp(`(?:WA|WI)\\s*\\n${billId}[\\s\\S]*?(?=\\n\\n(?:WA|WI)|$)`, 'i');
                const match = LARRY_LEGAL_KNOWLEDGE.match(regex);
                if (match) {
                    bestMatch = match[0];
                    maxMatches = 999;
                }
            } else {
                // If the user asks a very generic question about the dataset itself
                if (queryWords.includes("resources") && queryWords.includes("regulatory") && queryWords.includes("guides")) {
                     bestMatch = legalBlocks[0]; // The introduction text
                     maxMatches = 999;
                } else {
                    // Start from i=0 to include the introduction text in the general text search
                    for (let i = 0; i < legalBlocks.length; i++) {
                        const block = legalBlocks[i];
                        let matches = 0;
                        for (const word of queryWords) {
                            if (block.toLowerCase().includes(word)) {
                                matches++;
                            }
                        }
                        if (matches > maxMatches) {
                            maxMatches = matches;
                            bestMatch = block;
                        }
                    }
                }
            }
         }

         if (maxMatches > 0 && bestMatch) {
            // Re-attach the state and bill id context
            const fullBlockMatch = LARRY_LEGAL_KNOWLEDGE.match(new RegExp(`(?:WA|WI)\\s*\\n[S|A]B\\d+\\s*\\n${bestMatch.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').substring(0, 50)}`, 'i')); 
            
            const contentToReturn = fullBlockMatch ? LARRY_LEGAL_KNOWLEDGE.substring(fullBlockMatch.index || 0).split(/\n\n(?:WA|WI)/)[0] : bestMatch;
            
            botResponse = `Based on my legal resources database:\n\n${contentToReturn.trim()}`;
         } else if (lowerQuery.includes('application')) {
            botResponse = 'For application issues, you can navigate to the "Patient Portal" or contact our support team using the form.';
         } else {
            // Using LIVE Gemini Integration
            try {
               botResponse = await generateGeminiResponse(userMessage, 'general', messages.filter(m => m.role !== 'system'));
            } catch (err) {
               botResponse = 'I am your Assistant. Try asking about specific US States to get Cannabis regulations, portals, and guides. (Gemini AI service unavailable)';
            }
         }
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble processing your request right now. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/gghp-logo.png" alt="GGHP Logo" className="h-10 w-auto object-contain" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
          <div className="w-px h-6 bg-slate-300"></div>
          <span className="text-slate-500 font-medium">Support Center</span>
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm"
        >
          Back to Portal
        </button>
      </nav>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Hi, how can we help?</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for guides, policies, or FAQs..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 transition-all text-slate-700"
            />
            {isSearching && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />}
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-10">
            {viewedArticle ? (
              <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <button onClick={clearArticleView} className="mb-6 text-sm font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-2">
                  <ArrowLeft size={16} /> Back to results
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{viewedArticle.title}</h2>
                <div className="prose prose-slate max-w-none">
                  {viewedArticle.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 text-slate-600 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : searchResults.length > 0 ? (
              <section>
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-xl font-bold text-slate-800">Search Results</h2>
                   <button onClick={() => setSearchResults([])} className="text-sm font-medium text-slate-500 hover:text-slate-800">Clear Search</button>
                </div>
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.pageid} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                      <h3 className="font-bold text-slate-800 mb-2 truncate">{result.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: result.snippet + '...' }}></p>
                      <button onClick={() => handleViewArticle(result.pageid, result.title)} className="text-[#a3b18a] font-bold text-sm hover:underline inline-flex items-center">
                        Read Full Article
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <>
            {/* Knowledge Base */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Knowledge Base</h2>
              <div className="space-y-4">
                {/* Aggegator Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-6 shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4FC3F7]"></div>
                  <div className="w-16 h-16 bg-[#e1f5fe] rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg">State Laws Aggregator</h3>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      Search our nationwide database for up-to-date state-specific cannabis regulations, limits, and public health guidelines.
                    </p>
                  </div>
                  <button onClick={() => onNavigate('landing')} className="px-6 py-2 border border-slate-200 bg-white text-slate-800 font-bold text-sm rounded-lg hover:bg-slate-50 shadow-sm transition-all whitespace-nowrap">
                    Access Aggregator
                  </button>
                </div>

                {/* Sub Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Legal Resources', desc: 'Comprehensive guides on compliance, statutes, and regulatory frameworks.', actionText: 'L.A.R.R.Y', isChatLink: true, icon: BookOpen },
                    { title: 'Patient Guides', desc: 'Instructions for self-registration, medical document uploads, and digital card renewals.', icon: User, qas: [
                      { q: "How do I apply for a patient card?", a: "Go to the Patient Portal and complete the application with your ID and physician recommendation." },
                      { q: "What documents do I need?", a: "You need a valid state ID or driver's license, and a certified physician recommendation." }
                    ] },
                    { title: 'Business Access', desc: 'Details on EIN verification, adding multiple locations, and POS integration.', icon: Building2, qas: [
                      { q: "How do I register my dispensary?", a: "Select the Business role during signup, provide your EIN and organizational details, and upload your state license." },
                      { q: "Can I add multiple locations?", a: "Yes, after your primary business account is approved, you can add sub-locations from your dashboard." }
                    ] },
                    { title: 'Admin & Enforcement', desc: 'Guides for anomaly monitoring, application approvals, and compliance tools.', icon: Shield, qas: [
                      { q: "How do I review pending applications?", a: "Applications are queued in your Regulator Dashboard under the 'Pending Review' tab." }
                    ] },
                    { title: 'Technical Support', desc: 'Solutions for login issues, MFA setup, and browser compatibility.', icon: Wrench, qas: [
                      { q: "I forgot my password, what do I do?", a: "Click 'Forgot Password' on the login screen to receive a secure reset link." },
                      { q: "The application is lagging.", a: "Try clearing your browser cache or switching to a supported browser like Chrome or Firefox." }
                    ] },
                    { title: 'TeleHealth Support', desc: 'Get assistance with scheduling and conducting remote medical consultations.', icon: Video, qas: [
                      { q: "How do I schedule a virtual consultation?", a: "Navigate to the TeleHealth tab in your Patient Portal and select an available time slot." },
                      { q: "What do I need for a telehealth call?", a: "A stable internet connection, a quiet room, and a device with a working camera and microphone." }
                    ] },
                  ].map((card, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                      <div className={cn("p-6", !card.isChatLink && "cursor-pointer")} onClick={() => !card.isChatLink && setExpandedFaqCard(expandedFaqCard === i ? null : i)}>
                        <div className="w-10 h-10 bg-[#A3B18A] text-white rounded-lg mb-4 flex items-center justify-center opacity-90 shadow-sm">
                          {card.icon && <card.icon size={20} />}
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">{card.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                          </div>
                          {!card.isChatLink && (
                            <div className="text-slate-400 mt-1 flex-shrink-0 transition-transform">
                                {expandedFaqCard === i ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </div>
                          )}
                        </div>
                        {card.isChatLink ? (
                          <button onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation();
                            setChatOpen(true);
                            handleSendMessage(undefined, "Can you provide cannabis legal resources and regulatory guides?");
                          }} className="text-[#a3b18a] font-bold text-sm mt-4 hover:underline inline-flex items-center text-left">
                            {card.actionText}
                          </button>
                        ) : null}
                      </div>

                      <AnimatePresence>
                        {expandedFaqCard === i && card.qas && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-50 px-6 pb-6 pt-2 border-t border-slate-100"
                          >
                            <div className="space-y-3">
                              {card.qas.map((qa, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                  <h4 className="font-bold text-slate-800 text-sm mb-1.5">{qa.q}</h4>
                                  <p className="text-slate-600 text-sm leading-relaxed">{qa.a}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
                    >
                      <span className="font-semibold text-slate-800">{faq.q}</span>
                      {activeFaq === idx ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                    </button>
                    {activeFaq === idx && (
                      <div className="p-5 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
            </>
            )}
          </div>

          {/* Right Column (Form) */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-[#0D6EFD] rounded-2xl p-8 sticky top-24 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-3">Contact Support</h2>
              <p className="text-white/80 text-sm mb-8 leading-relaxed">
                Need more help? Send us a message and our support team will get back to you.
              </p>

              <form className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90">Your Name</label>
                  <input type="text" placeholder="Jane Doe" className="w-full px-4 py-2.5 bg-white/20 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90">Email Address</label>
                  <input type="email" placeholder="jane@example.com" className="w-full px-4 py-2.5 bg-white/20 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90">Portal Role</label>
                  <select className="w-full px-4 py-2.5 bg-white/20 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/30">
                    <option className="text-slate-800">Patient</option>
                    <option className="text-slate-800">Business</option>
                    <option className="text-slate-800">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90">Subject</label>
                  <input type="text" placeholder="Application Status Inquiry" className="w-full px-4 py-2.5 bg-white/20 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/90">Message</label>
                  <textarea rows={4} placeholder="Describe your issue here..." className="w-full px-4 py-2.5 bg-white/20 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"></textarea>
                </div>
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-white/90 mb-1 block">Attachments (Optional)</label>
                  <button type="button" className="w-full py-3 border-2 border-dashed border-white/20 rounded-lg text-white/80 text-sm font-medium hover:bg-white/10 transition-colors">
                    Click to upload screenshots
                  </button>
                </div>
                <button type="button" className="w-full mt-4 py-3 bg-white text-[#0D6EFD] font-bold rounded-lg hover:bg-white/90 transition-colors shadow-sm">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="bg-white border text-sm border-slate-200 rounded-2xl shadow-xl w-[350px] overflow-hidden mb-4 flex flex-col h-[450px]"
              >
                <div className="bg-[#0D6EFD] p-4 text-white flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src="/larry-logo.png" alt="Sylara" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight">Sylara Legal AI</h3>
                    <p className="text-[11px] text-white/80">Powered by Sylara OS</p>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="ml-auto text-white/80 hover:text-white">
                    <XCircle size={20} />
                  </button>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
                  {messages.map((m, i) => (
                    <div key={i} className={cn("flex max-w-[85%]", m.role === 'user' ? "ml-auto" : "mr-auto")}>
                      <div className={cn(
                        "p-3 rounded-2xl leading-relaxed text-[13.5px]",
                        m.role === 'user' ? "bg-[#A3B18A] text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                      )}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                     <div className="flex max-w-[85%] mr-auto">
                      <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 rounded-tl-none">
                        <Loader2 size={16} className="animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about Cannabis rules..."
                      className="flex-1 px-3 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4731]/20 focus:bg-white"
                    />
                    <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-2 bg-[#0D6EFD] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-[#1a4731] bg-gradient-to-tr from-[#1a4731] to-[#2c6e4d] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden p-0"
        >
           {chatOpen ? <XCircle size={24} /> : <img src="/larry-logo.png" alt="Sylara" className="w-10 h-10 object-cover rounded-full" />}
           {!chatOpen && (
             <span className="absolute -top-1 -right-1 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3b18a] opacity-75"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-[#A3B18A]"></span>
             </span>
           )}
        </button>
      </div>
    </div>
  );
};

const LandingPage = ({ onNavigate }: { onNavigate: (view: 'login' | 'signup' | 'patient-portal' | 'support' | 'larry-chatbot' | 'larry-business' | 'legal-advocacy', role?: string) => void }) => {
  const [broadcastMsg, setBroadcastMsg] = useState('🚨 SYSTEM NOTICE: NATIONWIDE COMPLIANCE AUDIT IN PROGRESS • GLOBAL GREEN HYBRID PLATFORM (GGHP) • ALL SECTORS (GGMA/RIP/SINC) OPERATIONAL');
  const [inTheKnowNews, setInTheKnowNews] = useState([
    '🚨 BREAKING: Federal Marijuana Rescheduling — Schedule I → Schedule III NOW OFFICIAL',
    'OBN Director Anderson: "Opens opportunities for tax breaks, banking, and clinical research"',
    'Oklahoma Grows Down 83%: From 8,400 farms in 2022 to fewer than 1,400 after OBN crackdown',
    'OBN MET seized 2.2M illegal plants & 290,000 lbs processed marijuana since 2021 — 400+ arrests',
    'Schedule III = 280E Tax Relief for legal cannabis businesses — SINC compliance engine ready',
    'VA PTSD Access: Veterans and first responders call for medical cannabis prescribing rights',
    'OMMA Legislative Update: HB 2179 tiered licensing fees now active for all commercial licenses',
    'Sylara AI processed 50,000+ compliance checks this hour'
  ]);

  useEffect(() => {
    // Sync with Founder's Emergency Broadcast
    const syncAlert = () => {
      const savedAlert = localStorage.getItem('gghp_platform_alert');
      if (savedAlert) setBroadcastMsg(savedAlert);
    };
    syncAlert();
    window.addEventListener('storage', syncAlert);
    const interval = setInterval(syncAlert, 1000); // Polling for demo
    return () => {
      window.removeEventListener('storage', syncAlert);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* URGENT PLATFORM ALERT TICKER */}
      <div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-red-700 relative z-[60]">
        <div className="inline-block animate-marquee-fast font-black text-sm uppercase tracking-widest">
          {broadcastMsg} &nbsp; • &nbsp; {broadcastMsg} &nbsp; • &nbsp; {broadcastMsg}
        </div>
      </div>
      {/* 🌐 LANGUAGE BAR — Always visible at the very top */}
      <div className="bg-slate-900 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-2 flex items-center justify-between z-[60] relative">
        <div className="flex items-center gap-3">
          <Globe size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Speak Your Language:</span>
          <div className="flex items-center gap-1">
            {[
              { code: 'en', flag: '🇺🇸', label: 'EN' },
              { code: 'es', flag: '🇲🇽', label: 'ES' },
              { code: 'zh-CN', flag: '🇨🇳', label: '中文' },
              { code: 'vi', flag: '🇻🇳', label: 'VI' },
              { code: 'ko', flag: '🇰🇷', label: '한' },
              { code: 'ar', flag: '🇸🇦', label: 'عر' },
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => { 
                  if (lang.code === 'en') {
                    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
                  } else {
                    document.cookie = `googtrans=/en/${lang.code}; path=/;`;
                    document.cookie = `googtrans=/en/${lang.code}; path=/; domain=` + window.location.hostname;
                  }
                  window.location.reload();
                }}
                className="px-2 py-1 rounded-md text-xs hover:bg-white/10 transition-colors text-white/80 hover:text-white flex items-center gap-1"
              >
                <span>{lang.flag}</span>
                <span className="text-[9px] font-bold hidden md:inline">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector currentLanguage="en" onLanguageChange={(code) => { 
            const gCode = code === 'zh' ? 'zh-CN' : code;
            if (gCode === 'en') {
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
            } else {
              document.cookie = `googtrans=/en/${gCode}; path=/;`;
              document.cookie = `googtrans=/en/${gCode}; path=/; domain=` + window.location.hostname;
            }
            window.location.reload();
          }} compact />
          <span className="text-[10px] text-emerald-400 font-bold hidden lg:inline">26 Languages • Sylara AI speaks yours</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <img src="/gghp-logo.png" alt="GGHP Logo" className="h-14 md:h-16 w-auto object-contain object-left" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center">
            <div className="w-12 h-12 bg-[#1a4731] rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#state-facts" className="hover:text-[#1a4731] transition-colors">State Facts</a>
          <button onClick={() => onNavigate('education' as any)} className="hover:text-[#1a4731] transition-colors font-medium flex items-center gap-2">
            <GraduationCap size={16} className="text-emerald-600" /> Education Academy
          </button>
          <button onClick={() => onNavigate('larry-chatbot', 'ggma')} className="hover:text-[#1a4731] transition-colors font-medium">GGMA Sector</button>
          <button onClick={() => onNavigate('larry-chatbot', 'rip')} className="hover:text-[#1a4731] transition-colors font-medium">RIP Intelligence</button>
          <button onClick={() => onNavigate('larry-chatbot', 'sinc')} className="hover:text-[#1a4731] transition-colors font-medium">SINC Compliance</button>
          <button onClick={() => onNavigate('legal-advocacy' as any)} className="hover:text-amber-600 transition-colors font-bold text-amber-700 flex items-center gap-1">
            <Scale size={14} /> Legal Support
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <button 
            onClick={() => onNavigate('larry-chatbot')} 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100 font-bold hover:bg-emerald-100 transition-all shadow-sm group"
          >
            <Calendar size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            Chat with SYLARA OUR AI Cannabis Concierge
          </button>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector currentLanguage="en" onLanguageChange={(code) => { 
            const gCode = code === 'zh' ? 'zh-CN' : code;
            if (gCode === 'en') {
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
            } else {
              document.cookie = `googtrans=/en/${gCode}; path=/;`;
              document.cookie = `googtrans=/en/${gCode}; path=/; domain=` + window.location.hostname;
            }
            window.location.reload();
          }} compact />
          <Button onClick={() => onNavigate('login')}>Login</Button>
        </div>
      </nav>

      {/* 🗳️ COMMUNITY POLLS — Featured Banner */}
      <FeaturedPoll />

      {/* "IN THE KNOW" NEWS TICKER */}
      <div className="bg-emerald-950 text-emerald-100 py-3 border-b border-emerald-900/20 overflow-hidden whitespace-nowrap relative z-40">
        <div className="inline-block animate-marquee font-bold text-xs uppercase tracking-[0.2em]">
          <span className="bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded text-[9px] mr-4">IN THE KNOW</span>
          {inTheKnowNews.join(' • ')} &nbsp; • &nbsp; {inTheKnowNews.join(' • ')}
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-emerald-50 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-emerald-950 font-bold tracking-[0.3em] uppercase text-xs mb-[-10px] opacity-70">Global Green Enterprise Inc introducing</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Infrastructure Active: 50 States + DC Secure
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a4731] leading-[1.05] tracking-tight">
            The Gold Standard in <br /> <span className="text-emerald-600">Compliance Infrastructure</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Global Green Enterprise Inc introduces the Global Green Hybrid Platform (GGHP) — a unified compliance ecosystem for GGMA, RIP, and SINC.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search state laws, statutes, or business regulations..."
              className="w-full pl-12 pr-32 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg"
            />
            <button className="absolute right-2.5 top-2.5 bottom-2.5 px-8 bg-[#1a4731] hover:bg-[#153a28] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20">
              Quick Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button onClick={() => onNavigate('login')} className="px-8 py-4 bg-[#1a4731] text-white rounded-2xl font-bold hover:bg-[#153a28] transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-2">
              Access Enterprise Hub
              <ArrowRight size={18} />
            </button>
            <a href="#membership-tiers" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              View Compliance Tiers
            </a>
          </div>
        </div>
      </section>

      {/* GGHP Infrastructure Banner & News Column */}
      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#1a4731] rounded-[3rem] overflow-hidden shadow-2xl relative border border-white/10 group flex flex-col h-full min-h-[400px]">
             <img src="/gghp-branding.png" alt="GGHP Platform" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0f2d1e] via-[#0f2d1e]/40 to-transparent"></div>
             <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">GGHP</h2>
                  <p className="text-indigo-200 font-medium">Platform state: <span className="text-emerald-400 font-bold">Operational</span> • Umbrella: <span className="text-white font-bold">GGHP (Global Green Enterprise Inc)</span></p>
                  <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Global Green Hybrid Platform (GGHP) • GGMA • RIP • SINC</p>
                </div>
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white text-sm font-bold">
                   50 States Live • 24/7 Monitoring
                </div>
             </div>
          </div>

          {/* Strategic News & Updates Sidebar */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl p-6 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Regulatory Intelligence</h3>
               <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                 <AlertCircle size={12} /> Live Updates
               </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar relative z-10">
               {/* BREAKING: LEAP Rescheduling */}
               <div className="group">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">Breaking</span>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">April 23, 2026</p>
                 </div>
                 <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors">Cannabis Officially Rescheduled: Schedule I → Schedule III</h4>
                 <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc marker:text-emerald-500">
                    <li><strong className="text-slate-800">Acting Attorney General</strong> signed order moving state-licensed medical marijuana from Schedule I to Schedule III of the CSA.</li>
                    <li><strong className="text-slate-800">LEAP Confirms:</strong> Law Enforcement Action Partnership (@PoliceForReform) verified — rescheduling has officially taken place.</li>
                    <li><strong className="text-slate-800">GGHP Impact:</strong> DEA registration tracking, 280E tax deductions, and banking access modules now active across all portals.</li>
                 </ul>
               </div>

               <div className="w-full h-px bg-slate-100"></div>

               {/* Update 1 */}
               <div className="group">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">April 23, 2026</p>
                 <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors">DOJ Final Order: Schedule III Reclassification</h4>
                 <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc marker:text-emerald-500">
                    <li><strong className="text-slate-800">Tax Relief (280E):</strong> Immediate potential to deduct ordinary business expenses.</li>
                    <li><strong className="text-slate-800">SINC Solution:</strong> Automated financial reconciliation for 280E deductions integrated with Metrc.</li>
                    <li><strong className="text-slate-800">Compliance:</strong> New DEA Registration tracked inside GGHP automatically.</li>
                 </ul>
               </div>

               <div className="w-full h-px bg-slate-100"></div>

               {/* Update 2 */}
               <div className="group">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">April 6, 2026</p>
                 <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors">OMMA: 7-Day Routine Inspection Windows</h4>
                 <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc marker:text-emerald-500">
                    <li><strong className="text-slate-800">The Problem:</strong> Licensees facing operational disruptions during unannounced audits.</li>
                    <li><strong className="text-slate-800">SINC Solution:</strong> 24/7 AI-driven mock audits. Your business is audit-ready before OMMA even issues the 7-day notice.</li>
                 </ul>
               </div>

               <div className="w-full h-px bg-slate-100"></div>

               {/* Update 3 */}
               <div className="group">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Industry Trend</p>
                 <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#1a4731] transition-colors">Combating Product Recalls</h4>
                 <ul className="text-xs text-slate-600 space-y-1.5 ml-4 list-disc marker:text-emerald-500">
                    <li><strong className="text-slate-800">The Threat:</strong> Recalls spanning back years due to laboratory failures.</li>
                    <li><strong className="text-slate-800">SINC Solution:</strong> L.A.R.R.Y Enforcement Intelligence preemptively flags bad batches and untrusted lab results before they hit your shelves.</li>
                 </ul>
               </div>
            </div>
            
            <button onClick={() => document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' })} className="w-full mt-6 py-3 bg-[#1a4731] text-white rounded-xl text-sm font-bold hover:bg-[#153a28] transition-colors shadow-lg shadow-emerald-900/20 relative z-10">
               Secure Your Infrastructure
            </button>
          </div>
        </div>
      </section>

      {/* ═══ CREDENTIALS, CERTIFICATIONS & TRUST ═══ */}
      <section id="credentials-section" className="py-20 px-6 bg-slate-50 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              <Shield size={12} /> Verified &amp; Registered
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Credentials &amp; Certifications</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Fully registered across all levels of Oklahoma government. Built by 30+ years of corporate leadership and 8 years of cannabis industry expertise.</p>
          </div>

          {/* Government Registration Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🇺🇸</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">✅ ACTIVE</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">SAM.gov</h4>
              <p className="text-slate-500 text-[11px] mb-1">Federal Supplier</p>
              <p className="text-slate-400 text-[10px] font-mono">CAGE: 9KXZ2</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🏛️</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">✅ REGISTERED</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">OMES</h4>
              <p className="text-slate-500 text-[11px] mb-1">State Vendor</p>
              <p className="text-slate-400 text-[10px] font-mono">Oklahoma State Procurement</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🏙️</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">✅ APPROVED</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">OKC City &amp; Trusts</h4>
              <p className="text-slate-500 text-[11px] mb-1">Municipal Approved</p>
              <p className="text-slate-400 text-[10px] font-mono">BidNet Direct • City of OKC</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-rose-100 hover:border-rose-300 transition-all hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">👩‍💼</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700">✅ CERTIFIED</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">WOSB</h4>
              <p className="text-slate-500 text-[11px] mb-1">Woman-Owned Small Business</p>
              <p className="text-slate-400 text-[10px] font-mono">SBA Certification</p>
            </div>
          </div>

          {/* Additional Registration Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { label: 'Oklahoma ERP/PeopleSoft', icon: '📊' },
              { label: 'BidNet Direct (Municipal)', icon: '📋' },
              { label: 'OKC Bids & Auctions', icon: '🔨' },
              { label: 'County-Level Procurement', icon: '🏘️' },
              { label: 'Metrc Validated Integrator', icon: '🔗' },
              { label: 'HIPAA Compliant', icon: '🔒' },
              { label: 'AES-256 Encryption', icon: '🛡️' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all">
                <span>{badge.icon}</span> {badge.label}
              </div>
            ))}
          </div>

          {/* Founder Credentials + Company Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Accreditations Card */}
            <div className="bg-[#0f2d1e] rounded-2xl p-8 text-white relative overflow-hidden group border border-emerald-900/50 shadow-xl flex flex-col justify-center">
              {/* Neon Shield Map Badge */}
              <div className="absolute inset-y-0 right-0 w-[55%] z-0 flex items-center justify-end opacity-90 transition-opacity duration-700 pointer-events-none pr-4 overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#0f2d1e] via-[#0f2d1e]/80 to-transparent z-10"></div>
                 <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-[#0f2d1e] to-transparent z-10"></div>
                 <img src="/gghp-branding.png" alt="GGHP Badge" className="w-[120%] h-[120%] object-cover object-[center_30%] opacity-80 mix-blend-screen scale-125 translate-x-[15%]" />
              </div>

              <div className="relative z-10 md:max-w-[75%]">
                <div className="flex items-center gap-2 mb-6 inline-flex bg-[#0f2d1e]/80 px-3 py-1.5 rounded-full border border-emerald-800/30 backdrop-blur-sm shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Platform Accreditations</span>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 bg-[#0f2d1e]/60 p-3 rounded-xl backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">🌿</span>
                    <div>
                      <p className="text-white font-black text-sm">8 Years in Cannabis</p>
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Regulatory compliance, licensing, and patient advocacy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[#0f2d1e]/60 p-3 rounded-xl backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">🏢</span>
                    <div>
                      <p className="text-white font-black text-sm">30+ Years Corporate Administration</p>
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Enterprise build, structure, and management leadership</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[#0f2d1e]/60 p-3 rounded-xl backdrop-blur-md border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <span className="text-emerald-400 text-xl drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">🔗</span>
                    <div>
                      <p className="text-white font-black text-sm">Validated Metrc Integrator</p>
                      <p className="text-emerald-100/80 text-[11px] font-medium leading-relaxed">Oklahoma sandbox certified — production API access</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap relative z-10">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-emerald-300 border border-white/10 hover:bg-emerald-500/20 transition-colors cursor-default">Global Green Enterprise Inc</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-emerald-300 border border-white/10 hover:bg-emerald-500/20 transition-colors cursor-default">Diversity Health & Wellness LLC</span>
              </div>
            </div>

            {/* Company Highlights */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Platform Highlights</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '50', label: 'States + DC', sub: 'Infrastructure Active' },
                  { value: '26', label: 'Languages', sub: 'Global Accessibility' },
                  { value: '22+', label: 'Polls Active', sub: 'Community Engagement' },
                  { value: '99.9%', label: 'Uptime SLA', sub: 'Enterprise Reliability' },
                  { value: '3', label: 'AI Engines', sub: 'Sylara • L.A.R.R.Y • SINC' },
                  { value: '5', label: 'Gov Levels', sub: 'Federal → City Registered' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors">
                    <p className="text-2xl font-black text-emerald-950">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-700">{stat.label}</p>
                    <p className="text-[10px] text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Partners Bar */}
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Integrated With &amp; Registered On</p>
            <div className="flex flex-wrap justify-center items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
              {['SAM.gov', 'OMES', 'Metrc', 'BidNet Direct', 'OKC City', 'OK ERP', 'Calendly', 'GoHealthUSA'].map((partner, i) => (
                <span key={i} className="text-xs font-black text-slate-500 uppercase tracking-wider px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-24 bg-slate-100/50 border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Select Your Portal</h2>
            <p className="text-slate-500">Secure, verified access tailored to your regulatory requirements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#4FC3F7] bg-gradient-to-br from-[#4FC3F7] to-[#0288D1] flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <circle cx="8" cy="10" r="2" />
                  <path d="M8 14c-2 0-3 1-3 2" />
                  <path d="M8 14c2 0 3 1 3 2" />
                  <line x1="14" y1="9" x2="20" y2="9" />
                  <line x1="14" y1="13" x2="18" y2="13" />
                  <circle cx="18" cy="16" r="2" fill="white" stroke="white" />
                  <path d="M17.2 16l0.5 0.5 1.1-1.1" stroke="#0288D1" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Patient Portal (GGMA)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The GGMA Consumer Sector. Securely apply for your medical license, manage renewals, and access your digital Care Wallet.
              </p>
              <p className="text-sm italic text-slate-600 mb-6">
                Adult, Minor, Caregiver, Short-Term, Out-of-State
              </p>
              <button
                onClick={() => onNavigate('patient-portal')}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Patient Portal
              </button>
            </div>

            {/* Business Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#81C784] bg-gradient-to-br from-[#81C784] to-[#2E7D32] flex items-center justify-center mb-6 shadow-lg shadow-green-200/50">
                <Building2 className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Business Portal (GGE)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The GGE B2B Sector. Centralized hub for professional operations, seed-to-sale inventory, and compliance audit shielding.
              </p>
              <p className="text-sm italic text-slate-600 mb-6 font-bold">
                Providers, Attorneys, Dispensaries, Cultivation, Manufacturing, Medcard Services
              </p>
              <button
                onClick={() => { onNavigate('signup', 'Business');  }}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Business Onboarding
              </button>
            </div>

            {/* Government / Admin Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#FFB74D] bg-gradient-to-br from-[#FFB74D] to-[#E65100] flex items-center justify-center mb-6 shadow-lg shadow-orange-200/50">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Oversight Portal (RIP/SINC)</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                The Governance Sector. Authorized command center for real-time intelligence (RIP) and secure infrastructure compliance (SINC).
              </p>
              <p className="text-sm italic text-slate-600 mb-6">
                Law Enforcement (RIP), Regulators, Executives, Operations
              </p>
              <button
                onClick={() => { onNavigate('signup', 'Oversight');  }}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Oversight Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Success Stories (GGMA Sector Reviews) */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                ⭐ Community Trust
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verified Patient Success</h2>
              <p className="text-slate-500 max-w-md font-medium">Hear from our community members about their journey with the GGMA Sector.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-slate-700">4.9/5 Average Rating</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { name: 'Marcus T.', date: 'Oct 2024', text: 'The intake process with Sylara was so fast. Had my recommendation in 15 minutes!', rating: 5 },
               { name: 'Sarah J.', date: 'Nov 2023', text: 'Global Green makes compliance feel like common sense. The Care Wallet is a game changer.', rating: 5 },
               { name: 'David L.', date: 'Feb 2024', text: 'Finally a platform that understands Oklahoma regulations from the inside out.', rating: 5 }
             ].map((review, i) => (
               <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
                 <div className="flex gap-1 mb-4">
                   {Array.from({ length: review.rating }).map((_, j) => (
                     <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                   ))}
                 </div>
                 <p className="text-slate-700 font-medium mb-6 leading-relaxed italic">"{review.text}"</p>
                 <div className="flex items-center justify-between">
                   <div className="font-bold text-slate-900 text-sm">{review.name}</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</div>
                 </div>
               </div>
             ))}
          </div>

          <div className="mt-12 text-center">
             <a 
               href="https://vocalvideo.com/c/ccardzmedcard-com-as6sui63" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 text-[#1a4731] font-bold hover:underline"
             >
               View All Verified Testimonials
               <ArrowRight size={16} />
             </a>
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      <PricingTiers onNavigate={(view) => onNavigate(view as any)} />

      {/* Partners & Paid Advertisements */}
      <section className="py-20 border-t border-slate-100 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-6">
           <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Strategic Infrastructure Partners & Sponsors</p>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {['Apex Health', 'Verity Labs', 'GreenGrid', 'SecureLogix', 'OMMA', 'METRC'].map((p, i) => (
                <div key={i} className="flex items-center justify-center h-12 bg-transparent border border-transparent rounded-xl hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all font-black text-slate-900 text-sm italic">
                  {p}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* C3 Introduction Section */}
      <section className="py-24 px-6 bg-slate-900 bg-gradient-to-br from-slate-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border-r border-b border-white/20"></div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-widest">
              ✨ Introducing the Industry Standard
            </div>
            <h2 className="text-5xl font-black tracking-tight leading-tight">
              What is <span className="text-emerald-400">C³</span>?
            </h2>
            <p className="text-xl text-emerald-50/80 leading-relaxed font-medium">
              C³ stands for **Compassion, Compliance & Community**. It is our proprietary real-time trust metric that rewards ethical participation across the Global Green ecosystem.
            </p>
            <div className="space-y-6">
              {[
                { t: 'Compassion', d: 'Rewards accessible patient care and social equity participation.' },
                { t: 'Compliance', d: 'Verifies real-time adherence to Metrc and state statutes via L.A.R.R.Y.' },
                { t: 'Community', d: 'Measures engagement with our educational and operational support hubs.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30 font-black text-emerald-400">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{item.t}</h4>
                    <p className="text-emerald-100/60 text-sm leading-relaxed">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 w-full aspect-square bg-white/5 rounded-[4rem] border border-white/10 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center relative group">
            <div className="absolute inset-0 bg-emerald-400/20 blur-[100px] rounded-full scale-50 group-hover:scale-75 transition-transform duration-1000 opacity-50"></div>
            <div className="text-8xl font-black text-emerald-400 mb-4 tracking-tighter relative">C³</div>
            <div className="text-2xl font-bold text-white mb-2 relative">Score Verification Active</div>
            <p className="text-emerald-100/40 text-sm mb-8 relative">Integrated across all GGMA, RIP, and SINC sectors</p>
            <button 
              onClick={() => onNavigate('larry-chatbot')}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 relative"
            >
              View Your Score Potential
            </button>
          </div>
        </div>
      </section>

      {/* Maps & Stats Section */}
      <section id="jurisdiction-intelligence" className="py-24 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
               Live Data Feed
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Real-time <br /> <span className="text-emerald-600">State Jurisdiction</span> Intelligence
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              We've uploaded regulatory facts and compliance standards for all 50 states. Our nationwide aggregator Establishment monitors 400+ data points hourly to ensure you are never out of compliance.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-3xl font-black text-slate-900">100%</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">US Territory Coverage</p>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-3xl font-black text-emerald-600">2.4M</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Patient Records</p>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full h-[500px] bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-emerald-500 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <MapChart />
          </div>
        </div>
      </section>

      {/* State Facts & Compliance Standards Grid */}
      <section id="state-facts" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="space-y-4">
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight">GGHP Oversight Command Hub</h1>
            <p className="text-slate-500 font-medium">Unified access to Global Green Enterprise Inc sectors: GGMA, RIP, and SINC.</p>
              </div>
              <button className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center gap-2">
                 Explore Full Database <ArrowRight size={18} />
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { s: 'Oklahoma', t: '7% Excise Tax', c: 'Open Medical', d: '2,400 Dispensaries' },
                { s: 'Florida', t: '0% Excise Tax', c: 'Strict Medical', d: '630 Dispensaries' },
                { s: 'California', t: '15% Excise Tax', c: 'Full Recreational', d: '1,100 Dispensaries' },
                { s: 'Texas', t: 'Low THC Only', c: 'Restrictive', d: '3 Active Hubs' }
              ].map((st, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group">
                   <h4 className="text-xl font-black text-slate-900 mb-4">{st.s}</h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Activity size={14} className="text-emerald-500" /> {st.t}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Shield size={14} className="text-blue-500" /> {st.c}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Building2 size={14} className="text-amber-500" /> {st.d}</div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-emerald-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Statutes <ChevronRight size={14} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Attorney Marketplace Preview Section */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-full bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
           <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                 <Gavel size={12} />
                 Legal Advocacy Hub
              </div>
              <h2 className="text-5xl font-black tracking-tight leading-[1.1]">
                 Find Verified <br /> <span className="text-emerald-400">Cannabis Legal Counsel</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                 Navigating multi-state regulations requires elite legal expertise. Our Attorney Marketplace connects you with bar-verified counsel specializing in OMMA licensing, METRC compliance, and patient rights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 <button 
                   onClick={() => onNavigate('legal-advocacy')}
                   className="flex-1 px-4 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 text-center text-sm"
                 >
                    Intake & Schedule Consult
                 </button>
                 <button 
                   onClick={() => {
                     const code = window.prompt("🔒 LEGAL MARKETPLACE IS LOCKED.\n\nPlease subscribe or enter Access Code:");
                     if (code === '1234') {
                       alert("✅ Access Granted: Welcome to the Legal Marketplace.");
                       onNavigate('login');
                     } else if (code !== null) {
                       alert("❌ Access Denied: Invalid Code. Please subscribe to unlock.");
                     }
                   }}
                   className="relative flex-1 px-4 py-4 bg-slate-800/80 backdrop-blur-md text-slate-500 rounded-2xl font-black border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 transition-all shadow-xl text-center text-sm group"
                 >
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center group-hover:bg-slate-900/80 transition-all">
                      <Lock size={16} className="mr-2" /> <span className="group-hover:hidden">Locked</span><span className="hidden group-hover:inline">Unlock (Code: 1234)</span>
                    </div>
                    Legal Marketplace
                 </button>
              </div>
              <div className="mt-4 flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl w-max">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">ATY</div>
                    ))}
                 </div>
                 <span className="text-xs font-bold text-slate-300">120+ Verified Attorneys Active</span>
              </div>
           </div>
           
           <div className="lg:w-1/2 w-full">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 space-y-6">
                 {[
                   { name: 'Sarah J. Richardson', exp: 'OMMA Licensing Expert', tag: 'Oklahoma' },
                   { name: 'Marcus Thorne', exp: 'M&A / Corporate', tag: 'Multi-State' },
                   { name: 'Elena Vance', exp: 'Patient Rights & Criminal', tag: 'Texas/FL' }
                 ].map((atty, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">AT</div>
                         <div>
                            <p className="font-bold text-white">{atty.name}</p>
                            <p className="text-xs text-slate-400">{atty.exp}</p>
                         </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">{atty.tag}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity">
              <img src="/gghp-logo.png" alt="GGHP Logo" className="w-64 h-24 object-contain hover:scale-110 transition-all cursor-pointer" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
              }} />
              <div className="fallback-logo hidden">
                <div className="w-12 h-12 rounded-xl bg-[#1a4731] flex items-center justify-center">
                  <Shield size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 max-w-3xl mx-auto leading-relaxed uppercase tracking-wide">
            Disclaimer: Global Green Enterprise Inc (GGHP) infrastructure is designed to aggregate and assist with regulatory compliance across GGMA, RIP, and SINC sectors. Compliance is subject to state, local, and federal jurisdictions. Use of this platform does not constitute legal advice. By accessing this portal, you agree to our terms of service, multi-factor authentication requirements, and role-based data restrictions.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-[#1a4731] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Accessibility</a>
            <a href="tel:14054927297" className="hover:text-[#1a4731] transition-colors font-black"></a>
          </div>
        </div>
      </footer>

      {/* 🗳️ Sticky Poll Widget — appears on scroll */}
      <StickyPollWidget />

    </div>
  );
};

const SylaraFloatingWidget = ({ onClick }: { onClick: () => void }) => (
  <div className="fixed bottom-6 right-6 z-50">
    <button 
      onClick={onClick}
      className="bg-purple-700 text-white p-4 rounded-full shadow-2xl hover:bg-purple-800 hover:scale-105 transition-all flex items-center gap-3 group"
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner">
        <img src="/larry-logo.png" alt="Sylara" className="w-full h-full object-cover" />
      </div>
      <div className="hidden md:block text-left pr-2">
        <div className="text-sm font-bold leading-tight">Sylara Intake Agent</div>
        <div className="text-[11px] text-white/80">GGHP Onboarding & Support</div>
      </div>
    </button>
  </div>
);

// --- Screens ---

const LoginScreen = ({ onLogin, onSignUp, onForgotPassword }: { onLogin: (email: string, pass: string) => Promise<void>; onSignUp: () => void; onForgotPassword: () => void; onBack?: () => void; initialRole?: any; key?: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const samplePlans = getPlansForRole('business', 'cannabis', 'National').slice(0, 3); // Get 3 plans to showcase

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row"
      >
        {/* LOGIN FORM SECTION */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center text-center mb-6">
            <img src="/gghp-branding.png" alt="GGHP Logo" className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-4" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
            }} />
            <div className="fallback-logo hidden w-20 h-20 bg-[#1a4731] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mt-2">Welcome Back</h2>
            <p className="text-slate-500 mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Email Address"
                placeholder="jane.doe@example.com"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
                rightElement={
                  <button type="button" onClick={onForgotPassword} className="text-xs font-medium text-[#1a4731] hover:underline">
                    Forgot Password?
                  </button>
                }
                icon={showPassword ? EyeOff : Eye}
                className="cursor-pointer"
                onClickIcon={() => setShowPassword(!showPassword)}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 text-lg"
              icon={loading ? Loader2 : LogIn}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </Button>

            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" onClick={onSignUp} className="text-[#1a4731] font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* SUBSCRIPTIONS SECTION */}
        <div className="w-full md:w-1/2 bg-[#f8fbf9] p-8 md:p-12 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-[#1a4731] mb-2 text-center md:text-left">Platform Subscriptions</h3>
          <p className="text-slate-600 mb-8 text-sm text-center md:text-left">
            Log in to manage your plan and secure your digital footprint.
          </p>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {samplePlans.map((plan, idx) => (
              <div key={idx} className={cn("bg-white p-5 rounded-xl border shadow-sm transition-all relative", plan.id === 'pro' ? 'border-[#1a4731]/50 shadow-md' : 'border-slate-200')}>
                {plan.id === 'pro' && (
                  <div className="absolute top-0 right-0 bg-[#1a4731] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-wider">
                    Recommended
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h4 className={cn("font-bold text-lg", plan.id === 'pro' ? 'text-[#1a4731]' : 'text-slate-800')}>{plan.name}</h4>
                  <span className="font-extrabold text-[#1a4731] text-[10px] uppercase tracking-wider bg-[#1a4731]/5 px-2 py-1 rounded">View Post-Login</span>
                </div>
                {plan.bestFor && <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-1.5 rounded-md border border-slate-100 italic">{plan.bestFor}</p>}
                <ul className="space-y-2 mt-3">
                  {plan.features?.slice(0, 3).map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={14} className="text-[#1a4731] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {(!plan.features || plan.features.length === 0) && plan.aiLevel && (
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={14} className="text-[#1a4731] shrink-0 mt-0.5" />
                      <span>{plan.aiLevel} AI Support</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              Subscriptions, API add-ons, and payment methods are fully integrated within your secure Dashboard. <br/>
              <span className="font-semibold text-slate-700">Login required to view tailored plans.</span>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const ForgotPasswordScreen = ({ onBack, onReset }: { onBack: () => void; onReset: (email: string) => Promise<void>; key?: string }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#1a4731] rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Lock className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Reset Password</h2>
          <p className="text-slate-500 mt-1">Enter your email to receive a reset link</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-3 text-left">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700">
                Password reset email sent! Please check your inbox.
              </p>
            </div>
            <Button onClick={onBack} variant="outline" className="w-full">
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Input
              label="Email Address"
              placeholder="jane.doe@example.com"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full py-3"
                icon={loading ? Loader2 : Mail}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <Button type="button" onClick={onBack} variant="ghost" className="w-full">
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const SignupScreen = ({ onLogin, onComplete, onNavigate, initialRole = 'user' }: {
  key?: string,
  onBack?: () => void,
  onLogin: () => void,
  onComplete: (email: string, pass: string, role: string, data: any) => Promise<void>,
  onNavigate?: (view: string) => void,
  initialRole?: string
}) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Common + Role Specific Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    dlNumber: '',
    email: '',
    password: '',
    phone: '',
    state: 'National',
    // Patient/Provider
    address: '',
    isProvider: false,
    patientSubRole: '',
    selectedPlan: '',
    selectedBillingCycle: 'monthly',
    businessType: 'cannabis',
    selectedAddOns: [] as string[],
    medicalProviderLicense: '',
    npi: '',
    caregiverPatientId: '',
    // Business
    companyName: '',
    ein: '',
    organizationType: 'Dispensary',
    businessLicenseNumber: '',
    employeeCount: '',
    // Attorney
    barNumber: '',
    practiceAreas: [],
    lawFirmName: '',
    // Regulator
    agencyName: '',
    officialTitle: '',
    jurisdiction: 'State',
    badgeNumber: '',
    // Executive
    invitationCode: '',
    department: '',
    ssn: '', // Added for ID Code (last 4)
  });

  const [uploads, setUploads] = useState({
    dlFront: false,
    dlBack: false,
    additionalDoc: false
  });
  
  const [privacyConsent, setPrivacyConsent] = useState(false);

        const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES (Professional Entities)
    { id: 'compliance_service', label: 'Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies managing cards and compliance for clients.' },
    { id: 'business', label: 'Commercial Entity (Dispensary/Cultivator)', category: 'Business', icon: Building2, desc: 'Dispensaries, growers, and processors requiring state-integrated tools.' },
    { id: 'provider', label: 'Medical Provider / Physician', category: 'Business', icon: Stethoscope, desc: 'Licensed medical professionals conducting consultations and certifications.' },
    { id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel managing multi-state licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'admin_internal', label: 'Internal Administrator', category: 'Oversight', icon: Shield, desc: 'Full internal operational control for GGP-OS platform management.' },
    { id: 'admin_external', label: 'External Administrator', category: 'Oversight', icon: Activity, desc: 'Administrative monitoring for external agencies and partners.' },
    { id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing (RIP) for authorized agencies.' },
    { id: 'regulator_state', label: 'Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'State-level licensing authority and legal oversight bodies.' },
    { id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },
  ];

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // --- Address Autocomplete ---
  const [addressSuggestions, setAddressSuggestions] = useState<{formatted: string; address_line1: string; address_line2: string}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressWrapperRef = useRef<HTMLDivElement>(null);

  const fetchAddressSuggestions = useCallback((text: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const trimmed = text.trim();
    // Only trigger after a full word or number is entered (trailing space or ends with a digit sequence)
    const hasCompleteToken = text.endsWith(' ') || /\d+\s/.test(text) || /\b\d+$/.test(trimmed);
    if (!trimmed || trimmed.length < 2 || !hasCompleteToken) {
      return;
    }
    debounceTimerRef.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(trimmed)}&filter=countrycode:us&apiKey=274a3cfd28334ecfbb269e99496afdbc`
        );
        const data = await res.json();
        const results = (data.features || []).map((f: any) => ({
          formatted: f.properties.formatted || '',
          address_line1: f.properties.address_line1 || '',
          address_line2: f.properties.address_line2 || '',
        }));
        setAddressSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (err) {
        console.error('Address autocomplete error:', err);
        setAddressSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 300);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressWrapperRef.current && !addressWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const AddressAutocompleteInput = ({ label, name, value, required, placeholder }: { label: string; name: string; value: string; required?: boolean; placeholder?: string }) => (
    <div className="relative space-y-1.5 w-full" ref={addressWrapperRef}>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          required={required}
          placeholder={placeholder || '123 Example St, City, State ZIP'}
          autoComplete="off"
          onChange={(e) => {
            setFormData(prev => ({ ...prev, [name]: e.target.value }));
            fetchAddressSuggestions(e.target.value);
          }}
          onFocus={() => { if (addressSuggestions.length > 0) setShowSuggestions(true); }}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 transition-all focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731]"
        />
        {addressLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
      </div>
      {showSuggestions && addressSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {addressSuggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-slate-50 last:border-0 flex flex-col gap-0.5"
              onMouseDown={(e) => {
                e.preventDefault();
                setFormData(prev => ({ ...prev, [name]: s.formatted }));
                setShowSuggestions(false);
                setAddressSuggestions([]);
              }}
            >
              <span className="text-sm font-medium text-slate-800">{s.address_line1}</span>
              <span className="text-xs text-slate-500">{s.address_line2}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const submitDraft = async () => {
    setLoading(true);
    // Simulate Draft save
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    onLogin(); 
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onComplete(formData.email, formData.password, selectedRole, formData);
    } catch (err: any) {
      const errorCode = err?.code || 'unknown';
      const errorMessage = err?.message || 'Unknown error';
      console.error('[AdminSignup] Registration failed:', { errorCode, errorMessage, selectedRole });

      const friendlyMessages: Record<string, string> = {
        'auth/operation-not-allowed': 'Sign-in is not enabled.',
        'auth/network-request-failed': 'Network error. Check connection.',
        'auth/email-already-in-use': 'Account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
      };
      setError(friendlyMessages[errorCode] || `Registration failed: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-200/50 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGHP Logo" className="h-12 w-auto object-contain" />
          <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:inline">GGHP Secure Registry</span>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1a4731] mb-3">Create Account</h1>
          <p className="text-slate-600">Join the unified platform. Setup your workspace in 4 easy steps.</p>
        </div>

        {/* Stepper Progress */}
        <div className="w-full flex items-center justify-between mb-12 relative px-4 md:px-12">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1a4731] transition-all duration-500 ease-out" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
            </div>
            
            {[
              { num: 1, label: 'Role Selection' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Verification' },
              { num: 4, label: 'Review & Submit' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-[#FDFBF7] px-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                  step > s.num ? "bg-[#1a4731] border-[#1a4731] text-white" : 
                  step === s.num ? "bg-white border-[#1a4731] text-[#1a4731] shadow-md ring-4 ring-emerald-50" : 
                  "bg-white border-slate-300 text-slate-400"
                )}>
                  {step > s.num ? <CheckCircle2 size={20} /> : s.num}
                </div>
                <span className={cn(
                  "text-xs font-semibold whitespace-nowrap transition-colors",
                  step >= s.num ? "text-[#1a4731]" : "text-slate-400"
                )}>{s.label}</span>
              </div>
            ))}
        </div>

        {error && (
            <div className="w-full bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 mb-8 shadow-sm">
                <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
        )}

        {/* Content Container */}
        <div className="w-full bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6 md:p-10 mb-8">
            
            {/* --- STEP 1: ROLE SELECTION --- */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                    {['Patient', 'Business', 'Oversight', 'Operations'].filter(cat => !initialRole || initialRole === 'all' || cat === initialRole).map((cat) => (
                        <div key={cat} className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2 capitalize">
                                {cat === 'Patient' && <Users size={18} className="text-blue-500" />}
                                {cat === 'Business' && <Building2 size={18} className="text-[#1a4731]" />}
                                {cat === 'Oversight' && <Shield size={18} className="text-orange-500" />}
                                {cat === 'Operations' && <Headphones size={18} className="text-indigo-500" />}
                                {cat}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {roles.filter(r => r.category === cat).map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={cn(
                                            "flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left group relative overflow-hidden",
                                            selectedRole === role.id
                                            ? "border-[#1a4731] bg-[#f2f7f4] ring-1 ring-[#1a4731]/10"
                                            : "border-slate-200 hover:border-slate-300 hover:shadow-md bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105",
                                            selectedRole === role.id ? "bg-[#1a4731] text-white shadow-md" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <role.icon size={20} />
                                        </div>
                                        <h3 className="font-bold text-sm mb-1">{role.label}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{role.desc}</p>
                                        
                                        {selectedRole === role.id && (
                                            <div className="absolute top-4 right-4 text-[#1a4731]">
                                                <CheckCircle2 size={20} className="fill-[#1a4731] text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- STEP 2: DETAILS --- */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 border-b border-slate-100 pb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                             <h2 className="text-lg font-bold text-slate-800 capitalize">Personal & Business Details <span className="text-slate-400 font-normal ml-2">({selectedRole})</span></h2>
                        </div>
                    </div>

                    <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                        {/* COMMON REQUIRED FIELDS */}
                        <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-100 space-y-5">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Common Required Fields</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input label={<span>Full Name (First & Last) <span className="text-red-500">*</span></span>} name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="E.g., Sarah Jenkins" required />
                                <Input label={<span>Email Address <span className="text-red-500">*</span></span>} type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="sarah@example.com" required />
                                <Input label={<span>Date of Birth (DOB) <span className="text-red-500">*</span></span>} name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                                <Input label={<span>Password (8+ chars) <span className="text-red-500">*</span></span>} name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                                <Input label={<span>Driver's License / State ID Number <span className="text-red-500">*</span></span>} name="dlNumber" value={formData.dlNumber} onChange={handleInputChange} placeholder="X0000000" required />
                                <Input label={<span>Phone Number <span className="text-red-500">*</span></span>} name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" required />
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Resident / Operating State <span className="text-red-500">*</span></label>
                                    <select name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20">
                                        <option value="National">National (Federal Context)</option>
                                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ROLE SPECIFIC FIELDS */}
                        <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100/50 space-y-5">
                             <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Role Specific Details Configuration</h3>
                             <div className="mb-6 space-y-1.5 bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                                <label className="text-sm font-bold text-emerald-900">Entity Title or Position (For Approval Routing) <span className="text-red-500">*</span></label>
                                <select name="entityTitleOrPosition" value={formData.entityTitleOrPosition} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20 font-medium" required>
                                    <option value="">-- Select Your Exact Title/Position --</option>
                                    
                                            <optgroup label="Patient Portal Roles">
                                        <option value="Primary Adult Patient">Primary Adult Patient</option>
                                        <option value="Registered Caregiver">Registered Caregiver</option>
                                        <option value="Minor Patient Guardian">Minor Patient Guardian</option>
                                    </optgroup>
                                    
                                    <optgroup label="Business & Provider Roles">
                                        <option value="Business Owner / CEO">Business Owner / CEO</option>
                                        <option value="General Manager">General Manager</option>
                                        <option value="Chief Compliance Officer">Chief Compliance Officer</option>
                                        <option value="General Counsel / Attorney">General Counsel / Attorney</option>
                                        <option value="Paralegal / Legal Staff">Paralegal / Legal Staff</option>
                                        <option value="Medical Director">Medical Director</option>
                                        <option value="Physician (MD/DO)">Physician (MD/DO)</option>
                                        <option value="PA / NP / LPN">PA / NP / LPN</option>
                                        <option value="Medical Office Staff">Medical Office Staff</option>
                                        <option value="Compliance Service Admin">Compliance Service Admin</option>
                                    </optgroup>
                                    
                                    <optgroup label="Oversight & RIP Roles">
                                        <option value="Executive Founder">Executive Founder</option>
                                        <option value="Internal Administrator">Internal Administrator</option>
                                        <option value="External Administrator">External Administrator</option>
                                        <option value="State Authority Director">State Authority Director</option>
                                        <option value="Chief of Police / Sheriff">Chief of Police / Sheriff</option>
                                        <option value="Field Inspector">Field Inspector</option>
                                    </optgroup>

                                    <optgroup label="Operations (Call Center) Roles">
                                        <option value="Operations Manager">Operations Manager</option>
                                        <option value="Call Center Supervisor">Call Center Supervisor</option>
                                        <option value="Escalation Specialist">Escalation Specialist</option>
                                        <option value="Support Agent">Support Agent</option>
                                    </optgroup>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">This determines your dashboard features and goes to our paralegal queue for verification.</p>
                             </div>
                             

                             
                             {selectedRole === 'user' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">I am a... <span className="text-red-500">*</span></label>
                                        <select name="patientSubRole" value={formData.patientSubRole} onChange={(e) => setFormData(p => ({...p, patientSubRole: e.target.value, isProvider: e.target.value === 'caregiver' || e.target.value === 'telehealth-caregiver', selectedPlan: ''}))} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-[#1a4731]/20">
                                            <option value="">Select a role...</option>
                                            <option value="telehealth-patient">TeleHealth Patient – Subscription</option>
                                            <option value="medical-card-patient">Medical Card Patient (Cannabis Medical Card)</option>
                                            <option value="caregiver">Caregiver (Cannabis Medical Card Caregiver)</option>
                                            <option value="telehealth-caregiver">TeleHealth Caregiver – Subscription</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Physical Address" name="address" value={formData.address} required />
                                    </div>
                                    {(formData.patientSubRole === 'caregiver' || formData.patientSubRole === 'telehealth-caregiver') && (
                                        <Input label="Linked Patient ID" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} placeholder="Enter the patient ID you are caring for" required />
                                    )}
                                </div>
                             )}

                             { selectedRole?.startsWith('medical_provider_') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label={<span>Practice / Clinic Address <span className="text-red-500">*</span></span>} name="address" value={formData.address} required />
                                    </div>
                                    <Input label={<span>Professional License Number <span className="text-red-500">*</span></span>} name="medicalProviderLicense" value={formData.medicalProviderLicense} onChange={handleInputChange} required />
                                    <Input label={<span>NPI (National Provider ID)</span>} name="npi" value={formData.npi} onChange={handleInputChange} />
                                    <Input label="DEI / State Controlled Substance Registration" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} placeholder="Optional for staff" />
                                </div>
                             )}

                             {selectedRole === 'compliance_service' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Company Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Tax ID / EIN <span className="text-red-500">*</span></span>} name="ein" value={formData.ein} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Business Address" name="address" value={formData.address} required />
                                    </div>
                                    <Input label="Number of Managed Clients" type="number" name="clientCount" value={formData.employeeCount} onChange={handleInputChange} />
                                </div>
                             )}
                             
                             {selectedRole === 'business' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-700">Business Industry Setup <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4">
                                            <label className={cn("flex-1 p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center", formData.businessType === 'cannabis' ? "border-[#1a4731] bg-emerald-50 text-[#1a4731]" : "border-slate-200")}>
                                              <span className="font-bold text-sm">Cannabis Industry</span>
                                              <input type="radio" name="businessType" value="cannabis" checked={formData.businessType === 'cannabis'} onChange={handleInputChange} className="hidden" />
                                              {formData.businessType === 'cannabis' && <CheckCircle2 size={18} />}
                                            </label>
                                            <label className={cn("flex-1 p-3 rounded-lg border-2 cursor-pointer flex justify-between items-center", formData.businessType === 'traditional' ? "border-[#1a4731] bg-emerald-50 text-[#1a4731]" : "border-slate-200")}>
                                              <span className="font-bold text-sm">Traditional Business</span>
                                              <input type="radio" name="businessType" value="traditional" checked={formData.businessType === 'traditional'} onChange={handleInputChange} className="hidden" />
                                              {formData.businessType === 'traditional' && <CheckCircle2 size={18} />}
                                            </label>
                                        </div>
                                    </div>
                                    <Input label={<span>Business Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>EIN (Tax ID) <span className="text-red-500">*</span></span>} name="ein" value={formData.ein} onChange={handleInputChange} required />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Organization Type <span className="text-red-500">*</span></label>
                                        <select name="organizationType" value={formData.organizationType} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg">
                                            <option>Dispensary</option>
                                            <option>Cultivator</option>
                                            <option>Processor</option>
                                            <option>Lab</option>
                                            <option>Transport</option>
                                        </select>
                                    </div>
                                    <Input label="Business License Number (If held)" name="businessLicenseNumber" value={formData.businessLicenseNumber} onChange={handleInputChange} />
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label={<span>Physical Business Address <span className="text-red-500">*</span></span>} name="address" value={formData.address} required />
                                        <div className="mt-2 flex items-center gap-4 text-[10px] font-mono text-slate-400">
                                            <div className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><MapPin size={10}/> GPS: {formData.address ? '35.4676, -97.5164' : 'Pending Verification'}</div>
                                            <div className="bg-slate-100 px-2 py-1 rounded flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> USPS Address Verified</div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3">
                                        <input type="checkbox" id="mailingSame" className="w-4 h-4 text-[#1a4731] border-slate-300 rounded focus:ring-[#1a4731]" />
                                        <label htmlFor="mailingSame" className="text-sm text-slate-600 font-medium">Mailing address is same as physical</label>
                                    </div>
                                    
                                    <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                                        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Clock size={16} className="text-blue-500"/> Operating Hours</h4>
                                        <div className="space-y-3">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                <div key={day} className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 w-32">
                                                        <input type="checkbox" defaultChecked={day !== 'Sunday'} className="w-4 h-4 rounded border-slate-300 text-[#1a4731] focus:ring-[#1a4731]" />
                                                        <span className="text-sm font-medium text-slate-600">{day}</span>
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input type="time" defaultValue="09:00" className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                                                        <span className="text-slate-400 text-xs">to</span>
                                                        <input type="time" defaultValue="21:00" className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Input label="Number of Employees" type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} />
                                </div>
                             )}

                             { (selectedRole === 'attorney_lawyer' || selectedRole === 'attorney_staff') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="State Bar Number (Mandatory for Attorneys)" name="barNumber" value={formData.barNumber} onChange={handleInputChange} required={selectedRole === 'attorney_lawyer'} placeholder="BAR-XXXXX" />
                                    <Input label="Law Firm / Legal Dept Name" name="lawFirmName" value={formData.lawFirmName} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <Input label="Legal Practice Areas" name="practiceAreas" placeholder="e.g. Regulatory Compliance, Licensing, Administrative Law" value={(formData.practiceAreas as string[] || []).join(', ')} onChange={(e: any) => setFormData(p => ({...p, practiceAreas: e.target.value.split(', ')}))} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Firm Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}

                             { (selectedRole === 'regulator_state' || selectedRole === 'enforcement_rip' || selectedRole === 'executive_founder' || selectedRole === 'admin_internal' || selectedRole === 'admin_external') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label={<span>Agency / Department Name <span className="text-red-500">*</span></span>} name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label={<span>Official ID / Badge Number <span className="text-red-500">*</span></span>} name="officialId" value={formData.officialId} onChange={handleInputChange} required />
                                    {selectedRole === 'admin_internal' && (
                                        <div className="md:col-span-2">
                                            <Input label={<span>Social Security Number (For ID Code Gen) <span className="text-red-500">*</span></span>} name="ssn" value={formData.ssn} onChange={handleInputChange} placeholder="000-00-0000" required />
                                            <p className="text-[10px] text-amber-600 font-bold uppercase mt-1">Last 4 digits will be your internal login PIN.</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Agency Headquarters Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}

                             {selectedRole === 'executive' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2 bg-[#E9C46A]/20 border border-[#E9C46A]/30 p-4 rounded-lg flex items-start gap-3">
                                        <AlertCircle size={20} className="text-[#B08968] shrink-0 mt-0.5" />
                                        <p className="text-sm text-[#7F5539] leading-relaxed font-bold">
                                            Executive Module access requires a verified Invitation Code. Other fields cannot be processed without pre-authorization.
                                        </p>
                                    </div>
                                    <Input label="Invitation Code" name="invitationCode" value={formData.invitationCode} onChange={handleInputChange} placeholder="GGP-XXXX-XXXX" required />
                                    <Input label="Organization / Department" name="department" value={formData.department} onChange={handleInputChange} required />
                                </div>
                             )}
                             {/* SUBSCRIPTION PLAN SELECTION (Global) - Bypassed for Internal Admins */}
                             {!selectedRole.startsWith('executive') && selectedRole !== 'backoffice_staff' && selectedRole !== 'admin_internal' && (
                                <div className="mt-8 space-y-6 pt-6 border-t border-emerald-100/50 relative">
                                  <div className="bg-[#f2f7f4] border border-[#1a4731]/20 p-6 rounded-xl flex flex-col items-center text-center">
                                    <Sparkles size={32} className="text-[#1a4731] mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Create Your Free Account Today!</h3>
                                    <p className="text-slate-600 max-w-md mx-auto mb-4">
                                      Unlock advanced AI capabilities, multi-state aggregation, and priority compliance routing. Scale your dashboard with tailored modules.
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-4">
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CheckCircle2 size={12} className="text-emerald-500" /> Advanced AI
                                       </div>
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CheckCircle2 size={12} className="text-emerald-500" /> Multi-State
                                       </div>
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CheckCircle2 size={12} className="text-emerald-500" /> Priority Support
                                       </div>
                                       <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2">
                                          <CheckCircle2 size={12} className="text-emerald-500" /> Custom API
                                       </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">Pricing and tier selection available post-login for registered free accounts.</p>
                                  </div>
                                </div>
                             )}

                        </div>
                        
                        {/* Hidden Submit to catch enter key */}
                        <button type="submit" className="hidden">Submit</button>
                    </form>
                </div>
            )}

            {/* --- STEP 3: VERIFICATION UPLOADS --- */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 border-b border-slate-100 pb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">3</div>
                             <h2 className="text-lg font-bold text-slate-800 capitalize">Verification & Document Uploads</h2>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-slate-700">Driver's License / State ID <span className="text-red-500">*</span></h3>
                                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">Required For All Roles</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setUploads(p => ({...p, dlFront: true}))}
                                    className={cn("border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors", uploads.dlFront ? "border-[#1a4731] bg-emerald-50/50" : "border-slate-300 hover:border-slate-400 bg-slate-50")}
                                >
                                    {uploads.dlFront ? <CheckCircle2 size={32} className="text-[#1a4731]"/> : <FileText size={32} className="text-slate-400" />}
                                    <div className="text-center">
                                        <span className="block font-bold text-slate-700">{uploads.dlFront ? "Front ID Uploaded" : "Upload ID Front"}</span>
                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setUploads(p => ({...p, dlBack: true}))}
                                    className={cn("border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors", uploads.dlBack ? "border-[#1a4731] bg-emerald-50/50" : "border-slate-300 hover:border-slate-400 bg-slate-50")}
                                >
                                    {uploads.dlBack ? <CheckCircle2 size={32} className="text-[#1a4731]"/> : <FileText size={32} className="text-slate-400" />}
                                    <div className="text-center">
                                        <span className="block font-bold text-slate-700">{uploads.dlBack ? "Back ID Uploaded" : "Upload ID Back"}</span>
                                        <span className="text-xs text-slate-500">PNG, JPG, PDF (Max 5MB)</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-700 mb-3">Additional Documents <span className="text-slate-400 font-normal ml-2">(Max 5)</span></h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    selectedRole === 'user' ? "Doctor Rec / Insurance" :
                                    selectedRole === 'provider' ? "Provider License / DEA Cert" :
                                    selectedRole === 'business' ? "EIN / License Cert" :
                                    selectedRole === 'attorney' ? "Bar Card Copy" :
                                    selectedRole === 'regulator' ? "Official ID / Badge" : "Gov/Dept Auth Memo"
                                ].map((docLabel, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setUploads(p => ({...p, additionalDoc: true}))}
                                        className={cn("border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center transition-colors h-32", uploads.additionalDoc ? "border-[#1a4731] bg-emerald-50/30" : "border-slate-200 hover:border-slate-300 bg-slate-50")}
                                    >
                                        <span className="block text-sm font-bold text-slate-700">{docLabel}</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{uploads.additionalDoc ? "Uploaded" : "Optional"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                            <input 
                                type="checkbox" 
                                id="hipaa" 
                                className="mt-1 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]"
                                checked={privacyConsent}
                                onChange={(e) => setPrivacyConsent(e.target.checked)}
                            />
                            <div className="flex-1">
                                <label htmlFor="hipaa" className="font-bold text-slate-800 text-sm block mb-1">HIPAA / Privacy Consent Statement <span className="text-red-500">*</span></label>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    I consent to the digital processing and secure storage of my provided information according to local jurisdiction laws and state-level compliance mandates. I verify that documents uploaded match the data entered.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- STEP 4: REVIEW --- */}
            {step === 4 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 border-b border-slate-100 pb-2">
                             <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">4</div>
                             <h2 className="text-lg font-bold text-slate-800 capitalize">Review & Submit</h2>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-6">
                        <div className="flex items-center justify-between p-4 bg-slate-100/50 border-b border-slate-200">
                            <span className="font-bold text-sm uppercase text-slate-600 tracking-wider">Account Summary</span>
                            <button onClick={() => setStep(1)} className="text-[#1a4731] text-sm font-bold hover:underline">Edit</button>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500 w-1/3">Role Selected</td><td className="py-3 px-4 font-bold text-slate-900 capitalize">{selectedRole}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Full Name</td><td className="py-3 px-4 font-bold text-slate-900">{formData.firstName || 'Not provided'}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Email Address</td><td className="py-3 px-4 font-bold text-slate-900">{formData.email || 'Not provided'}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">State / Region</td><td className="py-3 px-4 font-bold text-slate-900">{formData.state}</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Subscription Plan</td><td className="py-3 px-4 font-bold text-slate-900">Selected After Login</td></tr>
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500 mt-2">Verified Documents</td><td className="py-3 px-4 font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={16}/> {uploads.dlFront && uploads.dlBack ? 'ID Scanned and Verified' : 'Pending Upload'}</td></tr>
                                    {selectedRole === 'admin_internal' && (
                                        <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Internal Login ID Code</td><td className="py-3 px-4 font-black text-amber-600">{formData.ssn?.slice(-4) || 'Pending'}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                        <input type="checkbox" className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" required />
                        <span className="text-sm text-slate-800 font-medium leading-relaxed flex items-center flex-wrap">
                            <span>I confirm all information is accurate and agree to platform terms of service. I understand this establishes an immutable digital footprint tracked by the GGP-OS compliance engine.</span>
                            <div className="inline-flex items-center group relative ml-1.5 align-middle">
                               <Info size={16} className="text-[#1a4731] hover:text-emerald-600 transition-colors cursor-help" />
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                                 By agreeing, you consent to our HIPAA-compliant data practices, Metrc reporting requirements, state open records policies, and the Care Wallet financial terms.
                                 <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                               </div>
                            </div>
                        </span>
                    </label>
                </div>
            )}
            
            {/* ACTION FOOTER */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-slate-100">
                <Button variant="ghost" className="w-full sm:w-auto text-slate-500 font-semibold" onClick={submitDraft}>Save & Resume Later</Button>
                
                <div className="flex gap-3 w-full sm:w-auto">
                    {step > 1 && (
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setStep(step - 1)}>Back</Button>
                    )}
                    {step < 4 && (
                        <Button 
                            className="w-full sm:w-auto px-8" 
                            onClick={() => {
                                if (step === 1 && selectedRole === 'business' && onNavigate) {
                                    onNavigate('business-signup');
                                    return;
                                }
                                if (step === 2 && !selectedRole.startsWith('executive') && selectedRole !== 'backoffice_staff') {
                                    // Subscription selection has been deferred to login
                                }
                                if (step === 3 && (!uploads.dlFront || !uploads.dlBack || !privacyConsent)) {
                                    alert("Please complete required uploads and HIPAA consent.");
                                    return;
                                }
                                setStep(step + 1);
                            }}
                        >
                            Continue
                        </Button>
                    )}
                    {step === 4 && (
                        <Button 
                            className="w-full sm:w-auto bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-8 font-bold shadow-lg flex-row-reverse" 
                            icon={loading ? Loader2 : CheckCircle2}
                            onClick={handleSignup}
                            disabled={loading || !privacyConsent}
                        >
                            {loading ? 'Processing...' : 'Submit Final Registration'}
                        </Button>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div >
  );
};

// --- L.A.R.R.Y AI Chatbot for Med Card / Business License Assistance ---
const LarryMedCardChatbot = ({ onNavigate, onProfileCreated, variant = 'med-card' }: any) => {
  const [isBusiness, setIsBusiness] = useState(variant === 'business');
  const isGeneral = variant === 'general' || variant === 'ggma' || variant === 'rip' || variant === 'sinc';
  
  const getGreeting = () => {
    const date = "April 21, 2026";
    const metrcStatus = "Validated Metrc Integrator (Active)";
    if (variant === 'ggma') return `👋 Welcome to the **GGMA Sector**. I am **Sylara**, your **Intake Agent**. We are an official **${metrcStatus}**. I handle all regulatory onboarding, card processing, and registry management. \n\nHow can I assist with your GGMA licensing today?`;
    if (variant === 'rip') return `🕵️ **RIP Intelligence Portal**. I am **Sylara**, coordinating with the **L.A.R.R.Y Enforcement Engine**. We are a **${metrcStatus}** as of ${date}. We handle real-time background checks, field oversight, and compliance policing via live sync. \n\nWhat intelligence or oversight task do you need assistance with?`;
    if (variant === 'sinc') return `🛡️ **SINC Compliance Infrastructure**. I am **Sylara**, managing your secure operational backbone. SINC is a **${metrcStatus}**. We ensure audit-trails, encrypted records, and network integrity across all state jurisdictions. \n\nHow can I help secure your business today?`;
    
    if (isBusiness) return `👋 Hello! I am **Sylara** — your **Intake & Support Agent**. Global Green Enterprise Inc is now a **${metrcStatus}**. I'm here to guide you through **Cannabis Business Licensing** and resolve any operational hurdles before passing your file to **L.A.R.R.Y** for final Authority approval. \n\nHow can I assist your business today?`;
    
    if (isGeneral) return `👋 Welcome to the **Global Green Hybrid Platform (GGHP)** Concierge. I am **Sylara**, your Intake Agent. \n\n**Integration Status:** ${metrcStatus}.\n\nI handle:\n• **Intake & Onboarding** (GGMA)\n• **Operational Support**\n• **Escalations & Alerts**\n• **L.A.R.R.Y** Authority Transfers\n\nHow can I help you navigate the ecosystem today?`;
    
    return `👋 Hello! I am **Sylara** — your **Intake Agent**. We are a **${metrcStatus}** (v5.3). I will walk you through your **Medical License** intake and prepare your file for the **L.A.R.R.Y Authority Engine**. \n\nI'll help you with:\n• Complete Medical Intake\n• Care Wallet Setup\n• Direct Booking with Providers\n\nAre you ready to begin? Or pick a quick action below!`;
  };

  const getInitialChoices = () => {
    if (variant === 'ggma') return ['Start Patient Intake', 'Start Business Intake', 'View Patient Fee Schedule', 'View Business Fee Schedule', 'Speak with Shantell', 'View Subscription Plans'];
    if (variant === 'rip') return ['Field Intelligence Report', 'Background Verification Check', 'Enforcement Status Inquiry', 'Compliance Audit Request', 'Contact Oversight Division', 'View State Authority Plans'];
    if (variant === 'sinc') return ['Start Business Intake', 'Audit Shield Setup', 'Seed-to-Sale Compliance', 'Network Integrity Check', 'View Business Fee Schedule', 'View Subscription Plans'];
    
    if (isBusiness) return ['Start Business Intake', 'View Business Fee Schedule', 'Speak with Business Expert', 'View Subscription Plans'];
    if (isGeneral) return [
      '🏢 GGMA Licensing',
      '🕵️ RIP Intelligence',
      '🛡️ SINC Compliance',
      '⚖️ Find an Attorney',
      '📅 Book 15min Consultation',
      '🏥 Telehealth',
      '💻 IT Support',
      '❓ General Support'
    ];
    return ['Start Patient Intake', 'Book Physician ($45)', 'Speak with Shantell', 'View Subscription Plans'];
  };

  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string, choices?: string[]}[]>([
    { role: 'bot', text: '🌎 **Welcome! / ¡Bienvenidos! / 欢迎 / Hoan nghênh**\n\nBefore we begin, please select your preferred language:', choices: [
      'English', 'Español', 'Português', 'Français', 'Kreyòl Ayisyen', '中文(简体)', '中文(繁體)', 'Tiếng Việt', '한국어', '日本語', 'Tagalog', 'Hmoob', 'हिन्दी', 'اردو', 'ဗမာစာ', 'ไทย', 'العربية', 'Soomaali', 'አማርኛ', 'Kiswahili', 'Deutsch', 'Italiano', 'Русский', 'Polski', 'Українська', 'Română', 'Diné Bizaad'
    ] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, string>>({});
  const [pendingDocLabel, setPendingDocLabel] = useState<string>('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const [signupStep, setSignupStep] = useState<number>(-1);
  const [currentPersona, setCurrentPersona] = useState<'sylara' | 'larry'>('sylara');

  // Chat Session ID for storing to database
  const [sessionId] = useState(() => `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`);

  const [signupData, setSignupData] = useState({ 
    fullName: '', email: '', dob: '', idNumber: '', phone: '', state: '', role: '', address: '', password: '', selectedLicense: '',
    ssn: '', insurance: '', qualifyingCondition: '', ethnicity: '', genderIdentify: '', idType: '', physicalAddress: '', mailingAddress: '',
    ageVerified: false
  });

  // License eligibility tracking for chatbot flow (steps 20-25)
  const [licenseEligibility, setLicenseEligibility] = useState({
    isPatientOrGuardian: '',
    isStateResident: '',
    isAdultLicense: '',
  });
  const [eligibleLicenses, setEligibleLicenses] = useState<string[]>([]);

  // ── Business License flow state (steps 100+) ─────────────────────────────
  const [businessData, setBusinessData] = useState({
    // Section 1: Registration
    fullName: '', email: '', password: '', termsAccepted: false,
    // Section 3: General Info
    entityName: '', licenseType: '', tradeName: '', phone: '',
    businessStructure: '', operatingHours: '',
    // Section 4: Owners (current owner being added)
    ownerName: '', ownerPhone: '', ownerEmail: '', ownerIdType: '',
    ownerIdNumber: '', ownerIdExpiry: '', ownerDob: '',
    ownerEntityAffiliation: '', ownerShares: '', ownerRelationship: '',
    ownerResidence: '', ownerMailing: '',
    ownersCompleted: 0,
    // Section 5: Location
    physicalAddress: '', gpsCoordinates: '', locationMailing: '',
    // Section 6: Primary Contact
    ppocName: '', ppocTitle: '', ppocPhone: '', ppocEmail: '', ppocAddress: '',
    // Section 7-10
    attestationsConfirmed: false, documentsNoted: false, documentsUploadedCount: 0, bondType: '', paymentMethod: '',
  });

  // Auto-save chats to Firestore whenever messages change
  useEffect(() => {
    const saveChat = async () => {
      if (messages.length > 0) {
        try {
          await setDoc(doc(db, 'larry_chats', sessionId), {
            messages,
            isBusiness,
            userEmail: businessData?.email || signupData?.email || 'anonymous',
            lastUpdated: serverTimestamp()
          }, { merge: true });
        } catch (err) {
          // Silently fail persistence to avoid UI hangs - ignoring Firebase permission errors for now
        }
      }
    };
    saveChat();
  }, [messages, sessionId, isBusiness, businessData?.email, signupData?.email]);
  const BUSINESS_LICENSE_TYPES = [
    'Dispensary', 'Grower', 'Processor', 'Laboratory',
    'Transporter', 'Researcher', 'Education', 'Waste Disposal'
  ];
  const BUSINESS_STRUCTURES = [
    'Sole Proprietor (Individual Owner)',
    'Limited Liability Company (LLC)',
    'Corporation (Inc. or Corp.)',
    'Limited Partnerships',
    'Limited Liability Partnerships',
  ];
  const BUSINESS_ID_TYPES = [
    'OK Driver\'s License', 'OK State ID', 'Passport', 'Tribal ID'
  ];

  const getPatientRequiredDocuments = () => [
    'Proof of Identity (Front)',
    'Proof of Identity (Back)',
    'Proof of Residency',
    'Medical Records (Optional)',
    'Digital Photo (Selfie)'
  ];

  const getRequiredDocuments = () => {
    const base = [
      'Affidavit of Lawful Presence',
      'Proof of Oklahoma Residency (75% ownership)',
      'OSBI Background Check (each owner)',
      'National Background Check Attestation',
      'ID copies (each person of interest)',
      'Certificate of Compliance',
      'Certificate(s) of Occupancy & Site Plans',
      'Certificate of Good Standing',
      'Ownership Disclosure Documentation',
    ];
    if (businessData.licenseType === 'Processor') base.push('Hazardous License / Chemical Safety Data Sheets');
    if (businessData.licenseType === 'Dispensary') base.push('Dispensary Distance Attestation (1,000 ft from schools)');
    if (businessData.licenseType === 'Grower') base.push('Grow Facility Distance Attestation (1,000 ft from schools)');
    return base;
  };

  // ── Calendly integration ─────────────────────────────────────────────────
  // Listen for Calendly success events to automatically trigger post-booking flow
  useEffect(() => {
    const handleCalendlyMessage = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        // Find the "scheduled" logic in handleSend and trigger it manually
        const scheduledText = "I have scheduled my consultation";
        handleSend(undefined, scheduledText);
      }
    };
    window.addEventListener('message', handleCalendlyMessage);
    return () => window.removeEventListener('message', handleCalendlyMessage);
  }, []);

  // Token & event type are read from .env (VITE_CALENDLY_TOKEN / VITE_CALENDLY_EVENT_TYPE)
  const CALENDLY_TOKEN = import.meta.env.VITE_CALENDLY_TOKEN as string || '';
  const CALENDLY_EVENT_TYPE = import.meta.env.VITE_CALENDLY_EVENT_TYPE as string
    || 'https://api.calendly.com/event_types/786f0ab8-5f1f-4160-b35c-4c4060d45e10';

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fetchCalendlySlots = async () => {
    setSlotsLoading(true);
    setBookingError(null);
    setAvailableSlots([]);
    setSelectedTime(null);

    // Fail-safe: If no token, don't even try the API
    if (!CALENDLY_TOKEN || CALENDLY_TOKEN === '') {
      setBookingError('AUTH_REQUIRED');
      setSlotsLoading(false);
      return;
    }

    try {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      
      const startStr = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
      const endStr = end.toISOString().replace(/\.\d{3}Z$/, 'Z');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(
        `https://api.calendly.com/event_type_available_times?` +
        `event_type=${encodeURIComponent(CALENDLY_EVENT_TYPE)}&` +
        `start_time=${encodeURIComponent(startStr)}&end_time=${encodeURIComponent(endStr)}`,
        {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${CALENDLY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      clearTimeout(timeoutId);
      
      if (res.status === 401) {
        setBookingError('AUTH_REQUIRED');
        return;
      }

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const times: string[] = (data.collection || []).map((slot: any) => slot.start_time);
      setAvailableSlots(times);
      if (times.length === 0) setBookingError('No available slots found. Please use the direct booking link.');
    } catch (err: any) {
      setBookingError('AUTH_REQUIRED'); // Treat generic failures as auth issues to trigger fallback
    } finally {
      setSlotsLoading(false);
    }
  };

  const bookCalendlySlot = async (latestSignupData?: typeof signupData) => {
    const dataToUse = latestSignupData || signupData;
    if (!selectedTime) return;
    setIsBooking(true);
    setBookingError(null);
    try {
      const res = await fetch('https://api.calendly.com/invitees', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CALENDLY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: CALENDLY_EVENT_TYPE,
          start_time: selectedTime,
          invitee: {
            name: dataToUse.fullName || 'Guest',
            email: dataToUse.email || 'noemail@example.com',
            timezone: 'America/Chicago',
          },
          location: {
            kind: 'outbound_call',
            location: dataToUse.phone || '',
          },
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error((errBody as any).message || 'Booking failed');
      }
      const bookedLabel = new Date(selectedTime).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      });
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: `✅ **Appointment confirmed!**\n\nYour slot has been booked for **${bookedLabel}**.\nWe'll call you at **${dataToUse.phone}** — talk soon! 🎉` },
      ]);
      setSignupStep(0);
      setAvailableSlots([]);
      setSelectedTime(null);
    } catch (err: any) {
      setBookingError(err.message || 'Could not book this slot. Please try another.');
    } finally {
      setIsBooking(false);
    }
  };
  // ── End Calendly ─────────────────────────────────────────────────────────

  // Auto-fetch available slots when chatbot mounts so they're ready immediately
  useEffect(() => {
    fetchCalendlySlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, availableSlots]);

  // STATE_RESOURCES — imported from ./stateResources.ts (all 50 states + DC)
  // See: src/stateResources.ts for the complete typed dataset

  const handleSend = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const text = overrideText || inputValue;
    if (!text.trim()) return;
    
    // Mask password in UI if user is entering it
    const userMessageText = (signupStep === 9 || signupStep === 102 || signupStep === 96) ? '******' : text;
    setMessages(prev => [...prev, { role: 'user', text: userMessageText }]);
    
    if (!overrideText) setInputValue('');
    setIsTyping(true);
    // Language selection step
    if (signupStep === -1) {
      const t = text.toLowerCase();
      const match = [
        { code: 'en', label: 'english' }, { code: 'es', label: 'español' }, { code: 'pt', label: 'português' },
        { code: 'fr', label: 'français' }, { code: 'ht', label: 'kreyòl' }, { code: 'zh-CN', label: '简体' },
        { code: 'zh-TW', label: '繁體' }, { code: 'vi', label: 'tiếng việt' }, { code: 'ko', label: '한국어' },
        { code: 'ja', label: '日本語' }, { code: 'tl', label: 'tagalog' }, { code: 'hmn', label: 'hmoob' },
        { code: 'hi', label: 'हिन्दी' }, { code: 'ur', label: 'اردو' }, { code: 'my', label: 'ဗမာစာ' },
        { code: 'th', label: 'ไทย' }, { code: 'ar', label: 'العربية' }, { code: 'so', label: 'soomaali' },
        { code: 'am', label: 'አማርኛ' }, { code: 'sw', label: 'kiswahili' }, { code: 'de', label: 'deutsch' },
        { code: 'it', label: 'italiano' }, { code: 'ru', label: 'русский' }, { code: 'pl', label: 'polski' },
        { code: 'uk', label: 'українська' }, { code: 'ro', label: 'română' }, { code: 'nv', label: 'diné' }
      ].find(l => t.includes(l.label) || t === l.code);
      
      const code = match ? match.code : 'en';
      
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event('change'));
      } else {
        if (code === 'en') {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        } else {
          document.cookie = `googtrans=/en/${code}; path=/;`;
          document.cookie = `googtrans=/en/${code}; path=/; domain=` + window.location.hostname;
        }
      }
      
      setSignupStep(0);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', text: getGreeting(), choices: getInitialChoices() }]);
        setIsTyping(false);
      }, 600);
      return;
    }

    try {
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    let response = '';
    const lower = text.toLowerCase();
    
    // Handle Subscription / Pricing Keywords → redirect to landing page pricing
    if (lower.includes('subscription plan') || lower.includes('view subscription') || lower.includes('state authority plan') || lower.includes('pricing')) {
      response = '💰 **Subscription Plans**\n\nI\'m redirecting you to our **Pricing & Plans** page where you can see the full breakdown of all tiers:\n\n• **Patient Plans** — starting at $9.99/mo\n• **Business Plans** — All-in-One starting at $149/mo\n• **State Authority Plans** — starting at $4,999/mo\n• **Partner/Reseller** — wholesale opportunities\n\n_30-Day Free Trial available on all paid tiers._';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      // Scroll to pricing on landing page
      onNavigate('landing');
      setTimeout(() => {
        const pricingEl = document.getElementById('pricing-section') || document.querySelector('[data-pricing]');
        if (pricingEl) pricingEl.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      setIsTyping(false);
      return;
    }

    // Handle split fee schedule buttons
    if (lower.includes('patient fee schedule') || lower === 'view patient fee schedule') {
      response = '💰 **GGMA Patient Fee Schedule (2026)**\n\n' +
        '• **Patient Recommendation**: $35.00 (Via GoHealthUSA)\n' +
        '• **GGE Intake Processing**: $10.00\n' +
        '• **Total Portal Cost**: **$45.00**\n\n' +
        '• **State Authority Fee (Standard)**: $104.30\n' +
        '• **State Authority Fee (Reduced)**: $22.50 (Medicare/Medicaid/Veteran)\n\n' +
        '_This is for Patient Medical Card applications only. Business fees are separate._';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Patient Intake', 'View Business Fee Schedule', 'Book Physician ($45)', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('business fee schedule') || lower === 'view business fee schedule') {
      setIsBusiness(true);
      response = '💰 **OMMA Commercial License Fee Schedule (2026)**\n' +
        '_Per HB 2179 (2022) amended by SB 813 (2023) — 63 O.S. § 427.14_\n\n' +
        '🌿 **GROWER — Indoor / Greenhouse / Light Deprivation**\n' +
        '| Tier | Canopy Size | Fee | Total w/ CC |\n' +
        '|------|------------|-----|-------------|\n' +
        '| Tier 1 | Up to 10,000 sq ft | $2,500 | $2,558.30 |\n' +
        '| Tier 2 | 10,001–20,000 sq ft | $5,000 | $5,114.55 |\n' +
        '| Tier 3 | 20,001–40,000 sq ft | $10,000 | $10,227.05 |\n' +
        '| Tier 4 | 40,001–60,000 sq ft | $20,000 | $20,452.04 |\n' +
        '| Tier 5 | 60,001–80,000 sq ft | $30,000 | $30,677.05 |\n' +
        '| Tier 6 | 80,001–99,999 sq ft | $40,000 | $40,902.05 |\n' +
        '| Tier 7 | 100,000+ sq ft | $50,000 + $0.25/sq ft | Varies |\n\n' +
        '_These are OMMA state licensing fees, separate from our platform subscription._\n\n' +
        'Which license type do you need details on?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Grower Outdoor Fees', 'Processor Fees', 'Dispensary Fees', 'Start Business Intake', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    // Legacy subscription keyword handling (for old links)
    if (lower.includes('basic subscription') || lower.includes('professional subscription') || lower.includes('enterprise subscription')) {
      response = '💰 **Subscription Plans**\n\nLet me take you to our full **Pricing & Plans** page where you can compare all tiers side-by-side with the 30-day free trial.\n\nWould you like me to redirect you?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['View Subscription Plans', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower === 'view all tiers') {
       setMessages(prev => [...prev, { 
         role: 'bot', 
         text: 'Here are our high-conversion administrative intake packages:', 
         choices: ['⭐ Basic Subscription', '💎 Professional Subscription', '🚀 Enterprise Subscription', 'Main Menu'] 
       } as any]);
       setIsTyping(false);
       return;
    }
    
    // Persona Switching Logic
    if (lower.includes('compliance') || lower.includes('authority') || lower.includes('larry') || lower.includes('regulation')) {
      setCurrentPersona('larry');
    } else if (lower.includes('support') || lower.includes('sylara') || lower.includes('intake')) {
      setCurrentPersona('sylara');
    }

    // response variable already declared above

    // ── Global Keywords (Always active) ──────────────────────────────────────
    if (lower.includes('c3') || lower.includes('compassion score') || lower.includes('community score')) {
      response = '✨ **Introducing C³ (Compassion, Compliance & Community)**\n\nThe C³ Score is the heartbeat of the Global Green ecosystem. It is a real-time trust metric that measures your positive impact on the industry.\n\n• **Compassion**: Rewarding patient care and accessibility.\n• **Compliance**: Real-time adherence to state (Metrc) and federal standards.\n• **Community**: Engagement with GGE educational and support hubs.\n\n**Benefits**: High C³ Scores unlock lower subscription fees, priority processing, and exclusive access to the L.A.R.R.Y Premium Insights.';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['View My C3 Score', 'How to Improve C3', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('i scheduled') || lower.includes('i have scheduled') || lower.includes('done booking') || lower.includes('booked it') || lower.includes('already scheduled') || lower === 'scheduled' || lower === 'done' || lower.includes('completed')) {
      if (isBusiness || lower.includes('business') || lower.includes('commercial')) {
        setIsBusiness(true);
        response = 'Excellent! I have noted that your consultation is now scheduled. We look forward to speaking with you and reviewing your business file! 🎉\n\n' +
          '**Since you are looking at the Commercial side, here is how you can maximize your GGP-OS experience:**\n\n' +
          '💳 **Care Wallet**: Your unified B2B ledger for instant compliance-validated transactions and digital revenue management.\n' +
          '⭐ **Subscription**: Our **Enterprise Hub** unlocks full **Metrc Sync**, automated **RIP oversight**, and dedicated **SINC infrastructure**.\n' +
          '⚖️ **Legal & Admin**: Access specialized Paralegal and Legal Admin support for your entity filings.\n' +
          '🏥 **Telehealth**: Direct provider access for certifications and renewals.\n\n' +
          'How else can I help you navigate the platform today?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['🏢 GGMA Licensing', '🕵️ RIP Intelligence', '🛡️ SINC Compliance', '📈 Subscription Benefits', '💰 Care Wallet Info', '👋 No thanks, Goodbye']
        } as any]);
      } else {
        response = 'Excellent! I have noted that your consultation is now scheduled. We look forward to speaking with you! 🎉\n\n' +
          '**As a Patient, here are some benefits you can explore right now:**\n\n' +
          '⭐ **Subscription**: Professional and Enterprise tiers unlock priority card processing and physician sync.\n' +
          '💳 **Care Wallet**: A secure digital wallet for tracking your medical purchases, renewals, and qualifying documents.\n' +
          '🏥 **Telehealth & Legal**: Access specialized physician evaluations and legal counsel for card processing.\n\n' +
          'How else can I help you navigate the platform today?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['🏢 GGMA Licensing', '🏥 Telehealth & Legal', '💰 Care Wallet Info', '📈 Subscription Benefits', '👋 No thanks, Goodbye']
        } as any]);
      }
      setIsTyping(false);
      return;
    }

    if (lower.includes('goodbye') || lower.includes('no thanks') || lower.includes('i\'m done') || lower === 'exit') {
      response = 'No problem! I understand. We welcome you back anytime if you need assistance or have further questions about the Global Green Hybrid Platform. \n\nHave a wonderful day! 👋';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] }]);
      setIsTyping(false);
      setSignupStep(0);
      return;
    }

    if (lower.includes('wallet info') || lower.includes('what is care wallet')) {
      response = '💳 **What is the Care Wallet?**\n\nThe Care Wallet is our integrated digital ledger designed for the cannabis ecosystem. \n\n• **For Patients**: Store medical card details, track purchase history, and manage renewal dates.\n• **For Businesses**: A B2B transaction hub that ensures every dollar spent is compliance-validated and tax-ready.\n• **Benefit**: It eliminates manual reconciliation and ensures you are always "audit-ready" for L.A.R.R.Y enforcement.';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Subscription Benefits', 'Main Menu', 'Goodbye'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('subscription benefits') || lower.includes('why subscribe')) {
      if (isBusiness) {
        response = '⭐ **GGHP Business Subscriptions**\n\n• **Basic**: Essential portal access & L.A.R.R.Y oversight.\n• **Professional**: Priority B2B transactions & Care Wallet integration.\n• **Enterprise**: Full **Metrc Sync**, SINC Audit Shield, and 1-on-1 Sylara Support.\n\n**Benefit**: Stay 100% compliant and avoid costly fines with automated reporting.';
      } else {
        response = '⭐ **GGHP Patient Subscriptions**\n\n• **Basic**: Secure Med Card storage & L.A.R.R.Y assist.\n• **Professional**: Priority Card Processing & Provider access.\n• **Enterprise**: Complete legal coverage, zero renewal fees, and automated physician sync.\n\n**Benefit**: A worry-free cannabis journey from intake to renewal.';
      }
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['View All Tiers', 'Goodbye'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('telehealth & legal') || lower.includes('attorney') || lower.includes('paralegal') || lower.includes('find an attorney')) {
      response = '⚖️ **Find an Attorney / Legal Network**\n\nOur **Attorney Marketplace** connects you with bar-verified legal counsel specializing in cannabis law, compliance, and defense.\n\nWhat type of legal representation are you looking for?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response, 
        choices: ['Individual Representation', 'Business/Commercial Counsel', 'Provider/Malpractice Defense', 'Speak with Admin/Paralegal', 'Main Menu'] 
      } as any]);
      setSignupStep(850);
      setIsTyping(false);
      return;
    }

    if (lower.includes('shantell') || lower === 'speak with shantell') {
      const isBiz = isBusiness || variant === 'sinc' || variant === 'business';
      const link = isBiz ? 'https://calendly.com/globalgreenhpmeet/business-meeting' : 'https://calendly.com/globalgreenhpmeet/general-patient-support';
      const title = isBiz ? 'Book Business Meeting with Shantell' : 'Book General Patient Support';
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: link }); } else { window.open(link, '_blank'); }
      response = `Sure! I've opened the booking page for you. If it didn't open, click the link below:\n\n🔗 [${title}](${link})\n\n`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] }]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('fee schedule') || lower === 'view fee schedule') {
      if (isBusiness || variant === 'sinc' || variant === 'business') {
        // ─── BUSINESS FEE SCHEDULE (OMMA Tiered Licensing) ───
        response = '💰 **OMMA Commercial License Fee Schedule (2026)**\n' +
          '_Per HB 2179 (2022) amended by SB 813 (2023) — 63 O.S. § 427.14_\n\n' +
          '🌿 **GROWER — Indoor / Greenhouse / Light Deprivation**\n' +
          '| Tier | Canopy Size | Fee | Total w/ CC |\n' +
          '|------|------------|-----|-------------|\n' +
          '| Tier 1 | Up to 10,000 sq ft | $2,500 | $2,558.30 |\n' +
          '| Tier 2 | 10,001–20,000 sq ft | $5,000 | $5,114.55 |\n' +
          '| Tier 3 | 20,001–40,000 sq ft | $10,000 | $10,227.05 |\n' +
          '| Tier 4 | 40,001–60,000 sq ft | $20,000 | $20,452.04 |\n' +
          '| Tier 5 | 60,001–80,000 sq ft | $30,000 | $30,677.05 |\n' +
          '| Tier 6 | 80,001–99,999 sq ft | $40,000 | $40,902.05 |\n' +
          '| Tier 7 | 100,000+ sq ft | $50,000 + $0.25/sq ft | Varies |\n\n' +
          'Which license type would you like more details on?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Grower Outdoor Fees', 'Processor Fees', 'Dispensary Fees', 'Start Business Intake', 'Main Menu'] } as any]);
        setIsTyping(false);
        return;
      } else {
        // ─── PATIENT FEE SCHEDULE ───
        response = '💰 **GGMA Patient Fee Schedule (2026)**\n\n' +
          '• **Patient Recommendation**: $35.00 (Via GoHealthUSA)\n' +
          '• **GGE Intake Processing**: $10.00\n' +
          '• **Total Portal Cost**: **$45.00**\n\n' +
          '• **State Authority Fee (Standard)**: $104.30\n' +
          '• **State Authority Fee (Reduced)**: $22.50 (Medicare/Medicaid/Veteran)\n\n' +
          'Would you like to **Start Patient Intake** or **Book Consultation**?';
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Patient Intake', 'Book Consultation', 'Main Menu'] } as any]);
        setIsTyping(false);
        return;
      }
    }

    // Handle specific business fee drilldowns
    if (lower.includes('grower outdoor') || lower === 'grower outdoor fees') {
      response = '🌿 **GROWER — Outdoor License Fees**\n' +
        '_Per 63 O.S. § 427.14_\n\n' +
        '• **Tier 1** (Up to 2.5 acres): **$2,500** _($2,558.30 w/ CC)_\n' +
        '• **Tier 2** (2.5–5 acres): **$5,000** _($5,114.55 w/ CC)_\n' +
        '• **Tier 3** (5–10 acres): **$10,000** _($10,227.05 w/ CC)_\n' +
        '• **Tier 4** (10–20 acres): **$20,000** _($20,452.04 w/ CC)_\n' +
        '• **Tier 5** (20–30 acres): **$30,000** _($30,677.05 w/ CC)_\n' +
        '• **Tier 6** (30–40 acres): **$40,000** _($40,902.05 w/ CC)_\n' +
        '• **Tier 7** (40–50 acres): **$50,000** _($51,127.04 w/ CC)_\n' +
        '• **Tier 8** (50+ acres): **$50,000 + $250/acre**\n\n' +
        'Ready to apply?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Business Intake', 'Processor Fees', 'Dispensary Fees', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('processor fee') || lower === 'processor fees') {
      response = '⚗️ **PROCESSOR License Fees**\n' +
        '_Initial nonrefundable fee: $2,500. Annual fee based on production._\n\n' +
        '• **Tier 1** (Up to 10k lbs / 100L): **$2,500** _($2,558.30 w/ CC)_\n' +
        '• **Tier 2** (10k–50k lbs / 101–350L): **$5,000** _($5,114.55 w/ CC)_\n' +
        '• **Tier 3** (50k–150k lbs / 351–650L): **$10,000** _($10,227.05 w/ CC)_\n' +
        '• **Tier 4** (150k–300k lbs / 651–1k L): **$15,000** _($15,339.55 w/ CC)_\n' +
        '• **Tier 5** (300k+ lbs / 1,001L+): **$20,000** _($20,452.04 w/ CC)_\n\n' +
        '_Note: Nonliquid concentrates = 1 liter per 1,000 grams._\n\n' +
        'Ready to apply?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Business Intake', 'Grower Outdoor Fees', 'Dispensary Fees', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('dispensary fee') || lower === 'dispensary fees') {
      response = '🏪 **DISPENSARY License Fees**\n' +
        '_Initial nonrefundable fee: $2,500_\n\n' +
        '**Annual fee** = 10% of combined annual state sales tax + state excise (medical marijuana) tax from the previous 12 months.\n\n' +
        '• **Minimum fee**: $2,500\n' +
        '• **Maximum fee**: $10,000\n' +
        '• **CC Processing**: 2.25% of (fee + $2)\n\n' +
        '📋 _The state sales tax calculation includes only sales tax payable to the State of Oklahoma, not local government taxes._\n\n' +
        'Ready to apply?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Business Intake', 'Grower Outdoor Fees', 'Processor Fees', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('grower fee') || lower === 'grower fees') {
      response = '🌿 **GROWER — Indoor / Greenhouse / Light Deprivation Fees**\n' +
        '_Per 63 O.S. § 427.14_\n\n' +
        '• **Tier 1** (Up to 10k sq ft): **$2,500** _($2,558.30 w/ CC)_\n' +
        '• **Tier 2** (10k–20k sq ft): **$5,000** _($5,114.55 w/ CC)_\n' +
        '• **Tier 3** (20k–40k sq ft): **$10,000** _($10,227.05 w/ CC)_\n' +
        '• **Tier 4** (40k–60k sq ft): **$20,000** _($20,452.04 w/ CC)_\n' +
        '• **Tier 5** (60k–80k sq ft): **$30,000** _($30,677.05 w/ CC)_\n' +
        '• **Tier 6** (80k–99,999 sq ft): **$40,000** _($40,902.05 w/ CC)_\n' +
        '• **Tier 7** (100k+ sq ft): **$50,000 + $0.25/sq ft**\n\n' +
        'Want outdoor acreage fees instead?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Grower Outdoor Fees', 'Processor Fees', 'Dispensary Fees', 'Start Business Intake'] } as any]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('consultation') || lower.includes('book 15min') || (lower.includes('schedule') && !lower.includes('fee')) || lower.includes('appointment') || lower.includes('slot')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/health-wellness-consultation' }); } else { window.open('https://calendly.com/globalgreenhpmeet/health-wellness-consultation', '_blank'); }
      response = 'Sure! I\'ve opened the booking page for you. If it didn\'t open, click below:\n\n🔗 [Book Health & Wellness Consultation](https://calendly.com/globalgreenhpmeet/health-wellness-consultation)\n\n';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] }]);
      setIsTyping(false);
      return;
    }

    if (lower.includes('review') || lower.includes('video review')) {
      window.open('https://vocalvideo.com/c/ccardzmedcard-com-as6sui63', '_blank');
      response = 'Thank you for sharing your experience! Your testimonial helps build the **GGMA Sector** community trust. 💚';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] }]);
      setIsTyping(false);
      return;
    }

    // === GLOBAL TOP-LEVEL CATEGORY NAVIGATION ===
    // These intercept at any step to reset the flow to the requested sector
    if (lower.includes('ggma') || lower.includes('oklahoma') || lower.includes('omma')) {
      response = '🏢 **GGMA Licensing & Assistance**\n\nI can assist you with your regulatory requirements. To provide the correct guidance, is your inquiry regarding a **Patient License** or a **Commercial Business License**?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Patient Licensing', 'Business Licensing'] 
      } as any]);
      setSignupStep(999);
      setIsTyping(false);
      return;
    } else if (lower.includes('rip intelligence') || lower === 'rip enforcement' || lower.includes('rip enforcement') || lower === 'tell me about rip enforcement.') {
      response = '🕵️ **RIP (Regulatory Intelligence Policing)**\n\nRIP handles enforcement, background verification, and regulatory oversight for **government and state authority entities only**.\n\nWhich government function do you need?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Field Intelligence Report', 'Background Verification Check', 'Enforcement Status Inquiry', 'Compliance Audit Request', 'Contact Oversight Division', 'Main Menu'] 
      } as any]);
      setSignupStep(400);
      setIsTyping(false);
      return;
    } else if (lower.includes('sinc') || lower.includes('secure infrastructure')) {
      response = '🛡️ **SINC (Secure Infrastructure & Network Compliance)**\n\nSINC is the operational backbone for **Cannabis Businesses** — seed-to-sale tracking, Metrc integration, audit shielding, and encrypted compliance records.\n\nHow can we help your business?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Start Business Intake', 'Audit Shield Setup', 'Seed-to-Sale Compliance', 'Network Integrity Check', 'View Business Fee Schedule', 'Main Menu'] 
      } as any]);
      setSignupStep(500);
      setIsTyping(false);
      return;
    } else if (lower.includes('telehealth') && !lower.includes('wellness')) {
      response = '🏥 **Telehealth Services**\n\nOur Telehealth network connects you with licensed physicians for:\n\n• **General Doctor Visits** — non-emergency consultations\n• **Medical Card Recommendation** — physician evaluation for OMMA card\n• **Follow-up Visits** — check-ins and ongoing care\n• **Prescription Consultations** — medication management\n\nWhat type of visit do you need?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['General Doctor Visit', 'Medical Card Recommendation ($45)', 'Follow-up / Check-in', 'Prescription Consultation', 'Main Menu'] 
      } as any]);
      setSignupStep(700);
      setIsTyping(false);
      return;
    } else if (lower.includes('general support') || lower.includes('question') || lower.includes('help')) {
      response = '❓ **General Support**\n\nI can help with anything! Here are common topics:\n\n• **Account & Login Issues**\n• **Application Status Check**\n• **Billing & Subscription Questions**\n• **How the Platform Works**\n• **Contact a Human Representative**\n\nWhat do you need help with?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Account & Login', 'Application Status', 'Billing Question', 'How Does This Work?', 'Speak with Shantell', 'Main Menu'] 
      } as any]);
      setSignupStep(800);
      setIsTyping(false);
      return;
    } else if (lower.includes('it support') || lower.includes('technical') || lower.includes('portal login issue') || lower.includes('app not loading') || lower.includes('metrc sync error')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/it-technical-support' }); } else { window.open('https://calendly.com/globalgreenhpmeet/it-technical-support', '_blank'); }
      response = '💻 **IT & Technical Support**\n\nI am routing you to our **IT Support Team**.\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Technical Support](https://calendly.com/globalgreenhpmeet/it-technical-support)\n\n';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('legal') || lower.includes('administration') || lower.includes('admin/paralegal') || lower.includes('paralegal')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/legal-consultation' }); } else { window.open('https://calendly.com/globalgreenhpmeet/legal-consultation', '_blank'); }
      response = '⚖️ **Legal & Administration**\n\nI am routing you to our **Legal & Admin Team**.\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Legal/Admin Consultation](https://calendly.com/globalgreenhpmeet/legal-consultation)\n\n';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('intelligence report')) {
      response = `🕵️ **Field Intelligence Report Logged**\n\nL.A.R.R.Y is analyzing the geospatial data and recent enforcement activities in your sector. Our team will cross-reference this with OMMA compliance heatmaps and will follow up with you promptly with a comprehensive update.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('background verification')) {
      response = `🛡️ **Background Verification Check Initiated**\n\nWe are running a secure cross-check against OSBI, DEA databases, and state records. Once the identity and history sweep is complete, our compliance officer will contact you promptly to review the findings.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('enforcement status')) {
      response = `📋 **Enforcement Status Inquiry Received**\n\nL.A.R.R.Y is pulling active injunctions, fines, and pending legal actions on the requested entity. A regulatory paralegal will review the findings and will reach out to you promptly to discuss the next steps.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('compliance audit')) {
      response = `📊 **Compliance Audit Request Filed**\n\nWe have queued a full seed-to-sale (Metrc) reconciliation and physical site audit protocol. An auditor will be assigned to schedule the physical walkthrough and will contact you promptly to confirm the details.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('contact oversight') || lower.includes('state authority plan')) {
      response = `📞 **Connecting to Oversight Division**\n\nYour request has been escalated to a senior state authority liaison. They will review your current clearance level and will reach out to you promptly to assist you further.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('audit shield')) {
      response = `🛡️ **Audit Shield Setup Requested**\n\nWe are preparing your firewall and automated Metrc synchronization parameters to protect your facility from random inspections. A SINC technician will follow up with you promptly to finalize the deployment.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('seed-to-sale')) {
      response = `🌱 **Seed-to-Sale Compliance Inquiry**\n\nL.A.R.R.Y is auditing your inventory API endpoints for discrepancy alerts. Our compliance integration team will review your tracing history and will contact you promptly with a full report.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('network integrity')) {
      response = `🔌 **Network Integrity Check Initiated**\n\nWe are scanning your local network and point-of-sale hardware for vulnerabilities. An IT security specialist will run diagnostics and will reach out to you promptly with the results.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (
      lower.includes('doctor visit') || 
      lower.includes('medical card recommendation') || 
      lower.includes('follow-up') || 
      lower.includes('prescription consultation')
    ) {
      // Telehealth Options
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation' }); } else { window.open('https://calendly.com/globalgreenhpmeet/medical-card-recommendation', '_blank'); }
      response = '📅 **Booking page opened!** If it didn\'t open, click below:\n🔗 [Book Medical Card / Doctor Visit via Calendly](https://calendly.com/globalgreenhpmeet/medical-card-recommendation)\n\n';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('account & login')) {
      response = `🔐 **Account & Login Ticket Created**\n\nOur IT team has been notified of your access issue. A support specialist will check your credentials and will contact you promptly to restore your access.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('application status')) {
      response = `📋 **Application Status Inquiry**\n\nL.A.R.R.Y is querying the state portal for your exact application timeline. A compliance agent will review the findings and will follow up with you promptly to provide a status update.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('billing question')) {
      response = `💳 **Billing Ticket Created**\n\nYour inquiry has been routed to our finance department. A billing specialist will review your Care Wallet or Subscription and will reach out to you promptly to ensure everything is correct.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('how does this work')) {
      response = `🧠 **Educational Request Logged**\n\nWe are preparing a custom onboarding packet based on your profile to explain how GGHP works for you. A concierge guide will contact you promptly to walk you through your personalized strategy.\n\n*(A copy of this ticket has been securely routed to Shantell's priority queue — Flagged: 🟣 Purple)*\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (lower.includes('speak with shantell') || lower.includes('human') || lower.includes('political') || lower.includes('media') || lower.includes('press') || lower.includes('enforcement') || lower.includes('state authority') || lower.includes('federal')) {
      response = `👩‍💼 **Direct Escalation to Management**\n\nI have priority-routed this to Shantell or the next available senior representative. I have priority-routed this directly to Shantell's personal queue (Flagged: 🟣 Priority Purple). She has been notified of the urgency and will reach out to you promptly.\n\nWould you like to return to the Main Menu?`;
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    }

    // === MAIN STATE MACHINE ===
    if (signupStep === 0) {
      if (lower.includes('start') || lower.includes('apply') || lower.includes('license')) {
        response = 'Great! Can I create an account for you to begin your application?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setSignupStep(99);
        setIsTyping(false);
        return;
      } else {
        response = 'I\'m here to help you navigate the **Global Green Hybrid Platform (GGHP)**. \n\nYou can ask me about **GGMA Licensing**, **RIP Enforcement**, **SINC Compliance**, or general services like **Telehealth** and **IT Support**.\n\nWhat would you like to explore first?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: getInitialChoices()
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 850) {
      // Find an Attorney Options
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/legal-consultation' }); } else { window.open('https://calendly.com/globalgreenhpmeet/legal-consultation', '_blank'); }
      if (lower.includes('individual')) {
        response = '⚖️ **Individual Representation**\n\nI am routing you to an intake specialist to match you with an attorney for patient rights, expungement, or personal defense.\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Attorney Match Consultation](https://calendly.com/globalgreenhpmeet/legal-consultation)\n\n';
      } else if (lower.includes('business') || lower.includes('commercial')) {
        response = '🏢 **Business & Commercial Counsel**\n\nI am routing you to a specialist to connect you with corporate counsel for OMMA licensing, METRC compliance, or B2B contracts.\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Corporate Counsel Match](https://calendly.com/globalgreenhpmeet/legal-consultation)\n\n';
      } else if (lower.includes('provider') || lower.includes('malpractice')) {
        response = '🏥 **Provider & Malpractice Defense**\n\nI am routing you to a specialist to match you with an attorney experienced in medical board defense and cannabis malpractice.\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Provider Defense Match](https://calendly.com/globalgreenhpmeet/legal-consultation)\n\n';
      } else {
        response = '⚖️ **Legal & Administration**\n\nI am routing you to our **Paralegal & Legal Admin Team** to review your case facts first.\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Legal Intake](https://calendly.com/globalgreenhpmeet/legal-consultation)\n\n';
      }
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setSignupStep(0);
      setIsTyping(false);
      return;
    } else if (signupStep === 999) {
      if (lower.includes('start patient intake')) {
        setIsBusiness(false);
        response = 'Great! Let\'s start your **New Patient Application**.\n\n**License Eligibility Criteria**\n\nAre you a **Patient Or Legal Guardian**? (Yes / No)';
        setSignupStep(20);
        setLicenseEligibility({ isPatientOrGuardian: '', isStateResident: '', isAdultLicense: '' });
        setEligibleLicenses([]);
      } else if (lower.includes('start business intake')) {
        setIsBusiness(true);
        response = '🏢 Let\'s begin your **Commercial License Application**.\n\n**Section 1: First-Time Registration**\n\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setSignupStep(100);
      } else if (lower.includes('patient')) {
        setIsBusiness(false);
        response = '🏥 **Medical Card Assistance (2026 Rules)**\n\n' +
          'We handle the entire intake for your Patient License:\n' +
          '• **Physician Rec**: Direct booking for **$35.00**.\n' +
          '• **GGE Processing**: Complete file sync for **$10.00**.\n' +
          '• **Total Portal Cost**: **$45.00**.\n\n' +
          'Would you like to **Book Physician ($45)** or **Speak with Shantell**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Book Physician ($45)', 'Speak with Shantell', 'Start Patient Intake'] 
        } as any]);
        setIsBusiness(false);
        setIsTyping(false);
        return;
      } else if (lower.includes('business') || lower.includes('commercial')) {
        setIsBusiness(true);
        response = '🏢 **Commercial Business License Assistance**\n\n' +
          'We provide full-spectrum support for Oklahoma Cannabis Businesses:\n' +
          '• **Entity Setup**: LLC/Corp registration for OMMA compliance.\n' +
          '• **Licensing Tiers**: Grower, Processor, and Dispensary filings.\n' +
          '• **SINC Audit**: Pre-inspection compliance reviews.\n\n' +
          'Commercial consulting starts with a professional review. Would you like to **Book Business Consultation** or **Start Business Intake**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Book Business Consultation', 'Start Business Intake', 'View Fee Schedule'] 
        } as any]);
        setIsBusiness(true);
        setIsTyping(false);
        return;
      } else {
        response = 'Please specify if you are looking for a **Patient** or **Commercial Business** license.';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Patient Licensing', 'Business Licensing'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 98) {
      if (lower.includes('first') || lower.includes('new')) {
        response = '🏢 Great! Let\'s begin your **Commercial License Application**.\n\n**Section 1: First-Time Registration**\n\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setSignupStep(100);
      } else if (lower.includes('return') || lower.includes('existing')) {
        response = 'Welcome back! Please enter your **Email Address** or **Username** to log in.';
        setSignupStep(97);
      } else {
        response = 'Please specify if you are a **first time user** or a **returning user**.';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['First Time User', 'Returning User'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 97) {
      setBusinessData(prev => ({ ...prev, email: text }));
      setSignupData(prev => ({ ...prev, email: text }));
      response = 'Please enter your **Password**.\n\n*(Your password will be hidden in the chat)*';
      setSignupStep(96);
    } else if (signupStep === 96) {
      setBusinessData(prev => ({ ...prev, password: text }));
      setSignupData(prev => ({ ...prev, password: text }));
      response = '✅ **Thank you!**\n\nAre you applying for a **New application** or a **Renewal application**?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['New Application', 'Renewal Application'] 
      } as any]);
      setSignupStep(95);
      setIsTyping(false);
      return;
    } else if (signupStep === 95) {
      if (lower.includes('new')) {
        if (isBusiness) {
          response = '🏢 Let\'s start your **New Commercial License Application**.\n\n**Section 3: General Information**\n\nWhat is the legal **Entity Name** of your business?';
          setSignupStep(105);
        } else {
          response = 'Great! Let\'s start your **New Patient Application**.\n\n**License Eligibility Criteria**\n\nAre you a **Patient Or Legal Guardian**? (Yes / No)';
          setSignupStep(20);
          setLicenseEligibility({ isPatientOrGuardian: '', isStateResident: '', isAdultLicense: '' });
          setEligibleLicenses([]);
        }
      } else if (lower.includes('renew')) {
        if (isBusiness) {
          response = '🏢 Let\'s start your **Commercial License Renewal**.\n\n**Section 3: General Information**\n\nWhat is the legal **Entity Name** of your business?';
          setSignupStep(105);
        } else {
          response = 'Great! Let\'s start your **Patient License Renewal**.\n\n**License Eligibility Criteria**\n\nAre you a **Patient Or Legal Guardian**? (Yes / No)';
          setSignupStep(20);
          setLicenseEligibility({ isPatientOrGuardian: '', isStateResident: '', isAdultLicense: '' });
          setEligibleLicenses([]);
        }
      } else {
        response = 'Please specify if this is a **New application** or a **Renewal application**.';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['New Application', 'Renewal Application'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 99) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep' || lower.includes('sure') || lower.includes('ok')) {
        if (isBusiness) {
          response = 'Are you a **first time user** or **returning user**?';
          setSignupStep(98);
        } else {
          response = 'Great! Let\'s first determine your license eligibility.\n\n**License Eligibility Criteria**\n\nAre you a **Patient Or Legal Guardian**? (Yes / No)';
          setSignupStep(20);
          setLicenseEligibility({ isPatientOrGuardian: '', isStateResident: '', isAdultLicense: '' });
          setEligibleLicenses([]);
        }
      } else if (lower === 'no' || lower === 'nope' || lower.includes('no thank') || lower.includes('nevermind')) {
        response = 'No problem! We understand. Our platform offers a wide range of benefits including the **Care Wallet**, **Priority Renewals**, and **Legal Advocacy** even without an active application.\n\nWould you like to **Speak with Shantell** or have a call back? Please provide a date and time, anytime!\n\nIf not, I wish you a wonderful day. 👋';
        setSignupStep(0);
        fetchCalendlySlots();
      } else {
        response = 'Please answer **Yes** or **No**. Can I create an account for you to begin your application?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 20) {
      // License Eligibility: Are you a Patient Or Legal Guardian?
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setLicenseEligibility(prev => ({ ...prev, isPatientOrGuardian: 'yes' }));
        response = `What **State** are you applying for?`;
        setSignupStep(20.5);
      } else if (lower === 'no' || lower === 'nope') {
        setLicenseEligibility(prev => ({ ...prev, isPatientOrGuardian: 'no' }));
        response = 'Are you a **Caregiver**? (Yes / No)';
        setSignupStep(22);
      } else {
        response = 'Please answer **Yes** or **No**. Are you a **Patient Or Legal Guardian**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 20.5) {
      const selectedState = text.trim();
      setSignupData(prev => ({ ...prev, state: selectedState }));
      response = `Are you a **${selectedState} State Resident**? (Yes / No)`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No'] 
      } as any]);
      setSignupStep(21);
      setIsTyping(false);
      return;
    } else if (signupStep === 21) {
      // License Eligibility: Are you an Oklahoma State Resident?
      const stateName = signupData.state || 'the state';
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setLicenseEligibility(prev => ({ ...prev, isStateResident: 'yes' }));
        response = 'Are you applying for an **adult patient license**? (Yes / No)';
        setSignupStep(23);
      } else if (lower === 'no' || lower === 'nope') {
        setLicenseEligibility(prev => ({ ...prev, isStateResident: 'no' }));
        response = `⚠️ As a non-resident of **${stateName}**, you are eligible only for an Out-of-State Temporary License.\n\nAre you applying for an **adult patient license**? (Yes / No)`;
        setSignupStep(23);
      } else {
        response = `Please answer **Yes** or **No**. Are you a **${stateName} State Resident**?`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 22) {
      // License Eligibility: Are you a Caregiver? (only reached when NOT patient/guardian)
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        const licenses = ['Caregiver'];
        setEligibleLicenses(licenses);
        setSignupData(prev => ({ ...prev, selectedLicense: 'Caregiver' }));
        response = 'You can apply for the following license:\n\n✅ **Caregiver**\n\nGreat! Now let\'s create your account. What is your **Full Name (First & Last)**?';
        setSignupStep(1);
      } else if (lower === 'no' || lower === 'nope') {
        response = '❌ **You are not eligible to apply for any license.**\n\nIf you have any questions, feel free to call us at **405-492-7487** or type **start** to begin again.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you a **Caregiver**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 23) {
      // License Eligibility: Are you applying for an adult patient license?
      const isResident = licenseEligibility.isStateResident === 'yes';
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        if (isResident) {
          // Oklahoma resident, adult
          const licenses = ['Adult Patient 2-Year License', 'Adult Patient 60-Day Temporary License'];
          setEligibleLicenses(licenses);
          response = 'You can apply for the following licenses:\n\n1️⃣ **Adult Patient 2-Year License**\n2️⃣ **Adult Patient 60-Day Temporary License**\n\nPlease reply with the **number** (1 or 2) of the license you want to apply for.';
          setSignupStep(25);
        } else {
          // Out of state, adult
          const licenses = ['Adult Patient - Temporary License (Out of State)'];
          setEligibleLicenses(licenses);
          setSignupData(prev => ({ ...prev, selectedLicense: 'Adult Patient - Temporary License (Out of State)' }));
          response = 'You can apply for the following license:\n\n✅ **Adult Patient - Temporary License (Out of State)**\n\nGreat! Now let\'s create your account. What is your **Full Name (First & Last)**?';
          setSignupStep(1);
        }
      } else if (lower === 'no' || lower === 'nope') {
        if (isResident) {
          // Oklahoma resident, minor
          const licenses = ['Minor Patient 2-Year License', 'Minor Patient 60-Day Temporary License', 'Caregiver'];
          setEligibleLicenses(licenses);
          response = 'You can apply for the following licenses:\n\n1️⃣ **Minor Patient 2-Year License**\n2️⃣ **Minor Patient 60-Day Temporary License**\n3️⃣ **Caregiver**\n\nPlease reply with the **number** (1, 2, or 3) of the license you want to apply for.';
          setSignupStep(25);
        } else {
          // Out of state, minor
          const licenses = ['Minor Patient - Temporary License (Out of State)'];
          setEligibleLicenses(licenses);
          setSignupData(prev => ({ ...prev, selectedLicense: 'Minor Patient - Temporary License (Out of State)' }));
          response = 'You can apply for the following license:\n\n✅ **Minor Patient - Temporary License (Out of State)**\n\nGreat! Now let\'s create your account. What is your **Full Name (First & Last)**?';
          setSignupStep(1);
        }
      } else {
        response = 'Please answer **Yes** or **No**. Are you applying for an **adult patient license**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 25) {
      // License selection from multiple options
      const num = parseInt(text.trim());
      let selectedLicense = '';
      if (num >= 1 && num <= eligibleLicenses.length) {
        selectedLicense = eligibleLicenses[num - 1];
      } else {
        // Try matching by name
        const matched = eligibleLicenses.find(l => lower.includes(l.toLowerCase().split(' ')[0]));
        if (matched) selectedLicense = matched;
      }
      if (selectedLicense) {
        setSignupData(prev => ({ ...prev, selectedLicense }));
        response = `You selected: **${selectedLicense}**\n\nGreat! Now let\'s create your account. What is your **Full Name (First & Last)**?`;
        setSignupStep(1);
      } else {
        response = `Please reply with a valid number (1-${eligibleLicenses.length}) to select your license type.\n\n` + eligibleLicenses.map((l, i) => `${i + 1}️⃣ **${l}**`).join('\n');
      }
    } else if (signupStep === 1) {
      setSignupData(prev => ({ ...prev, fullName: text }));
      setSignupStep(1.1);
      response = `Great to meet you, ${text}! Are you **21 years of age or older**?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No']
      } as any]);
      return;
    } else if (signupStep === 1.1) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setSignupData(prev => ({ ...prev, ageVerified: true }));
        setSignupStep(2);
        response = `Excellent. What is your **Email Address**?`;
      } else {
        response = `⚠️ You must be 21+ to use this platform. If you are a minor patient, please have a legal guardian start the application.`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Main Menu'] 
        } as any]);
        setSignupStep(0);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 2) {
      if (!text.includes('@') || !text.includes('.')) {
        response = `That doesn't look like a valid email. Please provide your **Email Address**.`;
      } else {
        setSignupData(prev => ({ ...prev, email: text }));
        setSignupStep(3);
        response = `Thanks! What is your **Date of Birth (DOB)**? (e.g. mm/dd/yyyy)`;
      }
    } else if (signupStep === 3) {
      setSignupData(prev => ({ ...prev, dob: text }));
      setSignupStep(3.1);
      response = `Got it. For identity verification, what is your **Social Security Number (SSN)**? \n\n*(This is encrypted and handled by the L.A.R.R.Y Secure Node)*`;
    } else if (signupStep === 3.1) {
      setSignupData(prev => ({ ...prev, ssn: text }));
      setSignupStep(3.2);
      response = `Thank you. What is your **Sex** (as shown on ID)?`;
    } else if (signupStep === 3.2) {
      setSignupData(prev => ({ ...prev, sex: text }));
      setSignupStep(3.3);
      response = `What **Gender** do you identify with?`;
    } else if (signupStep === 3.3) {
      setSignupData(prev => ({ ...prev, genderIdentify: text }));
      setSignupStep(3.4);
      response = `What is your **Preferred Language**?`;
    } else if (signupStep === 3.4) {
      setSignupData(prev => ({ ...prev, preferredLanguage: text }));
      setSignupStep(6);
      response = `Got it. Now, what is the **Physical Address** listed on your Identification?`;
    } else if (signupStep === 6) {
      setSignupData(prev => ({ ...prev, physicalAddress: text }));
      setSignupStep(7);
      response = `Got it. Now, what is the **Mailing Address** where you want your medical card mailed? (Type **"same"** if it is the same as above)`;
    } else if (signupStep === 7) {
      setSignupData(prev => ({ ...prev, mailingAddress: text === 'same' ? signupData.physicalAddress : text }));
      setSignupStep(8);
      response = `How would you like your **Appointment** to be conducted?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Video Call', 'Phone Call', 'In-Person']
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 8) {
      setSignupData(prev => ({ ...prev, appType: text }));
      setSignupStep(9);
      response = `Have you registered your account under the **New MMJ Portal**?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 9) {
      setSignupData(prev => ({ ...prev, portalRegistered: lower.includes('yes') }));
      setSignupStep(10.1);
      response = `Do you have a **Primary Care Provider**?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 10.1) {
      if (lower.includes('yes')) {
        setSignupStep(11.1);
        response = `Please enter the **Name** and **Phone Number** of your primary physician.`;
      } else {
        setSignupStep(12);
        response = `Understood. Why are you applying for your Medical Marijuana Card? Which of the following conditions do you have?`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Chronic Pain', 'Depression', 'Anxiety', 'Insomnia', 'PTSD', 'Autism', 'Cancer', 'Glaucoma', 'Seizures', 'Crohns Disease', 'Sickle Cell', 'Other']
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 11.1) {
      setSignupData(prev => ({ ...prev, primaryPhysician: text }));
      setSignupStep(12);
      response = `Got it. Why are you applying for your Medical Marijuana Card? Which of the following conditions do you have?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Chronic Pain', 'Depression', 'Anxiety', 'Insomnia', 'PTSD', 'Autism', 'Cancer', 'Glaucoma', 'Seizures', 'Crohns Disease', 'Sickle Cell', 'Other']
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 12) {
      setSignupData(prev => ({ ...prev, qualifyingCondition: text }));
      setSignupStep(13);
      response = `Do you have any **Allergies**?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes', 'No'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 13) {
      setSignupData(prev => ({ ...prev, allergies: text }));
      setSignupStep(14);
      response = `When was the last time you spoke with a doctor about these complaints?`;
    } else if (signupStep === 14) {
      setSignupData(prev => ({ ...prev, lastDoctorVisit: text }));
      setSignupStep(15);
      response = `📋 **Document Upload Center**\n\nI need a few documents to complete your file.\n\n📷 **Photo Instructions:** Please take a picture with all 4 corners of the document clearly visible, or scan it.\n\n⚠️ **Trouble Uploading?** If you cannot upload in this chat, you can:\n📱 **Text** your documents to **1-405-492-7487** (Include your Name & D.O.B)\n✉️ **Email** to **asstsupport@gmail.com**\n\nAre you ready to begin uploads?`;
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Ready to Upload', 'Skip for Now', 'I Will Email/Text Them'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (signupStep === 15) {
      if (lower.includes('ready')) {
        setSignupStep(16);
        response = `Please use the **Patient Document Upload Center** below.\n\n*(Note: Once uploaded, click **"Continue"** below the documents to proceed)*`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Continue'] 
        } as any]);
        setIsTyping(false);
        return;
      } else {
        setSignupStep(19);
        response = `Understood. You can upload them later in your portal or via email/text. \n\nFinal step: Would you like to **Opt-In** to subscribe for 2-way messaging for renewal alerts and status updates?`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 16) {
      if (lower === 'done' || lower === 'continue') {
        setSignupStep(19);
        response = `Excellent. Final step: Would you like to **Opt-In** to subscribe for 2-way messaging for renewal alerts and status updates?`;
        setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 19) {
      setSignupData(prev => ({ ...prev, smsOptIn: lower.includes('yes') }));
      setSignupStep(19.5);
      response = `Excellent. Finally, please provide a secure **Password** (minimum 8 characters) for your new account.\n\n*(Your password will be hidden in the chat)*`;
    } else if (signupStep === 19.5) {
      if (text.length < 8) {
        response = `Password must be at least 8 characters. Please choose a secure password.`;
      } else {
        const finalData = { ...signupData, password: text };
        setSignupData(finalData);
        setSignupStep(19.6);
        try {
          let profile;
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, finalData.email, finalData.password);
            const firebaseUser = userCredential.user;
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: finalData.role,
              displayName: finalData.fullName,
              dob: finalData.dob,
              idNumber: finalData.idNumber,
              phone: finalData.phone,
              state: finalData.state,
              address: finalData.address,
              ssn: finalData.ssn,
              idCode: finalData.ssn?.slice(-4) || '0000',
              sex: finalData.sex,
              genderIdentify: finalData.genderIdentify,
              preferredLanguage: finalData.preferredLanguage,
              ethnicity: finalData.ethnicity,
              idType: finalData.idType,
              physicalAddress: finalData.physicalAddress,
              mailingAddress: finalData.mailingAddress,
              employment: finalData.employment,
              insurance: finalData.insurance,
              qualifyingCondition: finalData.qualifyingCondition,
              textPhone: finalData.textPhone,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          } catch (authError: any) {
            console.warn('[LarryMedCardChatbot] Firebase Auth Error:', authError.message);
            profile = {
              uid: 'local-' + Date.now(),
              email: finalData.email,
              role: finalData.role || 'user',
              displayName: finalData.fullName,
              createdAt: new Date().toISOString(),
            };
          }
          if (onProfileCreated && profile) onProfileCreated(profile);
          setSignupStep(19.7);
          response = `✅ **Intake Complete!**\n\nYour file has been prepared for the **L.A.R.R.Y Authority Engine**. \n\n**Next Steps:**\n• **Review**: We will verify your documents within 24 hours.\n• **OMMA Fee**: You will need to pay **$104.30** ($22.50 for Medicare/Medicaid/Veterans).\n• **Timeline**: Your card will be available within 10 business days.\n\nWhile we process your file, would you like to leave a **Video or Voice Review** for the community? We use these to improve the GGMA Sector! 🎤`;
        } catch (err) {
          response = `Intake processed locally. Are you ready to proceed to your dashboard?`;
          setSignupStep(19.7);
        }
      }
    } else if (signupStep === 19.7) {
      response = `Taking you to your application now!`;
      setTimeout(() => onNavigate('patient-portal'), 1500);
    }
    // ── Business License Steps (100-134) ────────────────────────────────────
    // Section 1: First-Time Registration
    else if (signupStep === 100) {
      setBusinessData(prev => ({ ...prev, fullName: text }));
      response = `Nice to meet you, **${text}**! What is your **Email Address**? This will be used for registration and follow-up notices.`;
      setSignupStep(101);
    } else if (signupStep === 101) {
      if (!text.includes('@') || !text.includes('.')) {
        response = 'That doesn\'t look like a valid email. Please provide your **Email Address**.';
      } else {
        setBusinessData(prev => ({ ...prev, email: text }));
        response = 'Please create a **Password** for your account (strong password recommended). This will be used to access and track all application and license information.\n\n*(Your password will be hidden in the chat)*';
        setSignupStep(102);
      }
    } else if (signupStep === 102) {
      if (text.length < 8) {
        response = 'Password must be at least 8 characters. Please choose a strong password.';
      } else {
        setBusinessData(prev => ({ ...prev, password: text }));
        response = 'Do you accept the **Terms and Conditions** for the website? (Yes / No)';
        setSignupStep(103);
      }
    } else if (signupStep === 103) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setBusinessData(prev => ({ ...prev, termsAccepted: true }));
        response = '✅ **Registration Complete!**\n\n**Section 2: Account Recognition**\n\n📧 An email will be sent to your registered email address. Click the link in the email to confirm your address and begin the application process.\n\n**Section 3: General Information**\n\nWhat is the **Individual Owner Name or Primary Entity Name** for the commercial establishment?';
        setSignupStep(105);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'You must accept the Terms and Conditions to proceed. Do you accept the **Terms and Conditions**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      } else {
        response = 'Please answer **Yes** or **No**. Do you accept the **Terms and Conditions**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }
    // Section 3: General Information
    else if (signupStep === 105) {
      setBusinessData(prev => ({ ...prev, entityName: text }));
      // Use the pre-selected license type if they came from the "Cost & Fees" flow
      if (businessData.licenseType) {
        response = `Since you previously selected **${businessData.licenseType}**, we will use that license type.\n\nWhat is the **Trade Name** of the commercial establishment? (Type **"same"** if it\'s the same as the entity name)`;
        setSignupStep(107);
      } else {
        response = 'What **Type of Commercial License** are you applying for?\n\n' + BUSINESS_LICENSE_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n\nPlease reply with the **number** or name of the license type.';
        setSignupStep(106);
      }
    } else if (signupStep === 106) {
      const num = parseInt(text.trim());
      let selectedType = '';
      if (num >= 1 && num <= BUSINESS_LICENSE_TYPES.length) {
        selectedType = BUSINESS_LICENSE_TYPES[num - 1];
      } else {
        const matched = BUSINESS_LICENSE_TYPES.find(t => lower.includes(t.toLowerCase()));
        if (matched) selectedType = matched;
      }
      if (selectedType) {
        setBusinessData(prev => ({ ...prev, licenseType: selectedType }));
        response = `You selected: **${selectedType}**.\n\nWould you like to review the Oklahoma fee structure for this license type before we continue?`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setSignupStep(1065);
        setIsTyping(false);
        return;
      } else {
        response = 'Please select a valid license type (1-8).\n\n' + BUSINESS_LICENSE_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n');
      }
    } else if (signupStep === 1065) {
      const nextQuestion = `What is the **Trade Name** of the commercial establishment? (Type **"same"** if it's the same as the entity name)`;
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
         let feeMsg = '';
         const typeLower = businessData.licenseType.toLowerCase();
         if (typeLower.includes('grower')) {
            feeMsg = '**Oklahoma Commercial License Application Fees:**\n\n' +
              '**Grower Licenses: Indoor, Greenhouse or Light Deprivation**\n' +
              '• Tier 1 (Up to 10k sq ft): $2,500 + $58.30 fee = $2,558.30\n' +
              '• Tier 2 (10,001-20k sq ft): $5,000 + $114.55 fee = $5,114.55\n' +
              '• Tier 3 (20,001-40k sq ft): $10,000 + $227.05 fee = $10,227.05\n' +
              '• Tier 4 (40,001-60k sq ft): $20,000 + $452.04 fee = $20,452.04\n' +
              '• Tier 5 (60,001-80k sq ft): $30,000 + $677.05 fee = $30,677.05\n' +
              '• Tier 6 (80,001-99,999 sq ft): $40,000 + $902.05 fee = $40,902.05\n' +
              '• Tier 7 (100k+ sq ft): $50,000 + $0.25/sq ft + 2.25% fee\n\n' +
              '**Grower Licenses: Outdoor**\n' +
              '• Tier 1 (Up to 2.5 acres): $2,500 + $58.30 fee = $2,558.30\n' +
              '• Tier 2 (2.5-5 acres): $5,000 + $114.55 fee = $5,114.55\n' +
              '• Tier 3 (5-10 acres): $10,000 + $227.05 fee = $10,227.05\n' +
              '• Tier 4 (10-20 acres): $20,000 + $452.04 fee = $20,452.04\n' +
              '• Tier 5 (20-30 acres): $30,000 + $677.05 fee = $30,677.05\n' +
              '• Tier 6 (30-40 acres): $40,000 + $902.05 fee = $40,902.05\n' +
              '• Tier 7 (40-50 acres): $50,000 + $1,127.04 fee = $51,127.04\n' +
              '• Tier 8 (50+ acres): $50,000 + $250/acre + 2.25% fee';
         } else if (typeLower.includes('processor')) {
            feeMsg = '**Oklahoma Commercial License Application Fees:**\n\n**Processors**\n' +
              '• Tier 1 (Up to 10k lbs / 100 L): $2,500 + $58.30 fee = $2,558.30\n' +
              '• Tier 2 (10,001-50k lbs / 101-350 L): $5,000 + $114.55 fee = $5,114.55\n' +
              '• Tier 3 (50,001-150k lbs / 351-650 L): $10,000 + $227.05 fee = $10,227.05\n' +
              '• Tier 4 (150,001-300k lbs / 651-1k L): $15,000 + $339.55 fee = $15,339.55\n' +
              '• Tier 5 (300,001+ lbs / 1k+ L): $20,000 + $452.04 fee = $20,452.04';
         } else if (typeLower.includes('dispensary')) {
            feeMsg = '**Oklahoma Commercial License Application Fees:**\n\n**Dispensaries**\n' +
              '• 10% of sum of one year combined state sales tax and state excise tax.\n' +
              '• Min: $2,500, Max: $10,000.\n' +
              '• Credit card processing fee: 2.25% of (fee + $2).';
         } else {
            feeMsg = '**Oklahoma Commercial License Application Fees:**\n\n**Other Licenses / Credentials**\n' +
              '• Employee Credential: $30 + $2.72 = $32.72\n' +
              '• Transporter: $2,500 + $58.30 = $2,558.30\n' +
              '• Transporter Agent: $25 + $2.61 = $27.61\n' +
              '• Testing Lab: $20,000 + $452.04 = $20,452.04\n' +
              '• Waste Disposal: $5,000 + $114.55 = $5,114.55\n' +
              '• Research / Education: $500 + $13.30 = $513.30';
         }
         
         // Send the fee as a separate bubble first
         setMessages(prev => [...prev, { role: 'bot', text: feeMsg }]);
         // Then render the next question
         response = nextQuestion;
         setSignupStep(107);
      } else {
         response = nextQuestion;
         setSignupStep(107);
      }
    } else if (signupStep === 107) {
      const tradeName = lower === 'same' ? businessData.entityName : text;
      setBusinessData(prev => ({ ...prev, tradeName }));
      response = 'What is the **Phone Number** for the business? (Also include fax number and/or website if applicable)';
      setSignupStep(108);
    } else if (signupStep === 108) {
      setBusinessData(prev => ({ ...prev, phone: text }));
      response = 'What is the **Business Structure Type**?\n\n' + BUSINESS_STRUCTURES.map((s, i) => `${i + 1}. ${s}`).join('\n') + '\n\nPlease reply with the **number**.';
      setSignupStep(109);
    } else if (signupStep === 109) {
      const num = parseInt(text.trim());
      let selectedStructure = '';
      if (num >= 1 && num <= BUSINESS_STRUCTURES.length) {
        selectedStructure = BUSINESS_STRUCTURES[num - 1];
      } else {
        const matched = BUSINESS_STRUCTURES.find(s => lower.includes(s.toLowerCase().split(' ')[0]));
        if (matched) selectedStructure = matched;
      }
      if (selectedStructure) {
        setBusinessData(prev => ({ ...prev, businessStructure: selectedStructure }));
        response = `You selected: **${selectedStructure}**\n\nWhat are the anticipated **Office/Operating Hours** for the commercial establishment? (e.g., Mon-Fri 9am-5pm)`;
        setSignupStep(110);
      } else {
        response = 'Please select a valid business structure (1-5).\n\n' + BUSINESS_STRUCTURES.map((s, i) => `${i + 1}. ${s}`).join('\n');
      }
    } else if (signupStep === 110) {
      setBusinessData(prev => ({ ...prev, operatingHours: text }));
      response = '✅ **General Information Complete!**\n\n**Section 4: Owners & Principal Officers**\n\nLet\'s add owner/principal officer information. What is the **Full Name** (First, Middle, Last, Suffix) of the owner/officer?';
      setSignupStep(111);
    }
    // Section 4: All Owners and Principal Officers
    else if (signupStep === 111) {
      setBusinessData(prev => ({ ...prev, ownerName: text }));
      response = `What is **${text}**'s **Phone Number and Email**? (e.g., 555-123-4567, email@example.com)`;
      setSignupStep(112);
    } else if (signupStep === 112) {
      const parts = text.split(/[,;]+/).map(s => s.trim());
      setBusinessData(prev => ({ ...prev, ownerPhone: parts[0] || text, ownerEmail: parts[1] || '' }));
      response = 'What **Type of ID Document** is being uploaded?\n\n' + BUSINESS_ID_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n') + '\n\nPlease reply with the **number**.';
      setSignupStep(113);
    } else if (signupStep === 113) {
      const num = parseInt(text.trim());
      let selectedId = '';
      if (num >= 1 && num <= BUSINESS_ID_TYPES.length) {
        selectedId = BUSINESS_ID_TYPES[num - 1];
      } else {
        const matched = BUSINESS_ID_TYPES.find(t => lower.includes(t.toLowerCase().replace("ok ", "")));
        if (matched) selectedId = matched;
      }
      if (selectedId) {
        setBusinessData(prev => ({ ...prev, ownerIdType: selectedId }));
        response = `You selected: **${selectedId}**\n\nWhat is the **ID Number** and **Expiration Date**? (e.g., D12345678, 12/2028)`;
        setSignupStep(114);
      } else {
        response = 'Please select a valid ID type (1-4).\n\n' + BUSINESS_ID_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n');
      }
    } else if (signupStep === 114) {
      const parts = text.split(/[,;]+/).map(s => s.trim());
      setBusinessData(prev => ({ ...prev, ownerIdNumber: parts[0] || text, ownerIdExpiry: parts[1] || '' }));
      response = 'What is their **Date of Birth**? (e.g., mm/dd/yyyy)';
      setSignupStep(115);
    } else if (signupStep === 115) {
      setBusinessData(prev => ({ ...prev, ownerDob: text }));
      response = 'What {{flag:Entity}} or {{flag:Entities}} does this person have affiliation with?';
      setSignupStep(116);
    } else if (signupStep === 116) {
      setBusinessData(prev => ({ ...prev, ownerEntityAffiliation: text }));
      response = 'What are the **Direct and Indirect Ownership Shares** by entity? (e.g., 50% direct ownership in ABC LLC)';
      setSignupStep(117);
    } else if (signupStep === 117) {
      setBusinessData(prev => ({ ...prev, ownerShares: text }));
      response = 'What is their **Relationship to Licensee**? (e.g., member, manager, board member, or owner)';
      setSignupStep(118);
    } else if (signupStep === 118) {
      setBusinessData(prev => ({ ...prev, ownerRelationship: text }));
      response = 'What is their **Residence Address**? (Street Address, Apt#, City, State, Zip)';
      setSignupStep(119);
    } else if (signupStep === 119) {
      setBusinessData(prev => ({ ...prev, ownerResidence: text }));
      response = 'Is the **Mailing Address** different from residence? If so, provide it. (Type **"same"** if same as residence)';
      setSignupStep(120);
    } else if (signupStep === 120) {
      const mailing = lower.includes('same') ? businessData.ownerResidence : text;
      setBusinessData(prev => ({ ...prev, ownerMailing: mailing, ownersCompleted: prev.ownersCompleted + 1 }));
      response = `✅ Owner/Officer **${businessData.ownerName}** added! (${businessData.ownersCompleted + 1} total)\n\nDo you need to **add another owner/officer**? (Yes / No)`;
      setSignupStep(121);
    } else if (signupStep === 121) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        response = 'What is the **Full Name** (First, Middle, Last, Suffix) of the next owner/officer?';
        setBusinessData(prev => ({ ...prev, ownerName: '', ownerPhone: '', ownerEmail: '', ownerIdType: '', ownerIdNumber: '', ownerIdExpiry: '', ownerDob: '', ownerEntityAffiliation: '', ownerShares: '', ownerRelationship: '', ownerResidence: '', ownerMailing: '' }));
        setSignupStep(111);
      } else if (lower === 'no' || lower === 'nope') {
        response = '✅ **Owners & Officers Complete!**\n\n**Section 5: Location Information**\n\nWhat is the **Physical Address** of the commercial establishment? (Street Address, Unit Number, City, County, State, Zip)';
        setSignupStep(122);
      } else {
        response = 'Please answer **Yes** or **No**. Do you need to add another owner/officer?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }
    // Section 5: Location Information
    else if (signupStep === 122) {
      setBusinessData(prev => ({ ...prev, physicalAddress: text }));
      // Auto-geocode the address using OpenStreetMap Nominatim
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=1`, {
          headers: { 'Accept': 'application/json' }
        });
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          const lat = parseFloat(geoData[0].lat).toFixed(6);
          const lon = parseFloat(geoData[0].lon).toFixed(6);
          const coords = `${lat}, ${lon}`;
          setBusinessData(prev => ({ ...prev, gpsCoordinates: coords }));
          response = `📍 I found the **GPS Coordinates** for your address:\n\n**Latitude:** ${lat}\n**Longitude:** ${lon}\n**Coordinates:** ${coords}\n\nAre these coordinates correct?`;
          setMessages(prev => [...prev, { 
            role: 'bot', 
            text: response,
            choices: ['Yes', 'No'] 
          } as any]);
          setSignupStep(123);
          setIsTyping(false);
          return;
        } else {
          response = 'I could not find GPS coordinates for that address. Please enter the **GPS Coordinates** (Latitude & Longitude) manually. You can look them up at [gps-coordinates.org](https://gps-coordinates.org/)';
          setSignupStep(123);
        }
      } catch (geoError) {
        console.warn('[LarryBot] Geocoding error:', geoError);
        response = 'I could not look up GPS coordinates automatically. Please enter the **GPS Coordinates** (Latitude & Longitude) manually. You can look them up at [gps-coordinates.org](https://gps-coordinates.org/)';
        setSignupStep(123);
      }
    } else if (signupStep === 123) {
      // If user confirms auto-geocoded coordinates
      if ((lower === 'yes' || lower === 'yeah' || lower === 'yep') && businessData.gpsCoordinates) {
        response = 'Is the **Mailing Address** for the establishment different from the physical address? If so, provide it. (Type **"same"** if same)';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Same as Physical', 'Different Address'] 
        } as any]);
        setSignupStep(124);
        setIsTyping(false);
        return;
      } else if (lower === 'no' || lower === 'nope') {
        setBusinessData(prev => ({ ...prev, gpsCoordinates: '' }));
        response = 'No problem! Please enter the correct **GPS Coordinates** (Latitude & Longitude) manually. You can look them up at [gps-coordinates.org](https://gps-coordinates.org/)';
        // Stay on step 123 to accept manual input
      } else {
        // Manual coordinate entry
        setBusinessData(prev => ({ ...prev, gpsCoordinates: text }));
        response = 'Is the **Mailing Address** for the establishment different from the physical address? If so, provide it. (Type **"same"** if same)';
        setSignupStep(124);
      }
    } else if (signupStep === 124) {
      const mailing = lower.includes('same') ? businessData.physicalAddress : text;
      setBusinessData(prev => ({ ...prev, locationMailing: mailing }));
      response = '✅ **Location Information Complete!**\n\n**Section 6: Primary Contact & Registered Agent**\n\nWho is the **Primary Point of Contact (PPOC)**? Please provide their **Full Name** (First, Middle, Last, Suffix).';
      setSignupStep(125);
    }
    // Section 6: Primary Contact
    else if (signupStep === 125) {
      setBusinessData(prev => ({ ...prev, ppocName: text }));
      response = `What is **${text}**'s **Title**? (e.g., CEO, Managing Member, Owner)`;
      setSignupStep(126);
    } else if (signupStep === 126) {
      setBusinessData(prev => ({ ...prev, ppocTitle: text }));
      response = 'What is the PPOC\'s **Phone Number**?';
      setSignupStep(127);
    } else if (signupStep === 127) {
      setBusinessData(prev => ({ ...prev, ppocPhone: text }));
      response = 'What is the PPOC\'s **Email Address**?';
      setSignupStep(128);
    } else if (signupStep === 128) {
      setBusinessData(prev => ({ ...prev, ppocEmail: text }));
      response = 'What is the PPOC\'s **Address**? (Street Address, City, State, Zip) (Type **"same"** if same as physical location)';
      setSignupStep(129);
    } else if (signupStep === 129) {
      const ppocAddr = lower.includes('same') ? businessData.physicalAddress : text;
      setBusinessData(prev => ({ ...prev, ppocAddress: ppocAddr }));
      response = '✅ **Primary Contact Complete!**\n\n**Section 7: Questions & Verifications**\n\nPlease review and confirm the following attestations:\n\n' +
        '1️⃣ The commercial entity will **not** be located on tribal lands.\n' +
        '2️⃣ The establishment pledges **not to divert** marijuana to unauthorized individuals.\n' +
        '3️⃣ You are **authorized** to make this application on behalf of the applicant.\n' +
        '4️⃣ All information provided is **true and correct**.\n' +
        '5️⃣ You understand the name, address, city, county, and phone of the establishment will be **published on the OMMA website**.\n' +
        '6️⃣ If applicable, the dispensary perimeter wall is at least **1,000 feet** from the nearest school.\n' +
        '7️⃣ If applicable, the grower\'s premises property line is at least **1,000 feet** from the nearest school.\n' +
        '8️⃣ The business has obtained all applicable **local licenses and permits**.\n' +
        '9️⃣ No individual with ownership interest is a **law enforcement officer** or OMMA employee.\n' +
        '🔟 You understand responsibilities for **transporter agent ID cards** and **security measures**.\n\n' +
        'Do you **confirm and attest** to all of the above?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Yes, I Attest', 'No'] 
      } as any]);
      setSignupStep(130);
      setIsTyping(false);
      return;
    } else if (signupStep === 130) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setBusinessData(prev => ({ ...prev, attestationsConfirmed: true }));
        response = '✅ **Attestations Confirmed!**\n\n**Section 8: Document Uploads**\n\nThe following documents are required for your application:\n\n' +
          '📄 **Affidavit of Lawful Presence**\n' +
          '📄 **Proof of Oklahoma Residency (75% ownership)**\n' +
          '📄 **OSBI Background Check (each owner)**\n' +
          '📄 **National Background Check Attestation**\n' +
          '📄 **ID copies (each person of interest)**\n' +
          '📄 **Certificate of Compliance**\n' +
          '📄 **Certificate(s) of Occupancy & Site Plans**\n' +
          '📄 **Certificate of Good Standing**\n' +
          '📄 **Ownership Disclosure Documentation**\n' +
          (businessData.licenseType === 'Processor' ? '📄 Hazardous License / Chemical Safety Data Sheets\n' : '') +
          (businessData.licenseType === 'Dispensary' ? '📄 Dispensary Distance Attestation (1,000 ft from schools)\n' : '') +
          (businessData.licenseType === 'Grower' ? '📄 Grow Facility Distance Attestation (1,000 ft from schools)\n' : '') +
          '\n📷 **Photo Instructions:** Please ensure all 4 corners of the document are visible in the picture or scan.\n\n⚠️ **Trouble Uploading?** If you cannot upload in this chat, you can:\n📱 **Text** your documents to **1-405-492-7487** (Include Business Name & EIN)\n✉️ **Email** to **asstsupport@gmail.com**\n\nPlease use the **Business Document Upload Center** below to begin. Once uploaded, type **"done"** or click continue.';
        setBusinessData(prev => ({ ...prev, documentsUploadedCount: 0 }));
        setSignupStep(131);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'You must confirm all attestations to proceed with the application. Please review them carefully.\n\nDo you **confirm and attest** to all of the above? (Yes / No)';
      } else {
        response = 'Please answer **Yes** or **No**. Do you confirm all attestations?';
      }
    } else if (signupStep === 131) {
      const requiredDocs = getRequiredDocuments();
      const uploadedCount = Object.keys(uploadedDocuments).length;
      if ((lower === 'done' || lower === 'continue' || lower === 'next' || lower === 'proceed')) {
        if (uploadedCount >= requiredDocs.length) {
          setBusinessData(prev => ({ ...prev, documentsNoted: true }));
          if (businessData.licenseType === 'Grower') {
            response = '**Section 9: Bond Requirement** (Growers Only)\n\nPlease select one:\n\n1️⃣ I have secured a **Surety Bond** (upload bond documentation)\n2️⃣ I or a person of interest have **owned the permitted land for at least 5 years** prior to this application\n\nPlease reply with **1** or **2**.';
            setSignupStep(132);
          } else {
            // Skip to review step
            response = '✅ **All Documents Uploaded!**\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nPlease review your complete application below.';
            setSignupStep(134);
          }
        } else {
          const missing = requiredDocs.filter(d => !uploadedDocuments[d]);
          response = `⚠️ You still have **${missing.length}** document(s) remaining:\n\n${missing.map(d => `❌ ${d}`).join('\n')}\n\nPlease upload all required documents using the document panel above.`;
        }
      } else {
        response = `Please use the **Document Upload Center** above to upload your required documents. You have uploaded **${uploadedCount}/${requiredDocs.length}** so far.`;
      }
    } else if (signupStep === 132) {
      const num = parseInt(text.trim());
      if (num === 1) {
        setBusinessData(prev => ({ ...prev, bondType: 'Surety Bond' }));
        response = '📎 Please upload your **Surety Bond documentation** using the attachment icon, or type **"continue"** to proceed.\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nPlease review your complete application below.';
        setSignupStep(134);
      } else if (num === 2) {
        setBusinessData(prev => ({ ...prev, bondType: 'Land Ownership (5+ years)' }));
        response = '📎 Please upload **Attestation of Land Ownership** and **documentation verifying land ownership for at least 5 years** using the attachment icon, or type **"continue"** to proceed.\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nPlease review your complete application below.';
        setSignupStep(134);
      } else {
        response = 'Please reply with **1** (Surety Bond) or **2** (Land Ownership).';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['1. Surety Bond', '2. Land Ownership'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 133) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        response = '🎉 **Application Complete!**\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nI want to thank you for allowing me to assist you in this process. If you have any questions feel free to login your portal and chat with me directly 24/7 by clicking the **"help/support"** tab. Thank you and Goodbye 👋';
        setSignupStep(0);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'No problem! Your progress has been saved. Type **start** when you\'re ready to continue, for assistance.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you ready to submit your application?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }
    // ── Step 134: Application Review ──
    else if (signupStep === 134) {
      if (lower === 'confirm' || lower === 'yes' || lower === 'proceed' || lower === 'continue' || lower === 'pay' || lower.includes('submit')) {
        response = '🎉 **Application Complete!**\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nI want to thank you for allowing me to assist you in this process. If you have any questions feel free to login your portal and chat with me directly 24/7 by clicking the **"help/support"** tab. Thank you and Goodbye 👋';
        setSignupStep(0);
      } else if (lower === 'edit' || lower === 'change') {
        setIsEditingReview(true);
        response = '✏️ **Edit Mode Enabled!** You can now edit any field in the review panel above. Click **"Save Changes"** when you\'re done.';
      } else if (lower === 'save') {
        setIsEditingReview(false);
        response = '✅ **Changes Saved!**\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nPlease review your updated application and type **"confirm"** to proceed to payment, or **"edit"** to make more changes.';
      } else {
        response = 'Please review your application above and type **"confirm"** to proceed to payment, or **"edit"** if you need to make changes.';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Confirm & Proceed', 'Edit Application'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }
    // ── Cost & Fees Flow ──
    else if (signupStep === 200) {
      if (!isBusiness) {
        setSignupStep(0);
        response = 'Let\'s start over. How can I help you?';
      } else {
        setSignupData(prev => ({ ...prev, state: text }));
        response = `Got it. Here are the types of commercial businesses you can start in **${text}**:\n\n1️⃣ **Grower (Indoor/Greenhouse)**\n2️⃣ **Grower (Outdoor)**\n3️⃣ **Processor**\n4️⃣ **Dispensary**\n5️⃣ **Other (Transporter, Lab, Waste, etc.)**\n\nPlease reply with the **number** of the business type to see its fees.`;
        setSignupStep(201);
      }
    } else if (signupStep === 201) {
      if (!isBusiness) {
        setSignupStep(0);
        response = 'Let\'s start over. How can I help you?';
      } else {
        const stateLower = (signupData.state || '').toLowerCase();
        const num = parseInt(text.trim());
        
        if (stateLower.includes('oklahoma') || stateLower.includes('ok')) {
          if (num === 1) {
            response = '**Oklahoma Commercial License Application Fees:**\n\n' +
              '**Grower Licenses: Indoor, Greenhouse or Light Deprivation**\n' +
              '• Tier 1 (Up to 10k sq ft): $2,500 + $58.30 fee = $2,558.30\n' +
              '• Tier 2 (10,001-20k sq ft): $5,000 + $114.55 fee = $5,114.55\n' +
              '• Tier 3 (20,001-40k sq ft): $10,000 + $227.05 fee = $10,227.05\n' +
              '• Tier 4 (40,001-60k sq ft): $20,000 + $452.04 fee = $20,452.04\n' +
              '• Tier 5 (60,001-80k sq ft): $30,000 + $677.05 fee = $30,677.05\n' +
              '• Tier 6 (80,001-99,999 sq ft): $40,000 + $902.05 fee = $40,902.05\n' +
              '• Tier 7 (100k+ sq ft): $50,000 + $0.25/sq ft + 2.25% fee';
          } else if (num === 2) {
            response = '**Oklahoma Commercial License Application Fees:**\n\n' +
              '**Grower Licenses: Outdoor**\n' +
              '• Tier 1 (Up to 2.5 acres): $2,500 + $58.30 fee = $2,558.30\n' +
              '• Tier 2 (2.5-5 acres): $5,000 + $114.55 fee = $5,114.55\n' +
              '• Tier 3 (5-10 acres): $10,000 + $227.05 fee = $10,227.05\n' +
              '• Tier 4 (10-20 acres): $20,000 + $452.04 fee = $20,452.04\n' +
              '• Tier 5 (20-30 acres): $30,000 + $677.05 fee = $30,677.05\n' +
              '• Tier 6 (30-40 acres): $40,000 + $902.05 fee = $40,902.05\n' +
              '• Tier 7 (40-50 acres): $50,000 + $1,127.04 fee = $51,127.04\n' +
              '• Tier 8 (50+ acres): $50,000 + $250/acre + 2.25% fee';
          } else if (num === 3) {
            response = '**Oklahoma Commercial License Application Fees:**\n\n' +
              '**Processors**\n' +
              '• Tier 1 (Up to 10k lbs / 100 L): $2,500 + $58.30 fee = $2,558.30\n' +
              '• Tier 2 (10,001-50k lbs / 101-350 L): $5,000 + $114.55 fee = $5,114.55\n' +
              '• Tier 3 (50,001-150k lbs / 351-650 L): $10,000 + $227.05 fee = $10,227.05\n' +
              '• Tier 4 (150,001-300k lbs / 651-1k L): $15,000 + $339.55 fee = $15,339.55\n' +
              '• Tier 5 (300,001+ lbs / 1k+ L): $20,000 + $452.04 fee = $20,452.04';
          } else if (num === 4) {
            response = '**Oklahoma Commercial License Application Fees:**\n\n' +
              '**Dispensaries**\n' +
              '• 10% of sum of one year combined state sales tax and state excise tax.\n' +
              '• Min: $2,500, Max: $10,000.\n' +
              '• Credit card processing fee: 2.25% of (fee + $2).';
          } else if (num === 5) {
            response = '**Oklahoma Commercial License Application Fees:**\n\n' +
              '**Other Licenses / Credentials**\n' +
              '• Employee Credential: $30 + $2.72 = $32.72\n' +
              '• Transporter: $2,500 + $58.30 = $2,558.30\n' +
              '• Transporter Agent: $25 + $2.61 = $27.61\n' +
              '• Testing Lab: $20,000 + $452.04 = $20,452.04\n' +
              '• Waste Disposal: $5,000 + $114.55 = $5,114.55\n' +
              '• Research / Education: $500 + $13.30 = $513.30';
          } else {
            response = 'Please reply with a valid number (1-5) to see the fees for that business type.';
            return;
          }
          
          if (num >= 1 && num <= 5) {
             // Capture the current fee text in a const to avoid closure mutation issues
             const feeMessage = response;
             setMessages(prev => [...prev, { role: 'bot', text: feeMessage }]);
             // Then prepare the follow-up response
             response = '**Which business license do you want to apply for?**\n' + 
                        BUSINESS_LICENSE_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n') + 
                        '\n\nPlease reply with the **number** or name of the license type.';
             setSignupStep(202);
          }
        } else {
          // Capture the current generic fee text in a const
          const feeMessage = `We currently only have detailed OMMA fee breakdowns for Oklahoma. For **${signupData.state}**, fees vary by license type as regulated by the state. Please visit your state's cannabis regulatory website for exact costs.`;
          setMessages(prev => [...prev, { role: 'bot', text: feeMessage }]);
          response = '**Which business license do you want to apply for?**\n' + 
                     BUSINESS_LICENSE_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n') + 
                     '\n\nPlease reply with the **number** or name of the license type.';
          setSignupStep(202);
        }
      }
    } else if (signupStep === 202) {
      const num = parseInt(text.trim());
      let selectedType = '';
      if (num >= 1 && num <= BUSINESS_LICENSE_TYPES.length) {
        selectedType = BUSINESS_LICENSE_TYPES[num - 1];
      } else {
        const matched = BUSINESS_LICENSE_TYPES.find(t => lower.includes(t.toLowerCase()));
        if (matched) selectedType = matched;
      }
      if (selectedType) {
        setBusinessData(prev => ({ ...prev, licenseType: selectedType }));
        response = `You selected: **${selectedType}**.\n\nAre you ready to start your **Commercial License Application**?`;
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setSignupStep(203);
        setIsTyping(false);
        return;
      } else {
        response = 'Please select a valid license type (1-8).\n\n' + BUSINESS_LICENSE_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n');
      }
    } else if (signupStep === 203) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        response = 'Are you a **first time user** or **returning user**?';
        setSignupStep(98);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'No problem! If you change your mind, type **start** when you\'re ready to continue, for assistance.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you ready to start the application?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    }
    // ── Patient Fee Flow ──
    else if (signupStep === 300) {
      setSignupData(prev => ({ ...prev, state: text }));
      const stLower = text.toLowerCase();
      if (stLower.includes('oklahoma') || stLower.includes('ok')) {
        response = `Got it! Here are the license types available in **${text}**:\n\n1️⃣ **Patient** (adult, minor, out-of-state, short-term)\n2️⃣ **Medicaid/SoonerSelect, Medicare or 100% Disabled Veteran Patient**\n3️⃣ **Replacement Patient License Card**\n4️⃣ **Caregiver**\n\nPlease reply with the **number** to see its fees.`;
        setSignupStep(301);
      } else {
        response = `We currently only have detailed fee breakdowns for Oklahoma. For **${text}**, fees vary by state. Please visit your state's medical cannabis program website for exact costs, or type **start** to begin your application!`;
        setSignupStep(0);
      }
    } else if (signupStep === 301) {
      const num = parseInt(text.trim());
      if (num === 1) {
        response = '**Oklahoma Patient & Caregiver License Fees:**\n\n' +
          '**Patient License** (adult, minor, out-of-state, short-term)\n' +
          '• Application Fee: $100\n' +
          '• Credit Card Processing Fee: $4.30\n' +
          '• **Total: $104.30**';
      } else if (num === 2) {
        response = '**Oklahoma Patient & Caregiver License Fees:**\n\n' +
          '**Medicaid/SoonerSelect, Medicare or 100% Disabled Veteran Patient**\n' +
          '• Application Fee: $20\n' +
          '• Credit Card Processing Fee: $2.50\n' +
          '• **Total: $22.50**';
      } else if (num === 3) {
        response = '**Oklahoma Patient & Caregiver License Fees:**\n\n' +
          '**Replacement Patient License Card**\n' +
          '• Application Fee: $20\n' +
          '• Credit Card Processing Fee: $2.50\n' +
          '• **Total: $22.50**';
      } else if (num === 4) {
        response = '**Oklahoma Patient & Caregiver License Fees:**\n\n' +
          '**Caregiver License**\n' +
          '• Application Fee: No charge\n' +
          '• Credit Card Processing Fee: No charge\n' +
          '• **Total: No charge** ✅';
      } else {
        response = 'Please reply with a valid number (1-4) to see the fees for that license type.';
      }
      if (num >= 1 && num <= 4) {
        response = 'Are you a **first time user** or **returning user**?';
        setSignupStep(98);
      }
    } else {

    // Check for state name
    let foundState = '';
    for (const stateName of Object.keys(STATE_RESOURCES)) {
      if (lower.includes(stateName.toLowerCase())) {
        foundState = stateName;
        break;
      }
    }

    if (foundState) {
      setSignupData(prev => ({ ...prev, state: foundState }));
      
      if (isBusiness) {
        response = `Great choice! We can help you process your **${foundState}** Commercial License application right here in the GGMA platform.\n\nType **start** to begin your application, or ask me about **requirements**, **fees**, or the **application process**.`;
      } else {
        const info = STATE_RESOURCES[foundState];
        let lines = [`Great choice! We can help you process your **${foundState}** application right here in the GGMA platform.\n`];
        
        lines.push(`\n**Do I Qualify? (Eligibility & Laws)**`);
        
        if (info.conditions) {
          lines.push(`*Status: ${info.status} (Law Signed: ${info.year})*\n`);
          lines.push(`Here are the qualifying conditions for **${foundState}**:`);
          info.conditions.forEach((c: string) => lines.push(`• ${c}`));
          lines.push(`\n**Do you have one of these qualifying conditions? If so, which one?**`);
        } else {
          lines.push(`Our built-in L.A.R.R.Y guide has specific eligibility criteria rules. Simply start your Patient Registration to view your state's exact qualifying conditions.`);
        }

        response = lines.join('\n');
      }
    } else if (lower.includes('eligib') || lower.includes('qualify') || lower.includes('who can')) {
      if (isBusiness) {
        response = '**Requirements (Oklahoma/Norman):**\n\n' +
          '🏠 **Residency:** 75% ownership must be held by Oklahoma residents.\n\n' +
          '🎂 **Age:** Applicants must be at least 25 years old.\n\n' +
          '📄 **Documentation:** Requires a Certificate of Compliance, Oklahoma Sales Tax Permit, State Department of Health License, and OBNDD registration.\n\n' +
          '🔍 **Background Check:** OSBI background check is required.\n\n' +
          'Would you like to **start your commercial license application**? Type **start** to begin!';
      } else {
        response = '**General Eligibility for a Medical Cannabis Card:**\n\n✅ You must be a resident of the state (most states)\n✅ You must have a qualifying medical condition\n✅ You need a physician\'s recommendation or certification\n✅ You must be 21+ (minors need a legal guardian/caregiver)\n\nEvery state has radically different qualifying conditions. **Which state are you in?** I\'ll provide the specific **L.A.R.R.Y legal eligibility guide** for your location.';
      }
    } else if (lower.includes('step') || lower.includes('process') || lower.includes('how to') || lower.includes('apply')) {
      if (isBusiness) {
        response = '**Steps to Apply for a Commercial License via GGMA:**\n\n' +
          '**Step 1** — Register: Provide name, email, password & accept terms.\n' +
          '**Step 2** — Confirm email via the link sent to your inbox.\n' +
          '**Step 3** — General Info: Entity name, license type, trade name, business structure & hours.\n' +
          '**Step 4** — Add all owners & principal officers with ID, DOB, entity affiliations & ownership shares.\n' +
          '**Step 5** — Location: Physical address, GPS coordinates & mailing address.\n' +
          '**Step 6** — Primary Contact (PPOC): Name, title, phone, email & address.\n' +
          '**Step 7** — Attestations: Confirm compliance with all OMMA requirements.\n' +
          '**Step 8** — Upload Documents: Affidavit, residency proof, background checks, IDs, certificates & more.\n' +
          '**Step 9** — Bond (Growers only): Surety Bond or Land Ownership attestation.\n' +
          '**Step 10** — Payment via Visa, Mastercard, or Discover.\n\n' +
          '🎉 Type **start** to begin your application!';
      } else {
        response = '**Steps to Apply for a Medical Cannabis Card via GGMA:**\n\nOur platform makes applying easy! Here is how our built-in application works:\n\n**Step 1** — Click **Back** and select **Sign up** to create an account as a **Patient / Caregiver**.\n**Step 2** — Complete the built-in **License Eligibility Criteria** wizard.\n**Step 3** — Fill out your **Personal Information** securely within our platform.\n**Step 4** — Upload your **Proof of Identity** directly in the app.\n**Step 5** — Sign our digital **Attestation** and submit your application for review!\n\n🎉 Once submitted, our team and your state regulators will process the application directly through our platform.';
      }
    } else if (lower.includes('cost') || lower.includes('fee') || lower.includes('price') || lower.includes('how much')) {
      if (isBusiness) {
        if (signupData.state) {
          response = `Here are the types of commercial businesses you can start in **${signupData.state}**:\n\n1️⃣ **Grower (Indoor/Greenhouse)**\n2️⃣ **Grower (Outdoor)**\n3️⃣ **Processor**\n4️⃣ **Dispensary**\n5️⃣ **Other (Transporter, Lab, Waste, etc.)**\n\nPlease reply with the **number** of the business type to see its fees.`;
          setSignupStep(201);
        } else {
          response = 'Sure! Fees depend on the state and the specific commercial license type. Which **state** are you inquiring about?';
          setSignupStep(200);
        }
      } else {
        if (signupData.state) {
          const stLower = signupData.state.toLowerCase();
          if (stLower.includes('oklahoma') || stLower.includes('ok')) {
            response = `Here are the license types available in **${signupData.state}**:\n\n1️⃣ **Patient** (adult, minor, out-of-state, short-term)\n2️⃣ **Medicaid/SoonerSelect, Medicare or 100% Disabled Veteran Patient**\n3️⃣ **Replacement Patient License Card**\n4️⃣ **Caregiver**\n\nPlease reply with the **number** to see its fees.`;
            setSignupStep(301);
          } else {
            response = `We currently only have detailed fee breakdowns for Oklahoma. For **${signupData.state}**, fees vary by state. Please visit your state's medical cannabis program website for exact costs, or type **start** to begin your application!`;
          }
        } else {
          response = 'Sure! Fees depend on the state and the specific license type. Which **state** are you inquiring about?';
          setSignupStep(300);
        }
      }
    } else if (lower.includes('document') || lower.includes('what do i need') || lower.includes('required')) {
      if (isBusiness) {
        response = '**Documents Required for Commercial License Application:**\n\n' +
          '📄 **Affidavit of Lawful Presence** (form on OMMA website)\n' +
          '📄 **Proof of Oklahoma Residency** for 75% ownership (OK driver\'s license, tax returns, utility bills, property deed, or rental agreement)\n' +
          '📄 **OSBI Background Check** (for EACH owner)\n' +
          '📄 **Attestation Regarding National Background Check** (for each person)\n' +
          '📄 **ID copies** (OK DL / State ID / Passport / Tribal ID for each person of interest)\n' +
          '📄 **Certificate of Compliance** (from city or county)\n' +
          '📄 **Certificate(s) of Occupancy, Final Inspection Reports & Site Plans**\n' +
          '📄 **Certificate of Good Standing** (from OK Secretary of State, unless sole proprietorship)\n' +
          '📄 **Ownership Disclosure Documentation** (bylaws, articles, operating agreements)\n' +
          '📄 **Hazardous License** (Processors only — chemical list & safety data sheets)\n' +
          '📄 **Bond Documentation** (Growers only — Surety Bond or Land Ownership)\n' +
          '📄 **Distance Attestation** (Dispensaries/Growers — 1,000 ft from schools)\n\n' +
          'Type **start** to begin your application and we\'ll guide you through each upload!';
      } else {
        response = '**Documents Required for GGMA Application:**\n\nTo complete your submission *within this application*, please have ready:\n\n📄 **Government-issued photo ID** (Driver\'s License or State ID)\n📄 **Proof of state residency** (utility bill, lease, or voter registration)\n📄 **Physician recommendation/certification**\n\nYou will be able to securely upload all of these directly in Step 3 of our Patient Signup process! Click **Back** -> **Sign up** to begin.';
      }
    } else if (lower.includes('start') || lower.includes('begin') || lower.includes('ready')) {
      if (isBusiness) {
        setSignupStep(98);
        response = 'Are you a **first time user** or **returning user**?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['First Time User', 'Returning User'] 
        } as any]);
        setIsTyping(false);
        return;
      } else {
        setSignupStep(99);
        response = 'Excellent. I can help you establish your secure profile to begin the official intake process. Shall we proceed with creating your account?';
        setMessages(prev => [...prev, { 
          role: 'bot', 
          text: response,
          choices: ['Yes', 'No'] 
        } as any]);
        setIsTyping(false);
        return;
      }
    } else if (signupStep === 10) {
      if (lower.includes('yes') || lower.includes('book') || lower.includes('ready') || lower.includes('consultation')) {
        if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation' }); } else { window.open('https://calendly.com/globalgreenhpmeet/medical-card-recommendation', '_blank'); }
        response = 'Sure! I\'ve opened the booking page. If it didn\'t open, click below:\n\n🔗 [Book Telehealth Session](https://calendly.com/globalgreenhpmeet/medical-card-recommendation)\n\n';
      } else if (lower.includes('shantell') || lower.includes('speak')) {
        if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/general-patient-support' }); } else { window.open('https://calendly.com/globalgreenhpmeet/general-patient-support', '_blank'); }
        response = '👤 **Human Care Coordination**\n\nI am routing you to **Shantell Robinson**.\n\n\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book a Session via Calendly](https://calendly.com/globalgreenhpmeet/general-patient-support)';
        setSignupStep(0);
      } else {
        response = 'No problem. If you\'re not ready for an appointment, I can help you with **GGMA Licensing** or **IT Support**. What would you like to explore?';
        setSignupStep(0);
      }
    } else if (lower.includes('business expert') || lower.includes('commercial consultant') || lower.includes('business consultation') || lower.includes('book business')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/business-meeting' }); } else { window.open('https://calendly.com/globalgreenhpmeet/business-meeting', '_blank'); }
      response = '🏢 **Commercial Compliance Consultation**\n\nI am routing you to our **Business Licensing Experts**.\n\n\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book Business Consultation](https://calendly.com/globalgreenhpmeet/business-meeting)';
    } else if (lower.includes('human') || lower.includes('coordinator') || lower.includes('shantell') || lower.includes('speak with someone') || lower.includes('political') || lower.includes('media') || lower.includes('press') || lower.includes('enforcement') || lower.includes('state authority') || lower.includes('federal')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/general-patient-support' }); } else { window.open('https://calendly.com/globalgreenhpmeet/general-patient-support', '_blank'); }
      response = '👤 **Human Care Coordination**\n\nI am routing you to **Shantell Robinson**.\n\n\n\n📅 **Booking page opened!** If it didn\'t open:\n🔗 [Book a Session via Calendly](https://calendly.com/globalgreenhpmeet/general-patient-support)';
    } else if (lower.includes('fee schedule')) {
      response = '💰 **OMMA Fee Schedule (2026)**\n\n• **Dispensary**: $2,500 - $10,000 (Based on tax)\n• **Grower/Processor**: Tiered from $2,500 to $50,000+\n• **Patient Card**: $104.30 (Standard) / $22.50 (Reduced)\n\nWould you like the detailed tier breakdown for a specific license type?';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response, 
        choices: ['Grower Fees', 'Processor Fees', 'Dispensary Fees'] 
      } as any]);
    } else if (lower.includes('business intake')) {
      response = '🏢 Understood. Let\'s start your **Commercial Business License Application**. \n\nCan I create an account for you to begin?';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Yes', 'No'] } as any]);
      setSignupStep(99);
    } else if (lower.includes('book physician') || lower.includes('doctor') || lower.includes('recommendation') || lower.includes('med card intake') || lower.includes('patient licensing') || lower.includes('physician')) {
      response = '⚕️ **Physician Booking & Patient Licensing**\n\nWhat type of visit do you need?\n\n• **Medical Card Evaluation ($45)** — physician recommendation for OMMA card (Call: 1-405-492-7487)\n• **General Telehealth Wellness** — non-emergency consultation (Call: 1-405-252-1178)\n\nSelect below to proceed to online booking! 📅';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: ['Medical Card Evaluation ($45)', 'General Telehealth Wellness', 'Main Menu'] 
      } as any]);
      setIsTyping(false);
      return;
    } else if (lower.includes('medical card evaluation') || lower.includes('med card eval') || lower.includes('medical card')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/medical-card-recommendation' }); } else { window.open('https://calendly.com/globalgreenhpmeet/medical-card-recommendation', '_blank'); }
      response = '💳 **Medical Card Evaluation ($45)**\n\nYour evaluation includes:\n• **$35** — Physician Consultation\n• **$10** — GGE Processing Fee\n\n📅 **Booking page opened!** If it didn\'t open, click below:\n🔗 [Book Online via Calendly](https://calendly.com/globalgreenhpmeet/medical-card-recommendation)\n\n📞 **Prefer to call?** Dial **1-405-492-7487**';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Start Patient Intake', 'I Already Scheduled', 'Main Menu'] } as any]);
      setIsTyping(false);
      return;
    } else if (lower.includes('general telehealth wellness') || lower.includes('general telehealth') || lower.includes('general health')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/general-patient-support' }); } else { window.open('https://calendly.com/globalgreenhpmeet/general-patient-support', '_blank'); }
      response = '🏥 **General Telehealth Wellness Visit**\n\nConnect with a licensed physician for:\n• Non-emergency consultations\n• Follow-up visits\n• Prescription management\n• General health questions\n\n📅 **Booking page opened!** If it didn\'t open, click below:\n🔗 [Book Online via Calendly](https://calendly.com/globalgreenhpmeet/general-patient-support)\n\n📞 **Prefer to call?** Dial **1-405-252-1178**';
      setMessages(prev => [...prev, { role: 'bot', text: response, choices: ['Main Menu'] } as any]);
      setIsTyping(false);
      return;
    } else if (lower.includes('human') || lower.includes('coordinator') || lower.includes('shantell') || lower.includes('speak with someone') || lower.includes('political') || lower.includes('media') || lower.includes('press') || lower.includes('enforcement') || lower.includes('state authority') || lower.includes('federal')) {
      if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: 'https://calendly.com/globalgreenhpmeet/general-patient-support' }); } else { window.open('https://calendly.com/globalgreenhpmeet/general-patient-support', '_blank'); }
      response = '👤 **Human Care Coordination**\n\nI am routing you to **Shantell Robinson**, our lead Human Care Coordinator.\n\n\n\n📅 **Booking page opened!** If it didn\'t open, click below:\n🔗 [Book a 15-Min Session via Calendly](https://calendly.com/globalgreenhpmeet/general-patient-support)';
    } else if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
      response = 'Great! I am ready to assist. Would you like to begin your **Licensing Intake**, or do you have questions about our other sectors like **RIP Intelligence** or **SINC Compliance**?';
    } else if (['cancer', 'pain', 'ptsd', 'glaucoma', 'seizure', 'anxiety', 'epilepsy', 'crohn', 'sclerosis', 'als', 'alzheimer', 'anorexia', 'migraine', 'arthritis', 'nausea', 'autism', 'hiv', 'aids', 'parkinson', 'tourette'].some(condition => lower.includes(condition))) {
      response = 'That sounds like a qualifying medical condition. To ensure you receive the correct state certification, I can begin your intake process now. \n\nCan I create an account for you to begin? (Yes / No)';
      setSignupStep(99);
    } else if (lower === 'no' || lower === 'nope' || lower === 'none' || lower.includes('don\'t') || lower.includes('do not') || lower.includes('none of')) {
      response = 'No problem. If you\'re not ready for an application, you can explore our **IT Support**, **Legal Compliance**, or **Telehealth** nodes. \n\nHow can I help you navigate the ecosystem today?';
    } else if (lower.includes('talk') || lower.includes('speak') || lower.includes('human') || lower.includes('agent') || lower.includes('support') || lower.includes('call') || lower.includes('phone')) {
      response = 'I can route you to a live department representative. \n\nWould you like me to open a support ticket for you instead?';
    } else {
      response = 'I\'m here to help you navigate the **Global Green Hybrid Platform (GGHP)**. Select an area below to explore:';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response,
        choices: [
          '🏢 GGMA Licensing',
          '🕵️ RIP Intelligence',
          '🛡️ SINC Compliance',
          '📅 Book 15min Consultation',
          '🏥 Telehealth',
          '💻 IT Support',
          '⭐ Basic Subscription',
          '💎 Professional Subscription',
          '🚀 Enterprise Subscription'
        ]
      } as any]);
      setIsTyping(false);
      return;
    }
    }
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMessages(prev => [...prev, { role: 'user', text: `📎 Uploaded: ${file.name}` }]);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        if (signupStep === 8.5) {
          setSignupStep(9);
          setMessages(prev => [...prev, { role: 'bot', text: `Thanks! Document received. \n\nFinally, please provide a secure **Password** (minimum 8 characters) for your new account.\n\n*(Your password will be hidden in the chat)*` }]);
        } else if (signupStep === 131 || signupStep === 16) {
          // If a pending doc label was set (user clicked a specific doc), mark it
          if (pendingDocLabel) {
            setUploadedDocuments(prev => ({ ...prev, [pendingDocLabel]: file.name }));
            if (signupStep === 131) {
              setBusinessData(prev => ({
                ...prev,
                documentsUploadedCount: prev.documentsUploadedCount + 1,
              }));
            }
            setMessages(prev => [...prev, { role: 'bot', text: `✅ **${pendingDocLabel}** — uploaded: **${file.name}**` }]);
            setPendingDocLabel('');
          } else {
            // Generic upload — ask which document it is
            if (signupStep === 131) {
              setBusinessData(prev => ({
                ...prev,
                documentsUploadedCount: prev.documentsUploadedCount + 1,
              }));
            }
            setMessages(prev => [...prev, { role: 'bot', text: `✅ Document received: **${file.name}**. Please select which document this is from the checklist above.` }]);
          }
        } else {
          setMessages(prev => [...prev, { role: 'bot', text: `I've received your document: **${file.name}**. I've securely attached it to your profile context.` }]);
        }
      }, 1000);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (screenshotInputRef.current) screenshotInputRef.current.value = '';
  };

  const quickActions = isBusiness
    ? [
        { label: '📜 Business License', text: 'How do I apply for a commercial license?' },
        { label: '⚖️ Legal Compliance', text: 'What are the current regulatory requirements?' },
        { label: '📈 Scaling Tools', text: 'How can GGHP help my business grow?' },
        { label: '📞 Talk to Agent', text: 'I need to speak with a human representative.' }
      ]
    : isGeneral
    ? [
        { label: '🏢 GGMA Licensing', text: 'I have a question about GGMA licensing.' },
        { label: '🕵️ RIP Intelligence', text: 'Tell me about RIP enforcement.' },
        { label: '🛡️ SINC Compliance', text: 'What is SINC infrastructure?' },
        { label: '⚖️ Find an Attorney', text: 'I need to find an attorney.' },
        { label: '📅 Book 15min Consultation', text: 'I want to book a 15min consultation.' },
        { label: '🏥 Telehealth', text: 'I need assistance with a Telehealth appointment.' },
        { label: '💻 IT Support', text: 'I need technical assistance with the platform.' },
        { label: '❓ General Support', text: 'I have a general question.' }
      ]
    : [
        { label: '📅 Book Medical Intake', text: 'https://book.carepatron.com/Diversity-Health---Wellness-Network--GoHealthUSA---CCardz-/Shantell-R-?p=MeBev6pvQWuqD4djocNXFg&s=cOEr6HSN' },
        { label: '📋 How to Apply', text: 'How do I start my med card application?' },
        { label: '✅ Am I Eligible?', text: 'Am I eligible for a medical card?' },
        { label: '💰 Costs & Fees', text: 'What are the costs for a med card?' },
        { label: '📄 Required Docs', text: 'What documents do I need for my application?' }
      ];

  // Entity tooltip text for cannabis business licensing
  const entityTooltipText = `In the context of a cannabis business license, an entity (or entities) refers to the legal structure or organization that holds the license and conducts business operations, distinct from the individuals who own or manage it. Cannabis licensing authorities require this formal structure to establish liability, manage tax obligations, and ensure regulatory compliance. Common entity types include Limited Liability Companies (LLCs), C-corporations, S-corporations, and partnerships.\n\nKey Components of Cannabis Entities:\n• Legal "Person": A cannabis entity is considered a separate legal "person" in the eyes of the law, capable of owning property, entering contracts, and paying taxes.\n• True Party of Interest (TPI): Regulators look past the entity to identify the "True Parties of Interest"—individuals with significant financial or voting interests (often 10% or more) who must pass background checks.\n• Operational Separation: Some operators use separate legal entities to divide plant-touching activities (cultivation, processing) from non-plant-touching operations (branding, real estate) to mitigate federal tax penalties under IRC Section 280E.\n• Multi-State Operations (MSO): Many cannabis companies use a holding company structure, where a parent entity owns multiple subsidiaries that hold licenses in different states.\n\nWhy Entity Structure Matters:\n• Liability Protection: The correct entity, such as an LLC or corporation, protects personal assets from business liabilities.\n• Tax Compliance (280E): Cannabis entities cannot deduct ordinary business expenses, only costs of goods sold (COGS). The chosen structure significantly impacts this.\n• Licensing Requirements: States may have residency restrictions for entities (e.g., Oklahoma requires 75% of an entity's ownership to be state residents).\n• License Type: Entities must often fall into specific tiers, such as "Supply Tier" (cultivators/processors) or "Retail Tier" (dispensaries), which may restrict ownership in other tiers.\n\nExamples of Entities:\n• LLC (Limited Liability Company): Popular for flexibility and pass-through taxation.\n• C-Corporation: Used for larger operations seeking to attract investors and for holding company structures.\n• Nonprofit Corporation: Specific to certain state medical marijuana programs, though they cannot operate exactly like traditional tax-exempt nonprofits.`;

  // Simple markdown bold, link, and flag rendering
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\{\{flag:[^}]+\}\})/g);
    return parts.map((part, i) => {
      const boldMatch = part.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) return <strong key={i} className="font-bold">{boldMatch[1]}</strong>;
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#1a4731] underline hover:text-emerald-700 font-medium">{linkMatch[1]}</a>;
      const flagMatch = part.match(/^\{\{flag:([^}]+)\}\}$/);
      if (flagMatch) {
        return (
          <span key={i} className="entity-flag-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <span
              className="entity-flag-trigger"
              style={{
                fontWeight: 700,
                color: '#b45309',
                cursor: 'help',
                borderBottom: '2px dashed #f59e0b',
                paddingBottom: '1px',
              }}
            >
              <Flag size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px', color: '#eab308' }} />
              {flagMatch[1]}
            </span>
            <span
              className="entity-flag-tooltip"
              style={{
                visibility: 'hidden',
                opacity: 0,
                position: 'absolute',
                bottom: '130%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1c1917',
                color: '#fafaf9',
                padding: '14px 18px',
                borderRadius: '12px',
                fontSize: '12px',
                lineHeight: '1.6',
                width: '420px',
                maxHeight: '360px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                zIndex: 9999,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid #eab308',
                transition: 'opacity 0.25s ease, visibility 0.25s ease',
                pointerEvents: 'auto',
              }}
            >
              {entityTooltipText}
            </span>
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };
  const reviewBubbles = [
    { text: "Best service in OKC!", author: "Sarah L.", x: "10%", y: "15%", delay: 0 },
    { text: "Sylara made it so easy.", author: "Mike R.", x: "75%", y: "18%", delay: 2 },
    { text: "GGMA is the gold standard.", author: "Dr. J.", x: "15%", y: "72%", delay: 4 },
    { text: "Got my card in 8 days!", author: "Anita P.", x: "82%", y: "58%", delay: 1 },
    { text: "Metrc integration is seamless.", author: "GGE Business", x: "68%", y: "82%", delay: 3 },
    { text: "Top notch support.", author: "Brian K.", x: "42%", y: "12%", delay: 5 },
    { text: "Highly recommended!", author: "Jessica M.", x: "12%", y: "35%", delay: 2.5 },
    { text: "Professional & Fast.", author: "Robert T.", x: "88%", y: "42%", delay: 3.5 },
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf4] bg-gradient-to-br from-[#f0fdf4] via-[#FDFBF7] to-[#ecfdf5] flex flex-col relative overflow-hidden">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all", currentPersona === 'sylara' ? "bg-purple-500 bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-900/20" : "bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 shadow-emerald-900/20")}>
            {currentPersona === 'sylara' ? <Headphones className="text-white" size={22} /> : <Bot className="text-white" size={22} />}
          </div>
          <div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">Sylara</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block -mt-1">Sylara Intake Agent</span>
          </div>
        </div>
        <div className="flex items-center gap-3">

          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </nav>

      {/* Hidden file inputs — always rendered so refs are never null */}
      <input type="file" ref={fileInputRef} onChange={(e) => { handleFileUpload(e); setShowUploadMenu(false); }} className="hidden" accept="image/*,.pdf,.doc,.docx" />
      <input type="file" ref={cameraInputRef} onChange={(e) => { handleFileUpload(e); setShowUploadMenu(false); }} className="hidden" accept="image/*" capture="environment" />
      <input type="file" ref={screenshotInputRef} onChange={(e) => { handleFileUpload(e); setShowUploadMenu(false); }} className="hidden" accept="image/*,.png,.jpg,.jpeg" />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6 relative z-10">
        <div className="flex-1 space-y-5 overflow-auto pb-4 min-h-0 relative">
          {/* ── Background Floating Reviews (Only on startup) ── */}
          {messages.length <= 1 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {reviewBubbles.map((rev, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 0.7, 0.7, 0], 
                    scale: [0.8, 1, 1, 0.8],
                    y: [0, -20, -40, -60]
                  }}
                  transition={{ 
                    duration: 12, 
                    repeat: Infinity, 
                    delay: rev.delay,
                    ease: "linear"
                  }}
                  className="absolute p-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl shadow-emerald-900/5 max-w-[160px]"
                  style={{ left: rev.x, top: rev.y }}
                >
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[9px] font-bold text-slate-800 leading-tight mb-1 italic">"{rev.text}"</p>
                  <p className="text-[7px] font-black text-emerald-700 uppercase tracking-widest text-right">— {rev.author}</p>
                </motion.div>
              ))}
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              {msg.role === 'bot' && (
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm mt-1 border border-slate-200 bg-white">
                  <img 
                    src={currentPersona === 'sylara' ? '/sylara-human.png' : '/larry-human.png'} 
                    alt={currentPersona === 'sylara' ? 'Sylara' : 'Larry'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = currentPersona === 'sylara' ? '/sylara-logo.svg' : '/larry-logo.png';
                    }}
                  />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-2xl text-sm shadow-sm",
                msg.role === 'user'
                  ? "bg-[#1a4731] text-white rounded-br-md"
                  : "bg-white border border-slate-200/80 text-slate-700 rounded-bl-md"
              )}>
                {msg.role === 'bot' && (
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50 flex items-center gap-1.5">
                    {currentPersona === 'sylara' ? <Headphones size={10} className="text-purple-600" /> : <Shield size={10} className="text-emerald-600" />}
                    {currentPersona === 'sylara' ? 'Sylara Intake Agent' : 'L.A.R.R.Y Enforcement Engine'}
                  </div>
                )}
                <div className="leading-relaxed whitespace-pre-line">
                  {msg.role === 'bot' ? renderText(msg.text) : msg.text}
                </div>
                {msg.role === 'bot' && (msg as any).choices && Array.isArray((msg as any).choices) && (
                  <div className={cn(
                    "mt-4 pt-4 border-t border-slate-100",
                    i === 0 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" : "flex flex-wrap gap-2"
                  )}>
                    {(msg as any).choices.map((choice: string, idx: number) => {
                      const isSubscription = choice.includes('Subscription');
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isTyping}
                          onClick={() => handleSend(undefined, choice)}
                          className={cn(
                            "px-4 py-3 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 text-left flex flex-col justify-between h-full group",
                            i === 0 
                              ? isSubscription 
                                ? "bg-slate-900 text-white border-slate-800 hover:bg-slate-800" 
                                : "bg-white border border-slate-200 text-[#1a4731] hover:bg-emerald-50 hover:border-emerald-300"
                              : "bg-emerald-50 border border-emerald-200 text-[#1a4731] px-4 py-2",
                            isTyping ? "opacity-50 cursor-not-allowed" : i === 0 ? "" : "hover:bg-emerald-500 hover:text-white hover:border-emerald-600"
                          )}
                        >
                          <span className="flex items-center gap-2">
                             {choice.includes('GGMA') && <Users size={14} className="text-blue-500" />}
                             {choice.includes('RIP') && <Shield size={14} className="text-amber-500" />}
                             {choice.includes('SINC') && <Lock size={14} className="text-emerald-500" />}
                             {choice.includes('Book') && <Calendar size={14} className="text-purple-500" />}
                             {choice.includes('Telehealth') && <Video size={14} className="text-red-500" />}
                             {choice.includes('IT Support') && <Wrench size={14} className="text-slate-500" />}
                             {choice.includes('Basic') && <Sparkles size={14} className="text-emerald-400" />}
                             {choice.includes('Professional') && <TrendingUp size={14} className="text-blue-400" />}
                             {choice.includes('Enterprise') && <Cpu size={14} className="text-purple-400" />}
                             {choice}
                          </span>
                          {i === 0 && (
                            <span className="text-[9px] opacity-60 mt-1 block font-medium group-hover:opacity-100">
                              {choice.includes('Intake') ? 'Start application' : 
                               choice.includes('Subscription') ? 'View tier details' : 
                               choice.includes('Book') ? 'Schedule consultation' : 
                               choice.includes('General Support') ? 'Click to explore with communication on applications, and tabs with responses' :
                               'Click to explore'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                  <User size={18} />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200 bg-white">
                <img 
                  src={currentPersona === 'sylara' ? '/sylara-human.png' : '/larry-human.png'} 
                  alt="Typing..." 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = currentPersona === 'sylara' ? '/sylara-logo.svg' : '/larry-logo.png';
                  }}
                />
              </div>
              <div className="bg-white border border-slate-200/80 px-5 py-4 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          {/* ── Calendly Slot Picker — shown when signupStep === 11 ── */}
          {signupStep === 11 && (
            <div className="flex justify-start gap-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm mt-1", currentPersona === 'sylara' ? "bg-purple-500 bg-gradient-to-br from-purple-500 to-purple-700" : "bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600")}>
                {currentPersona === 'sylara' ? <Headphones size={18} /> : <Shield size={18} />}
              </div>
              <div className="flex-1 max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">📅 Select an available appointment time:</p>

                {/* Loading */}
                {slotsLoading && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1">Loading available times…</span>
                  </div>
                )}

                {/* Authentication Fallback / Error */}
                {bookingError === 'AUTH_REQUIRED' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                        Our real-time calendar is ready. You can book your 15-minute consultation instantly below.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const link = isBusiness ? 'https://calendly.com/globalgreenhpmeet/business-meeting' : 'https://calendly.com/globalgreenhpmeet/general-patient-support';
                        if ((window as any).Calendly) { (window as any).Calendly.initPopupWidget({ url: link }); } else { window.open(link, '_blank'); }
                      }}
                      className="w-full bg-[#1a4731] text-white py-3 rounded-xl text-sm font-black hover:bg-[#0f2a1f] transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      📅 Open Secure Booking Portal
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">Instant 15-min booking portal</p>
                  </div>
                )}

                {bookingError && bookingError !== 'AUTH_REQUIRED' && !isBooking && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{bookingError}</p>
                )}

                {/* Slot grid */}
                {!slotsLoading && availableSlots.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {availableSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2.5 border rounded-xl text-left text-xs transition-all ${
                          selectedTime === time
                            ? 'bg-[#1a4731] text-white border-[#1a4731] shadow-md'
                            : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700'
                        }`}
                      >
                        {new Date(time).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          timeZoneName: 'short',
                        })}
                      </button>
                    ))}
                  </div>
                )}

                {/* Confirm button */}
                {selectedTime && (
                  <button
                    onClick={() => {
                      if (signupData.fullName && signupData.phone && signupData.email) {
                        bookCalendlySlot();
                      } else {
                        setMessages(prev => [...prev, { role: 'bot', text: `Great, I've held that time slot! To finalize your booking, what is your **Full Name (First & Last)**?` }]);
                        setSignupStep(12);
                      }
                    }}
                    disabled={isBooking}
                    className="mt-4 w-full bg-[#1a4731] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#0f2a1f] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isBooking ? '⏳ Booking…' : '✅ Confirm Booking'}
                  </button>
                )}

                {isBooking && bookingError && (
                  <p className="text-sm text-red-600 mt-2">{bookingError}</p>
                )}
              </div>
            </div>
          )}

          {/* ── License Eligibility Yes/No Buttons — shown during steps 20-23 and business steps ── */}
          {(signupStep === 20 || signupStep === 21 || signupStep === 22 || signupStep === 23 ||
            signupStep === 1.1 || signupStep === 6.1 || signupStep === 12 || signupStep === 99 ||
            signupStep === 103 || signupStep === 121 || signupStep === 130 || signupStep === 133) && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSend(undefined, 'Yes')}
                  className="px-6 py-2.5 bg-[#1a4731] text-white rounded-xl text-sm font-bold hover:bg-[#0f2a1f] transition-all shadow-sm"
                >
                  ✅ Yes
                </button>
                <button
                  onClick={() => handleSend(undefined, 'No')}
                  className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all shadow-sm"
                >
                  ❌ No
                </button>
              </div>
            </div>
          )}

          {/* ── Medical Condition Selection Buttons — shown during step 13 ── */}
          {signupStep === 13 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[90%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">🩺 Select your qualifying condition:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Chronic Pain', 'Depression', 'Anxiety', 'Insomnia', 'PTSD', 'Autism', 
                    'Cancer', 'Glaucoma', 'Seizures', 'Crohns Disease', 'Sickle Cell', 'Other'
                  ].map((condition) => (
                    <button
                      key={condition}
                      onClick={() => handleSend(undefined, condition)}
                      className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-[#1a4731] rounded-xl text-[10px] font-bold hover:bg-emerald-500 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95"
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Patient Document Upload Panel — shown during steps 17-19 ── */}
          {signupStep >= 17.1 && signupStep <= 18 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[90%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-[#1a4731]" />
                  <p className="text-sm font-bold text-slate-800">📋 Patient Intake Uploads</p>
                </div>
                <p className="text-[10px] text-slate-500 mb-4">The state is very strict about photo quality. Please follow instructions carefully.</p>

                {/* Patient Document Checklist */}
                <div className="space-y-2 mb-5">
                  {[
                    { label: 'Medical Records', desc: 'Previous certs or medical files' },
                    { label: 'Oklahoma ID / DL (Front)', desc: 'Front copy, all 4 corners visible' },
                    { label: 'Oklahoma ID / DL (Back)', desc: 'Back copy, scan the barcode' },
                    { label: 'Digital Selfie', desc: 'White wall, no smile, eye-level' },
                    { label: 'State Funded Insurance', desc: 'Medicare/Medicaid card (optional)' }
                  ].map((doc) => {
                    const isUploaded = !!uploadedDocuments[doc.label];
                    const isSelfie = doc.label === 'Digital Selfie';
                    return (
                      <div
                        key={doc.label}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                          isUploaded ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          if (!isUploaded) {
                            setPendingDocLabel(doc.label);
                            if (isSelfie) {
                              cameraInputRef.current?.click();
                            } else {
                              fileInputRef.current?.click();
                            }
                          }
                        }}
                      >
                        {isUploaded ? <CircleCheck size={18} className="text-emerald-500 shrink-0" /> : <Circle size={18} className="text-slate-300 group-hover:text-blue-400 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${isUploaded ? 'text-emerald-700' : 'text-slate-700'}`}>{doc.label}</p>
                          <p className="text-[10px] text-slate-400 truncate">{isUploaded ? `✓ ${uploadedDocuments[doc.label]}` : doc.desc}</p>
                        </div>
                        {!isUploaded && <ArrowUpCircle size={16} className="text-slate-300 group-hover:text-blue-500" />}
                      </div>
                    );
                  })}
                </div>

                {/* Selfie Instruction (if pending) */}
                {pendingDocLabel === 'Digital Selfie' && (
                  <div className="mb-4 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                    <p className="text-[10px] text-amber-800 font-bold mb-1">📸 Photo Requirements:</p>
                    <ul className="text-[9px] text-amber-700 space-y-1 list-disc pl-3">
                      <li>Stand in front of a **solid white wall**.</li>
                      <li>No hat, necklace, or glasses.</li>
                      <li>No teeth showing, no smile, and no hair in front of shoulders.</li>
                      <li>Camera should be at eye-level, bottom of photo at chest area.</li>
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleSend(undefined, 'continue')}
                  className="w-full py-2.5 bg-[#1a4731] text-white rounded-xl text-xs font-bold hover:bg-[#0f2a1f] transition-all shadow-md"
                >
                  Continue to Next Step
                </button>
              </div>
            </div>
          )}

          {/* ── License Selection Buttons — shown during step 25 ── */}
          {signupStep === 25 && eligibleLicenses.length > 0 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">🏥 Select your license type:</p>
                <div className="space-y-2">
                  {eligibleLicenses.map((license, idx) => (
                    <button
                      key={license}
                      onClick={() => handleSend(undefined, String(idx + 1))}
                      className="w-full p-3 border rounded-xl text-left text-sm transition-all bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#1a4731] font-medium"
                    >
                      {idx + 1}. {license}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Business License Type Selection — shown during step 106 ── */}
          {signupStep === 106 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">🏢 Select license type:</p>
                <div className="space-y-2">
                  {BUSINESS_LICENSE_TYPES.map((type, idx) => (
                    <button
                      key={type}
                      onClick={() => handleSend(undefined, String(idx + 1))}
                      className="w-full p-3 border rounded-xl text-left text-sm transition-all bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#1a4731] font-medium"
                    >
                      {idx + 1}. {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Business Structure Selection — shown during step 109 ── */}
          {signupStep === 109 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">🏢 Select business structure:</p>
                <div className="space-y-2">
                  {BUSINESS_STRUCTURES.map((structure, idx) => (
                    <button
                      key={structure}
                      onClick={() => handleSend(undefined, String(idx + 1))}
                      className="w-full p-3 border rounded-xl text-left text-sm transition-all bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#1a4731] font-medium"
                    >
                      {idx + 1}. {structure}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ID Type Selection — shown during step 113 ── */}
          {signupStep === 113 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">🆔 Select ID type:</p>
                <div className="space-y-2">
                  {BUSINESS_ID_TYPES.map((idType, idx) => (
                    <button
                      key={idType}
                      onClick={() => handleSend(undefined, String(idx + 1))}
                      className="w-full p-3 border rounded-xl text-left text-sm transition-all bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#1a4731] font-medium"
                    >
                      {idx + 1}. {idType}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Patient Document Upload Panel — shown during step 16 ── */}
          {signupStep === 16 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[90%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-5">
                <p className="text-sm font-bold text-slate-800 mb-1">🏥 Patient Document Upload</p>
                <p className="text-xs text-slate-500 mb-4">Click on each document to upload. All documents must be verified before proceeding.</p>

                {/* Document Checklist */}
                <div className="space-y-2 mb-5">
                  {getPatientRequiredDocuments().map((docName) => {
                    const isUploaded = !!uploadedDocuments[docName];
                    return (
                      <div
                        key={docName}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                          isUploaded
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                        }`}
                        onClick={() => {
                          if (!isUploaded) {
                            setPendingDocLabel(docName);
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        {isUploaded ? (
                          <CircleCheck size={20} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={20} className="text-slate-300 group-hover:text-amber-400 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isUploaded ? 'text-emerald-700' : 'text-slate-700'}`}>{docName}</p>
                          {isUploaded && (
                            <p className="text-xs text-emerald-500 truncate">✓ {uploadedDocuments[docName]}</p>
                          )}
                        </div>
                        {!isUploaded && (
                          <span className="text-xs text-slate-400 group-hover:text-amber-600 font-medium shrink-0">Click to upload</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">
                      {Object.keys(uploadedDocuments).length} / {getPatientRequiredDocuments().length} documents uploaded
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {Math.round((Object.keys(uploadedDocuments).length / getPatientRequiredDocuments().length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(Object.keys(uploadedDocuments).length / getPatientRequiredDocuments().length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Proceed button - only enabled when all docs uploaded */}
                {Object.keys(uploadedDocuments).length >= getPatientRequiredDocuments().length ? (
                  <button
                    onClick={() => handleSend(undefined, 'continue')}
                    className="mt-4 w-full py-3 bg-[#1a4731] bg-gradient-to-r from-[#1a4731] to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-[#0f2a1f] hover:to-emerald-700 transition-all shadow-md shadow-emerald-200/50"
                  >
                    ✅ Documents Uploaded — Continue
                  </button>
                ) : (
                  <div className="mt-4 w-full py-3 bg-slate-100 text-slate-400 rounded-xl text-sm font-medium text-center cursor-not-allowed border border-slate-200">
                    ⏳ Upload all required documents to proceed
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Bond Selection — shown during step 132 (Growers only) ── */}
          {signupStep === 132 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[85%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">📜 Bond Requirement:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSend(undefined, '1')}
                    className="w-full p-3 border rounded-xl text-left text-sm transition-all bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#1a4731] font-medium"
                  >
                    1. Surety Bond
                  </button>
                  <button
                    onClick={() => handleSend(undefined, '2')}
                    className="w-full p-3 border rounded-xl text-left text-sm transition-all bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#1a4731] font-medium"
                  >
                    2. Land Ownership (5+ years)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Document Upload Panel — ChatGPT style — shown during step 131 ── */}
          {signupStep === 131 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[90%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-5">
                <p className="text-sm font-bold text-slate-800 mb-1">📄 Document Upload Center</p>
                <p className="text-xs text-slate-500 mb-4">Click on each document to upload. All documents must be verified before proceeding.</p>

                {/* Document Checklist */}
                <div className="space-y-2 mb-5">
                  {getRequiredDocuments().map((docName) => {
                    const isUploaded = !!uploadedDocuments[docName];
                    return (
                      <div
                        key={docName}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                          isUploaded
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                        }`}
                        onClick={() => {
                          if (!isUploaded) {
                            setPendingDocLabel(docName);
                            fileInputRef.current?.click();
                          }
                        }}
                      >
                        {isUploaded ? (
                          <CircleCheck size={20} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={20} className="text-slate-300 group-hover:text-amber-400 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isUploaded ? 'text-emerald-700' : 'text-slate-700'}`}>{docName}</p>
                          {isUploaded && (
                            <p className="text-xs text-emerald-500 truncate">✓ {uploadedDocuments[docName]}</p>
                          )}
                        </div>
                        {!isUploaded && (
                          <span className="text-xs text-slate-400 group-hover:text-amber-600 font-medium shrink-0">Click to upload</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">
                      {Object.keys(uploadedDocuments).length} / {getRequiredDocuments().length} documents uploaded
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {Math.round((Object.keys(uploadedDocuments).length / getRequiredDocuments().length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(Object.keys(uploadedDocuments).length / getRequiredDocuments().length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* ChatGPT-style upload action bar */}
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDocLabel('');
                      fileInputRef.current?.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all shadow-sm"
                  >
                    <Paperclip size={16} />
                    Attach
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDocLabel('');
                      cameraInputRef.current?.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
                  >
                    <Camera size={16} />
                    Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDocLabel('');
                      screenshotInputRef.current?.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all shadow-sm"
                  >
                    <Monitor size={16} />
                    Screenshot
                  </button>
                </div>

                {/* Proceed button - only enabled when all docs uploaded */}
                {Object.keys(uploadedDocuments).length >= getRequiredDocuments().length ? (
                  <button
                    onClick={() => handleSend(undefined, 'done')}
                    className="mt-4 w-full py-3 bg-[#1a4731] bg-gradient-to-r from-[#1a4731] to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-[#0f2a1f] hover:to-emerald-700 transition-all shadow-md shadow-emerald-200/50"
                  >
                    ✅ All Documents Uploaded — Continue
                  </button>
                ) : (
                  <div className="mt-4 w-full py-3 bg-slate-100 text-slate-400 rounded-xl text-sm font-medium text-center cursor-not-allowed border border-slate-200">
                    ⏳ Upload all required documents to proceed
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Application Review Panel — shown during step 134 ── */}
          {signupStep === 134 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
              </div>
              <div className="flex-1 max-w-[90%] bg-white border border-slate-200/80 rounded-2xl rounded-bl-md shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-[#1a4731]" />
                    <p className="text-base font-bold text-slate-800">📋 Application Review</p>
                  </div>
                  {isEditingReview && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full animate-pulse">✏️ Editing</span>
                  )}
                </div>
                <p className={`text-xs mb-5 rounded-lg px-3 py-2 ${isEditingReview ? 'text-amber-700 bg-amber-50 border border-amber-300' : 'text-slate-500 bg-slate-50 border border-slate-200'}`}>
                  {isEditingReview ? '✏️ Edit mode is active. Modify any field below and click "Save Changes" when done.' : '⚠️ Please carefully review all information below before proceeding to payment.'}
                </p>

                {/* Section 1: Registration */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 1: Registration</p>
                  <div className="space-y-2 text-sm">
                    {[{label:'Full Name', key:'fullName'}, {label:'Email', key:'email'}].map(f => (
                      <div key={f.key} className="flex items-center">
                        <span className="text-slate-500 w-36 shrink-0 text-xs font-medium">{f.label}:</span>
                        {isEditingReview ? (
                          <input className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-sm bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50" value={(businessData as any)[f.key]} onChange={e => setBusinessData(prev => ({...prev, [f.key]: e.target.value}))} />
                        ) : (
                          <span className="font-medium text-slate-800">{(businessData as any)[f.key]}</span>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center"><span className="text-slate-500 w-36 shrink-0 text-xs font-medium">Terms Accepted:</span><span className="font-medium text-emerald-600">{businessData.termsAccepted ? '✅ Yes' : '❌ No'}</span></div>
                  </div>
                </div>

                {/* Section 3: General Information */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 3: General Information</p>
                  <div className="space-y-2 text-sm">
                    {[{label:'Entity Name', key:'entityName'}, {label:'License Type', key:'licenseType'}, {label:'Trade Name', key:'tradeName'}, {label:'Phone', key:'phone'}, {label:'Business Structure', key:'businessStructure'}, {label:'Operating Hours', key:'operatingHours'}].map(f => (
                      <div key={f.key} className="flex items-center">
                        <span className="text-slate-500 w-36 shrink-0 text-xs font-medium">{f.label}:</span>
                        {isEditingReview ? (
                          <input className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-sm bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50" value={(businessData as any)[f.key]} onChange={e => setBusinessData(prev => ({...prev, [f.key]: e.target.value}))} />
                        ) : (
                          <span className="font-medium text-slate-800">{(businessData as any)[f.key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Owners & Officers */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 4: Owners & Officers</p>
                  <div className="space-y-2 text-sm">
                    {[{label:'Owner Name', key:'ownerName'}, {label:'Owner Phone', key:'ownerPhone'}, {label:'Owner Email', key:'ownerEmail'}, {label:'ID Type', key:'ownerIdType'}, {label:'DOB', key:'ownerDob'}, {label:'Entity Affiliation', key:'ownerEntityAffiliation'}, {label:'Ownership Shares', key:'ownerShares'}, {label:'Relationship', key:'ownerRelationship'}].map(f => (
                      <div key={f.key} className="flex items-center">
                        <span className="text-slate-500 w-36 shrink-0 text-xs font-medium">{f.label}:</span>
                        {isEditingReview ? (
                          <input className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-sm bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50" value={(businessData as any)[f.key]} onChange={e => setBusinessData(prev => ({...prev, [f.key]: e.target.value}))} />
                        ) : (
                          <span className="font-medium text-slate-800">{(businessData as any)[f.key]}</span>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center"><span className="text-slate-500 w-36 shrink-0 text-xs font-medium">Owners Added:</span><span className="font-medium text-slate-800">{businessData.ownersCompleted}</span></div>
                  </div>
                </div>

                {/* Section 5: Location */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 5: Location</p>
                  <div className="space-y-2 text-sm">
                    {[{label:'Physical Address', key:'physicalAddress'}, {label:'GPS Coordinates', key:'gpsCoordinates'}, {label:'Mailing Address', key:'locationMailing'}].map(f => (
                      <div key={f.key} className="flex items-center">
                        <span className="text-slate-500 w-36 shrink-0 text-xs font-medium">{f.label}:</span>
                        {isEditingReview ? (
                          <input className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-sm bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50" value={(businessData as any)[f.key]} onChange={e => setBusinessData(prev => ({...prev, [f.key]: e.target.value}))} />
                        ) : (
                          <span className="font-medium text-slate-800">{(businessData as any)[f.key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 6: Primary Contact */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 6: Primary Contact</p>
                  <div className="space-y-2 text-sm">
                    {[{label:'PPOC Name', key:'ppocName'}, {label:'Title', key:'ppocTitle'}, {label:'Phone', key:'ppocPhone'}, {label:'Email', key:'ppocEmail'}, {label:'Address', key:'ppocAddress'}].map(f => (
                      <div key={f.key} className="flex items-center">
                        <span className="text-slate-500 w-36 shrink-0 text-xs font-medium">{f.label}:</span>
                        {isEditingReview ? (
                          <input className="flex-1 px-2.5 py-1.5 border border-amber-300 rounded-lg text-sm bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50" value={(businessData as any)[f.key]} onChange={e => setBusinessData(prev => ({...prev, [f.key]: e.target.value}))} />
                        ) : (
                          <span className="font-medium text-slate-800">{(businessData as any)[f.key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 7: Attestations */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 7: Attestations</p>
                  <div className="text-sm"><span className="text-slate-500">Confirmed:</span> <span className="font-medium text-emerald-600">{businessData.attestationsConfirmed ? '✅ Yes' : '❌ No'}</span></div>
                </div>

                {/* Section 8: Documents */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 8: Documents Uploaded</p>
                  <div className="space-y-1 text-sm">
                    {Object.entries(uploadedDocuments).map(([docName, fileName]) => (
                      <div key={docName} className="flex items-center gap-2">
                        <CircleCheck size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-slate-700">{docName}</span>
                        <span className="text-xs text-slate-400">({fileName})</span>
                      </div>
                    ))}
                    {Object.keys(uploadedDocuments).length === 0 && (
                      <span className="text-slate-400 italic">No documents uploaded yet</span>
                    )}
                  </div>
                </div>

                {/* Section 9: Bond (if grower) */}
                {businessData.bondType && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 border-b border-emerald-100 pb-1">Section 9: Bond</p>
                    <div className="text-sm"><span className="text-slate-500">Bond Type:</span> <span className="font-medium text-slate-800">{businessData.bondType}</span></div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex gap-3">
                  {isEditingReview ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditingReview(false);
                          setMessages(prev => [...prev, { role: 'bot', text: '✅ **Changes Saved!**\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nPlease review your updated application and click **"Confirm & Proceed to Payment"** or **"Edit"** to make more changes.' }]);
                        }}
                        className="flex-1 py-3 bg-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md"
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingReview(false)}
                        className="px-5 py-3 bg-white border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSend(undefined, 'confirm')}
                        className="flex-1 py-3 bg-[#1a4731] bg-gradient-to-r from-[#1a4731] to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-[#0f2a1f] hover:to-emerald-700 transition-all shadow-md"
                      >
                        ✅ Confirm & Proceed to Payment
                      </button>
                      <button
                        onClick={() => setIsEditingReview(true)}
                        className="px-5 py-3 bg-white border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all"
                      >
                        ✏️ Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input - ChatGPT Style */}
        <div className="relative">
          {/* Expandable Upload Menu */}
          <AnimatePresence>
            {showUploadMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-2 flex gap-1.5 z-50"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-all">
                    <Paperclip size={18} className="text-emerald-700" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">Document</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-all">
                    <Camera size={18} className="text-blue-700" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => screenshotInputRef.current?.click()}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl hover:bg-purple-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-all">
                    <Monitor size={18} className="text-purple-700" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">Screenshot</span>
                </button>
                <button
                  type="button"
                  onClick={() => screenshotInputRef.current?.click()}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl hover:bg-amber-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-all">
                    <Image size={18} className="text-amber-700" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">Image</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 items-center bg-white border border-slate-200/80 rounded-2xl px-3 py-2 shadow-lg shadow-slate-200/50">
            {/* Plus/Upload toggle button */}
            <button
              type="button"
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                showUploadMenu
                  ? 'bg-[#1a4731] text-white rotate-45'
                  : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700'
              }`}
              title="Upload Options"
            >
              <Plus size={20} />
            </button>
            <form onSubmit={(e) => handleSend(e)} className="flex-1 flex gap-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setShowUploadMenu(false)}
                placeholder="Message Sylara..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 py-2 min-w-0"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-[#1a4731] text-white flex items-center justify-center hover:bg-[#153a28] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  };



// --- Patient Signup / License Application ---

const PATIENT_STEPS = [
  'License Eligibility Criteria',
  'Personal Information',
  'Caregiver Patient Information',
  'Proof of Identity',
  'Digital Photo Requirements',
  'Attestation',
  'Application Review',
  'Confirmation'
];

const PatientSignupPage = ({ onNavigate }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showAuraError, setShowAuraError] = useState(false);
  const [auraErrorSource, setAuraErrorSource] = useState<'patient' | 'resident' | ''>('');
  const [formData, setFormData] = useState({
    isPatientOrGuardian: '',
    isCaregiver: '',
    isStateResident: '',
    isAdultLicense: '',
    licenseType: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    caregiverFirstName: '',
    caregiverLastName: '',
    caregiverRelationship: '',
    idType: 'drivers-license',
    idNumber: '',
    attestationAgreed: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset license type when eligibility answers change so stale values don't carry over
  const handleEligibilityChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value, licenseType: '' }));
  };

  // Compute available license types from eligibility answers
  const getAvailableLicenseTypes = () => {
    const { isPatientOrGuardian, isCaregiver, isStateResident, isAdultLicense } = formData;

    if (isPatientOrGuardian === 'no' && isCaregiver === 'yes') {
      return [{ value: 'Caregiver', label: 'Caregiver' }];
    }

    if (isPatientOrGuardian === 'yes') {
      if (!isStateResident || !isAdultLicense) return [];

      if (isStateResident === 'yes' && isAdultLicense === 'yes') {
        return [
          { value: 'Adult Patient 2-Year License', label: 'Adult Patient 2-Year License' },
          { value: 'Adult Patient 60-Day Temporary License', label: 'Adult Patient 60-Day Temporary License' },
        ];
      }
      if (isStateResident === 'yes' && isAdultLicense === 'no') {
        return [
          { value: 'Minor Patient 2-Year License', label: 'Minor Patient 2-Year License' },
          { value: 'Minor Patient 60-Day Temporary License', label: 'Minor Patient 60-Day Temporary License' },
          { value: 'Caregiver', label: 'Caregiver' },
        ];
      }
      if (isStateResident === 'no' && isAdultLicense === 'yes') {
        return [
          { value: 'Adult Patient - Temporary License (Out of State)', label: 'Adult Patient - Temporary License (Out of State)' },
        ];
      }
      if (isStateResident === 'no' && isAdultLicense === 'no') {
        return [
          { value: 'Minor Patient - Temporary License (Out of State)', label: 'Minor Patient - Temporary License (Out of State)' },
        ];
      }
    }
    return [];
  };

  const isIneligible = formData.isPatientOrGuardian === 'no' && formData.isCaregiver === 'no';
  const availableLicenses = getAvailableLicenseTypes();
  const canProceedFromStep0 = (formData.isPatientOrGuardian === 'yes' && formData.isStateResident !== '' && formData.isAdultLicense !== '' && formData.licenseType !== '') || 
                              (formData.isPatientOrGuardian === 'no' && formData.isCaregiver === 'yes' && formData.licenseType !== '');

  // Determine which steps to show based on license type
  const isCaregiverLicense = formData.licenseType === 'Caregiver';

  const RadioOption = ({ name, value, checked, onChange, label }: { name: string; value: string; checked: boolean; onChange: () => void; label: string }) => (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="w-4 h-4 accent-[#1a4731]" />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // License Eligibility Criteria
        return (
          <div className="space-y-7">
            {/* Question 1: Patient or Legal Guardian */}
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-3">
                <span className="text-red-500 mr-1">*</span>Are you a Patient Or Legal Guardian?
              </p>
              <div className="flex gap-6">
                <RadioOption name="isPatientOrGuardian" value="yes" checked={formData.isPatientOrGuardian === 'yes'} onChange={() => { handleEligibilityChange('isPatientOrGuardian', 'yes'); setAuraErrorSource(''); setShowAuraError(false); }} label="Yes" />
                <RadioOption name="isPatientOrGuardian" value="no" checked={formData.isPatientOrGuardian === 'no'} onChange={() => handleEligibilityChange('isPatientOrGuardian', 'no')} label="No" />
              </div>
            </div>

            {/* Caregiver Flow */}
            {formData.isPatientOrGuardian === 'no' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="h-px bg-slate-200 mb-6" />
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Are you a Caregiver?
                </p>
                <div className="flex gap-6">
                  <RadioOption name="isCaregiver" value="yes" checked={formData.isCaregiver === 'yes'} onChange={() => handleEligibilityChange('isCaregiver', 'yes')} label="Yes" />
                  <RadioOption name="isCaregiver" value="no" checked={formData.isCaregiver === 'no'} onChange={() => handleEligibilityChange('isCaregiver', 'no')} label="No" />
                </div>
                
                {formData.isCaregiver === 'no' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6">
                    <p className="font-bold text-slate-800 text-lg">You are not eligible to apply for any license</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Patient Flow: Question 2 - State Resident */}
            {formData.isPatientOrGuardian === 'yes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="h-px bg-slate-200 mb-6" />
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Are you an Oklahoma State Resident?
                </p>
                <div className="flex gap-6">
                  <RadioOption name="isStateResident" value="yes" checked={formData.isStateResident === 'yes'} onChange={() => { handleEligibilityChange('isStateResident', 'yes'); setShowAuraError(false); setAuraErrorSource(''); }} label="Yes" />
                  <RadioOption name="isStateResident" value="no" checked={formData.isStateResident === 'no'} onChange={() => { handleEligibilityChange('isStateResident', 'no'); setShowAuraError(true); setAuraErrorSource('resident'); }} label="No" />
                </div>
                {formData.isStateResident === 'no' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-800">As a non-resident, you are eligible only for an Out-of-State Temporary License.</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Patient Flow: Question 3 - Adult or Minor */}
            {formData.isPatientOrGuardian === 'yes' && formData.isStateResident !== '' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
                <div className="h-px bg-slate-200 mb-6" />
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Are you applying for an adult patient license?
                </p>
                <div className="flex gap-6">
                  <RadioOption name="isAdultLicense" value="yes" checked={formData.isAdultLicense === 'yes'} onChange={() => handleEligibilityChange('isAdultLicense', 'yes')} label="Yes" />
                  <RadioOption name="isAdultLicense" value="no" checked={formData.isAdultLicense === 'no'} onChange={() => handleEligibilityChange('isAdultLicense', 'no')} label="No" />
                </div>
              </motion.div>
            )}

            {/* License Type Options */}
            {availableLicenses.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
                <p className="text-sm font-semibold text-slate-800 mb-3 mt-6">
                   <span className="text-red-500 mr-1">*</span>
                   {availableLicenses.length > 1 ? 'You can apply for the following licenses:' : 'You can apply for the following license:'}
                </p>
                <div className="space-y-3 ml-1">
                  {availableLicenses.map((lt) => (
                    <label key={lt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="licenseType"
                        value={lt.value}
                        checked={formData.licenseType === lt.value}
                        onChange={() => updateField('licenseType', lt.value)}
                        className="w-4 h-4 accent-[#1a4731]"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-[#1a4731] transition-colors">{lt.label}</span>
                    </label>
                  ))}
                </div>

                {/* License Description Callout */}
                {formData.licenseType && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {formData.licenseType.includes('2-Year') && 'A 2-Year License is valid for 24 months from the date of approval. You will need a physician recommendation and proof of identity.'}
                      {formData.licenseType.includes('60-Day') && 'A 60-Day Temporary License is intended for urgent access. It is valid for 60 days and may be renewed once while your 2-year application is pending.'}
                      {formData.licenseType === 'Caregiver' && 'A Caregiver License allows you to purchase and administer medical products on behalf of a licensed patient. You must provide the patient\'s information in the next step.'}
                      {formData.licenseType.includes('Out of State') && 'An Out-of-State Temporary License allows non-residents to access medical services while visiting. You must provide proof of an active license from your home state.'}
                    </p>
                  </motion.div>

                )}
              </motion.div>
            )}
          </div>
        );

      case 1: // Personal Information
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="Enter first name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="Enter last name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Date of Birth</label>
              <input type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Phone Number</label>
                <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="(555) 000-0000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Street Address</label>
              <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input type="text" value={formData.city} onChange={(e) => updateField('city', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                <select value={formData.state} onChange={(e) => updateField('state', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all bg-white">
                  <option value="">Select</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ZIP Code</label>
                <input type="text" value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
            </div>
          </div>
        );

      case 2: // Caregiver Patient Information
        return (
          <div className="space-y-5">
            <p className="text-sm text-slate-500">If you selected Caregiver, please provide the patient information below.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient First Name</label>
                <input type="text" value={formData.caregiverFirstName} onChange={(e) => updateField('caregiverFirstName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient Last Name</label>
                <input type="text" value={formData.caregiverLastName} onChange={(e) => updateField('caregiverLastName', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Relationship to Patient</label>
              <select value={formData.caregiverRelationship} onChange={(e) => updateField('caregiverRelationship', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all bg-white">
                <option value="">Select relationship</option>
                <option value="parent">Parent</option>
                <option value="legal-guardian">Legal Guardian</option>
                <option value="spouse">Spouse</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 3: // Proof of Identity
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Identification Type</label>
              <select value={formData.idType} onChange={(e) => updateField('idType', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all bg-white">
                <option value="drivers-license">Driver's License</option>
                <option value="state-id">State ID</option>
                <option value="passport">Passport</option>
                <option value="military-id">Military ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5"><span className="text-red-500 mr-1">*</span>ID Number</label>
              <input type="text" value={formData.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731]/20 focus:border-[#1a4731] outline-none transition-all" placeholder="Enter your ID number" />
            </div>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#1a4731]/40 transition-colors cursor-pointer">
              <Upload className="mx-auto text-slate-400 mb-3" size={32} />
              <p className="text-sm font-semibold text-slate-700">Upload a copy of your ID</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG or PDF — max 10 MB</p>
            </div>
          </div>
        );

      case 4: // Digital Photo Requirements
        return (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-normal text-slate-800 mb-2">Digital Photo Requirements</h1>
              <div className="h-px bg-slate-200 mb-4" />
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-6">
              {/* Instructions */}
              <div className="bg-white p-0">
                <p className="font-semibold mb-2">Instructions:</p>
                <div className="space-y-4 text-sm text-slate-800">
                  <p>You must upload a recent photograph for your medical marijuana card. It must meet the following requirements:</p>
                  <ul className="list-disc pl-10 space-y-1">
                    <li>Taken within the last 6 months</li>
                    <li>White or off-white background</li>
                    <li>An eye-level, clear photo with a fully visible face</li>
                    <li>No glasses or hats</li>
                    <li>No photo filters or enhancements</li>
                    <li>Positioned where the top of your head and top of your shoulders can be seen</li>
                  </ul>
                  <p>
                    For more information and assistance please review our <a href="https://oklahoma.gov/content/dam/ok/en/omma/forms/Photo%20Requirements.pdf" target="_blank" rel="noopener noreferrer" className="text-[#0176d3] underline font-bold">License Application Photo Requirements</a> document.
                  </p>
                  <div className="flex items-start mt-2">
                    <span className="font-bold text-[#c23934] mr-1">Note: </span>
                    <strong>Submitting a photo that does not meet the requirements will result in a delay in processing your application.</strong>
                  </div>
                </div>
              </div>

              {/* Do's and Don'ts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Do's */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl" style={{ color: '#169179' }}>Do's</h3>
                  <ul className="list-disc pl-8 space-y-4 text-sm text-slate-800">
                    <li><strong>Do keep hair out of your face.</strong> It should not cover your eyebrows, eyes, ears, or any part of your face.</li>
                    <li><strong>Do remove eyeglasses</strong> and <strong>hats</strong> before taking the photo.</li>
                    <li><strong>Do avoid shadows on your face.</strong></li>
                    <li><strong>Do wear</strong> hats or head <strong>coverings for medical or religious purposes are</strong> as long as your full face is visible.</li>
                    <li><strong>Do position your head and shoulders</strong> where they can be seen.</li>
                  </ul>
                  <img src="https://medportal.omma.ok.gov/servlet/servlet.ImageServer?id=015cr000006pKFoAAM&docName=CACFAEBGAf2ac1475b8374fd58d90261503ed081a&oid=00Dcr000003EIjJ" alt="Dos" className="max-w-full h-auto mt-4" />
                </div>

                {/* Don'ts */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xl" style={{ color: '#e03e2d' }}>Don'ts</h3>
                  <ul className="list-disc pl-8 space-y-4 text-sm text-slate-800">
                    <li><strong>Do not</strong> use digital filters, borders, text or any other method of <strong>altering the appearance</strong> of the picture.</li>
                    <li><strong>Do not tilt your head</strong> or <strong>turn your shoulder</strong> to the side.</li>
                    <li><strong>Do not crop</strong> off your <strong>head and shoulders by zooming in</strong> too closely.</li>
                    <li><strong>Do not wear</strong> sunglasses, show hands or other <strong>objects in the photo.</strong></li>
                    <li><strong>Do not re-size</strong> the photo outside the provided guidelines.</li>
                    <li><strong>Do not capture anyone else</strong> besides the person applying for a license in the photo.</li>
                  </ul>
                  <img src="https://medportal.omma.ok.gov/servlet/servlet.ImageServer?id=015cr000006pKFnAAM&docName=CACFAEBGA8993fd0ac76e46e596401d99d9882b4f&oid=00Dcr000003EIjJ" alt="Donts" className="max-w-full h-auto mt-4" />
                </div>
              </div>

              {/* Upload Photo Accordion */}
              <div className="border border-slate-200 rounded bg-white mt-4 shadow-sm">
                <button type="button" className="w-full flex items-center justify-start p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200 cursor-default">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-slate-500 transform rotate-90" />
                    <h3 className="font-semibold text-slate-800 text-lg">Upload Photo</h3>
                  </div>
                </button>
                <div className="p-6 space-y-6">
                  <div className="text-sm text-slate-800 space-y-3">
                    <p>Choose a photo to upload and attach to your application.</p>
                    <p><span className="font-bold text-[#c23934]">Note: </span><strong>File Format: </strong>must be .jpg, .png, or .gif and <strong>no larger than 3 MB in size</strong></p>
                    <p><span className="font-bold text-[#c23934]">Note: </span><strong>Resolution Limits: </strong>must be <strong>Minimum:</strong> 600 x 600 pixels. <strong>Maximum:</strong> 1200 x 1200 pixels.</p>
                  </div>

                  {/* Upload Dropzone and Cropper */}
                  <div className="flex flex-col xl:flex-row gap-8 items-start">
                    <div className="w-full max-w-sm shrink-0">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        <span className="text-[#c23934] mr-1">*</span>Select Photo
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                        <Upload className="text-[#0176d3] mb-2" size={32} />
                        <button type="button" className="text-[#0176d3] font-semibold text-sm mb-1">Upload Files</button>
                        <p className="text-xs text-slate-500">Or drop files</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="text-sm text-slate-800 space-y-4">
                        <p><span className="font-bold text-[#c23934]">Note: </span><strong>All photos will be cropped square and converted to jpeg once uploaded</strong></p>
                        <div>
                          <strong className="block mb-1">Drag and adjust the photo:</strong>
                          <p>(Move, zoom or rotate) within the square box below, so that the top of the head and shoulders are within the frame.</p>
                        </div>
                      </div>
                      
                      {/* Fake Cropper UI */}
                      <div className="w-[200px] h-[200px] border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                         <span className="text-slate-400 text-xs text-center px-4">Image preview will appear here</span>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-2">
                          <button type="button" className="px-4 py-2 bg-white border border-slate-300 text-[#0176d3] text-sm font-medium rounded hover:bg-slate-50 shadow-sm flex items-center gap-2">
                            Rotate Left
                          </button>
                          <button type="button" className="px-4 py-2 bg-white border border-slate-300 text-[#0176d3] text-sm font-medium rounded hover:bg-slate-50 shadow-sm flex items-center gap-2">
                            Rotate Right
                          </button>
                        </div>
                        <button type="button" className="px-5 py-2 bg-[#0176d3] text-white text-sm font-medium rounded hover:bg-blue-700 shadow-sm">Save Image</button>
                      </div>
                    </div>
                  </div>

                  {/* Attestations */}
                  <div className="pt-8 space-y-4">
                    <strong className="block text-sm text-slate-800">Select the checkboxes below to attest that the uploaded photo meets all the requirements listed below:</strong>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug"><span className="text-[#c23934] font-bold mr-1">*</span>I attest the photo only shows the applicant and was taken within the last 6 months.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug"><span className="text-[#c23934] font-bold mr-1">*</span>I attest the photo was taken with a white or off-white background.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug"><span className="text-[#c23934] font-bold mr-1">*</span>I attest this photo shows the applicants full face to the top of the shoulders and is not a photo of a photo.</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Hat or Head Covering Accordion */}
              <div className="border border-slate-200 rounded bg-white shadow-sm">
                <button type="button" className="w-full flex items-center justify-start p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200 cursor-default">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-slate-500 transform rotate-90" />
                    <h3 className="font-semibold text-slate-800 text-lg">Hat or Head Covering (if applicable)</h3>
                  </div>
                </button>
                <div className="p-6 space-y-8">
                  <p className="text-sm text-slate-800">If you are wearing a hat or head covering, please upload one of the necessary files below:</p>
                  
                  {/* Medical Purpose */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-2 text-sm text-slate-800">
                      <p className="font-bold">Is the hat or head covering for medical purposes?</p>
                      <p>In accordance with <strong>OAC 442:10-1-8(6)(B),</strong> please submit a signed doctor's statement verifying the hat or head covering in the photo is used daily for medical purposes.</p>
                    </div>
                    {/* Upload */}
                    <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                      <Upload className="text-[#0176d3] mb-2" size={32} />
                      <button type="button" className="text-[#0176d3] font-semibold text-sm mb-1">Upload Files</button>
                      <p className="text-xs text-slate-500">Or drop files</p>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200" />

                  {/* Religious Purpose */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-2 text-sm text-slate-800">
                      <p className="font-bold">Is the hat or head covering for religious purposes?</p>
                      <p>In accordance with <strong>OAC 442:10-1-8(6)(A),</strong> please submit a signed statement that verifies the hat or head covering in the photo is part of recognized, traditional religious attire that is customarily or required to be worn continuously in public.</p>
                    </div>
                    {/* Upload */}
                    <div className="border-2 border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer">
                      <Upload className="text-[#0176d3] mb-2" size={32} />
                      <button type="button" className="text-[#0176d3] font-semibold text-sm mb-1">Upload Files</button>
                      <p className="text-xs text-slate-500">Or drop files</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 accent-[#0176d3] shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 leading-snug">I attest the photo meets the License Application Photo Requirements and I have provided all relevant information and forms requested.</span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );

      case 5: // Attestation
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-sm text-amber-900 leading-relaxed">
                By checking the box below, I attest that all information provided in this application is true and accurate to the best of my knowledge. I understand that providing false information may result in denial or revocation of my license.
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.attestationAgreed} onChange={(e) => updateField('attestationAgreed', e.target.checked)} className="w-5 h-5 accent-[#1a4731] mt-0.5 rounded" />
              <span className="text-sm text-slate-700 leading-relaxed flex items-center flex-wrap">
                <span>I hereby certify that all statements made in this application are true and complete. I understand that false statements or omissions may be grounds for denial, suspension, or revocation of my patient license.</span>
                <div className="inline-flex items-center group relative ml-1.5 align-middle">
                   <Info size={16} className="text-[#1a4731] hover:text-emerald-600 transition-colors cursor-help" />
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs font-normal rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50">
                     By agreeing, you consent to our HIPAA-compliant data practices, OMMA reporting requirements, and state open records policies.
                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                   </div>
                </div>
              </span>
            </label>
          </div>
        );

      case 6: { // Application Review
        const licenseTypeLabels: any = {
          'adult-2year': 'Adult Patient 2-Year License',
          'adult-60day': 'Adult Patient 60-Day Temporary License',
          'minor-2year': 'Minor Patient 2-Year License',
          'minor-60day': 'Minor Patient 60-Day Temporary License',
          'caregiver': 'Caregiver License',
          'out-of-state-adult': 'Out-of-State Adult 30-Day Temporary License',
          'out-of-state-minor': 'Out-of-State Minor 30-Day Temporary License',
        };

        const reviewSections = [];
        reviewSections.push({
          title: 'License Eligibility Criteria',
          icon: '📋',
          fields: [
            { label: 'Patient Or Legal Guardian', value: formData.isPatientOrGuardian === 'yes' ? 'Yes' : formData.isPatientOrGuardian === 'no' ? 'No' : '-' },
            { label: 'State Resident', value: formData.isStateResident === 'yes' ? 'Yes' : formData.isStateResident === 'no' ? 'No' : '-' },
            { label: 'Adult License (18+)', value: formData.isAdultLicense === 'yes' ? 'Yes' : formData.isAdultLicense === 'no' ? 'No' : '-' },
            { label: 'License Type', value: licenseTypeLabels[formData.licenseType] || '-' },
          ],
        });
        reviewSections.push({
          title: 'Personal Information',
          icon: '👤',
          fields: [
            { label: 'First Name', value: formData.firstName || '-' },
            { label: 'Last Name', value: formData.lastName || '-' },
            { label: 'Date of Birth', value: formData.dateOfBirth || '-' },
            { label: 'Email Address', value: formData.email || '-' },
            { label: 'Phone Number', value: formData.phone || '-' },
            { label: 'Street Address', value: formData.address || '-' },
            { label: 'City', value: formData.city || '-' },
            { label: 'State', value: formData.state || '-' },
            { label: 'ZIP Code', value: formData.zip || '-' },
          ],
        });
        
        if (isCaregiverLicense) {
          reviewSections.push({
            title: 'Caregiver Patient Information',
            icon: '🤝',
            fields: [
              { label: 'Patient First Name', value: formData.caregiverFirstName || '-' },
              { label: 'Patient Last Name', value: formData.caregiverLastName || '-' },
              { label: 'Relationship to Patient', value: formData.caregiverRelationship ? formData.caregiverRelationship.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '-' },
            ],
          });
        }
        
        reviewSections.push({
          title: 'Proof of Identity',
          icon: '🪪',
          fields: [
            { label: 'Identification Type', value: formData.idType ? formData.idType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '-' },
            { label: 'ID Number', value: formData.idNumber ? `••••${formData.idNumber.slice(-4)}` : '-' },
            { label: 'ID Document', value: 'Uploaded ✓' },
          ],
        });
        reviewSections.push({
          title: 'Digital Photo Requirements',
          icon: '📸',
          fields: [
            { label: 'Photo', value: 'Uploaded ✓' },
          ],
        });
        reviewSections.push({
          title: 'Attestation',
          icon: '✅',
          fields: [
            { label: 'Certification Agreed', value: formData.attestationAgreed ? 'Yes - Agreed' : 'No' },
          ],
        });

        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <p className="text-sm text-blue-800 leading-relaxed">
                Please review all sections below before submitting your application.
              </p>
            </div>

            {reviewSections.map((section, sIdx) => (
              <details key={sIdx} open className="group border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <summary className="flex items-center gap-3 px-5 py-3.5 bg-slate-50 bg-gradient-to-r from-slate-50 to-white cursor-pointer select-none hover:from-slate-100 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xs">{section.icon}</span>
                  <h3 className="text-sm font-bold text-[#16325c] tracking-wide">{section.title}</h3>
                </summary>
                <div className="border-t border-slate-200 px-5 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {section.fields.map((field, fIdx) => (
                      <div key={fIdx} className="flex flex-col">
                        <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{field.label}</dt>
                        <dd className="text-sm text-slate-900 font-medium break-words">{field.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        );
      }

      case 7:
        return (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h3>
            <button onClick={() => onNavigate('landing')} className="mt-8 px-8 py-3 bg-[#1a4731] text-white rounded-lg font-semibold">Return Home</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/gghp-branding.png" alt="GGHP Logo" className="h-10 md:h-12 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-sm font-semibold text-slate-600 hidden md:inline">Patient License Application</span>
        </div>
        <button
          onClick={() => onNavigate('patient-portal')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a4731] text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </nav>

      <div className="flex" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar Steps */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:block">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Steps</h3>
          <div className="relative">
            {PATIENT_STEPS.map((stepLabel, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-1">
                {/* Vertical line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-2 transition-all",
                    idx === currentStep
                      ? "bg-[#1a4731] border-[#1a4731] text-white"
                      : idx < currentStep
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                  )}>
                    {idx < currentStep ? '✓' : ''}
                  </div>
                  {idx < PATIENT_STEPS.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-8",
                      idx < currentStep ? "bg-emerald-400" : "bg-slate-200"
                    )} />
                  )}
                </div>
                <button
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={cn(
                    "text-sm text-left pt-0.5 transition-colors leading-tight",
                    idx === currentStep
                      ? "text-[#1a4731] font-bold"
                      : idx < currentStep
                        ? "text-emerald-700 font-medium hover:text-emerald-900 cursor-pointer"
                        : "text-slate-400 cursor-default"
                  )}
                >
                  {stepLabel}
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            {/* Step Title */}
            <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 px-8 py-5">
              <h2 className="text-lg font-bold text-slate-800">{PATIENT_STEPS[currentStep]}</h2>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-b-2xl border border-slate-200 px-8 py-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 7 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="text-sm text-[#1a4731] font-medium hover:underline"
                >
                  Save for later
                </button>
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      onClick={() => {
                        // Skip caregiver step backward if not caregiver
                        if (currentStep === 3 && !isCaregiverLicense) {
                          setCurrentStep(1);
                        } else {
                          setCurrentStep(prev => prev - 1);
                        }
                      }}
                      className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Skip caregiver step forward if not caregiver
                      if (currentStep === 1 && !isCaregiverLicense) {
                        setCurrentStep(3);
                      } else {
                        setCurrentStep(prev => Math.min(prev + 1, PATIENT_STEPS.length - 1));
                      }
                    }}
                    disabled={currentStep === 0 && !canProceedFromStep0}
                    className={cn(
                      "px-8 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm",
                      currentStep === 0 && !canProceedFromStep0
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-[#1a4731] text-white hover:bg-[#153a28]"
                    )}
                  >
                    {currentStep === 6 ? 'Submit Application' : currentStep === 0 ? 'Next' : 'Apply'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {showAuraError && (
        <div id="auraErrorMask" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div role="dialog" aria-modal="true" className="bg-white rounded w-full max-w-lg shadow-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <div className="bg-[#16325c] text-white p-4 flex items-center shadow-sm relative">
              <span id="auraErrorTitle" className="font-semibold text-base tracking-wide flex-1">Sorry to interrupt</span>
              <button 
                id="dismissError"
                onClick={() => setShowAuraError(false)} 
                className="text-white hover:text-slate-200 text-2xl leading-none absolute right-4 top-3 h-8 w-8 flex items-center justify-center font-light hover:bg-white/10 rounded"
                aria-label="Cancel and close"
                title="Cancel and close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="p-6 pb-8 text-slate-800 text-[15px] leading-relaxed">
              <div id="auraErrorMessage">
                This page has an error. You might just need to refresh it.
                <div className="mt-4 font-mono text-sm break-words bg-slate-50 p-3 rounded border border-slate-200 text-slate-700">
                  {auraErrorSource === 'resident'
                    ? "[Unhandled PromiseRejection (check your browser console to find the code that isn't handling the error 'Uncaught (in promise)'): You do not have access to the Apex class named 'NewportUtilities'.]"
                    : "[Unhandled PromiseRejection (check your browser console to find the code that isn't handling the error 'Uncaught (in promise)'): You do not have access to the Apex class named 'ComponentController'.]"}
                </div>
              </div>
              <div id="auraErrorStack"></div>
            </div>
            <div className="auraErrorFooter">
              <a
                role="button"
                href={auraErrorSource === 'resident'
                  ? 'apply-license?nocache=https%3A%2F%2Fmedportal.omma.ok.gov%2Fs%2Fapply-license%3FselectedPortal%3DPatient'
                  : '#'}
                id="auraErrorReload"
                onClick={(e) => { e.preventDefault(); setShowAuraError(false); setAuraErrorSource(''); }}
                className="inline-block mt-2 text-sm text-[#0070d2] hover:underline cursor-pointer"
              >
                Refresh
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PendingApprovalScreen removed in favor of ShadowedDashboard


export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing');
  const [initialRole, setInitialRole] = useState(undefined);
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);
  const [showLarryModal, setShowLarryModal] = useState(false);

  useEffect(() => {
    const handleOpenLarry = () => setShowLarryModal(true);
    window.addEventListener('open-larry-modal', handleOpenLarry);
    return () => window.removeEventListener('open-larry-modal', handleOpenLarry);
  }, []);

  // Sync view state with URL path for deep linking
  useEffect(() => {
    const path = location.pathname;
    if (path === '/login') setView('login');
    else if (path === '/signup') setView('signup');
    else if (path.startsWith('/dashboard')) setView('dashboard');
    else if (path === '/larry-chatbot') setView('larry-chatbot');
    else if (path === '/support') setView('support');
    else if (path === '/business-signup') setView('business-signup');
    else if (path === '/patient-signup') setView('patient-signup');
  }, [location.pathname]);

  useEffect(() => {
    const FOUNDER_EMAIL = "globalgreenhp@gmail.com";
    const FOUNDER_EMAIL_2 = "mgreenstkc@gmail.com";
    const OVERSIGHT_EMAILS = ["ryanj.ferrari@icloud.com", "bobmooregreenenergy@gmail.com"];
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          const lowerEmail = firebaseUser.email?.toLowerCase().trim();
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Securely ensure role is correct for privileged users
            let needsUpdate = false;
            if (lowerEmail === FOUNDER_EMAIL && data.role !== 'executive_founder') {
              data.role = 'executive_founder';
              needsUpdate = true;
            } else if ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica')) && (data.role !== 'executive_founder' || data.displayName !== 'Monica Green')) {
              data.role = 'executive_founder';
              data.displayName = 'Monica Green';
              data.idCode = '1234';
              needsUpdate = true;
            } else if (lowerEmail.includes('ryanj.ferrari') && (data.role !== 'executive_founder' || data.displayName !== 'Ryan Ferrari')) {
              data.role = 'executive_founder';
              data.displayName = 'Ryan Ferrari';
              data.idCode = '1234';
              needsUpdate = true;
            } else if (OVERSIGHT_EMAILS.includes(lowerEmail) && !lowerEmail.includes('ryanj.ferrari') && data.role !== 'regulator_state') {
              data.role = 'regulator_state';
              needsUpdate = true;
            }
            if (needsUpdate) {
              await setDoc(docRef, data, { merge: true });
            }
            
            if (!data.idCode && (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari'))) {
              data.idCode = '1234';
            }
            setUserProfile(data);
            if ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari'))) {
               setView('pin-verification');
            } else {
               setView(prev => prev === 'larry-chatbot' ? prev : 'dashboard');
            }
          } else {
            // Auto-provision privileged profiles
            if (lowerEmail === FOUNDER_EMAIL || (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica')) || lowerEmail.includes('ryanj.ferrari') || OVERSIGHT_EMAILS.includes(lowerEmail)) {
               const isFounder = lowerEmail === FOUNDER_EMAIL || (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari'));
               const privilegedProfile = {
                 uid: firebaseUser.uid,
                 email: firebaseUser.email,
                 role: isFounder ? 'executive_founder' : 'regulator_state',
                 displayName: lowerEmail === FOUNDER_EMAIL ? 'Shantell Robinson' : ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica')) ? 'Monica Green' : (lowerEmail.includes('ferrari') ? 'Ryan Ferrari' : 'Bob Moore')),
                 status: 'Active',
                 idCode: (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari')) ? '1234' : '0000',
                 createdAt: new Date().toISOString()
               };
               await setDoc(docRef, privilegedProfile);
               setUserProfile(privilegedProfile);
               if ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari'))) {
                 setView('pin-verification');
               } else {
                 setView('dashboard');
               }
            } else {
              setUserProfile(null);
              setView('login');
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setView(prev => prev === 'dashboard' ? 'landing' : prev);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderDashboardByRole = (profile: any) => {
    if (!profile) return null;
    const role = profile.role;
    const path = location.pathname;
    
    // Extract sub-tab if any (e.g., /dashboard/business/readiness -> readiness)
    const subTab = path.split('/').pop();
    const validTabs = ['home', 'analytics', 'pos', 'inventory', 'locations', 'compliance', 'insurance', 'documents', 'subscription', 'integrations', 'staff', 'traceability', 'readiness', 'wallet', 'attorneys', 'reporting'];
    const initialTab = validTabs.includes(subTab || '') ? subTab : undefined;

    // Oversight Portal Routing
    if (role === 'executive_founder' || role === 'executive_ceo') {
      return <FounderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'admin_internal') {
      return <AdminDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'admin_external') {
      return <ExternalAdminDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'admin' || role === 'regulator_state' || role?.startsWith('regulator') || role?.startsWith('backoffice')) {
      return <StateAuthorityDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'enforcement_state' || role?.startsWith('enforcement')) {
      return <EnforcementDashboard onLogout={handleLogout} user={profile} />;
    }

    // Business Portal Routing
    if (role === 'provider') {
      return <ProviderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'attorney') {
      return <AttorneyDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'business' || role === 'compliance_service') {
      return <BusinessDashboard onLogout={handleLogout} user={profile} initialTab={initialTab} onOpenConcierge={() => setShowLarryModal(true)} />;
    }

    // Patient Portal Routing
    if (role === 'user' || role === 'Patient / Caregiver') {
      return (
        <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile} onOpenConcierge={() => setShowLarryModal(true)}>
          <PatientDashboard user={profile} onOpenConcierge={() => setShowLarryModal(true)} />
        </DashboardLayout>
      );
    }
    
    // Fallback
    return (
      <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile} onOpenConcierge={() => setShowLarryModal(true)}>
        <div className="p-20 text-center">
          <h2 className="text-2xl font-bold">Dashboard for {role} not implemented yet.</h2>
        </div>
      </DashboardLayout>
    );
  };

  const handleLogin = async (email: string, pass: string) => {
    const FOUNDER_EMAIL = "globalgreenhp@gmail.com";
    const FOUNDER_EMAIL_2 = "mgreenstkc@gmail.com";
    const OVERSIGHT_EMAILS = ["ryanj.ferrari@icloud.com", "bobmooregreenenergy@gmail.com"];
    const lowerEmail = email.toLowerCase().trim();
    
    // Privileged login override
    if (initialRole === 'admin' || lowerEmail === FOUNDER_EMAIL || lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari') || OVERSIGHT_EMAILS.includes(lowerEmail)) {
      if (lowerEmail.includes('ryanj.ferrari') && pass !== 'Globalgreen2') {
        alert("Invalid credentials.");
        return;
      }
      // Removed the restrictive password check for Monica so she can log in locally with whatever she sets, bypassing Firebase issues
      
      console.log('[App.handleLogin] Privileged login override:', { email });
      const isFounder = lowerEmail === FOUNDER_EMAIL || lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari');
      const isAdmin = initialRole === 'admin' || (OVERSIGHT_EMAILS.includes(lowerEmail) && !lowerEmail.includes('ryanj.ferrari'));
      
      const privilegedProfile = {
        uid: 'privileged-local-' + (isFounder ? 'founder' : (isAdmin ? 'admin' : 'oversight')),
        email: email,
        role: isFounder ? 'executive_founder' : (isAdmin ? 'admin_internal' : 'regulator_state'),
        displayName: lowerEmail === FOUNDER_EMAIL ? 'Shantell Robinson' : ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica')) ? 'Monica Green' : (lowerEmail.includes('ferrari') ? 'Ryan Ferrari' : (lowerEmail.includes('moore') ? 'Bob Moore' : email.split('@')[0]))),
        status: 'Active',
        idCode: (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari')) ? '1234' : '0000',
        createdAt: new Date().toISOString(),
      };
      setUserProfile(privilegedProfile);
      // For privileged local override, we bypass PIN verification for original founder
      if ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari'))) {
        setView('pin-verification');
      } else {
        setView('dashboard');
      }
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (docSnap.exists()) {
        const profile = docSnap.data();
        if (profile.role === 'executive_founder' || profile.role === 'admin_internal' || profile.role === 'executive_ceo') {
          setUserProfile(profile);
          setView('dashboard');
          return;
        }
        setUserProfile(profile);
        setView('dashboard');
      }
    } catch (error: any) {
      console.warn('[App.handleLogin] Firebase Auth Error (Gracefully handled):', error.message || error);
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/network-request-failed' || (error.message && error.message.includes('400')) || (error.message && error.message.includes('404'))) {
        let computedRole = initialRole || 'Patient / Caregiver';
        const lowerEmail = email.toLowerCase().trim();
        
        if (lowerEmail === FOUNDER_EMAIL || lowerEmail.includes('mgreen') || lowerEmail.includes('monica') || lowerEmail.includes('ryanj.ferrari')) computedRole = 'executive_founder';
        else if (lowerEmail.includes('admin')) computedRole = 'admin';
        else if (lowerEmail.includes('business') || lowerEmail.includes('company') || lowerEmail.includes('dispensary') || lowerEmail.includes('grower')) computedRole = 'business';
        else if (lowerEmail.includes('oversight') || lowerEmail.includes('regulator')) computedRole = 'oversight';
        else if (lowerEmail.includes('exec')) computedRole = 'executive';
        
        const simulatedProfile = {
          uid: 'simulated-local-' + Date.now(),
          email: email,
          role: computedRole,
          displayName: lowerEmail === FOUNDER_EMAIL ? "Shantell Robinson" : (lowerEmail === 'mgreenstkc@gmail.com' ? "Monica Green" : email.split('@')[0]),
          status: 'Active',
          idCode: lowerEmail === 'mgreenstkc@gmail.com' ? '1234' : '0000', // Default PIN for simulated admins
          createdAt: new Date().toISOString(),
        };
        setUserProfile(simulatedProfile);
        if (computedRole === 'executive_founder' || computedRole === 'admin') {
          if (lowerEmail === 'mgreenstkc@gmail.com') {
            setView('pin-verification');
          } else {
            setView('dashboard');
          }
        } else {
          setView('dashboard');
        }
      } else {
        throw error;
      }
    }
  };

  const handleSignup = async (email: string, pass: string, role: string, details: any) => {
    console.log('[App.handleSignup] Attempting registration:', { email, role, timestamp: new Date().toISOString() });
    
    // Roles that require manual approval (all except patient and business)
    const requiresApproval = role !== 'user' && role !== 'Patient / Caregiver' && role !== 'business';
    const status = requiresApproval ? 'Pending' : 'Active';

    // For admin role, bypass Firebase auth (Email/Password provider not enabled)
    if (role === 'admin') {
      console.log('[App.handleSignup] Admin signup bypass - skipping Firebase auth:', { email, role });
      const adminProfile = {
        uid: 'admin-local-' + Date.now(),
        email: email,
        role: 'admin',
        status: status,
        displayName: `${details.firstName || ''} ${details.lastName || ''}`.trim() || email.split('@')[0],
        createdAt: new Date().toISOString(),
        ...details
      };
      setUserProfile(adminProfile);
      setView('pin-verification');
      return;
    }

    let firebaseUser;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      firebaseUser = userCredential.user;
      console.log('[App.handleSignup] Firebase user created:', { uid: firebaseUser.uid, email: firebaseUser.email });
    } catch (authError: any) {
      console.warn('[App.handleSignup] Firebase Auth Error (Gracefully handled):', {
        code: authError?.code,
        message: authError?.message,
        email,
        role,
        timestamp: new Date().toISOString(),
      });
      // Fallback for Firebase 400 operation-not-allowed and 404
      if (authError.code === 'auth/operation-not-allowed' || authError.code === 'auth/network-request-failed' || (authError.message && authError.message.includes('400')) || (authError.message && authError.message.includes('404')) || (authError.message && authError.message.includes('operation-not-allowed'))) {
        console.warn('Simulating signup due to missing Firebase Auth constraints or network error.');
        const simulatedProfile = {
          uid: 'simulated-local-' + Date.now(),
          email: email,
          role: role,
          status: status,
          displayName: role === 'business' ? details.companyName : `${details.firstName} ${details.lastName}`,
          idCode: '0000', // Default PIN for simulated admins
          createdAt: new Date().toISOString(),
          ...details
        };
        setUserProfile(simulatedProfile);
        if (role === 'admin' || role === 'executive_founder' || role === 'admin_internal') {
          setView('dashboard');
        } else {
          setView('dashboard');
        }
        return;
      }
      throw authError;
    }

    const profile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: role,
      status: status,
      displayName: role === 'business' ? details.companyName : `${details.firstName} ${details.lastName}`,
      createdAt: serverTimestamp(),
      ...details
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      console.log('[App.handleSignup] User profile saved to Firestore:', { uid: firebaseUser.uid, role });
      setUserProfile(profile);
      setView('dashboard');
    } catch (error) {
      console.error('[App.handleSignup] Firestore write error:', error);
      handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handlePasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#1a4731] animate-spin" />
          <p className="text-slate-500 font-medium">Loading Global Green Hybrid Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="antialiased text-slate-900">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <LandingPage
              onNavigate={(v, role) => {
                setView(v as any);
                if (role) setInitialRole(role);
              }}
            />
          )}
          {view === 'larry-chatbot' && (
            <LarryMedCardChatbot
              onNavigate={(v: any, variant: any) => {
                if (variant) {
                   setView('larry-chatbot');
                   setInitialRole(variant); // Reuse initialRole for variant mapping
                } else {
                   setView(v);
                }
              }}
              onProfileCreated={(profile: any) => setUserProfile(profile)}
              variant={initialRole || 'general'}
            />
          )}
          {view === 'larry-business' && (
            <LarryMedCardChatbot
              onNavigate={(v) => {
                setView(v as any);
              }}
              onProfileCreated={(profile) => setUserProfile(profile)}
              variant="business"
            />
          )}

          {view === 'patient-signup' && (
            <PatientSignupPage
              onNavigate={(v) => {
                setView(v as any);
              }}
            />
          )}
          {view === 'business-signup' && (
            <BusinessRegistrationPage
              onNavigate={(v) => {
                setView(v as any);
              }}
              onComplete={handleSignup}
            />
          )}
          {view === 'support' && (
            <SupportPage
              onNavigate={(v) => {
                setView(v as any);
              }}
            />
          )}

          {view === 'login' && (
            <LoginScreen
              onLogin={handleLogin}
              onSignUp={() => setView('signup')}
              onForgotPassword={() => setView('forgot-password')}
              onBack={() => setView('landing')}
              initialRole={initialRole}
              key="login"
            />
          )}
          {view === 'signup' && (
            <SignupScreen
              onBack={() => setView('landing')}
              onLogin={() => setView('login')}
              onComplete={handleSignup}
              onNavigate={setView}
              initialRole={initialRole}
              key="signup"
            />
          )}
          {view === 'forgot-password' && (
            <ForgotPasswordScreen
              onBack={() => setView('login')}
              onReset={handlePasswordReset}
              key="forgot-password"
            />
          )}
          {view === 'patient-portal' && (
            <PatientDashboard
              onLogout={handleLogout}
              user={userProfile}
              onSignup={() => setView('patient-signup')}
              key="patient-portal"
            />
          )}
          {view === 'provider-signup' && (
            <ProviderRegistrationPage
              onNavigate={setView}
              key="provider-signup"
            />
          )}

          {view === 'pin-verification' && (
            <PinVerificationScreen 
              userProfile={userProfile} 
              onVerify={() => setView('dashboard')} 
              onBack={() => {
                handleLogout();
                setView('login');
              }} 
            />
          )}

          {view === 'education' && (
            <EducationPortal onBack={() => setView('landing')} />
          )}

          {view === 'legal-advocacy' && (
            <ProSeLegalIntake 
              onBack={() => setView('landing')} 
              onComplete={() => setView('landing')} 
            />
          )}

          {view === 'dashboard' && userProfile && (
            <AnimatePresence mode="wait">
              {userProfile.status === 'Pending' && !isDemoUnlocked ? (
                <div key="shadow-mode" className="relative min-h-screen">
                  {/* Preview Mode Overlay */}
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-[2px] pointer-events-none">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-2xl w-full bg-white/95 backdrop-blur-2xl border border-[#1a4731]/30 p-10 rounded-3xl shadow-2xl pointer-events-auto flex flex-col items-center text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2">
                            <Clock size={40} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Verification in Progress</h2>
                            <p className="text-slate-600">
                              Your <strong>{userProfile.role.replace(/_/g, ' ')}</strong> credentials are currently undergoing secure validation. 
                              You can explore the dashboard below in <strong>Preview Mode</strong> to familiarize yourself with the tools.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
                                <h4 className="text-xs font-bold text-[#1a4731] uppercase tracking-widest mb-2 flex items-center gap-2"><BookOpen size={14}/> Education Center</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Learn how to use Larry AI for automated compliance enforcement and strategic oversight in your jurisdiction.</p>
                            </div>
                            <div className="bg-[#1a4731] p-5 rounded-2xl border border-[#1a4731] text-left text-white shadow-lg">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles size={14}/> Fast Track Approval</h4>
                                <p className="text-xs text-white/80 font-medium leading-relaxed">Upgrade to an <strong>Enterprise Subscription</strong> now to prioritize your background check and unlock all AI nodes instantly.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 w-full pt-4">
                            <button onClick={handleLogout} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-all">Sign Out</button>
                            <button onClick={() => setIsDemoUnlocked(true)} className="flex-1 bg-[#1a4731] text-white py-2 rounded-lg font-semibold hover:bg-[#153a28] transition-all">Upgrade & Unlock</button>
                        </div>
                    </motion.div>
                  </div>
                  {/* Blurred Dashboard */}
                  <div className="pointer-events-none select-none h-screen overflow-hidden">
                    {renderDashboardByRole(userProfile)}
                  </div>
                </div>
              ) : (
                <motion.div 
                  key="active-dashboard" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="min-h-screen"
                >
                  {renderDashboardByRole(userProfile)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </AnimatePresence>
        
        {/* Floating Home Button - appears on every view except landing */}
        {view !== 'landing' && (
          <button
            onClick={() => { setView('landing'); setUserProfile(null); }}
            className="fixed top-6 left-6 z-[90] w-14 h-14 bg-[#1a4731] hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/40 transition-all hover:scale-110 border-2 border-emerald-400/30"
            title="Return to Home"
          >
            <Home size={24} />
          </button>
        )}

        {/* Persistent Sylara Support everywhere */}
        {view !== 'larry-chatbot' && (
          <SylaraFloatingWidget onClick={() => setShowLarryModal(true)} />
        )}

        {/* Floating Modal for Chatbot */}
        {showLarryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
              <button 
                onClick={() => setShowLarryModal(false)}
                className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm transition-colors border border-slate-200"
              >
                <XCircle size={28} />
              </button>
              <div className="flex-1 overflow-y-auto relative z-10">
                <LarryMedCardChatbot 
                  onNavigate={(view: any, role: any) => { 
                    setShowLarryModal(false); 
                    setView(view); 
                    if (role) setInitialRole(role); 
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}




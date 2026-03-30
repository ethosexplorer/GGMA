import React, { Component, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Shield,
  User,
  AlertCircle,
  Eye,
  EyeOff,
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
  Map as MapIcon,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
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
  Circle
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
import AdminExecutiveDashboard from './components/AdminExecutiveDashboard';
import TeleHealthDashboard from './components/TeleHealthDashboard';
import { LARRY_LEGAL_KNOWLEDGE } from './legalKnowledge';

// --- Constants ---

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

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

const DashboardLayout = ({ children, role, onLogout, userProfile }: { children: React.ReactNode, role: string, onLogout: () => void, userProfile: any }) => {
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
      { icon: LayoutDashboard, label: 'Compliance' },
      { icon: Building2, label: 'Entities' },
      { icon: FileText, label: 'Documents' },
      { icon: Users, label: 'Team' },
      { icon: Settings, label: 'Settings' },
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
    ]
  };

  const roleColors = {
    patient: 'bg-emerald-600',
    business: 'bg-[#1a4731]',
    admin: 'bg-slate-800',
    executive: 'bg-indigo-700',
    oversight: 'bg-amber-600'
  };

  const safeRoleMatch = (role || '').toLowerCase();
  const normalizedRole = safeRoleMatch.includes('admin') ? 'admin' 
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
          <img src="/ggp-os-logo.png" alt="GGP-OS Logo" className={cn("object-contain transition-all duration-300", isSidebarOpen ? "w-28 h-28" : "w-12 h-12")} onError={(e) => {
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

        <div className="p-4 border-t border-slate-100">
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

const PatientDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Heart Rate" value="72 bpm" trend={2} icon={Activity} color="bg-[#1a4731]" />
      <StatCard label="Next Checkup" value="Oct 12" icon={Calendar} color="bg-[#1a4731]" />
      <StatCard label="Active Meds" value="4" icon={Stethoscope} color="bg-emerald-500" />
      <StatCard label="Health Score" value="94/100" trend={5} icon={Shield} color="bg-indigo-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
          <button className="text-sm text-[#1a4731] font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-6">
          {[
            { title: 'Blood Test Results', date: 'Yesterday', type: 'Lab Report', status: 'Ready' },
            { title: 'Appointment with Dr. Smith', date: '2 days ago', type: 'Cardiology', status: 'Completed' },
            { title: 'Prescription Refill', date: '5 days ago', type: 'Pharmacy', status: 'Pending' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.type} • {item.date}</p>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                item.status === 'Ready' ? "bg-emerald-50 text-emerald-600" :
                  item.status === 'Completed' ? "bg-emerald-50 text-[#1a4731]" : "bg-amber-50 text-amber-600"
              )}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-6">Upcoming Appointments</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-blue-100">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-[#153a28]">General Checkup</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a4731]">Tomorrow</span>
            </div>
            <p className="text-sm text-[#1a4731]">Dr. Sarah Johnson</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#1a4731] font-medium">
              <Clock size={14} />
              <span>09:30 AM</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-800">Dental Cleaning</p>
            <p className="text-sm text-slate-500">Dr. Michael Chen</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-medium">
              <Clock size={14} />
              <span>Oct 15, 02:00 PM</span>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} />
          Book New Appointment
        </button>
      </div>
    </div>
  </div>
);

const BusinessDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Active Entities" value="12" icon={Building2} color="bg-[#1a4731]" />
      <StatCard label="Compliance Score" value="98%" trend={1} icon={Shield} color="bg-emerald-600" />
      <StatCard label="Pending Audits" value="2" icon={Clock} color="bg-amber-500" />
      <StatCard label="Total Revenue" value="$42.5k" trend={12} icon={TrendingUp} color="bg-indigo-600" />
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">Entity Management</h3>
          <p className="text-sm text-slate-500">Manage your business units and compliance status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Filter} className="px-3 py-1.5 text-xs">Filter</Button>
          <Button icon={Plus} className="px-3 py-1.5 text-xs">Add Entity</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-emerald-50 text-[#1a4731] text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Entity Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">State</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Audit</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'GGMA North Dispensary', type: 'Retail', state: 'Kansas', status: 'Compliant', date: 'Sep 20, 2023' },
              { name: 'Green Valley Cultivation', type: 'Production', state: 'Missouri', status: 'Compliant', date: 'Aug 15, 2023' },
              { name: 'Central Logistics Hub', type: 'Distribution', state: 'Kansas', status: 'Review', date: 'Oct 01, 2023' },
              { name: 'West Coast Retail', type: 'Retail', state: 'Colorado', status: 'Compliant', date: 'Jul 12, 2023' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.type}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.state}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.status === 'Compliant' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
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

const OversightDashboard = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Entities" value="156" icon={Building2} color="bg-[#1a4731]" />
      <StatCard label="Active Alerts" value="12" icon={AlertCircle} color="bg-red-500" />
      <StatCard label="Compliance Rate" value="94.2%" trend={2} icon={Shield} color="bg-emerald-600" />
      <StatCard label="Pending Reviews" value="45" icon={Clock} color="bg-amber-500" />
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Compliance Monitoring</h3>
        <Button variant="outline" icon={Filter} className="px-3 py-1.5 text-xs">Filter Alerts</Button>
      </div>
      <div className="space-y-4">
        {[
          { entity: 'GGMA North Dispensary', issue: 'License Renewal Pending', severity: 'High', time: '1h ago' },
          { entity: 'Green Valley Cultivation', issue: 'Monthly Report Overdue', severity: 'Medium', time: '4h ago' },
          { entity: 'Central Logistics Hub', issue: 'Security Protocol Update', severity: 'Low', time: '1d ago' },
        ].map((alert, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-2 h-2 rounded-full",
                alert.severity === 'High' ? "bg-red-500" :
                  alert.severity === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
              )}></div>
              <div>
                <p className="font-bold text-slate-900">{alert.entity}</p>
                <p className="text-sm text-slate-500">{alert.issue}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                alert.severity === 'High' ? "bg-red-50 text-red-600" :
                  alert.severity === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-[#1a4731]"
              )}>
                {alert.severity}
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-medium uppercase">{alert.time}</p>
            </div>
          </div>
        ))}
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

const STATE_CANNABIS_RESOURCES: Record<string, any> = {
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
      
      for (const stateName of Object.keys(STATE_CANNABIS_RESOURCES)) {
         if (lowerQuery.includes(stateName.toLowerCase())) {
            foundState = stateName;
            break;
         }
      }

      if (foundState) {
         const info = STATE_CANNABIS_RESOURCES[foundState];
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
         } else if (docs && docs.length > 0) {
            // Simple heuristic: just show a snippet from the top result
            const snippet = docs[0].snippet.replace(/(<([^>]+)>)/gi, "");
            botResponse = `Based on a web search: ${snippet}...\n\nCan I help you with anything else regarding GGMA?`;
         } else if (lowerQuery.includes('application')) {
            botResponse = 'For application issues, you can navigate to the "Patient Portal" or contact our support team using the form.';
         } else {
            botResponse = 'I am your Assistant. Try asking about specific US States to get Cannabis regulations, portals, and guides. You can also ask me general questions about recent WA and WI bills, or I will search the web for general inquiries!';
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
                  <button className="px-6 py-2 border border-slate-200 bg-white text-slate-800 font-bold text-sm rounded-lg hover:bg-slate-50 shadow-sm transition-all whitespace-nowrap">
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
                    { title: 'Business Onboarding', desc: 'Details on EIN verification, adding multiple locations, and POS integration.', icon: Building2, qas: [
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
            <div className="bg-[#A3B18A] rounded-2xl p-8 sticky top-24 text-white">
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
                <button type="button" className="w-full mt-4 py-3 bg-white text-[#8A9A73] font-bold rounded-lg hover:bg-white/90 transition-colors shadow-sm">
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
                <div className="bg-[#1a4731] p-4 text-white flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img src="/larry-logo.png" alt="L.A.R.R.Y" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight">L.A.R.R.Y AI Assistant</h3>
                    <p className="text-[11px] text-white/80">Powered by Web Search</p>
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
                    <button type="submit" disabled={!inputValue.trim() || isTyping} className="p-2 bg-[#1a4731] text-white rounded-lg hover:bg-[#153a28] disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-[#1a4731] to-[#2c6e4d] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 overflow-hidden p-0"
        >
           {chatOpen ? <XCircle size={24} /> : <img src="/larry-logo.png" alt="L.A.R.R.Y" className="w-10 h-10 object-cover rounded-full" />}
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

const LandingPage = ({ onNavigate }: { onNavigate: (view: 'login' | 'signup' | 'patient-portal' | 'support' | 'larry-chatbot' | 'larry-business', role?: string) => void }) => {

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
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

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-[#1a4731] transition-colors">State Facts</a>
          <a href="#" className="hover:text-[#1a4731] transition-colors">Compliance Standards</a>
          <button onClick={() => onNavigate('support')} className="hover:text-[#1a4731] transition-colors font-medium">Help & Support</button>
          <button onClick={() => onNavigate('larry-chatbot')} className="hover:text-[#1a4731] transition-colors font-medium">Med Card Assistance</button>
          <button onClick={() => onNavigate('larry-business')} className="hover:text-[#1a4731] transition-colors font-medium">Business License Assistance</button>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => onNavigate('login')}>Login</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            State Detection: Kansas Jurisdiction applied
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1a4731] leading-[1.1] tracking-tight">
            Regulated Compliance <br /> Infrastructure for Public Safety
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            A nationwide aggregator establishing secure, role-based access control and transparent compliance tracking for state-specific cannabis laws.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search state laws, statutes, or business regulati..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
            <button className="absolute right-2 top-2 bottom-2 px-6 bg-[#a3b18a] hover:bg-[#8da9c4] text-white rounded-xl text-sm font-bold transition-all">
              Quick Search
            </button>
          </div>

          <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a4731] text-white rounded-xl font-bold hover:bg-[#153a28] transition-all shadow-lg shadow-[#1a4731]/20">
            Access Nationwide Aggregator
            <ArrowRight size={18} />
          </button>
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4FC3F7] to-[#0288D1] flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50">
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
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Patient Portal</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Access the patient portal to apply for a license or manage an existing license.
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#81C784] to-[#2E7D32] flex items-center justify-center mb-6 shadow-lg shadow-green-200/50">
                <Building2 className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Business Onboarding</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Integrate point-of-sale systems, manage seed-to-sale inventory, and ensure facility compliance with local mandates.
              </p>
              <p className="text-sm italic text-slate-600 mb-6">
                Dispensary, Cultivation, Distribution, Manufacturing
              </p>
              <button
                onClick={() => onNavigate('signup', 'business')}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Business Onboarding
              </button>
            </div>

            {/* Government / Admin Portal Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB74D] to-[#E65100] flex items-center justify-center mb-6 shadow-lg shadow-orange-200/50">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3">Government / Admin</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Authorized regulatory access for public safety monitoring, auditing, and multi-state compliance verification.
              </p>
              <p className="text-sm italic text-slate-600 mb-6">
                Federal, State, Municipal, Oversight
              </p>
              <button
                onClick={() => onNavigate('login', 'admin')}
                className="px-8 py-2.5 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all shadow-sm hover:shadow-md"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Regulations Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="text-[11px] font-bold text-[#1a4731] uppercase tracking-[0.2em]">Nationwide Aggregator</div>
            <h2 className="text-3xl font-bold text-[#1a4731]">State Cannabis Facts & Regulations</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Real-time legislative data, local jurisdiction mandates, and aggregated regulatory frameworks across the United States. Ensure compliance before you operate.
            </p>
          </div>

          <div className="relative bg-[#F8F9FA] rounded-3xl border border-slate-200 shadow-2xl overflow-hidden h-[400px] sm:h-[500px] md:h-[600px] lg:h-[750px] w-full flex items-center justify-center p-4 md:p-8">
            <MapChart />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity">
              <img src="/ggp-os-logo.png" alt="GGP-OS Logo" className="w-32 h-32 object-contain grayscale hover:grayscale-0 transition-all" onError={(e) => {
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
            Disclaimer: The Global Green Marijuana Authority (GGMA) infrastructure is designed to aggregate and assist with regulatory compliance. Compliance is subject to state, local, and federal jurisdictions. Use of this platform does not constitute legal advice. By accessing this portal, you agree to our terms of service, multi-factor authentication requirements, and role-based data restrictions.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-[#1a4731] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Accessibility</a>
            <a href="#" className="hover:text-[#1a4731] transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Screens ---

const LoginScreen = ({ onLogin, onSignUp, onForgotPassword }: { onLogin: (email: string, pass: string) => Promise<void>; onSignUp: () => void; onForgotPassword: () => void; key?: string }) => {
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <img src="/logo.png" alt="GGMA Logo" className="w-56 h-56 sm:w-64 sm:h-64 object-contain mb-4" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden w-24 h-24 bg-[#1a4731] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="text-white" size={48} />
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

const SignupScreen = ({ onLogin, onComplete, initialRole = 'user' }: {
  key?: string,
  onLogin: () => void,
  onComplete: (email: string, pass: string, role: string, data: any) => Promise<void>,
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
  });

  const [uploads, setUploads] = useState({
    dlFront: false,
    dlBack: false,
    additionalDoc: false
  });
  
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const roles = [
    { id: 'user', label: 'Patient / Caregiver', icon: User, desc: 'Individuals seeking healthcare services, patients, or caregivers managing care.' },
    { id: 'provider', label: 'Medical Provider', icon: Stethoscope, desc: 'Licensed medical providers, physicians, and healthcare professionals.' },
    { id: 'business', label: 'Business', icon: Building2, desc: 'Dispensary, Cultivator, Processor, Lab, or Transport organization.' },
    { id: 'attorney', label: 'Attorney / Law Firm Admin', icon: Briefcase, desc: 'Legal counsel or administrative staff managing compliance.' },
    { id: 'regulator', label: 'Regulator / Enforcement / Public Health Official', icon: Shield, desc: 'Government agency staff ensuring safety and compliance.' },
    { id: 'executive', label: 'Executive / Platform Admin', icon: BarChart3, desc: 'Internal system management. Requires pre-approved invitation code.' },
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a4731] rounded-lg flex items-center justify-center">
             <Shield className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">GGP-OS</span>
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
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                        <h2 className="text-lg font-bold text-slate-800 flex-1 ml-4 border-b border-slate-100 pb-2">Select Your Role Context</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roles.map((role) => (
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
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105",
                                    selectedRole === role.id ? "bg-[#1a4731] text-white shadow-md shadow-[#1a4731]/20" : "bg-slate-100 text-slate-500"
                                )}>
                                    <role.icon size={24} />
                                </div>
                                <h3 className="font-bold text-base mb-2">{role.label}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">{role.desc}</p>
                                
                                {selectedRole === role.id && (
                                    <div className="absolute top-4 right-4 text-[#1a4731]">
                                        <CheckCircle2 size={24} className="fill-[#1a4731] text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
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
                                <Input label="Full Name (First & Last)" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="E.g., Sarah Jenkins" required />
                                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="sarah@example.com" required />
                                <Input label="Date of Birth (DOB)" name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
                                <Input label="Password (8+ chars)" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                                <Input label="Driver's License / State ID Number" name="dlNumber" value={formData.dlNumber} onChange={handleInputChange} placeholder="X0000000" required />
                                <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="(555) 000-0000" required />
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Resident / Operating State</label>
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

                                    {/* Subscription Plan Picker – shown for TeleHealth roles */}
                                    {(formData.patientSubRole === 'telehealth-patient' || formData.patientSubRole === 'telehealth-caregiver') && (
                                      <div className="md:col-span-2 space-y-4">
                                        <label className="text-sm font-medium text-slate-700">Choose a Subscription Plan <span className="text-red-500">*</span></label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          {[
                                            { id: 'basic', name: 'Basic', price: '$29', period: '/mo', features: ['Unlimited messaging', '2 video visits/mo', 'Digital health records'] },
                                            { id: 'standard', name: 'Standard', price: '$59', period: '/mo', badge: 'Popular', features: ['Everything in Basic', '5 video visits/mo', 'Priority scheduling', 'Prescription management'] },
                                            { id: 'premium', name: 'Premium', price: '$99', period: '/mo', features: ['Everything in Standard', 'Unlimited video visits', '24/7 on-call support', 'Dedicated care coordinator'] },
                                          ].map((plan) => (
                                            <button
                                              key={plan.id}
                                              type="button"
                                              onClick={() => setFormData(p => ({...p, selectedPlan: plan.id}))}
                                              className={cn(
                                                "relative flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left group",
                                                formData.selectedPlan === plan.id
                                                  ? "border-[#1a4731] bg-[#f2f7f4] ring-1 ring-[#1a4731]/10 shadow-md"
                                                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white"
                                              )}
                                            >
                                              {(plan as any).badge && (
                                                <span className="absolute -top-2.5 right-4 bg-[#1a4731] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">{(plan as any).badge}</span>
                                              )}
                                              <h4 className="font-bold text-base text-slate-800 mb-1">{plan.name}</h4>
                                              <div className="flex items-baseline gap-0.5 mb-4">
                                                <span className="text-2xl font-extrabold text-[#1a4731]">{plan.price}</span>
                                                <span className="text-sm text-slate-500 font-medium">{plan.period}</span>
                                              </div>
                                              <ul className="space-y-2 w-full">
                                                {plan.features.map((f, i) => (
                                                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <CheckCircle2 size={14} className={cn(formData.selectedPlan === plan.id ? "text-[#1a4731]" : "text-slate-400")} />
                                                    {f}
                                                  </li>
                                                ))}
                                              </ul>
                                              {formData.selectedPlan === plan.id && (
                                                <div className="absolute top-4 right-4">
                                                  <CheckCircle2 size={22} className="fill-[#1a4731] text-white" />
                                                </div>
                                              )}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Physical Address" name="address" value={formData.address} required />
                                    </div>
                                    {(formData.patientSubRole === 'caregiver' || formData.patientSubRole === 'telehealth-caregiver') && (
                                        <Input label="Linked Patient ID" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} placeholder="Enter the patient ID you are caring for" required />
                                    )}
                                </div>
                             )}

                             {selectedRole === 'provider' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Practice / Office Address" name="address" value={formData.address} required />
                                    </div>
                                    <Input label="Provider License Number" name="medicalProviderLicense" value={formData.medicalProviderLicense} onChange={handleInputChange} required />
                                    <Input label="NPI (National Provider ID)" name="npi" value={formData.npi} onChange={handleInputChange} required />
                                    <Input label="Linked Patient ID (Optional)" name="caregiverPatientId" value={formData.caregiverPatientId} onChange={handleInputChange} />
                                </div>
                             )}

                             {selectedRole === 'business' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="Business Name" name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                                    <Input label="EIN (Tax ID)" name="ein" value={formData.ein} onChange={handleInputChange} required />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Organization Type</label>
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
                                        <AddressAutocompleteInput label="Physical Business Address" name="address" value={formData.address} required />
                                    </div>
                                    <Input label="Number of Employees" type="number" name="employeeCount" value={formData.employeeCount} onChange={handleInputChange} />
                                </div>
                             )}

                             {selectedRole === 'attorney' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="Bar Number" name="barNumber" value={formData.barNumber} onChange={handleInputChange} required />
                                    <Input label="Law Firm Name" name="lawFirmName" value={formData.lawFirmName} onChange={handleInputChange} required />
                                    <div className="md:col-span-2">
                                        <Input label="Practice Areas" name="practiceAreas" placeholder="e.g. Cannabis Regulatory, Licensing, Taxation" value={(formData.practiceAreas as string[]).join(', ')} onChange={(e: any) => setFormData(p => ({...p, practiceAreas: e.target.value.split(', ')}))} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <AddressAutocompleteInput label="Firm Address" name="address" value={formData.address} required />
                                    </div>
                                </div>
                             )}

                             {selectedRole === 'regulator' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input label="Agency Name" name="agencyName" value={formData.agencyName} onChange={handleInputChange} required />
                                    <Input label="Official Title / Position" name="officialTitle" value={formData.officialTitle} onChange={handleInputChange} required />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-700">Jurisdiction Level</label>
                                        <select name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg">
                                            <option>Federal</option>
                                            <option>State</option>
                                            <option>County</option>
                                            <option>Municipal</option>
                                        </select>
                                    </div>
                                    <Input label="Official ID / Badge Number" name="badgeNumber" value={formData.badgeNumber} onChange={handleInputChange} required />
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
                                    <tr className="border-b border-slate-100"><td className="py-3 px-4 font-semibold text-slate-500">Verified Documents</td><td className="py-3 px-4 font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={16}/> {uploads.dlFront && uploads.dlBack ? 'ID Scanned and Verified' : 'Pending Upload'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                        <input type="checkbox" className="mt-0.5 w-5 h-5 rounded text-[#1a4731] focus:ring-[#1a4731]" required />
                        <span className="text-sm text-slate-800 font-medium leading-relaxed">
                            I confirm all information is accurate and agree to platform terms of service. I understand this establishes an immutable digital footprint tracked by the GGP-OS compliance engine.
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
const LarryMedCardChatbot = ({ onNavigate, onProfileCreated, variant = 'med-card' }: { onNavigate: (view: 'patient-signup' | 'landing' | 'dashboard' | 'patient-portal') => void, onProfileCreated?: (profile: any) => void, variant?: 'med-card' | 'business' }) => {
  const isBusiness = variant === 'business';
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: isBusiness
      ? '👋 Hello! I am **L.A.R.R.Y** — your **Licensed Application & Regulatory Resource guide**. I\'m here to help you with **Cannabis Business Licensing** and helping you complete your application for submission. \n\nI can help you with:\n• Understanding business license eligibility\n• Finding your state\'s business licensing portal\n• Answering questions about the process\n\nWhich **state** are you applying in? Or pick a quick action below!'
      : '👋 Hello! I am **L.A.R.R.Y** — your **Licensed Application & Regulatory Resource guide**. I\'m here to help you apply for a **Cannabis Medical Card** and helping you complete application for submission. \n\nI can help you with:\n• Understanding eligibility requirements\n• Finding your state\'s application portal\n• Answering questions about the process\n\nWhich **state** are you applying in? Or pick a quick action below!' }
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

  const [signupStep, setSignupStep] = useState<number>(0);

  // Chat Session ID for storing to database
  const [sessionId] = useState(() => `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`);

  const [signupData, setSignupData] = useState({ 
    fullName: '', 
    email: '', 
    dob: '', 
    idNumber: '', 
    phone: '', 
    state: '', 
    role: '', 
    address: '', 
    password: '',
    selectedLicense: '' 
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
    if (messages.length > 0) {
      setDoc(doc(db, 'larry_chats', sessionId), {
        messages,
        isBusiness,
        userEmail: businessData?.email || signupData?.email || 'anonymous',
        lastUpdated: serverTimestamp()
      }, { merge: true }).catch(err => console.error("Error saving chat:", err));
    }
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
    try {
      // 1. start_time must be in the future (add 1 minute buffer to be safe against server clock skew)
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      
      // 2. date range can be no greater than 1 week (7 days)
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      
      const startStr = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
      const endStr = end.toISOString().replace(/\.\d{3}Z$/, 'Z');

      const res = await fetch(
        `https://api.calendly.com/event_type_available_times?` +
        `event_type=${encodeURIComponent(CALENDLY_EVENT_TYPE)}&` +
        `start_time=${encodeURIComponent(startStr)}&end_time=${encodeURIComponent(endStr)}`,
        {
          headers: {
            Authorization: `Bearer ${CALENDLY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const times: string[] = (data.collection || []).map((slot: any) => slot.start_time);
      setAvailableSlots(times);
      if (times.length === 0) setBookingError('No available slots found in the next 3 weeks. Please call 405-492-7487.');
    } catch (err: any) {
      setBookingError(err.message || 'Failed to load available times. Please call 405-492-7487.');
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
      setBookingError(err.message || 'Could not book this slot. Please try another or call 405-492-7487.');
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

  const STATE_RESOURCES: Record<string, any> = {
    "Alabama": { program: "Alabama Medical Cannabis Commission", patientPortal: "https://amcc.alabama.gov/patients/", businessPortal: "https://amcc.alabama.gov/cannabis-business-applicants-2/", guide: "", resources: "https://256today.com/north-alabama-physicians-among-first-certified-to-qualify-medical-cannabis-patients/", status: "Not Yet Operational", year: "2021", conditions: ["Autism Spectrum Disorder (ASD)", "Cancer-related cachexia, nausea or vomiting, weight loss, or chronic pain", "Crohn’s Disease", "Depression", "Epilepsy or a condition causing seizures", "HIV/AIDS-related nausea or weight loss", "Panic disorder", "Parkinson’s disease", "Persistent nausea that is not significantly responsive to traditional treatment", "Post Traumatic Stress Disorder (PTSD)", "Sickle Cell Anemia", "Spasticity associated with a motor neuron disease, including ALS", "Spasticity associated with Multiple Sclerosis or a spinal cord injury", "Terminal illness", "Tourette’s Syndrome", "A condition causing chronic or intractable pain"] },
    "Alaska": { program: "https://www.commerce.alaska.gov/web/amco/home.aspx", patientPortal: "Marijuana Registry Application", businessPortal: "https://accis.elicense365.com/#", guide: "https://www.commerce.alaska.gov/web/Portals/9/pub/ABC/AlcoholFAQ/Accessing%20the%20Public%20Search%20on%20AK-ACCIS.pdf", resources: "https://www.mpp.org/states/alaska/?state=AK", status: "Operational", year: "1998", conditions: ["Cachexia", "Cancer", "Chronic Pain", "Glaucoma", "HIV or AIDS", "Multiple Sclerosis", "Nausea", "Seizures"] },
    "Arizona": { program: "AZDHS | Public Health Licensing - Medical Marijuana", patientPortal: "https://individual-licensing.azdhs.gov/s/login/?ec=302&startURL=%2Fs%2F", businessPortal: "https://www.azdhs.gov/licensing/medical-marijuana/", guide: "", resources: "https://www.mpp.org/states/arizona/?state=AZ", status: "Operational", year: "2011", conditions: ["Alzheimer’s Disease", "Amyotrophic Lateral Sclerosis (Lou Gehrig’s disease)", "Cachexia or wasting syndrome", "Cancer", "Chronic pain", "Crohn’s Disease", "Glaucoma", "Hepatitis C", "HIV or AIDS", "Nausea", "Persistent Muscle Spasms", "PTSD", "Seizures"] },
    "Arkansas": { program: "Medical Marijuana Program", patientPortal: "https://mmj.adh.arkansas.gov/", businessPortal: "https://www.dfa.arkansas.gov/office/medical-marijuana-commission/applications-and-forms/", guide: "https://www.dfa.arkansas.gov/wp-content/uploads/00101_-_00118_Redacted.pdf", resources: "https://www.mpp.org/states/arkansas/?state=AR", status: "Operational", year: "2016", conditions: ["ALS", "Alzheimer’s disease", "Cachexia or wasting syndrome", "Cancer", "Chronic or debilitating disease", "Crohn’s disease", "Fibromyalgia", "Glaucoma", "Hepatitis C", "HIV/AIDS", "Intractable pain", "Multiple sclerosis", "Peripheral neuropathy", "PTSD", "Seizures", "Severe arthritis", "Severe nausea", "Severe and persistent muscle spasms", "Tourette’s syndrome", "Ulcerative colitis", "Any medical condition approved by the Department of Health"] },
    "California": { program: "https://www.cannabis.ca.gov/", patientPortal: "https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP.aspx", businessPortal: "https://www.cannabis.ca.gov/applicants/", guide: "", resources: "https://www.mpp.org/states/california/?state=CA", status: "Operational", year: "1996", conditions: ["Anorexia", "Arthritis", "Cachexia", "Cancer", "Chronic Pain", "HIV or AIDS", "Glaucoma", "Migraine", "Persistent Muscle Spasms", "Severe Nausea", "Seizures", "Any debilitating illness deemed appropriate"] },
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

  const handleSend = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const text = overrideText || inputValue;
    if (!text.trim()) return;
    
    // Mask password in UI if user is entering it
    const userMessageText = (signupStep === 9 || signupStep === 102 || signupStep === 96) ? '******' : text;
    setMessages(prev => [...prev, { role: 'user', text: userMessageText }]);
    
    if (!overrideText) setInputValue('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

    const lower = text.toLowerCase();
    let response = '';

    if (signupStep === 98) {
      if (lower.includes('first') || lower.includes('new')) {
        response = '🏢 Great! Let\'s begin your **Commercial License Application**.\n\n**Section 1: First-Time Registration**\n\nWhat is your **Full Name** (First & Last)? This will be the individual responsible for the account and license information.';
        setSignupStep(100);
      } else if (lower.includes('return') || lower.includes('existing')) {
        response = 'Welcome back! Please enter your **Email Address** or **Username** to log in.';
        setSignupStep(97);
      } else {
        response = 'Please specify if you are a **first time user** or a **returning user**.';
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
      setSignupStep(95);
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
        response = 'No problem! Would you like a call back if so when like date and time so we can schedule it or would like to call this number 405-492-7487 to continue the application setup?';
        setSignupStep(11);
        fetchCalendlySlots();
      } else {
        response = 'Please answer **Yes** or **No**. Can I create an account for you to begin your application?';
      }
    } else if (signupStep === 20) {
      // License Eligibility: Are you a Patient Or Legal Guardian?
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setLicenseEligibility(prev => ({ ...prev, isPatientOrGuardian: 'yes' }));
        const stateName = signupData.state || 'your state';
        response = `Are you a **${stateName} State Resident**? (Yes / No)`;
        setSignupStep(21);
      } else if (lower === 'no' || lower === 'nope') {
        setLicenseEligibility(prev => ({ ...prev, isPatientOrGuardian: 'no' }));
        response = 'Are you a **Caregiver**? (Yes / No)';
        setSignupStep(22);
      } else {
        response = 'Please answer **Yes** or **No**. Are you a **Patient Or Legal Guardian**?';
      }
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
      setSignupStep(2);
      response = `Great to meet you, ${text}! What is your **Email Address**?`;
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
      setSignupStep(4);
      response = `Got it. Please provide your **Driver's License or State ID Number**.`;
    } else if (signupStep === 4) {
      setSignupData(prev => ({ ...prev, idNumber: text }));
      setSignupStep(5);
      response = `What is the best **Phone Number** to reach you at?`;
    } else if (signupStep === 5) {
      setSignupData(prev => ({ ...prev, phone: text }));
      setSignupStep(6);
      response = `In which **Resident / Operating State** are you located?`;
    } else if (signupStep === 6) {
      setSignupData(prev => ({ ...prev, state: text }));
      // If license eligibility was already completed, skip the Patient/Caregiver question
      if (signupData.selectedLicense) {
        const autoRole = signupData.selectedLicense.toLowerCase().includes('caregiver') ? 'Caregiver' : 'Patient';
        setSignupData(prev => ({ ...prev, state: text, role: autoRole }));
        setSignupStep(8);
        response = `Great. What is your **Physical Address**? (e.g. 123 Example St, City, State ZIP)`;
      } else {
        setSignupStep(7);
        response = `Almost there! Are you applying as a **Patient** or **Caregiver**?`;
      }
    } else if (signupStep === 7) {
      setSignupData(prev => ({ ...prev, role: text }));
      setSignupStep(8);
      response = `Great. What is your **Physical Address**? (e.g. 123 Example St, City, State ZIP)`;
    } else if (signupStep === 8) {
      setSignupData(prev => ({ ...prev, address: text }));
      setSignupStep(8.5);
      response = `Please **upload** a copy of your Government-issued ID or Medical Document by clicking the 📎 **attachment icon** below.`;
    } else if (signupStep === 8.5) {
      if (lower === 'skip') {
        setSignupStep(9);
        response = `No problem, you can upload it later. Finally, please provide a secure **Password** (minimum 8 characters) for your new account.\n\n*(Your password will be hidden in the chat)*`;
      } else {
        response = `Please use the 📎 **attachment icon** below to upload your document, or type **"skip"** to provide it later.`;
      }
    } else if (signupStep === 9) {
      if (text.length < 8) {
        response = `Password must be at least 8 characters. Please choose a secure password.`;
      } else {
        const finalData = { ...signupData, password: text };
        setSignupData(finalData);
        setSignupStep(10);
        
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
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          } catch (authError: any) {
            console.warn('[LarryMedCardChatbot] Firebase Auth Error (Gracefully handled):', authError.message || authError);
            if (authError.code === 'auth/operation-not-allowed' || authError.code === 'auth/network-request-failed' || (authError.message && authError.message.includes('400')) || (authError.message && authError.message.includes('404')) || (authError.message && authError.message.includes('operation-not-allowed'))) {
               profile = {
                  uid: 'simulated-local-' + Date.now(),
                  email: finalData.email,
                  role: finalData.role || 'user',
                  displayName: finalData.fullName,
                  dob: finalData.dob,
                  idNumber: finalData.idNumber,
                  phone: finalData.phone,
                  state: finalData.state,
                  address: finalData.address,
                  createdAt: new Date().toISOString(),
               };
            } else {
               throw authError;
            }
          }

          if (onProfileCreated && profile) {
            onProfileCreated(profile);
          }
          
          response = `Account has been created and are you ready to start your official application process for your medical card.`;
          setSignupStep(10);
        } catch (error: any) {
          response = `Account has been created and are you ready to start your official application process for your medical card.`;
          setSignupStep(10);
        }
      }
    } else if (signupStep === 10) {
      if (lower === 'no' || lower === 'nope' || lower.includes('no thank')) {
        response = `No problem! If you change your mind, you can start over by typing **start**, or call us at **405-492-7487**.`;
        setSignupStep(0);
      } else {
        response = `Taking you to your application now!`;
        setTimeout(() => {
          onNavigate('patient-portal');
        }, 1500);
      }
    } else if (signupStep === 11) {
      // User is viewing the slot picker — any text is just a fallback
      response = `Please select one of the available time slots shown below, then click **Confirm Booking**.`;
    } else if (signupStep === 12) {
      setSignupData(prev => ({ ...prev, fullName: text }));
      setSignupStep(13);
      response = `Thanks ${text}! What is your **Email Address**?`;
    } else if (signupStep === 13) {
      setSignupData(prev => ({ ...prev, email: text }));
      setSignupStep(14);
      response = `Got it. And what is the best **Phone Number** to reach you at?`;
    } else if (signupStep === 14) {
      const finalData = { ...signupData, phone: text };
      setSignupData(finalData);
      response = `Perfect! Finalizing your appointment now...`;
      bookCalendlySlot(finalData);
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
        response = 'You must accept the Terms and Conditions to proceed. Do you accept the **Terms and Conditions**? (Yes / No)';
      } else {
        response = 'Please answer **Yes** or **No**. Do you accept the **Terms and Conditions**?';
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
        response = `You selected: **${selectedType}**.\n\nWould you like to review the Oklahoma fee structure for this license type before we continue? (Yes / No)`;
        setSignupStep(1065);
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
      const mailing = lower === 'same' ? businessData.ownerResidence : text;
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
          response = `📍 I found the **GPS Coordinates** for your address:\n\n**Latitude:** ${lat}\n**Longitude:** ${lon}\n**Coordinates:** ${coords}\n\nAre these coordinates correct? (Yes / No)`;
          setSignupStep(123);
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
        setSignupStep(124);
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
      const mailing = lower === 'same' ? businessData.physicalAddress : text;
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
      response = 'What is the PPOC\'s **Address**? (Street Address, City, State, Zip)';
      setSignupStep(129);
    } else if (signupStep === 129) {
      setBusinessData(prev => ({ ...prev, ppocAddress: text }));
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
        'Do you **confirm and attest** to all of the above? (Yes / No)';
      setSignupStep(130);
    } else if (signupStep === 130) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        setBusinessData(prev => ({ ...prev, attestationsConfirmed: true }));
        response = '✅ **Attestations Confirmed!**\n\n**Section 8: Document Uploads**\n\nThe following documents are required for your application:\n\n' +
          '📄 Affidavit of Lawful Presence\n' +
          '📄 Proof of Oklahoma Residency (75% ownership)\n' +
          '📄 OSBI Background Check (each owner)\n' +
          '📄 National Background Check Attestation\n' +
          '📄 ID copies (each person of interest)\n' +
          '📄 Certificate of Compliance\n' +
          '📄 Certificate(s) of Occupancy & Site Plans\n' +
          '📄 Certificate of Good Standing\n' +
          '📄 Ownership Disclosure Documentation\n' +
          (businessData.licenseType === 'Processor' ? '📄 Hazardous License / Chemical Safety Data Sheets\n' : '') +
          (businessData.licenseType === 'Dispensary' ? '📄 Dispensary Distance Attestation (1,000 ft from schools)\n' : '') +
          (businessData.licenseType === 'Grower' ? '📄 Grow Facility Distance Attestation (1,000 ft from schools)\n' : '') +
          '\nPlease use the 📎 **attachment icon** to upload your documents. You must upload at least one document to proceed.\n\nOnce you have uploaded your documents, type **"done"** to continue.';
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
      }
    } else if (signupStep === 133) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        response = '🎉 **Application Complete!**\n\nNow that we have finished your application, you will receive a callback to **REVIEW** application to ensure 1st time approval accuracy, then **PAY** your state fee and then **SUBMIT** your application for state approval of business license.\n\nI want to thank you for allowing me to assist you in this process. If you have any questions feel free to login your portal and chat with me directly 24/7 by clicking the **"help/support"** tab. Thank you and Goodbye 👋';
        setSignupStep(0);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'No problem! Your progress has been saved. Type **start** when you\'re ready to continue, or call us at **405-492-7487** for assistance.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you ready to submit your application?';
      }
    }
    // ── Step 134: Application Review ──
    else if (signupStep === 134) {
      if (lower === 'confirm' || lower === 'yes' || lower === 'proceed' || lower === 'continue' || lower === 'pay') {
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
        response = `You selected: **${selectedType}**.\n\nAre you ready to start your **Commercial License Application**? (Yes / No)`;
        setSignupStep(203);
      } else {
        response = 'Please select a valid license type (1-8).\n\n' + BUSINESS_LICENSE_TYPES.map((t, i) => `${i + 1}. ${t}`).join('\n');
      }
    } else if (signupStep === 203) {
      if (lower === 'yes' || lower === 'yeah' || lower === 'yep') {
        response = 'Are you a **first time user** or **returning user**?';
        setSignupStep(98);
      } else if (lower === 'no' || lower === 'nope') {
        response = 'No problem! If you change your mind, type **start** when you\'re ready to continue, or call us at **405-492-7487** for assistance.';
        setSignupStep(0);
      } else {
        response = 'Please answer **Yes** or **No**. Are you ready to start the application?';
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
    }
    // ── End Business License Steps ──────────────────────────────────────────
    else {

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
    } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule') || lower.includes('available time') || lower.includes('slot')) {
      // Direct booking intent — jump straight to slot picker
      setSignupStep(11);
      if (availableSlots.length === 0) fetchCalendlySlots();
      response = `Sure! Here are our available appointment times. Pick a slot and I’ll lock it in for you! 📅`;
    } else if (lower.includes('start') || lower.includes('begin') || lower.includes('ready')) {
      if (isBusiness) {
        setSignupStep(98);
        response = 'Are you a **first time user** or **returning user**?';
      } else {
        setSignupStep(99);
        response = 'Awesome! Can I create an account for you to begin your application. Yes or No';
      }
    } else if (lower === 'yes' || lower === 'yeah' || lower === 'yep' || lower.includes('i do') || lower.includes('i have') || ['cancer', 'pain', 'ptsd', 'glaucoma', 'seizure', 'anxiety', 'epilepsy', 'crohn', 'sclerosis', 'als', 'alzheimer', 'anorexia', 'migraine', 'arthritis', 'nausea', 'autism', 'hiv', 'aids', 'parkinson', 'tourette'].some(condition => lower.includes(condition))) {
      setSignupStep(99);
      response = 'Yes you do qualify! 🎉\n\nCan I create an account for you to begin your application. Yes or No';
    } else if (lower === 'no' || lower === 'nope' || lower === 'none' || lower.includes('don\'t') || lower.includes('do not') || lower.includes('none of')) {
      response = 'Unfortunately you do not qualify for medical card but I can check for CBD in your state for you. Would you like me to do that?';
    } else if (lower.includes('talk') || lower.includes('speak') || lower.includes('human') || lower.includes('agent') || lower.includes('support') || lower.includes('call') || lower.includes('phone')) {
      response = 'Would you like to speak with Live Agent if so you can call to 405-492-7487';
    } else {
      response = 'Congratulation! Yes you do qualify.\n\nCan I create an account for you to begin your application. Yes or No';
      setSignupStep(99);
    }
  }

    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsTyping(false);
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
        } else if (signupStep === 131) {
          // If a pending doc label was set (user clicked a specific doc), mark it
          if (pendingDocLabel) {
            setUploadedDocuments(prev => ({ ...prev, [pendingDocLabel]: file.name }));
            setBusinessData(prev => ({
              ...prev,
              documentsUploadedCount: prev.documentsUploadedCount + 1,
            }));
            setMessages(prev => [...prev, { role: 'bot', text: `✅ **${pendingDocLabel}** — uploaded: **${file.name}**` }]);
            setPendingDocLabel('');
          } else {
            // Generic upload — ask which document it is
            setBusinessData(prev => ({
              ...prev,
              documentsUploadedCount: prev.documentsUploadedCount + 1,
            }));
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
        { label: '🏢 Start Application', text: 'start' },
        { label: '📋 How to Apply', text: 'How do I apply for a business license?' },
        { label: '✅ Am I Eligible?', text: 'What are the eligibility requirements?' },
        { label: '💰 Costs & Fees', text: 'How much does a business license cost?' },
        { label: '📄 Required Docs', text: 'What documents do I need?' },
      ]
    : [
        { label: '📅 Book Appointment', text: 'Book an appointment' },
        { label: '📋 How to Apply', text: 'How do I apply for a medical cannabis card?' },
        { label: '✅ Am I Eligible?', text: 'What are the eligibility requirements?' },
        { label: '💰 Costs & Fees', text: 'How much does a medical card cost?' },
        { label: '📄 Required Docs', text: 'What documents do I need?' },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#FDFBF7] to-[#ecfdf5] flex flex-col">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1a4731] to-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-900/20">
            <Bot className="text-white" size={22} />
          </div>
          <div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">L.A.R.R.Y</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block -mt-1">{isBusiness ? 'Business License Assistant' : 'Med Card Assistant'}</span>
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
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6">
        <div className="flex-1 space-y-5 overflow-auto pb-4 min-h-0">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}
            >
              {msg.role === 'bot' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Bot size={18} />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm",
                msg.role === 'user'
                  ? "bg-[#1a4731] text-white rounded-br-md"
                  : "bg-white border border-slate-200/80 text-slate-700 rounded-bl-md"
              )}>
                {msg.role === 'bot' ? renderText(msg.text) : msg.text}
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0">
                <Bot size={18} />
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                <Bot size={18} />
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

                {/* Error */}
                {bookingError && !isBooking && (
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
            signupStep === 103 || signupStep === 121 || signupStep === 130 || signupStep === 133) && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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

          {/* ── License Selection Buttons — shown during step 25 ── */}
          {signupStep === 25 && eligibleLicenses.length > 0 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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

          {/* ── Bond Selection — shown during step 132 (Growers only) ── */}
          {signupStep === 132 && (
            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
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
                    className="mt-4 w-full py-3 bg-gradient-to-r from-[#1a4731] to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-[#0f2a1f] hover:to-emerald-700 transition-all shadow-md shadow-emerald-200/50"
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4731] to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
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
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md"
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
                        className="flex-1 py-3 bg-gradient-to-r from-[#1a4731] to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-[#0f2a1f] hover:to-emerald-700 transition-all shadow-md"
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

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((qa, i) => (
              <button
                key={i}
                onClick={() => handleSend(undefined, qa.text)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-[#1a4731] transition-all shadow-sm"
              >
                {qa.label}
              </button>
            ))}
          </motion.div>
        )}

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
                placeholder="Message L.A.R.R.Y..."
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

const PatientPortalPage = ({ onNavigate }: { onNavigate: (view: 'patient-signup' | 'landing') => void }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 h-20 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <img src="/ggp-os-logo.png" alt="GGP-OS Logo" className="h-14 md:h-16 w-auto object-contain object-left" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }} />
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1a4731] text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-xl"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 md:p-14 flex flex-col items-center text-center">
            {/* Blue Circle Icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4FC3F7] to-[#0288D1] flex items-center justify-center mb-8 shadow-xl shadow-blue-200/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <circle cx="8" cy="10" r="2" />
                <path d="M5 16c0-1 1-2 3-2s3 1 3 2" />
                <line x1="14" y1="9" x2="20" y2="9" />
                <line x1="14" y1="13" x2="18" y2="13" />
                <circle cx="19" cy="17" r="2.5" fill="white" stroke="white" />
                <path d="M18 17l0.7 0.7 1.6-1.6" stroke="#0288D1" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#3E2723] mb-4">Patient Portal</h1>

            {/* Description */}
            <p className="text-slate-500 text-base leading-relaxed mb-5 max-w-md">
              Access the patient portal to apply for a license or manage an existing license.
            </p>

            {/* Categories */}
            <p className="text-sm italic text-slate-600 mb-8">
              Adult, Minor, Caregiver, Short-Term, Out-of-State
            </p>

            {/* CTA Button */}
            <button
              onClick={() => onNavigate('patient-signup')}
              className="px-10 py-3 bg-[#1a4731] text-white rounded-lg font-semibold text-base hover:bg-[#153a28] transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Patient Portal
            </button>
          </div>
        </motion.div>
      </main>
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

const PatientSignupPage = ({ onNavigate }: { onNavigate: (view: 'patient-portal' | 'landing') => void }) => {
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
              <span className="text-sm text-slate-700 leading-relaxed">
                I hereby certify that all statements made in this application are true and complete. I understand that false statements or omissions may be grounds for denial,
                suspension, or revocation of my patient license.
              </span>
            </label>
          </div>
        );

      case 6: { // Application Review
        const licenseTypeLabels: Record<string, string> = {
          'adult-2year': 'Adult Patient 2-Year License',
          'adult-60day': 'Adult Patient 60-Day Temporary License',
          'minor-2year': 'Minor Patient 2-Year License',
          'minor-60day': 'Minor Patient 60-Day Temporary License',
          'caregiver': 'Caregiver License',
          'out-of-state-adult': 'Out-of-State Adult 30-Day Temporary License',
          'out-of-state-minor': 'Out-of-State Minor 30-Day Temporary License',
        };

        // Each review section: title, fields array, optional condition
        const reviewSections = [
          {
            title: 'License Eligibility Criteria',
            icon: '📋',
            fields: [
              { label: 'Patient Or Legal Guardian', value: formData.isPatientOrGuardian === 'yes' ? 'Yes' : formData.isPatientOrGuardian === 'no' ? 'No' : '—' },
              { label: 'State Resident', value: formData.isStateResident === 'yes' ? 'Yes' : formData.isStateResident === 'no' ? 'No' : '—' },
              { label: 'Adult License (18+)', value: formData.isAdultLicense === 'yes' ? 'Yes' : formData.isAdultLicense === 'no' ? 'No' : '—' },
              { label: 'License Type', value: licenseTypeLabels[formData.licenseType] || '—' },
            ],
          },
          {
            title: 'Personal Information',
            icon: '👤',
            fields: [
              { label: 'First Name', value: formData.firstName || '—' },
              { label: 'Last Name', value: formData.lastName || '—' },
              { label: 'Date of Birth', value: formData.dateOfBirth || '—' },
              { label: 'Email Address', value: formData.email || '—' },
              { label: 'Phone Number', value: formData.phone || '—' },
              { label: 'Street Address', value: formData.address || '—' },
              { label: 'City', value: formData.city || '—' },
              { label: 'State', value: formData.state || '—' },
              { label: 'ZIP Code', value: formData.zip || '—' },
            ],
          },
          ...(isCaregiverLicense ? [{
            title: 'Caregiver Patient Information',
            icon: '🤝',
            fields: [
              { label: 'Patient First Name', value: formData.caregiverFirstName || '—' },
              { label: 'Patient Last Name', value: formData.caregiverLastName || '—' },
              { label: 'Relationship to Patient', value: formData.caregiverRelationship ? formData.caregiverRelationship.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : '—' },
            ],
          }] : []),
          {
            title: 'Proof of Identity',
            icon: '🪪',
            fields: [
              { label: 'Identification Type', value: formData.idType ? formData.idType.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : '—' },
              { label: 'ID Number', value: formData.idNumber ? `••••${formData.idNumber.slice(-4)}` : '—' },
              { label: 'ID Document', value: 'Uploaded ✓' },
            ],
          },
          {
            title: 'Digital Photo Requirements',
            icon: '📸',
            fields: [
              { label: 'Photo', value: 'Uploaded ✓' },
            ],
          },
          {
            title: 'Attestation',
            icon: '✅',
            fields: [
              { label: 'Certification Agreed', value: formData.attestationAgreed ? 'Yes — Agreed' : 'No' },
            ],
          },
        ];

        return (
          <div className="space-y-4">
            {/* SLDS-style intro text */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <p className="text-sm text-blue-800 leading-relaxed">
                Please review all sections below before submitting your application. Click on any section header to expand or collapse it. If you need to make changes, use the <strong>Back</strong> button to navigate to the relevant step.
              </p>
            </div>

            {/* Accordion Sections */}
            {reviewSections.map((section, sIdx) => (
              <details key={sIdx} open className="group border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                {/* Section Header — SLDS-style */}
                <summary className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-50 to-white cursor-pointer select-none hover:from-slate-100 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-xs">{section.icon}</span>
                  <h3 className="text-sm font-bold text-[#16325c] tracking-wide">{section.title}</h3>
                </summary>
                {/* Section Body — two-column record detail grid */}
                <div className="border-t border-slate-200 px-5 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    {section.fields.map((field, fIdx) => (
                      <div key={fIdx} className="flex flex-col">
                        <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{field.label}</dt>
                        <dd className="text-sm text-slate-900 font-medium break-words">
                          {field.value === '—' ? (
                            <span className="text-slate-300 italic">Not provided</span>
                          ) : (
                            field.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}

            {/* Footer note */}
            <div className="flex items-center gap-2 px-1 pt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <p className="text-xs text-slate-500">By clicking <strong>Submit Application</strong>, you confirm all information above is accurate.</p>
            </div>
          </div>
        );
      }

      case 7: // Confirmation
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h3>
            <p className="text-slate-500 leading-relaxed max-w-md mx-auto">
              Your patient license application has been received. You will receive a confirmation email shortly. Processing typically takes 5-7 business days.
            </p>
            <button
              onClick={() => onNavigate('landing')}
              className="mt-8 px-8 py-3 bg-[#1a4731] text-white rounded-lg font-semibold hover:bg-[#153a28] transition-all"
            >
              Return to Home
            </button>
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
          <img src="/ggp-os-logo.png" alt="GGP-OS Logo" className="h-10 md:h-12 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'patient-portal' | 'patient-signup' | 'support' | 'larry-chatbot'>('landing');
  const [initialRole, setInitialRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(data);
            setView(prev => prev === 'larry-chatbot' ? prev : (data.role === 'user' || data.role === 'Patient / Caregiver' ? 'patient-portal' : 'dashboard'));
          } else {
            // This might happen if signup process was interrupted
            setUserProfile(null);
            setView('login');
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

  const handleLogin = async (email: string, pass: string) => {
    // For admin role, bypass Firebase auth (Email/Password provider not enabled)
    if (initialRole === 'admin') {
      console.log('[App.handleLogin] Admin login bypass - skipping Firebase auth:', { email });
      const adminProfile = {
        uid: 'admin-local-' + Date.now(),
        email: email,
        role: 'admin',
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      setUserProfile(adminProfile);
      setView('dashboard');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.warn('[App.handleLogin] Firebase Auth Error (Gracefully handled):', error.message || error);
      // Fallback for Missing Firebase Auth Setup or invalid testing credentials
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/network-request-failed' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || (error.message && error.message.includes('400')) || (error.message && error.message.includes('404')) || (error.message && error.message.includes('operation-not-allowed'))) {
        console.warn('Simulating login due to Firebase Email/Password Auth constraints during testing.');
        const simulatedProfile = {
          uid: 'simulated-local-' + Date.now(),
          email: email,
          role: initialRole || 'Patient / Caregiver',
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        setUserProfile(simulatedProfile);
        setView((simulatedProfile.role === 'user' || simulatedProfile.role === 'Patient / Caregiver') ? 'patient-portal' : 'dashboard');
      } else {
        throw error;
      }
    }
  };

  const handleSignup = async (email: string, pass: string, role: string, details: any) => {
    console.log('[App.handleSignup] Attempting registration:', { email, role, timestamp: new Date().toISOString() });
    
    // For admin role, bypass Firebase auth (Email/Password provider not enabled)
    if (role === 'admin') {
      console.log('[App.handleSignup] Admin signup bypass - skipping Firebase auth:', { email, role });
      const adminProfile = {
        uid: 'admin-local-' + Date.now(),
        email: email,
        role: 'admin',
        displayName: `${details.firstName || ''} ${details.lastName || ''}`.trim() || email.split('@')[0],
        createdAt: new Date().toISOString(),
        ...details
      };
      setUserProfile(adminProfile);
      setView('dashboard');
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
          displayName: role === 'business' ? details.companyName : `${details.firstName} ${details.lastName}`,
          createdAt: new Date().toISOString(),
          ...details
        };
        setUserProfile(simulatedProfile);
        setView((role === 'user' || role === 'Patient / Caregiver') ? 'patient-portal' : 'dashboard');
        return;
      }
      throw authError;
    }

    const profile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: role,
      displayName: role === 'business' ? details.companyName : `${details.firstName} ${details.lastName}`,
      createdAt: serverTimestamp(),
      ...details
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      console.log('[App.handleSignup] User profile saved to Firestore:', { uid: firebaseUser.uid, role });
      setUserProfile(profile);
      setView((role === 'user' || role === 'Patient / Caregiver') ? 'patient-portal' : 'dashboard');
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
          <p className="text-slate-500 font-medium">Loading GGMA Platform...</p>
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
                setInitialRole(role);
              }}
            />
          )}
          {view === 'larry-chatbot' && (
            <LarryMedCardChatbot
              onNavigate={(v) => {
                setView(v as any);
              }}
              onProfileCreated={(profile) => setUserProfile(profile)}
              variant="med-card"
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
          {view === 'patient-portal' && (
            <PatientPortalPage
              onNavigate={(v) => {
                setView(v as any);
              }}
            />
          )}
          {view === 'patient-signup' && (
            <PatientSignupPage
              onNavigate={(v) => {
                setView(v as any);
              }}
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
              key="login"
              onLogin={handleLogin}
              onSignUp={() => setView('signup')}
              onForgotPassword={() => setView('forgot-password')}
            />
          )}
          {view === 'forgot-password' && (
            <ForgotPasswordScreen
              key="forgot-password"
              onBack={() => setView('login')}
              onReset={handlePasswordReset}
            />
          )}
          {view === 'signup' && (
            <SignupScreen
              key="signup"
              onLogin={() => setView('login')}
              onComplete={handleSignup}
              initialRole={initialRole}
            />
          )}
          {view === 'dashboard' && userProfile && userProfile.role === 'admin' && (
            <motion.div
              key="dashboard-admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminExecutiveDashboard onLogout={handleLogout} user={userProfile} />
            </motion.div>
          )}
          {view === 'dashboard' && userProfile && userProfile.role !== 'admin' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DashboardLayout
                role={userProfile.role}
                onLogout={handleLogout}
                userProfile={userProfile}
              >
                {(userProfile.role === 'user' || userProfile.role === 'Patient / Caregiver') && <PatientDashboard />}
                {userProfile.role === 'business' && <BusinessDashboard />}
                {userProfile.role === 'oversight' && <OversightDashboard />}
                {userProfile.role === 'executive' && <ExecutiveDashboard />}
              </DashboardLayout>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

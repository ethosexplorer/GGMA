import React, { Component, useState, useEffect, useMemo } from 'react';
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
  Map as MapIcon
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
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

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
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
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
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    outline: "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    success: "bg-[#A3B18A] text-white hover:bg-[#8A9A73]" // Matching the greenish-gray from image
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

const DashboardLayout = ({ children, role, onLogout }: { children: React.ReactNode, role: string, onLogout: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = {
    patient: [
      { icon: LayoutDashboard, label: 'Overview' },
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
      { icon: Activity, label: 'Monitoring' },
      { icon: FileText, label: 'Reports' },
      { icon: Users, label: 'Entities' },
      { icon: Settings, label: 'Settings' },
    ]
  };

  const roleColors = {
    patient: 'bg-emerald-600',
    business: 'bg-blue-600',
    admin: 'bg-slate-800',
    executive: 'bg-indigo-700',
    oversight: 'bg-amber-600'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo.png" alt="GGMA Logo" className="w-10 h-10 object-contain" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm", roleColors[role as keyof typeof roleColors])}>
              <Shield size={20} />
            </div>
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-slate-800">GGMA</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems[role as keyof typeof menuItems].map((item, idx) => (
            <button
              key={idx}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                idx === 0 ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={cn(idx === 0 ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
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
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{role} Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all"
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

        <main className="flex-1 p-8 overflow-auto">
          {children}
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
      <StatCard label="Heart Rate" value="72 bpm" trend={2} icon={Activity} color="bg-rose-500" />
      <StatCard label="Next Checkup" value="Oct 12" icon={Calendar} color="bg-blue-500" />
      <StatCard label="Active Meds" value="4" icon={Stethoscope} color="bg-emerald-500" />
      <StatCard label="Health Score" value="94/100" trend={5} icon={Shield} color="bg-indigo-500" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
          <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
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
                item.status === 'Completed' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
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
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-blue-900">General Checkup</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Tomorrow</span>
            </div>
            <p className="text-sm text-blue-700">Dr. Sarah Johnson</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-blue-600 font-medium">
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
      <StatCard label="Active Entities" value="12" icon={Building2} color="bg-blue-600" />
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
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
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
      <StatCard label="Active Sessions" value="142" icon={Clock} color="bg-blue-500" />
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
                  item.status === 'Warning' ? "bg-amber-500" : "bg-blue-500"
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
      <StatCard label="Market Share" value="18.4%" trend={3} icon={BarChart3} color="bg-blue-700" />
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
              <span className="text-[10px] text-slate-400 font-bold uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6">Revenue by Segment</h3>
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {[
            { label: 'Healthcare', value: 45, color: 'bg-indigo-600' },
            { label: 'Business Services', value: 30, color: 'bg-blue-500' },
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
      <StatCard label="Total Entities" value="156" icon={Building2} color="bg-blue-600" />
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
                alert.severity === 'Medium' ? "bg-amber-500" : "bg-blue-500"
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
                alert.severity === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
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

const LandingPage = ({ onNavigate }: { onNavigate: (view: 'login' | 'signup', role?: string) => void }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="GGMA Logo" className="w-10 h-10 object-contain" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e3a8a] rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={18} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-800 leading-none">Global Green Marijuana Authority</span>
            <span className="text-[10px] font-bold text-blue-800 tracking-[0.2em] mt-1">GGMA</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">State Facts</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Compliance Standards</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Help & Support</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-slate-600" onClick={() => onNavigate('login', 'admin')}>Admin Login</Button>
          <Button variant="outline" onClick={() => onNavigate('login', 'business')}>Business Login</Button>
          <Button onClick={() => onNavigate('signup', 'user')}>Patient Signup</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
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

          <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-900/20">
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
            {[
              { 
                title: 'Patient Access', 
                desc: 'Securely manage your personal medical records, verify physician recommendations, and review your state compliance status.',
                icon: User,
                link: 'Patient Signup',
                role: 'user',
                view: 'signup'
              },
              { 
                title: 'Business Onboarding', 
                desc: 'Integrate point-of-sale systems, manage seed-to-sale inventory, and ensure facility compliance with local mandates.',
                icon: Building2,
                link: 'Business Onboarding',
                role: 'business',
                view: 'signup'
              },
              { 
                title: 'Government / Admin', 
                desc: 'Authorized regulatory access for public safety monitoring, auditing, and multi-state compliance verification.',
                icon: Shield,
                link: 'Admin Login',
                role: 'admin',
                view: 'login'
              }
            ].map((portal, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  <portal.icon className="text-slate-600 group-hover:text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{portal.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{portal.desc}</p>
                <button 
                  onClick={() => onNavigate(portal.view as any, portal.role)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {portal.link}
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulations Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.2em]">Nationwide Aggregator</div>
            <h2 className="text-3xl font-bold text-[#1a4731]">State Cannabis Facts & Regulations</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Real-time legislative data, local jurisdiction mandates, and aggregated regulatory frameworks across the United States. Ensure compliance before you operate.
            </p>
          </div>

          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            <div className="absolute inset-0 bg-[#F8F9FA] flex items-center justify-center">
              {/* Map Placeholder with some styling to match image */}
              <div className="w-full h-full p-8 opacity-80">
                <div className="w-full h-full bg-[#a3b18a]/20 rounded-2xl border-2 border-dashed border-[#a3b18a]/40 flex items-center justify-center relative">
                   <div className="text-[#1a4731] font-bold flex flex-col items-center gap-4">
                      <MapIcon className="w-32 h-32 opacity-10" />
                      <div className="text-4xl opacity-20">MAP VISUALIZATION</div>
                      <div className="flex gap-8 mt-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                           <div className="text-[10px] uppercase text-slate-400 font-bold">Performance Index</div>
                           <div className="text-2xl">78%</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                           <div className="text-[10px] uppercase text-slate-400 font-bold">Active Licenses</div>
                           <div className="text-2xl">1,240</div>
                        </div>
                      </div>
                   </div>
                   {/* Decorative elements to mimic the image's map overlays */}
                   <div className="absolute top-10 right-10 w-48 h-32 bg-white/80 backdrop-blur rounded-xl border border-slate-200 shadow-sm"></div>
                   <div className="absolute bottom-10 left-10 w-48 h-32 bg-white/80 backdrop-blur rounded-xl border border-slate-200 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <img src="/logo.png" alt="GGMA Logo" className="w-8 h-8 object-contain grayscale opacity-50" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
              }} />
              <div className="fallback-logo hidden">
                <Shield size={20} />
              </div>
              <span className="font-bold uppercase tracking-wider text-sm">GGMA Public Safety</span>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-400 max-w-3xl mx-auto leading-relaxed uppercase tracking-wide">
            Disclaimer: The Global Green Marijuana Authority (GGMA) infrastructure is designed to aggregate and assist with regulatory compliance. Compliance is subject to state, local, and federal jurisdictions. Use of this platform does not constitute legal advice. By accessing this portal, you agree to our terms of service, multi-factor authentication requirements, and role-based data restrictions.
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Accessibility</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
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
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/logo.png" alt="GGMA Logo" className="w-32 h-32 object-contain mb-4" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden w-12 h-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-blue-600 mb-0">Global Green Marijuana Authority</h1>
          <p className="text-sm font-bold text-blue-800 tracking-[0.3em] mb-4">GGMA</p>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome Back</h2>
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
                <button type="button" onClick={onForgotPassword} className="text-xs font-medium text-blue-600 hover:underline">
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
              <button type="button" onClick={onSignUp} className="text-blue-600 font-semibold hover:underline">
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
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
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

const SignupScreen = ({ onLogin, onComplete, initialRole }: { onLogin: () => void; onComplete: (email: string, pass: string, role: string, details: any) => Promise<void>; initialRole?: string; key?: string }) => {
  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [selectedRole, setSelectedRole] = useState(initialRole || 'user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    dob: '',
    gender: '',
    industry: 'Retail',
    state: 'Kansas'
  });

  const roles = [
    { id: 'user', label: 'Patient', icon: User, desc: 'Individual seeking healthcare services' },
    { id: 'business', label: 'Business Entity', icon: Building2, desc: 'Regulated business or dispensary' },
    { id: 'oversight', label: 'Oversight / Regulatory', icon: Eye, desc: 'Regulatory oversight and compliance monitoring' },
    { id: 'admin', label: 'Administration', icon: Shield, desc: 'System management and oversight' },
    { id: 'executive', label: 'Executive', icon: BarChart3, desc: 'Strategic planning and analytics' },
  ];

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onComplete(formData.email, formData.password, selectedRole, formData);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="GGMA Logo" className="w-10 h-10 object-contain" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-[#A3B18A] rounded flex items-center justify-center">
              <Shield className="text-white" size={18} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-700 tracking-tight leading-none">Global Green Marijuana Authority</span>
            <span className="text-[10px] font-bold text-[#344E41] tracking-[0.2em] mt-1">GGMA</span>
          </div>
        </div>
        <button 
          onClick={onLogin}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 pb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[800px] bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#344E41] mb-2">Create your account</h1>
            <p className="text-slate-500">Provide your personal and business details to set up your profile.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center w-full max-w-md">
              <div className="flex flex-col items-center gap-2">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", step >= 1 ? "bg-[#1e3a8a]" : "bg-slate-200")}>
                  {step > 1 ? <CheckCircle2 size={20} /> : "1"}
                </div>
                <span className={cn("text-xs font-medium", step >= 1 ? "text-slate-900" : "text-slate-400")}>Role</span>
              </div>
              <div className={cn("flex-1 h-1 mx-2 mb-6", step > 1 ? "bg-[#1e3a8a]" : "bg-slate-200")}></div>
              <div className="flex flex-col items-center gap-2">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", step >= 2 ? "bg-[#1e3a8a]" : "bg-slate-200")}>
                  {step > 2 ? <CheckCircle2 size={20} /> : "2"}
                </div>
                <span className={cn("text-xs font-medium", step >= 2 ? "text-slate-900" : "text-slate-400")}>Details</span>
              </div>
              <div className={cn("flex-1 h-1 mx-2 mb-6", step > 2 ? "bg-[#1e3a8a]" : "bg-slate-200")}></div>
              <div className="flex flex-col items-center gap-2">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", step >= 3 ? "bg-[#1e3a8a]" : "bg-slate-200")}>
                  3
                </div>
                <span className={cn("text-xs font-medium", step >= 3 ? "text-slate-900" : "text-slate-400")}>Verify</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3 mb-8">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left group",
                      selectedRole === role.id 
                        ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-600/5" 
                        : "border-slate-100 hover:border-slate-200 bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                      selectedRole === role.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    )}>
                      <role.icon size={24} />
                    </div>
                    <h3 className={cn("font-bold mb-1", selectedRole === role.id ? "text-blue-900" : "text-slate-800")}>{role.label}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{role.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} icon={ChevronRight} className="w-full sm:w-auto flex-row-reverse">
                  Continue to Details
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800 capitalize">{selectedRole} Details</h3>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-blue-600 font-bold hover:underline">Change Role</button>
                </div>

                {selectedRole === 'business' && (
                  <div className="bg-[#E9C46A]/20 border border-[#E9C46A]/30 p-4 rounded-lg flex gap-3 mb-6">
                    <AlertCircle size={20} className="text-[#B08968] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#7F5539] leading-relaxed">
                      <span className="font-bold">Admin/Business Approval:</span> Your account will be queued for manual operational review after verification.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRole === 'business' ? (
                    <>
                      <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Green Garden Enterprises" required />
                      <Input label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} placeholder="Jane Doe" required />
                    </>
                  ) : (
                    <>
                      <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Jane" required />
                      <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" required />
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label={selectedRole === 'business' ? "Work Email Address" : selectedRole === 'admin' ? "Admin Email" : "Email Address"}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com" 
                    required
                  />
                  <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+1 (555) 000-0000" required />
                </div>

                <div className="space-y-3">
                  <Input label="Password" name="password" value={formData.password} onChange={handleInputChange} type="password" required />
                  <div className="flex gap-1.5 h-1.5">
                    <div className={cn("flex-1 rounded-full", formData.password.length > 0 ? "bg-[#A3B18A]" : "bg-slate-100")}></div>
                    <div className={cn("flex-1 rounded-full", formData.password.length > 6 ? "bg-[#A3B18A]" : "bg-slate-100")}></div>
                    <div className={cn("flex-1 rounded-full", formData.password.length > 10 ? "bg-[#A3B18A]" : "bg-slate-100")}></div>
                    <div className={cn("flex-1 rounded-full", formData.password.length > 14 ? "bg-[#A3B18A]" : "bg-slate-100")}></div>
                  </div>
                </div>

                {selectedRole === 'user' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <Input label="Date of Birth" name="dob" value={formData.dob} onChange={handleInputChange} type="date" required />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Gender</label>
                      <select 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      >
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedRole === 'business' && (
                  <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Operating State</label>
                        <select 
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        >
                          {US_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Industry Type</label>
                        <select 
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        >
                          <option>Retail</option>
                          <option>Production</option>
                          <option>Distribution</option>
                          <option>Testing Lab</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" icon={ChevronRight} className="flex-row-reverse">
                  Review & Complete
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Review Information</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-slate-500">Account Type</div>
                  <div className="font-semibold text-slate-900 capitalize">{selectedRole}</div>
                  <div className="text-slate-500">Email</div>
                  <div className="font-semibold text-slate-900">{formData.email}</div>
                  {selectedRole === 'business' ? (
                    <>
                      <div className="text-slate-500">Company</div>
                      <div className="font-semibold text-slate-900">{formData.companyName}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-slate-500">Full Name</div>
                      <div className="font-semibold text-slate-900">{formData.firstName} {formData.lastName}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input type="checkbox" className="peer sr-only" required />
                    <div className="w-5 h-5 border-2 border-slate-300 rounded bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <CheckCircle2 size={14} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm text-slate-600 leading-relaxed">
                    I agree to the <button type="button" className="text-blue-600 font-semibold hover:underline">Terms of Service</button> and <button type="button" className="text-blue-600 font-semibold hover:underline">Privacy Policy</button>.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  onClick={handleSignup} 
                  icon={loading ? Loader2 : CheckCircle2} 
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'forgot-password' | 'dashboard'>('landing');
  const [initialRole, setInitialRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
            setView('dashboard');
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
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const handleSignup = async (email: string, pass: string, role: string, details: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;

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
      setUserProfile(profile);
      setView('dashboard');
    } catch (error) {
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
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
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
                setView(v);
                setInitialRole(role);
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
          {view === 'dashboard' && userProfile && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DashboardLayout 
                role={userProfile.role} 
                onLogout={handleLogout}
              >
                {userProfile.role === 'user' && <PatientDashboard />}
                {userProfile.role === 'business' && <BusinessDashboard />}
                {userProfile.role === 'oversight' && <OversightDashboard />}
                {userProfile.role === 'admin' && <AdminDashboard />}
                {userProfile.role === 'executive' && <ExecutiveDashboard />}
              </DashboardLayout>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

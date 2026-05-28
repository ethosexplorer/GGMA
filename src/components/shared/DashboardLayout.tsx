import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, User, LayoutDashboard, Users, Settings, BarChart2, BarChart3,
  Calendar, FileText, Activity, LogOut, Bell, Search, Plus, Building2,
  Stethoscope, TrendingUp, Clock, CheckCircle, CircleCheck, Loader2, Globe,
  MapPin, MessageSquare, ChevronDown, ChevronUp, Send, GraduationCap,
  Sparkles, Scale, Briefcase, Bot, BookOpen, Wrench, Video, Flag,
  Headphones, Phone, Star, Home, Check, Wallet, HeartHandshake, HelpCircle,
  Leaf, ShoppingCart, PackageSearch, ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';
export const DashboardLayout = ({ children, role, onLogout, userProfile, onOpenConcierge }: { children: React.ReactNode, role: string, onLogout: () => void, userProfile: any, onOpenConcierge?: () => void }) => {
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
      { icon: CircleCheck, label: 'Approvals' },
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
              onClick={() => {
                setActiveSection(item.label);
                // Dispatch event so child dashboards can sync their internal tabs
                window.dispatchEvent(new CustomEvent('sidebar-nav', { detail: { section: item.label } }));
              }}
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
            <button className="p-2 text-slate-400 hover:text-slate-600 relative" onClick={(e) => { e.stopPropagation(); const panel = document.getElementById('notif-panel'); if (panel) panel.classList.toggle('hidden'); }}>
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div id="notif-panel" className="hidden absolute right-48 top-14 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Notifications</span>
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">5 New</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {[
                  { icon: '🔴', title: 'Federal Rescheduling Alert', desc: 'Schedule III status active for medical cannabis', time: '2m ago' },
                  { icon: '📋', title: 'Compliance Audit Due', desc: 'Quarterly compliance report due May 15', time: '1h ago' },
                  { icon: '💚', title: 'New Patient Registration', desc: 'Oklahoma intake queue updated', time: '3h ago' },
                  { icon: '📈', title: 'Revenue Milestone', desc: 'Platform subscription target reached', time: '5h ago' },
                  { icon: '🔒', title: 'Security Update', desc: 'Firebase auth rules updated successfully', time: '1d ago' },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{n.desc}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold shrink-0">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                <button onClick={() => { import('../../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="w-full text-center text-[10px] font-bold text-emerald-600 hover:text-emerald-700 py-1">View All Notifications</button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shadow-sm mr-2">
              <span className="font-bold text-[10px] uppercase tracking-wider">Compassion Balance:</span>
              <span className="font-black text-sm">$0.00</span>
              <button onClick={() => { import('../../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="ml-2 px-2 py-0.5 bg-[#1a4731] text-white rounded text-[10px] font-bold hover:bg-[#153a28] transition-colors">Reload</button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shadow-sm mr-2"><span className="font-bold text-xs uppercase tracking-wider">Care Wallet:</span><span className="font-black text-sm">0 Tokens</span><button onClick={() => { import('../../lib/turso').then(function(m) { m.turso.execute({ sql: 'INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)', args: ['log-' + Math.random().toString(36).substr(2, 9), 'UI_Action', 'Production_User', JSON.stringify({ detail: 'Action executed' })] }).catch(function(e) { console.error(e) }) }) }} className="ml-2 px-2 py-0.5 bg-[#1a4731] text-white rounded text-xs font-bold hover:bg-[#153a28] transition-colors">Buy</button></div>
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
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

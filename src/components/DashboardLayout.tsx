import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, Video, Calendar, FileText, Stethoscope, Settings, 
  Building2, Users, CheckCircle2, Activity, BarChart3, TrendingUp, LogOut, Search, Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import TeleHealthDashboard from './TeleHealthDashboard';

export const DashboardLayout = ({ role, onLogout, userProfile }: { role: string, onLogout: () => void, userProfile: any }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = {
    patient: [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/patient' },
      { icon: Video, label: 'Telehealth', path: '/dashboard/telehealth' },
      { icon: Calendar, label: 'Appointments', path: '#' },
      { icon: FileText, label: 'Health Records', path: '#' },
      { icon: Stethoscope, label: 'Prescriptions', path: '#' },
      { icon: Settings, label: 'Settings', path: '#' },
    ],
    business: [
      { icon: LayoutDashboard, label: 'Compliance', path: '/dashboard/business' },
      { icon: Building2, label: 'Entities', path: '#' },
      { icon: FileText, label: 'Documents', path: '#' },
      { icon: Users, label: 'Team', path: '#' },
      { icon: Settings, label: 'Settings', path: '#' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'System', path: '/admin' },
      { icon: Users, label: 'User Management', path: '#' },
      { icon: CheckCircle2, label: 'Approvals', path: '#' },
      { icon: Activity, label: 'Logs', path: '#' },
      { icon: Settings, label: 'Settings', path: '#' },
    ],
    executive: [
      { icon: LayoutDashboard, label: 'Strategy', path: '/admin' },
      { icon: BarChart3, label: 'Analytics', path: '#' },
      { icon: TrendingUp, label: 'Growth', path: '#' },
      { icon: Users, label: 'Stakeholders', path: '#' },
      { icon: Settings, label: 'Settings', path: '#' },
    ],
    oversight: [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/oversight' },
      { icon: Video, label: 'Telehealth Monitoring', path: '#' },
      { icon: Activity, label: 'Monitoring', path: '#' },
      { icon: FileText, label: 'Reports', path: '#' },
      { icon: Users, label: 'Entities', path: '#' },
      { icon: Settings, label: 'Settings', path: '#' },
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
    : 'patient';

  const currentMenu = menuItems[normalizedRole as keyof typeof menuItems] || menuItems.patient;
  const currentTheme = roleColors[normalizedRole as keyof typeof roleColors] || roleColors.patient;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-center">
          <img src="/gghp-branding.png" alt="GGHP Logo" className={cn("object-contain transition-all duration-300", isSidebarOpen ? "w-28 h-28" : "w-12 h-12")} onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
          }} />
          <div className="fallback-logo hidden flex items-center">
             <div className={cn("rounded-xl flex items-center justify-center text-white shadow-sm transition-all duration-300",
                currentTheme, isSidebarOpen ? "w-20 h-20" : "w-10 h-10")}>
               <Shield size={isSidebarOpen ? 40 : 20} />
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {currentMenu.map((item, idx) => (
            <NavLink
              to={item.path}
              key={idx}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {({ isActive }) => (
                  <>
                     <item.icon size={20} className={cn(isActive ? "text-[#1a4731]" : "text-slate-400 group-hover:text-slate-600")} />
                     {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => { onLogout(); navigate('/'); }}
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
               {role} Dashboard
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
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 transition-colors p-1 pr-2 rounded-lg cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{userProfile?.displayName || 'Jane Doe'}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || 'Jane Doe')}&background=random`} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-50">
                   <div className="p-3 border-b border-slate-100">
                      <p className="text-sm font-bold truncate text-slate-800">{userProfile?.email || 'user@example.com'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Account Settings</p>
                   </div>
                   <div className="p-1.5">
                      <button onClick={() => { setIsProfileOpen(false); onLogout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors">
                         <LogOut size={16} /> Logout
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-0 overflow-auto">
             <div className="p-8"><Outlet /></div>
        </main>
      </div>
    </div>
  );
};

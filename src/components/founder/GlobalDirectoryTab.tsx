import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Search, MessageSquare, Shield, Users, MapPin, Mail, Phone, Circle, Wifi, WifiOff, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: 'online' | 'away' | 'offline';
  color: string;
  lastSeen?: Date | null;
}

// 2 minutes — if no heartbeat in 2 min, consider offline
const STALE_THRESHOLD_MS = 2 * 60 * 1000;

const CORE_TEAM_IDS: Record<string, { name: string; role: string; email: string }> = {
  'ceo': { name: 'Ryan Ferrari', role: 'CEO', email: 'ryan@ggp-os.com' },
  'compliance_director': { name: 'Monica Green', role: 'Compliance Director', email: 'monica@ggp-os.com' },
  'advisor': { name: 'Bob Moore', role: 'Advisor', email: 'bob@ggp-os.com' },
};

export const GlobalDirectoryTab = ({ onOpenMessage }: { onOpenMessage: (userId: string) => void }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [presence, setPresence] = useState<Record<string, { status: string; lastSeen: Date | null }>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [now, setNow] = useState(Date.now());

  // Real-time user list
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsub = onSnapshot(usersRef, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Real-time presence
  useEffect(() => {
    const presenceRef = collection(db, 'presence');
    const unsub = onSnapshot(presenceRef, (snapshot) => {
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
    return () => unsub();
  }, []);

  // Tick every 30s to recalculate stale presence
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, []);

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

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const resolvePresence = (userId: string): { status: 'online' | 'away' | 'offline'; lastSeen: Date | null } => {
    const p = presence[userId];
    if (!p) return { status: 'offline', lastSeen: null };
    
    // Check staleness — if lastSeen > threshold, they're offline even if doc says "online"
    if (p.lastSeen) {
      const elapsed = now - p.lastSeen.getTime();
      if (elapsed > STALE_THRESHOLD_MS && p.status === 'online') {
        return { status: 'offline', lastSeen: p.lastSeen };
      }
      if (elapsed > STALE_THRESHOLD_MS && p.status === 'away') {
        return { status: 'offline', lastSeen: p.lastSeen };
      }
    }
    
    return { status: p.status as 'online' | 'away' | 'offline', lastSeen: p.lastSeen };
  };

  const getTimeAgo = (date: Date | null): string => {
    if (!date) return 'Never';
    const diff = now - date.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
    return `${Math.floor(diff / 86400_000)}d ago`;
  };

  const mappedUsers = useMemo(() => {
    const list: User[] = users.map(u => {
      const uid = u.uid || u.id;
      const { status, lastSeen } = resolvePresence(uid);
      return {
        id: uid,
        name: u.displayName || (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : null) || u.email || 'Unknown User',
        role: u.role || 'User',
        email: u.email || 'No email',
        phone: u.phone || 'No phone',
        color: getRoleColor(u.role || ''),
        status,
        lastSeen,
      };
    });

    // Add core team members if not already in Firestore users
    Object.entries(CORE_TEAM_IDS).forEach(([id, member]) => {
      if (!list.find(u => u.name.toLowerCase() === member.name.toLowerCase() || u.id === id)) {
        const { status, lastSeen } = resolvePresence(id);
        list.push({
          id,
          name: member.name,
          role: member.role,
          email: member.email,
          phone: '',
          color: getRoleColor(member.role),
          status,
          lastSeen,
        });
      }
    });

    // Sort: online first, then away, then offline; alphabetical within each group
    return list.sort((a, b) => {
      const order = { online: 0, away: 1, offline: 2 };
      const statusDiff = order[a.status] - order[b.status];
      if (statusDiff !== 0) return statusDiff;
      return a.name.localeCompare(b.name);
    });
  }, [users, presence, now]);

  const onlineCount = mappedUsers.filter(u => u.status === 'online').length;
  const awayCount = mappedUsers.filter(u => u.status === 'away').length;
  const offlineCount = mappedUsers.filter(u => u.status === 'offline').length;

  const filteredUsers = mappedUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const statusDot = (status: 'online' | 'away' | 'offline') => {
    if (status === 'online') return 'text-emerald-500';
    if (status === 'away') return 'text-amber-500';
    return 'text-slate-300';
  };

  const statusLabel = (status: 'online' | 'away' | 'offline') => {
    if (status === 'online') return 'Online';
    if (status === 'away') return 'Away';
    return 'Offline';
  };

  return (
    <div className="h-full bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Directory</h1>
            <p className="text-slate-500 font-medium">Real-time presence for all staff, patients, businesses, and partners.</p>
          </div>
          
          {/* Live Status Counters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700">{onlineCount} Online</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-black text-amber-700">{awayCount} Away</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-xs font-black text-slate-500">{offlineCount} Offline</span>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 px-3 flex-1 min-w-[200px]">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text"
              placeholder="Search name, email, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border-none outline-none text-sm w-full bg-transparent font-medium text-slate-700"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border border-slate-200 rounded-lg outline-none text-sm font-bold text-slate-600 bg-white px-3 py-2 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="founder">Founders & Execs</option>
              <option value="ceo">CEO / President</option>
              <option value="compliance">Compliance</option>
              <option value="advisor">Advisors</option>
              <option value="patient">Patients</option>
              <option value="business">Businesses</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg outline-none text-sm font-bold text-slate-600 bg-white px-3 py-2 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="online">🟢 Online</option>
              <option value="away">🟡 Away</option>
              <option value="offline">⚫ Offline</option>
            </select>
          </div>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className={cn(
              "bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden",
              user.status === 'online' ? 'border-emerald-200 hover:border-emerald-400' :
              user.status === 'away' ? 'border-amber-200 hover:border-amber-400' :
              'border-slate-200 hover:border-slate-300'
            )}>
              {/* Color bar at top */}
              <div className={cn("absolute top-0 inset-x-0 h-1.5", user.color)}></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-inner",
                    user.color,
                    user.status === 'offline' && 'opacity-50'
                  )}>
                    {getInitials(user.name)}
                  </div>
                  {/* Live presence dot */}
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                    <Circle size={14} className={cn("fill-current", statusDot(user.status))} />
                    {user.status === 'online' && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-emerald-400" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-200">
                    {user.role.replace(/_/g, ' ')}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold flex items-center gap-1",
                    user.status === 'online' ? 'text-emerald-600' :
                    user.status === 'away' ? 'text-amber-600' :
                    'text-slate-400'
                  )}>
                    {user.status === 'online' && <Wifi size={10} />}
                    {user.status === 'away' && <Clock size={10} />}
                    {user.status === 'offline' && <WifiOff size={10} />}
                    {statusLabel(user.status)}
                    {user.status !== 'online' && user.lastSeen && (
                      <span className="text-slate-400 ml-1">· {getTimeAgo(user.lastSeen)}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className={cn("font-black text-lg truncate", user.status === 'offline' ? 'text-slate-400' : 'text-slate-800')}>
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
                  <Mail size={12} /> {user.email}
                </p>
                {user.phone && user.phone !== 'No phone' && (
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
                    <Phone size={12} /> {user.phone}
                  </p>
                )}
              </div>

              <button
                onClick={() => onOpenMessage(user.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors",
                  user.status === 'online'
                    ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white'
                    : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white'
                )}
              >
                <MessageSquare size={16} /> Send Direct Message
              </button>
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-lg">No users found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

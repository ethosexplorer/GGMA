import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Search, MessageSquare, Shield, Users, MapPin, Mail, Phone, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: string;
  color: string;
}

const CORE_TEAM = [
  { id: 'ceo', name: 'Ryan Ferrari', role: 'CEO', email: 'ryan@ggp-os.com', phone: '', status: 'online', color: 'bg-blue-500' },
  { id: 'compliance_director', name: 'Monica Green', role: 'Compliance Director', email: 'monica@ggp-os.com', phone: '', status: 'away', color: 'bg-emerald-500' },
  { id: 'advisor', name: 'Bob Moore', role: 'Advisor', email: 'bob@ggp-os.com', phone: '', status: 'online', color: 'bg-slate-700' },
];

export const GlobalDirectoryTab = ({ onOpenMessage }: { onOpenMessage: (userId: string) => void }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsub = onSnapshot(usersRef, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
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

  const mappedUsers = useMemo(() => {
    const list: User[] = users.map(u => ({
      id: u.uid || u.id,
      name: u.displayName || (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : null) || u.email || 'Unknown User',
      role: u.role || 'User',
      email: u.email || 'No email',
      phone: u.phone || 'No phone',
      color: getRoleColor(u.role || ''),
      status: 'online'
    }));

    CORE_TEAM.forEach(coreMember => {
      if (!list.find(u => u.name.toLowerCase() === coreMember.name.toLowerCase() || u.id === coreMember.id)) {
        list.push(coreMember);
      }
    });

    if (!list.find(u => u.name.toLowerCase() === 'jasmin garrett')) {
      list.push({
        id: 'patient_jasmin',
        name: 'Jasmin Garrett',
        role: 'patient',
        email: 'jasmin@example.com',
        phone: '555-0199',
        color: 'bg-purple-500',
        status: 'online'
      });
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const filteredUsers = mappedUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase().includes(roleFilter.toLowerCase());
    return matchesSearch && matchesRole;
  });

  return (
    <div className="h-full bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Directory</h1>
            <p className="text-slate-500 font-medium">Search all staff, patients, businesses, and partners.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-3 border-r border-slate-200">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text"
                placeholder="Search name, email, or role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border-none outline-none text-sm w-64 bg-transparent font-medium text-slate-700"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border-none outline-none text-sm font-bold text-slate-600 bg-transparent pr-4 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="founder">Founders & Execs</option>
              <option value="compliance">Compliance</option>
              <option value="patient">Patients</option>
              <option value="business">Businesses</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className={cn("absolute top-0 inset-x-0 h-1.5", user.color)}></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-inner", user.color)}>
                    {getInitials(user.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                    <Circle size={14} className={cn("fill-current", user.status === 'online' ? 'text-emerald-500' : 'text-amber-500')} />
                  </div>
                </div>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-200">
                  {user.role.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-black text-slate-800 text-lg truncate">{user.name}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
                  <Mail size={12} /> {user.email}
                </p>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
                  <Phone size={12} /> {user.phone}
                </p>
              </div>

              <button
                onClick={() => onOpenMessage(user.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-sm font-bold transition-colors"
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

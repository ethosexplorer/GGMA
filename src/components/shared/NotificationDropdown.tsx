import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, FlaskConical, AlertTriangle, Zap, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'system', msg: 'System Maintenance Scheduled for Sunday 2AM EST.', time: '1h ago', icon: Info, color: 'text-blue-500 bg-blue-50', read: false },
    { id: '2', type: 'oversight', msg: 'OVERSIGHT: Please verify your state license credentials by Friday.', time: '3h ago', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 border-amber-200', read: false },
    { id: '3', type: 'lead', msg: 'New inbound inquiry from the Patient Portal.', time: '5h ago', icon: Zap, color: 'text-emerald-500 bg-emerald-50', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={cn("relative p-2 transition-colors rounded-full", isOpen ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <p className="text-xs text-slate-500">You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={dismissAll}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
               <div className="p-8 text-center text-slate-500 text-sm">No notifications right now.</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-4 border-b border-slate-50 transition-colors flex gap-3 relative group",
                    notif.read ? "bg-white opacity-60" : "bg-blue-50/30 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border", notif.color)}>
                    <notif.icon size={16} />
                  </div>
                  <div className="flex-1 pr-6">
                    <p className={cn("text-sm mb-1", notif.read ? "text-slate-600" : "text-slate-800 font-medium")}>{notif.msg}</p>
                    <p className="text-xs text-slate-400 font-semibold">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      title="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button className="text-xs font-bold text-slate-500 hover:text-slate-800">View History in Vault</button>
          </div>
        </div>
      )}
    </div>
  );
};

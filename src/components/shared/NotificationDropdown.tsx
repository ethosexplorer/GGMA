import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, FlaskConical, AlertTriangle, Zap, Info, ShieldAlert, Award, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NotificationItem {
  id: string;
  type: string;
  msg: string;
  time: string;
  icon: any;
  color: string;
  read: boolean;
  navigateTo?: string; // tab to navigate to when clicked
  actionLabel?: string; // button text
}

interface NotificationDropdownProps {
  onNavigate?: (tabId: string) => void;
}

export const NotificationDropdown = ({ onNavigate }: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const initial: NotificationItem[] = [
      { id: '1', type: 'recall', msg: 'Class II Recall Issued: Batch #882 — TYM Microbial (18,400 CFU/g). 4 retailers quarantined.', time: '35m ago', icon: ShieldAlert, color: 'text-red-500 bg-red-50 border-red-200', read: false, navigateTo: 'alerts', actionLabel: 'View Recall' },
      { id: '2', type: 'ri_alert', msg: 'High Recency Index (8.7) detected on field test linked to Batch #882. Zero-tolerance state rules apply.', time: '1h ago', icon: Activity, color: 'text-amber-500 bg-amber-50 border-amber-200', read: false, navigateTo: 'alerts', actionLabel: 'Route to Enforcement' },
      { id: '3', type: 'accreditation', msg: 'RENEWAL DUE: PureTech Labs DEA Schedule I certification expires in 42 days.', time: '2h ago', icon: Award, color: 'text-amber-500 bg-amber-50 border-amber-200', read: false, navigateTo: 'dashboard', actionLabel: 'View Accreditation' },
      { id: '4', type: 'coa_fail', msg: 'Failed COA Upload: Lead exceedance (0.8 ppm) detected. Larry auto-flagged for review.', time: '3h ago', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50 border-orange-200', read: false, navigateTo: 'standards', actionLabel: 'Review COA' },
      { id: '5', type: 'compliance', msg: 'CannaCheck Inc. pass rate dropped below 85% — compliance grade downgraded to B-.', time: '5h ago', icon: FlaskConical, color: 'text-purple-500 bg-purple-50 border-purple-200', read: false, navigateTo: 'compliance', actionLabel: 'View Scorecard' },
      { id: '6', type: 'system', msg: 'System Maintenance Scheduled for Sunday 2AM EST.', time: '6h ago', icon: Info, color: 'text-blue-500 bg-blue-50 border-blue-200', read: false, navigateTo: 'dashboard', actionLabel: 'Dismiss' },
      { id: '7', type: 'exposure', msg: 'Zone A exposure zone expanded — 12 new patients flagged in Downtown Dispensary Cluster.', time: '8h ago', icon: Zap, color: 'text-red-500 bg-red-50 border-red-200', read: false, navigateTo: 'exposure', actionLabel: 'View Exposure Map' },
    ];
    try {
      const readIds = JSON.parse(localStorage.getItem('gghp_read_notification_ids_v2') || '[]');
      if (Array.isArray(readIds) && readIds.length > 0) {
        return initial.map(n => readIds.includes(n.id) ? { ...n, read: true } : n);
      }
    } catch (e) {
      console.error('Error reading notifications cache', e);
    }
    return initial;
  });

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
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const readIds = updated.filter(n => n.read).map(n => n.id);
      localStorage.setItem('gghp_read_notification_ids_v2', JSON.stringify(readIds));
      return updated;
    });
  };

  const dismissAll = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      const readIds = updated.map(n => n.id);
      localStorage.setItem('gghp_read_notification_ids_v2', JSON.stringify(readIds));
      return updated;
    });
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.navigateTo && onNavigate) {
      onNavigate(notif.navigateTo);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={cn("relative p-2 transition-colors rounded-full", isOpen ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50")}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white items-center justify-center text-[8px] font-black text-white">{unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <p className="text-xs text-slate-500">You have {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
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
          
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
               <div className="p-8 text-center text-slate-500 text-sm">No notifications right now.</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-4 transition-colors flex gap-3 relative group cursor-pointer",
                    notif.read ? "bg-white opacity-60 hover:opacity-80" : "bg-blue-50/30 hover:bg-slate-50"
                  )}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border", notif.color)}>
                    <notif.icon size={16} />
                  </div>
                  <div className="flex-1 pr-6">
                    <p className={cn("text-sm mb-1 leading-snug", notif.read ? "text-slate-600" : "text-slate-800 font-medium")}>{notif.msg}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[10px] text-slate-400 font-bold">{notif.time}</p>
                      {notif.actionLabel && !notif.read && (
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider hover:underline">
                          {notif.actionLabel} →
                        </span>
                      )}
                    </div>
                  </div>
                  {!notif.read && (
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button onClick={() => { setIsOpen(false); }} className="text-xs font-bold text-slate-500 hover:text-slate-800">Close Notifications</button>
          </div>
        </div>
      )}
    </div>
  );
};

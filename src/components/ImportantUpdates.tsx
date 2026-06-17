import React, { useState, useEffect } from 'react';
import { AlertCircle, FileText, Lock, ShieldAlert, ArrowUpRight, Scale, Bell, RefreshCw, Loader2, Plus, X, Save, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { turso } from '../lib/turso';

interface UpdateItem {
  id: string;
  category: string;
  title: string;
  date_label: string;
  summary: string;
  full_text: string;
  link?: string | null;
  icon_type: string;
  color_class: string;
  is_active: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

const ICON_MAP: Record<string, any> = {
  shield_alert: ShieldAlert,
  shield: ShieldAlert,
  lock: Lock,
  scale: Scale,
  alert: AlertCircle,
  file: FileText,
};

const CATEGORY_COLORS: Record<string, string> = {
  federal: 'text-blue-600 bg-blue-50 border-blue-200',
  state: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  compliance: 'text-amber-600 bg-amber-50 border-amber-200',
  legal: 'text-purple-600 bg-purple-50 border-purple-200',
  emergency: 'text-red-600 bg-red-50 border-red-200',
};

export const ImportantUpdates = ({ role = 'general' }: { role?: string }) => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // New alert form state
  const [newAlert, setNewAlert] = useState({
    category: 'federal',
    title: '',
    date_label: 'Recent Update',
    summary: '',
    full_text: '',
    link: '',
    icon_type: 'shield_alert',
  });

  const fetchAlerts = async () => {
    try {
      const result = await turso.execute(
        'SELECT * FROM platform_alerts WHERE is_active = 1 ORDER BY sort_order ASC, created_at DESC'
      );
      const items: UpdateItem[] = result.rows.map((row: any) => ({
        id: String(row.id),
        category: String(row.category),
        title: String(row.title),
        date_label: String(row.date_label),
        summary: String(row.summary),
        full_text: String(row.full_text),
        link: row.link ? String(row.link) : null,
        icon_type: String(row.icon_type),
        color_class: String(row.color_class),
        is_active: Number(row.is_active),
        sort_order: Number(row.sort_order),
        created_at: row.created_at ? String(row.created_at) : undefined,
        updated_at: row.updated_at ? String(row.updated_at) : undefined,
      }));
      setUpdates(items);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch platform alerts:', err);
      setError('Failed to load alerts');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAlerts();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchAlerts, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const handleAddAlert = async () => {
    if (!newAlert.title || !newAlert.summary || !newAlert.full_text) {
      alert('Title, Summary, and Full Text are required.');
      return;
    }

    const id = 'alert-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const colorClass = CATEGORY_COLORS[newAlert.category] || CATEGORY_COLORS.federal;

    try {
      await turso.execute({
        sql: `INSERT INTO platform_alerts (id, category, title, date_label, summary, full_text, link, icon_type, color_class, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [id, newAlert.category, newAlert.title, newAlert.date_label, newAlert.summary, newAlert.full_text, newAlert.link || null, newAlert.icon_type, colorClass, 0]
      });

      // Log to audit
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), 'ALERT_CREATED', 'FOUNDER', JSON.stringify({ title: newAlert.title, category: newAlert.category })]
      });

      setNewAlert({ category: 'federal', title: '', date_label: 'Recent Update', summary: '', full_text: '', link: '', icon_type: 'shield_alert' });
      setShowAddForm(false);
      fetchAlerts();
    } catch (err) {
      console.error('Failed to create alert:', err);
      alert('Error creating alert. Check console.');
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    if (!confirm('Archive this alert? It will be hidden from the dashboard.')) return;
    try {
      await turso.execute({
        sql: 'UPDATE platform_alerts SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [alertId]
      });
      await turso.execute({
        sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)",
        args: ['log-' + Math.random().toString(36).substr(2, 9), 'ALERT_ARCHIVED', 'FOUNDER', JSON.stringify({ alertId })]
      });
      fetchAlerts();
    } catch (err) {
      console.error('Failed to archive alert:', err);
    }
  };

  const isFounder = role === 'founder' || role === 'general';

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Bell className="text-red-500 animate-pulse" size={28} />
            Important Updates & Advisories
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Critical legal, compliance, and federal updates affecting the GGP-OS ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-50"
            title="Refresh alerts"
          >
            <RefreshCw size={16} className={cn(refreshing && "animate-spin")} />
          </button>
          <span className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-full uppercase tracking-widest">
            {loading ? '—' : updates.length} Active Alerts
          </span>
          {isFounder && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1 transition-all",
                showAddForm
                  ? "bg-slate-200 text-slate-600"
                  : "bg-[#1a4731] text-white hover:bg-[#235e41]"
              )}
            >
              {showAddForm ? <><X size={12} /> Cancel</> : <><Plus size={12} /> New Alert</>}
            </button>
          )}
        </div>
      </div>

      {/* Add New Alert Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-blue-300 p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest flex items-center gap-2">
            <Plus size={16} className="text-blue-600" /> Create New Alert
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Category</label>
              <select
                value={newAlert.category}
                onChange={e => setNewAlert({ ...newAlert, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20"
              >
                <option value="federal">Federal</option>
                <option value="state">State</option>
                <option value="compliance">Compliance</option>
                <option value="legal">Legal</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Date Label</label>
              <input
                type="text"
                value={newAlert.date_label}
                onChange={e => setNewAlert({ ...newAlert, date_label: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20"
                placeholder="e.g. Recent Update, June 2026"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Icon</label>
              <select
                value={newAlert.icon_type}
                onChange={e => setNewAlert({ ...newAlert, icon_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20"
              >
                <option value="shield_alert">Shield Alert</option>
                <option value="lock">Lock</option>
                <option value="scale">Scale</option>
                <option value="alert">Alert Circle</option>
                <option value="file">File</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Title *</label>
            <input
              type="text"
              value={newAlert.title}
              onChange={e => setNewAlert({ ...newAlert, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20"
              placeholder="Alert headline..."
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Summary *</label>
            <input
              type="text"
              value={newAlert.summary}
              onChange={e => setNewAlert({ ...newAlert, summary: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20"
              placeholder="Brief description shown below title..."
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Full Text *</label>
            <textarea
              value={newAlert.full_text}
              onChange={e => setNewAlert({ ...newAlert, full_text: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20 min-h-[120px] resize-y"
              placeholder="Full alert content..."
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Source Link (optional)</label>
            <input
              type="url"
              value={newAlert.link}
              onChange={e => setNewAlert({ ...newAlert, link: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500/20"
              placeholder="https://..."
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddAlert}
              className="px-6 py-2.5 bg-[#1a4731] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#235e41] transition-all flex items-center gap-2 shadow-lg"
            >
              <Save size={14} /> Publish Alert
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 size={24} className="animate-spin text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-400">Loading alerts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
          <AlertCircle size={24} className="text-red-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-red-600">{error}</p>
          <button onClick={handleRefresh} className="mt-3 text-xs font-bold text-red-500 underline">Retry</button>
        </div>
      )}

      {/* Alerts Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6">
          {updates.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Bell size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600">No Active Alerts</p>
              <p className="text-xs text-slate-400 mt-1">All advisories have been acknowledged. New alerts will appear here automatically.</p>
            </div>
          ) : updates.map((update) => {
            const IconComponent = ICON_MAP[update.icon_type] || ShieldAlert;
            const colorClass = update.color_class || CATEGORY_COLORS[update.category] || CATEGORY_COLORS.federal;

            return (
              <div key={update.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className={cn("px-6 py-4 border-b flex items-center gap-3", colorClass)}>
                  <IconComponent size={20} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">{update.category} Alert</h3>
                  <span className="ml-auto text-xs font-semibold opacity-75 flex items-center gap-2">
                    {update.date_label}
                    {isFounder && (
                      <button
                        onClick={() => handleDismissAlert(update.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10"
                        title="Archive this alert"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </span>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-black text-slate-800 mb-3">{update.title}</h4>
                  <p className="text-slate-600 font-medium mb-4">{update.summary}</p>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {update.full_text}
                    </p>
                  </div>

                  {update.link && (
                    <a
                      href={update.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#1a4731] hover:text-[#235e41] hover:underline transition-all"
                    >
                      <FileText size={16} /> Read Full Official Release <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

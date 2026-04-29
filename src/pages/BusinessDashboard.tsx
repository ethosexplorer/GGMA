import React, { useState, useEffect } from 'react';
import { useDraggableSidebar } from '../hooks/useDraggableSidebar';
import { Wallet, Users, Building2, Shield, Clock, TrendingUp, Plus, LayoutDashboard, CreditCard, PackageSearch, AlertCircle, ShoppingCart, Loader2, Trash2, Edit2, CheckCircle, XCircle, Sparkles, MapPin, BarChart2, Activity, MessageSquare, LogOut, FileText, ClipboardList, CheckSquare, UploadCloud, Calendar, Zap, AlertTriangle, Database, Gavel, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { StatCard } from '../components/StatCard';
import { CareWalletTab } from '../components/shared/CareWalletTab';
import { StateWelcomeBanner } from '../components/shared/StateWelcomeBanner';
import { VirtualAttendantTab } from '../components/oversight/VirtualAttendantTab';
import { SubscriptionPortal } from '../components/SubscriptionPortal';
import { turso } from '../lib/turso';
import { initializeDatabase } from '../lib/tursoMigrations';
import { ComplianceEngineTab } from '../components/business/ComplianceEngineTab';
import { AttorneyMarketplaceTab } from '../components/shared/AttorneyMarketplaceTab';
import { DashboardAnalytics } from '../components/DashboardAnalytics';
import { RegulatoryReportingTab } from '../components/business/RegulatoryReportingTab';
import { BusinessApplicationsTab } from '../components/business/BusinessApplicationsTab';
import { StressTestEngine, StressTestResult } from '../lib/compliance/StressTestEngine';
import { UserCalendar } from '../components/UserCalendar';
import { DEAApplicationWizard } from '../components/business/DEAApplicationWizard';

// Simple Button mock
const Button = ({ children, className, icon: Icon, variant, disabled, ...props }: any) => (
  <button disabled={disabled} className={cn("inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm border transition-all disabled:opacity-50", 
    variant === "outline" ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50" : "bg-[#1a4731] text-white border-transparent hover:bg-[#153a28]",
    className)} {...props}>
    {Icon && <Icon size={14} />} {children}
  </button>
);

// Mini Sparkline Component
const TrendSparkline = () => (
  <svg viewBox="0 0 100 30" className="w-24 h-8 overflow-visible">
    <path
      d="M0 25 Q15 15, 30 20 T60 10 T90 5"
      fill="none"
      stroke="#10b981"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-sm"
    />
    <circle cx="90" cy="5" r="4" fill="#10b981" />
  </svg>
);

// Mini CSS Bar Chart Component
const MiniBarChart = ({ data }: { data: number[] }) => (
  <div className="flex items-end gap-1 h-8">
    {data.map((h, i) => (
      <div key={i} className="w-2 bg-[#1a4731] rounded-t-sm" style={{ height: `${h}%`, opacity: 0.5 + (h / 100) }} />
    ))}
  </div>
);

export const BusinessDashboard = ({ onLogout, user, initialTab, onOpenConcierge, jurisdiction = 'Oklahoma' }: { onLogout?: () => void | Promise<void>, user?: any, initialTab?: any, onOpenConcierge?: () => void, jurisdiction?: string }) => {
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'pos' | 'inventory' | 'locations' | 'compliance' | 'insurance' | 'documents' | 'subscription' | 'integrations' | 'staff' | 'traceability' | 'readiness' | 'dea' | 'wallet' | 'attorneys' | 'reporting' | 'applications'>(initialTab || 'analytics');
  const navigateTab = (tab: typeof activeTab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };

  // Default tab items for drag-and-drop reordering
  const DEFAULT_BIZ_TABS = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reporting', label: 'Reporting', icon: FileText },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'pos', label: 'POS & Sales', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory (SINC)', icon: PackageSearch },
    { id: 'locations', label: user?.role === 'compliance_service' ? 'Managed Clients' : 'Locations', icon: user?.role === 'compliance_service' ? Users : MapPin },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'staff', label: 'Staff', icon: ClipboardList },
    { id: 'traceability', label: 'Traceability', icon: Database },
    { id: 'readiness', label: 'OMMA Ready', icon: CheckSquare },
    { id: 'dea', label: 'DEA Sch. III', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: BarChart2 },
    { id: 'insurance', label: 'Insurance & Bonding', icon: ClipboardList },
    { id: 'documents', label: 'Vault', icon: FileText },
    { id: 'wallet', label: 'Care Wallet', icon: Wallet },
    { id: 'attorneys', label: 'Attorney Marketplace', icon: Gavel },
  ];

  // Drag-and-drop tab reordering
  const { items: bizTabs, handleDragStart, handleDragEnter, handleDragEnd, handleDragOver } = useDraggableSidebar(DEFAULT_BIZ_TABS, 'ggp_business_tab_order');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Data States
  const [entities, setEntities] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Form States
  const [showAddEntity, setShowAddEntity] = useState(false);
  const [editingEntity, setEditingEntity] = useState<any>(null);

  const [showAddInventory, setShowAddInventory] = useState(false);
  const [editingInventory, setEditingInventory] = useState<any>(null);

  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);

  const [newEntity, setNewEntity] = useState({ name: '', type: 'Retail', state: 'California' });
  const [newItem, setNewItem] = useState({ entity_id: '', item_name: '', category: 'Flower', quantity: 0, unit: 'Grams', price: 0 });
  const [newTx, setNewTx] = useState({ entity_id: '', amount: 0, type: 'B2C Sales' });
  const [newPolicy, setNewPolicy] = useState({ entity_id: '', type: 'Grower Surety Bond', provider: '', amount: 0, expires_at: '' });
  const [newDoc, setNewDoc] = useState({ entity_id: '', name: '', type: 'Compliance' });
  const [stressTestResult, setStressTestResult] = useState<StressTestResult | null>(null);
  const [isStressTesting, setIsStressTesting] = useState(false);


  useEffect(() => {
    const setup = async () => {
      try {
        await initializeDatabase();
        await fetchData();
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitializing(false);
      }
    };
    setup();
  }, []);

  const runStressTest = async () => {
    setIsStressTesting(true);
    try {
      const result = await StressTestEngine.runStressTest(entities[0]?.id || 'ent-1', 50);
      setStressTestResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStressTesting(false);
    }
  };

  const fetchData = async () => {
    try {
      const entRes = await turso.execute('SELECT * FROM entities ORDER BY created_at DESC');
      setEntities(entRes.rows);

      const invRes = await turso.execute(`
        SELECT inventory.*, entities.name as entity_name 
        FROM inventory 
        LEFT JOIN entities ON inventory.entity_id = entities.id
        ORDER BY inventory.id DESC
      `);
      setInventory(invRes.rows);

      const txRes = await turso.execute(`
        SELECT transactions.*, entities.name as entity_name 
        FROM transactions 
        LEFT JOIN entities ON transactions.entity_id = entities.id
        ORDER BY transactions.date DESC
      `);
      setTransactions(txRes.rows);

      const altRes = await turso.execute(`
        SELECT compliance_alerts.*, entities.name as entity_name 
        FROM compliance_alerts 
        LEFT JOIN entities ON compliance_alerts.entity_id = entities.id
        ORDER BY compliance_alerts.is_resolved ASC, compliance_alerts.date DESC
      `);
      setAlerts(altRes.rows);

      const polRes = await turso.execute(`
        SELECT insurance_policies.*, entities.name as entity_name 
        FROM insurance_policies 
        LEFT JOIN entities ON insurance_policies.entity_id = entities.id
      `);
      if(polRes.rows) setPolicies(polRes.rows);

      const docRes = await turso.execute(`
        SELECT documents.*, entities.name as entity_name 
        FROM documents 
        LEFT JOIN entities ON documents.entity_id = entities.id
        ORDER BY documents.uploaded_at DESC
      `);
      if(docRes.rows) setDocuments(docRes.rows);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  /* ===================== ENTITIES CRUD ===================== */
  const handleAddEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = `ent-${Date.now()}`;
      await turso.execute({
        sql: `INSERT INTO entities (id, name, type, state, status, last_audit) VALUES (?, ?, ?, ?, 'Compliant', 'Just Now')`,
        args: [id, newEntity.name, newEntity.type, newEntity.state]
      });
      setShowAddEntity(false);
      setNewEntity({ name: '', type: 'Retail', state: 'California' });
      await fetchData();
    } catch(err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  };

  const handleUpdateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingEntity) return;
    setIsSubmitting(true);
    try {
      await turso.execute({
        sql: `UPDATE entities SET name = ?, type = ?, state = ? WHERE id = ?`,
        args: [editingEntity.name, editingEntity.type, editingEntity.state, editingEntity.id]
      });
      setEditingEntity(null);
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteEntity = async (id: string) => {
    if(!confirm('Delete this entity? It will affect related inventory and transactions.')) return;
    setProcessingId(id);
    try {
      await turso.execute({ sql: `DELETE FROM entities WHERE id = ?`, args: [id] });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setProcessingId(null); }
  };

  /* ===================== INVENTORY CRUD ===================== */
  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = `inv-${Date.now()}`;
      await turso.execute({
        sql: `INSERT INTO inventory (id, entity_id, item_name, category, quantity, unit, price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [id, newItem.entity_id, newItem.item_name, newItem.category, newItem.quantity, newItem.unit, newItem.price]
      });
      setShowAddInventory(false);
      setNewItem({ entity_id: '', item_name: '', category: 'Flower', quantity: 0, unit: 'Grams', price: 0 });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingInventory) return;
    setIsSubmitting(true);
    try {
      await turso.execute({
        sql: `UPDATE inventory SET item_name = ?, category = ?, quantity = ?, unit = ?, price = ? WHERE id = ?`,
        args: [editingInventory.item_name, editingInventory.category, editingInventory.quantity, editingInventory.unit, editingInventory.price, editingInventory.id]
      });
      setEditingInventory(null);
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteInventory = async (id: string) => {
    if(!confirm('Delete this inventory item?')) return;
    setProcessingId(id);
    try {
      await turso.execute({ sql: `DELETE FROM inventory WHERE id = ?`, args: [id] });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setProcessingId(null); }
  };

  /* ===================== TRANSACTIONS CRUD ===================== */
  const handleAddTx = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = `tx-${Date.now()}`;
      const date = new Date().toISOString().split('T')[0];
      await turso.execute({
        sql: `INSERT INTO transactions (id, entity_id, date, amount, type, status) VALUES (?, ?, ?, ?, ?, 'Completed')`,
        args: [id, newTx.entity_id, date, newTx.amount, newTx.type]
      });
      setShowAddTx(false);
      setNewTx({ entity_id: '', amount: 0, type: 'B2C Sales' });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteTx = async (id: string) => {
    if(!confirm('Void this transaction?')) return;
    setProcessingId(id);
    try {
      await turso.execute({ sql: `DELETE FROM transactions WHERE id = ?`, args: [id] });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setProcessingId(null); }
  };

  /* ===================== ALERTS CRUD ===================== */
  const handleResolveAlert = async (id: string) => {
    setProcessingId(id);
    try {
      await turso.execute({
        sql: `UPDATE compliance_alerts SET is_resolved = 1, status = 'Resolved' WHERE id = ?`,
        args: [id]
      });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setProcessingId(null); }
  };

  const handleAcknowledgeAlert = async (id: string) => {
    setProcessingId(id);
    try {
      await turso.execute({
        sql: `UPDATE compliance_alerts SET status = 'Acknowledged' WHERE id = ? AND is_resolved = 0`,
        args: [id]
      });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setProcessingId(null); }
  };

  /* ===================== INSURANCE & DOCUMENTS CRUD ===================== */
  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = `ins-${Date.now()}`;
      await turso.execute({
        sql: `INSERT INTO insurance_policies (id, entity_id, type, provider, amount, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, 'Active')`,
        args: [id, newPolicy.entity_id, newPolicy.type, newPolicy.provider, newPolicy.amount, newPolicy.expires_at]
      });
      setShowAddPolicy(false);
      setNewPolicy({ entity_id: '', type: 'Grower Surety Bond', provider: '', amount: 0, expires_at: '' });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = `doc-${Date.now()}`;
      const date = new Date().toLocaleDateString('en-US');
      await turso.execute({
        sql: `INSERT INTO documents (id, entity_id, name, type, uploaded_at, url) VALUES (?, ?, ?, ?, ?, '#')`,
        args: [id, newDoc.entity_id, newDoc.name, newDoc.type, date]
      });
      setShowAddDoc(false);
      setNewDoc({ entity_id: '', name: '', type: 'Compliance' });
      await fetchData();
    } catch(err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
         <Loader2 className="animate-spin text-[#1a4731]" size={36} />
         <p className="text-slate-500 font-medium">Connecting to Turso Database...</p>
      </div>
    );
  }

  const totalRevenue = transactions.reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
  
  // Calculate dynamic weekly revenues for bar chart
  const last7DaysTransactions = transactions.reduce((acc, tx) => {
    const d = new Date(tx.date).getDay();
    acc[d] = (acc[d] || 0) + Number(tx.amount || 0);
    return acc;
  }, {} as Record<number, number>);
  const barChartDataRaw = [0, 1, 2, 3, 4, 5, 6].map(d => last7DaysTransactions[d] || Math.max(10, Math.random() * 50));
  const maxBar = Math.max(...barChartDataRaw, 1);
  const barChartHeights = barChartDataRaw.map(v => Math.max(10, (v / maxBar) * 100));

  // Dynamic AI data
  const lowStockAlerts = inventory.filter(i => i.quantity < 100);
  const unresolvedAlerts = alerts.filter(a => a.is_resolved === 0);
  const complianceScore = Math.max(0, 100 - (unresolvedAlerts.length * 5));

  return (
  <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
    {/* DASHBOARD HEADER & NAV */}
    <div className="sticky top-4 z-40 flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-2 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/80 shadow-xl shadow-slate-200/40">
      <div className="flex items-center gap-4 pl-4 py-2">
        <div className="w-12 h-12 bg-[#1a4731] bg-gradient-to-br from-[#1a4731] to-[#0f291c] rounded-2xl flex items-center justify-center text-white shadow-inner border border-emerald-900/50">
          <Building2 size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{user?.role === 'compliance_service' ? 'Compliance Service Portal' : 'Business Portal'}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Global Green Enterprise <span className="mx-2 text-slate-300">|</span> <span className="font-black text-[#1a4731] uppercase tracking-widest">{jurisdiction}</span></p>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100/60 rounded-3xl w-full xl:w-auto border border-slate-200/50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#94a3b8 transparent' }}>
        {bizTabs.map((tab, index) => {
          // Special color styling for certain tabs
          const isActive = activeTab === tab.id;
          const specialActive = tab.id === 'compliance' && isActive ? 'bg-white text-amber-600 shadow-sm shadow-slate-200/50'
            : tab.id === 'readiness' && isActive ? 'bg-white text-amber-600 shadow-sm shadow-slate-200/50'
            : tab.id === 'integrations' && isActive ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200/50'
            : tab.id === 'attorneys' && isActive ? 'bg-white text-emerald-600 shadow-sm shadow-slate-200/50'
            : isActive ? 'bg-white text-[#1a4731] shadow-sm shadow-slate-200/50'
            : '';
          const specialInactive = tab.id === 'readiness' ? 'hover:text-amber-600'
            : tab.id === 'integrations' ? 'hover:text-indigo-600'
            : 'hover:text-slate-800';

          return (
            <button
              key={tab.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onClick={() => navigateTab(tab.id as any)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-grab active:cursor-grabbing relative group",
                isActive ? specialActive : `text-slate-500 ${specialInactive} hover:bg-slate-200/50`
              )}
            >
              <tab.icon size={18} className={tab.id === 'compliance' && !isActive ? 'group-hover:text-amber-500 transition-colors' : tab.id === 'attorneys' && !isActive ? 'group-hover:text-emerald-500 transition-colors' : ''} />
              {tab.label}
              {tab.id === 'compliance' && alerts.filter(a => a.is_resolved === 0).length > 0 && <span className="absolute top-2 right-3 w-2 h-2 rounded-full bg-red-500"></span>}
            </button>
          );
        })}
        <div className="w-px h-8 bg-slate-200/80 mx-1 self-center" />
        <button 
          onClick={() => { setDemoUnlocked(true); navigateTab('subscription'); }}
          className={cn("px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap", activeTab === 'subscription' ? "bg-amber-500 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20" : "text-slate-500 hover:text-amber-600 hover:bg-slate-200/50")}
        >
          <Sparkles size={18} /> Settings
        </button>
        <button 
          onClick={onLogout}
          className="px-4 py-2.5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center shrink-0"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>

    {/* Universal Back Button — returns to previous tab or home */}
    {activeTab !== 'home' && activeTab !== 'analytics' && (
      <button 
        onClick={() => { const goTo = previousTab || 'home'; setPreviousTab('home'); setActiveTab(goTo as any); }} 
        className="flex items-center gap-2 text-slate-500 hover:text-[#1a4731] transition-colors font-bold mb-4 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">{previousTab && previousTab !== 'home' ? `Back to ${previousTab.charAt(0).toUpperCase() + previousTab.slice(1)}` : 'Back to Dashboard'}</span>
      </button>
    )}

    {/* HOME TAB - PERFORMANCE DESIGN */}
    {activeTab === 'home' && (
      <div className="space-y-6">
        <StateWelcomeBanner jurisdiction={jurisdiction} type="business" />
        
        {/* Subscription Upsell Banner */}
        <div className="bg-emerald-800 bg-gradient-to-r from-emerald-800 via-[#1a4731] to-emerald-900 rounded-[2rem] p-5 flex flex-col md:flex-row items-center justify-between text-white shadow-lg shadow-emerald-900/20 mb-4 border border-emerald-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-emerald-500/10 blur-2xl"></div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10"><Sparkles className="text-emerald-300" size={24} /></div>
             <div>
                <h4 className="font-black text-lg tracking-wide">Upgrade to Pro API Sync</h4>
                <p className="text-sm text-emerald-100/80 font-medium hidden sm:block">Automate compliance reports and enable live Metrc inventory tracking.</p>
             </div>
          </div>
          <Button onClick={() => { setDemoUnlocked(true); navigateTab('subscription'); }} className="bg-white text-[#1a4731] hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-black/10 whitespace-nowrap mt-4 md:mt-0 font-black rounded-xl">
            Upgrade Engine
          </Button>
        </div>

        {/* TOP ROW WIDGETS (3-Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Compliance Scorecard */}
           <div className="bg-[#0f291c] bg-gradient-to-br from-[#0f291c] via-[#1a4731] to-[#246645] rounded-[2rem] border border-emerald-800/50 p-6 shadow-xl shadow-emerald-900/10 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start mb-4">
                 <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-3">
                      <Shield size={12} /> Live Engine
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight leading-none">Readiness</h3>
                    <p className="text-xs font-medium text-emerald-100/80 mt-1">
                      {unresolvedAlerts.length === 0 ? "Fully Compliant" : `${unresolvedAlerts.length} Action Gaps`}
                    </p>
                 </div>
                 <div className="relative">
                   <div className={cn("absolute inset-0 rounded-full blur-md opacity-60", complianceScore > 90 ? "bg-emerald-400" : complianceScore > 75 ? "bg-amber-400" : "bg-red-500", unresolvedAlerts.length > 0 && "animate-pulse")}></div>
                   <div className={cn("relative w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-inner border-[3px]", complianceScore > 90 ? "bg-emerald-400 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-300/50" : complianceScore > 75 ? "bg-amber-400 bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-300/50" : "bg-red-400 bg-gradient-to-br from-red-400 to-red-600 text-white border-red-300/50")}>
                      {complianceScore}
                   </div>
                 </div>
              </div>
              
              <div className="relative z-10 w-full mt-auto">
                 <div className="w-full bg-black/20 rounded-full h-3 border border-white/5 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000 relative overflow-hidden", complianceScore > 90 ? "bg-emerald-400" : complianceScore > 75 ? "bg-amber-400" : "bg-red-500")} style={{ width: `${complianceScore}%` }}>
                       <div className="absolute top-0 left-0 w-full h-full bg-white/20 blur-sm translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Metrc Integration Status */}
           <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500"></div>
             <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Metrc Integration</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                    <CheckCircle size={14} /> Validated
                  </div>
                </div>
                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                  <Database size={20} />
                </div>
             </div>
             <div className="space-y-3 mt-4">
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Key</span>
                 <span className="text-xs font-mono font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded">sk_live_...942</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rate Limit</span>
                 <span className="text-xs font-bold text-slate-600">5 calls / sec</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Limit</span>
                 <span className="text-xs font-bold text-emerald-600">50,000 (Unlimited Facilities)</span>
               </div>
             </div>
           </div>

           {/* Insurance & Bonding Tracker */}
           <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-1.5 h-full bg-violet-500"></div>
             <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Policies & Bonds</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{policies.length} Active Records</p>
                </div>
                <div className="bg-violet-50 p-2.5 rounded-xl text-violet-600">
                  <Shield size={20} />
                </div>
             </div>
             
             <div className="mt-4 space-y-3">
               {policies.length > 0 ? policies.slice(0, 2).map((policy, idx) => (
                 <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div>
                      <p className="text-xs font-black text-slate-800 truncate max-w-[140px]">{policy.type}</p>
                      <p className="text-[10px] font-bold text-slate-500">Limits: ${Number(policy.amount).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-md">
                         Active
                       </span>
                    </div>
                 </div>
               )) : (
                 <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
                    <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-800">No Policies Listed</p>
                      <p className="text-[10px] text-amber-600 mt-1 cursor-pointer hover:underline" onClick={() => navigateTab('insurance')}>Upload certificate to resolve.</p>
                    </div>
                 </div>
               )}
             </div>
           </div>
        </div>


        {/* Main Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Revenue */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Today's Revenue</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black text-slate-800">${totalRevenue.toLocaleString()}</h3>
                   <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                     <TrendingUp size={12} /> +8.2%
                   </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                 <Activity size={24} />
              </div>
            </div>
            <div className="mt-2 pl-2">
               <TrendSparkline />
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Monthly Active</p>
                <h3 className="text-3xl font-black text-slate-800">${(totalRevenue * 4.2).toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                 <BarChart2 size={24} />
              </div>
            </div>
            <div className="mt-auto">
               <MiniBarChart data={barChartHeights} />
            </div>
          </div>

          {/* Active Locations — clickable to see details */}
          <div onClick={() => navigateTab('locations')} className="cursor-pointer bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#1a4731]"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Active Locations</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black text-slate-800">{entities.filter(e => e.status === 'Compliant').length} <span className="text-lg text-slate-400">/ {entities.length}</span></h3>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-[#1a4731] rounded-2xl group-hover:bg-[#1a4731] group-hover:text-white transition-colors duration-300">
                 <Building2 size={24} />
              </div>
            </div>
            <p className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl w-fit inline-flex items-center gap-2 mt-auto">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
              Action Req.
            </p>
          </div>
        </div>

        {/* Key Status Cards (5-Cols) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
           <div className="bg-white rounded-[2rem] border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                 <h4 className="font-black text-slate-800 tracking-tight text-sm">Metrc Tracker</h4>
                 <Database size={16} className="text-blue-500" />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Tags Active</span>
                   <span className="text-xs font-black text-slate-800">4,208</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Status</span>
                   <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={10}/> Passing</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                 <h4 className="font-black text-slate-800 tracking-tight text-sm">OMMA Checklist</h4>
                 <Shield size={16} className="text-amber-500" />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-amber-50 border border-amber-100 p-2 rounded-xl text-amber-700">
                   <div className="flex items-center gap-1"><AlertTriangle size={12}/> <span className="text-[10px] font-bold uppercase">Larry Alerts</span></div>
                   <span className="text-xs font-black">{unresolvedAlerts.length} Action(s)</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Audit Ready</span>
                   <span className="text-[10px] font-bold text-slate-700">Pending</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                 <h4 className="font-black text-slate-800 tracking-tight text-sm">SINC Inventory</h4>
                 <PackageSearch size={16} className="text-emerald-500" />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-emerald-700">
                   <span className="text-[10px] font-bold uppercase">Reconciliation</span>
                   <span className="text-xs font-black">Matched 100%</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Physical Audit</span>
                   <span className="text-[10px] font-bold text-slate-700">2w ago</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2rem] border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                 <h4 className="font-black text-slate-800 tracking-tight text-sm">External Permits</h4>
                 <FileText size={16} className="text-violet-500" />
              </div>
              <div className="space-y-2">
                 <div className="flex flex-wrap gap-2">
                   <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 flex items-center gap-1"><CheckCircle size={10}/> COO</span>
                   <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 flex items-center gap-1"><CheckCircle size={10}/> OBNDD</span>
                   <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 flex items-center gap-1"><CheckCircle size={10}/> Zoning</span>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-50 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] border border-indigo-200/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="flex justify-between items-center mb-3 relative z-10">
                 <h4 className="font-black text-indigo-900 tracking-tight text-sm">Federal (Sch III)</h4>
                 <Building2 size={16} className="text-blue-600" />
              </div>
              <div className="space-y-2 relative z-10">
                 <div className="flex justify-between items-center bg-white/60 p-2 rounded-xl text-indigo-800 border border-indigo-100">
                   <span className="text-[10px] font-bold uppercase">DEA Registration</span>
                   <span className="text-[10px] font-black text-amber-600 animate-pulse">Required</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/60 p-2 rounded-xl text-indigo-800 border border-indigo-100">
                   <span className="text-[10px] font-bold uppercase">280E Tax Relief</span>
                   <span className="text-[10px] font-black text-emerald-600">Eligible</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Layout Split for Alerts & Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              
              {/* Quick Actions Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 overflow-x-auto hide-scrollbar pb-2 pt-2">
                 <button onClick={() => setActiveTab('pos')} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300 transition-all text-indigo-600 font-bold text-sm min-w-max">
                   <ShoppingCart size={16} /> Open POS
                 </button>
                 <button onClick={() => setActiveTab('readiness')} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300 transition-all text-amber-600 font-bold text-sm min-w-max">
                   <Shield size={16} /> OMMA Report
                 </button>
                 <label className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-400 transition-all text-slate-700 font-bold text-sm min-w-max cursor-pointer">
                   <UploadCloud size={16} /> Upload Docs
                   <input type="file" className="hidden" onChange={(e) => { if(e.target.files?.length) { alert("Document uploaded and securely saved to your Vault."); e.target.value = ""; } }} />
                 </label>
                 <button onClick={(e) => { const btn = e.currentTarget; const orig = btn.innerHTML; btn.innerHTML = "<span class=\"animate-spin inline-block\">↻</span> Syncing..."; setTimeout(() => { btn.innerHTML = orig; alert("All systems synced successfully."); }, 1500); }} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 transition-all text-blue-600 font-bold text-sm min-w-max">
                   <Activity size={16} /> Refresh Status
                 </button>
                 {onOpenConcierge && (
                   <button onClick={() => setActiveTab('applications')} className="flex items-center gap-2 px-4 py-3 bg-[#1a4731] text-white border border-transparent rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#153a28] transition-all font-black text-sm min-w-max ml-auto">
                     <Sparkles size={16} className="text-emerald-300" /> Start New Action
                   </button>
                 )}
                 <button onClick={onOpenConcierge || (() => {})} className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-[#1a4731] transition-all text-[#1a4731] font-bold text-sm min-w-max sm:hidden">
                   <MessageSquare size={16} /> L.A.R.R.Y Chat
                 </button>
              </div>

              {/* L.A.R.R.Y Task List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                   <div className="flex items-center gap-2">
                      <CheckSquare className="text-emerald-600" size={18} />
                      <h3 className="font-bold text-slate-800">L.A.R.R.Y Tasks</h3>
                   </div>
                   <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">3 Pending</span>
                 </div>
                 <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between bg-amber-50/50 hover:bg-amber-50 transition-colors">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5"><Zap size={16} className="text-amber-500" /></div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-800">Complete Metrc API Training & Test</h4>
                               <p className="text-xs text-slate-500 mt-0.5">Due: Today (April 21, 2026) • Assignee: Shantell Robinson</p>
                            </div>
                         </div>
                         <button onClick={() => window.open('https://www.metrc.com/integrators/training/', '_blank')} className="text-xs font-bold text-white bg-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-700 whitespace-nowrap">Take Test</button>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5"><CheckCircle size={16} className="text-emerald-500" /></div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-800">Production Go-Live Readiness Audit</h4>
                               <p className="text-xs text-slate-500 mt-0.5">Automated check for facility IDs and item mappings • Status: Pending</p>
                            </div>
                         </div>
                         <button onClick={() => alert("Starting automated Go-Live Readiness Audit... Audit complete. All systems nominal.")} className="text-xs font-bold text-[#1a4731] bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 whitespace-nowrap">Run Audit</button>
                    </div>
                   {unresolvedAlerts.length > 0 && unresolvedAlerts.map(alert => (
                     <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5"><AlertTriangle size={16} className="text-amber-500" /></div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{alert.message}</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Due: Immediately • Entity: {alert.entity_name}</p>
                           </div>
                        </div>
                        <button onClick={() => navigateTab('compliance')} className="text-xs font-bold text-[#1a4731] bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 whitespace-nowrap">Resolve</button>
                     </div>
                   ))}
                   <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                           <div className="mt-0.5"><Clock size={16} className="text-blue-500" /></div>
                           <div>
                              <h4 className="text-sm font-bold text-slate-800">Renew Grower Bond ($50,000)</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Due in 45 days • Provider: ProSure Group</p>
                           </div>
                        </div>
                        <button onClick={() => navigateTab('insurance')} className="text-xs font-bold text-[#1a4731] bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 whitespace-nowrap">View</button>
                   </div>
                </div>
              </div>

              {/* Multi-Location Status Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800">Multi-Location Overview</h3>
                  <button onClick={() => navigateTab('locations')} className="text-xs font-bold text-[#1a4731] hover:underline">View All</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {entities.map((en, i) => {
                     // mock sync time mapping based on index
                     const syncTime = `${i + 1}m ago`;
                     const isCompliant = en.status === 'Compliant';
                     return (
                       <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                               <MapPin size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-slate-800">{en.name}</h4>
                               <p className="text-xs text-slate-500 font-medium">Synced: <span className="text-slate-700">{en.last_audit} via METRC API</span></p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <p className="font-bold text-slate-900">{inventory.filter(inv => inv.entity_id === en.id).length}</p>
                               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SKUs</p>
                            </div>
                            <div className="w-[120px] flex justify-end">
                              <button onClick={() => !isCompliant && navigateTab('compliance')} className={cn(
                                "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-1 transition-all",
                                isCompliant ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                              )}>
                                {isCompliant ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                                {isCompliant ? '100% Compliant' : 'Action Required'}
                              </button>
                            </div>
                         </div>
                       </div>
                     )
                  })}
                </div>
              </div>
           </div>
           
           <div className="lg:col-span-1">
              {/* L.A.R.R.Y AI Chat Widget */}
              <div className="bg-[#1a4731] bg-gradient-to-b from-[#1a4731] to-[#0f291c] rounded-2xl shadow-xl overflow-hidden flex flex-col h-full sticky top-[80px]">
                 <div className="p-5 flex items-center gap-3 border-b border-white/10 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-400 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-inner">
                       <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-tight">L.A.R.R.Y AI</h3>
                      <p className="text-[10px] text-emerald-200/80 uppercase font-bold tracking-widest flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                      </p>
                    </div>
                 </div>
                 
                 <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-sm border border-white/10 backdrop-blur-sm self-start max-w-[90%]">
                       <p className="text-sm font-medium text-emerald-50 leading-relaxed">
                         {lowStockAlerts.length > 0 
                            ? `Good morning! You have ${lowStockAlerts.length} SKUs running low across your active entities. Would you like to review procurement options?` 
                            : unresolvedAlerts.length > 0
                            ? `Good morning. You have ${unresolvedAlerts.length} unresolved compliance alerts. I can help clear them up.`
                            : `Good morning! All your entities are compliant and well stocked. Let me know how I can assist.`}
                       </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2">
                       <button onClick={() => { if(lowStockAlerts.length > 0) setActiveTab("inventory"); else if (unresolvedAlerts.length > 0) setActiveTab("compliance"); else setActiveTab("reporting"); }} className="text-xs font-bold bg-white text-[#1a4731] px-4 py-2.5 rounded-xl text-left hover:bg-slate-100 transition-colors shadow-sm w-max self-end hidden sm:block">
                         {lowStockAlerts.length > 0 ? "Review Procurement" : unresolvedAlerts.length > 0 ? "Review Alerts" : "Generate Report"}
                       </button>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-black/20 shrink-0">
                    <div className="relative">
                       <input type="text" placeholder="Ask L.A.R.R.Y to run an audit..." className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all" onKeyDown={(e) => { if(e.key === "Enter") { alert("L.A.R.R.Y is analyzing your request. Standby."); e.currentTarget.value = ""; } }} />
                       <button onClick={(e) => { const input = e.currentTarget.previousElementSibling as HTMLInputElement; if(input) { alert("L.A.R.R.Y is analyzing your request. Standby."); input.value = ""; } }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-white transition-colors">
                         <MessageSquare size={16} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    )}

    {/* POS & SALES TAB (former transactions) */}
    {activeTab === 'pos' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-800">POS & Sales Tracking</h3>
              <p className="text-sm text-slate-500">Live operational sales inputs</p>
            </div>
            <Button onClick={() => setShowAddTx(!showAddTx)} icon={Plus}>Log Transaction</Button>
          </div>

          {showAddTx && (
             <div className="p-6 bg-slate-50 border-b border-slate-100">
                <form onSubmit={handleAddTx} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Entity</label>
                     <select required value={newTx.entity_id} onChange={e => setNewTx({...newTx, entity_id: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option value="">Select...</option>
                       {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Type</label>
                     <select required value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option>B2C Sales</option>
                       <option>B2B Wholesale</option>
                       <option>Transfer</option>
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Amount ($)</label>
                     <input type="number" step="0.01" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="0.00" />
                   </div>
                   <Button type="submit" className="h-10 px-6 shrink-0" disabled={isSubmitting || !newTx.entity_id}>{isSubmitting ? 'Saving...' : 'Log Input'}</Button>
                </form>
             </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a4731]/5 text-[#1a4731] text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Trans. ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No transactions recorded.</td></tr>
                ) : transactions.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id.split('-')[1] || item.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-800">{item.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.entity_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.type}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${item.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">{item.status}</span>
                    </td>
                    <td className="px-6 py-4">
                       <button onClick={() => handleDeleteTx(item.id)} disabled={processingId === item.id} title="Void Transaction" className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50">
                         {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    )}

    {/* LOCATIONS TAB (former Overview) */}
    {activeTab === 'locations' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-800">Entity Licensing Visibility</h3>
            <p className="text-sm text-slate-500">Manage your business units and basic compliance status</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => {setShowAddEntity(!showAddEntity); setEditingEntity(null);}} icon={Plus}>Add Entity</Button>
          </div>
        </div>
        
        {(showAddEntity || editingEntity) && (
           <div className="p-6 bg-slate-50 border-b border-slate-100">
              <form onSubmit={editingEntity ? handleUpdateEntity : handleAddEntity} className="flex flex-col md:flex-row gap-4 items-end">
                 <div className="w-full">
                   <label className="text-xs font-bold text-slate-600 mb-1 block">Entity Name</label>
                   <input required value={editingEntity ? editingEntity.name : newEntity.name} onChange={e => editingEntity ? setEditingEntity({...editingEntity, name: e.target.value}) : setNewEntity({...newEntity, name: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="Dispensary LLC..." />
                 </div>
                 <div className="w-full">
                   <label className="text-xs font-bold text-slate-600 mb-1 block">Type</label>
                   <select value={editingEntity ? editingEntity.type : newEntity.type} onChange={e => editingEntity ? setEditingEntity({...editingEntity, type: e.target.value}) : setNewEntity({...newEntity, type: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm">
                     <option>Retail</option>
                     <option>Production</option>
                     <option>Distribution</option>
                   </select>
                 </div>
                 <div className="w-full">
                   <label className="text-xs font-bold text-slate-600 mb-1 block">State / Jurisdiction</label>
                   <input required value={editingEntity ? editingEntity.state : newEntity.state} onChange={e => editingEntity ? setEditingEntity({...editingEntity, state: e.target.value}) : setNewEntity({...newEntity, state: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="e.g. California" />
                 </div>
                 <div className="flex gap-2">
                   <Button type="submit" className="h-10 px-6 shrink-0" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (editingEntity ? 'Update Entity' : 'Save Entity')}</Button>
                   {editingEntity && <Button type="button" variant="outline" onClick={() => setEditingEntity(null)} className="h-10 px-4">Cancel</Button>}
                 </div>
              </form>
           </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50 text-[#1a4731] text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Entity Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entities.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No entities found.</td></tr>
              ) : entities.map((item, i) => (
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
                  <td className="px-6 py-4 flex gap-2">
                     <button onClick={() => {setEditingEntity(item); setShowAddEntity(false);}} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                     <button onClick={() => handleDeleteEntity(item.id)} disabled={processingId === item.id} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50">
                       {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* INVENTORY TAB */}
    {activeTab === 'inventory' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-800">Basic Inventory Tracking</h3>
              <p className="text-sm text-slate-500">Track operations and daily inventory counts</p>
            </div>
            <Button onClick={() => {setShowAddInventory(!showAddInventory); setEditingInventory(null);}} icon={Plus}>Add Item</Button>
          </div>

          {(showAddInventory || editingInventory) && (
             <div className="p-6 bg-slate-50 border-b border-slate-100">
                <form onSubmit={editingInventory ? handleUpdateInventory : handleAddInventory} className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
                   <div className="w-full md:w-[15%]">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Entity</label>
                     <select required disabled={!!editingInventory} value={editingInventory ? editingInventory.entity_id : newItem.entity_id} onChange={e => !editingInventory && setNewItem({...newItem, entity_id: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option value="">Select...</option>
                       {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                   </div>
                   <div className="flex-1 min-w-[200px]">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Item Name</label>
                     <input required value={editingInventory ? editingInventory.item_name : newItem.item_name} onChange={e => editingInventory ? setEditingInventory({...editingInventory, item_name: e.target.value}) : setNewItem({...newItem, item_name: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="Pineapple Express..." />
                   </div>
                   <div className="w-full md:w-[15%]">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Category</label>
                     <input required value={editingInventory ? editingInventory.category : newItem.category} onChange={e => editingInventory ? setEditingInventory({...editingInventory, category: e.target.value}) : setNewItem({...newItem, category: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="Flower" />
                   </div>
                   <div className="w-full md:w-[25%] flex gap-2">
                     <div className="w-1/2">
                       <label className="text-xs font-bold text-slate-600 mb-1 block">Quantity & Unit</label>
                       <div className="flex">
                         <input type="number" required value={editingInventory ? editingInventory.quantity : newItem.quantity} onChange={e => editingInventory ? setEditingInventory({...editingInventory, quantity: Number(e.target.value)}) : setNewItem({...newItem, quantity: Number(e.target.value)})} className="w-1/2 border border-slate-200 p-2 rounded-l-lg text-sm" placeholder="Qty" />
                         <select value={editingInventory ? editingInventory.unit : newItem.unit} onChange={e => editingInventory ? setEditingInventory({...editingInventory, unit: e.target.value}) : setNewItem({...newItem, unit: e.target.value})} className="w-1/2 border-y border-r border-slate-200 p-2 rounded-r-lg text-sm bg-slate-100">
                           <option>Grams</option>
                           <option>Liters</option>
                           <option>Units</option>
                           <option>Pounds</option>
                         </select>
                       </div>
                     </div>
                     <div className="w-1/2">
                       <label className="text-xs font-bold text-slate-600 mb-1 block">Value ($)</label>
                       <input type="number" step="0.01" required value={editingInventory ? editingInventory.price : newItem.price} onChange={e => editingInventory ? setEditingInventory({...editingInventory, price: Number(e.target.value)}) : setNewItem({...newItem, price: Number(e.target.value)})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="$" />
                     </div>
                   </div>
                   <div className="flex gap-2 w-full md:w-auto">
                     <Button type="submit" className="h-10 px-6 shrink-0 w-full md:w-auto" disabled={isSubmitting || (!editingInventory && !newItem.entity_id)}>{isSubmitting ? 'Saving...' : (editingInventory ? 'Update' : 'Add')}</Button>
                     {editingInventory && <Button type="button" variant="outline" onClick={() => setEditingInventory(null)} className="h-10 px-4">Cancel</Button>}
                   </div>
                </form>
             </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#1a4731]/5 text-[#1a4731] text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location (Entity)</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">No inventory found.</td></tr>
                ) : inventory.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{item.item_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 bg-slate-50 border-r border-slate-100">{item.entity_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-bold">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 font-bold">${item.price}</td>
                    <td className="px-6 py-4 flex gap-2">
                       <button onClick={() => {setEditingInventory(item); setShowAddInventory(false);}} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                       <button onClick={() => handleDeleteInventory(item.id)} disabled={processingId === item.id} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50">
                         {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    )}

    {/* COMPLIANCE TAB */}
    {activeTab === 'compliance' && (
      <ComplianceEngineTab />
    )}

    {/* INSURANCE & BONDING TAB */}
    {activeTab === 'insurance' && (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-800">Insurance & Bonding Tracker</h3>
              <p className="text-sm text-slate-500">Manage policies, bonds, and attestations across all entities</p>
            </div>
            <Button onClick={() => setShowAddPolicy(!showAddPolicy)} icon={Plus}>Upload Certificate</Button>
          </div>

          {showAddPolicy && (
             <div className="p-6 bg-slate-50 border-b border-slate-100">
                <form onSubmit={handleAddPolicy} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Entity</label>
                     <select required value={newPolicy.entity_id} onChange={e => setNewPolicy({...newPolicy, entity_id: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option value="">Select...</option>
                       {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Type</label>
                     <select required value={newPolicy.type} onChange={e => setNewPolicy({...newPolicy, type: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option>Grower Surety Bond</option>
                       <option>General Liability</option>
                       <option>Waste Disposal Liab.</option>
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Provider</label>
                     <input required value={newPolicy.provider} onChange={e => setNewPolicy({...newPolicy, provider: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="ProSure Group" />
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Amount ($)</label>
                     <input type="number" required value={newPolicy.amount} onChange={e => setNewPolicy({...newPolicy, amount: Number(e.target.value)})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="50000" />
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Expires (MM/DD/YYYY)</label>
                     <input required value={newPolicy.expires_at} onChange={e => setNewPolicy({...newPolicy, expires_at: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="12/31/2026" />
                   </div>
                   <Button type="submit" className="h-10 px-6 shrink-0 md:col-span-5" disabled={isSubmitting || !newPolicy.entity_id}>{isSubmitting ? 'Saving...' : 'Submit Policy'}</Button>
                </form>
             </div>
          )}

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {policies.map((pol, i) => (
              <div key={i} className={cn("bg-white border rounded-xl p-5 relative overflow-hidden shadow-sm flex flex-col", pol.status === 'Not Uploaded' ? "border-red-200" : "")}>
                 <div className={cn("absolute top-0 right-0 w-2 h-full", pol.status === 'Active' ? "bg-emerald-500" : pol.status === 'Not Uploaded' ? "bg-red-500" : "bg-amber-400")}></div>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h4 className="font-bold text-slate-800">{pol.type}</h4>
                       <p className="text-xl font-black text-slate-900 mt-1">${Number(pol.amount).toLocaleString()}</p>
                    </div>
                    <div className={cn("p-2 rounded-lg", pol.status === 'Not Uploaded' ? "bg-red-50" : "bg-slate-50")}>
                      {pol.status === 'Not Uploaded' ? <AlertTriangle className="text-red-500" size={20} /> : <Shield className="text-slate-400" size={20} />}
                    </div>
                 </div>
                 <div className="space-y-2 mb-6">
                    <p className="text-xs text-slate-500 flex justify-between"><span>Provider:</span> <span className="font-bold text-slate-800">{pol.provider}</span></p>
                    <p className="text-xs text-slate-500 flex justify-between"><span>Expires:</span> <span className={cn("font-bold", pol.status === 'Action Required' ? "text-red-600" : pol.status === 'Active' ? "text-emerald-600" : "text-amber-600")}>{pol.expires_at}</span></p>
                    <p className="text-xs text-slate-500 flex justify-between"><span>Status:</span> <span className={cn("font-bold px-2 py-0.5 rounded-full", pol.status === 'Active' ? "text-emerald-600 bg-emerald-50" : pol.status === 'Not Uploaded' ? "text-red-600 bg-red-50" : "bg-amber-50 text-amber-600")}>{pol.status}</span></p>
                    <p className="text-xs text-slate-500 flex justify-between"><span>Entity:</span> <span className="font-bold text-slate-800 truncate pl-4">{pol.entity_name}</span></p>
                 </div>
                 <Button onClick={() => setActiveTab('subscription')} className={cn("w-full mt-auto", pol.status === 'Not Uploaded' ? "bg-red-500 hover:bg-red-600 border-red-500 text-white" : pol.type === 'Grower Surety Bond' ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200")}>
                   {pol.status === 'Not Uploaded' ? 'Upload Certificate' : pol.type === 'Grower Surety Bond' ? 'Renew via Partner' : 'View Policy'}
                 </Button>
              </div>
            ))}
            {policies.length === 0 && <p className="text-slate-500 text-sm italic col-span-full">No active policies found.</p>}
          </div>
        </div>
      </div>
    )}

    {/* DOCUMENT VAULT TAB */}
    {activeTab === 'documents' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-800">OMMA Document Vault</h3>
            <p className="text-sm text-slate-500">Secure cryptographic archive for all state-required files</p>
          </div>
          <Button onClick={() => setShowAddDoc(!showAddDoc)} icon={UploadCloud}>Upload New File</Button>
        </div>

        {showAddDoc && (
             <div className="p-6 bg-slate-50 border-b border-slate-100">
                <form onSubmit={handleAddDoc} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Entity</label>
                     <select required value={newDoc.entity_id} onChange={e => setNewDoc({...newDoc, entity_id: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option value="">Select...</option>
                       {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">Document Type</label>
                     <select required value={newDoc.type} onChange={e => setNewDoc({...newDoc, type: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm bg-white">
                       <option>Compliance</option>
                       <option>Bond / Insurance</option>
                       <option>SOP / Policies</option>
                       <option>Tax / Financial</option>
                     </select>
                   </div>
                   <div className="w-full">
                     <label className="text-xs font-bold text-slate-600 mb-1 block">File Name</label>
                     <input required value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} className="w-full border border-slate-200 p-2 rounded-lg text-sm" placeholder="file_name.pdf" />
                   </div>
                   <Button type="submit" className="h-10 px-6 shrink-0 md:col-span-3" disabled={isSubmitting || !newDoc.entity_id}>{isSubmitting ? 'Uploading...' : 'Secure Upload'}</Button>
                </form>
             </div>
        )}

        <div className="p-6 overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-y border-slate-200">
                <tr>
                   <th className="px-4 py-3">Document Name</th>
                   <th className="px-4 py-3">Type</th>
                   <th className="px-4 py-3">Entity</th>
                   <th className="px-4 py-3">Date Uploaded</th>
                   <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No documents found in vault.</td></tr>
                ) : documents.map((doc, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                     <td className="px-4 py-4 font-medium text-slate-800 flex items-center gap-2"><FileText size={16} className={doc.type === 'Compliance' ? 'text-emerald-500' : 'text-slate-400'}/> {doc.name}</td>
                     <td className="px-4 py-4 text-sm text-slate-500">{doc.type}</td>
                     <td className="px-4 py-4 text-sm text-slate-500">{doc.entity_name}</td>
                     <td className="px-4 py-4 text-sm text-slate-500">{doc.uploaded_at}</td>
                     <td className="px-4 py-4 text-right"><a href={doc.url} onClick={e => e.preventDefault()} className="text-xs font-bold text-[#1a4731] hover:underline">Download</a></td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    )}

    {activeTab === 'staff' && (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div><h3 className="font-bold text-slate-800">Staff & Employee Management</h3><p className="text-sm text-slate-500">OMMA agent cards, background checks, role assignments</p></div>
            <Button icon={Plus} onClick={() => alert('Add Employee wizard initiated. Collecting name, role, OMMA card number, and background check consent...')}>Add Employee</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold tracking-wider border-b"><tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">OMMA Card</th><th className="px-4 py-3">Background</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Marcus Johnson', role: 'Budtender', card: 'Active', cardExp: '12/2026', bg: 'Clear', status: 'Active' },
                  { name: 'Sarah Kim', role: 'Manager', card: 'Active', cardExp: '08/2026', bg: 'Clear', status: 'Active' },
                  { name: 'James Ortiz', role: 'Compliance Officer', card: 'Expiring', cardExp: '05/2026', bg: 'Clear', status: 'Active' },
                  { name: 'Emily Tran', role: 'Budtender', card: 'Pending', cardExp: 'N/A', bg: 'Pending', status: 'Onboarding' },
                ].map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">{emp.name[0]}</div><span className="font-bold text-sm text-slate-800">{emp.name}</span></div></td>
                    <td className="px-4 py-4 text-sm text-slate-600">{emp.role}</td>
                    <td className="px-4 py-4"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", emp.card === 'Active' ? "bg-emerald-50 text-emerald-600" : emp.card === 'Expiring' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600")}>{emp.card} {emp.cardExp !== 'N/A' && `(${emp.cardExp})`}</span></td>
                    <td className="px-4 py-4"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", emp.bg === 'Clear' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>{emp.bg}</span></td>
                    <td className="px-4 py-4"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", emp.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>{emp.status}</span></td>
                    <td className="px-4 py-4"><button onClick={() => alert("Employee management panel opened. You can edit role, schedule, and compliance status.")} className="text-xs font-bold text-[#1a4731] hover:underline cursor-pointer">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-3">RBAC Roles</h4>
            <div className="space-y-2">{['Owner (Full Access)', 'Manager (Operations)', 'Budtender (POS Only)', 'Compliance Officer (Audits)', 'Inventory Clerk (SINC)'].map((r, i) => <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"><span className="font-medium text-slate-700">{r}</span><CheckCircle size={12} className="text-emerald-500" /></div>)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Training Compliance</h4>
            <div className="space-y-2">{['OMMA Agent Training', 'POS & Cash Handling', 'Compliance & SOPs', 'Safety & Security'].map((t, i) => <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"><span className="font-medium text-slate-700">{t}</span><span className="font-bold text-emerald-600">100%</span></div>)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Upcoming Expirations</h4>
            <div className="space-y-2">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg"><p className="text-xs font-bold text-amber-800">James Ortiz – OMMA Card</p><p className="text-[10px] text-amber-600">Expires May 2026 • 36 days</p></div>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg"><p className="text-xs font-bold text-blue-800">Emily Tran – Background Check</p><p className="text-[10px] text-blue-600">Pending OSBI • Submitted 04/15</p></div>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'traceability' && (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h3 className="text-xl font-bold text-slate-800">Seed-to-Sale Traceability</h3><p className="text-sm text-slate-500">Full chain-of-custody from cultivation → processing → retail sale</p></div>
          <div className="flex gap-2">
            <Button icon={Plus} onClick={() => alert('New Harvest Batch initialized. Enter batch name, strain, plant count, and assign RFID tags.')}>New Harvest Batch</Button>
            <Button variant="outline" icon={FileText} onClick={() => alert("Transfer manifest generated and saved to Vault.")}>Export Manifest</Button>
          </div>
        </div>
        {/* Traceability Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { stage: 'Cultivation', count: 142, icon: '🌱', color: 'emerald', desc: 'Active plants tagged' },
            { stage: 'Processing', count: 38, icon: '⚗️', color: 'blue', desc: 'Batches in extraction' },
            { stage: 'Testing', count: 12, icon: '🔬', color: 'violet', desc: 'Awaiting lab results' },
            { stage: 'Retail Ready', count: 84, icon: '🏪', color: 'amber', desc: 'Cleared for dispensary' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", `bg-${s.color}-50 text-${s.color}-600`)}>{s.stage}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-800">{s.count}</h3>
              <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
        {/* Active Batches */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50"><h3 className="font-bold text-slate-800">Active Batch Tracking</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b"><tr><th className="px-4 py-3">Batch ID</th><th className="px-4 py-3">Strain</th><th className="px-4 py-3">Stage</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Metrc Tag</th><th className="px-4 py-3">280E</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'HB-2026-0412', strain: 'Blue Dream', stage: 'Retail Ready', qty: '24 units', tag: '1A4FF010...482', tax: 'COGS', status: 'Cleared' },
                  { id: 'HB-2026-0411', strain: 'OG Kush', stage: 'Testing', qty: '5 lbs', tag: '1A4FF010...491', tax: 'COGS', status: 'Lab Pending' },
                  { id: 'HB-2026-0408', strain: 'Sour Diesel', stage: 'Processing', qty: '12 lbs', tag: '1A4FF010...503', tax: 'COGS', status: 'In Extract' },
                  { id: 'HB-2026-0401', strain: 'Girl Scout', stage: 'Cultivation', qty: '48 plants', tag: '1A4FF010...518', tax: 'COGS', status: 'Vegetative' },
                ].map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800">{b.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{b.strain}</td>
                    <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", b.stage === 'Retail Ready' ? "bg-emerald-50 text-emerald-600" : b.stage === 'Testing' ? "bg-violet-50 text-violet-600" : b.stage === 'Processing' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600")}>{b.stage}</span></td>
                    <td className="px-4 py-3 text-sm text-slate-600">{b.qty}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500">{b.tag}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">{b.tax}</span></td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-600">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recall Management */}
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <div className="flex items-center gap-3 mb-3"><AlertTriangle className="text-red-500" size={20} /><h3 className="font-bold text-red-800">Recall Management</h3></div>
          <p className="text-sm text-red-700 mb-3">OMMA recall alerts feed directly into SINC inventory. Affected batches are auto-flagged and blocked from sale.</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-white rounded-xl border border-red-100 p-3"><p className="text-xs font-bold text-slate-800">Active Recalls</p><p className="text-2xl font-black text-red-600">0</p><p className="text-[10px] text-emerald-600 font-bold">All Clear</p></div>
            <div className="flex-1 bg-white rounded-xl border border-red-100 p-3"><p className="text-xs font-bold text-slate-800">Quarantined</p><p className="text-2xl font-black text-slate-800">0</p><p className="text-[10px] text-slate-500">No affected batches</p></div>
            <div className="flex-1 bg-white rounded-xl border border-red-100 p-3"><p className="text-xs font-bold text-slate-800">Last Check</p><p className="text-2xl font-black text-slate-800">2m</p><p className="text-[10px] text-slate-500">Larry auto-scan</p></div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'readiness' && (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h3 className="text-xl font-bold text-slate-800">OMMA Pre-Inspection Readiness Scorecard</h3><p className="text-sm text-slate-500">Larry auto-audits against the official OMMA inspection form (v5.3)</p></div>
          <Button icon={FileText} onClick={() => alert('OMMA Pre-Inspection Report exported and saved to your Vault. Ready for inspector review.')}>Export OMMA Report</Button>
        </div>
        {/* Overall Score */}
        <div className="bg-[#0f291c] bg-gradient-to-r from-[#0f291c] to-[#1a4731] rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-1">Overall Readiness</p>
            <h2 className="text-5xl font-black">{complianceScore}%</h2>
            <p className="text-emerald-100/80 text-sm mt-1">{unresolvedAlerts.length === 0 ? 'All OMMA checklist items passing' : `${unresolvedAlerts.length} items need attention`}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-200 text-xs font-bold">Last Larry Scan</p>
            <p className="text-white font-bold">Just Now</p>
            <p className="text-emerald-200 text-xs mt-2">Next OMMA Window</p>
            <p className="text-white font-bold">~45 days</p>
          </div>
        </div>
        {/* Checklist Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { section: 'General Observations & Premises', items: ['License conspicuously posted', 'Records match OMMA account', 'No unapproved material changes', 'OBNDD registration valid'], pass: 4 },
            { section: 'Security Measures', items: ['24/7 video surveillance (90-day)', 'Alarm system with LE notification', 'Restricted access controls', 'Visitor log maintained'], pass: 4 },
            { section: 'Inventory Tracking (SINC/Metrc)', items: ['Real-time reporting active', 'Owner/manager is admin', 'Physical reconciliation current', 'Waste logs complete'], pass: 3 },
            { section: 'Patient Transactions', items: ['Patient ID verified per sale', 'Purchase limits enforced', '280E tagging on all sales', 'Receipt generation active'], pass: 4 },
            { section: 'Packaging & Labeling', items: ['Child-resistant packaging', 'OMMA warning labels present', 'Batch # on all products', 'THC/CBD % displayed'], pass: 4 },
            { section: 'Facility & Location', items: ['1,000-ft school buffer', 'Certificate of Occupancy valid', 'Certificate of Compliance filed', 'Zoning approval current'], pass: 3 },
          ].map((sec, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800 text-sm">{sec.section}</h4>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", sec.pass === sec.items.length ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>{sec.pass}/{sec.items.length}</span>
              </div>
              <div className="space-y-1.5">
                {sec.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    {j < sec.pass ? <CheckCircle size={14} className="text-emerald-500 shrink-0" /> : <AlertTriangle size={14} className="text-amber-500 shrink-0" />}
                    <span className={j < sec.pass ? "text-slate-600" : "text-amber-700 font-bold"}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Penalty Risk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> Penalty Risk Estimator</h4>
            <button 
              disabled={isStressTesting}
              onClick={runStressTest}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                isStressTesting ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-600 hover:bg-red-100"
              )}
            >
              {isStressTesting ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} />}
              Run Engine Stress Test
            </button>
          </div>
          
          {stressTestResult ? (
            <div className="mb-4 p-4 bg-slate-900 rounded-xl font-mono text-[10px] text-emerald-400 border border-slate-800 animate-in zoom-in-95 duration-300">
               <p className="font-bold mb-2">&gt;&gt; STRESS TEST COMPLETED</p>
               <p>ACTIONS PROCESSED: {stressTestResult.totalActions}</p>
               <p>ANOMALIES DETECTED: {stressTestResult.anomaliesDetected}</p>
               <p>LATENCY: {stressTestResult.processingTimeMs}ms</p>
               <p>INTEGRITY STATUS: {stressTestResult.dbIntegrity}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mb-4">Based on current gaps, Larry estimates the following risk if OMMA inspects today:</p>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center"><p className="text-xs font-bold text-emerald-700">Fine Risk</p><p className="text-2xl font-black text-emerald-600">${unresolvedAlerts.length * 5000}</p></div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center"><p className="text-xs font-bold text-amber-700">Suspension Risk</p><p className="text-2xl font-black text-amber-600">{unresolvedAlerts.length > 2 ? 'Medium' : 'Low'}</p></div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center"><p className="text-xs font-bold text-slate-700">Embargo Risk</p><p className="text-2xl font-black text-slate-600">{unresolvedAlerts.length > 3 ? 'High' : 'Low'}</p></div>
          </div>
        </div>
      </div>
    )}

    {/* DEA SCHEDULE III SELF-SERVICE TAB */}
    {activeTab === 'dea' && (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Shield size={22} className="text-blue-600" /> DEA Schedule III — Federal Registration Readiness
            </h3>
            <p className="text-sm text-slate-500 mt-1">Self-service checklist mapped to the DEA's 7-section application • Deadline: June 22, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 animate-pulse">60-DAY WINDOW</span>
            <button onClick={() => window.open('https://www.deadiversion.usdoj.gov/drugreg/registration.html', '_blank')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg">Open DEA Portal ↗</button>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400 rounded-full blur-3xl" /></div>
          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Federal Registration Progress</p>
            <h2 className="text-4xl font-black">Ready to Apply</h2>
            <p className="text-blue-100/80 text-sm mt-1">Your state compliance data maps directly to all 7 DEA sections</p>
          </div>
          <div className="relative z-10 text-right mt-4 sm:mt-0">
            <p className="text-blue-200 text-xs font-bold">Application Fee</p>
            <p className="text-white font-black text-2xl">$794/yr</p>
            <p className="text-blue-200 text-xs mt-2">Review Period</p>
            <p className="text-white font-bold">≤ 6 months</p>
          </div>
        </div>

        {/* L.A.R.R.Y. DEA Application Wizard */}
        <DEAApplicationWizard mode="larry" onSaveToVault={(data) => alert(`DEA Application Package saved to your Vault. ${Object.keys(data).filter(k => data[k]).length} fields captured. Ready for export.`)} />
      </div>
    )}








    {activeTab === 'wallet' && (
      <div className="space-y-6">
        <CareWalletTab userRole="business" />
      </div>
    )}

    {activeTab === 'integrations' && (
      <div className="space-y-6">
        <div><h3 className="text-xl font-bold text-slate-800">Integrations & API Connections</h3><p className="text-sm text-slate-500">Connect your business to state systems, payment processors, and third-party tools</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Metrc (State Traceability)', status: 'Connected', color: 'emerald', desc: 'Auto-sync inventory & sales' },
            { name: 'Care Wallet / Allocation Engine', status: 'Connected', color: 'emerald', desc: 'Patient wallet & compassion points' },
            { name: 'OMMA Portal', status: 'Connected', color: 'emerald', desc: 'License status & recall feeds' },
            { name: 'Payment Gateway', status: 'Connected', color: 'emerald', desc: 'Visa/MC/Discover processing' },
            { name: 'Checkr (Background Checks)', status: 'Available', color: 'blue', desc: 'Employee background verification' },
            { name: 'QuickBooks / 280E', status: 'Available', color: 'blue', desc: 'Tax-compliant accounting sync' },
          ].map((int, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-800 text-sm">{int.name}</h4>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", int.status === 'Connected' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>{int.status}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{int.desc}</p>
              <button onClick={() => int.status !== 'Connected' && alert(int.name + " integration initialized. API keys pending...")} className={cn("w-full py-2 rounded-lg text-xs font-bold transition-colors", int.status === 'Connected' ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-[#1a4731] text-white hover:bg-[#153a28]")}>{int.status === 'Connected' ? 'Configure' : 'Connect Now'}</button>
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === 'attorneys' && (
      <div className="h-[800px] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
        <AttorneyMarketplaceTab />
      </div>
    )}

    {activeTab === 'analytics' && (
      <DashboardAnalytics facilityId={entities[0]?.id || 'ent-1'} />
    )}

    {activeTab === 'reporting' && (
      <RegulatoryReportingTab facilityId={entities[0]?.id || 'ent-1'} />
    )}

    {activeTab === 'subscription' && (
      <SubscriptionPortal userRole="business" initialPlanId="b2bc_basic" />
    )}
    {activeTab === 'applications' && (
      <BusinessApplicationsTab />
    )}
    {activeTab === 'support' && (
      <div className="space-y-6">
        <VirtualAttendantTab />
      </div>
    )}
  </div>
)};


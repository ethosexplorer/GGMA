import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Shield,
  Users,
  FolderArchive,
  TrendingUp,
  LogOut,
  X,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Building2,
  UserCheck,
  FileSearch,
  ClipboardList,
  Search,
  Bell,
  ChevronDown,
  Activity,
  User,
  MoreVertical,
  CheckSquare
} from 'lucide-react';
import './AdminExecutiveDashboard.css';

// --- Types ---
type Role = 'admin' | 'executive' | 'city_admin';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface UserProfile {
  name: string;
  role: Role;
  stateAccess: string[];
}

interface DashboardData {
  stats: {
    activePatients: number;
    patientTrend: number;
    pendingApps: number;
    approvedApps: number;
    deniedApps: number;
    flaggedAnomalies: number;
    complianceScore: number;
    revenue: number;
  };
  recentActivity: ActivityItem[];
  licensingQueue: LicenseApp[];
  auditLogs: AuditEntry[];
  locations: LocationItem[];
}

interface ActivityItem {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  type: 'application' | 'license' | 'enforcement' | 'system';
}

interface LicenseApp {
  id: string;
  type: 'Business' | 'Patient' | 'Admin';
  name: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Pending Background' | 'Pending Doctor Rec' | 'Payment Cleared' | 'Clearance Verified';
  statusVariant: string;
  submitted: string;
  state: string;
  county: string;
  email: string;
  phone: string;
  notes: string;
}

interface AuditEntry {
  id: string;
  time: string;
  userId: string;
  action: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  details: string;
}

interface LocationItem {
  id: string;
  name: string;
  type: 'Dispensary' | 'Grow' | 'Processing';
  state: string;
  status: 'Active' | 'Suspended';
}

type NavSection = 'dashboard' | 'licensing' | 'audit' | 'enforcement' | 'hr' | 'documents' | 'reports' | 'analytics' | 'patients';
type TableTab = 'queue' | 'locations' | 'audit';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// --- Mock DB / Supabase Simulators ---
const mockFetchDashboardData = async (stateFilter: string, countyFilter: string, role: string): Promise<DashboardData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        stats: {
          activePatients: 14208,
          patientTrend: 8.4,
          pendingApps: 45,
          approvedApps: 120,
          deniedApps: 12,
          flaggedAnomalies: 4,
          complianceScore: 92,
          revenue: 125000
        },
        recentActivity: [
          { id: 'act1', timestamp: new Date().toISOString(), event: 'New patient application #123 submitted', details: 'John Doe, Kansas', type: 'application' },
          { id: 'act2', timestamp: new Date(Date.now() - 3600000).toISOString(), event: 'License approved for Dispensary XYZ', details: 'Approved by admin_01', type: 'license' },
          { id: 'act3', timestamp: new Date(Date.now() - 7200000).toISOString(), event: 'Volume anomaly detected', details: 'Location 42 exceeded daily limits', type: 'enforcement' }
        ],
        licensingQueue: [
          { id: 'APP-2091', type: 'Business', name: 'Downtown Dispensary', status: 'Pending Background', statusVariant: 'pending-bg', submitted: '2026-03-16T09:12:00Z', state: 'Kansas', county: 'Johnson', email: 'ops@dd.com', phone: '555-0101', notes: 'Awaiting KBI check' },
          { id: 'APP-2090', type: 'Patient', name: 'Marcus Johnson', status: 'Pending Doctor Rec', statusVariant: 'pending-doc', submitted: '2026-03-15T14:45:00Z', state: 'Missouri', county: 'Jackson', email: 'mj@email.com', phone: '555-0202', notes: 'Needs physician signature' },
          { id: 'APP-2088', type: 'Business', name: 'Chronic Clinic Network', status: 'Payment Cleared', statusVariant: 'payment', submitted: '2026-03-15T10:30:00Z', state: 'Colorado', county: 'Denver', email: 'billing@ccn.com', phone: '555-0303', notes: 'Ready for final review' },
          { id: 'APP-2092', type: 'Patient', name: 'Sarah Connor', status: 'Pending', statusVariant: 'pending-bg', submitted: new Date().toISOString(), state: 'Kansas', county: 'Douglas', email: 'sc@email.com', phone: '555-0404', notes: 'New submission' }
        ],
        auditLogs: [
          { id: 'aud1', time: new Date().toISOString(), userId: 'sys_monitor', action: 'Missing POS Sync', severity: 'high', resolved: false, details: 'Westside Dispensary Loc-82' },
          { id: 'aud2', time: new Date(Date.now() - 3600000).toISOString(), userId: 'admin_22', action: 'User Password Reset', severity: 'low', resolved: true, details: 'Admin L-221 authenticated' },
          { id: 'aud3', time: new Date(Date.now() - 7200000).toISOString(), userId: 'sys_job', action: 'Metrc Sync Completed', severity: 'low', resolved: true, details: '3204 records validated' }
        ],
        locations: [
          { id: 'LOC-001', name: 'Westside Dispensary', type: 'Dispensary', state: 'Kansas', status: 'Active' },
          { id: 'LOC-002', name: 'Green Growth', type: 'Grow', state: 'Missouri', status: 'Active' },
          { id: 'LOC-003', name: 'Apex Health', type: 'Dispensary', state: 'Colorado', status: 'Suspended' }
        ]
      });
    }, 800);
  });
};

const CHART_DATA_STATE = [
  { day: 'Mon', apps: 12, approved: 8, patients: 120, dispensaries: 4 },
  { day: 'Tue', apps: 22, approved: 18, patients: 135, dispensaries: 4 },
  { day: 'Wed', apps: 24, approved: 19, patients: 142, dispensaries: 5 },
  { day: 'Thu', apps: 23, approved: 20, patients: 150, dispensaries: 5 },
  { day: 'Fri', apps: 31, approved: 25, patients: 168, dispensaries: 6 },
  { day: 'Sat', apps: 15, approved: 12, patients: 172, dispensaries: 6 },
  { day: 'Sun', apps: 13, approved: 10, patients: 175, dispensaries: 6 },
];

const CHART_DATA_COUNTY = [
  { day: 'Mon', apps: 5, approved: 3, patients: 40, dispensaries: 1 },
  { day: 'Tue', apps: 8, approved: 6, patients: 45, dispensaries: 1 },
  { day: 'Wed', apps: 10, approved: 8, patients: 48, dispensaries: 2 },
  { day: 'Thu', apps: 9, approved: 8, patients: 52, dispensaries: 2 },
  { day: 'Fri', apps: 12, approved: 10, patients: 58, dispensaries: 2 },
  { day: 'Sat', apps: 6, approved: 5, patients: 60, dispensaries: 2 },
  { day: 'Sun', apps: 4, approved: 4, patients: 62, dispensaries: 2 },
];


export default function AdminExecutiveDashboard({ onLogout, user }: { onLogout: () => void, user?: any }) {
  // --- State ---
  const initialUser = user ? {
    name: user.displayName || user.email || 'Sarah Jenkins',
    role: (user.role as Role) || 'executive',
    stateAccess: user.state ? [user.state] : ['Kansas', 'Missouri', 'Colorado']
  } : { name: 'Sarah Jenkins', role: 'executive', stateAccess: ['Kansas', 'Missouri', 'Colorado'] };

  const [currentUser] = useState<UserProfile>(initialUser as UserProfile);
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [stateFilter, setStateFilter] = useState(user?.state || 'All');
  const [countyFilter, setCountyFilter] = useState('All');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Table state
  const [activeTab, setActiveTab] = useState<TableTab>('queue');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals/Overlays
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isCountyDrilldown, setIsCountyDrilldown] = useState(false);

  // --- Helpers ---
  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const closeModal = () => setModalContent(null);

  const logAudit = (action: string, details: string) => {
    // Mock Supabase RPC call "insert_audit_log"
    console.log(`[AUDIT] ${new Date().toISOString()} | User: ${currentUser.name} | Action: ${action} | Details: ${details} | Filters: State=${stateFilter}, County=${countyFilter}`);
  };

  const checkRBAC = (requiredRole: Role[]) => {
    if (!requiredRole.includes(currentUser.role)) {
      addToast('Access denied. Insufficient permissions.', 'error');
      logAudit('Unauthorized access attempt', `Required roles: ${requiredRole.join(',')}`);
      return false;
    }
    return true;
  };

  // --- Data Fetching ---
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await mockFetchDashboardData(stateFilter, countyFilter, currentUser.role);
      setData(result);
    } catch (err) {
      addToast('Failed to load dashboard data. Retrying...', 'error');
    } finally {
        setLoading(false);
    }
  };

  // Real-time polling mock
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [stateFilter, countyFilter]);


  // --- Action Handlers ---

  // 1. KPI Cards Row Actions
  const handleViewPatients = () => {
    logAudit('Admin viewed active patients list', `State filter: ${stateFilter}`);
    setActiveSection('patients');
  };

  const handleProcessQueue = () => {
    logAudit('Admin accessed licensing queue from KPI', '');
    setActiveSection('licensing');
    setActiveTab('queue');
    // Pre-filter conceptually applied here
  };

  const handleReviewAlerts = () => {
    logAudit('Admin reviewed flagged anomalies from KPI', '');
    setActiveSection('audit');
    setActiveTab('audit');
    setSearchQuery('severity:high'); // Mock filter
  };

  const handleScoreDrillDown = () => {
    logAudit('Admin drilled down into Green River scores', `State: ${stateFilter}`);
    setActiveSection('analytics');
    // Typically pass specific params to Analytics view here
  };

  const handleExportRevenue = async () => {
    logAudit('Admin exported revenue report', `Filters: State=${stateFilter}`);
    addToast('Generating Revenue Report...', 'info');
    // Mock Supabase Edge Function call
    setTimeout(() => {
        const dummyCsv = "Date,Revenue,State\n2026-03-16,$125000,All";
        const blob = new Blob([dummyCsv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        addToast('Report export successful', 'success');
    }, 1500);
  };

  // 2. Analytics & Charts Panel Actions
  const handleCountyDrilldownToggle = () => {
    if (stateFilter === 'All') {
       addToast('Please select a specific state first for county drilldown.', 'warning');
       return;
    }
    const newState = !isCountyDrilldown;
    setIsCountyDrilldown(newState);
    logAudit(newState ? 'Enabled County Drilldown' : 'Disabled County Drilldown', `State: ${stateFilter}`);
  };

  const handleExportChartInfo = () => {
      logAudit('Chart data exported', `Drilldown: ${isCountyDrilldown}`);
      addToast('Downloading chart data (CSV + PNG)...', 'info');
      setTimeout(() => addToast('Chart export complete', 'success'), 1000);
  };

  // 3. Quick Actions Sidebar
  const handleNewLicenseApprovalClick = () => {
      setActiveSection('licensing');
      setActiveTab('queue');
      // Conceptually pre-loads newest items
  };

  const handleScheduleInspection = () => {
      setActiveSection('hr');
      // Pre-fill form logic would go here
      addToast('Opening new inspection schedule form', 'info');
  };

  const handleReviewBackgroundChecks = () => {
      setActiveSection('documents');
      // Filter logic would go here
      addToast('Filtering vault for pending background checks', 'info');
  };

  const handleEnforcementAlertClick = () => {
      setActiveSection('enforcement');
      addToast('Loading latest enforcement alerts', 'info');
  };

  // 4. Recent Activity Feed
  const handleViewActivityDetails = (activityId: string) => {
      setLoading(true);
      // Mock fetch single log
      setTimeout(() => {
          const act = data?.recentActivity.find(a => a.id === activityId);
          if (act) {
              setModalContent(
                  <div className="admin-dash__event-modal">
                      <h4>Event Details Ref: {act.id}</h4>
                      <p><strong>Time:</strong> {new Date(act.timestamp).toLocaleString()}</p>
                      <p><strong>Type:</strong> <span className="admin-dash__badge">{act.type}</span></p>
                      <p><strong>Event:</strong> {act.event}</p>
                      <p><strong>Details:</strong> {act.details}</p>
                  </div>
              );
              logAudit('Viewed event details', `Activity ID: ${activityId}`);
          } else {
              addToast('Log not found', 'error');
          }
          setLoading(false);
      }, 400);
  };

  // 5. Data Table View
  const handleSelectRow = (id: string) => {
      const newSel = new Set(selectedRows);
      if (newSel.has(id)) newSel.delete(id);
      else newSel.add(id);
      setSelectedRows(newSel);
  };

  const handleSelectAll = (ids: string[]) => {
      if (selectedRows.size === ids.length) setSelectedRows(new Set());
      else setSelectedRows(new Set(ids));
  };

  const handleBulkApprove = async () => {
      if (!checkRBAC(['admin', 'executive'])) return;
      if (selectedRows.size === 0) return;

      setLoading(true);
      try {
          // Mock Supabase batch update
          await new Promise(r => setTimeout(r, 1200));
          
          if (data) {
             const updatedQueue = data.licensingQueue.map(app => 
                selectedRows.has(app.id) ? { ...app, status: 'Approved' as const, statusVariant: 'payment' } : app
             );
             setData({...data, licensingQueue: updatedQueue});
          }
          
          logAudit('Bulk Application Approval', `Approved ${selectedRows.size} applications. IDs: ${Array.from(selectedRows).join(',')}`);
          addToast(`Successfully approved ${selectedRows.size} applications`, 'success');
          setSelectedRows(new Set());
      } catch (e) {
          addToast('Bulk approval failed', 'error');
      } finally {
          setLoading(false);
      }
  };

  const handleTableExport = () => {
      logAudit('Table data exported', `Tab: ${activeTab}`);
      addToast('Exporting table data...', 'info');
      setTimeout(() => addToast('Export complete', 'success'), 1000);
  };


  // --- Render Helpers ---

  const renderKPIs = () => {
    if (!data) return null;
    return (
      <div className="admin-dash__kpi-row">
        <div className="admin-dash__kpi-card">
          <div className="admin-dash__kpi-header">
            <span className="admin-dash__kpi-title">Active Patients</span>
            <span className="admin-dash__kpi-value">{data.stats.activePatients.toLocaleString()}</span>
          </div>
          <p className="admin-dash__kpi-sub"><span className="trend-up"><TrendingUp size={12}/> +{data.stats.patientTrend}%</span> this month</p>
          <button className="admin-dash__btn admin-dash__btn--outline" onClick={handleViewPatients}>View Patient List</button>
        </div>

        <div className="admin-dash__kpi-card">
          <div className="admin-dash__kpi-header">
            <span className="admin-dash__kpi-title">Application Trends</span>
            <div className="admin-dash__kpi-multi" title="Pending / Approved / Denied">
               <span className="text-blue">{data.stats.pendingApps}</span> / 
               <span className="text-green">{data.stats.approvedApps}</span> / 
               <span className="text-red">{data.stats.deniedApps}</span>
            </div>
          </div>
           <p className="admin-dash__kpi-sub">Total this month</p>
          <button className="admin-dash__btn admin-dash__btn--primary" onClick={handleProcessQueue}>Process Queue</button>
        </div>

        <div className="admin-dash__kpi-card admin-dash__kpi-card--alert">
          <div className="admin-dash__kpi-header">
            <span className="admin-dash__kpi-title">Flagged Anomalies</span>
            <span className="admin-dash__kpi-value text-red">{data.stats.flaggedAnomalies}</span>
          </div>
          <p className="admin-dash__kpi-sub">Requires immediate review</p>
          <button className="admin-dash__btn admin-dash__btn--danger" onClick={handleReviewAlerts}>Review Alerts</button>
        </div>

        <div className="admin-dash__kpi-card admin-dash__kpi-card--highlight">
          <div className="admin-dash__kpi-header">
            <span className="admin-dash__kpi-title">GGP Score</span>
            <span className="admin-dash__kpi-value text-gold">{data.stats.complianceScore}/100</span>
          </div>
           <p className="admin-dash__kpi-sub text-gold">High Compliance Level</p>
          <button className="admin-dash__btn admin-dash__btn--gold" onClick={handleScoreDrillDown}>Drill Down</button>
        </div>

      </div>
    );
  };

  const renderAnalyticsPanel = () => {
      const activeChartData = isCountyDrilldown ? CHART_DATA_COUNTY : CHART_DATA_STATE;
      const titleSuffix = isCountyDrilldown ? (countyFilter !== 'All' ? ` - ${countyFilter} County` : ' - County Avg') : (stateFilter !== 'All' ? ` - ${stateFilter}` : ' - National');
      
      return (
          <div className="admin-dash__panel admin-dash__panel--charts">
              <div className="admin-dash__panel-header">
                  <h3>Metrics Overview {titleSuffix}</h3>
                  <div className="admin-dash__panel-actions">
                      <button className={`admin-dash__btn-toggle ${isCountyDrilldown ? 'active' : ''}`} onClick={handleCountyDrilldownToggle}>
                          <MapPin size={14} /> County Drilldown
                      </button>
                      <button className="admin-dash__btn-icon" onClick={handleExportChartInfo} title="Export Chart"><Download size={16}/></button>
                      <button className="admin-dash__btn-link" onClick={() => setActiveSection('analytics')}>Full Analytics <ChevronDown size={14}/></button>
                  </div>
              </div>
              <div className="admin-dash__chart-space">
                  {/* Simplified Chart Bar visualization for demonstration */}
                  <div className="mock-chart">
                      {activeChartData.map((d, i) => (
                           <div key={i} className="mock-chart-col">
                               <div className="bar-wrapper">
                                   <div className="bar-bg" style={{height: `${Math.min(100, (d.patients / 200) * 100)}%`}}></div>
                                   <div className="bar-fg" style={{height: `${Math.min(100, (d.apps / 50) * 100)}%`}}></div>
                               </div>
                               <span className="bar-label">{d.day}</span>
                           </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  const renderQuickActions = () => {
      return (
          <div className="admin-dash__quick-actions">
              <h3>Quick Actions</h3>
              <div className="admin-dash__action-list">
                  <button className="admin-dash__action-btn" onClick={handleNewLicenseApprovalClick}>
                      <div className="icon-wrapper bg-blue-subtle"><FileText size={16} className="text-blue"/></div>
                      <div className="action-text">
                          <span className="title">New License Approval</span>
                          <span className="desc">Review {data?.licensingQueue.filter(a=>a.status.includes('Pending')).length || 0} pending app(s)</span>
                      </div>
                  </button>
                  <button className="admin-dash__action-btn" onClick={handleScheduleInspection}>
                      <div className="icon-wrapper bg-green-subtle"><Calendar size={16} className="text-green"/></div>
                      <div className="action-text">
                          <span className="title">Schedule Inspection</span>
                          <span className="desc">Assign upcoming site visits</span>
                      </div>
                  </button>
                  <button className="admin-dash__action-btn" onClick={handleReviewBackgroundChecks}>
                      <div className="icon-wrapper bg-purple-subtle"><Shield size={16} className="text-purple"/></div>
                      <div className="action-text">
                          <span className="title">Background Checks</span>
                          <span className="desc">2 pending KBI clearances</span>
                      </div>
                  </button>
                  <button className="admin-dash__action-btn" onClick={handleEnforcementAlertClick}>
                      <div className="icon-wrapper bg-red-subtle"><AlertTriangle size={16} className="text-red"/></div>
                      <div className="action-text">
                          <span className="title">Enforcement Alert</span>
                          <span className="desc">{data?.stats.flaggedAnomalies || 0} active alerts require action</span>
                      </div>
                  </button>
              </div>

              <div className="admin-dash__activity-feed">
                  <div className="feed-header">
                      <h3>Recent Activity</h3>
                      <button className="admin-dash__btn-link" onClick={() => setActiveSection('audit')}>View All Logs</button>
                  </div>
                  <div className="feed-list">
                      {data?.recentActivity.map(act => (
                           <div key={act.id} className="feed-item">
                               <div className={`feed-indicator type-${act.type}`}></div>
                               <div className="feed-content">
                                   <p className="feed-event">{act.event}</p>
                                   <span className="feed-time">{new Date(act.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               </div>
                               <button className="feed-detail-btn" onClick={() => handleViewActivityDetails(act.id)}>Details</button>
                           </div>
                      ))}
                  </div>
              </div>
          </div>
      );
  };

  const renderDataTable = () => {
      if (!data) return null;

      let currentData: any[] = [];
      if (activeTab === 'queue') currentData = data.licensingQueue;
      if (activeTab === 'locations') currentData = data.locations;
      if (activeTab === 'audit') currentData = data.auditLogs;

      // Apply search (simple mock)
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          currentData = currentData.filter(item => JSON.stringify(item).toLowerCase().includes(q));
      }

      return (
          <div className="admin-dash__panel admin-dash__table-container">
              <div className="admin-dash__table-tabs">
                  <button className={activeTab === 'queue' ? 'active' : ''} onClick={() => { setActiveTab('queue'); setSelectedRows(new Set()); setCurrentPage(1);}}>Licensing Queue</button>
                  <button className={activeTab === 'locations' ? 'active' : ''} onClick={() => { setActiveTab('locations'); setSelectedRows(new Set()); setCurrentPage(1); }}>Active Locations</button>
                  <button className={activeTab === 'audit' ? 'active' : ''} onClick={() => { setActiveTab('audit'); setSelectedRows(new Set()); setCurrentPage(1); }}>Audit Summary</button>
                  
                  <div className="table-actions-right">
                      <div className="search-wrapper">
                          <Search size={14}/>
                          <input type="text" placeholder="Search data..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                      </div>
                      {activeTab === 'queue' && selectedRows.size > 0 && (
                          <button className="admin-dash__btn admin-dash__btn--primary sm" onClick={handleBulkApprove}>
                              Approve Selected ({selectedRows.size})
                          </button>
                      )}
                      <button className="admin-dash__btn admin-dash__btn--outline sm" onClick={handleTableExport}><Download size={14}/> Export</button>
                  </div>
              </div>

              <div className="table-scroll-wrapper">
                 <table className="admin-dash__data-table">
                     <thead>
                         <tr>
                             {activeTab === 'queue' && (
                                 <>
                                    <th><input type="checkbox" onChange={(e) => handleSelectAll(currentData.map(d=>d.id))} checked={selectedRows.size === currentData.length && currentData.length > 0}/></th>
                                    <th>ID</th><th>Applicant</th><th>Type</th><th>Status</th><th>State</th><th>Actions</th>
                                 </>
                             )}
                             {activeTab === 'locations' && (
                                 <><th>ID</th><th>Name</th><th>Type</th><th>State</th><th>Status</th></>
                             )}
                             {activeTab === 'audit' && (
                                 <><th>Time</th><th>User</th><th>Action</th><th>Severity</th><th>Resolved</th></>
                             )}
                         </tr>
                     </thead>
                     <tbody>
                         {currentData.length === 0 ? (
                             <tr><td colSpan={7} style={{textAlign:'center', padding:40, color:'#a0aec0'}}>No data found matching criteria.</td></tr>
                         ) : (
                             currentData.map((row: any) => (
                                 <tr key={row.id}>
                                     {activeTab === 'queue' && (
                                         <>
                                            <td><input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => handleSelectRow(row.id)}/></td>
                                            <td className="font-semibold">{row.id}</td>
                                            <td>{row.name}</td>
                                            <td><span className={`badge badge-${row.type.toLowerCase()}`}>{row.type}</span></td>
                                            <td><span className={`status-pill status-${row.statusVariant}`}>{row.status}</span></td>
                                            <td>{row.state}</td>
                                            <td><button className="admin-dash__btn-link sm" onClick={() => { setModalContent(<div className="p-4">Detailed review required for {row.id}</div>); }}>Review Details</button></td>
                                         </>
                                     )}
                                     {activeTab === 'locations' && (
                                         <>
                                             <td className="font-semibold">{row.id}</td><td>{row.name}</td><td>{row.type}</td><td>{row.state}</td>
                                             <td><span className={`status-pill status-${row.status === 'Active' ? 'payment' : 'pending-bg'}`}>{row.status}</span></td>
                                         </>
                                     )}
                                     {activeTab === 'audit' && (
                                         <>
                                             <td>{row.time.split('T')[1].substring(0,5)}</td>
                                             <td>{row.userId}</td>
                                             <td>{row.action}</td>
                                             <td><span className={`badge badge-${row.severity}`}>{row.severity}</span></td>
                                             <td>{row.resolved ? 'Yes' : 'No'}</td>
                                         </>
                                     )}
                                 </tr>
                             ))
                         )}
                     </tbody>
                 </table>
              </div>
              
              <div className="admin-dash__pagination">
                  <span className="page-info">Showing {currentData.length} records</span>
                  <div className="page-controls">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(p=>p-1)}>Previous</button>
                      <button className="active">{currentPage}</button>
                      <button disabled={currentData.length < 10} onClick={() => setCurrentPage(p=>p+1)}>Next</button>
                  </div>
              </div>
          </div>
      );
  };

  const renderDashboardOverview = () => (
      <>
          {renderKPIs()}
          <div className="admin-dash__main-grid">
              <div className="admin-dash__grid-left">
                  {renderAnalyticsPanel()}
                  {renderDataTable()}
              </div>
              <div className="admin-dash__grid-right">
                  {renderQuickActions()}
              </div>
          </div>
      </>
  );

  const renderPlaceholder = (title: string, msg: string) => (
       <div className="admin-dash__placeholder-page">
           <Activity size={48} className="placeholder-icon"/>
           <h2>{title}</h2>
           <p>{msg}</p>
           <button className="admin-dash__btn admin-dash__btn--primary mt-4" onClick={() => setActiveSection('dashboard')}>Return to Dashboard</button>
       </div>
  );


  // --- Main Layout ---
  return (
    <div className="admin-layout">
        {loading && <div className="loading-overlay">Loading data...</div>}
        
        {/* Toasts */}
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.message}
                    <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}><X size={14}/></button>
                </div>
            ))}
        </div>

        {/* Modal */}
        {modalContent && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close" onClick={closeModal}><X size={20}/></button>
                    {modalContent}
                </div>
            </div>
        )}

        {/* Sidebar Navigation */}
        <aside className="sidebar-nav">
             <div className="sidebar-brand">
                 <img src="/ggp-logo.png" alt="GGP" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                 <span>GGP OS</span>
             </div>
             
             <div className="sidebar-menu">
                 <div className="menu-group">MAIN</div>
                 <button className={`menu-item ${activeSection==='dashboard'?'active':''}`} onClick={()=>setActiveSection('dashboard')}><LayoutDashboard size={18}/> Dashboard</button>
                 <button className={`menu-item ${activeSection==='licensing'?'active':''}`} onClick={()=>{setActiveSection('licensing'); setActiveTab('queue')}}><FileText size={18}/> Licensing Queue</button>
                 <button className={`menu-item ${activeSection==='audit'?'active':''}`} onClick={()=>{setActiveSection('audit'); setActiveTab('audit')}}><CheckSquare size={18}/> Audit Logs</button>
                 <button className={`menu-item ${activeSection==='enforcement'?'active':''}`} onClick={()=>setActiveSection('enforcement')}><AlertTriangle size={18}/> Enforcement</button>
                 
                 <div className="menu-group mt-6">MANAGEMENT</div>
                 <button className={`menu-item ${activeSection==='hr'?'active':''}`} onClick={()=>setActiveSection('hr')}><Users size={18}/> HR / Scheduling</button>
                 <button className={`menu-item ${activeSection==='documents'?'active':''}`} onClick={()=>setActiveSection('documents')}><FolderArchive size={18}/> Document Vault</button>
                 <button className={`menu-item ${activeSection==='reports'?'active':''}`} onClick={()=>setActiveSection('reports')}><BarChart3 size={18}/> Reports</button>
             </div>
        </aside>

        {/* Main Interface */}
        <main className="main-interface">
            {/* Top Header */}
            <header className="top-header">
                <div className="header-left">
                    <div className="brand-badge group-admin">Administrative OS</div>
                </div>

                <div className="header-filters">
                    <div className="filter-group">
                       <label>State Filter:</label>
                       <select 
                         value={stateFilter} 
                         onChange={e => setStateFilter(e.target.value)}
                         disabled={!!user?.state}
                         className={!!user?.state ? "opacity-70 cursor-not-allowed" : ""}
                       >
                           <option value="All">All States (National)</option>
                           {US_STATES.map(state => (
                               <option key={state} value={state}>{state}</option>
                           ))}
                       </select>
                    </div>
                    {(stateFilter !== 'All') && (
                        <div className="filter-group">
                           <label>County Drilldown:</label>
                           <select value={countyFilter} onChange={e => setCountyFilter(e.target.value)}>
                               <option value="All">All Counties</option>
                               <option value="Johnson">Johnson</option>
                               <option value="Jackson">Jackson</option>
                               {/* Real app would populate dynamically based on state */}
                           </select>
                        </div>
                    )}
                </div>

                <div className="header-right">
                    <div className="search-box">
                        <Search size={16}/>
                        <input type="text" placeholder="Search system ID..." />
                    </div>
                    <button className="icon-btn"><Bell size={20}/> <span className="badge-dot"></span></button>
                    <div className="user-dropdown">
                        <div className="user-avatar">{currentUser.name.charAt(0)}</div>
                        <div className="user-info">
                            <span className="user-name">{currentUser.name}</span>
                            <span className="user-role">{currentUser.role}</span>
                        </div>
                        <ChevronDown size={14}/>
                        {/* Dropdown menu mock */}
                        <div className="dropdown-menu">
                            <button onClick={onLogout}><LogOut size={14}/> Sign Out</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Content Area */}
            <div className="content-area">
                 {activeSection === 'dashboard' && renderDashboardOverview()}
                 {activeSection === 'licensing' && renderPlaceholder('Licensing Queue Processing', 'Full queue management interface runs here. Pending records loaded via Supabase.')}
                 {activeSection === 'audit' && renderPlaceholder('Immutable Audit Viewer', 'Search and export complete historical logs with RBAC restrictions.')}
                 {activeSection === 'enforcement' && renderPlaceholder('Enforcement Dashboard', 'Live alerts and traceability links for flagged anomalies.')}
                 {activeSection === 'hr' && renderPlaceholder('Scheduling & Staffing', 'Calendar view for inspections and staff management.')}
                 {activeSection === 'documents' && renderPlaceholder('Secure Document Vault', 'Encrypted file storage handling background checks and compliance PDFs.')}
                 {activeSection === 'reports' && renderPlaceholder('Advanced Reporting', 'Generate comprehensive multi-variant PDFs via Edge Functions.')}
                 {activeSection === 'analytics' && renderPlaceholder('Full Analytics Suite', 'Deep dive metrics with Tableau/D3 visualizations.')}
                 {activeSection === 'patients' && renderPlaceholder('Active Patient Ledger', 'Filtered table view of all patients with bulk actions.')}
            </div>
        </main>
    </div>
  );
}

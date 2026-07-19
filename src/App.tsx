import React, { Component, Suspense, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LiveToastContainer } from './components/shared/LiveToast';
import { useLocation, useNavigate } from 'react-router-dom';
import { STATE_RESOURCES } from './stateResources';
import { getDetailedStateKnowledge } from './stateDetailedKnowledge';
import { getPlansForRole, getAddOnsForRole } from './lib/subscriptionPlans';
import { 
  Shield, User, AlertCircle, Eye, EyeOff, Info, Smartphone, LogIn, ChevronRight, ArrowLeft,
  Lock, Upload, Save, Leaf, Mail, LayoutDashboard, Users, Settings, BarChart2, BarChart3,
  Calendar, FileText, Activity, LogOut, Bell, Search, Plus, Building2, Stethoscope, TrendingUp,
  Clock, CheckCircle, XCircle, MoreVertical, Filter, Loader2, ArrowRight, Globe, MapPin,
  Map as MapIcon, MessageSquare, ChevronDown, ChevronUp, Send, GraduationCap, Sparkles, Scale,
  Search as SearchIcon, Briefcase, Bot, BookOpen, Wrench, Video, Flag, Camera, Monitor, Image,
  Paperclip, CircleCheck, Circle, ShoppingCart, PackageSearch, ClipboardList, Cpu, Gavel,
  Headphones, Phone, Star, ArrowUpCircle, Home, Check, Wallet, HeartHandshake, HelpCircle, Mic, Volume2,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, query as fsQuery, where } from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { InvestorSandboxTab } from './components/founder/InvestorSandboxTab';

// --- Lazy-loaded Dashboards (Code Splitting) ---
// Each dashboard is loaded on-demand instead of upfront, dramatically reducing initial bundle size.
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const FounderDashboard = React.lazy(() => import('./pages/FounderDashboard').then(m => ({ default: m.FounderDashboard })));
const RepDashboard = React.lazy(() => import('./pages/RepDashboard').then(m => ({ default: m.RepDashboard })));
// TeamLeadDashboard & ManagerDashboard consolidated into FounderDashboard
const StateAuthorityDashboard = React.lazy(() => import('./pages/StateAuthorityDashboard').then(m => ({ default: m.StateAuthorityDashboard })));
const OperationsDashboard = React.lazy(() => import('./pages/OperationsDashboard').then(m => ({ default: m.OperationsDashboard })));
const ExternalAdminDashboard = React.lazy(() => import('./pages/ExternalAdminDashboard').then(m => ({ default: m.ExternalAdminDashboard })));
const TeleHealthDashboard = React.lazy(() => import('./components/TeleHealthDashboard'));
const BusinessDashboard = React.lazy(() => import('./pages/BusinessDashboard').then(m => ({ default: m.BusinessDashboard })));
const BusinessRegistrationPage = React.lazy(() => import('./pages/BusinessRegistrationPage'));
const FederalDashboard = React.lazy(() => import('./pages/FederalDashboard').then(m => ({ default: m.FederalDashboard })));
const ProviderDashboard = React.lazy(() => import('./pages/ProviderDashboard').then(m => ({ default: m.ProviderDashboard })));
const AttorneyDashboard = React.lazy(() => import('./pages/AttorneyDashboard').then(m => ({ default: m.AttorneyDashboard })));
const PublicHealthDashboard = React.lazy(() => import('./pages/PublicHealthDashboard').then(m => ({ default: m.PublicHealthDashboard })));
const CareWalletDashboard = React.lazy(() => import('./pages/CareWalletDashboard').then(m => ({ default: m.CareWalletDashboard })));
const EnforcementDashboard = React.lazy(() => import('./pages/EnforcementDashboard').then(m => ({ default: m.EnforcementDashboard })));
const BackOfficeDashboard = React.lazy(() => import('./pages/BackOfficeDashboard').then(m => ({ default: m.BackOfficeDashboard })));
const ProviderRegistrationPage = React.lazy(() => import('./pages/ProviderRegistrationPage'));
const EducationPortal = React.lazy(() => import('./pages/EducationPortal').then(m => ({ default: m.EducationPortal })));
const ProSeLegalIntake = React.lazy(() => import('./pages/ProSeLegalIntake').then(m => ({ default: m.ProSeLegalIntake })));
const PatientDashboard = React.lazy(() => import('./pages/PatientDashboard').then(m => ({ default: m.PatientDashboard })));
import { OversightDashboard } from './pages/OversightDashboard';
const PresidentDashboard = React.lazy(() => import('./pages/PresidentDashboard').then(m => ({ default: m.PresidentDashboard })));
const ChiefComplianceDirectorDashboard = React.lazy(() => import('./pages/ChiefComplianceDirectorDashboard').then(m => ({ default: m.ChiefComplianceDirectorDashboard })));
const AdvisorDashboard = React.lazy(() => import('./pages/AdvisorDashboard').then(m => ({ default: m.AdvisorDashboard })));
const LegislatorsDashboard = React.lazy(() => import('./pages/LegislatorsDashboard').then(m => ({ default: m.LegislatorsDashboard })));
const AdvocacyResearchDashboard = React.lazy(() => import('./pages/AdvocacyResearchDashboard').then(m => ({ default: m.AdvocacyResearchDashboard })));

// --- Lazy-loaded Pages ---
const SettingsPreferencesMockup = React.lazy(() => import('./pages/SettingsPreferencesMockup').then(m => ({ default: m.SettingsPreferencesMockup })));
const ProductsServicesPage = React.lazy(() => import('./pages/ProductsServicesPage').then(m => ({ default: m.ProductsServicesPage })));
const FederalStatePage = React.lazy(() => import('./pages/FederalStatePage').then(m => ({ default: m.FederalStatePage })));
const WhatIsC3Page = React.lazy(() => import('./pages/WhatIsC3Page').then(m => ({ default: m.WhatIsC3Page })));
const WhatIsCareWalletPage = React.lazy(() => import('./pages/WhatIsCareWalletPage').then(m => ({ default: m.WhatIsCareWalletPage })));
const ResourceCenter = React.lazy(() => import('./pages/ResourceCenter').then(m => ({ default: m.ResourceCenter })));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RolePricingPage = React.lazy(() => import('./pages/RolePricingPage').then(m => ({ default: m.RolePricingPage })));
const StateFactsPage = React.lazy(() => import('./pages/StateFactsPage').then(m => ({ default: m.StateFactsPage })));
const IntakePage = React.lazy(() => import('./pages/IntakePage'));
const CannaCribsPage = React.lazy(() => import('./pages/CannaCribsPage').then(m => ({ default: m.CannaCribsPage })));
const CannaCribsApplicationPage = React.lazy(() => import('./pages/CannaCribsApplicationPage').then(m => ({ default: m.CannaCribsApplicationPage })));

// --- Eagerly loaded utilities (small, needed immediately) ---
import { initDatabase } from './lib/initDb';
import { turso } from './lib/turso';
import { LARRY_LEGAL_KNOWLEDGE } from './legalKnowledge';
import { generateGeminiResponse } from './lib/gemini';
import { captureContact } from './lib/contactCapture';
import { getStateFees } from './lib/stateFees';
import MapChart from './components/MapChart';
import { PricingTiers } from './components/PricingTiers';
import { LanguageSelector } from './components/LanguageSelector';
import { FeaturedPoll, StickyPollWidget, RevolvingSurveyBanner } from './components/CommunityPolls';
import { GlobalHeader } from './components/GlobalHeader';
import { RoleSelectorScreen } from './components/RoleSelectorScreen';
import { fetchRegulatoryFeed, formatFeedDate, type RegulatoryUpdate } from './lib/regulatoryFeed';
import { RegulatoryFeedWidget } from './components/shared/RegulatoryFeedWidget';
import { StateWelcomeBanner } from './components/shared/StateWelcomeBanner';
import { WebDialer } from './components/twilio/WebDialer';

// --- Constants ---

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];


// --- Extracted Components (Phase 2 Code Splitting) ---
import { PinVerificationScreen } from './components/PinVerificationScreen';
import { Input } from './components/shared/Input';
import { Button } from './components/shared/Button';
import { DashboardLayout } from './components/shared/DashboardLayout';
import { StatCard } from './components/shared/StatCard';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { SupportPage } from './pages/SupportPage';
import { LandingPage } from './pages/LandingPage';
import { SylaraFloatingWidget } from './components/SylaraFloatingWidget';
import { LoginScreen } from './pages/LoginScreen';
import { ForgotPasswordScreen } from './pages/ForgotPasswordScreen';
import { SignupScreen } from './pages/SignupScreen';
import { PatientSignupPage } from './pages/PatientSignupPage';
import { LarryMedCardChatbot } from './components/LarryMedCardChatbot';

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
              className="w-full bg-[#1a4731] text-white py-2 rounded-lg font-medium"
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


export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing');
  const [viewHistory, setViewHistory] = useState<string[]>([]);
  const [initialRole, setInitialRole] = useState(undefined);
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);
  const [showLarryModal, setShowLarryModal] = useState(false);
  const [larryVariant, setLarryVariant] = useState<string | undefined>(undefined);
  const [roleOverride, setRoleOverride] = useState<string | null>(() => sessionStorage.getItem('gghp_role_override'));
  const [hasBypassedSelector, setHasBypassedSelector] = useState(() => sessionStorage.getItem('gghp_has_bypassed_selector') === 'true');
  const [impersonatedProfile, setImpersonatedProfile] = useState<any>(null);
  const [selectedPricingRole, setSelectedPricingRole] = useState<string>('patient');
  const [jurisdiction, setJurisdiction] = useState(() => sessionStorage.getItem('gghp_jurisdiction') || 'Oklahoma');
  const [jurisdictionLocked, setJurisdictionLocked] = useState(() => sessionStorage.getItem('gghp_jurisdiction_locked') === 'true');
  const [showJurisdictionGate, setShowJurisdictionGate] = useState(false);
  const [pendingJurisdiction, setPendingJurisdiction] = useState<string | null>(null);
  const [currentPersona, setCurrentPersona] = useState<'sylara' | 'larry'>('sylara');
  const [is21Verified, setIs21Verified] = useState<boolean | null>(null);

  const confirmJurisdiction = (state: string) => {
    setJurisdiction(state);
    setJurisdictionLocked(true);
    try {
      sessionStorage.setItem('gghp_jurisdiction', state);
      sessionStorage.setItem('gghp_jurisdiction_locked', 'true');
    } catch (e) {
      console.warn('Session storage unavailable - skipping persistent jurisdiction lock', e);
    }
    setShowJurisdictionGate(false);
    setPendingJurisdiction(null);
  };

  const setJurisdictionWithGate = (newState: string) => {
    if (jurisdictionLocked && newState !== jurisdiction) {
      setPendingJurisdiction(newState);
      setShowJurisdictionGate(true);
    } else {
      setJurisdiction(newState);
      try {
        sessionStorage.setItem('gghp_jurisdiction', newState);
      } catch (e) {
        console.warn('Session storage unavailable', e);
      }
    }
  };

  // Map view names to URL paths
  const viewToPath: Record<string, string> = {
    'landing': '/',
    'login': '/login',
    'signup': '/signup',
    'dashboard': '/dashboard',
    'larry-chatbot': '/larry-chatbot',
    'larry-business': '/larry-business',
    'support': '/support',
    'settings-mockup': '/settings-mockup',
    'business-signup': '/business-signup',
    'patient-signup': '/patient-signup',
    'provider-signup': '/provider-signup',
    'intake': '/intake',
    'products-services': '/products-services',
    'federal-state': '/federal-state',
    'state-facts': '/state-facts',
    'what-is-c3': '/what-is-c3',
    'what-is-care-wallet': '/what-is-care-wallet',
    'care-wallet-dashboard': '/care-wallet-dashboard',
    'role-pricing': '/role-pricing',
    'forgot-password': '/forgot-password',
    'patient-portal': '/patient-portal',
    'pin-verification': '/pin-verification',
    'education': '/education',
    'legal-advocacy': '/legal-advocacy',
    'sandbox': '/sandbox',
    'demo': '/demo',
  };

  const handleNavigate = (newView: string, role?: string) => {
    setViewHistory(prev => [...prev, view]);
    setView(newView);
    // Push URL so each browser tab can show a different view
    const urlPath = viewToPath[newView] || '/' + newView;
    window.history.pushState({ view: newView }, '', urlPath);
    if (role && newView === 'role-pricing') setSelectedPricingRole(role);
    if (role) setInitialRole(role as any);
  };

  const handleBack = () => {
    if (hasBypassedSelector) {
      setHasBypassedSelector(false);
      setRoleOverride(null);
      return;
    }
    
    if (viewHistory.length > 0) {
      const lastView = viewHistory[viewHistory.length - 1];
      setViewHistory(prev => prev.slice(0, -1));
      setView(lastView);
    } else {
      setView('landing');
    }
  };

  useEffect(() => {
    if (roleOverride) sessionStorage.setItem('gghp_role_override', roleOverride);
    else sessionStorage.removeItem('gghp_role_override');
  }, [roleOverride]);
  // Sync selected jurisdiction with staff member's profile jurisdictions (non-founders only)
  useEffect(() => {
    if (userProfile && userProfile.email?.toLowerCase() !== 'globalgreenhp@gmail.com') {
      const userJuris = userProfile.jurisdictions || userProfile.accessibleStates || userProfile.jurisdiction || userProfile.homeState || 'Oklahoma';
      let allowed: string[] = [];
      if (Array.isArray(userJuris)) {
        allowed = userJuris.map((s: string) => s.trim());
      } else if (typeof userJuris === 'string') {
        allowed = userJuris.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      
      const firstAllowed = allowed[0] || 'Oklahoma';
      // If the current selected state is not in their allowed list, reset to the first allowed one
      if (allowed.length > 0 && !allowed.includes(jurisdiction)) {
        setJurisdiction(firstAllowed);
      }
    }
  }, [userProfile, jurisdiction]);

  useEffect(() => {
    if (hasBypassedSelector) sessionStorage.setItem('gghp_has_bypassed_selector', 'true');
    else sessionStorage.removeItem('gghp_has_bypassed_selector');
  }, [hasBypassedSelector]);

  // Staff roles that bypass the age-verification jurisdiction gate
  const staffRoles = ['executive_founder', 'president', 'chief_compliance_director', 'advisor', 'executive_advisor', 'executive_ceo', 'admin_jr', 'regulator_state', 'team_lead', 'manager', 'rep_human', 'rep_ai'];
  const isStaff = userProfile && staffRoles.includes((userProfile as any)?.role);

  useEffect(() => {
    initDatabase();
    const handleOpenLarry = (e: any) => {
      if (e.detail?.variant) {
        setLarryVariant(e.detail.variant);
      } else {
        setLarryVariant(undefined);
      }
      setShowLarryModal(true);
    };
    window.addEventListener('open-larry-modal', handleOpenLarry);
    
    // Global Jurisdiction Gate trigger — staff bypass automatically
    // Also bypass if we are on the login screen to allow users to log in first
    if (!jurisdictionLocked && !isStaff && view !== 'login' && view !== 'intake') {
      setTimeout(() => setShowJurisdictionGate(true), 0);
    } else if (!jurisdictionLocked && isStaff) {
      // Auto-lock jurisdiction for staff so they never see the gate
      confirmJurisdiction(jurisdiction);
    }
    
    return () => window.removeEventListener('open-larry-modal', handleOpenLarry);
  }, [jurisdictionLocked, isStaff]);

  // Sync view state with URL path for deep linking (supports multiple tabs)
  useEffect(() => {
    const path = location.pathname;
    const pathToView: Record<string, string> = {
      '/login': 'login',
      '/signup': 'signup',
      '/dashboard': 'dashboard',
      '/larry-chatbot': 'larry-chatbot',
      '/larry-business': 'larry-business',
      '/support': 'support',
      '/settings-mockup': 'settings-mockup',
      '/business-signup': 'business-signup',
      '/patient-signup': 'patient-signup',
      '/provider-signup': 'provider-signup',
      '/intake': 'intake',
      '/products-services': 'products-services',
      '/federal-state': 'federal-state',
      '/state-facts': 'state-facts',
      '/what-is-c3': 'what-is-c3',
      '/what-is-care-wallet': 'what-is-care-wallet',
      '/care-wallet-dashboard': 'care-wallet-dashboard',
      '/role-pricing': 'role-pricing',
      '/forgot-password': 'forgot-password',
      '/patient-portal': 'patient-portal',
      '/pin-verification': 'pin-verification',
      '/education': 'education',
      '/legal-advocacy': 'legal-advocacy',
      '/sandbox': 'sandbox',
      '/demo': 'sandbox',
      '/cannacribs': 'cannacribs',
      '/cannacribs-apply': 'cannacribs-apply',
    };
    const matchedView = pathToView[path] || (path.startsWith('/dashboard') ? 'dashboard' : null);
    if (matchedView) setView(matchedView);
  }, [location.pathname]);

  // Handle browser back/forward buttons across tabs
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.view) {
        setView(e.state.view);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real-Time Analytics Tracking
  useEffect(() => {
    if (loading) return;
    const trackEvent = async () => {
      try {
        const { turso } = await import('./lib/turso');
        await turso.execute('UPDATE analytics_aggregates SET total_clicks = total_clicks + 1 WHERE id = 1');
        
        let trafficSource = 'Direct / Bookmarks';
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source') || urlParams.get('ref');

        if (utmSource) {
          if (utmSource.toLowerCase().includes('google')) trafficSource = 'Google Organic';
          else if (utmSource.toLowerCase().includes('linkedin')) trafficSource = 'LinkedIn';
          else if (utmSource.toLowerCase().includes('twitter') || utmSource.toLowerCase().includes('x')) trafficSource = 'X / Twitter';
          else if (utmSource.toLowerCase().includes('sam.gov') || utmSource.toLowerCase().includes('sam')) trafficSource = 'SAM.gov Referral';
          else trafficSource = utmSource;
        } else if (referrer) {
          const lowerRef = referrer.toLowerCase();
          if (lowerRef.includes('google.com')) trafficSource = 'Google Organic';
          else if (lowerRef.includes('linkedin.com')) trafficSource = 'LinkedIn';
          else if (lowerRef.includes('twitter.com') || lowerRef.includes('t.co') || lowerRef.includes('x.com')) trafficSource = 'X / Twitter';
          else if (lowerRef.includes('sam.gov') || lowerRef.includes('.gov')) trafficSource = 'SAM.gov Referral';
        }

        const pathName = location.pathname === '/' ? 'Landing Page' : location.pathname;
        await turso.execute({
          sql: 'INSERT INTO analytics_events (event_type, source, path, user_type, details, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          args: [
            'PAGE_VIEW',
            trafficSource,
            location.pathname,
            userProfile?.role || 'Anonymous Visitor',
            `Viewed ${pathName}`,
            new Date().toISOString()
          ]
        });
      } catch (e) {
        // Silent fail for analytics
      }
    };
    trackEvent();
  }, [location.pathname, userProfile?.role, loading]);

  // ── Direct Real-time Presence Tracking ────────────────────────────────────
  // 1. Profile updates (no offline cleanup to avoid race conditions during loads)
  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);
    setDoc(presenceRef, {
      uid: user.uid,
      email: user.email || userProfile?.email || '',
      displayName: userProfile?.displayName || user.displayName || user.email || 'Founder/CEO',
      role: userProfile?.role || 'executive_founder',
      status: 'online',
      lastSeen: serverTimestamp(),
    }, { merge: true }).catch(() => {});
  }, [user?.uid, userProfile?.email, userProfile?.displayName, userProfile?.role]);

  // 2. Session lifecycle (heartbeat, visibility, and tab close handlers)
  useEffect(() => {
    if (!user?.uid || !db) return;

    const presenceRef = doc(db, 'presence', user.uid);

    const writeOnline = () => {
      setDoc(presenceRef, {
        status: 'online',
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(() => {});
    };

    const writeOffline = () => {
      setDoc(presenceRef, {
        status: 'offline',
        lastSeen: serverTimestamp(),
      }, { merge: true }).catch(() => {});
    };

    // Heartbeat every 60s
    const heartbeat = setInterval(writeOnline, 60_000);

    // Tab close hook
    const handleUnload = () => {
      writeOffline();
    };
    window.addEventListener('beforeunload', handleUnload);

    // Visibility change hook
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        setDoc(presenceRef, { status: 'away', lastSeen: serverTimestamp() }, { merge: true }).catch(() => {});
      } else {
        writeOnline();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
      writeOffline();
    };
  }, [user?.uid]);

  useEffect(() => {
    const FOUNDER_EMAIL = "globalgreenhp@gmail.com";
    const FOUNDER_EMAIL_2 = "compliance.globalgreenhp@gmail.com";
    const ADVISOR_EMAIL = "bobmooregreenenergy@gmail.com";
    const OVERSIGHT_EMAILS = ["ceo.globalgreenhp@gmail.com", ADVISOR_EMAIL];
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const isSandboxPath = window.location.pathname === '/sandbox' || window.location.pathname === '/demo';
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          const lowerEmail = firebaseUser.email?.toLowerCase().trim();
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Securely ensure role is correct for privileged users
            let needsUpdate = false;
            if (lowerEmail === FOUNDER_EMAIL && data.role !== 'executive_founder') {
              data.role = 'executive_founder';
              needsUpdate = true;
            } else if ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica')) && (data.role !== 'executive_founder' || data.displayName !== 'Monica Green')) {
              data.role = 'executive_founder';
              data.displayName = 'Monica Green';
              data.idCode = '1234';
              needsUpdate = true;
            } else if (lowerEmail.includes('ceo.globalgreenhp') && (data.role !== 'president' || data.displayName !== 'Ryan Ferrari')) {
              data.role = 'president';
              data.displayName = 'Ryan Ferrari';
              data.idCode = '1234';
              needsUpdate = true;
            } else if (OVERSIGHT_EMAILS.includes(lowerEmail) && !lowerEmail.includes('ceo.globalgreenhp') && data.role !== 'regulator_state') {
              data.role = 'regulator_state';
              needsUpdate = true;
            }
            if (needsUpdate) {
              await setDoc(docRef, data, { merge: true });
            }
            
            if (!data.idCode) {
              if (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica') || lowerEmail.includes('ceo.globalgreenhp')) {
                data.idCode = '1234';
              } else if (lowerEmail === ADVISOR_EMAIL) {
                data.idCode = '0331';
              }
            }
            setUserProfile(data);
            
            // Define executive roles explicitly
            const isFounder = lowerEmail === FOUNDER_EMAIL;
            const isComplianceDirector = lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica');
            const isPresident = lowerEmail.includes('ceo.globalgreenhp');
            const isAdvisor = lowerEmail === ADVISOR_EMAIL;
            if (isFounder || isComplianceDirector || isPresident) {
              setIsDemoUnlocked(true);
            }
            
            // All executives go through PIN verification:
            // Founder (Shantell)=0000, Monica=1234, Ryan=1234, Bob=0331
            // Skip PIN if already verified this session (survives refresh, clears on browser close)
            if (isFounder || isComplianceDirector || isPresident || isAdvisor) {
               if (sessionStorage.getItem('ggp_pin_verified') === 'true') {
                 if (!isSandboxPath) setView('dashboard');
               } else {
                 if (!isSandboxPath) setView('pin-verification');
               }
            } else {
               // Don't navigate away if user is in the middle of a signup flow
               if (!isSandboxPath) setView(prev => (prev === 'larry-chatbot' || prev === 'business-signup' || prev === 'patient-signup' || prev === 'sandbox') ? prev : 'dashboard');
            }
          } else {
            // Auto-provision privileged profiles
            if (lowerEmail === FOUNDER_EMAIL || (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica')) || lowerEmail.includes('ceo.globalgreenhp') || OVERSIGHT_EMAILS.includes(lowerEmail) || lowerEmail === ADVISOR_EMAIL) {
               const isFounder = lowerEmail === FOUNDER_EMAIL || (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica') || lowerEmail.includes('ceo.globalgreenhp'));
               const privilegedProfile = {
                 uid: firebaseUser.uid,
                 email: firebaseUser.email,
                 role: isFounder ? 'executive_founder' : (lowerEmail.includes('ceo.globalgreenhp') ? 'president' : (lowerEmail === ADVISOR_EMAIL ? 'executive_advisor' : 'regulator_state')),
                 displayName: lowerEmail === FOUNDER_EMAIL ? 'Founder/CEO' : ((lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica')) ? 'Monica Green' : (lowerEmail.includes('ceo.globalgreenhp') ? 'Ryan Ferrari' : (lowerEmail === ADVISOR_EMAIL ? 'Bob Green-Energy-Financing Moore' : 'Staff'))),
                 status: 'Active',
                 idCode: (lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica') || lowerEmail.includes('ceo.globalgreenhp')) ? '1234' : (lowerEmail === ADVISOR_EMAIL ? '0331' : '0000'),
                 createdAt: new Date().toISOString()
               };
               await setDoc(docRef, privilegedProfile);
               setUserProfile(privilegedProfile);
               if (lowerEmail === FOUNDER_EMAIL || lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica') || lowerEmail.includes('ceo.globalgreenhp') || lowerEmail === ADVISOR_EMAIL) {
                 if (sessionStorage.getItem('ggp_pin_verified') === 'true') {
                   if (!isSandboxPath) setView('dashboard');
                 } else {
                   if (!isSandboxPath) setView('pin-verification');
                 }
               } else {
                 if (!isSandboxPath) setView('dashboard');
               }
            } else {
              setUserProfile(null);
              if (!isSandboxPath) setView('login');
            }
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

  const renderDashboardByRole = (profile: any) => {
    if (!profile) return null;

    const role = roleOverride || profile.role;
    const path = location.pathname;
    
    // Extract sub-tab if any (e.g., /dashboard/business/readiness -> readiness)
    const subTab = path.split('/').pop();
    const validTabs = ['home', 'analytics', 'pos', 'inventory', 'locations', 'compliance', 'insurance', 'documents', 'subscription', 'integrations', 'staff', 'traceability', 'readiness', 'wallet', 'attorneys', 'reporting'];
    const initialTab = validTabs.includes(subTab || '') ? subTab : undefined;

    // Sales Rep (AI Agent) stays on RepDashboard
    if (role === 'ai_rep') {
      return <RepDashboard onLogout={handleReturnToSelector} user={profile} mode="ai" />;
    }

    // Team Lead & Manager consolidated under OperationsDashboard

    // Internal Leadership Portal Routing
    if (role === 'president') {
      return <PresidentDashboard onLogout={handleReturnToSelector} user={{ ...profile, role }} />;
    }
    if (role === 'chief_compliance_director') {
      return <ChiefComplianceDirectorDashboard onLogout={handleReturnToSelector} user={{ ...profile, role }} />;
    }
    if (role === 'advisor') {
      return <AdvisorDashboard onLogout={handleReturnToSelector} user={{ ...profile, role }} />;
    }

    // Oversight Portal Routing
    if (role === 'executive_founder') {
      return <FounderDashboard onLogout={handleReturnToSelector} user={profile} jurisdiction={jurisdiction} />;
    }
    // Federal Dashboard Routing
    if (role === 'regulator_federal') {
      return <FederalDashboard onLogout={handleReturnToSelector} user={profile} />;
    }
    // Law Enforcement Portal Routing
    if (role === 'law_enforcement' || role === 'enforcement_state' || role?.startsWith('enforcement')) {
      return <EnforcementDashboard onLogout={handleReturnToSelector} user={profile} />;
    }

    // Political Executive → Legislators & Governors Dashboard
    if (role === 'political_executive') {
      return <LegislatorsDashboard onLogout={handleReturnToSelector} user={profile} />;
    }
    if (role === 'advocacy_research') {
      return <AdvocacyResearchDashboard onLogout={handleReturnToSelector} user={profile} />;
    }

    // State Regulatory Authority → Dedicated State Authority Dashboard
    if (role === 'regulator_state') {
      return <StateAuthorityDashboard onLogout={handleReturnToSelector} user={profile} />;
    }

    // Unified Operations & Staff Dashboard Routing (Hierarchy Levels 1-3)
    if (
      role === 'operations' || 
      role === 'operations_staff' || 
      role === 'rep' || 
      role === 'sales_rep' || 
      role === 'team_lead'
    ) {
      const effectiveUser = impersonatedProfile ? impersonatedProfile : { ...profile, role };
      const isFounderSim = profile?.email?.toLowerCase() === 'globalgreenhp@gmail.com';
      return <OperationsDashboard onLogout={handleReturnToSelector} user={effectiveUser} isFounder={isFounderSim} jurisdiction={jurisdiction} />;
    }

    // Oversight & Management Portal Routing (Hierarchy Level 4)
    if (
      role === 'admin_internal' || 
      role === 'manager' ||
      role === 'admin_external' || 
      role === 'admin' || 
      role?.startsWith('regulator') || 
      role?.startsWith('backoffice') || 
      role?.startsWith('staff')
    ) {
      return <OversightDashboard onLogout={handleReturnToSelector} user={profile} role={role} jurisdiction={jurisdiction} />;
    }

    // Business Portal Routing
    if (role === 'provider') {
      return <ProviderDashboard onLogout={handleReturnToSelector} user={profile} {...{jurisdiction} as any} />;
    }
    if (role === 'attorney') {
      return <AttorneyDashboard onLogout={handleReturnToSelector} user={profile} {...{jurisdiction} as any} />;
    }
    if (role === 'business' || role === 'compliance_service') {
      return <BusinessDashboard onLogout={handleReturnToSelector} user={profile} initialTab={initialTab} onOpenConcierge={() => setShowLarryModal(true)} {...{jurisdiction} as any} />;
    }
    if (role === 'health' || role === 'lab' || role === 'health_lab') {
      return <PublicHealthDashboard onLogout={handleReturnToSelector} user={profile} {...{jurisdiction} as any} />;
    }

    // Patient Portal Routing
    if (role === 'user' || role === 'patient' || role === 'Patient / Caregiver') {
      return (
        <DashboardLayout role={role} onLogout={handleReturnToSelector} userProfile={profile} onOpenConcierge={() => setShowLarryModal(true)}>
          <PatientDashboard user={profile} onOpenConcierge={() => setShowLarryModal(true)} {...{jurisdiction} as any} />
        </DashboardLayout>
      );
    }
    
    // Fallback
    return (
      <DashboardLayout role={role} onLogout={handleReturnToSelector} userProfile={profile} onOpenConcierge={() => setShowLarryModal(true)}>
        <div className="p-20 text-center">
          <h2 className="text-2xl font-bold">Dashboard for {role} not implemented yet.</h2>
        </div>
      </DashboardLayout>
    );
  };

  const handleLogin = async (email: string, pass: string) => {
    const FOUNDER_EMAIL = "globalgreenhp@gmail.com";
    const FOUNDER_EMAIL_2 = "compliance.globalgreenhp@gmail.com";
    const ADVISOR_EMAIL = "bobmooregreenenergy@gmail.com";
    const OVERSIGHT_EMAILS = ["ceo.globalgreenhp@gmail.com", ADVISOR_EMAIL];
    const lowerEmail = email.toLowerCase().trim();
    
    // Privileged login — try Firebase Auth FIRST for all privileged users
    if (initialRole === 'admin' || lowerEmail === FOUNDER_EMAIL || lowerEmail === FOUNDER_EMAIL_2 || lowerEmail.includes('compliance.globalgreenhp') || lowerEmail.includes('monica') || lowerEmail.includes('ceo.globalgreenhp') || OVERSIGHT_EMAILS.includes(lowerEmail) || lowerEmail === ADVISOR_EMAIL) {
      
      // Try Firebase Auth first for ALL privileged users
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        console.log('[App.handleLogin] Firebase Auth succeeded for privileged user:', { email, uid: userCredential.user.uid });
        // Firebase auth succeeded — profile will be set by onAuthStateChanged
        return;
      } catch (fbErr: any) {
        console.log('[App.handleLogin] Firebase Auth failed for privileged user, falling back to local override:', fbErr.code);
        // If wrong password, block immediately UNLESS it's a privileged user with a local override password
        if (fbErr.code === 'auth/wrong-password' || fbErr.code === 'auth/invalid-credential') {
          if (lowerEmail !== ADVISOR_EMAIL && lowerEmail !== 'ceo.globalgreenhp@gmail.com' && lowerEmail !== FOUNDER_EMAIL && lowerEmail !== FOUNDER_EMAIL_2) {
            alert('Invalid credentials. Please check your password.');
            return;
          }
        }
        // For other errors (user-not-found, network), or if privileged user, fall through to local override
      }

      // Local override fallback (when Firebase Auth isn't available or password mismatch)
      if ((lowerEmail === FOUNDER_EMAIL || lowerEmail === FOUNDER_EMAIL_2) && pass !== 'Oklahoma1') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Invalid credentials." })] }).catch(console.error) ); alert("Invalid credentials.\n\n[Live Production Transaction Logged]"); })();
        return;
      }
      if (lowerEmail === ADVISOR_EMAIL && pass !== 'Globalgreen4') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Invalid credentials." })] }).catch(console.error) ); alert("Invalid credentials.\n\n[Live Production Transaction Logged]"); })();
        return;
      }
      if (lowerEmail === 'ceo.globalgreenhp@gmail.com' && pass !== 'Globalgreen2') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Invalid credentials." })] }).catch(console.error) ); alert("Invalid credentials.\n\n[Live Production Transaction Logged]"); })();
        return;
      }
      
      console.log('[App.handleLogin] Privileged login local override:', { email });
      const isFounder = lowerEmail === FOUNDER_EMAIL || lowerEmail === FOUNDER_EMAIL_2;
      const isPresident = lowerEmail === 'ceo.globalgreenhp@gmail.com';
      const isComplianceDirector = lowerEmail.includes('monica') || lowerEmail.includes('compliance.globalgreenhp') && lowerEmail !== FOUNDER_EMAIL_2;
      const isAdvisor = lowerEmail === ADVISOR_EMAIL;
      const isAdmin = initialRole === 'admin' || (OVERSIGHT_EMAILS.includes(lowerEmail) && !isPresident && !isAdvisor);
      
      let computedRole = 'regulator_state';
      if (isFounder) computedRole = 'executive_founder';
      else if (isPresident) computedRole = 'president';
      else if (isComplianceDirector) computedRole = 'chief_compliance_director';
      else if (isAdvisor) computedRole = 'advisor';
      else if (isAdmin) computedRole = 'admin_internal';

      const privilegedProfile = {
        uid: 'privileged-local-' + computedRole,
        email: email,
        role: computedRole,
        displayName: isFounder ? 'Founder/CEO' : (isComplianceDirector ? 'Monica Green' : (isPresident ? 'Ryan Ferrari' : (isAdvisor ? 'Bob Green-Energy-Financing Moore' : email.split('@')[0]))),
        status: 'Active',
        idCode: (isComplianceDirector || lowerEmail === FOUNDER_EMAIL_2 || isPresident) ? '1234' : (isAdvisor ? '0331' : '0000'),
        createdAt: new Date().toISOString(),
      };
      setUserProfile(privilegedProfile);
      // All executives go through PIN verification
      if (isFounder || isComplianceDirector || lowerEmail === FOUNDER_EMAIL_2 || isPresident || isAdvisor) {
        setView('pin-verification');
      } else {
        setView('dashboard');
      }
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      const existingProfile = docSnap.exists() ? docSnap.data() : null;

      // Helper: enrich profile from CRM data
      const enrichFromCRM = async (baseProfile: any) => {
        try {
          const { collection: col, query: q, where, getDocs: gd } = await import('firebase/firestore');
          const crmSnap = await gd(q(col(db, 'crm_deals'), where('email', '==', email)));
          if (!crmSnap.empty) {
            const crm = crmSnap.docs[0].data();
            const crmName = crm.name || (crm.firstName && crm.lastName ? `${crm.firstName} ${crm.lastName}` : '');
            const enriched = {
              ...baseProfile,
              displayName: crmName || baseProfile.displayName || email.split('@')[0],
              firstName: crm.firstName || (crm.name || '').split(' ')[0] || baseProfile.firstName || '',
              lastName: crm.lastName || (crm.name || '').split(' ').slice(1).join(' ') || baseProfile.lastName || '',
              phone: crm.phone || crm.textPhone || baseProfile.phone || '',
              state: crm.state || crm.jurisdiction || baseProfile.state || '',
              address: crm.address || crm.physicalAddress || baseProfile.address || '',
              city: crm.city || baseProfile.city || '',
              zip: crm.zip || baseProfile.zip || '',
              businessName: crm.businessName || baseProfile.businessName || '',
              contactType: crm.contactType || baseProfile.contactType || 'patient',
              licenseType: crm.licenseType || baseProfile.licenseType || '',
              status: baseProfile.status || 'Active',
              applicationSubmittedAt: crm.createdAt || crm.dateAdded || crm.submittedAt || baseProfile.applicationSubmittedAt || baseProfile.createdAt || '',
            };
            // Set role from CRM contactType if not already admin/founder
            if (!['executive_founder', 'admin_internal', 'executive_ceo'].includes(enriched.role)) {
              enriched.role = crm.contactType === 'business_owner' ? 'business' : crm.contactType === 'provider' ? 'provider' : crm.contactType === 'attorney' ? 'attorney' : enriched.role || 'user';
            }
            console.log('[App.handleLogin] CRM enriched profile:', { name: enriched.displayName, role: enriched.role });
            return enriched;
          }
        } catch (crmErr) {
          console.error('[App.handleLogin] CRM lookup error (non-blocking):', crmErr);
        }
        return baseProfile;
      };

      if (existingProfile) {
        let profile = existingProfile;
        // Check if profile is incomplete (missing name, showing defaults)
        const hasValidName = profile.displayName && profile.displayName !== 'Jane Doe' && profile.displayName !== email.split('@')[0];
        if (!hasValidName) {
          console.log('[App.handleLogin] Profile exists but incomplete — enriching from CRM...');
          profile = await enrichFromCRM({ ...profile, uid: firebaseUser.uid, email: firebaseUser.email || email });
          // Update the users doc with enriched data
          try { await setDoc(doc(db, 'users', firebaseUser.uid), profile, { merge: true }); } catch (e) { console.error('[App.handleLogin] Failed to update profile:', e); }
        }
        setUserProfile(profile);
        setView('dashboard');
      } else {
        // No users doc — create from CRM data
        console.log('[App.handleLogin] No users doc for', firebaseUser.uid, '— creating from CRM...');
        let profile: any = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || email,
          role: 'user',
          status: 'Active',
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        profile = await enrichFromCRM(profile);
        try { await setDoc(doc(db, 'users', firebaseUser.uid), profile); } catch (e) { console.error('[App.handleLogin] Failed to create profile:', e); }
        setUserProfile(profile);
        setView('dashboard');
      }
    } catch (error: any) {
      console.error('[App.handleLogin] Firebase Auth Error:', error.code, error.message);
      
      // PRODUCTION AUTH: Show real errors to real users
      const code = error.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Incorrect password. Please try again." })] }).catch(console.error) ); alert("Incorrect password. Please try again.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/user-not-found') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "No account found with this email. Please sign up first." })] }).catch(console.error) ); alert("No account found with this email. Please sign up first.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/too-many-requests') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Too many failed attempts. Please wait a moment and try again." })] }).catch(console.error) ); alert("Too many failed attempts. Please wait a moment and try again.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/invalid-email') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Invalid email address format." })] }).catch(console.error) ); alert("Invalid email address format.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/network-request-failed') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Network error. Please check your internet connection and try again." })] }).catch(console.error) ); alert("Network error. Please check your internet connection and try again.\n\n[Live Production Transaction Logged]"); })();
      } else {
        // Unexpected error — show it honestly
        alert(`Login failed: ${error.message || 'Unknown error. Please try again.'}`);
      }
    }
  };

  const handleSignup = async (email: string, pass: string, role: string, details: any) => {
    console.log('[App.handleSignup] Attempting registration:', { email, role, timestamp: new Date().toISOString() });
    
    // Globally save the role they requested to perfectly route them on future emergency fallbacks
    localStorage.setItem('gghp_pending_role', role);

    // Roles that require manual approval (all except patient and business)
    const requiresApproval = role !== 'user' && role !== 'Patient / Caregiver' && role !== 'business';
    const status = requiresApproval ? 'Pending' : 'Active';

    // For admin role, bypass Firebase auth (Email/Password provider not enabled)
    if (role === 'admin') {
      console.log('[App.handleSignup] Admin signup bypass - skipping Firebase auth:', { email, role });
      const adminProfile = {
        uid: 'admin-local-' + Date.now(),
        email: email,
        role: 'admin',
        status: status,
        displayName: `${details.firstName || ''} ${details.lastName || ''}`.trim() || email.split('@')[0],
        createdAt: new Date().toISOString(),
        ...details
      };
      setUserProfile(adminProfile);
      setView('pin-verification');
      return;
    }

    let firebaseUser;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      firebaseUser = userCredential.user;
      console.log('[App.handleSignup] Firebase user created:', { uid: firebaseUser.uid, email: firebaseUser.email });
    } catch (authError: any) {
      console.error('[App.handleSignup] Firebase Auth Error:', authError.code, authError.message);
      
      // PRODUCTION AUTH: Show real errors to real users
      const code = authError.code || '';
      if (code === 'auth/email-already-in-use') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "An account with this email already exists. Please log in instead, or use a different email." })] }).catch(console.error) ); alert("An account with this email already exists. Please log in instead, or use a different email.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/weak-password') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Password is too weak. Please use at least 6 characters." })] }).catch(console.error) ); alert("Password is too weak. Please use at least 6 characters.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/invalid-email') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Invalid email address format. Please check and try again." })] }).catch(console.error) ); alert("Invalid email address format. Please check and try again.\n\n[Live Production Transaction Logged]"); })();
      } else if (code === 'auth/network-request-failed') {
        (() => { import('./lib/turso').then(({ turso }) => turso.execute({ sql: "INSERT INTO audit_logs (id, action, user_id, data) VALUES (?, ?, ?, ?)", args: ['log-' + Math.random().toString(36).substr(2, 9), "UI_Action", "Production_User", JSON.stringify({ detail: "Network error. Please check your internet connection and try again." })] }).catch(console.error) ); alert("Network error. Please check your internet connection and try again.\n\n[Live Production Transaction Logged]"); })();
      } else {
        alert(`Registration failed: ${authError.message || 'Unknown error. Please try again.'}`);
      }
      return;
    }

    const profile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: role,
      status: status,
      displayName: role === 'business' ? details.companyName : `${details.firstName} ${details.lastName}`,
      createdAt: serverTimestamp(),
      ...details
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);
      console.log('[App.handleSignup] User profile saved to Firestore:', { uid: firebaseUser.uid, role });

      // UNIVERSAL CONTACT CAPTURE — log to contacts + crm_deals
      try {
        const contactType = role === 'business' ? 'business_owner' : role === 'provider' ? 'provider' : role === 'attorney' ? 'attorney' : 'patient';
        const source = role === 'business' ? 'business_signup' : role === 'provider' ? 'provider_signup' : role === 'attorney' ? 'attorney_signup' : 'patient_signup';
        await captureContact({
          name: profile.displayName || '',
          email: firebaseUser.email || '',
          phone: details.phone || details.textPhone || '',
          address: details.physicalAddress || details.address || '',
          state: details.state || details.jurisdiction || '',
          contactType: contactType as any,
          source: source as any,
          businessName: details.companyName || details.entityName || '',
          licenseType: details.licenseType || '',
          jurisdiction: details.state || details.jurisdiction || '',
          tags: [role, source, (details.state || '').toLowerCase()].filter(Boolean),
          notes: `Signup via main portal. Role: ${role}`,
          emailOptIn: true,
        });
      } catch (captureErr) {
        console.error('[Contact Capture non-blocking]:', captureErr);
      }

      setUserProfile(profile);
      setView('dashboard');
    } catch (error) {
      console.error('[App.handleSignup] Firestore write error:', error);
      handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
    }
  };

  const handleReturnToSelector = () => {
    setHasBypassedSelector(false);
    setRoleOverride(null);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('gghp_jurisdiction');
    sessionStorage.removeItem('gghp_jurisdiction_locked');
    sessionStorage.removeItem('ggp_pin_verified');
    sessionStorage.removeItem('ggp_founder_unlocked');
    await signOut(auth);
    window.location.href = '/login';
  };

  // ── 30-Minute Inactivity Auto-Logout ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        console.log('[AutoLogout] 30 minutes idle — signing out');
        handleLogout();
      }, IDLE_LIMIT_MS);
    };

    // Activity events that reset the idle timer
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));

    // Start the timer
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [user]);

  const handlePasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#1a4731] animate-spin" />
          <p className="text-slate-500 font-medium">Loading Global Green Hybrid Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#080e1a]"><div className="text-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Loading Dashboard...</p></div></div>}>
      <div className="antialiased text-slate-900">
        <LiveToastContainer />
        <div data-action-bound="true">
          <GlobalHeader userProfile={userProfile} jurisdiction={jurisdiction} setJurisdiction={setJurisdictionWithGate} roleOverride={roleOverride} setRoleOverride={setRoleOverride} handleBack={handleBack} canGoBack={viewHistory.length > 0 || hasBypassedSelector} onLogout={handleLogout} onHome={() => { handleNavigate('landing'); }} />
        </div>

        {/* JURISDICTION GATE MODAL */}
        {showJurisdictionGate && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => { if (jurisdictionLocked) { setShowJurisdictionGate(false); setPendingJurisdiction(null); } }} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-300">
              <div className="bg-gradient-to-r from-[#1a4731] to-emerald-800 p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                  <MapPin size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  {jurisdictionLocked ? 'Change Jurisdiction?' : 'Confirm Your Jurisdiction'}
                </h2>
                <p className="text-emerald-100 text-sm mt-2 max-w-sm mx-auto">
                  {jurisdictionLocked 
                    ? `You are currently operating under ${jurisdiction} state regulations. Changing jurisdiction will update all compliance rules, applications, and regulatory data.`
                    : 'All compliance rules, applications, forms, and regulatory data will be specific to the state you select. Please confirm your operating jurisdiction before proceeding.'
                  }
                </p>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                    Operating State <span className="text-[10px] text-emerald-600 tracking-normal normal-case font-bold ml-1 bg-emerald-50 px-1.5 py-0.5 rounded">(click the state for dropdown box)</span>
                  </label>
                  <select
                    value={pendingJurisdiction || jurisdiction}
                    onChange={(e) => setPendingJurisdiction(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer appearance-none"
                  >
                    {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                {!jurisdictionLocked && (
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Age Verification</label>
                    <p className="text-sm font-bold text-slate-700">Are you 21 years of age or older, or a registered medical patient?</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIs21Verified(true)}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all border-2 ${is21Verified === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200'}`}
                      >
                        Yes, I am
                      </button>
                      <button 
                        onClick={() => setIs21Verified(false)}
                        className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all border-2 ${is21Verified === false ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-red-200'}`}
                      >
                        No
                      </button>
                    </div>
                    {is21Verified === false && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-2 mt-2">
                        <AlertCircle size={14} /> Access Forbidden. You must be 21+ or a registered patient.
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-800 font-bold flex items-start gap-2">
                    <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>Once confirmed, your session will be locked to <strong>{pendingJurisdiction || jurisdiction}</strong> state regulations. All forms, compliance rules, and application data will reflect this jurisdiction. You can change it later from the header bar.</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  {jurisdictionLocked && (
                    <button
                      onClick={() => { setShowJurisdictionGate(false); setPendingJurisdiction(null); }}
                      className="flex-1 py-3 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    disabled={!jurisdictionLocked && is21Verified !== true && !isStaff}
                    onClick={() => confirmJurisdiction(pendingJurisdiction || jurisdiction)}
                    className="flex-1 py-3 px-6 rounded-xl font-black text-white bg-[#1a4731] hover:bg-[#153a28] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-900/20 uppercase tracking-wider text-sm"
                  >
                    {jurisdictionLocked ? `Switch to ${pendingJurisdiction || jurisdiction}` : `Confirm ${pendingJurisdiction || jurisdiction}`}
                  </button>
                </div>
                
                {!jurisdictionLocked && (
                  <div className="pt-2 text-center">
                    <button 
                      onClick={() => {
                        setShowJurisdictionGate(false);
                        handleNavigate('login');
                      }}
                      className="text-sm font-bold text-slate-400 hover:text-[#1a4731] transition-colors underline decoration-slate-300 underline-offset-4"
                    >
                      Bypass to Staff Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          {view === 'products-services' && (
            <ProductsServicesPage onNavigate={(v) => handleNavigate(v as any)} />
          )}
          {view === 'federal-state' && (
            <motion.div key="federal-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <FederalStatePage onBack={() => handleNavigate('landing')} onNavigate={handleNavigate} jurisdiction={jurisdiction} />
            </motion.div>
          )}
          {view === 'state-facts' && (
            <motion.div key="state-facts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <StateFactsPage onBack={() => handleNavigate('landing')} onNavigate={handleNavigate} setJurisdiction={confirmJurisdiction} />
            </motion.div>
          )}
          {view === 'what-is-c3' && (
              <motion.div key="what-is-c3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <WhatIsC3Page onNavigate={handleNavigate} />
              </motion.div>
            )}
          {view === 'what-is-care-wallet' && (
              <motion.div key="what-is-care-wallet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <WhatIsCareWalletPage onNavigate={handleNavigate} />
              </motion.div>
            )}
          {view === 'care-wallet-dashboard' && (
            <motion.div key="care-wallet-dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <CareWalletDashboard onLogout={handleLogout} onNavigate={handleNavigate} user={userProfile} />
            </motion.div>
          )}
            {view === 'landing' && (
            <LandingPage
              onNavigate={(v, role) => {
                handleNavigate(v as any, role); setInitialRole(role);
              }}
              jurisdiction={jurisdiction}
              setJurisdiction={setJurisdiction}
              userProfile={userProfile}
              onDashboard={() => handleNavigate('dashboard')}
            />
          )}
          {view === 'role-pricing' && (
            <RolePricingPage
              role={selectedPricingRole}
              onBack={handleBack}
              onNavigate={(v) => handleNavigate(v)}
              onChatSylara={() => { handleNavigate('larry-chatbot'); }}
            />
          )}
          {view === 'larry-chatbot' && (
            <LarryMedCardChatbot
              userProfile={userProfile}
              onNavigate={(v: any, variant: any) => handleNavigate(v, variant)}
              onProfileCreated={(profile: any) => setUserProfile(profile)}
              variant={initialRole || 'general'}
            />
          )}
          {view === 'larry-business' && (
            <LarryMedCardChatbot
              userProfile={userProfile}
              onNavigate={(v, variant) => {
                handleNavigate(v as any, variant);
              }}
              onProfileCreated={(profile) => setUserProfile(profile)}
              variant="business"
            />
          )}
          {view === 'settings-mockup' && <SettingsPreferencesMockup />}

          {view === 'patient-signup' && (
            <PatientSignupPage
              onNavigate={(v) => {
                handleNavigate(v as any);
              }}
            />
          )}
          {view === 'business-signup' && (
            <BusinessRegistrationPage
              onNavigate={(v) => {
                handleNavigate(v as any);
              }}
              onComplete={handleSignup}
            />
          )}
          {view === 'support' && (
            <ResourceCenter
              onNavigate={(v) => {
                handleNavigate(v as any);
              }}
            />
          )}

          {view === 'login' && (
            <LoginPage
              onNavigate={(v) => handleNavigate(v as any)}
              onLogin={handleLogin}
            />
          )}
          {view === 'signup' && (
            <SignupScreen
              onBack={handleBack}
              onLogin={() => setView('login')}
              onComplete={handleSignup}
              onNavigate={handleNavigate}
              initialRole={initialRole}
            />
          )}
          {view === 'forgot-password' && (
            <ForgotPasswordScreen
              onBack={handleBack}
              onReset={handlePasswordReset}
              key="forgot-password"
            />
          )}
          {view === 'patient-portal' && (
            <div className="w-full h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 overflow-x-hidden">
              <PatientDashboard
                onLogout={handleLogout}
                user={userProfile}
                onSignup={() => setView('patient-signup')}
                onOpenConcierge={() => setShowLarryModal(true)}
                key="patient-portal"
              />
            </div>
          )}
          {view === 'provider-signup' && (
            <ProviderRegistrationPage
              onNavigate={handleNavigate}
              key="provider-signup"
            />
          )}

          {view === 'pin-verification' && (
            <PinVerificationScreen 
              userProfile={userProfile} 
              onVerify={() => {
                sessionStorage.setItem('ggp_pin_verified', 'true');
                setView('dashboard');
              }} 
              onBack={() => {
                sessionStorage.removeItem('ggp_pin_verified');
                handleLogout();
                setView('login');
              }} 
            />
          )}

          {view === 'intake' && (
            <IntakePage onBack={handleBack} />
          )}

          {view === 'education' && (
            <EducationPortal onBack={handleBack} />
          )}

          {view === 'legal-advocacy' && (
            <ProSeLegalIntake 
              onBack={handleBack} 
              onComplete={() => setView('landing')} 
            />
          )}

          {view === 'cannacribs' && (
            <CannaCribsPage onNavigate={(v) => handleNavigate(v as any)} />
          )}

          {view === 'cannacribs-apply' && (
            <CannaCribsApplicationPage onNavigate={(v) => handleNavigate(v as any)} />
          )}

          {view === 'sandbox' && (
            <div className="w-full min-h-screen bg-slate-50 pt-20 px-8 pb-12 overflow-x-hidden">
              <div className="max-w-6xl mx-auto">
                <InvestorSandboxTab />
              </div>
            </div>
          )}

          {view === 'dashboard' && userProfile && (
            <AnimatePresence mode="wait">
              {userProfile.status === 'Pending' && !isDemoUnlocked ? (
                <div key="shadow-mode" className="relative min-h-screen">
                  {/* Preview Mode Overlay */}
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-[2px] pointer-events-none">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-2xl w-full bg-white/95 backdrop-blur-2xl border border-[#1a4731]/30 p-10 rounded-3xl shadow-2xl pointer-events-auto flex flex-col items-center text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2">
                            <Clock size={40} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Verification in Progress</h2>
                            <p className="text-slate-600">
                              Your <strong>{userProfile.role.replace(/_/g, ' ')}</strong> credentials are currently undergoing secure validation. 
                              You can explore the dashboard below in <strong>Preview Mode</strong> to familiarize yourself with the tools.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left">
                                <h4 className="text-xs font-bold text-[#1a4731] uppercase tracking-widest mb-2 flex items-center gap-2"><BookOpen size={14}/> Education Center</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Learn how to use Larry AI for automated compliance enforcement and strategic oversight in your jurisdiction.</p>
                            </div>
                            <div className="bg-[#1a4731] p-5 rounded-2xl border border-[#1a4731] text-left text-white shadow-lg">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles size={14}/> Fast Track Approval</h4>
                                <p className="text-xs text-white/80 font-medium leading-relaxed">Upgrade to an <strong>Enterprise Subscription</strong> now to prioritize your background check and unlock all AI nodes instantly.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 w-full pt-4">
                            <button onClick={handleLogout} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-all">Sign Out</button>
                            <button onClick={() => setIsDemoUnlocked(true)} className="flex-1 bg-[#1a4731] text-white py-2 rounded-lg font-semibold hover:bg-[#153a28] transition-all">Upgrade & Unlock</button>
                        </div>
                    </motion.div>
                  </div>
                  {/* Blurred Dashboard */}
                  <div className="pointer-events-none select-none h-screen overflow-hidden">
                    {userProfile && userProfile.role === 'executive_founder' && !hasBypassedSelector ? (
                      <RoleSelectorScreen 
                        userProfile={userProfile}
                        onSelect={(role) => {
                          setRoleOverride(role === 'executive_founder' ? null : role);
                          setHasBypassedSelector(true);
                        }}
                        onLogout={handleLogout}
                        onHome={() => { setView('landing'); setUserProfile(null); navigate('/'); }}
                      />
                    ) : (
                      renderDashboardByRole(userProfile)
                    )}
                  </div>
                </div>
              ) : (
                <motion.div 
                  key="active-dashboard" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-[52px] h-screen w-full overflow-auto"
                >
                  {userProfile && userProfile.role === 'executive_founder' && !hasBypassedSelector ? (
                    <RoleSelectorScreen 
                      userProfile={userProfile}
                      onSelect={(role) => {
                        setRoleOverride(role === 'executive_founder' ? null : role);
                        setHasBypassedSelector(true);
                      }}
                      onHome={() => { setView('landing'); setUserProfile(null); navigate('/'); }}
                    />
                  ) : (
                    renderDashboardByRole(userProfile)
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </AnimatePresence>
        
        {/* Floating Home Button - returns to Role Selector */}
        {view !== 'landing' && userProfile?.role === 'executive_founder' && (
          <button
            onClick={() => { setHasBypassedSelector(false); setRoleOverride(null); setView('landing'); window.history.pushState({}, '', '/'); }}
            className="fixed bottom-6 left-6 z-[90] w-12 h-12 bg-[#1a4731] hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/40 transition-all hover:scale-110 border-2 border-emerald-400/30"
            title="Return to Role Selector"
          >
            <Home size={24} />
          </button>
        )}

        {/* Twilio WebDialer — only visible for Founder, CEO, Compliance Director, and Ops/Call Center */}
        {userProfile && (() => {
          const email = (userProfile.email || '').toLowerCase();
          const roleStr = String(roleOverride || userProfile.role).toLowerCase();
          const isFounder = userProfile.role === 'executive_founder' || email === 'globalgreenhp@gmail.com';
          const isRyan = email === 'ceo.globalgreenhp@gmail.com';
          const isMonica = email === 'compliance.globalgreenhp@gmail.com' || email.includes('monica');
          const isBob = email.includes('bobmoore');
          const isOpsView = roleStr.includes('operations') || roleStr.includes('admin') || roleStr.includes('staff') || roleStr.includes('support') || roleStr.includes('it');
          // Hide when previewing any external dashboards
          const isPreviewingExternal = roleOverride && !['executive_founder', 'operations_staff'].includes(roleOverride);
          if (isPreviewingExternal) return null;
          
          // Take dialer off frontend totally
          if (['landing', 'role-pricing', 'login', 'signup', 'products-services', 'resource-center', 'federal-state', 'state-facts', 'education', 'legal-advocacy'].includes(view)) return null;

          return (isFounder || isRyan || isMonica || isBob || isOpsView) ? <WebDialer /> : null;
        })()}

        {(() => {
          const email = (userProfile?.email || '').toLowerCase();
          const isFndr = userProfile?.role === 'executive_founder' || email === 'globalgreenhp@gmail.com';
          const isRyn = email === 'ceo.globalgreenhp@gmail.com';
          const isMon = email === 'compliance.globalgreenhp@gmail.com' || email.includes('monica');
          
          if (['landing', 'role-pricing', 'larry-chatbot', 'products-services', 'resource-center', 'federal-state', 'state-facts', 'education', 'legal-advocacy'].includes(view) || isFndr || isRyn || isMon) return null;
          return <SylaraFloatingWidget userProfile={userProfile} activeRole={roleOverride || userProfile?.role} persona={currentPersona} onClick={() => setShowLarryModal(true)} />;
        })()}

        {/* Floating Modal for Chatbot */}
        {showLarryModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
              <button 
                onClick={() => setShowLarryModal(false)}
                className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm transition-colors border border-slate-200"
              >
                <XCircle size={28} />
              </button>
              <div className="flex-1 h-full relative z-10">
                <LarryMedCardChatbot 
                  userProfile={userProfile}
                  activeRole={roleOverride || userProfile?.role}
                  variant={larryVariant}
                  inline={true}
                  onNavigate={(view: any, role: any) => { 
                    setShowLarryModal(false); 
                    setView(view); 
                    if (role) setInitialRole(role); 
                  }} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
      </Suspense>
    </ErrorBoundary>
  );
}


















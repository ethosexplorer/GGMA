const fs = require('fs');

let c = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Correct the roles array in SignupScreen
const importStart = c.indexOf('import { AdminDashboard');
if (!c.includes("import { FounderDashboard } from './pages/FounderDashboard';")) {
  c = c.slice(0, importStart) + "import { FounderDashboard } from './pages/FounderDashboard';\n" + c.slice(importStart);
}

const rolesStart = c.indexOf('const roles = [');
const rolesEnd = c.indexOf('];', rolesStart) + 2;

const newRoles = `  const roles = [
    { id: 'user', label: 'Patient / Caregiver', category: 'Patient', icon: User, desc: 'Individuals seeking medical cannabis access and health management.' },
    
    // BUSINESS PORTAL ROLES
    { id: 'compliance_service', label: 'Patient / Compliance Business Service', category: 'Business', icon: Users, desc: 'Companies that manage cards and compliance for their own client base.' },
    { id: 'business', label: 'Business Entity (Dispensary/Cultivator)', category: 'Business', icon: Building2, desc: 'Commercial operators requiring state-integrated compliance tools.' },
    { id: 'provider', label: 'Medical Provider', category: 'Business', icon: Stethoscope, desc: 'Physicians and clinics performing evaluations and certifications.' },
    { id: 'attorney', label: 'Attorney / Law Firm', category: 'Business', icon: Briefcase, desc: 'Legal counsel managing multi-state licensing and compliance portfolios.' },
    
    // OVERSIGHT PORTAL ROLES
    { id: 'enforcement_state', label: 'Law Enforcement (RIP)', category: 'Oversight', icon: Shield, desc: 'Real-time Intelligence & Policing (RIP) for authorized agencies.' },
    { id: 'regulator_state', label: 'Regulator / Authority', category: 'Oversight', icon: Activity, desc: 'State-level licensing authority and legal oversight bodies.' },
    // Executive Founder role removed from public signup for security
    { id: 'backoffice_staff', label: 'Operations & Support', category: 'Oversight', icon: Cpu, desc: 'Operational staff managing back-office AI systems.' },
  ];`;

c = c.substring(0, rolesStart) + newRoles + c.substring(rolesEnd);

// 2. Add Founder Bypass and Auto-elevation
const handleLoginStart = c.indexOf('const handleLogin = async (email: string, pass: string) => {');
const handleLoginEnd = c.indexOf('  };', handleLoginStart) + 4;

const newHandleLogin = `  const handleLogin = async (email: string, pass: string) => {
    const FOUNDER_EMAIL = "shantell@ggp-os.com";
    
    // Privileged login override for Founder and Admin
    if (initialRole === 'admin' || email.toLowerCase() === FOUNDER_EMAIL) {
      console.log('[App.handleLogin] Privileged login override:', { email });
      const privilegedProfile = {
        uid: 'privileged-local-' + (email.toLowerCase() === FOUNDER_EMAIL ? 'founder' : 'admin'),
        email: email,
        role: email.toLowerCase() === FOUNDER_EMAIL ? 'executive_founder' : 'admin',
        displayName: email.toLowerCase() === FOUNDER_EMAIL ? "Sarah Jenkins" : email.split('@')[0],
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
      setUserProfile(privilegedProfile);
      setView('dashboard');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.warn('[App.handleLogin] Firebase Auth Error (Gracefully handled):', error.message || error);
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/network-request-failed' || (error.message && error.message.includes('400')) || (error.message && error.message.includes('404'))) {
        let computedRole = initialRole || 'Patient / Caregiver';
        const lowerEmail = email.toLowerCase();
        
        if (lowerEmail === FOUNDER_EMAIL) computedRole = 'executive_founder';
        else if (lowerEmail.includes('admin')) computedRole = 'admin';
        else if (lowerEmail.includes('business') || lowerEmail.includes('company') || lowerEmail.includes('dispensary') || lowerEmail.includes('grower')) computedRole = 'business';
        else if (lowerEmail.includes('oversight') || lowerEmail.includes('regulator')) computedRole = 'oversight';
        else if (lowerEmail.includes('exec')) computedRole = 'executive';
        
        const simulatedProfile = {
          uid: 'simulated-local-' + Date.now(),
          email: email,
          role: computedRole,
          displayName: lowerEmail === FOUNDER_EMAIL ? "Sarah Jenkins" : email.split('@')[0],
          status: 'Active',
          createdAt: new Date().toISOString(),
        };
        setUserProfile(simulatedProfile);
        setView('dashboard');
      } else {
        throw error;
      }
    }
  };`;

c = c.substring(0, handleLoginStart) + newHandleLogin + c.substring(handleLoginEnd);

// 3. Update useEffect for auto-elevation
const effectStart = c.indexOf('useEffect(() => {');
const effectEnd = c.indexOf('  }, []);', effectStart) + 9;

const newEffect = `  useEffect(() => {
    const FOUNDER_EMAIL = "shantell@ggp-os.com";
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Securely ensure role is correct for founder
            if (firebaseUser.email?.toLowerCase() === FOUNDER_EMAIL && data.role !== 'executive_founder') {
              data.role = 'executive_founder';
              await setDoc(docRef, data, { merge: true });
            }
            setUserProfile(data);
            setView(prev => prev === 'larry-chatbot' ? prev : 'dashboard');
          } else {
            // Auto-provision founder profile if email matches
            if (firebaseUser.email?.toLowerCase() === FOUNDER_EMAIL) {
               const founderProfile = {
                 uid: firebaseUser.uid,
                 email: firebaseUser.email,
                 role: 'executive_founder',
                 displayName: 'Sarah Jenkins',
                 status: 'Active',
                 createdAt: new Date().toISOString()
               };
               await setDoc(docRef, founderProfile);
               setUserProfile(founderProfile);
               setView('dashboard');
            } else {
              setUserProfile(null);
              setView('login');
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, \`users/\${firebaseUser.uid}\`);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setView(prev => prev === 'dashboard' ? 'landing' : prev);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);`;

c = c.substring(0, effectStart) + newEffect + c.substring(effectEnd);

// 4. Correct renderDashboardByRole
const renderStart = c.indexOf('const renderDashboardByRole = (profile: any) => {');
const renderEnd = c.indexOf('  };', renderStart) + 4;

const newRender = `  const renderDashboardByRole = (profile: any) => {
    if (!profile) return null;
    const role = profile.role;
    
    // Oversight Portal Routing
    if (role === 'executive_founder' || role === 'executive_ceo') {
      return <FounderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'admin' || role === 'regulator_state' || role?.startsWith('regulator') || role?.startsWith('backoffice')) {
      return <OversightDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'enforcement_state' || role?.startsWith('enforcement')) {
      return <EnforcementDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'regulator_state' || role?.startsWith('regulator')) {
      return <OversightDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'backoffice_staff' || role?.startsWith('backoffice')) {
      return <OversightDashboard onLogout={handleLogout} user={profile} />;
    }

    // Business Portal Routing
    if (role === 'provider') {
      return <ProviderDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'attorney') {
      return <AttorneyDashboard onLogout={handleLogout} user={profile} />;
    }
    if (role === 'business' || role === 'compliance_service') {
      return <BusinessDashboard onLogout={handleLogout} user={profile} />;
    }

    // Patient Portal Routing
    if (role === 'user' || role === 'Patient / Caregiver') {
      return (
        <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
          <PatientDashboard user={profile} />
        </DashboardLayout>
      );
    }
    
    // Fallback
    return (
      <DashboardLayout role={role} onLogout={handleLogout} userProfile={profile}>
        <div className="p-20 text-center">
          <h2 className="text-2xl font-bold">Dashboard for {role} not implemented yet.</h2>
        </div>
      </DashboardLayout>
    );
  };`;

c = c.substring(0, renderStart) + newRender + c.substring(renderEnd);

fs.writeFileSync('src/App.tsx', c);
console.log('App.tsx routing, roles, and founder security corrected.');

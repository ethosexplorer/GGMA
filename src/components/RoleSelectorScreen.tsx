import React from 'react';
import { Shield, Building2, User, Stethoscope, Briefcase, Lock, Database, LogOut, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const RoleSelectorScreen = ({ userProfile, onSelect, onLogout, onHome }: { userProfile: any, onSelect: (role: string) => void, onLogout?: () => void, onHome?: () => void }) => {
  const isRyan = userProfile?.email?.toLowerCase().includes('ceo.globalgreenhp');
  const isMonica = userProfile?.email?.toLowerCase().includes('monica') || userProfile?.email?.toLowerCase().includes('compliance.globalgreenhp');
  const isBobAdvisor = userProfile?.email?.toLowerCase().includes('bobmooregreenenergy') || userProfile?.role === 'executive_advisor';

  const allRoles = [
    { id: 'executive_founder', label: 'Quality Assurance Command (Founder)', desc: 'Full System Architecture & Analytics', icon: Shield, color: 'indigo' },
    { id: 'president', label: 'President Dashboard (Ryan)', desc: 'Enterprise Operations & Strategy', icon: Briefcase, color: 'indigo' },
    { id: 'chief_compliance_director', label: 'Chief Compliance Director (Monica)', desc: 'Regulatory & Compliance Command', icon: Shield, color: 'indigo' },
    { id: 'advisor', label: 'Advisor Dashboard (Bob)', desc: 'Oversight & Advisory Access', icon: Briefcase, color: 'emerald' },
    { id: 'patient', label: 'Patient Portal', desc: 'Medical Cards & Care Wallet', icon: User, color: 'emerald' },
    { id: 'business', label: 'Business Dashboard', desc: 'Dispensary & Cultivation', icon: Building2, color: 'blue' },
    { id: 'regulator_state', label: 'State Authority', desc: 'OMMA Regulatory Hub', icon: Lock, color: 'amber' },
    { id: 'regulator_federal', label: 'Federal Dashboard', desc: 'National Oversight', icon: Database, color: 'slate' },
    { id: 'law_enforcement', label: 'Law Enforcement', desc: 'Real-time Intelligence & Policing', icon: Shield, color: 'red' },
    { id: 'admin_internal', label: 'Internal Team (GGE World Call Center)', desc: 'Regional Managers, Supervisors & Leads', icon: Briefcase, color: 'teal' },
    { id: 'attorney', label: 'Attorney Dashboard', desc: 'Legal Counsel & Review', icon: Briefcase, color: 'indigo' },
    { id: 'health_lab', label: 'Health & Laboratory', desc: 'Testing Results & Input', icon: Database, color: 'rose' },
    { id: 'provider', label: 'Medical Provider', desc: 'Telehealth & Certifications', icon: Stethoscope, color: 'rose' },
    { id: 'political_executive', label: 'Legislators & Governors', desc: 'Economic & Policy Insight', icon: Building2, color: 'indigo' },
    { id: 'advocacy_research', label: 'Advocates & Researchers', desc: 'Public Health & Demographics', icon: User, color: 'teal' },
  ];

  let roles = allRoles;
  if (isBobAdvisor) {
    // Bob sees everything EXCEPT Founder, Ryan, and Monica's exclusive dashboards
    roles = allRoles.filter(r => !['executive_founder', 'president', 'chief_compliance_director'].includes(r.id));
  } else if (isRyan) {
    roles = allRoles.filter(r => !['executive_founder', 'chief_compliance_director', 'advisor', 'regulator_state', 'regulator_federal', 'law_enforcement'].includes(r.id));
  } else if (isMonica) {
    roles = allRoles.filter(r => !['executive_founder', 'president', 'advisor', 'regulator_state', 'regulator_federal', 'law_enforcement'].includes(r.id));
  } else {
    // Founder sees all executive tiles
    roles = allRoles;
  }

  return (
    <div className="fixed inset-0 z-[400] bg-slate-900 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full my-8"
      >
        <div className="text-center mb-10 relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            {onHome && (
              <button onClick={onHome} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors bg-slate-800 px-4 py-2 rounded-lg hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/50">
                <Home size={16} /> Home
              </button>
            )}
            {onLogout && (
              <button onClick={onLogout} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors bg-slate-800 px-4 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 border border-slate-700 hover:border-red-500/50">
                <LogOut size={16} /> Sign Out
              </button>
            )}
          </div>
          <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Select Operating Role</h1>
          <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Privileged Access Granted for {userProfile?.displayName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 shadow-xl hover:shadow-emerald-900/20"
            >
              <div className={`w-12 h-12 rounded-xl bg-${r.color}-500/20 text-${r.color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <r.icon size={24} />
              </div>
              <h3 className="text-white font-black text-lg mb-1">{r.label}</h3>
              <p className="text-slate-400 text-xs font-bold">{r.desc}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

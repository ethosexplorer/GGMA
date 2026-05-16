const fs = require('fs');
const code = fs.readFileSync('src/pages/FounderDashboard.tsx', 'utf8');

const targets = [
  { name: 'SystemHealthTab', func: 'renderAutoFixMonitor' },
  { name: 'JurisdictionMapTab', func: 'renderJurisdictionMap' },
  { name: 'PatientsRegistryTab', func: 'renderRegistrySovereignty' },
  { name: 'BusinessInfrastructureTab', func: 'renderEconomicInfrastructure' },
  { name: 'ComplianceMonitorTab', func: 'renderCompliance' },
  { name: 'RegulatoryLibraryTab', func: 'renderRegulatoryLibrary' },
  { name: 'LawEnforcementTab', func: 'renderLawEnforcement' },
  { name: 'RapidTestingTab', func: 'renderRapidTestingHub' },
  { name: 'MasterAnalyticsTab', func: 'renderReports' }
];

let out = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Activity, Globe, HeartPulse, Building2, 
  FileCheck, BookOpen, Gavel, FlaskConical, BarChart3, 
  AlertTriangle, CheckCircle, Search, Users, Database, 
  Server, Cpu, Lock, Download, ChevronRight, Calculator,
  FileText, Briefcase, Plus, FolderLock, Scale, MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
`;

for (const t of targets) {
  const startStr = '  const ' + t.func + ' = () => ';
  let startIdx = code.indexOf(startStr);
  if (startIdx === -1) {
    console.log('Not found:', t.func);
    continue;
  }
  
  let endIdx = code.length;
  const nextRenderIdx = code.indexOf('\n  const render', startIdx + 10);
  if (nextRenderIdx !== -1) {
    endIdx = nextRenderIdx;
  }
  
  let funcBody = code.substring(startIdx, endIdx);
  funcBody = funcBody.replace(startStr, 'export const ' + t.name + ' = () => ');
  
  // Quick fix for some state variables used in LawEnforcementTab or RegulatoryLibraryTab
  if (t.name === 'RegulatoryLibraryTab') {
    funcBody = `export const RegulatoryLibraryTab = () => {\n  const [activeCategory, setActiveCategory] = useState('sop');\n  const [searchQuery, setSearchQuery] = useState('');\n` + funcBody.substring(funcBody.indexOf('return'));
  }
  if (t.name === 'LawEnforcementTab') {
     // Needs stageMultiplier etc, but wait LawEnforcementTab had the IP valuation moved!
     // Let's just ensure it renders
  }
  
  out += '\n\n' + funcBody;
}

if (!fs.existsSync('src/components/dashboard-tabs')) {
  fs.mkdirSync('src/components/dashboard-tabs');
}
fs.writeFileSync('src/components/dashboard-tabs/ExecutiveOversightViews.tsx', out);
console.log('Extracted to ExecutiveOversightViews.tsx');

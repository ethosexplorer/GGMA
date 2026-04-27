import os

def replace_in_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

old_code = """  const isRyan = userProfile?.email?.toLowerCase().includes('ceo.globalgreenhp');

  const allRoles = [
    { id: 'executive_founder', label: 'Quality Assurance Command', desc: 'Full System Architecture & Analytics', icon: Shield, color: 'indigo' },
    { id: 'executive_ceo', label: 'CEO Executive Dashboard', desc: 'Enterprise Operations & Strategy', icon: Briefcase, color: 'indigo' },
    { id: 'patient', label: 'Patient Portal', desc: 'Medical Cards & Care Wallet', icon: User, color: 'emerald' },
    { id: 'business', label: 'Business Dashboard', desc: 'Dispensary & Cultivation', icon: Building2, color: 'blue' },
    { id: 'regulator_state', label: 'State Authority', desc: 'OMMA Regulatory Hub', icon: Lock, color: 'amber' },
    { id: 'regulator_federal', label: 'Federal Dashboard', desc: 'National Oversight', icon: Database, color: 'slate' },
    { id: 'law_enforcement', label: 'Law Enforcement', desc: 'Real-time Intelligence & Policing', icon: Shield, color: 'red' },
    { id: 'admin_external', label: 'External Admin', desc: 'Support & Processing', icon: Briefcase, color: 'teal' },
    { id: 'attorney', label: 'Attorney Dashboard', desc: 'Legal Counsel & Review', icon: Briefcase, color: 'indigo' },
    { id: 'health_lab', label: 'Health & Laboratory', desc: 'Testing Results & Input', icon: Database, color: 'rose' },
    { id: 'provider', label: 'Medical Provider', desc: 'Telehealth & Certifications', icon: Stethoscope, color: 'rose' },
  ];

  const roles = isRyan 
    ? allRoles.filter(r => !['executive_founder', 'regulator_state', 'regulator_federal', 'law_enforcement'].includes(r.id))
    : allRoles.filter(r => r.id !== 'executive_ceo');"""

new_code = """  const isRyan = userProfile?.email?.toLowerCase().includes('ceo.globalgreenhp');
  const isMonica = userProfile?.email?.toLowerCase().includes('monica') || userProfile?.email?.toLowerCase().includes('mgreen');

  const allRoles = [
    { id: 'executive_founder', label: 'Quality Assurance Command (Founder)', desc: 'Full System Architecture & Analytics', icon: Shield, color: 'indigo' },
    { id: 'executive_ceo', label: 'CEO Executive Dashboard (Ryan)', desc: 'Enterprise Operations & Strategy', icon: Briefcase, color: 'indigo' },
    { id: 'executive_monica', label: 'Compliance Director (Monica)', desc: 'Regulatory & Compliance Command', icon: Shield, color: 'indigo' },
    { id: 'patient', label: 'Patient Portal', desc: 'Medical Cards & Care Wallet', icon: User, color: 'emerald' },
    { id: 'business', label: 'Business Dashboard', desc: 'Dispensary & Cultivation', icon: Building2, color: 'blue' },
    { id: 'regulator_state', label: 'State Authority', desc: 'OMMA Regulatory Hub', icon: Lock, color: 'amber' },
    { id: 'regulator_federal', label: 'Federal Dashboard', desc: 'National Oversight', icon: Database, color: 'slate' },
    { id: 'law_enforcement', label: 'Law Enforcement', desc: 'Real-time Intelligence & Policing', icon: Shield, color: 'red' },
    { id: 'admin_external', label: 'External Admin', desc: 'Support & Processing', icon: Briefcase, color: 'teal' },
    { id: 'attorney', label: 'Attorney Dashboard', desc: 'Legal Counsel & Review', icon: Briefcase, color: 'indigo' },
    { id: 'health_lab', label: 'Health & Laboratory', desc: 'Testing Results & Input', icon: Database, color: 'rose' },
    { id: 'provider', label: 'Medical Provider', desc: 'Telehealth & Certifications', icon: Stethoscope, color: 'rose' },
  ];

  let roles = allRoles;
  if (isRyan) {
    roles = allRoles.filter(r => !['executive_founder', 'executive_monica', 'regulator_state', 'regulator_federal', 'law_enforcement'].includes(r.id));
  } else if (isMonica) {
    roles = allRoles.filter(r => !['executive_founder', 'executive_ceo', 'regulator_state', 'regulator_federal', 'law_enforcement'].includes(r.id));
  } else {
    // Founder sees all executive tiles
    roles = allRoles;
  }"""

replace_in_file('src/components/RoleSelectorScreen.tsx', [(old_code, new_code)])

print("Updated RoleSelectorScreen with Monica's tile and custom routing.")

const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetBriefSummary = `  const getBriefSummary = (v: string) => {
    switch (v) {
      case 'ggma': case 'ggma-patient': return 'You have selected the **Patient Intake** sector. This process helps you apply for a state medical marijuana card.';
      case 'business': return 'You have selected the **Business Intake** sector. This process helps commercial entities establish their regulatory profile and apply for state operating licenses.';
      case 'provider': return 'You have selected the **Provider** sector. This guides medical professionals through our network integration.';
      case 'legal': case 'attorney': return 'You have selected the **Legal & Attorney** sector. This sector handles regulatory compliance, cease & desists, and general counsel matching.';
      case 'government': case 'political_executive': return 'You have selected the **Government & Agency** sector. This provides policy data and economic analysis for state officials.';
      case 'advocate': case 'advocacy_research': return 'You have selected the **Advocate** sector. This provides resources for social equity programs and community polling.';
      default: return 'You have selected an administrative sector of the Global Green Hybrid Platform.';
    }
  };`;

const newBriefSummary = `  const getBriefSummary = (v: string) => {
    switch (v) {
      case 'ggma-patient':
      case 'patient':
      case 'ggma':
        return 'You have selected the **Patient Intake** sector. This process helps individuals register for their state-approved medical cannabis cards, verify eligibility, and book telehealth appointments seamlessly.';
      case 'sinc':
      case 'business':
        return 'You have selected the **Business Intake** sector. This process helps commercial entities establish their regulatory profile, apply for state-approved commercial licenses, and access compliance tools.';
      case 'provider':
        return 'You have selected the **Provider Intake** sector. This path is for physicians and clinicians looking to join our verified telehealth network and register with the state board.';
      case 'rip':
      case 'law-enforcement':
        return 'You have selected the **Regulatory/Law Enforcement** portal. This is a restricted gateway for state inspectors, regulators, and enforcement agencies to verify compliance and run reports.';
      case 'legal':
      case 'attorney':
        return 'You have selected the **Legal Representation** sector. This connects you with attorneys for compliance defense, corporate counsel, or patient advocacy matters.';
      case 'government':
      case 'political_executive':
        return 'You have selected the **Government Office** sector. This portal provides municipalities and elected officials with economic impact data and regulatory policy tools.';
      case 'advocate':
      case 'advocacy_research':
        return 'You have selected the **Advocacy & Non-Profit** sector. This portal connects social equity applicants and researchers with community polling and resources.';
      default:
        return 'You have selected a specialized intake sector. Let\\'s proceed to set up your profile.';
    }
  };`;

if (content.includes(targetBriefSummary)) {
  content = content.replace(targetBriefSummary, newBriefSummary);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Successfully updated getBriefSummary!');
} else {
  console.log('Could not find targetBriefSummary');
}

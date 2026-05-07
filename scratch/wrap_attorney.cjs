const fs = require('fs');

let content = fs.readFileSync('src/pages/AttorneyDashboard.tsx', 'utf8');

if (!content.includes('ShadowOverlay')) {
  content = content.replace("import { Search,", "import { ShadowOverlay } from '../components/shared/ShadowOverlay';\nimport { SubscriptionPortal } from '../components/SubscriptionPortal';\nimport { Search,");
}

if (!content.includes("id: 'membership'")) {
  content = content.replace("{ id: 'billing', label: 'Billing & Compassion Balance', icon: CreditCard },", "{ id: 'billing', label: 'Billing & Compassion Balance', icon: CreditCard },\n  { id: 'membership', label: 'Membership', icon: Sparkles },");
  content = content.replace("import { Search, Briefcase, BookOpen, BarChart2, CreditCard, LayoutDashboard,", "import { Sparkles, Search, Briefcase, BookOpen, BarChart2, CreditCard, LayoutDashboard,");
}

// Ensure Sparkles is imported
if (!content.includes("Sparkles")) {
  content = content.replace("import { Search,", "import { Sparkles, Search,");
}

const startMarker = "<div className=\"flex-1 overflow-y-auto p-6\">";
const endMarker = "</div>\n      </div>\n    </div>\n  );\n};";

const parts = content.split(startMarker);
if (parts.length === 2) {
  const innerParts = parts[1].split(endMarker);
  if (innerParts.length === 2) {
    const wrappedContent = `
    <div className="flex-1 overflow-y-auto p-6 relative">
      {!isSubscribed && activeTab !== 'applications' && activeTab !== 'membership' && (
         <ShadowOverlay 
            title="Premium Attorney Feature" 
            description="Unlock full legal directory and AI compliance features by starting your 30-Day Free Trial."
            moduleName="Legal Suite"
            onUpgrade={() => setActiveTab('membership')}
         />
      )}
      <div className={cn("max-w-7xl mx-auto space-y-6 transition-all duration-300", !isSubscribed && activeTab !== 'applications' && activeTab !== 'membership' && "blur-md pointer-events-none")}>
        ${innerParts[0].replace('<div className="max-w-7xl mx-auto space-y-6">', '')}
        {activeTab === 'membership' && (
          <SubscriptionPortal userRole="attorney" initialPlanId="legal_pro" />
        )}
      </div>
    </div>
    `;
    fs.writeFileSync('src/pages/AttorneyDashboard.tsx', parts[0] + wrappedContent + endMarker);
    console.log('AttorneyDashboard updated!');
  }
}

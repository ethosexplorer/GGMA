const fs = require('fs');

let content = fs.readFileSync('src/pages/ProviderDashboard.tsx', 'utf8');

const startMarker = "<div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">";
const endMarker = "</div>\n        </div>\n      )}";

const parts = content.split(startMarker);
if (parts.length === 2) {
  const innerParts = parts[1].split(endMarker);
  if (innerParts.length === 2) {
    const wrappedContent = `
    <div className="relative min-h-[600px] flex-1 flex flex-col">
      {!isSubscribed && activeTab !== 'applications' && activeTab !== 'subscription' && (
         <ShadowOverlay 
            title="Premium Provider Feature" 
            description="Unlock telehealth integration, billing, and scheduling by starting your 30-Day Free Trial."
            moduleName="Provider Suite"
            onUpgrade={() => setActiveTab('subscription')}
         />
      )}
      <div className={cn("transition-all duration-300", !isSubscribed && activeTab !== 'applications' && activeTab !== 'subscription' && "blur-md pointer-events-none")}>
        ${startMarker}${innerParts[0]}${endMarker}
      </div>
    </div>
    `;
    fs.writeFileSync('src/pages/ProviderDashboard.tsx', parts[0] + wrappedContent + innerParts[1]);
    console.log('ProviderDashboard wrapped!');
  }
}

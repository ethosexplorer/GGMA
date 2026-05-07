const fs = require('fs');

const filePaths = [
  'src/pages/BusinessDashboard.tsx',
  'src/pages/ProviderDashboard.tsx',
  'src/pages/AttorneyDashboard.tsx',
  'src/pages/AdvocacyResearchDashboard.tsx',
  'src/pages/EnforcementDashboard.tsx',
  'src/pages/StateAuthorityDashboard.tsx',
  'src/pages/RegulatorDashboard.tsx'
];

filePaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the start of the rendering logic
  // Most dashboards have a flex-1 container that holds the activeTab logic
  // Or we can just look for the first {activeTab === ...
  const matches = content.match(/\{activeTab === '[\w]+' && \(/);
  
  if (matches && !content.includes('ShadowOverlay \n            title')) {
    const firstTabStart = matches[0];
    const startIndex = content.indexOf(firstTabStart);
    
    // Find the end of the component
    const endMarker = "</div>\n)};";
    const lastEndIndex = content.lastIndexOf(endMarker);
    
    if (startIndex !== -1 && lastEndIndex !== -1) {
      const before = content.substring(0, startIndex);
      const inner = content.substring(startIndex, lastEndIndex);
      const after = content.substring(lastEndIndex);
      
      const wrappedContent = `
      <div className="relative min-h-[600px] flex-1 flex flex-col">
        {!isSubscribed && activeTab !== 'applications' && activeTab !== 'subscription' && (
           <ShadowOverlay 
              title="Premium Feature" 
              description="Unlock this operational feature by starting your 30-Day Free Trial."
              moduleName="Live Access"
              onUpgrade={() => {
                if (typeof setActiveTab === 'function') setActiveTab('subscription');
                else if (typeof navigateTab === 'function') navigateTab('subscription');
              }}
           />
        )}
        <div className={cn("flex-1 transition-all duration-300", !isSubscribed && activeTab !== 'applications' && activeTab !== 'subscription' && "blur-md pointer-events-none")}>
          ${inner}
        </div>
      </div>
      `;
      
      fs.writeFileSync(filePath, before + wrappedContent + after);
      console.log(`Wrapped ${filePath}`);
    }
  }
});

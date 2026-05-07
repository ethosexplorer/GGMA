const fs = require('fs');

const filePaths = [
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

  const matches = content.match(/\{activeTab === '[\w]+' && \(/);
  
  if (matches && !content.includes('moduleName="Live Access"')) {
    const firstTabStart = matches[0];
    const startIndex = content.indexOf(firstTabStart);
    
    // Find the end of the component by finding the last "  );\n};" or ")};"
    let lastEndIndex = content.lastIndexOf("  );\n};");
    if (lastEndIndex === -1) {
      lastEndIndex = content.lastIndexOf(")};");
    }
    
    // Some might have a wrapper div, so we just want to insert before the last </div>
    // Let's find the last </div> before the last );};
    const divEndIndex = content.lastIndexOf("</div>", lastEndIndex);
    
    if (startIndex !== -1 && divEndIndex !== -1) {
      const before = content.substring(0, startIndex);
      const inner = content.substring(startIndex, divEndIndex);
      const after = content.substring(divEndIndex);
      
      const wrappedContent = `
      <div className="relative min-h-[600px] flex-1 flex flex-col">
        {!isSubscribed && activeTab !== 'applications' && activeTab !== 'subscription' && (
           <ShadowOverlay 
              title="Premium Feature" 
              description="Unlock this operational feature by starting your 30-Day Free Trial."
              moduleName="Live Access"
              onUpgrade={() => {
                if (typeof setActiveTab === 'function') setActiveTab('subscription');
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
    } else {
      console.log(`Could not wrap ${filePath} - End marker not found`);
    }
  }
});

const fs = require('fs');

function wrapDashboard(filePath, roleType, moduleName) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already wrapped
  if (content.includes('moduleName="' + moduleName + '"')) return;

  const startMarker = '<div className="flex-1 overflow-y-auto';
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return;

  // Find the exact line
  const startTagEnd = content.indexOf('>', startIdx) + 1;
  const before = content.substring(0, startTagEnd);
  
  // Find the end marker
  const endMarker = "</div>\n      </div>\n    </div>\n  );\n};";
  let endIdx = content.lastIndexOf(endMarker);
  
  if (endIdx === -1) {
    const backupEnd = "</div>\n    </div>\n  );\n};";
    endIdx = content.lastIndexOf(backupEnd);
  }

  if (endIdx === -1) return;

  const inner = content.substring(startTagEnd, endIdx);
  const after = content.substring(endIdx);

  const wrapped = `
        <div className="relative h-full flex flex-col">
          {!isSubscribed && activeTab !== 'applications' && activeTab !== 'membership' && (
             <ShadowOverlay 
                title="Premium Feature" 
                description="Unlock this operational feature by starting your 30-Day Free Trial."
                moduleName="${moduleName}"
                onUpgrade={() => {
                  if (typeof setActiveTab === 'function') setActiveTab('membership');
                }}
             />
          )}
          <div className={cn("transition-all duration-300 h-full", !isSubscribed && activeTab !== 'applications' && activeTab !== 'membership' && "blur-md pointer-events-none")}>
            ${inner}
          </div>
        </div>
`;
  
  fs.writeFileSync(filePath, before + wrapped + after);
  console.log('Wrapped ' + filePath);
}

wrapDashboard('src/pages/AttorneyDashboard.tsx', 'attorney', 'Legal Suite');
wrapDashboard('src/pages/ProviderDashboard.tsx', 'provider', 'Provider Suite');
wrapDashboard('src/pages/EnforcementDashboard.tsx', 'enforcement', 'Enforcement Suite');
wrapDashboard('src/pages/RegulatorDashboard.tsx', 'regulator', 'Regulator Suite');
wrapDashboard('src/pages/StateAuthorityDashboard.tsx', 'state', 'State Suite');

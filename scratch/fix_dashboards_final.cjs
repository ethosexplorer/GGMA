const fs = require('fs');

let attr = fs.readFileSync('src/pages/AttorneyDashboard.tsx', 'utf8');
// Remove everything after line 440
const lines = attr.split('\n');
const newAttr = lines.slice(0, 440).join('\n') + `
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple SparklesIcon Component for Sylara
const SparklesIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);
`;
fs.writeFileSync('src/pages/AttorneyDashboard.tsx', newAttr);

let prov = fs.readFileSync('src/pages/ProviderDashboard.tsx', 'utf8');
// For Provider, it was already balanced at 431.
// Let's just make sure it's clean.
const pLines = prov.split('\n');
const newProv = pLines.slice(0, 429).join('\n') + `
    </div>
  );
};
`;
fs.writeFileSync('src/pages/ProviderDashboard.tsx', newProv);

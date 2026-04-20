const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace the handleSearch function inside SupportPage
const handleSearchOld = `  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setViewedArticle(null);
    try {
      const res = await fetch(\`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Cannabis+\${encodeURIComponent(searchQuery)}&utf8=&format=json&origin=*\`);
      const data = await res.json();
      setSearchResults(data.query?.search || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };`;

const handleSearchNew = `  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setViewedArticle(null);
    try {
      const lowerQuery = searchQuery.toLowerCase();
      const results: {title: string, snippet: string, pageid: number}[] = [];
      let i = 1;
      for (const [state, info] of Object.entries(STATE_RESOURCES)) {
         if (state.toLowerCase().includes(lowerQuery) || (info.abbreviation && info.abbreviation.toLowerCase() === lowerQuery)) {
            results.push({
               title: \`\${state} Cannabis Regulations & Portals\`,
               snippet: \`<strong>Status:</strong> Adult-Use (\${info.adultUseStatus || 'N/A'}), Medical (\${info.medicalStatus || 'N/A'})<br/><strong>Regulator:</strong> \${info.regulator || 'N/A'}<br/><strong>Checklist:</strong> \${(info.checklistItems || []).join(', ')}\`,
               pageid: i++
            });
         }
      }
      
      // If no exact state matches, do a rough check
      if (results.length === 0) {
        for (const [state, info] of Object.entries(STATE_RESOURCES)) {
          if (JSON.stringify(info).toLowerCase().includes(lowerQuery)) {
            results.push({
               title: \`\${state} Cannabis Regulations\`,
               snippet: \`Matched keyword: \${searchQuery}\`,
               pageid: i++
            });
          }
        }
      }
      
      setSearchResults(results as any);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };`;

content = content.replace(handleSearchOld, handleSearchNew);

// 2. Replace handleViewArticle logic
const handleViewArticleOld = `  const handleViewArticle = async (pageid: number, title: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(\`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=\${pageid}&format=json&origin=*\`);
      const data = await res.json();
      const page = data.query.pages[pageid];
      setViewedArticle({ title: page.title, content: page.extract });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };`;

const handleViewArticleNew = `  const handleViewArticle = async (pageid: number, title: string) => {
    // Lookup state info
    const stateMatch = title.split(' ')[0];
    if (STATE_RESOURCES[stateMatch]) {
        const info = STATE_RESOURCES[stateMatch];
        setViewedArticle({ 
            title: title, 
            content: \`Program: \${info.program}\\nAdult Use: \${info.adultUseStatus || 'N/A'}\\nMedical Status: \${info.medicalStatus || 'N/A'}\\nRegulator: \${info.regulator || 'N/A'}\\n\\nPatient Portal: \${info.patientPortal}\\nBusiness Portal: \${info.businessPortal}\\nResources: \${info.resources}\\n\\nChecklist Items:\\n- \${(info.checklistItems || []).join('\\n- ')}\` 
        });
    } else {
        setViewedArticle({ title, content: "No detailed information found." });
    }
  };`;

content = content.replace(handleViewArticleOld, handleViewArticleNew);

// 3. Replace STATE_CANNABIS_RESOURCES in SupportPage with STATE_RESOURCES references
// Just remove the dictionary and change references in handleSendMessage
const stateCannabisRegex = /const STATE_CANNABIS_RESOURCES: Record<string, any> = \{[\s\S]*?\n\};\n/g;
content = content.replace(stateCannabisRegex, '');

content = content.replace(/STATE_CANNABIS_RESOURCES/g, 'STATE_RESOURCES');

// 4. Update the wiki logic in handleSendMessage
content = content.replace(
    /const res = await fetch\(\`https:\/\/en\.wikipedia\.org\/w\/api\.php\?action=query&list=search&srsearch=Cannabis\+\$\{encodeURIComponent\(userMessage\)\}&utf8=&format=json&origin=\*\`\);\n\s+const data = await res\.json\(\);\n\s+const docs = data\.query\?\.search;/g,
    ''
);
content = content.replace(
    /\} else if \(docs && docs\.length > 0\) \{[\s\S]*?\} else if \(lowerQuery\.includes\('application'\)\) \{/g,
    `} else if (lowerQuery.includes('application')) {`
);

content = content.replace(
    /I will search the web for general inquiries/g,
    `I will search my database for general inquiries`
);

// 5. Update UI colors
// Form Background
content = content.replace(
    /bg-\[#A3B18A\] rounded-2xl p-8 sticky top-24 text-white/g,
    `bg-[#0D6EFD] rounded-2xl p-8 sticky top-24 text-white shadow-lg`
);

// Submit Button
content = content.replace(
    /bg-white text-\[#8A9A73\] font-bold rounded-lg hover:bg-white\/90/g,
    `bg-white text-[#0D6EFD] font-bold rounded-lg hover:bg-white/90`
);

// Sylara Widget
content = content.replace(
    /bg-\[#1a4731\] p-4 text-white flex items-center gap-3/g,
    `bg-[#0D6EFD] p-4 text-white flex items-center gap-3`
);
content = content.replace(
    /alt="L\.A\.R\.R\.Y"/g,
    `alt="Sylara"`
);
content = content.replace(
    /L\.A\.R\.R\.Y AI Assistant/g,
    `Sylara Legal AI`
);
content = content.replace(
    /Powered by Web Search/g,
    `Powered by Sylara OS`
);
content = content.replace(
    /<img src="\/larry-logo\.png" alt="Sylara"/g,
    `<img src="/larry-logo.png" alt="Sylara"`
);
content = content.replace(
    /className="p-2 bg-\[#1a4731\] text-white rounded-lg hover:bg-\[#153a28\] disabled:opacity-50"/g,
    `className="p-2 bg-[#0D6EFD] text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"`
);

// Add Aggregator Nav
content = content.replace(
    /<button className="px-6 py-2 border border-slate-200 bg-white text-slate-800 font-bold text-sm rounded-lg hover:bg-slate-50 shadow-sm transition-all whitespace-nowrap">\s*Access Aggregator\s*<\/button>/g,
    `<button onClick={() => onNavigate('landing')} className="px-6 py-2 border border-slate-200 bg-white text-slate-800 font-bold text-sm rounded-lg hover:bg-slate-50 shadow-sm transition-all whitespace-nowrap">\n                    Access Aggregator\n                  </button>`
);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated.');

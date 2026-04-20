const fs = require('fs');

function fixJSX(filename) {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Remove the current return end
    const returnIndex = content.lastIndexOf('return (');
    if (returnIndex === -1) return;
    
    const beforeReturn = content.substring(0, returnIndex);
    let afterReturn = content.substring(returnIndex);
    
    // Remove everything from the last ');' onwards
    const lastSemi = afterReturn.lastIndexOf(');');
    if (lastSemi === -1) return;
    
    let jsxPart = afterReturn.substring(0, lastSemi);
    const afterJsx = afterReturn.substring(lastSemi);
    
    // Count open/close in jsxPart
    let balance = 0;
    const tokens = jsxPart.match(/<div|<\/div>|<header|<\/header>|<button|<\/button>|<AnimatePresence|<\/AnimatePresence>|<motion\.div|<\/motion\.div>|<table|<\/table>|<thead|<\/thead>|<tr|<\/tr>|<th|<\/th>|<tbody|<\/tbody>|<td|<\/td>|<img|<svg|<\/svg>|<path|<StatCard|<PlusCircle|<Search|<Bell|<Briefcase|<Lock|<Unlock|<CheckCircle2|<SparklesIcon|<Scale|<FileText|<ChevronRight|<UserCheck|<AlertTriangle|<CannabisCertWizard|<X|<Video|<MapPin|<FlaskConical|<Share2|<StatCard/g) || [];
    
    // This is too complex for a regex.
    // Let's just use a simpler approach: count <div and </div
    const openDivs = (jsxPart.match(/<div/g) || []).length;
    const closeDivs = (jsxPart.match(/<\/div>/g) || []).length;
    
    let diff = openDivs - closeDivs;
    console.log(`${filename}: Open: ${openDivs}, Close: ${closeDivs}, Diff: ${diff}`);
    
    if (diff > 0) {
        // Append missing divs before );
        jsxPart = jsxPart.trimEnd();
        for (let i = 0; i < diff; i++) {
            jsxPart += '\n    </div>';
        }
    } else if (diff < 0) {
        // Remove extra divs
        for (let i = 0; i < Math.abs(diff); i++) {
            const lastClose = jsxPart.lastIndexOf('</div>');
            if (lastClose !== -1) {
                jsxPart = jsxPart.substring(0, lastClose) + jsxPart.substring(lastClose + 6);
            }
        }
    }
    
    fs.writeFileSync(filename, beforeReturn + jsxPart + '\n  ' + afterJsx);
}

fixJSX('src/pages/AttorneyDashboard.tsx');
fixJSX('src/pages/ProviderDashboard.tsx');

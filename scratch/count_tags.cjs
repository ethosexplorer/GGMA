const fs = require('fs');

function countTags(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    const openDivs = (content.match(/<div/g) || []).length;
    const closeDivs = (content.match(/<\/div>/g) || []).length;
    console.log(`${filename}: Open Divs: ${openDivs}, Close Divs: ${closeDivs}`);
    
    // Also check for { } balancing if possible
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    console.log(`${filename}: Open Braces: ${openBraces}, Close Braces: ${closeBraces}`);
}

countTags('src/pages/AttorneyDashboard.tsx');
countTags('src/pages/ProviderDashboard.tsx');
countTags('src/App.tsx');

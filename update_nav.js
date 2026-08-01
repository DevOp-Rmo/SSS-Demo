const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex to match Head Mistress's Message menu item with different spacings/href patterns
    const regex = /href\s*=\s*["'](?:#|index\.html|index\.html#management)?["']\s*>Head\s+Mistress(?:'|&#39;)?s\s+Message<\/a>/gi;
    
    if (regex.test(content)) {
        content = content.replace(regex, 'href="headmistress-message.html">Head Mistress\'s Message</a>');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated navigation in: ${file}`);
    }
});

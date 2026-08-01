const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // 1. Update Head Mistress's Message menu item
    const regexHM = /href\s*=\s*["'](?:#|index\.html|index\.html#management)?["']\s*>Head\s+Mistress(?:'|&#39;)?s\s+Message<\/a>/gi;
    if (regexHM.test(content)) {
        content = content.replace(regexHM, 'href="headmistress-message.html">Head Mistress\'s Message</a>');
        updated = true;
    }

    // 2. Update The Four Pillars menu item
    const regexFP = /href\s*=\s*["'](?:#|index\.html|index\.html#academics)?["']\s*>The\s+Four\s+Pillars<\/a>/gi;
    if (regexFP.test(content)) {
        content = content.replace(regexFP, 'href="four-pillars.html">The Four Pillars</a>');
        updated = true;
    }

    // 3. Update Activities & Events dropdown block
    const regexAct = /(<li class="dropdown[^"]*">\s*<a href=["']#["']>ACTIVITIES\s+(?:&|&amp;|&#38;)\s+EVENTS\s+<i class="ph ph-caret-down"><\/i><\/a>\s*<ul class="dropdown-menu">)([\s\S]*?)(<\/ul>\s*<\/li>)/gi;
    
    if (regexAct.test(content)) {
        const isSSR = file === 'social-responsibility.html';
        const isOut = file === 'outreach-excursion.html';
        const isAF = file === 'annual-function.html';
        const isFD = file === 'foundation-day.html';
        
        let parentClass = 'dropdown';
        if (isSSR || isOut || isAF || isFD) {
            parentClass = 'dropdown active';
        }
        
        const replacementMenu = `
                        <li><a href="index.html">Intra School Activities</a></li>
                        <li><a href="index.html">Inter School Activities</a></li>
                        <li class="${isSSR ? 'active' : ''}"><a href="social-responsibility.html">School Social Responsibility</a></li>
                        <li class="${isOut ? 'active' : ''}"><a href="outreach-excursion.html">Outreach &amp; Excursion</a></li>
                        <li class="${isAF ? 'active' : ''}"><a href="annual-function.html">Annual Function</a></li>
                        <li class="${isFD ? 'active' : ''}"><a href="foundation-day.html">Foundation Day</a></li>
                    `;
        
        content = content.replace(regexAct, `<li class="${parentClass}">\n                    <a href="#">ACTIVITIES &amp; EVENTS <i class="ph ph-caret-down"></i></a>\n                    <ul class="dropdown-menu">${replacementMenu}</ul>\n                </li>`);
        updated = true;
    }

    // 4. Update Facilities dropdown block
    const regexFac = /(<li class="dropdown[^"]*">\s*<a href=["']#["']>FACILITIES\s+<i class="ph ph-caret-down"><\/i><\/a>\s*<ul class="dropdown-menu">)([\s\S]*?)(<\/ul>\s*<\/li>)/gi;
    
    if (regexFac.test(content)) {
        const isInfra = file === 'infrastructure.html' || file.startsWith('infra-');
        const isCareer = file === 'career-counselling.html';
        const isTrans = file === 'transport.html';
        
        let parentClass = 'dropdown';
        if (isInfra || isCareer || isTrans) {
            parentClass = 'dropdown active';
        }
        
        const replacementMenu = `
                        <li class="${isInfra ? 'active' : ''}"><a href="infrastructure.html">Infrastructure</a></li>
                        <li class="${isCareer ? 'active' : ''}"><a href="career-counselling.html">Career Counselling</a></li>
                        <li><a href="index.html">Workshops</a></li>
                        <li class="${isTrans ? 'active' : ''}"><a href="transport.html">Transport</a></li>
                    `;
        
        content = content.replace(regexFac, `<li class="${parentClass}">\n                    <a href="#">FACILITIES <i class="ph ph-caret-down"></i></a>\n                    <ul class="dropdown-menu">${replacementMenu}</ul>\n                </li>`);
        updated = true;
    }
    
    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated navigation in: ${file}`);
    }
});

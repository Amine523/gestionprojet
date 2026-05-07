const fs = require('fs');
const path = 'super-admin-societes.component.ts';
let content = fs.readFileSync(path, 'utf8');

// Fix 1: Close modal-header and fix indentation/spacing of the form
// We'll search for the specific broken header pattern
content = content.replace(
    /<\/button>\s+<form \[formGroup\]=\"societeForm\"/g,
    '</button>\n            </div>\n            <form [formGroup]="societeForm"'
);

// Fix 2: Remove the double closing div before toggle-field
// We'll search for two consecutive div closures followed by toggle-field
content = content.replace(
    /<\/div>\s+<\/div>\s+<div class=\"toggle-field\">/g,
    '</div>\n               <div class="toggle-field">'
);

// Fix 3: Fix encoding artifacts
content = content.replace(/DÃ‰PLOIEMENT/g, 'DÉPLOIEMENT');
content = content.replace(/ParamÃ¨tres/g, 'Paramètres');
content = content.replace(/TÃ©lÃ©phone/g, 'Téléphone');
content = content.replace(/Ã‰tat/g, 'État');
content = content.replace(/rÃ©seau/g, 'réseau');
content = content.replace(/immÃ©diatement/g, 'immédiatement');
content = content.replace(/SiÃ¨ge/g, 'Siège');
content = content.replace(/BÃ¢timent/g, 'Bâtiment');

fs.writeFileSync(path, content, 'utf8');
console.log('File fixed successfully');

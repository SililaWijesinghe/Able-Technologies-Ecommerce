const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// replace <span>Call Us</span> with <span>077 869 2075</span>
code = code.replace(/<span>Call Us<\/span>/g, '<span>077 869 2075</span>');
// replace <span>WhatsApp</span> with <span>077 869 2075</span>
code = code.replace(/<span>WhatsApp<\/span>/g, '<span>077 869 2075</span>');

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Replaced Header mobile text');

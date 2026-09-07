const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingControls.tsx', 'utf8');

code = code.replace(/right-6/g, 'left-6');
code = code.replace(/items-end/g, 'items-start');
code = code.replace(/justify-end/g, 'justify-start');
code = code.replace(/left-5/g, 'left-[65px]');

fs.writeFileSync('src/components/FloatingControls.tsx', code);
console.log('Patched floating controls position');

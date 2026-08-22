const fs = require('fs');
let text = fs.readFileSync('src/components/FloatingControls.tsx', 'utf8');
text = text.replace(/    <\/div>\n  \);\n\}/, '    </>\n  );\n}');
fs.writeFileSync('src/components/FloatingControls.tsx', text);

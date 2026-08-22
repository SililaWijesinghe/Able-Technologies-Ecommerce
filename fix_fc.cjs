const fs = require('fs');
let text = fs.readFileSync('src/components/FloatingControls.tsx', 'utf8');
text = text.replace(/    <\/div>\s*\}\s*;\s*\}\s*$/m, '');
text = text.replace(/  \);\n\}/, '  );\n}');
text = text.trim();
if (text.endsWith('</div>')) {
  text = text.slice(0, -6) + '</>\n  );\n}';
} else if (text.endsWith('}')) {
  text = text.replace(/<\/div>\s*\)\s*;\s*\}\s*$/, '</>\n  );\n}');
}
fs.writeFileSync('src/components/FloatingControls.tsx', text);

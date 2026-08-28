import fs from 'fs';
let content = fs.readFileSync('src/pages/Shop.tsx', 'utf8');

content = content.replace("    </div>\n  );\n                })}", "  );\n                })}");
fs.writeFileSync('src/pages/Shop.tsx', content);

const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/Categories.tsx', 'utf8');

content = content.replace(
  /\{' '\.repeat\(\(c\.level \|\| 0\) \* 4\)\}\{c\.name\}/g,
  `{'—'.repeat(c.level || 0) + ((c.level || 0) > 0 ? ' ' : '')}{c.name}`
);

fs.writeFileSync('src/pages/admin/Categories.tsx', content);

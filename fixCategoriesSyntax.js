const fs = require('fs');
let file = 'src/pages/admin/Categories.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\{categories\.map\(c => \(\n\s*\{categories\.filter\(c => c\.id !== editForm\.id\)\.map\(c => \(/g,
  "{categories.filter(c => c.id !== editForm.id).map(c => ("
);

fs.writeFileSync(file, content);

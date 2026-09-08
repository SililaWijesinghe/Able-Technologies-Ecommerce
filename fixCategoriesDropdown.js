const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/Categories.tsx', 'utf8');

// Add modal dropdown
content = content.replace(
  /\{categories\.map\(c => \(\n\s*<option key=\{c\.id\} value=\{c\.id\}>\{c\.name\}<\/option>\n\s*\)\)\}/g,
  `{hierarchicalCategories.map(c => (
                     <option key={c.id} value={c.id}>{'\u00A0'.repeat((c.level || 0) * 4)}{c.name}</option>
                   ))}`
);

// Edit modal dropdown
content = content.replace(
  /\{categories\.filter\(c => c\.id !== editForm\.id\)\.map\(c => \(\n\s*<option key=\{c\.id\} value=\{c\.id\}>\{c\.name\}<\/option>\n\s*\)\)\}/g,
  `{hierarchicalCategories.filter(c => c.id !== editForm.id).map(c => (
                     <option key={c.id} value={c.id}>{'\u00A0'.repeat((c.level || 0) * 4)}{c.name}</option>
                   ))}`
);

fs.writeFileSync('src/pages/admin/Categories.tsx', content);

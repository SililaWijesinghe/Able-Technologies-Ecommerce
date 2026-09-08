const fs = require('fs');
let file = 'src/pages/admin/Categories.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /icon_url: finalIconUrl/g,
  "icon_url: finalIconUrl,\n        parent_id: addForm.parent_id || null"
);

// We replaced both, let's fix the second one which was for editForm.
content = content.replace(
  /parent_id: addForm\.parent_id \|\| null\n      \}\]\)/g,
  "parent_id: addForm.parent_id || null\n      }])"
);

content = content.replace(
  /parent_id: addForm\.parent_id \|\| null\n      \}\)\.eq/g,
  "parent_id: editForm.parent_id || null\n      }).eq"
);

// We need to also set parent_id when opening the Edit modal
content = content.replace(
  /setEditForm\(\{ id: category\.id, name: category\.name, description: category\.description, slug: category\.slug, icon_url: category\.icon_url \}\);/g,
  "setEditForm({ id: category.id, name: category.name, description: category.description, slug: category.slug, icon_url: category.icon_url, parent_id: category.parent_id || '' });"
);

fs.writeFileSync(file, content);

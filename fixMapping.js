const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\{viewProduct\.brand \|\| 'Unbranded'\}/g, "{viewProduct.brands?.name || 'Unbranded'}");
  content = content.replace(/\{viewProduct\.category \|\| 'Uncategorized'\}/g, "{viewProduct.categories?.name || 'Uncategorized'}");
  fs.writeFileSync(file, content);
}

fix('src/pages/admin/Products.tsx');

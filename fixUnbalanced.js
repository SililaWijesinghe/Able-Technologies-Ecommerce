const fs = require('fs');
function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/          \)\}\n        <\/div>\n/g, '          )}\n');
  fs.writeFileSync(file, content);
}
fix('src/pages/admin/AddProduct.tsx');
fix('src/pages/admin/EditProduct.tsx');

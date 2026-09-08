const fs = require('fs');

function replaceFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace AddProduct and EditProduct
  content = content.replace(
    /\{'\\u00A0'\.repeat\(\(c\.level \|\| 0\) \* 4\)\}\{c\.name\}/g,
    `{'—'.repeat(c.level || 0) + ((c.level || 0) > 0 ? ' ' : '')}{c.name}`
  );

  fs.writeFileSync(file, content);
}

replaceFile('src/pages/admin/Categories.tsx');
replaceFile('src/pages/admin/AddProduct.tsx');
replaceFile('src/pages/admin/EditProduct.tsx');

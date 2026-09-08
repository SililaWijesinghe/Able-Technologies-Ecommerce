const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\.select\('\*, categories\(name\), brands\(name\)'\)/g, ".select('*, categories(name), brands(name), product_images(*), product_variants(*)')");
  fs.writeFileSync(file, content);
}

fix('src/pages/admin/Products.tsx');

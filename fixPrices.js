const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Rs\. \{viewProduct\.price\?\.toLocaleString\(\) \|\| '0'\}/g, 'Rs. {Number(viewProduct.price || 0).toLocaleString()}');
  content = content.replace(/Rs\. \{viewProduct\.compare_at_price\?\.toLocaleString\(\) \|\| '-'\}/g, 'Rs. {viewProduct.compare_at_price ? Number(viewProduct.compare_at_price).toLocaleString() : \'-\'}');
  content = content.replace(/Rs\. \{viewProduct\.cost_price\?\.toLocaleString\(\) \|\| '-'\}/g, 'Rs. {viewProduct.cost_price ? Number(viewProduct.cost_price).toLocaleString() : \'-\'}');
  fs.writeFileSync(file, content);
}

fix('src/pages/admin/Products.tsx');

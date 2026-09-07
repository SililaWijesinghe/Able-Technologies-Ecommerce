const fs = require('fs');

let code = fs.readFileSync('src/components/admin/OrderDetailsModal.tsx', 'utf8');

// Patch 1: product name fallback
code = code.replace(
  /\{item\.products\?\.name \|\| 'Unknown Product'\}/,
  "{item.products?.name || item.product_name || 'Unknown Product'}"
);

// Patch 2: fix unit_price (there are two of them, replace all `.price)` with `.unit_price || item.price)` roughly)
code = code.replace(
  /Number\(item\.price\)/g,
  "Number(item.unit_price || item.price || 0)"
);

fs.writeFileSync('src/components/admin/OrderDetailsModal.tsx', code);
console.log("Patched OrderDetailsModal.tsx");

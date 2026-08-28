import fs from 'fs';

let content = fs.readFileSync('src/components/shop/ProductCard.tsx', 'utf8');

content = content.replace(
  "const displayPrice = product.price ? `Rs. ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : (product.newPrice || '');",
  "const displayPrice = (product.price || product.base_price) ? `Rs. ${parseFloat(product.price || product.base_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : (product.newPrice || '');"
);

content = content.replace(
  "const oldPrice = product.oldPrice || (product.price ? `Rs. ${(parseFloat(product.price) * 1.15).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '');",
  "const oldPrice = product.oldPrice || ((product.price || product.base_price) ? `Rs. ${(parseFloat(product.price || product.base_price) * 1.15).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '');"
);

content = content.replace(
  "price: parseFloat(product.price || 0),",
  "price: parseFloat(product.price || product.base_price || 0),"
);

fs.writeFileSync('src/components/shop/ProductCard.tsx', content);

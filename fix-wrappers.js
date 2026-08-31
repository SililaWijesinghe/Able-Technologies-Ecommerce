const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Containers (Stats cards, Wrappers)
  content = content.replace(/bg-white\/50 border border-gray-100 rounded-2xl shadow-sm/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  content = content.replace(/bg-white\/50 border border-gray-100 shadow-sm rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  content = content.replace(/bg-white border border-gray-100 rounded-2xl shadow-sm/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  content = content.replace(/bg-white border border-gray-100 shadow-sm rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  
  fs.writeFileSync(filePath, content);
}

const files = [
  'src/pages/admin/Products.tsx',
  'src/pages/admin/Categories.tsx',
  'src/pages/admin/Inventory.tsx',
  'src/pages/admin/Orders.tsx',
  'src/pages/admin/Customers.tsx',
  'src/pages/admin/AddProduct.tsx',
  'src/pages/admin/EditProduct.tsx',
];

files.forEach(applyStyles);

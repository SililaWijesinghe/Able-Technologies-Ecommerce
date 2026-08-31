const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix wrong text colors on buttons
  content = content.replace(/bg-slate-800 hover:bg-slate-900 text-slate-800/g, 'bg-slate-800 hover:bg-slate-900 text-white');
  content = content.replace(/bg-slate-800 hover:bg-slate-700 text-slate-800/g, 'bg-slate-800 hover:bg-slate-900 text-white');
  content = content.replace(/bg-red-600 hover:bg-red-700 text-slate-800/g, 'bg-red-600 hover:bg-red-700 text-white');
  content = content.replace(/bg-red-500 hover:bg-red-600 text-slate-800/g, 'bg-red-600 hover:bg-red-700 text-white');

  // Cancel buttons in Categories
  content = content.replace(/bg-slate-800\/50 hover:bg-slate-800/g, 'bg-slate-200 hover:bg-slate-300 text-slate-800');
  content = content.replace(/text-slate-400 hover:text-slate-800 bg-white\/5 hover:bg-white\/10/g, 'text-slate-600 hover:text-slate-800 bg-slate-200 hover:bg-slate-300');

  // Fix badges 
  content = content.replace(/bg-green-500\/20 text-green-400 border border-green-500\/30/g, 'bg-green-100 text-green-700 border border-green-200');
  content = content.replace(/bg-yellow-500\/20 text-yellow-400 border border-yellow-500\/30/g, 'bg-yellow-100 text-yellow-700 border border-yellow-200');
  content = content.replace(/bg-red-500\/20 text-red-400 border border-red-500\/30/g, 'bg-red-100 text-red-700 border border-red-200');

  fs.writeFileSync(filePath, content);
}

const files = [
  'src/pages/admin/Dashboard.tsx',
  'src/pages/admin/Products.tsx',
  'src/pages/admin/AddProduct.tsx',
  'src/pages/admin/EditProduct.tsx',
  'src/pages/admin/Categories.tsx',
  'src/pages/admin/Inventory.tsx',
  'src/pages/admin/Orders.tsx',
  'src/pages/admin/Customers.tsx',
  'src/pages/admin/AdminLogin.tsx',
];

files.forEach(applyStyles);

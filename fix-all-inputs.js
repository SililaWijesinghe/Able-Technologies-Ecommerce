const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Find all classNames that include `border-gray-200` and `focus:` and replace them with the glass input class
  content = content.replace(/className="[^"]*border border-gray-200[^"]*focus:outline-none[^"]*"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"');
  
  // The ones with pl-10 (for search icons)
  content = content.replace(/className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"/g, 'className="w-full pl-10 pr-4 p-3 bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl text-slate-800 outline-none transition-all shadow-inner"');
  
  // Select fields which might have specific classes
  content = content.replace(/className="w-full border border-gray-200 rounded-lg px-4 py-2\.5 focus:outline-none focus:border-blue-500 appearance-none bg-white"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner appearance-none"');
  
  // Fix background on modals
  content = content.replace(/bg-white rounded-2xl shadow-xl overflow-hidden/g, 'bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.05)] overflow-hidden');

  fs.writeFileSync(filePath, content);
}

const files = [
  'src/pages/admin/Products.tsx',
  'src/pages/admin/AddProduct.tsx',
  'src/pages/admin/EditProduct.tsx',
  'src/pages/admin/Categories.tsx',
  'src/pages/admin/Inventory.tsx',
  'src/pages/admin/Orders.tsx',
  'src/pages/admin/Customers.tsx',
];

files.forEach(applyStyles);

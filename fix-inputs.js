const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Input fields
  content = content.replace(/className="w-full border border-white\/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"');
  content = content.replace(/className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"');
  
  // Specific AddProduct replacements
  content = content.replace(/w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500/g, 'w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner');
  content = content.replace(/w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500/g, 'w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner');
  content = content.replace(/border-gray-200/g, 'border-white/60');
  content = content.replace(/bg-gray-50/g, 'bg-white/40'); // Table headers or backgrounds

  fs.writeFileSync(filePath, content);
}

const files = [
  'src/pages/admin/AddProduct.tsx',
  'src/pages/admin/EditProduct.tsx',
];

files.forEach(applyStyles);

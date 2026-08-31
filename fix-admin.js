const fs = require('fs');

function processFile(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');

  // Background and panels
  content = content.replace(/bg-white\/5 backdrop-blur-md border border-white\/10 shadow-xl rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-slate-900\/50 border border-white\/10 rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-white\/5 border border-white\/10 rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-white\/5 border border-white\/10 rounded-3xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-slate-900\/50 backdrop-blur-xl border border-white\/10 rounded-3xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-white\/5 backdrop-blur-md/g, 'bg-white/60 backdrop-blur-xl');
  content = content.replace(/bg-white\/5/g, 'bg-white/50'); // General
  
  // Table 
  content = content.replace(/<thead className="bg-white\/5">/g, '<thead className="bg-white/40 text-slate-700 font-semibold uppercase tracking-wider backdrop-blur-md border-b border-white/60">');
  content = content.replace(/text-white\/60 uppercase/g, 'text-slate-700 uppercase');
  content = content.replace(/border-b border-white\/10 hover:bg-white\/5/g, 'border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800');
  content = content.replace(/border-b border-white\/5 hover:bg-white\/[0-9]+/g, 'border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800');
  
  // Forms
  content = content.replace(/bg-white\/5 border border-white\/10 rounded-xl focus:border-cyan-400 text-white/g, 'bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner');
  content = content.replace(/bg-white\/5 border border-white\/10 rounded-xl focus:border-cyan-400/g, 'bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl outline-none transition-all shadow-inner');
  content = content.replace(/border border-white\/10 bg-white\/5/g, 'border border-white/60 bg-white/50 shadow-inner');
  
  // Buttons
  content = content.replace(/bg-cyan-500 hover:bg-cyan-400 text-slate-900/g, 'bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-cyan-600 hover:bg-cyan-500/g, 'bg-slate-800 hover:bg-slate-900');
  content = content.replace(/bg-cyan-500 hover:bg-cyan-600 text-white/g, 'bg-slate-800 hover:bg-slate-900 text-white shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-red-500 hover:bg-red-600 text-white/g, 'bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all');
  
  // Text Colors
  // Instead of replacing all text-white, let's target specific common ones
  content = content.replace(/text-white\/70/g, 'text-slate-600');
  content = content.replace(/text-white\/60/g, 'text-slate-500');
  content = content.replace(/text-white\/40/g, 'text-slate-400');
  content = content.replace(/text-gray-400/g, 'text-slate-500');
  content = content.replace(/text-gray-300/g, 'text-slate-600');
  content = content.replace(/text-gray-200/g, 'text-slate-700');
  content = content.replace(/text-gray-100/g, 'text-slate-800');
  
  // Heading texts
  content = content.replace(/<h1 className="text-2xl font-bold text-white">/g, '<h1 className="text-2xl font-bold text-slate-800">');
  content = content.replace(/<h1 className="text-3xl font-bold text-white mb-8">/g, '<h1 className="text-3xl font-bold text-slate-800 mb-8">');
  content = content.replace(/<h2 className="text-lg font-bold text-white/g, '<h2 className="text-lg font-bold text-slate-800');
  content = content.replace(/<h2 className="text-xl font-bold text-white/g, '<h2 className="text-xl font-bold text-slate-800');
  content = content.replace(/text-white font-medium/g, 'text-slate-800 font-medium');
  content = content.replace(/text-white font-bold/g, 'text-slate-800 font-bold');
  
  // Icons in circular background usually bg-white/10 text-cyan-400
  content = content.replace(/bg-white\/10 text-cyan-400/g, 'bg-blue-50 text-blue-600');
  content = content.replace(/bg-cyan-500\/20 text-cyan-400/g, 'bg-blue-50 text-blue-600');
  content = content.replace(/text-cyan-400/g, 'text-blue-600');
  
  // Inputs specific text
  content = content.replace(/text-white placeholder-gray-500/g, 'text-slate-800 placeholder-slate-400');
  content = content.replace(/text-white placeholder-gray-400/g, 'text-slate-800 placeholder-slate-400');

  // Fix borders
  content = content.replace(/border-white\/10/g, 'border-white/40');

  fs.writeFileSync(path, content);
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

files.forEach(processFile);
console.log("Done processing");

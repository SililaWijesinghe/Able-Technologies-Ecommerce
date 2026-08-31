const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Containers (Stats cards, Wrappers)
  content = content.replace(/bg-white p-6 rounded-2xl border border-gray-100 shadow-sm/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  content = content.replace(/bg-white border border-gray-100 shadow-sm rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-white p-6 rounded-2xl border border-gray-100 shadow-sm/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  
  // Update universal dashboard cards if they were missed
  content = content.replace(/className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4"/g, 'className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 flex items-center space-x-4"');
  
  // Table 
  content = content.replace(/<thead className="bg-gray-50 border-b border-gray-100">/g, '<thead className="bg-white/40 text-slate-700 font-semibold uppercase tracking-wider backdrop-blur-md border-b border-white/60">');
  content = content.replace(/<thead className="bg-gray-50">/g, '<thead className="bg-white/40 text-slate-700 font-semibold uppercase tracking-wider backdrop-blur-md border-b border-white/60">');
  content = content.replace(/className="border-b border-gray-50 hover:bg-gray-50\/50"/g, 'className="border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800"');
  content = content.replace(/className="border-b border-gray-100 hover:bg-gray-50\/50 transition-colors"/g, 'className="border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800"');
  content = content.replace(/border-b border-gray-100 hover:bg-gray-50\/50/g, 'border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800');
  content = content.replace(/<th([^>]*) className="([^"]*)"([^>]*)>/g, (match, p1, p2, p3) => {
    // If it already has specific classes we can just append or replace
    // This is tricky, let's just do a blanket replace of text-gray-500 in th
    return match.replace(/text-gray-500/g, 'text-slate-700').replace(/bg-gray-50/g, 'bg-white/40');
  });

  // Buttons
  content = content.replace(/bg-\[#0b1042\] text-white px-4 py-2.5 rounded-lg text-sm font-bold/g, 'bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-blue-600 text-white px-6 py-2\.5 rounded-lg text-sm font-bold/g, 'bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg/g, 'bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-red-600 text-white px-4 py-2 rounded-lg/g, 'bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all');
  content = content.replace(/bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg/g, 'bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all');

  // Inputs
  content = content.replace(/className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-\[#0b1042\]"/g, 'className="w-full pl-10 pr-4 p-3 bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl text-slate-800 outline-none transition-all shadow-inner"');
  content = content.replace(/className="w-full border border-gray-200 rounded-lg px-4 py-2\.5 focus:outline-none focus:border-blue-500"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"');
  content = content.replace(/className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-\[#0b1042\]"/g, 'className="bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"');
  content = content.replace(/w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-\[#0b1042\]/g, 'w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner');
  content = content.replace(/border-gray-200/g, 'border-white/60');
  content = content.replace(/bg-white border/g, 'bg-white/50 border'); // general input background

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

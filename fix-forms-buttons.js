const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Submit button
  content = content.replace(/className="bg-\[#da1c26\] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 hover:bg-red-700 transition-colors disabled:opacity-70"/g, 'className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all text-sm font-bold flex items-center space-x-2 disabled:opacity-70"');
  
  // Cancel button
  content = content.replace(/className="px-4 py-2 border border-white\/60 text-gray-700 font-bold rounded-lg text-sm hover:bg-white\/40 transition-colors"/g, 'className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl shadow-md transition-all font-bold text-sm"');

  // Any remaining generic inputs
  content = content.replace(/className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-\[#0b1042\]"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"');

  fs.writeFileSync(filePath, content);
}

applyStyles('src/pages/admin/AddProduct.tsx');
applyStyles('src/pages/admin/EditProduct.tsx');


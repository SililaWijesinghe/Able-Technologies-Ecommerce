const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Specific EditProduct replacements
  content = content.replace(/className="w-full border border-gray-200 rounded-lg px-4 py-2\.5 focus:outline-none focus:border-\[#0b1042\]"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"');
  content = content.replace(/className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-\[#0b1042\]"/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"');
  
  content = content.replace(/className="w-full pl-10 pr-4 py-2\.5 border border-gray-200 rounded-lg focus:outline-none focus:border-\[#0b1042\]"/g, 'className="w-full pl-10 pr-4 p-3 bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl text-slate-800 outline-none transition-all shadow-inner"');
  
  fs.writeFileSync(filePath, content);
}

applyStyles('src/pages/admin/EditProduct.tsx');

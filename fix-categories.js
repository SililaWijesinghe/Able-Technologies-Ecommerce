const fs = require('fs');

function applyStyles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/className="w-full p-3 bg-white\/50 border border-white\/20 rounded-xl text-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all/g, 'className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner');
  content = content.replace(/border-white\/20/g, 'border-white/60');
  content = content.replace(/bg-slate-900\/95/g, 'bg-slate-900/40'); // For modals backdrop maybe
  content = content.replace(/bg-\[#0b1042\] border border-white\/10/g, 'bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl'); // Modal body
  
  content = content.replace(/text-white/g, 'text-slate-800'); // Categories might have full text-white

  fs.writeFileSync(filePath, content);
}

applyStyles('src/pages/admin/Categories.tsx');

const fs = require('fs');

let path = 'src/pages/admin/Dashboard.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');

  // Universal Glass Container for metric cards
  content = content.replace(/bg-white\/5 border border-white\/10 rounded-2xl p-6/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6');
  // For other panels (Recent Orders, Low Stock)
  content = content.replace(/bg-slate-900\/50 border border-white\/10 rounded-2xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-white\/5 border border-white\/10 rounded-3xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');
  content = content.replace(/bg-slate-900\/50 backdrop-blur-xl border border-white\/10 rounded-3xl/g, 'bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl');

  // Table Headers
  content = content.replace(/bg-white\/5 text-left text-xs font-semibold text-white\/60 uppercase tracking-wider/g, 'bg-white/40 text-slate-700 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border-b border-white/60');
  
  // Table Rows
  content = content.replace(/border-b border-white\/5 hover:bg-white\/[0-9]+/g, 'border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800');
  content = content.replace(/border-b border-white\/10 hover:bg-white\/5/g, 'border-b border-white/40 hover:bg-white/50 transition-colors text-slate-800');

  // General Text
  content = content.replace(/text-white\/60/g, 'text-slate-500');
  content = content.replace(/text-white\/70/g, 'text-slate-600');
  content = content.replace(/text-white/g, 'text-slate-800');
  // Need to be careful with text-white on badges or icons maybe, but let's see.
  
  // Fix specific icon bg
  content = content.replace(/bg-white\/10 rounded-xl p-3 text-white/g, 'bg-blue-50 rounded-xl p-3 text-blue-600');

  fs.writeFileSync(path, content);
}

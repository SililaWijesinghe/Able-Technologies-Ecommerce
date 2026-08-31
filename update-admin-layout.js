const fs = require('fs');

// 1. AdminLayout
let layoutPath = 'src/components/layout/AdminLayout.tsx';
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  // Background
  content = content.replace(/bg-slate-950|bg-slate-900|bg-[#0f172a]/g, 'bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100');
  // Sidebar
  content = content.replace(/bg-slate-900\/50/g, 'bg-white/70 backdrop-blur-2xl');
  content = content.replace(/border-white\/10/g, 'border-white/80 shadow-sm');
  content = content.replace(/text-white\/70 hover:text-white hover:bg-white\/10/g, 'text-slate-600 hover:text-blue-950 hover:bg-white/50');
  content = content.replace(/bg-blue-600\/20 text-blue-400 border-blue-500\/50/g, 'bg-blue-50 text-blue-700 border-blue-200');
  // Header
  content = content.replace(/bg-slate-900\/60/g, 'bg-white/70');
  content = content.replace(/border-b border-white\/10/g, 'border-b border-white/80 shadow-sm');
  // Text colors
  content = content.replace(/text-white/g, 'text-slate-800');
  content = content.replace(/text-white\/70/g, 'text-slate-600');
  
  fs.writeFileSync(layoutPath, content);
}

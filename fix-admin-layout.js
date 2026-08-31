const fs = require('fs');

let filePath = 'src/components/layout/AdminLayout.tsx';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Background
  content = content.replace(/className="flex h-screen bg-gray-50 overflow-hidden font-sans"/g, 'className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 overflow-hidden font-sans"');
  
  // Sidebar
  content = content.replace(/className="w-64 bg-\[#0b1042\] text-slate-800 flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar"/g, 'className="w-64 bg-white/70 backdrop-blur-2xl border-r border-white/80 shadow-sm text-slate-800 flex flex-col h-full shrink-0 overflow-y-auto custom-scrollbar"');
  
  // Header
  content = content.replace(/className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0"/g, 'className="bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-sm h-16 flex items-center justify-between px-6 shrink-0"');

  // Sidebar Links
  content = content.replace(/text-gray-300 hover:text-slate-800 hover:bg-white\/5/g, 'text-slate-600 hover:text-blue-950 hover:bg-white/50');
  content = content.replace(/text-gray-400 hover:text-slate-800 hover:bg-white\/5/g, 'text-slate-600 hover:text-blue-950 hover:bg-white/50');
  content = content.replace(/bg-\[#da1c26\] text-slate-800/g, 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm');
  content = content.replace(/text-white/g, 'text-slate-800'); // Assuming text-white is used for some icons or headings in sidebar
  content = content.replace(/border-gray-800/g, 'border-slate-200'); // Divider

  fs.writeFileSync(filePath, content);
}

const fs = require('fs');

let path = 'src/components/TrustBar.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');

  // Wrapper
  content = content.replace(
    /className="bg-gray-50 rounded-xl py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-100"/,
    'className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[4px_4px_15px_rgba(15,23,42,0.05),-4px_-4px_15px_rgba(255,255,255,0.8)] mx-auto mt-12 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"'
  );

  // Titles
  content = content.replace(
    /className="font-bold text-sm text-gray-900"/g,
    'className="font-bold text-sm text-slate-800"'
  );

  // Descriptions
  content = content.replace(
    /className="text-xs text-gray-500"/g,
    'className="text-xs text-slate-600"'
  );

  // Icons
  content = content.replace(
    /className="text-\[#0b1042\]"/g,
    'className="text-blue-900"'
  );

  fs.writeFileSync(path, content);
}

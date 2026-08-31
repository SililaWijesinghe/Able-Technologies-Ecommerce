const fs = require('fs');

let path = 'src/components/CategoryCards.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');

  // Wrapper
  content = content.replace(
    /className="md:mt-\[25px\] bg-transparent md:bg-white md:rounded-2xl md:shadow-\[0_10px_40px_rgba\(0,0,0,0\.08\)\] md:p-4 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between gap-3 md:gap-4"/,
    'className="md:mt-[25px] grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between gap-4 md:gap-6 pt-4"'
  );

  // Card
  content = content.replace(
    /className="h-full bg-white md:bg-gray-50 rounded-xl p-4 md:p-6 flex flex-col items-center text-center shadow-sm md:shadow-none hover:shadow-md hover:bg-white transition-all cursor-pointer group border border-gray-100 md:border-transparent md:hover:border-gray-100"/g,
    'className="h-full flex flex-col items-center text-center cursor-pointer group bg-white/40 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-[8px_8px_20px_rgba(15,23,42,0.08),-8px_-8px_20px_rgba(255,255,255,1)] hover:shadow-[12px_12px_24px_rgba(15,23,42,0.12),-12px_-12px_24px_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-2"'
  );

  // Title
  content = content.replace(
    /className="font-bold text-\[#0b1042\] mb-2 md:mb-3 leading-tight text-xs md:text-sm"/g,
    'className="text-slate-800 font-bold mb-2 md:mb-3 leading-tight text-xs md:text-sm"'
  );

  // Explore Link
  content = content.replace(
    /className="metallic-red-text text-\[10px\] md:text-\[11px\] font-bold uppercase tracking-wider flex items-center group-hover:underline"/g,
    'className="text-red-600 group-hover:text-red-700 font-semibold text-[10px] md:text-[11px] uppercase tracking-wider flex items-center transition-colors"'
  );
  content = content.replace(
    /<ArrowRight size={10} color="url\(#metal-red\)"/g,
    '<ArrowRight size={10}'
  );

  // Image Drop shadow
  content = content.replace(
    /className="w-full h-full object-cover"/g,
    'className="w-full h-full object-cover drop-shadow-md"'
  );
  
  // Icon placeholder background
  content = content.replace(
    /className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 md:bg-gray-200 rounded-lg mb-3 md:mb-4 overflow-hidden relative flex items-center justify-center"/g,
    'className="w-20 h-20 md:w-24 md:h-24 rounded-lg mb-3 md:mb-4 relative flex items-center justify-center"'
  );
  
  content = content.replace(
    /className="absolute top-1\.5 right-1\.5 bg-red-100 p-1 md:p-1\.5 rounded-full border border-white"/g,
    'className="absolute top-1.5 right-1.5 bg-white p-1 md:p-1.5 rounded-full shadow-sm text-blue-900"'
  );
  
  // Replace fallback icon color
  content = content.replace(
    /<Icon size={12} color="url\(#metal-red\)" strokeWidth={2\.5} className="md:w-3\.5 md:h-3\.5" \/>/g,
    '<Icon size={12} strokeWidth={2.5} className="md:w-3.5 md:h-3.5" />'
  );

  fs.writeFileSync(path, content);
}

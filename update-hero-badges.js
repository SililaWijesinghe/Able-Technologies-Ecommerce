const fs = require('fs');

let path = 'src/pages/Home.tsx';
if (fs.existsSync(path)) {
  let content = fs.readFileSync(path, 'utf8');

  // Replace each feature item
  content = content.replace(
    /<div className="flex items-center space-x-3">/g,
    '<div className="flex items-center space-x-3 bg-blue-950/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.1),4px_4px_12px_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-1">'
  );

  // We need to fix the inner icon divs and text
  // from:
  // <div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800/50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm">
  // to just a container or remove the background of the icon since the whole card is glass
  content = content.replace(
    /<div className="w-8 h-8 md:w-10 md:h-10 rounded-md border border-blue-800\/50 flex items-center justify-center bg-blue-900\/30 backdrop-blur-sm">/g,
    '<div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">'
  );

  // Text colors
  content = content.replace(
    /className="text-blue-400 md:w-5 md:h-5"/g,
    'className="text-white md:w-5 md:h-5"'
  );
  
  content = content.replace(
    /className="text-white text-xs md:text-sm font-medium leading-tight max-w-\[100px\]"/g,
    'className="text-white/90 text-xs md:text-sm font-medium leading-tight"'
  );

  fs.writeFileSync(path, content);
}

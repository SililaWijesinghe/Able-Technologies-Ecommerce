const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className="absolute top-2 left-2 bg-blue-600 text-white text-\[10px\] font-bold px-2 py-1 rounded shadow"/g, 'className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-blue-600 text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow truncate max-w-[calc(100%-8px)]"');
  content = content.replace(/className="absolute top-2 left-2 bg-\[#0b1042\] text-white text-\[10px\] font-bold px-2 py-1 rounded shadow"/g, 'className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#0b1042] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow truncate max-w-[calc(100%-8px)]"');
  fs.writeFileSync(file, content);
}

fix('src/pages/admin/AddProduct.tsx');
fix('src/pages/admin/EditProduct.tsx');

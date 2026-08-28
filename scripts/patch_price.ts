import fs from 'fs';

let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

const priceBlock = `          {priceExpanded && (
            <div>
              <div className="flex justify-between text-xs text-[#0b1042] font-semibold mb-2">
                <span>Rs. {priceRange[0]}</span>
                <span>Rs. {priceRange[1] === 500000 ? '500,000+' : priceRange[1]}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3 mt-4">
                <input 
                  type="number" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#0b1042]" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500000])}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#0b1042]" 
                />
              </div>
            </div>
          )}`;

content = content.replace(
  /\{priceExpanded && \(\s*<div>\s*<div className="flex justify-between text-xs text-\[\#0b1042\] font-semibold mb-2">.*?<\/button>\s*<\/div>\s*\)\}/s,
  priceBlock
);

fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);

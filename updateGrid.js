const fs = require('fs');
let file = 'src/pages/Services.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the 2nd gallery grid
const replacement = `
            <motion.div 
              className="lg:w-7/12"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            >
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-3 relative rounded-2xl overflow-hidden group shadow-lg h-64 md:h-80">
                  <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80" alt="Precision Cutting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-6 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xl mb-1 uppercase tracking-wider">Precision Cutting</h4>
                    <p className="text-gray-300 text-sm font-medium">Clean. Accurate. Professional.</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-40 md:h-48">
                  <img src="https://images.unsplash.com/photo-1620619767323-b95a89183081?w=400&auto=format&fit=crop&q=80" alt="Leather Cutting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-3 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xs md:text-sm mb-1 uppercase tracking-wider">Leather Cutting</h4>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium">Custom Shapes & Patterns</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-40 md:h-48">
                  <img src="https://images.unsplash.com/photo-1590422749819-21dfd4af51d6?w=400&auto=format&fit=crop&q=80" alt="Name Engraving" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-3 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xs md:text-sm mb-1 uppercase tracking-wider">Name Engraving</h4>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium">Logos, Names & Markings</p>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-40 md:h-48">
                  <img src="https://images.unsplash.com/photo-1563914216960-9343ee0fb2dd?w=400&auto=format&fit=crop&q=80" alt="Metal Cutting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-3 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xs md:text-sm mb-1 uppercase tracking-wider">Metal Cutting</h4>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium">Mild Steel, Aluminum, Stainless Steel</p>
                  </div>
                </div>
              </div>
            </motion.div>
`;

content = content.replace(
  /<motion\.div\s+className="lg:w-7\/12"\s+initial="hidden" whileInView="visible" viewport=\{\{ once: true, margin: "-100px" \}\} variants=\{fadeIn\}\s*>\s*<div className="grid grid-cols-2 gap-4 h-full">[\s\S]*?<\/motion\.div>/g,
  replacement.trim()
);

fs.writeFileSync(file, content);

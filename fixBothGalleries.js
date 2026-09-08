const fs = require('fs');
let file = 'src/pages/Services.tsx';
let content = fs.readFileSync(file, 'utf8');

const repairGallery = `
            <motion.div 
              className="lg:w-7/12"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            >
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-3 relative rounded-2xl overflow-hidden group shadow-lg h-64 md:h-80">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" alt="Repair" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-6 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xl mb-1 uppercase tracking-wider">Repair</h4>
                    <p className="text-gray-300 text-sm font-medium">Restore Performance</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-40 md:h-48">
                  <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&auto=format&fit=crop&q=80" alt="Calibration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-3 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xs md:text-sm mb-1 uppercase tracking-wider">Calibration</h4>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium">Ensure Accuracy</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-40 md:h-48">
                  <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&auto=format&fit=crop&q=80" alt="Modifications" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-3 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xs md:text-sm mb-1 uppercase tracking-wider">Modifications</h4>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium">Built for Your Needs</p>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-40 md:h-48">
                  <img src="https://images.unsplash.com/photo-1537233816-1f6e07c824c9?w=400&auto=format&fit=crop&q=80" alt="Part Replacement" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-3 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xs md:text-sm mb-1 uppercase tracking-wider">Part Replacement</h4>
                    <p className="text-gray-300 text-[10px] md:text-xs font-medium">Keep You Running</p>
                  </div>
                </div>
              </div>
            </motion.div>
`;

// Find the first occurrence of the laser cutting gallery inside the 2nd section (Repair & Modifications)
// Since both are identical now, replacing the first one is correct.

const toReplaceRegex = /<motion\.div \n              className="lg:w-7\/12"\n              initial="hidden" whileInView="visible" viewport=\{\{ once: true, margin: "-100px" \}\} variants=\{fadeIn\}\n            >\n              <div className="grid grid-cols-3 gap-4 h-full">[\s\S]*?<\/motion\.div>/;

content = content.replace(toReplaceRegex, repairGallery.trim());

fs.writeFileSync(file, content);

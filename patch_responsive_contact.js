const fs = require('fs');

const filepath = 'src/components/contact/ContactFormSection.tsx';
let content = fs.readFileSync(filepath, 'utf8');

const regex = /<div className="flex-1 flex justify-between items-center">\s*<div>\s*<h4 className="font-semibold text-sm mb-1">Call Us<\/h4>\s*<p className="text-base font-bold">Main: 077 869 2075<\/p>\s*<p className="text-base font-bold">Trade: \(077\) 575 4020<\/p>\s*<p className="text-base font-bold">Finance: \+94 \(76\) 140 5518<\/p>\s*<\/div>\s*<div className="bg-green-500\/20 text-green-400 text-\[10px\] px-3 py-1\.5 rounded-md font-semibold text-center border border-green-500\/30">\s*Mon - Sat<br\/>8\.00 AM - 5\.30 PM\s*<\/div>\s*<\/div>/;

const replacement = `<div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Call Us</h4>
                      <p className="text-sm sm:text-base font-bold whitespace-nowrap">Main: 077 869 2075</p>
                      <p className="text-sm sm:text-base font-bold whitespace-nowrap">Trade: (077) 575 4020</p>
                      <p className="text-sm sm:text-base font-bold whitespace-nowrap">Finance: +94 (76) 140 5518</p>
                    </div>
                    <div className="bg-green-500/20 text-green-400 text-[10px] px-3 py-1.5 rounded-md font-semibold text-center border border-green-500/30 whitespace-nowrap">
                      Mon - Sat<br/>8.00 AM - 5.30 PM
                    </div>
                  </div>`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(filepath, content);
  console.log("Patched responsive contact block successfully.");
} else {
  console.log("Could not find contact block to replace. Pattern did not match.");
}


const fs = require('fs');
let file = 'src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Quick Links
content = content.replace(
  /\{\[\s*\{ name: 'Home', path: '\/' \},[\s\S]*?\{ name: 'Contact Us', path: '\/contact' \}\s*\]\.map/g,
  `{[
                  { name: 'Home', path: '/' },
                  { name: 'About Us', path: '/about' },
                  { name: 'Shop', path: '/shop' },
                  { name: 'Services', path: '/services' },
                  { name: 'Contact Us', path: '/contact' }
                ].map`
);

// We need to find Col 3 and update it to "Our Services"
content = content.replace(
  /\{?\/\* Col 3 - Customer Service \*\/\s*<div className="lg:col-span-3">\s*<h4 className="font-poppins text-white font-bold mb-6 text-\[15px\] tracking-wider uppercase flex items-center">\s*<span className="w-2 h-2 bg-red-600 rounded-sm mr-2 inline-block"><\/span> Customer Service\s*<\/h4>\s*<ul className="space-y-3">\s*\{\[\s*\{ name: 'My Account', path: '\/login' \},[\s\S]*?\]\.map/g,
  `{/* Col 3 - Our Services */}
            <div className="lg:col-span-3">
              <h4 className="font-poppins text-white font-bold mb-6 text-[15px] tracking-wider uppercase flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-sm mr-2 inline-block"></span> Our Services
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Repair & Modifications', path: '/services' },
                  { name: 'Laser Cutting & Engraving', path: '/services' },
                  { name: 'Machine Services', path: '/services' },
                  { name: 'Custom Solutions', path: '/services' },
                  { name: 'Technical Consultation', path: '/contact' }
                ].map`
);

fs.writeFileSync(file, content);

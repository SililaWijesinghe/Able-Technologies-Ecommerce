const fs = require('fs');
let file = 'src/components/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const navLinks:(.*)\[\s*\{ name: 'Home', path: '\/' \},\s*\{ name: 'About Us', dropdown: \[\s*\{ name: 'About Able Technologies', path: '\/about' \},\s*\{ name: 'Our Industrial Solutions', path: '\/industrial-solutions' \}\s*\] \},\s*\{ name: 'Shop', path: '\/shop', id: 'nav-shop' \},\s*\{ name: 'Contact Us', path: '\/contact' \}\s*\];/g,
  `const navLinks:$1[
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Shop', path: '/shop', id: 'nav-shop' },
    { name: 'Machines', path: '/shop?category=machine' },
    { name: 'Spare Parts & Gauges', path: '/shop?category=spare-parts' },
    { name: 'Glue', path: '/shop?category=glue' },
    { name: 'Services', path: '/services' },
    { name: 'Contact Us', path: '/contact' }
  ];`
);

fs.writeFileSync(file, content);

const fs = require('fs');
let file = 'src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\.map\(\(link, i\) => \(/g,
  `.map((link: {name: string; path: string; available?: boolean}, i) => (`
);

fs.writeFileSync(file, content);

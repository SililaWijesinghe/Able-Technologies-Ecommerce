import fs from 'fs';
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace(
  '<Link to="/shop" className="hover:text-gray-300 transition-colors">Shop</Link>',
  '<Link id="nav-shop" to="/shop" className="hover:text-gray-300 transition-colors">Shop</Link>'
);

content = content.replace(
  'onClick={() => setIsCartOpen(true)}',
  'id="nav-cart" onClick={() => setIsCartOpen(true)}'
);

fs.writeFileSync('src/components/Header.tsx', content);

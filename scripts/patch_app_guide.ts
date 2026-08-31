import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('NavigatedGuide')) {
  content = content.replace(
    "import Footer from './components/Footer';",
    "import Footer from './components/Footer';\nimport NavigatedGuide from './components/ui/NavigatedGuide';"
  );
  
  const guideSteps = `
      <NavigatedGuide 
        guideId="storefront_tour"
        steps={[
          { targetId: 'nav-shop', title: 'Welcome to the Store', description: 'Browse our full catalog of products here.', position: 'bottom' },
          { targetId: 'nav-cart', title: 'Your Cart', description: 'Items you add will appear here.', position: 'bottom' },
        ]}
      />
  `;
  
  content = content.replace(
    "<CartDrawer />",
    `<CartDrawer />\n${guideSteps}`
  );
  
  fs.writeFileSync('src/App.tsx', content);
}

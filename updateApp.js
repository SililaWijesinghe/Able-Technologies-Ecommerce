const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import Services from')) {
  content = content.replace(
    /import AboutUs from '\.\/pages\/AboutUs';/,
    "import AboutUs from './pages/AboutUs';\nimport Services from './pages/Services';"
  );
}

// Add Route
if (!content.includes('<Route path="/services" element={<Services />} />')) {
  content = content.replace(
    /<Route path="\/about" element=\{<AboutUs \/>\} \/>/,
    "<Route path=\"/about\" element={<AboutUs />} />\n              <Route path=\"/services\" element={<Services />} />"
  );
}

fs.writeFileSync(file, content);

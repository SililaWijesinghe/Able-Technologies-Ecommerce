const fs = require('fs');
let text = fs.readFileSync('src/components/Header.tsx', 'utf8');
text = text.replace('export default function App() {\n  return (\n    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">\n      {/* SVG Gradient Defs */}\n      <svg width="0" height="0" className="absolute">\n        <defs>\n          <linearGradient id="metal-red" x1="0%" y1="0%" x2="100%" y2="100%">\n            <stop offset="0%" stopColor="#ff4b4b" />\n            <stop offset="45%" stopColor="#d41414" />\n            <stop offset="100%" stopColor="#7a0000" />\n          </linearGradient>\n        </defs>\n      </svg>', 'export default function Header() {\n  return (\n    <>');
text = text.replace(/import CategoryCards.*\n/g, '');
text = text.replace(/import TrustBar.*\n/g, '');
text = text.replace(/import PromoGrid.*\n/g, '');
text = text.replace(/import BestSellers.*\n/g, '');
text = text.replace(/import WhyChooseUs.*\n/g, '');
text = text.replace(/import NewsletterCTA.*\n/g, '');
text = text.replace(/import Footer.*\n/g, '');
text = text.replace(/import heroBg.*\n/g, '');
text = text.replace(/import toolImg.*\n/g, '');
text = text.replace(/\.\/assets\//g, '../assets/');
if (!text.endsWith('</>\n  );\n}')) {
  text += '\n    </>\n  );\n}';
}
fs.writeFileSync('src/components/Header.tsx', text);

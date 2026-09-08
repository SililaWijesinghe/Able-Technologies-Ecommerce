const fs = require('fs');

let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

const replacement = `
const CategoryNode = ({ cat, isCategorySelected, toggleCategory }: { cat: any, isCategorySelected: (c: any) => boolean, toggleCategory: (c: any) => void }) => {
`;

content = content.replace(/const CategoryNode = \(\{\s*cat,\s*isCategorySelected,\s*toggleCategory\s*\}\) => \{/g, replacement.trim() + ' {');

fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);

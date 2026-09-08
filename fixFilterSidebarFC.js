const fs = require('fs');

let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

const replacement = `
const CategoryNode: React.FC<{ cat: any, isCategorySelected: (c: any) => boolean, toggleCategory: (c: any) => void }> = ({ cat, isCategorySelected, toggleCategory }) => {
`;

content = content.replace(/const CategoryNode = \(\{\s*cat,\s*isCategorySelected,\s*toggleCategory\s*\}\s*:\s*\{\s*cat:\s*any,\s*isCategorySelected:\s*\(c:\s*any\)\s*=>\s*boolean,\s*toggleCategory:\s*\(c:\s*any\)\s*=>\s*void\s*\}\)\s*=>\s*\{/g, replacement.trim() + ' {');

fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);

import fs from 'fs';
let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

// 1. Remove typeExpanded state
content = content.replace(
  /const \[typeExpanded, setTypeExpanded\] = useState\(true\);\n/g,
  ""
);

// 2. Fix Clear All button
content = content.replace(
  /onClick=\{.*?setFilters\(\{\}\).*?\}/,
  `onClick={() => {
            if (setSelectedCategories) setSelectedCategories([]);
            if (setSelectedBrands) setSelectedBrands([]);
            if (setPriceRange) setPriceRange([0, 500000]);
            if (setAvailability) setAvailability('all');
          }}`
);

// 3. Fallbacks for map
content = content.replace(
  /\{categories\.map\(cat => \(/g,
  "{(categories || []).map(cat => ("
);
content = content.replace(
  /\{brands\.map\(brand => \(/g,
  "{(brands || []).map(brand => ("
);

// 4. Remove Product Type section entirely
const productTypeRegex = /\{\/\* Product Type \*\/\}.*?<\/div>\s*<\/div>/s;
content = content.replace(productTypeRegex, "</div>");

fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);

import fs from 'fs';

let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

// Update imports
if (!content.includes('import { useMemo }')) {
  content = content.replace("import { useState } from 'react';", "import { useState, useMemo } from 'react';");
}

// Update props
content = content.replace(
  "const FilterSidebar: React.FC<{ filters: any, setFilters: any }> = ({ filters, setFilters }) => {",
  `const FilterSidebar: React.FC<{ 
  allProducts: any[],
  selectedCategories: string[],
  setSelectedCategories: (c: string[]) => void,
  selectedBrands: string[],
  setSelectedBrands: (b: string[]) => void,
  priceRange: [number, number],
  setPriceRange: (p: [number, number]) => void,
  availability: string,
  setAvailability: (a: string) => void
}> = ({ 
  allProducts,
  selectedCategories, setSelectedCategories,
  selectedBrands, setSelectedBrands,
  priceRange, setPriceRange,
  availability, setAvailability
}) => {`
);

// Dynamic unique extraction
const dynamicExtraction = `
  const categories = useMemo(() => {
    const cats: Record<string, number> = {};
    allProducts.forEach(p => {
      const cat = (p.category_id || p.category || 'uncategorized').toLowerCase();
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats).map(([id, count]) => ({ id, label: id, count }));
  }, [allProducts]);

  const brands = useMemo(() => {
    const brs: Record<string, number> = {};
    allProducts.forEach(p => {
      const brand = (p.brand_id || p.brand || 'local').toLowerCase();
      brs[brand] = (brs[brand] || 0) + 1;
    });
    return Object.entries(brs).map(([id, count]) => ({ id, label: id, count }));
  }, [allProducts]);

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const toggleBrand = (id: string) => {
    if (selectedBrands.includes(id)) {
      setSelectedBrands(selectedBrands.filter(b => b !== id));
    } else {
      setSelectedBrands([...selectedBrands, id]);
    }
  };
`;

content = content.replace(
  /const categories = \[.*?\];/s,
  dynamicExtraction
);
content = content.replace(
  /const brands = \[.*?\];/s,
  ""
);
content = content.replace(
  /const productTypes = \[.*?\];/s,
  ""
);

// Update category checkboxes
content = content.replace(
  /checked=\{filters\.category === cat\.id[^\}]*\}/g,
  `checked={selectedCategories.includes(cat.id)}`
);
content = content.replace(
  /onChange=\{.*?setFilters.*?category: cat\.id.*?\}/g,
  `onChange={() => toggleCategory(cat.id)}`
);
content = content.replace(
  /<span className="ml-3 text-sm text-gray-700 group-hover:text-\[\#0b1042\] transition-colors font-medium">\{cat.label\}<\/span>/g,
  `<span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium capitalize">{cat.label.replace('_', ' ')}</span>`
);

// Update brand checkboxes
content = content.replace(
  /checked=\{filters\.brand === brand\.id[^\}]*\}/g,
  `checked={selectedBrands.includes(brand.id)}`
);
content = content.replace(
  /onChange=\{.*?setFilters.*?brand: brand\.id.*?\}/g,
  `onChange={() => toggleBrand(brand.id)}`
);
content = content.replace(
  /<span className="ml-3 text-sm text-gray-700 group-hover:text-\[\#0b1042\] transition-colors font-medium">\{brand.label\}<\/span>/g,
  `<span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium capitalize">{brand.label.replace('_', ' ')}</span>`
);


// Availability
content = content.replace(
  /checked=\{filters\.availability === status\.id[^\}]*\}/g,
  `checked={availability === status.id}`
);
content = content.replace(
  /onChange=\{.*?setFilters.*?availability: status\.id.*?\}/g,
  `onChange={() => setAvailability(status.id)}`
);
content = content.replace(
  /status\.id === 'in_stock' && !filters\.availability/g,
  `availability === status.id`
);

fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);

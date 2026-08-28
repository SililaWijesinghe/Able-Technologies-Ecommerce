import fs from 'fs';
let content = fs.readFileSync('src/components/shop/FilterSidebar.tsx', 'utf8');

content = content.replace(
  "allProducts.forEach(p => {",
  "(allProducts || []).forEach(p => {"
);
content = content.replace(
  "allProducts.forEach(p => {",
  "(allProducts || []).forEach(p => {"
);

content = content.replace(
  "if (selectedCategories.includes(id)) {",
  "if (selectedCategories && selectedCategories.includes(id)) {"
);

content = content.replace(
  "setSelectedCategories([...selectedCategories, id]);",
  "if (setSelectedCategories) setSelectedCategories([...(selectedCategories || []), id]);"
);

content = content.replace(
  "setSelectedCategories(selectedCategories.filter(c => c !== id));",
  "if (setSelectedCategories) setSelectedCategories((selectedCategories || []).filter(c => c !== id));"
);

content = content.replace(
  "if (selectedBrands.includes(id)) {",
  "if (selectedBrands && selectedBrands.includes(id)) {"
);

content = content.replace(
  "setSelectedBrands([...selectedBrands, id]);",
  "if (setSelectedBrands) setSelectedBrands([...(selectedBrands || []), id]);"
);

content = content.replace(
  "setSelectedBrands(selectedBrands.filter(b => b !== id));",
  "if (setSelectedBrands) setSelectedBrands((selectedBrands || []).filter(b => b !== id));"
);

// also fix selectedCategories.includes in checkboxes
content = content.replace(
  "checked={selectedCategories.includes(cat.id)}",
  "checked={(selectedCategories || []).includes(cat.id)}"
);
content = content.replace(
  "checked={selectedBrands.includes(brand.id)}",
  "checked={(selectedBrands || []).includes(brand.id)}"
);


fs.writeFileSync('src/components/shop/FilterSidebar.tsx', content);

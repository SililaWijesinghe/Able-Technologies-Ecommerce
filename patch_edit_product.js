const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');

// 1. Update State
code = code.replace(/brand:\s*'',/, "brand_id: '',");

// 2. Add brands state
if (!code.includes('const [brands, setBrands]')) {
  code = code.replace(
    /const \[categories, setCategories\] = useState<any\[\]>\(\[\]\);/,
    "const [categories, setCategories] = useState<any[]>([]);\n  const [brands, setBrands] = useState<any[]>([]);"
  );
}

// 3. Fetch brands on load (inside useEffect)
code = code.replace(
  /const \{ data: catData \} = await supabase\.from\('categories'\)\.select\('\*'\);\n\s*if \(catData\) setCategories\(catData\);/,
  "const { data: catData } = await supabase.from('categories').select('*');\n        if (catData) setCategories(catData);\n        const { data: brandData } = await supabase.from('brands').select('*');\n        if (brandData) setBrands(brandData);"
);

// 4. Update fetched data mapping
code = code.replace(
  /brand:\s*data\.brand \|\| '',/,
  "brand_id: data.brand_id || '',"
);

// 5. Update the input to a select dropdown
code = code.replace(
  /<input\s+type="text"\s+name="brand"\s+value=\{formData\.brand\}\s+onChange=\{handleChange\}\s+className="w-full border border-white\/60 rounded-xl p-3 text-sm focus:border-\[\#0b1042\] focus:ring-1 focus:ring-\[\#0b1042\] outline-none transition-all"\s+placeholder="e\.g\. SMC, Festo, Loctite"\s+\/>/,
  `<select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all">
                  <option value="">No Brand</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>`
);

// 6. Update payload
code = code.replace(
  /brand:\s*formData\.brand \|\| null,/,
  "brand_id: formData.brand_id || null,"
);

fs.writeFileSync('src/pages/admin/EditProduct.tsx', code);
console.log("Patched EditProduct.tsx");

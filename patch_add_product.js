const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AddProduct.tsx', 'utf8');

// 1. Update State
code = code.replace(/brand:\s*'',/, "brand_id: '',");

// 2. Add brands state
if (!code.includes('const [brands, setBrands]')) {
  code = code.replace(
    /const \[categories, setCategories\] = useState<any\[\]>\(\[\]\);/,
    "const [categories, setCategories] = useState<any[]>([]);\n  const [brands, setBrands] = useState<any[]>([]);"
  );
}

// 3. Fetch brands on load
code = code.replace(
  /supabase\.from\('categories'\)\.select\('\*'\)\.then\(\(\{ data \}\) => \{\n\s*if \(data\) setCategories\(data\);\n\s*\}\);/,
  "supabase.from('categories').select('*').then(({ data }) => {\n      if (data) setCategories(data);\n    });\n    supabase.from('brands').select('*').then(({ data }) => {\n      if (data) setBrands(data);\n    });"
);

// 4. Update the input to a select dropdown
code = code.replace(
  /<input\s+type="text"\s+name="brand"\s+value=\{formData\.brand\}\s+onChange=\{handleChange\}\s+className="w-full border border-white\/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"\s+placeholder="e\.g\. SMC, Festo, Loctite"\s+\/>/,
  `<select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  <option value="">No Brand</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>`
);

// 5. Update payload
code = code.replace(
  /brand:\s*formData\.brand \|\| null,/,
  "brand_id: formData.brand_id || null,"
);

fs.writeFileSync('src/pages/admin/AddProduct.tsx', code);
console.log("Patched AddProduct.tsx");

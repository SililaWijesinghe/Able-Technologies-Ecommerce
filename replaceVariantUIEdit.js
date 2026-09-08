const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');

const replacementUI = `
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
              <h2 className="text-lg font-black text-gray-900">Product Options</h2>
            </div>
            
            <p className="text-xs text-gray-500 mb-4 font-medium">Define options like Size or Color. Variants will be automatically generated below.</p>
            
            <div className="space-y-4">
              {productOptions.map((opt, optIdx) => (
                <div key={optIdx} className="p-4 border border-slate-200 bg-white rounded-2xl space-y-3 relative group">
                  <button type="button" onClick={() => removeOption(optIdx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option Name</label>
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => updateOption(optIdx, 'name', e.target.value)}
                        placeholder="e.g., Size"
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option Values</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {opt.values.map((val, valIdx) => (
                          <span key={valIdx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
                            {val}
                            <button type="button" onClick={() => removeOptionValue(optIdx, valIdx)} className="text-slate-500 hover:text-red-500"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={opt.inputValue}
                        onChange={(e) => updateOption(optIdx, 'inputValue', e.target.value)}
                        onKeyDown={(e) => handleOptionKeyDown(e, optIdx)}
                        placeholder="Type value and press Enter..."
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addOption}
                className="flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Add another option</span>
              </button>
            </div>
          </div>

          {variants.length > 0 && (
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">5</span>
                  <h2 className="text-lg font-black text-gray-900">Generated Variants</h2>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                   <button type="button" onClick={() => {const val = prompt('Enter price modifier to apply to all:'); if(val) applyBulkVariant('price_modifier', parseFloat(val))}} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg transition-colors">Bulk Price</button>
                   <button type="button" onClick={() => {const val = prompt('Enter stock count to apply to all:'); if(val) applyBulkVariant('inventory_count', parseInt(val))}} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg transition-colors">Bulk Stock</button>
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="p-3 font-bold">Variant</th>
                      <th className="p-3 font-bold">SKU</th>
                      <th className="p-3 font-bold w-32">Price Mod (+)</th>
                      <th className="p-3 font-bold w-32">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {variants.map((variant, idx) => (
                      <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {Object.values(variant.attributes || {}).map((val: any, i) => (
                              <span key={i} className="inline-flex bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-xs font-bold">{val}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                            className="w-full min-w-[120px] bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm outline-none transition-all"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.price_modifier}
                            onChange={(e) => updateVariant(idx, 'price_modifier', parseFloat(e.target.value) || 0)}
                            className="w-full min-w-[80px] bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm outline-none transition-all"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.inventory_count}
                            onChange={(e) => updateVariant(idx, 'inventory_count', parseInt(e.target.value) || 0)}
                            className="w-full min-w-[60px] bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm outline-none transition-all"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
`;

// Replace attributes: {} with attributes: v.attributes || {}
content = content.replace(/attributes: \{\}/g, 'attributes: v.attributes || {}');

// And in edit, we also need to parse existing attributes into productOptions!
// This should be done inside fetchData. But wait! The database schema stores attributes, but we need to reconstruct productOptions from them.
// Let's modify the useEffect to reconstruct productOptions from variants.

const parseAttributesCode = `
        if (data.product_variants && data.product_variants.length > 0) {
          const loadedVariants = data.product_variants.map((v: any) => ({
            id: v.id,
            sku: v.sku || '',
            price_modifier: v.price_modifier || 0,
            inventory_count: v.inventory_count || 0,
            attributes: v.attributes || {}
          }));
          setVariants(loadedVariants);
          
          // Reconstruct ProductOptions from variants
          const optionMap = new Map<string, Set<string>>();
          loadedVariants.forEach(v => {
            if (v.attributes) {
              Object.entries(v.attributes).forEach(([key, val]) => {
                if (!optionMap.has(key)) optionMap.set(key, new Set());
                optionMap.get(key)!.add(val as string);
              });
            }
          });
          
          const reconstructedOptions = Array.from(optionMap.entries()).map(([name, valuesSet]) => ({
            name,
            values: Array.from(valuesSet),
            inputValue: ""
          }));
          
          setProductOptions(reconstructedOptions);
        }
`;

// Replace the variants loading block in fetchData
content = content.replace(/if \(data\.product_variants && data\.product_variants\.length > 0\) \{[\s\S]*?\}\)\)\);[\s\S]*?\}/, parseAttributesCode.trim());

// Replace UI
const lines = content.split('\n');
const startIdx = lines.findIndex(line => line.includes('Product Models / Variants'));
const endIdx = lines.findIndex((line, i) => i > startIdx && line.includes('<span>Add Model</span>'));

if (startIdx !== -1 && endIdx !== -1) {
  // Find the exact wrapping div boundaries
  let blockStart = startIdx - 3;
  let blockEnd = endIdx + 3;
  
  const newContent = lines.slice(0, blockStart).join('\n') + '\n' + replacementUI + '\n' + lines.slice(blockEnd).join('\n');
  fs.writeFileSync('src/pages/admin/EditProduct.tsx', newContent);
  console.log('Edit UI Replaced');
} else {
  console.log('Indices not found:', startIdx, endIdx);
}

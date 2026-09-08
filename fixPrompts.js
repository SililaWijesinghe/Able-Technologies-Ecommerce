const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add state variables
  content = content.replace(
    /const \[productOptions, setProductOptions\] = useState[\s\S]*?;/,
    match => match + '\n  const [bulkPrice, setBulkPrice] = useState("");\n  const [bulkStock, setBulkStock] = useState("");'
  );
  
  // Replace the bulk apply UI
  const bulkUI = `
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <input type="number" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} placeholder="Bulk Price..." className="w-24 px-2 py-1.5 text-xs outline-none" />
                    <button type="button" onClick={() => { if(bulkPrice) applyBulkVariant('price_modifier', parseFloat(bulkPrice))}} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 text-xs border-l border-slate-200 transition-colors">Apply</button>
                  </div>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <input type="number" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} placeholder="Bulk Stock..." className="w-24 px-2 py-1.5 text-xs outline-none" />
                    <button type="button" onClick={() => { if(bulkStock) applyBulkVariant('inventory_count', parseInt(bulkStock))}} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 text-xs border-l border-slate-200 transition-colors">Apply</button>
                  </div>
                </div>`;
                
  content = content.replace(
    /<div className="flex items-center gap-2 mt-3 sm:mt-0">[\s\S]*?<\/div>/,
    bulkUI.trim()
  );

  fs.writeFileSync(file, content);
}

fixFile('src/pages/admin/AddProduct.tsx');
fixFile('src/pages/admin/EditProduct.tsx');

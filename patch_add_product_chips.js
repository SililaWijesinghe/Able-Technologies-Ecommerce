const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AddProduct.tsx', 'utf8');

// Add COMMON_SPECS
const commonSpecsConst = `
const COMMON_SPECS = ['Power Supply', 'Air Pressure', 'Power Consumption', 'Temperature', 'Timmer', 'Piston Diameter', 'Bed Dimensions', 'Net Weight', 'Machine Weight', 'Frequency'];
`;
if (!code.includes('const COMMON_SPECS')) {
  code = code.replace("export default function AddProduct() {", commonSpecsConst + "\nexport default function AddProduct() {");
}

// Add addQuickSpec function
const quickSpecFunc = `
  const addQuickSpec = (newKey: string) => {
    if (specifications.some(spec => spec.key.trim().toLowerCase() === newKey.toLowerCase())) return;
    if (specifications.length === 1 && specifications[0].key === '' && specifications[0].value === '') {
      setSpecifications([{ key: newKey, value: '' }]);
    } else {
      setSpecifications([...specifications, { key: newKey, value: '' }]);
    }
  };
`;
if (!code.includes('const addQuickSpec')) {
  code = code.replace("const addSpecRow = () => {", quickSpecFunc + "\n  const addSpecRow = () => {");
}

// Add UI
const specUIRegex = /(<h2 className="text-lg font-black text-gray-900">Technical Specifications<\/h2>\s*<\/div>)\s*<div className="space-y-3">/;
const specUIReplacement = `$1
            
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_SPECS.map(specName => {
                const isAdded = specifications.some(s => s.key.trim().toLowerCase() === specName.toLowerCase());
                return (
                  <button
                    key={specName}
                    type="button"
                    onClick={() => addQuickSpec(specName)}
                    disabled={isAdded}
                    className={\`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors \${
                      isAdded 
                        ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }\`}
                  >
                    {!isAdded && <Plus size={12} />}
                    {specName}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">`;

code = code.replace(specUIRegex, specUIReplacement);

fs.writeFileSync('src/pages/admin/AddProduct.tsx', code);
console.log("Patched AddProduct.tsx for Quick Specs");

const fs = require('fs');
let file = 'src/components/shop/FilterSidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the flat mapping with a recursive Component
const recursiveComponent = `
const CategoryNode = ({ cat, isCategorySelected, toggleCategory }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = cat.children && cat.children.length > 0;
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-1 group">
        <label className="flex items-center min-w-0 flex-1 cursor-pointer">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-gray-300 text-[#0b1042] focus:ring-[#0b1042] cursor-pointer" 
            checked={isCategorySelected(cat)}
            onChange={() => toggleCategory(cat)}
          />
          <span className="ml-3 text-sm text-gray-700 group-hover:text-[#0b1042] transition-colors font-medium capitalize truncate">
            {cat.label.replace(/_/g, ' ')}
          </span>
        </label>
        <div className="flex items-center">
          <span className="text-xs text-gray-400 mx-2 shrink-0">({cat.totalCount || cat.count})</span>
          {hasChildren ? (
            <button 
              onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          ) : (
            <div className="w-6" /> // spacer
          )}
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="ml-5 border-l-2 border-gray-100 pl-2 mt-1 space-y-1">
          {cat.children.map(child => (
            <CategoryNode key={child.id} cat={child} isCategorySelected={isCategorySelected} toggleCategory={toggleCategory} />
          ))}
        </div>
      )}
    </div>
  );
};
`;

// Inject CategoryNode before FilterSidebar component
content = content.replace(
  /export default function FilterSidebar/g,
  recursiveComponent + '\nexport default function FilterSidebar'
);

// We need to return ROOTS instead of processNodes(roots)
const rootsReplacement = `
    const processNodes = (nodes, level = 0) => {
      nodes.forEach(node => {
        node.level = level;
        const childrenList = processNodes(node.children, level + 1);
        node.totalCount = node.count + (node.children || []).reduce((acc, child) => acc + (child.totalCount || 0), 0);
      });
      return nodes;
    };

    return processNodes(roots);
  }, [dbCategories, allProducts]);
`;
content = content.replace(/const processNodes = \(nodes, level = 0\) => \{[\s\S]*?return processNodes\(roots\);\n  \}, \[dbCategories, allProducts\]\);/g, rootsReplacement.trim() + '\n  }, [dbCategories, allProducts]);');

// Replace the JSX mapping
const jsxReplacement = `
            <div className="space-y-2">
              {(categories || []).map(cat => (
                <CategoryNode key={cat.id} cat={cat} isCategorySelected={isCategorySelected} toggleCategory={toggleCategory} />
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-gray-400 italic py-1">No categories available</p>
              )}
            </div>
`;
content = content.replace(/<div className="space-y-2">[\s\S]*?No categories available<\/p>\n              \)\}\n            <\/div>/g, jsxReplacement.trim());

fs.writeFileSync(file, content);

const fs = require('fs');
let file = 'src/pages/admin/Categories.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to inject a helper to structure categories
const helperFunc = `
  const getHierarchicalCategories = (cats) => {
    const map = new Map();
    cats.forEach(c => map.set(c.id, { ...c, children: [], level: 0 }));
    const roots = [];
    cats.forEach(c => {
      const node = map.get(c.id);
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });
    const flatten = (nodes, level = 0) => {
      return nodes.reduce((acc, node) => {
        node.level = level;
        return acc.concat(node, flatten(node.children, level + 1));
      }, []);
    };
    return flatten(roots);
  };
  const hierarchicalCategories = getHierarchicalCategories(categories);
`;

content = content.replace(
  /const fetchData = async/g,
  helperFunc + "\n  const fetchData = async"
);

// Update map from `categories.map((cat) => (` to `hierarchicalCategories.map((cat) => (`
content = content.replace(/categories\.map\(\(cat\) => \(/g, "hierarchicalCategories.map((cat) => (");

// Add indent to the category name
content = content.replace(
  /<span className="font-bold text-slate-800 text-base tracking-wide">\{cat\.name\}<\/span>/g,
  `<div className="flex items-center" style={{ paddingLeft: \`\${(cat.level || 0) * 20}px\` }}>
     {(cat.level || 0) > 0 && <span className="text-gray-400 mr-2">↳</span>}
     <span className="font-bold text-slate-800 text-base tracking-wide">{cat.name}</span>
   </div>`
);

fs.writeFileSync(file, content);

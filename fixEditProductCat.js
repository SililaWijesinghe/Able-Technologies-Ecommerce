const fs = require('fs');

const helperFunc = `
  const getHierarchicalCategories = (cats: any[]) => {
    const map = new Map();
    cats.forEach(c => map.set(c.id, { ...c, children: [], level: 0 }));
    const roots: any[] = [];
    cats.forEach(c => {
      const node = map.get(c.id);
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });
    const flatten = (nodes: any[], level = 0): any[] => {
      return nodes.reduce((acc, node) => {
        node.level = level;
        return acc.concat(node, flatten(node.children, level + 1));
      }, []);
    };
    return flatten(roots);
  };
  const hierarchicalCategories = getHierarchicalCategories(categories);
`;

let content = fs.readFileSync('src/pages/admin/EditProduct.tsx', 'utf8');
content = content.replace(/const handleUpdate = async/g, helperFunc + '\n  const handleUpdate = async');
fs.writeFileSync('src/pages/admin/EditProduct.tsx', content);

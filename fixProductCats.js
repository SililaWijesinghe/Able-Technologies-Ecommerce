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

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const handleSubmit = async/g, helperFunc + '\n  const handleSubmit = async');
  content = content.replace(/\{categories\.map\(c => \(/g, "{hierarchicalCategories.map((c: any) => (");
  content = content.replace(/<option key=\{c\.id\} value=\{c\.id\}>\{c\.name\}<\/option>/g, "<option key={c.id} value={c.id}>{'\\u00A0'.repeat((c.level || 0) * 4)}{c.name}</option>");
  fs.writeFileSync(file, content);
}

fixFile('src/pages/admin/AddProduct.tsx');
fixFile('src/pages/admin/EditProduct.tsx');

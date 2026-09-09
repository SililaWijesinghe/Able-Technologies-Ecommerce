export const buildCategoryOptions = (categories: any[], parentId: string | null = null, depth: number = 0): any[] => {
  let options: any[] = [];
  const children = categories.filter(c => c.parent_id === parentId);
  for (const child of children) {
    options.push({ 
      ...child, 
      level: depth,
      label: String.fromCharCode(160).repeat(depth * 3) + (depth > 0 ? "— " : "") + child.name 
    });
    options = options.concat(buildCategoryOptions(categories, child.id, depth + 1));
  }
  return options;
};

export const getHierarchicalCategories = (cats: any[]) => {
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

export const buildCategoryTree = (cats: any[]) => {
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
  
  const setLevels = (nodes: any[], level = 0) => {
    nodes.forEach(node => {
      node.level = level;
      setLevels(node.children, level + 1);
    });
  };
  
  setLevels(roots);
  return roots;
};

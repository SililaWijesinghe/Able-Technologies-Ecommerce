const fs = require('fs');
let file = 'src/components/shop/FilterSidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the categories calculation
const replacement = `
  // 1. Categories calculation with interchangeable ID, Slug, and Name counts
  const categories = useMemo(() => {
    const allCats = (dbCategories || []).map(cat => {
      const catIdLower = String(cat.id || '').toLowerCase().trim();
      const catSlugLower = String(cat.slug || '').toLowerCase().trim();
      const catNameLower = String(cat.name || '').toLowerCase().trim();

      // Count matching products
      const count = (allProducts || []).filter(p => {
        const pCatId = String(p.category_id || '').toLowerCase().trim();
        const pCatName = String(p.category_name || '').toLowerCase().trim();
        const pCatSlug = String(p.category_slug || '').toLowerCase().trim();
        const pCatStr = typeof p.category === 'string' ? p.category.toLowerCase().trim() : '';
        const pCatObjId = typeof p.category === 'object' && p.category?.id ? String(p.category.id).toLowerCase().trim() : '';
        const pCatObjSlug = typeof p.category === 'object' && p.category?.slug ? String(p.category.slug).toLowerCase().trim() : '';
        const pCatObjName = typeof p.category === 'object' && p.category?.name ? String(p.category.name).toLowerCase().trim() : '';

        // Direct ID / Slug / Name match
        if (catIdLower && (pCatId === catIdLower || pCatObjId === catIdLower)) return true;
        if (catSlugLower && (pCatSlug === catSlugLower || pCatObjSlug === catSlugLower || pCatStr === catSlugLower)) return true;
        if (catNameLower && (pCatName === catNameLower || pCatObjName === catNameLower || pCatStr === catNameLower)) return true;
        
        // Also check if p.category_id maps to slug or name
        if (pCatId && (pCatId === catSlugLower || pCatId === catNameLower)) return true;

        return false;
      }).length;

      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        label: cat.name || cat.slug || cat.id,
        parent_id: cat.parent_id,
        children: [],
        level: 0,
        count
      };
    });

    const map = new Map();
    allCats.forEach(c => map.set(c.id, c));
    const roots = [];
    allCats.forEach(c => {
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id).children.push(c);
      } else {
        roots.push(c);
      }
    });

    // Helper to sum counts for parent categories and flatten
    const processNodes = (nodes, level = 0) => {
      let flatList = [];
      nodes.forEach(node => {
        node.level = level;
        const childrenList = processNodes(node.children, level + 1);
        node.totalCount = node.count + childrenList.reduce((acc, child) => child.level === level + 1 ? acc + child.totalCount : acc, 0);
        flatList.push(node);
        flatList = flatList.concat(childrenList);
      });
      return flatList;
    };

    return processNodes(roots);
  }, [dbCategories, allProducts]);
`;

// Replace `categories` calculation
content = content.replace(/\/\/ 1\. Categories calculation with interchangeable ID, Slug, and Name counts[\s\S]*?\}, \[dbCategories, allProducts\]\);/g, replacement.trim());

// Render indentation
content = content.replace(
  /<label key=\{cat\.id\} className="flex items-center justify-between cursor-pointer group py-0\.5">/g,
  '<label key={cat.id} className="flex items-center justify-between cursor-pointer group py-0.5" style={{ paddingLeft: `${(cat.level || 0) * 16}px` }}>'
);

// Display total count
content = content.replace(
  /<span className="text-xs text-gray-400 ml-2 shrink-0">\(\{cat\.count\}\)<\/span>/g,
  '<span className="text-xs text-gray-400 ml-2 shrink-0">({cat.totalCount || cat.count})</span>'
);

fs.writeFileSync(file, content);

const fs = require('fs');
let file = 'src/pages/Shop.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
          // Find all matching categories in dbCategories by ID, Slug, or Name
          const matchedDbCats = dbCategories.filter(c => 
            String(c.id || '').toLowerCase().trim() === selectedLower ||
            String(c.slug || '').toLowerCase().trim() === selectedLower ||
            String(c.name || '').toLowerCase().trim() === selectedLower ||
            String(c.name || '').toLowerCase().trim().replace(/\\s+/g, '-') === selectedLower
          );

          // Add all descendant categories recursively
          const getAllDescendants = (cats, allDbCats) => {
            let descendants = [...cats];
            let currentLevel = [...cats];
            while (currentLevel.length > 0) {
              const currentIds = currentLevel.map(c => c.id);
              const nextLevel = allDbCats.filter(c => currentIds.includes(c.parent_id));
              descendants = descendants.concat(nextLevel);
              currentLevel = nextLevel;
            }
            return descendants;
          };
          const expandedDbCats = getAllDescendants(matchedDbCats, dbCategories);

          // Build a set of all valid category identifiers (UUIDs, slugs, names)
          const targetCategoryKeys = new Set<string>();
          targetCategoryKeys.add(selectedLower);
          targetCategoryKeys.add(selectedLower.replace(/-/g, ' '));
          expandedDbCats.forEach(c => {
`;

content = content.replace(
  /\/\/ Find all matching categories in dbCategories by ID, Slug, or Name[\s\S]*?matchedDbCats\.forEach\(c => \{/g,
  replacement.trim() + " {"
);

fs.writeFileSync(file, content);

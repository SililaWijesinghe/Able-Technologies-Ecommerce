import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Products.tsx', 'utf8');

if (!content.includes('useToast')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { useToast } from '../../context/ToastContext';"
  );
  
  content = content.replace(
    "export default function Products() {",
    "export default function Products() {\n  const toast = useToast();"
  );
  
  content = content.replace(
    "setProducts(products.filter(p => p.id !== productToDelete.id));\n        setProductToDelete(null);",
    "setProducts(products.filter(p => p.id !== productToDelete.id));\n        setProductToDelete(null);\n        toast.success('Product deleted successfully');"
  );
  
  content = content.replace(
    "} catch (err) {",
    "} catch (err) {\n      toast.error('Failed to delete product');"
  );

  fs.writeFileSync('src/pages/admin/Products.tsx', content);
}

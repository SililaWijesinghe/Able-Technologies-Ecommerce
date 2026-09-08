#!/bin/bash

# 1. Update select to include product_variants
sed -i 's/\.select('"'"'\*'"'"')/.select('"'"'\*, product_variants(\*)'"'"')/g' src/pages/admin/EditProduct.tsx

# 2. Add variants state right after specifications state
sed -i 's/const \[specifications, setSpecifications\] = useState(\[{ key: '"''"', value: '"''"' }\]);/const \[specifications, setSpecifications\] = useState(\[{ key: '"''"', value: '"''"' }\]);\n  const \[variants, setVariants\] = useState<{ id?: string; sku: string; price_modifier: number; inventory_count: number }\[\]>(\[\]);/g' src/pages/admin/EditProduct.tsx

# 3. Initialize variants state in fetchData
awk '/if \(data\.specifications\) \{/ {
    print "        if (data.product_variants) {"
    print "          setVariants(data.product_variants.map((v: any) => ({"
    print "            id: v.id,"
    print "            sku: v.sku || '\'''\',"
    print "            price_modifier: v.price_modifier || 0,"
    print "            inventory_count: v.inventory_count || 0"
    print "          })));"
    print "        }"
}
{print}' src/pages/admin/EditProduct.tsx > temp.tsx && mv temp.tsx src/pages/admin/EditProduct.tsx

#!/bin/bash
# Update AddProduct.tsx

# 1. Add variants state
sed -i 's/const \[specifications, setSpecifications\] = useState(\[{ key: '"''"', value: '"''"' }\]);/const \[specifications, setSpecifications\] = useState(\[{ key: '"''"', value: '"''"' }\]);\n  const \[variants, setVariants\] = useState<{ sku: string; price_modifier: number; inventory_count: number }\[\]>(\[\]);/g' src/pages/admin/AddProduct.tsx

# 2. Add variants insert logic
awk '/if \(productData\) \{/ {
    print "      if (variants.length > 0) {"
    print "        const variantPayload = variants.map(v => ({"
    print "          product_id: productData.id,"
    print "          sku: v.sku,"
    print "          price_modifier: v.price_modifier,"
    print "          inventory_count: v.inventory_count,"
    print "          attributes: {}"
    print "        }));"
    print "        const { error: variantError } = await supabase.from('\''product_variants'\'').insert(variantPayload);"
    print "        if (variantError) console.warn('\''Failed to insert variants:'\'', variantError);"
    print "      }"
}
{print}' src/pages/admin/AddProduct.tsx > temp.tsx && mv temp.tsx src/pages/admin/AddProduct.tsx

# 3. Add UI helper texts
sed -i 's/<input/<input/g' src/pages/admin/AddProduct.tsx

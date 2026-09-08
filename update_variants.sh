#!/bin/bash
awk '/if \(stockError\) \{/ {
    print $0
    getline
    print $0
    getline
    print $0
    getline
    print $0
    print "        if (variants.length > 0) {"
    print "          const variantPayload = variants.map(v => ({"
    print "            product_id: productData.id,"
    print "            sku: v.sku,"
    print "            price_modifier: v.price_modifier,"
    print "            inventory_count: v.inventory_count,"
    print "            attributes: {}"
    print "          }));"
    print "          const { error: variantError } = await supabase.from('\''product_variants'\'').insert(variantPayload);"
    print "          if (variantError) console.warn('\''Failed to insert variants:'\'', variantError);"
    print "        }"
    next
}
{print}' src/pages/admin/AddProduct.tsx > temp.tsx && mv temp.tsx src/pages/admin/AddProduct.tsx

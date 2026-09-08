#!/bin/bash
awk '/const itemsList = cartItems.map/ {
    print "    const itemsList = cartItems.map((item, idx) => {"
    print "      let variantText = '"''"';"
    print "      if (item.variant) {"
    print "        try {"
    print "          const parsed = JSON.parse(item.variant);"
    print "          variantText = ` (Model: ${parsed.sku}${parsed.type === '\''rent'\'' ? '\'', Rental'\'' : '\'''\''})`;"
    print "        } catch (e) {"
    print "          variantText = ` (${item.variant})`;"
    print "        }"
    print "      }"
    print "      return `${idx + 1}. ${item.name}${variantText} - Qty: ${item.quantity} × Rs. ${Number(item.price).toLocaleString()} = Rs. ${(Number(item.price) * item.quantity).toLocaleString()}`;"
    print "    }).join('\''\\n'\'');"
    getline
    getline
    next
}
{print}' src/components/cart/CartDrawer.tsx > temp.tsx && mv temp.tsx src/components/cart/CartDrawer.tsx

#!/bin/bash
awk '/const displayPrice = showPrice \? `Rs. \$\{basePrice.toLocaleString/ {
    print "  const hasVariants = product.product_variants && product.product_variants.length > 0;"
    print "  const pricePrefix = hasVariants ? '\''From Rs. '\'' : '\''Rs. '\'';"
    print "  const displayPrice = showPrice ? `${pricePrefix}${basePrice.toLocaleString('\''en-US'\'', { minimumFractionDigits: 2 })}` : '\''Price on Request'\'';"
    next
}
{print}' src/pages/ProductDetails/index.tsx > temp.tsx && mv temp.tsx src/pages/ProductDetails/index.tsx

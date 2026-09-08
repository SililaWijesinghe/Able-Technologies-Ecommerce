#!/bin/bash
awk '/<h3 className="text-slate-800 font-bold text-lg leading-tight group-hover\/link:text-blue-600 transition-colors">\{product.name\}<\/h3>/ {
    print "          {product.sku && ("
    print "            <p className=\"text-[11px] text-slate-400 font-mono font-medium mb-1\">{product.sku}</p>"
    print "          )}"
    print $0
    next
}
{print}' src/components/shop/ProductCard.tsx > temp.tsx && mv temp.tsx src/components/shop/ProductCard.tsx

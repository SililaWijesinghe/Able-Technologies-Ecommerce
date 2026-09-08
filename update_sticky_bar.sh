#!/bin/bash
awk '/\{product.requires_quote \? \(/ {
    print "          {product.product_variants && product.product_variants.length > 0 ? ("
    print "            <button "
    print "              onClick={() => window.scrollTo({ top: 0, behavior: '\''smooth'\'' })}"
    print "              className={`bg-[#0b1042] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md shadow-blue-900/30 flex items-center justify-center space-x-2 active:scale-95 transition-transform ${showPrice ? '\'''\'' : '\''w-full'\''}`}"
    print "            >"
    print "              <span>Select Model</span>"
    print "            </button>"
    print "          ) : product.requires_quote ? ("
    next
}
{print}' src/pages/ProductDetails/index.tsx > temp.tsx && mv temp.tsx src/pages/ProductDetails/index.tsx

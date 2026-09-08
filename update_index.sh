#!/bin/bash
awk '/<ProductTabs product=\{product\} \/>/ {
    print "        {/* Product Description */}"
    print "        <div className=\"mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100\">"
    print "          <h2 className=\"text-xl font-black text-[#0b1042] mb-6\">Product Description</h2>"
    print "          <div className=\"text-gray-600 leading-relaxed whitespace-pre-wrap\">"
    print "            {product.description}"
    print "          </div>"
    print "        </div>"
    print ""
    print $0
    next
}
{print}' src/pages/ProductDetails/index.tsx > temp.tsx && mv temp.tsx src/pages/ProductDetails/index.tsx

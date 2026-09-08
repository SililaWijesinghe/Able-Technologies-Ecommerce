#!/bin/bash
# Remove renderFormattedDescription function
sed -i '/const renderFormattedDescription = (text: string) => {/,/return <p className="text-gray-600 text-sm leading-relaxed mb-6">{text}<\/p>;/d' src/pages/ProductDetails/ProductBuyBox.tsx
sed -i '/};/d' src/pages/ProductDetails/ProductBuyBox.tsx

# Replace SKU with Model Badge
sed -i 's/<p className="text-gray-500 text-sm font-semibold mb-3">SKU: {currentSku}<\/p>/<div className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded inline-block mt-2 mb-4">Model: {currentSku}<\/div>/g' src/pages/ProductDetails/ProductBuyBox.tsx

# Remove the call to renderFormattedDescription
sed -i '/{renderFormattedDescription(product.description)}/d' src/pages/ProductDetails/ProductBuyBox.tsx

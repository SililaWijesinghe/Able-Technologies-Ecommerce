#!/bin/bash
awk '/export default function QuoteModal/ {
    print "export default function QuoteModal({ isOpen, onClose, product, variantSku }: QuoteModalProps & { variantSku?: string }) {"
    next
}
/message: formData.message/ {
    print "        message: formData.message + (variantSku ? `\\n\\nSelected Model: ${variantSku}` : '"''"'),"
    next
}
/export interface QuoteModalProps/ {
    print "export interface QuoteModalProps {"
    print "  isOpen: boolean;"
    print "  onClose: () => void;"
    print "  product: any;"
    print "  variantSku?: string;"
    print "}"
    next
}
/<h4 className="text-sm font-bold text-slate-800">\{product.name\}<\/h4>/ {
    print $0
    print "                      {variantSku && <p className=\"text-[11px] text-blue-500 font-medium\">Model: {variantSku}</p>}"
    next
}
{print}' src/components/shop/QuoteModal.tsx > temp.tsx && mv temp.tsx src/components/shop/QuoteModal.tsx

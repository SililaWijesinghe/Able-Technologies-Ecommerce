#!/bin/bash
awk '/interface QuoteModalProps \{/ {
    print "export interface QuoteModalProps {"
    next
}
{print}' src/components/shop/QuoteModal.tsx > temp.tsx && mv temp.tsx src/components/shop/QuoteModal.tsx

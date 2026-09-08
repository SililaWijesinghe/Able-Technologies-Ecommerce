#!/bin/bash

# Update the variant payload inserting block
sed -i 's/attributes: {}/attributes: v.attributes || {}/g' src/pages/admin/AddProduct.tsx

# Replace the UI block for variants
awk '
/Product Models \/ Variants/ {
    print $0
    in_variant_block = 1
    next
}
in_variant_block && /<\/div>/ && /space-y-3/ {
    # Skip until we hit the end of the variant block
    # Actually it is better to do a manual replacement using sed or perl
    next
}
' src/pages/admin/AddProduct.tsx > temp_ui.tsx

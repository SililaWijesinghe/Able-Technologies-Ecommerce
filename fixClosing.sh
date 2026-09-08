#!/bin/bash
# Remove line 742 and 743 from AddProduct.tsx
sed -i '742d' src/pages/admin/AddProduct.tsx
sed -i '742d' src/pages/admin/AddProduct.tsx
# Insert one </div>
sed -i '741a \        </div>' src/pages/admin/AddProduct.tsx

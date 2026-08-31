import fs from 'fs';
let content = fs.readFileSync('src/pages/Checkout.tsx', 'utf8');

if (!content.includes('useToast')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { useToast } from '../context/ToastContext';"
  );
  
  content = content.replace(
    "export default function Checkout() {",
    "export default function Checkout() {\n  const toast = useToast();"
  );
  
  content = content.replace(
    "alert('There was an error placing your order. Please try again.');",
    "toast.error('There was an error placing your order.');"
  );
  
  content = content.replace(
    "setOrderConfirmed(true);",
    "setOrderConfirmed(true);\n      toast.success('Order placed successfully!');"
  );

  fs.writeFileSync('src/pages/Checkout.tsx', content);
}

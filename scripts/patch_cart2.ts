import fs from 'fs';
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

content = content.replace(
  "import React, { createContext, useContext, useState, ReactNode } from 'react';",
  "import React, { createContext, useContext, useState, ReactNode } from 'react';\nimport { useToast } from './ToastContext';"
);

content = content.replace(
  "export function CartProvider({ children }: { children: ReactNode }) {",
  "export function CartProvider({ children }: { children: ReactNode }) {\n  const toast = useToast();"
);

fs.writeFileSync('src/context/CartContext.tsx', content);

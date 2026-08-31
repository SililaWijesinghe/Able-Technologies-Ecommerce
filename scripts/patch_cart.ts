import fs from 'fs';
let content = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

if (!content.includes('useToast')) {
  content = content.replace(
    "import React, { createContext, useContext, useState, useEffect } from 'react';",
    "import React, { createContext, useContext, useState, useEffect } from 'react';\nimport { useToast } from './ToastContext';"
  );
  
  content = content.replace(
    "export const CartProvider = ({ children }: { children: React.ReactNode }) => {",
    "export const CartProvider = ({ children }: { children: React.ReactNode }) => {\n  const toast = useToast();"
  );
  
  // Replace alerts or add toasts
  // In addToCart
  content = content.replace(
    "setCartItems(prev => {",
    "toast.success('Added to cart');\n    setCartItems(prev => {"
  );
  
  // In removeFromCart
  content = content.replace(
    "const removeFromCart = (id: string) => {",
    "const removeFromCart = (id: string) => {\n    toast.info('Item removed from cart');"
  );
  
  // In clearCart
  content = content.replace(
    "const clearCart = () => {",
    "const clearCart = () => {\n    toast.warning('Cart cleared');"
  );

  fs.writeFileSync('src/context/CartContext.tsx', content);
}

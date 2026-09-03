import { StoreSettingsProvider } from "./context/StoreSettingsContext";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigatedGuide from './components/ui/NavigatedGuide';
import FloatingControls from './components/FloatingControls';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import Products from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Inquiries from './pages/admin/Inquiries';
import Settings from './pages/admin/Settings';

import Categories from './pages/admin/Categories';
import ComingSoon from './pages/admin/ComingSoon';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function StorefrontLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      {/* SVG Gradient Defs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="metal-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4b4b" />
            <stop offset="45%" stopColor="#d41414" />
            <stop offset="100%" stopColor="#7a0000" />
          </linearGradient>
        </defs>
      </svg>
      <Header />
      
      <main className={!isHome ? 'pt-0 bg-gradient-to-b from-[#060740] to-[#04081c]' : ''}>
        <Outlet />
      </main>
      
      <Footer />
      <FloatingControls />
      <CartDrawer />

      <NavigatedGuide 
        guideId="storefront_tour"
        steps={[
          { targetId: ['nav-shop', 'nav-menu-mobile'], title: 'Welcome to the Store', description: 'Browse our full catalog of products here.', position: 'bottom' },
          { targetId: ['nav-cart', 'nav-cart-mobile'], title: 'Your Cart', description: 'Items you add will appear here.', position: 'bottom' },
        ]}
      />
  
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <StoreSettingsProvider>
      <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
            {/* Storefront Routes */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="settings" element={<Settings />} />
              <Route path="banners" element={<ComingSoon />} />
              <Route path="pages" element={<ComingSoon />} />
              {/* Additional admin routes will go here in future steps */}
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ToastProvider>
    </StoreSettingsProvider>
    </>
  );
}

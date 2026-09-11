import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigatedGuide from './components/ui/NavigatedGuide';
import FloatingControls from './components/FloatingControls';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';
import { StoreSettingsProvider } from "./context/StoreSettingsContext";

// Lazy-loaded routes
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Services = lazy(() => import('./pages/Services'));
const IndustrialSolutions = lazy(() => import('./pages/IndustrialSolutions'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const Products = lazy(() => import('./pages/admin/Products'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const Inventory = lazy(() => import('./pages/admin/Inventory'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Inquiries = lazy(() => import('./pages/admin/Inquiries'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const ComingSoon = lazy(() => import('./pages/admin/ComingSoon'));

function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

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
      
      <main className={!isHome ? 'pt-[140px] md:pt-0 bg-gradient-to-b from-[#060740] to-[#04081c]' : ''}>
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <StoreSettingsProvider>
      <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            {/* Storefront Routes */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/industrial-solutions" element={<IndustrialSolutions />} />
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
              <Route path="brands" element={<ComingSoon />} />
              <Route path="pages" element={<ComingSoon />} />
              {/* Additional admin routes will go here in future steps */}
            </Route>
          </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
    </ToastProvider>
    </StoreSettingsProvider>
    </QueryClientProvider>
  );
}

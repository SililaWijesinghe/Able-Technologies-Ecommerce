import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Settings, 
  Truck, 
  Headphones, 
  Heart, 
  Eye, 
  ShoppingCart, 
  Star, 
  Flame, 
  Sparkles,
  Check,
  X,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import toolImg from '../assets/Tool.png';
import toast from 'react-hot-toast';

import { useStoreSettings } from '../context/StoreSettingsContext';
import { supabase } from '../lib/supabase';
import { SkeletonProductCard } from './ui/Skeleton';
import QuoteModal from './shop/QuoteModal';

interface ProductItem {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  category?: string;
  category_name?: string;
  brand?: string;
  price: number;
  compare_at_price?: number;
  image: string;
  badge?: {
    type: 'top_rated' | 'best_value' | 'high_demand' | 'popular' | 'new';
    text: string;
  };
  stock_status?: string;
  stock_quantity?: number;
  short_description?: string;
  description?: string;
  icon_type?: 'cylinder' | 'robot' | 'jack' | 'printer' | 'fitting' | 'gear';
  specifications?: any;
  attributes?: any;
}

export default function BestSellers() {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<any>(null);

  // Authoritative curated reference catalog matching the exact reference image
  const defaultBestSellers: ProductItem[] = useMemo(() => [
    {
      id: 'prod-cylinder-15552',
      name: 'Air Cylinder ISO 15552',
      slug: 'air-cylinder-iso-15552',
      sku: 'SMC-CYL-15552',
      category: 'SMC • Pneumatic',
      category_name: 'Pneumatics & Cylinders',
      brand: 'SMC Pneumatics',
      price: 12500.00,
      compare_at_price: 14200.00,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      badge: { type: 'top_rated', text: 'TOP RATED' },
      stock_status: 'IN_STOCK',
      stock_quantity: 48,
      short_description: 'Double-acting profile cylinder ISO 15552 with adjustable end-position cushioning for heavy industrial automation.',
      icon_type: 'cylinder'
    },
    {
      id: 'prod-robotic-arm-6axis',
      name: 'Industrial Robotic Arm 6 Axis',
      slug: 'industrial-robotic-arm-6-axis',
      sku: 'ARM-6AX-2000',
      category: 'Automation • Robotics',
      category_name: 'Industrial Robotics',
      brand: 'Able Robotics',
      price: 1850000.00,
      compare_at_price: 2050000.00,
      image: toolImg,
      badge: { type: 'best_value', text: 'BEST VALUE' },
      stock_status: 'IN_STOCK',
      stock_quantity: 6,
      short_description: 'High-precision 6-axis articulated industrial robotic arm engineered for assembly, welding, and high-speed pick & place.',
      icon_type: 'robot'
    },
    {
      id: 'prod-vevor-jack-50t',
      name: 'VEVOR 50-ton hydraulic bottle jack',
      slug: 'vevor-50-ton-hydraulic-bottle-jack',
      sku: 'VEV-HYD-50T',
      category: 'VEVOR • Hydraulic Tools',
      category_name: 'Hydraulics & Lifting',
      brand: 'VEVOR',
      price: 20000.00,
      compare_at_price: 24500.00,
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      badge: { type: 'high_demand', text: 'HIGH DEMAND' },
      stock_status: 'IN_STOCK',
      stock_quantity: 19,
      short_description: 'Heavy-duty 50-ton commercial pneumatic/hydraulic bottle jack designed for industrial machinery and commercial lifting.',
      icon_type: 'jack'
    },
    {
      id: 'prod-pad-printer-pneu',
      name: 'Pneumatic Pad Printing Machine',
      slug: 'pneumatic-pad-printing-machine',
      sku: 'PRT-PAD-480',
      category: 'Printing • Machinery',
      category_name: 'Industrial Printing',
      brand: 'Able Technologies',
      price: 485000.00,
      compare_at_price: 570000.00,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      badge: { type: 'popular', text: 'POPULAR' },
      stock_status: 'IN_STOCK',
      stock_quantity: 12,
      short_description: 'Microprocessor-controlled single-color sealed ink cup pad printing machine for precision component markings.',
      icon_type: 'printer'
    },
    {
      id: 'prod-fitting-set-brass',
      name: 'Pneumatic Fittings Set ISO Quick-Lock',
      slug: 'pneumatic-fittings-set',
      sku: 'FIT-PNEU-SET',
      category: 'Fittings • Hardware',
      category_name: 'Pneumatic Fittings',
      brand: 'SMC',
      price: 1250.00,
      compare_at_price: 1360.00,
      badge: { type: 'best_value', text: 'BEST VALUE' },
      stock_status: 'IN_STOCK',
      stock_quantity: 150,
      image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
      short_description: 'Precision nickel-plated brass push-in pneumatic fittings designed for airtight high-pressure airline systems.',
      icon_type: 'fitting'
    }
  ], []);

  // Fetch real database products and gracefully merge with rich industrial best-seller schema
  useEffect(() => {
    setIsLoading(true);
    fetchProducts().then((apiData: any[]) => {
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        // Map API records into standard structure
        const mappedApiProducts: ProductItem[] = apiData.slice(0, 6).map((p, idx) => {
          const priceVal = typeof p.price === 'number' ? p.price : parseFloat(p.base_price || p.price || '0');
          const compareVal = typeof p.compare_at_price === 'number' ? p.compare_at_price : (p.compare_at_price ? parseFloat(p.compare_at_price) : undefined);
          const imgUrl = p.image_urls?.[0] || p.image_url || p.images?.[0]?.image_url || defaultBestSellers[idx % defaultBestSellers.length].image;
          
          const badges: Array<ProductItem['badge']> = [
            { type: 'top_rated', text: 'TOP RATED' },
            { type: 'best_value', text: 'BEST VALUE' },
            { type: 'high_demand', text: 'HIGH DEMAND' },
            { type: 'popular', text: 'POPULAR' },
            { type: 'new', text: 'NEW' }
          ];

          return {
            id: p.id || defaultBestSellers[idx % defaultBestSellers.length].id,
            name: p.name || defaultBestSellers[idx % defaultBestSellers.length].name,
            slug: p.slug || p.id,
            sku: p.sku || `SKU-${idx + 100}`,
            category: p.brand || (typeof p.category === 'object' ? p.category?.name : p.category) || defaultBestSellers[idx % defaultBestSellers.length].category,
            category_name: typeof p.category === 'object' ? p.category?.name : p.category || 'Industrial Equipment',
            
            price: priceVal > 0 ? priceVal : defaultBestSellers[idx % defaultBestSellers.length].price,
            compare_at_price: compareVal && compareVal > priceVal ? compareVal : defaultBestSellers[idx % defaultBestSellers.length].compare_at_price,
            image: imgUrl,
            badge: badges[idx % badges.length],
            stock_status: p.stock_status || (p.stock_quantity > 0 ? 'IN_STOCK' : 'IN_STOCK'),
            stock_quantity: p.stock_quantity || 25,
            short_description: p.short_description || p.description || defaultBestSellers[idx % defaultBestSellers.length].short_description,
            icon_type: defaultBestSellers[idx % defaultBestSellers.length].icon_type,
            specifications: p.specifications || defaultBestSellers[idx % defaultBestSellers.length].specifications,
            attributes: p.attributes || defaultBestSellers[idx % defaultBestSellers.length].attributes,
            brand: typeof p.brand === 'object' ? p.brand?.name : (p.brand || p.brand_id || defaultBestSellers[idx % defaultBestSellers.length].brand)
          };
        });

        // Ensure at least 3 best sellers are always available for the carousel
        if (mappedApiProducts.length >= 3) {
          setProducts(mappedApiProducts);
        } else {
          setProducts([...mappedApiProducts, ...defaultBestSellers.slice(mappedApiProducts.length)]);
        }
      } else {
        setProducts(defaultBestSellers);
        setIsLoading(false);
      }
    }).catch(() => {
      setProducts(defaultBestSellers);
      setIsLoading(false);
    });
  }, [defaultBestSellers]);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Auto slide loop on mobile screens only (itemsPerView === 1) without pausing
  useEffect(() => {
    if (itemsPerView !== 1 || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev < products.length - 1 ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [itemsPerView, products.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // Favorite toggle with feedback
  const toggleFavorite = (id: string, name: string) => {
    setFavorites(prev => {
      const isFav = !prev[id];
      if (isFav) {
        toast.success(`Added ${name} to Wishlist`, {
          icon: '❤️',
          style: {
            background: '#07153a',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }
        });
      } else {
        toast('Removed from Wishlist', {
          icon: '🤍',
          style: {
            background: '#07153a',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        });
      }
      return { ...prev, [id]: isFav };
    });
  };

  // Quick Add to Cart with visual success feedback
  const handleAddToCart = (product: ProductItem, qty = 1) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });

    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  // Render badge helper
  const renderBadge = (badge?: ProductItem['badge']) => {
    if (!badge) return null;

    if (badge.type === 'best_value') {
      return (
        <div className="bg-white/95 backdrop-blur-md text-blue-600 border border-blue-200/80 shadow-[0_2px_8px_rgba(37,99,235,0.15)] font-black text-[10px] tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1">
          <Star size={11} className="fill-blue-600 text-blue-600" />
          <span>{badge.text}</span>
        </div>
      );
    }

    if (badge.type === 'high_demand') {
      return (
        <div className="bg-white/95 backdrop-blur-md text-red-600 border border-red-200/80 shadow-[0_2px_8px_rgba(220,38,38,0.15)] font-black text-[10px] tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1">
          <Flame size={11} className="fill-red-600 text-red-600" />
          <span>{badge.text}</span>
        </div>
      );
    }

    if (badge.type === 'new') {
      return (
        <div className="bg-white/95 backdrop-blur-md text-emerald-600 border border-emerald-200/80 shadow-[0_2px_8px_rgba(16,185,129,0.15)] font-black text-[10px] tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1">
          <Sparkles size={11} className="text-emerald-600" />
          <span>{badge.text}</span>
        </div>
      );
    }

    // Default: TOP RATED / POPULAR
    return (
      <div className="bg-white/95 backdrop-blur-md text-red-600 border border-red-200/80 shadow-[0_2px_8px_rgba(220,38,38,0.15)] font-black text-[10px] tracking-wider px-2.5 py-1 rounded-full flex items-center space-x-1">
        <Star size={11} className="fill-red-600 text-red-600" />
        <span>{badge.text}</span>
      </div>
    );
  };

  // Render floating sub-category icon inside product image area
  const renderCategoryIcon = (type?: string) => {
    return (
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#0747a6] border border-blue-300/40 text-white flex items-center justify-center shadow-[0_4px_10px_rgba(7,71,166,0.4)]">
        {type === 'robot' ? (
          <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="M12 7v4"></path>
            <line x1="8" y1="16" x2="8" y2="16"></line>
            <line x1="16" y1="16" x2="16" y2="16"></line>
          </svg>
        ) : type === 'jack' ? (
          <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v6m-4 0h8M6 8l3 12h6l3-12M4 20h16"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 md:w-4.5 md:h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="4" width="14" height="16" rx="2"></rect>
            <path d="M12 2v2m0 16v2M9 12h6"></path>
          </svg>
        )}
      </div>
    );
  };

  return (
    <section 
      id="featured-best-sellers" 
      className="relative w-full bg-[#020719] py-16 md:py-24 overflow-hidden"
    >
      {/* ========================================================
          1. INDUSTRIAL AMBIENT BACKGROUND & LIGHTING
          ======================================================== */}
      {/* Deep Navy Gradient Underlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010411] via-[#040e2b] to-[#020719] pointer-events-none" />

      {/* Atmospheric Blue Radial Glow (Left-Center) */}
      <div className="absolute top-[20%] left-[-5%] w-[650px] h-[650px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />
      
      {/* Atmospheric Red Glow (Top-Right Angle) */}
      <div className="absolute top-[-5%] right-[-5%] w-[550px] h-[550px] bg-red-600/12 blur-[130px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Industrial Diagonal Highlights & Machined Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 40px)`
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        
        {/* ========================================================
            2. SECTION HEADER
            ======================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            {/* Small Eyebrow with Red Line */}
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="text-[#ef4444] text-xs font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                FEATURED PRODUCTS
              </span>
              <div className="w-9 h-[2.5px] bg-[#ef4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>

            {/* Main Heading */}
            <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mb-2">
              Best Sellers
            </h2>

            {/* Supporting Text */}
            <p className="font-sans text-slate-400 text-sm md:text-[15px] font-normal max-w-xl">
              Most trusted industrial equipment by our customers
            </p>
          </div>

          {/* Premium "View All Products →" Button */}
          <Link
            to="/shop"
            className="self-start md:self-auto group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#08153b]/80 hover:bg-[#0c2058] border border-blue-400/30 hover:border-red-500/50 backdrop-blur-xl text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all duration-300 active:scale-95"
          >
            <span>View All Products</span>
            <ArrowRight 
              size={15} 
              className="text-red-400 group-hover:text-red-300 transition-transform duration-300 group-hover:translate-x-1" 
            />
          </Link>
        </div>

        {/* ========================================================
            3. LIQUID-GLASS TRUST & BENEFIT STRIP
            ======================================================== */}
        <div className="w-full bg-[#071333]/85 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 mb-10 md:mb-12 shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-4 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x-0 lg:divide-x divide-white/10">
            
            {/* Item 1: Premium Quality */}
            <div className="flex items-center space-x-3.5 py-3 sm:py-0 lg:px-3">
              <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-400/35 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-sm font-black tracking-tight leading-snug">Premium Quality</h4>
                <p className="text-slate-400 text-xs truncate">Industrial grade products</p>
              </div>
            </div>

            {/* Item 2: Reliable Performance */}
            <div className="flex items-center space-x-3.5 py-3 sm:py-0 lg:px-4">
              <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-400/35 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] shrink-0">
                <Settings size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-sm font-black tracking-tight leading-snug">Reliable Performance</h4>
                <p className="text-slate-400 text-xs truncate">Tested for durability</p>
              </div>
            </div>

            {/* Item 3: Fast Delivery */}
            <div className="flex items-center space-x-3.5 py-3 sm:py-0 lg:px-4">
              <div className="w-11 h-11 rounded-full bg-red-600/20 border border-red-500/35 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)] shrink-0">
                <Truck size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-sm font-black tracking-tight leading-snug">Fast Delivery</h4>
                <p className="text-slate-400 text-xs truncate">Islandwide & worldwide</p>
              </div>
            </div>

            {/* Item 4: Expert Support */}
            <div className="flex items-center space-x-3.5 py-3 sm:py-0 lg:px-4">
              <div className="w-11 h-11 rounded-full bg-red-600/20 border border-red-500/35 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)] shrink-0">
                <Headphones size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-white text-sm font-black tracking-tight leading-snug">Expert Support</h4>
                <p className="text-slate-400 text-xs truncate">Technical assistance</p>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            4. PRODUCT CAROUSEL & NEUMORPHIC CARDS
            ======================================================== */}
        <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          
          {/* Navigation Controls (Left Button) */}
          <button
            onClick={handlePrev}
            aria-label="Previous products"
            className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#07153a]/90 hover:bg-[#0d2666] border border-blue-400/35 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Navigation Controls (Right Button) */}
          <button
            onClick={handleNext}
            aria-label="Next products"
            className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#07153a]/90 hover:bg-[#0d2666] border border-blue-400/35 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
          >
            <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Cards Container with Smooth Sliding Window */}
          <div className="overflow-hidden py-4 px-1 -mx-1">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {products
                .slice(currentIndex, currentIndex + itemsPerView)
                .map((product) => {
                  const isFavorite = !!favorites[product.id];
                  const isAdded = !!addedItemIds[product.id];
                  const displayPrice = `Rs. ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  const displayComparePrice = product.compare_at_price 
                    ? `Rs. ${product.compare_at_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                    : null;

                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                      className="group relative flex flex-col justify-between rounded-[26px] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-2 cursor-default"
                      style={{
                        backgroundColor: '#f1f4f9',
                        boxShadow: '0 20px 45px rgba(0,0,0,0.45), 0 6px 18px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.95)',
                        border: '1px solid rgba(255,255,255,0.85)'
                      }}
                    >
                      {/* Top Controls: Badge (Left) + Wishlist (Right) */}
                      <div className="flex items-center justify-between w-full mb-2 z-10">
                        <div>
                          {renderBadge(product.badge)}
                        </div>

                        {/* Circular Neumorphic Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(product.id, product.name)}
                          aria-label={`Favorite ${product.name}`}
                          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-red-500 shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-slate-200/70 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <Heart 
                            size={16} 
                            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'} 
                          />
                        </button>
                      </div>

                      {/* Product Image Area */}
                      <div 
                        onClick={() => navigate(`/product/${product.slug || product.id}`)}
                        className="relative w-full h-52 sm:h-56 bg-gradient-to-b from-white via-[#fcfdff] to-[#eaf0f8] rounded-2xl p-4 flex items-center justify-center my-3 border border-white/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden cursor-pointer group/img"
                      >
                        {/* Radial Glow in Backdrop */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,243,255,0.9)_0%,rgba(215,228,245,0.35)_70%,transparent_100%)] pointer-events-none" />

                        {/* Concentric Technical Rings Accent */}
                        <div className="absolute w-40 h-40 rounded-full border border-blue-500/10 pointer-events-none" />
                        <div className="absolute w-28 h-28 rounded-full border border-blue-500/15 pointer-events-none" />

                        {/* Product Image */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 group-hover/img:scale-105 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                        />

                        {/* Floating Category Indicator Icon (Bottom-Right) */}
                        <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                          {renderCategoryIcon(product.icon_type)}
                        </div>
                      </div>

                      {/* Product Meta & Information */}
                      <div className="flex-1 flex flex-col justify-between pt-1">
                        <div>
                          {/* Brand Name */}
                          {product.brand && (
                            <div className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest mb-1 flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5 inline-block animate-pulse"></span>
                              {product.brand}
                            </div>
                          )}
                          {!product.brand && (
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              {product.category || 'ABLE'}
                            </div>
                          )}

                          {/* Product Name */}
                          <h3 
                            onClick={() => navigate(`/product/${product.slug || product.id}`)}
                            title={product.name}
                            className="font-sans text-[#0b1042] font-semibold text-[15px] md:text-[17px] leading-[1.4] line-clamp-2 hover:text-red-600 transition-colors cursor-pointer mb-2"
                          >
                            {product.name}
                          </h3>
                          
                          {/* Specifications Capsules */}
                          {(product.specifications || product.attributes) && Object.keys(product.specifications || product.attributes || {}).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                              {Object.entries(product.specifications || product.attributes || {}).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center shadow-sm border border-slate-200">
                                  <span className="text-slate-400 mr-1">{key}:</span>
                                  <span className="truncate max-w-[80px]" title={value as string}>{value as string}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Pricing and Stock Status */}
                        <div>
                          <div className="flex items-baseline space-x-2 mb-1.5">
                            {settings.show_prices ? (
                              <>
                                <span className="font-sans text-[18px] sm:text-[20px] md:text-[22px] font-bold text-[#dc2626] tracking-tight">
                                  {displayPrice}
                                </span>
                                {displayComparePrice && (
                                  <span className="font-sans text-slate-400 line-through text-[13px] sm:text-[14px] font-medium ml-2">
                                    {displayComparePrice}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-blue-900 font-bold text-base bg-blue-100 px-3 py-1 rounded-full">Price on Request</span>
                            )}
                          </div>

                          {/* Stock Status Indicator */}
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                            <span>In Stock</span>
                          </div>
                        </div>

                        {/* Action Footer: Add to Cart (Primary) + Quick View (Secondary) */}
                        <div className="flex items-center space-x-2.5 pt-1">
                          
                          {/* Primary CTA */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer ${
                              isAdded 
                                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                : 'bg-[#061539] hover:bg-[#0b245c] text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check size={16} className="text-white" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} />
                                <span>{settings.enable_checkout ? 'Add to Cart' : 'Request Quote'}</span>
                              </>
                            )}
                          </button>

                          {/* Quick View Button */}
                          <button
                            onClick={() => {
                              setQuickViewProduct(product);
                              setQuickViewQuantity(1);
                            }}
                            title="Quick View"
                            aria-label={`Quick view ${product.name}`}
                            className="w-11 h-11 rounded-xl bg-white hover:bg-slate-50 text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/80 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
                          >
                            <Eye size={17} />
                          </button>

                        </div>

                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          </div>

        </div>

        {/* ========================================================
            5. BOTTOM TRUST INDICATOR & CAROUSEL PAGINATION
            ======================================================== */}
        <div className="mt-10 md:mt-14 flex items-center justify-center space-x-4">
          
          {/* Left Pagination Dots */}
          <div className="hidden sm:flex items-center space-x-1.5 opacity-40">
            {Array.from({ length: Math.min(6, products.length) }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'bg-blue-400 w-4' : 'bg-white/30'
                }`} 
              />
            ))}
          </div>

          {/* Centered Industrial Trust Capsule */}
          <div className="bg-[#071333]/90 backdrop-blur-xl border border-white/12 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={14} />
            </div>
            <p className="text-white text-xs sm:text-sm font-semibold tracking-wide">
              Trusted by <span className="text-blue-400 font-black">2,000+</span> businesses across Sri Lanka
            </p>
          </div>

          {/* Right Pagination Dots */}
          <div className="hidden sm:flex items-center space-x-1.5 opacity-40">
            {Array.from({ length: Math.min(6, products.length) }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'bg-blue-400 w-4' : 'bg-white/30'
                }`} 
              />
            ))}
          </div>

        </div>

      </div>

        {/* ========================================================
            6. QUICK VIEW MODAL (LIQUID GLASS INDUSTRIAL UI)
            ======================================================== */}
        <AnimatePresence>
          {quickViewProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              
              {/* Dark Liquid-Glass Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setQuickViewProduct(null)}
                className="absolute inset-0 bg-[#000a23]/75 backdrop-blur-[12px]"
              />
  
              {/* Modal Dialog Body */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-gradient-to-b from-[#08173e] via-[#040e29] to-[#020718] border border-blue-400/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-20"
                >
                  <X size={18} />
                </button>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  
                  {/* Product Image Container in Modal */}
                  <div className="w-full h-64 sm:h-72 bg-gradient-to-b from-white to-[#edf2f7] rounded-2xl p-4 flex items-center justify-center border border-white/80 shadow-inner relative overflow-hidden">
                    <img
                      src={quickViewProduct.image}
                      alt={quickViewProduct.name}
                      className="max-h-full max-w-full object-contain drop-shadow-md"
                    />
                    <div className="absolute top-3 left-3">
                      {renderBadge(quickViewProduct.badge)}
                    </div>
                  </div>
  
                  {/* Details Column */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        {quickViewProduct.category || 'Industrial Equipment'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mt-1 mb-2">
                        {quickViewProduct.name}
                      </h3>
                      
                      {quickViewProduct.sku && (
                        <p className="text-[11px] text-slate-400 font-mono mb-3">
                          SKU: {quickViewProduct.sku}
                        </p>
                      )}
  
                      <div className="flex items-baseline space-x-3 mb-3">
                        {settings.show_prices ? (
                          <>
                            <span className="text-2xl font-black text-[#dc2626]">
                              Rs. {quickViewProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            {quickViewProduct.compare_at_price && (
                              <span className="text-slate-400 line-through text-sm">
                                Rs. {quickViewProduct.compare_at_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-blue-200 font-bold text-base bg-blue-900/50 px-3 py-1 rounded-full">Price on Request</span>
                        )}
                      </div>
  
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                        {quickViewProduct.short_description}
                      </p>
  
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>In Stock • Ready for Dispatch</span>
                      </div>
                    </div>
  
                    {/* Quantity and Actions */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400 font-semibold">Qty:</span>
                        <div className="flex items-center bg-[#020719] border border-white/15 rounded-xl p-1 shadow-inner">
                          <button
                            onClick={() => setQuickViewQuantity(q => Math.max(1, q - 1))}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-10 text-center text-sm font-bold text-white">
                            {quickViewQuantity}
                          </span>
                          <button
                            onClick={() => setQuickViewQuantity(q => q + 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
  
                      <div className="flex items-center space-x-2.5 pt-1">
                        <button
                          onClick={() => {
                            handleAddToCart(quickViewProduct, quickViewQuantity);
                            setQuickViewProduct(null);
                          }}
                          className="flex-1 metallic-red-bg hover:opacity-95 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-red-900/40 active:scale-95 transition-all"
                        >
                          <ShoppingCart size={16} />
                          <span>{settings.enable_checkout ? 'Add' : 'Request'} {quickViewQuantity > 1 ? `(${quickViewQuantity})` : ''} {settings.enable_checkout ? 'to Cart' : 'Quote'}</span>
                        </button>
  
                        <Link
                          to={`/product/${quickViewProduct.slug || quickViewProduct.id}`}
                          onClick={() => setQuickViewProduct(null)}
                          className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors"
                        >
                          <span>Details</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
  
                  </div>
  
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
  
        <QuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          product={quoteProduct}
        />
      </section>
    );
  }

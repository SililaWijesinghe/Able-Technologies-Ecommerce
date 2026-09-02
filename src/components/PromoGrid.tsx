import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Puzzle, 
  Gauge, 
  Sliders, 
  Award, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { fetchCategories, fetchProducts } from '../services/api';

interface PromoBannerItem {
  id: string;
  theme: 'blue' | 'red';
  eyebrow: string;
  titleTop: string;
  titleHighlight: string;
  description: string;
  features: {
    icon: typeof ShieldCheck;
    text: string;
  }[];
  image: string;
  imageAlt: string;
  ctaText: string;
  ctaLink: string;
  statNumber: string;
  statLabel: string;
  statIcon: typeof Settings;
}

export default function PromoGrid() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchCategories().then(cats => {
      if (cats && Array.isArray(cats)) {
        setCategories(cats);
      }
    });

    fetchProducts().then(products => {
      if (products && Array.isArray(products)) {
        const counts: { [key: string]: number } = { total: products.length };
        products.forEach(p => {
          const catId = p.category_id || p.category?.id || p.category?.slug;
          if (catId) {
            counts[catId] = (counts[catId] || 0) + 1;
          }
        });
        setProductCounts(counts);
      }
    });
  }, []);

  // Match category slugs dynamically if available from DB
  const getCategoryLink = (slugOrName: string, fallbackParam: string) => {
    const found = categories.find(c => 
      c.slug?.toLowerCase() === slugOrName.toLowerCase() ||
      c.name?.toLowerCase().includes(slugOrName.toLowerCase())
    );
    if (found) {
      return `/shop?category=${found.slug || found.id}`;
    }
    return `/shop?category=${fallbackParam}`;
  };

  const banners: PromoBannerItem[] = [
    {
      id: 'machines',
      theme: 'blue',
      eyebrow: 'PREMIUM QUALITY',
      titleTop: 'INDUSTRIAL',
      titleHighlight: 'MACHINES',
      description: 'Built for Precision, Engineered to Last.',
      features: [
        { icon: ShieldCheck, text: 'Heavy Duty Performance' },
        { icon: Cpu, text: 'Advanced Technology' },
        { icon: CheckCircle2, text: 'Reliable & Durable' },
      ],
      image: 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/banner_images/1stBluebanner.png',
      imageAlt: 'High-precision industrial CNC machinery',
      ctaText: 'Explore Machines',
      ctaLink: getCategoryLink('machines', 'local-machines'),
      statNumber: '100+',
      statLabel: 'Machines',
      statIcon: Settings,
    },
    {
      id: 'spare-parts',
      theme: 'red',
      eyebrow: 'WIDE RANGE',
      titleTop: 'SPARE',
      titleHighlight: 'PARTS',
      description: 'Keep Your Machines Running Smoothly.',
      features: [
        { icon: Sparkles, text: 'Original Quality' },
        { icon: ShieldCheck, text: 'Maximum Durability' },
        { icon: Puzzle, text: 'Perfect Compatibility' },
      ],
      image: 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/banner_images/2ndRedbanner.png',
      imageAlt: 'Industrial spare parts, bearings and filters',
      ctaText: 'Shop Parts',
      ctaLink: getCategoryLink('spare-parts', 'spare-parts'),
      statNumber: '5000+',
      statLabel: 'Parts',
      statIcon: Puzzle,
    },
    {
      id: 'gauges',
      theme: 'blue',
      eyebrow: 'ACCURATE & RELIABLE',
      titleTop: 'GAUGES &',
      titleHighlight: 'ACCESSORIES',
      description: 'Precision You Can Trust.',
      features: [
        { icon: Gauge, text: 'High Accuracy' },
        { icon: Sliders, text: 'Industrial Grade' },
        { icon: Award, text: 'Long Lasting' },
      ],
      image: 'https://hitbamkdctinwdwiwxcl.supabase.co/storage/v1/object/public/banner_images/3rdBluebanner.png',
      imageAlt: 'Precision industrial pressure gauges and accessories',
      ctaText: 'View Gauges',
      ctaLink: getCategoryLink('gauges', 'gauges'),
      statNumber: '200+',
      statLabel: 'Products',
      statIcon: Settings,
    },
  ];

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
      setActiveSlide(index);
    }
  };

  // Continuous auto-sliding loop (does not stop on hover)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => {
        const nextSlide = (prev + 1) % banners.length;
        scrollToSlide(nextSlide);
        return nextSlide;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollPos = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.clientWidth;
      const newIndex = Math.round(scrollPos / cardWidth);
      if (newIndex !== activeSlide && newIndex >= 0 && newIndex < banners.length) {
        setActiveSlide(newIndex);
      }
    }
  };

  return (
    <section className="relative w-full py-12 md:py-16 bg-[#f8fafc] overflow-hidden border-y border-slate-200/60">
      {/* Subtle Technical Ambient Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl translate-y-1/2"></div>
        <div 
          className="absolute inset-0 bg-[radial-gradient(#0b1042_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.035]"
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Intro Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-6 h-0.5 bg-red-600 rounded-full"></span>
              <span className="text-red-600 font-bold text-xs uppercase tracking-widest">
                FEATURED SOLUTIONS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b1042] tracking-tight">
              Explore Our Industrial Solutions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              From complete machinery to essential spare parts and precision accessories.
            </p>
          </div>

          {/* Mobile Carousel Navigation Arrows */}
          <div className="flex md:hidden items-center space-x-2 mt-4">
            <button
              onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
              disabled={activeSlide === 0}
              aria-label="Previous promotional banner"
              className="p-2 rounded-full border border-slate-200 bg-white text-[#0b1042] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollToSlide(Math.min(banners.length - 1, activeSlide + 1))}
              disabled={activeSlide === banners.length - 1}
              aria-label="Next promotional banner"
              className="p-2 rounded-full border border-slate-200 bg-white text-[#0b1042] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Banners Grid / Horizontal Mobile Carousel */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {banners.map((banner, index) => {
            const isRed = banner.theme === 'red';
            const StatIcon = banner.statIcon;

            return (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative flex flex-col justify-between bg-white rounded-[26px] border border-slate-200/90 shadow-[0_10px_30px_rgba(15,23,42,0.06),0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(11,16,66,0.12),0_4px_12px_rgba(11,16,66,0.06)] hover:-translate-y-1.5 transition-all duration-300 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center shrink-0 overflow-hidden"
              >
                {/* Subtle Card Glow Accents */}
                <div 
                  className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                    isRed 
                      ? 'bg-red-500/10 group-hover:bg-red-500/15' 
                      : 'bg-blue-500/10 group-hover:bg-blue-500/15'
                  }`}
                />

                {/* Technical Blueprint Vector Rings in Card Backdrop */}
                <div className="absolute right-[-20px] top-[140px] w-56 h-56 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-500">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-slate-400">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" />
                  </svg>
                </div>

                {/* Card Header & Content */}
                <div className="p-6 sm:p-7 relative z-10">
                  
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isRed ? 'text-red-600' : 'text-blue-600'}`}>
                      {banner.eyebrow}
                    </span>
                    <span className={`w-4 h-0.5 rounded-full ${isRed ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-2xl sm:text-[28px] font-black italic tracking-tight leading-[1.1] mb-2 uppercase">
                    <span className="text-[#0b1042] block">{banner.titleTop}</span>
                    <span className={`block ${isRed ? 'text-red-600' : 'text-blue-600'}`}>
                      {banner.titleHighlight}
                    </span>
                  </h3>

                  {/* Supporting Copy */}
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5 max-w-[220px] leading-relaxed">
                    {banner.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 mb-6">
                    {banner.features.map((feat, idx) => {
                      const Icon = feat.icon;
                      return (
                        <div 
                          key={idx} 
                          className="flex items-center space-x-2.5 group/feat"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover/feat:scale-110 shadow-sm ${
                            isRed 
                              ? 'bg-red-50 text-red-600 border-red-100' 
                              : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            <Icon size={13} strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 tracking-tight">
                            {feat.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hero Product Image Area */}
                <div className="relative w-full h-48 sm:h-56 px-6 flex items-center justify-center z-10 mt-auto">
                  
                  {/* Subtle Floor Contact Shadow & Pedestal */}
                  <div className="absolute bottom-2 w-3/4 h-6 bg-slate-900/10 rounded-[100%] blur-md pointer-events-none"></div>

                  <img 
                    src={banner.image} 
                    alt={banner.imageAlt}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_20px_rgba(15,23,42,0.14)] transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2"
                    loading="lazy"
                  />
                </div>

                {/* Card Bottom: CTA Button & Metric Stat Pill */}
                <div className="p-6 sm:p-7 pt-4 border-t border-slate-100/90 relative z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-transparent to-slate-50/50">
                  
                  {/* Action CTA Button */}
                  <Link
                    to={banner.ctaLink}
                    className={`inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white px-5 py-3 rounded-full transition-all duration-300 shadow-md group/btn ${
                      isRed
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-600/25 hover:shadow-red-600/40 hover:-translate-y-0.5'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5'
                    }`}
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>

                  {/* Liquid-Glass Metric Stat Pill */}
                  <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3 py-1.5 shadow-sm text-right shrink-0">
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-black tracking-tight leading-none ${isRed ? 'text-red-600' : 'text-blue-600'}`}>
                        {banner.statNumber}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-500 tracking-tight leading-tight mt-0.5">
                        {banner.statLabel}
                      </span>
                    </div>
                    <div className={`p-1 rounded-full ${isRed ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                      <StatIcon size={13} />
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Mobile Carousel Indicators */}
        <div className="flex md:hidden justify-center items-center space-x-2 mt-4">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx 
                  ? 'w-6 bg-red-600' 
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}


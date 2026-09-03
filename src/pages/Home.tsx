import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Headphones, LayoutGrid, ShieldCheck, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CategoryCards from '../components/CategoryCards';
import TrustBar from '../components/TrustBar';
import PromoGrid from '../components/PromoGrid';
import BestSellers from '../components/BestSellers';
import WhyChooseUs from '../components/WhyChooseUs';
import NewsletterCTA from '../components/NewsletterCTA';
import heroBg from '../assets/heroBg.webp';
import toolImg from '../assets/Tool.png';

const HERO_SLIDES = [
  {
    tagline: "PRECISION. PERFORMANCE. POSSIBILITIES.",
    headingTitle1: "ALL KIND OF",
    headingTitle2: "MACHINE MAKERS",
    description: "Your one-stop solution for high-quality machines, spare parts, gauges and industrial supplies.",
    ctaText: "Shop Now",
    ctaLink: "/shop"
  },
  {
    tagline: "ADVANCED ENGINEERING & AUTOMATION",
    headingTitle1: "INDUSTRIAL CNC &",
    headingTitle2: "HEAVY MACHINERY",
    description: "Explore cutting-edge multi-axis machining centers, laser cutters, and high-precision production gear.",
    ctaText: "Explore Machinery",
    ctaLink: "/shop"
  },
  {
    tagline: "CERTIFIED DURABILITY & SUPPORT",
    headingTitle1: "PRECISION GAUGES &",
    headingTitle2: "SPARE PARTS",
    description: "Genuine replacement components, calibration gauges, and expert technical support for zero downtime.",
    ctaText: "View Spare Parts",
    ctaLink: "/shop"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full min-h-[700px] md:min-h-[850px] bg-[#04081c] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat pb-10 md:pb-24"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark Navy Faded Overlay for Text Highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020516] via-[#080d35]/85 to-transparent z-0 w-full"></div>
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-red-600/20 via-red-900/10 to-transparent z-0 mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] pointer-events-none mix-blend-screen z-0"></div>

        {/* Floating Tool Image (Robotic Arm) */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute right-[-15%] md:right-0 bottom-[10%] md:bottom-[-5%] w-[85%] md:w-[55%] h-[60%] md:h-[115%] z-10 pointer-events-none flex items-end justify-center opacity-40 md:opacity-100"
        >
          <div className="relative w-full h-full flex justify-center items-end">
            <motion.img 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              src={toolImg} 
              alt="Industrial Robotic Arm" 
              className="h-full w-auto object-contain relative z-10 drop-shadow-[-25px_15px_25px_rgba(0,0,0,0.6)]"
            />
            {/* Ground Shadow for Base */}
            <div className="absolute bottom-[3%] left-[45%] -translate-x-1/2 w-[35%] h-[40px] bg-black/70 blur-[20px] rounded-[100%] z-0"></div>
            <div className="absolute bottom-[2%] left-[45%] -translate-x-1/2 w-[25%] h-[20px] bg-black/90 blur-[10px] rounded-[100%] z-0"></div>
          </div>
        </motion.div>

        {/* Hero Content with AnimatePresence for smooth slide transition */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col pt-40 md:pt-56 lg:pt-[280px]">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="flex items-center mb-4 md:mb-5 w-fit">
                <div className="w-1.5 md:w-2 h-4 md:h-5 bg-gradient-to-b from-red-200 via-red-600 to-red-800 transform -skew-x-[20deg] mr-2 shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>
                <div className="relative flex items-center pr-12 md:pr-20 pl-2 md:pl-3 py-1 md:py-1.5">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#b30000] via-[#7a0000]/70 to-transparent transform -skew-x-[20deg] origin-left border-l-[3px] border-[#ff3333]"></div>
                  <span className="relative font-sans text-white font-bold italic tracking-widest text-[10px] md:text-[11px] uppercase z-10 drop-shadow-sm">
                    {slide.tagline}
                  </span>
                </div>
              </div>

              <h2 className="font-poppins text-4xl md:text-6xl font-extrabold italic tracking-tight uppercase leading-[1.1] mb-4 md:mb-6">
                <span className="text-white block">{slide.headingTitle1}</span>
                <span className="metallic-red-text block">{slide.headingTitle2}</span>
              </h2>

              <p className="font-sans text-gray-300 text-[15px] md:text-[18px] max-w-[85%] md:max-w-xl mb-6 md:mb-10 leading-[1.6]">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Features Row */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-8 md:mb-12 w-full max-w-2xl">
            <div className="flex items-center space-x-2.5 sm:space-x-3 bg-blue-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} className="text-red-400 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-sans text-white text-[11px] sm:text-[13px] font-semibold tracking-tight truncate">Premium Quality</span>
                <span className="font-sans text-gray-300 text-[10px] sm:text-[12px] truncate">Industrial grade</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2.5 sm:space-x-3 bg-blue-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Award size={16} className="text-blue-400 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-sans text-white text-[11px] sm:text-[13px] font-semibold tracking-tight truncate">Reliable Performance</span>
                <span className="font-sans text-gray-300 text-[10px] sm:text-[12px] truncate">Tested for durability</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 sm:space-x-3 bg-blue-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <Truck size={16} className="text-red-400 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-sans text-white text-[11px] sm:text-[13px] font-semibold tracking-tight truncate">Fast Delivery</span>
                <span className="font-sans text-gray-300 text-[10px] sm:text-[12px] truncate">Islandwide delivery</span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 sm:space-x-3 bg-blue-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Headphones size={16} className="text-blue-400 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="font-sans text-white text-[11px] sm:text-[13px] font-semibold tracking-tight truncate">Expert Support</span>
                <span className="font-sans text-gray-300 text-[10px] sm:text-[12px] truncate">Technical assistance</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons & Slide Indicators */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            >
              <Link to={slide.ctaLink} className="metallic-red-bg font-sans text-white rounded-full px-6 py-3.5 md:px-8 md:py-3.5 flex items-center justify-center space-x-3 font-semibold transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-900/50 shadow-lg shadow-red-900/40 text-sm md:text-[15px] w-full sm:w-auto">
                <span>{slide.ctaText}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link to="/shop" className="bg-transparent font-sans border border-blue-400 text-white rounded-full px-6 py-3.5 md:px-8 md:py-3.5 flex items-center justify-center space-x-3 font-semibold hover:bg-blue-900/50 transition-colors backdrop-blur-sm text-sm md:text-[15px] w-full sm:w-auto hover:-translate-y-0.5">
                <span>View Categories</span>
                <LayoutGrid size={18} />
              </Link>
            </motion.div>

            {/* Slide Dots & Manual Controls */}
            <div className="flex items-center space-x-4 self-center md:self-auto pb-4 md:pb-0">
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-9 h-9 rounded-full bg-blue-950/60 border border-white/20 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors cursor-pointer shadow-md"
                title="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center space-x-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-red-600 shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'w-2.5 bg-white/30 hover:bg-white/60'}`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-9 h-9 rounded-full bg-blue-950/60 border border-white/20 text-white flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-colors cursor-pointer shadow-md"
                title="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </motion.section>

      {/* Main Page Content */}
      <CategoryCards />
      <TrustBar />
      <PromoGrid />
      <BestSellers />
      <WhyChooseUs />
      <NewsletterCTA />
    </>
  );
}

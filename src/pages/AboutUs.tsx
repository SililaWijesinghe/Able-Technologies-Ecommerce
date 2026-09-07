import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Globe, Shield, Wrench, ChevronRight, Users, TrendingUp, Building, Laptop, Activity, Factory, ChevronDown, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/heroBg.webp';

// Pre-defined animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState<number | null>(0);

  const toggleTab = (index: number) => {
    setActiveTab(activeTab === index ? null : index);
  };

  const ecosystemData = [
    {
      title: "Manufacturing",
      icon: <Factory size={24} />,
      color: "from-blue-600 to-blue-800",
      items: [
        "Machine (Rent / Sale)",
        "Customized Machines (Local / Export)",
        "Machine Parts (Local / Export)",
        "Standard Sizes"
      ]
    },
    {
      title: "Repair & Maintenance",
      icon: <Wrench size={24} />,
      color: "from-[#1c2463] to-[#0b1042]",
      items: [
        "Machine Modification",
        "Comprehensive Repair",
        "Precision Calibration"
      ]
    },
    {
      title: "Spare Parts",
      icon: <Settings size={24} />,
      color: "from-gray-700 to-gray-900",
      items: [
        "Heating Elements",
        "Pneumatic Items",
        "Other Machinery Parts"
      ]
    },
    {
      title: "DNS Glue",
      icon: <Layers size={24} />,
      color: "from-red-600 to-red-800",
      items: [
        "Product Introduction",
        "Sole Agent Rights",
        "Technical Knowledge Transfer"
      ]
    },
    {
      title: "Other Services",
      icon: <Activity size={24} />,
      color: "from-blue-500 to-cyan-600",
      items: [
        "Consultation & Training",
        "Sample Making",
        "Testing & Recommendation"
      ]
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative w-full pt-32 md:pt-44 pb-20 md:pb-32 bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a2b]/95 via-[#0b1042]/80 to-[#0b1042]/40 z-0 w-full"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none transform skew-x-12"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            {/* Breadcrumb */}
            <motion.div variants={fadeInUp} className="flex items-center text-gray-300 text-[11px] md:text-sm mb-6 uppercase tracking-wider font-semibold">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-500" />
              <span className="text-white">About Us</span>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-4 bg-red-600 transform -skew-x-[20deg] shadow-[0_0_8px_rgba(255,0,0,0.5)]" />
              <span className="text-white font-bold tracking-widest text-[10px] md:text-xs uppercase bg-white/10 px-3 py-1 border-l-2 border-red-600">
                Discover Our Story
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold italic tracking-tight uppercase leading-[1.1] mb-6 text-white">
              ABOUT <span className="metallic-red-text">US</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-gray-300 text-[15px] md:text-[17px] leading-relaxed mb-10 max-w-2xl border-l-2 border-white/20 pl-4">
              At Able Technologies, we are committed to delivering high-quality machines, components, and services that power modern industries with precision and reliability.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. OVERVIEW BENTO BOX */}
      <section className="py-16 md:py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center mb-10 md:mb-16 justify-center md:justify-start">
             <div className="w-1.5 h-6 bg-red-600 mr-3 hidden md:block"></div>
             <h2 className="text-[#0b1042] font-black text-2xl md:text-3xl tracking-tight uppercase text-center md:text-left">
               Key Business Areas
             </h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { icon: Settings, title: "High-Tech Bonding Machines", desc: "Manufacturing state-of-the-art heat transfer and bonding machines.", colSpan: "lg:col-span-2", bg: "bg-blue-50/50" },
              { icon: Globe, title: "Importer & Distributor", desc: "Supplying high-quality pneumatic components and accessories globally.", colSpan: "lg:col-span-1", bg: "bg-white" },
              { icon: Shield, title: "Sole Agent", desc: "Exclusive provider for DNS brand 'NO SEW' PU base glue.", colSpan: "lg:col-span-1", bg: "bg-white" },
              { icon: Wrench, title: "Total Service Provider", desc: "Comprehensive garment manufacturing solutions including testing, applications, QC, and process control.", colSpan: "lg:col-span-4", bg: "bg-[#0b1042] text-white" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className={`${item.colSpan} ${item.bg} rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-center`}
              >
                {/* Background decorative element */}
                <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <item.icon size={120} />
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shrink-0 relative z-10 ${item.bg.includes('#0b1042') ? 'bg-white/10 text-cyan-400' : 'bg-blue-100/50 text-blue-600 group-hover:bg-red-50 group-hover:text-red-600 transition-colors'}`}>
                  <item.icon size={24} />
                </div>
                <h3 className={`text-lg md:text-xl font-bold mb-3 leading-tight relative z-10 ${item.bg.includes('#0b1042') ? 'text-white' : 'text-[#0b1042]'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm md:text-base leading-relaxed relative z-10 ${item.bg.includes('#0b1042') ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
                
                {/* Hover line indicator */}
                {!item.bg.includes('#0b1042') && (
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. STRUCTURE / ECOSYSTEM SECTION */}
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Corporate Ecosystem</span>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4 uppercase tracking-tight">Our Structure</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">The operational divisions driving Able Technologies forward.</p>
          </div>

          {/* Desktop/Tablet Grid View */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemData.map((node, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${node.color}`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white bg-gradient-to-br ${node.color} shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform`}>
                  {node.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0b1042] mb-6">{node.title}</h3>
                <ul className="space-y-3">
                  {node.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={16} />
                      <span className="text-gray-600 text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Mobile Accordion View */}
          <div className="md:hidden space-y-3">
            {ecosystemData.map((node, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleTab(idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${node.color} shadow-sm shrink-0`}>
                      {node.icon}
                    </div>
                    <span className="font-bold text-[#0b1042] text-sm tracking-wide">{node.title}</span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-400 transition-transform duration-300 ${activeTab === idx ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                <AnimatePresence>
                  {activeTab === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 bg-white border-t border-gray-50">
                        <ul className="space-y-3 mt-3">
                          {node.items.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={16} />
                              <span className="text-gray-600 text-sm font-medium leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CULTURE SECTION */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-[2px] w-8 bg-red-600" />
                <span className="text-red-600 font-bold tracking-widest text-xs md:text-sm uppercase">Our Culture</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] leading-tight uppercase tracking-tight">
                People Drive <br />Our Progress
              </h2>
              <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed border-l-4 border-gray-100 pl-6 mt-6">
                <p>
                  <strong className="text-[#0b1042]">Enterprise culture</strong> is a moving source, using "people" as the core of establishing enterprise culture, utilizing advanced management models to give employees a modern, relaxing, and humane working environment.
                </p>
                <p>
                  The people of ABLE Technologies have the courage for any experiment, the quest for mind development, and continually shift toward a "Quality, Service and Innovation" enterprise model.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0b1042] rounded-[2rem] p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(11,16,66,0.3)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {[
                { icon: Users, title: "People First", desc: "Our team is our greatest strength." },
                { icon: TrendingUp, title: "Continuous Improvement", desc: "Always learning, always evolving." },
                { icon: Building, title: "Modern Workspace", desc: "A safe and supportive place to thrive." },
                { icon: Shield, title: "Quality Driven", desc: "Committed to excellence in everything." }
              ].map((val, idx) => (
                <div key={idx} className="space-y-4 relative z-10 group bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-cyan-400 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300">
                    <val.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg mb-1">{val.title}</h4>
                    <p className="text-gray-400 text-xs md:text-sm">{val.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FACILITY GRID SECTION */}
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Our Facility</span>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4 uppercase tracking-tight">Manufacturing Environment</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">A modern facility equipped for innovation, precision, and world-class quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", title: "Company Premises", desc: "Our office and main facility", icon: Building },
              { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", title: "Design & Development", desc: "Modern workspace for research", icon: Laptop },
              { img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800", title: "Machine Assembly", desc: "Building industrial machines", icon: Wrench },
              { img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800", title: "Testing & Calibration", desc: "Ensuring precision & reliability", icon: Activity },
              { img: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800", title: "Manufacturing", desc: "Advanced production capabilities", icon: Factory },
              { img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800", title: "Production Floor", desc: "Efficient & organized workflow", icon: Settings }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-video bg-gray-100"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1042]/90 via-[#0b1042]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-600/90 text-white flex items-center justify-center shrink-0 backdrop-blur-sm">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg leading-tight">{item.title}</h4>
                      <p className="text-gray-300 text-xs md:text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MAJOR CUSTOMERS SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0b1042 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Trusted By Industries</span>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4 uppercase tracking-tight">Our Major Customers</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">Building long-term relationships with leading brands across industries.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-5 lg:max-w-4xl mx-auto">
            {['MAS', 'brandix', 'INQUBE', 'BODYLINE', 'T & F G', 'OMEGA LINE LTD', "Courtauld's", 'SJ'].map((brand, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="w-[140px] md:w-[180px] h-[80px] md:h-[100px] bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center group hover:bg-white hover:shadow-lg hover:border-red-200 transition-all duration-300 px-4"
              >
                 <span className="font-black text-[#0b1042]/70 text-sm md:text-lg tracking-wider uppercase group-hover:text-red-600 transition-colors text-center leading-tight">
                   {brand}
                 </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="bg-[#0b1042] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none transform skew-x-12 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center mb-6 justify-center">
            <div className="w-1.5 h-4 bg-red-600 transform -skew-x-[20deg] mr-2 shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>
            <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Get Started</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight uppercase">Let's Build a Stronger <br className="hidden md:block"/>Tomorrow Together</h2>
          <p className="text-blue-100/80 text-base md:text-lg max-w-2xl mx-auto mb-12">
            Partner with Able Technologies for reliable machines, components, and expert support tailored to your manufacturing requirements.
          </p>

          <Link 
            to="/contact" 
            className="metallic-red-bg px-10 py-4 rounded-full font-bold text-white text-lg flex items-center space-x-3 hover:-translate-y-1 transition-all duration-300 shadow-[0_5px_20px_rgba(220,38,38,0.5)] border border-red-500/50 mb-16"
          >
            <span>Contact Us Today</span>
            <ChevronRight size={20} className="bg-white/20 rounded-full p-0.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}

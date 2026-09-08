const fs = require('fs');
const content = `import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Wrench, Settings, CheckCircle2, ShieldCheck, Clock, ArrowRight, PenTool, Zap, Layers, Award } from 'lucide-react';
import heroImg from '../assets/OurServicesHeroImg.png';

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen font-sans">
      
      {/* 1. SERVICES HERO SECTION */}
      <section className="relative bg-[#04081c] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            
            <motion.div 
              className="lg:w-1/2"
              initial="hidden" animate="visible" variants={fadeIn}
            >
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-6">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight size={14} />
                <span className="text-white">Services</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                Our Services
              </h1>
              
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                Keep Your Machines Running. Build New Possibilities.
              </h2>
              
              <p className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
                Professional repair, modification, calibration and laser cutting services designed to keep your production moving forward.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                {[
                  { icon: Wrench, title: "Expert Technicians" },
                  { icon: ShieldCheck, title: "Quality Workmanship" },
                  { icon: Clock, title: "Reliable Support" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full py-2 px-4 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <item.icon size={16} className="text-red-400" />
                    </div>
                    <span className="text-sm font-semibold text-white tracking-wide">{item.title}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-transparent to-transparent opacity-60 z-10" />
                <img 
                  src={heroImg} 
                  alt="ABLE Technologies Professional Services" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 2. REPAIR & MODIFICATIONS */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-12">
            
            <motion.div 
              className="lg:w-5/12"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            >
              <div className="relative mb-8">
                <span className="absolute -top-12 -left-4 text-8xl font-black text-gray-100/80 select-none z-0">01</span>
                <div className="relative z-10">
                  <span className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2 block">Machine Services</span>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] tracking-tight leading-tight">
                    Repair & <span className="text-red-600">Modifications</span>
                  </h2>
                </div>
              </div>
              
              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                We provide repair and modification services for industrial machines and equipment used in the garment industry. Our team can repair damaged parts, modify machines according to customer requirements, and perform calibrations to ensure optimal performance.
              </p>

              <div className="space-y-6">
                <div className="bg-[#f8f9ff] rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <Wrench className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0b1042]">Our Services</h3>
                  </div>
                  <ul className="space-y-3">
                    {['Machine repairs', 'Mechanical part replacement', 'Machine modifications', 'Custom improvements for machines', 'Machine calibrations', 'Bed modifications'].map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-red-600 shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#f8f9ff] rounded-2xl p-6 border border-blue-100/50 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <Settings className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0b1042]">Applications</h3>
                  </div>
                  <ul className="space-y-3">
                    {['Garment industry machines', 'Heat seal machines', 'Industrial equipment'].map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-red-600 shrink-0 mt-0.5" size={18} />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-7/12"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            >
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="col-span-2 relative rounded-2xl overflow-hidden group shadow-lg h-64 md:h-80">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" alt="Repair" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-6 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xl mb-1 uppercase tracking-wider">Repair</h4>
                    <p className="text-gray-300 text-sm font-medium">Restore Performance</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-48 md:h-56">
                  <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&auto=format&fit=crop&q=80" alt="Calibration" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-4 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-sm md:text-base mb-1 uppercase tracking-wider">Calibration</h4>
                    <p className="text-gray-300 text-xs font-medium">Ensure Accuracy</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-48 md:h-56">
                  <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&auto=format&fit=crop&q=80" alt="Modifications" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-4 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-sm md:text-base mb-1 uppercase tracking-wider">Modifications</h4>
                    <p className="text-gray-300 text-xs font-medium">Built for Your Needs</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 3. LASER CUTTING & ENGRAVING */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          
          <div className="flex flex-col lg:flex-row-reverse gap-16 lg:gap-12">
            
            <motion.div 
              className="lg:w-5/12"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            >
              <div className="relative mb-8">
                <span className="absolute -top-12 -left-4 text-8xl font-black text-gray-200/80 select-none z-0">02</span>
                <div className="relative z-10">
                  <span className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-2 block">Custom Fabrication</span>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] tracking-tight leading-tight">
                    Laser Cutting & <span className="text-red-600">Engraving</span>
                  </h2>
                </div>
              </div>
              
              <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                We provide laser cutting and engraving services for selected materials. This service is available for customers who need precision cutting or custom engraving.
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <Zap className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0b1042]">Our Services</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="text-red-600 shrink-0 mt-1" size={18} />
                      <span className="text-gray-700 font-medium"><strong>Metal Cutting</strong> – Mild Steel, Aluminum, Stainless Steel Plates</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="text-red-600 shrink-0 mt-1" size={18} />
                      <span className="text-gray-700 font-medium"><strong>Leather Cutting</strong> – Custom shapes and patterns</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle2 className="text-red-600 shrink-0 mt-1" size={18} />
                      <span className="text-gray-700 font-medium"><strong>Name Engraving</strong> – Logos, names, and markings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-7/12"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
            >
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="col-span-2 relative rounded-2xl overflow-hidden group shadow-lg h-64 md:h-80">
                  <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80" alt="Precision Cutting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-6 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-xl mb-1 uppercase tracking-wider">Precision Cutting</h4>
                    <p className="text-gray-300 text-sm font-medium">Clean. Accurate. Professional.</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-48 md:h-56">
                  <img src="https://images.unsplash.com/photo-1620619767323-b95a89183081?w=400&auto=format&fit=crop&q=80" alt="Leather Cutting" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-4 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-sm md:text-base mb-1 uppercase tracking-wider">Leather Cutting</h4>
                    <p className="text-gray-300 text-xs font-medium">Custom Shapes & Patterns</p>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden group shadow-lg h-48 md:h-56">
                  <img src="https://images.unsplash.com/photo-1590422749819-21dfd4af51d6?w=400&auto=format&fit=crop&q=80" alt="Name Engraving" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-4 w-full border-b-4 border-red-600">
                    <h4 className="text-white font-black text-sm md:text-base mb-1 uppercase tracking-wider">Name Engraving</h4>
                    <p className="text-gray-300 text-xs font-medium">Logos, Names & Markings</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE OUR SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layers, title: "High Precision", desc: "Advanced technology" },
              { icon: Settings, title: "Custom Solutions", desc: "For your requirements" },
              { icon: ShieldCheck, title: "Quality Results", desc: "Professional finish" },
              { icon: Clock, title: "Reliable Service", desc: "Professional and dependable" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#f8f9ff] rounded-2xl p-8 border border-blue-100/50 hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-300">
                  <feature.icon size={28} className="text-red-600" strokeWidth={1.5} />
                </div>
                <h4 className="text-[#0b1042] font-black text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-500 font-medium text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CUSTOM SERVICE CTA */}
      <section className="relative py-24 bg-[#04081c] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#04081c] via-[#04081c]/90 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Need a Custom Service?</h2>
            <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl">
              Talk to our experts and get the best solution for your requirement.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          >
            <Link 
              to="/contact?subject=Quote%20Request"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_5px_15px_rgba(220,38,38,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-1"
            >
              <span>Get a Quote</span>
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
`;
fs.writeFileSync('src/pages/Services.tsx', content);

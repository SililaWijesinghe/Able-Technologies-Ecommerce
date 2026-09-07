import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Globe, Shield, Wrench, ChevronRight, Users, TrendingUp, Briefcase, Award, ArrowRight, Building, Laptop, PenTool, CheckCircle, Activity, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-[180px] pb-24 overflow-hidden bg-[#060740]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#060740] via-[#060740]/90 to-transparent z-10" />
          <motion.img 
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000"
            alt="Industrial Machine" 
            className="w-full h-full object-cover object-right"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            {/* Breadcrumb */}
            <motion.div variants={fadeInUp} className="flex items-center text-sm text-gray-400 mb-6 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-white">About Us</span>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-sm uppercase">About Us</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              ABOUT <span className="text-red-600">US</span>
            </motion.h1>

            <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl text-gray-200 font-medium mb-6 leading-tight">
              Innovative Solutions for a Stronger Tomorrow
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-gray-300 text-lg mb-10 max-w-xl leading-relaxed">
              At Able Technologies, we are committed to delivering high-quality machines, components and services that power industries.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-red-600 z-20" />
        <div className="absolute top-1/4 right-10 w-32 h-[1px] bg-white/20 z-20 hidden md:block" />
        <div className="absolute top-1/3 right-10 w-24 h-[1px] bg-red-600/50 z-20 hidden md:block" />
      </section>

      {/* 2. COMPANY OVERVIEW / KEY BUSINESS AREAS */}
      <section className="py-16 bg-gray-50 -mt-8 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Settings, title: "HIGH-TECH, INNOVATED BONDING MACHINE", desc: "And all kind of heat transfer machine manufacture" },
              { icon: Globe, title: "IMPORTER AND DISTRIBUTOR", desc: "Of high quality pneumatic components and accessories" },
              { icon: Shield, title: "SOLE AGENT", desc: "For high quality DNS brand 'NO SEW' PU base glue" },
              { icon: Wrench, title: "TOTAL SERVICE PROVIDER", desc: "For hi-tech garment manufacturing process including testing, applications, quality control and process control" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0b1042] mb-4 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="text-sm font-bold text-[#0b1042] mb-2 leading-tight uppercase pr-4">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. ABLE TECHNOLOGIES CURRENT CONTEXT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Our Structure</span>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4">Able Technologies (Pvt) Ltd</h2>
            <h3 className="text-xl text-gray-500 font-medium">Current Context</h3>
          </div>

          <div className="bg-gray-50/50 rounded-3xl p-6 md:p-12 border border-gray-100 relative">
            {/* Desktop Ecosystem (Hidden on mobile) */}
            <div className="hidden lg:grid grid-cols-5 gap-6">
              {/* Category 1: Manufacturing */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0b1042] text-white py-3 px-6 rounded-xl font-bold text-sm w-full text-center shadow-lg mb-8 relative z-10">
                  MANUFACTURING
                </div>
                <div className="w-full relative">
                  <div className="absolute top-[-32px] left-1/2 w-[2px] h-8 bg-gray-200 -translate-x-1/2" />
                  <div className="flex justify-between gap-2 relative">
                    <div className="absolute top-[-10px] left-[25%] right-[25%] h-[2px] bg-gray-200" />
                    <div className="w-1/2 flex flex-col items-center">
                      <div className="w-[2px] h-4 bg-gray-200" />
                      <div className="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-bold w-full text-center mb-4 shadow-sm">MACHINE</div>
                      <div className="flex gap-2 w-full mb-4">
                        <div className="bg-blue-600 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold w-1/2 text-center">RENT</div>
                        <div className="bg-blue-600 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold w-1/2 text-center">SALE</div>
                      </div>
                      <div className="bg-blue-500 text-white py-2 px-3 rounded-lg text-[10px] font-bold w-full text-center mb-2 leading-tight">CUSTOMIZED MACHINE</div>
                      <div className="flex gap-2 w-full">
                        <div className="bg-blue-400 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold w-1/2 text-center">LOCAL</div>
                        <div className="bg-blue-400 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold w-1/2 text-center">EXPORT</div>
                      </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-center">
                      <div className="w-[2px] h-4 bg-gray-200" />
                      <div className="bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-bold w-full text-center mb-4 shadow-sm">MACHINE PARTS</div>
                      <div className="bg-cyan-500 text-white py-1.5 px-3 rounded-lg text-[10px] font-bold w-full text-center mb-2">LOCAL</div>
                      <div className="bg-cyan-500 text-white py-1.5 px-3 rounded-lg text-[10px] font-bold w-full text-center mb-2">EXPORT</div>
                      
                      <div className="bg-blue-500 text-white py-2 px-3 rounded-lg text-[10px] font-bold w-full text-center mb-2 leading-tight mt-auto">STANDARD SIZE</div>
                      <div className="flex gap-2 w-full">
                        <div className="bg-blue-400 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold w-1/2 text-center">LOCAL</div>
                        <div className="bg-blue-400 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold w-1/2 text-center">EXPORT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 2: Repair */}
              <div className="flex flex-col items-center">
                <div className="bg-[#1c2463] text-white py-3 px-6 rounded-xl font-bold text-sm w-full text-center shadow-lg mb-8 relative z-10">
                  REPAIR
                </div>
                <div className="w-full relative flex flex-col items-center space-y-4">
                  <div className="absolute top-[-32px] left-1/2 w-[2px] h-[calc(100%+32px)] bg-gray-200 -translate-x-1/2 z-0" />
                  <div className="bg-[#2d3780] text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">MODIFICATION</div>
                  <div className="bg-[#2d3780] text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">REPAIR</div>
                  <div className="bg-[#2d3780] text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">CALIBRATION</div>
                </div>
              </div>

              {/* Category 3: Spare Parts */}
              <div className="flex flex-col items-center">
                <div className="bg-gray-800 text-white py-3 px-6 rounded-xl font-bold text-sm w-full text-center shadow-lg mb-8 relative z-10">
                  SPARE PARTS
                </div>
                <div className="w-full relative flex flex-col items-center space-y-4">
                  <div className="absolute top-[-32px] left-1/2 w-[2px] h-[calc(100%+32px)] bg-gray-200 -translate-x-1/2 z-0" />
                  <div className="bg-orange-500 text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">HEATING ELEMENTS</div>
                  <div className="bg-orange-500 text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">PNEUMATIC ITEMS</div>
                  <div className="bg-orange-500 text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10 leading-tight">OTHER MACHINERY PARTS</div>
                </div>
              </div>

              {/* Category 4: DNS Glue */}
              <div className="flex flex-col items-center">
                <div className="bg-gray-700 text-white py-3 px-6 rounded-xl font-bold text-sm w-full text-center shadow-lg mb-8 relative z-10">
                  DNS GLUE
                </div>
                <div className="w-full relative flex flex-col items-center space-y-4">
                  <div className="absolute top-[-32px] left-1/2 w-[2px] h-[calc(100%+32px)] bg-gray-200 -translate-x-1/2 z-0" />
                  <div className="bg-pink-300 text-red-900 py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">INTRODUCE</div>
                  <div className="bg-pink-300 text-red-900 py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">SOLE AGENT</div>
                  <div className="bg-pink-300 text-red-900 py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10 leading-tight">TECHNICAL KNOWLEDGE</div>
                </div>
              </div>

              {/* Category 5: Other */}
              <div className="flex flex-col items-center">
                <div className="bg-[#0b1042] text-white py-3 px-6 rounded-xl font-bold text-sm w-full text-center shadow-lg mb-8 relative z-10">
                  OTHER
                </div>
                <div className="w-full relative flex flex-col items-center space-y-4">
                  <div className="absolute top-[-32px] left-1/2 w-[2px] h-[calc(100%+32px)] bg-gray-200 -translate-x-1/2 z-0" />
                  <div className="bg-green-600 text-white py-2 px-4 rounded-lg text-[10px] font-bold w-[90%] text-center shadow-sm relative z-10 leading-tight">CONSULTATION & TRAINING</div>
                  <div className="bg-green-500 text-white py-2 px-4 rounded-lg text-xs font-bold w-[90%] text-center shadow-sm relative z-10">SAMPLE MAKING</div>
                  <div className="bg-green-600 text-white py-2 px-4 rounded-lg text-[10px] font-bold w-[90%] text-center shadow-sm relative z-10 leading-tight">TESTING & RECOMMENDATION</div>
                </div>
              </div>
            </div>

            {/* Mobile Accordion Ecosystem */}
            <div className="lg:hidden space-y-4">
              {[
                { title: "MANUFACTURING", color: "bg-[#0b1042]", items: ["Machine (Rent / Sale)", "Machine Parts (Local / Export)", "Customized Machine", "Standard Size"] },
                { title: "REPAIR", color: "bg-[#1c2463]", items: ["Modification", "Repair", "Calibration"] },
                { title: "SPARE PARTS", color: "bg-gray-800", items: ["Heating Elements", "Pneumatic Items", "Other Machinery Parts"] },
                { title: "DNS GLUE", color: "bg-gray-700", items: ["Introduce", "Sole Agent", "Technical Knowledge"] },
                { title: "OTHER", color: "bg-[#0b1042]", items: ["Consultation & Training", "Sample Making", "Testing & Recommendation"] }
              ].map((cat, idx) => (
                <details key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <summary className={`${cat.color} text-white font-bold p-4 cursor-pointer flex justify-between items-center list-none`}>
                    {cat.title}
                    <ChevronRight size={18} className="transform group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="p-4 bg-white flex flex-wrap gap-2">
                    {cat.items.map((item, i) => (
                      <span key={i} className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR CULTURE SECTION */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-8 bg-red-600" />
                <span className="text-red-600 font-bold tracking-widest text-sm uppercase">Our Culture</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0b1042] leading-tight">
                People Drive <br />Our Progress
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  <strong className="text-[#0b1042]">Enterprise culture</strong> is a moving source, using "people" as the core of establishing enterprise culture, using an advanced foreign management model, giving the employees a modern, relaxing and humane working environment.
                </p>
                <p>
                  The people of ABLE Technologies (PVT) LTD have the courage for any experiment, the quest for mind development and eventually shift to the "Quality, Service and Innovation" type of enterprise.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0b1042] rounded-3xl p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
              
              <div className="space-y-4 relative z-10 group cursor-default">
                <Users size={32} strokeWidth={1.5} className="text-red-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg mb-1">People First</h4>
                  <p className="text-gray-400 text-sm">Our team is our greatest strength</p>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10 group cursor-default">
                <TrendingUp size={32} strokeWidth={1.5} className="text-red-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Continuous Improvement</h4>
                  <p className="text-gray-400 text-sm">Always learning, always evolving</p>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10 group cursor-default">
                <Building size={32} strokeWidth={1.5} className="text-red-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Modern Work Environment</h4>
                  <p className="text-gray-400 text-sm">A safe, relaxing and supportive place</p>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10 group cursor-default">
                <Award size={32} strokeWidth={1.5} className="text-red-500 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Quality Driven</h4>
                  <p className="text-gray-400 text-sm">Committed to excellence in all we do</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. OUR FACILITY / WORKSPACE SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Our Facility</span>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4">Our Workspace & Manufacturing Environment</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">A modern facility equipped for innovation, precision and quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", title: "Company Premises", desc: "Our office and main facility", icon: Building },
              { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", title: "Design & Development", desc: "Modern workspace for research and innovation", icon: Laptop },
              { img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800", title: "Machine Assembly", desc: "Building high-quality industrial machines", icon: Wrench },
              { img: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800", title: "Testing & Calibration", desc: "Ensuring precision and reliability", icon: Activity },
              { img: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&q=80&w=800", title: "Manufacturing Facility", desc: "Advanced production capabilities", icon: Factory },
              { img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800", title: "Production Floor", desc: "Efficient and organized workflow", icon: Settings }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[16/9] md:aspect-[3/2] bg-gray-100"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0b1042] text-sm md:text-base">{item.title}</h4>
                      <p className="text-gray-500 text-xs md:text-sm">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR MAJOR CUSTOMERS */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Subtle hex background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0b1042 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Trusted By Industries</span>
              <div className="h-[1px] w-6 bg-red-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4">Our Major Customers</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Building long-term relationships with leading brands across industries.</p>
          </div>

          {/* Hexagon Grid */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:max-w-5xl mx-auto pb-10">
            {['MAS', 'brandix', 'INQUBE', 'BODYLINE', 'T & F G', 'OMEGA LINE LTD', "Courtauld's", 'SJ'].map((brand, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="w-32 h-32 md:w-40 md:h-40 bg-white border border-gray-100 shadow-sm flex items-center justify-center relative group hover:shadow-lg transition-all duration-300 hover:border-blue-200"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                <div className="absolute inset-0 bg-[#0b1042] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-[2px] bg-white flex items-center justify-center p-4 text-center transition-colors duration-300" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                   <span className="font-black text-[#0b1042] text-sm md:text-base tracking-wider uppercase group-hover:text-red-600 transition-colors">{brand}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STRONG CALL-TO-ACTION SECTION */}
      <section className="py-24 bg-[#0b1042] relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-red-600/5 -skew-x-12 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Let's Build a Stronger <br className="hidden md:block" />
                <span className="text-red-500">Tomorrow Together</span>
              </h2>
              <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0">
                Partner with Able Technologies for reliable machines, components and expert support.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/30 group"
              >
                Contact Us
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {[
                { title: 'Reliable Partnership', icon: Shield },
                { title: 'Expert Support', icon: Users },
                { title: 'Custom Solutions', icon: Settings },
                { title: 'Long-Term Growth', icon: TrendingUp }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <item.icon size={24} />
                  </div>
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

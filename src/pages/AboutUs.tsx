import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Factory, 
  Wrench, 
  Settings, 
  TestTube, 
  PenTool, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Building, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle,
  Truck,
  HeartHandshake,
  Award
} from 'lucide-react';
import heroBg from '../assets/heroBg.webp';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

  return (
    <div className="bg-[#f8f9ff] min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#04081c] pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Able Technologies Industrial" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04081c] via-[#04081c]/90 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/10 blur-[100px] pointer-events-none" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="max-w-3xl"
          >
            <div className="flex items-center space-x-2 text-red-500 font-bold uppercase tracking-[0.2em] text-xs mb-6">
              <span className="w-8 h-0.5 bg-red-600"></span>
              <span>About Able Technologies</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              Engineering Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Modern Manufacturing</span>
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl font-medium mb-10 leading-relaxed">
              Able Technologies is a professional industrial machinery and technology solutions provider. We specialize in advanced industrial machinery, heat press solutions, spare parts, gauges, premium glue, and comprehensive machine-related services to drive production excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/shop" className="w-full sm:w-auto text-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold text-base shadow-[0_5px_15px_rgba(220,38,38,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-1 flex justify-center items-center">
                Explore Our Solutions <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/contact" className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:-translate-y-1">
                Contact Our Team
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-12 border-t border-white/10">
              {[
                { label: "Decades of Experience", icon: ShieldCheck },
                { label: "Industrial Expertise", icon: Factory },
                { label: "Quality Assured", icon: Award }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-gray-400">
                  <item.icon size={18} className="text-red-500" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            >
              <div className="relative">
                <span className="absolute -top-12 -left-4 text-8xl font-black text-gray-100 select-none z-0">VISION</span>
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] tracking-tight leading-tight mb-6">
                    Your Trusted Industrial <span className="text-red-600">Solutions Partner</span>
                  </h2>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            >
              <div className="prose prose-lg text-gray-600">
                <p className="font-medium text-[#0b1042] text-xl mb-6">
                  Able Technologies is an established leader in providing comprehensive support for modern manufacturing environments.
                </p>
                <p className="mb-4">
                  We harness engineering talent to design, import, and distribute high-tech <strong className="text-gray-900">industrial machinery</strong>, innovative <strong className="text-gray-900">heat press technology</strong>, and a wide array of <strong className="text-gray-900">pneumatic components</strong> and <strong className="text-gray-900">accessories</strong>.
                </p>
                <p>
                  Beyond simply supplying equipment, we stand as a true partner. Our <strong className="text-gray-900">industrial support</strong> and technical expertise ensure that garment manufacturers and heavy industries operate at peak efficiency, minimizing downtime and maximizing output.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE DO — BUSINESS OVERVIEW */}
      <section className="py-20 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] mb-4">What We Do</h2>
            <p className="text-gray-600 text-lg">A comprehensive ecosystem of industrial solutions designed to empower your production lines.</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
          >
            {[
              { id: 1, title: 'Manufacturing', icon: Factory, desc: 'Industrial machinery and complete manufacturing solutions tailored for high-volume production.', link: '/shop?category=machine' },
              { id: 2, title: 'Repair', icon: Wrench, desc: 'Machine repair, proactive maintenance, advanced modification, and precision calibration services.', link: '/services' },
              { id: 3, title: 'Spare Parts', icon: Settings, desc: 'Industrial spare parts, pneumatic items, and high-quality replacement components to keep you running.', link: '/shop?category=spare-parts' },
              { id: 4, title: 'Glue Solutions', icon: TestTube, desc: 'Industrial adhesives, heat-related bonding solutions, and chemical accessories for robust assembly.', link: '/shop?category=glue' },
              { id: 5, title: 'Machine Services', icon: PenTool, desc: 'Professional technical support, lifecycle servicing, and bespoke industrial engineering solutions.', link: '/services' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className={`bg-white rounded-2xl p-8 border border-blue-50 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${i === 4 ? 'lg:col-start-2' : ''}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10 group-hover:from-red-50 transition-colors duration-500"></div>
                <div className="w-14 h-14 bg-[#f0f4ff] group-hover:bg-red-50 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                  <item.icon size={28} className="text-blue-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-[#0b1042] mb-3 group-hover:text-red-600 transition-colors">{item.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.desc}</p>
                <Link to={item.link} className="inline-flex items-center text-sm font-bold text-blue-600 group-hover:text-red-600 transition-colors">
                  Explore <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. OUR INDUSTRIAL EXPERTISE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] mb-4">Our Industrial Expertise</h2>
            <div className="w-20 h-1 bg-red-600"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Industrial Machines", "Spare Parts & Components", "Gauges & Accessories",
              "Adhesive & Glue Solutions", "Machine Repair & Maintenance", "Technical Support"
            ].map((expertise, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#0b1042] rounded-xl p-6 relative overflow-hidden group cursor-default shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center border border-red-500/30">
                    <CheckCircle2 size={20} className="text-red-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg">{expertise}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMPANY CULTURE SECTION */}
      <section className="py-20 lg:py-28 bg-[#04081c] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2 order-2 lg:order-1 relative"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" alt="Able Technologies Team" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-[#04081c] hidden md:block">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&auto=format&fit=crop&q=80" alt="Innovation" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 order-1 lg:order-2"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Driven by People,<br/>Powered by <span className="text-red-500">Innovation</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                At Able Technologies, people are at the heart of everything we do. We cultivate a modern, human-centered working environment where technical brilliance meets collaborative problem-solving.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Continuous Improvement', desc: 'Constantly refining our methods to deliver superior industrial results.' },
                  { title: 'Service Excellence', desc: 'Committed to responsive, professional, and reliable client support.' },
                  { title: 'Quality First', desc: 'Rigorous standards in both our products and our everyday operations.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                      <Users size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. OUR FACILITIES / INSIDE ABLE TECHNOLOGIES */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] mb-4">Inside Able Technologies</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore our modern workspaces, testing areas, and industrial facilities.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80" alt="Machine Testing Area" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-white font-bold text-xl mb-1">Machine Testing Area</h4>
                <p className="text-gray-300 text-sm">Rigorous quality control environment</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80" alt="Office Environment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="text-white font-bold text-lg mb-1">Office Environment</h4>
                <p className="text-gray-300 text-xs">Collaborative workspaces</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=500&auto=format&fit=crop&q=80" alt="Industrial Workshop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="text-white font-bold text-lg mb-1">Industrial Workshop</h4>
                <p className="text-gray-300 text-xs">Precision engineering</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-3 rounded-2xl overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1565439399-5f2d4ed83740?w=1200&auto=format&fit=crop&q=80" alt="Manufacturing Workspace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80"></div>
              <div className="absolute bottom-6 left-6">
                <h4 className="text-white font-bold text-xl mb-1">Manufacturing Workspace</h4>
                <p className="text-gray-300 text-sm">Where ideas become industrial reality</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. OUR SOLUTIONS AT A GLANCE */}
      <section className="py-20 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] mb-4">Our Solutions at a Glance</h2>
            <div className="w-20 h-1 bg-red-600"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Local Machines", desc: "Machines and industrial solutions available locally.", icon: Building, link: "/shop?category=local-machines" },
              { title: "Global Machines", desc: "International industrial machinery solutions.", icon: Globe, link: "/shop?category=global-machines" },
              { title: "Spare Parts & Gauges", desc: "Components, pneumatic products, gauges and accessories.", icon: Settings, link: "/shop?category=spare-parts" },
              { title: "Glue", desc: "Industrial adhesive and bonding solutions.", icon: TestTube, link: "/shop?category=glue" },
              { title: "Machine Services", desc: "Maintenance, repair, modification and technical support.", icon: Wrench, link: "/services" },
            ].map((sol, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <sol.icon size={28} className="text-blue-600" />
                </div>
                <h4 className="text-[#0b1042] font-bold text-lg mb-3 leading-tight">{sol.title}</h4>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{sol.desc}</p>
                <Link to={sol.link} className="w-full py-2.5 rounded-lg bg-gray-50 text-[#0b1042] font-semibold text-sm hover:bg-red-50 hover:text-red-600 transition-colors">
                  Explore
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE ABLE TECHNOLOGIES */}
      <section className="py-20 lg:py-28 bg-[#04081c] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-blue-900/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why Industries Choose Able Technologies</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">The competitive advantages that make us the preferred partner for modern manufacturing.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              "Industrial Expertise", "Reliable Products", "Professional Technical Support", "Quality-Focused Solutions",
              "Spare Parts Availability", "Islandwide Service & Support", "Customer-Focused Approach", "Complete Industrial Solutions"
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start space-x-4 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="mt-1 shrink-0">
                  <CheckCircle2 size={20} className="text-red-500" />
                </div>
                <h4 className="text-white font-semibold text-base leading-snug">{feature}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TRUSTED BY INDUSTRY — CUSTOMER LOGOS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] mb-4">Trusted by Leading Industries</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Proud to support businesses across Sri Lanka with reliable industrial solutions.</p>
          </motion.div>

          {/* Client Logos Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6 lg:gap-10 items-center justify-items-center opacity-70">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: (i % 5) * 0.1 }}
                className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 grayscale hover:grayscale-0 p-4"
              >
                <img 
                  src={`/images/clients/client-${i + 1}.webp`} 
                  alt={`Client ${i + 1}`} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply" 
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. OUR COMMITMENT */}
      <section className="py-20 lg:py-28 bg-[#f8f9ff]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#0b1042] tracking-tight leading-tight mb-6">
                More Than Machines.<br/><span className="text-blue-600">Complete Industrial Solutions.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We focus on supporting our customers throughout their entire industrial journey. From the initial consultation to long-term lifecycle support, we ensure your operations never miss a beat.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                {[
                  { icon: MessageCircle, text: "Consultation" },
                  { icon: Factory, text: "Product Selection" },
                  { icon: Settings, text: "Installation Support" },
                  { icon: ShieldCheck, text: "Spare Parts" },
                  { icon: Wrench, text: "Repairs & Maintenance" },
                  { icon: HeartHandshake, text: "Technical Assistance" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <item.icon size={14} className="text-blue-600" />
                    </div>
                    <span className="text-[#0b1042] font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80" alt="Commitment" className="w-full h-64 object-cover rounded-2xl shadow-lg mt-8" />
                <img src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=400&auto=format&fit=crop&q=80" alt="Support" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>



    </div>
  );
}

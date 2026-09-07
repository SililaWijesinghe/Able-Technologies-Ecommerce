import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Settings, Shield, Award, Wrench, PlusCircle, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/heroBg.webp';
import toolImg1 from '../assets/Tool1.png';
import toolImg2 from '../assets/Tool2.png';

// Fallback images if specific ones don't exist
const placeholderImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80';

// Animation variants
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

const heatPressSpecs = [
  { model: "R0606HS", power: "1200W", piston: "63mm", bed: "06\" x 06\" (152mm)", weight: "55Kg" },
  { model: "R1015HS", power: "2200W", piston: "125mm", bed: "10\" x 15\" (254mm)", weight: "100Kg" },
  { model: "R0340FB", power: "4500W", piston: "100mm", bed: "03\" x 40\" (76x1000mm)", weight: "350Kg" },
  { model: "R2015VB", power: "4500W", piston: "125mm", bed: "20\" x 15\" (500x400mm)", weight: "330Kg" },
  { model: "R2040VBD", power: "12000W", piston: "125mm", bed: "20\" x 40\" (500x1000)", weight: "800Kg" },
  { model: "R2040VBS", power: "12000W", piston: "125mm", bed: "20\" x 15\" (500x400mm)", weight: "600Kg" },
  { model: "R2050VBD", power: "12000W", piston: "160mm", bed: "20\" x 50\" (500x1000)", weight: "800Kg" },
  { model: "RM003S", power: "3000W", piston: "63mm", bed: "N/A", weight: "150Kg" },
  { model: "RM002S", power: "4500W", piston: "100mm", bed: "N/A", weight: "400Kg" }
];

const moldingSpecs = [
  { model: "RM001D", power: "9000W", piston: "63/50mm", weight: "200Kg" },
  { model: "RM004D", power: "9000W", piston: "63/50mm", weight: "250Kg" }
];

export default function IndustrialSolutions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION */}
      <section 
        className="relative w-full pt-32 md:pt-40 pb-20 md:pb-32 bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a2b]/95 via-[#0b1042]/80 to-[#0b1042]/40 z-0 w-full"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none transform skew-x-12"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col justify-center"
          >
            {/* Breadcrumb */}
            <motion.div variants={fadeInUp} className="flex items-center text-gray-300 text-[11px] md:text-sm mb-6 uppercase tracking-wider font-semibold">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} className="mx-2 text-gray-500" />
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <ChevronRight size={14} className="mx-2 text-gray-500" />
              <span className="text-white">Our Industrial Solutions</span>
            </motion.div>

            {/* Main Label */}
            <motion.div variants={fadeInUp} className="flex items-center mb-4">
               <div className="w-1.5 h-4 bg-red-600 transform -skew-x-[20deg] mr-2 shadow-[0_0_8px_rgba(255,0,0,0.5)]"></div>
               <span className="text-white font-bold tracking-widest text-[10px] md:text-xs uppercase bg-white/10 px-3 py-1 border-l-2 border-red-600">
                 Our Industrial Solutions
               </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-extrabold italic tracking-tight uppercase leading-[1.1] mb-6">
              <span className="text-white block">Industrial</span>
              <span className="metallic-red-text block">Solutions</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-gray-300 max-w-2xl text-[15px] md:text-[17px] leading-relaxed mb-12 border-l-2 border-white/20 pl-4">
              Specialized machinery and industrial solutions designed to support modern manufacturing processes with reliability, precision and performance.
            </motion.p>
          </motion.div>

          {/* Feature Cards Bento */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 w-full mt-4"
          >
            {[
              { title: 'Reliable Technology', sub: 'Proven Performance', icon: Shield, color: 'blue' },
              { title: 'Expert Support', sub: 'From Selection to Service', icon: Wrench, color: 'red' },
              { title: 'Custom Solutions', sub: 'For Your Requirements', icon: Settings, color: 'blue' },
              { title: 'Quality Assured', sub: 'Built for Industry', icon: Award, color: 'red' },
            ].map((feature, idx) => (
              <motion.div 
                variants={fadeInUp}
                key={idx} 
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center space-x-4 shadow-lg hover:bg-white/10 transition-colors group"
              >
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${feature.color === 'blue' ? 'bg-blue-600/20 text-blue-400' : 'bg-red-600/20 text-red-400'}`}>
                   <feature.icon size={24} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-white text-sm md:text-base font-bold tracking-tight">{feature.title}</span>
                   <span className="text-gray-400 text-xs mt-0.5">{feature.sub}</span>
                 </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. FIRST SOLUTION SECTION - HEAT PRESS */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-[1px] w-6 bg-red-600 hidden md:block" />
            <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Our Machines</span>
            <div className="h-[1px] w-6 bg-red-600 hidden md:block" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4 uppercase tracking-tight">Able Heat Press Machines</h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl">Efficient bonding, laminating and sealing solutions for the textile and garment industry.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* LEFT: Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 flex items-center justify-center relative overflow-hidden group aspect-square md:aspect-auto md:min-h-[500px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white z-0"></div>
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <motion.img 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              src={toolImg1} 
              alt="Able Heat Press Machine" 
              className="relative z-10 w-full max-w-[280px] md:max-w-md object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700" 
            />
          </motion.div>

          {/* RIGHT: Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="bg-[#0b1042] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
              
              <h4 className="text-white text-2xl font-bold mb-8 flex items-center">
                <Settings className="mr-4 text-red-500" size={28} /> Machine Uses
              </h4>
              
              <ul className="space-y-5 mb-10">
                {[
                  "Bonding fabric to fabric using adhesives, without stitching",
                  "Laminating TPU, PU, adhesives and other compatible materials",
                  "Seam sealing for waterproof or protective garments",
                  "Attaching logos, labels or patches using heat-activated adhesives"
                ].map((use, idx) => (
                  <li key={idx} className="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                    <CheckCircle className="text-cyan-400 mr-4 mt-0.5 shrink-0" size={20} />
                    <span className="text-gray-300 text-sm md:text-base leading-relaxed">{use}</span>
                  </li>
                ))}
              </ul>

              {/* Visual App Cards */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  { name: "Fabric Bonding", icon: Layers },
                  { name: "Seam Sealing", icon: PlusCircle },
                  { name: "Labels & Logos", icon: Award },
                  { name: "Laminating TPU", icon: Layers }
                ].map((app, idx) => (
                  <div key={idx} className="bg-[#060a2b] border border-white/10 hover:border-cyan-500/50 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-default">
                    <app.icon size={24} className="text-blue-400 mb-3 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-white text-xs md:text-sm font-semibold tracking-wide">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. HEAT PRESS SPECIFICATIONS (Mobile Cards & Desktop Table) */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h4 className="text-2xl md:text-3xl font-black text-[#0b1042] flex items-center uppercase tracking-tight">
              <Settings className="mr-4 text-red-600" size={32} /> Specifications
            </h4>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-blue-100 w-fit">Heat Press Series</span>
          </div>
          
          {/* Mobile Shared Specs Banner */}
          <div className="md:hidden bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-2 gap-4 shadow-sm">
             <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Power Supply</span><span className="text-xs font-bold text-[#0b1042]">AC 230V 50/60Hz</span></div>
             <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Air Pressure</span><span className="text-xs font-bold text-[#0b1042]">0-8 Bar</span></div>
             <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Temperature</span><span className="text-xs font-bold text-[#0b1042]">0-250°C</span></div>
             <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Timer</span><span className="text-xs font-bold text-[#0b1042]">1-999 Seconds</span></div>
          </div>

          {/* Mobile View: Stacked Spec Cards */}
          <div className="md:hidden space-y-4">
            {heatPressSpecs.map((item, idx) => (
               <div key={idx} className="bg-white border border-gray-200 hover:border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                     <h5 className="font-black text-[#0b1042] text-xl">{item.model}</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                     <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Power</span><span className="text-sm font-semibold text-gray-800">{item.power}</span></div>
                     <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Weight</span><span className="text-sm font-semibold text-gray-800">{item.weight}</span></div>
                     <div className="col-span-2"><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Piston Dia.</span><span className="text-sm font-semibold text-gray-800">{item.piston}</span></div>
                     <div className="col-span-2"><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Bed Dimensions</span><span className="text-sm font-semibold text-gray-800">{item.bed}</span></div>
                  </div>
               </div>
            ))}
          </div>

          {/* Desktop View: Data Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0b1042] text-white">
                  <th className="p-5 font-bold text-sm tracking-wide uppercase">Specs/Model</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Power Supply</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Air Pressure</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Consumption</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Temp</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Timer</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Piston Dia.</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Bed Dims</th>
                  <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Weight</th>
                </tr>
              </thead>
              <tbody>
                {heatPressSpecs.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                    <td className="p-5 font-black text-[#0b1042] text-base">{row.model}</td>
                    
                    {idx === 0 && (
                      <>
                        <td rowSpan={heatPressSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">AC 230V<br/>50/60Hz</td>
                        <td rowSpan={heatPressSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">0-8 Bar</td>
                      </>
                    )}
                    
                    <td className="p-5 text-gray-800 font-bold text-sm border-l border-gray-100">{row.power}</td>
                    
                    {idx === 0 && (
                      <>
                        <td rowSpan={heatPressSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">0-250°C</td>
                        <td rowSpan={heatPressSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">1-999<br/>Sec</td>
                      </>
                    )}
                    
                    <td className="p-5 text-gray-700 font-medium text-sm border-l border-gray-100">{row.piston}</td>
                    <td className="p-5 text-gray-700 font-medium text-sm border-l border-gray-100">{row.bed}</td>
                    <td className="p-5 text-gray-800 font-bold text-sm border-l border-gray-100">{row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-6 italic font-medium">* Specifications are subject to change without prior notice for product improvement.</p>
        </motion.div>
      </section>

      {/* 4. SECOND INDUSTRIAL SOLUTION SECTION - MOLDING */}
      <section className="py-20 md:py-32 bg-[#f4f6fa] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[1px] w-6 bg-red-600 hidden md:block" />
              <span className="text-red-600 font-bold tracking-widest text-xs uppercase">Specialized Solutions</span>
              <div className="h-[1px] w-6 bg-red-600 hidden md:block" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0b1042] mb-4 uppercase tracking-tight">Fabric & Bra Cup<br className="hidden md:block" /> Molding Machines</h2>
            <p className="text-gray-500 text-base md:text-lg max-w-2xl">Precision molding solutions engineered for elite fabric and bra cup manufacturing.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 flex-col-reverse lg:flex-row-reverse">
            {/* RIGHT (Reversed visually): Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-200 relative overflow-hidden">
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-600/5 blur-[60px] rounded-full pointer-events-none"></div>
                
                <h4 className="text-[#0b1042] text-2xl font-bold mb-8 flex items-center">
                  <Wrench className="mr-4 text-red-600" size={28} /> Applications
                </h4>
                
                <ul className="space-y-5 mb-10 relative z-10">
                  {[
                    "Molding fabric components with precision and consistency",
                    "Bra cup molding for high-quality garment manufacturing",
                    "Suitable for various delicate fabric and material applications",
                    "Designed for elite durability and long-term performance"
                  ].map((use, idx) => (
                    <li key={idx} className="flex items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <CheckCircle className="text-red-500 mr-4 mt-0.5 shrink-0" size={20} />
                      <span className="text-gray-700 text-sm md:text-base font-medium leading-relaxed">{use}</span>
                    </li>
                  ))}
                </ul>

                {/* Visual App Cards */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                  {[
                    { name: "Fabric Molding", icon: Layers },
                    { name: "Bra Cup Molding", icon: Award },
                    { name: "Garment Parts", icon: Settings },
                    { name: "Custom Shapes", icon: PlusCircle }
                  ].map((app, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 hover:border-red-200 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-default">
                      <app.icon size={24} className="text-red-500 mb-3 group-hover:text-[#0b1042] transition-colors" />
                      <span className="text-[#0b1042] text-xs md:text-sm font-bold tracking-wide">{app.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* LEFT (Reversed visually): Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 flex items-center justify-center relative overflow-hidden group aspect-square md:aspect-auto md:min-h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white z-0"></div>
              <motion.img 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                src={toolImg2} 
                alt="Fabric Molding Machine" 
                className="relative z-10 w-full max-w-[280px] md:max-w-md object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700" 
              />
            </motion.div>
          </div>

          {/* 5. MOLDING MACHINE SPECIFICATIONS (Mobile Cards & Desktop Table) */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white rounded-[2rem] p-6 md:p-12 shadow-xl border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h4 className="text-2xl md:text-3xl font-black text-[#0b1042] flex items-center uppercase tracking-tight">
                <Settings className="mr-4 text-red-600" size={32} /> Specifications
              </h4>
              <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider border border-red-100 w-fit">Molding Series</span>
            </div>

            {/* Mobile Shared Specs Banner */}
            <div className="md:hidden bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-2 gap-4 shadow-sm">
               <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Power Supply</span><span className="text-xs font-bold text-[#0b1042]">AC 230V 50/60Hz</span></div>
               <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Air Pressure</span><span className="text-xs font-bold text-[#0b1042]">0-8 Bar</span></div>
               <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Temperature</span><span className="text-xs font-bold text-[#0b1042]">0-250°C</span></div>
               <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Timer</span><span className="text-xs font-bold text-[#0b1042]">1-999 Seconds</span></div>
            </div>
            
            {/* Mobile View: Stacked Spec Cards */}
            <div className="md:hidden space-y-4">
              {moldingSpecs.map((item, idx) => (
                 <div key={idx} className="bg-white border border-gray-200 hover:border-red-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                       <h5 className="font-black text-[#0b1042] text-xl">{item.model}</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                       <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Power</span><span className="text-sm font-semibold text-gray-800">{item.power}</span></div>
                       <div><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Weight</span><span className="text-sm font-semibold text-gray-800">{item.weight}</span></div>
                       <div className="col-span-2"><span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Piston Dia.</span><span className="text-sm font-semibold text-gray-800">{item.piston}</span></div>
                    </div>
                 </div>
              ))}
            </div>

            {/* Desktop View: Data Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0b1042] text-white">
                    <th className="p-5 font-bold text-sm tracking-wide uppercase">Specs/Model</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Power Supply</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Air Pressure</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Consumption</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Temp</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10 text-center">Timer</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Piston Dia.</th>
                    <th className="p-5 font-bold text-sm tracking-wide uppercase border-l border-white/10">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {moldingSpecs.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-red-50/50 transition-colors">
                      <td className="p-5 font-black text-[#0b1042] text-base">{row.model}</td>
                      
                      {idx === 0 && (
                        <>
                          <td rowSpan={moldingSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">AC 230V<br/>50/60Hz</td>
                          <td rowSpan={moldingSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">0-8 Bar</td>
                        </>
                      )}
                      
                      <td className="p-5 text-gray-800 font-bold text-sm border-l border-gray-100">{row.power}</td>
                      
                      {idx === 0 && (
                        <>
                          <td rowSpan={moldingSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">0-250°C</td>
                          <td rowSpan={moldingSpecs.length} className="p-5 text-gray-600 text-sm font-semibold border-l border-gray-200 text-center align-middle bg-gray-50/50">1-999<br/>Sec</td>
                        </>
                      )}
                      
                      <td className="p-5 text-gray-700 font-medium text-sm border-l border-gray-100">{row.piston}</td>
                      <td className="p-5 text-gray-800 font-bold text-sm border-l border-gray-100">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="bg-[#0b1042] py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 skew-x-12 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-red-600/5 -skew-x-12 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="h-[2px] w-8 bg-red-600" />
                <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Get Started</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                Need a Custom <br className="hidden md:block" />
                <span className="text-red-500">Solution?</span>
              </h2>
              <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Our elite team is ready to help you find the perfect industrial machinery tailored to your exact production requirements.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-10 py-4 rounded-full font-bold transition-all shadow-[0_5px_20px_rgba(220,38,38,0.5)] border border-red-500/50 group hover:-translate-y-1"
              >
                <span>Request a Quote</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
              {[
                { title: "Technical Consultation", icon: Settings },
                { title: "Machine Selection", icon: Award },
                { title: "After-Sales Service", icon: Wrench },
                { title: "Spare Parts Support", icon: Layers }
              ].map((info, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center hover:bg-white/10 transition-colors group">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-5 text-red-400 group-hover:scale-110 group-hover:text-cyan-400 transition-all duration-300">
                    <info.icon size={28} />
                  </div>
                  <h4 className="text-white font-bold text-sm md:text-base text-center leading-tight">{info.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

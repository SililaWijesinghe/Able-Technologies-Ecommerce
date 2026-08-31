import { ShieldCheck, Tag, Truck, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function TrustBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[4px_4px_15px_rgba(15,23,42,0.05),-4px_-4px_15px_rgba(255,255,255,0.8)] mx-auto mt-12 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="flex items-center space-x-4">
          <ShieldCheck size={28} className="text-blue-900" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-slate-800">100% Original Products</h4>
            <p className="text-xs text-slate-600">Sourced from trusted brands</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <Tag size={28} className="text-blue-900" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-slate-800">Best Prices</h4>
            <p className="text-xs text-slate-600">Competitive pricing always</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <Truck size={28} className="text-blue-900" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-slate-800">Fast Delivery</h4>
            <p className="text-xs text-slate-600">Islandwide delivery</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <CreditCard size={28} className="text-blue-900" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-slate-800">Secure Payments</h4>
            <p className="text-xs text-slate-600">Safe & secure checkout</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

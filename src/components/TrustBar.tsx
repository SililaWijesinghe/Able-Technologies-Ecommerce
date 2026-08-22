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
        className="bg-gray-50 rounded-xl py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-100"
      >
        <div className="flex items-center space-x-4">
          <ShieldCheck size={28} className="text-[#0b1042]" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-gray-900">100% Original Products</h4>
            <p className="text-xs text-gray-500">Sourced from trusted brands</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <Tag size={28} className="text-[#0b1042]" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-gray-900">Best Prices</h4>
            <p className="text-xs text-gray-500">Competitive pricing always</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <Truck size={28} className="text-[#0b1042]" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-gray-900">Fast Delivery</h4>
            <p className="text-xs text-gray-500">Islandwide delivery</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-10 bg-gray-200"></div>
        <div className="flex items-center space-x-4">
          <CreditCard size={28} className="text-[#0b1042]" strokeWidth={1.5} />
          <div>
            <h4 className="font-bold text-sm text-gray-900">Secure Payments</h4>
            <p className="text-xs text-gray-500">Safe & secure checkout</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

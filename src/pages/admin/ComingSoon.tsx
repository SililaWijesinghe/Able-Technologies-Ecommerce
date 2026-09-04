import { useLocation, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, Construction } from 'lucide-react';

export default function ComingSoon() {
  const location = useLocation();
  const isBanners = location.pathname.includes('banners');
  const isBrands = location.pathname.includes('brands');
  
  let title = 'Pages & CMS Management';
  if (isBanners) title = 'Banner Management';
  if (isBrands) title = 'Brand Management';
  let description = 'Custom CMS page builder, SEO metadata configuration, and legal document editors are currently under active development.';
  if (isBanners) description = 'Dynamic promotional banner editing, hero slider configuration, and scheduled marketing banner tools are currently under active development.';
  if (isBrands) description = 'Adding, editing, and mapping top-tier brands to products is currently under active development.';

  return (
    <div className="bg-white p-8 md:p-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner relative">
        <Construction size={36} className="animate-pulse" />
        <span className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow">
          <Sparkles size={16} />
        </span>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider mb-3">
        <Clock size={14} /> Coming Soon in v2.0
      </div>

      <h2 className="text-3xl font-black text-[#0b1042] mb-3">{title}</h2>
      <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center space-x-4">
        <Link 
          to="/admin" 
          className="px-6 py-3 bg-[#0b1042] hover:bg-[#0b1042]/90 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

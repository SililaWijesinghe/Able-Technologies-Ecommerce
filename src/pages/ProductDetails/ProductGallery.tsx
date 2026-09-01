import { Play, Expand } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProductGallery({ product }: { product: any }) {
  const images = (product.images && product.images.length > 0) ? product.images.map((img: any) => img.image_url) : (product.image_urls || []);
  const mainImage = images[0] || '';
  const [activeImage, setActiveImage] = useState(mainImage);

  useEffect(() => {
    setActiveImage(mainImage);
  }, [mainImage]);

  // Mock a video icon for the last thumbnail if we have enough images or just append it
  const galleryItems = [...images];
  // Ensure we have something for video placeholder visually
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible order-2 md:order-1">
        {galleryItems.map((img: string, idx: number) => (
          <button 
            key={idx} 
            onClick={() => setActiveImage(img)}
            className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center p-2 bg-white transition-all shrink-0 ${activeImage === img ? 'border-red-600' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
          </button>
        ))}
        {/* Video Placeholder */}
        {mainImage && (
          <button className="w-20 h-20 rounded-lg border-2 border-gray-200 hover:border-gray-300 flex items-center justify-center bg-gray-50 shrink-0 relative overflow-hidden group">
             <img src={mainImage} alt="" className="w-full h-full object-cover opacity-50 mix-blend-multiply group-hover:opacity-60 transition-opacity" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#0b1042]/80 rounded-full flex items-center justify-center text-white">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </div>
             </div>
          </button>
        )}
      </div>

      {/* Main Image */}
      <div className="flex-1 bg-gray-50 rounded-xl relative flex items-center justify-center p-8 border border-gray-100 min-h-[400px] order-1 md:order-2">
        {/* Badges */}
        {(product.discount > 0 || product.best_seller) && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {product.discount > 0 && (
              <span className="metallic-red-bg text-white text-[10px] font-bold px-2 py-1 rounded">
                -{product.discount}%
              </span>
            )}
            {product.best_seller && (
              <span className="bg-[#0b1042] text-white text-[10px] font-bold px-2 py-1 rounded">
                Best Seller
              </span>
            )}
          </div>
        )}
        
        {activeImage ? (
          <img src={activeImage} alt={product.name} className="max-w-full max-h-[400px] object-contain mix-blend-multiply" />
        ) : (
          <div className="text-gray-400">No Image Available</div>
        )}

        {/* 360 View Icon - Bottom Left */}
        <button className="absolute bottom-4 left-4 w-10 h-10 bg-white rounded-full shadow flex flex-col items-center justify-center text-gray-500 hover:text-[#0b1042] transition-colors border border-gray-100">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
           <span className="text-[7px] font-bold mt-0.5 uppercase">360°</span>
        </button>

        {/* Fullscreen Icon - Bottom Right */}
        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-[#0b1042] transition-colors border border-gray-100">
          <Expand size={18} />
        </button>
      </div>
    </div>
  );
}

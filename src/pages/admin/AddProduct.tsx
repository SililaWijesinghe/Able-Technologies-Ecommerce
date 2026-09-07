import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, X, ArrowLeft, Image as ImageIcon, Save, Check, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';


const COMMON_SPECS = ['Power Supply', 'Air Pressure', 'Power Consumption', 'Temperature', 'Timmer', 'Piston Diameter', 'Bed Dimensions', 'Net Weight', 'Machine Weight', 'Frequency'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skuError, setSkuError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const objectUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [newFiles]);
  
  
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(file.name + ' is not an image');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(file.name + ' exceeds 5MB limit');
          return false;
        }
        return true;
      });
      setNewFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand_id: '',
    description: '',
    price: '',
    compare_at_price: '',
    cost_price: '',
    stock: '',
    low_stock_threshold: '5',
    status: 'active',
    is_service: false,
    is_oeko_tex: false,
    transaction_type: 'sale',
    requires_quote: false,
    is_customizable: false
  });

  const [specifications, setSpecifications] = useState([{ key: '', value: '' }]);

  React.useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) setCategories(data);
    });
    supabase.from('brands').select('*').then(({ data }) => {
      if (data) setBrands(data);
    });
  }, []);

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = val;
    setSpecifications(newSpecs);
  };

  
  const addQuickSpec = (newKey: string) => {
    if (specifications.some(spec => spec.key.trim().toLowerCase() === newKey.toLowerCase())) return;
    if (specifications.length === 1 && specifications[0].key === '' && specifications[0].value === '') {
      setSpecifications([{ key: newKey, value: '' }]);
    } else {
      setSpecifications([...specifications, { key: newKey, value: '' }]);
    }
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSkuError('');

    // Pre-Submission Validation (Client-Side)
    if (!formData.name.trim()) {
      const msg = 'Oops! Please enter a Product Name before saving.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }
    if (!formData.category) {
      const msg = 'Oops! Please select a Category before saving this product.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }
    // Removed strict price validation to support missing/zero prices in B2B catalog mode
    if (formData.stock === '' || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      const msg = 'Oops! Please enter a valid Stock Quantity.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      // 0. Parse Specifications
      const specsObject: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key.trim()) {
          specsObject[spec.key.trim()] = spec.value.trim();
        }
      });

      // 0.5 Handle File Upload
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        const category = categories.find(c => c.id === formData.category);
        const folder = category?.slug || category?.name || 'uncategorized';
        const uploadPromises = newFiles.map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
          const dynamicPath = `${folder}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('uploads').upload(dynamicPath, file);
          
          if (uploadError) throw new Error('STORAGE_ERROR: ' + uploadError.message);
          
          const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(dynamicPath);
          return publicUrlData.publicUrl;
        });
        uploadedUrls = await Promise.all(uploadPromises);
      }
      
      const primaryImageUrl = uploadedUrls[0] || '';

      // 1. Determine Price and Quote Flags
      const parsedPrice = parseFloat(formData.price);
      const isPriceEmpty = formData.price === '' || isNaN(parsedPrice) || parsedPrice <= 0;
      const finalPrice = isPriceEmpty ? 0 : parsedPrice;
      const finalRequiresQuote = isPriceEmpty ? true : formData.requires_quote;

      // 2. Insert Product
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        stock: parseInt(formData.stock) || 0,
        category_id: formData.category,
        brand_id: formData.brand_id || null,
        sku: formData.sku || null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        
        image_urls: uploadedUrls,
        
        is_service: formData.is_service,
        is_oeko_tex: formData.is_oeko_tex,
        transaction_type: formData.transaction_type,
        requires_quote: finalRequiresQuote,
        is_customizable: formData.is_customizable,
        specifications: specsObject
      };

      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([productPayload])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert Stock Movement
      if (productData) {
        const { error: stockError } = await supabase
          .from('stock_movements')
          .insert([{
            product_id: productData.id,
            movement_type: 'Added',
            quantity: parseInt(formData.stock) || 0,
            reference: 'Initial Stock'
          }]);
          
        if (stockError) {
          console.warn('Failed to log stock movement:', stockError);
        }
      }

      toast.success('🎉 Product published successfully!');
      navigate('/admin/products');
    } catch (err: any) {
      console.error('Error saving product:', err);
      // Friendly Error Translation (Server-Side)
      if (err?.code === '23505' || (err?.message && (err.message.includes('products_sku_key') || err.message.includes('unique constraint')))) {
        const msg = 'It looks like a product with this SKU already exists. Please enter a unique SKU.';
        setSkuError(msg);
        setError(msg);
        toast.error(msg);
      } else if (err?.message && (err.message.includes('STORAGE_ERROR') || err.message.includes('storage') || err.message.includes('upload'))) {
        const msg = 'We had trouble saving your image. Please check your internet connection or try a different image file.';
        setError(msg);
        toast.error(msg);
      } else {
        const msg = 'Something went wrong while saving your product. Please try clicking save again in a moment.';
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Link to="/admin/products" className="mr-3 text-slate-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            Add New Product
          </h1>
          <div className="text-sm text-gray-500 font-medium flex items-center space-x-2 mt-1 ml-9">
            <span>Dashboard</span>
            <span>/</span>
            <span>Inventory</span>
            <span>/</span>
            <span className="text-gray-900">Add New Product</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/admin/products" className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl shadow-md transition-all font-bold text-sm">
            Cancel
          </Link>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg transition-all text-sm font-bold flex items-center space-x-2 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            <span>{loading ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}

      <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">1</span>
              <h2 className="text-lg font-black text-gray-900">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">SKU</label>
                <input 
                  type="text" 
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full border ${skuError ? 'border-red-500 bg-red-50/50' : 'border-white/60'} rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all`}
                  placeholder="Enter SKU"
                />
                {skuError && <p className="text-xs font-bold text-red-500 mt-1">{skuError}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                <select 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Brand</label>
                <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  <option value="">Select a brand...</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea 
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Enter full product description..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">2</span>
              <h2 className="text-lg font-black text-gray-900">Pricing & Stock</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Selling Price (Rs.)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Compare Price (Rs.)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="compare_at_price"
                  value={formData.compare_at_price}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Cost Price (Rs.)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Low Stock Threshold</label>
                <input 
                  type="number" 
                  name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">3</span>
              <h2 className="text-lg font-black text-gray-900">Technical Specifications</h2>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_SPECS.map(specName => {
                const isAdded = specifications.some(s => s.key.trim().toLowerCase() === specName.toLowerCase());
                return (
                  <button
                    key={specName}
                    type="button"
                    onClick={() => addQuickSpec(specName)}
                    disabled={isAdded}
                    className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      isAdded 
                        ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {!isAdded && <Plus size={12} />}
                    {specName}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    placeholder="Key (e.g., Power Supply)"
                    className="flex-1 border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    placeholder="Value (e.g., 230V)"
                    className="flex-1 border border-white/60 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecRow}
                className="flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors mt-2"
              >
                <Plus size={16} />
                <span>Add Row</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-6">
          
          {/* Media */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
              <h2 className="text-lg font-black text-gray-900">Product Image</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/60 rounded-xl p-6 text-center hover:bg-white/40 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                  <ImageIcon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">Upload Product Images</p>
                <p className="text-xs text-gray-500 mb-4">Select multiple images (JPEG/PNG/WEBP, max 5MB)</p>
                <input 
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {previews.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2">Selected Images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg border border-white/60 overflow-hidden group">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <button 
                            type="button"
                            onClick={() => removeNewFile(index)} 
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* B2B Rules */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">5</span>
              <h2 className="text-lg font-black text-gray-900">B2B Rules</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Transaction Type</label>
                <select 
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"
                >
                  <option value="sale">Sale Only (Buy)</option>
                  <option value="rent">Rent Only</option>
                  <option value="both">Sale & Rent</option>
                </select>
              </div>

              <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 space-y-4 mt-4 border border-white/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Requires Quote</h3>
                    <p className="text-xs text-gray-500">Hide "Add to Cart" and show "Request Quote"</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="requires_quote" checked={formData.requires_quote} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b1042]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Customizable</h3>
                    <p className="text-xs text-gray-500">Allow users to upload drawings/specs</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="is_customizable" checked={formData.is_customizable} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b1042]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">6</span>
              <h2 className="text-lg font-black text-gray-900">Visibility</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner text-sm"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Service, Rentable, Oeko-Tex Flags */}
              <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 space-y-4 mt-4 border border-white/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Service</h3>
                    <p className="text-xs text-gray-500">Item is a service</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="is_service" checked={formData.is_service} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0b1042]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Oeko-Tex</h3>
                    <p className="text-xs text-gray-500">Oeko-Tex Certified flag</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="is_oeko_tex" checked={formData.is_oeko_tex} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

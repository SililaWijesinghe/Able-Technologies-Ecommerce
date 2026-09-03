import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Image as ImageIcon, Save, Check, Plus, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productNotFound, setProductNotFound] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skuError, setSkuError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    description: '',
    price: '',
    compare_at_price: '',
    cost_price: '',
    stock: '',
    low_stock_threshold: '5',
    image_url: '',
    status: 'active',
    is_service: false,
    is_oeko_tex: false,
    transaction_type: 'sale',
    requires_quote: false,
    is_customizable: false
  });

  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{ key: '', value: '' }]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) {
          setProductNotFound(true);
          return;
        }
        
        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError || !data) {
          setProductNotFound(true);
          return;
        }
        
        // Parse Specifications JSONB back to Array
        const loadedSpecs = [];
        if (data.specifications && typeof data.specifications === 'object') {
          for (const [key, value] of Object.entries(data.specifications)) {
            loadedSpecs.push({ key, value: String(value) });
          }
        }
        if (loadedSpecs.length === 0) loadedSpecs.push({ key: '', value: '' });
        
        setSpecifications(loadedSpecs);

        setFormData({
          name: data.name || '',
          sku: data.sku || '',
          category: data.category_id || data.category || '',
          brand: data.brand || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          compare_at_price: data.compare_at_price?.toString() || '',
          cost_price: data.cost_price?.toString() || '',
          stock: data.stock?.toString() || '',
          low_stock_threshold: data.low_stock_threshold?.toString() || '5',
          image_url: data.image_urls?.[0] || '',
          status: data.status || 'active',
          is_service: data.is_service || false,
          is_oeko_tex: data.is_oeko_tex || false,
          transaction_type: data.transaction_type || 'sale',
          requires_quote: data.requires_quote || false,
          is_customizable: data.is_customizable || false
        });
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setProductNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = val;
    setSpecifications(newSpecs);
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    setSkuError('');

    // Pre-Submission Validation (Client-Side)
    if (!formData.name.trim()) {
      const msg = 'Oops! Please enter a Product Name before saving.';
      setError(msg);
      toast.error(msg);
      setSaving(false);
      return;
    }
    if (!formData.category) {
      const msg = 'Oops! Please select a Category before saving this product.';
      setError(msg);
      toast.error(msg);
      setSaving(false);
      return;
    }
    // Removed strict price validation to support missing/zero prices in B2B catalog mode
    if (formData.stock === '' || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      const msg = 'Oops! Please enter a valid Stock Quantity.';
      setError(msg);
      toast.error(msg);
      setSaving(false);
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
      let finalImageUrl = formData.image_url;
      if (uploadMethod === 'file' && selectedFile) {
        const category = categories.find(c => c.id === formData.category);
        const folder = category?.slug || category?.name || 'uncategorized';
        const timestamp = Date.now();
        const fileName = `${timestamp}_${selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const dynamicPath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(dynamicPath, selectedFile);
          
        if (uploadError) {
          throw new Error('STORAGE_ERROR: ' + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(dynamicPath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      // Determine Price and Quote Flags
      const parsedPrice = parseFloat(formData.price);
      const isPriceEmpty = formData.price === '' || isNaN(parsedPrice) || parsedPrice <= 0;
      const finalPrice = isPriceEmpty ? 0 : parsedPrice;
      const finalRequiresQuote = isPriceEmpty ? true : formData.requires_quote;

      const updatePayload = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        stock: parseInt(formData.stock) || 0,
        category_id: formData.category,
        brand: formData.brand || null,
        sku: formData.sku || null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        image_urls: finalImageUrl ? [finalImageUrl] : [],
        is_service: formData.is_service,
        is_oeko_tex: formData.is_oeko_tex,
        transaction_type: formData.transaction_type,
        requires_quote: finalRequiresQuote,
        is_customizable: formData.is_customizable,
        specifications: specsObject
      };

      const { error: updateError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id);

      if (updateError) throw updateError;

      const successMsg = 'Product updated successfully!';
      setSuccess(successMsg);
      toast.success('🎉 ' + successMsg);
      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
      
    } catch (err: any) {
      console.error('Error updating product:', err);
      // Human-Readable Error Translation (Server/Database)
      if (err?.code === '23505' || (err?.message && (err.message.includes('products_sku_key') || err.message.includes('unique constraint')))) {
        const msg = 'This SKU is already assigned to another product. Please enter a unique SKU.';
        setSkuError(msg);
        setError(msg);
        toast.error(msg);
      } else if (err?.message && (err.message.includes('STORAGE_ERROR') || err.message.includes('storage') || err.message.includes('upload'))) {
        const msg = "We couldn't upload the new product image. Please check your connection or try a smaller file.";
        setError(msg);
        toast.error(msg);
      } else if (err?.code === '42501' || (err?.message && err.message.includes('permission'))) {
        const msg = "You don't have permission to save these changes. Please refresh your session.";
        setError(msg);
        toast.error(msg);
      } else {
        const msg = 'Something went wrong while saving your changes. Please try clicking save again in a moment.';
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center text-slate-500">
          <Loader2 size={32} className="animate-spin mb-4 text-[#0b1042]" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (productNotFound) {
    return (
      <div className="bg-white p-8 md:p-16 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[500px] max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#0b1042] mb-2">Unable to find this product</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Unable to find this product. It may have been removed or relocated.
        </p>
        <Link 
          to="/admin/products" 
          className="px-6 py-3 bg-[#0b1042] hover:bg-blue-900 text-white font-bold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Link to="/admin/products" className="mr-3 text-slate-500 hover:text-gray-900 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            Edit Product
          </h1>
          <div className="text-sm text-gray-500 font-medium flex items-center space-x-2 mt-1 ml-9">
            <span>Dashboard</span>
            <span>/</span>
            <span>Inventory</span>
            <span>/</span>
            <span className="text-gray-900">Edit Product</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/admin/products" className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl shadow-md transition-all font-bold text-sm">
            Cancel
          </Link>
          <button 
            onClick={handleUpdate}
            disabled={saving}
            className="bg-[#0b1042] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 hover:bg-blue-900 transition-colors disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed shadow-md"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold border border-green-100 flex items-center">
          <Check size={18} className="mr-2" />
          {success}
        </div>
      )}

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className={`w-full border ${skuError ? 'border-red-500 bg-red-50/50' : 'border-white/60'} rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all`}
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all bg-white"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                  placeholder="e.g. SMC, Festo, Loctite"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Description</label>
                <textarea 
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all resize-none"
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Initial Stock <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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

        {/* Right Column - Image & Media */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
              <h2 className="text-lg font-black text-gray-900">Media</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" checked={uploadMethod === 'url'} onChange={() => setUploadMethod('url')} className="text-blue-600" />
                  <span className="text-sm text-gray-700 font-medium">Image URL</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="radio" checked={uploadMethod === 'file'} onChange={() => setUploadMethod('file')} className="text-blue-600" />
                  <span className="text-sm text-gray-700 font-medium">File Upload</span>
                </label>
              </div>

              {uploadMethod === 'url' ? (
                <div className="border-2 border-dashed border-white/60 rounded-xl p-6 text-center hover:bg-white/40 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 mb-1">Enter Image URL</p>
                  <p className="text-xs text-gray-500 mb-4">Paste a direct link to an image</p>
                  <input 
                    key="url-input"
                    type="url" 
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={handleChange}
                    className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/60 rounded-xl p-6 text-center hover:bg-white/40 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-700 mb-1">Upload File</p>
                  <p className="text-xs text-gray-500 mb-4">Select an image to replace current</p>
                  <input 
                    key="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}

              {/* Preview Box */}
              {(uploadMethod === 'url' && formData.image_url) || (uploadMethod === 'file' && selectedFile) || formData.image_url ? (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2">Preview:</p>
                  <div className="w-full aspect-square bg-white/40 rounded-xl border-2 border-dashed border-white/60 flex flex-col items-center justify-center overflow-hidden">
                    <img 
                      src={uploadMethod === 'file' && selectedFile ? URL.createObjectURL(selectedFile) : formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-contain mix-blend-multiply p-2" 
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                  </div>
                </div>
              ) : null}
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

          {/* Visibility & Badges */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">6</span>
              <h2 className="text-lg font-black text-gray-900">Badges & Tags</h2>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 space-y-4 border border-white/60">
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
      </form>
    </div>
  );
}


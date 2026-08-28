import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Image as ImageIcon, Save, Check } from 'lucide-react';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    status: 'active'
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        if (!id) return;
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setFormData({
            name: data.name || '',
            sku: data.sku || '',
            category: data.category || '',
            brand: data.brand || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            compare_at_price: data.compare_at_price?.toString() || '',
            cost_price: data.cost_price?.toString() || '',
            stock: data.stock?.toString() || '',
            low_stock_threshold: data.low_stock_threshold?.toString() || '5',
            image_url: data.image_urls?.[0] || '',
            status: data.status || 'active'
          });
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatePayload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        category: formData.category,
        brand: formData.brand || null,
        sku: formData.sku || null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        image_urls: formData.image_url ? [formData.image_url] : [],
      };

      const { error: updateError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess('Product updated successfully!');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
      
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center text-gray-400">
          <Loader2 size={32} className="animate-spin mb-4 text-[#0b1042]" />
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center">
            <Link to="/admin/products" className="mr-3 text-gray-400 hover:text-gray-900 transition-colors">
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
          <Link to="/admin/products" className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button 
            onClick={handleUpdate}
            disabled={saving}
            className="bg-[#0b1042] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 hover:bg-blue-900 transition-colors disabled:opacity-70"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Changes</span>
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
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                  placeholder="Enter SKU"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                <select 
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all bg-white"
                >
                  <option value="">Select category...</option>
                  <option value="Pneumatics">Pneumatics</option>
                  <option value="Hydraulics">Hydraulics</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all resize-none"
                  placeholder="Enter full product description..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">2</span>
              <h2 className="text-lg font-black text-gray-900">Pricing & Stock</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Selling Price (Rs.) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  step="0.01"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
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
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                  placeholder="5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image & Media */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">3</span>
              <h2 className="text-lg font-black text-gray-900">Media</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Image URL</label>
                <input 
                  type="url" 
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                  placeholder="https://..."
                />
              </div>

              {/* Preview Box */}
              <div className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-gray-300 mb-2" />
                    <span className="text-xs font-bold text-gray-400">Image Preview</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center">
                Paste a valid image URL to see preview
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


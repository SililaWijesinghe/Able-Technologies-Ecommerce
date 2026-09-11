// v1.1 - Cache Busting Uncapped Recursion
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, X, ArrowLeft, Image as ImageIcon, Save, Check, Plus, Trash2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { buildCategoryOptions, getHierarchicalCategories } from '../../utils/categoryUtils';
import { ApplicableFieldsInput } from '../../components/admin/ApplicableFieldsInput';
import { useQueryClient } from '@tanstack/react-query';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productNotFound, setProductNotFound] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skuError, setSkuError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingDownloads, setExistingDownloads] = useState<{name: string, url: string}[]>([]);
  const [newDownloadFiles, setNewDownloadFiles] = useState<File[]>([]);

  useEffect(() => {
    const objectUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [newFiles]);
  

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
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
  
  const removeExistingImage = (index: number) => {
    setImagesToDelete(prev => [...prev, existingImages[index]]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const validFiles = files.filter(file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          toast.error(file.name + ' is not a valid format (PDF, JPG, PNG, WEBP)');
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(file.name + ' exceeds 10MB limit');
          return false;
        }
        return true;
      });
      setNewDownloadFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeNewDownloadFile = (index: number) => {
    setNewDownloadFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingDownload = (index: number) => {
    setExistingDownloads(prev => prev.filter((_, i) => i !== index));
  };

  // Form State
  const [hasMainSku, setHasMainSku] = useState(true);
  const [fallbackBaseSku] = useState('VAR-' + Date.now().toString().slice(-6));
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

  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{ key: '', value: '' }]);
  const [applicableFields, setApplicableFields] = useState<string[]>([]);
  const [variants, setVariants] = useState<{ id?: string; sku: string; price_modifier: number; inventory_count: number; attributes?: Record<string, string> }[]>([]);
  const [productOptions, setProductOptions] = useState<{name: string, values: string[], inputValue: string}[]>([]);
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  const addVariant = () => {
    setVariants([...variants, { sku: '', price_modifier: 0, inventory_count: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const generateVariants = (options: {name: string, values: string[], inputValue: string}[]) => {
    const validOptions = options.filter(o => o.name.trim() && o.values.length > 0);
    if (validOptions.length === 0) {
      if (options.length === 0) setVariants([]);
      return;
    }
    const generateCombinations = (opts: any[], idx = 0, current = {}): any[] => {
      if (idx === opts.length) return [current];
      const opt = opts[idx];
      let combos: any[] = [];
      for (const val of opt.values) {
        combos = combos.concat(generateCombinations(opts, idx + 1, { ...current, [opt.name]: val }));
      }
      return combos;
    };
    const combinations = generateCombinations(validOptions);
    const activeBaseSku = (hasMainSku && formData.sku) ? formData.sku : fallbackBaseSku;
    const newVariants = combinations.map(combo => {
      const existing = variants.find(v => JSON.stringify(v.attributes) === JSON.stringify(combo));
      const tagSuffix = Object.values(combo).map((v: any) => v.replace(/\s+/g, "").toUpperCase()).join("-");
      return existing || {
        sku: `${activeBaseSku}-${tagSuffix}`,
        price_modifier: 0,
        inventory_count: 0,
        attributes: combo
      };
    });
    setVariants(newVariants);
  };

  const addOption = () => setProductOptions([...productOptions, { name: "", values: [], inputValue: "" }]);
  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...productOptions];
    (newOptions[index] as any)[field] = value;
    setProductOptions(newOptions);
    if (field !== "inputValue") generateVariants(newOptions);
  };
  const removeOption = (index: number) => {
    const newOptions = productOptions.filter((_, i) => i !== index);
    setProductOptions(newOptions);
    generateVariants(newOptions);
  };
  const handleOptionKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = productOptions[index].inputValue.trim();
      if (val && !productOptions[index].values.includes(val)) {
        const newOptions = [...productOptions];
        newOptions[index].values.push(val);
        newOptions[index].inputValue = "";
        setProductOptions(newOptions);
        generateVariants(newOptions);
      }
    }
  };
  const removeOptionValue = (optIndex: number, valIndex: number) => {
    const newOptions = [...productOptions];
    newOptions[optIndex].values = newOptions[optIndex].values.filter((_, i) => i !== valIndex);
    setProductOptions(newOptions);
    generateVariants(newOptions);
  };

  const applyBulkVariant = (field: string, value: string | number) => {
    setVariants(variants.map(v => ({ ...v, [field]: value })));
  };
  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

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
        const { data: brandData } = await supabase.from('brands').select('*');
        if (brandData) setBrands(brandData);

        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*, product_variants(*)')
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

        if (data.product_variants && data.product_variants.length > 0) {
          const loadedVariants = data.product_variants.map((v: any) => ({
            id: v.id,
            sku: v.sku || '',
            price_modifier: v.price_modifier || 0,
            inventory_count: v.inventory_count || 0,
            attributes: v.attributes || {}
          }));
          setVariants(loadedVariants);
          
          // Reconstruct ProductOptions from variants
          const optionMap = new Map<string, Set<string>>();
          loadedVariants.forEach(v => {
            if (v.attributes) {
              Object.entries(v.attributes).forEach(([key, val]) => {
                if (!optionMap.has(key)) optionMap.set(key, new Set());
                optionMap.get(key)!.add(val as string);
              });
            }
          });
          
          const reconstructedOptions = Array.from(optionMap.entries()).map(([name, valuesSet]) => ({
            name,
            values: Array.from(valuesSet),
            inputValue: ""
          }));
          
          setProductOptions(reconstructedOptions);
        }

        setFormData({
          name: data.name || '',
          sku: data.sku || '',
          category: data.category_id || data.category || '',
          brand_id: data.brand_id || '',
          description: data.description || '',
          price: data.price?.toString() || '',
          compare_at_price: data.compare_at_price?.toString() || '',
          cost_price: data.cost_price?.toString() || '',
          stock: data.stock?.toString() || '',
          low_stock_threshold: data.low_stock_threshold?.toString() || '5',
          status: data.status || 'active',
          is_service: data.is_service || false,
          is_oeko_tex: data.is_oeko_tex || false,
          transaction_type: data.transaction_type || 'sale',
          requires_quote: data.requires_quote || false,
          is_customizable: data.is_customizable || false
        });
        
        setApplicableFields(Array.isArray(data.applicable_fields) ? data.applicable_fields : []);

        const downloadsArray = Array.isArray(data.downloads) ? data.downloads : [];
        setExistingDownloads(downloadsArray);

        const imgs = data.image_urls || [];
        setExistingImages(imgs);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setProductNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const activeBaseSku = (hasMainSku && formData.sku) ? formData.sku : fallbackBaseSku;
  const previousSkuRef = React.useRef(activeBaseSku);
  React.useEffect(() => {
    const oldSku = previousSkuRef.current || 'SKU';
    const newSku = activeBaseSku || 'SKU';
    if (oldSku !== newSku) {
      setVariants(prev => prev.map(v => {
        if (v.sku.startsWith(oldSku + '-')) {
           return { ...v, sku: v.sku.replace(oldSku + '-', newSku + '-') };
        }
        return v;
      }));
      previousSkuRef.current = newSku;
    }
  }, [activeBaseSku, hasMainSku]);

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

  
  const hierarchicalCategories = getHierarchicalCategories(categories);
  const categoryOptions = buildCategoryOptions(categories);

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
      
      const finalImageUrls = [...existingImages, ...uploadedUrls];
      const primaryImageUrl = finalImageUrls[0] || '';

      // 0.6 Handle Downloads Upload
      let uploadedDownloads: {name: string, url: string}[] = [];
      if (newDownloadFiles.length > 0) {
        const category = categories.find(c => c.id === formData.category);
        const folderName = category?.name?.replace(/[^a-zA-Z0-9.\-_]/g, '_') || 'uncategorized';
        const prodName = formData.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        
        const uploadPromises = newDownloadFiles.map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
          const dynamicPath = `${folderName}/${prodName}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('product_downloads').upload(dynamicPath, file);
          
          if (uploadError) throw new Error('DOWNLOAD_STORAGE_ERROR: ' + uploadError.message);
          
          const { data: publicUrlData } = supabase.storage.from('product_downloads').getPublicUrl(dynamicPath);
          return { name: file.name, url: publicUrlData.publicUrl };
        });
        uploadedDownloads = await Promise.all(uploadPromises);
      }
      
      const finalDownloads = [...existingDownloads, ...uploadedDownloads];

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
        brand_id: formData.brand_id || null,
        sku: (hasMainSku && formData.sku) ? formData.sku : null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
        image_urls: finalImageUrls,
        downloads: finalDownloads,
        
        is_service: formData.is_service,
        is_oeko_tex: formData.is_oeko_tex,
        transaction_type: formData.transaction_type,
        requires_quote: finalRequiresQuote,
        is_customizable: formData.is_customizable,
        specifications: specsObject,
        applicable_fields: applicableFields
      };

      const { error: updateError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', id);

      if (updateError) throw updateError;

      // Clean up orphaned images from Storage bucket
      if (imagesToDelete.length > 0) {
        try {
          const pathsToDelete = imagesToDelete.map(url => {
            const parts = url.split('/uploads/');
            return parts.length > 1 ? parts[1] : null;
          }).filter(Boolean) as string[];

          if (pathsToDelete.length > 0) {
            const { error: storageDeleteError } = await supabase.storage.from('uploads').remove(pathsToDelete);
            if (storageDeleteError) {
              console.warn('Failed to delete some orphaned images from storage:', storageDeleteError);
            }
          }
        } catch (storageErr) {
          console.error('Unexpected error during orphaned image deletion:', storageErr);
        }
      }

      // Sync Variants
      const existingIds = variants.filter(v => v.id).map(v => v.id);
      
      if (existingIds.length > 0) {
        const { data: dbVariants } = await supabase.from('product_variants').select('id').eq('product_id', id);
        if (dbVariants) {
          const idsToDelete = dbVariants.map(v => v.id).filter(dbId => !existingIds.includes(dbId));
          if (idsToDelete.length > 0) {
            await supabase.from('product_variants').delete().in('id', idsToDelete);
          }
        }
      } else {
        await supabase.from('product_variants').delete().eq('product_id', id);
      }

      if (variants.length > 0) {
        const variantPayload = variants.map(v => {
          const payload: any = {
            product_id: id,
            sku: v.sku,
            price_modifier: v.price_modifier,
            inventory_count: v.inventory_count,
            attributes: v.attributes || {}
          };
          if (v.id) payload.id = v.id;
          return payload;
        });
        const { error: variantError } = await supabase.from('product_variants').upsert(variantPayload);
        if (variantError) throw variantError;
      }

      queryClient.invalidateQueries({ queryKey: ['products'] });

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
        const msg = 'This SKU (or one of its variant SKUs) is already assigned to another product. Please enter a unique SKU.';
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
                <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                  Product Name <span className="text-red-500">*</span>
                  <div className="group relative flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold cursor-help cursor-pointer">?</div>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-[11px] rounded shadow-lg z-10 whitespace-normal text-center">
                      Always include the specific model number in the title to match internal folder names.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all"
                  placeholder="Enter product name"
                />
                <span className="text-xs text-blue-600 font-semibold block mt-1">Note: Always include the specific model number in the title to match internal folder names (e.g., '3 Way PE Connector - PE 04').</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Main SKU</label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasMainSku} 
                      onChange={(e) => setHasMainSku(e.target.checked)}
                      className="form-checkbox text-blue-600 rounded border-gray-300 w-4 h-4"
                    />
                    <span className="text-xs text-gray-500 font-medium select-none">Product has Main SKU</span>
                  </label>
                </div>
                {hasMainSku ? (
                  <input 
                    type="text" 
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className={`w-full border ${skuError ? 'border-red-500 bg-red-50/50' : 'border-white/60'} rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all`}
                    placeholder="Enter SKU"
                  />
                ) : (
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-400 font-mono italic">
                    Variants will use auto-generated prefix
                  </div>
                )}
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
                  {categoryOptions.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Brand</label>
                <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all">
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
                  className="w-full border border-white/60 rounded-xl p-3 text-sm focus:border-[#0b1042] focus:ring-1 focus:ring-[#0b1042] outline-none transition-all resize-none"
                  placeholder="Enter full product description..."
                ></textarea>
                <span className="text-xs text-blue-600 font-semibold block mt-1">Please include full machine/part specifications and model details.</span>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-gray-100">
                <ApplicableFieldsInput 
                  value={applicableFields}
                  onChange={setApplicableFields}
                />
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


          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
              <h2 className="text-lg font-black text-gray-900">Product Options</h2>
            </div>
            
            <p className="text-xs text-gray-500 mb-4 font-medium">Define options like Size or Color. Variants will be automatically generated below.</p>
            
            <div className="space-y-4">
              {productOptions.map((opt, optIdx) => (
                <div key={optIdx} className="p-4 border border-slate-200 bg-white rounded-2xl space-y-3 relative group">
                  <button type="button" onClick={() => removeOption(optIdx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option Name</label>
                      <input
                        type="text"
                        value={opt.name}
                        onChange={(e) => updateOption(optIdx, 'name', e.target.value)}
                        placeholder="e.g., Size"
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Option Values</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {opt.values.map((val, valIdx) => (
                          <span key={valIdx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
                            {val}
                            <button type="button" onClick={() => removeOptionValue(optIdx, valIdx)} className="text-slate-500 hover:text-red-500"><X size={14} /></button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={opt.inputValue}
                        onChange={(e) => updateOption(optIdx, 'inputValue', e.target.value)}
                        onKeyDown={(e) => handleOptionKeyDown(e, optIdx)}
                        placeholder="Type value and press Enter..."
                        className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addOption}
                className="flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Add another option</span>
              </button>
            </div>
          </div>

          {variants.length > 0 && (
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">5</span>
                  <h2 className="text-lg font-black text-gray-900">Generated Variants</h2>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <input type="number" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} placeholder="Bulk Price..." className="w-24 px-2 py-1.5 text-xs outline-none" />
                    <button type="button" onClick={() => { if(bulkPrice) applyBulkVariant('price_modifier', parseFloat(bulkPrice))}} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 text-xs border-l border-slate-200 transition-colors">Apply</button>
                  </div>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <input type="number" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)} placeholder="Bulk Stock..." className="w-24 px-2 py-1.5 text-xs outline-none" />
                    <button type="button" onClick={() => { if(bulkStock) applyBulkVariant('inventory_count', parseInt(bulkStock))}} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 text-xs border-l border-slate-200 transition-colors">Apply</button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                      <th className="p-3 font-bold">Variant</th>
                      <th className="p-3 font-bold">SKU</th>
                      <th className="p-3 font-bold w-32">Price Mod (+)</th>
                      <th className="p-3 font-bold w-32">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {variants.map((variant, idx) => (
                      <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {Object.values(variant.attributes || {}).map((val: any, i) => (
                              <span key={i} className="inline-flex bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-xs font-bold">{val}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            <span className="text-slate-400 bg-slate-50 border border-r-0 border-slate-200 px-2 py-1 rounded-l-md text-xs font-mono select-none">
                              {activeBaseSku}-
                            </span>
                            <input
                              type="text"
                              value={variant.sku.startsWith(activeBaseSku + '-') ? variant.sku.replace(activeBaseSku + '-', '') : variant.sku}
                              onChange={(e) => {
                                const suffix = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
                                updateVariant(idx, 'sku', `${activeBaseSku}-${suffix}`);
                              }}
                              className="w-full min-w-[80px] bg-transparent border border-slate-200 rounded-r-md focus:border-blue-500 focus:ring-0 p-1 text-sm outline-none transition-all uppercase font-mono"
                              placeholder="SUFFIX"
                            />
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.price_modifier}
                            onChange={(e) => updateVariant(idx, 'price_modifier', parseFloat(e.target.value) || 0)}
                            className="w-full min-w-[80px] bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm outline-none transition-all"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={variant.inventory_count}
                            onChange={(e) => updateVariant(idx, 'inventory_count', parseInt(e.target.value) || 0)}
                            className="w-full min-w-[60px] bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-1 text-sm outline-none transition-all"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Image & Media */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-3xl p-6 space-y-5">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">4</span>
              <h2 className="text-lg font-black text-gray-900">Media</h2>
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
              
              {(existingImages.length > 0 || previews.length > 0) && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2">Selected Images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div key={'ext-'+index} className="relative aspect-square bg-gray-100 rounded-lg border border-white/60 overflow-hidden group">
                        <img src={url} alt="Existing" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <button 
                            type="button"
                            onClick={() => removeExistingImage(index)} 
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#0b1042] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow whitespace-nowrap z-10">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                    {/* New Files */}
                    {previews.map((preview, index) => (
                      <div key={'new-'+index} className="relative aspect-square bg-gray-100 rounded-lg border border-blue-400 overflow-hidden group">
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
                        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow whitespace-nowrap z-10">
                          New
                        </div>
                        {existingImages.length === 0 && index === 0 && (
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#0b1042] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow whitespace-nowrap z-10">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Downloads */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/60 rounded-xl p-6 text-center hover:bg-white/40 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                  <Save size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">Product Downloads (Manuals, Specs)</p>
                <p className="text-xs text-gray-500 mb-4">Select multiple files (PDF/JPEG/PNG/WEBP, max 10MB)</p>
                <input 
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleDownloadFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              {(existingDownloads.length > 0 || newDownloadFiles.length > 0) && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2">Selected Files:</p>
                  <ul className="space-y-2">
                    {/* Existing Downloads */}
                    {existingDownloads.map((file, index) => (
                      <li key={'ext-dl-'+index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <span className="text-sm font-medium text-gray-700 truncate mr-4">{file.name}</span>
                        <button 
                          type="button"
                          onClick={() => removeExistingDownload(index)} 
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                    {/* New Download Files */}
                    {newDownloadFiles.map((file, index) => (
                      <li key={'new-dl-'+index} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-emerald-800 truncate mr-2">{file.name}</span>
                          <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">New</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeNewDownloadFile(index)} 
                          className="text-emerald-400 hover:text-red-500 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
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


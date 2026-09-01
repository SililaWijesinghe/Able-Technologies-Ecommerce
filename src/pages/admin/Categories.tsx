import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, LayoutGrid, Loader2, Image as ImageIcon, AlertCircle, Upload, Link as LinkIcon, X } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Controlled Modal States
  const [isModalOpen, setIsModalOpen] = useState(false); // Edit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States with safe empty string defaults
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', slug: '', icon_url: '' });
  const [addForm, setAddForm] = useState({ name: '', description: '', slug: '', icon_url: '' });
  
  const [addUploadMethod, setAddUploadMethod] = useState<'url' | 'file'>('url');
  const [editUploadMethod, setEditUploadMethod] = useState<'url' | 'file'>('url');
  
  const [addFile, setAddFile] = useState<File | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [addFilePreview, setAddFilePreview] = useState<string>('');
  const [editFilePreview, setEditFilePreview] = useState<string>('');

  const [addError, setAddError] = useState<string>('');
  const [editError, setEditError] = useState<string>('');

  const [deleteId, setDeleteId] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
        
      if (catErr) throw catErr;

      let currentCats = catData || [];

      // Fetch products for counts
      const { data: prodData } = await supabase.from('products').select('category, category_id');
      
      const counts: Record<string, number> = {};
      if (prodData) {
        prodData.forEach(p => {
          const matched = currentCats.find(c => c.id === p.category_id || c.name === p.category);
          if (matched) {
            counts[matched.id] = (counts[matched.id] || 0) + 1;
          }
        });
      }

      setProductCounts(counts);
      setCategories(currentCats);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to load data", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setAddForm({ name: '', description: '', slug: '', icon_url: '' });
    setAddUploadMethod('url');
    setAddFile(null);
    setAddFilePreview('');
    setAddError('');
    setIsAddModalOpen(true);
  };

  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAddFile(file);
      setAddFilePreview(URL.createObjectURL(file));
      setAddError('');
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditFile(file);
      setEditFilePreview(URL.createObjectURL(file));
      setEditError('');
    }
  };

  const handleAddSave = async () => {
    setAddError('');
    if (!addForm.name.trim()) {
      setAddError("Category name is required.");
      toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });
      return;
    }

    try {
      setIsSubmitting(true);
      let finalIconUrl = addForm.icon_url?.trim() || '';

      // If file upload is selected and a file is attached
      if (addUploadMethod === 'file' && addFile) {
        const fileExt = addFile.name.split('.').pop() || 'png';
        const cleanFileName = addFile.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        const storagePath = `categories/${Date.now()}_${cleanFileName}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(storagePath, addFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(storagePath);

        finalIconUrl = publicUrl;
      }

      // Generate slug if empty
      const generatedSlug = addForm.slug?.trim() || addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const { error } = await supabase.from('categories').insert([{ 
        name: addForm.name.trim(),
        slug: generatedSlug,
        description: addForm.description?.trim() || '',
        icon_url: finalIconUrl 
      }]);

      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint') || error.message?.includes('slug')) {
          throw new Error("This category slug or name already exists. Please choose a unique slug.");
        }
        throw error;
      }

      toast({ title: "Success", description: "Category created!", variant: "success" });
      setAddForm({ name: '', description: '', slug: '', icon_url: '' });
      setAddFile(null);
      setAddFilePreview('');
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create category";
      setAddError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    setEditError('');
    if (!editForm.name.trim()) {
      setEditError("Category name is required.");
      toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });
      return;
    }

    try {
      setIsSubmitting(true);
      let finalIconUrl = editForm.icon_url?.trim() || '';

      // If file upload is selected and a new file is attached
      if (editUploadMethod === 'file' && editFile) {
        const fileExt = editFile.name.split('.').pop() || 'png';
        const cleanFileName = editFile.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        const storagePath = `categories/${Date.now()}_${cleanFileName}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(storagePath, editFile, { upsert: true });

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(storagePath);

        finalIconUrl = publicUrl;
      }

      const generatedSlug = editForm.slug?.trim() || editForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const { error } = await supabase.from('categories').update({ 
        name: editForm.name.trim(), 
        slug: generatedSlug,
        description: editForm.description?.trim() || '',
        icon_url: finalIconUrl 
      }).eq('id', editForm.id);
      
      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint') || error.message?.includes('slug')) {
          throw new Error("This category slug or name already exists. Please choose a unique slug.");
        }
        throw error;
      }

      toast({ title: 'Success', description: 'Category updated!', variant: "success" });
      setIsModalOpen(false);
      setEditFile(null);
      setEditFilePreview('');
      fetchData();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update category";
      setEditError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('categories').delete().eq('id', deleteId);
      if (error) throw error;

      toast({ title: "Success", description: "Category deleted!", variant: "success" });
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete category", variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (cat: any) => {
    setEditForm({
      id: cat?.id || '',
      name: cat?.name || '',
      description: cat?.description || '',
      slug: cat?.slug || '',
      icon_url: cat?.icon_url || ''
    });
    setEditUploadMethod('url');
    setEditFile(null);
    setEditFilePreview('');
    setEditError('');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Liquid Glass Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#ffffff] backdrop-blur-2xl border border-white/40 p-6 rounded-3xl shadow-2xl text-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl border border-white/60 shadow-inner">
              <LayoutGrid size={20} className="text-blue-200" />
            </div>
            <span>Category Management</span>
          </h1>
          <p className="text-slate-600 text-sm mt-2 ml-1">Organize your storefront catalog efficiently.</p>
        </div>

        <button 
          onClick={openAddModal}
          className="flex items-center justify-center bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-[#ffffff] font-semibold py-2.5 px-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/60 rounded-xl relative z-10 transition-all hover:scale-105"
        >
          <Plus size={18} className="mr-2" /> Add Category
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#ffffff] border border-white/40 rounded-3xl p-2 sm:p-6 shadow-2xl text-slate-800 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/40 text-xs uppercase tracking-wider text-slate-800/50">
                <th className="px-6 py-4 font-semibold text-[#000000] border-[#728fad]">Icon</th>
                <th className="px-6 py-4 font-semibold text-[#000000]">Category</th>
                <th className="px-6 py-4 font-semibold text-[#000000]">Status</th>
                <th className="px-6 py-4 font-semibold text-right text-[#000000]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-800/50">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1e3a8a]" />
                    Syncing with database...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-800/50">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-slate-800/20" />
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-white/50 rounded-xl border border-white/40 flex items-center justify-center p-2 shadow-inner group-hover:border-white/60 transition-all">
                        {cat.icon_url ? (
                          <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-contain drop-shadow-md" />
                        ) : (
                          <LayoutGrid className="text-slate-800/30" size={20} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800 text-base tracking-wide">{cat.name}</span>
                      {cat.description && <div className="text-[#000000] text-xs mt-1">{cat.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#00af3a] text-[#ffffff] border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {productCounts[cat.id] || 0} Products
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleEditClick(cat)}
                        className="inline-flex items-center justify-center bg-[#002db0] hover:bg-blue-900 border border-blue-400/20 text-white rounded-lg transition-all shadow-lg min-w-8 w-8 h-8"
                        title="Edit Category"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          setDeleteId(cat.id);
                          setDeleteName(cat.name);
                          setIsDeleteModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center bg-[#fa0d14] hover:bg-red-700 border border-red-500/30 text-white rounded-lg transition-all shadow-lg min-w-8 w-8 h-8 ml-2"
                        title="Delete Category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- CUSTOM REACT MODALS ----------------- */}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !isSubmitting && setIsAddModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-[#ffffff] backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-800 animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                   <Plus size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">Create New Category</h2>
               </div>
               <button 
                 onClick={() => !isSubmitting && setIsAddModalOpen(false)}
                 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
               >
                 <X size={18} />
               </button>
             </div>

             {/* Inline Error Alert */}
             {addError && (
               <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs font-semibold animate-in fade-in duration-200">
                 <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                 <div className="flex-1">{addError}</div>
               </div>
             )}
             
             <div className="space-y-4">
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Category Name <span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    value={addForm.name || ''} 
                    onChange={(e) => {
                      const nameVal = e.target.value;
                      setAddForm({ 
                        ...addForm, 
                        name: nameVal,
                        // auto-suggest slug if not explicitly modified
                        slug: (!addForm.slug || addForm.slug === addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
                          ? nameVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                          : addForm.slug
                      });
                      if (addError) setAddError('');
                    }}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all text-sm font-medium"
                    placeholder="e.g. Industrial Gauges"
                 />
               </div>
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Slug</label>
                 <input 
                    type="text" 
                    value={addForm.slug || ''} 
                    onChange={(e) => {
                      setAddForm({ ...addForm, slug: e.target.value });
                      if (addError) setAddError('');
                    }}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all font-mono text-xs"
                    placeholder="e.g. industrial-gauges"
                 />
                 <p className="text-[11px] text-gray-400 mt-1">Unique URL path identifier</p>
               </div>
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
                 <textarea 
                    rows={3}
                    value={addForm.description || ''} 
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all text-sm"
                    placeholder="Brief description of products in this category..."
                 />
               </div>
               
               {/* Media Switch */}
               <div>
                 <div className="flex items-center justify-between mb-1.5">
                   <label className="text-sm font-semibold text-gray-700">Category Icon / Image</label>
                   <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-semibold">
                     <button
                       type="button"
                       onClick={() => setAddUploadMethod('url')}
                       className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                         addUploadMethod === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                       }`}
                     >
                       <LinkIcon size={12} /> URL
                     </button>
                     <button
                       type="button"
                       onClick={() => setAddUploadMethod('file')}
                       className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                         addUploadMethod === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                       }`}
                     >
                       <Upload size={12} /> File Upload
                     </button>
                   </div>
                 </div>

                 {addUploadMethod === 'url' ? (
                   <div className="flex gap-3 items-center">
                     <div className="flex-1">
                       <input 
                          type="text" 
                          value={addForm.icon_url || ''} 
                          onChange={(e) => setAddForm({ ...addForm, icon_url: e.target.value })}
                          className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-gray-900 outline-none transition-all text-sm"
                          placeholder="https://example.com/icon.png"
                       />
                     </div>
                     <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                       {addForm.icon_url ? (
                         <img src={addForm.icon_url} alt="preview" className="w-full h-full object-contain p-1" onError={(e) => (e.currentTarget.style.display='none')} />
                       ) : (
                         <ImageIcon className="text-gray-300" size={20} />
                       )}
                     </div>
                   </div>
                 ) : (
                   <div className="flex gap-3 items-center">
                     <div className="flex-1">
                       <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/40 rounded-xl p-3 cursor-pointer transition-colors">
                         <Upload size={18} className="text-gray-400 mb-1" />
                         <span className="text-xs font-semibold text-gray-600">
                           {addFile ? addFile.name : 'Choose an image file'}
                         </span>
                         <span className="text-[10px] text-gray-400">PNG, JPG, WEBP, SVG</span>
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           onChange={handleAddFileChange} 
                         />
                       </label>
                     </div>
                     <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                       {addFilePreview ? (
                         <img src={addFilePreview} alt="file preview" className="w-full h-full object-contain p-1" />
                       ) : (
                         <ImageIcon className="text-gray-300" size={20} />
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>
      
             <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleAddSave} 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />} Save Category
                </button>
             </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-[#ffffff] backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-800 animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                   <Edit size={18} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
               </div>
               <button 
                 onClick={() => !isSubmitting && setIsModalOpen(false)}
                 className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
               >
                 <X size={18} />
               </button>
             </div>

             {/* Inline Error Alert */}
             {editError && (
               <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs font-semibold animate-in fade-in duration-200">
                 <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                 <div className="flex-1">{editError}</div>
               </div>
             )}
             
             <div className="space-y-4">
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Category Name <span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    value={editForm.name || ''} 
                    onChange={(e) => {
                      setEditForm({ ...editForm, name: e.target.value });
                      if (editError) setEditError('');
                    }}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all text-sm font-medium"
                    placeholder="e.g. Hand Tools"
                 />
               </div>
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Slug</label>
                 <input 
                    type="text" 
                    value={editForm.slug || ''} 
                    onChange={(e) => {
                      setEditForm({ ...editForm, slug: e.target.value });
                      if (editError) setEditError('');
                    }}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all font-mono text-xs"
                    placeholder="hand-tools"
                 />
                 <p className="text-[11px] text-gray-400 mt-1">Unique URL path identifier</p>
               </div>
               <div>
                 <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
                 <textarea 
                    rows={3}
                    value={editForm.description || ''} 
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-3 text-gray-900 outline-none transition-all text-sm"
                    placeholder="Category description..."
                 />
               </div>
               
               {/* Media Switch */}
               <div>
                 <div className="flex items-center justify-between mb-1.5">
                   <label className="text-sm font-semibold text-gray-700">Category Icon / Image</label>
                   <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-semibold">
                     <button
                       type="button"
                       onClick={() => setEditUploadMethod('url')}
                       className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                         editUploadMethod === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                       }`}
                     >
                       <LinkIcon size={12} /> URL
                     </button>
                     <button
                       type="button"
                       onClick={() => setEditUploadMethod('file')}
                       className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
                         editUploadMethod === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                       }`}
                     >
                       <Upload size={12} /> File Upload
                     </button>
                   </div>
                 </div>

                 {editUploadMethod === 'url' ? (
                   <div className="flex gap-3 items-center">
                     <div className="flex-1">
                       <input 
                          type="text" 
                          value={editForm.icon_url || ''} 
                          onChange={(e) => setEditForm({ ...editForm, icon_url: e.target.value })}
                          className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl p-2.5 text-gray-900 outline-none transition-all text-sm"
                          placeholder="https://example.com/icon.png"
                       />
                     </div>
                     <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                       {editForm.icon_url ? (
                         <img src={editForm.icon_url} alt="preview" className="w-full h-full object-contain p-1" onError={(e) => (e.currentTarget.style.display='none')} />
                       ) : (
                         <ImageIcon className="text-gray-300" size={20} />
                       )}
                     </div>
                   </div>
                 ) : (
                   <div className="flex gap-3 items-center">
                     <div className="flex-1">
                       <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/40 rounded-xl p-3 cursor-pointer transition-colors">
                         <Upload size={18} className="text-gray-400 mb-1" />
                         <span className="text-xs font-semibold text-gray-600">
                           {editFile ? editFile.name : (editForm.icon_url ? 'Choose replacement image' : 'Choose an image file')}
                         </span>
                         <span className="text-[10px] text-gray-400">PNG, JPG, WEBP, SVG</span>
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           onChange={handleEditFileChange} 
                         />
                       </label>
                     </div>
                     <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                       {editFilePreview ? (
                         <img src={editFilePreview} alt="file preview" className="w-full h-full object-contain p-1" />
                       ) : editForm.icon_url ? (
                         <img src={editForm.icon_url} alt="current icon" className="w-full h-full object-contain p-1" />
                       ) : (
                         <ImageIcon className="text-gray-300" size={20} />
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>
      
             <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSave} 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />} Save Changes
                </button>
             </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-md" onClick={() => !isSubmitting && setIsDeleteModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-[#ffffff] backdrop-blur-3xl border border-red-500/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(220,38,38,0.3)] text-slate-800 animate-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
               <AlertCircle className="text-red-500" size={20} />
               <h2 className="text-xl font-bold text-red-600">Delete Category</h2>
             </div>
             
             <div className="py-4">
               <p className="text-gray-700 text-base leading-relaxed">
                 Are you sure you want to delete <strong className="text-gray-900">"{deleteName}"</strong>? 
                 <br/><br/>
                 <span className="text-sm text-red-600 font-medium">Products inside this category will need to be reassigned. This action is irreversible.</span>
               </p>
             </div>
      
             <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteConfirm} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />} Confirm Deletion
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

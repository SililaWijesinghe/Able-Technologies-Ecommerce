import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, LayoutGrid, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Controlled Modal States
  const [isModalOpen, setIsModalOpen] = useState(false); // Edit Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState({ id: '', name: '', description: '', slug: '', icon_url: '' });
  const [addForm, setAddForm] = useState({ name: '', description: '', slug: '', icon_url: '' });
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

  const handleAddSave = async () => {
    if (!addForm.name) {
      toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('categories').insert([{ 
        name: addForm.name,
        slug: addForm.slug,
        description: addForm.description,
        icon_url: addForm.icon_url 
      }]);
      if (error) throw error;

      toast({ title: "Success", description: "Category created!", variant: "success" });
      setAddForm({ name: '', description: '', slug: '', icon_url: '' });
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create category", variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.name) {
      toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('categories').update({ 
        name: editForm.name, 
        slug: editForm.slug,
        description: editForm.description,
        icon_url: editForm.icon_url 
      }).eq('id', editForm.id);
      
      if (error) throw error;

      toast({ title: 'Success', description: 'Category updated!', variant: "success" });
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update category", variant: "danger" });
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
      id: cat.id,
      name: cat.name || '',
      description: cat.description || '',
      slug: cat.slug || '',
      icon_url: cat.icon_url || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Liquid Glass Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-2xl border border-white/40 p-6 rounded-3xl shadow-2xl text-slate-800 relative overflow-hidden">
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
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-slate-800 font-semibold py-2.5 px-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/60 rounded-xl relative z-10 transition-all hover:scale-105"
        >
          <Plus size={18} className="mr-2" /> Add Category
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/40 rounded-3xl p-2 sm:p-6 shadow-2xl text-slate-800 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/40 text-xs uppercase tracking-wider text-slate-800/50">
                <th className="px-6 py-4 font-semibold">Icon</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
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
                      {cat.description && <div className="text-slate-800/50 text-xs mt-1">{cat.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {productCounts[cat.id] || 0} Products
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleEditClick(cat)}
                        className="inline-flex items-center justify-center bg-[#1e3a8a]/30 hover:bg-[#1e3a8a] border border-blue-400/20 text-blue-200 hover:text-slate-800 rounded-lg transition-all shadow-lg min-w-8 w-8 h-8"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          setDeleteId(cat.id);
                          setDeleteName(cat.name);
                          setIsDeleteModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-slate-800 rounded-lg transition-all shadow-lg min-w-8 w-8 h-8 ml-2"
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
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-slate-900/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-800 animate-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/40">
               <Plus className="text-blue-400" />
               <h2 className="text-xl font-bold text-slate-800">Create New Category</h2>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block mb-1 text-sm text-slate-600">Category Name</label>
                 <input 
                    type="text" 
                    value={addForm.name || ''} 
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"
                    placeholder="e.g. Hand Tools"
                 />
               </div>
               <div>
                 <label className="block mb-1 text-sm text-slate-600">Slug</label>
                 <input 
                    type="text" 
                    value={addForm.slug || ''} 
                    onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                    className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner font-mono text-sm"
                    placeholder="hand-tools"
                 />
               </div>
               <div>
                 <label className="block mb-1 text-sm text-slate-600">Description</label>
                 <textarea 
                    rows={3}
                    value={addForm.description || ''} 
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"
                    placeholder="Category description..."
                 />
               </div>
               
               <div className="flex gap-4 items-end">
                 <div className="flex-1">
                   <label className="block mb-1 text-sm text-slate-600">Icon URL</label>
                   <input 
                      type="text" 
                      value={addForm.icon_url || ''} 
                      onChange={(e) => setAddForm({ ...addForm, icon_url: e.target.value })}
                      className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"
                      placeholder="https://..."
                   />
                 </div>
                 <div className="w-14 h-14 shrink-0 bg-slate-800/50 border border-white/60 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                   {addForm.icon_url ? (
                     <img src={addForm.icon_url} alt="preview" className="w-full h-full object-contain p-2" onError={(e) => (e.currentTarget.style.display='none')} />
                   ) : (
                     <ImageIcon className="text-slate-800/20" size={24} />
                   )}
                 </div>
               </div>
             </div>
      
             <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/40">
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all border border-red-500/50 shadow-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddSave} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-slate-800 transition-all border border-blue-500/50 shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />} Save
                </button>
             </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-slate-900/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-800 animate-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/40">
               <Edit className="text-blue-400" size={20} />
               <h2 className="text-xl font-bold text-slate-800">Edit Category</h2>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block mb-1 text-sm text-slate-600">Category Name</label>
                 <input 
                    type="text" 
                    value={editForm.name || ''} 
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"
                    placeholder="e.g. Hand Tools"
                 />
               </div>
               <div>
                 <label className="block mb-1 text-sm text-slate-600">Slug</label>
                 <input 
                    type="text" 
                    value={editForm.slug || ''} 
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                    className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner font-mono text-sm"
                    placeholder="hand-tools"
                 />
               </div>
               <div>
                 <label className="block mb-1 text-sm text-slate-600">Description</label>
                 <textarea 
                    rows={3}
                    value={editForm.description || ''} 
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"
                    placeholder="Category description..."
                 />
               </div>
               
               <div className="flex gap-4 items-end">
                 <div className="flex-1">
                   <label className="block mb-1 text-sm text-slate-600">Icon URL</label>
                   <input 
                      type="text" 
                      value={editForm.icon_url || ''} 
                      onChange={(e) => setEditForm({ ...editForm, icon_url: e.target.value })}
                      className="w-full bg-white/50 focus:bg-white/80 backdrop-blur-md border border-white/60 focus:border-blue-300 rounded-xl p-3 text-slate-800 outline-none transition-all shadow-inner"
                      placeholder="https://..."
                   />
                 </div>
                 <div className="w-14 h-14 shrink-0 bg-slate-800/50 border border-white/60 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                   {editForm.icon_url ? (
                     <img src={editForm.icon_url} alt="preview" className="w-full h-full object-contain p-2" onError={(e) => (e.currentTarget.style.display='none')} />
                   ) : (
                     <ImageIcon className="text-slate-800/20" size={24} />
                   )}
                 </div>
               </div>
             </div>
      
             <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/40">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all border border-red-500/50 shadow-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-slate-800 transition-all border border-blue-500/50 shadow-lg flex items-center gap-2 disabled:opacity-50"
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
          <div className="absolute inset-0 bg-red-950/40 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-slate-900/90 backdrop-blur-3xl border border-red-500/30 rounded-3xl shadow-[0_20px_60px_-15px_rgba(220,38,38,0.3)] text-slate-800 animate-in zoom-in-95 duration-200">
             <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/40">
               <AlertCircle className="text-red-500" size={20} />
               <h2 className="text-xl font-bold text-red-500">Delete Category</h2>
             </div>
             
             <div className="py-4">
               <p className="text-slate-800/80 text-lg leading-relaxed">
                 Are you sure you want to delete <strong className="text-slate-800">"{deleteName}"</strong>? 
                 <br/><br/>
                 <span className="text-sm text-red-300/80">Products inside this category will need to be reassigned. This action is irreversible.</span>
               </p>
             </div>
      
             <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/40">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white transition-all border border-white/40 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteConfirm} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-2 disabled:opacity-50"
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

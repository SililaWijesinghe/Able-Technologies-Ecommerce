import fs from 'fs';

const content = `import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Modal, Button, toast } from '@heroui/react';
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Liquid Glass Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20 shadow-inner">
              <LayoutGrid size={20} className="text-blue-200" />
            </div>
            <span>Category Management</span>
          </h1>
          <p className="text-white/70 text-sm mt-2 ml-1">Organize your storefront catalog efficiently.</p>
        </div>

        <Button 
          className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-white font-semibold py-2.5 px-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 rounded-xl relative z-10 transition-all hover:scale-105"
          onPress={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} className="mr-2" /> Add Category
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 sm:p-6 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                <th className="px-6 py-4 font-semibold">Icon</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-white/50">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1e3a8a]" />
                    Syncing with database...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-white/50">
                    <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center p-2 shadow-inner group-hover:border-white/20 transition-all">
                        {cat.icon_url ? (
                          <img src={cat.icon_url} alt={cat.name} className="w-full h-full object-contain drop-shadow-md" />
                        ) : (
                          <LayoutGrid className="text-white/30" size={20} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white text-base tracking-wide">{cat.name}</span>
                      {cat.description && <div className="text-white/50 text-xs mt-1">{cat.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {productCounts[cat.id] || 0} Products
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Button 
                        isIconOnly
                        className="bg-[#1e3a8a]/30 hover:bg-[#1e3a8a] border border-blue-400/20 text-blue-200 hover:text-white rounded-lg transition-all shadow-lg min-w-8 w-8 h-8"
                        onPress={() => {
                          setEditForm({
                            id: cat.id,
                            name: cat.name || '',
                            description: cat.description || '',
                            slug: cat.slug || '',
                            icon_url: cat.icon_url || ''
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        isIconOnly
                        className="bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white rounded-lg transition-all shadow-lg min-w-8 w-8 h-8"
                        onPress={() => {
                          setDeleteId(cat.id);
                          setDeleteName(cat.name);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* ADD MODAL */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <Modal.Backdrop className="bg-[#0f172a]/60 backdrop-blur-md" />
        <Modal.Container>
          <Modal.Dialog className="bg-slate-900/90 backdrop-blur-3xl border border-white/20 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden">
            {({close}) => (
              <>
                <Modal.Header className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Plus className="text-blue-400" /> Create New Category
                  </h3>
                </Modal.Header>
                <Modal.Body className="space-y-4 py-6">
                  <div className="space-y-1">
                    <label className="text-sm text-white/70 px-1">Category Name</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      placeholder="e.g. Hand Tools"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-white/70 px-1">Slug</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all font-mono text-sm"
                      value={addForm.slug}
                      onChange={(e) => setAddForm({ ...addForm, slug: e.target.value })}
                      placeholder="hand-tools"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-white/70 px-1">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      value={addForm.description}
                      onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                      placeholder="Category description..."
                    />
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-sm text-white/70 px-1">Icon URL</label>
                      <input 
                        type="text"
                        className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        value={addForm.icon_url}
                        onChange={(e) => setAddForm({ ...addForm, icon_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="w-14 h-14 shrink-0 bg-slate-800/50 border border-white/20 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                      {addForm.icon_url ? (
                        <img src={addForm.icon_url} alt="preview" className="w-full h-full object-contain p-2" onError={(e) => (e.currentTarget.style.display='none')} />
                      ) : (
                        <ImageIcon className="text-white/20" size={24} />
                      )}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-t border-white/10 pt-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl" onPress={close} isDisabled={isSubmitting}>Cancel</Button>
                  <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-white rounded-xl" onPress={handleAddSave} isLoading={isSubmitting}>Save</Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

      {/* EDIT MODAL (Strict instructions applied here) */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Backdrop className="bg-[#0f172a]/60 backdrop-blur-md" />
        <Modal.Container>
          <Modal.Dialog className="bg-slate-900/90 backdrop-blur-3xl border border-white/20 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden">
            {({close}) => (
              <>
                <Modal.Header className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Edit className="text-blue-400" size={20} /> Edit Category
                  </h3>
                </Modal.Header>
                <Modal.Body className="space-y-4 py-6">
                  <div className="space-y-1">
                    <label className="text-sm text-white/70 px-1">Category Name</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="e.g. Hand Tools"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-white/70 px-1">Slug</label>
                    <input 
                      type="text"
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all font-mono text-sm"
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      placeholder="hand-tools"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-white/70 px-1">Description</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Category description..."
                    />
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-sm text-white/70 px-1">Icon URL</label>
                      <input 
                        type="text"
                        className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        value={editForm.icon_url}
                        onChange={(e) => setEditForm({ ...editForm, icon_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="w-14 h-14 shrink-0 bg-slate-800/50 border border-white/20 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                      {editForm.icon_url ? (
                        <img src={editForm.icon_url} alt="preview" className="w-full h-full object-contain p-2" onError={(e) => (e.currentTarget.style.display='none')} />
                      ) : (
                        <ImageIcon className="text-white/20" size={24} />
                      )}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer className="border-t border-white/10 pt-4">
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl" onPress={close} isDisabled={isSubmitting}>Cancel</Button>
                  <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-white rounded-xl" onPress={handleSave} isLoading={isSubmitting}>Save Changes</Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Modal.Backdrop className="bg-red-950/40 backdrop-blur-md" />
        <Modal.Container>
          <Modal.Dialog className="bg-slate-900/90 backdrop-blur-3xl border border-red-500/30 text-white shadow-[0_20px_60px_-15px_rgba(220,38,38,0.3)] rounded-3xl overflow-hidden">
            {({close}) => (
              <>
                <Modal.Header className="border-b border-white/10 pb-4">
                  <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                    <AlertCircle size={20} /> Delete Category
                  </h3>
                </Modal.Header>
                <Modal.Body className="py-6">
                  <p className="text-white/80 text-lg leading-relaxed">
                    Are you sure you want to delete <strong className="text-white">"{deleteName}"</strong>? 
                    <br/><br/>
                    <span className="text-sm text-red-300/80">Products inside this category will need to be reassigned. This action is irreversible.</span>
                  </p>
                </Modal.Body>
                <Modal.Footer className="border-t border-white/10 pt-4">
                  <Button className="bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl" onPress={close} isDisabled={isSubmitting}>Cancel</Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/50 rounded-xl" onPress={handleDeleteConfirm} isLoading={isSubmitting}>Confirm Deletion</Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal>

    </div>
  );
}
`
fs.writeFileSync('src/pages/admin/Categories.tsx', content);

import fs from 'fs';

const content = `import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Modal, Button, Input, toast } from '@heroui/react';
import { Plus, Edit, Trash2, LayoutGrid, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon_url: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Form states
  const [addForm, setAddForm] = useState({ name: '', icon_url: '' });
  const [editForm, setEditForm] = useState({ id: '', name: '', icon_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('id, name, icon_url')
        .order('name', { ascending: true });
        
      if (catErr) throw catErr;

      let currentCats = catData || [];

      // Fetch products for counts
      const { data: prodData, error: prodErr } = await supabase.from('products').select('category, category_id');
      
      // Calculate counts
      const counts: Record<string, number> = {};
      prodData?.forEach(p => {
        const matched = currentCats.find(c => c.id === p.category_id || c.name === p.category);
        if (matched) {
          counts[matched.id] = (counts[matched.id] || 0) + 1;
        }
      });

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

  const handleAdd = async (closeModal: () => void) => {
    if (!addForm.name) {
      toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('categories').insert([{ 
        name: addForm.name,
        icon_url: addForm.icon_url 
      }]);
      if (error) throw error;

      toast({ title: "Success", description: "Category created successfully!", variant: "success" });
      setAddForm({ name: '', icon_url: '' });
      closeModal();
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create category", variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (closeModal: () => void) => {
    if (!editForm.name) {
      toast({ title: "Validation Error", description: "Category name is required.", variant: "danger" });
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('categories').update({ 
        name: editForm.name, 
        icon_url: editForm.icon_url 
      }).eq('id', editForm.id);
      
      if (error) throw error;

      toast({ title: "Success", description: "Category updated successfully!", variant: "success" });
      closeModal();
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update category", variant: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, closeModal: () => void) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;

      toast({ title: "Success", description: "Category deleted successfully!", variant: "success" });
      closeModal();
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

        {/* Add Modal */}
        <Modal>
          <Modal.Trigger>
            <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-white font-semibold py-2.5 px-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 rounded-xl relative z-10 transition-all hover:scale-105">
              <Plus size={18} className="mr-2" /> Add Category
            </Button>
          </Modal.Trigger>
          <Modal.Backdrop className="modal__backdrop--blur bg-[#0f172a]/60 backdrop-blur-md" />
          <Modal.Container>
            <Modal.Dialog className="bg-slate-900/90 backdrop-blur-3xl border border-white/20 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden">
              {({close}) => (
                <>
                  <Modal.Header className="border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Plus className="text-blue-400" /> Create New Category
                    </h3>
                  </Modal.Header>
                  <Modal.Body className="space-y-5 py-6">
                    <Input 
                      label="Category Name" 
                      variant="bordered"
                      value={addForm.name}
                      onValueChange={(val) => setAddForm({...addForm, name: val})}
                      classNames={{ inputWrapper: "border-white/20 bg-white/5", label: "text-white/70", input: "text-white" }}
                    />
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Input 
                          label="Icon URL" 
                          variant="bordered"
                          value={addForm.icon_url}
                          onValueChange={(val) => setAddForm({...addForm, icon_url: val})}
                          classNames={{ inputWrapper: "border-white/20 bg-white/5", label: "text-white/70", input: "text-white" }}
                        />
                      </div>
                      <div className="w-14 h-14 shrink-0 bg-slate-800/50 border border-white/20 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                        {addForm.icon_url ? (
                          <img src={addForm.icon_url} alt="preview" className="w-full h-full object-contain p-2 drop-shadow-md" onError={(e) => (e.currentTarget.style.display='none')} />
                        ) : (
                          <ImageIcon className="text-white/20" size={24} />
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="border-t border-white/10 pt-4">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-lg border border-red-500/50" onPress={close} isDisabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-white font-medium rounded-xl shadow-lg border border-blue-500/50" onPress={() => handleAdd(close)} isLoading={isSubmitting}>
                      Save Category
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal>
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
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        {productCounts[cat.id] || 0} Products
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      
                      {/* Edit Modal for Row */}
                      <Modal>
                        <Modal.Trigger>
                          <Button 
                            isIconOnly
                            className="bg-[#1e3a8a]/30 hover:bg-[#1e3a8a] border border-blue-400/20 text-blue-200 hover:text-white rounded-lg transition-all shadow-lg min-w-8 w-8 h-8"
                            onPress={() => setEditForm(cat)}
                          >
                            <Edit size={14} />
                          </Button>
                        </Modal.Trigger>
                        <Modal.Backdrop className="modal__backdrop--blur bg-[#0f172a]/60 backdrop-blur-md" />
                        <Modal.Container>
                          <Modal.Dialog className="bg-slate-900/90 backdrop-blur-3xl border border-white/20 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] rounded-3xl overflow-hidden">
                            {({close}) => (
                              <>
                                <Modal.Header className="border-b border-white/10 pb-4">
                                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Edit className="text-blue-400" size={20} /> Edit {cat.name}
                                  </h3>
                                </Modal.Header>
                                <Modal.Body className="space-y-5 py-6">
                                  <Input 
                                    label="Category Name" 
                                    variant="bordered"
                                    value={editForm.name}
                                    onValueChange={(val) => setEditForm({...editForm, name: val})}
                                    classNames={{ inputWrapper: "border-white/20 bg-white/5", label: "text-white/70", input: "text-white" }}
                                  />
                                  <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                      <Input 
                                        label="Icon URL" 
                                        variant="bordered"
                                        value={editForm.icon_url}
                                        onValueChange={(val) => setEditForm({...editForm, icon_url: val})}
                                        classNames={{ inputWrapper: "border-white/20 bg-white/5", label: "text-white/70", input: "text-white" }}
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
                                  <Button className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-lg border border-red-500/50" onPress={close} isDisabled={isSubmitting}>
                                    Cancel
                                  </Button>
                                  <Button className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/80 text-white font-medium rounded-xl shadow-lg border border-blue-500/50" onPress={() => handleEdit(close)} isLoading={isSubmitting}>
                                    Save Changes
                                  </Button>
                                </Modal.Footer>
                              </>
                            )}
                          </Modal.Dialog>
                        </Modal.Container>
                      </Modal>

                      {/* Delete Modal for Row */}
                      <Modal>
                        <Modal.Trigger>
                          <Button 
                            isIconOnly
                            className="bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white rounded-lg transition-all shadow-lg min-w-8 w-8 h-8"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </Modal.Trigger>
                        <Modal.Backdrop className="modal__backdrop--blur bg-red-950/40 backdrop-blur-md" />
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
                                    Are you sure you want to delete <strong className="text-white">"{cat.name}"</strong>? 
                                    <br/><br/>
                                    <span className="text-sm text-red-300/80">Products currently inside this category will need to be reassigned. This action is irreversible.</span>
                                  </p>
                                </Modal.Body>
                                <Modal.Footer className="border-t border-white/10 pt-4">
                                  <Button className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-white/10" onPress={close} isDisabled={isSubmitting}>
                                    Cancel
                                  </Button>
                                  <Button className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/50" onPress={() => handleDelete(cat.id, close)} isLoading={isSubmitting}>
                                    Confirm Deletion
                                  </Button>
                                </Modal.Footer>
                              </>
                            )}
                          </Modal.Dialog>
                        </Modal.Container>
                      </Modal>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
\`

fs.writeFileSync('src/pages/admin/Categories.tsx', content);

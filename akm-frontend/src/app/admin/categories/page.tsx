'use client';
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { categoriesAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', image: '', isActive: true, sortOrder: 0 });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await categoriesAPI.getAllAdmin();
    setCategories(data); setLoading(false);
  }

  function openEdit(cat: any) { 
    setEditing(cat); 
    setForm({ 
      name: cat.name, 
      description: cat.description || '', 
      image: cat.image || '', 
      isActive: cat.isActive, 
      sortOrder: cat.sortOrder || 0 
    }); 
    setShowModal(true); 
  }

  function openCreate() { 
    setEditing(null); 
    setForm({ name: '', description: '', image: '', isActive: true, sortOrder: 0 }); 
    setShowModal(true); 
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await categoriesAPI.update(editing._id, form); toast.success('Updated'); }
      else { await categoriesAPI.create(form); toast.success('Created'); }
      setShowModal(false); load();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Error'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete?')) return;
    await categoriesAPI.delete(id); toast.success('Deleted'); load();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-dark-400 dark:text-dark-500 font-mono text-xs uppercase tracking-wider font-bold">
          [ REGISTRY // {categories.length} CATEGORIES ]
        </p>
        <button 
          onClick={openCreate} 
          className="btn-primary text-xs uppercase tracking-wider font-mono py-2.5 px-5 flex items-center justify-center gap-1.5 shrink-0"
        >
          <FiPlus size={14} /> Add Category
        </button>
      </div>

      {/* Grid Table */}
      <div className="bg-dark-50/30 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-dark-50 dark:bg-dark-900/60 border-b border-dark-150 dark:border-dark-850/80 font-mono text-[9px] tracking-wider uppercase text-dark-500">
              <tr>
                <th className="text-left px-5 py-4 font-bold">Category Name</th>
                <th className="text-left px-5 py-4 font-bold">Registry Slug</th>
                <th className="text-left px-5 py-4 font-bold">System Status</th>
                <th className="text-left px-5 py-4 font-bold">Sort Order</th>
                <th className="text-right px-5 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-150 dark:divide-dark-850/60 font-mono text-dark-900 dark:text-white">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-dark-100/30 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4 font-bold text-dark-900 dark:text-white uppercase tracking-wider">{cat.name}</td>
                  <td className="px-5 py-4 text-dark-400 dark:text-dark-500 uppercase tracking-widest text-[9px]">{cat.slug}</td>
                  <td className="px-5 py-4">
                    {cat.isActive ? (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]">ACTIVE</span>
                    ) : (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-dark-100/40 dark:bg-white/[0.02] text-dark-400 dark:text-dark-500 border-dark-150 dark:border-dark-800">INACTIVE</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold">{cat.sortOrder}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end space-x-2.5">
                      <button onClick={() => openEdit(cat)} className="p-2 text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" title="Edit Category"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:text-red-400 transition-colors" title="Delete Category"><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-3xl w-full max-w-md p-6 mx-4 shadow-2xl relative overflow-hidden text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-dark-150 dark:border-dark-850/80">
              <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                {editing ? 'EDIT_CATEGORY_PROPERTIES' : 'CREATE_CATEGORY_ENTRY'}
              </h2>
              <button className="text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}><FiX size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Category Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Name..." required />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all h-20" placeholder="Category Description..." />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Image URL</label>
                <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Image CDN URL..." />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="0" />
              </div>

              <div className="flex items-center space-x-3 py-2 select-none">
                <label className="relative flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={form.isActive} 
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} 
                    className="w-4 h-4 rounded border-dark-300 dark:border-dark-800 bg-dark-50 dark:bg-dark-900 text-accent-500 focus:ring-accent-500/20" 
                  />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white ml-2">MARK_AS_ACTIVE_CATEGORY</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-dark-150 dark:border-dark-850/80">
                <button type="submit" className="btn-primary text-xs uppercase tracking-wider font-mono py-3 flex-1">{editing ? 'UPDATE_ENTRY' : 'COMPILE_ENTRY'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-xs uppercase tracking-wider font-mono py-3 flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

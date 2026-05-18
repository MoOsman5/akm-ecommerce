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

  function openEdit(cat: any) { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', image: cat.image || '', isActive: cat.isActive, sortOrder: cat.sortOrder || 0 }); setShowModal(true); }
  function openCreate() { setEditing(null); setForm({ name: '', description: '', image: '', isActive: true, sortOrder: 0 }); setShowModal(true); }

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
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <p className="text-dark-500">{categories.length} categories</p>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5"><FiPlus className="mr-1" /> Add Category</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-50 border-b border-dark-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Order</th>
              <th className="text-right px-4 py-3 font-semibold text-dark-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-dark-50 hover:bg-dark-50/50">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-dark-500">{cat.slug}</td>
                <td className="px-4 py-3">{cat.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-neutral">Inactive</span>}</td>
                <td className="px-4 py-3">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => openEdit(cat)} className="p-2 text-dark-500 hover:text-dark-900"><FiEdit2 size={16} /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="font-bold text-xl">{editing ? 'Edit' : 'Create'} Category</h2><button onClick={() => setShowModal(false)}><FiX size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field h-20" /></div>
              <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="input-field" /></div>
              <div><label className="block text-sm font-medium mb-1">Sort Order</label><input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="input-field" /></div>
              <label className="flex items-center space-x-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded" /><span className="text-sm">Active</span></label>
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

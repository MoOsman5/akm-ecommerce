'use client';
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { adminAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const emptyForm = { title: '', subtitle: '', imageUrl: '', link: '', buttonText: '', isActive: true, sortOrder: 0 };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  async function load() { setLoading(true); const { data } = await adminAPI.getBanners(); setBanners(data); setLoading(false); }

  function openEdit(b: any) {
    setEditing(b); setForm({ title: b.title, subtitle: b.subtitle || '', imageUrl: b.imageUrl, link: b.link || '', buttonText: b.buttonText || '', isActive: b.isActive, sortOrder: b.sortOrder || 0 });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await adminAPI.updateBanner(editing._id, form); toast.success('Updated'); }
      else { await adminAPI.createBanner(form); toast.success('Created'); }
      setShowModal(false); load();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Error'); }
  }

  async function handleDelete(id: string) { if (!confirm('Delete?')) return; await adminAPI.deleteBanner(id); toast.success('Deleted'); load(); }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <p className="text-dark-500">{banners.length} banners</p>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }} className="btn-primary text-sm py-2.5"><FiPlus className="mr-1" /> Add Banner</button>
      </div>
      <div className="grid gap-4">
        {banners.map((b) => (
          <div key={b._id} className="card p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-dark-500">{b.subtitle}</p>
              <p className="text-xs text-dark-400 mt-1">Link: {b.link} | Order: {b.sortOrder}</p>
            </div>
            <div className="flex items-center space-x-2">
              {b.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-neutral">Hidden</span>}
              <button onClick={() => openEdit(b)} className="p-2 text-dark-500 hover:text-dark-900"><FiEdit2 size={16} /></button>
              <button onClick={() => handleDelete(b._id)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-xl">{editing ? 'Edit' : 'Create'} Banner</h2><button onClick={() => setShowModal(false)}><FiX size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Title" required />
              <input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} className="input-field" placeholder="Subtitle" />
              <input value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="input-field" placeholder="Image URL" required />
              <input value={form.link} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))} className="input-field" placeholder="Link (e.g. /products)" />
              <input value={form.buttonText} onChange={(e) => setForm(f => ({ ...f, buttonText: e.target.value }))} className="input-field" placeholder="Button text" />
              <input type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className="input-field" placeholder="Sort order" />
              <div className="flex gap-3 pt-3 border-t">
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

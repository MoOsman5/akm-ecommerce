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

  async function load() { 
    setLoading(true); 
    const { data } = await adminAPI.getBanners(); 
    setBanners(data); 
    setLoading(false); 
  }

  function openEdit(b: any) {
    setEditing(b); 
    setForm({ 
      title: b.title, 
      subtitle: b.subtitle || '', 
      imageUrl: b.imageUrl, 
      link: b.link || '', 
      buttonText: b.buttonText || '', 
      isActive: b.isActive, 
      sortOrder: b.sortOrder || 0 
    });
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

  async function handleDelete(id: string) { 
    if (!confirm('Delete?')) return; 
    await adminAPI.deleteBanner(id); toast.success('Deleted'); load(); 
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Top HUD bar */}
      <div className="flex items-center justify-between">
        <p className="text-dark-400 dark:text-dark-500 font-mono text-xs uppercase tracking-wider font-bold">
          [ BILLBOARD_LEDGER // {banners.length} DISPLAY_UNITS ]
        </p>
        <button 
          onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }} 
          className="btn-primary text-xs uppercase tracking-wider font-mono py-2.5 px-5 flex items-center justify-center gap-1.5 shrink-0"
        >
          <FiPlus size={14} /> Add Banner
        </button>
      </div>

      {/* Registry Grid List */}
      <div className="grid grid-cols-1 gap-5">
        {banners.map((b) => (
          <div key={b._id} className="bg-dark-50/30 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-accent-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)] relative overflow-hidden text-left">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-10 rounded-xl overflow-hidden bg-dark-100 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 relative shrink-0">
                {b.imageUrl && <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="text-left font-mono">
                <h3 className="font-bold text-dark-900 dark:text-white uppercase tracking-wider text-xs">{b.title}</h3>
                <p className="text-[10px] text-dark-400 dark:text-dark-500 mt-0.5">{b.subtitle}</p>
                <p className="text-[9px] text-dark-400 dark:text-dark-500 mt-1 uppercase tracking-widest leading-none">LINK: {b.link} | SORT_ORDER: {b.sortOrder}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 shrink-0">
              {b.isActive ? (
                <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]">ACTIVE</span>
              ) : (
                <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-dark-100/40 dark:bg-white/[0.02] text-dark-400 dark:text-dark-500 border-dark-150 dark:border-dark-800">HIDDEN</span>
              )}
              <button onClick={() => openEdit(b)} className="p-2 text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" title="Edit Banner"><FiEdit2 size={14} /></button>
              <button onClick={() => handleDelete(b._id)} className="p-2 text-red-500 hover:text-red-400 transition-colors" title="Delete Banner"><FiTrash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-3xl w-full max-w-md p-6 mx-4 shadow-2xl relative overflow-hidden text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-dark-150 dark:border-dark-850/80">
              <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                {editing ? 'EDIT_BILLBOARD_SPECIFICATIONS' : 'CREATE_BILLBOARD_ENTRY'}
              </h2>
              <button className="text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}><FiX size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Banner Title</label>
                <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Title..." required />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Subtitle..." />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Image CDN URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Image URL..." required />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Forward Link Path</label>
                <input value={form.link} onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Link Path (e.g. /products)..." />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Action Button Text</label>
                <input value={form.buttonText} onChange={(e) => setForm(f => ({ ...f, buttonText: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Button Text (e.g. SHOP NOW)..." />
              </div>
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="0" />
              </div>

              <div className="flex items-center space-x-3 py-2 select-none">
                <label className="relative flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={form.isActive} 
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} 
                    className="w-4 h-4 rounded border-dark-300 dark:border-dark-880 bg-dark-50 dark:bg-dark-900 text-accent-500 focus:ring-accent-500/20" 
                  />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white ml-2">MARK_AS_ACTIVE_BILLBOARD</span>
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

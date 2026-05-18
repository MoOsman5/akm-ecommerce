'use client';
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { productsAPI, categoriesAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const emptyForm = { name: '', description: '', price: 0, compareAtPrice: 0, category: '', images: [''], colors: [''], sizes: [''], isFeatured: false, tags: [''] };
  const [form, setForm] = useState<any>(emptyForm);

  useEffect(() => { loadProducts(); loadCategories(); }, [page]); // eslint-disable-line

  async function loadProducts() {
    setLoading(true);
    const { data } = await productsAPI.getAll({ page, limit: 10, search: search || undefined });
    setProducts(data.products); setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function loadCategories() {
    const { data } = await categoriesAPI.getAll();
    setCategories(data);
  }

  function openCreate() {
    setEditing(null); setForm(emptyForm); setShowModal(true);
  }

  function openEdit(product: any) {
    setEditing(product);
    setForm({
      name: product.name, description: product.description, price: product.price,
      compareAtPrice: product.compareAtPrice || 0, category: product.category?._id || product.category,
      images: product.images?.length ? product.images : [''], colors: product.colors?.length ? product.colors : [''],
      sizes: product.sizes?.length ? product.sizes : [''], isFeatured: product.isFeatured, tags: product.tags?.length ? product.tags : [''],
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, images: form.images.filter((i: string) => i), colors: form.colors.filter((c: string) => c), sizes: form.sizes.filter((s: string) => s), tags: form.tags.filter((t: string) => t) };
    try {
      if (editing) { await productsAPI.update(editing._id, payload); toast.success('Product updated'); }
      else { await productsAPI.create(payload); toast.success('Product created'); }
      setShowModal(false); loadProducts();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Error'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await productsAPI.delete(id); toast.success('Deleted'); loadProducts();
  }

  function updateArrayField(field: string, index: number, value: string) {
    setForm((f: any) => ({ ...f, [field]: f[field].map((v: string, i: number) => i === index ? value : v) }));
  }

  function addArrayField(field: string) {
    setForm((f: any) => ({ ...f, [field]: [...f[field], ''] }));
  }

  function removeArrayField(field: string, index: number) {
    setForm((f: any) => ({ ...f, [field]: f[field].filter((_: string, i: number) => i !== index) }));
  }

  return (
    <div className="space-y-6 transition-colors duration-300">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500" />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && loadProducts()} 
              className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" 
              placeholder="SEARCH_PRODUCTS_REGISTRY..." 
            />
          </div>
        </div>
        <button 
          onClick={openCreate} 
          className="btn-primary text-xs uppercase tracking-wider font-mono py-2.5 px-5 flex items-center justify-center gap-1.5 shrink-0"
        >
          <FiPlus size={14} /> Add Product
        </button>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-dark-50/30 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-dark-50 dark:bg-dark-900/60 border-b border-dark-150 dark:border-dark-850/80 font-mono text-[9px] tracking-wider uppercase text-dark-500">
                <tr>
                  <th className="text-left px-5 py-4 font-bold">Product ID / Item Info</th>
                  <th className="text-left px-5 py-4 font-bold">Category</th>
                  <th className="text-left px-5 py-4 font-bold">Price Index</th>
                  <th className="text-left px-5 py-4 font-bold">Registry Sold</th>
                  <th className="text-left px-5 py-4 font-bold">Featured Status</th>
                  <th className="text-right px-5 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-150 dark:divide-dark-850/60 font-mono text-dark-900 dark:text-white">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-dark-100/30 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-dark-100 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 shrink-0 relative">
                          {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                        </div>
                        <div className="text-left min-w-0">
                          <span className="font-bold text-dark-900 dark:text-white uppercase tracking-wider block truncate max-w-[200px]">{p.name}</span>
                          <span className="text-[8px] text-dark-400 dark:text-dark-500 uppercase tracking-widest block mt-0.5">ID: {p._id?.substring(18)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-dark-500 dark:text-dark-400 uppercase tracking-wider text-[10px]">{p.category?.name || '—'}</td>
                    <td className="px-5 py-4 font-bold text-dark-900 dark:text-white">${p.price}</td>
                    <td className="px-5 py-4 font-bold">{p.totalSold} sold</td>
                    <td className="px-5 py-4">
                      {p.isFeatured ? (
                        <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]">YES</span>
                      ) : (
                        <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-dark-100/40 dark:bg-white/[0.02] text-dark-400 dark:text-dark-500 border-dark-150 dark:border-dark-800">NO</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end space-x-2.5">
                        <button onClick={() => openEdit(p)} className="p-2 text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" title="Edit Product"><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-500 hover:text-red-400 transition-colors" title="Delete Product"><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 p-5 border-t border-dark-150 dark:border-dark-850/80">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button 
                  key={p} 
                  onClick={() => setPage(p)} 
                  className={`w-8 h-8 rounded-lg text-[10px] font-mono transition-all uppercase font-bold border ${
                    page === p 
                      ? 'bg-dark-900 dark:bg-white text-white dark:text-black border-transparent shadow-[0_0_10px_rgba(0,0,0,0.1)]' 
                      : 'bg-dark-50 dark:bg-dark-900 text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-850 border-dark-150 dark:border-dark-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center pt-10 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-3xl w-full max-w-2xl p-6 my-10 mx-4 shadow-2xl relative overflow-hidden text-left" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-150 dark:border-dark-850/80">
              <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                {editing ? 'EDIT_PRODUCT_SPECIFICATIONS' : 'CREATE_PRODUCT_ENTRY'}
              </h2>
              <button className="text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}><FiX size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-dark-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Product Name</label>
                  <input value={form.name} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Item Name..." required />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f: any) => ({ ...f, category: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" required>
                    <option value="" className="dark:bg-dark-900 text-dark-500">Select Category</option>
                    {categories.map((c) => <option key={c._id} value={c._id} className="dark:bg-dark-900">{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all h-20" placeholder="Product Details..." required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f: any) => ({ ...f, price: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Base Price" required />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Compare Price ($)</label>
                  <input type="number" value={form.compareAtPrice} onChange={(e) => setForm((f: any) => ({ ...f, compareAtPrice: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Original Price" />
                </div>
              </div>

              {/* Dynamic array fields: images, colors, sizes, tags */}
              {['images', 'colors', 'sizes', 'tags'].map((field) => (
                <div key={field} className="bg-dark-50/40 dark:bg-dark-900/40 border border-dark-150 dark:border-dark-850 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 font-bold">{field}</label>
                    <button type="button" onClick={() => addArrayField(field)} className="text-[9px] font-mono uppercase font-black tracking-widest text-accent-500 hover:text-accent-400 transition-colors">+ ADD_RECORD</button>
                  </div>
                  <div className="space-y-2">
                    {form[field]?.map((val: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          value={val} 
                          onChange={(e) => updateArrayField(field, i, e.target.value)} 
                          className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" 
                          placeholder={field === 'images' ? 'Image URL...' : field === 'colors' ? 'Hex or Name (e.g. Black)' : field === 'sizes' ? 'Size (e.g. L)' : 'Tag...'} 
                        />
                        {form[field].length > 1 && (
                          <button type="button" onClick={() => removeArrayField(field, i)} className="text-red-500 hover:text-red-400 px-2 shrink-0"><FiX size={14} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center space-x-3 py-2">
                <label className="relative flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={form.isFeatured} 
                    onChange={(e) => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))} 
                    className="w-4 h-4 rounded border-dark-300 dark:border-dark-800 bg-dark-50 dark:bg-dark-900 text-accent-500 focus:ring-accent-500/20" 
                  />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white ml-2">MARK_AS_FEATURED_COLLECTION</span>
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

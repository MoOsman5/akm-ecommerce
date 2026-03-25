'use client';
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
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
    <div>
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadProducts()} className="input-field pl-10 text-sm py-2.5" placeholder="Search products..." />
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5"><FiPlus className="mr-1" /> Add Product</button>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-50 border-b border-dark-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Sold</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Featured</th>
                  <th className="text-right px-4 py-3 font-semibold text-dark-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-dark-50 hover:bg-dark-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-100 shrink-0 relative">
                          {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                        </div>
                        <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-500">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 font-medium">${p.price}</td>
                    <td className="px-4 py-3">{p.totalSold}</td>
                    <td className="px-4 py-3">{p.isFeatured ? <span className="badge badge-success">Yes</span> : <span className="badge badge-neutral">No</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-dark-500 hover:text-dark-900 transition-colors"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-red-400 hover:text-red-600 transition-colors"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 p-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${page === p ? 'bg-dark-900 text-white' : 'bg-dark-50 text-dark-600 hover:bg-dark-100'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-10 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl">{editing ? 'Edit Product' : 'Create Product'}</h2>
              <button onClick={() => setShowModal(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div><label className="block text-sm font-medium mb-1">Name</label><input value={form.name} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} className="input-field h-24" required /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Price ($)</label><input type="number" value={form.price} onChange={(e) => setForm((f: any) => ({ ...f, price: Number(e.target.value) }))} className="input-field" required /></div>
                <div><label className="block text-sm font-medium mb-1">Compare Price ($)</label><input type="number" value={form.compareAtPrice} onChange={(e) => setForm((f: any) => ({ ...f, compareAtPrice: Number(e.target.value) }))} className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f: any) => ({ ...f, category: e.target.value }))} className="input-field" required>
                    <option value="">Select</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Dynamic array fields: images, colors, sizes, tags */}
              {['images', 'colors', 'sizes', 'tags'].map((field) => (
                <div key={field}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium capitalize">{field}</label>
                    <button type="button" onClick={() => addArrayField(field)} className="text-primary-600 text-xs font-medium">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {form[field]?.map((val: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input value={val} onChange={(e) => updateArrayField(field, i, e.target.value)} className="input-field text-sm py-2" placeholder={field === 'images' ? 'Image URL' : `${field.slice(0, -1)}`} />
                        {form[field].length > 1 && <button type="button" onClick={() => removeArrayField(field, i)} className="text-red-500 px-2"><FiX /></button>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))} className="rounded" />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
              <div className="flex gap-3 pt-4 border-t">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'} Product</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

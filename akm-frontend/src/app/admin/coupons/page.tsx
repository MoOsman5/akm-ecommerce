'use client';
import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { couponsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const emptyForm = { code: '', discountType: 'percentage', discountValue: 0, minPurchase: 0, maxDiscount: 0, maxUses: 100, expiresAt: '', description: '', isActive: true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { load(); }, []);

  async function load() { setLoading(true); const { data } = await couponsAPI.getAll(); setCoupons(data); setLoading(false); }

  function openEdit(c: any) {
    setEditing(c);
    setForm({ code: c.code, discountType: c.discountType, discountValue: c.discountValue, minPurchase: c.minPurchase || 0, maxDiscount: c.maxDiscount || 0, maxUses: c.maxUses, expiresAt: c.expiresAt?.substring(0, 10) || '', description: c.description || '', isActive: c.isActive });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await couponsAPI.update(editing._id, form); toast.success('Updated'); }
      else { await couponsAPI.create(form); toast.success('Created'); }
      setShowModal(false); load();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Error'); }
  }

  async function handleDelete(id: string) { if (!confirm('Delete?')) return; await couponsAPI.delete(id); toast.success('Deleted'); load(); }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <p className="text-dark-500">{coupons.length} coupons</p>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }} className="btn-primary text-sm py-2.5"><FiPlus className="mr-1" /> Add Coupon</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-50 border-b border-dark-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Code</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Discount</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Used/Max</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Expires</th>
              <th className="text-left px-4 py-3 font-semibold text-dark-600">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-dark-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-dark-50 hover:bg-dark-50/50">
                <td className="px-4 py-3 font-bold">{c.code}</td>
                <td className="px-4 py-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                <td className="px-4 py-3">{c.usedCount}/{c.maxUses}</td>
                <td className="px-4 py-3 text-xs text-dark-500">{new Date(c.expiresAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">{c.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Inactive</span>}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="p-2 text-dark-500 hover:text-dark-900"><FiEdit2 size={16} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-bold text-xl">{editing ? 'Edit' : 'Create'} Coupon</h2><button onClick={() => setShowModal(false)}><FiX size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field" placeholder="Code" required />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.discountType} onChange={(e) => setForm(f => ({ ...f, discountType: e.target.value }))} className="input-field"><option value="percentage">%</option><option value="fixed">$</option></select>
                <input type="number" value={form.discountValue} onChange={(e) => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))} className="input-field" placeholder="Value" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={form.minPurchase} onChange={(e) => setForm(f => ({ ...f, minPurchase: Number(e.target.value) }))} className="input-field" placeholder="Min $" />
                <input type="number" value={form.maxUses} onChange={(e) => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))} className="input-field" placeholder="Max uses" />
              </div>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="input-field" required />
              <input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" placeholder="Description" />
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

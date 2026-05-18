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

  async function load() { 
    setLoading(true); 
    const { data } = await couponsAPI.getAll(); 
    setCoupons(data); 
    setLoading(false); 
  }

  function openEdit(c: any) {
    setEditing(c);
    setForm({ 
      code: c.code, 
      discountType: c.discountType, 
      discountValue: c.discountValue, 
      minPurchase: c.minPurchase || 0, 
      maxDiscount: c.maxDiscount || 0, 
      maxUses: c.maxUses, 
      expiresAt: c.expiresAt?.substring(0, 10) || '', 
      description: c.description || '', 
      isActive: c.isActive 
    });
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

  async function handleDelete(id: string) { 
    if (!confirm('Delete?')) return; 
    await couponsAPI.delete(id); toast.success('Deleted'); load(); 
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Top Bar HUD */}
      <div className="flex items-center justify-between">
        <p className="text-dark-400 dark:text-dark-500 font-mono text-xs uppercase tracking-wider font-bold">
          [ VOUCHER_LEDGER // {coupons.length} PROMOTIONS ]
        </p>
        <button 
          onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }} 
          className="btn-primary text-xs uppercase tracking-wider font-mono py-2.5 px-5 flex items-center justify-center gap-1.5 shrink-0"
        >
          <FiPlus size={14} /> Add Coupon
        </button>
      </div>

      {/* Grid Table */}
      <div className="bg-dark-50/30 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-dark-50 dark:bg-dark-900/60 border-b border-dark-150 dark:border-dark-850/80 font-mono text-[9px] tracking-wider uppercase text-dark-500">
              <tr>
                <th className="text-left px-5 py-4 font-bold">Registry Code</th>
                <th className="text-left px-5 py-4 font-bold">Discount Rate</th>
                <th className="text-left px-5 py-4 font-bold">Usage Metric</th>
                <th className="text-left px-5 py-4 font-bold">Expiration Epoch</th>
                <th className="text-left px-5 py-4 font-bold">Status</th>
                <th className="text-right px-5 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-150 dark:divide-dark-850/60 font-mono text-dark-900 dark:text-white">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-dark-100/30 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-black uppercase text-dark-900 dark:text-white tracking-widest bg-dark-50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 px-3 py-1.5 rounded-xl border-l-2 border-l-accent-500">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-accent-500 dark:text-accent-400">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                  </td>
                  <td className="px-5 py-4 font-bold">{c.usedCount} / {c.maxUses} USED</td>
                  <td className="px-5 py-4 text-dark-400 dark:text-dark-500 uppercase tracking-widest text-[9px]">{new Date(c.expiresAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    {c.isActive ? (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]">ACTIVE</span>
                    ) : (
                      <span className="inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none bg-red-500/5 text-red-500 border-red-500/20">EXPIRED</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end space-x-2.5">
                      <button onClick={() => openEdit(c)} className="p-2 text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" title="Edit Voucher"><FiEdit2 size={14} /></button>
                      <button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:text-red-400 transition-colors" title="Delete Voucher"><FiTrash2 size={14} /></button>
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
                {editing ? 'EDIT_PROMOTIONAL_VOUCHER' : 'CREATE_VOUCHER_ENTRY'}
              </h2>
              <button className="text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setShowModal(false)}><FiX size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Voucher Code</label>
                <input value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="CODE (E.G. DROP02)..." required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Discount Method</label>
                  <select value={form.discountType} onChange={(e) => setForm(f => ({ ...f, discountType: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono">
                    <option value="percentage" className="dark:bg-dark-900">PERCENTAGE (%)</option>
                    <option value="fixed" className="dark:bg-dark-900">FIXED AMOUNT ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Discount value</label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Value..." required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Min Purchase ($)</label>
                  <input type="number" value={form.minPurchase} onChange={(e) => setForm(f => ({ ...f, minPurchase: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="0" />
                </div>
                <div>
                  <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Max Use Limit</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="100" />
                </div>
              </div>

              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Expiration Date</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono cursor-pointer" required />
              </div>

              <div>
                <label className="block text-[8px] font-mono uppercase tracking-widest text-dark-400 dark:text-dark-500 mb-1.5 font-bold">Voucher Description</label>
                <input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="w-full bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white placeholder-dark-400 dark:placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono" placeholder="Description Details..." />
              </div>

              <div className="flex items-center space-x-3 py-2 select-none">
                <label className="relative flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={form.isActive} 
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} 
                    className="w-4 h-4 rounded border-dark-300 dark:border-dark-880 bg-dark-50 dark:bg-dark-900 text-accent-500 focus:ring-accent-500/20" 
                  />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-dark-900 dark:text-white ml-2">MARK_AS_ACTIVE_VOUCHER</span>
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

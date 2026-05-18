'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiPlus, FiTrash2, FiStar } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store';
import { usersAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AddressesPage() {
  const router = useRouter();
  const { user, loadUser, logout } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', isDefault: false });

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => { if (user) loadAddresses(); }, [user]); // eslint-disable-line

  async function loadAddresses() {
    const res = await usersAPI.getAddresses();
    setAddresses(res.data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      await usersAPI.createAddress(form);
      toast.success('Address added!');
      setShowForm(false);
      setForm({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
      loadAddresses();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed'); }
  }

  async function handleDelete(id: string) {
    await usersAPI.deleteAddress(id);
    toast.success('Address deleted');
    loadAddresses();
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 bg-dark-50">
        <Toaster position="top-right" />
        <div className="container-custom max-w-4xl">
          <h1 className="section-heading mb-8">My Account</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="card p-4 space-y-1">
                <Link href="/account" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors text-sm"><FiUser size={16} /><span>Profile</span></Link>
                <Link href="/account/orders" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors text-sm"><FiPackage size={16} /><span>Orders</span></Link>
                <Link href="/account/addresses" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-dark-900 text-white font-medium text-sm"><FiMapPin size={16} /><span>Addresses</span></Link>
                <button onClick={() => { logout(); router.push('/'); }} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm w-full"><FiLogOut size={16} /><span>Logout</span></button>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">Saved Addresses</h2>
                  <button onClick={() => setShowForm(!showForm)} className="btn-secondary text-sm py-2"><FiPlus className="mr-1" /> Add</button>
                </div>

                {showForm && (
                  <form onSubmit={handleAdd} className="mb-6 p-4 border border-dark-100 rounded-xl space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className="input-field text-sm" placeholder="Full Name" required />
                      <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field text-sm" placeholder="Phone" required />
                    </div>
                    <input value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className="input-field text-sm" placeholder="Street" required />
                    <div className="grid grid-cols-3 gap-3">
                      <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input-field text-sm" placeholder="City" required />
                      <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className="input-field text-sm" placeholder="State" required />
                      <input value={form.zipCode} onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))} className="input-field text-sm" placeholder="ZIP" required />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} className="rounded" />
                        <span>Set as default</span>
                      </label>
                      <button type="submit" className="btn-primary text-sm py-2">Save Address</button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="text-dark-500 text-center py-8">No saved addresses</p>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr: any) => (
                      <div key={addr._id} className="border border-dark-100 rounded-xl p-4 flex items-start justify-between">
                        <div>
                          <p className="font-medium">{addr.fullName} {addr.isDefault && <span className="badge badge-info ml-2">Default</span>}</p>
                          <p className="text-sm text-dark-500">{addr.phone}</p>
                          <p className="text-sm text-dark-500 mt-1">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                        </div>
                        <button onClick={() => handleDelete(addr._id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

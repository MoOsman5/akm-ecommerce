'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit2, FiSave } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store';
import { usersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function AccountContent() {
  const router = useRouter();
  const { user, loadUser, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!user) return;
    usersAPI.getMe().then((res) => {
      setProfile(res.data);
      setForm({ firstName: res.data.firstName, lastName: res.data.lastName, phone: res.data.phone || '' });
    }).catch(() => router.push('/auth/login'));
  }, [user, router]);

  async function handleSave() {
    try {
      await usersAPI.updateMe(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
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
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="card p-4 space-y-1">
                <Link href="/account" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-dark-900 text-white font-medium text-sm">
                  <FiUser size={16} /> <span>Profile</span>
                </Link>
                <Link href="/account/orders" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors text-sm">
                  <FiPackage size={16} /> <span>Orders</span>
                </Link>
                <Link href="/account/addresses" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors text-sm">
                  <FiMapPin size={16} /> <span>Addresses</span>
                </Link>
                <button onClick={() => { logout(); router.push('/'); }} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm w-full">
                  <FiLogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg">Profile Information</h2>
                  <button onClick={() => editing ? handleSave() : setEditing(true)} className="btn-secondary text-sm py-2">
                    {editing ? <><FiSave className="mr-1" /> Save</> : <><FiEdit2 className="mr-1" /> Edit</>}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-dark-500 mb-1">First Name</label>
                    {editing ? (
                      <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="input-field" />
                    ) : (
                      <p className="font-medium">{profile?.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-dark-500 mb-1">Last Name</label>
                    {editing ? (
                      <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="input-field" />
                    ) : (
                      <p className="font-medium">{profile?.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-dark-500 mb-1">Email</label>
                    <p className="font-medium">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-dark-500 mb-1">Phone</label>
                    {editing ? (
                      <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" />
                    ) : (
                      <p className="font-medium">{profile?.phone || '—'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AccountContent />
    </Suspense>
  );
}

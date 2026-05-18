'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiPackage, FiMapPin, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store';
import { ordersAPI } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

const statusColors: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-info',
  shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger', returned: 'badge-neutral',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, loadUser, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    if (!user) return;
    ordersAPI.getMyOrders().then((res) => setOrders(res.data.orders)).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 bg-dark-50">
        <div className="container-custom max-w-4xl">
          <h1 className="section-heading mb-8">My Account</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="card p-4 space-y-1">
                <Link href="/account" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-dark-600 hover:bg-dark-50 transition-colors text-sm">
                  <FiUser size={16} /> <span>Profile</span>
                </Link>
                <Link href="/account/orders" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-dark-900 text-white font-medium text-sm">
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

            <div className="md:col-span-3">
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-6">Order History</h2>
                {loading ? <LoadingSpinner /> : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-4xl mb-3">📦</p>
                    <p className="text-dark-500">No orders yet</p>
                    <Link href="/products" className="btn-primary mt-4 text-sm">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order._id} className="border border-dark-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold">{order.orderNumber}</p>
                            <p className="text-xs text-dark-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <span className={`badge ${statusColors[order.status] || 'badge-neutral'}`}>{order.status}</span>
                        </div>
                        <div className="text-sm text-dark-500">
                          {order.items?.length} item{order.items?.length > 1 ? 's' : ''} • <span className="font-semibold text-dark-900">${order.totalAmount?.toFixed(2)}</span>
                        </div>
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

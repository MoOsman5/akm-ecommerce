'use client';
import { useEffect, useState } from 'react';
import { FiSearch, FiEye } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { ordersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const statusColors: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-info', processing: 'badge-info',
  shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger', returned: 'badge-neutral',
};

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => { load(); }, [page, statusFilter]); // eslint-disable-line

  async function load() {
    setLoading(true);
    const params: any = { page, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    const { data } = await ordersAPI.getAll(params);
    setOrders(data.orders); setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      await ordersAPI.updateStatus(orderId, { status });
      toast.success('Status updated');
      load();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((o: any) => ({ ...o, status }));
      }
    } catch (error: any) { toast.error(error.response?.data?.message || 'Error'); }
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2.5 w-44">
            <option value="">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        <p className="text-dark-500 text-sm">{orders.length} orders</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-50 border-b border-dark-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Order #</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Items</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Total</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-dark-600">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-dark-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-dark-50 hover:bg-dark-50/50">
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-dark-600">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-4 py-3">{order.items?.length}</td>
                    <td className="px-4 py-3 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="text-xs font-semibold border rounded-lg px-2 py-1 bg-white">
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-dark-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-dark-500 hover:text-dark-900"><FiEye size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 p-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-sm ${page === p ? 'bg-dark-900 text-white' : 'bg-dark-50'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-xl mb-4">Order {selectedOrder.orderNumber}</h2>
            <div className="space-y-4">
              <div><span className="text-dark-500 text-sm">Customer:</span><p className="font-medium">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName} ({selectedOrder.user?.email})</p></div>
              <div><span className="text-dark-500 text-sm">Status:</span><span className={`badge ${statusColors[selectedOrder.status]} ml-2`}>{selectedOrder.status}</span></div>
              <div><span className="text-dark-500 text-sm block mb-2">Items:</span>
                {selectedOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-dark-50">
                    <span>{item.name} ({item.color}/{item.size}) ×{item.quantity}</span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div><span className="text-dark-500 text-sm">Shipping:</span><p className="text-sm">{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span>${selectedOrder.totalAmount?.toFixed(2)}</span></div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full mt-6">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

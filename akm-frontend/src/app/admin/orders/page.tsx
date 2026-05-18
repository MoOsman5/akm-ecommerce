'use client';
import { useEffect, useState } from 'react';
import { FiSearch, FiEye, FiX } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { ordersAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/5 text-amber-500 border-amber-500/20', 
  confirmed: 'bg-blue-500/5 text-blue-500 border-blue-500/20', 
  processing: 'bg-blue-500/5 text-blue-500 border-blue-500/20',
  shipped: 'bg-indigo-500/5 text-indigo-500 border-indigo-500/20', 
  delivered: 'bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]', 
  cancelled: 'bg-red-500/5 text-red-500 dark:text-red-400 border-red-500/20', 
  returned: 'bg-dark-100/40 dark:bg-white/[0.02] text-dark-400 dark:text-dark-500 border-dark-150 dark:border-dark-800',
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
    <div className="space-y-6 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Filters HUD */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} 
            className="bg-dark-50/50 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 rounded-xl px-4 py-2.5 text-xs text-dark-900 dark:text-white focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-mono w-44"
          >
            <option value="" className="dark:bg-dark-900">ALL STATUS REGISTRIES</option>
            {statuses.map((s) => (
              <option key={s} value={s} className="capitalize dark:bg-dark-900">{s.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <p className="text-dark-400 dark:text-dark-500 font-mono text-xs uppercase tracking-wider font-bold">
          [ REGISTRY // {orders.length} ORDERS ]
        </p>
      </div>

      {/* Grid Ledger Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-dark-50/30 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-dark-50 dark:bg-dark-900/60 border-b border-dark-150 dark:border-dark-850/80 font-mono text-[9px] tracking-wider uppercase text-dark-500">
                <tr>
                  <th className="text-left px-5 py-4 font-bold">Order Registry Key</th>
                  <th className="text-left px-5 py-4 font-bold">Customer User</th>
                  <th className="text-left px-5 py-4 font-bold">Item Count</th>
                  <th className="text-left px-5 py-4 font-bold">Total Index</th>
                  <th className="text-left px-5 py-4 font-bold">Fulfillment Status</th>
                  <th className="text-left px-5 py-4 font-bold">Date Registered</th>
                  <th className="text-right px-5 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-150 dark:divide-dark-850/60 font-mono text-dark-900 dark:text-white">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-dark-100/30 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-5 py-4 font-bold text-accent-500 dark:text-accent-400">{order.orderNumber}</td>
                    <td className="px-5 py-4 font-medium uppercase tracking-wider">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-5 py-4">{order.items?.length || 0} items</td>
                    <td className="px-5 py-4 font-bold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order._id, e.target.value)} 
                        className={`text-[9px] font-mono font-bold uppercase tracking-widest border rounded-lg px-2.5 py-1.5 focus:outline-none transition-all duration-300 cursor-pointer ${statusColors[order.status] || ''}`}
                      >
                        {statuses.map((s) => <option key={s} value={s} className="dark:bg-dark-900 text-dark-900 dark:text-white">{s.toUpperCase()}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-dark-400 dark:text-dark-500 uppercase tracking-widest text-[9px]">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => setSelectedOrder(order)} 
                          className="p-2 text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
                          title="View Order Details"
                        >
                          <FiEye size={14} />
                        </button>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-3xl w-full max-w-lg p-6 mx-4 max-h-[80vh] overflow-y-auto shadow-2xl relative text-left" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-dark-150 dark:border-dark-850/80">
              <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                TACTICAL_CARGO_RECEIPT // {selectedOrder.orderNumber}
              </h2>
              <button className="text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setSelectedOrder(null)}><FiX size={18} /></button>
            </div>

            <div className="space-y-4 font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-dark-400 dark:text-dark-500 font-bold block mb-1">Customer User</span>
                  <p className="text-xs font-bold text-dark-900 dark:text-white uppercase leading-none">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                  <p className="text-[9px] text-dark-400 dark:text-dark-500 mt-1">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-dark-400 dark:text-dark-500 font-bold block mb-1">Fulfillment status</span>
                  <span className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border leading-none capitalize ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[8px] uppercase tracking-wider text-dark-400 dark:text-dark-500 font-bold block mb-2">Item ledger listing</span>
                <div className="space-y-2 bg-dark-50/50 dark:bg-dark-900/40 border border-dark-150 dark:border-dark-850 rounded-2xl p-4">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-[10px] py-1.5 border-b border-dark-150 dark:border-dark-850/60 last:border-0 last:pb-0 first:pt-0">
                      <div className="text-left">
                        <span className="font-bold text-dark-900 dark:text-white uppercase tracking-wider">{item.name}</span>
                        <span className="text-[8px] text-dark-400 dark:text-dark-500 block mt-0.5">SIZE: {item.size} // COLOR: {item.color} // QTY: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-dark-950 dark:text-white shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[8px] uppercase tracking-wider text-dark-400 dark:text-dark-500 font-bold block mb-1">Secure destination address</span>
                <p className="text-[10px] text-dark-900 dark:text-white uppercase tracking-wide leading-relaxed">
                  {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                </p>
              </div>

              <div className="flex justify-between items-center font-bold text-sm pt-4 border-t border-dark-150 dark:border-dark-850/80">
                <span className="text-dark-500 dark:text-dark-400">GRAND TOTAL</span>
                <span className="text-accent-500 dark:text-accent-400 font-black text-lg">${selectedOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="btn-secondary text-xs uppercase tracking-wider font-mono py-3 w-full mt-6">
              CLOSE_LEDGER_SHEET
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

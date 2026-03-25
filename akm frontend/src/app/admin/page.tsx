'use client';
import { useEffect, useState } from 'react';
import { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <p>Failed to load dashboard</p>;

  const stats = [
    { label: 'Total Sales', value: `$${(data.totalSales || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-green-500' },
    { label: 'Total Orders', value: data.totalOrders || 0, icon: <FiShoppingCart />, color: 'bg-blue-500' },
    { label: 'Customers', value: data.totalCustomers || 0, icon: <FiUsers />, color: 'bg-purple-500' },
    { label: 'Avg. Order', value: `$${data.totalOrders ? ((data.totalSales || 0) / data.totalOrders).toFixed(0) : 0}`, icon: <FiTrendingUp />, color: 'bg-accent-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Sales Overview (Last 6 Months)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlySales || []}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#212529" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#212529" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#adb5bd" />
              <YAxis tick={{ fontSize: 12 }} stroke="#adb5bd" />
              <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#212529" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {(data.recentOrders || []).slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-dark-50 last:border-0">
                <div>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-dark-500">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${order.totalAmount?.toFixed(2)}</p>
                  <span className={`text-xs font-medium capitalize ${order.status === 'delivered' ? 'text-green-600' : order.status === 'cancelled' ? 'text-red-600' : 'text-accent-600'}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-4">Best Selling Products</h2>
          <div className="space-y-3">
            {(data.bestSellers || []).slice(0, 5).map((product: any, i: number) => (
              <div key={product._id} className="flex items-center space-x-3 py-2 border-b border-dark-50 last:border-0">
                <span className="w-7 h-7 rounded-full bg-dark-100 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-dark-500">${product.price}</p>
                </div>
                <span className="text-sm font-semibold">{product.totalSold} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Orders by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {(data.ordersByStatus || []).map((s: any) => (
            <div key={s._id} className="text-center p-3 bg-dark-50 rounded-xl">
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-xs text-dark-500 capitalize mt-1">{s._id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

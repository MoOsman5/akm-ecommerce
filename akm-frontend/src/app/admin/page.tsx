'use client';
import { useEffect, useState, Suspense } from 'react';
import { FiDollarSign, FiShoppingCart, FiUsers, FiTrendingUp, FiCpu, FiRadio, FiActivity, FiArrowRight } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const CustomTooltip = ({ active, payload, theme }: any) => {
  if (active && payload && payload.length) {
    const isDark = theme === 'dark';
    return (
      <div className={`border p-3 rounded-xl font-mono text-[10px] shadow-2xl space-y-1 text-left ${
        isDark ? 'bg-dark-950 border-dark-850 text-white' : 'bg-white border-dark-150 text-dark-900'
      }`}>
        <p className={`uppercase tracking-widest ${isDark ? 'text-dark-500' : 'text-dark-400'}`}>[ INTERVAL // {payload[0].payload._id} ]</p>
        <p className="text-accent-500 dark:text-accent-400 font-black uppercase text-xs">SALES: ${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function AdminContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [releaseActive, setReleaseActive] = useState(false);
  const [countdown, setCountdown] = useState({ days: 4, hours: 12, mins: 38, secs: 45 });
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Drop 02 timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!data) return <p className="text-red-500 font-mono text-center mt-10">Failed to load admin gateway metrics.</p>;

  const isDark = mounted && theme === 'dark';

  const stats = [
    { 
      label: 'Gross Sales', 
      value: `$${(data.totalSales || 0).toLocaleString()}`, 
      icon: <FiDollarSign />, 
      color: 'border-green-500/20 text-green-500 dark:text-green-400 bg-green-500/5',
      percent: 72,
      target: 'Q2 GOAL: $100K'
    },
    { 
      label: 'Orders Count', 
      value: data.totalOrders || 0, 
      icon: <FiShoppingCart />, 
      color: 'border-blue-500/20 text-blue-500 dark:text-blue-400 bg-blue-500/5',
      percent: 58,
      target: 'CAP LIMIT: 1,000'
    },
    { 
      label: 'Subscribers', 
      value: data.totalCustomers || 0, 
      icon: <FiUsers />, 
      color: 'border-purple-500/20 text-purple-500 dark:text-purple-400 bg-purple-500/5',
      percent: 85,
      target: 'TARGET: 2,500'
    },
    { 
      label: 'Avg. Cart Value', 
      value: `$${data.totalOrders ? ((data.totalSales || 0) / data.totalOrders).toFixed(0) : 0}`, 
      icon: <FiTrendingUp />, 
      color: 'border-accent-500/20 text-accent-500 dark:text-accent-400 bg-accent-500/5',
      percent: 92,
      target: 'OPTIMAL: $200'
    },
  ];

  return (
    <div className="space-y-8 transition-colors duration-300">
      {/* Interactive Tactical Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850 p-6 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/[0.02] to-transparent pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-accent-500 uppercase font-black">DROP_02_INVENTORY_RELEASE_COUNTDOWN</span>
            </div>
            <h3 className="text-dark-950 dark:text-white font-mono font-black text-xl md:text-2xl tracking-[0.1em] uppercase">
              {String(countdown.days).padStart(2, '0')}d : {String(countdown.hours).padStart(2, '0')}h : {String(countdown.mins).padStart(2, '0')}m : {String(countdown.secs).padStart(2, '0')}s
            </h3>
            <p className="text-[9px] font-mono text-dark-400 dark:text-dark-500">AUTONOMOUS LAUNCH SYSTEM PRE-COMPILATION SEQUENCE ACTIVE</p>
          </div>
          <button 
            onClick={() => setReleaseActive(!releaseActive)}
            className={`w-full sm:w-auto font-mono text-[9px] uppercase font-black tracking-widest px-6 py-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden shrink-0 ${
              releaseActive 
                ? 'bg-accent-500 text-white border-accent-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                : 'bg-dark-100 dark:bg-dark-900 text-accent-500 dark:text-accent-400 border-accent-500/20 hover:border-accent-500 hover:bg-accent-500 hover:text-white dark:hover:text-white'
            }`}
          >
            {releaseActive ? 'SYSTEM_ARMED' : 'ARM_RELEASE'}
          </button>
        </div>

        <div className="bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850 p-5 rounded-3xl grid grid-cols-3 gap-2 font-mono text-center items-center shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]">
          <div className="space-y-1">
            <FiCpu className="text-accent-500 mx-auto" size={16} />
            <p className="text-[8px] text-dark-400 dark:text-dark-500 uppercase tracking-wider">GATEWAY</p>
            <p className="text-[10px] font-bold text-dark-900 dark:text-white uppercase">[ ONLINE ]</p>
          </div>
          <div className="space-y-1 border-x border-dark-150 dark:border-dark-850">
            <FiRadio className="text-green-500 dark:text-green-400 mx-auto animate-pulse" size={16} />
            <p className="text-[8px] text-dark-400 dark:text-dark-500 uppercase tracking-wider">LATENCY</p>
            <p className="text-[10px] font-bold text-green-500 dark:text-green-400 uppercase">24MS</p>
          </div>
          <div className="space-y-1">
            <FiActivity className="text-blue-500 dark:text-blue-400 mx-auto" size={16} />
            <p className="text-[8px] text-dark-400 dark:text-dark-500 uppercase tracking-wider">FIRMWARE</p>
            <p className="text-[10px] font-bold text-dark-900 dark:text-white uppercase">V2.1.0</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850/80 rounded-2xl p-5 relative overflow-hidden group hover:border-accent-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[8px] font-mono text-dark-400 dark:text-dark-500">[ STAT_0{i + 1} ]</span>
                <p className="text-[10px] font-mono text-dark-500 dark:text-dark-400 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                <p className="text-2xl font-mono tracking-tight font-black text-dark-900 dark:text-white mt-1.5">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-md shrink-0 transition-transform group-hover:scale-105 duration-300 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            
            {/* Custom dynamic micro progress gauge */}
            <div className="mt-5 space-y-1 font-mono">
              <div className="flex items-center justify-between text-[8px] text-dark-400 dark:text-dark-500">
                <span>{stat.target}</span>
                <span className="text-dark-900 dark:text-white font-bold">{stat.percent}%</span>
              </div>
              <div className="w-full h-[2px] bg-dark-100 dark:bg-dark-900 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${stat.percent}%` }}
                  className="h-full bg-gradient-to-r from-accent-500 to-accent-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000 ease-out"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850 p-6 rounded-3xl relative overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white">SALES_OVERVIEW // LAST_6_MONTHS</h2>
          </div>
          <span className="text-[9px] font-mono text-dark-400 dark:text-dark-500">[ UNITS // VAL_USD ]</span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlySales || []} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1c1e21' : '#f1f3f5'} vertical={false} />
              <XAxis 
                dataKey="_id" 
                tick={{ fontSize: 10, fill: isDark ? '#5a626a' : '#94a3b8', fontFamily: 'monospace' }} 
                stroke={isDark ? '#1c1e21' : '#e2e8f0'} 
              />
              <YAxis 
                tick={{ fontSize: 10, fill: isDark ? '#5a626a' : '#94a3b8', fontFamily: 'monospace' }} 
                stroke={isDark ? '#1c1e21' : '#e2e8f0'} 
              />
              <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#f59e0b" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Ledger */}
        <div className="bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850 p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white">TACTICAL_ORDER_LEDGER</h2>
            </div>
            <Link href="/admin/orders" className="text-[9px] font-mono uppercase text-accent-500 dark:text-accent-400 hover:text-dark-950 dark:hover:text-white transition-colors flex items-center gap-1">
              LEDGER <FiArrowRight />
            </Link>
          </div>
          <div className="divide-y divide-dark-150 dark:divide-dark-850/60 overflow-hidden flex-1 flex flex-col justify-between">
            {(data.recentOrders || []).slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex items-center justify-between py-3.5 last:border-0 hover:bg-dark-100/10 dark:hover:bg-white/[0.01] px-2 rounded-xl transition-colors">
                <div className="space-y-1 text-left">
                  <p className="font-mono text-[10px] font-black text-dark-900 dark:text-white uppercase tracking-wider">{order.orderNumber}</p>
                  <p className="text-[9px] font-mono text-dark-400 dark:text-dark-500 uppercase tracking-widest">{order.user?.firstName} {order.user?.lastName}</p>
                </div>
                <div className="text-right space-y-1.5 font-mono">
                  <p className="font-bold text-xs text-dark-900 dark:text-white">${order.totalAmount?.toFixed(2)}</p>
                  <span className={`inline-block text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border leading-none capitalize ${
                    order.status === 'delivered' 
                      ? 'bg-green-500/5 text-green-600 dark:text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]' 
                      : order.status === 'cancelled' 
                      ? 'bg-red-500/5 text-red-500 dark:text-red-400 border-red-500/20' 
                      : 'bg-accent-500/5 text-accent-500 dark:text-accent-400 border-accent-500/20 animate-pulse'
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers Registry */}
        <div className="bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850 p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
              <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white">GRAILS_MARKET_INDEX</h2>
            </div>
            <Link href="/admin/products" className="text-[9px] font-mono uppercase text-accent-500 dark:text-accent-400 hover:text-dark-950 dark:hover:text-white transition-colors flex items-center gap-1">
              INVENTORY <FiArrowRight />
            </Link>
          </div>
          <div className="divide-y divide-dark-150 dark:divide-dark-850/60 overflow-hidden flex-1 flex flex-col justify-between">
            {(data.bestSellers || []).slice(0, 5).map((product: any, i: number) => (
              <div key={product._id} className="flex items-center space-x-3 py-3.5 last:border-0 hover:bg-dark-100/10 dark:hover:bg-white/[0.01] px-2 rounded-xl transition-colors">
                <span className="w-7 h-7 rounded-lg bg-dark-100 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 flex items-center justify-center text-[9px] font-mono font-black text-accent-500 dark:text-accent-400 shrink-0 select-none">
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-mono text-[10px] font-bold text-dark-900 dark:text-white uppercase tracking-wider truncate">{product.name}</p>
                  <p className="text-[9px] font-mono text-dark-400 dark:text-dark-500 mt-0.5">${product.price}</p>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <span className="text-[9px] font-black text-dark-900 dark:text-white uppercase tracking-wider bg-dark-100/40 dark:bg-white/[0.03] border border-dark-150 dark:border-dark-800 px-2.5 py-1 rounded-lg">
                    {product.totalSold} sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders by Status Grid */}
      <div className="bg-dark-50/50 dark:bg-dark-950 border border-dark-150 dark:border-dark-850 p-6 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
          <h2 className="font-mono text-xs uppercase font-black tracking-widest text-dark-900 dark:text-white">FULFILLMENT_STATUS_REGISTRY</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {(data.ordersByStatus || []).map((s: any) => (
            <div key={s._id} className="text-center p-4 bg-dark-50/20 dark:bg-black/40 border border-dark-150 dark:border-dark-850/60 rounded-2xl hover:border-accent-500/20 dark:hover:border-accent-500/20 transition-all duration-300 group">
              <p className="text-2xl font-mono font-black text-dark-900 dark:text-white tracking-tighter group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors">{s.count}</p>
              <p className="text-[8px] font-mono text-dark-400 dark:text-dark-500 uppercase tracking-widest mt-2">{s._id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <AdminContent />
    </Suspense>
  );
}

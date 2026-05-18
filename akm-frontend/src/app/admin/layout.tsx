'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiGrid, FiShoppingBag, FiLayers, FiPackage, FiUsers,
  FiTag, FiImage, FiMenu, FiX, FiLogOut, FiChevronLeft,
} from 'react-icons/fi';
import { useAuthStore } from '@/store';

const menuItems = [
  { href: '/admin', icon: <FiGrid size={18} />, label: 'Dashboard' },
  { href: '/admin/products', icon: <FiShoppingBag size={18} />, label: 'Products' },
  { href: '/admin/categories', icon: <FiLayers size={18} />, label: 'Categories' },
  { href: '/admin/orders', icon: <FiPackage size={18} />, label: 'Orders' },
  { href: '/admin/customers', icon: <FiUsers size={18} />, label: 'Customers' },
  { href: '/admin/coupons', icon: <FiTag size={18} />, label: 'Coupons' },
  { href: '/admin/banners', icon: <FiImage size={18} />, label: 'Banners' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loadUser, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-dark-50">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-dark-700">
          <Link href="/admin" className="font-display text-2xl font-extrabold">AKM Admin</Link>
          <button className="lg:hidden text-dark-400" onClick={() => setSidebarOpen(false)}><FiX size={20} /></button>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                pathname === item.href
                  ? 'bg-white/10 text-white'
                  : 'text-dark-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
          <Link href="/" className="flex items-center space-x-3 px-4 py-2 rounded-xl text-dark-400 hover:text-white text-sm transition-colors">
            <FiChevronLeft size={18} /> <span>Back to Store</span>
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center space-x-3 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 text-sm transition-colors w-full mt-1">
            <FiLogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-dark-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}><FiMenu size={20} /></button>
            <h1 className="text-lg font-bold text-dark-900 capitalize">
              {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-dark-500">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-dark-900 text-white flex items-center justify-center font-bold text-sm">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 text-dark-900">
          {children}
        </main>
      </div>
    </div>
  );
}

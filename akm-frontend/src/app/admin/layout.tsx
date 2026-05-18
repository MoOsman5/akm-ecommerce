'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiGrid, FiShoppingBag, FiLayers, FiPackage, FiUsers,
  FiTag, FiImage, FiMenu, FiX, FiLogOut, FiChevronLeft,
  FiSun, FiMoon
} from 'react-icons/fi';
import { useAuthStore } from '@/store';
import { useTheme } from 'next-themes';

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-white dark:bg-black text-dark-900 dark:text-white select-none overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-50 dark:bg-dark-950 border-r border-dark-150 dark:border-dark-850/80 text-dark-900 dark:text-white transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-dark-150 dark:border-dark-850/80">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img 
              src={mounted && theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} 
              alt="AKM Logo" 
              className="h-5 w-auto object-contain transition-all duration-300"
            />
            <span className="text-[9px] font-mono bg-accent-500/10 text-accent-500 px-2 py-0.5 rounded border border-accent-500/20 tracking-wider">CTRL</span>
          </Link>
          <button className="lg:hidden text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}><FiX size={18} /></button>
        </div>
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item, index) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-[10px] uppercase tracking-wider font-mono border-l-2 ${
                pathname === item.href
                  ? 'bg-dark-100/60 dark:bg-white/[0.03] text-dark-900 dark:text-white border-accent-500 shadow-[inset_4px_0_15px_rgba(255,255,255,0.01)] font-bold'
                  : 'text-dark-500 dark:text-dark-400 border-transparent hover:text-dark-900 dark:hover:text-white hover:bg-dark-100/30 dark:hover:bg-white/[0.01] hover:border-accent-500/30'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span className="text-[8px] opacity-40">0{index + 1}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-150 dark:border-dark-850/80 bg-dark-50/80 dark:bg-dark-950/80 backdrop-blur-sm">
          <Link href="/" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors">
            <FiChevronLeft size={16} /> <span>Storefront</span>
          </Link>
          <button onClick={() => { logout(); router.push('/'); }} className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono text-red-500 hover:text-red-400 transition-colors w-full mt-1">
            <FiLogOut size={16} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 dark:bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-dark-150 dark:border-dark-850 px-6 py-4 flex items-center justify-between shrink-0 relative z-10 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2 text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}><FiMenu size={20} /></button>
            <h1 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-dark-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              {pathname === '/admin' ? 'SYSTEM_OVERVIEW' : pathname.split('/').pop()?.replace('-', '_').toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-dark-150 dark:border-dark-800 bg-dark-50 dark:bg-dark-900 text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-all shadow-[0_0_10px_rgba(0,0,0,0.01)]"
            >
              {mounted && theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>

            <div className="text-right hidden sm:block font-mono">
              <p className="text-xs font-black text-dark-900 dark:text-white uppercase tracking-wider leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-[8px] text-accent-500 uppercase tracking-widest font-bold mt-1.5">LVL_01 // SECURE_AUTH</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-dark-100 dark:bg-dark-900 border border-dark-150 dark:border-dark-800 text-dark-900 dark:text-white flex items-center justify-center font-bold text-xs uppercase shadow-[0_0_15px_rgba(0,0,0,0.01)]">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-black text-dark-900 dark:text-white scrollbar-thin scrollbar-thumb-dark-200 dark:scrollbar-thumb-dark-800 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}

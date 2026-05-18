'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore } from '@/store';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="relative px-3 md:px-5 py-2 group whitespace-nowrap shrink-0 flex items-center justify-center">
      <span className="relative z-10 text-xs font-bold tracking-[0.15em] uppercase text-dark-500 dark:text-dark-400 group-hover:text-dark-900 dark:group-hover:text-white transition-colors duration-300">
        {children}
      </span>
      <span className="absolute inset-0 rounded-full bg-dark-100/80 dark:bg-dark-800/80 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 ease-out" />
    </Link>
  );
};

export default function Header() {
  const { user, loadUser, logout } = useAuthStore();
  const { getItemCount, fetchCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUser();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadUser]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  const itemCount = getItemCount();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/70 dark:bg-dark-950/70 backdrop-blur-xl shadow-sm border-b border-dark-200/50 dark:border-dark-800/50 py-1' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        {/* Main nav */}
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16 md:h-20' : 'h-24 md:h-28'}`}>
          {/* Left section: Hamburger (Mobile) & Logo */}
          <div className="flex-1 flex justify-start items-center md:min-w-[200px]">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 -ml-2 mr-2 text-dark-800 dark:text-dark-200 z-10" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center group md:-ml-5 -mt-1 md:-mt-3">
              <img 
                src="/logo-light.png" 
                alt="AKM Logo" 
                className={`dark:hidden w-auto object-contain transition-all duration-500 ${scrolled ? 'h-10 md:h-16' : 'h-14 md:h-24'}`} 
                onError={(e) => e.currentTarget.style.display='none'} 
              />
              <img 
                src="/logo-dark.png" 
                alt="AKM Logo" 
                className={`hidden dark:block w-auto object-contain transition-all duration-500 ${scrolled ? 'h-10 md:h-16' : 'h-14 md:h-24'}`} 
                onError={(e) => e.currentTarget.style.display='none'} 
              />
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 justify-center items-center space-x-2 lg:space-x-6">
            <NavLink href="/products">Shop All</NavLink>
            <NavLink href="/products?category=t-shirts">T-Shirts</NavLink>
            <NavLink href="/products?category=hoodies">Hoodies</NavLink>
            <NavLink href="/products?category=jackets">Jackets</NavLink>
            <NavLink href="/products?category=accessories">Accessories</NavLink>
          </nav>

          {/* Right section: Actions */}
          <div className="flex-1 flex justify-end items-center space-x-3 md:space-x-5 min-w-[120px] md:min-w-[200px]">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors"
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            )}

            <Link href="/products" className="hidden md:block p-2 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors">
              <FiSearch size={20} />
            </Link>

            {user ? (
              <div className="relative group">
                <button className="p-2 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors">
                  <FiUser size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-900 rounded-xl shadow-lg border border-dark-100 dark:border-dark-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-dark-100 dark:border-dark-800">
                    <p className="font-medium text-sm text-dark-900 dark:text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-dark-500">{user.email}</p>
                  </div>
                  <Link href="/account" className="block px-3 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">My Profile</Link>
                  <Link href="/account/orders" className="block px-3 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 text-sm text-accent-600 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-xl">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="p-2 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors">
                <FiUser size={20} />
              </Link>
            )}

            <Link href="/cart" className="relative p-2 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors">
              <FiShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile menu - Animated using framer-motion */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl border-t border-dark-100 dark:border-dark-800"
            >
              <nav className="flex flex-col space-y-2 py-6 px-4">
                <Link href="/products" className="text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl font-medium p-3 transition-colors" onClick={() => setMenuOpen(false)}>Shop All</Link>
                <Link href="/products?category=t-shirts" className="text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl font-medium p-3 transition-colors" onClick={() => setMenuOpen(false)}>T-Shirts</Link>
                <Link href="/products?category=hoodies" className="text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl font-medium p-3 transition-colors" onClick={() => setMenuOpen(false)}>Hoodies</Link>
                <Link href="/products?category=jackets" className="text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl font-medium p-3 transition-colors" onClick={() => setMenuOpen(false)}>Jackets</Link>
                <Link href="/products?category=accessories" className="text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl font-medium p-3 transition-colors" onClick={() => setMenuOpen(false)}>Accessories</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

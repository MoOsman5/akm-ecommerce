'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiSun, FiMoon, FiArrowRight } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore } from '@/store';

const tickerText = "FREE GLOBAL EXPRESS ON ALL DROPS OVER $500 • SIGN UP FOR EXCLUSIVE EARLY ACCESS • AKM STREETWEAR DROPS FOR THE BOLD • NEW DESIGNS DISPATCHED WEEKLY • ";

const NAV_LINKS = [
  { name: 'Shop All', href: '/products', isMega: true },
  { name: 'T-Shirts', href: '/products?category=t-shirts' },
  { name: 'Hoodies', href: '/products?category=hoodies' },
  { name: 'Jackets', href: '/products?category=jackets' },
  { name: 'Accessories', href: '/products?category=accessories' }
];

export default function Header() {
  const { user, loadUser, logout } = useAuthStore();
  const { getItemCount, fetchCart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
    <>
      {/* Pinned Global Announcement Ticker */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-accent-500 text-black flex items-center overflow-hidden whitespace-nowrap z-50 font-black uppercase tracking-[0.25em] text-[10px] select-none border-b border-accent-600 shadow-[0_2px_15px_rgba(245,158,11,0.15)]">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ ease: "linear", duration: 28, repeat: Infinity }}
          className="inline-block whitespace-nowrap"
        >
          <span>{tickerText.repeat(8)}</span>
        </motion.div>
      </div>

      <header 
        className={`fixed left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-7xl rounded-full transition-all duration-500 border ${
          scrolled 
            ? 'bg-black/90 dark:bg-black/90 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(245,158,11,0.06)] border-white/10 py-1.5 top-[3rem]' 
            : 'bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] border-dark-200/40 dark:border-dark-800/40 py-3 top-16'
        }`}
      >
        <div className="px-6 md:px-8">
          {/* Main nav flex */}
          <div className="flex items-center justify-between h-14">
            {/* Left section: Hamburger (Mobile) & Logo */}
            <div className="flex-none flex justify-start items-center md:w-[140px]">
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 -ml-2 mr-2 text-dark-800 dark:text-dark-200 z-10 hover:text-accent-500 transition-colors" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center group -mt-1 md:-ml-2">
                <img 
                  src="/logo-light.png" 
                  alt="AKM Logo" 
                  className={`dark:hidden h-9 w-auto object-contain transition-all duration-300 ${scrolled ? 'brightness-0 invert' : ''}`} 
                  onError={(e) => e.currentTarget.style.display='none'} 
                />
                <img 
                  src="/logo-dark.png" 
                  alt="AKM Logo" 
                  className="hidden dark:block h-9 w-auto object-contain transition-all duration-300" 
                  onError={(e) => e.currentTarget.style.display='none'} 
                />
              </Link>
            </div>

            {/* Middle Section: Nav links with Sliding Hover Indicator */}
            <nav 
              className="hidden md:flex flex-1 justify-center items-center space-x-0.5 lg:space-x-1.5 relative"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {NAV_LINKS.map((link, idx) => (
                <div 
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredIndex(idx);
                    if (link.isMega) setMegaOpen(true);
                    else setMegaOpen(false);
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => {
                      setMegaOpen(false);
                      setHoveredIndex(null);
                    }}
                    className="relative px-3 lg:px-4 py-2 flex items-center justify-center z-10 transition-colors duration-350 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors duration-300 select-none ${
                      scrolled 
                        ? (hoveredIndex === idx ? 'text-white' : 'text-dark-400')
                        : (hoveredIndex === idx ? 'text-dark-950 dark:text-white' : 'text-dark-500 dark:text-dark-400')
                    }`}>
                      {link.name}
                    </span>
                    
                    {hoveredIndex === idx && (
                      <motion.span
                        layoutId="headerBubble"
                        className={`absolute inset-0 rounded-full -z-10 border ${
                          scrolled
                            ? 'bg-white/10 border-white/5'
                            : 'bg-dark-50/80 dark:bg-dark-900/60 border-dark-100/50 dark:border-dark-800/40'
                        }`}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>

                  {/* Mega Menu Portal */}
                  {link.isMega && (
                    <AnimatePresence>
                      {megaOpen && (
                        <div 
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                          onMouseEnter={() => setMegaOpen(true)}
                          onMouseLeave={() => setMegaOpen(false)}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.25 }}
                            className="w-[580px] bg-white dark:bg-dark-950 border border-dark-200/40 dark:border-dark-800/40 rounded-[2.5rem] shadow-2xl p-7 grid grid-cols-12 gap-6 select-none"
                          >
                            {/* Categories list */}
                            <div className="col-span-6 space-y-4 text-left">
                              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-accent-500 mb-2">Garment Categories</p>
                              <div className="grid grid-cols-1 gap-2">
                                {[
                                  { name: 'T-Shirts', href: '/products?category=t-shirts', desc: 'Premium custom heavyweight tees.' },
                                  { name: 'Hoodies', href: '/products?category=hoodies', desc: 'Fleece drop-shoulder comfort.' },
                                  { name: 'Jackets', href: '/products?category=jackets', desc: 'Technical and classic outerwear.' },
                                  { name: 'Accessories', href: '/products?category=accessories', desc: 'Caps, beanies, socks, belts.' }
                                ].map((cat) => (
                                  <Link
                                    key={cat.name}
                                    href={cat.href}
                                    onClick={() => setMegaOpen(false)}
                                    className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-dark-50 dark:hover:bg-dark-900/60 transition-colors"
                                  >
                                    <div>
                                      <h5 className="text-dark-900 dark:text-white text-xs font-black uppercase tracking-wider">{cat.name}</h5>
                                      <p className="text-dark-400 text-[10px] font-light mt-0.5 leading-none">{cat.desc}</p>
                                    </div>
                                    <FiArrowRight size={12} className="text-dark-400 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Featured collection card */}
                            <div className="col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] border border-dark-100 dark:border-dark-850 shadow-inner flex flex-col justify-end p-5 group/banner">
                              <Image
                                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80" unoptimized
                                alt="Drop 01 Collection"
                                fill
                                sizes="250px"
                                className="object-cover group-hover/banner:scale-105 transition-transform duration-700 ease-out"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/30 to-transparent" />
                              <div className="relative z-10 space-y-1 text-left">
                                <span className="inline-block bg-accent-500 text-white text-[8px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase leading-none">NEW DROP</span>
                                <h4 className="text-white font-display font-black text-lg uppercase tracking-tight leading-none mt-1">Drop 01 / Vol. II</h4>
                                <p className="text-dark-200 text-[9px] font-light leading-none">Technical fleece coordinates & accessories.</p>
                                <Link
                                  href="/products?featured=true"
                                  onClick={() => setMegaOpen(false)}
                                  className="inline-flex items-center text-accent-400 hover:text-white text-[9px] font-black uppercase tracking-wider mt-2 transition-colors gap-1 leading-none"
                                >
                                  Shop Grails <FiArrowRight size={10} />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right section: Tactile Glass Actions */}
            <div className="flex-none flex justify-end items-center space-x-2 md:w-[200px] relative">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    scrolled 
                      ? 'text-dark-300 hover:text-white hover:bg-white/10' 
                      : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-900/60'
                  }`}
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
                </button>
              )}

              {/* Slide Down Search Trigger */}
              <div className="relative">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    searchOpen 
                      ? 'bg-accent-500 text-black' 
                      : scrolled 
                        ? 'text-dark-300 hover:text-white hover:bg-white/10' 
                        : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-900/60'
                  }`}
                  aria-label="Search catalog"
                >
                  {searchOpen ? <FiX size={17} /> : <FiSearch size={17} />}
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="absolute top-full right-0 mt-5 p-4 bg-white/95 dark:bg-dark-950/95 backdrop-blur-2xl border border-dark-200/40 dark:border-dark-800/40 rounded-3xl shadow-2xl z-40 w-80 text-left"
                    >
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (searchVal.trim()) {
                            window.location.href = `/products?search=${encodeURIComponent(searchVal.trim())}`;
                            setSearchOpen(false);
                          }
                        }}
                        className="relative"
                      >
                        <input
                          type="text"
                          placeholder="Search drops..."
                          value={searchVal}
                          onChange={(e) => setSearchVal(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-dark-50 dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl text-dark-900 dark:text-white placeholder-dark-500 focus:outline-none focus:border-accent-500 transition-all font-bold text-xs"
                        />
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={14} />
                      </form>
                      
                      <div className="mt-4">
                        <p className="text-[9px] font-black uppercase tracking-wider text-accent-500 mb-2">Trending Searches</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['#hoodie', '#beanie', '#cap', '#oversized'].map((tag) => (
                            <Link
                              key={tag}
                              href={`/products?search=${tag.replace('#', '')}`}
                              onClick={() => setSearchOpen(false)}
                              className="px-2.5 py-1 bg-dark-50 dark:bg-dark-900 hover:bg-accent-500/10 hover:text-accent-500 border border-dark-100 dark:border-dark-800 rounded-xl text-[10px] text-dark-500 transition-all font-semibold"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <div className="relative group">
                  <button 
                    className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      scrolled 
                        ? 'text-dark-300 hover:text-white hover:bg-white/10' 
                        : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-900/60'
                    }`} 
                    aria-label="User Account"
                  >
                    <FiUser size={17} />
                  </button>
                  <div className="absolute right-0 top-full mt-4 w-48 bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-dark-100 dark:border-dark-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3.5 border-b border-dark-100 dark:border-dark-800 text-left">
                      <p className="font-bold text-xs text-dark-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-dark-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link href="/account" className="block px-3.5 py-2.5 text-xs font-bold text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800/60 transition-colors text-left">My Profile</Link>
                    <Link href="/account/orders" className="block px-3.5 py-2.5 text-xs font-bold text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800/60 transition-colors text-left">My Orders</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-3.5 py-2.5 text-xs font-black text-accent-600 hover:bg-dark-50 dark:hover:bg-dark-800/60 transition-colors text-left">Admin Dashboard</Link>
                    )}
                    <button onClick={logout} className="block w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-b-2xl">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth/login" 
                  className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                    scrolled 
                      ? 'text-dark-300 hover:text-white hover:bg-white/10' 
                      : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-900/60'
                  }`} 
                  aria-label="Login"
                >
                  <FiUser size={17} />
                </Link>
              )}

              <Link 
                href="/cart" 
                className={`w-9.5 h-9.5 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  scrolled 
                    ? 'text-dark-300 hover:text-white hover:bg-white/10' 
                    : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-900/60'
                }`} 
                aria-label="Shopping Cart"
              >
                <FiShoppingBag size={17} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black animate-pulse shadow-sm shadow-accent-500/50">
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
                className="md:hidden overflow-hidden bg-white/95 dark:bg-dark-950/95 backdrop-blur-2xl border-t border-dark-100 dark:border-dark-800 rounded-3xl mt-2 p-3 text-left"
              >
                <nav className="flex flex-col space-y-1 py-4 px-2">
                  <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl p-3 transition-colors" onClick={() => setMenuOpen(false)}>Shop All</Link>
                  <Link href="/products?category=t-shirts" className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl p-3 transition-colors" onClick={() => setMenuOpen(false)}>T-Shirts</Link>
                  <Link href="/products?category=hoodies" className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl p-3 transition-colors" onClick={() => setMenuOpen(false)}>Hoodies</Link>
                  <Link href="/products?category=jackets" className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl p-3 transition-colors" onClick={() => setMenuOpen(false)}>Jackets</Link>
                  <Link href="/products?category=accessories" className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800/50 rounded-xl p-3 transition-colors" onClick={() => setMenuOpen(false)}>Accessories</Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

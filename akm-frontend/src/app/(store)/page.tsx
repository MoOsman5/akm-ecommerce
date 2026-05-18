'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar, FiCopy, FiCheck } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1600&q=80',
    tag: 'THE NEW STANDARD / DROP 01',
    titleLine1: 'Comfort You',
    titleLine2: 'Can Feel.',
    accentWord: 'Feel.',
    description: 'Discover the latest collection of heavy-weight fleece, technical hoodies, and accessories designed for the modern street aesthetic.',
    primaryLink: '/products',
    primaryText: 'Shop Drop 01',
    secondaryLink: '/products?featured=true',
    secondaryText: 'View Grails'
  },
  {
    image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1600&q=80',
    tag: 'STREETWEAR DROPS / 2026 EDITION',
    titleLine1: 'Bold Style.',
    titleLine2: 'Zero Limits.',
    accentWord: 'Limits.',
    description: 'Crafted with premium high-density cotton, double-lined seams, and uncompromising detailing. Built to stand out.',
    primaryLink: '/products?category=t-shirts',
    primaryText: 'Shop Tees',
    secondaryLink: '/products?sort=newest',
    secondaryText: 'See New Drops'
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
    tag: 'LIMITED RELEASES / SOLD EXCLUSIVELY',
    titleLine1: 'Bespoke Fit.',
    titleLine2: 'Luxury Cut.',
    accentWord: 'Cut.',
    description: 'Elevate your daily wear with clean silhouettes, dropped shoulders, and curated fits designed for maximum comfort and style.',
    primaryLink: '/products?category=jackets',
    primaryText: 'Shop Outerwear',
    secondaryLink: '/products?sort=popular',
    secondaryText: 'Browse Best Sellers'
  }
];

const LOOK_HOTSPOTS = [
  {
    id: 1,
    name: 'AKM Beanie',
    slug: 'akm-beanie',
    price: 22,
    top: '18%',
    left: '49%',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=300',
    desc: 'Double-knitted warmth for raw street style.'
  },
  {
    id: 2,
    name: 'AKM Essential Hoodie',
    slug: 'akm-essential-hoodie',
    price: 75,
    top: '46%',
    left: '52%',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300',
    desc: 'Heavyweight fleece drop-shoulder silhouette.'
  },
  {
    id: 3,
    name: 'AKM Crossbody Bag',
    slug: 'akm-crossbody-bag',
    price: 45,
    top: '68%',
    left: '38%',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300',
    desc: 'Technical grade strap lock crossbody storage.'
  }
];

function HomeContent() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [featRes, newRes, catRes] = await Promise.all([
          productsAPI.getFeatured(),
          productsAPI.getNewArrivals(),
          categoriesAPI.getAll(),
        ]);
        setFeatured(featRes.data);
        setNewArrivals(newRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const copyCoupon = () => {
    navigator.clipboard.writeText('SUMMER25');
    setCopied(true);
    toast.success('Coupon SUMMER25 copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 1.8 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-white dark:bg-dark-950 transition-colors duration-300">
      {/* Dynamic Ken Burns Slider Hero */}
      <section className="relative h-[85vh] md:h-[95vh] overflow-hidden bg-black flex items-center">
        {/* Carousel Background Images */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1.02, opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={HERO_SLIDES[activeSlide].image}
                alt="AKM Streetwear Showcase"
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </AnimatePresence>
          {/* High fashion vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </div>

        {/* Carousel Content */}
        <div className="container-custom relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="max-w-2xl text-left"
            >
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center gap-2 text-accent-400 font-black text-xs uppercase tracking-[0.25em] mb-4 bg-accent-500/10 px-3.5 py-1.5 rounded-full border border-accent-500/20 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-ping" />
                {HERO_SLIDES[activeSlide].tag}
              </motion.span>
              
              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-7xl font-display font-black text-white leading-[1.05] tracking-tight uppercase"
              >
                {HERO_SLIDES[activeSlide].titleLine1}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-amber-500 font-extrabold">
                  {HERO_SLIDES[activeSlide].titleLine2}
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-dark-300 text-base md:text-lg mt-6 max-w-lg leading-relaxed font-light"
              >
                {HERO_SLIDES[activeSlide].description}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 mt-10"
              >
                <Link
                  href={HERO_SLIDES[activeSlide].primaryLink}
                  className="group bg-white hover:bg-neutral-100 text-dark-900 transition-all font-black uppercase tracking-widest text-xs rounded-2xl px-8 py-5 flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 duration-200"
                >
                  {HERO_SLIDES[activeSlide].primaryText}
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={HERO_SLIDES[activeSlide].secondaryLink}
                  className="group border border-white/20 hover:border-white/50 text-white hover:bg-white/5 backdrop-blur-md transition-all font-black uppercase tracking-widest text-xs rounded-2xl px-8 py-5 flex items-center justify-center gap-2 active:scale-95 duration-200"
                >
                  {HERO_SLIDES[activeSlide].secondaryText}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators Dot Controls */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3.5 transition-all duration-500 rounded-full border border-white/20 ${
                activeSlide === idx
                  ? 'h-8 bg-white border-white'
                  : 'h-3.5 bg-white/20 hover:bg-white/45'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Custom Premium Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Scroll to Explore</span>
          <div className="w-6 h-10 border border-white/30 rounded-full relative flex justify-center p-1">
            <motion.div
              animate={{
                y: [0, 12, 0],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-black border-b border-dark-900 text-white py-10 relative z-10">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { icon: <FiTruck />, title: 'Free Express Shipping', desc: 'Complimentary shipping over $500' },
              { icon: <FiShield />, title: '100% Encrypted Checkout', desc: 'Secure high-end merchant server' },
              { icon: <FiRefreshCw />, title: 'Hassle-Free Returns', desc: 'Return item within 30 days' },
              { icon: <FiStar />, title: 'Bespoke Cut-and-Sew', desc: 'Handcrafted premium quality fabrics' },
            ].map((feat) => (
              <motion.div
                variants={itemVariants}
                key={feat.title}
                className="flex items-center gap-4 bg-dark-950/40 border border-dark-900/60 p-5 rounded-[1.5rem] hover:border-accent-500/20 transition-all duration-300 shadow-sm"
              >
                <div className="bg-dark-900 border border-dark-850 p-3.5 rounded-xl text-accent-500 text-xl shadow-inner">
                  {feat.icon}
                </div>
                <div>
                  <p className="font-extrabold text-sm text-white mb-0.5">{feat.title}</p>
                  <p className="text-dark-500 text-xs font-light">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-2"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500">Curated Wardrobe</span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-dark-900 dark:text-white uppercase tracking-tight">Shop By Category</h2>
            <p className="text-dark-500 dark:text-dark-400 text-sm font-light max-w-sm mx-auto">Explore tailored aesthetics and select street releases</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {categories.map((cat: any) => (
              <motion.div variants={itemVariants} key={cat._id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group block relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl border border-dark-100/10 hover:border-white/10 transition-all duration-500"
                >
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/10 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 transform translate-y-1.5 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-display font-black text-xl mb-1 uppercase tracking-tight leading-none">{cat.name}</h3>
                    <span className="inline-flex items-center text-accent-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      Explore <FiArrowRight className="ml-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-24 md:py-32 bg-dark-50 dark:bg-dark-900/30 border-t border-b border-dark-100/50 dark:border-dark-900/50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500 block mb-2">Editorials</span>
                <h2 className="text-3xl md:text-5xl font-display font-black text-dark-900 dark:text-white uppercase tracking-tight leading-none">Featured Releases</h2>
                <p className="text-dark-500 dark:text-dark-400 mt-3 text-sm font-light">Hand-selected premium streetwear grails</p>
              </div>
              <Link
                href="/products?featured=true"
                className="group inline-flex items-center text-xs font-black uppercase tracking-widest text-dark-900 dark:text-white hover:text-accent-500 dark:hover:text-accent-400 transition-colors py-2 border-b border-dark-900 dark:border-white hover:border-accent-500 dark:hover:border-accent-400"
              >
                View All Featured <FiArrowRight className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {featured.slice(0, 8).map((product: any) => (
                <motion.div variants={itemVariants} key={product._id}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* NEW: Asymmetrical Interactive "Shop The Look" Hotspots Section */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark-950 overflow-hidden border-b border-dark-100/50 dark:border-dark-900/50">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500">Lookbook / Vol. II</span>
            <h2 className="text-3xl md:text-5xl font-display font-black text-dark-900 dark:text-white uppercase tracking-tight">Shop the Look</h2>
            <p className="text-dark-500 dark:text-dark-400 text-sm font-light max-w-sm mx-auto">Hover over the glowing hotspots to explore active garment profiles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Interactive Image Frame (8 Cols) */}
            <div className="lg:col-span-8 relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group border border-dark-150/15">
              <Image
                src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&q=80"
                alt="STREET LOOK editorial outfit"
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              />
              {/* Deep fashion overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

              {/* Hotspots Mapping */}
              {LOOK_HOTSPOTS.map((spot) => {
                const isActive = activeHotspot === spot.id;
                return (
                  <div
                    key={spot.id}
                    className="absolute"
                    style={{ top: spot.top, left: spot.left }}
                  >
                    {/* Hotspot Pulse Trigger Button */}
                    <button
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                      className="relative w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent-500/80 hover:bg-accent-500 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.6)] active:scale-90 transition-transform duration-300 z-20"
                    >
                      <span className="absolute inset-0 rounded-full border-2 border-accent-400 animate-ping opacity-75" />
                      <span className="w-2.5 h-2.5 bg-white rounded-full" />
                    </button>

                    {/* Glowing Interactive Glass Pop-Up Card */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute bottom-6 -translate-x-1/2 bg-black/85 backdrop-blur-xl border border-white/20 p-4 rounded-3xl w-60 shadow-2xl z-30 select-none pointer-events-auto"
                        >
                          <Link href={`/products/${spot.slug}`} className="flex items-center gap-3.5 group/card">
                            <img
                              src={spot.image}
                              alt={spot.name}
                              className="w-14 h-14 object-cover rounded-2xl border border-dark-800"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-xs font-black uppercase tracking-tight truncate group-hover/card:text-accent-400 transition-colors">
                                {spot.name}
                              </h4>
                              <p className="text-accent-500 text-xs font-extrabold mt-0.5">${spot.price}</p>
                              <span className="text-[8px] font-black uppercase tracking-widest text-dark-400 group-hover/card:text-white transition-colors flex items-center gap-1 mt-1">
                                View Product <FiArrowRight size={10} />
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Lookbook Description and Purchase Cards (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500 block">Outfit Breakdown</span>
                <h3 className="text-2xl md:text-3xl font-display font-black text-dark-900 dark:text-white uppercase tracking-tight leading-none">
                  Urban Utility Aesthetic
                </h3>
                <p className="text-dark-500 dark:text-dark-400 text-sm font-light leading-relaxed">
                  Engineered comfort with heavyweight silhouettes. Our Vol. II streetwear coordinates marry dark techwear beanies with deep fleece hoodies and modular strap bags.
                </p>
              </div>

              {/* Purchase Sidebar Cards */}
              <div className="space-y-4">
                {LOOK_HOTSPOTS.map((spot) => (
                  <Link
                    key={spot.id}
                    href={`/products/${spot.slug}`}
                    onMouseEnter={() => setActiveHotspot(spot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    className={`flex items-center gap-4 p-4 border rounded-[1.75rem] transition-all duration-300 cursor-pointer ${
                      activeHotspot === spot.id
                        ? 'bg-dark-50 dark:bg-dark-900 border-accent-500/30 scale-[1.02] shadow-md shadow-accent-500/5'
                        : 'bg-dark-50/20 dark:bg-dark-950/20 border-dark-100/50 dark:border-dark-900/60 hover:bg-dark-50 dark:hover:bg-dark-900 hover:border-white/10'
                    }`}
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-dark-100/30 dark:border-dark-850"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-dark-900 dark:text-white text-xs font-black uppercase tracking-tight truncate">
                          {spot.name}
                        </h4>
                        <span className="text-accent-500 text-xs font-black">${spot.price}</span>
                      </div>
                      <p className="text-dark-400 text-[11px] font-light mt-1 truncate">{spot.desc}</p>
                      <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-accent-500 mt-2 hover:text-accent-400">
                        Shop Item <FiArrowRight size={8} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Cyberpunk Promo Banner with Copy Trigger */}
      <section className="py-14 md:py-24 bg-white dark:bg-dark-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[3rem] overflow-hidden h-[500px] md:h-[650px] shadow-2xl border border-dark-900/10 dark:border-white/5"
          >
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"
              alt="Summer Sale Campaign"
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Vignette gradient grid filter */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom w-full">
                <div className="max-w-xl text-left">
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="inline-block bg-accent-500 text-white text-[9px] tracking-[0.25em] font-black px-4 py-2 rounded-full mb-6 uppercase border border-accent-400/20"
                  >
                    Limited Editorial Drop
                  </motion.span>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-7xl font-display font-black text-white leading-[1.05] uppercase tracking-tight"
                  >
                    Summer Sale
                    <br />
                    Up to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-amber-400 font-black">40% Off</span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-dark-200 text-sm md:text-base mt-6 font-light leading-relaxed max-w-md"
                  >
                    Refresh your seasonal aesthetic with our premium cut-and-sew apparel. Tap the glowing coupon block below to instantly copy the code for discount credit.
                  </motion.p>

                  {/* Copy Coupon Trigger */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <button
                      onClick={copyCoupon}
                      className="group flex items-center gap-3.5 bg-dark-900/60 border border-dark-800 hover:border-accent-500 hover:bg-accent-500/10 px-5 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 text-left cursor-pointer active:scale-95 active:duration-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 group-hover:scale-105 transition-transform shrink-0">
                        {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-accent-400">Coupon Code</p>
                        <p className="text-white text-base font-black tracking-widest font-mono">SUMMER25</p>
                      </div>
                    </button>

                    <Link
                      href="/products?sort=popular"
                      className="group inline-flex items-center bg-white hover:bg-neutral-100 text-dark-900 transition-all font-black uppercase tracking-widest text-xs rounded-2xl px-8 py-5 h-full self-stretch justify-center gap-2 active:scale-95"
                    >
                      Shop Sale <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-24 md:py-32 bg-dark-50 dark:bg-dark-900/30 border-t border-dark-100/50 dark:border-dark-900/50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500 block mb-2">New Drops</span>
                <h2 className="text-3xl md:text-5xl font-display font-black text-dark-900 dark:text-white uppercase tracking-tight leading-none">New Arrivals</h2>
                <p className="text-dark-500 dark:text-dark-400 mt-3 text-sm font-light">Fresh cuts and streetwear aesthetics, just released</p>
              </div>
              <Link
                href="/products?sort=newest"
                className="group inline-flex items-center text-xs font-black uppercase tracking-widest text-dark-900 dark:text-white hover:text-accent-500 dark:hover:text-accent-400 transition-colors py-2 border-b border-dark-900 dark:border-white hover:border-accent-500 dark:hover:border-accent-400"
              >
                Explore All Drops <FiArrowRight className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {newArrivals.slice(0, 8).map((product: any) => (
                <motion.div variants={itemVariants} key={product._id}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Cinematic Typographic Split-Curtain Landing Intro Loader */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              y: '-100%',
              transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
            }}
            className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
          >
            <div className="relative flex flex-col items-center">
              {/* Typographic Logo Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 30, letterSpacing: '0.4em' }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  letterSpacing: '0.8em',
                  transition: { duration: 1.2, ease: 'easeOut' }
                }}
                className="text-white font-display font-black text-4xl md:text-6xl tracking-[0.6em] uppercase flex items-center gap-1"
              >
                A K M
              </motion.div>

              {/* Subtitle brand stamp */}
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: [0, 0.4, 0.7, 0.3], 
                  scale: 1,
                  transition: { delay: 0.4, duration: 1.5, ease: 'easeInOut' }
                }}
                className="text-accent-400 font-mono text-[9px] uppercase tracking-[0.3em] mt-4"
              >
                Streetwear Archives / Vol. II
              </motion.p>
              
              {/* Subtle loading horizontal glowing line */}
              <div className="w-48 h-[1px] bg-dark-850 mt-8 relative overflow-hidden rounded-full">
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ 
                    left: '100%',
                    transition: { duration: 1.6, ease: 'easeInOut', repeat: 0 }
                  }}
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-accent-500 to-transparent"
                />
              </div>
            </div>

            {/* Dynamic editorial frame numbers */}
            <div className="absolute bottom-10 left-10 text-[9px] font-mono text-dark-500 tracking-widest uppercase">
              [ 2026 DROP_01 ]
            </div>
            <div className="absolute bottom-10 right-10 text-[9px] font-mono text-dark-500 tracking-widest uppercase">
              LOC // NY_TK
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <HomeContent />
    </Suspense>
  );
}

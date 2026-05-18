'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

function HomeContent() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <LoadingSpinner size="lg" />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white dark:bg-dark-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[95vh] overflow-hidden bg-dark-950">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="AKM Collection"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.span variants={itemVariants} className="inline-block text-accent-400 font-semibold text-sm uppercase tracking-widest mb-4 tracking-[0.2em]">
                New Collection 2026
              </motion.span>
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight">
                Comfort You<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
                  Can Feel.
                </span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-dark-300 text-lg mt-6 max-w-lg leading-relaxed">
                Premium streetwear designed for the bold. Discover AKM&apos;s latest collection of high-quality hoodies, tees, and accessories.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="/products" className="group bg-white text-dark-900 hover:bg-dark-100 transition-all font-semibold rounded-full text-lg px-8 py-4 flex items-center justify-center">
                  Shop Collection <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/products?featured=true" className="group border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all font-semibold rounded-full text-lg px-8 py-4 flex items-center justify-center">
                  View Featured
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-dark-900 dark:bg-dark-950 border-b border-dark-800 dark:border-dark-900 text-white py-8">
        <div className="container-custom">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: <FiTruck />, title: 'Free Global Shipping', desc: 'On orders over $500' },
              { icon: <FiShield />, title: 'Secure Payment', desc: '100% encrypted checkout' },
              { icon: <FiRefreshCw />, title: 'Easy Returns', desc: 'Hassle-free 30-day returns' },
              { icon: <FiStar />, title: 'Premium Quality', desc: 'Handcrafted with precision' },
            ].map((feat) => (
              <motion.div variants={itemVariants} key={feat.title} className="flex items-start space-x-4">
                <div className="bg-dark-800 dark:bg-dark-900 p-3 rounded-xl text-accent-400 text-2xl">
                  {feat.icon}
                </div>
                <div>
                  <p className="font-bold text-white mb-1">{feat.title}</p>
                  <p className="text-dark-400 text-sm">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 md:py-32 bg-white dark:bg-dark-950">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-900 dark:text-white mb-4">Shop By Category</h2>
            <p className="text-dark-500 dark:text-dark-400 text-lg">Find exactly what you&apos;re looking for</p>
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
                  className="group block relative aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <Image 
                    src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'} 
                    alt={cat.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-display font-bold text-2xl mb-2">{cat.name}</h3>
                    <span className="inline-flex items-center text-accent-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      Explore Collection <FiArrowRight className="ml-2" />
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
        <section className="py-20 md:py-32 bg-dark-50 dark:bg-dark-900/50">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-900 dark:text-white">Featured Products</h2>
                <p className="text-dark-500 dark:text-dark-400 mt-4 text-lg">Curated premium picks for the season</p>
              </div>
              <Link href="/products?featured=true" className="group hidden md:inline-flex items-center text-dark-900 dark:text-white font-semibold hover:text-accent-500 dark:hover:text-accent-400 transition-colors">
                View All Featured <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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
            
            <div className="mt-10 text-center md:hidden">
              <Link href="/products?featured=true" className="btn-secondary w-full">
                View All Featured
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-10 md:py-16 bg-white dark:bg-dark-950">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2.5rem] overflow-hidden h-[450px] md:h-[600px] shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80"
              alt="Summer Sale"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-900/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom w-full">
                <div className="max-w-xl">
                  <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="inline-block bg-accent-500 text-white text-xs tracking-wider font-bold px-4 py-2 rounded-full mb-6 uppercase"
                  >
                    Limited Time Offer
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-7xl font-display font-bold text-white leading-tight"
                  >
                    Summer Sale<br />Up to <span className="text-accent-400">40% Off</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-dark-100 text-lg md:text-xl mt-6 font-light"
                  >
                    Don&apos;t miss out on our biggest drop of the season. Use code <strong className="font-bold text-white">SUMMER25</strong> at checkout.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link href="/products?sort=popular" className="group inline-flex items-center bg-white text-dark-900 hover:bg-dark-100 transition-colors font-bold rounded-full mt-10 text-lg px-8 py-4">
                      Shop The Sale <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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
        <section className="py-20 md:py-32 bg-dark-50 dark:bg-dark-900/50">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-900 dark:text-white">New Arrivals</h2>
                <p className="text-dark-500 dark:text-dark-400 mt-4 text-lg">Fresh aesthetics, just dropped</p>
              </div>
              <Link href="/products?sort=newest" className="group hidden md:inline-flex items-center text-dark-900 dark:text-white font-semibold hover:text-accent-500 dark:hover:text-accent-400 transition-colors">
                Explore All New <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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

            <div className="mt-10 text-center md:hidden">
              <Link href="/products?sort=newest" className="btn-secondary w-full">
                Explore All New
              </Link>
            </div>
          </div>
        </section>
      )}
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

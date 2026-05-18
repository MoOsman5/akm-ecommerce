'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFilter, FiX, FiChevronDown, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const getColorHex = (color: string) => {
  const map: Record<string, string> = {
    black: '#121212',
    gray: '#7a7a7a',
    burgundy: '#6b1d2f',
    olive: '#556b2f',
    sand: '#d2b48c',
    white: '#ffffff',
    navy: '#1a2e40',
    'forest green': '#2d4a22',
    charcoal: '#36454f',
    natural: '#e6dfd3',
    tan: '#b68a5c',
    indigo: '#3f51b5',
    mixed: 'linear-gradient(45deg, #121212, #ffffff)',
    red: '#b91c1c',
    blue: '#2563eb',
    gold: '#d97706',
    yellow: '#eab308',
    brown: '#8B4513'
  };
  return map[color.toLowerCase()] || '#adb5bd';
};

function ProductsList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    page: 1, limit: 12,
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '',
    color: '', size: '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    featured: searchParams.get('featured') || '',
  });

  // Sync URL search params with local state when navigating client-side
  useEffect(() => {
    const categoryQuery = searchParams.get('category') || '';
    setFilters((f) => {
      if (f.category !== categoryQuery) {
        return { ...f, category: categoryQuery, page: 1 };
      }
      return f;
    });
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
    categoriesAPI.getAll().then((res) => setCategories(res.data)).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    loadProducts();
  }, [filters.page, filters.sort, filters.category, filters.minPrice, filters.maxPrice, filters.color, filters.size, filters.search, filters.featured]); // eslint-disable-line

  async function loadProducts() {
    setLoading(true);
    try {
      const params: any = { page: filters.page, limit: filters.limit };
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.color) params.color = filters.color;
      if (filters.size) params.size = filters.size;
      if (filters.sort) params.sort = filters.sort;
      if (filters.search) params.search = filters.search;
      if (filters.featured) params.featured = filters.featured;

      const { data } = await productsAPI.getAll(params);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    setFilters((f) => ({ ...f, page: 1 }));
    loadProducts();
    setShowFilters(false);
  }

  function clearFilters() {
    setFilters({ page: 1, limit: 12, category: '', minPrice: '', maxPrice: '', color: '', size: '', sort: 'newest', search: '', featured: '' });
    setTimeout(loadProducts, 0);
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Olive', 'Red', 'Brown'];

  return (
    <div className="container-custom py-8 text-dark-900 dark:text-white">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-dark-100 dark:border-dark-900/60 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-dark-900 dark:text-white uppercase tracking-tight leading-none">
            {filters.category ? categories.find((c: any) => c.slug === filters.category)?.name || 'Products' : 'All Products'}
          </h1>
          <p className="text-dark-500 dark:text-dark-400 mt-2 text-sm font-light">Browse our complete premium street fashion collection</p>
        </div>
        {/* Active Filters Summary */}
        {(filters.category || filters.color || filters.size || filters.minPrice || filters.maxPrice) && (
          <button onClick={clearFilters} className="text-xs font-bold uppercase tracking-wider text-accent-500 hover:text-accent-600 transition-colors flex items-center gap-1.5 self-start md:self-auto py-2">
            <FiRefreshCw size={12} className="animate-spin-slow" /> Clear Active Filters
          </button>
        )}
      </div>

      <div className="flex gap-10">
        {/* Filters Sidebar — Desktop */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-32 space-y-8 bg-dark-50/50 dark:bg-dark-900/20 backdrop-blur-sm rounded-[2rem] border border-dark-100/50 dark:border-dark-800/40 p-6 shadow-sm">
            {/* Categories */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: '' }))}
                  className={`flex items-center justify-between text-sm w-full text-left py-1.5 transition-all ${
                    !filters.category
                      ? 'text-accent-500 font-extrabold translate-x-1'
                      : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                  }`}
                >
                  <span>All Collection</span>
                  {!filters.category && <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />}
                </button>
                {categories.map((cat: any) => (
                  <button
                    key={cat._id}
                    onClick={() => setFilters((f) => ({ ...f, category: cat.slug }))}
                    className={`flex items-center justify-between text-sm w-full text-left py-1.5 transition-all ${
                      filters.category === cat.slug
                        ? 'text-accent-500 font-extrabold translate-x-1'
                        : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {filters.category === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-900 dark:text-white mb-4">Price Range</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                    className="w-full bg-white dark:bg-dark-900/50 border border-dark-200 dark:border-dark-800 rounded-xl py-2 pl-6 pr-2 text-xs text-dark-900 dark:text-white outline-none focus:border-accent-500 transition-all font-bold"
                  />
                </div>
                <span className="text-dark-300 dark:text-dark-700 font-light">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                    className="w-full bg-white dark:bg-dark-900/50 border border-dark-200 dark:border-dark-800 rounded-xl py-2 pl-6 pr-2 text-xs text-dark-900 dark:text-white outline-none focus:border-accent-500 transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-900 dark:text-white mb-4">Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map((s) => {
                  const isActive = filters.size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilters((f) => ({ ...f, size: f.size === s ? '' : s }))}
                      className={`h-10 rounded-xl border text-xs font-black tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'bg-dark-900 text-white border-dark-900 dark:bg-white dark:text-dark-900 dark:border-white shadow-md'
                          : 'border-dark-200/60 dark:border-dark-800 text-dark-600 dark:text-dark-400 hover:border-dark-400 dark:hover:border-dark-700'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-900 dark:text-white mb-4">
                Colors {filters.color && <span className="text-accent-500 font-normal normal-case ml-1">({filters.color})</span>}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => {
                  const hex = getColorHex(c);
                  const isWhite = c.toLowerCase() === 'white';
                  const isActive = filters.color === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setFilters((f) => ({ ...f, color: f.color === c ? '' : c }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                        isActive
                          ? 'border-accent-500 scale-110 shadow-lg shadow-accent-500/10'
                          : 'border-dark-200/50 dark:border-dark-800/80 hover:scale-105'
                      }`}
                      title={c}
                    >
                      <span
                        className="w-[80%] h-[80%] rounded-full shadow-inner block"
                        style={{ background: hex }}
                      />
                      {isWhite && (
                        <span className="absolute inset-0.5 rounded-full border border-dark-100" />
                      )}
                      {isActive && (
                        <span
                          className={`absolute w-1.5 h-1.5 rounded-full ${
                            isWhite ? 'bg-dark-900' : 'bg-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter CTAs */}
            <div className="flex gap-2 pt-2">
              <button onClick={applyFilters} className="btn-primary text-xs font-bold tracking-widest uppercase py-3 flex-1 bg-dark-900 hover:bg-dark-800 dark:bg-white dark:hover:bg-neutral-100 dark:text-dark-900 rounded-xl shadow-lg">
                Apply
              </button>
              <button onClick={clearFilters} className="btn-secondary text-xs font-bold tracking-widest uppercase py-3 flex-1 border-2 border-dark-250 dark:border-dark-800 hover:bg-dark-900 dark:hover:bg-white text-dark-900 dark:text-white hover:text-white dark:hover:text-dark-900 rounded-xl transition-all">
                Clear
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-100 dark:border-dark-900/60">
            <button
              className="lg:hidden flex items-center space-x-2 bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800 px-4 py-2.5 rounded-xl text-dark-800 dark:text-dark-200 text-sm font-bold shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter size={16} /> <span>Filters</span>
            </button>
            <p className="text-dark-500 dark:text-dark-400 text-sm font-medium hidden lg:block">
              Showing <span className="font-extrabold text-dark-900 dark:text-white">{products.length}</span> premium products
            </p>
            <div className="flex items-center space-x-3 ml-auto lg:ml-0">
              <span className="text-xs font-bold text-dark-400 uppercase tracking-widest hidden sm:block">Sort by:</span>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                  className="appearance-none bg-white dark:bg-dark-900/40 border border-dark-200 dark:border-dark-800 hover:border-dark-300 dark:hover:border-dark-700 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-dark-900 dark:text-white outline-none cursor-pointer transition-all w-44"
                >
                  <option value="newest">Newest Drops</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
              <div
                className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-950 p-6 overflow-y-auto border-l border-dark-200 dark:border-dark-800 flex flex-col space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800">
                  <h3 className="font-display font-extrabold text-lg dark:text-white uppercase tracking-wider">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-all">
                    <FiX size={20} />
                  </button>
                </div>

                <div className="space-y-6 flex-1">
                  {/* Category Selection */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider dark:text-white mb-3">Category</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setFilters((f) => ({ ...f, category: '' }))}
                        className={`block text-sm py-1 ${!filters.category ? 'font-bold text-accent-500' : 'text-dark-500 dark:text-dark-400'}`}
                      >
                        All Collection
                      </button>
                      {categories.map((cat: any) => (
                        <button
                          key={cat._id}
                          onClick={() => setFilters((f) => ({ ...f, category: cat.slug }))}
                          className={`block text-sm py-1 ${filters.category === cat.slug ? 'font-bold text-accent-500' : 'text-dark-500 dark:text-dark-400'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider dark:text-white mb-3">Sizes</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setFilters((f) => ({ ...f, size: f.size === s ? '' : s }))}
                          className={`h-9 rounded-lg border text-xs font-bold transition-all ${
                            filters.size === s
                              ? 'bg-dark-900 text-white border-dark-900 dark:bg-white dark:text-dark-900 dark:border-white'
                              : 'border-dark-200 dark:border-dark-800 text-dark-600 dark:text-dark-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider dark:text-white mb-3">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => {
                        const hex = getColorHex(c);
                        const isWhite = c.toLowerCase() === 'white';
                        const isActive = filters.color === c;
                        return (
                          <button
                            key={c}
                            onClick={() => setFilters((f) => ({ ...f, color: f.color === c ? '' : c }))}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                              isActive
                                ? 'border-accent-500 scale-110 shadow-lg shadow-accent-500/10'
                                : 'border-dark-200/50 dark:border-dark-800 hover:scale-105'
                            }`}
                            title={c}
                          >
                            <span
                              className="w-[80%] h-[80%] rounded-full shadow-inner block"
                              style={{ background: hex }}
                            />
                            {isWhite && <span className="absolute inset-0.5 rounded-full border border-dark-100" />}
                            {isActive && (
                              <span className={`absolute w-1.5 h-1.5 rounded-full ${isWhite ? 'bg-dark-900' : 'bg-white'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-dark-100 dark:border-dark-850 flex gap-2">
                  <button onClick={applyFilters} className="btn-primary text-xs font-bold tracking-widest uppercase py-3.5 flex-1 rounded-xl">
                    Apply Filters
                  </button>
                  <button onClick={clearFilters} className="btn-secondary text-xs font-bold tracking-widest uppercase py-3.5 flex-1 rounded-xl">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner size="lg" />
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-dark-50/50 dark:bg-dark-900/10 rounded-[2rem] border border-dark-100/50 dark:border-dark-800/40 p-8 shadow-sm">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="font-display font-extrabold text-lg dark:text-white uppercase tracking-wider">No Products Found</h3>
              <p className="text-dark-500 dark:text-dark-400 text-sm mt-1 max-w-xs mx-auto">We couldn&apos;t find any items matching your selected filter parameters.</p>
              <button onClick={clearFilters} className="btn-secondary text-xs font-bold tracking-widest uppercase mt-6 px-6 py-3 border-2 border-dark-250 dark:border-dark-850 rounded-xl hover:bg-dark-900 dark:hover:bg-white text-dark-900 dark:text-white hover:text-white dark:hover:text-dark-900 transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-16">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = filters.page === page;
                return (
                  <button
                    key={page}
                    onClick={() => setFilters((f) => ({ ...f, page }))}
                    className={`w-11 h-11 rounded-xl font-bold text-xs transition-all duration-300 ${
                      isActive
                        ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900 shadow-lg'
                        : 'bg-dark-50/50 dark:bg-dark-900/40 border border-dark-200/50 dark:border-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsList />
    </Suspense>
  );
}

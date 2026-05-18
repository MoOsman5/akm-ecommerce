'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { productsAPI, categoriesAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-heading dark:text-white">
          {filters.category ? categories.find((c: any) => c.slug === filters.category)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="text-dark-500 dark:text-dark-400 mt-2">Browse our complete collection</p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar — Desktop */}
        <aside className={`w-64 shrink-0 hidden lg:block`}>
          <div className="sticky top-32 space-y-6">
            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white mb-3">Categories</h3>
              <div className="space-y-2">
                <button onClick={() => setFilters((f) => ({ ...f, category: '' }))} className={`block text-sm w-full text-left py-1 ${!filters.category ? 'text-dark-900 dark:text-white font-semibold' : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'} transition-colors`}>All</button>
                {categories.map((cat: any) => (
                  <button key={cat._id} onClick={() => setFilters((f) => ({ ...f, category: cat.slug }))} className={`block text-sm w-full text-left py-1 ${filters.category === cat.slug ? 'text-dark-900 dark:text-white font-semibold' : 'text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'} transition-colors`}>{cat.name}</button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white mb-3">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))} className="input-field dark:bg-dark-900 dark:border-dark-700 dark:text-white text-sm py-2 w-24" />
                <span className="text-dark-400 dark:text-dark-600">—</span>
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))} className="input-field dark:bg-dark-900 dark:border-dark-700 dark:text-white text-sm py-2 w-24" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setFilters((f) => ({ ...f, size: f.size === s ? '' : s }))} className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${filters.size === s ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900 border-dark-900 dark:border-white' : 'border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-dark-400 dark:hover:border-dark-500'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-dark-900 dark:text-white mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button key={c} onClick={() => setFilters((f) => ({ ...f, color: f.color === c ? '' : c }))} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${filters.color === c ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900 border-dark-900 dark:border-white' : 'border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-dark-400 dark:hover:border-dark-500'}`}>
                    <span className="w-3 h-3 rounded-full border border-dark-200 dark:border-dark-600" style={{ backgroundColor: c.toLowerCase() }} />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={applyFilters} className="btn-primary text-sm py-2 flex-1">Apply</button>
              <button onClick={clearFilters} className="btn-secondary text-sm py-2 flex-1">Clear</button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-100 dark:border-dark-800">
            <button className="lg:hidden flex items-center space-x-2 text-dark-700 dark:text-dark-300" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter size={18} /> <span>Filters</span>
            </button>
            <p className="text-dark-500 dark:text-dark-400 text-sm hidden lg:block">{products.length} products</p>
            <div className="flex items-center space-x-2 ml-auto lg:ml-0">
              <span className="text-sm text-dark-500 dark:text-dark-400 hidden sm:block">Sort by:</span>
              <select value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))} className="input-field dark:bg-dark-900 dark:border-dark-700 dark:text-white text-sm py-2 w-40 cursor-pointer">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-dark-950 p-6 overflow-y-auto border-l border-dark-200 dark:border-dark-800" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg dark:text-white">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white"><FiX size={24} /></button>
                </div>
                {/* Same filter options as desktop */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2 dark:text-white">Category</h4>
                    {categories.map((cat: any) => (
                      <button key={cat._id} onClick={() => setFilters((f) => ({ ...f, category: cat.slug }))} className={`block text-sm py-1 ${filters.category === cat.slug ? 'font-semibold text-dark-900 dark:text-white' : 'text-dark-500 dark:text-dark-400'}`}>{cat.name}</button>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 dark:text-white">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button key={s} onClick={() => setFilters((f) => ({ ...f, size: f.size === s ? '' : s }))} className={`px-3 py-1.5 rounded border text-sm transition-colors ${filters.size === s ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900 border-dark-900 dark:border-white' : 'border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-400 hover:border-dark-400 dark:hover:border-dark-500'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={applyFilters} className="btn-primary flex-1">Apply</button>
                  <button onClick={clearFilters} className="btn-secondary flex-1">Clear</button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-dark-500 text-lg">No products found</p>
              <button onClick={clearFilters} className="btn-secondary mt-4 text-sm">Clear Filters</button>
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
            <div className="flex items-center justify-center space-x-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters((f) => ({ ...f, page }))}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    filters.page === page ? 'bg-dark-900 dark:bg-white text-white dark:text-dark-900' : 'bg-dark-50 dark:bg-dark-900 text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                  }`}
                >
                  {page}
                </button>
              ))}
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

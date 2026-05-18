'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiCheck, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { productsAPI } from '@/lib/api';
import { useCartStore, useAuthStore } from '@/store';
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
  };
  return map[color.toLowerCase()] || '#adb5bd';
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await productsAPI.getBySlug(slug as string);
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        // Load related
        try {
          const relRes = await productsAPI.getRelated(data._id);
          setRelated(relRes.data);
        } catch {}
      } catch { router.push('/products'); }
      finally { setLoading(false); }
    }
    loadProduct();
  }, [slug, router]);

  const getVariantStock = () => {
    if (!product) return 0;
    const variant = product.variants?.find(
      (v: any) => v.color === selectedColor && v.size === selectedSize,
    );
    return variant?.stock || 0;
  };

  async function handleAddToCart() {
    if (!user) { router.push('/auth/login'); return; }
    if (!selectedColor || !selectedSize) { toast.error('Please select color and size'); return; }
    if (getVariantStock() === 0) { toast.error('This variant is out of stock'); return; }

    setAdding(true);
    try {
      await addItem({ product: product._id, color: selectedColor, size: selectedSize, quantity });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    } finally { setAdding(false); }
  }

  if (loading) return <LoadingSpinner size="lg" />;
  if (!product) return null;

  const stock = getVariantStock();
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="container-custom py-8 text-dark-900 dark:text-white">
      <Toaster position="top-right" />

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-dark-400 dark:text-dark-500 mb-8">
        <Link href="/" className="hover:text-dark-900 dark:hover:text-white transition-colors">Home</Link>
        <FiChevronRight />
        <Link href="/products" className="hover:text-dark-900 dark:hover:text-white transition-colors">Shop All</Link>
        {product.category && (
          <>
            <FiChevronRight />
            <span className="text-dark-500 dark:text-dark-400">{product.category.name}</span>
          </>
        )}
        <FiChevronRight />
        <span className="text-accent-500 dark:text-accent-400 truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-dark-55 dark:bg-dark-900/50 border border-dark-100/50 dark:border-dark-800/50 group shadow-2xl">
            <Image
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-6 left-6 bg-accent-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-md">
                -{discount}% OFF
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-[1.2rem] overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === i
                      ? 'border-accent-500 scale-95 shadow-md shadow-accent-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-dark-300 dark:hover:border-dark-700'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-3">
            {product.category && (
              <span className="text-[10px] font-black text-accent-500 dark:text-accent-400 uppercase tracking-[0.3em] block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-dark-900 dark:text-white tracking-tight leading-none">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-4xl font-display font-black text-dark-900 dark:text-white">
                ${product.price}
              </span>
              {product.compareAtPrice && (
                <span className="text-2xl text-dark-400 dark:text-dark-500 line-through font-medium">
                  ${product.compareAtPrice}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Save ${product.compareAtPrice - product.price} ({discount}%)
                </span>
              )}
            </div>
          </div>

          <p className="text-dark-600 dark:text-dark-300 leading-relaxed text-base font-light">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-dark-900 dark:text-white uppercase tracking-wider">
                Color: <span className="font-normal text-dark-500 dark:text-dark-400 normal-case ml-1">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color: string) => {
                  const hex = getColorHex(color);
                  const isWhite = color.toLowerCase() === 'white';
                  const isActive = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-300 relative flex items-center justify-center ${
                        isActive
                          ? 'border-accent-500 scale-110 shadow-lg shadow-accent-500/10'
                          : 'border-dark-200/50 dark:border-dark-700/50 hover:scale-105'
                      }`}
                      title={color}
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
          )}

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-dark-900 dark:text-white uppercase tracking-wider">
                Size: <span className="font-normal text-dark-500 dark:text-dark-400 normal-case ml-1">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size: string) => {
                  const variantStock = product.variants?.find((v: any) => v.color === selectedColor && v.size === size)?.stock || 0;
                  const isOutOfStock = variantStock === 0;
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`h-12 px-6 rounded-xl border text-sm font-bold tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'bg-dark-900 text-white border-dark-900 dark:bg-white dark:text-dark-900 dark:border-white shadow-xl shadow-black/10'
                          : isOutOfStock
                          ? 'border-dashed border-dark-200 dark:border-dark-800 text-dark-300 dark:text-dark-600 opacity-40 cursor-not-allowed line-through'
                          : 'border-dark-200/60 dark:border-dark-700 text-dark-700 dark:text-dark-300 hover:border-dark-400 dark:hover:border-dark-500'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {stock > 0 ? (
              <div className="flex items-center space-x-2.5 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-green-600 dark:text-green-400 text-xs font-black uppercase tracking-wider">
                  {stock > 10 ? 'In Stock' : `Only ${stock} left in stock`}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
                <FiAlertCircle className="text-red-500 dark:text-red-400" size={14} />
                <span className="text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center justify-between border border-dark-200/80 dark:border-dark-700 bg-white dark:bg-dark-900/30 rounded-2xl p-1 sm:w-36 shrink-0 shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 text-dark-500 hover:text-dark-900 dark:hover:text-white transition-all active:scale-90"
              >
                <FiMinus size={16} />
              </button>
              <span className="px-3 font-display font-bold text-lg text-dark-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3.5 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 text-dark-500 hover:text-dark-900 dark:hover:text-white transition-all active:scale-90"
              >
                <FiPlus size={16} />
              </button>
            </div>

            <div className="flex gap-3 flex-1">
              <button
                onClick={handleAddToCart}
                disabled={adding || stock === 0}
                className="btn-primary flex-1 text-sm font-black tracking-widest uppercase py-5 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] hover:shadow-2xl dark:hover:shadow-white/5 transition-all duration-300 bg-dark-900 hover:bg-dark-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-dark-900 shadow-xl shadow-black/10"
              >
                <FiShoppingBag className="mr-2" size={18} />
                {adding ? 'Adding to Bag...' : stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>

              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
                }}
                className={`p-5 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-95 ${
                  isWishlisted
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-dark-200/80 dark:border-dark-700 text-dark-400 hover:text-dark-900 dark:hover:text-white hover:border-dark-400 dark:hover:border-dark-500'
                }`}
              >
                <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-dark-100 dark:border-dark-800">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 bg-dark-50 dark:bg-dark-900/50 border border-dark-100/50 dark:border-dark-800/50 rounded-full text-[10px] font-black text-dark-500 dark:text-dark-400 uppercase tracking-widest shadow-inner"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="text-2xl font-display font-black text-dark-900 dark:text-white mb-10 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-16 after:h-[3px] after:bg-accent-500 pb-2 uppercase tracking-wide">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

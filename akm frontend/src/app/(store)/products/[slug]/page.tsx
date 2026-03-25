'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { productsAPI } from '@/lib/api';
import { useCartStore, useAuthStore } from '@/store';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    <div className="container-custom py-8">
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-dark-50">
            <Image src={product.images[selectedImage] || '/placeholder.jpg'} alt={product.name} fill className="object-cover" priority />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">-{discount}%</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-dark-900' : 'border-transparent hover:border-dark-300'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {product.category && (
            <span className="text-sm text-dark-500 uppercase tracking-wider">{product.category.name}</span>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-dark-900">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-dark-900">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-dark-400 line-through">${product.compareAtPrice}</span>
            )}
            {discount > 0 && <span className="badge badge-danger">Save {discount}%</span>}
          </div>

          <p className="text-dark-600 leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div>
              <h3 className="font-semibold text-dark-900 mb-3">Color: <span className="font-normal text-dark-600">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedColor === color ? 'bg-dark-900 text-white border-dark-900' : 'border-dark-200 text-dark-700 hover:border-dark-400'}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div>
              <h3 className="font-semibold text-dark-900 mb-3">Size: <span className="font-normal text-dark-600">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => {
                  const variantStock = product.variants?.find((v: any) => v.color === selectedColor && v.size === size)?.stock || 0;
                  return (
                    <button key={size} onClick={() => setSelectedSize(size)} disabled={variantStock === 0}
                      className={`w-12 h-12 rounded-lg border text-sm font-medium transition-all ${
                        selectedSize === size ? 'bg-dark-900 text-white border-dark-900' :
                        variantStock === 0 ? 'border-dark-100 text-dark-300 cursor-not-allowed line-through' :
                        'border-dark-200 text-dark-700 hover:border-dark-400'
                      }`}>
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
              <>
                <FiCheck className="text-green-600" />
                <span className="text-green-700 text-sm font-medium">{stock > 10 ? 'In Stock' : `Only ${stock} left`}</span>
              </>
            ) : (
              <span className="text-red-600 text-sm font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-dark-200 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-dark-50 transition-colors"><FiMinus /></button>
              <span className="px-4 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-dark-50 transition-colors"><FiPlus /></button>
            </div>
            <button onClick={handleAddToCart} disabled={adding || stock === 0} className="btn-primary flex-1 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed">
              <FiShoppingBag className="mr-2" />
              {adding ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-dark-100">
              {product.tags.map((tag: string) => (
                <span key={tag} className="badge badge-neutral text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-heading mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p: any) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

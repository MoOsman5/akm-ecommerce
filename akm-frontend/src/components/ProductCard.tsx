import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    colors: string[];
    category?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="h-full flex flex-col bg-white/50 dark:bg-dark-900/30 backdrop-blur-sm rounded-[2rem] border border-dark-100/50 dark:border-dark-800/50 overflow-hidden hover:shadow-2xl hover:shadow-dark-900/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-500 ease-out">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-dark-50/50 dark:bg-dark-900/50 m-2 rounded-[1.5rem]">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-accent-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{discount}%
            </span>
          )}

          {/* Quick View Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10">
            <div className="w-full bg-white/90 dark:bg-dark-950/90 backdrop-blur-md text-dark-900 dark:text-white py-3 rounded-full font-bold text-sm text-center shadow-xl hover:bg-dark-900 hover:text-white dark:hover:bg-white dark:hover:text-dark-900 hover:scale-[1.02] transition-all cursor-pointer">
              Quick View
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              {product.category && (
                <p className="text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-[0.2em] mb-2">{product.category.name}</p>
              )}
              <h3 className="font-display font-medium text-lg leading-tight text-dark-900 dark:text-white group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </div>
            {/* Price moved to top right for editorial look */}
            <div className="text-right shrink-0">
              <span className="block font-bold text-lg text-dark-900 dark:text-white">${product.price}</span>
              {product.compareAtPrice && (
                <span className="block text-xs font-medium text-dark-400 dark:text-dark-500 line-through mt-0.5">${product.compareAtPrice}</span>
              )}
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center gap-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-5 h-5 rounded-full border border-dark-200/50 dark:border-dark-700/50 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: color.toLowerCase().replace(/\s/g, '') }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs font-bold text-dark-400 dark:text-dark-500 ml-1">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

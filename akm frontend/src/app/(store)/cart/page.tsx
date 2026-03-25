'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiTag } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useCartStore, useAuthStore } from '@/store';
import { couponsAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CartPage() {
  const { user } = useAuthStore();
  const { items, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');

  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - discount + shipping;

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    try {
      const { data } = await couponsAPI.validate({ code: couponCode, subtotal });
      setDiscount(data.discount);
      setCouponApplied(couponCode.toUpperCase());
      toast.success(`Coupon applied! You save $${data.discount.toFixed(2)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon');
    }
  }

  if (!user) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-2">Please login to view your cart</h2>
        <Link href="/auth/login" className="btn-primary mt-4">Login</Link>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container-custom py-8">
      <Toaster position="top-right" />
      <h1 className="section-heading mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛍️</p>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-dark-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="card p-4 flex gap-4">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 bg-dark-50">
                  <Image src={item.product?.images?.[0] || '/placeholder.jpg'} alt={item.product?.name || ''} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product?.slug}`} className="font-semibold text-dark-900 hover:text-primary-600 transition-colors line-clamp-1">
                    {item.product?.name}
                  </Link>
                  <p className="text-sm text-dark-500 mt-1">{item.color} / {item.size}</p>
                  <p className="font-bold text-dark-900 mt-1">${item.product?.price}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-dark-200 rounded-lg">
                      <button onClick={() => updateItem(item._id, Math.max(1, item.quantity - 1))} className="p-2 hover:bg-dark-50"><FiMinus size={14} /></button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)} className="p-2 hover:bg-dark-50"><FiPlus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-red-500 hover:text-red-700 p-2 transition-colors">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-32">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({couponApplied})</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-dark-500">Shipping</span><span className="font-medium">{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
                <hr className="border-dark-100" />
                <div className="flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold">${total.toFixed(2)}</span></div>
              </div>

              {/* Coupon */}
              <div className="mt-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input type="text" placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="input-field text-sm py-2.5 pl-9" />
                  </div>
                  <button onClick={applyCoupon} className="btn-secondary text-sm py-2.5 px-4">Apply</button>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full mt-6 text-lg py-4">
                Checkout <FiArrowRight className="ml-2" />
              </Link>

              {subtotal < 500 && (
                <p className="text-center text-xs text-dark-500 mt-3">
                  Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

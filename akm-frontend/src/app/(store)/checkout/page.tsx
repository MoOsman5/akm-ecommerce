'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useCartStore, useAuthStore } from '@/store';
import { ordersAPI, usersAPI } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);

  const [form, setForm] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zipCode: '',
  });

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    usersAPI.getAddresses().then((res) => {
      setAddresses(res.data);
      const defaultAddr = res.data.find((a: any) => a.isDefault);
      if (defaultAddr) {
        setForm({ fullName: defaultAddr.fullName, phone: defaultAddr.phone, street: defaultAddr.street, city: defaultAddr.city, state: defaultAddr.state, zipCode: defaultAddr.zipCode });
      }
    }).catch(() => {});
  }, [user, router]);

  const subtotal = getTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  async function handlePlaceOrder() {
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.state || !form.zipCode) {
      toast.error('Please fill all shipping details');
      return;
    }
    if (items.length === 0) { toast.error('Cart is empty'); return; }

    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { data } = await ordersAPI.create({
        items: orderItems,
        shippingAddress: form,
      });

      setOrderPlaced(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  }

  if (orderPlaced) {
    return (
      <div className="container-custom py-20 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck className="text-green-600" size={40} />
        </div>
        <h1 className="text-3xl font-display font-bold mb-3">Order Confirmed!</h1>
        <p className="text-dark-500 mb-2">Thank you for your purchase, {user?.firstName}!</p>
        <p className="text-dark-500 mb-6">Your order number is <strong className="text-dark-900">{orderPlaced.orderNumber}</strong></p>
        <p className="text-dark-400 text-sm mb-8">A confirmation email has been sent to {user?.email}.</p>
        <div className="flex flex-col gap-3">
          <Link href="/account/orders" className="btn-primary">View My Orders</Link>
          <Link href="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <Link href="/cart" className="flex items-center text-dark-500 hover:text-dark-900 mb-6 transition-colors">
        <FiArrowLeft className="mr-2" /> Back to Cart
      </Link>
      <h1 className="section-heading mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-6">Shipping Address</h2>

            {addresses.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-dark-500 mb-3">Select a saved address:</p>
                <div className="grid gap-3">
                  {addresses.map((addr: any) => (
                    <button key={addr._id} onClick={() => setForm({ fullName: addr.fullName, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, zipCode: addr.zipCode })}
                      className="text-left p-3 border border-dark-200 rounded-lg hover:border-dark-400 transition-colors text-sm">
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-dark-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-dark-500 mt-4 mb-3">Or enter a new address:</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-1">Full Name</label>
                <input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className="input-field" placeholder="John Doe" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+1 234 567 890" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-700 mb-1">Street Address</label>
                <input value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className="input-field" placeholder="123 Main St" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">City</label>
                <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="input-field" placeholder="New York" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">State</label>
                <input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className="input-field" placeholder="NY" />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">ZIP Code</label>
                <input value={form.zipCode} onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))} className="input-field" placeholder="10001" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-dark-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Payment Method</h3>
              <div className="flex items-center space-x-3 p-3 border border-dark-900 rounded-lg bg-white">
                <div className="w-5 h-5 rounded-full bg-dark-900 flex items-center justify-center"><FiCheck className="text-white" size={12} /></div>
                <span className="font-medium">Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-32">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{item.product?.name}</p>
                    <p className="text-dark-400 text-xs">{item.color} / {item.size} × {item.quantity}</p>
                  </div>
                  <span className="font-medium ml-4">${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="border-dark-100 my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-dark-500">Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping}`}</span></div>
              <hr className="border-dark-100" />
              <div className="flex justify-between text-lg"><span className="font-bold">Total</span><span className="font-bold">${total.toFixed(2)}</span></div>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing || items.length === 0} className="btn-primary w-full mt-6 text-lg py-4 disabled:opacity-50">
              {placing ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

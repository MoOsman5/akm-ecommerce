'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiChevronRight, FiSend, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success('Subscribed to newsletter!');
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-black text-white border-t border-dark-900/60">
      {/* Newsletter Section */}
      <div className="border-b border-dark-900/50">
        <div className="container-custom py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight">Stay In The Loop</h3>
              <p className="text-dark-400 text-sm font-light max-w-md">Subscribe to receive first access to new collections, exclusive drops, and editorial releases.</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-80">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-dark-900/40 border border-dark-800 rounded-2xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all text-sm font-bold shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="bg-white text-dark-900 hover:bg-neutral-100 disabled:bg-accent-500 disabled:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-black/10"
              >
                {subscribed ? (
                  <>
                    <FiCheck size={14} className="animate-bounce" /> Subscribed
                  </>
                ) : (
                  <>
                    Subscribe <FiSend size={12} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="w-fit transition-transform duration-300 hover:scale-105">
              <img 
                src="/logo-dark.png" 
                alt="AKM Logo" 
                className="w-36 md:w-44 h-auto object-contain opacity-90"
              />
            </div>
            <p className="text-dark-400 text-sm leading-relaxed font-light">
              Premium streetwear and high-fashion garments. Designed for the bold, styled for comfort, and crafted with uncompromising quality.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-11 h-11 rounded-xl bg-dark-900 border border-dark-850 flex items-center justify-center text-dark-300 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-90">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-dark-900 border border-dark-850 flex items-center justify-center text-dark-300 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-90">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-11 h-11 rounded-xl bg-dark-900 border border-dark-850 flex items-center justify-center text-dark-300 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-90">
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500 mb-6 block">Quick Links</h4>
            <ul className="space-y-3.5">
              {['Shop All', 'Featured', 'New Arrivals', 'Best Sellers'].map((item, idx) => {
                const paths = ['/products', '/products?featured=true', '/products?sort=newest', '/products?sort=popular'];
                return (
                  <li key={idx}>
                    <Link href={paths[idx]} className="group flex items-center text-sm text-dark-400 hover:text-white transition-all duration-300">
                      <FiChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-accent-400 transition-all duration-300 mr-1.5 shrink-0" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500 mb-6 block">Customer Service</h4>
            <ul className="space-y-3.5">
              {['My Account', 'Track Order', 'Shipping Policy', 'Returns & Exchanges', 'Size Guide'].map((item, idx) => {
                const paths = ['/account', '/account/orders', '#', '#', '#'];
                return (
                  <li key={idx}>
                    <Link href={paths[idx]} className="group flex items-center text-sm text-dark-400 hover:text-white transition-all duration-300">
                      <FiChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 text-accent-400 transition-all duration-300 mr-1.5 shrink-0" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-accent-500 mb-6 block">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-dark-400 hover:text-white transition-colors group cursor-pointer">
                <FiMapPin size={16} className="text-accent-500 shrink-0 mt-0.5" />
                <span>123 Fashion Ave, New York, NY</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-dark-400 hover:text-white transition-colors group cursor-pointer">
                <FiPhone size={16} className="text-accent-500 shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-dark-400 hover:text-white transition-colors group cursor-pointer">
                <FiMail size={16} className="text-accent-500 shrink-0" />
                <span>hello@akm.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-900/60 py-8 bg-dark-950/20">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-dark-500">
          <p>© 2026 AKM Apparel. All rights reserved.</p>
          
          {/* Middle terms links */}
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center space-x-3 opacity-40 hover:opacity-85 transition-opacity duration-300">
            <div className="px-2.5 py-1 bg-dark-900 border border-dark-850 rounded-md text-[8px] font-black tracking-widest uppercase text-white shadow-sm">
              Visa
            </div>
            <div className="px-2.5 py-1 bg-dark-900 border border-dark-850 rounded-md text-[8px] font-black tracking-widest uppercase text-white shadow-sm">
              MCard
            </div>
            <div className="px-2.5 py-1 bg-dark-900 border border-dark-850 rounded-md text-[8px] font-black tracking-widest uppercase text-white shadow-sm">
              ApplePay
            </div>
            <div className="px-2.5 py-1 bg-dark-900 border border-dark-850 rounded-md text-[8px] font-black tracking-widest uppercase text-white shadow-sm">
              PayPal
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

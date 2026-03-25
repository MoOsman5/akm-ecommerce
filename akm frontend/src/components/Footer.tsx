import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      {/* Newsletter */}
      <div className="border-b border-dark-700">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl font-bold">Stay In The Loop</h3>
              <p className="text-dark-400 mt-1">Subscribe for exclusive drops and offers.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-l-lg text-white placeholder-dark-500 focus:outline-none focus:border-white flex-1 md:w-72"
              />
              <button className="bg-white text-dark-900 px-6 py-3 rounded-r-lg font-semibold hover:bg-dark-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-6 mt-2 -ml-2 md:-ml-4">
              {/* Using the dark logo variant suitable for dark backgrounds */}
              <img 
                src="/logo-dark.png" 
                alt="AKM Logo" 
                className="w-32 md:w-48 h-auto object-contain opacity-90"
              />
            </div>
            <p className="text-dark-400 leading-relaxed">
              Premium streetwear clothing brand. Where style meets comfort. Designed for the bold, worn by the confident.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-white hover:text-dark-900 transition-all">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-white hover:text-dark-900 transition-all">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-white hover:text-dark-900 transition-all">
                <FiFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-dark-400 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/products?featured=true" className="text-dark-400 hover:text-white transition-colors">Featured</Link></li>
              <li><Link href="/products?sort=newest" className="text-dark-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?sort=popular" className="text-dark-400 hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link href="/account" className="text-dark-400 hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="text-dark-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="#" className="text-dark-400 hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-dark-400 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="#" className="text-dark-400 hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-dark-400">
                <FiMapPin size={16} /> <span>123 Fashion Ave, New York, NY</span>
              </li>
              <li className="flex items-center space-x-3 text-dark-400">
                <FiPhone size={16} /> <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center space-x-3 text-dark-400">
                <FiMail size={16} /> <span>hello@akm.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-700">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between text-sm text-dark-500">
          <p>© 2026 AKM. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

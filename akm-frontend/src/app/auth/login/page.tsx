'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      window.location.href = '/';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Toaster position="top-right" />

      {/* Floating Return Home Trigger */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 dark:bg-black/60 hover:bg-black border border-white/10 text-white/70 hover:text-white backdrop-blur-md transition-all text-xs font-black uppercase tracking-widest shadow-lg"
      >
        <FiArrowLeft size={14} /> Back Home
      </Link>

      {/* Left Column: Asymmetric Mood Board Visual (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 select-none overflow-hidden border-r border-white/5">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
          alt="AKM Luxury Streetwear"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-75 grayscale hover:grayscale-0 transition-all duration-1000 scale-102"
        />
        {/* Cinematic Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Technical Brand Overlay Prints */}
        <div className="absolute top-8 right-8 text-[9px] font-mono text-white/30 tracking-[0.25em] uppercase">
          [ ARCHIVE SYSTEM v2.06 ]
        </div>

        <div className="absolute bottom-16 left-16 space-y-4 max-w-md text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block bg-accent-500 text-black text-[9px] font-black uppercase tracking-[0.3em] px-3.5 py-1.5 rounded-full"
          >
            MEMBER EXCLUSIVE
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-white font-display font-black text-4xl leading-tight tracking-tight uppercase"
          >
            RAW SILHOUETTES.<br />
            UNCOMPROMISED CUTS.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-dark-300 text-xs font-light tracking-wide leading-relaxed"
          >
            Sign in to unlock early product drops, priority shopping access, custom fitment configurations, and archived capsule orders.
          </motion.p>
        </div>
      </div>

      {/* Right Column: Sleek Auth Form Terminal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-950/70 via-black to-black">
        {/* Aesthetic Background Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Brand Logo */}
          <div className="mb-6 flex justify-center">
            <Link href="/">
              <img 
                src="/logo-dark.png" 
                alt="AKM Logo" 
                className="h-10 w-auto object-contain" 
                onError={(e) => e.currentTarget.style.display='none'} 
              />
            </Link>
          </div>

          {/* Header Typography */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-white font-display font-black text-3xl uppercase tracking-tight">
              SIGN IN
            </h1>
            <p className="text-dark-400 text-xs font-medium tracking-wide">
              Access the AKM Streetwear portal and archives.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-dark-950/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.25rem] shadow-2xl relative overflow-hidden group">
            {/* Subtle decorative edge line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-dark-400">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 group-focus-within:text-accent-500 transition-colors" size={15} />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 bg-dark-900/50 border border-white/5 rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-bold text-xs" 
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-dark-400">
                    Password
                  </label>
                  <Link href="/auth/forgot" className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-500 hover:text-white transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 transition-colors" size={15} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-11 pr-11 py-3.5 bg-dark-900/50 border border-white/5 rounded-2xl text-white placeholder-dark-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/20 transition-all font-bold text-xs" 
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 bg-white text-black hover:bg-accent-500 hover:text-black font-black uppercase text-xs tracking-[0.25em] rounded-2xl transition-all duration-350 shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? 'Entering Portal...' : 'ENTER PORTAL'} <FiArrowRight size={14} />
              </button>
            </form>

            {/* Account Redirect */}
            <p className="text-center text-xs text-dark-500 mt-6">
              New to the Archives?{' '}
              <Link href="/auth/register" className="text-accent-500 font-black uppercase tracking-wider hover:text-white transition-colors">
                CREATE ACCOUNT
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

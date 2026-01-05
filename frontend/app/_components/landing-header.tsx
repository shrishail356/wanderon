'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Wallet, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function LandingHeader() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#security', label: 'Security' },
    { href: '#tech-stack', label: 'Tech Stack' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 w-full transition-all duration-700 ease-in-out',
        isScrolled ? 'px-4 py-4' : ''
      )}
    >
      <div
        className={cn(
          'transition-all duration-700 ease-in-out',
          isScrolled
            ? 'bg-dark-gray-4/80 mx-auto max-w-3xl rounded-full border border-white/10 shadow-2xl shadow-blue-500/10 backdrop-blur-xl'
            : 'w-full bg-dark-gray-4/50 backdrop-blur-sm border-b border-white/10'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between transition-all duration-700 ease-in-out',
            isScrolled ? 'h-11 max-w-none px-5' : 'h-16 px-4 md:max-w-7xl'
          )}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='flex items-center gap-2'
          >
            <Link
              href='/'
              className='flex items-center gap-2'
            >
              <motion.div
                className={cn(
                  'flex items-center justify-center rounded-xl bg-linear-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 transition-all duration-500',
                  isScrolled ? 'h-6 w-6' : 'h-10 w-10'
                )}
              >
                <Wallet
                  className={cn(
                    'text-very-light-gray transition-all duration-500',
                    isScrolled ? 'h-4 w-4' : 'h-6 w-6'
                  )}
                />
              </motion.div>
              <motion.span
                className={cn(
                  'bg-linear-to-r from-very-light-gray to-light-gray-3 bg-clip-text font-bold text-transparent transition-all duration-500',
                  isScrolled ? 'text-sm' : 'text-xl'
                )}
              >
                ExpenseTracker
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className='absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:block'>
            <ul
              className={cn(
                'flex items-center justify-center transition-all duration-500 ease-in-out',
                isScrolled ? 'gap-4' : 'gap-8'
              )}
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-light-gray-2 text-sm transition-colors duration-300 hover:text-very-light-gray'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  'flex items-center justify-center rounded-full border border-white/10 bg-dark-gray-3 transition-all duration-500 hover:bg-dark-gray-2',
                  isScrolled ? 'h-8 w-8' : 'h-10 w-10'
                )}
              >
                {theme === 'dark' ? (
                  <Sun
                    className={cn(
                      'text-very-light-gray transition-all duration-500',
                      isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                    )}
                  />
                ) : (
                  <Moon
                    className={cn(
                      'text-very-light-gray transition-all duration-500',
                      isScrolled ? 'h-4 w-4' : 'h-5 w-5'
                    )}
                  />
                )}
              </motion.button>
            )}

            {/* Get Started Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/login')}
              className={cn(
                'hidden rounded-full bg-linear-to-r from-blue-500 to-purple-500 font-semibold text-white transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/30 md:flex',
                isScrolled ? 'px-3 py-1.5 text-xs' : 'px-6 py-2.5 text-sm'
              )}
            >
              Get Started
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'inline-flex items-center justify-center rounded-full border border-white/10 bg-dark-gray-3 text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-dark-gray-2 md:hidden',
                isScrolled ? 'h-8 w-8 p-1' : 'h-9 w-9 p-1.5'
              )}
              aria-label='Toggle mobile menu'
            >
              {isMobileMenuOpen ? (
                <X className='h-4 w-4 text-very-light-gray' />
              ) : (
                <Menu className='h-4 w-4 text-very-light-gray' />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 top-0 z-40 bg-black/50 backdrop-blur-sm md:hidden'
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-dark-gray-4/95 absolute top-16 right-4 left-4 z-50 rounded-2xl border border-white/10 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl md:hidden'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='font-semibold text-very-light-gray'>Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-dark-gray-3 text-foreground backdrop-blur-lg transition-all duration-300 hover:bg-dark-gray-2'
                >
                  <X className='h-4 w-4 text-very-light-gray' />
                </button>
              </div>
              <nav className='flex flex-col space-y-2'>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='flex items-center rounded-lg px-4 py-3 text-very-light-gray transition-colors duration-300 hover:bg-dark-gray-3'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className='border-t border-white/10 pt-4'>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-sm text-light-gray-2'>Theme</span>
                    {mounted && (
                      <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className='flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-dark-gray-3'
                      >
                        {theme === 'dark' ? (
                          <Sun className='h-4 w-4 text-very-light-gray' />
                        ) : (
                          <Moon className='h-4 w-4 text-very-light-gray' />
                        )}
                      </button>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className='inline-flex w-full items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-4 py-3 font-semibold text-white transition-colors duration-300 hover:shadow-lg'
                  >
                    Get Started
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

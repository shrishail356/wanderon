'use client';

import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Wallet, ArrowRight } from 'lucide-react';

export default function LandingFooter() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <footer
      ref={ref}
      className='relative overflow-hidden border-t border-white/10 bg-dark-gray-4 py-12'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='grid grid-cols-1 gap-8 md:grid-cols-3'
        >
          {/* Brand */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='mb-4 flex items-center gap-2'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20'>
                <Wallet
                  size={24}
                  className='text-very-light-gray'
                />
              </div>
              <span className='bg-linear-to-r from-very-light-gray to-light-gray-3 bg-clip-text text-xl font-bold text-transparent'>
                ExpenseTracker
              </span>
            </motion.div>
            <p className='text-sm text-light-gray-2'>
              Secure expense tracking with enterprise-grade security. Built for modern financial
              management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='mb-4 font-semibold text-very-light-gray'>Quick Links</h3>
            <ul className='space-y-2'>
              {[
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#security', label: 'Security' },
                { href: '#tech-stack', label: 'Tech Stack' },
              ].map((link) => (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className='text-sm text-light-gray-2 transition-colors hover:text-very-light-gray'
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className='mb-4 font-semibold text-very-light-gray'>Get Started</h3>
            <p className='mb-4 text-sm text-light-gray-2'>
              Start tracking your expenses securely today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/register')}
              className='group relative flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30'
            >
              <motion.div
                className='absolute inset-0 bg-white/20'
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className='relative z-10 flex items-center gap-2'>
                Get Started
                <ArrowRight
                  size={18}
                  className='transition-transform group-hover:translate-x-1'
                />
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='mt-8 border-t border-white/10 pt-8 text-center text-sm text-light-gray-2'
        >
          <p>© 2026 ExpenseTracker. Built with security and privacy in mind.</p>
        </motion.div>
      </div>
    </footer>
  );
}

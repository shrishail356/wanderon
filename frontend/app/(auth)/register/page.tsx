'use client';

import { motion } from 'motion/react';
import { Wallet, Sparkles } from 'lucide-react';
import RegisterForm from './_components/register-form';

export default function RegisterPage() {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-darkest-gray via-dark-gray-1 to-darkest-gray p-4'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl' />
        <div className='absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl' />
        <div className='absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-pink-500/5 to-purple-500/5 blur-3xl' />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className='relative z-10 w-full max-w-md'
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-dark-gray-4/90 via-dark-gray-4/95 to-dark-gray-4/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10'
        >
          {/* Decorative gradient border */}
          <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100' />
          <div className='absolute inset-[1px] rounded-2xl bg-dark-gray-4' />

          {/* Content wrapper */}
          <div className='relative z-10'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='mb-8 flex flex-col items-center gap-4'
            >
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                className='relative'
              >
                <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 blur-xl' />
                <div className='relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 shadow-lg backdrop-blur-sm'>
                  <Wallet
                    size={36}
                    className='text-very-light-gray drop-shadow-lg'
                  />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className='absolute -right-2 -top-2'
                >
                  <Sparkles
                    size={16}
                    className='text-yellow-400'
                  />
                </motion.div>
              </motion.div>

              <div className='text-center'>
                <h1 className='bg-gradient-to-r from-very-light-gray via-light-gray-3 to-very-light-gray bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
                  Create Account
                </h1>
                <p className='mt-2 text-light-gray-2 text-sm sm:text-base'>
                  Start your journey to better expense management
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <RegisterForm />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='mt-6 text-center text-xs text-light-gray-1'
        >
          Secure authentication powered by enterprise-grade security
        </motion.p>
      </motion.div>
    </div>
  );
}

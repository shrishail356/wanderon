'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserPlus, LogIn, Wallet, BarChart3 } from 'lucide-react';
import PixelCard from '@/components/animations/PixelCard';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up with your email and a strong password. We use enterprise-grade security to protect your data.',
    color: 'from-blue-500 to-cyan-500',
    variant: 'blue' as const,
  },
  {
    icon: LogIn,
    title: 'Secure Login',
    description: 'Log in with your credentials. Your session is protected with HTTP-only cookies and JWT tokens.',
    color: 'from-purple-500 to-pink-500',
    variant: 'pink' as const,
  },
  {
    icon: Wallet,
    title: 'Track Expenses',
    description: 'Add your income and expenses with categories, dates, and descriptions. View them in multiple formats.',
    color: 'from-green-500 to-emerald-500',
    variant: 'default' as const,
  },
  {
    icon: BarChart3,
    title: 'Analyze & Insights',
    description: 'Get real-time statistics, category breakdowns, and insights to better manage your finances.',
    color: 'from-orange-500 to-red-500',
    variant: 'yellow' as const,
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id='how-it-works'
      ref={ref}
      className='relative overflow-hidden bg-dark-gray-1 py-20 sm:py-32'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='mb-16 text-center'
        >
          <h2 className='mb-4 bg-linear-to-r from-very-light-gray to-light-gray-3 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl'>
            How It Works
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-light-gray-2'>
            Get started in minutes with our simple, secure expense tracking system
          </p>
        </motion.div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className='group relative flex justify-center'
            >
              <PixelCard
                variant={step.variant}
                className='mx-auto h-[350px] w-full max-w-sm border-border'
              >
                <div className='absolute inset-0 flex flex-col justify-center p-6 text-center'>
                  <motion.div
                    className={`mb-6 flex items-center justify-center gap-4`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r ${step.color} shadow-lg`}>
                      <step.icon
                        size={24}
                        className='text-white'
                      />
                    </div>
                    <span className='text-4xl font-bold text-white/20'>0{idx + 1}</span>
                  </motion.div>

                  <h3 className='mb-3 text-xl font-semibold text-very-light-gray md:text-2xl lg:text-3xl'>
                    {step.title}
                  </h3>
                  <p className='text-sm leading-relaxed font-medium text-light-gray-2 md:text-base'>
                    {step.description}
                  </p>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

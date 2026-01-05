'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Key, FileCheck } from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: 'Password Hashing',
    description: 'Bcrypt with 12 salt rounds ensures your password is never stored in plain text.',
  },
  {
    icon: Lock,
    title: 'HTTP-Only Cookies',
    description: 'JWT tokens stored in secure, HTTP-only cookies prevent XSS attacks.',
  },
  {
    icon: Eye,
    title: 'XSS Protection',
    description: 'Input sanitization using xss library prevents cross-site scripting attacks.',
  },
  {
    icon: AlertTriangle,
    title: 'Injection Prevention',
    description: 'mongo-sanitize protects against NoSQL injection attacks.',
  },
  {
    icon: Key,
    title: 'Account Lockout',
    description: 'Automatic account lockout after 5 failed login attempts for 30 minutes.',
  },
  {
    icon: FileCheck,
    title: 'Rate Limiting',
    description: 'API rate limiting prevents brute force attacks and abuse.',
  },
];

export default function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id='security'
      ref={ref}
      className='relative overflow-hidden bg-linear-to-br from-darkest-gray via-dark-gray-1 to-darkest-gray py-20 sm:py-32'
    >
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-br from-green-500/5 to-emerald-500/5 blur-3xl' />
      </div>

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className='mb-16 text-center'
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className='mb-4 flex justify-center'
          >
            <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-500/20 to-emerald-500/20'>
              <Shield
                size={32}
                className='text-green-400'
              />
            </div>
          </motion.div>
          <h2 className='mb-4 bg-linear-to-r from-very-light-gray to-light-gray-3 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl'>
            Enterprise-Grade Security
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-light-gray-2'>
            Your data is protected with industry-standard security measures and best practices
          </p>
        </motion.div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {securityFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className='group relative overflow-hidden rounded-xl border border-white/10 bg-dark-gray-4/50 p-6 backdrop-blur-sm transition-all hover:border-green-500/30 hover:bg-dark-gray-4'
            >
              <motion.div
                className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20'
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon
                  size={24}
                  className='text-green-400'
                />
              </motion.div>
              <h3 className='mb-2 text-lg font-semibold text-very-light-gray'>{feature.title}</h3>
              <p className='text-sm text-light-gray-2'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

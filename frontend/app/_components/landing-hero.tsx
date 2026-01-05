'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ArrowRight, Shield, TrendingUp, BarChart3, Sparkles, ChevronRight } from 'lucide-react';
import RotatingText from '@/components/animations/RotatingText';
import ScrambledText from '@/components/animations/ScrambledText';

export default function LandingHero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-darkest-gray via-dark-gray-1 to-darkest-gray px-4'
    >
      {/* Animated Background Elements */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        {/* Grid Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='h-full w-full'
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating Geometric Shapes */}
        <motion.div
          className='absolute top-20 left-10 w-20 h-20 border-2 border-blue-500/20 rounded-lg'
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className='absolute top-40 right-20 w-16 h-16 border-2 border-purple-500/20 rounded-full'
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className='absolute bottom-20 left-1/4 w-24 h-24 border-2 border-pink-500/20'
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Gradient Orbs */}
        <div className='absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-linear-to-br from-blue-500/10 to-purple-500/10 blur-3xl' />
        <div className='absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-linear-to-br from-purple-500/10 to-pink-500/10 blur-3xl' />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className='relative z-10 mx-auto max-w-7xl text-center flex flex-col items-center justify-center'
      >
        {/* Animated Badge */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200 mb-8 justify-center'
        >
          <span>
            <span className='spark mask-gradient animate-flip before:animate-rotate absolute inset-0 h-full w-full overflow-hidden rounded-full [mask:linear-gradient(white,transparent_50%)] before:absolute before:inset-[0_auto_auto_50%] before:aspect-square before:w-[200%] before:[translate:-50%_-15%] before:-rotate-90 before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[""]' />
          </span>
          <span className='backdrop absolute inset-px rounded-full bg-dark-gray-4/80 backdrop-blur-sm transition-colors duration-200 group-hover:bg-dark-gray-4/90' />
          <span className='from-blue-500/40 absolute inset-x-0 bottom-0 h-full w-full bg-linear-to-tr blur-md' />
          <span className='z-10 flex items-center justify-center gap-1.5 py-0.5 text-sm text-very-light-gray'>
            <Sparkles className='h-4 w-4 text-blue-400' />
            <RotatingText
              texts={[
                'Secure Expense Tracking',
                'AI-Powered Analytics',
                'Enterprise Security',
                'Real-time Insights',
                'Smart Financial Management',
                'Privacy-First Design',
              ]}
              mainClassName='font-medium'
              staggerFrom='first'
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              staggerDuration={0.02}
              splitLevelClassName='overflow-hidden'
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              rotationInterval={3000}
            />
            <ChevronRight className='h-4 w-4' />
          </span>
        </motion.button>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mb-6'
        >
          <h1 className='mb-6 bg-linear-to-r from-very-light-gray via-light-gray-3 to-very-light-gray bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-7xl'>
            Secure Expense Tracking
            <br />
            <span className='bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
              Made Simple
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <div className="w-full mb-8 text-center">
          <ScrambledText
            radius={80}
            duration={0.8}
            speed={0.2}
            scrambleChars=".:"
            className="text-light-gray-2 dark:text-light-gray-2 m-0 mx-auto mt-6 max-w-4xl text-center text-base md:text-lg"
            style={{ margin: '1.5rem auto 0', textAlign: 'center' }}
          >
            Track your income and expenses with enterprise-grade security. Built with modern
            technologies and best practices for a seamless, secure experience.
          </ScrambledText>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/register')}
            className='group relative flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30'
          >
            <motion.div
              className='absolute inset-0 bg-white/20'
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className='relative z-10 flex items-center gap-2'>
              Get Started Free
              <ArrowRight
                size={20}
                className='transition-transform group-hover:translate-x-1'
              />
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/login')}
            className='group relative overflow-hidden rounded-xl border border-white/20 bg-dark-gray-4/50 px-8 py-4 font-semibold text-very-light-gray backdrop-blur-sm transition-all hover:bg-dark-gray-4 hover:border-white/30'
          >
            <motion.div
              className='absolute inset-0 bg-blue-500/5'
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className='relative z-10'>Sign In</span>
          </motion.button>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className='mt-16 flex w-full flex-col items-center justify-center gap-6 sm:flex-row sm:justify-center'
        >
          {[
            { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption' },
            { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Track your spending' },
            { icon: BarChart3, title: 'Smart Insights', desc: 'Category breakdowns' },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + idx * 0.1 }}
              whileHover={{ y: -5 }}
              className='w-full rounded-xl border border-white/10 bg-dark-gray-4/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/30 sm:w-auto sm:max-w-xs'
            >
              <feature.icon
                size={32}
                className='mb-4 text-blue-400'
              />
              <h3 className='mb-2 text-lg font-semibold text-very-light-gray'>{feature.title}</h3>
              <p className='text-sm text-light-gray-2'>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Wallet } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    // For now, just redirect to login
    router.push('/login');
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-darkest-gray'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center gap-6 text-center'
      >
        <Wallet
          size={64}
          className='text-very-light-gray'
        />
        <h1 className='text-light-gray-4 text-3xl font-bold'>Expense Tracker</h1>
        <p className='text-light-gray-2'>Redirecting to login...</p>
      </motion.div>
    </div>
  );
}

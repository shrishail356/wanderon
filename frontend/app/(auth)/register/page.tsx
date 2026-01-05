'use client';

import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';
import RegisterForm from './_components/register-form';

export default function RegisterPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-darkest-gray p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-dark-gray-4 border-border-color w-full max-w-md rounded-xl border p-8 sm:p-10'
      >
        <div className='mb-8 flex flex-col items-center gap-4'>
          <div className='bg-dark-gray-3 flex h-16 w-16 items-center justify-center rounded-full'>
            <Wallet
              size={32}
              className='text-very-light-gray'
            />
          </div>
          <h1 className='text-light-gray-4 text-2xl font-bold sm:text-3xl'>Create Account</h1>
          <p className='text-light-gray-2 text-center text-sm sm:text-base'>
            Sign up to start tracking your expenses
          </p>
        </div>

        <RegisterForm />
      </motion.div>
    </div>
  );
}

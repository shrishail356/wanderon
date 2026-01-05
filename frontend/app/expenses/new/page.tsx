'use client';

import { motion } from 'motion/react';
import ExpenseForm from './_components/expense-form';

export default function NewExpensePage() {
  console.log('[NewExpensePage] ✅ Component rendering at /dashboard/expenses/new');
  
  return (
    <div className='mx-auto max-w-3xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-light-gray-4 mb-2 text-3xl font-bold sm:text-4xl'>Add New Expense</h1>
        <p className='text-light-gray-2 mb-8'>Track your income and expenses</p>

        <div className='bg-dark-gray-4 border-border-color rounded-xl border p-6 sm:p-8'>
          <ExpenseForm />
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { use } from 'react';
import { motion } from 'motion/react';
import ExpenseEditForm from './_components/expense-edit-form';

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className='mx-auto max-w-3xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-light-gray-4 mb-2 text-3xl font-bold sm:text-4xl'>Edit Expense</h1>
        <p className='text-light-gray-2 mb-8'>Update your expense details</p>

        <div className='bg-dark-gray-4 border-border-color rounded-xl border p-6 sm:p-8'>
          <ExpenseEditForm id={id} />
        </div>
      </motion.div>
    </div>
  );
}


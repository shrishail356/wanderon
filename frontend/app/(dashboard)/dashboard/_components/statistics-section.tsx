'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

interface Statistics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<string, { income: number; expense: number }>;
}

export default function StatisticsSection() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/expenses/statistics');
        if (response.data.success) {
          setStats(response.data.data?.statistics);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='bg-dark-gray-4 border-border-color flex items-center justify-center rounded-xl border p-12'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-dark-gray-4 border-border-color rounded-xl border p-6'>
        <p className='text-red-400 text-center'>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Ensure all values are numbers with defaults
  const totalIncome = typeof stats.totalIncome === 'number' ? stats.totalIncome : 0;
  const totalExpenses = typeof stats.totalExpenses === 'number' ? stats.totalExpenses : 0;
  const balance = typeof stats.balance === 'number' ? stats.balance : 0;
  const categories = Object.keys(stats.byCategory || {});

  return (
    <div className='space-y-6'>
      <h2 className='text-light-gray-4 text-2xl font-bold'>Statistics</h2>
      
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-green-500/10 border-green-500/50 border-border-color rounded-xl border p-6'
        >
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-light-gray-2 text-sm font-medium'>Total Income</p>
            <TrendingUp
              size={20}
              className='text-green-400'
            />
          </div>
          <p className='text-green-400 text-2xl font-bold sm:text-3xl'>
            ₹{totalIncome.toLocaleString('en-IN')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-red-500/10 border-red-500/50 border-border-color rounded-xl border p-6'
        >
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-light-gray-2 text-sm font-medium'>Total Expenses</p>
            <TrendingDown
              size={20}
              className='text-red-400'
            />
          </div>
          <p className='text-red-400 text-2xl font-bold sm:text-3xl'>
            ₹{totalExpenses.toLocaleString('en-IN')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-blue-500/10 border-blue-500/50 border-border-color rounded-xl border p-6'
        >
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-light-gray-2 text-sm font-medium'>Balance</p>
            <Wallet
              size={20}
              className='text-blue-400'
            />
          </div>
          <p className={`text-2xl font-bold sm:text-3xl ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            ₹{balance.toLocaleString('en-IN')}
          </p>
        </motion.div>
      </div>

      {categories.length > 0 && (
        <div className='bg-dark-gray-4 border-border-color rounded-xl border p-6'>
          <h3 className='text-light-gray-4 mb-4 text-lg font-semibold'>By Category</h3>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {categories.map((category) => {
              const categoryData = stats.byCategory[category];
              if (!categoryData) return null;
              
              const income = typeof categoryData.income === 'number' ? categoryData.income : 0;
              const expense = typeof categoryData.expense === 'number' ? categoryData.expense : 0;
              
              return (
                <div
                  key={category}
                  className='bg-dark-gray-3 border-border-color rounded-lg border p-4'
                >
                  <h4 className='text-light-gray-4 mb-2 font-semibold capitalize'>{category}</h4>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-light-gray-2'>Income:</span>
                      <span className='text-green-400 font-medium'>₹{income.toLocaleString('en-IN')}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-light-gray-2'>Expense:</span>
                      <span className='text-red-400 font-medium'>₹{expense.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


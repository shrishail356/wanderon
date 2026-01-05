'use client';

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Statistics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Statistics>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    byCategory: {},
    byType: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/expenses/statistics');
      if (response.data.success) {
        const statistics = response.data.data?.statistics;
        if (statistics) {
          setStats(statistics);
        }
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Listen for expense updates to refresh statistics
  useEffect(() => {
    const handleExpenseUpdate = () => {
      fetchStatistics();
    };

    window.addEventListener('expenseUpdated', handleExpenseUpdate);
    return () => {
      window.removeEventListener('expenseUpdated', handleExpenseUpdate);
    };
  }, []);

  const cards = [
    {
      title: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 via-green-500/10 to-transparent',
      borderColor: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      trend: stats.totalIncome > 0 ? 'Active' : 'No Income',
      trendColor: 'text-green-400',
      trendIcon: ArrowUpRight,
    },
    {
      title: 'Total Expenses',
      value: stats.totalExpense,
      icon: TrendingDown,
      color: 'text-red-400',
      bgGradient: 'from-red-500/20 via-red-500/10 to-transparent',
      borderColor: 'border-red-500/30',
      iconBg: 'bg-red-500/20',
      trend: stats.totalExpense > 0 ? 'Active' : 'No Expenses',
      trendColor: 'text-red-400',
      trendIcon: ArrowDownRight,
    },
    {
      title: 'Balance',
      value: stats.balance,
      icon: Wallet,
      color: stats.balance >= 0 ? 'text-blue-400' : 'text-orange-400',
      bgGradient: stats.balance >= 0 
        ? 'from-blue-500/20 via-blue-500/10 to-transparent'
        : 'from-orange-500/20 via-orange-500/10 to-transparent',
      borderColor: stats.balance >= 0 ? 'border-blue-500/30' : 'border-orange-500/30',
      iconBg: stats.balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20',
      trend: stats.balance >= 0 ? 'Positive' : 'Negative',
      trendColor: stats.balance >= 0 ? 'text-blue-400' : 'text-orange-400',
      trendIcon: stats.balance >= 0 ? ArrowUpRight : ArrowDownRight,
    },
  ];

  if (loading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='bg-dark-gray-4 border-border-color flex items-center justify-center rounded-xl border p-6'
          >
            <Loader2
              size={32}
              className='animate-spin text-very-light-gray'
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.bgGradient} ${card.borderColor} border-border-color group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            {/* Background Pattern */}
            <div className='absolute right-0 top-0 opacity-10'>
              <Icon
                size={120}
                className={card.color}
              />
            </div>

            <div className='relative z-10'>
              {/* Header */}
              <div className='mb-4 flex items-start justify-between'>
                <div className={`${card.iconBg} ${card.color} rounded-lg p-3`}>
                  <Icon
                    size={24}
                    className={card.color}
                  />
                </div>
                <div className='flex items-center gap-1'>
                  <TrendIcon
                    size={16}
                    className={card.trendColor}
                  />
                  <span className={`${card.trendColor} text-xs font-medium`}>{card.trend}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <p className='text-light-gray-2 mb-2 text-sm font-medium'>{card.title}</p>
                <p className={`${card.color} text-3xl font-bold sm:text-4xl`}>
                  ₹{card.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

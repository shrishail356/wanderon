'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const categories = ['food', 'transport', 'entertainment', 'bills', 'shopping', 'health', 'education', 'other'];

export default function ExpenseForm() {
  const router = useRouter();
  const { addExpense } = useExpenseStore();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'food',
    type: 'expense' as 'income' | 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/expenses', {
        ...formData,
        amount: parseFloat(formData.amount),
      });

      if (response.data.success) {
        // Backend returns { success: true, data: { expense: ... } }
        const expense = response.data.data?.expense;
        if (expense) {
          addExpense(expense);
          router.push('/dashboard');
        } else {
          setError('Expense data not received');
        }
      } else {
        setError(response.data.error || 'Failed to create expense');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {error && (
        <div className='bg-red-500/10 border-red-500/50 text-red-400 rounded-lg border p-3 text-sm'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Title *</label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className='input-box'
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Amount *</label>
          <input
            type='number'
            step='0.01'
            min='0'
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className='input-box'
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
            className='input-box'
            required
            disabled={loading}
          >
            <option value='expense'>Expense</option>
            <option value='income'>Income</option>
          </select>
        </div>

        <div>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className='input-box'
            required
            disabled={loading}
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className='sm:col-span-2'>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Date *</label>
          <input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className='input-box'
            required
            disabled={loading}
          />
        </div>

        <div className='sm:col-span-2'>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className='input-box resize-none'
            disabled={loading}
          />
        </div>
      </div>

      <div className='flex gap-4'>
        <Button
          type='submit'
          title={loading ? 'Creating...' : 'Create Expense'}
          disabled={loading}
          className='flex-1'
        />
        <Button
          type='button'
          title='Cancel'
          variant='outline'
          onClick={() => router.back()}
          disabled={loading}
          className='flex-1'
        />
      </div>
    </form>
  );
}


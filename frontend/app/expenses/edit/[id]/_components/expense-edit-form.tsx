'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loader from '@/components/ui/Loader';
import { EXPENSE_CATEGORIES, EXPENSE_TYPES } from '@/lib/constants';
import { type Expense } from '@/store/expense-store';

export default function ExpenseEditForm({ id }: { id: string }) {
  const router = useRouter();
  const { updateExpense } = useExpenseStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense' as 'income' | 'expense',
    description: '',
    date: '',
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expenses/${id}`);
        if (response.data.success) {
          // Backend returns { success: true, data: { expense: ... } }
          const expense = response.data.data?.expense;
          if (expense) {
            setFormData({
              title: expense.title,
              amount: expense.amount.toString(),
              category: expense.category,
              type: expense.type,
              description: expense.description || '',
              date: expense.date.split('T')[0],
            });
          } else {
            setError('Expense not found');
          }
        } else {
          setError('Expense not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load expense');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await api.put(`/expenses/${id}`, {
        ...formData,
        amount: parseFloat(formData.amount),
      });

      if (response.data.success) {
        // Backend returns { success: true, data: { expense: ... } }
        const expense = response.data.data?.expense;
        if (expense) {
          updateExpense(id, expense);
          router.push(`/expenses`);
        } else {
          setError('Expense data not received');
        }
      } else {
        setError(response.data.error || 'Failed to update expense');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-12'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-500/10 border-red-500/50 text-red-400 rounded-lg border p-3'>
        {error}
      </div>
    );
  }

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
            disabled={saving}
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
            disabled={saving}
          />
        </div>

        <div>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Type *</label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}
            disabled={saving}
            required
          >
            <SelectTrigger className='w-full h-10 bg-dark-gray-2 border-border-color text-very-light-gray hover:bg-dark-gray-3 focus:ring-2 focus:ring-very-light-gray/20'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent className='bg-dark-gray-4 border-border-color'>
              {EXPENSE_TYPES.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className='text-light-gray-2 focus:text-very-light-gray focus:bg-very-light-gray/10 cursor-pointer'
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Category *</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            disabled={saving}
            required
          >
            <SelectTrigger className='w-full h-10 bg-dark-gray-2 border-border-color text-very-light-gray hover:bg-dark-gray-3 focus:ring-2 focus:ring-very-light-gray/20'>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent className='bg-dark-gray-4 border-border-color'>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  className='text-light-gray-2 focus:text-very-light-gray focus:bg-very-light-gray/10 cursor-pointer'
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='sm:col-span-2'>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Date *</label>
          <input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className='input-box'
            required
            disabled={saving}
          />
        </div>

        <div className='sm:col-span-2'>
          <label className='text-light-gray-2 mb-2 block text-sm font-medium'>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className='input-box resize-none'
            disabled={saving}
          />
        </div>
      </div>

      <div className='flex gap-4'>
        <Button
          type='submit'
          title={saving ? 'Saving...' : 'Save Changes'}
          disabled={saving}
          className='flex-1'
        />
        <Button
          type='button'
          title='Cancel'
          variant='outline'
          onClick={() => router.back()}
          disabled={saving}
          className='flex-1'
        />
      </div>
    </form>
  );
}


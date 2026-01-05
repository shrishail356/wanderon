'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2 } from 'lucide-react';
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
import { EXPENSE_CATEGORIES, EXPENSE_TYPES } from '@/lib/constants';
import Loader from '@/components/ui/Loader';

interface EditExpenseModalProps {
  expenseId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditExpenseModal({ expenseId, onClose, onSuccess }: EditExpenseModalProps) {
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
    if (!expenseId) {
      setLoading(false);
      return;
    }

    const fetchExpense = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/expenses/${expenseId}`);
        if (response.data.success) {
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
  }, [expenseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseId) return;

    setSaving(true);
    setError('');

    try {
      const dateISO = formData.date ? new Date(formData.date).toISOString() : new Date().toISOString();
      
      const payload = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        description: formData.description.trim(),
        date: dateISO,
      };

      const response = await api.put(`/expenses/${expenseId}`, payload);

      if (response.data.success) {
        const expense = response.data.data?.expense;
        if (expense) {
          updateExpense(expenseId, expense);
          onSuccess();
          onClose();
        } else {
          setError('Expense data not received');
        }
      } else {
        setError(response.data.error || 'Failed to update expense');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (!expenseId) return null;

  return (
    <AnimatePresence>
      {expenseId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='bg-black/60 fixed inset-0 z-50 backdrop-blur-sm'
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className='bg-dark-gray-4 border-border-color fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border shadow-2xl'
          >
            {/* Header */}
            <div className='border-border-color flex items-center justify-between border-b bg-dark-gray-4 p-4 backdrop-blur-sm'>
              <div>
                <h2 className='text-light-gray-4 text-xl font-bold'>Edit Expense</h2>
                <p className='text-light-gray-2 mt-0.5 text-xs'>Update expense details</p>
              </div>
              <button
                onClick={onClose}
                className='text-light-gray-2 hover:text-very-light-gray hover:bg-dark-gray-3 rounded-lg p-1.5 transition-all duration-200'
                disabled={saving || loading}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className='p-4'
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-red-500/10 border-red-500/50 text-red-400 mb-4 rounded-lg border p-3 text-xs'
                >
                  {error}
                </motion.div>
              )}

              {loading ? (
                <div className='flex items-center justify-center py-8'>
                  <Loader />
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {/* Title */}
                    <div className='sm:col-span-2'>
                      <label className='text-light-gray-2 mb-1.5 block text-xs font-semibold'>
                        Title <span className='text-red-400'>*</span>
                      </label>
                      <input
                        type='text'
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className='input-box h-10 text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
                        placeholder='e.g., Grocery Shopping'
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* Amount */}
                    <div>
                      <label className='text-light-gray-2 mb-1.5 block text-xs font-semibold'>
                        Amount <span className='text-red-400'>*</span>
                      </label>
                      <div className='relative'>
                        <span className='text-light-gray-2 pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-medium'>₹</span>
                        <input
                          type='number'
                          step='0.01'
                          min='0'
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className='input-box h-10 pl-8 pr-3 text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
                          placeholder='0.00'
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    {/* Type */}
                    <div>
                      <label className='text-light-gray-2 mb-1.5 block text-xs font-semibold'>
                        Type <span className='text-red-400'>*</span>
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}
                        disabled={saving}
                        required
                      >
                        <SelectTrigger className='w-full h-10 bg-dark-gray-2 border-border-color text-sm text-very-light-gray hover:bg-dark-gray-3 focus:ring-2 focus:ring-very-light-gray/20'>
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

                    {/* Category */}
                    <div className='sm:col-span-2'>
                      <label className='text-light-gray-2 mb-1.5 block text-xs font-semibold'>
                        Category <span className='text-red-400'>*</span>
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={saving}
                        required
                      >
                        <SelectTrigger className='w-full h-10 bg-dark-gray-2 border-border-color text-sm text-very-light-gray hover:bg-dark-gray-3 focus:ring-2 focus:ring-very-light-gray/20'>
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

                    {/* Date */}
                    <div className='sm:col-span-2'>
                      <label className='text-light-gray-2 mb-1.5 block text-xs font-semibold'>
                        Date <span className='text-red-400'>*</span>
                      </label>
                      <input
                        type='date'
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className='input-box h-10 text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* Description */}
                    <div className='sm:col-span-2'>
                      <label className='text-light-gray-2 mb-1.5 block text-xs font-semibold'>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        className='input-box resize-none text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
                        placeholder='Add any additional notes...'
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='border-border-color mt-4 flex gap-3 border-t pt-4'>
                    <Button
                      type='button'
                      title='Cancel'
                      variant='outline'
                      onClick={onClose}
                      disabled={saving}
                      className='flex-1 h-10 text-sm'
                    />
                    <Button
                      type='submit'
                      title={saving ? 'Saving...' : 'Save Changes'}
                      disabled={saving}
                      className='flex-1 h-10 bg-very-light-gray text-sm text-darkest-gray hover:bg-light-gray-3'
                      icon={saving ? <Loader2 className='animate-spin' size={16} /> : <Save size={16} />}
                    />
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


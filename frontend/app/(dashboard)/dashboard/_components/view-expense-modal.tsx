'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Edit, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import { type Expense } from '@/store/expense-store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const categoryConfig: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  'Food & Dining': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: '🍔' },
  'Transportation': { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '🚗' },
  'Shopping': { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: '🛍️' },
  'Bills & Utilities': { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '💡' },
  'Entertainment': { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: '🎬' },
  'Healthcare': { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: '🏥' },
  'Education': { color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: '📚' },
  'Travel': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: '✈️' },
  'Income': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: '💰' },
  'Other': { color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/30', icon: '📦' },
};

interface ViewExpenseModalProps {
  expenseId: string | null;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: () => void;
}

export default function ViewExpenseModal({ expenseId, onClose, onEdit, onDelete }: ViewExpenseModalProps) {
  const { expenses } = useExpenseStore();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!expenseId) {
      setExpense(null);
      setLoading(false);
      return;
    }

    // Try to find expense in store first
    const expensesArray = Array.isArray(expenses) ? expenses : [];
    const foundExpense = expensesArray.find((e) => e._id === expenseId);
    
    if (foundExpense) {
      setExpense(foundExpense);
      setLoading(false);
      return;
    }

    // If not in store, fetch from API
    const fetchExpense = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/expenses/${expenseId}`);
        if (response.data.success) {
          const expenseData = response.data.data?.expense;
          if (expenseData) {
            setExpense(expenseData);
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
  }, [expenseId, expenses]);

  const handleDelete = async () => {
    if (!expenseId) return;

    setDeleting(true);
    try {
      await api.delete(`/expenses/${expenseId}`);
      setShowDeleteDialog(false);
      onDelete();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete expense');
    } finally {
      setDeleting(false);
    }
  };

  if (!expenseId) return null;

  const isIncome = expense?.type === 'income';
  const category = expense ? (categoryConfig[expense.category] || categoryConfig['Other']) : null;

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
            className='bg-dark-gray-4 border-border-color fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border shadow-2xl'
          >
            {/* Header */}
            <div className='border-border-color sticky top-0 z-10 flex items-center justify-between border-b bg-dark-gray-4 p-6 backdrop-blur-sm'>
              <div>
                <h2 className='text-light-gray-4 text-2xl font-bold'>Expense Details</h2>
                <p className='text-light-gray-2 mt-1 text-sm'>View expense information</p>
              </div>
              <button
                onClick={onClose}
                className='text-light-gray-2 hover:text-very-light-gray hover:bg-dark-gray-3 rounded-lg p-2 transition-all duration-200'
                disabled={deleting}
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className='p-6 sm:p-8'>
              {loading ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2
                    size={32}
                    className='animate-spin text-very-light-gray'
                  />
                </div>
              ) : error || !expense ? (
                <div className='bg-red-500/10 border-red-500/50 text-red-400 rounded-lg border p-4 text-center'>
                  {error || 'Expense not found'}
                </div>
              ) : (
                <div className='space-y-6'>
                  {/* Amount & Category */}
                  <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='mb-4 flex items-center gap-3'>
                        <div className={`${category?.bg} ${category?.border} flex h-16 w-16 items-center justify-center rounded-xl border text-3xl`}>
                          {category?.icon}
                        </div>
                        <div>
                          <h3 className='text-light-gray-4 mb-1 text-2xl font-bold'>{expense.title}</h3>
                          <span className={`${category?.bg} ${category?.border} ${category?.color} inline-block rounded-md border px-3 py-1 text-sm font-medium`}>
                            {expense.category}
                          </span>
                        </div>
                      </div>
                      <p className={`text-4xl font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                        {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className='border-border-color space-y-4 border-t pt-6'>
                    <div className='flex items-center gap-3 text-light-gray-2'>
                      <Calendar
                        size={20}
                        className='text-light-gray-1'
                      />
                      <span className='text-light-gray-4 font-medium'>{format(new Date(expense.date), 'EEEE, MMMM dd, yyyy')}</span>
                    </div>
                    {expense.description && (
                      <div>
                        <h4 className='text-light-gray-4 mb-2 font-semibold'>Description</h4>
                        <p className='text-light-gray-2 leading-relaxed'>{expense.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='border-border-color flex gap-3 border-t pt-6'>
                    <button
                      onClick={() => {
                        onEdit(expense._id);
                        onClose();
                      }}
                      className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30 flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition-all duration-200'
                    >
                      <Edit
                        size={18}
                        className='text-blue-400'
                      />
                      Edit Expense
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={deleting}
                      className='bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition-all duration-200 disabled:opacity-50'
                    >
                      <Trash2
                        size={18}
                        className='text-red-400'
                      />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className='bg-dark-gray-4 border-border-color text-very-light-gray'>
          <DialogHeader>
            <DialogTitle className='text-light-gray-4'>Delete Expense</DialogTitle>
            <DialogDescription className='text-light-gray-2'>
              Are you sure you want to delete "{expense?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:gap-0'>
            <button
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
              className='bg-dark-gray-2 hover:bg-dark-gray-3 text-light-gray-2 border-border-color rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className='bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2'
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
}


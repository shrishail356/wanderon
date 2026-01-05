'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import { Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { type Expense } from '@/store/expense-store';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';

const categoryColors: Record<string, string> = {
  food: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
  transport: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  entertainment: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
  bills: 'bg-red-500/20 border-red-500/50 text-red-400',
  shopping: 'bg-pink-500/20 border-pink-500/50 text-pink-400',
  health: 'bg-green-500/20 border-green-500/50 text-green-400',
  education: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
  other: 'bg-gray-500/20 border-gray-500/50 text-gray-400',
};

export default function ExpenseDetail({ id }: { id: string }) {
  const router = useRouter();
  const { deleteExpense } = useExpenseStore();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await api.get(`/expenses/${id}`);
        if (response.data.success) {
          // Backend returns { success: true, data: { expense: ... } }
          const expense = response.data.data?.expense;
          if (expense) {
            setExpense(expense);
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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await api.delete(`/expenses/${id}`);
      deleteExpense(id);
      setDeleteDialogOpen(false);
      router.push('/expenses');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete expense');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className='bg-dark-gray-4 border-border-color flex items-center justify-center rounded-xl border p-12'>
        <Loader />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className='bg-dark-gray-4 border-border-color rounded-xl border p-6'>
        <p className='text-red-400 text-center'>{error || 'Expense not found'}</p>
        <Button
          title='Back to Dashboard'
          onClick={() => router.push('/dashboard')}
          className='mt-4'
        />
      </div>
    );
  }

  const isIncome = expense.type === 'income';
  const categoryColor = categoryColors[expense.category] || categoryColors.other;

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => router.back()}
          className='text-light-gray-2 hover:text-very-light-gray transition-colors'
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className='text-light-gray-4 text-2xl font-bold sm:text-3xl'>{expense.title}</h1>
      </div>

      <div className='bg-dark-gray-4 border-border-color rounded-xl border p-6 sm:p-8'>
        <div className='space-y-6'>
          <div className='flex items-start justify-between'>
            <div>
              <span className={`${categoryColor} mb-2 inline-block rounded-md border px-3 py-1 text-sm font-medium`}>
                {expense.category}
              </span>
              <p className={`text-3xl font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => router.push(`/expenses`)}
                className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex items-center gap-2 rounded-lg border border-blue-500/50 px-4 py-2 transition-colors'
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className='bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-2 rounded-lg border border-red-500/50 px-4 py-2 transition-colors disabled:opacity-50'
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>

          <div className='border-border-color border-t pt-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-light-gray-2'>
                <Calendar size={18} />
                <span>{format(new Date(expense.date), 'MMMM dd, yyyy')}</span>
              </div>
              {expense.description && (
                <div>
                  <h3 className='text-light-gray-4 mb-2 font-semibold'>Description</h3>
                  <p className='text-light-gray-2'>{expense.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
      />
    </div>
  );
}


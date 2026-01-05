'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { type Expense } from '@/store/expense-store';
import { Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import DeleteConfirmDialog from '@/components/ui/DeleteConfirmDialog';

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

interface ExpensesGridProps {
  expenses: Expense[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
}

export default function ExpensesGrid({ expenses, onView, onEdit, onDelete }: ExpensesGridProps) {
  const expensesArray = Array.isArray(expenses) ? expenses : [];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteExpense } = useExpenseStore();

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/expenses/${expenseToDelete}`);
      deleteExpense(expenseToDelete);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      alert('Failed to delete expense. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (expensesArray.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-dark-gray-4 border-border-color flex flex-col items-center justify-center rounded-xl border p-16 text-center'
      >
        <div className='mb-4 rounded-full bg-dark-gray-3 p-6'>
          <Calendar
            size={48}
            className='text-light-gray-2'
          />
        </div>
        <p className='text-light-gray-2 mb-2 text-lg font-medium'>No expenses found</p>
        <p className='text-light-gray-1 text-sm'>Try adjusting your filters or add a new expense</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {expensesArray.map((expense, index) => (
          <ExpenseCard
            key={expense._id}
            expense={expense}
            index={index}
            onView={() => onView?.(expense._id)}
            onEdit={() => onEdit?.(expense._id)}
            onDelete={() => handleDeleteClick(expense._id)}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </>
  );
}

function ExpenseCard({
  expense,
  index,
  onView,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  const isIncome = expense.type === 'income';
  const category = categoryConfig[expense.category] || categoryConfig['Other'];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className='bg-dark-gray-3 border-border-color hover:border-very-light-gray/20 group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:bg-dark-gray-4 hover:shadow-lg'
    >
      <div className='flex flex-col gap-4'>
        {/* Header */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <div className={`${category.bg} ${category.border} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl`}>
              {category.icon}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-light-gray-4 mb-1 truncate font-semibold'>{expense.title}</h3>
              <span className={`${category.bg} ${category.border} ${category.color} inline-block rounded-md border px-2 py-0.5 text-xs font-medium`}>
                {expense.category}
              </span>
            </div>
          </div>
          <div className='text-right'>
            <p className={`text-xl font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
              {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Description */}
        {expense.description && (
          <p className='text-light-gray-2 line-clamp-2 text-sm'>{expense.description}</p>
        )}

        {/* Date */}
        <div className='flex items-center gap-2 text-xs text-light-gray-1'>
          <Calendar
            size={14}
            className='text-light-gray-1'
          />
          {format(new Date(expense.date), 'MMM dd, yyyy')}
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 border-t border-border-color pt-3'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className='bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-purple-500/30 px-3 py-2 text-xs font-medium transition-colors'
          >
            <Eye
              size={14}
              className='text-purple-400'
            />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 px-3 py-2 text-xs font-medium transition-colors'
          >
            <Edit
              size={14}
              className='text-blue-400'
            />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className='bg-red-500/10 hover:bg-red-500/20 text-red-400 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium transition-colors'
          >
            <Trash2
              size={14}
              className='text-red-400'
            />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

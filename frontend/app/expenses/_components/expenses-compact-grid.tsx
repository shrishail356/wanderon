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

interface ExpensesCompactGridProps {
  expenses: Expense[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
}

export default function ExpensesCompactGrid({ expenses, onView, onEdit, onDelete }: ExpensesCompactGridProps) {
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
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
        {expensesArray.map((expense, index) => (
          <ExpenseCompactCard
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

function ExpenseCompactCard({
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className='bg-dark-gray-3 border-border-color hover:border-very-light-gray/20 group relative cursor-pointer overflow-hidden rounded-lg border p-3 transition-all duration-200 hover:bg-dark-gray-4 hover:shadow-md'
    >
      <div className='flex flex-col gap-2'>
        {/* Header */}
        <div className='flex items-start justify-between gap-2'>
          <div className={`${category.bg} ${category.border} flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-lg`}>
            {category.icon}
          </div>
          <div className='text-right flex-1 min-w-0'>
            <p className={`text-sm font-bold truncate ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
              {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className='min-h-[40px]'>
          <h3 className='text-light-gray-4 mb-1 line-clamp-2 text-sm font-semibold leading-tight'>{expense.title}</h3>
          <span className={`${category.bg} ${category.border} ${category.color} inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium`}>
            {expense.category}
          </span>
        </div>

        {/* Date */}
        <div className='flex items-center gap-1 text-[10px] text-light-gray-1'>
          <Calendar
            size={10}
            className='text-light-gray-1'
          />
          {format(new Date(expense.date), 'MMM dd')}
        </div>

        {/* Actions */}
        <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 border-t border-border-color pt-2'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className='bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 flex-1 rounded border border-purple-500/30 p-1.5 transition-colors'
            title='View'
          >
            <Eye size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 flex-1 rounded border border-blue-500/30 p-1.5 transition-colors'
            title='Edit'
          >
            <Edit size={12} />
          </button>
          <button
            onClick={handleDelete}
            className='bg-red-500/10 hover:bg-red-500/20 text-red-400 flex-1 rounded border border-red-500/30 p-1.5 transition-colors'
            title='Delete'
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}


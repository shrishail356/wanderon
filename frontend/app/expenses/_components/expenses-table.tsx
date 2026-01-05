'use client';

import { useState } from 'react';
import { type Expense } from '@/store/expense-store';
import { Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface ExpensesTableProps {
  expenses: Expense[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
  currentPage?: number;
  limit?: number;
}

export default function ExpensesTable({ expenses, onView, onEdit, onDelete, currentPage = 1, limit = 20 }: ExpensesTableProps) {
  const expensesArray = Array.isArray(expenses) ? expenses : [];
  const { deleteExpense } = useExpenseStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Calculate starting serial number based on pagination
  const getSerialNumber = (index: number) => {
    return (currentPage - 1) * limit + index + 1;
  };

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
      <div className='bg-dark-gray-4 border-border-color flex flex-col items-center justify-center rounded-xl border p-16 text-center'>
        <div className='mb-4 rounded-full bg-dark-gray-3 p-6'>
          <Calendar
            size={48}
            className='text-light-gray-2'
          />
        </div>
        <p className='text-light-gray-2 mb-2 text-lg font-medium'>No expenses found</p>
        <p className='text-light-gray-1 text-sm'>Try adjusting your filters or add a new expense</p>
      </div>
    );
  }

  return (
    <div className='bg-dark-gray-4 border-border-color rounded-xl border overflow-hidden'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-border-color bg-dark-gray-3 hover:bg-dark-gray-3'>
              <TableHead className='text-light-gray-4 w-[60px] text-center'>SL No</TableHead>
              <TableHead className='text-light-gray-4 w-[50px]'>Icon</TableHead>
              <TableHead className='text-light-gray-4'>Title</TableHead>
              <TableHead className='text-light-gray-4'>Category</TableHead>
              <TableHead className='text-light-gray-4'>Type</TableHead>
              <TableHead className='text-light-gray-4 text-right'>Amount</TableHead>
              <TableHead className='text-light-gray-4'>Date</TableHead>
              <TableHead className='text-light-gray-4 text-right w-[180px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesArray.map((expense, index) => {
              const isIncome = expense.type === 'income';
              const category = categoryConfig[expense.category] || categoryConfig['Other'];

              return (
                <TableRow
                  key={expense._id}
                  className='border-border-color bg-dark-gray-4 hover:bg-dark-gray-3 group transition-colors'
                >
                  <TableCell className='text-center text-light-gray-3 text-sm font-medium'>
                    {getSerialNumber(index)}
                  </TableCell>
                  <TableCell>
                    <div className={`${category.bg} ${category.border} flex h-8 w-8 items-center justify-center rounded-lg border text-lg`}>
                      {category.icon}
                    </div>
                  </TableCell>
                  <TableCell className='text-light-gray-4'>
                    <div className='max-w-[200px]'>
                      <p className='text-light-gray-4 truncate font-medium'>{expense.title}</p>
                      {expense.description && (
                        <p className='text-light-gray-2 truncate text-xs mt-0.5'>{expense.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-light-gray-4'>
                    <span className={`${category.bg} ${category.border} ${category.color} inline-block rounded-md border px-2 py-0.5 text-xs font-medium`}>
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className='text-light-gray-4'>
                    <span className={`${isIncome ? 'text-green-400' : 'text-red-400'} text-xs font-medium capitalize`}>
                      {expense.type}
                    </span>
                  </TableCell>
                  <TableCell className='text-right text-light-gray-4'>
                    <p className={`text-base font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                      {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </TableCell>
                  <TableCell className='text-light-gray-4'>
                    <div className='text-light-gray-2 flex items-center gap-1.5 text-xs'>
                      <Calendar
                        size={12}
                        className='text-light-gray-1'
                      />
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100'>
                      <button
                        onClick={() => onView?.(expense._id)}
                        className='bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 p-1.5 transition-colors'
                        title='View'
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => onEdit?.(expense._id)}
                        className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 p-1.5 transition-colors'
                        title='Edit'
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(expense._id)}
                        className='bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 p-1.5 transition-colors'
                        title='Delete'
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}


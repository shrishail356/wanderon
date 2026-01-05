'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Filter, LayoutGrid, List, Table2 } from 'lucide-react';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';
import ExpensesGrid from './_components/expenses-grid';
import ExpensesCompactGrid from './_components/expenses-compact-grid';
import ExpensesTable from './_components/expenses-table';
import ExpenseFilters from './_components/expense-filters';
import AddExpenseForm from '@/app/(dashboard)/dashboard/_components/add-expense-form';
import ViewExpenseModal from '@/app/(dashboard)/dashboard/_components/view-expense-modal';
import EditExpenseModal from '@/app/(dashboard)/dashboard/_components/edit-expense-modal';
import Pagination from '@/components/ui/Pagination';

type ViewMode = 'large' | 'grid' | 'table';

export default function ExpensesPage() {
  const { expenses, setExpenses, isLoading, setLoading } = useExpenseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [viewExpenseId, setViewExpenseId] = useState<string | null>(null);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('expensesViewMode') as ViewMode) || 'grid';
    }
    return 'grid';
  });
  const [filters, setFilters] = useState<{
    type: 'all' | 'income' | 'expense';
    category: string;
    search: string;
    startDate: string;
    endDate: string;
  }>({
    type: 'all',
    category: 'all',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Cache key for expenses
  const cacheKey = useMemo(() => {
    return `expenses_${filters.type}_${filters.category}_${filters.startDate}_${filters.endDate}_${pagination.page}_${pagination.limit}`;
  }, [filters.type, filters.category, filters.startDate, filters.endDate, pagination.page, pagination.limit]);

  useEffect(() => {
    const fetchExpenses = async () => {
      // Check cache first
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          if (Date.now() - cachedData.timestamp < 30000) { // 30 seconds cache
            setExpenses(cachedData.expenses);
            setPagination(cachedData.pagination);
            setLoading(false);
            return;
          }
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.type !== 'all') params.append('type', filters.type);
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        params.append('limit', pagination.limit.toString());
        params.append('page', pagination.page.toString());

        const response = await api.get(`/expenses?${params.toString()}`);
        if (response.data.success) {
          const data = response.data.data;
          const expensesData = data?.expenses || data || [];
          setExpenses(Array.isArray(expensesData) ? expensesData : []);
          
          // Update pagination info if available
          const paginationData = {
            total: data?.total || 0,
            pages: data?.pages || Math.ceil((data?.total || 0) / pagination.limit),
          };
          
          if (data?.total !== undefined) {
            setPagination(prev => ({
              ...prev,
              ...paginationData,
            }));
          }

          // Cache the result
          sessionStorage.setItem(cacheKey, JSON.stringify({
            expenses: expensesData,
            pagination: { ...pagination, ...paginationData },
            timestamp: Date.now(),
          }));
        }
      } catch (err: any) {
        console.error('Failed to load expenses:', err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [cacheKey, setExpenses, setLoading, pagination.limit]);

  // Save view mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('expensesViewMode', viewMode);
    }
  }, [viewMode]);

  // Listen for show form event from header
  useEffect(() => {
    const handleShowForm = () => {
      setShowAddForm(true);
    };

    window.addEventListener('showAddExpenseForm', handleShowForm);
    return () => {
      window.removeEventListener('showAddExpenseForm', handleShowForm);
    };
  }, []);

  // Filter expenses client-side for search
  const expensesArray = Array.isArray(expenses) ? expenses : [];
  const filteredExpenses = expensesArray.filter((expense) => {
    if (filters.search && !expense.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const refreshExpenses = async () => {
    // Clear cache
    if (typeof window !== 'undefined') {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('expenses_')) {
          sessionStorage.removeItem(key);
        }
      });
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', pagination.limit.toString());
      params.append('page', pagination.page.toString());

      const response = await api.get(`/expenses?${params.toString()}`);
      if (response.data.success) {
        const data = response.data.data;
        const expensesData = data?.expenses || data || [];
        setExpenses(Array.isArray(expensesData) ? expensesData : []);
        
        // Update pagination info if available
        const paginationData = {
          total: data?.total || 0,
          pages: data?.pages || Math.ceil((data?.total || 0) / pagination.limit),
        };
        
        if (data?.total !== undefined) {
          setPagination(prev => ({
            ...prev,
            ...paginationData,
          }));
        }

        // Cache the result
        const newCacheKey = `expenses_${filters.type}_${filters.category}_${filters.startDate}_${filters.endDate}_${pagination.page}_${pagination.limit}`;
        sessionStorage.setItem(newCacheKey, JSON.stringify({
          expenses: expensesData,
          pagination: { ...pagination, ...paginationData },
          timestamp: Date.now(),
        }));
      }
      // Trigger statistics refresh
      window.dispatchEvent(new CustomEvent('expenseUpdated'));
    } catch (err: any) {
      console.error('Failed to load expenses:', err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters.type, filters.category, filters.startDate, filters.endDate]);

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'
      >
        <div>
          <h1 className='text-light-gray-4 mb-1 text-xl font-bold sm:text-2xl'>All Expenses</h1>
          <p className='text-light-gray-2 text-sm'>View and manage all your expenses</p>
        </div>
        <div className='flex gap-2'>
          {/* View Mode Toggle */}
          <div className='bg-dark-gray-4 border-border-color flex items-center rounded-lg border p-1'>
            <button
              onClick={() => setViewMode('large')}
              className={`${
                viewMode === 'large'
                  ? 'bg-dark-gray-3 text-very-light-gray'
                  : 'text-light-gray-2 hover:text-very-light-gray'
              } flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors`}
              title='Large View'
            >
              <List size={14} />
              <span className='hidden sm:inline'>Large</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`${
                viewMode === 'grid'
                  ? 'bg-dark-gray-3 text-very-light-gray'
                  : 'text-light-gray-2 hover:text-very-light-gray'
              } flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors`}
              title='Grid View'
            >
              <LayoutGrid size={14} />
              <span className='hidden sm:inline'>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`${
                viewMode === 'table'
                  ? 'bg-dark-gray-3 text-very-light-gray'
                  : 'text-light-gray-2 hover:text-very-light-gray'
              } flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors`}
              title='Table View'
            >
              <Table2 size={14} />
              <span className='hidden sm:inline'>Table</span>
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='bg-dark-gray-4 border-border-color hover:bg-dark-gray-3 text-light-gray-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200'
          >
            <Filter size={16} />
            <span className='hidden sm:inline'>Filters</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className='bg-very-light-gray text-darkest-gray hover:bg-light-gray-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 shadow-lg shadow-very-light-gray/20'
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </motion.div>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <ExpenseFilters
              filters={filters}
              setFilters={setFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className='bg-black/60 fixed inset-0 z-40 backdrop-blur-sm'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='bg-dark-gray-4 border-border-color fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border shadow-2xl'
            >
              <AddExpenseForm
                onClose={() => setShowAddForm(false)}
                onSuccess={refreshExpenses}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Expenses View */}
      {isLoading ? (
        <div className='bg-dark-gray-4 border-border-color flex items-center justify-center rounded-xl border p-12'>
          <Loader />
        </div>
      ) : (
        <>
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'large' && (
              <ExpensesGrid
                expenses={filteredExpenses}
                onView={(id) => setViewExpenseId(id)}
                onEdit={(id) => setEditExpenseId(id)}
                onDelete={refreshExpenses}
              />
            )}
            {viewMode === 'grid' && (
              <ExpensesCompactGrid
                expenses={filteredExpenses}
                onView={(id) => setViewExpenseId(id)}
                onEdit={(id) => setEditExpenseId(id)}
                onDelete={refreshExpenses}
              />
            )}
            {viewMode === 'table' && (
              <ExpensesTable
                expenses={filteredExpenses}
                onView={(id) => setViewExpenseId(id)}
                onEdit={(id) => setEditExpenseId(id)}
                onDelete={refreshExpenses}
                currentPage={pagination.page}
                limit={pagination.limit}
              />
            )}
          </motion.div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              limit={pagination.limit}
              total={pagination.total}
            />
          )}
        </>
      )}

      {/* View Expense Modal */}
      <ViewExpenseModal
        expenseId={viewExpenseId}
        onClose={() => setViewExpenseId(null)}
        onEdit={(id) => {
          setViewExpenseId(null);
          setEditExpenseId(id);
        }}
        onDelete={refreshExpenses}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        expenseId={editExpenseId}
        onClose={() => setEditExpenseId(null)}
        onSuccess={refreshExpenses}
      />
    </div>
  );
}

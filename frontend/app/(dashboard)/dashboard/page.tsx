'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, TrendingUp, TrendingDown, Wallet, X, Filter, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useExpenseStore } from '@/store/expense-store';
import api from '@/lib/api';
import StatsCards from './_components/stats-cards';
import ExpensesList from './_components/expenses-list';
import AddExpenseForm from './_components/add-expense-form';
import ViewExpenseModal from './_components/view-expense-modal';
import EditExpenseModal from './_components/edit-expense-modal';
import ExpenseFilters from './_components/expense-filters';
import Loader from '@/components/ui/Loader';

export default function DashboardPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewExpenseId, setViewExpenseId] = useState<string | null>(null);
  const [editExpenseId, setEditExpenseId] = useState<string | null>(null);
  const { expenses, setExpenses, isLoading, setLoading } = useExpenseStore();
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
    limit: 20, // Increased to show more recent expenses
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    const fetchExpenses = async () => {
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
          if (data?.total !== undefined) {
            setPagination(prev => ({
              ...prev,
              total: data.total,
              pages: data.pages || Math.ceil(data.total / pagination.limit),
            }));
          }
        }
      } catch (err: any) {
        console.error('Failed to load expenses:', err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [filters, pagination.page, pagination.limit, setExpenses, setLoading]);

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

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
      >
        <div>
          <h1 className='text-light-gray-4 mb-2 text-3xl font-bold sm:text-4xl'>Dashboard</h1>
          <p className='text-light-gray-2'>Track and manage your expenses</p>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='bg-dark-gray-4 border-border-color hover:bg-dark-gray-3 text-light-gray-2 flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-all duration-200'
          >
            <Filter size={18} />
            <span className='hidden sm:inline'>Filters</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className='bg-very-light-gray text-darkest-gray hover:bg-light-gray-3 flex items-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-all duration-200 shadow-lg shadow-very-light-gray/20'
          >
            <Plus size={20} />
            <span>Add Expense</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards />

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
                onSuccess={() => {
                  // Refresh expenses after adding
                  const fetchExpenses = async () => {
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
                        
                        if (data?.total !== undefined) {
                          setPagination(prev => ({
                            ...prev,
                            total: data.total,
                            pages: data.pages || Math.ceil(data.total / pagination.limit),
                          }));
                        }
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
                  fetchExpenses();
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Expenses List */}
      {isLoading ? (
        <div className='bg-dark-gray-4 border-border-color flex items-center justify-center rounded-xl border p-12'>
          <Loader />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='bg-dark-gray-4 border-border-color rounded-xl border p-6 sm:p-8'
        >
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-light-gray-4 text-xl font-bold sm:text-2xl'>Recent Expenses</h2>
            <div className='flex items-center gap-4'>
              <span className='text-light-gray-2 text-sm'>{filteredExpenses.length} items</span>
              <button
                onClick={() => router.push('/expenses')}
                className='text-very-light-gray hover:text-light-gray-3 flex items-center gap-1.5 text-sm font-medium transition-colors'
              >
                View All
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <ExpensesList
            expenses={filteredExpenses}
            onView={(id) => setViewExpenseId(id)}
            onEdit={(id) => setEditExpenseId(id)}
            onDelete={() => {
              // Refresh expenses after delete
              const fetchExpenses = async () => {
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
                    
                    if (data?.total !== undefined) {
                      setPagination(prev => ({
                        ...prev,
                        total: data.total,
                        pages: data.pages || Math.ceil(data.total / pagination.limit),
                      }));
                    }
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
              fetchExpenses();
            }}
          />
        </motion.div>
      )}

      {/* View Expense Modal */}
      <ViewExpenseModal
        expenseId={viewExpenseId}
        onClose={() => setViewExpenseId(null)}
        onEdit={(id) => {
          setViewExpenseId(null);
          setEditExpenseId(id);
        }}
        onDelete={() => {
          // Refresh expenses after delete
          const fetchExpenses = async () => {
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
                
                if (data?.total !== undefined) {
                  setPagination(prev => ({
                    ...prev,
                    total: data.total,
                    pages: data.pages || Math.ceil(data.total / pagination.limit),
                  }));
                }
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
          fetchExpenses();
        }}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        expenseId={editExpenseId}
        onClose={() => setEditExpenseId(null)}
        onSuccess={() => {
          // Refresh expenses after update
          const fetchExpenses = async () => {
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
                
                if (data?.total !== undefined) {
                  setPagination(prev => ({
                    ...prev,
                    total: data.total,
                    pages: data.pages || Math.ceil(data.total / pagination.limit),
                  }));
                }
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
          fetchExpenses();
        }}
      />
    </div>
  );
}

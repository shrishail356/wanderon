'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, Wallet, Plus, Home, Menu, X, List } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import Button from '../ui/Button';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isLoading } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      router.push('/login');
    } catch (error) {
      logout();
      router.push('/login');
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-darkest-gray'>
        <div className='border-very-light-gray animate-spin rounded-full border-4 border-t-transparent h-12 w-12' />
      </div>
    );
  }

  // Only redirect if not authenticated (after loading is done)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-darkest-gray'>
      {/* Navbar */}
      <nav className='bg-dark-gray-4 border-border-color sticky top-0 z-50 border-b'>
        <div className='mx-auto max-w-7xl px-3 sm:px-4 lg:px-8'>
          <div className='flex h-14 sm:h-16 items-center justify-between gap-2'>
            <div className='flex items-center gap-2 sm:gap-4 min-w-0 flex-1'>
              <Wallet
                size={20}
                className='text-very-light-gray shrink-0 sm:w-6 sm:h-6'
              />
              <h1 className='text-light-gray-4 text-base sm:text-xl font-bold truncate'>Expense Tracker</h1>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden items-center gap-2 lg:gap-4 xl:flex'>
              <button
                onClick={() => router.push('/dashboard')}
                className={`${
                  pathname === '/dashboard'
                    ? 'bg-dark-gray-3 text-very-light-gray'
                    : 'text-light-gray-2 hover:text-very-light-gray'
                } flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm transition-colors`}
              >
                <Home size={16} className='sm:w-[18px] sm:h-[18px]' />
                <span className='hidden sm:inline'>Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/expenses')}
                className={`${
                  pathname === '/expenses'
                    ? 'bg-dark-gray-3 text-very-light-gray'
                    : 'text-light-gray-2 hover:text-very-light-gray'
                } flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm transition-colors`}
              >
                <List size={16} className='sm:w-[18px] sm:h-[18px]' />
                <span className='hidden sm:inline'>All Expenses</span>
              </button>
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('showAddExpenseForm'));
                  }, 100);
                }}
                className='bg-very-light-gray text-darkest-gray hover:bg-light-gray-3 flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold transition-colors'
              >
                <Plus size={16} className='sm:w-[18px] sm:h-[18px]' />
                <span className='hidden sm:inline'>Add Expense</span>
                <span className='sm:hidden'>Add</span>
              </button>
              <ThemeSwitcher />
              <div className='text-light-gray-2 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none'>{user?.name || user?.email}</div>
              <button
                onClick={handleLogout}
                className='text-light-gray-2 hover:text-red-400 flex items-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm transition-colors'
              >
                <LogOut size={16} className='sm:w-[18px] sm:h-[18px]' />
                <span className='hidden sm:inline'>Logout</span>
              </button>
            </div>

            {/* Tablet Navigation (simplified) */}
            <div className='hidden items-center gap-2 md:flex xl:hidden'>
              <button
                onClick={() => router.push('/expenses')}
                className='text-light-gray-2 hover:text-very-light-gray flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors'
              >
                <List size={16} />
                Expenses
              </button>
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('showAddExpenseForm'));
                  }, 100);
                }}
                className='bg-very-light-gray text-darkest-gray hover:bg-light-gray-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors'
              >
                <Plus size={16} />
                Add
              </button>
              <ThemeSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='text-very-light-gray'
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='text-very-light-gray md:hidden xl:hidden'
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-dark-gray-4 border-border-color border-t md:block xl:hidden'
          >
            <div className='space-y-1 px-4 py-4'>
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`${
                  pathname === '/dashboard'
                    ? 'bg-dark-gray-3 text-very-light-gray'
                    : 'text-light-gray-2 hover:text-very-light-gray'
                } flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors`}
              >
                <Home size={18} />
                Dashboard
              </button>
              <button
                onClick={() => {
                  router.push('/expenses');
                  setMobileMenuOpen(false);
                }}
                className={`${
                  pathname === '/expenses'
                    ? 'bg-dark-gray-3 text-very-light-gray'
                    : 'text-light-gray-2 hover:text-very-light-gray'
                } flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors`}
              >
                <List size={18} />
                All Expenses
              </button>
              <button
                onClick={() => {
                  router.push('/dashboard');
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('showAddExpenseForm'));
                  }, 100);
                }}
                className='bg-very-light-gray text-darkest-gray hover:bg-light-gray-3 flex w-full items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors'
              >
                <Plus size={18} />
                Add Expense
              </button>
              <div className='flex items-center justify-between border-border-color border-t pt-3'>
                <div className='text-light-gray-2 text-xs sm:text-sm truncate'>{user?.name || user?.email}</div>
                <ThemeSwitcher />
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className='text-light-gray-2 hover:text-red-400 flex w-full items-center gap-2 rounded-lg px-3 py-2 transition-colors'
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className='mx-auto max-w-7xl p-4 sm:p-6 lg:p-8'>{children}</main>
    </div>
  );
}


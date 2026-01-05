'use client';

import { X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FILTER_CATEGORIES, FILTER_TYPES } from '@/lib/constants';

interface Filters {
  type: 'all' | 'income' | 'expense';
  category: string;
  search: string;
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export default function ExpenseFilters({ filters, setFilters }: ExpenseFiltersProps) {
  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category !== 'all' ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      search: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className='bg-dark-gray-4 border-border-color rounded-xl border p-4 sm:p-6'
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-light-gray-4 text-lg font-semibold'>Filter Expenses</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className='text-light-gray-2 hover:text-very-light-gray flex items-center gap-1.5 text-sm transition-colors'
          >
            <X
              size={16}
              className='text-light-gray-2'
            />
            Clear all
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        {/* Search */}
        <div className='sm:col-span-2 lg:col-span-1'>
          <input
            type='text'
            placeholder='Search expenses...'
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className='input-box h-10 w-full px-3 text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
          />
        </div>

        {/* Type Filter */}
        <div>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value as any })}
          >
            <SelectTrigger className='w-full h-10 bg-dark-gray-2 border-border-color text-sm text-very-light-gray hover:bg-dark-gray-3 focus:ring-2 focus:ring-very-light-gray/20'>
              <SelectValue placeholder='All Types' />
            </SelectTrigger>
            <SelectContent className='bg-dark-gray-4 border-border-color'>
              {FILTER_TYPES.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className='text-light-gray-2 focus:text-very-light-gray focus:bg-very-light-gray/10'
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger className='w-full h-10 bg-dark-gray-2 border-border-color text-sm text-very-light-gray hover:bg-dark-gray-3 focus:ring-2 focus:ring-very-light-gray/20'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent className='bg-dark-gray-4 border-border-color'>
              {FILTER_CATEGORIES.map((category) => (
                <SelectItem
                  key={category.value}
                  value={category.value}
                  className='text-light-gray-2 focus:text-very-light-gray focus:bg-very-light-gray/10'
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <input
            type='date'
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className='input-box h-10 w-full px-3 text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
          />
        </div>

        {/* End Date */}
        <div>
          <input
            type='date'
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className='input-box h-10 w-full px-3 text-sm focus:border-very-light-gray/30 focus:ring-2 focus:ring-very-light-gray/20'
          />
        </div>
      </div>
    </motion.div>
  );
}


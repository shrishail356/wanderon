'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  total: number;
  onLimitChange?: (limit: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  total,
  onLimitChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='bg-dark-gray-4 border-border-color rounded-xl border p-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Info */}
        <div className='text-light-gray-2 text-sm'>
          Showing <span className='text-very-light-gray font-medium'>{startItem}</span> to{' '}
          <span className='text-very-light-gray font-medium'>{endItem}</span> of{' '}
          <span className='text-very-light-gray font-medium'>{total}</span> expenses
        </div>

        {/* Pagination Controls */}
        <div className='flex items-center gap-2'>
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='bg-dark-gray-2 border-border-color hover:bg-dark-gray-3 text-light-gray-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition-colors'
          >
            <ChevronLeft size={16} />
            <span className='hidden sm:inline'>Previous</span>
          </button>

          {/* Page Numbers */}
          <div className='flex items-center gap-1'>
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className='text-light-gray-2 px-2'
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isActive = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`${
                    isActive
                      ? 'bg-very-light-gray text-darkest-gray border-very-light-gray'
                      : 'bg-dark-gray-2 border-border-color text-light-gray-2 hover:bg-dark-gray-3'
                  } border rounded-lg px-3 py-2 text-sm font-medium transition-colors min-w-[40px]`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='bg-dark-gray-2 border-border-color hover:bg-dark-gray-3 text-light-gray-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition-colors'
          >
            <span className='hidden sm:inline'>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


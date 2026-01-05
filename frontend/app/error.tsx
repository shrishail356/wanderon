'use client';

import { useEffect } from 'react';
import { Undo2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-darkest-gray p-4'>
      <div className='flex max-w-md flex-col items-center text-center'>
        <h2 className='text-light-gray-3 mb-1 text-5xl font-bold'>Oops!</h2>
        <p className='text-light-gray-4 mb-4 text-xl font-semibold'>Something went wrong</p>
        <p className='text-light-gray-2 mb-8 text-sm'>{error.message || 'An unexpected error occurred'}</p>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <Button
            title='Try Again'
            onClick={reset}
            className='w-full sm:w-auto'
          />
          <Link
            href='/dashboard'
            className='bg-almost-black border-border-color hover:bg-dark-gray-4 group flex w-full items-center justify-center gap-2 rounded-3xl border px-3 py-2 transition-all duration-500 sm:w-auto'
          >
            <span className='text-light-gray-2 group-hover:text-light-gray-4 whitespace-nowrap transition-all duration-500'>
              <Undo2 size={17} />
            </span>
            <span className='text-light-gray-2 group-hover:text-light-gray-4 whitespace-nowrap transition-all duration-500'>
              Back to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}


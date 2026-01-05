import { Undo2 } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-darkest-gray p-4'>
      <div className='flex flex-col items-center text-center'>
        <h2 className='text-light-gray-3 mb-1 text-7xl font-bold'>404</h2>
        <p className='text-light-gray-4 mb-10 text-xl font-semibold'>Page Not Found</p>
        <Link
          href='/dashboard'
          className='bg-almost-black border-border-color hover:bg-dark-gray-4 group flex w-min flex-nowrap items-center gap-2 rounded-3xl border px-3 py-2 transition-all duration-500'
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
  );
}


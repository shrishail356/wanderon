import React from 'react';

export default function Loader({ size = 40 }: { size?: number }) {
  return (
    <div className='flex items-center justify-center'>
      <div
        className='border-very-light-gray animate-spin rounded-full border-4 border-t-transparent'
        style={{ width: size, height: size }}
      />
    </div>
  );
}


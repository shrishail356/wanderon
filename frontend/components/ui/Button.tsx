import { cn } from '@/lib/utils';
import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  icon?: React.ReactNode;
  title: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  position?: 'left' | 'right';
  href?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({
  icon,
  title,
  position = 'left',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const baseClasses = 'group relative flex cursor-pointer flex-nowrap items-center justify-center gap-1.5 overflow-visible rounded-[10px] border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  const paddingClasses = className.includes('h-') ? '' : 'p-[14px_18px]';

  const variantClasses = {
    primary: 'bg-almost-black hover:bg-dark-gray-4 border-dark-gray-4',
    secondary: 'bg-dark-gray-4 hover:bg-dark-gray-3 border-border-color',
    outline: 'bg-transparent hover:bg-dark-gray-4 border-border-color',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        paddingClasses,
        variantClasses[variant],
        position === 'left' ? 'flex-row' : 'flex-row-reverse',
        !/w-(\S+)/.test(className) && 'w-full',
        className
      )}
    >
      {icon && (
        <div>
          <span className='text-very-light-gray opacity-70 group-hover:opacity-100 transition-opacity'>{icon}</span>
        </div>
      )}
      <div className='relative flex h-auto w-auto flex-none shrink-0 flex-col justify-start whitespace-pre opacity-70 group-hover:opacity-100 transition-opacity'>
        <p className={cn(
          'text-very-light-gray font-IBM_Plex_Mono leading-[100%] font-medium whitespace-pre uppercase',
          className.includes('text-sm') ? 'text-sm' : 'text-[15px]'
        )}>
          {title}
        </p>
      </div>
    </button>
  );
}


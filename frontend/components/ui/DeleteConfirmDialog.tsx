'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Delete Expense',
  description = 'Are you sure you want to delete this expense? This action cannot be undone.',
  isLoading = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-dark-gray-4 border-border-color text-very-light-gray'>
        <DialogHeader>
          <DialogTitle className='text-light-gray-4'>{title}</DialogTitle>
          <DialogDescription className='text-light-gray-2'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className='bg-dark-gray-2 hover:bg-dark-gray-3 text-light-gray-2 border-border-color rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className='bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2'
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className='animate-spin' />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


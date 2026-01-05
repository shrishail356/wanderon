'use client';

import { use, notFound } from 'next/navigation';
import ExpenseDetail from './_components/expense-detail';

export default function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Log for debugging
  console.log('[ExpenseDetailPage] Route hit with id:', id);
  
  // If "new" or "edit" is passed as id, this shouldn't happen (static routes take precedence)
  // But if it does, show 404 instead of trying to load it
  if (id === 'new' || id === 'edit') {
    console.error('[ExpenseDetailPage] ERROR: Static route should have matched, but got id:', id);
    notFound();
  }
  
  return <ExpenseDetail id={id} />;
}


// Backend expects these exact category names
export const EXPENSE_CATEGORIES = [
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills & Utilities', label: 'Bills & Utilities' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Income', label: 'Income' },
  { value: 'Other', label: 'Other' },
];

export const EXPENSE_TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

// For filters (includes 'all' option)
export const FILTER_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  ...EXPENSE_CATEGORIES,
];

export const FILTER_TYPES = [
  { value: 'all', label: 'All Types' },
  ...EXPENSE_TYPES,
];

